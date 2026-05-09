"""
KrishiDrishti - MongoDB Session (Motor)
Provides a shared async Motor client and per-request collection dependency.

NOTE: If you hit a DNS SRV resolution error with mongodb+srv://, either:
  1. Use the standard connection string from Atlas (mongodb://host1,host2,host3/...)
  2. Change your system DNS to 8.8.8.8 (Google) or 1.1.1.1 (Cloudflare)
"""

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase, AsyncIOMotorCollection
from app.core.config import settings

# ---------------------------------------------------------------------------
# Module-level client — created once, reused across all requests.
# Call connect() on startup and disconnect() on shutdown (see app/main.py).
# ---------------------------------------------------------------------------

_client: AsyncIOMotorClient | None = None
_db: AsyncIOMotorDatabase | None = None


def connect() -> None:
    """
    Opens the Motor connection. Call this inside FastAPI lifespan startup.
    Uses directConnection=False and serverSelectionTimeoutMS=5000 so startup
    doesn't block indefinitely if the cluster is unreachable.
    """
    global _client, _db
    _client = AsyncIOMotorClient(
        settings.MONGO_URL,
        serverSelectionTimeoutMS=5000,  # fail fast if cluster is unreachable
        connectTimeoutMS=5000,
        socketTimeoutMS=10000,
    )
    _db = _client[settings.MONGO_DB_NAME]


def disconnect() -> None:
    """Closes the Motor connection. Call this inside FastAPI lifespan shutdown."""
    global _client
    if _client:
        _client.close()
        _client = None


def get_database() -> AsyncIOMotorDatabase:
    """Returns the active Motor database handle."""
    if _db is None:
        raise RuntimeError("MongoDB is not connected. Call connect() first.")
    return _db


# ---------------------------------------------------------------------------
# Collection helpers — used as FastAPI dependencies or called directly.
# ---------------------------------------------------------------------------

def get_records_collection() -> AsyncIOMotorCollection:
    """Returns the 'disease_records' Motor collection."""
    return get_database()["disease_records"]


# FastAPI dependency alias (used in route signatures)
async def get_db() -> AsyncIOMotorCollection:
    """
    FastAPI dependency that returns the disease_records collection.

    Usage:
        @router.get("/")
        async def endpoint(col: AsyncIOMotorCollection = Depends(get_db)):
            ...
    """
    return get_records_collection()
