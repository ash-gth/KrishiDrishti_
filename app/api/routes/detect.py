"""
KrishiDrishti - POST /api/detect
Accepts a plant leaf image, runs disease detection, persists the result to MongoDB.
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorCollection

from app.api.deps import DBCollection, AppSettings
from app.schemas.disease import DiseaseRecordResponse
from app.services.image_service import save_upload_file
from app.services.ml_service import detect_disease
from app.models.disease import new_record, doc_to_dict
from app.utils.logger import get_logger

router = APIRouter()
logger = get_logger(__name__)


@router.post(
    "/detect",
    response_model=DiseaseRecordResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Detect Plant Disease",
    description=(
        "Upload a plant leaf image (JPG/PNG, max 10 MB). "
        "Returns detected disease, confidence score, and recommended treatment."
    ),
    responses={
        400: {"description": "Invalid image or file type"},
        413: {"description": "File too large"},
        415: {"description": "Unsupported media type"},
        500: {"description": "Internal server error during detection"},
    },
)
async def detect_plant_disease(
    col: DBCollection,
    settings: AppSettings,
    file: UploadFile = File(..., description="Plant leaf image (JPG or PNG)"),
) -> DiseaseRecordResponse:
    """
    Full detection pipeline:
    1. Validate & save the uploaded image
    2. Run ML inference (mock or real)
    3. Persist the result to MongoDB
    4. Return the created record
    """
    logger.info(f"Received detection request — file: {file.filename}, type: {file.content_type}")

    # --- Step 1: Save image ---
    try:
        image_url = await save_upload_file(file)
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception(f"Unexpected error saving upload: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save the uploaded image. Please try again.",
        )

    # --- Step 2: ML Inference ---
    try:
        detection = await detect_disease(image_url)
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception(f"ML inference error: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Disease detection failed. Please try again.",
        )

    # --- Step 3: Persist to MongoDB ---
    doc = new_record(
        plant=detection["plant"],
        disease=detection["disease"],
        confidence=detection["confidence"],
        solution=detection["solution"],
        image_url=image_url,
    )

    result = await col.insert_one(doc)
    inserted = await col.find_one({"_id": result.inserted_id})

    logger.info(f"Record saved — id={result.inserted_id} plant={doc['plant']} disease={doc['disease']}")

    return DiseaseRecordResponse(**doc_to_dict(inserted))
