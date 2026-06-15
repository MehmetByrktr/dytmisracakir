import os
import re
import unicodedata
import uuid
from werkzeug.utils import secure_filename
from flask import current_app

from extensions import db
from models import SiteSettings, BlogPost


def allowed_file(filename):
    allowed = current_app.config["ALLOWED_EXTENSIONS"]
    return "." in filename and filename.rsplit(".", 1)[1].lower() in allowed


def _looks_like_allowed_image(file, extension):
    """Basic signature check for uploaded images without extra dependencies."""
    file.stream.seek(0)
    header = file.stream.read(64)
    file.stream.seek(0)

    extension = extension.lower().lstrip(".")

    if extension in {"jpg", "jpeg"}:
        return header.startswith(b"\xff\xd8\xff")

    if extension == "png":
        return header.startswith(b"\x89PNG\r\n\x1a\n")

    if extension == "webp":
        return header.startswith(b"RIFF") and b"WEBP" in header[:16]

    return False


def save_image(file):
    if not file or file.filename == "":
        return None

    if not allowed_file(file.filename):
        return None

    safe_original = secure_filename(file.filename)
    if not safe_original or "." not in safe_original:
        return None

    _, ext = os.path.splitext(safe_original)
    ext = ext.lower()

    if not _looks_like_allowed_image(file, ext):
        return None

    upload_folder = current_app.config["UPLOAD_FOLDER"]
    os.makedirs(upload_folder, exist_ok=True)

    filename = f"upload-{uuid.uuid4().hex}{ext}"
    image_path = os.path.join(upload_folder, filename)

    file.save(image_path)
    return filename


def slugify(text):
    text = text or ""
    text = unicodedata.normalize("NFKD", text)
    text = text.encode("ascii", "ignore").decode("ascii")
    text = re.sub(r"[^a-zA-Z0-9\s-]", "", text).strip().lower()
    text = re.sub(r"[-\s]+", "-", text)
    return text or "icerik"


def make_unique_slug(title, post_id=None):
    base_slug = slugify(title)
    slug = base_slug
    counter = 2

    while True:
        query = BlogPost.query.filter_by(slug=slug)

        if post_id:
            query = query.filter(BlogPost.id != post_id)

        existing_post = query.first()

        if not existing_post:
            return slug

        slug = f"{base_slug}-{counter}"
        counter += 1


def get_settings():
    settings = SiteSettings.query.first()

    if not settings:
        settings = SiteSettings()
        db.session.add(settings)
        db.session.commit()

    return settings
