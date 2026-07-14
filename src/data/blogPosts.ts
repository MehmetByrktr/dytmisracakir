import { BlogPost } from '@/types';

export const blogPosts: BlogPost[] = [
  {
    slug: 'sürdürülebilir-kilo-verme-neden-yavas-olmali',
    title: 'Sürdürülebilir Kilo Verme Neden Yavaş Olmalı?',
    category: 'Kilo Yönetimi',
    excerpt:
      'Hızlı kilo verme programlarının neden kalıcı olmadığını ve haftada 0,5-1 kg vermenin uzun vadede neden daha etkili olduğunu anlatıyoruz.',
    readMinutes: 6,
    publishedAt: '2026-06-02',
    author: 'Mısra Çakır',
    coverImage: '/images/blog/yavas-kilo-verme.jpg',
    content: [
      'Sosyal medyada sıkça karşılaştığımız "2 haftada 10 kilo" başlıklı programlar kulağa cazip gelse de, vücudumuzun fizyolojisiyle uyumlu değildir. Hızlı kilo kaybı büyük oranda su ve kas kütlesinden gelir, yağ kütlesinden değil.',
      'Haftada 0,5-1 kilogramlık bir kayıp hedefi, vücudun yağ kütlesini korurken kas kütlesini kaybetmeden ilerlemesine olanak tanır. Bu da bazal metabolizma hızının korunması anlamına gelir.',
      'Yavaş ilerleyen bir süreçte alışkanlıklar kalıcı hale gelir. Program bittiğinde eski düzene dönme riski, hızlı diyetlere kıyasla belirgin şekilde azalır.',
      'Kalıcı sonuç için üç unsur öne çıkar: gerçekçi kalori açığı, yeterli protein alımı ve düzenli takip. Bu üçü bir arada olmadan verilen kilolar genellikle geri alınır.',
      'Sürecin bir parte de sabır göstermek, tartıdaki sayıdan çok haftalık ortalamalara bakmaktır. Su tutulumu, hormonal döngü ve tuz alımı gibi etkenler günlük dalgalanmalara neden olabilir.',
    ],
  },
  {
    slug: 'protein-ihtiyaci-gercekten-ne-kadar',
    title: 'Protein İhtiyacı Gerçekten Ne Kadar?',
    category: 'Sağlıklı Beslenme',
    excerpt:
      'Protein tozu reklamlarının ötesinde, günlük protein ihtiyacınızı vücut ağırlığınıza ve aktivite düzeyinize göre nasıl hesaplayacağınızı anlatıyoruz.',
    readMinutes: 5,
    publishedAt: '2026-05-18',
    author: 'Mısra Çakır',
    coverImage: '/images/blog/protein-ihtiyaci.jpg',
    content: [
      'Sedanter bir yetişkin için günlük protein ihtiyacı, kilogram başına ortalama 0,8-1 gram olarak kabul edilir. Düzenli spor yapanlarda bu miktar 1,2-2 grama kadar çıkabilir.',
      'Protein ihtiyacını karşılamak için illa toz takviyeye ihtiyaç yoktur. Yumurta, baklagiller, yoğurt, tavuk, balık ve kırmızı et gibi besinlerle günlük ihtiyaç büyük ölçüde karşılanabilir.',
      'Tek öğünde çok yüksek miktarda protein tüketmek yerine, gün içine yayarak almak kas protein sentezi açısından daha verimlidir.',
      'Böbrek fonksiyonlarında bilinen bir sorun yoksa, dengeli beslenen sağlıklı bireyler için yüksek protein alımı güvenlidir; ancak kronik bir rahatsızlığınız varsa mutlaka danışmanınıza bilgi vermelisiniz.',
    ],
  },
  {
    slug: 'aksam-atistirmalarini-kontrol-altina-almak',
    title: 'Akşam Atıştırmalarını Kontrol Altına Almak',
    category: 'Beslenme Mitleri',
    excerpt:
      'Akşam saatlerinde ortaya çıkan atıştırma isteğinin gerçek nedenleri ve bu isteği yönetmek için uygulanabilir stratejiler.',
    readMinutes: 4,
    publishedAt: '2026-05-04',
    author: 'Mısra Çakır',
    coverImage: '/images/blog/aksam-atistirmasi.jpg',
    content: [
      'Akşam atıştırma isteğinin en sık nedeni, gün içinde yeterince doyurucu öğün tüketilmemesidir. Özellikle protein ve lif açısından zayıf öğünler, akşam saatlerinde açlık hissini artırır.',
      'Bir diğer önemli etken ise duygusal açlıktır. Yorgunluk, stres veya sıkılma anlarında ortaya çıkan yeme isteği, fiziksel açlıktan farklıdır ve genellikle belirli bir besine yönelik yoğun bir istek şeklinde kendini gösterir.',
      'Akşam öğününe yeterli miktarda sebze ve protein eklemek, atıştırma isteğini büyük ölçüde azaltır. Ayrıca uyku düzeninin bozuk olması da açlık hormonlarını olumsuz etkileyerek gece atıştırmalarını tetikleyebilir.',
      'Atıştırma isteği geldiğinde bir bardak su içip 10 dakika beklemek, isteğin fiziksel mi yoksa duygusal mı olduğunu ayırt etmede yardımcı olabilir.',
    ],
  },
  {
    slug: 'gebelikte-hangi-besinlere-dikkat-etmeli',
    title: 'Gebelikte Hangi Besinlere Dikkat Etmeli?',
    category: 'Kadın Sağlığı',
    excerpt:
      'Gebelik döneminde artan besin öğesi ihtiyaçları ve dikkat edilmesi gereken gıda güvenliği konuları.',
    readMinutes: 7,
    publishedAt: '2026-04-20',
    author: 'Mısra Çakır',
    coverImage: '/images/blog/gebelik-beslenmesi.jpg',
    content: [
      'Gebelik döneminde folat, demir, kalsiyum, iyot ve D vitamini ihtiyacı belirgin şekilde artar. Bu ihtiyaçların büyük kısmı dengeli beslenmeyle karşılanabilir; bazı durumlarda hekim önerisiyle takviye gerekebilir.',
      'Az pişmiş et, pastörize edilmemiş süt ürünleri ve çiğ deniz ürünleri, gebelik döneminde enfeksiyon riski nedeniyle dikkatle tüketilmelidir.',
      'Merkür oranı yüksek balık türlerinden (örneğin köpekbalığı, kılıçbalığı) kaçınılması, buna karşın somon ve sardalya gibi düşük merkürlü balıkların haftada 2 porsiyona kadar tüketilmesi önerilir.',
      'Bulantının yoğun olduğu ilk trimesterde küçük porsiyonlarla sık öğün tüketmek, kan şekerini dengede tutarak bulantıyı hafifletebilir.',
    ],
  },
  {
    slug: 'antrenman-oncesi-ve-sonrasi-beslenme',
    title: 'Antrenman Öncesi ve Sonrası Beslenme',
    category: 'Sporcu Beslenmesi',
    excerpt:
      'Performansı artırmak ve toparlanmayı hızlandırmak için antrenman çevresinde uygulanabilecek beslenme stratejileri.',
    readMinutes: 5,
    publishedAt: '2026-04-06',
    author: 'Mısra Çakır',
    coverImage: '/images/blog/antrenman-beslenmesi.jpg',
    content: [
      'Antrenmandan 2-3 saat önce kompleks karbonhidrat ve orta düzey protein içeren bir öğün, performans için yeterli enerji deposu sağlar.',
      'Antrenmana çok yakın saatte ağır ve yağlı öğünler tüketmek, sindirim rahatsızlığına yol açabileceğinden önerilmez. Bunun yerine muz veya yulaf gibi hafif seçenekler tercih edilebilir.',
      'Antrenman sonrası 30-60 dakika içinde tüketilen protein ve karbonhidrat kombinasyonu, kas onarımını ve glikojen depolarının yenilenmesini hızlandırır.',
      'Sıvı kaybının fazla olduğu antrenmanlarda, sadece su değil elektrolit dengesini de gözeten bir sıvı alımı toparlanma sürecini destekler.',
    ],
  },
  {
    slug: 'diyabette-karbonhidrat-secimi',
    title: 'Diyabette Karbonhidrat Seçimi Nasıl Yapılmalı?',
    category: 'Hastalıklarda Beslenme',
    excerpt:
      'Tip 2 diyabet yönetiminde karbonhidrat miktarı kadar türünün ve glisemik yükünün de önemini ele alıyoruz.',
    readMinutes: 6,
    publishedAt: '2026-03-22',
    author: 'Mısra Çakır',
    coverImage: '/images/blog/diyabet-karbonhidrat.jpg',
    content: [
      'Diyabet yönetiminde sıklıkla karbonhidratın tamamen kesilmesi gerektiği düşünülür; oysa doğru yaklaşım, karbonhidrat miktarını ve türünü dengelemektir.',
      'Yüksek lifli tam tahıllar, baklagiller ve sebzelerden gelen karbonhidratlar, kan şekerinde işlenmiş ürünlere kıyasla çok daha yavaş ve dengeli bir yükselişe neden olur.',
      'Öğünlerde karbonhidratı tek başına değil; protein, lif ve sağlıklı yağla birlikte tüketmek, kan şekeri yanıtını belirgin şekilde yumuşatır.',
      'Glisemik indeksin yanı sıra porsiyon miktarını da içeren glisemik yük kavramı, gerçek hayatta besin seçiminde daha kullanışlı bir rehberdir.',
    ],
  },
];

export function getPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}

export function getRelatedPosts(slug: string, count = 3) {
  const current = getPostBySlug(slug);
  if (!current) return blogPosts.slice(0, count);
  return blogPosts
    .filter((p) => p.slug !== slug)
    .sort((a, b) => (a.category === current.category ? -1 : 1))
    .slice(0, count);
}
