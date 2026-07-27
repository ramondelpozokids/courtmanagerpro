import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient, createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { supabaseServiceRoleKey } from '@/infrastructure/supabase/env';
import { isServerProduction, requireApiUser } from '@/lib/supabase-route-auth';
import { DEFAULT_TEAM_ID, resolveTeamId } from '@/lib/team-constants';
import { CLUB_TEAM_IDS } from '@/lib/club-team-ids';
import { isDemoMode } from '@/lib/app-mode';

export const runtime = 'nodejs';

function hasRealServiceRole(): boolean {
  return Boolean(
    supabaseServiceRoleKey &&
      supabaseServiceRoleKey.length > 40 &&
      !supabaseServiceRoleKey.includes('dummy')
  );
}

async function getClient() {
  if (!isServerProduction()) return null;
  if (hasRealServiceRole()) return createSupabaseAdminClient();
  return createSupabaseServerClient();
}

/** Demo in-memory feed for presentation when table empty / demo mode */
const DEMO_MOVEMENTS = [
  {
    id: 'sm1',
    team_id: CLUB_TEAM_IDS.rmb,
    item_name: 'Camiseta juego local',
    qty_delta: -2,
    stock_after: 18,
    reason: 'asignacion_jugador',
    actor_name: 'Carlos Rodriguez Kobe',
    created_at: new Date(Date.now() - 3600_000).toISOString(),
  },
  {
    id: 'sm2',
    team_id: CLUB_TEAM_IDS.rmf,
    item_name: 'Botas Predator Elite',
    qty_delta: -1,
    stock_after: 7,
    reason: 'solicitud_aprobada',
    actor_name: 'Carlos Rodriguez Kobe',
    created_at: new Date(Date.now() - 7200_000).toISOString(),
  },
  {
    id: 'sm3',
    team_id: CLUB_TEAM_IDS.rmb,
    item_name: 'Chaqueta travel',
    qty_delta: 12,
    stock_after: 40,
    reason: 'entrada_almacen',
    actor_name: 'Carlos Rodriguez Kobe',
    created_at: new Date(Date.now() - 86400_000).toISOString(),
  },
];

export async function GET(req: NextRequest) {
  if (isServerProduction()) {
    const { user, response } = await requireApiUser();
    if (response || !user) return response!;
  }

  const scope = req.nextUrl.searchParams.get('scope') || 'active'; // active | all_rm
  const teamId = resolveTeamId(req.nextUrl.searchParams.get('team_id') || DEFAULT_TEAM_ID);
  const limit = Math.min(Number(req.nextUrl.searchParams.get('limit') || 80), 200);

  if (isDemoMode() || !isServerProduction()) {
    const rows =
      scope === 'all_rm'
        ? DEMO_MOVEMENTS
        : DEMO_MOVEMENTS.filter((m) => m.team_id === teamId);
    return NextResponse.json({ data: rows.slice(0, limit) });
  }

  const client = await getClient();
  const pg = client as any;
  let query = pg
    .from('stock_movements')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (scope === 'all_rm') {
    query = query.in('team_id', [CLUB_TEAM_IDS.rmb, CLUB_TEAM_IDS.rmf, CLUB_TEAM_IDS.atm]);
  } else {
    query = query.eq('team_id', teamId);
  }

  const { data, error } = await query;
  if (error) {
    // Tabla aún no creada → demo fallback
    if (/does not exist|relation/i.test(error.message)) {
      return NextResponse.json({ data: DEMO_MOVEMENTS, warning: 'Ejecuta 019_stock_movements.sql' });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data?.length) {
    // Vacío real: no inventar movimientos de demo (mezclaba RMB/RMF y confundía el historial).
    return NextResponse.json({ data: [] });
  }

  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  let user: { id: string } | null = null;
  if (isServerProduction()) {
    const auth = await requireApiUser();
    if (auth.response || !auth.user) return auth.response!;
    user = auth.user;
  }

  const body = await req.json();
  const teamId = resolveTeamId(body.team_id || DEFAULT_TEAM_ID);

  if (isDemoMode() || !isServerProduction()) {
    return NextResponse.json({ data: { id: 'demo', ...body }, demo: true }, { status: 201 });
  }

  const client = await getClient();
  const pg = client as any;

  const { data, error } = await pg
    .from('stock_movements')
    .insert({
      team_id: teamId,
      item_id: body.item_id || null,
      item_name: body.item_name || 'Material',
      qty_delta: Number(body.qty_delta) || 0,
      stock_after: body.stock_after != null ? Number(body.stock_after) : null,
      reason: body.reason || 'ajuste',
      actor_id: user?.id || null,
      actor_name: body.actor_name || null,
      notes: body.notes || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data }, { status: 201 });
}

/** Borra solo la fila del historial (no revierte stock). */
export async function DELETE(req: NextRequest) {
  if (isServerProduction()) {
    const { user, response } = await requireApiUser();
    if (response || !user) return response!;
  }

  const id = req.nextUrl.searchParams.get('id');
  const teamId = resolveTeamId(req.nextUrl.searchParams.get('team_id') || DEFAULT_TEAM_ID);
  if (!id) return NextResponse.json({ error: 'Falta id' }, { status: 400 });

  if (isDemoMode() || !isServerProduction()) {
    return NextResponse.json({ ok: true, demo: true, id });
  }

  // No borrar filas demo inventadas (sm1/sm2/sm3)
  if (/^sm\d+$/i.test(id)) {
    return NextResponse.json({ ok: true, skipped: 'demo' });
  }

  const client = await getClient();
  const pg = client as any;
  const { error } = await pg.from('stock_movements').delete().eq('id', id).eq('team_id', teamId);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
