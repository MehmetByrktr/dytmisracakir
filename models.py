from datetime import datetime
from extensions import db


class BlogPost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(250), unique=True, nullable=False)
    category = db.Column(db.String(100), nullable=False)
    excerpt = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=True)
    image = db.Column(db.String(200), nullable=False, default="post-1.jpg")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    seo_title = db.Column(db.String(250), nullable=True)
    seo_description = db.Column(db.String(300), nullable=True)
    seo_keywords = db.Column(db.String(300), nullable=True)

class Myth(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(250), nullable=False)
    description = db.Column(db.Text, nullable=False)
    keywords = db.Column(db.String(250), nullable=False, default="beslenme")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(150), nullable=False)
    phone = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(150), nullable=True)

    appointment_type = db.Column(db.String(50), nullable=True)
    preferred_day = db.Column(db.String(50), nullable=True)
    preferred_time = db.Column(db.String(50), nullable=True)
    goal = db.Column(db.String(100), nullable=True)

    message = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(50), nullable=False, default="Yeni")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class SiteSettings(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    hero_title = db.Column(
        db.String(250),
        nullable=False,
        default="I am <span>Mısra</span><br/>your nutritionist"
    )
    hero_description = db.Column(
        db.Text,
        nullable=False,
        default="Bilimsel, sürdürülebilir ve kişiye özel beslenme planlarıyla daha iyi hisset."
    )
    hero_image = db.Column(db.String(200), nullable=False, default="misra-hero.png")

    instagram_url = db.Column(db.String(250), nullable=True, default="https://instagram.com/dyt.misracakir")
    whatsapp_url = db.Column(db.String(250), nullable=True, default="https://wa.me/90XXXXXXXXXX")
    x_url = db.Column(db.String(250), nullable=True, default="https://x.com")
    tiktok_url = db.Column(db.String(250), nullable=True, default="https://tiktok.com/@healthwmisra")

    phone = db.Column(db.String(100), nullable=True, default="+90 XXX XXX XX XX")
    email = db.Column(db.String(150), nullable=True, default="info@misracakir.com")
    address = db.Column(db.String(250), nullable=True, default="İstanbul / Türkiye")
    working_hours = db.Column(db.String(250), nullable=True, default="Pazartesi - Cumartesi / 09:00 - 18:00")