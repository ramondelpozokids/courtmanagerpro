import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { isServerProduction, requireApiUser } from '@/lib/supabase-route-auth';
import { DEFAULT_TEAM_ID, resolveTeamId } from '@/lib/team-constants';
import { getRosterSyncStatus } from '@/application/roster-sync/runSync';

export async function GET(req: NextRequest) {
  const teamId = resolveTeamId(req.nextUrl.searchParams.get('team_id') || DEFAULT_TEAM_ID);

  if (isServerProduction()) {
    const { user, response } = await requireApiUser();
    if (response || !user) return response!;
  }

  const supabase = isServerProduction() ? await createSupabaseServerClient() : null;

  try {
    const status = await getRosterSyncStatus(supabase as any, teamId);
    return NextResponse.json({
      data: {
        ...status,
        plantillaLabel: 'Plantilla sincronizada',
        source: status.sourceLabel,
      },
    });
  } catch (err) {
    console.error('[api/roster/sync/status]', err);
    return NextResponse.json({
      data: {
        lastSync: null,
        sourceLabel: 'Real Madrid Oficial',
        source: 'Real Madrid Oficial',
        plantillaLabel: 'Plantilla sincronizada',
        hasPendingChanges: false,
        syncedOk: true,
        usedCache: true,
        lastUpdatedAt: null,
        error: err instanceof Error ? err.message : String(err),
      },
    });
  }
}
