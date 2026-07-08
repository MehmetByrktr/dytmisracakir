# Dyt. Mısra Çakır V6 - Clean CSS / Light Theme

Bu sürümde CSS dosyası baştan temizlendi.

## Ana değişiklikler
- `static/css/style.css` eski override bloklarından arındırıldı.
- Yaklaşık 190KB karma CSS yerine tek ve temiz bir tema dosyası yazıldı.
- Koyu/antrasit/siyah kalan bloklar kaldırıldı.
- Admin paneldeki eski inline style blokları `admin_base.html` içinden kaldırıldı.
- Site genelinde tek palet kullanıldı:
  - Beyaz zemin
  - Krem kartlar
  - Mor/plum başlık ve linkler
  - Lavanta/pembe hover
  - Sage destek rengi

## Public site
- Arka plan beyaz/açık yapıldı.
- Navbar beyaz kaldı.
- Footer beyaz yapıldı.
- Footer linkleri ve sosyal butonları mor/plum palete çekildi.
- Randevu ve ana CTA butonları siyah değil, mor/plum renkte.
- Hover rengi lavanta/pembe; hover sırasında yazılar beyaz kalır.
- Kartlar krem renkte tutuldu.
- Sidebar beyaz; yazılar mor/plum.

## Admin panel
- Dashboard kartları siyah olmaktan çıkarıldı.
- Blog, danışmanlık, menü, mit, randevu ve site ayarları sayfaları aynı açık tema sistemine çekildi.
- Admin navbar ve çıkış butonu temaya uygun hale getirildi.
- Site Ayarları ve Blog Ekle/Düzenle formları krem/beyaz açık kart sistemine çekildi.
- Grafik kartları, randevu kartları, tablo kartları ve form kartları aynı tasarım diline alındı.

## Blog editör
- Quill editör toolbar'ı açık tema ile uyumlu hale getirildi.
- Font/boyut butonları okunur ve düzenli hale getirildi.
- Editör alanı beyaz/açık zeminde okunur hale getirildi.

## Kontrol
- Python syntax kontrolü yapıldı.
- Jinja template parse kontrolü yapıldı.
- main.js syntax kontrolü yapıldı.
