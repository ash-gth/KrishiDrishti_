"""
KrishiDrishti - Structured Logger
Provides a configured logger usable throughout the app.
Outputs JSON-friendly structured logs in production, pretty logs in development.
"""

import logging
import sys
from functools import lru_cache

from app.core.config import settings


LOG_FORMAT_DEV = (
    "%(asctime)s | %(levelname)-8s | %(name)s:%(lineno)d | %(message)s"
)

LOG_FORMAT_PROD = (
    '{"time":"%(asctime)s","level":"%(levelname)s","logger":"%(name)s",'
    '"line":%(lineno)d,"message":"%(message)s"}'
)


@lru_cache()
def get_logger(name: str = "krishidrishti") -> logging.Logger:
    """
    Returns a configured logger instance.
    Cached by name — safe to call at module level.

    Usage:
        from app.utils.logger import get_logger
        logger = get_logger(__name__)
        logger.info("Server started")
    """
    logger = logging.getLogger(name)

    if logger.handlers:
        return logger  # Already configured

    log_level = logging.DEBUG if settings.DEBUG else logging.INFO
    logger.setLevel(log_level)

    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(log_level)

    fmt = LOG_FORMAT_DEV if settings.DEBUG else LOG_FORMAT_PROD
    formatter = logging.Formatter(fmt, datefmt="%Y-%m-%dT%H:%M:%S")
    handler.setFormatter(formatter)

    logger.addHandler(handler)
    logger.propagate = False

    return logger


# Module-level default logger
logger = get_logger("krishidrishti")
