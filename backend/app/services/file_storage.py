import os
import uuid
import re
from loguru import logger

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "uploads")

def ensure_upload_dir():
    os.makedirs(UPLOAD_DIR, exist_ok=True)

def sanitize_extension(filename: str) -> str:
    """Extract and sanitize file extension to prevent path traversal."""
    if not filename:
        return ""
    raw_ext = os.path.splitext(filename)[1].lower()
    # Strip any directory traversal or non-alphanumeric characters except dot
    clean_ext = re.sub(r'[^a-z0-9.]', '', raw_ext)
    return clean_ext if clean_ext.startswith('.') else f".{clean_ext}"

def save_file(file_data_bytes: bytes, filename: str) -> str:
    """Save file bytes to disk and return a URL path."""
    ensure_upload_dir()
    clean_ext = sanitize_extension(filename)
    unique_name = f"{uuid.uuid4().hex}{clean_ext}"
    file_path = os.path.realpath(os.path.join(UPLOAD_DIR, unique_name))
    
    # Path traversal assertion: file_path must reside inside UPLOAD_DIR
    upload_real_dir = os.path.realpath(UPLOAD_DIR)
    if not file_path.startswith(upload_real_dir + os.sep) and file_path != upload_real_dir:
        raise ValueError("Invalid target path: directory traversal detected.")
    
    with open(file_path, 'wb') as f:
        f.write(file_data_bytes)
    
    logger.info(f"Saved file: {filename} -> {unique_name} ({len(file_data_bytes)} bytes)")
    return f"/uploads/{unique_name}"
