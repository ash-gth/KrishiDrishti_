"""
KrishiDrishti - FastAPI Application Entry Point (MongoDB Edition)
================================================

Startup order:
    1. Load settings from .env
    2. Initialize logger
    3. Create upload directory
    4. Connect to MongoDB (Motor)
    5. Pre-load ML model (mock or real)
    6. Register API routers
    7. Configure CORS middleware
    8. Mount static /uploads directory
    9. Serve with Uvicorn
"""

import asyncio
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.utils.logger import get_logger
from app.services.ml_service import initialize_model
from app.api.routes import detect, history
from app.db.session import connect, disconnect

logger = get_logger(__name__)


# ---------------------------------------------------------------------------
# Lifespan (startup / shutdown hooks)
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Runs on startup and shutdown.
    Initializes MongoDB connection, upload directory, and ML model.
    """
    # Startup
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION} [{settings.ENVIRONMENT}]")

    # Ensure upload directory exists
    upload_path = Path(settings.UPLOAD_DIR)
    upload_path.mkdir(parents=True, exist_ok=True)
    logger.info(f"Upload directory ready: {upload_path.resolve()}")

    # Connect to MongoDB
    try:
        connect()
        logger.info(f"MongoDB client initialized -> db: {settings.MONGO_DB_NAME}")
    except Exception as exc:
        logger.warning(
            f"MongoDB connection setup failed: {exc}. "
            "Check MONGO_URL in .env and ensure DNS can resolve the cluster hostname. "
            "Tip: Change system DNS to 8.8.8.8 or use a standard mongodb:// string."
        )

    # Pre-load ML model
    await asyncio.to_thread(initialize_model)
    logger.info("ML model initialization complete")

    yield  # Application runs here

    # Shutdown
    disconnect()
    logger.info(f"{settings.APP_NAME} shutting down gracefully")


# ---------------------------------------------------------------------------
# App Instance
# ---------------------------------------------------------------------------

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "KrishiDrishti Backend API — AI-powered plant disease detection. "
        "Upload a plant leaf image to get instant disease diagnosis and treatment recommendations."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)


# ---------------------------------------------------------------------------
# CORS Middleware (CRITICAL — must be before routers)
# ---------------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["X-Total-Count"],
)


# ---------------------------------------------------------------------------
# Global Exception Handlers
# ---------------------------------------------------------------------------

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catches any unhandled exceptions and returns a clean error response."""
    logger.exception(f"Unhandled exception on {request.method} {request.url.path}: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An unexpected internal server error occurred.", "code": "INTERNAL_ERROR"},
    )


# ---------------------------------------------------------------------------
# API Routers
# ---------------------------------------------------------------------------

app.include_router(detect.router,  prefix="/api", tags=["Detection"])
app.include_router(history.router, prefix="/api", tags=["History"])


# ---------------------------------------------------------------------------
# Static File Serving (uploaded images)
# ---------------------------------------------------------------------------

upload_path = Path(settings.UPLOAD_DIR)
upload_path.mkdir(parents=True, exist_ok=True)

app.mount(
    f"/{settings.UPLOAD_DIR}",
    StaticFiles(directory=str(upload_path)),
    name="uploads",
)


# ---------------------------------------------------------------------------
# Health Check
# ---------------------------------------------------------------------------

@app.get(
    "/health",
    tags=["System"],
    summary="Health Check",
    description="Returns application health status.",
)
async def health_check():
    return {
        "status": "ok",
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "app": settings.APP_NAME,
        "database": "mongodb",
    }


@app.get("/", tags=["System"], include_in_schema=False)
async def root():
    return {
        "message": f"Welcome to {settings.APP_NAME} API",
        "docs": "/docs",
        "health": "/health",
    }


# ---------------------------------------------------------------------------
# Dev Server Entry Point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="debug" if settings.DEBUG else "info",
    )
