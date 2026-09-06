import { NextRequest, NextResponse } from 'next/server';
import { fetchRmbOfficialNews } from '@/application/news/rmbOfficialNews';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const club = (req.nextUrl.searchParams.get('club') || '').toLowerCase();
  if (club !== 'rmb') {
    return NextResponse.json({ data: [] });
  }

  try {
    const items = await fetchRmbOfficialNews();
    return NextResponse.json({ data: items, source: 'realmadrid.com' });
  } catch (err) {
    console.error('[api/news/official]', err);
    return NextResponse.json({
      data: [],
      error: err instanceof Error ? err.message : 'No se pudieron cargar las noticias oficiales',
    });
  }
}
