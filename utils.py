import os
import re
import unicodedata
import uuid
from time import monotonic
from types import SimpleNamespace
from io import BytesIO

import bleach
from bleach.css_sanitizer import CSSSanitizer
from PIL import Image, UnidentifiedImageError
from werkzeug.utils import secure_filename
from flask import current_app, url_for

from extensions import db
from models import SiteSettings, BlogPost, SiteContent

try:
    import cloudinary
    import cloudinary.uploader
except Exception:  # pragma: no cover
    cloudinary = None


# =========================================================
# Sayfa metinleri (Site Ayarlari > Icerik Yonetimi)
# field type: "text" (tek satir) | "textarea" (cok satir)
# key -> (grup etiketi, alan etiketi, alan tipi, varsayilan metin)
# =========================================================
CONTENT_DEFAULTS = {
    "site_brand_name": ("Genel", "Site adi (menude ve baslikta gorunur)", "text", "Diyetisyen Misra Cakir"),
    "footer_about": ("Genel", "Footer tanitim yazisi", "textarea", "Bilimsel temelli, surdurulebilir ve kisiye ozel beslenme danismanligi."),
    "footer_copyright": ("Genel", "Footer telif satiri", "text", "\u00a9 2026 Diyetisyen Misra Cakir - Tum Haklari Saklidir."),

    "home_kicker": ("Ana Sayfa", "Hero ust etiket", "text", "Beslenme danismanligi"),
    "home_note": ("Ana Sayfa", "Hero alt not kutusu", "textarea", "Kisa sureli listeler yerine; saglik gecmisine, gunluk rutinine ve hedeflerine uyum saglayan surdurulebilir bir beslenme sistemi olusturulmaktadir."),
    "home_blog_title": ("Ana Sayfa", "Blog bolum basligi", "text", "Son paylasilan yazilar"),
    "home_faq_title": ("Ana Sayfa", "S.S.S. bolum basligi", "text", "Baslamadan once merak edilenler"),
    "home_faq_q1": ("Ana Sayfa", "S.S.S. 1 - Soru", "text", "Ilk gorusmede neler degerlendirilir?"),
    "home_faq_a1": ("Ana Sayfa", "S.S.S. 1 - Cevap", "textarea", "Hedefler, saglik gecmisi, beslenme aliskanliklari, gunluk rutin ve uygulanabilirlik birlikte degerlendirilir."),
    "home_faq_q2": ("Ana Sayfa", "S.S.S. 2 - Soru", "text", "Planlar kisiye ozel mi hazirlanir?"),
    "home_faq_a2": ("Ana Sayfa", "S.S.S. 2 - Cevap", "textarea", "Evet. Planlar kisinin hedefi, yasam duzeni, saglik durumu ve beslenme aliskanliklarina gore hazirlanir."),
    "home_faq_q3": ("Ana Sayfa", "S.S.S. 3 - Soru", "text", "Online danismanlik mumkun mu?"),
    "home_faq_a3": ("Ana Sayfa", "S.S.S. 3 - Cevap", "textarea", "Evet. Randevu formundan online gorusme talebi olusturulabilir."),
    "home_cta_title": ("Ana Sayfa", "Alt randevu cagri basligi", "textarea", "Beslenme duzenini daha sade ve surdurulebilir hale getirelim."),

    "about_kicker": ("Hakkimda", "Ust etiket", "text", "Hakkimda"),
    "about_title": ("Hakkimda", "Baslik", "text", "Misra Cakir"),
    "about_desc": ("Hakkimda", "Aciklama", "textarea", "Bilimsel yaklasim ve surdurulebilir aliskanliklar ile amacim kisa sureli beslenme uygulamalari degil, kisinin hayatina uyum saglayan bir sistem olusturmaktir."),
    "about_approach_title": ("Hakkimda", "1. Kart Basligi", "text", "Yaklasimim"),
    "about_approach_text": ("Hakkimda", "1. Kart Metni", "textarea", "Kilo yonetimi, hastaliklarda beslenme ve performans hedeflerinde kanit temelli yontemlerle ilerlemeyi onemserim. Temel hedef, danisanin gunluk yasamina uyum saglayabilen surdurulebilir aliskanliklar gelistirmesidir."),
    "about_areas_title": ("Hakkimda", "2. Kart Basligi", "text", "Hangi alanlarda?"),
    "about_areas_text": ("Hakkimda", "2. Kart Metni", "textarea", "Kilo kontrolu, kadin sagligi, sporcu beslenmesi, sindirim sistemi sikayetleri ve kronik hastaliklarda beslenme planlamasi uzerine calisilabilir."),
    "about_process_title": ("Hakkimda", "3. Kart Basligi", "text", "Calisma duzeni"),
    "about_process_text": ("Hakkimda", "3. Kart Metni", "textarea", "Ilk gorusmede hedefler, saglik gecmisi ve gunluk rutin degerlendirilir. Ardindan kisiye ozel beslenme plani olusturulur ve takip surecinde gerekli guncellemeler yapilir."),

    "diyet_kicker": ("Danismanlik Alanlari", "Ust etiket", "text", "Danismanlik Alanlari"),
    "diyet_title": ("Danismanlik Alanlari", "Baslik", "text", "Hedefine gore plan"),
    "diyet_desc": ("Danismanlik Alanlari", "Aciklama", "textarea", "Kisa sureli \u201csok\u201d listeler yerine; surdurulebilir, kanit temelli ve kisiye ozel yaklasim."),

    "myths_kicker": ("Dogru Bilinen Yanlislar", "Ust etiket", "text", "Dogru Bilinen Yanlislar"),
    "myths_title": ("Dogru Bilinen Yanlislar", "Baslik", "text", "Mitleri temizleyelim"),
    "myths_desc": ("Dogru Bilinen Yanlislar", "Aciklama", "textarea", "Beslenmede en sik duyulan yanlis bilgiler ve bilimsel aciklamalari."),

    "menu_kicker": ("Menuler", "Ust etiket", "text", "Menuler"),
    "menu_title": ("Menuler", "Baslik", "text", "Pratik ornekler"),
    "menu_desc": ("Menuler", "Aciklama", "textarea", "Buradaki menuler ornek niteligindedir. Admin panelden yeni menu ekleyebilir, mevcut menuleri duzenleyebilir veya pasiflestirebilirsin."),

    "contact_kicker": ("Iletisim", "Ust etiket", "text", "Iletisim"),
    "contact_title": ("Iletisim", "Baslik", "text", "Bana ulas"),
    "contact_desc": ("Iletisim", "Aciklama", "textarea", "Sorularin icin mesaj atabilir veya randevu formunu doldurabilirsin."),
}




def get_cached_content_map():
    """Cache all editable page texts in one DB call."""
    def _load():
        try:
            rows = SiteContent.query.all()
            data = {row.key: row.value for row in rows}
        except Exception:
            data = {}

        for key, (_, _, _, default) in CONTENT_DEFAULTS.items():
            if not data.get(key):
                data[key] = default
        return data

    return cache_get_or_set("site_content_map", _load, ttl=None)


def get_cached_content(key):
    group = get_cached_content_map()
    if key in group:
        return group[key]
    if key in CONTENT_DEFAULTS:
        return CONTENT_DEFAULTS[key][3]
    return ""

def get_content(key):
    return get_cached_content(key)

def get_all_content():
    """Return {key: value} for every known content key (DB value or default)."""
    try:
        rows = {row.key: row.value for row in SiteContent.query.all()}
    except Exception:
        rows = {}
    return {
        key: (rows.get(key) or meta[3])
        for key, meta in CONTENT_DEFAULTS.items()
    }


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
    except Exception:
        # Bozuk dosya, desteklenmeyen format veya asiri buyuk gorsel (decompression bomb)
        # dahil her turlu gecersiz gorsel burada sessizce reddedilir; admin paneli 500'e dusmez.
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
    """Gorsel yukler. Basarisiz olursa None doner, ASLA exception firlatmaz -
    bozuk bir dosya cagiran sayfayi 500'e dusuremez."""
    try:
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
    except Exception:
        current_app.logger.exception("Gorsel kaydedilirken beklenmeyen bir hata olustu.")
        return None


def save_site_icon(file):
    """Favicon/site ikonunu kare PNG olarak guvenli sekilde kaydeder.
    Basarisiz olursa None doner, ASLA exception firlatmaz."""
    try:
        if not file or file.filename == "":
            return None

        safe_original = secure_filename(file.filename)
        if not safe_original or "." not in safe_original:
            return None

        ext = os.path.splitext(safe_original)[1].lower().lstrip(".")
        if ext not in current_app.config["ALLOWED_EXTENSIONS"]:
            return None

        file.stream.seek(0)
        try:
            image = Image.open(file.stream)
            image.load()
        except Exception:
            file.stream.seek(0)
            return None

        image = image.convert("RGBA")
        width, height = image.size
        side = min(width, height)
        left = max((width - side) // 2, 0)
        top = max((height - side) // 2, 0)
        image = image.crop((left, top, left + side, top + side))
        resample = getattr(Image, "Resampling", Image).LANCZOS
        image = image.resize((512, 512), resample)

        buffer = BytesIO()
        image.save(buffer, format="PNG", optimize=True)
        buffer.seek(0)

        filename = f"site-icon-{uuid.uuid4().hex}.png"

        if _cloudinary_ready():
            cloudinary.config(
                cloud_name=current_app.config["CLOUDINARY_CLOUD_NAME"],
                api_key=current_app.config["CLOUDINARY_API_KEY"],
                api_secret=current_app.config["CLOUDINARY_API_SECRET"],
                secure=True,
            )
            result = cloudinary.uploader.upload(
                buffer,
                folder=current_app.config.get("CLOUDINARY_FOLDER", "dyt-misra-cakir"),
                public_id=filename.rsplit(".", 1)[0],
                resource_type="image",
                format="png",
                overwrite=False,
                unique_filename=False,
            )
            return result.get("secure_url")

        upload_folder = current_app.config["UPLOAD_FOLDER"]
        os.makedirs(upload_folder, exist_ok=True)
        image_path = os.path.join(upload_folder, filename)
        with open(image_path, "wb") as f:
            f.write(buffer.getvalue())
        return filename
    except Exception:
        current_app.logger.exception("Site ikonu kaydedilirken beklenmeyen bir hata olustu.")
        return None


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



# ----------------------------
# Public site cache helpers
# ----------------------------
_PUBLIC_CACHE = {}


def _cache_ttl(ttl=None):
    if ttl is not None:
        return ttl
    try:
        return int(current_app.config.get("PUBLIC_CACHE_TTL_SECONDS", 300))
    except Exception:
        return 300


def cache_get_or_set(key, factory, ttl=None):
    """Tiny per-process TTL cache for public pages.

    This avoids hitting Supabase on every public page request. Admin writes call
    clear_public_cache(), so edits become visible immediately after saving.
    """
    now = monotonic()
    ttl_seconds = _cache_ttl(ttl)
    cached = _PUBLIC_CACHE.get(key)

    if cached:
        expires_at, value = cached
        if expires_at > now:
            return value

    value = factory()
    _PUBLIC_CACHE[key] = (now + ttl_seconds, value)
    return value


def clear_public_cache():
    _PUBLIC_CACHE.clear()


def model_to_namespace(model, **extra):
    """Convert SQLAlchemy model into a detached/light object usable in Jinja."""
    data = {}
    for column in model.__table__.columns:
        data[column.name] = getattr(model, column.name)
    data.update(extra)
    return SimpleNamespace(**data)


def get_cached_settings():
    return cache_get_or_set(
        "site_settings",
        lambda: model_to_namespace(get_settings()),
        ttl=None,
    )

def get_settings():
    settings = SiteSettings.query.first()

    if not settings:
        settings = SiteSettings()
        db.session.add(settings)
        db.session.commit()

    return settings
