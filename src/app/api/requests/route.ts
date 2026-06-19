import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_TEAM_ID, resolveTeamId } from '@/lib/team-constants';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const supabase = (await createSupabaseServerClient()) as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const teamId = resolveTeamId(searchParams.get('team_id'));
  const status = searchParams.get('status');
  const priority = searchParams.get('priority');

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

  // If status workflow update
  if (body.requestId && body.action) {
    const updates: any = {};
    if (body.action === "APPROVE") {
      updates.status = "aprobada";
      updates.approved_at = new Date().toISOString();
    } else if (body.action === "REJECT") {
      updates.status = "rechazada";
    } else if (body.action === "DELIVER") {
      updates.status = "completada";
      updates.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('requests')
      .update(updates)
      .eq('id', body.requestId)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  // Else, new request
  const { data, error } = await supabase
    .from('requests')
    .insert({
      title: body.title,
      description: body.description,
      player_id: body.player_id,
      quantity: body.quantity || 1,
      size: body.size || "XL",
      team_id: DEFAULT_TEAM_ID,
      requester_id: user.id,
      status: 'pendiente'
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
