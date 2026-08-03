import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_TEAM_ID, resolveTeamId } from '@/lib/team-constants';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { assertUserBelongsToTeam } from '@/lib/security/assert-team-access';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const supabase = (await createSupabaseServerClient()) as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const teamId = resolveTeamId(searchParams.get('team_id'));
  const status = searchParams.get('status');
  const priority = searchParams.get('priority');

  const access = await assertUserBelongsToTeam(supabase, user.id, teamId);
  if (!access.ok) return access.response;

  let query = supabase
    .from('requests')
    .select(`
      *,
      requester:profiles!requester_id(id, full_name, avatar_url),
      player:players(id, full_name, dorsal),
      items:request_items(*)
    `)
    .eq('team_id', teamId)
    .order('created_at', { ascending: false });

  if (status) query = query.eq('status', status);
  if (priority) query = query.eq('priority', priority);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const supabase = (await createSupabaseServerClient()) as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const teamId = resolveTeamId(body.team_id || DEFAULT_TEAM_ID);
  const access = await assertUserBelongsToTeam(supabase, user.id, teamId);
  if (!access.ok) return access.response;

  if (body.requestId && body.action) {
    const allowed = ['APPROVE', 'REJECT', 'DELIVER'] as const;
    if (!allowed.includes(body.action)) {
      return NextResponse.json({ error: 'Acción no permitida' }, { status: 400 });
    }

    const updates: Record<string, string> = {};
    if (body.action === 'APPROVE') {
      updates.status = 'aprobada';
      updates.approved_at = new Date().toISOString();
    } else if (body.action === 'REJECT') {
      updates.status = 'rechazada';
    } else if (body.action === 'DELIVER') {
      updates.status = 'completada';
      updates.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('requests')
      .update(updates)
      .eq('id', body.requestId)
      .eq('team_id', teamId)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  const title = typeof body.title === 'string' ? body.title.slice(0, 200) : '';
  if (!title) {
    return NextResponse.json({ error: 'Título requerido' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('requests')
    .insert({
      title,
      description: typeof body.description === 'string' ? body.description.slice(0, 2000) : null,
      player_id: body.player_id || null,
      quantity: Number.isFinite(Number(body.quantity))
        ? Math.max(1, Math.min(999, Number(body.quantity)))
        : 1,
      size: typeof body.size === 'string' ? body.size.slice(0, 20) : 'XL',
      team_id: teamId,
      requester_id: user.id,
      status: 'pendiente',
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
