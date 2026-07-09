# Dyt. Mısra Çakır V14 - Favicon / Site İkonu Kalıcı Düzeltme

## Sebep
Önceki sürümde ikon yükleme başarısız olursa `save_site_icon()` None döndürüyor ama ayarlar yine “kaydedildi” gibi davranabiliyordu. Bu yüzden kullanıcı ikon değişti sanıyordu ama DB'deki `site_icon` alanı değişmiyordu. Ayrıca faviconlar tarayıcı tarafından çok agresif cache'lendiği için değişiklik yapılmış olsa bile sekme ikonu eski görünebiliyordu.

## Düzeltmeler
- `SiteSettings.site_icon_updated_at` alanı eklendi.
- Başarılı ikon yüklemede `site_icon_updated_at` güncelleniyor.
- Favicon, shortcut icon, apple-touch-icon ve navbar logo artık cache-bust query ile geliyor.
- `/favicon.ico` ve `/site-icon.png` route’ları güncel DB ikonuna yönleniyor.
- Admin panelde ikon yükleme başarısız olursa artık açık hata mesajı gösteriyor.
- Admin panelde “Güncel faviconu aç” bağlantısı eklendi.
- Site ayarları önizleme ikonu da cache-bust ile güncelleniyor.
- Var olan Supabase DB için `site_icon_updated_at` kolon patch’i eklendi.

## Not
Google arama sonucundaki favicon anlık değişmez. Google siteyi tekrar tarayınca güncellenir.
