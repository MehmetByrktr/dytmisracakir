import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { assertSameOrigin, hasValidAdminSession, noStoreHeaders, rateLimit, requestIp } from '@/lib/security';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/x-icon', 'image/vnd.microsoft.icon']);

function configureCloudinary() {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud_name || !api_key || !api_secret) throw new Error('Cloudinary ortam değişkenleri eksik.');
  cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
}

export async function POST(request: NextRequest) {
  if (!hasValidAdminSession(request)) return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401, headers: noStoreHeaders() });
  if (!assertSameOrigin(request)) return NextResponse.json({ error: 'Geçersiz istek.' }, { status: 403, headers: noStoreHeaders() });
  const limit = rateLimit(`upload:${requestIp(request)}`, 30, 60 * 60 * 1000);
  if (!limit.allowed) return NextResponse.json({ error: 'Yükleme sınırı aşıldı.' }, { status: 429, headers: { ...noStoreHeaders(), 'Retry-After': String(limit.retryAfter) } });

  try {
    configureCloudinary();
    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) return NextResponse.json({ error: 'Dosya bulunamadı.' }, { status: 400, headers: noStoreHeaders() });
    if (file.size <= 0 || file.size > 6 * 1024 * 1024) return NextResponse.json({ error: 'Dosya en fazla 6 MB olabilir.' }, { status: 400, headers: noStoreHeaders() });
    if (!allowedTypes.has(file.type)) return NextResponse.json({ error: 'Desteklenmeyen görsel türü.' }, { status: 400, headers: noStoreHeaders() });

    const dataUri = `data:${file.type};base64,${Buffer.from(await file.arrayBuffer()).toString('base64')}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: process.env.CLOUDINARY_FOLDER || 'dietisyen-site',
      resource_type: 'image',
      use_filename: false,
      unique_filename: true,
      overwrite: false,
    });
    return NextResponse.json({ url: result.secure_url, publicId: result.public_id }, { headers: noStoreHeaders() });
  } catch (error) {
    console.error('Cloudinary upload failed', error);
    return NextResponse.json({ error: 'Görsel yüklenemedi.' }, { status: 500, headers: noStoreHeaders() });
  }
}
