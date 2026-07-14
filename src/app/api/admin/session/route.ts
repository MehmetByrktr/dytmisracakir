import { NextRequest, NextResponse } from 'next/server';
import { adminCookieName, assertSameOrigin, createAdminSession, noStoreHeaders, rateLimit, requestIp, verifyAdminPassword } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  if (!assertSameOrigin(request)) return NextResponse.json({ error: 'Geçersiz istek.' }, { status: 403, headers: noStoreHeaders() });
  const limit = rateLimit(`admin-login:${requestIp(request)}`, 5, 15 * 60 * 1000);
  if (!limit.allowed) return NextResponse.json({ error: 'Çok fazla deneme. Lütfen daha sonra tekrar deneyin.' }, { status: 429, headers: { ...noStoreHeaders(), 'Retry-After': String(limit.retryAfter) } });

  try {
    const body = await request.json();
    if (!verifyAdminPassword(body?.password)) return NextResponse.json({ error: 'Giriş bilgileri hatalı.' }, { status: 401, headers: noStoreHeaders() });
    const session = createAdminSession();
    const response = NextResponse.json({ ok: true }, { headers: noStoreHeaders() });
    response.cookies.set(adminCookieName(), session.token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: session.maxAge,
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Giriş yapılamadı.' }, { status: 400, headers: noStoreHeaders() });
  }
}

export async function DELETE(request: NextRequest) {
  if (!assertSameOrigin(request)) return NextResponse.json({ error: 'Geçersiz istek.' }, { status: 403, headers: noStoreHeaders() });
  const response = NextResponse.json({ ok: true }, { headers: noStoreHeaders() });
  response.cookies.set(adminCookieName(), '', { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 0 });
  return response;
}
