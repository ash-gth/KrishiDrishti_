"""
KrishiDrishti - Image Service
Handles all file I/O for uploaded plant images.

Responsibilities:
  - Validate content type and file size
  - Generate UUID-based filenames
  - Save images to /uploads directory
  - Return relative URL for storage in DB
"""

import asyncio
import io
from pathlib import Path

import aiofiles
from fastapi import UploadFile, HTTPException, status
from PIL import Image

from app.core.config import settings
from app.core.security import sanitize_filename, validate_content_type, validate_file_size
from app.utils.logger import get_logger

logger = get_logger(__name__)

UPLOAD_DIR = Path(settings.UPLOAD_DIR)


async def ensure_upload_dir() -> None:
    """Creates the uploads directory if it does not exist."""
    await asyncio.to_thread(lambda: UPLOAD_DIR.mkdir(parents=True, exist_ok=True))


async def save_upload_file(file: UploadFile) -> str:
    """
    Validates, saves an uploaded image, and returns its relative URL.

    Steps:
        1. Read file bytes into memory
        2. Validate size and content-type
        3. Optionally verify it's a real image via PIL
        4. Write to uploads/ with a UUID filename
        5. Return relative path as string

    Returns:
        str: Relative path like "uploads/abc123.jpg"

    Raises:
        HTTPException 400/413/415 on validation failure
    """
    await ensure_upload_dir()

    # Read file content
    file_bytes = await file.read()

    # Validate file size
    validate_file_size(len(file_bytes), settings.MAX_FILE_SIZE_MB)

    # Validate content type header
    content_type = file.content_type or ""
    validate_content_type(content_type)

    # Verify the bytes are actually a valid image (PIL check)
    try:
        image = await asyncio.to_thread(_open_image, file_bytes)
    except Exception as exc:
        logger.warning(f"Invalid image bytes: {exc}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is not a valid image.",
        )

    # Sanitize filename and generate unique name
    original_name = file.filename or "upload.jpg"
    safe_filename = sanitize_filename(original_name)
    save_path = UPLOAD_DIR / safe_filename

    # Write to disk
    async with aiofiles.open(save_path, "wb") as f:
        await f.write(file_bytes)

    relative_url = f"{settings.UPLOAD_DIR}/{safe_filename}"
    logger.info(f"Image saved: {relative_url} ({len(file_bytes) / 1024:.1f} KB)")

    return relative_url


def _open_image(file_bytes: bytes) -> Image.Image:
    """
    Opens image using PIL (runs in thread pool to avoid blocking event loop).
    Raises if bytes are not a valid image.
    """
    img = Image.open(io.BytesIO(file_bytes))
    img.verify()  # Raises on invalid/truncated images
    return img


async def delete_upload_file(relative_url: str) -> bool:
    """
    Removes an uploaded file from disk.

    Args:
        relative_url: Path like "uploads/abc123.jpg"

    Returns:
        True if deleted, False if file not found.
    """
    path = Path(relative_url)
    if path.exists():
        await asyncio.to_thread(path.unlink)
        logger.info(f"Deleted upload: {relative_url}")
        return True
    return False
