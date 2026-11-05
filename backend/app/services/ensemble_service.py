from __future__ import annotations

import json
import sys
from functools import lru_cache
from pathlib import Path
from typing import Any

BACKEND_ROOT = Path(__file__).resolve().parents[2]
ML_ROOT = BACKEND_ROOT / "ml"
ARTIFACT_PATH = ML_ROOT / "artifacts" / "nagarai_ensemble.joblib"
METRICS_PATH = ML_ROOT / "artifacts" / "metrics.json"

if str(ML_ROOT) not in sys.path:
    sys.path.insert(0, str(ML_ROOT))


@lru_cache(maxsize=1)
def load_bundle() -> dict[str, Any]:
    import joblib

    if not ARTIFACT_PATH.exists():
        raise FileNotFoundError("The Nagorik Sathi text ensemble artifact is missing.")
    return joblib.load(ARTIFACT_PATH)


def _load_metrics() -> dict[str, Any]:
    if not METRICS_PATH.exists():
        return {}
    return json.loads(METRICS_PATH.read_text(encoding="utf-8"))


def model_status() -> dict[str, Any]:
    from app.services.vision_service import vision_status

    metrics = _load_metrics()
    if not ARTIFACT_PATH.exists():
        return {
            "status": "training_required",
            "model_version": None,
            "trained_from": None,
            "training_rows": 0,
            "dataset_profile": None,
            "category_labels": [],
            "models": [],
            "validation": {},
            "vision": vision_status()
        }

    bundle = load_bundle()
    category_metrics = metrics.get("category", {})
    severity_metrics = metrics.get("severity", {})
    from nagarai_ml.ensemble import MODEL_NAMES

    category_model = bundle["category"]
    validation_f1 = category_model.validation_f1_
    weights = category_model.weights_

    models = [
        {
            "id": model_id,
            "name": model_name,
            "weight": round(float(weights.get(model_id, 0)), 4),
            "validation_macro_f1": round(float(validation_f1.get(model_id, 0)), 4)
        }
        for model_id, model_name in MODEL_NAMES.items()
    ]

    return {
        "status": "ready",
        "model_version": bundle.get("version", "1.0.0"),
        "trained_from": bundle.get("trained_from"),
        "training_rows": bundle.get("row_count", 0),
        "dataset_profile": bundle.get("dataset_profile", "unknown"),
        "category_labels": bundle.get("category_labels", []),
        "models": models,
        "validation": {
            "category_macro_f1": round(float(category_metrics.get("macro_f1", 0)), 4),
            "severity_macro_f1": round(float(severity_metrics.get("macro_f1", 0)), 4),
            "warning": metrics.get("warning", ""),
            "category_split": category_metrics.get("split", {}),
            "severity_split": severity_metrics.get("split", {})
        },
        "vision": vision_status()
    }


def predict_text(text: str) -> dict[str, Any]:
    bundle = load_bundle()
    category = bundle["category"].explain_one(text)
    severity = bundle["severity"].explain_one(text)
    metrics = _load_metrics()
    category_f1 = float(metrics.get("category", {}).get("macro_f1", 0))
    severity_f1 = float(metrics.get("severity", {}).get("macro_f1", 0))
    validation_passed = category_f1 >= 0.80 and severity_f1 >= 0.80
    review_required = bool(
        category.get("review_required")
        or severity.get("review_required")
        or not validation_passed
    )

    return {
        "category": category,
        "severity": severity,
        "review_required": review_required,
        "validation_passed": validation_passed,
        "model_version": bundle.get("version", "1.0.0"),
        "trained_from": bundle.get("trained_from"),
        "training_rows": bundle.get("row_count", 0),
        "validation": {
            "category_macro_f1": category_f1,
            "severity_macro_f1": severity_f1
        },
        "review_reason_bn": (
            "সিন্থেটিক showcase ডেটাসেটে মডেলের যাচাইকৃত স্কোর ৮০% মানদণ্ডে পৌঁছেনি। "
            "তাই ছয়টি মডেলের ফলাফল কেবল সহায়ক সুপারিশ; চূড়ান্ত সিদ্ধান্তের আগে কর্মকর্তা যাচাই করবেন।"
            if not validation_passed
            else "মডেলের confidence বা model agreement কম; মানব যাচাই প্রয়োজন।"
        ),
        "review_reason_en": (
            "The synthetic showcase dataset did not meet the 80% validation threshold. "
            "The six-model output is advisory only and must be checked by staff."
            if not validation_passed
            else "Model confidence or model agreement is low; staff verification is required."
        ),
        "disclaimer": "Synthetic showcase text model. A human reviewer owns the final action."
    }

# Refined module integration
