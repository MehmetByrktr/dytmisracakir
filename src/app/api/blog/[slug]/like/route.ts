import { NextRequest, NextResponse } from 'next/server';
import { getContent, incrementBlogMetric } from '@/lib/content-store';
import { assertSameOrigin, rateLimit, requestIp } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!assertSameOrigin(request)) return NextResponse.json({ error: 'Geçersiz istek.' }, { status: 403 });
  const slug = (await params).slug.slice(0, 160);
  const limit = rateLimit(`like:${requestIp(request)}:${slug}`, 5, 24 * 60 * 60 * 1000);
  if (!limit.allowed) return NextResponse.json({ error: 'Beğeni sınırı aşıldı.' }, { status: 429 });
  const content = await getContent();
  if (!content.blogPosts.some((post) => post.slug === slug && post.status !== 'draft')) return NextResponse.json({ error: 'Yazı bulunamadı.' }, { status: 404 });
  const likes = await incrementBlogMetric(slug, 'likes');
  return NextResponse.json({ likes }, { headers: { 'Cache-Control': 'no-store' } });
}
