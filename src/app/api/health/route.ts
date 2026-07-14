import { NextResponse } from 'next/server';
import { getSupabaseAdmin, hasSupabaseConfig } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const configured = hasSupabaseConfig() && Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
  if (!configured) return NextResponse.json({ ok: false }, { status: 503, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } });
  try {
    const { error } = await getSupabaseAdmin().from('site_content').select('id').limit(1);
    return NextResponse.json({ ok: !error }, { status: error ? 503 : 200, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } });
  }
}
