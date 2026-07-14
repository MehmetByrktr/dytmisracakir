import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ error: 'Yerel yüklemeler devre dışı. Görseli admin panelinden Cloudinary’ye yeniden yükleyin.' }, { status: 410, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } });
}
