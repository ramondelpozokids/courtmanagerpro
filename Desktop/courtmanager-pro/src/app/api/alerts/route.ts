import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const supabase = (await createSupabaseServerClient()) as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const teamId = searchParams.get('team_id') || 'team-acb-123';
  const unreadOnly = searchParams.get('unread') === 'true';

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

  const updates = action === 'dismiss'
    ? { is_dismissed: true }
    : { is_read: true, read_at: new Date().toISOString(), read_by: user.id };

  const { data, error } = await supabase
    .from('alerts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

// Support POST for markAllAsRead (which matches our useAlerts hook calls!)
export async function POST(req: NextRequest): Promise<NextResponse> {
  const supabase = (await createSupabaseServerClient()) as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();

  if (body.allRead) {
    const { error } = await supabase
      .from('alerts')
      .update({ is_read: true, read_at: new Date().toISOString(), read_by: user.id })
      .eq('team_id', 'team-acb-123')
      .eq('is_read', false);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (body.alertId) {
    const { error } = await supabase
      .from('alerts')
      .update({ is_read: true, read_at: new Date().toISOString(), read_by: user.id })
      .eq('id', body.alertId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
}
