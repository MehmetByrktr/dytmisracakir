# Dyt. Mısra Çakır V2 - Mehmet Feature Pack Uyarlaması

Bu sürümde Mehmet sitesinde yapılan ana yapılar Mısra sitesine uyarlanmıştır. UI/UX ana yapısı korunmuş, ağırlıklı olarak güvenlik, deploy, admin ve renk sistemi güncellenmiştir.

## Güvenlik
- CSRF yapısı korunmuştur.
- Admin logout POST olarak korunmuştur.
- Admin login brute-force kilidi korunmuştur.
- Admin sayfalarında noindex korunmuştur.
- robots.txt içinde /admin disallow korunmuştur.
- Content-Security-Policy başlığı eklenmiştir.
- Blog içerikleri ve hero başlığı kaydedilmeden önce Bleach ile sanitize edilir.
- Rich editor stilleri CSSSanitizer ile güvenli özelliklerle sınırlandırılmıştır.
- Görsel yükleme Pillow ile gerçek görsel doğrulaması yapar.
- İletişim/randevu formuna IP bazlı rate limit eklenmiştir.
- Honeypot alanı korunmuştur.

## Supabase / PostgreSQL
- DATABASE_URL PostgreSQL/Supabase pooler ile uyumlu hale getirilmiştir.
- Render/Supabase SSL hataları için SQLAlchemy NullPool ayarı eklenmiştir.
- DB_NULLPOOL, DB_SSLMODE ve DB_CONNECT_TIMEOUT env desteği eklenmiştir.

## Cloudinary
- CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET ve CLOUDINARY_FOLDER env desteği eklendi.
- Cloudinary ayarları varsa görsel yüklemeleri Cloudinary'ye gider.
- Ayar yoksa eski lokal static/images yükleme yapısı çalışmaya devam eder.

## Admin Panel
- Dashboard'a grafik/bar alanları eklendi.
- Yeni randevu olduğunda kırmızı badge/nokta daha belirgin hale getirildi.
- Blog editöründe font ve boyut seçimleri daha stabil hale getirildi.
- Quill içerikleri için public CSS font sınıf desteği eklendi.

## UI/Renk
- Ana layout korunmuştur.
- Renk paleti görseldeki tonlara çekilmiştir:
  - #E43D12
  - #D6536D
  - #FFA2B6
  - #EFB11D
  - #EBE9E1
- Sağdaki 4'lü bardan WhatsApp ve X kaldırıldı.
- Sağ bara Mail ve Yukarı Çık butonu eklendi.
- İletişim kartları 2x2 yapıda tutuldu ve uzun e-posta taşması engellendi.

## Deploy Notu
Render/Supabase için env örneği .env.example içine eklenmiştir.
