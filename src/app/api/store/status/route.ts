import { NextResponse } from 'next/server';
import { OFFICIAL_STORE } from '@/config/store';
import type { OfficialStoreCheckResult } from '@/modules/official-store/OfficialStoreService';
import { isServerProduction, requireApiUser } from '@/lib/supabase-route-auth';

export const runtime = 'nodejs';

/**
 * Lightweight availability check for the official shop.
 * Does NOT scrape or download product catalogs — only verifies HTTP reachability.
 */
export async function GET() {
  if (isServerProduction()) {
    const { user, response } = await requireApiUser();
    if (!user) return response!;
  }

  const checkedAt = new Date().toISOString();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    let statusCode: number | null = null;

    // Prefer HEAD; some CDNs block it — fall back to GET without reading body fully.
    let res = await fetch(OFFICIAL_STORE.url, {
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
      res = await fetch(OFFICIAL_STORE.url, {
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
      // Drain minimally then cancel — do not parse products
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
      url: OFFICIAL_STORE.url,
    };

    return NextResponse.json({ data });
  } catch (err) {
    const data: OfficialStoreCheckResult = {
      available: false,
      status: 'unavailable',
      checkedAt,
      statusCode: null,
      error: err instanceof Error ? err.message : String(err),
      url: OFFICIAL_STORE.url,
    };
    return NextResponse.json({ data });
  } finally {
    clearTimeout(timeout);
  }
}
