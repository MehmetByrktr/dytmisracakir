import os
import re
import unicodedata
from werkzeug.utils import secure_filename
from flask import current_app

from extensions import db
from models import SiteSettings, BlogPost


def allowed_file(filename):
    allowed = current_app.config["ALLOWED_EXTENSIONS"]
    return "." in filename and filename.rsplit(".", 1)[1].lower() in allowed


def save_image(file):
    if not file or file.filename == "":
        return None

    if not allowed_file(file.filename):
        return None

    filename = secure_filename(file.filename)

    name, ext = os.path.splitext(filename)
    counter = 2

    upload_folder = current_app.config["UPLOAD_FOLDER"]
    image_path = os.path.join(upload_folder, filename)

    while os.path.exists(image_path):
        filename = f"{name}-{counter}{ext}"
        image_path = os.path.join(upload_folder, filename)
        counter += 1

    file.save(image_path)

    return filename


def slugify(text):
    text = unicodedata.normalize("NFKD", text)
    text = text.encode("ascii", "ignore").decode("ascii")
    text = re.sub(r"[^a-zA-Z0-9\s-]", "", text).strip().lower()
    text = re.sub(r"[-\s]+", "-", text)
    return text

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