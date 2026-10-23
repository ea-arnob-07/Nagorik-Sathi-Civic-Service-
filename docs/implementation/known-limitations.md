# Nagorik Sathi — Known Limitations & External Dependencies

## 1. Image classification

- Real photo/video/audio evidence upload is implemented through `POST /api/media/upload` and stored locally under `backend/uploads` (persisted by the Docker `backend_uploads` volume).
- The project includes a MobileNetV3-Small training script, an image prediction API and an admin Model Lab status panel.
- Neither supplied source ZIP contained a labelled civic image dataset or trained vision weights. Therefore the vision model remains `not_configured` until a lawful, manually labelled train/validation dataset is supplied and training is completed.
- The image prediction endpoint returns a clear unavailable response until model files exist; it does not fabricate a classification.

## 2. Text ensemble validation

- NagarAI BD's six-model text ensemble and its trained artifact are integrated.
- The supplied artifact has 60 demo complaints, Category Macro-F1 0.3556 and Severity Macro-F1 0.6476 on its recorded held-out test split.
- The ensemble is advisory only. Human verification remains mandatory because the supplied dataset and metrics are insufficient for autonomous routing.

## 3. External services

- Production SMS/OTP, email delivery, object storage, and live 333/telecom integrations require provider credentials and deployment configuration.
- The local media endpoint stores files on the application host. Production should move media to managed object storage and configure retention, rate limiting, antivirus scanning and access controls.
- PostgreSQL/PostGIS, Redis and MinIO are supported by the Docker Compose setup; local runs must configure the matching database driver and environment variables.

<!-- Document revision audit -->
