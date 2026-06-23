import type { ClubSlug } from '@/data/clubs/types';
import { CLUB_PACKS } from '@/data/clubs';
import { ALL_CLUB_SLUGS } from '@/lib/permissions';
import { CLUB_TEAM_IDS } from '@/lib/club-team-ids';
import { buildPlayerMetadataExtras } from '@/lib/player-profile';
import { getPlayerCompetitionStats } from '@/lib/player-competitions';
import type { Player } from '@/types';

type DemoPackPlayer = {
  id: string;
  firstName: string;
  lastName: string;
  number: number;
  position: string;
  nationality?: string;
  birthDate?: string;
  imageUrl?: string;
  status?: string;
  sizes: Record<string, string>;
  birth_place?: string;
  weight?: string;
  height?: string;
  matches_played?: number;
  points?: number;
  rebounds?: number;
  assists?: number;
  minutes_played?: number;
  valuation?: number;
  debut?: string;
  trajectory?: string;
  palmares?: string[];
  profile_url?: string;
  actionImage?: string;
};

const CLUB_SLUG_ORDER = [...ALL_CLUB_SLUGS];

function normalizePosition(position: string): Player['position'] {
  return position.toLowerCase().replace('-', '_') as Player['position'];
}

export function parseAllClubsPlayerRouteId(routeId: string): { slug: ClubSlug; demoId: string } | null {
  const match = routeId.match(/^(rmb|fcb|fbat|vbc)__(.+)$/);
  if (!match) return null;
  return { slug: match[1] as ClubSlug, demoId: match[2] };
}

export function mapPackPlayerToApi(p: DemoPackPlayer, slug: ClubSlug): Player {
  const teamId = CLUB_TEAM_IDS[slug];
  const pack = CLUB_PACKS[slug];

  return {
    id: `${slug}__${p.id}`,
    team_id: teamId,
    user_id: slug === 'rmb' && p.id === 'p1' ? 'u1' : null,
    dorsal: p.number,
    full_name: `${p.firstName} ${p.lastName}`,
    position: normalizePosition(p.position),
    nationality: p.nationality || 'España',
    birth_date: p.birthDate || '1995-01-01',
    photo_url: p.imageUrl || null,
    is_active: (p.status ?? 'ACTIVE') === 'ACTIVE',
    shirt_size: p.sizes.jersey,
    shorts_size: p.sizes.shorts,
    shoe_size: Number(p.sizes.shoes) || 46,
    jacket_size: p.sizes.warmupShirt,
    underwear_size: 'XL',
    sock_size: p.sizes.socks,
    suit_size: '52',
    hat_size: 'M',
    jersey_name: p.lastName.toUpperCase(),
    contract_end: '2027-06-30',
    notes: null,
    metadata: {
      clubSlug: slug,
      demoPlayerId: p.id,
      clubShortName: pack.branding.shortName,
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export function mapAllClubPlayersFromPacks(): Player[] {
  return CLUB_SLUG_ORDER.flatMap((slug) =>
    CLUB_PACKS[slug].players.map((p) => mapPackPlayerToApi(p as DemoPackPlayer, slug))
  );
}

export function sortAllClubPlayers(players: Player[]): Player[] {
  const teamOrder = CLUB_SLUG_ORDER.map((slug) => CLUB_TEAM_IDS[slug]);
  return [...players].sort((a, b) => {
    const teamCompare = teamOrder.indexOf(a.team_id) - teamOrder.indexOf(b.team_id);
    if (teamCompare !== 0) return teamCompare;
    return a.dorsal - b.dorsal;
  });
}

export function mapPackPlayerDetailFromRoute(routeId: string) {
  const parsed = parseAllClubsPlayerRouteId(routeId);
  if (!parsed) return null;

  const player = CLUB_PACKS[parsed.slug].players.find((p) => p.id === parsed.demoId) as
    | DemoPackPlayer
    | undefined;
  if (!player) return null;

  const extras = buildPlayerMetadataExtras(player);

  return {
    id: `${parsed.slug}__${player.id}`,
    full_name: `${player.firstName} ${player.lastName}`,
    dorsal: player.number,
    position: player.position,
    nationality: player.nationality || 'España',
    birth_date: player.birthDate || '1995-01-01',
    photo_url: player.imageUrl || null,
    is_active: (player.status ?? 'ACTIVE') === 'ACTIVE',
    shirt_size: player.sizes.jersey,
    shorts_size: player.sizes.shorts,
    shoe_size: Number(player.sizes.shoes) || 47,
    jacket_size: player.sizes.warmupShirt,
    sock_size: player.sizes.socks,
    birth_place: player.birth_place,
    weight: player.weight,
    height: player.height,
    matches_played: player.matches_played,
    points: player.points,
    rebounds: player.rebounds,
    assists: player.assists,
    minutes_played: player.minutes_played,
    valuation: player.valuation,
    debut: player.debut,
    trajectory: player.trajectory,
    palmares: player.palmares,
    profile_url: player.profile_url,
    action_image: player.actionImage || null,
    metadata: {
      ...extras,
      clubSlug: parsed.slug,
      demoPlayerId: player.id,
      clubShortName: CLUB_PACKS[parsed.slug].branding.shortName,
    },
    competition_stats: getPlayerCompetitionStats({
      ...player,
      metadata: { competition_stats: extras.competition_stats },
    }),
  };
}

export async function fetchAllClubPlayersFromSupabase(
  supabase: { from: (table: string) => any }
): Promise<Player[]> {
  const teamIds = CLUB_SLUG_ORDER.map((slug) => CLUB_TEAM_IDS[slug]);

  const { data, error } = await supabase
    .from('players')
    .select('*')
    .in('team_id', teamIds)
    .eq('is_active', true)
    .order('dorsal');

  if (error) throw new Error(error.message);

  const rows = (data ?? []) as Player[];
  const rowsByTeam = new Map<string, Player[]>();

  for (const row of rows) {
    const list = rowsByTeam.get(row.team_id) ?? [];
    list.push(row);
    rowsByTeam.set(row.team_id, list);
  }

  const merged: Player[] = [];

  for (const slug of CLUB_SLUG_ORDER) {
    const teamId = CLUB_TEAM_IDS[slug];
    const fromDb = rowsByTeam.get(teamId);
    if (fromDb?.length) {
      merged.push(...fromDb);
      continue;
    }
    merged.push(...CLUB_PACKS[slug].players.map((p) => mapPackPlayerToApi(p as DemoPackPlayer, slug)));
  }

  return sortAllClubPlayers(merged);
}
