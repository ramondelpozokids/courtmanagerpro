import {
  buildRmbDemoPlayersFromOfficial,
  buildRmbDemoStaffFromOfficial,
} from '@/lib/build-rmb-demo-roster';
import { CLUB_TEAM_IDS } from '@/lib/club-team-ids';
import { demoPlayerIdToUuid } from '@/lib/team-constants';
import { resolvePlayerPhotoUrl } from '@/lib/player-photo';
import type { Player } from '@/types';

function normKey(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/** Plantilla oficial RMB (17 jugadores) como filas Player. */
export function rmbPackAsPlayers(teamId: string = CLUB_TEAM_IDS.rmb): Player[] {
  return buildRmbDemoPlayersFromOfficial().map((p) => ({
    id: demoPlayerIdToUuid(p.id),
    team_id: teamId,
    user_id: p.id === 'p1' ? 'u1' : null,
    dorsal: p.number,
    full_name: `${p.firstName} ${p.lastName}`.trim(),
    position: String(p.position || 'alero').toLowerCase() as Player['position'],
    nationality: p.nationality || 'España',
    birth_date: p.birthDate || null,
    photo_url:
      resolvePlayerPhotoUrl({
        slug: p.slug,
        photo_url: p.imageUrl,
        fullName: `${p.firstName} ${p.lastName}`.trim(),
      }) || p.imageUrl || null,
    is_active: true,
    jersey_name: (p.lastName || '').toUpperCase() || null,
    contract_end: null,
    notes: null,
    metadata: { official_slug: p.slug, legacy_id: p.id },
    shirt_size: p.sizes.jersey,
    shorts_size: p.sizes.shorts,
    shoe_size: Number(p.sizes.shoes) || 45,
    jacket_size: p.sizes.warmupShirt,
    underwear_size: 'L',
    sock_size: p.sizes.socks,
    suit_size: null,
    hat_size: null,
    official_slug: p.slug,
    source: 'realmadrid.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
}

export function rmbPackAsStaff() {
  return buildRmbDemoStaffFromOfficial().map((s) => ({
    ...s,
    team_id: CLUB_TEAM_IDS.rmb,
    official_slug: s.slug,
    photo_url: resolvePlayerPhotoUrl({
      slug: s.slug,
      photo_url: s.photo_url,
      fullName: s.full_name,
      isStaff: true,
    }),
  }));
}

function livePlayerMatchesPack(live: Player, pack: Player): boolean {
  const liveSlug = String(live.official_slug || live.metadata?.official_slug || '').toLowerCase();
  const packSlug = String(pack.official_slug || '').toLowerCase();
  if (liveSlug && packSlug && liveSlug === packSlug) return true;
  if (live.dorsal && pack.dorsal && live.dorsal === pack.dorsal) return true;
  const a = normKey(live.full_name || '');
  const b = normKey(pack.full_name || '');
  return Boolean(a && b && (a === b || a.includes(b) || b.includes(a)));
}

/**
 * La web oficial es la fuente de quién está en plantilla.
 * Si Supabase no tiene a Ndiaye o al cuerpo técnico nuevo, se completa desde el pack
 * y se conservan tallas/ids live cuando coinciden.
 */
export function preferRmbRosterIfStale(live: Player[], teamId: string): Player[] {
  if (teamId !== CLUB_TEAM_IDS.rmb) return live;
  const pack = rmbPackAsPlayers(teamId);
  if (!live.length) return pack;

  return pack.map((packP) => {
    const liveP = live.find((l) => livePlayerMatchesPack(l, packP));
    if (!liveP) return packP;
    return {
      ...packP,
      id: liveP.id,
      shirt_size: liveP.shirt_size || packP.shirt_size,
      shorts_size: liveP.shorts_size || packP.shorts_size,
      shoe_size: liveP.shoe_size || packP.shoe_size,
      jacket_size: liveP.jacket_size || packP.jacket_size,
      sock_size: liveP.sock_size || packP.sock_size,
      underwear_size: liveP.underwear_size || packP.underwear_size,
      photo_url: liveP.photo_url || packP.photo_url,
      metadata: { ...packP.metadata, ...(liveP.metadata || {}) },
    };
  });
}

function liveStaffMatchesPack(
  live: Record<string, unknown>,
  pack: Record<string, unknown>
): boolean {
  const liveSlug = String(live.official_slug || live.slug || '').toLowerCase();
  const packSlug = String(pack.official_slug || pack.slug || '').toLowerCase();
  if (liveSlug && packSlug && liveSlug === packSlug) return true;
  const a = normKey(String(live.full_name || ''));
  const b = normKey(String(pack.full_name || ''));
  return Boolean(a && b && a === b);
}

export function preferRmbStaffIfStale(
  live: Record<string, unknown>[],
  teamId: string
): Record<string, unknown>[] {
  if (teamId !== CLUB_TEAM_IDS.rmb) return live;
  const pack = rmbPackAsStaff() as Record<string, unknown>[];
  if (!live.length) return pack;

  return pack.map((packS) => {
    const liveS = live.find((l) => liveStaffMatchesPack(l, packS));
    if (!liveS) return packS;
    return {
      ...packS,
      ...liveS,
      full_name: packS.full_name,
      role: packS.role,
      photo_url: liveS.photo_url || packS.photo_url,
      profile_url: packS.profile_url || liveS.profile_url,
      slug: packS.slug,
      official_slug: packS.official_slug,
      shirt_size: liveS.shirt_size || packS.shirt_size,
      shorts_size: liveS.shorts_size || packS.shorts_size,
      shoe_size: liveS.shoe_size ?? packS.shoe_size,
    };
  });
}
