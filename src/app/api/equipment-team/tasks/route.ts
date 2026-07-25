import { NextRequest, NextResponse } from 'next/server';
import { isServerProduction } from '@/lib/supabase-route-auth';
import {
  getEquipmentStore,
  pushHistory,
  uid,
  nowIso,
} from '@/modules/equipment-team/store';
import type { EquipmentTask, EquipmentTaskPriority, EquipmentTaskStatus } from '@/modules/equipment-team/types';
import { notifyEquipmentEvent } from '@/modules/equipment-team/notifications';
import { actorFromUser, insertHistory, teamIdFrom, withEquipmentAuth } from '@/modules/equipment-team/server';

export async function GET(req: NextRequest) {
  const teamId = teamIdFrom(req);

  if (!isServerProduction()) {
    const tasks = getEquipmentStore()
      .tasks.filter((t) => t.team_id === teamId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
    return NextResponse.json({ data: tasks });
  }

  const { supabase, user, response } = await withEquipmentAuth();
  if (response || !user || !supabase) return response!;

  const { data, error } = await (supabase as any)
    .from('equipment_tasks')
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

    const priority = (body.priority || 'normal') as EquipmentTaskPriority;
    const status = (body.status || 'pendiente') as EquipmentTaskStatus;

    if (!isServerProduction()) {
      const t = nowIso();
      const task: EquipmentTask = {
        id: uid('task'),
        team_id: teamId,
        title,
        description: String(body.description || ''),
        assignee_id: body.assignee_id || null,
        assignee_name: body.assignee_name || null,
        priority,
        status,
        due_date: body.due_date || null,
        created_by_name: body.created_by_name || 'Carlos Rodríguez Kobe',
        created_at: t,
        updated_at: t,
      };
      getEquipmentStore().tasks.unshift(task);
      pushHistory(teamId, task.created_by_name || 'Sistema', 'creó una tarea', 'task', task.id, title);
      notifyEquipmentEvent({
        teamId,
        type: 'utileria_tarea',
        title: 'Nueva tarea de utillería',
        message: title,
        severity: priority === 'urgente' || priority === 'alta' ? 'warning' : 'info',
        entityType: 'task',
        entityId: task.id,
      });
      return NextResponse.json({ data: task }, { status: 201 });
    }

    const { supabase, user, response } = await withEquipmentAuth();
    if (response || !user || !supabase) return response!;
    const pg = supabase as any;
    const actor = body.created_by_name || actorFromUser(user);

    const { data, error } = await pg
      .from('equipment_tasks')
      .insert({
        team_id: teamId,
        title,
        description: String(body.description || ''),
        assignee_id: body.assignee_id || null,
        assignee_name: body.assignee_name || null,
        priority,
        status,
        due_date: body.due_date || null,
        created_by_name: actor,
      })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    await insertHistory(pg, teamId, actor, 'creó una tarea', 'task', data.id, title);
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
      const idx = store.tasks.findIndex((t) => t.id === id && t.team_id === teamId);
      if (idx === -1) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
      const prev = store.tasks[idx];
      const updated: EquipmentTask = {
        ...prev,
        title: body.title ?? prev.title,
        description: body.description ?? prev.description,
        assignee_id: body.assignee_id !== undefined ? body.assignee_id : prev.assignee_id,
        assignee_name: body.assignee_name !== undefined ? body.assignee_name : prev.assignee_name,
        priority: (body.priority as EquipmentTaskPriority) || prev.priority,
        status: (body.status as EquipmentTaskStatus) || prev.status,
        due_date: body.due_date !== undefined ? body.due_date : prev.due_date,
        updated_at: nowIso(),
      };
      store.tasks[idx] = updated;
      pushHistory(teamId, 'Carlos Rodríguez Kobe', 'actualizó una tarea', 'task', id, updated.title);
      return NextResponse.json({ data: updated });
    }

    const { supabase, user, response } = await withEquipmentAuth();
    if (response || !user || !supabase) return response!;
    const pg = supabase as any;
    const actor = actorFromUser(user);

    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    for (const key of ['title', 'description', 'assignee_id', 'assignee_name', 'priority', 'status', 'due_date']) {
      if (body[key] !== undefined) patch[key] = body[key];
    }

    const { data, error } = await pg
      .from('equipment_tasks')
      .update(patch)
      .eq('id', id)
      .eq('team_id', teamId)
      .select()
      .single();
    if (error || !data) {
      return NextResponse.json({ error: error?.message || 'No encontrado' }, { status: 404 });
    }
    await insertHistory(pg, teamId, actor, 'actualizó una tarea', 'task', id, data.title);
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
      const idx = store.tasks.findIndex((t) => t.id === id && t.team_id === teamId);
      if (idx === -1) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
      store.tasks.splice(idx, 1);
      pushHistory(teamId, 'Carlos Rodríguez Kobe', 'eliminó una tarea', 'task', id, null);
      return NextResponse.json({ success: true });
    }

    const { supabase, user, response } = await withEquipmentAuth();
    if (response || !user || !supabase) return response!;
    const pg = supabase as any;
    const actor = actorFromUser(user);
    const { error } = await pg.from('equipment_tasks').delete().eq('id', id).eq('team_id', teamId);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    await insertHistory(pg, teamId, actor, 'eliminó una tarea', 'task', id, null);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
