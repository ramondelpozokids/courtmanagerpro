import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { assertUserBelongsToTeam } from '@/lib/security/assert-team-access';
import { getClubDataWriteClient } from '@/lib/security/production-write-client';

interface Params {
  params: Promise<{ id: string }>
}

const PLAYER_PATCH_KEYS = [
  'dorsal',
  'full_name',
  'position',
  'nationality',
  'birth_date',
  'photo_url',
  'jersey_name',
  'notes',
  'shirt_size',
  'shorts_size',
  'shoe_size',
  'jacket_size',
  'underwear_size',
  'sock_size',
  'suit_size',
  'hat_size',
  'metadata',
  'is_active',
] as const;

function pickPlayerPatch(body: Record<string, unknown>) {
  const patch: Record<string, unknown> = {};
  for (const key of PLAYER_PATCH_KEYS) {
    if (Object.prototype.hasOwnProperty.call(body, key) && body[key] !== undefined) {
      patch[key] = body[key];
    }
  }
  return patch;
}

export async function GET(_req: NextRequest, { params }: Params): Promise<NextResponse> {
  const { id } = await params;
  const supabase = (await createSupabaseServerClient()) as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = (await getClubDataWriteClient()) as any;
  const { data, error } = await db
    .from('players')
    .select(`
      *,
      assignments:item_assignments(
        *,
        item:inventory_items(id, name, category, image_url)
      )
    `)
    .eq('id', id)
    .single();

  if (error || !data) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

  const access = await assertUserBelongsToTeam(supabase, user.id, data.team_id);
  if (!access.ok) return access.response;

  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: Params): Promise<NextResponse> {
  const { id } = await params;
  const supabase = (await createSupabaseServerClient()) as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const db = (await getClubDataWriteClient()) as any;

  const { data: existing, error: fetchErr } = await db
    .from('players')
    .select('id, team_id, metadata')
    .eq('id', id)
    .maybeSingle();
  if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 500 });
  if (!existing) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

  const access = await assertUserBelongsToTeam(supabase, user.id, existing.team_id);
  if (!access.ok) return access.response;

  const patch = pickPlayerPatch(body as Record<string, unknown>);
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'Nada que guardar' }, { status: 400 });
  }

  if (patch.metadata && typeof patch.metadata === 'object' && !Array.isArray(patch.metadata)) {
    const prev =
      existing.metadata && typeof existing.metadata === 'object' && !Array.isArray(existing.metadata)
        ? (existing.metadata as Record<string, unknown>)
        : {};
    patch.metadata = { ...prev, ...(patch.metadata as Record<string, unknown>) };
  }

  patch.updated_at = new Date().toISOString();

  const { data, error } = await db
    .from('players')
    .update(patch)
    .eq('id', id)
    .eq('team_id', existing.team_id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: Params): Promise<NextResponse> {
  const { id } = await params;
  const supabase = (await createSupabaseServerClient()) as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = (await getClubDataWriteClient()) as any;
  const { data: existing } = await db
    .from('players')
    .select('team_id')
    .eq('id', id)
    .maybeSingle();
  if (!existing?.team_id) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  }

  const access = await assertUserBelongsToTeam(supabase, user.id, existing.team_id);
  if (!access.ok) return access.response;

  const { error } = await db
    .from('players')
    .update({ is_active: false, deactivated_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('team_id', existing.team_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
