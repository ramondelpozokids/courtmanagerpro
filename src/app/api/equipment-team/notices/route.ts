import { NextRequest, NextResponse } from 'next/server';
import { isServerProduction } from '@/lib/supabase-route-auth';
import {
  getEquipmentStore,
  pushHistory,
  uid,
  nowIso,
} from '@/modules/equipment-team/store';
import type { EquipmentNotice, EquipmentNoticeType } from '@/modules/equipment-team/types';
import { noticeSeverity, notifyEquipmentEvent } from '@/modules/equipment-team/notifications';
import { actorFromUser, insertHistory, teamIdFrom, withEquipmentAuth } from '@/modules/equipment-team/server';

export async function GET(req: NextRequest) {
  const teamId = teamIdFrom(req);

  if (!isServerProduction()) {
    const notices = getEquipmentStore()
      .notices.filter((n) => n.team_id === teamId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
    return NextResponse.json({ data: notices });
  }

  const { supabase, user, response } = await withEquipmentAuth();
  if (response || !user || !supabase) return response!;

  const { data, error } = await (supabase as any)
    .from('equipment_notices')
    .select('*')
    .eq('team_id', teamId)
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const teamId = teamIdFrom(req, body);
    const title = String(body.title || '').trim();
    if (!title) return NextResponse.json({ error: 'título obligatorio' }, { status: 400 });
    const notice_type = (body.notice_type || 'info') as EquipmentNoticeType;

    if (!isServerProduction()) {
      const notice: EquipmentNotice = {
        id: uid('notice'),
        team_id: teamId,
        notice_type,
        title,
        description: String(body.description || ''),
        author_name: body.author_name || 'Carlos Rodríguez Kobe',
        is_active: body.is_active !== false,
        created_at: nowIso(),
      };
      getEquipmentStore().notices.unshift(notice);
      pushHistory(teamId, notice.author_name || 'Sistema', 'publicó un aviso', 'notice', notice.id, title);
      notifyEquipmentEvent({
        teamId,
        type: 'utileria_aviso',
        title: `Aviso ${notice_type}: ${title}`,
        message: notice.description.slice(0, 120),
        severity: noticeSeverity(notice_type),
        entityType: 'notice',
        entityId: notice.id,
      });
      return NextResponse.json({ data: notice }, { status: 201 });
    }

    const { supabase, user, response } = await withEquipmentAuth();
    if (response || !user || !supabase) return response!;
    const pg = supabase as any;
    const actor = body.author_name || actorFromUser(user);

    const { data, error } = await pg
      .from('equipment_notices')
      .insert({
        team_id: teamId,
        notice_type,
        title,
        description: String(body.description || ''),
        author_name: actor,
        is_active: body.is_active !== false,
      })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    await insertHistory(pg, teamId, actor, 'publicó un aviso', 'notice', data.id, title);
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
      const idx = store.notices.findIndex((n) => n.id === id && n.team_id === teamId);
      if (idx === -1) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
      const prev = store.notices[idx];
      const updated: EquipmentNotice = {
        ...prev,
        notice_type: (body.notice_type as EquipmentNoticeType) || prev.notice_type,
        title: body.title ?? prev.title,
        description: body.description ?? prev.description,
        is_active: typeof body.is_active === 'boolean' ? body.is_active : prev.is_active,
      };
      store.notices[idx] = updated;
      pushHistory(teamId, 'Carlos Rodríguez Kobe', 'actualizó un aviso', 'notice', id, updated.title);
      return NextResponse.json({ data: updated });
    }

    const { supabase, user, response } = await withEquipmentAuth();
    if (response || !user || !supabase) return response!;
    const pg = supabase as any;
    const actor = actorFromUser(user);
    const patch: Record<string, unknown> = {};
    for (const key of ['notice_type', 'title', 'description', 'is_active']) {
      if (body[key] !== undefined) patch[key] = body[key];
    }

    const { data, error } = await pg
      .from('equipment_notices')
      .update(patch)
      .eq('id', id)
      .eq('team_id', teamId)
      .select()
      .single();
    if (error || !data) {
      return NextResponse.json({ error: error?.message || 'No encontrado' }, { status: 404 });
    }
    await insertHistory(pg, teamId, actor, 'actualizó un aviso', 'notice', id, data.title);
    return NextResponse.json({ data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    const teamId = teamIdFrom(req);

    if (!isServerProduction()) {
      const store = getEquipmentStore();
      const idx = store.notices.findIndex((n) => n.id === id && n.team_id === teamId);
      if (idx === -1) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
      store.notices.splice(idx, 1);
      pushHistory(teamId, 'Carlos Rodríguez Kobe', 'eliminó un aviso', 'notice', id, null);
      return NextResponse.json({ success: true });
    }

    const { supabase, user, response } = await withEquipmentAuth();
    if (response || !user || !supabase) return response!;
    const pg = supabase as any;
    const actor = actorFromUser(user);
    const { error } = await pg.from('equipment_notices').delete().eq('id', id).eq('team_id', teamId);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    await insertHistory(pg, teamId, actor, 'eliminó un aviso', 'notice', id, null);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
