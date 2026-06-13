from functools import wraps

from flask import Blueprint, render_template, request, redirect, url_for, session, flash, current_app
from extensions import db
from models import BlogPost, Myth, Appointment
from utils import make_unique_slug, save_image, get_settings
from werkzeug.security import check_password_hash

admin_bp = Blueprint("admin", __name__, url_prefix="/admin")

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get("admin_logged_in"):
            return redirect(url_for("admin.admin_login"))
        return f(*args, **kwargs)
    return decorated_function

@admin_bp.route("/login", methods=["GET", "POST"])
def admin_login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        if (
            username == current_app.config["ADMIN_USERNAME"]
            and check_password_hash(current_app.config["ADMIN_PASSWORD_HASH"], password)
        ):
            session.permanent = True
            session["admin_logged_in"] = True

            flash("Giriş başarılı.", "success")
            return redirect(url_for("admin.admin_dashboard"))

        flash("Kullanıcı adı veya şifre hatalı.", "error")

    return render_template("admin/login.html")


@admin_bp.route("/logout")
def admin_logout():
    session.pop("admin_logged_in", None)
    flash("Çıkış yapıldı.", "success")
    return redirect(url_for("admin.admin_login"))


@admin_bp.route("/")
@login_required
def admin_dashboard():
    blog_count = BlogPost.query.count()
    myth_count = Myth.query.count()

    appointment_count = Appointment.query.count()
    new_appointments = Appointment.query.filter_by(status="Yeni").count()
    approved_appointments = Appointment.query.filter_by(status="Onaylandı").count()
    cancelled_appointments = Appointment.query.filter_by(status="İptal").count()

    recent_appointments = Appointment.query.order_by(
        Appointment.created_at.desc()
    ).limit(5).all()

    recent_posts = BlogPost.query.order_by(
        BlogPost.created_at.desc()
    ).limit(5).all()

    return render_template(
        "admin/dashboard.html",
        blog_count=blog_count,
        myth_count=myth_count,
        appointment_count=appointment_count,
        new_appointments=new_appointments,
        approved_appointments=approved_appointments,
        cancelled_appointments=cancelled_appointments,
        recent_appointments=recent_appointments,
        recent_posts=recent_posts
    )


# BLOG
@admin_bp.route("/blog")
@login_required
def admin_blog():
    search = request.args.get("search", "").strip()
    category = request.args.get("category", "").strip()

    query = BlogPost.query

    if search:
        query = query.filter(
            BlogPost.title.ilike(f"%{search}%") |
            BlogPost.excerpt.ilike(f"%{search}%") |
            BlogPost.content.ilike(f"%{search}%")
        )

    if category:
        query = query.filter(BlogPost.category == category)

    posts = query.order_by(BlogPost.created_at.desc()).all()

    categories = [
        c[0] for c in db.session.query(BlogPost.category)
        .distinct()
        .order_by(BlogPost.category.asc())
        .all()
    ]

    return render_template(
        "admin/blog_list.html",
        posts=posts,
        categories=categories,
        search=search,
        selected_category=category
    )


@admin_bp.route("/blog/add", methods=["GET", "POST"])
@login_required
def admin_blog_add():
    if request.method == "POST":
        title = request.form.get("title", "").strip()
        category = request.form.get("category", "").strip()
        excerpt = request.form.get("excerpt", "").strip()
        content = request.form.get("content", "")

        seo_title = request.form.get("seo_title", "").strip()
        seo_description = request.form.get("seo_description", "").strip()
        seo_keywords = request.form.get("seo_keywords", "").strip()

        image_file = request.files.get("image_file")
        image = save_image(image_file) or "post-1.jpg"

        new_post = BlogPost(
            title=title,
            slug=make_unique_slug(title),
            category=category,
            excerpt=excerpt,
            content=content,
            image=image,
            seo_title=seo_title,
            seo_description=seo_description,
            seo_keywords=seo_keywords
        )

        db.session.add(new_post)
        db.session.commit()

        flash("Blog yazısı eklendi.", "success")
        return redirect(url_for("admin.admin_blog"))

    return render_template("admin/blog_add.html")


@admin_bp.route("/blog/edit/<int:post_id>", methods=["GET", "POST"])
@login_required
def admin_blog_edit(post_id):
    post = BlogPost.query.get_or_404(post_id)

    if request.method == "POST":
        title = request.form.get("title", "").strip()

        post.title = title
        post.slug = make_unique_slug(title, post.id)
        post.category = request.form.get("category", "").strip()
        post.excerpt = request.form.get("excerpt", "").strip()
        post.content = request.form.get("content", "")

        post.seo_title = request.form.get("seo_title", "").strip()
        post.seo_description = request.form.get("seo_description", "").strip()
        post.seo_keywords = request.form.get("seo_keywords", "").strip()

        image_file = request.files.get("image_file")
        uploaded_image = save_image(image_file)

        if uploaded_image:
            post.image = uploaded_image

        db.session.commit()

        flash("Blog yazısı güncellendi.", "success")
        return redirect(url_for("admin.admin_blog"))

    return render_template("admin/blog_edit.html", post=post)


@admin_bp.route("/blog/delete/<int:post_id>")
@login_required
def admin_blog_delete(post_id):
    post = BlogPost.query.get_or_404(post_id)

    db.session.delete(post)
    db.session.commit()

    flash("Blog yazısı silindi.", "success")
    return redirect(url_for("admin.admin_blog"))


# MYTHS
@admin_bp.route("/myths")
@login_required
def admin_myths():
    search = request.args.get("search", "").strip()

    query = Myth.query

    if search:
        query = query.filter(
            Myth.title.ilike(f"%{search}%") |
            Myth.description.ilike(f"%{search}%") |
            Myth.keywords.ilike(f"%{search}%")
        )

    myths = query.order_by(Myth.created_at.desc()).all()

    return render_template(
        "admin/myth_list.html",
        myths=myths,
        search=search
    )


@admin_bp.route("/myths/add", methods=["GET", "POST"])
@login_required
def admin_myth_add():
    if request.method == "POST":
        new_myth = Myth(
            title=request.form.get("title", "").strip(),
            description=request.form.get("description", "").strip(),
            keywords=request.form.get("keywords", "").strip()
        )

        db.session.add(new_myth)
        db.session.commit()

        flash("Mit eklendi.", "success")
        return redirect(url_for("admin.admin_myths"))

    return render_template("admin/myth_add.html")


@admin_bp.route("/myths/edit/<int:myth_id>", methods=["GET", "POST"])
@login_required
def admin_myth_edit(myth_id):
    myth = Myth.query.get_or_404(myth_id)

    if request.method == "POST":
        myth.title = request.form.get("title", "").strip()
        myth.description = request.form.get("description", "").strip()
        myth.keywords = request.form.get("keywords", "").strip()

        db.session.commit()

        flash("Mit güncellendi.", "success")
        return redirect(url_for("admin.admin_myths"))

    return render_template("admin/myth_edit.html", myth=myth)


@admin_bp.route("/myths/delete/<int:myth_id>")
@login_required
def admin_myth_delete(myth_id):
    myth = Myth.query.get_or_404(myth_id)

    db.session.delete(myth)
    db.session.commit()

    flash("Mit silindi.", "success")
    return redirect(url_for("admin.admin_myths"))


# APPOINTMENTS
@admin_bp.route("/appointments")
@login_required
def admin_appointments():
    search = request.args.get("search", "").strip()
    status = request.args.get("status", "").strip()

    query = Appointment.query

    if search:
        query = query.filter(
            Appointment.full_name.ilike(f"%{search}%") |
            Appointment.phone.ilike(f"%{search}%") |
            Appointment.email.ilike(f"%{search}%") |
            Appointment.goal.ilike(f"%{search}%") |
            Appointment.message.ilike(f"%{search}%")
        )

    if status:
        query = query.filter(Appointment.status == status)

    appointments = query.order_by(Appointment.created_at.desc()).all()

    statuses = ["Yeni", "Görüşüldü", "Onaylandı", "İptal"]

    return render_template(
        "admin/appointments.html",
        appointments=appointments,
        statuses=statuses,
        search=search,
        selected_status=status
    )


@admin_bp.route("/appointments/status/<int:appointment_id>", methods=["POST"])
@login_required
def admin_appointment_status(appointment_id):
    appointment = Appointment.query.get_or_404(appointment_id)

    new_status = request.form.get("status")
    allowed_statuses = ["Yeni", "Görüşüldü", "Onaylandı", "İptal"]

    if new_status in allowed_statuses:
        appointment.status = new_status
        db.session.commit()
        flash("Randevu durumu güncellendi.", "success")

    return redirect(url_for("admin.admin_appointments"))


@admin_bp.route("/appointments/delete/<int:appointment_id>")
@login_required
def admin_appointment_delete(appointment_id):
    appointment = Appointment.query.get_or_404(appointment_id)

    db.session.delete(appointment)
    db.session.commit()

    flash("Randevu talebi silindi.", "success")
    return redirect(url_for("admin.admin_appointments"))


# SETTINGS
@admin_bp.route("/settings", methods=["GET", "POST"])
@login_required
def admin_settings():
    settings = get_settings()

    if request.method == "POST":
        settings.hero_title = request.form.get("hero_title", "").strip()
        settings.hero_description = request.form.get("hero_description", "").strip()

        hero_file = request.files.get("hero_image")
        uploaded_image = save_image(hero_file)

        if uploaded_image:
            settings.hero_image = uploaded_image

        settings.instagram_url = request.form.get("instagram_url", "").strip()
        settings.whatsapp_url = request.form.get("whatsapp_url", "").strip()
        settings.x_url = request.form.get("x_url", "").strip()
        settings.tiktok_url = request.form.get("tiktok_url", "").strip()

        settings.phone = request.form.get("phone", "").strip()
        settings.email = request.form.get("email", "").strip()
        settings.address = request.form.get("address", "").strip()
        settings.working_hours = request.form.get("working_hours", "").strip()

        db.session.commit()

        flash("Site ayarları güncellendi.", "success")
        return redirect(url_for("admin.admin_settings"))

    return render_template("admin/settings.html", settings=settings)