import os
import secrets
from datetime import timedelta
from dotenv import load_dotenv
from sqlalchemy.pool import NullPool

load_dotenv()


def _bool_env(name, default=False):
    value = os.getenv(name)
    if value is None:
        return default
    return value.lower() in {"1", "true", "yes", "on"}


def _build_engine_options(database_url):
    if not database_url.startswith("postgresql"):
        return {"pool_pre_ping": True}

    if os.getenv("DB_NULLPOOL", "1") != "0":
        return {
            "poolclass": NullPool,
            "pool_pre_ping": True,
            "connect_args": {
                "sslmode": os.getenv("DB_SSLMODE", "require"),
                "connect_timeout": int(os.getenv("DB_CONNECT_TIMEOUT", "10")),
                "keepalives": 1,
                "keepalives_idle": 30,
                "keepalives_interval": 10,
                "keepalives_count": 5,
            },
        }

    return {
        "pool_pre_ping": True,
        "pool_recycle": int(os.getenv("DB_POOL_RECYCLE", "120")),
        "pool_size": int(os.getenv("DB_POOL_SIZE", "2")),
        "max_overflow": int(os.getenv("DB_MAX_OVERFLOW", "2")),
        "pool_timeout": int(os.getenv("DB_POOL_TIMEOUT", "30")),
        "connect_args": {
            "sslmode": os.getenv("DB_SSLMODE", "require"),
            "connect_timeout": int(os.getenv("DB_CONNECT_TIMEOUT", "10")),
        },
    }


class Config:
    DEBUG = _bool_env("FLASK_DEBUG", False)
    APP_ENV = os.getenv("APP_ENV", "development")
    IS_PRODUCTION = (APP_ENV == "production" and not DEBUG)

    _secret = os.getenv("SECRET_KEY")
    if not _secret:
        if IS_PRODUCTION:
            raise RuntimeError("Production ortamında SECRET_KEY zorunludur. Render Environment değişkenlerine ekle.")
        _secret = "dev-secret-key"
    SECRET_KEY = _secret

    ALLOW_INIT_DB = _bool_env("ALLOW_INIT_DB", False) or APP_ENV == "development"

    database_url = os.getenv("DATABASE_URL", "sqlite:///site.db")
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)

    SQLALCHEMY_DATABASE_URI = database_url
    SQLALCHEMY_ENGINE_OPTIONS = _build_engine_options(database_url)
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    DATA_DIR = os.getenv("DATA_DIR", os.path.join(BASE_DIR, "instance"))
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", os.path.join(DATA_DIR, "uploads"))
    UPLOAD_URL_PREFIX = os.getenv("UPLOAD_URL_PREFIX", "uploads").strip("/")
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp", "ico"}
    MAX_CONTENT_LENGTH = int(os.getenv("MAX_CONTENT_LENGTH", os.getenv("MAX_UPLOAD_MB", "6")))
    if MAX_CONTENT_LENGTH < 1024:
        MAX_CONTENT_LENGTH = MAX_CONTENT_LENGTH * 1024 * 1024

    CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
    CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
    CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")
    CLOUDINARY_FOLDER = os.getenv("CLOUDINARY_FOLDER", "dyt-misra-cakir")

    PERMANENT_SESSION_LIFETIME = timedelta(hours=int(os.getenv("SESSION_LIFETIME_HOURS", "2")))
    SESSION_COOKIE_NAME = os.getenv("SESSION_COOKIE_NAME", "misra_session")
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "Lax"
    SESSION_COOKIE_SECURE = _bool_env("SESSION_COOKIE_SECURE", IS_PRODUCTION)
    FORCE_HTTPS = _bool_env("FORCE_HTTPS", IS_PRODUCTION)
    TRUST_PROXY_HEADERS = _bool_env("TRUST_PROXY_HEADERS", True)
    MAX_FORM_FIELD_LENGTH = int(os.getenv("MAX_FORM_FIELD_LENGTH", "5000"))

    ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
    ADMIN_PASSWORD_HASH = os.getenv("ADMIN_PASSWORD_HASH")
    if IS_PRODUCTION and not ADMIN_PASSWORD_HASH:
        raise RuntimeError("Production ortamında ADMIN_PASSWORD_HASH zorunludur. Render Environment değişkenlerine ekle.")
    ADMIN_LOGIN_MAX_ATTEMPTS = int(os.getenv("ADMIN_LOGIN_MAX_ATTEMPTS", "5"))
    ADMIN_LOGIN_LOCK_SECONDS = int(os.getenv("ADMIN_LOGIN_LOCK_SECONDS", "900"))

    CONTACT_RATE_LIMIT_COUNT = int(os.getenv("CONTACT_RATE_LIMIT_COUNT", "5"))
    CONTACT_RATE_LIMIT_SECONDS = int(os.getenv("CONTACT_RATE_LIMIT_SECONDS", "600"))

    # Public site cache: settings / homepage / list pages
    PUBLIC_CACHE_TTL_SECONDS = int(os.getenv("PUBLIC_CACHE_TTL_SECONDS", "300"))
    STATIC_VERSION = os.getenv("STATIC_VERSION", os.getenv("RENDER_GIT_COMMIT", "1"))
    RUN_SCHEMA_UPGRADES = _bool_env("RUN_SCHEMA_UPGRADES", False)
