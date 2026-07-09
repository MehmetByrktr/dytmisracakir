# Dyt. Mısra Çakır V17 - Hızlandırma + CTA Düzeni

## Hızlandırma
- Site ayarları public sayfalarda tekrar cache'e alındı.
- Logo/favicon route'ları direkt DB'den okumaya devam ediyor, böylece ikon değişikliği bozulmaz.
- Sayfa metinleri (`content(...)`) artık her çağrıldığında DB'ye gitmez; tüm içerik haritası tek sefer cache'lenir.
- Admin panelde ayar/içerik/blog/danışmanlık/menü/mit/randevu gibi kayıt işlemlerinden sonra cache otomatik temizlenir.
- Static dosyalar için uzun süreli cache header eklendi.
- Liste/kart görsellerine lazy loading ve async decoding eklendi.
- Public kartlarda `contain` ile tarayıcı render yükü azaltıldı.

## CTA düzeltmesi
- Ana sayfa altındaki randevu bloğu daha kompakt hale getirildi.
- Büyük yazı ortalandı/dengelendi, buton küçültüldü ve sağ/alt hizası daha doğal yapıldı.
- Mobilde tek sütun ve daha temiz görünüm korundu.

## Not
Render Free kullanılıyorsa ilk açılışta cold-start yine olabilir. Bu sürüm, site uyandıktan sonra sayfa geçişlerini ve ayar kaydetme sonrası public sayfa açılışlarını hızlandırır.
