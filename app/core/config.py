"""
KrishiDrishti - Core Configuration (MongoDB Edition)
Loads all environment variables from .env using pydantic-settings.
"""

from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import List


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "KrishiDrishti"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"

    # MongoDB
    MONGO_URL: str = "mongodb+srv://ashish:ashish@cluster0.30zpyr6.mongodb.net/?appName=Cluster0"
    MONGO_DB_NAME: str = "krishidrishti"

    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]

    # File Upload
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE_MB: int = 10
    ALLOWED_IMAGE_TYPES: List[str] = ["image/jpeg", "image/png", "image/webp"]

    # ML Model
    MODEL_PATH: str = "models/plant_disease_model.h5"
    CONFIDENCE_THRESHOLD: float = 0.5

    # Security
    SECRET_KEY: str = "change-me-in-production-use-a-random-256-bit-key"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
