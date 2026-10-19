import os
import io
import uuid
from typing import Tuple, Optional
from PIL import Image, ImageOps
from fastapi import HTTPException, status
from loguru import logger

# Magic byte signatures
MAGIC_JPEG = b'\xff\xd8\xff'
MAGIC_PNG = b'\x89PNG\r\n\x1a\n'
MAGIC_RIFF = b'RIFF'
MAGIC_WEBP = b'WEBP'

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

def get_uploads_dir() -> str:
    """Returns absolute path to uploads/avatars directory."""
    # base dir is backend app root or /app
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    avatars_dir = os.path.join(base_dir, "uploads", "avatars")
    os.makedirs(avatars_dir, exist_ok=True)
    return avatars_dir

def validate_magic_bytes(content: bytes) -> str:
    """
    Validates magic bytes against JPEG, PNG, WebP signatures.
    Rejects any executable, SVG, HTML, or unknown binaries.
    """
    if len(content) < 12:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File too small to be a valid image."
        )

    if content.startswith(MAGIC_JPEG):
        return "JPEG"
    elif content.startswith(MAGIC_PNG):
        return "PNG"
    elif content.startswith(MAGIC_RIFF) and content[8:12] == MAGIC_WEBP:
        return "WEBP"
    else:
        logger.warning(f"Rejected file with invalid magic bytes: {content[:16].hex()}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image format. Only JPEG, PNG, and WebP are allowed."
        )

def process_and_save_avatar(user_id: str, content: bytes) -> str:
    """
    Sanitizes, strips EXIF, square-crops, resizes to 512x512, encodes to WebP,
    and saves to disk. Returns the static public URL.
    """
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Image file exceeds maximum 5MB size limit."
        )

    # 1. Validate magic bytes
    validate_magic_bytes(content)

    # 2. Open with Pillow
    try:
        raw_img = Image.open(io.BytesIO(content))
        # Handle orientation if EXIF exists before stripping
        img = ImageOps.exif_transpose(raw_img)
    except Exception as e:
        logger.error(f"Failed to decode image with Pillow: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Corrupted or invalid image data."
        )

    # Convert to RGBA or RGB
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGBA")

    # 3. Center square crop
    w, h = img.size
    min_dim = min(w, h)
    left = (w - min_dim) // 2
    top = (h - min_dim) // 2
    cropped = img.crop((left, top, left + min_dim, top + min_dim))

    # 4. Resize to 512x512 with high-craft Lanczos filter
    resized = cropped.resize((512, 512), Image.Resampling.LANCZOS)

    # 5. Strip EXIF by saving fresh image object
    clean_img = Image.new(resized.mode, resized.size)
    clean_img.putdata(list(resized.getdata()))

    # 6. Save as WebP
    avatars_dir = get_uploads_dir()
    file_id = f"{user_id}_{uuid.uuid4().hex[:8]}.webp"
    file_path = os.path.join(avatars_dir, file_id)

    clean_img.save(file_path, format="WEBP", quality=85, method=6)
    logger.info(f"Saved sanitized avatar: {file_path}")

    # Return public URL path
    return f"/uploads/avatars/{file_id}"

def delete_avatar_file(avatar_url: Optional[str]) -> None:
    """Deletes avatar file from disk if present."""
    if not avatar_url:
        return

    try:
        filename = os.path.basename(avatar_url)
        avatars_dir = get_uploads_dir()
        file_path = os.path.join(avatars_dir, filename)
        if os.path.exists(file_path):
            os.remove(file_path)
            logger.info(f"Removed avatar file: {file_path}")
    except Exception as e:
        logger.warning(f"Error deleting avatar file: {e}")
