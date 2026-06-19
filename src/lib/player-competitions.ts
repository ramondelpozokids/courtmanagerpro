import {
  getOfficialStatsByLegacyId,
  getOfficialStatsByPlayerId,
} from '@/data/rmb-official-stats';

export type CompetitionId =
  | 'liga_endesa'
  | 'euroliga'
  | 'supercopa_endesa'
  | 'copa_del_rey';

export interface PlayerCompetitionStats {
  season?: string;
  phase?: string;
  matches_played: number;
  points: number;
  rebounds: number;
  assists: number;
  minutes_played?: number;
  valuation?: number;
  steals?: number;
  blocks?: number;
  turnovers?: number;
  fouls?: number;
  ppg?: number;
  rpg?: number;
  apg?: number;
  updated_at?: string;
  updated_by?: string;
  source?: string;
}

export interface PlayerGameLog {
  id: string;
  date: string;
  opponent: string;
  venue?: string;
  team_score?: number;
  opponent_score?: number;
  is_home?: boolean;
  minutes?: number;
  points?: number;
  rebounds?: number;
  assists?: number;
  valuation?: number;
}

export interface PlayerCompetitionProfile {
  stats: PlayerCompetitionStats;
  games?: PlayerGameLog[];
}

export type PlayerCompetitionMap = Partial<Record<CompetitionId, PlayerCompetitionProfile>>;

export const RMB_COMPETITIONS: { id: CompetitionId; label: string; shortLabel: string }[] = [
  { id: 'liga_endesa', label: 'Liga Endesa', shortLabel: 'Liga Endesa' },
  { id: 'euroliga', label: 'Euroliga', shortLabel: 'Euroliga' },
  { id: 'supercopa_endesa', label: 'Supercopa Endesa', shortLabel: 'Supercopa' },
  { id: 'copa_del_rey', label: 'Copa del Rey', shortLabel: 'Copa del Rey' },
];

const EMPTY_STATS: PlayerCompetitionStats = {
  matches_played: 0,
  points: 0,
  rebounds: 0,
  assists: 0,
  minutes_played: 0,
  valuation: 0,
  ppg: 0,
  rpg: 0,
  apg: 0,
};

export function emptyCompetitionMap(season = '2025-2026'): PlayerCompetitionMap {
  return {
    liga_endesa: { stats: { ...EMPTY_STATS, season } },
    euroliga: { stats: { ...EMPTY_STATS, season } },
    supercopa_endesa: { stats: { ...EMPTY_STATS, season } },
    copa_del_rey: { stats: { ...EMPTY_STATS, season } },
  };
}

function resolveLegacyId(player: Record<string, unknown>): string | null {
  if (typeof player.id === 'string' && /^p\d+$/i.test(player.id)) return player.id;
  const meta = (player.metadata || {}) as Record<string, unknown>;
  if (typeof meta.legacy_id === 'string') return meta.legacy_id;
  return null;
}

export function getPlayerCompetitionStats(player: Record<string, unknown> | null): PlayerCompetitionMap {
  if (!player) return emptyCompetitionMap();

  const meta = (player.metadata || {}) as Record<string, unknown>;
  const fromMeta = meta.competition_stats as PlayerCompetitionMap | undefined;
  if (fromMeta && Object.keys(fromMeta).length > 0) return fromMeta;

  const direct = player.competition_stats as PlayerCompetitionMap | undefined;
  if (direct && Object.keys(direct).length > 0) return direct;

  const playerId = String(player.id || '');
  const official =
    getOfficialStatsByPlayerId(playerId) ||
    (resolveLegacyId(player) ? getOfficialStatsByLegacyId(resolveLegacyId(player)!) : null);

  if (official?.competition_stats) return official.competition_stats;

  return emptyCompetitionMap();
}

export function hasCompetitionData(map: PlayerCompetitionMap, id: CompetitionId): boolean {
  const profile = map[id];
  return Boolean(profile?.stats && profile.stats.matches_played > 0);
}

/** @deprecated Usar datos oficiales de realmadrid.com vía getPlayerCompetitionStats */
export function buildCompetitionStatsFromLegacy(player: Record<string, unknown>): PlayerCompetitionMap {
  return getPlayerCompetitionStats(player);
}
