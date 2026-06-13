import re
from flask import Blueprint, render_template, request, redirect, url_for, flash, Response

from extensions import db
from models import BlogPost, Myth, Appointment
from utils import get_settings

public_bp = Blueprint("public", __name__)


@public_bp.route("/")
def home():
    posts = BlogPost.query.order_by(BlogPost.created_at.desc()).limit(4).all()
    settings = get_settings()
    return render_template("index.html", posts=posts, settings=settings)


@public_bp.route("/hakkimda")
def hakkimda():
    return render_template("hakkimda.html")


@public_bp.route("/iletisim", methods=["GET", "POST"])
def iletisim():
    if request.method == "POST":

        # Bot koruması: Normal kullanıcı bu alanı görmez.
        # Bot doldurursa kayıt yapmadan başarılı gibi döndürürüz.
        website = request.form.get("website", "").strip()
        if website:
            flash("Randevu talebiniz başarıyla alındı.", "success")
            return redirect(url_for("public.iletisim"))

        full_name = request.form.get("full_name", "").strip()
        phone = request.form.get("phone", "").strip()
        email = request.form.get("email", "").strip()

        appointment_type = request.form.get("appointment_type", "").strip()
        preferred_day = request.form.get("preferred_day", "").strip()
        preferred_time = request.form.get("preferred_time", "").strip()
        goal = request.form.get("goal", "").strip()
        message = request.form.get("message", "").strip()

        if not full_name:
            flash("Lütfen ad soyad alanını doldurun.", "error")
            return redirect(url_for("public.iletisim") + "#randevu")

        if not phone:
            flash("Lütfen telefon numarası girin.", "error")
            return redirect(url_for("public.iletisim") + "#randevu")

        clean_phone = (
            phone.replace(" ", "")
            .replace("-", "")
            .replace("(", "")
            .replace(")", "")
            .replace("+", "")
        )

        if len(clean_phone) < 10:
            flash("Lütfen geçerli bir telefon numarası girin.", "error")
            return redirect(url_for("public.iletisim") + "#randevu")

        new_appointment = Appointment(
            full_name=full_name,
            phone=phone,
            email=email,
            appointment_type=appointment_type,
            preferred_day=preferred_day,
            preferred_time=preferred_time,
            goal=goal,
            message=message
        )

        db.session.add(new_appointment)
        db.session.commit()

        flash("Randevu talebiniz başarıyla alındı. En kısa sürede sizinle iletişime geçilecektir.", "success")
        return redirect(url_for("public.iletisim") + "#randevu")

    return render_template("iletisim.html")


@public_bp.route("/diyet-sekilleri")
def diyet_sekilleri():
    return render_template("diyet_sekilleri.html")


@public_bp.route("/menuler")
def menuler():
    return render_template("menuler.html")


@public_bp.route("/dogru-yanlis")
def dogru_yanlis():
    myths = Myth.query.order_by(Myth.created_at.desc()).all()
    return render_template("dogru_yanlis.html", myths=myths)

@public_bp.route("/blog")
def blog():
    search = request.args.get("search", "").strip()
    category = request.args.get("category", "").strip()
    page = request.args.get("page", 1, type=int)

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

    blog_posts = pagination.items

    categories = [
        c[0] for c in db.session.query(BlogPost.category)
        .distinct()
        .order_by(BlogPost.category.asc())
        .all()
    ]

    return render_template(
        "blog.html",
        blog_posts=blog_posts,
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
        {
            "endpoint": "public.home",
            "priority": "1.0",
            "changefreq": "weekly"
        },
        {
            "endpoint": "public.hakkimda",
            "priority": "0.8",
            "changefreq": "monthly"
        },
        {
            "endpoint": "public.iletisim",
            "priority": "0.8",
            "changefreq": "monthly"
        },
        {
            "endpoint": "public.diyet_sekilleri",
            "priority": "0.8",
            "changefreq": "monthly"
        },
        {
            "endpoint": "public.menuler",
            "priority": "0.8",
            "changefreq": "monthly"
        },
        {
            "endpoint": "public.dogru_yanlis",
            "priority": "0.8",
            "changefreq": "weekly"
        },
        {
            "endpoint": "public.blog",
            "priority": "0.9",
            "changefreq": "weekly"
        },
    ]

    for page in static_pages:
        pages.append({
            "loc": url_for(page["endpoint"], _external=True),
            "priority": page["priority"],
            "changefreq": page["changefreq"],
            "lastmod": ""
        })

    blog_posts = BlogPost.query.order_by(BlogPost.created_at.desc()).all()

    for post in blog_posts:
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
        sitemap_xml += f"    <loc>{page['loc']}</loc>\n"

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