# Dyt. Mısra Çakır V7 - Mehmet Admin Layout Uyarlaması

Bu sürümde yalnızca admin panel tasarımı yeniden düzenlendi.

## Kaynak alınan yapı
Gönderilen CSS dosyasındaki Mehmet admin paneli yapısından şu tasarım mantığı alındı:
- `admin-shell`
- `admin-sidebar`
- `admin-content`
- sidebar menü
- dashboard stat kartları
- panel / tablo / form kart düzeni
- quick action kartları
- sticky sol admin menü

## Korunanlar
- Mısra sitesinin genel renk paleti korundu.
- Beyaz/açık arka plan korundu.
- Plum/mor başlık rengi korundu.
- Lavanta/pembe hover rengi korundu.
- Public site tasarımına dokunulmadı.
- Backend/route/veritabanı mantığı değiştirilmedi.

## Yapılanlar
- Üst yatay admin navbar kaldırıldı.
- Admin panel Mehmet sitesindeki gibi sol sidebar + sağ içerik alanı yapısına alındı.
- Dashboard kartları Mehmet panelindeki gibi cam/kart hissine çekildi.
- Blog, danışmanlık, menüler, mitler, randevular ve site ayarları sayfaları aynı admin tasarım sistemine bağlandı.
- Blog ekleme/düzenleme formu ve editör toolbar'ı yeni admin tasarımına uyarlandı.
- Site ayarları sayfası, form kutuları, not kartları ve dosya yükleme alanları yeniden düzenlendi.
- Randevu kartları ve tablo görünümleri yeni sol-sidebar admin sistemine uyumlu hale getirildi.
- Mobilde sidebar üstte yatay/alt alta uyumlu hale gelir.

## Kontrol
- Python syntax kontrolü yapıldı.
- Jinja template parse kontrolü yapıldı.
- main.js syntax kontrolü yapıldı.
