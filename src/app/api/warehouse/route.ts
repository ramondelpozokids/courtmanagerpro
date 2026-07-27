import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient, createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { supabaseServiceRoleKey } from '@/infrastructure/supabase/env';
import { isServerProduction, requireApiUser } from '@/lib/supabase-route-auth';
import { CLUB_TEAM_IDS } from '@/lib/club-team-ids';
import { getClubPack } from '@/data/clubs';
import { isDemoMode } from '@/lib/app-mode';

export const runtime = 'nodejs';

const SECTIONS = [
  {
    id: 'rmb-primer',
    teamId: CLUB_TEAM_IDS.rmb,
    sport: 'basketball' as const,
    category: 'primer_equipo' as const,
    label: 'Baloncesto — Primer Equipo',
    shortLabel: 'RMB',
  },
  {
    id: 'rmf-primer',
    teamId: CLUB_TEAM_IDS.rmf,
    sport: 'football' as const,
    category: 'primer_equipo' as const,
    label: 'Fútbol — Primer Equipo (RMF)',
    shortLabel: 'RMF',
  },
  {
    id: 'atm-primer',
    teamId: CLUB_TEAM_IDS.atm,
    sport: 'football' as const,
    category: 'primer_equipo' as const,
    label: 'Fútbol — Primer Equipo (ATM)',
    shortLabel: 'ATM',
  },
  {
    id: 'rmb-inferiores',
    teamId: null as string | null,
    sport: 'basketball' as const,
    category: 'inferiores' as const,
    label: 'Baloncesto — Categorías inferiores',
    shortLabel: 'RMB Cantera',
  },
  {
    id: 'rmf-inferiores',
    teamId: null as string | null,
    sport: 'football' as const,
    category: 'inferiores' as const,
    label: 'Fútbol — Categorías inferiores',
    shortLabel: 'RMF Cantera',
  },
] as const;

function hasRealServiceRole(): boolean {
  return Boolean(
    supabaseServiceRoleKey &&
      supabaseServiceRoleKey.length > 40 &&
      !supabaseServiceRoleKey.includes('dummy')
  );
}

function mapRow(row: Record<string, unknown>, section: (typeof SECTIONS)[number]) {
  const stock = Number(row.stock_available ?? row.stock_total ?? row.stock ?? 0);
  const min = Number(row.stock_min ?? row.min_stock ?? 0);
  const unitCost = row.unit_cost != null ? Number(row.unit_cost) : 0;
  return {
    id: String(row.id),
    name: String(row.name || ''),
    sku: row.sku ? String(row.sku) : null,
    category: row.category ? String(row.category) : null,
    size: row.size ? String(row.size) : null,
    stock,
    stock_min: min,
    unit_cost: unitCost,
    value: unitCost * stock,
    location: row.location ? String(row.location) : 'Almacén general',
    low_stock: stock <= min,
    section_id: section.id,
    section_label: section.label,
    sport: section.sport,
    team_category: section.category,
    team_short: section.shortLabel,
  };
}

function demoItemsForTeam(teamId: string, section: (typeof SECTIONS)[number]) {
  const slug =
    teamId === CLUB_TEAM_IDS.atm ? 'atm' : teamId === CLUB_TEAM_IDS.rmf ? 'rmf' : 'rmb';
  const pack = getClubPack(slug);
  return (pack.inventory || []).map((item: any, i: number) =>
    mapRow(
      {
        id: item.id || `${section.id}-${i}`,
        name: item.name,
        sku: item.sku || item.qr_code,
        category: item.category,
        size: item.size,
        stock_available: item.stock ?? item.stock_available ?? 0,
        stock_min: item.stock_min ?? item.minStock ?? 5,
        unit_cost: item.unit_cost ?? 0,
        location: item.location || 'Almacén utilería',
      },
      section
    )
  );
}

export async function GET(req: NextRequest) {
  if (isServerProduction()) {
    const { user, response } = await requireApiUser();
    if (response || !user) return response!;
  }

  const sport = req.nextUrl.searchParams.get('sport'); // basketball | football | all
  const category = req.nextUrl.searchParams.get('category'); // primer_equipo | inferiores | all
  const q = (req.nextUrl.searchParams.get('q') || '').trim().toLowerCase();
  const onlyLow = req.nextUrl.searchParams.get('low_stock') === '1';
  const scope = req.nextUrl.searchParams.get('scope') || 'active'; // active | all_rm
  const teamIdParam = req.nextUrl.searchParams.get('team_id');

  let sections = SECTIONS.filter((s) => {
    if (sport && sport !== 'all' && s.sport !== sport) return false;
    if (category && category !== 'all' && s.category !== category) return false;
    return true;
  });

  if (scope !== 'all_rm' && teamIdParam) {
    sections = sections.filter((s) => s.teamId === teamIdParam);
  }

  const items: ReturnType<typeof mapRow>[] = [];
  const useDemo = isDemoMode() || !isServerProduction();

  if (useDemo) {
    for (const section of sections) {
      if (!section.teamId) continue; // inferiores: vacío por ahora
      items.push(...demoItemsForTeam(section.teamId, section));
    }
  } else {
    const client = hasRealServiceRole()
      ? createSupabaseAdminClient()
      : await createSupabaseServerClient();
    const pg = client as any;

    for (const section of sections) {
      if (!section.teamId) continue;
      const { data, error } = await pg
        .from('inventory_items')
        .select('*')
        .eq('team_id', section.teamId)
        .eq('is_active', true)
        .order('name')
        .limit(500);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      for (const row of data || []) {
        items.push(mapRow(row, section));
      }
    }
  }

  let filtered = items;
  if (q) {
    filtered = filtered.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        (i.sku || '').toLowerCase().includes(q) ||
        (i.location || '').toLowerCase().includes(q)
    );
  }
  if (onlyLow) filtered = filtered.filter((i) => i.low_stock);

  const stats = {
    total_refs: filtered.length,
    total_units: filtered.reduce((s, i) => s + i.stock, 0),
    total_value: filtered.reduce((s, i) => s + i.value, 0),
    low_stock: filtered.filter((i) => i.low_stock).length,
    by_section: SECTIONS.map((s) => ({
      id: s.id,
      label: s.label,
      shortLabel: s.shortLabel,
      sport: s.sport,
      category: s.category,
      ready: Boolean(s.teamId),
      count: filtered.filter((i) => i.section_id === s.id).length,
      units: filtered.filter((i) => i.section_id === s.id).reduce((a, i) => a + i.stock, 0),
      value: filtered.filter((i) => i.section_id === s.id).reduce((a, i) => a + i.value, 0),
    })),
    by_location: Object.entries(
      filtered.reduce<Record<string, { units: number; refs: number; value: number }>>((acc, i) => {
        const loc = i.location || 'Sin ubicación';
        if (!acc[loc]) acc[loc] = { units: 0, refs: 0, value: 0 };
        acc[loc].units += i.stock;
        acc[loc].refs += 1;
        acc[loc].value += i.value;
        return acc;
      }, {})
    )
      .map(([location, v]) => ({ location, ...v }))
      .sort((a, b) => b.units - a.units),
  };

  return NextResponse.json({
    data: {
      items: filtered,
      stats,
      sections: SECTIONS.map((s) => ({
        id: s.id,
        label: s.label,
        shortLabel: s.shortLabel,
        sport: s.sport,
        category: s.category,
        ready: Boolean(s.teamId),
      })),
    },
  });
}
