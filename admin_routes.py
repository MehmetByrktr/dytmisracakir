from functools import wraps
from time import time

from flask import Blueprint, render_template, request, redirect, url_for, session, flash, current_app
from werkzeug.security import check_password_hash

from extensions import db
from models import BlogPost, Myth, Appointment, DietProgram, MenuExample
from utils import make_unique_slug, save_image, get_settings, sanitize_rich_content, sanitize_basic_html


admin_bp = Blueprint("admin", __name__, url_prefix="/admin")
_LOGIN_ATTEMPTS = {}


def _client_key():
    return request.headers.get("X-Forwarded-For", request.remote_addr or "unknown").split(",")[0].strip()


def _is_locked_out(key):
    data = _LOGIN_ATTEMPTS.get(key)
    if not data:
        return False

    locked_until = data.get("locked_until", 0)
    if locked_until and locked_until > time():
        return True

    if locked_until and locked_until <= time():
        _LOGIN_ATTEMPTS.pop(key, None)

    return False


def _record_failed_login(key):
    max_attempts = current_app.config.get("ADMIN_LOGIN_MAX_ATTEMPTS", 5)
    lock_seconds = current_app.config.get("ADMIN_LOGIN_LOCK_SECONDS", 900)

    data = _LOGIN_ATTEMPTS.setdefault(key, {"count": 0, "locked_until": 0})
    data["count"] += 1

    if data["count"] >= max_attempts:
        data["locked_until"] = time() + lock_seconds


def _clear_failed_logins(key):
    _LOGIN_ATTEMPTS.pop(key, None)




def bleach_text(value):
    return sanitize_basic_html(value) if "<" in (value or "") else (value or "")

def _safe_admin_next(next_url):
    if not next_url:
        return None
    if next_url.startswith("//"):
        return None
    if not next_url.startswith("/admin"):
        return None
    if next_url.startswith("/admin/login"):
        return None
    return next_url


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get("admin_logged_in"):
            return redirect(url_for("admin.admin_login", next=request.full_path or request.path))
        return f(*args, **kwargs)
    return decorated_function


@admin_bp.route("/login", methods=["GET", "POST"])
def admin_login():
    if session.get("admin_logged_in"):
        return redirect(url_for("admin.admin_dashboard"))

    if request.method == "POST":
        key = _client_key()

        if _is_locked_out(key):
            flash("Çok fazla hatalı deneme yapıldı. Lütfen bir süre sonra tekrar deneyin.", "error")
            return render_template("admin/login.html"), 429

        username = request.form.get("username", "").strip()
        password = request.form.get("password", "")
        password_hash = current_app.config.get("ADMIN_PASSWORD_HASH")

        if not password_hash:
            flash("Admin şifre ayarı eksik. Lütfen ortam değişkenlerini kontrol edin.", "error")
            return render_template("admin/login.html"), 500

        if (
            username == current_app.config["ADMIN_USERNAME"]
            and check_password_hash(password_hash, password)
        ):
            _clear_failed_logins(key)
            next_url = _safe_admin_next(request.args.get("next"))

            session.clear()
            session.permanent = True
            session["admin_logged_in"] = True

            flash("Giriş başarılı.", "success")
            return redirect(next_url or url_for("admin.admin_dashboard"))

        _record_failed_login(key)
        flash("Kullanıcı adı veya şifre hatalı.", "error")

    return render_template("admin/login.html")


@admin_bp.route("/logout", methods=["POST"])
@login_required
def admin_logout():
    session.clear()
    flash("Çıkış yapıldı.", "success")
    return redirect(url_for("admin.admin_login"))


@admin_bp.route("/")
@login_required
def admin_dashboard():
    blog_count = BlogPost.query.count()
    myth_count = Myth.query.count()
    diet_program_count = DietProgram.query.count()
    menu_count = MenuExample.query.count()

    appointment_count = Appointment.query.count()
    new_appointments = Appointment.query.filter_by(status="Yeni").count()
    approved_appointments = Appointment.query.filter_by(status="Onaylandı").count()
    cancelled_appointments = Appointment.query.filter_by(status="İptal").count()

    recent_appointments = Appointment.query.order_by(Appointment.created_at.desc()).limit(5).all()
    recent_posts = BlogPost.query.order_by(BlogPost.created_at.desc()).limit(5).all()

    content_counts = [blog_count, myth_count, diet_program_count, menu_count]
    appointment_counts = [new_appointments, approved_appointments, cancelled_appointments]

    return render_template(
        "admin/dashboard.html",
        blog_count=blog_count,
        myth_count=myth_count,
        diet_program_count=diet_program_count,
        menu_count=menu_count,
        appointment_count=appointment_count,
        new_appointments=new_appointments,
        approved_appointments=approved_appointments,
        cancelled_appointments=cancelled_appointments,
        recent_appointments=recent_appointments,
        recent_posts=recent_posts,
        max_content_count=max(content_counts) if content_counts else 1,
        max_appointment_count=max(appointment_counts) if appointment_counts else 1
    )


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
        if c[0]
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
        content = sanitize_rich_content(request.form.get("content", ""))

        if not title or not category or not excerpt:
            flash("Başlık, kategori ve kısa açıklama alanları zorunludur.", "error")
            return redirect(url_for("admin.admin_blog_add"))

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
        category = request.form.get("category", "").strip()
        excerpt = request.form.get("excerpt", "").strip()

        if not title or not category or not excerpt:
            flash("Başlık, kategori ve kısa açıklama alanları zorunludur.", "error")
            return redirect(url_for("admin.admin_blog_edit", post_id=post.id))

        post.title = title
        post.slug = make_unique_slug(title, post.id)
        post.category = category
        post.excerpt = excerpt
        post.content = sanitize_rich_content(request.form.get("content", ""))
        post.seo_title = request.form.get("seo_title", "").strip()
        post.seo_description = request.form.get("seo_description", "").strip()
        post.seo_keywords = request.form.get("seo_keywords", "").strip()

        uploaded_image = save_image(request.files.get("image_file"))
        if uploaded_image:
            post.image = uploaded_image

        db.session.commit()

        flash("Blog yazısı güncellendi.", "success")
        return redirect(url_for("admin.admin_blog"))

    return render_template("admin/blog_edit.html", post=post)


@admin_bp.route("/blog/delete/<int:post_id>", methods=["POST"])
@login_required
def admin_blog_delete(post_id):
    post = BlogPost.query.get_or_404(post_id)
    db.session.delete(post)
    db.session.commit()
    flash("Blog yazısı silindi.", "success")
    return redirect(url_for("admin.admin_blog"))


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
    return render_template("admin/myth_list.html", myths=myths, search=search)


@admin_bp.route("/myths/add", methods=["GET", "POST"])
@login_required
def admin_myth_add():
    if request.method == "POST":
        title = request.form.get("title", "").strip()
        description = request.form.get("description", "").strip()
        keywords = request.form.get("keywords", "").strip() or "beslenme"

        if not title or not description:
            flash("Başlık ve açıklama alanları zorunludur.", "error")
            return redirect(url_for("admin.admin_myth_add"))

        new_myth = Myth(title=title, description=description, keywords=keywords)
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
        title = request.form.get("title", "").strip()
        description = request.form.get("description", "").strip()
        keywords = request.form.get("keywords", "").strip() or "beslenme"

        if not title or not description:
            flash("Başlık ve açıklama alanları zorunludur.", "error")
            return redirect(url_for("admin.admin_myth_edit", myth_id=myth.id))

        myth.title = title
        myth.description = description
        myth.keywords = keywords
        db.session.commit()

        flash("Mit güncellendi.", "success")
        return redirect(url_for("admin.admin_myths"))

    return render_template("admin/myth_edit.html", myth=myth)


@admin_bp.route("/myths/delete/<int:myth_id>", methods=["POST"])
@login_required
def admin_myth_delete(myth_id):
    myth = Myth.query.get_or_404(myth_id)
    db.session.delete(myth)
    db.session.commit()
    flash("Mit silindi.", "success")
    return redirect(url_for("admin.admin_myths"))


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


@admin_bp.route("/appointments/delete/<int:appointment_id>", methods=["POST"])
@login_required
def admin_appointment_delete(appointment_id):
    appointment = Appointment.query.get_or_404(appointment_id)
    db.session.delete(appointment)
    db.session.commit()
    flash("Randevu talebi silindi.", "success")
    return redirect(url_for("admin.admin_appointments"))


@admin_bp.route("/programs")
@login_required
def admin_programs():
    programs = DietProgram.query.order_by(DietProgram.order_no.asc(), DietProgram.created_at.desc()).all()
    return render_template("admin/program_list.html", programs=programs)


@admin_bp.route("/programs/add", methods=["GET", "POST"])
@login_required
def admin_program_add():
    if request.method == "POST":
        title = request.form.get("title", "").strip()
        description = request.form.get("description", "").strip()

        if not title or not description:
            flash("Başlık ve açıklama alanları zorunludur.", "error")
            return redirect(url_for("admin.admin_program_add"))

        program = DietProgram(
            title=title,
            description=description,
            bullets=request.form.get("bullets", "").strip(),
            button_text=request.form.get("button_text", "Randevu al").strip() or "Randevu al",
            order_no=request.form.get("order_no", 1, type=int) or 1,
            is_active=bool(request.form.get("is_active"))
        )
        db.session.add(program)
        db.session.commit()
        flash("Danışmanlık alanı eklendi.", "success")
        return redirect(url_for("admin.admin_programs"))

    return render_template("admin/program_add.html")


@admin_bp.route("/programs/edit/<int:program_id>", methods=["GET", "POST"])
@login_required
def admin_program_edit(program_id):
    program = DietProgram.query.get_or_404(program_id)

    if request.method == "POST":
        title = request.form.get("title", "").strip()
        description = request.form.get("description", "").strip()

        if not title or not description:
            flash("Başlık ve açıklama alanları zorunludur.", "error")
            return redirect(url_for("admin.admin_program_edit", program_id=program.id))

        program.title = title
        program.description = description
        program.bullets = request.form.get("bullets", "").strip()
        program.button_text = request.form.get("button_text", "Randevu al").strip() or "Randevu al"
        program.order_no = request.form.get("order_no", 1, type=int) or 1
        program.is_active = bool(request.form.get("is_active"))

        db.session.commit()
        flash("Danışmanlık alanı güncellendi.", "success")
        return redirect(url_for("admin.admin_programs"))

    return render_template("admin/program_edit.html", program=program)


@admin_bp.route("/programs/delete/<int:program_id>", methods=["POST"])
@login_required
def admin_program_delete(program_id):
    program = DietProgram.query.get_or_404(program_id)
    db.session.delete(program)
    db.session.commit()
    flash("Danışmanlık alanı silindi.", "success")
    return redirect(url_for("admin.admin_programs"))


@admin_bp.route("/menus")
@login_required
def admin_menus():
    menus = MenuExample.query.order_by(MenuExample.order_no.asc(), MenuExample.created_at.desc()).all()
    return render_template("admin/menu_list.html", menus=menus)


@admin_bp.route("/menus/add", methods=["GET", "POST"])
@login_required
def admin_menu_add():
    if request.method == "POST":
        title = request.form.get("title", "").strip()
        meals = request.form.get("meals", "").strip()

        if not title or not meals:
            flash("Başlık ve öğünler alanları zorunludur.", "error")
            return redirect(url_for("admin.admin_menu_add"))

        menu = MenuExample(
            title=title,
            category=request.form.get("category", "").strip(),
            meals=meals,
            button_text=request.form.get("button_text", "Randevu al").strip() or "Randevu al",
            order_no=request.form.get("order_no", 1, type=int) or 1,
            is_active=bool(request.form.get("is_active"))
        )
        db.session.add(menu)
        db.session.commit()
        flash("Menü örneği eklendi.", "success")
        return redirect(url_for("admin.admin_menus"))

    return render_template("admin/menu_add.html")


@admin_bp.route("/menus/edit/<int:menu_id>", methods=["GET", "POST"])
@login_required
def admin_menu_edit(menu_id):
    menu = MenuExample.query.get_or_404(menu_id)

    if request.method == "POST":
        title = request.form.get("title", "").strip()
        meals = request.form.get("meals", "").strip()

        if not title or not meals:
            flash("Başlık ve öğünler alanları zorunludur.", "error")
            return redirect(url_for("admin.admin_menu_edit", menu_id=menu.id))

        menu.title = title
        menu.category = request.form.get("category", "").strip()
        menu.meals = meals
        menu.button_text = request.form.get("button_text", "Randevu al").strip() or "Randevu al"
        menu.order_no = request.form.get("order_no", 1, type=int) or 1
        menu.is_active = bool(request.form.get("is_active"))

        db.session.commit()
        flash("Menü örneği güncellendi.", "success")
        return redirect(url_for("admin.admin_menus"))

    return render_template("admin/menu_edit.html", menu=menu)


@admin_bp.route("/menus/delete/<int:menu_id>", methods=["POST"])
@login_required
def admin_menu_delete(menu_id):
    menu = MenuExample.query.get_or_404(menu_id)
    db.session.delete(menu)
    db.session.commit()
    flash("Menü örneği silindi.", "success")
    return redirect(url_for("admin.admin_menus"))


@admin_bp.route("/settings", methods=["GET", "POST"])
@login_required
def admin_settings():
    settings = get_settings()

    if request.method == "POST":
        settings.hero_title = sanitize_basic_html(request.form.get("hero_title", "").strip()) or settings.hero_title
        settings.hero_description = bleach_text(request.form.get("hero_description", "").strip()) or settings.hero_description

        uploaded_image = save_image(request.files.get("hero_image"))
        if uploaded_image:
            settings.hero_image = uploaded_image

        uploaded_icon = save_image(request.files.get("site_icon"))
        if uploaded_icon:
            settings.site_icon = uploaded_icon

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
