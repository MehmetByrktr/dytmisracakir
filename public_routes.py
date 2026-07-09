import re
from time import time
from xml.sax.saxutils import escape

from flask import Blueprint, render_template, request, redirect, url_for, flash, Response, current_app

from extensions import db
from models import BlogPost, Myth, Appointment, DietProgram, MenuExample
from utils import get_settings, get_cached_settings, cache_get_or_set, model_to_namespace, media_url, has_media, first_media

public_bp = Blueprint("public", __name__)

_EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
_CONTACT_ATTEMPTS = {}


def _icon_version(settings):
    if settings and getattr(settings, "site_icon_updated_at", None):
        return settings.site_icon_updated_at.strftime("%Y%m%d%H%M%S")
    return "1"


def _with_version(url, version):
    separator = "&" if "?" in url else "?"
    return f"{url}{separator}v={version}"


def _favicon_value(settings):
    return first_media(
        getattr(settings, "favicon_image", None),
        getattr(settings, "site_icon", None),
        getattr(settings, "site_logo", None),
    )


def _logo_value(settings):
    return first_media(
        getattr(settings, "site_logo", None),
        getattr(settings, "site_icon", None),
    )


def _client_key():
    return request.headers.get("X-Forwarded-For", request.remote_addr or "unknown").split(",")[0].strip()


def _rate_limited():
    key = _client_key()
    now = time()
    window = current_app.config.get("CONTACT_RATE_LIMIT_SECONDS", 600)
    limit = current_app.config.get("CONTACT_RATE_LIMIT_COUNT", 5)
    attempts = [ts for ts in _CONTACT_ATTEMPTS.get(key, []) if now - ts < window]
    if len(attempts) >= limit:
        _CONTACT_ATTEMPTS[key] = attempts
        return True
    attempts.append(now)
    _CONTACT_ATTEMPTS[key] = attempts
    return False




def _program_payload(program):
    return model_to_namespace(program, bullet_list=program.bullet_list)


def _menu_payload(menu):
    return model_to_namespace(menu, meal_list=menu.meal_list)


def _all_active_programs_payload():
    programs = DietProgram.query.filter_by(is_active=True).order_by(
        DietProgram.order_no.asc(),
        DietProgram.created_at.desc()
    ).all()
    return [_program_payload(program) for program in programs]


def _home_programs_payload():
    programs = DietProgram.query.filter_by(is_active=True).order_by(
        DietProgram.order_no.asc(),
        DietProgram.created_at.desc()
    ).limit(4).all()
    return [_program_payload(program) for program in programs]


def _home_posts_payload():
    posts = BlogPost.query.order_by(BlogPost.created_at.desc()).limit(4).all()
    return [model_to_namespace(post) for post in posts]


def _menus_payload():
    menus = MenuExample.query.filter_by(is_active=True).order_by(
        MenuExample.order_no.asc(),
        MenuExample.created_at.desc()
    ).all()
    return [_menu_payload(menu) for menu in menus]


def _menu_categories_payload():
    return [
        c[0] for c in db.session.query(MenuExample.category)
        .filter(MenuExample.category.isnot(None))
        .distinct()
        .order_by(MenuExample.category.asc())
        .all()
        if c[0]
    ]


def _myths_payload():
    myths = Myth.query.order_by(Myth.created_at.desc()).all()
    return [model_to_namespace(myth) for myth in myths]


def _blog_categories_payload():
    return [
        c[0] for c in db.session.query(BlogPost.category)
        .distinct()
        .order_by(BlogPost.category.asc())
        .all()
        if c[0]
    ]

@public_bp.route("/")
def home():
    posts = cache_get_or_set("home_posts_4", _home_posts_payload)
    home_programs = cache_get_or_set("home_programs_4", _home_programs_payload)
    settings = get_cached_settings()
    return render_template("index.html", posts=posts, settings=settings, home_programs=home_programs)


@public_bp.route("/favicon.ico")
def favicon():
    settings = get_settings()
    icon_url = media_url(_favicon_value(settings))
    if not icon_url:
        return Response(status=204)
    return redirect(_with_version(icon_url, _icon_version(settings)), code=302)


@public_bp.route("/site-icon.png")
def site_icon_png():
    settings = get_settings()
    icon_url = media_url(_favicon_value(settings))
    if not icon_url:
        return Response(status=204)
    return redirect(_with_version(icon_url, _icon_version(settings)), code=302)


@public_bp.route("/site-logo.png")
def site_logo_png():
    settings = get_settings()
    logo_url = media_url(_logo_value(settings))
    if not logo_url:
        return Response(status=204)
    return redirect(_with_version(logo_url, _icon_version(settings)), code=302)


@public_bp.route("/hakkimda")
def hakkimda():
    return render_template("hakkimda.html")


@public_bp.route("/iletisim", methods=["GET", "POST"])
def iletisim():
    if request.method == "POST":
        if _rate_limited():
            flash("Çok kısa sürede fazla randevu talebi gönderildi. Lütfen biraz sonra tekrar deneyin.", "error")
            return redirect(url_for("public.iletisim") + "#randevu")

        website = request.form.get("website", "").strip()
        if website:
            flash("Randevu talebiniz başarıyla alındı.", "success")
            return redirect(url_for("public.iletisim") + "#randevu")

        full_name = request.form.get("full_name", "").strip()
        phone = request.form.get("phone", "").strip()
        email = request.form.get("email", "").strip()
        appointment_type = request.form.get("appointment_type", "").strip()
        preferred_day = request.form.get("preferred_day", "").strip()
        preferred_time = request.form.get("preferred_time", "").strip()
        goal = request.form.get("goal", "").strip()
        message = request.form.get("message", "").strip()

        if len(full_name) < 2:
            flash("Lütfen ad soyad alanını doldurun.", "error")
            return redirect(url_for("public.iletisim") + "#randevu")

        if len(full_name) > 150:
            flash("Ad soyad alanı çok uzun.", "error")
            return redirect(url_for("public.iletisim") + "#randevu")

        clean_phone = re.sub(r"\D", "", phone)
        if len(clean_phone) < 10 or len(clean_phone) > 15:
            flash("Lütfen geçerli bir telefon numarası girin.", "error")
            return redirect(url_for("public.iletisim") + "#randevu")

        if email and (len(email) > 150 or not _EMAIL_RE.match(email)):
            flash("Lütfen geçerli bir e-posta adresi girin.", "error")
            return redirect(url_for("public.iletisim") + "#randevu")

        if len(message) > 1500:
            flash("Mesaj alanı çok uzun. Lütfen daha kısa yazın.", "error")
            return redirect(url_for("public.iletisim") + "#randevu")

        new_appointment = Appointment(
            full_name=full_name[:150],
            phone=phone[:50],
            email=email[:150],
            appointment_type=appointment_type[:50],
            preferred_day=preferred_day[:50],
            preferred_time=preferred_time[:50],
            goal=goal[:100],
            message=message[:1500]
        )

        db.session.add(new_appointment)
        db.session.commit()

        flash("Randevu talebiniz başarıyla alındı. En kısa sürede sizinle iletişime geçilecektir.", "success")
        return redirect(url_for("public.iletisim") + "#randevu")

    return render_template("iletisim.html")


@public_bp.route("/diyet-sekilleri")
def diyet_sekilleri():
    programs = cache_get_or_set("active_programs_all", _all_active_programs_payload)
    return render_template("diyet_sekilleri.html", programs=programs)


@public_bp.route("/menuler")
def menuler():
    menus = cache_get_or_set("active_menus_all", _menus_payload)
    categories = cache_get_or_set("menu_categories", _menu_categories_payload)
    return render_template("menuler.html", menus=menus, categories=categories)


@public_bp.route("/dogru-yanlis")
def dogru_yanlis():
    myths = cache_get_or_set("myths_all", _myths_payload)
    return render_template("dogru_yanlis.html", myths=myths)


@public_bp.route("/blog")
def blog():
    search = request.args.get("search", "").strip()[:80]
    category = request.args.get("category", "").strip()[:100]
    page = max(1, request.args.get("page", 1, type=int))

    query = BlogPost.query

    if search:
        query = query.filter(
            BlogPost.title.ilike(f"%{search}%") |
            BlogPost.excerpt.ilike(f"%{search}%") |
            BlogPost.content.ilike(f"%{search}%")
        )

    if category:
        query = query.filter(BlogPost.category == category)

    pagination = query.order_by(BlogPost.created_at.desc()).paginate(
        page=page,
        per_page=6,
        error_out=False
    )

    categories = cache_get_or_set("blog_categories", _blog_categories_payload)

    return render_template(
        "blog.html",
        blog_posts=pagination.items,
        pagination=pagination,
        categories=categories,
        search=search,
        selected_category=category
    )


@public_bp.route("/blog/<slug>")
def blog_detail(slug):
    post = BlogPost.query.filter_by(slug=slug).first_or_404()
    clean_text = re.sub(r"<[^>]+>", "", post.content or "")
    word_count = len(clean_text.split())
    reading_time = max(1, round(word_count / 200))

    related_posts = BlogPost.query.filter(
        BlogPost.category == post.category,
        BlogPost.id != post.id
    ).order_by(BlogPost.created_at.desc()).limit(3).all()

    return render_template(
        "blog_detail.html",
        post=post,
        reading_time=reading_time,
        related_posts=related_posts
    )


@public_bp.route("/sitemap.xml")
def sitemap():
    pages = []
    static_pages = [
        ("public.home", "1.0", "weekly"),
        ("public.hakkimda", "0.8", "monthly"),
        ("public.iletisim", "0.8", "monthly"),
        ("public.diyet_sekilleri", "0.8", "monthly"),
        ("public.menuler", "0.8", "monthly"),
        ("public.dogru_yanlis", "0.8", "weekly"),
        ("public.blog", "0.9", "weekly"),
    ]

    for endpoint, priority, changefreq in static_pages:
        pages.append({
            "loc": url_for(endpoint, _external=True),
            "priority": priority,
            "changefreq": changefreq,
            "lastmod": ""
        })

    for post in BlogPost.query.order_by(BlogPost.created_at.desc()).all():
        pages.append({
            "loc": url_for("public.blog_detail", slug=post.slug, _external=True),
            "priority": "0.7",
            "changefreq": "monthly",
            "lastmod": post.created_at.strftime("%Y-%m-%d")
        })

    sitemap_xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sitemap_xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

    for page in pages:
        sitemap_xml += "  <url>\n"
        sitemap_xml += f"    <loc>{escape(page['loc'])}</loc>\n"
        if page["lastmod"]:
            sitemap_xml += f"    <lastmod>{page['lastmod']}</lastmod>\n"
        sitemap_xml += f"    <changefreq>{page['changefreq']}</changefreq>\n"
        sitemap_xml += f"    <priority>{page['priority']}</priority>\n"
        sitemap_xml += "  </url>\n"

    sitemap_xml += "</urlset>"
    return Response(sitemap_xml, mimetype="application/xml")


@public_bp.route("/robots.txt")
def robots():
    robots_txt = f"""User-agent: *
Allow: /
Disallow: /admin/
Disallow: /init-db

Sitemap: {url_for('public.sitemap', _external=True)}
"""
    return Response(robots_txt, mimetype="text/plain")
