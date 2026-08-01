# Nagorik Sathi ML assets

## Text ensemble

`data/showcase_complaints.csv` contains 839 synthetic complaint examples across seven categories and three language styles (Bangla, Banglish, English). The training code builds six text classifiers and combines their probabilities using validation-derived weights.

Train:

```bash
python -m nagarai_ml.train --data data/showcase_complaints.csv --output artifacts
```

The split groups examples by source scenario template. Reported metrics are only a measure of fit to this synthetic showcase dataset and are not real-world accuracy.

## Image classifier

`vision_train.py` trains a lightweight HOG + RBF SVM classifier from `vision_dataset/demo_samples/`. The folder contains 21 generated/augmented images, three per category. The trained artifact is stored in `vision/`.

The vision model is for demonstrating the upload-to-department-suggestion workflow only. Every image prediction is marked for human review.
