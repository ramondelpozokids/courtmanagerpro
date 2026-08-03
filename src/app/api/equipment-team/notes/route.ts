import { NextRequest, NextResponse } from 'next/server';
import { isServerProduction } from '@/lib/supabase-route-auth';
import {
  getEquipmentStore,
  pushHistory,
  uid,
  nowIso,
} from '@/modules/equipment-team/store';
import type { EquipmentNote } from '@/modules/equipment-team/types';
import { notifyEquipmentEvent } from '@/modules/equipment-team/notifications';
import { actorFromUser, equipmentDbAvailable, insertHistory, isMissingTableError, teamIdFrom, withEquipmentAuth } from '@/modules/equipment-team/server';

export async function GET(req: NextRequest) {
  const teamId = teamIdFrom(req);

  if (!isServerProduction()) {
    const notes = getEquipmentStore()
      .notes.filter((n) => n.team_id === teamId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
    return NextResponse.json({ data: notes });
  }

  const { supabase, user, response } = await withEquipmentAuth(req);
  if (response || !user || !supabase) return response!;

  const { data, error } = await (supabase as any)
    .from('equipment_notes')
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
    const content = String(body.content || '').trim();
    if (!content) return NextResponse.json({ error: 'contenido obligatorio' }, { status: 400 });

    if (!isServerProduction()) {
      const t = nowIso();
      const note: EquipmentNote = {
        id: uid('note'),
        team_id: teamId,
        author_id: body.author_id || null,
        author_name: body.author_name || 'Carlos Rodríguez Kobe',
        content,
        created_at: t,
        updated_at: t,
      };
      getEquipmentStore().notes.unshift(note);
      pushHistory(teamId, note.author_name, 'publicó una nota', 'note', note.id, content.slice(0, 80));
      notifyEquipmentEvent({
        teamId,
        type: 'utileria_nota',
        title: 'Nueva nota de utillería',
        message: content.slice(0, 120),
        entityType: 'note',
        entityId: note.id,
      });
      return NextResponse.json({ data: note }, { status: 201 });
    }

    const { supabase, user, response } = await withEquipmentAuth(req, body);
    if (response || !user || !supabase) return response!;
    const pg = supabase as any;
    const actor = body.author_name || actorFromUser(user);

    const writeDemo = () => {
      const t = nowIso();
      const note: EquipmentNote = {
        id: uid('note'),
        team_id: teamId,
        author_id: body.author_id || null,
        author_name: actor,
        content,
        created_at: t,
        updated_at: t,
      };
      getEquipmentStore().notes.unshift(note);
      pushHistory(teamId, note.author_name, 'publicó una nota', 'note', note.id, content.slice(0, 80));
      notifyEquipmentEvent({
        teamId,
        type: 'utileria_nota',
        title: 'Nueva nota de utillería',
        message: content.slice(0, 120),
        entityType: 'note',
        entityId: note.id,
      });
      return note;
    };

    if (!(await equipmentDbAvailable(pg))) {
      return NextResponse.json({ data: writeDemo(), meta: { fallback: 'demo' } }, { status: 201 });
    }

    const { data, error } = await pg
      .from('equipment_notes')
      .insert({
        team_id: teamId,
        author_id: body.author_id || null,
        author_name: actor,
        content,
      })
      .select()
      .single();
    if (error) {
      if (isMissingTableError(error)) {
        return NextResponse.json({ data: writeDemo(), meta: { fallback: 'demo' } }, { status: 201 });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    await insertHistory(pg, teamId, actor, 'publicó una nota', 'note', data.id, content.slice(0, 80));
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

    if (!isServerProduction()) {
      const store = getEquipmentStore();
      const idx = store.notes.findIndex((n) => n.id === id && n.team_id === teamId);
      if (idx === -1) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
      store.notes.splice(idx, 1);
      pushHistory(teamId, 'Carlos Rodríguez Kobe', 'eliminó una nota', 'note', id, null);
      return NextResponse.json({ success: true });
    }

    const { supabase, user, response } = await withEquipmentAuth(req);
    if (response || !user || !supabase) return response!;
    const pg = supabase as any;
    const actor = actorFromUser(user);

    if (!(await equipmentDbAvailable(pg))) {
      const store = getEquipmentStore();
      const idx = store.notes.findIndex((n) => n.id === id && n.team_id === teamId);
      if (idx === -1) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
      store.notes.splice(idx, 1);
      pushHistory(teamId, actor, 'eliminó una nota', 'note', id, null);
      return NextResponse.json({ success: true, meta: { fallback: 'demo' } });
    }

    const { error } = await pg.from('equipment_notes').delete().eq('id', id).eq('team_id', teamId);
    if (error) {
      if (isMissingTableError(error)) {
        const store = getEquipmentStore();
        const idx = store.notes.findIndex((n) => n.id === id && n.team_id === teamId);
        if (idx === -1) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
        store.notes.splice(idx, 1);
        pushHistory(teamId, actor, 'eliminó una nota', 'note', id, null);
        return NextResponse.json({ success: true, meta: { fallback: 'demo' } });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    await insertHistory(pg, teamId, actor, 'eliminó una nota', 'note', id, null);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
