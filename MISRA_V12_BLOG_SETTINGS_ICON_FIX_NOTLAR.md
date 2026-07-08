# Dyt. Mısra Çakır V12 - Blog Taşma + Danışmanlık Ayarı + İkon Fix

## Yapılanlar
- Blog sayfasındaki arama/kategori/filtreleme formunun sağa taşması düzeltildi.
- Arama formu geniş ekranda tek satır, dar ekranda iki satır/mobilde tek sütun olacak şekilde düzenlendi.
- Ana sayfadaki Danışmanlık Alanları bölümünün mini başlığı, büyük başlığı ve açıklaması Site Ayarları içine eklendi.
- Ana sayfadaki danışmanlık kartları artık veritabanındaki aktif Danışmanlık Alanları içeriklerinden gelir.
- Kart başlık/açıklama/butonları Admin Panel > Danışmanlık bölümünden düzenlenebilir.
- Site ikonu yüklemesi daha güvenli hale getirildi:
  - PNG/JPG/WEBP/ICO kabul edilir.
  - Yüklenen ikon otomatik kare 512x512 PNG’ye çevrilir.
  - Navbar, favicon, shortcut icon ve apple-touch-icon aynı güncel ikonu kullanır.
  - /favicon.ico route’u eklendi.
- İkon/hero görsel upload sırasında hata olursa 500 yerine admin panelde uyarı gösterilir.
- Var olan Supabase veritabanları için eksik kolonları ekleyen schema patch genişletildi.

## Kontrol
- Python syntax kontrolü yapıldı.
- Jinja template parse kontrolü yapıldı.
- main.js syntax kontrolü yapıldı.
