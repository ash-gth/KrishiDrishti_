"""
KrishiDrishti - Pydantic Schemas (MongoDB Edition)
Handles ObjectId → string conversion for JSON responses.
"""

from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, Field, field_validator, ConfigDict


# ── ObjectId-aware base ──────────────────────────────────────────────
class MongoBase(BaseModel):
    """
    Base class that accepts MongoDB documents directly.
    Converts string id (from doc_to_dict) or ObjectId.
    """
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )


# ── Response schemas ─────────────────────────────────────────────────

class DiseaseRecordResponse(MongoBase):
    """Full detection result returned after POST /api/detect."""
    id:         str
    plant:      str
    disease:    str
    confidence: float
    solution:   str
    image_url:  str
    created_at: datetime


class DiseaseRecordSummary(MongoBase):
    """Lightweight record for GET /api/history list."""
    id:         str
    plant:      str
    disease:    str
    confidence: float
    created_at: datetime


# ── List / paginated response ────────────────────────────────────────

class HistoryResponse(MongoBase):
    total:     int   = Field(..., description="Total matching records in DB")
    page:      int   = Field(..., description="Current page (1-indexed)")
    page_size: int   = Field(..., description="Records per page")
    results:   List[DiseaseRecordSummary]


# ── Generic ──────────────────────────────────────────────────────────

class ErrorResponse(MongoBase):
    detail: str
    code:   Optional[str] = None


class HealthResponse(MongoBase):
    status:      str = "ok"
    version:     str
    environment: str
    database:    str = "mongodb"
