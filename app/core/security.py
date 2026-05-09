"""
KrishiDrishti - Security Module
Future-ready authentication and authorization utilities.
Currently provides file validation and sanitization helpers.
JWT support scaffolded for Phase 2 auth integration.
"""

import re
import uuid
import hashlib
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional

from fastapi import HTTPException, status


# ---------------------------------------------------------------------------
# File Security Utilities
# ---------------------------------------------------------------------------

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp"}


def sanitize_filename(filename: str) -> str:
    """
    Strips path traversal attempts and dangerous characters.
    Returns a safe filename with a UUID prefix.
    """
    # Remove path components
    filename = Path(filename).name
    # Keep only alphanumeric, dots, dashes, underscores
    safe_name = re.sub(r"[^\w\.\-]", "_", filename)
    # Generate a UUID-prefixed unique filename
    ext = Path(safe_name).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type '{ext}' is not allowed. Accepted: {', '.join(ALLOWED_EXTENSIONS)}",
        )
    unique_name = f"{uuid.uuid4().hex}{ext}"
    return unique_name


def validate_content_type(content_type: str) -> None:
    """Raises HTTPException if MIME type is not an allowed image format."""
    if content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported media type: '{content_type}'. Accepted: {', '.join(ALLOWED_MIME_TYPES)}",
        )


def validate_file_size(file_size_bytes: int, max_size_mb: int = 10) -> None:
    """Raises HTTPException if file exceeds the size limit."""
    max_bytes = max_size_mb * 1024 * 1024
    if file_size_bytes > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File too large. Maximum allowed size is {max_size_mb}MB.",
        )


def compute_file_hash(file_bytes: bytes) -> str:
    """Returns SHA-256 hex digest of file bytes (dedup / integrity check)."""
    return hashlib.sha256(file_bytes).hexdigest()


# ---------------------------------------------------------------------------
# JWT Auth Scaffold (Phase 2 - placeholder)
# ---------------------------------------------------------------------------

try:
    from jose import JWTError, jwt

    JWT_AVAILABLE = True
except ImportError:
    JWT_AVAILABLE = False

SECRET_KEY = "change-me-in-production"
ALGORITHM = "HS256"


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Generates a signed JWT token.
    Requires: pip install python-jose[cryptography]
    """
    if not JWT_AVAILABLE:
        raise RuntimeError("python-jose is not installed. Run: pip install python-jose[cryptography]")

    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str) -> dict:
    """Decodes and validates a JWT token."""
    if not JWT_AVAILABLE:
        raise RuntimeError("python-jose is not installed.")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
