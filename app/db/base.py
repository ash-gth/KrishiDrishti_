"""
KrishiDrishti - Database Base
Declares the SQLAlchemy declarative base used by all ORM models.
Import this `Base` in every model file.
"""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """
    All ORM models should inherit from this Base.
    Alembic auto-detects models via: target_metadata = Base.metadata
    """
    pass
