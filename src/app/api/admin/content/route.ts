import { NextRequest, NextResponse } from 'next/server';
import { getContent, saveContent } from '@/lib/content-store';
import { assertSameOrigin, hasValidAdminSession, noStoreHeaders } from '@/lib/security';

export const dynamic = 'force-dynamic';
const unauthorized = () => NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401, headers: noStoreHeaders() });

export async function GET(request: NextRequest) {
  if (!hasValidAdminSession(request)) return unauthorized();
  try {
    return NextResponse.json(await getContent(), { headers: noStoreHeaders() });
  } catch (error) {
    console.error('Admin content read failed', error);
    return NextResponse.json({ error: 'İçerikler okunamadı.' }, { status: 500, headers: noStoreHeaders() });
  }
}

export async function PUT(request: NextRequest) {
  if (!hasValidAdminSession(request)) return unauthorized();
  if (!assertSameOrigin(request)) return NextResponse.json({ error: 'Geçersiz istek.' }, { status: 403, headers: noStoreHeaders() });
  const length = Number(request.headers.get('content-length') || 0);
  if (length > 2 * 1024 * 1024) return NextResponse.json({ error: 'İstek çok büyük.' }, { status: 413, headers: noStoreHeaders() });

  try {
    const body = await request.json();
    if (!body || typeof body !== 'object' || !body.site || !Array.isArray(body.blogPosts) || !Array.isArray(body.services)) {
      return NextResponse.json({ error: 'Geçersiz içerik yapısı.' }, { status: 400, headers: noStoreHeaders() });
    }
    const current = await getContent();
    const incomingPosts = body.blogPosts;
    const blogPosts = incomingPosts.map((post: Record<string, unknown>) => {
      const existing = current.blogPosts.find((item) => item.slug === post.slug);
      return { ...post, views: Math.max(Number(post.views || 0), Number(existing?.views || 0)), likes: Math.max(Number(post.likes || 0), Number(existing?.likes || 0)) };
    });
    const saved = await saveContent({
      ...current,
      ...body,
      blogPosts,
      appointments: Array.isArray(body.appointments) ? body.appointments : current.appointments,
      messages: Array.isArray(body.messages) ? body.messages : current.messages,
    });
    return NextResponse.json(saved, { headers: noStoreHeaders() });
  } catch (error) {
    console.error('Admin content save failed', error);
    return NextResponse.json({ error: 'İçerik kaydedilemedi.' }, { status: 500, headers: noStoreHeaders() });
  }
}
