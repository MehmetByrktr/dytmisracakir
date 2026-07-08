# Dyt. Mısra Çakır V5 - Navbar/Admin/Icon/Editor Fix

Bu sürümde son istenen düzeltmeler uygulandı.

## UI / Renk
- Siyah randevu/CTA butonları kaldırıldı.
- Butonlar mor/plum temaya çekildi.
- Hover rengi lavender/pembe tona döner ve yazılar beyaz kalır.
- Navbar açık/beyaz yapıldı.
- Footer açık/beyaz yapıldı.
- Kartlar krem tona çekildi.
- Sidebar açık/beyaz yapıldı, link yazıları plum/mor tona çekildi.
- Admin panel koyu görünümden çıkarıldı; açık/krem tema ve okunur mor buton yapısı verildi.

## Navbar
- Tema değiştirme tuşu kaldırıldı.
- Sağ tarafta sadece:
  - Ev ikonu
  - Randevu Al
  kaldı.
- “Diyetisyen Mısra Çakır” yazısının yanına site ikonu eklendi.
- Site ikonu favicon olarak da kullanılır.

## Admin Site İkonu
- Site Ayarları > Görsel bölümüne “Site İkonu / Logo” yükleme alanı eklendi.
- `SiteSettings.site_icon` alanı eklendi.
- Mevcut veritabanları için küçük otomatik schema upgrade fonksiyonu eklendi.
- Varsayılan ikon: `static/images/misra-icon.png`

## Blog Editör Bug Fix
- Blog ekle/düzenle sayfasında Quill editör artık başlık alanının odağını çalmıyor.
- `quill.focus()` kaldırıldı.
- Başlık/kategori/açıklama alanlarına tıklanınca editör blur ediliyor.
- Toolbar işlemleri selection koruyarak ve scroll/focus bozmadan çalışır.

## Not
Deploy sonrası eski CSS cache kalırsa Render'da:
Manual Deploy → Clear build cache & deploy
yapılması önerilir.
