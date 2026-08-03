import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient, createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { supabaseServiceRoleKey } from '@/infrastructure/supabase/env';
import { isServerProduction, requireApiUser } from '@/lib/supabase-route-auth';
import { DEFAULT_TEAM_ID, resolveTeamId } from '@/lib/team-constants';
import { CLUB_TEAM_IDS } from '@/lib/club-team-ids';
import { isDemoMode } from '@/lib/app-mode';
import {
  assertUserBelongsToTeam,
  getAccessibleTeamIds,
} from '@/lib/security/assert-team-access';

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

type DemoMovement = {
  id: string;
  team_id: string;
  item_id?: string | null;
  item_name: string;
  qty_delta: number;
  stock_after: number | null;
  reason: string;
  actor_name: string;
  notes?: string | null;
  created_at: string;
};

let demoStore: DemoMovement[] = [...DEMO_MOVEMENTS];

export async function GET(req: NextRequest) {
  let sessionUser: { id: string } | null = null;
  let sessionSupabase: Awaited<ReturnType<typeof createSupabaseServerClient>> | null = null;

  if (isServerProduction()) {
    const { supabase, user, response } = await requireApiUser();
    if (response || !user) return response!;
    sessionUser = user;
    sessionSupabase = supabase;
  }

  const scope = req.nextUrl.searchParams.get('scope') || 'active'; // active | all_rm
  const teamId = resolveTeamId(req.nextUrl.searchParams.get('team_id') || DEFAULT_TEAM_ID);
  const limit = Math.min(Number(req.nextUrl.searchParams.get('limit') || 80), 200);

  if (sessionUser && sessionSupabase) {
    if (scope !== 'all_rm') {
      const access = await assertUserBelongsToTeam(
        sessionSupabase as any,
        sessionUser.id,
        teamId
      );
      if (!access.ok) return access.response;
    }
  }

  if (isDemoMode() || !isServerProduction()) {
    const rows =
      scope === 'all_rm'
        ? demoStore
        : demoStore.filter((m) => m.team_id === teamId);
    return NextResponse.json({
      data: [...rows].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ).slice(0, limit),
    });
  }

  const client = await getClient();
  const pg = client as any;
  let query = pg
    .from('stock_movements')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (scope === 'all_rm') {
    const access = await getAccessibleTeamIds(sessionSupabase as any, sessionUser!.id);
    const clubIds = [CLUB_TEAM_IDS.atm, CLUB_TEAM_IDS.rmb, CLUB_TEAM_IDS.rmf];
    const allowed = access.superadmin
      ? clubIds
      : clubIds.filter((id) => access.teamIds.includes(id));
    if (allowed.length === 0) {
      return NextResponse.json({ data: [] });
    }
    query = query.in('team_id', allowed);
  } else {
    query = query.eq('team_id', teamId);
  }

  const { data, error } = await query;
  if (error) {
    if (/does not exist|relation/i.test(error.message)) {
      return NextResponse.json({ data: DEMO_MOVEMENTS, warning: 'Ejecuta 019_stock_movements.sql' });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data?.length) {
    return NextResponse.json({ data: [] });
  }

  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  let user: { id: string } | null = null;
  let profileName: string | null = null;
  let sessionSupabase: Awaited<ReturnType<typeof createSupabaseServerClient>> | null = null;
  if (isServerProduction()) {
    const auth = await requireApiUser();
    if (auth.response || !auth.user) return auth.response!;
    user = auth.user;
    sessionSupabase = auth.supabase;
    const meta = (auth.user as { user_metadata?: { full_name?: string } }).user_metadata;
    profileName = meta?.full_name || null;
  }

  const body = await req.json();
  const teamId = resolveTeamId(body.team_id || DEFAULT_TEAM_ID);

  if (user && sessionSupabase) {
    const access = await assertUserBelongsToTeam(sessionSupabase as any, user.id, teamId);
    if (!access.ok) return access.response;
  }
  const direction = String(body.direction || '').toLowerCase(); // entrada | salida
  let qtyDelta = Number(body.qty_delta);
  if (!Number.isFinite(qtyDelta) || qtyDelta === 0) {
    const qty = Math.abs(Number(body.quantity) || 0);
    if (qty <= 0) {
      return NextResponse.json({ error: 'Indica una cantidad válida' }, { status: 400 });
    }
    qtyDelta = direction === 'salida' || direction === 'out' ? -qty : qty;
  }
  if (qtyDelta === 0) {
    return NextResponse.json({ error: 'La cantidad no puede ser 0' }, { status: 400 });
  }

  const itemName = String(body.item_name || '').trim() || 'Material';
  const actorName =
    String(body.actor_name || '').trim() ||
    profileName ||
    'Utilería';
  const reason =
    String(body.reason || '').trim() ||
    (qtyDelta < 0 ? 'salida_material' : 'entrada_almacen');
  const notes = body.notes != null ? String(body.notes) : null;
  const itemId = body.item_id ? String(body.item_id) : null;

  if (isDemoMode() || !isServerProduction()) {
    const row = {
      id: `sm_${Math.random().toString(36).slice(2, 9)}`,
      team_id: teamId,
      item_id: itemId,
      item_name: itemName,
      qty_delta: qtyDelta,
      stock_after: body.stock_after != null ? Number(body.stock_after) : null,
      reason,
      actor_name: actorName,
      notes,
      created_at: new Date().toISOString(),
    };
    demoStore = [row, ...demoStore];
    return NextResponse.json({ data: row, demo: true }, { status: 201 });
  }

  const client = await getClient();
  const pg = client as any;

  let stockAfter: number | null =
    body.stock_after != null ? Number(body.stock_after) : null;
  let resolvedName = itemName;

  // Si hay artículo de inventario, ajustar stock disponible
  if (itemId) {
    const { data: item, error: itemErr } = await pg
      .from('inventory_items')
      .select('id, name, stock_available, team_id')
      .eq('id', itemId)
      .eq('team_id', teamId)
      .maybeSingle();
    if (itemErr) return NextResponse.json({ error: itemErr.message }, { status: 400 });
    if (!item) {
      return NextResponse.json({ error: 'Artículo de inventario no encontrado' }, { status: 404 });
    }
    resolvedName = String(item.name || itemName);
    const current = Number(item.stock_available ?? 0);
    const next = current + qtyDelta;
    if (next < 0) {
      return NextResponse.json(
        { error: `Stock insuficiente (disponible: ${current})` },
        { status: 400 }
      );
    }
    const { error: updErr } = await pg
      .from('inventory_items')
      .update({
        stock_available: next,
        updated_at: new Date().toISOString(),
      })
      .eq('id', itemId)
      .eq('team_id', teamId);
    if (updErr) return NextResponse.json({ error: updErr.message }, { status: 400 });
    stockAfter = next;
  }

  const { data, error } = await pg
    .from('stock_movements')
    .insert({
      team_id: teamId,
      item_id: itemId,
      item_name: resolvedName,
      qty_delta: qtyDelta,
      stock_after: stockAfter,
      reason,
      actor_id: user?.id || null,
      actor_name: actorName,
      notes,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data }, { status: 201 });
}

/** Borra solo la fila del historial (no revierte stock). */
export async function DELETE(req: NextRequest) {
  let sessionUser: { id: string } | null = null;
  let sessionSupabase: Awaited<ReturnType<typeof createSupabaseServerClient>> | null = null;
  if (isServerProduction()) {
    const { supabase, user, response } = await requireApiUser();
    if (response || !user) return response!;
    sessionUser = user;
    sessionSupabase = supabase;
  }

  const id = req.nextUrl.searchParams.get('id');
  const teamId = resolveTeamId(req.nextUrl.searchParams.get('team_id') || DEFAULT_TEAM_ID);
  if (!id) return NextResponse.json({ error: 'Falta id' }, { status: 400 });

  if (sessionUser && sessionSupabase) {
    const access = await assertUserBelongsToTeam(
      sessionSupabase as any,
      sessionUser.id,
      teamId
    );
    if (!access.ok) return access.response;
  }

  if (isDemoMode() || !isServerProduction()) {
    demoStore = demoStore.filter((m) => m.id !== id);
    return NextResponse.json({ ok: true, demo: true, id });
  }

  if (/^sm\d+$/i.test(id)) {
    return NextResponse.json({ ok: true, skipped: 'demo' });
  }

  const client = await getClient();
  const pg = client as any;
  const { error } = await pg.from('stock_movements').delete().eq('id', id).eq('team_id', teamId);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
