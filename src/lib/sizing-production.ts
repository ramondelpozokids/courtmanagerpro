import type { Player } from '@/types';
import { getSupabaseClient } from '@/infrastructure/supabase/client';
import { DEFAULT_TEAM_ID } from '@/lib/team-constants';
import { resolvePlayerPhotoUrl } from '@/lib/player-photo';
import {
  resolveAtmPackPlayerPhoto,
  resolveAtmPackStaffPhoto,
} from '@/lib/atm-pack-photos';
import { CLUB_TEAM_IDS } from '@/lib/club-team-ids';
import { atmPlayers, atmCoachingStaff } from '@/data/clubs/atm-data';
import {
  mergeSizingCatalog,
  normalizeSizes,
  staffToSizes,
  sizesToStaffFields,
  type SizingProduct,
} from '@/content/sizing-products';

function normName(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function dedupeStaffByName<T extends { id?: unknown; full_name?: unknown }>(rows: T[]): T[] {
  const sorted = [...rows].sort((a, b) => {
    const idA = String(a.id || '');
    const idB = String(b.id || '');
    const score = (id: string) => (id.includes('8008-') ? 0 : 1);
    return score(idA) - score(idB);
  });
  const seen = new Set<string>();
  return sorted.filter((row) => {
    const key = normName(String(row.full_name || ''));
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function atmPackPlayersToSizing(catalog: SizingProduct[]) {
  return atmPlayers.map((p) => ({
    id: p.id,
    firstName: p.firstName,
    lastName: p.lastName,
    number: p.number,
    position: p.position as Player['position'],
    status: 'ACTIVE' as const,
    nationality: p.nationality || 'España',
    birthDate: p.birthDate || '',
    imageUrl:
      resolveAtmPackPlayerPhoto({
        dorsal: p.number,
        fullName: `${p.firstName} ${p.lastName}`,
        photo_url: p.imageUrl,
      }) || p.imageUrl || undefined,
    slug: undefined as string | undefined,
    sizes: normalizeSizes(p.sizes as Record<string, string | number | undefined>, catalog),
  }));
}

function atmPackStaffToSizing(catalog: SizingProduct[]) {
  return atmCoachingStaff.map((s) => {
    const photo =
      resolveAtmPackStaffPhoto({ fullName: s.full_name, photo_url: s.photo_url }) || s.photo_url;
    return {
      id: s.id,
      full_name: s.full_name,
      role: s.role,
      email: s.email,
      nationality: s.nationality,
      photo_url: photo,
      ...sizesToStaffFields(
        staffToSizes(
          {
            shirt_size: s.shirt_size,
            shorts_size: s.shorts_size,
            shoe_size: s.shoe_size,
          } as any,
          catalog
        )
      ),
    };
  });
}

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
  // ATM: no usar resolvePlayerPhotoUrl (plantilla RMB) — provoca URLs ajenas / rotas
  let imageUrl: string | null =
    p.team_id === CLUB_TEAM_IDS.atm
      ? resolveAtmPackPlayerPhoto({
          dorsal: p.dorsal,
          fullName: p.full_name,
          photo_url: p.photo_url,
        })
      : resolvePlayerPhotoUrl({
          official_slug: p.official_slug,
          photo_url: p.photo_url,
          fullName: p.full_name,
        });
  return {
    id: p.id,
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || '',
    number: p.dorsal,
    position: p.position,
    status: p.is_active ? 'ACTIVE' : 'INACTIVE',
    nationality: p.nationality || 'España',
    birthDate: p.birth_date || '',
    imageUrl: imageUrl || undefined,
    slug: p.official_slug || undefined,
    sizes: normalizeSizes(legacy, catalog),
  };
}

export function supabaseStaffToSizingRow(s: Record<string, unknown>, catalog: SizingProduct[]) {
  const meta = (s.sizing_metadata as Record<string, string>) || {};
  const fullName = String(s.full_name || '');
  let photo_url = resolvePlayerPhotoUrl({
    official_slug: typeof s.official_slug === 'string' ? s.official_slug : null,
    slug: typeof s.slug === 'string' ? s.slug : null,
    photo_url: typeof s.photo_url === 'string' ? s.photo_url : null,
    fullName,
    isStaff: true,
  });
  if (String(s.team_id || '') === CLUB_TEAM_IDS.atm) {
    photo_url = resolveAtmPackStaffPhoto({ fullName, photo_url });
  }
  return {
    id: s.id,
    full_name: s.full_name,
    role: s.role,
    email: s.email,
    nationality: s.nationality,
    photo_url,
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
  let players = (playerRows as Player[]).map((p) => supabasePlayerToSizingRow(p, fullCatalog));
  let staff = dedupeStaffByName(staffRows).map((s: Record<string, unknown>) =>
    supabaseStaffToSizingRow(s, fullCatalog)
  );

  // ATM: alinear con plantilla (24 jugadores + 5 cuerpo técnico)
  if (teamId === CLUB_TEAM_IDS.atm) {
    if (players.length === 0) players = atmPackPlayersToSizing(fullCatalog);
    if (staff.length === 0) staff = atmPackStaffToSizing(fullCatalog);
  }

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
