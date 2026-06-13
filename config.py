import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")

    DEBUG = os.getenv("FLASK_DEBUG", "False").lower() == "true"
    APP_ENV = os.getenv("APP_ENV", "development")

    database_url = os.getenv("DATABASE_URL", "sqlite:///site.db")

    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)

    SQLALCHEMY_DATABASE_URI = database_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    UPLOAD_FOLDER = "static/images"
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}
    MAX_CONTENT_LENGTH = 5 * 1024 * 1024

    PERMANENT_SESSION_LIFETIME = timedelta(hours=2)

    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "Lax"
    SESSION_COOKIE_SECURE = os.getenv("SESSION_COOKIE_SECURE", "False").lower() == "true"

    ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
    ADMIN_PASSWORD_HASH = os.getenv("ADMIN_PASSWORD_HASH")