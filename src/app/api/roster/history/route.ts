import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { isServerProduction, requireApiUser } from '@/lib/supabase-route-auth';
import { DEFAULT_TEAM_ID, resolveTeamId } from '@/lib/team-constants';
import { getDemoRosterHistory } from '@/application/roster-sync/demoStore';

export async function GET(req: NextRequest) {
  const teamId = resolveTeamId(req.nextUrl.searchParams.get('team_id') || DEFAULT_TEAM_ID);
  const limit = Math.min(Number(req.nextUrl.searchParams.get('limit') || 50), 200);

  if (isServerProduction()) {
    const { supabase, user, response } = await requireApiUser();
    if (response || !user) return response!;

    const { data, error } = await (supabase as any)
      .from('roster_history')
      .select('*')
      .eq('team_id', teamId)
      .order('changed_at', { ascending: false })
      .limit(limit);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data: data ?? [] });
  }

  return NextResponse.json({ data: getDemoRosterHistory(teamId, limit) });
}
