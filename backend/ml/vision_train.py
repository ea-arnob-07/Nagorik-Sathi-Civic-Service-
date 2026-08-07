from __future__ import annotations

import argparse
import json
from pathlib import Path

import joblib
import numpy as np
from PIL import Image
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, f1_score
from sklearn.model_selection import StratifiedKFold, cross_val_predict
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

from vision_features import FEATURE_VERSION, extract_image_features


IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


def load_samples(dataset_dir: Path):
    features, labels, files = [], [], []
    for class_dir in sorted(path for path in dataset_dir.iterdir() if path.is_dir()):
        for image_path in sorted(class_dir.iterdir()):
            if image_path.suffix.lower() not in IMAGE_EXTENSIONS:
                continue
            with Image.open(image_path) as image:
                features.append(extract_image_features(image))
            labels.append(class_dir.name)
            files.append(str(image_path.relative_to(dataset_dir)))
    if len(set(labels)) != 7:
        raise ValueError("The showcase dataset must contain exactly seven category folders.")
    counts = {label: labels.count(label) for label in sorted(set(labels))}
    if min(counts.values()) < 3:
        raise ValueError(f"At least three images are required per category. Found: {counts}")
    return np.asarray(features, dtype=np.float32), np.asarray(labels, dtype=str), files


def build_model() -> Pipeline:
    return Pipeline([
        ("scale", StandardScaler()),
        ("classifier", SVC(
            C=4.0,
            kernel="rbf",
            gamma="scale",
            probability=True,
            class_weight="balanced",
            random_state=42,
        )),
    ])


def train_model(dataset_dir: Path, output_dir: Path) -> dict:
    features, labels, files = load_samples(dataset_dir)
    classes = sorted(set(labels))
    split_count = min(3, min(labels.tolist().count(label) for label in classes))
    splitter = StratifiedKFold(n_splits=split_count, shuffle=True, random_state=42)
    model = build_model()
    predictions = cross_val_predict(model, features, labels, cv=splitter)
    metrics = {
        "model": "HOG + RBF SVM",
        "feature_version": FEATURE_VERSION,
        "dataset_type": "synthetic_showcase",
        "classes": classes,
        "train_images": len(labels),
        "images_per_class": {label: int((labels == label).sum()) for label in classes},
        "validation_method": f"{split_count}-fold stratified cross-validation on generated and augmented samples",
        "validation_accuracy": float(accuracy_score(labels, predictions)),
        "validation_macro_f1": float(f1_score(labels, predictions, average="macro", zero_division=0)),
        "confusion_matrix": confusion_matrix(labels, predictions, labels=classes).tolist(),
        "classification_report": classification_report(
            labels, predictions, labels=classes, output_dict=True, zero_division=0
        ),
        "warning": (
            "Synthetic showcase dataset only. Several category samples are augmented views of one generated scene. "
            "Scores are not evidence of real-world accuracy; human review is mandatory."
        ),
        "sample_files": files,
    }

    model.fit(features, labels)
    output_dir.mkdir(parents=True, exist_ok=True)
    joblib.dump({
        "model": model,
        "classes": classes,
        "feature_version": FEATURE_VERSION,
        "dataset_type": "synthetic_showcase",
        "train_images": len(labels),
    }, output_dir / "vision_model.joblib")
    (output_dir / "vision_classes.json").write_text(
        json.dumps(classes, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (output_dir / "vision_metrics.json").write_text(
        json.dumps(metrics, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    return metrics


def main() -> None:
    parser = argparse.ArgumentParser(description="Train the Nagorik Sathi showcase image classifier.")
    parser.add_argument("--dataset-dir", type=Path, default=Path("vision_dataset/demo_samples"))
    parser.add_argument("--output", type=Path, default=Path("vision"))
    args = parser.parse_args()
    metrics = train_model(args.dataset_dir, args.output)
    print(json.dumps({
        "model": metrics["model"],
        "classes": metrics["classes"],
        "train_images": metrics["train_images"],
        "validation_accuracy": metrics["validation_accuracy"],
        "validation_macro_f1": metrics["validation_macro_f1"],
        "warning": metrics["warning"],
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
