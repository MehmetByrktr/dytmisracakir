import 'server-only';
import crypto from 'node:crypto';
import type { NextRequest } from 'next/server';

const ADMIN_COOKIE = 'admin_session';
const SESSION_TTL_SECONDS = 8 * 60 * 60;
const attempts = new Map<string, { count: number; resetAt: number }>();

function digest(value: string) {
  return crypto.createHash('sha256').update(value).digest();
}

function safeEqual(left: string, right: string) {
  return crypto.timingSafeEqual(digest(left), digest(right));
}

function sessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    if (process.env.NODE_ENV === 'production' || process.env.RENDER) throw new Error('ADMIN_SESSION_SECRET en az 32 karakter olmalıdır.');
    return 'development-only-session-secret-change-me';
  }
  return secret;
}

function sign(value: string) {
  return crypto.createHmac('sha256', sessionSecret()).update(value).digest('base64url');
}

export function verifyAdminPassword(password: unknown) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || expected.length < 12) {
    if (process.env.NODE_ENV === 'production' || process.env.RENDER) throw new Error('ADMIN_PASSWORD en az 12 karakter olmalıdır.');
    return typeof password === 'string' && safeEqual(password, 'misra2026-dev');
  }
  return typeof password === 'string' && safeEqual(password, expected);
}

export function createAdminSession() {
  const expires = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `${expires}.${crypto.randomBytes(18).toString('base64url')}`;
  return { token: `${payload}.${sign(payload)}`, maxAge: SESSION_TTL_SECONDS };
}

export function hasValidAdminSession(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  const [expiresText, nonce, signature] = token.split('.');
  if (!expiresText || !nonce || !signature) return false;
  const payload = `${expiresText}.${nonce}`;
  if (!safeEqual(signature, sign(payload))) return false;
  const expires = Number(expiresText);
  return Number.isFinite(expires) && expires > Math.floor(Date.now() / 1000);
}

export function adminCookieName() {
  return ADMIN_COOKIE;
}

export function assertSameOrigin(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try {
    const originUrl = new URL(origin);
    const forwardedHost = request.headers.get('x-forwarded-host') || request.headers.get('host');
    return Boolean(forwardedHost) && originUrl.host === forwardedHost;
  } catch {
    return false;
  }
}

export function requestIp(request: NextRequest) {
  return request.headers.get('cf-connecting-ip') || request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  current.count += 1;
  if (attempts.size > 5000) {
    for (const [entryKey, entry] of attempts) if (entry.resetAt <= now) attempts.delete(entryKey);
  }
  return { allowed: current.count <= limit, retryAfter: Math.ceil((current.resetAt - now) / 1000) };
}

export function noStoreHeaders() {
  return { 'Cache-Control': 'no-store, private', 'X-Robots-Tag': 'noindex, nofollow, noarchive' };
}
