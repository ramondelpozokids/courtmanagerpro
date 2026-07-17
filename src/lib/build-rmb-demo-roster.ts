import {
  RMB_OFFICIAL_PLAYERS,
  RMB_OFFICIAL_STAFF,
  type RmbOfficialPlayerProfile,
  type RmbOfficialStaffProfile,
} from '@/data/rmb-official-roster';
import {
  DEFAULT_PLAYER_SIZES,
  DEFAULT_STAFF_SIZES,
  RMB_PLAYER_SIZE_OVERRIDES,
  RMB_STAFF_SIZE_OVERRIDES,
} from '@/data/rmb-sizing-overrides';

/** Demo player shape used by InMemoryDB / club packs. */
export function buildRmbDemoPlayersFromOfficial() {
  return RMB_OFFICIAL_PLAYERS.map((p) => mapOfficialPlayerToDemo(p));
}

export function buildRmbDemoStaffFromOfficial() {
  return RMB_OFFICIAL_STAFF.map((s) => mapOfficialStaffToDemo(s));
}

function mapOfficialPlayerToDemo(p: RmbOfficialPlayerProfile) {
  const sizes = RMB_PLAYER_SIZE_OVERRIDES[p.slug] ?? DEFAULT_PLAYER_SIZES;
  return {
    id: p.legacyId,
    firstName: p.firstName || p.nickname || p.full_name.split(' ')[0] || 'Jugador',
    lastName: p.lastName || p.full_name.split(' ').slice(1).join(' ') || p.nickname || '',
    number: p.dorsal,
    position: p.position_demo,
    status: 'ACTIVE' as const,
    sizes: {
      jersey: sizes.jersey,
      shorts: sizes.shorts,
      shoes: sizes.shoes,
      socks: sizes.socks,
      warmupShirt: sizes.warmupShirt,
    },
    nationality: p.nationality || 'España',
    birthDate: p.birth_date || undefined,
    imageUrl: p.photo_url || undefined,
    profile_url: p.profile_url,
    birth_place: p.birth_place || undefined,
    weight: p.weight || undefined,
    height: p.height || undefined,
    matches_played: p.matches_played,
    points: p.points,
    rebounds: p.rebounds,
    assists: p.assists,
    minutes_played: p.minutes_played,
    valuation: p.valuation,
    debut: p.debut || undefined,
    trajectory: p.trajectory || undefined,
    palmares: p.palmares || [],
    slug: p.slug,
    source: 'realmadrid.com' as const,
  };
}

function mapOfficialStaffToDemo(s: RmbOfficialStaffProfile) {
  const sizes = RMB_STAFF_SIZE_OVERRIDES[s.slug] ?? DEFAULT_STAFF_SIZES;
  const emailLocal = s.full_name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.|\.$/g, '');

  return {
    id: s.legacyId,
    full_name: s.full_name,
    role: s.role === 'Entrenador' ? 'Entrenador Principal' : s.role,
    email: `${emailLocal || s.slug}@realmadrid.com`,
    shirt_size: sizes.shirt_size,
    shorts_size: sizes.shorts_size,
    shoe_size: sizes.shoe_size,
    photo_url: s.photo_url,
    nationality: s.nationality || 'España',
    profile_url: s.profile_url,
    birth_place: s.birth_place || undefined,
    birth_date: s.birth_date || undefined,
    trajectory: s.trajectory || undefined,
    palmares: s.palmares || [],
    slug: s.slug,
    source: 'realmadrid.com' as const,
  };
}
