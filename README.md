# Dyt. Mısra Çakır — yayın rehberi

Next.js 15, TypeScript, Tailwind CSS, Supabase ve Cloudinary kullanan yönetilebilir diyetisyen sitesidir. Üretimde yerel diske veri veya görsel yazılmaz.

## 1. Supabase kurulumu

1. Supabase projesini açın.
2. **SQL Editor → New query** bölümüne girin.
3. [`supabase/schema.sql`](supabase/schema.sql) dosyasının tamamını çalıştırın.
4. **Project Settings → API** bölümünden Project URL ve `service_role` anahtarını alın.

Tablolarda RLS açıktır. `anon` ve `authenticated` rollerine erişim verilmez; bütün özel veriler yalnızca Render sunucusundaki `service_role` anahtarıyla okunur. `SUPABASE_SERVICE_ROLE_KEY` kesinlikle `NEXT_PUBLIC_` önekiyle tanımlanmamalıdır.

İlk üretim isteğinde `site_content` boşsa repodaki mevcut `storage/content.json` içeriği Supabase'e otomatik aktarılır. Sonraki bütün içerik, randevu, mesaj ve blog sayaçları Supabase'de tutulur.

## 2. Cloudinary kurulumu

Cloudinary Dashboard'dan Cloud Name, API Key ve API Secret değerlerini alın. Görseller admin panelinden sunucu üzerinden imzalı şekilde yüklenir; API Secret tarayıcıya gönderilmez. Yerel `/api/uploads` yüklemeleri kapalıdır.

## 3. Render'a yükleme

Repoyu GitHub/GitLab'a gönderip Render'da **New → Blueprint** seçerek kökteki [`render.yaml`](render.yaml) dosyasını kullanın. Manuel servis açacaksanız:

- Service type: **Web Service**
- Runtime: **Node**
- Node: **20.18.1**
- Build command: `npm ci && npm run build`
- Start command: `npm start`
- Health check: `/api/health`
- Auto deploy: Açık

Render ortam değişkenleri:

```env
NEXT_PUBLIC_SITE_URL=https://servis-adiniz.onrender.com
SUPABASE_URL=https://projeniz.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLOUDINARY_FOLDER=dietisyen-site
ADMIN_PASSWORD=benzersiz-en-az-12-karakterli-guclu-sifre
ADMIN_SESSION_SECRET=en-az-32-karakterli-rastgele-gizli-deger
```

`ADMIN_SESSION_SECRET` için parola yöneticisinden en az 32 karakterlik rastgele değer üretin. Blueprint kullanıldığında Render bu değeri otomatik üretebilir.

Özel alan adı bağlandıktan sonra `NEXT_PUBLIC_SITE_URL` değerini `https://alanadiniz.com` olarak değiştirin ve admin panelindeki **Web sitesi adresi** alanını da aynı adres yapın.

## 4. Admin ve güvenlik

Panel `/admin` adresindedir. Admin:

- Metadata, `robots.txt` ve `X-Robots-Tag` ile `noindex, nofollow, noarchive` olarak kapalıdır.
- Parolayı localStorage/sessionStorage içinde saklamaz.
- Sekiz saatlik, imzalı, `HttpOnly`, `SameSite=Strict`, üretimde `Secure` çerez kullanır.
- Zamanlamaya dayanıklı parola doğrulaması, giriş hız sınırı, CSRF/Origin kontrolü ve `no-store` cevapları kullanır.
- İçerik HTML'ini sunucuda temizleyerek XSS riskini sınırlar.

İletişim, randevu, sayaç ve yükleme uçlarında veri boyutu, alan uzunluğu, MIME türü, Origin ve hız sınırı kontrolleri bulunur. Güvenlik başlıkları CSP, HSTS, frame engeli, MIME sniffing engeli, referrer ve permissions politikalarını içerir.

`robots.txt` tek başına güvenlik mekanizması değildir; panel verileri oturum doğrulaması olmadan API'den dönmez.

## 5. Yerel geliştirme

`.env.example` dosyasını `.env.local` olarak kopyalayıp gerçek değerleri ekleyin:

```bash
npm install
npm run dev
```

Supabase değişkenleri yerelde verilmezse geliştirme amacıyla `storage/content.json` kullanılır. Bu yedek davranış üretimde devre dışıdır. Yerel yedek admin parolası `misra2026-dev` değeridir; gerçek ortamda mutlaka `ADMIN_PASSWORD` kullanılmalıdır.

## Doğrulama

```bash
npm run typecheck
npm run lint
npm run build
npm audit --omit=dev
```

Yayın build'i Next.js `15.5.18` ve Node.js 20.x ile doğrulanmıştır.
