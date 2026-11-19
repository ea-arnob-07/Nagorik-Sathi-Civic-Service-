from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, UploadFile, status
from fastapi.responses import FileResponse

from app.config import settings

router = APIRouter(prefix="/media", tags=["Media Uploads"])
UPLOAD_DIR = Path(__file__).resolve().parents[2] / "uploads"
ALLOWED_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "video/mp4": ".mp4",
    "video/webm": ".webm",
    "audio/webm": ".webm",
    "audio/mpeg": ".mp3",
    "audio/wav": ".wav",
    "audio/ogg": ".ogg",
    "audio/mp4": ".m4a"
}


def has_valid_signature(mime_type: str, content: bytes) -> bool:
    signatures = {
        "image/jpeg": content.startswith(b"\xff\xd8\xff"),
        "image/png": content.startswith(b"\x89PNG\r\n\x1a\n"),
        "image/webp": len(content) > 12 and content[:4] == b"RIFF" and content[8:12] == b"WEBP",
        "video/mp4": len(content) > 12 and content[4:8] == b"ftyp",
        "video/webm": content.startswith(b"\x1a\x45\xdf\xa3"),
        "audio/webm": content.startswith(b"\x1a\x45\xdf\xa3"),
        "audio/mpeg": content.startswith(b"ID3") or (len(content) > 1 and content[0] == 0xff and content[1] & 0xe0 == 0xe0),
        "audio/wav": len(content) > 12 and content[:4] == b"RIFF" and content[8:12] == b"WAVE",
        "audio/ogg": content.startswith(b"OggS"),
        "audio/mp4": len(content) > 12 and content[4:8] == b"ftyp"
    }
    return signatures.get(mime_type, False)


@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_media(file: UploadFile = File(...)):
    mime_type = (file.content_type or "").split(";")[0].strip().lower()
    extension = ALLOWED_TYPES.get(mime_type)
    if not extension:
        raise HTTPException(status_code=415, detail="সমর্থিত ছবি, ভিডিও বা অডিও ফাইল দিন।")

    limit_mb = (
        settings.MAX_IMAGE_SIZE_MB if mime_type.startswith("image/")
        else settings.MAX_VIDEO_SIZE_MB if mime_type.startswith("video/")
        else settings.MAX_AUDIO_SIZE_MB
    )
    content = await file.read(limit_mb * 1024 * 1024 + 1)
    if not content or len(content) > limit_mb * 1024 * 1024:
        raise HTTPException(status_code=413, detail=f"ফাইলের আকার {limit_mb} MB-এর মধ্যে হতে হবে।")
    if not has_valid_signature(mime_type, content):
        raise HTTPException(status_code=415, detail="ফাইলের প্রকৃত format অনুমোদিত MIME type-এর সঙ্গে মেলে না।")

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    file_id = f"{uuid4().hex}{extension}"
    (UPLOAD_DIR / file_id).write_bytes(content)

    return {
        "id": file_id,
        "url": f"/api/media/files/{file_id}",
        "content_type": mime_type,
        "file_size_bytes": len(content),
        "original_name": file.filename or "evidence"
    }


@router.get("/files/{file_id}")
async def get_media(file_id: str):
    if "/" in file_id or "\\" in file_id or ".." in file_id:
        raise HTTPException(status_code=404, detail="ফাইল পাওয়া যায়নি।")
    path = UPLOAD_DIR / file_id
    if not path.is_file():
        raise HTTPException(status_code=404, detail="ফাইল পাওয়া যায়নি।")
    return FileResponse(path)
