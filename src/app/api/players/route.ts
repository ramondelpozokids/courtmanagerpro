import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { createPlayerSchema } from '@/lib/validators';
import { DEFAULT_TEAM_ID, resolveTeamId } from '@/lib/team-constants';
import { assertUserBelongsToTeam } from '@/lib/security/assert-team-access';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const supabase = (await createSupabaseServerClient()) as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const teamId = searchParams.get('team_id');
  const search = searchParams.get('search');
  const position = searchParams.get('position');
  const active = searchParams.get('active') !== 'false';

  if (!teamId) return NextResponse.json({ error: 'team_id requerido' }, { status: 400 });

  const access = await assertUserBelongsToTeam(supabase, user.id, teamId);
  if (!access.ok) return access.response;

  let query = supabase
    .from('players')
    .select('*')
    .eq('team_id', teamId)
    .eq('is_active', active)
    .order('dorsal');

  if (search) {
    const safe = search.replace(/[%_,]/g, '').slice(0, 80);
    if (safe) query = query.ilike('full_name', `%${safe}%`);
  }
  if (position) query = query.eq('position', position);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data, count } as any);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const supabase = (await createSupabaseServerClient()) as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const teamId = resolveTeamId(body.team_id || DEFAULT_TEAM_ID);
  const access = await assertUserBelongsToTeam(supabase, user.id, teamId);
  if (!access.ok) return access.response;

  const parsed = createPlayerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({
      error: 'Datos inválidos',
      details: parsed.error.flatten(),
    }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('players')
    .insert({ ...parsed.data, team_id: teamId })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data }, { status: 201 });
}
