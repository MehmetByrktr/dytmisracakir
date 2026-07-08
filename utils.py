import os
import re
import unicodedata
import uuid
from io import BytesIO

import bleach
from bleach.css_sanitizer import CSSSanitizer
from PIL import Image, UnidentifiedImageError
from werkzeug.utils import secure_filename
from flask import current_app, url_for

from extensions import db
from models import SiteSettings, BlogPost

try:
    import cloudinary
    import cloudinary.uploader
except Exception:  # pragma: no cover
    cloudinary = None


ALLOWED_HTML_TAGS = [
    "p", "br", "strong", "b", "em", "i", "u", "s", "span", "div",
    "h2", "h3", "h4", "ul", "ol", "li", "blockquote", "pre", "code",
    "a", "img", "table", "thead", "tbody", "tr", "th", "td", "hr"
]

ALLOWED_HTML_ATTRS = {
    "a": ["href", "title", "target", "rel"],
    "img": ["src", "alt", "title", "loading"],
    "*": ["class", "style"],
}

ALLOWED_CSS = CSSSanitizer(
    allowed_css_properties=[
        "color", "background-color", "font-size", "font-family", "font-weight",
        "font-style", "text-decoration", "text-align", "line-height"
    ]
)


def sanitize_rich_content(html):
    return bleach.clean(
        html or "",
        tags=ALLOWED_HTML_TAGS,
        attributes=ALLOWED_HTML_ATTRS,
        protocols=["http", "https", "mailto", "data"],
        css_sanitizer=ALLOWED_CSS,
        strip=True,
    )


def sanitize_basic_html(html):
    return bleach.clean(
        html or "",
        tags=["span", "br", "strong", "b", "em", "i"],
        attributes={"span": ["class"]},
        strip=True,
    )


def allowed_file(filename):
    allowed = current_app.config["ALLOWED_EXTENSIONS"]
    return "." in filename and filename.rsplit(".", 1)[1].lower() in allowed


def _verify_image(file):
    file.stream.seek(0)
    payload = file.stream.read()
    file.stream.seek(0)

    try:
        image = Image.open(BytesIO(payload))
        image.verify()
    except (UnidentifiedImageError, OSError, ValueError):
        file.stream.seek(0)
        return False

    file.stream.seek(0)
    return True


def _cloudinary_ready():
    return bool(
        cloudinary
        and current_app.config.get("CLOUDINARY_CLOUD_NAME")
        and current_app.config.get("CLOUDINARY_API_KEY")
        and current_app.config.get("CLOUDINARY_API_SECRET")
    )


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

    if not _verify_image(file):
        return None

    if _cloudinary_ready():
        cloudinary.config(
            cloud_name=current_app.config["CLOUDINARY_CLOUD_NAME"],
            api_key=current_app.config["CLOUDINARY_API_KEY"],
            api_secret=current_app.config["CLOUDINARY_API_SECRET"],
            secure=True,
        )
        result = cloudinary.uploader.upload(
            file,
            folder=current_app.config.get("CLOUDINARY_FOLDER", "dyt-misra-cakir"),
            resource_type="image",
            overwrite=False,
            unique_filename=True,
        )
        return result.get("secure_url")

    upload_folder = current_app.config["UPLOAD_FOLDER"]
    os.makedirs(upload_folder, exist_ok=True)

    filename = f"upload-{uuid.uuid4().hex}{ext}"
    image_path = os.path.join(upload_folder, filename)
    file.save(image_path)
    return filename


def media_url(value, external=False):
    if not value:
        return ""

    value = str(value).strip().replace("\\", "/")
    if value.startswith(("http://", "https://", "data:")):
        return value

    if value.startswith("/static/"):
        return value

    for prefix in ("static/images/", "images/"):
        if value.startswith(prefix):
            value = value.split("/", 1)[1]
            break

    return url_for("static", filename=f"images/{value}", _external=external)


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
