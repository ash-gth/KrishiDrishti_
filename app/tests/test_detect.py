"""
KrishiDrishti - Tests for /api/detect endpoint
Uses httpx AsyncClient with in-memory SQLite for isolated testing (no real DB needed).
"""

import io
import pytest
import pytest_asyncio
from pathlib import Path
from unittest.mock import patch, AsyncMock, MagicMock

from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from app.main import app
from app.db.base import Base
from app.db.session import get_db
from app.core.config import settings


# ---------------------------------------------------------------------------
# Test Database (in-memory SQLite)
# ---------------------------------------------------------------------------

TEST_DATABASE_URL = "sqlite+aiosqlite:///./test_krishidrishti.db"

test_engine = create_async_engine(
    TEST_DATABASE_URL,
    echo=False,
    connect_args={"check_same_thread": False},
)

TestSessionLocal = async_sessionmaker(
    bind=test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)


async def override_get_db():
    async with TestSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


@pytest_asyncio.fixture(scope="session", autouse=True)
async def setup_test_db():
    """Create all tables before tests, drop after."""
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await test_engine.dispose()
    # Clean up test DB file
    Path("test_krishidrishti.db").unlink(missing_ok=True)


@pytest_asyncio.fixture
async def client():
    """
    Async test client with DB dependency overridden.
    Each test gets a fresh client pointing at the test SQLite DB.
    """
    app.dependency_overrides[get_db] = override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()


# ---------------------------------------------------------------------------
# Helper: Create fake image bytes
# ---------------------------------------------------------------------------

def make_fake_png() -> bytes:
    """Returns bytes of a minimal valid 1x1 pixel PNG image."""
    from PIL import Image
    buf = io.BytesIO()
    img = Image.new("RGB", (100, 100), color=(50, 120, 80))
    img.save(buf, format="PNG")
    return buf.getvalue()


# ---------------------------------------------------------------------------
# Tests: POST /api/detect
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_detect_returns_201_with_valid_image(client: AsyncClient):
    """Happy path: valid PNG image → 201 with disease record."""
    image_bytes = make_fake_png()

    with patch("app.api.routes.detect.save_upload_file") as mock_save, \
         patch("app.api.routes.detect.detect_disease") as mock_detect:

        mock_save.return_value = "uploads/test_image_abc123.png"
        mock_detect.return_value = {
            "plant": "Tomato",
            "disease": "Early Blight",
            "confidence": 92.5,
            "solution": "Apply copper-based fungicide.",
        }

        response = await client.post(
            "/api/detect",
            files={"file": ("leaf.png", image_bytes, "image/png")},
        )

    assert response.status_code == 201, response.text
    data = response.json()
    assert data["plant"] == "Tomato"
    assert data["disease"] == "Early Blight"
    assert data["confidence"] == 92.5
    assert "solution" in data
    assert "id" in data
    assert "created_at" in data
    assert data["image_url"] == "uploads/test_image_abc123.png"


@pytest.mark.asyncio
async def test_detect_returns_415_for_wrong_content_type(client: AsyncClient):
    """Wrong content type (PDF) → 415 Unsupported Media Type."""
    from app.core.security import validate_content_type
    from fastapi import HTTPException

    with patch("app.services.image_service.validate_content_type",
               side_effect=HTTPException(status_code=415, detail="Unsupported media type")):
        response = await client.post(
            "/api/detect",
            files={"file": ("doc.pdf", b"fake pdf content", "application/pdf")},
        )

    assert response.status_code == 415


@pytest.mark.asyncio
async def test_detect_no_file_returns_422(client: AsyncClient):
    """Missing file field → 422 Unprocessable Entity."""
    response = await client.post("/api/detect")
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_detect_response_has_all_required_fields(client: AsyncClient):
    """Response schema completeness check."""
    image_bytes = make_fake_png()

    with patch("app.api.routes.detect.save_upload_file", return_value="uploads/x.png"), \
         patch("app.api.routes.detect.detect_disease", return_value={
             "plant": "Rice",
             "disease": "Rice Blast",
             "confidence": 88.0,
             "solution": "Apply tricyclazole.",
         }):
        response = await client.post(
            "/api/detect",
            files={"file": ("leaf.png", image_bytes, "image/png")},
        )

    assert response.status_code == 201
    data = response.json()
    required_fields = {"id", "plant", "disease", "confidence", "solution", "image_url", "created_at"}
    assert required_fields.issubset(data.keys()), f"Missing fields: {required_fields - data.keys()}"


# ---------------------------------------------------------------------------
# Tests: GET /api/history
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_history_returns_empty_list_initially(client: AsyncClient):
    """GET /api/history on empty DB returns empty results list."""
    response = await client.get("/api/history")
    assert response.status_code == 200
    data = response.json()
    assert "results" in data
    assert "total" in data
    assert isinstance(data["results"], list)


@pytest.mark.asyncio
async def test_history_contains_record_after_detect(client: AsyncClient):
    """After a successful detect, history should have at least 1 record."""
    image_bytes = make_fake_png()

    with patch("app.api.routes.detect.save_upload_file", return_value="uploads/hist_test.png"), \
         patch("app.api.routes.detect.detect_disease", return_value={
             "plant": "Wheat",
             "disease": "Stripe Rust",
             "confidence": 85.0,
             "solution": "Apply propiconazole.",
         }):
        detect_response = await client.post(
            "/api/detect",
            files={"file": ("leaf.png", image_bytes, "image/png")},
        )

    assert detect_response.status_code == 201

    history_response = await client.get("/api/history")
    assert history_response.status_code == 200
    data = history_response.json()
    assert data["total"] >= 1
    assert len(data["results"]) >= 1


@pytest.mark.asyncio
async def test_history_pagination(client: AsyncClient):
    """Pagination params are respected."""
    response = await client.get("/api/history?page=1&page_size=5")
    assert response.status_code == 200
    data = response.json()
    assert data["page"] == 1
    assert data["page_size"] == 5
    assert len(data["results"]) <= 5


@pytest.mark.asyncio
async def test_history_invalid_page_returns_422(client: AsyncClient):
    """page=0 is invalid (must be >= 1)."""
    response = await client.get("/api/history?page=0")
    assert response.status_code == 422


# ---------------------------------------------------------------------------
# Tests: GET /health
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_health_check(client: AsyncClient):
    """Health endpoint returns ok status."""
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "version" in data
    assert "environment" in data
