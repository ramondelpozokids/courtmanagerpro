import { getSupabaseClient } from '@/infrastructure/supabase/client';
import { DEFAULT_TEAM_ID } from '@/lib/team-constants';
import {
  mergeSizingCatalog,
  normalizeSizes,
  staffToSizes,
  sizesToStaffFields,
  type SizingProduct,
} from '@/content/sizing-products';
import type { Player } from '@/types';

export function supabasePlayerToSizingRow(p: Player, catalog: SizingProduct[]) {
  const meta = ((p.metadata as Record<string, unknown>)?.sizing as Record<string, string>) || {};
  const legacy: Record<string, string | number | undefined> = {
    jersey: p.shirt_size ?? meta.jersey,
    shorts: p.shorts_size ?? meta.shorts,
    shoes: p.shoe_size ?? meta.shoes,
    warmupShirt: p.jacket_size ?? meta.warmupShirt,
    socks: p.sock_size ?? meta.socks,
    ...meta,
  };
  const parts = p.full_name.split(' ');
  return {
    id: p.id,
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || '',
    number: p.dorsal,
    position: p.position,
    status: p.is_active ? 'ACTIVE' : 'INACTIVE',
    nationality: p.nationality || 'España',
    birthDate: p.birth_date || '',
    sizes: normalizeSizes(legacy, catalog),
  };
}

export function supabaseStaffToSizingRow(s: Record<string, unknown>, catalog: SizingProduct[]) {
  const meta = (s.sizing_metadata as Record<string, string>) || {};
  return {
    id: s.id,
    full_name: s.full_name,
    role: s.role,
    email: s.email,
    nationality: s.nationality,
    ...sizesToStaffFields(staffToSizes({ ...s, ...meta } as any, catalog)),
  };
}

function sizesToPlayerPayload(sizes: Record<string, string>, catalog: SizingProduct[]) {
  const meta: Record<string, string> = { ...sizes };
  const payload: Record<string, unknown> = {
    metadata: { sizing: meta },
  };

  for (const product of catalog) {
    if (!product.legacyKey) continue;
    const val = sizes[product.id];
    if (val == null || val === '—') continue;
    switch (product.legacyKey) {
      case 'jersey':
        payload.shirt_size = val;
        break;
      case 'shorts':
        payload.shorts_size = val;
        break;
      case 'shoes':
        payload.shoe_size = Number(val) || val;
        break;
      case 'warmupShirt':
        payload.jacket_size = val;
        break;
      case 'socks':
        payload.sock_size = val;
        break;
    }
  }

  return payload;
}

export async function loadProductionSizing(
  teamId: string = DEFAULT_TEAM_ID,
  customProducts: SizingProduct[] = []
) {
  const catalog = mergeSizingCatalog(customProducts);
  const supabase = getSupabaseClient() as any;

  const [{ data: playerRows, error: pErr }, staffRes, { data: customRows }] = await Promise.all([
    supabase.from('players').select('*').eq('team_id', teamId).eq('is_active', true).order('dorsal'),
    fetch(`/api/coaching-staff?team_id=${teamId}`, { credentials: 'include' }),
    supabase.from('sizing_products').select('*').eq('team_id', teamId).eq('is_active', true),
  ]);

  if (pErr) throw new Error(pErr.message);
  const staffJson = await staffRes.json();
  const staffRows = staffJson.data ?? [];

  const customFromDb: SizingProduct[] = (customRows ?? []).map((r: Record<string, unknown>) => ({
    id: String(r.product_key),
    label: String(r.label),
    shortLabel: String(r.label).slice(0, 8),
    category: r.category as SizingProduct['category'],
    inputType: 'text',
    defaultSize: String(r.default_size ?? '—'),
    custom: true,
  }));

  const fullCatalog = mergeSizingCatalog(customFromDb);
  const players = (playerRows as Player[]).map((p) => supabasePlayerToSizingRow(p, fullCatalog));
  const staff = staffRows.map((s: Record<string, unknown>) =>
    supabaseStaffToSizingRow(s, fullCatalog)
  );

  return { players, staff, catalog: fullCatalog, customProducts: customFromDb };
}

export async function saveProductionPlayerSizes(
  playerId: string,
  sizes: Record<string, string>,
  catalog: SizingProduct[]
) {
  const supabase = getSupabaseClient() as any;
  const payload = sizesToPlayerPayload(sizes, catalog);
  const { error } = await supabase.from('players').update(payload).eq('id', playerId);
  if (error) throw new Error(error.message);
}

export async function saveProductionStaffSizes(
  staffId: string,
  sizes: Record<string, string>,
  catalog: SizingProduct[]
) {
  const fields = sizesToStaffFields(sizes);
  const res = await fetch(`/api/coaching-staff/${staffId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      ...fields,
      sizing_metadata: sizes,
    }),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error || 'Error al guardar staff');
  }
}
