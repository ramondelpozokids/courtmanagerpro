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
import {
  actorFromUser,
  equipmentDbAvailable,
  insertHistory,
  isMissingTableError,
  teamIdFrom,
  withEquipmentAuth,
} from '@/modules/equipment-team/server';

function writeDemoNotice(
  teamId: string,
  actor: string,
  notice_type: EquipmentNoticeType,
  title: string,
  description: string,
  is_active: boolean
) {
  const notice: EquipmentNotice = {
    id: uid('notice'),
    team_id: teamId,
    notice_type,
    title,
    description,
    author_name: actor,
    is_active,
    created_at: nowIso(),
  };
  getEquipmentStore().notices.unshift(notice);
  pushHistory(teamId, actor, 'publicó un aviso', 'notice', notice.id, title);
  notifyEquipmentEvent({
    teamId,
    type: 'utileria_aviso',
    title: `Aviso ${notice_type}: ${title}`,
    message: notice.description.slice(0, 120),
    severity: noticeSeverity(notice_type),
    entityType: 'notice',
    entityId: notice.id,
  });
  return notice;
}

function patchDemoNotice(teamId: string, id: string, body: Record<string, unknown>, actor: string) {
  const store = getEquipmentStore();
  const idx = store.notices.findIndex((n) => n.id === id && n.team_id === teamId);
  if (idx === -1) return null;
  const prev = store.notices[idx];
  const updated: EquipmentNotice = {
    ...prev,
    notice_type: (body.notice_type as EquipmentNoticeType) || prev.notice_type,
    title: (body.title as string) ?? prev.title,
    description: (body.description as string) ?? prev.description,
    is_active: typeof body.is_active === 'boolean' ? body.is_active : prev.is_active,
  };
  store.notices[idx] = updated;
  pushHistory(teamId, actor, 'actualizó un aviso', 'notice', id, updated.title);
  return updated;
}

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
  if (error) {
    if (isMissingTableError(error)) {
      return NextResponse.json({
        data: getEquipmentStore().notices.filter((n) => n.team_id === teamId),
        meta: { fallback: 'demo' },
      });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data: data ?? [] });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const teamId = teamIdFrom(req, body);
    const title = String(body.title || '').trim();
    if (!title) return NextResponse.json({ error: 'título obligatorio' }, { status: 400 });
    const notice_type = (body.notice_type || 'info') as EquipmentNoticeType;
    const description = String(body.description || '');
    const is_active = body.is_active !== false;

    if (!isServerProduction()) {
      return NextResponse.json(
        {
          data: writeDemoNotice(
            teamId,
            body.author_name || 'Carlos Rodríguez Kobe',
            notice_type,
            title,
            description,
            is_active
          ),
        },
        { status: 201 }
      );
    }

    const { supabase, user, response } = await withEquipmentAuth();
    if (response || !user || !supabase) return response!;
    const pg = supabase as any;
    const actor = body.author_name || actorFromUser(user);

    if (!(await equipmentDbAvailable(pg))) {
      return NextResponse.json(
        {
          data: writeDemoNotice(teamId, actor, notice_type, title, description, is_active),
          meta: { fallback: 'demo' },
        },
        { status: 201 }
      );
    }

    const { data, error } = await pg
      .from('equipment_notices')
      .insert({
        team_id: teamId,
        notice_type,
        title,
        description,
        author_name: actor,
        is_active,
      })
      .select()
      .single();
    if (error) {
      if (isMissingTableError(error)) {
        return NextResponse.json(
          {
            data: writeDemoNotice(teamId, actor, notice_type, title, description, is_active),
            meta: { fallback: 'demo' },
          },
          { status: 201 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
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
      const updated = patchDemoNotice(teamId, id, body, 'Carlos Rodríguez Kobe');
      if (!updated) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
      return NextResponse.json({ data: updated });
    }

    const { supabase, user, response } = await withEquipmentAuth();
    if (response || !user || !supabase) return response!;
    const pg = supabase as any;
    const actor = actorFromUser(user);

    if (!(await equipmentDbAvailable(pg))) {
      const updated = patchDemoNotice(teamId, id, body, actor);
      if (!updated) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
      return NextResponse.json({ data: updated, meta: { fallback: 'demo' } });
    }

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
      if (isMissingTableError(error)) {
        const updated = patchDemoNotice(teamId, id, body, actor);
        if (!updated) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
        return NextResponse.json({ data: updated, meta: { fallback: 'demo' } });
      }
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

    const deleteDemo = (actor: string) => {
      const store = getEquipmentStore();
      const idx = store.notices.findIndex((n) => n.id === id && n.team_id === teamId);
      if (idx === -1) return false;
      store.notices.splice(idx, 1);
      pushHistory(teamId, actor, 'eliminó un aviso', 'notice', id, null);
      return true;
    };

    if (!isServerProduction()) {
      if (!deleteDemo('Carlos Rodríguez Kobe')) {
        return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
      }
      return NextResponse.json({ success: true });
    }

    const { supabase, user, response } = await withEquipmentAuth();
    if (response || !user || !supabase) return response!;
    const pg = supabase as any;
    const actor = actorFromUser(user);

    if (!(await equipmentDbAvailable(pg))) {
      if (!deleteDemo(actor)) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
      return NextResponse.json({ success: true, meta: { fallback: 'demo' } });
    }

    const { error } = await pg.from('equipment_notices').delete().eq('id', id).eq('team_id', teamId);
    if (error) {
      if (isMissingTableError(error)) {
        if (!deleteDemo(actor)) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
        return NextResponse.json({ success: true, meta: { fallback: 'demo' } });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    await insertHistory(pg, teamId, actor, 'eliminó un aviso', 'notice', id, null);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
