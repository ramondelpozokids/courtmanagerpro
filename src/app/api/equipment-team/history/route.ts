import { NextRequest, NextResponse } from 'next/server';
import { isServerProduction } from '@/lib/supabase-route-auth';
import { getEquipmentStore } from '@/modules/equipment-team/store';
import {
  equipmentDbAvailable,
  isMissingTableError,
  teamIdFrom,
  withEquipmentAuth,
} from '@/modules/equipment-team/server';

export async function GET(req: NextRequest) {
  const teamId = teamIdFrom(req);
  const entityId = req.nextUrl.searchParams.get('entity_id');
  const limit = Math.min(Number(req.nextUrl.searchParams.get('limit') || 100), 200);

  if (!isServerProduction()) {
    let history = getEquipmentStore()
      .history.filter((h) => h.team_id === teamId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
    if (entityId) {
      history = history.filter((h) => h.entity_id === entityId);
    }
    return NextResponse.json({ data: history.slice(0, limit) });
  }

  const { supabase, user, response } = await withEquipmentAuth(req);
  if (response || !user || !supabase) return response!;

  let query = (supabase as any)
    .from('equipment_history')
    .select('*')
    .eq('team_id', teamId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (entityId) query = query.eq('entity_id', entityId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}

/**
 * DELETE body: { team_id?, ids?: string[], all?: boolean }
 * or query: ?id=...&team_id=...  /  ?all=1&team_id=...
 */
export async function DELETE(req: NextRequest) {
  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const teamId = teamIdFrom(req, body as { team_id?: string });
  const queryId = req.nextUrl.searchParams.get('id');
  const queryAll = req.nextUrl.searchParams.get('all') === '1';
  const idsFromBody = Array.isArray(body.ids)
    ? (body.ids as unknown[]).map(String).filter(Boolean)
    : [];
  const ids = queryId ? [queryId, ...idsFromBody] : idsFromBody;
  const clearAll = queryAll || body.all === true;

  if (!clearAll && ids.length === 0) {
    return NextResponse.json({ error: 'Indica ids o all=true' }, { status: 400 });
  }

  if (!isServerProduction()) {
    const store = getEquipmentStore();
    if (clearAll) {
      store.history = store.history.filter((h) => h.team_id !== teamId);
    } else {
      const set = new Set(ids);
      store.history = store.history.filter((h) => !(h.team_id === teamId && set.has(h.id)));
    }
    return NextResponse.json({ data: { ok: true, deleted: clearAll ? 'all' : ids.length } });
  }

  const { supabase, user, response } = await withEquipmentAuth(req, body);
  if (response || !user || !supabase) return response!;
  const pg = supabase as any;

  if (!(await equipmentDbAvailable(pg))) {
    return NextResponse.json(
      { error: 'Tablas de utillería no disponibles. Aplica la migración 011/012.' },
      { status: 503 }
    );
  }

  let del = pg.from('equipment_history').delete().eq('team_id', teamId);
  if (!clearAll) {
    del = del.in('id', ids);
  }

  const { error } = await del;
  if (error) {
    if (isMissingTableError(error)) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    // Política DELETE ausente → mensaje claro
    if (/policy|permission|RLS/i.test(error.message)) {
      return NextResponse.json(
        {
          error:
            'Falta permiso DELETE en historial. Ejecuta en SQL Editor: supabase/migrations/012_equipment_history_delete.sql',
        },
        { status: 403 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: { ok: true, deleted: clearAll ? 'all' : ids.length } });
}
