from flask import Flask, render_template, session, redirect, url_for, flash
from config import Config
from extensions import db
from models import BlogPost, Myth, Appointment
from utils import get_settings, slugify
from public_routes import public_bp
from admin_routes import admin_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)

    app.register_blueprint(public_bp)
    app.register_blueprint(admin_bp)

    @app.context_processor
    def inject_site_settings():
        try:
            settings = get_settings()
        except Exception:
            settings = None

        return dict(settings=settings)

    @app.context_processor
    def inject_admin_counts():
        try:
            new_count = Appointment.query.filter_by(status="Yeni").count()
        except Exception:
            new_count = 0

        return dict(new_appointment_count=new_count)
    
    @app.errorhandler(404)
    def page_not_found(error):
        return render_template("404.html"), 404

    @app.errorhandler(413)
    def file_too_large(error):
        return render_template("413.html"), 413

    @app.errorhandler(500)
    def internal_server_error(error):
        return render_template("500.html"), 500

    @app.route("/init-db")
    def init_db():
        if not session.get("admin_logged_in"):
            flash("Bu işlem için admin girişi gerekli.", "error")
            return redirect(url_for("admin.admin_login"))
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

        get_settings()

        db.session.commit()
        return "Veritabanı oluşturuldu ve örnek veriler eklendi."

    with app.app_context():
        db.create_all()

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=app.config["DEBUG"])