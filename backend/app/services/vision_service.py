from __future__ import annotations

import io
import json
import sys
import numpy as np
from functools import lru_cache
from pathlib import Path
from typing import Any

BACKEND_ROOT = Path(__file__).resolve().parents[2]
ML_ROOT = BACKEND_ROOT / "ml"
VISION_ROOT = ML_ROOT / "vision"
MODEL_PATH = VISION_ROOT / "vision_model.joblib"
CLASSES_PATH = VISION_ROOT / "vision_classes.json"
METRICS_PATH = VISION_ROOT / "vision_metrics.json"

if str(ML_ROOT) not in sys.path:
    sys.path.insert(0, str(ML_ROOT))

CATEGORY_DEPARTMENTS = {
    "water": ("water", "পানি সরবরাহ ও পয়ঃনিষ্কাশন কর্তৃপক্ষ (ওয়াসা উইং)"),
    "road_transport": ("road", "সড়ক পরিবহন ও অবকাঠামো প্রকৌশল বিভাগ"),
    "waste": ("waste", "বর্জ্য ব্যবস্থাপনা বিভাগ"),
    "electricity": ("street_light", "বিদ্যুৎ ও সড়কবাতি বিভাগ"),
    "healthcare": ("healthcare", "জনস্বাস্থ্য ও রোগ নিয়ন্ত্রণ বিভাগ"),
    "food": ("food", "খাদ্য নিরাপত্তা ও ভোক্তা অধিকার শাখা"),
    "drainage": ("drain", "ড্রেনেজ ও নর্দমা প্রকৌশল বিভাগ"),
}


def _read_metrics() -> dict[str, Any]:
    if not METRICS_PATH.exists():
        return {}
    return json.loads(METRICS_PATH.read_text(encoding="utf-8"))


def vision_status() -> dict[str, Any]:
    if not MODEL_PATH.exists() or not CLASSES_PATH.exists():
        return {
            "status": "not_configured",
            "message_bn": "ছবি প্রমাণ হিসেবে আপলোড করা যায়; image classifier চালাতে backend/ml/vision-এ trained artifact প্রয়োজন।",
            "classes": [],
        }
    classes = json.loads(CLASSES_PATH.read_text(encoding="utf-8"))
    metrics = _read_metrics()
    return {
        "status": "ready",
        "model": metrics.get("model", "HOG + RBF SVM"),
        "dataset_type": metrics.get("dataset_type", "synthetic_showcase"),
        "training_images": metrics.get("train_images", 0),
        "validation_accuracy": metrics.get("validation_accuracy", 0),
        "validation_macro_f1": metrics.get("validation_macro_f1", 0),
        "warning": metrics.get("warning", ""),
        "message_bn": (
            "৭টি বিভাগের জন্য ২১টি generated/augmented showcase image দিয়ে image classifier train করা হয়েছে। "
            "এটি demo-only model; বাস্তব নাগরিক ছবির নির্ভরযোগ্যতা প্রমাণিত নয়। প্রতিটি ফলাফল কর্মকর্তা যাচাই করবেন।"
        ),
        "message_en": (
            "The image classifier is trained on 21 generated/augmented showcase images across seven categories. "
            "It is demo-only and has not been validated on real citizen photos. Staff must verify every result."
        ),
        "classes": classes,
    }


@lru_cache(maxsize=1)
def load_vision_model():
    import joblib

    if not MODEL_PATH.exists() or not CLASSES_PATH.exists():
        raise FileNotFoundError("A trained showcase vision model is not configured.")
    bundle = joblib.load(MODEL_PATH)
    return bundle["model"], bundle["classes"], bundle.get("feature_version")


def predict_image(content: bytes) -> dict[str, Any]:
    from PIL import Image, UnidentifiedImageError
    from vision_features import FEATURE_VERSION, extract_image_features

    model, classes, feature_version = load_vision_model()
    if feature_version != FEATURE_VERSION:
        raise RuntimeError("The image feature version does not match the trained model.")
    with Image.open(io.BytesIO(content)) as image:
        image = image.convert("RGB")
        features = extract_image_features(image)

    label = str(model.predict([features])[0])
    decision_scores = np.asarray(model.decision_function([features])[0], dtype=np.float64)
    decision_scores -= decision_scores.max()
    score_values = np.exp(decision_scores)
    score_values /= score_values.sum()
    probabilities = {
        str(class_name): float(score_values[index])
        for index, class_name in enumerate(model.classes_)
    }
    confidence = probabilities.get(label, 0.0)
    department_code, department_name_bn = CATEGORY_DEPARTMENTS.get(
        label, ("unassigned", "ওয়ার্ড ডেস্কের মাধ্যমে বিভাগ নির্ধারণ প্রয়োজন")
    )
    return {
        "status": "ready",
        "label": label,
        "category": label,
        "department_code": department_code,
        "department_name_bn": department_name_bn,
        "confidence": confidence,
        "probabilities": probabilities,
        "human_review_required": True,
        "confidence_is_calibrated": False,
        "score_type": "softmax_normalized_margin",
        "model_type": "HOG + RBF SVM",
        "dataset_type": "synthetic_showcase",
        "disclaimer": (
            "This is a synthetic showcase classifier trained on generated and augmented samples. "
            "It is not validated for real-world citizen photos. Human verification is mandatory."
        ),
    }
