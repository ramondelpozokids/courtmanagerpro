import { NextRequest, NextResponse } from 'next/server';
import { isServerProduction } from '@/lib/supabase-route-auth';
import {
  getEquipmentStore,
  pushHistory,
  uid,
  nowIso,
} from '@/modules/equipment-team/store';
import type { EquipmentAttachment, EquipmentReport } from '@/modules/equipment-team/types';
import { notifyEquipmentEvent } from '@/modules/equipment-team/notifications';
import {
  actorFromUser,
  equipmentDbAvailable,
  insertHistory,
  isMissingTableError,
  teamIdFrom,
  withEquipmentAuth,
} from '@/modules/equipment-team/server';

function parseAttachments(raw: unknown): EquipmentAttachment[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((a) => ({
      name: String((a as EquipmentAttachment).name || 'archivo'),
      url: String((a as EquipmentAttachment).url || '#'),
      mime: (a as EquipmentAttachment).mime,
      size: (a as EquipmentAttachment).size,
    }))
    .filter((a) => a.name);
}

function writeDemoReport(
  teamId: string,
  actor: string,
  title: string,
  content: string,
  attachments: EquipmentAttachment[],
  author_id: string | null
) {
  const t = nowIso();
  const report: EquipmentReport = {
    id: uid('rep'),
    team_id: teamId,
    author_id,
    author_name: actor,
    title,
    content,
    attachments,
    created_at: t,
    updated_at: t,
  };
  getEquipmentStore().reports.unshift(report);
  pushHistory(teamId, actor, 'creó un informe', 'report', report.id, title);
  notifyEquipmentEvent({
    teamId,
    type: 'utileria_informe',
    title: 'Nuevo informe de utillería',
    message: title,
    entityType: 'report',
    entityId: report.id,
  });
  return report;
}

export async function GET(req: NextRequest) {
  const teamId = teamIdFrom(req);

  if (!isServerProduction()) {
    const reports = getEquipmentStore()
      .reports.filter((r) => r.team_id === teamId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
    return NextResponse.json({ data: reports });
  }

  const { supabase, user, response } = await withEquipmentAuth();
  if (response || !user || !supabase) return response!;

  const { data, error } = await (supabase as any)
    .from('equipment_reports')
    .select('*')
    .eq('team_id', teamId)
    .order('created_at', { ascending: false });
  if (error) {
    if (isMissingTableError(error)) {
      return NextResponse.json({
        data: getEquipmentStore().reports.filter((r) => r.team_id === teamId),
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
    const content = String(body.content || '').trim();
    if (!title) return NextResponse.json({ error: 'título obligatorio' }, { status: 400 });
    const attachments = parseAttachments(body.attachments);

    if (!isServerProduction()) {
      return NextResponse.json(
        {
          data: writeDemoReport(
            teamId,
            body.author_name || 'Carlos Rodríguez Kobe',
            title,
            content,
            attachments,
            body.author_id || null
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
          data: writeDemoReport(teamId, actor, title, content, attachments, body.author_id || null),
          meta: { fallback: 'demo' },
        },
        { status: 201 }
      );
    }

    const { data, error } = await pg
      .from('equipment_reports')
      .insert({
        team_id: teamId,
        author_id: body.author_id || null,
        author_name: actor,
        title,
        content,
        attachments,
      })
      .select()
      .single();
    if (error) {
      if (isMissingTableError(error)) {
        return NextResponse.json(
          {
            data: writeDemoReport(teamId, actor, title, content, attachments, body.author_id || null),
            meta: { fallback: 'demo' },
          },
          { status: 201 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    await insertHistory(pg, teamId, actor, 'creó un informe', 'report', data.id, title);
    return NextResponse.json({ data }, { status: 201 });
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
      const idx = store.reports.findIndex((r) => r.id === id && r.team_id === teamId);
      if (idx === -1) return false;
      store.reports.splice(idx, 1);
      pushHistory(teamId, actor, 'eliminó un informe', 'report', id, null);
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

    const { error } = await pg.from('equipment_reports').delete().eq('id', id).eq('team_id', teamId);
    if (error) {
      if (isMissingTableError(error)) {
        if (!deleteDemo(actor)) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
        return NextResponse.json({ success: true, meta: { fallback: 'demo' } });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    await insertHistory(pg, teamId, actor, 'eliminó un informe', 'report', id, null);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
