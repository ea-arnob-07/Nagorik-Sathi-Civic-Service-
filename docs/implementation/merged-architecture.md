# Nagorik Sathi — merged architecture

## Source responsibilities

- Civic Services remains the main application: citizen portal, authentication, ward/department workflow, GIS, evidence review, SLA, transparency and admin controls.
- NagarAI BD contributes its six-model complaint-text ensemble, model artifact, metrics and training code.
- The Civic media flow now accepts real uploads and stores media through the backend media API.
- An optional MobileNetV3-Small vision training and inference pipeline has been added. It is not marked ready until a labelled dataset is supplied and weights are trained.

## Key endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/ai/model-status` | Text ensemble metrics and vision-model readiness |
| POST | `/api/ai/ensemble-predict` | Six-model complaint-text advisory |
| POST | `/api/ai/vision-predict` | Image category inference when trained weights exist |
| POST | `/api/media/upload` | Upload image, video or audio evidence |
| GET | `/api/media/files/{file_id}` | Retrieve stored evidence |

## Decision safety

The text ensemble is trained from 60 demo rows and its recorded held-out Category Macro-F1 is 35.6%; Severity Macro-F1 is 64.8%. Therefore the UI exposes individual votes but requires human verification. Vision inference also returns `human_review_required: true`.

## Media storage

Local media files are written to `backend/uploads`. Docker Compose mounts this folder as `backend_uploads`. For production, replace local file storage with authenticated object storage and configure retention, rate limiting, malware scanning and access control.

<!-- Document revision audit -->
