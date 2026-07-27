import { NextRequest, NextResponse } from 'next/server';
import { getOfficialStoreForSlug } from '@/config/store';
import type { OfficialStoreCheckResult } from '@/modules/official-store/OfficialStoreService';
import { isServerProduction, requireApiUser } from '@/lib/supabase-route-auth';

export const runtime = 'nodejs';

/**
 * Lightweight availability check for the official shop.
 * Does NOT scrape or download product catalogs — only verifies HTTP reachability.
 * Query: ?club=atm | rmb | rmf
 */
export async function GET(req: NextRequest) {
  if (isServerProduction()) {
    const { user, response } = await requireApiUser();
    if (!user) return response!;
  }

  const club = req.nextUrl.searchParams.get('club');
  const store = getOfficialStoreForSlug(club);
  const checkedAt = new Date().toISOString();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    let statusCode: number | null = null;

    let res = await fetch(store.url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'CourtManagerPro/1.0 (store-availability-check)',
        Accept: '*/*',
      },
      cache: 'no-store',
    });

    statusCode = res.status;

    if (res.status === 405 || res.status === 403 || res.status === 501) {
      res = await fetch(store.url, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: {
          'User-Agent': 'CourtManagerPro/1.0 (store-availability-check)',
          Accept: 'text/html',
        },
        cache: 'no-store',
      });
      statusCode = res.status;
      try {
        await res.body?.cancel();
      } catch {
        /* ignore */
      }
    }

    const available = statusCode >= 200 && statusCode < 500 && statusCode !== 404;

    const data: OfficialStoreCheckResult = {
      available,
      status: available ? 'available' : 'unavailable',
      checkedAt,
      statusCode,
      error: available ? null : `HTTP ${statusCode}`,
      url: store.url,
    };

    return NextResponse.json({ data });
  } catch (err) {
    const data: OfficialStoreCheckResult = {
      available: false,
      status: 'unavailable',
      checkedAt,
      statusCode: null,
      error: err instanceof Error ? err.message : String(err),
      url: store.url,
    };
    return NextResponse.json({ data });
  } finally {
    clearTimeout(timeout);
  }
}
