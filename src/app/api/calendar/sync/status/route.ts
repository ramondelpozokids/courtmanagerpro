import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { isServerProduction, requireApiUser } from '@/lib/supabase-route-auth';
import { DEFAULT_TEAM_ID, resolveTeamId } from '@/lib/team-constants';
import { getCalendarSyncStatus } from '@/application/calendar-sync/runSync';
import { getDemoOfficialMatches } from '@/application/calendar-sync/demoStore';
import type { OfficialMatch } from '@/types';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const teamId = resolveTeamId(req.nextUrl.searchParams.get('team_id') || DEFAULT_TEAM_ID);

  if (isServerProduction()) {
    const { user, response } = await requireApiUser();
    if (response || !user) return response!;
  }

  const supabase = isServerProduction() ? await createSupabaseServerClient() : null;

  try {
    const status = await getCalendarSyncStatus(supabase as any, teamId);
    let matches: OfficialMatch[] = [];

    if (supabase && isServerProduction()) {
      const { data } = await (supabase as any)
        .from('official_matches')
        .select('*')
        .eq('team_id', teamId)
        .eq('is_active', true)
        .order('match_datetime', { ascending: true });
      matches = (data || []) as OfficialMatch[];
    } else {
      matches = getDemoOfficialMatches(teamId);
    }

    const now = Date.now();
    const upcoming = matches
      .filter((m) => m.status === 'pendiente' || m.status === 'en_juego' || m.status === 'aplazado')
      .filter((m) => !m.match_datetime || new Date(m.match_datetime).getTime() >= now - 3 * 3600_000)
      .sort((a, b) => String(a.match_datetime).localeCompare(String(b.match_datetime)));

    const next = upcoming[0] || null;
    const nextFive = upcoming.slice(0, 5);
    const recentResults = matches
      .filter((m) => m.status === 'finalizado')
      .sort((a, b) => String(b.match_datetime).localeCompare(String(a.match_datetime)))
      .slice(0, 8);

    return NextResponse.json({
      data: {
        ...status,
        matches,
        nextMatch: next,
        nextFive,
        recentResults,
        total: matches.length,
      },
    });
  } catch (err) {
    console.error('[api/calendar/sync/status]', err);
    return NextResponse.json({
      data: {
        sourceLabel: 'Real Madrid Oficial',
        syncedOk: true,
        usedCache: true,
        matches: [],
        nextMatch: null,
        nextFive: [],
        recentResults: [],
        error: err instanceof Error ? err.message : String(err),
      },
    });
  }
}
