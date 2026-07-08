# Render + Supabase + Cloudinary Kurulum

## 1. GitHub'a gönder
```bash
git add .
git commit -m "misra final security and color fix"
git push
```

## 2. Supabase veritabanı
1. Supabase'de proje oluştur.
2. Project Settings > Database > Connection string bölümüne gir.
3. Render için mümkünse Pooler / Transaction connection string kullan.
4. URL şu mantıkta olur:
```text
postgresql://postgres.PROJECT_REF:SIFRE@aws-0-eu-west-1.pooler.supabase.com:6543/postgres
```
5. Bu değeri Render'da `DATABASE_URL` olarak ekle.
6. Supabase şifresinde özel karakter varsa URL encode gerekebilir. Örneğin `@` yerine `%40`.

## 3. Cloudinary
1. Cloudinary hesabı aç.
2. Dashboard'dan şu 3 değeri al:
   - Cloud name
   - API key
   - API secret
3. Render Environment içine ekle:
```text
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLOUDINARY_FOLDER=dyt-misra-cakir
```

## 4. Admin şifresi hash üret
Yerelde:
```bash
python generate_admin_hash.py
```
Çıkan değeri Render'a:
```text
ADMIN_PASSWORD_HASH=...
```
olarak ekle.

## 5. Render Environment değişkenleri
Render > Web Service > Environment bölümüne en az şunları ekle:

```text
APP_ENV=production
FLASK_DEBUG=False
SECRET_KEY=çok_uzun_rastgele_bir_deger
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=generate_admin_hash_ciktisi

DATABASE_URL=supabase_pooler_url

SESSION_COOKIE_SECURE=True
FORCE_HTTPS=True
TRUST_PROXY_HEADERS=True

DB_NULLPOOL=1
DB_SSLMODE=require
DB_CONNECT_TIMEOUT=10

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLOUDINARY_FOLDER=dyt-misra-cakir

MAX_UPLOAD_MB=6
ALLOW_INIT_DB=False
```

## 6. Render ayarları
Build Command:
```bash
pip install -r requirements.txt
```

Start Command:
```bash
gunicorn wsgi:app
```

Python Version:
```text
3.11
```

## 7. İlk veritabanı tabloları
Production'da `ALLOW_INIT_DB=False` kalmalı. İlk kurulumda geçici olarak:
```text
ALLOW_INIT_DB=True
```
yap, deploy et, admin girişinden sonra:
```text
https://site-adresin.onrender.com/init-db
```
adresine gir. Tablolar oluşunca tekrar:
```text
ALLOW_INIT_DB=False
```
yap ve redeploy et.

## 8. Domain
Render > Settings > Custom Domains:
- `misracakir.com`
- `www.misracakir.com`

Domain aldığın panelde DNS:
- `www` için CNAME -> Render'ın verdiği `...onrender.com`
- kök domain `@` için A record veya ALIAS/ANAME -> Render'ın verdiği hedef

DNS oturması 24 saate kadar sürebilir.

## Not
Render Free planda uykuya geçebilir. Site sürekli açık kalsın istenirse Render paid, Railway, Fly.io, DigitalOcean App Platform veya VPS daha stabil olur.
