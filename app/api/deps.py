"""
KrishiDrishti - API Dependencies
Centralizes shared FastAPI dependencies for reuse across routers.
"""

from typing import Annotated
from fastapi import Depends
from motor.motor_asyncio import AsyncIOMotorCollection

from app.db.session import get_db
from app.core.config import Settings, get_settings

# Typed dependency aliases — use these in route signatures for cleaner code
DBCollection = Annotated[AsyncIOMotorCollection, Depends(get_db)]
AppSettings  = Annotated[Settings, Depends(get_settings)]
