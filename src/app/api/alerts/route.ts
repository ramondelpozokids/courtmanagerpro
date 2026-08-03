import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { DEFAULT_TEAM_ID, resolveTeamId } from '@/lib/team-constants';
import { assertUserBelongsToTeam } from '@/lib/security/assert-team-access';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const supabase = (await createSupabaseServerClient()) as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const teamId = resolveTeamId(searchParams.get('team_id'));
  const unreadOnly = searchParams.get('unread') === 'true';

  const access = await assertUserBelongsToTeam(supabase, user.id, teamId);
  if (!access.ok) return access.response;

  let query = supabase
    .from('alerts')
    .select('*')
    .eq('team_id', teamId)
    .eq('is_dismissed', false)
    .order('created_at', { ascending: false })
    .limit(100);

  if (unreadOnly) query = query.eq('is_read', false);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  const supabase = (await createSupabaseServerClient()) as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, action } = await req.json();
  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'id requerido' }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from('alerts')
    .select('team_id')
    .eq('id', id)
    .maybeSingle();

  if (!existing?.team_id) {
    return NextResponse.json({ error: 'Alerta no encontrada' }, { status: 404 });
  }

  const access = await assertUserBelongsToTeam(supabase, user.id, existing.team_id);
  if (!access.ok) return access.response;

  const updates = action === 'dismiss'
    ? { is_dismissed: true }
    : { is_read: true, read_at: new Date().toISOString(), read_by: user.id };

  const { data, error } = await supabase
    .from('alerts')
    .update(updates)
    .eq('id', id)
    .eq('team_id', existing.team_id)
    .select()
    .single();

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

  if (body.allRead) {
    const { error } = await supabase
      .from('alerts')
      .update({ is_read: true, read_at: new Date().toISOString(), read_by: user.id })
      .eq('team_id', teamId)
      .eq('is_read', false);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (body.alertId) {
    const { error } = await supabase
      .from('alerts')
      .update({ is_read: true, read_at: new Date().toISOString(), read_by: user.id })
      .eq('id', body.alertId)
      .eq('team_id', teamId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
}

