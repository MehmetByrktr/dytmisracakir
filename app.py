from flask import Flask, render_template, session, redirect, url_for, flash, request, abort, make_response
from werkzeug.middleware.proxy_fix import ProxyFix
from config import Config
from extensions import db
from models import BlogPost, Myth, Appointment, DietProgram, MenuExample, SiteSettings
from utils import get_settings, get_cached_settings, slugify, media_url, get_content
from public_routes import public_bp
from admin_routes import admin_bp
import hmac
import secrets


def ensure_schema_upgrades():
    """Small safe schema patcher for existing SQLite/PostgreSQL databases."""
    from sqlalchemy import inspect, text

    inspector = inspect(db.engine)
    table_names = inspector.get_table_names()
    dialect = db.engine.dialect.name

    def _columns(table_name):
        return {column["name"] for column in inspector.get_columns(table_name)}

    def _add_column(table_name, column_name, ddl):
        if table_name in table_names and column_name not in _columns(table_name):
            with db.engine.begin() as connection:
                connection.execute(text(f"ALTER TABLE {table_name} ADD COLUMN {ddl}"))

    def _alter_varchar(table_name, column_name, size=500):
        if dialect == "postgresql" and table_name in table_names and column_name in _columns(table_name):
            with db.engine.begin() as connection:
                connection.execute(text(f"ALTER TABLE {table_name} ALTER COLUMN {column_name} TYPE VARCHAR({size})"))

    if "blog_post" in table_names:
        _add_column("blog_post", "excerpt", "excerpt TEXT DEFAULT ''")
        _add_column("blog_post", "content", "content TEXT")
        _add_column("blog_post", "image", "image VARCHAR(500) DEFAULT 'post-1.jpg'")
        _add_column("blog_post", "seo_title", "seo_title VARCHAR(250)")
        _add_column("blog_post", "seo_description", "seo_description VARCHAR(300)")
        _add_column("blog_post", "seo_keywords", "seo_keywords VARCHAR(300)")
        _alter_varchar("blog_post", "image", 500)

        with db.engine.begin() as connection:
            connection.execute(text("UPDATE blog_post SET excerpt = COALESCE(NULLIF(excerpt, ''), title) WHERE excerpt IS NULL OR excerpt = ''"))
            connection.execute(text("UPDATE blog_post SET image = 'post-1.jpg' WHERE image IS NULL OR image = ''"))

    if "diet_program" in table_names:
        _add_column("diet_program", "image", "image VARCHAR(500) DEFAULT 'card-1.jpg'")
        _alter_varchar("diet_program", "image", 500)
        with db.engine.begin() as connection:
            connection.execute(text("UPDATE diet_program SET image = 'card-1.jpg' WHERE image IS NULL OR image = ''"))

    if "site_settings" in table_names:
        _add_column("site_settings", "site_icon", "site_icon VARCHAR(500) DEFAULT 'misra-icon.png'")
        _add_column("site_settings", "site_logo", "site_logo VARCHAR(500) DEFAULT 'misra-icon.png'")
        _add_column("site_settings", "favicon_image", "favicon_image VARCHAR(500) DEFAULT 'misra-icon.png'")
        _add_column("site_settings", "site_icon_updated_at", "site_icon_updated_at TIMESTAMP")
        _add_column("site_settings", "counseling_kicker", "counseling_kicker VARCHAR(150) DEFAULT 'Danışmanlık alanları'")
        _add_column("site_settings", "counseling_title", "counseling_title VARCHAR(350) DEFAULT 'Hedefine göre sade, uygulanabilir ve takip edilebilir bir süreç.'")
        _add_column("site_settings", "counseling_description", "counseling_description TEXT DEFAULT 'Danışmanlık kartları admin paneldeki Danışmanlık Alanları bölümünden yönetilir.'")
        _alter_varchar("site_settings", "hero_image", 500)
        _alter_varchar("site_settings", "site_icon", 500)
        _alter_varchar("site_settings", "site_logo", 500)
        _alter_varchar("site_settings", "favicon_image", 500)

        with db.engine.begin() as connection:
            connection.execute(text("UPDATE site_settings SET site_icon = 'misra-icon.png' WHERE site_icon IS NULL OR site_icon = ''"))
            connection.execute(text("UPDATE site_settings SET site_logo = COALESCE(NULLIF(site_logo, ''), site_icon, 'misra-icon.png') WHERE site_logo IS NULL OR site_logo = ''"))
            connection.execute(text("UPDATE site_settings SET favicon_image = COALESCE(NULLIF(favicon_image, ''), site_icon, 'misra-icon.png') WHERE favicon_image IS NULL OR favicon_image = ''"))
            connection.execute(text("UPDATE site_settings SET site_icon_updated_at = CURRENT_TIMESTAMP WHERE site_icon_updated_at IS NULL"))
            connection.execute(text("UPDATE site_settings SET counseling_kicker = 'Danışmanlık alanları' WHERE counseling_kicker IS NULL OR counseling_kicker = ''"))
            connection.execute(text("UPDATE site_settings SET counseling_title = 'Hedefine göre sade, uygulanabilir ve takip edilebilir bir süreç.' WHERE counseling_title IS NULL OR counseling_title = ''"))


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    if app.config.get("TRUST_PROXY_HEADERS"):
        app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_port=1)

    db.init_app(app)

    app.register_blueprint(public_bp)
    app.register_blueprint(admin_bp)

    @app.context_processor
    def inject_site_settings():
        try:
            settings = get_cached_settings()
        except Exception:
            settings = None

        return dict(settings=settings, media_url=media_url, content=get_content)

    @app.context_processor
    def inject_admin_counts():
        try:
            new_count = Appointment.query.filter_by(status="Yeni").count()
        except Exception:
            new_count = 0

        return dict(new_appointment_count=new_count)

    @app.context_processor
    def inject_csrf_token():
        def csrf_token():
            token = session.get("_csrf_token")
            if not token:
                token = secrets.token_urlsafe(32)
                session["_csrf_token"] = token
            return token

        return dict(csrf_token=csrf_token)

    @app.before_request
    def security_request_guard():
        if app.config.get("FORCE_HTTPS") and not request.is_secure and not request.path.startswith("/healthz"):
            return redirect(request.url.replace("http://", "https://", 1), code=301)

        if request.method in {"POST", "PUT", "PATCH", "DELETE"}:
            max_field_length = app.config.get("MAX_FORM_FIELD_LENGTH", 5000)
            for value in request.form.values():
                if value and len(value) > max_field_length:
                    abort(413)

    @app.before_request
    def csrf_protect():
        if request.method in {"POST", "PUT", "PATCH", "DELETE"}:
            session_token = session.get("_csrf_token")
            submitted_token = request.form.get("_csrf_token") or request.headers.get("X-CSRFToken")

            if not session_token or not submitted_token or not hmac.compare_digest(session_token, submitted_token):
                abort(400)

    @app.after_request
    def add_static_cache_headers(response):
        if request.path.startswith("/static/"):
            response.headers.setdefault("Cache-Control", "public, max-age=31536000, immutable")
        return response

    @app.after_request
    def add_security_headers(response):
        response.headers.setdefault("X-Content-Type-Options", "nosniff")
        response.headers.setdefault("X-Frame-Options", "SAMEORIGIN")
        response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
        response.headers.setdefault("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
        response.headers.setdefault("Cross-Origin-Opener-Policy", "same-origin")
        response.headers.setdefault("Cross-Origin-Resource-Policy", "same-site")

        if request.path.startswith("/admin") or request.path.startswith("/init-db"):
            response.headers["X-Robots-Tag"] = "noindex, nofollow, noarchive"
            response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
            response.headers["Pragma"] = "no-cache"
            response.headers["Expires"] = "0"

        if app.config.get("SESSION_COOKIE_SECURE"):
            response.headers.setdefault("Strict-Transport-Security", "max-age=31536000; includeSubDomains")

        response.headers.setdefault(
            "Content-Security-Policy",
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; "
            "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com; "
            "font-src 'self' https://fonts.gstatic.com data:; "
            "img-src 'self' data: https:; "
            "connect-src 'self'; "
            "frame-ancestors 'self'; "
            "base-uri 'self'; "
            "form-action 'self';"
        )

        return response

    @app.errorhandler(400)
    def bad_request(error):
        return render_template("400.html"), 400

    @app.errorhandler(404)
    def page_not_found(error):
        return render_template("404.html"), 404

    @app.errorhandler(413)
    def file_too_large(error):
        return render_template("413.html"), 413

    @app.errorhandler(500)
    def internal_server_error(error):
        return render_template("500.html"), 500

    @app.route("/healthz")
    def healthz():
        return {"ok": True}, 200

    @app.route("/init-db")
    def init_db():
        if not session.get("admin_logged_in"):
            flash("Bu işlem için admin girişi gerekli.", "error")
            return redirect(url_for("admin.admin_login", next=request.path))

        if not app.config.get("ALLOW_INIT_DB", False):
            flash("Veritabanı başlatma işlemi bu ortamda kapalı.", "error")
            return redirect(url_for("admin.admin_dashboard"))

        db.create_all()

        if BlogPost.query.count() == 0:
            sample_posts = [
                BlogPost(
                    title="Demir eksikliği: doğru bilinen yanlışlar",
                    slug=slugify("Demir eksikliği: doğru bilinen yanlışlar"),
                    category="Metabolizma",
                    excerpt="Ferritin, hemoglobin ve emilim konusundaki en sık hatalar...",
                    content="<p>Bu yazının detay içeriği burada olacak.</p>",
                    image="post-1.jpg"
                ),
                BlogPost(
                    title="Kışın bağışıklık için tabak modeli",
                    slug=slugify("Kışın bağışıklık için tabak modeli"),
                    category="Bağışıklık",
                    excerpt="Protein, posa ve mikrobesin dengesiyle pratik öneriler...",
                    content="<p>Bu yazının detay içeriği burada olacak.</p>",
                    image="post-2.jpg"
                )
            ]
            db.session.add_all(sample_posts)

        if Myth.query.count() == 0:
            sample_myths = [
                Myth(
                    title="Akşam 6’dan sonra yemek kilo aldırır.",
                    description="Asıl belirleyici toplam enerji dengesi ve gün içi dağılımdır.",
                    keywords="akşam yemek kilo saat metabolizma"
                ),
                Myth(
                    title="Detoks içecekleri yağ yakar.",
                    description="Detoks ürünleri yağ yakımı mucizesi değildir.",
                    keywords="detoks yağ içecek"
                )
            ]
            db.session.add_all(sample_myths)

        if DietProgram.query.count() == 0:
            sample_programs = [
                DietProgram(title="Kilo Kontrolü", description="Porsiyon kontrolü, protein-posa dengesi ve sürdürülebilir alışkanlık yönetimi üzerine ilerlenir.", bullets="Tabak modeli\nEsnek ara öğün planlaması\nHaftalık takip", button_text="Başla", order_no=1),
                DietProgram(title="Klinik Beslenme", description="Doktor tanısı, tetkikler ve yaşam düzeni dikkate alınarak tıbbi beslenme planı oluşturulur.", bullets="Diyabet / hipertansiyon\nGastrointestinal sorunlar\nKaraciğer / böbrek hastalıkları", button_text="Randevu al", order_no=2),
                DietProgram(title="Kadın Sağlığı", description="PCOS, PMS, gebelik, emzirme ve menopoz gibi özel dönemlerde bireysel ihtiyaçlara göre planlama yapılır.", bullets="Kan şekeri dengesi\nDemir, B12 ve D vitamini takibi\nDüzenli takip", button_text="Bilgi al", order_no=3),
                DietProgram(title="Sporcu Beslenmesi", description="Performans, toparlanma ve kas kütlesi hedeflerine göre makro besin planlaması yapılır.", bullets="Protein zamanlaması\nKarbonhidrat periodizasyonu\nHidrasyon planı", button_text="Başvur", order_no=4),
            ]
            db.session.add_all(sample_programs)

        if MenuExample.query.count() == 0:
            sample_menus = [
                MenuExample(title="1 Günlük Örnek Menü", category="Kilo kontrolü", meals="Kahvaltı: Yumurta + tam tahıllı ekmek + yeşillik\nAra Öğün: Yoğurt + meyve\nÖğle: Tavuk / kurubaklagil + salata\nAra Öğün: Kuruyemiş\nAkşam: Sebze yemeği + yoğurt", button_text="Buna benzer plan iste", order_no=1),
                MenuExample(title="Yüksek Protein Menü", category="Yüksek protein", meals="Kahvaltı: Omlet + lor peyniri + yeşillik\nÖğle: Et / tavuk / balık + salata\nAkşam: Kurubaklagil + yoğurt", button_text="Randevu al", order_no=2),
                MenuExample(title="Vejetaryen Menü", category="Vejetaryen", meals="Kahvaltı: Yulaf + süt / yoğurt + meyve\nÖğle: Nohut + bulgur + salata\nAkşam: Mercimek yemeği + zeytinyağlı sebze", button_text="Bilgi al", order_no=3),
                MenuExample(title="Düşük GI Menü", category="Düşük GI", meals="Kahvaltı: Tam tahıllı ekmek + protein kaynağı\nÖğle: Protein + posa içeriği yüksek sebze / salata\nAkşam: Sebze yemeği + yoğurt", button_text="Danış", order_no=4),
            ]
            db.session.add_all(sample_menus)

        get_settings()

        db.session.commit()
        flash("Veritabanı oluşturuldu ve örnek veriler eklendi.", "success")
        return redirect(url_for("admin.admin_dashboard"))

    with app.app_context():
        db.create_all()
        ensure_schema_upgrades()

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=app.config["DEBUG"])
