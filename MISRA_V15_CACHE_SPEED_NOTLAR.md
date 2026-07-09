# Dyt. Mısra Çakır V15 - Cache / Hız Optimizasyonu

## Yapılanlar
- Public sayfalar için küçük bir in-memory TTL cache sistemi eklendi.
- Her sayfa açılışında Supabase'e tekrar tekrar gitmemek için site ayarları cache'lendi.
- Ana sayfa son bloglar ve danışmanlık kartları cache'lendi.
- Danışmanlık alanları sayfası, menüler sayfası, kategori listeleri ve doğru bilinen yanlışlar cache'lendi.
- Blog kategori listesi cache'lendi.
- Admin panelde blog/danışmanlık/menü/mit/site ayarı gibi içerikler kaydedilince cache otomatik temizleniyor.
- Cache süresi config'e eklendi: `PUBLIC_CACHE_TTL_SECONDS=300`.
- Cache SQLAlchemy session'a bağlı objeler yerine hafif/detached namespace objeleriyle çalışır.

## Neden hızlandırır?
Önceki yapıda public sayfalarda çok sık Supabase sorgusu yapılıyordu. Bu sürümde ilk istek DB'den alır, sonraki istekler cache'den döner. Admin panelde değişiklik yapınca cache temizlenir ve yeni veri görünür.

## Not
Render Free cold start varsa ilk açılış yine yavaş olabilir. Bu cache daha çok site ayaktayken sayfa geçişlerini ve tekrar ziyaretleri hızlandırır.
