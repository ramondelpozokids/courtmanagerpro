import { NextRequest, NextResponse } from 'next/server';
import { isServerProduction } from '@/lib/supabase-route-auth';
import {
  getEquipmentStore,
  pushHistory,
  memberFullName,
  uid,
  nowIso,
} from '@/modules/equipment-team/store';
import type { EquipmentTeamMember } from '@/modules/equipment-team/types';
import { actorFromUser, insertHistory, teamIdFrom, withEquipmentAuth } from '@/modules/equipment-team/server';

function mapBody(body: Record<string, unknown>, teamId: string, existing?: EquipmentTeamMember): Partial<EquipmentTeamMember> {
  return {
    team_id: teamId,
    first_name: String(body.first_name ?? existing?.first_name ?? ''),
    last_name: String(body.last_name ?? existing?.last_name ?? ''),
    role: String(body.role ?? existing?.role ?? 'Utillero'),
    phone_mobile: (body.phone_mobile as string | null | undefined) ?? existing?.phone_mobile ?? null,
    phone_landline: (body.phone_landline as string | null | undefined) ?? existing?.phone_landline ?? null,
    email: (body.email as string | null | undefined) ?? existing?.email ?? null,
    whatsapp: (body.whatsapp as string | null | undefined) ?? existing?.whatsapp ?? null,
    photo_url: (body.photo_url as string | null | undefined) ?? existing?.photo_url ?? null,
    joined_at: (body.joined_at as string | null | undefined) ?? existing?.joined_at ?? null,
    is_active: typeof body.is_active === 'boolean' ? body.is_active : (existing?.is_active ?? true),
    notes: (body.notes as string | null | undefined) ?? existing?.notes ?? null,
    last_seen_at: (body.last_seen_at as string | null | undefined) ?? existing?.last_seen_at ?? null,
  };
}

export async function GET(req: NextRequest) {
  const teamId = teamIdFrom(req);
  const id = req.nextUrl.searchParams.get('id');

  if (!isServerProduction()) {
    const store = getEquipmentStore();
    const list = store.members.filter((m) => m.team_id === teamId);
    if (id) {
      const member = list.find((m) => m.id === id);
      if (!member) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
      return NextResponse.json({ data: member });
    }
    return NextResponse.json({ data: list });
  }

  const { supabase, user, response } = await withEquipmentAuth();
  if (response || !user || !supabase) return response!;
  const pg = supabase as any;

  if (id) {
    const { data, error } = await pg
      .from('equipment_team_members')
      .select('*')
      .eq('id', id)
      .eq('team_id', teamId)
      .maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    return NextResponse.json({ data });
  }

  const { data, error } = await pg
    .from('equipment_team_members')
    .select('*')
    .eq('team_id', teamId)
    .order('last_name');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const teamId = teamIdFrom(req, body);
    const fields = mapBody(body, teamId);
    if (!fields.first_name || !fields.last_name) {
      return NextResponse.json({ error: 'nombre y apellidos obligatorios' }, { status: 400 });
    }

    if (!isServerProduction()) {
      const t = nowIso();
      const member: EquipmentTeamMember = {
        id: uid('eq_m'),
        team_id: teamId,
        first_name: fields.first_name!,
        last_name: fields.last_name!,
        role: fields.role || 'Utillero',
        phone_mobile: fields.phone_mobile ?? null,
        phone_landline: fields.phone_landline ?? null,
        email: fields.email ?? null,
        whatsapp: fields.whatsapp ?? null,
        photo_url: fields.photo_url ?? null,
        joined_at: fields.joined_at ?? t.slice(0, 10),
        is_active: fields.is_active ?? true,
        notes: fields.notes ?? null,
        last_seen_at: fields.last_seen_at ?? null,
        created_at: t,
        updated_at: t,
      };
      getEquipmentStore().members.push(member);
      pushHistory(teamId, 'Carlos Rodríguez Kobe', 'creó compañero', 'member', member.id, memberFullName(member));
      return NextResponse.json({ data: member }, { status: 201 });
    }

    const { supabase, user, response } = await withEquipmentAuth();
    if (response || !user || !supabase) return response!;
    const pg = supabase as any;
    const actor = actorFromUser(user);

    const { data, error } = await pg
      .from('equipment_team_members')
      .insert({ ...fields, team_id: teamId })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    await insertHistory(pg, teamId, actor, 'creó compañero', 'member', data.id, memberFullName(data));
    return NextResponse.json({ data }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const id = body.id as string;
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    const teamId = teamIdFrom(req, body);

    if (!isServerProduction()) {
      const store = getEquipmentStore();
      const idx = store.members.findIndex((m) => m.id === id && m.team_id === teamId);
      if (idx === -1) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
      const updated = {
        ...store.members[idx],
        ...mapBody(body, teamId, store.members[idx]),
        updated_at: nowIso(),
      } as EquipmentTeamMember;
      store.members[idx] = updated;
      pushHistory(teamId, 'Carlos Rodríguez Kobe', 'actualizó compañero', 'member', id, memberFullName(updated));
      return NextResponse.json({ data: updated });
    }

    const { supabase, user, response } = await withEquipmentAuth();
    if (response || !user || !supabase) return response!;
    const pg = supabase as any;
    const actor = actorFromUser(user);
    const patch = mapBody(body, teamId);
    delete (patch as { team_id?: string }).team_id;

    const { data, error } = await pg
      .from('equipment_team_members')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('team_id', teamId)
      .select()
      .single();
    if (error || !data) {
      return NextResponse.json({ error: error?.message || 'No encontrado' }, { status: 404 });
    }
    await insertHistory(pg, teamId, actor, 'actualizó compañero', 'member', id, memberFullName(data));
    return NextResponse.json({ data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    const teamId = teamIdFrom(req);

    if (!isServerProduction()) {
      const store = getEquipmentStore();
      const idx = store.members.findIndex((m) => m.id === id && m.team_id === teamId);
      if (idx === -1) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
      const [removed] = store.members.splice(idx, 1);
      pushHistory(teamId, 'Carlos Rodríguez Kobe', 'eliminó compañero', 'member', id, memberFullName(removed));
      return NextResponse.json({ success: true });
    }

    const { supabase, user, response } = await withEquipmentAuth();
    if (response || !user || !supabase) return response!;
    const pg = supabase as any;
    const actor = actorFromUser(user);

    const { error } = await pg
      .from('equipment_team_members')
      .delete()
      .eq('id', id)
      .eq('team_id', teamId);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    await insertHistory(pg, teamId, actor, 'eliminó compañero', 'member', id, null);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
