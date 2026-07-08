# Dyt. Mısra Çakır V11 - Başlık Rengi + Güvenlik + Render Rehberi

## Görsel düzeltme
- Kilo kontrolü, Klinik beslenme, Kadın sağlığı, Menü planlama gibi italik kart başlıkları yeşilden çıkarıldı.
- Bu başlıklar kullanılan mor/plum tona alındı.
- Küçük etiketler, numaralar ve kicker alanları yeşil kalmaya devam eder.

## Güvenlik iyileştirmeleri
- Production ortamında `SECRET_KEY` zorunlu hale getirildi.
- Production ortamında `ADMIN_PASSWORD_HASH` zorunlu hale getirildi.
- Production varsayılanında güvenli cookie (`SESSION_COOKIE_SECURE=True`) aktif hale getirildi.
- Render gibi proxy arkasında HTTPS algısı için `ProxyFix` eklendi.
- Production varsayılanında HTTP -> HTTPS yönlendirme eklendi.
- Admin ve init-db sayfalarına `X-Robots-Tag: noindex, nofollow, noarchive` eklendi.
- Admin/init-db cevaplarına no-cache koruması devam ettirildi.
- Form alanları için maksimum field uzunluğu kontrolü eklendi.
- Ek güvenlik başlıkları eklendi:
  - Cross-Origin-Opener-Policy
  - Cross-Origin-Resource-Policy
- `/healthz` health check endpoint'i eklendi.
- Blog arama/kategori sorgularına uzunluk sınırı eklendi.
- Admin şifre hash üretmek için `generate_admin_hash.py` eklendi.

## Deployment
- `RENDER_SUPABASE_CLOUDINARY_KURULUM.md` dosyası eklendi.
