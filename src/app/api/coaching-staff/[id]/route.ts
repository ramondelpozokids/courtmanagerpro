import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/infrastructure/supabase/repositories/InMemoryDB';
import { isServerProduction, requireApiUser } from '@/lib/supabase-route-auth';

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();

  if (!isServerProduction()) {
    const idx = db.coachingStaff.findIndex((s) => s.id === id);
    if (idx === -1) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    db.coachingStaff[idx] = { ...db.coachingStaff[idx], ...body };
    return NextResponse.json({ data: db.coachingStaff[idx] });
  }

  const { supabase, user, response } = await requireApiUser();
  if (response || !user) return response!;

  const { data, error } = await (supabase as any)
    .from('coaching_staff')
    .update({
      ...body,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
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

  const { error } = await (supabase as any)
    .from('coaching_staff')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
