# Yayına Alma Notları

Bu projede gizli bilgiler `.env` dosyasında tutulmalıdır. `.env` dosyası GitHub'a gönderilmemelidir.

## Gerekli ortam değişkenleri

```env
SECRET_KEY=guclu_secret_key
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=werkzeug_generate_password_hash_ciktisi
FLASK_DEBUG=False
APP_ENV=production
SESSION_COOKIE_SECURE=True
ALLOW_INIT_DB=False
```

PostgreSQL kullanılıyorsa hosting panelinde ayrıca eklenmelidir:

```env
DATABASE_URL=postgresql://...
```

## Admin şifresi hash üretme

```bash
py -c "from werkzeug.security import generate_password_hash; print(generate_password_hash('YENI_SIFRE'))"
```

Çıkan değeri `ADMIN_PASSWORD_HASH` olarak hosting ortam değişkenlerine ekleyin.

## Lokal çalışma

```bash
py -m pip install -r requirements.txt
py app.py
```

## Render başlangıç komutu

```bash
gunicorn wsgi:app
```

## İlk kurulum

Uygulama tabloları başlangıçta otomatik oluşturur. Örnek verileri yüklemek için sadece geliştirme ortamında veya `ALLOW_INIT_DB=True` iken admin girişi sonrası `/init-db` çalıştırılabilir. Yayına aldıktan sonra `ALLOW_INIT_DB=False` bırakılmalıdır.
