"""
KrishiDrishti - ML Service (Mock Implementation)
=================================================

Current state: MOCK model that returns realistic random responses.

Architecture note:
------------------
The `detect_disease` function is the ONLY public API of this module.
Swapping in a real TensorFlow / PyTorch / scikit-learn model only
requires replacing `_run_mock_model` with `_run_real_model`.
All caller code remains unchanged.

Real model integration checklist:
    [ ] Place model weights at settings.MODEL_PATH
    [ ] Implement `_load_model()` to load weights once on startup
    [ ] Implement `_run_real_model(image_path)` using the loaded model
    [ ] Update `detect_disease` to call `_run_real_model` instead
    [ ] Add GPU/device handling if needed

Expected output format of detect_disease():
    {
        "plant": "Tomato",
        "disease": "Early Blight",
        "confidence": 92.4,
        "solution": "Apply copper-based fungicide every 7–10 days..."
    }
"""

import asyncio
import random
from pathlib import Path
from typing import TypedDict

from app.core.config import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)


# ---------------------------------------------------------------------------
# Type Definitions
# ---------------------------------------------------------------------------

class DetectionResult(TypedDict):
    plant: str
    disease: str
    confidence: float
    solution: str


# ---------------------------------------------------------------------------
# Mock Disease Knowledge Base
# ---------------------------------------------------------------------------

DISEASE_KNOWLEDGE_BASE: list[dict] = [
    {
        "plant": "Tomato",
        "disease": "Early Blight",
        "solution": (
            "Apply copper-based fungicide every 7–10 days. Remove and destroy "
            "infected leaves immediately. Ensure adequate spacing between plants "
            "for air circulation. Avoid overhead watering; use drip irrigation. "
            "Rotate crops annually."
        ),
    },
    {
        "plant": "Tomato",
        "disease": "Late Blight",
        "solution": (
            "Use mancozeb or chlorothalonil fungicide at first sign of infection. "
            "Remove all infected plant material. Do not compost infected parts. "
            "Apply preventive copper-based sprays during humid conditions."
        ),
    },
    {
        "plant": "Potato",
        "disease": "Leaf Roll",
        "solution": (
            "Use certified disease-free seed potatoes. Control aphid vectors with "
            "neem oil or insecticidal soap. Remove and destroy infected plants. "
            "Avoid planting near infected fields."
        ),
    },
    {
        "plant": "Corn",
        "disease": "Northern Leaf Blight",
        "solution": (
            "Plant resistant hybrid varieties. Apply fungicide (propiconazole or "
            "azoxystrobin) at early symptom appearance. Rotate crops with non-host "
            "species. Till infected plant debris after harvest."
        ),
    },
    {
        "plant": "Rice",
        "disease": "Rice Blast",
        "solution": (
            "Apply tricyclazole or isoprothiolane fungicide. Use resistant varieties. "
            "Manage nitrogen fertilizer — avoid excess. Drain fields periodically. "
            "Remove and burn infected plant residues."
        ),
    },
    {
        "plant": "Wheat",
        "disease": "Rust (Stripe Rust)",
        "solution": (
            "Apply propiconazole or tebuconazole fungicide at flag leaf stage. "
            "Plant rust-resistant cultivars. Monitor fields regularly. Destroy "
            "volunteer wheat plants that can harbor the pathogen."
        ),
    },
    {
        "plant": "Apple",
        "disease": "Apple Scab",
        "solution": (
            "Apply captan or myclobutanil fungicide from green-tip to harvest. "
            "Rake and destroy fallen leaves. Prune for good air circulation. "
            "Use scab-resistant apple varieties for new plantings."
        ),
    },
    {
        "plant": "Grape",
        "disease": "Powdery Mildew",
        "solution": (
            "Apply sulfur-based or potassium bicarbonate fungicide preventively. "
            "Remove infected shoot tips. Improve canopy management for airflow. "
            "Avoid excess nitrogen fertilization."
        ),
    },
    {
        "plant": "Pepper",
        "disease": "Bacterial Spot",
        "solution": (
            "Use copper-based bactericide sprays. Plant disease-free transplants. "
            "Avoid working in fields when plants are wet. Remove severely infected "
            "plants. Rotate crops for at least 2 years."
        ),
    },
    {
        "plant": "Soybean",
        "disease": "Soybean Rust",
        "solution": (
            "Apply trifloxystrobin or azoxystrobin fungicide. Scout fields weekly "
            "during humid conditions. Plant early-maturing varieties. Reduce "
            "canopy density by adjusting row spacing."
        ),
    },
]

HEALTHY_RESULT: DetectionResult = {
    "plant": "Tomato",
    "disease": "Healthy",
    "confidence": 97.3,
    "solution": (
        "No disease detected. Continue regular care: water consistently, "
        "ensure adequate sunlight (6–8 hours/day), and apply balanced fertilizer "
        "every 2 weeks. Monitor for early signs of pests or discoloration."
    ),
}


# ---------------------------------------------------------------------------
# Model Lifecycle (for real model swap)
# ---------------------------------------------------------------------------

_model = None  # Will hold the loaded ML model instance


def _load_model():
    """
    Load the ML model from disk (called once on startup).
    Replace the body of this function with actual model loading code.

    Example (TensorFlow):
        import tensorflow as tf
        return tf.keras.models.load_model(settings.MODEL_PATH)

    Example (PyTorch):
        model = MyModel()
        model.load_state_dict(torch.load(settings.MODEL_PATH))
        model.eval()
        return model
    """
    model_path = Path(settings.MODEL_PATH)
    if model_path.exists():
        logger.info(f"Loading ML model from: {model_path}")
        # TODO: Replace with real model loading
        # return tf.keras.models.load_model(str(model_path))
        return None
    else:
        logger.warning(
            f"Model file not found at '{model_path}'. Running in MOCK mode."
        )
        return None


def initialize_model() -> None:
    """Call this from FastAPI `lifespan` on startup to pre-load the model."""
    global _model
    _model = _load_model()


# ---------------------------------------------------------------------------
# Mock Inference
# ---------------------------------------------------------------------------

def _run_mock_model(image_path: str) -> DetectionResult:
    """
    Simulates model inference with random realistic responses.
    Weighted: 80% disease detected, 20% healthy.
    """
    logger.debug(f"Running MOCK model on: {image_path}")

    if random.random() < 0.2:
        return HEALTHY_RESULT.copy()

    entry = random.choice(DISEASE_KNOWLEDGE_BASE)
    confidence = round(random.uniform(75.0, 99.5), 1)

    return DetectionResult(
        plant=entry["plant"],
        disease=entry["disease"],
        confidence=confidence,
        solution=entry["solution"],
    )


def _run_real_model(image_path: str) -> DetectionResult:
    """
    PLACEHOLDER — replace with actual inference logic.

    Expected workflow:
        1. Preprocess image (resize, normalize)
        2. Run forward pass through loaded model
        3. Map class index → plant/disease name
        4. Return DetectionResult dict
    """
    raise NotImplementedError(
        "Real model not implemented. "
        "Replace _run_mock_model call in detect_disease() with _run_real_model()."
    )


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

async def detect_disease(image_path: str) -> DetectionResult:
    """
    Main entry point for disease detection.

    Args:
        image_path: Relative path to the saved image file.

    Returns:
        DetectionResult with plant, disease, confidence, and solution.

    Note:
        Runs inference in a thread pool executor to avoid blocking the event loop.
        When switching to a real model, only change the inner function call.
    """
    logger.info(f"Starting disease detection for: {image_path}")

    if not Path(image_path).exists():
        logger.error(f"Image not found: {image_path}")
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Image file not found for processing.",
        )

    # Run CPU-bound inference in thread pool (keeps event loop free)
    result = await asyncio.to_thread(_run_mock_model, image_path)
    # ↑ When real model is ready:
    # result = await asyncio.to_thread(_run_real_model, image_path)

    logger.info(
        f"Detection complete: {result['plant']} / {result['disease']} "
        f"({result['confidence']}% confidence)"
    )
    return result
