"""
KrishiDrishti - GET /api/history  (MongoDB Edition)
Returns paginated list of past disease detections from the MongoDB collection.
"""

import re
from typing import Optional
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Query, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorCollection

from app.api.deps import DBCollection
from app.models.disease import doc_to_dict
from app.schemas.disease import HistoryResponse, DiseaseRecordSummary, DiseaseRecordResponse
from app.utils.logger import get_logger

router = APIRouter()
logger = get_logger(__name__)


@router.get(
    "/history",
    response_model=HistoryResponse,
    summary="Get Detection History",
    description="Returns paginated history of all plant disease detections.",
)
async def get_detection_history(
    col: DBCollection,
    page: int = Query(default=1, ge=1, description="Page number (1-indexed)"),
    page_size: int = Query(default=20, ge=1, le=100, description="Records per page"),
    plant: Optional[str] = Query(default=None, description="Filter by plant name"),
    disease: Optional[str] = Query(default=None, description="Filter by disease name"),
) -> HistoryResponse:
    """
    Returns a paginated, optionally filtered list of detection records.

    Query params:
        page      — page number (default: 1)
        page_size — records per page, max 100 (default: 20)
        plant     — optional filter by plant name (case-insensitive partial match)
        disease   — optional filter by disease name (case-insensitive partial match)
    """
    logger.info(f"History requested — page={page} page_size={page_size} plant={plant} disease={disease}")

    # Build MongoDB filter
    mongo_filter: dict = {}
    if plant:
        mongo_filter["plant"] = {"$regex": re.escape(plant), "$options": "i"}
    if disease:
        mongo_filter["disease"] = {"$regex": re.escape(disease), "$options": "i"}

    # Count total matching records
    total = await col.count_documents(mongo_filter)

    # Fetch paginated records, newest first
    offset = (page - 1) * page_size
    cursor = col.find(mongo_filter).sort("created_at", -1).skip(offset).limit(page_size)
    docs = await cursor.to_list(length=page_size)

    results = [DiseaseRecordSummary(**doc_to_dict(d)) for d in docs]

    return HistoryResponse(
        total=total,
        page=page,
        page_size=page_size,
        results=results,
    )


@router.get(
    "/history/{record_id}",
    response_model=DiseaseRecordResponse,
    summary="Get Single Detection Record",
    description="Returns a single detection record by MongoDB ObjectId.",
    responses={404: {"description": "Record not found"}},
)
async def get_detection_record(
    record_id: str,
    col: DBCollection,
) -> DiseaseRecordResponse:
    """Fetches a single detection record by its MongoDB ObjectId string."""
    try:
        oid = ObjectId(record_id)
    except InvalidId:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"'{record_id}' is not a valid record ID.",
        )

    doc = await col.find_one({"_id": oid})
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Detection record with id={record_id} not found.",
        )

    return DiseaseRecordResponse(**doc_to_dict(doc))


@router.delete(
    "/history/{record_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Detection Record",
    description="Permanently removes a detection record by MongoDB ObjectId.",
    responses={404: {"description": "Record not found"}},
)
async def delete_detection_record(
    record_id: str,
    col: DBCollection,
) -> None:
    """Deletes a detection record from MongoDB."""
    try:
        oid = ObjectId(record_id)
    except InvalidId:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"'{record_id}' is not a valid record ID.",
        )

    result = await col.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Detection record with id={record_id} not found.",
        )

    logger.info(f"Deleted record id={record_id}")
