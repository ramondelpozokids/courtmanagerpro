import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/infrastructure/supabase/repositories/InMemoryDB';
import { isServerProduction, requireApiUser } from '@/lib/supabase-route-auth';
import { parseStaffNotes } from '@/lib/player-profile';
import { assertUserBelongsToTeam } from '@/lib/security/assert-team-access';

type Params = { params: Promise<{ id: string }> };

function staffUpdateFromBody(body: Record<string, unknown>, existingNotes?: unknown) {
  const { profile_url, notes: notesFromBody, ...rest } = body;
  const notes = {
    ...parseStaffNotes(existingNotes),
    ...parseStaffNotes(notesFromBody),
    ...(typeof profile_url === 'string' && profile_url.trim()
      ? { profile_url: profile_url.trim() }
      : {}),
  };
  const payload: Record<string, unknown> = { ...rest };
  if (Object.keys(notes).length > 0) {
    payload.notes = JSON.stringify(notes);
  }
  // No existe columna profile_url en coaching_staff
  delete payload.profile_url;
  return payload;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();

  if (!isServerProduction()) {
    const idx = db.coachingStaff.findIndex((s) => s.id === id);
    if (idx === -1) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    const next = {
      ...db.coachingStaff[idx],
      ...body,
      ...(typeof body.profile_url === 'string' ? { profile_url: body.profile_url } : {}),
    };
    db.coachingStaff[idx] = next;
    return NextResponse.json({ data: db.coachingStaff[idx] });
  }

  const { supabase, user, response } = await requireApiUser();
  if (response || !user) return response!;

  const { data: existing, error: fetchErr } = await (supabase as any)
    .from('coaching_staff')
    .select('notes, team_id')
    .eq('id', id)
    .maybeSingle();
  if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 500 });
  if (!existing) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

  const access = await assertUserBelongsToTeam(supabase as any, user.id, existing.team_id);
  if (!access.ok) return access.response;

  const payload = staffUpdateFromBody(body, existing.notes);

  const { data, error } = await (supabase as any)
    .from('coaching_staff')
    .update({
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('team_id', existing.team_id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  return NextResponse.json({ data });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  if (!isServerProduction()) {
    const before = db.coachingStaff.length;
    db.coachingStaff = db.coachingStaff.filter((s) => s.id !== id);
    if (db.coachingStaff.length === before) {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  }

  const { supabase, user, response } = await requireApiUser();
  if (response || !user) return response!;

  const { data: existing } = await (supabase as any)
    .from('coaching_staff')
    .select('team_id')
    .eq('id', id)
    .maybeSingle();
  if (!existing?.team_id) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  }

  const access = await assertUserBelongsToTeam(supabase as any, user.id, existing.team_id);
  if (!access.ok) return access.response;

  const { error } = await (supabase as any)
    .from('coaching_staff')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('team_id', existing.team_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
