"""
KrishiDrishti - MongoDB Client (Motor)
=======================================
Replaces SQLAlchemy / asyncpg entirely.
Motor is the official async MongoDB driver for Python.

Usage:
    from app.db.mongodb import get_db, get_collection

    # In route / service:
    db = get_db()
    records = db.disease_records

    # Or via dependency injection:
    async def my_route(db = Depends(get_database)):
        ...
"""

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo import DESCENDING, ASCENDING
from pymongo.errors import ConnectionFailure
from app.core.config import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)

# ── Singleton client (created once at startup) ──────────────────────
_client: AsyncIOMotorClient | None = None
_database: AsyncIOMotorDatabase | None = None


async def connect_to_mongo() -> None:
    """
    Opens the Motor async client and pings the cluster.
    Called from FastAPI lifespan on startup.
    """
    global _client, _database
    logger.info("Connecting to MongoDB...")
    _client = AsyncIOMotorClient(
        settings.MONGO_URL,
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=5000,
        maxPoolSize=50,
        minPoolSize=5,
    )
    _database = _client[settings.MONGO_DB_NAME]

    # Verify connection
    await _client.admin.command("ping")
    logger.info(f"Connected to MongoDB — database: '{settings.MONGO_DB_NAME}'")

    # Ensure indexes exist
    await _ensure_indexes()


async def close_mongo_connection() -> None:
    """Closes the Motor client. Called from FastAPI lifespan on shutdown."""
    global _client
    if _client:
        _client.close()
        logger.info("MongoDB connection closed.")


def get_db() -> AsyncIOMotorDatabase:
    """
    Returns the active database instance.
    Raises RuntimeError if called before connect_to_mongo().
    """
    if _database is None:
        raise RuntimeError("MongoDB is not connected. Call connect_to_mongo() first.")
    return _database


async def get_database() -> AsyncIOMotorDatabase:
    """FastAPI dependency that yields the database."""
    yield get_db()


# ── Collection helpers ──────────────────────────────────────────────

def disease_records_collection():
    """Returns the disease_records collection."""
    return get_db()["disease_records"]


async def _ensure_indexes() -> None:
    """
    Creates MongoDB indexes on first startup.
    Idempotent — safe to run on every restart.
    """
    col = disease_records_collection()
    await col.create_index([("created_at", DESCENDING)], name="idx_created_at_desc")
    await col.create_index([("plant", ASCENDING)],        name="idx_plant")
    await col.create_index([("disease", ASCENDING)],      name="idx_disease")
    logger.info("MongoDB indexes ensured on 'disease_records'.")
