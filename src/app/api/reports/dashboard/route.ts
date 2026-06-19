import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { resolveTeamId } from '@/lib/team-constants';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const supabase = (await createSupabaseServerClient()) as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const teamId = resolveTeamId(searchParams.get('team_id'));

  const { data, error } = await supabase.rpc('get_dashboard_stats', { p_team_id: teamId });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
