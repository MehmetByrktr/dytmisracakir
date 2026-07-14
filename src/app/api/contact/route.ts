import { NextRequest, NextResponse } from 'next/server';
import { createContactMessage } from '@/lib/content-store';
import { assertSameOrigin, rateLimit, requestIp } from '@/lib/security';
import type { ContactRecord } from '@/types';

export const dynamic = 'force-dynamic';
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const text = (value: unknown, max: number) => typeof value === 'string' ? value.trim().slice(0, max) : '';

export async function POST(request: NextRequest) {
  if (!assertSameOrigin(request)) return NextResponse.json({ error: 'Geçersiz istek.' }, { status: 403 });
  const limit = rateLimit(`contact:${requestIp(request)}`, 8, 30 * 60 * 1000);
  if (!limit.allowed) return NextResponse.json({ error: 'Çok fazla mesaj gönderdiniz. Lütfen daha sonra tekrar deneyin.' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } });
  if (Number(request.headers.get('content-length') || 0) > 16 * 1024) return NextResponse.json({ error: 'İstek çok büyük.' }, { status: 413 });

  try {
    const body = await request.json();
    if (body.website) return NextResponse.json({ ok: true });
    const name = text(body.name, 100);
    const email = text(body.email, 160).toLowerCase();
    const message = text(body.message, 3000);
    if (name.length < 2 || !emailPattern.test(email) || message.length < 10) {
      return NextResponse.json({ error: 'Lütfen zorunlu alanları geçerli biçimde doldurun.' }, { status: 400 });
    }
    const record: ContactRecord = {
      id: crypto.randomUUID(), createdAt: new Date().toISOString(), status: 'Yeni',
      name, email, phone: text(body.phone, 30), message,
    };
    await createContactMessage(record);
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Contact message create failed', error);
    return NextResponse.json({ error: 'Mesaj kaydedilemedi.' }, { status: 500 });
  }
}
