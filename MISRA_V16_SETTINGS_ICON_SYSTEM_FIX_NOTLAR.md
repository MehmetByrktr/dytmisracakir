# Dyt. Mısra Çakır V16 - Site Ayarları Logo/Favicon Sistemi Fix

## Sebep
Önceki yapıda admin Site Ayarları sayfası veriyi doğrudan DB’den okuyordu; diğer public sayfalar ise V15 hızlandırmasıyla cache’lenmiş `settings` objesini kullanıyordu. Bu yüzden ikon Site Ayarları sayfasında değişmiş görünürken diğer sayfalarda eski ikon kalabiliyordu. Ayrıca tek `site_icon` alanı hem navbar logosu hem favicon için kullanıldığı için davranış net değildi.

## Yapılan çözüm
- Mehmet’in sitesindeki mantığa benzer şekilde logo ve favicon sistemi ayrıldı:
  - `site_logo`
  - `favicon_image`
  - geriye dönük uyumluluk için `site_icon`
- Public sayfaların global site identity ayarları artık cache’den değil doğrudan DB’den geliyor.
- İçerik cache’i korunuyor; sadece site kimliği/icon/logo için cache kaldırıldı.
- Navbar logo için `/site-logo.png`, favicon için `/site-icon.png` ve `/favicon.ico` route’ları kullanılıyor.
- Site Ayarları UI/UX yapısı korunarak Görsel alanına ayrı:
  - Site Logosu
  - Favicon / Google İkonu
  eklendi.
- Admin panel sol üst logo da site logosu route’una bağlandı.
- Var olan Supabase DB için `site_logo` ve `favicon_image` kolon patch’i eklendi.
- İkon değişince cache temizleniyor ve `site_icon_updated_at` güncelleniyor.

## Not
Google arama sonucu faviconu anında değişmez. Google siteyi tekrar tarayınca güncellenir.
