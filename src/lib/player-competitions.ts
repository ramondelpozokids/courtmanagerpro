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
};

export function buildCompetitionStatsFromLegacy(player: Record<string, unknown>): PlayerCompetitionMap {
  const legacyId = String(player.id || (player.metadata as Record<string, unknown> | undefined)?.legacy_id || '');
  const matches = Number(player.matches_played) || 0;
  if (matches === 0) {
    return {
      liga_endesa: { stats: { ...EMPTY_STATS, season: '2025-2026' } },
      euroliga: { stats: { ...EMPTY_STATS, season: '2025-2026' } },
      supercopa_endesa: { stats: { ...EMPTY_STATS, season: '2025-2026' } },
      copa_del_rey: { stats: { ...EMPTY_STATS, season: '2025-2026' } },
    };
  }

  const base: PlayerCompetitionStats = {
    season: '2025-2026',
    matches_played: matches,
    points: Number(player.points) || 0,
    rebounds: Number(player.rebounds) || 0,
    assists: Number(player.assists) || 0,
    minutes_played: Number(player.minutes_played) || 0,
    valuation: Number(player.valuation) || 0,
    ppg: matches ? Number(((Number(player.points) || 0) / matches).toFixed(1)) : 0,
    rpg: matches ? Number(((Number(player.rebounds) || 0) / matches).toFixed(1)) : 0,
    apg: matches ? Number(((Number(player.assists) || 0) / matches).toFixed(1)) : 0,
  };

  const playoffGames =
    legacyId === 'p15'
      ? [
          {
            id: 'p15-g1',
            date: '2026-06-06T18:00:00',
            opponent: 'La Laguna Tenerife',
            venue: 'Movistar Arena',
            is_home: true,
            team_score: 95,
            opponent_score: 107,
            minutes: 14,
            points: 6,
            rebounds: 5,
            assists: 0,
            valuation: 8,
          },
          {
            id: 'p15-g2',
            date: '2026-06-08T20:30:00',
            opponent: 'La Laguna Tenerife',
            venue: 'Pabellón Santiago Martín de La Laguna',
            is_home: false,
            team_score: 118,
            opponent_score: 83,
            minutes: 16,
            points: 8,
            rebounds: 5,
            assists: 0,
            valuation: 10,
          },
          {
            id: 'p15-g3',
            date: '2026-06-10T21:00:00',
            opponent: 'La Laguna Tenerife',
            venue: 'Movistar Arena',
            is_home: true,
            team_score: 97,
            opponent_score: 98,
            minutes: 14,
            points: 4,
            rebounds: 4,
            assists: 0,
            valuation: 7,
          },
        ]
      : undefined;

  return {
    liga_endesa: {
      stats: {
        ...base,
        phase: matches >= 3 ? 'Cuartos de Final' : 'Fase Regular',
      },
      games: playoffGames,
    },
    euroliga: { stats: { ...EMPTY_STATS, season: '2025-2026' } },
    supercopa_endesa: { stats: { ...EMPTY_STATS, season: '2025-2026' } },
    copa_del_rey: { stats: { ...EMPTY_STATS, season: '2025-2026' } },
  };
}

export function getPlayerCompetitionStats(player: Record<string, unknown> | null): PlayerCompetitionMap {
  if (!player) return {};

  const meta = (player.metadata || {}) as Record<string, unknown>;
  const fromMeta = meta.competition_stats as PlayerCompetitionMap | undefined;
  if (fromMeta && Object.keys(fromMeta).length > 0) return fromMeta;

  const direct = player.competition_stats as PlayerCompetitionMap | undefined;
  if (direct && Object.keys(direct).length > 0) return direct;

  return buildCompetitionStatsFromLegacy(player);
}

export function hasCompetitionData(map: PlayerCompetitionMap, id: CompetitionId): boolean {
  const profile = map[id];
  return Boolean(profile?.stats && profile.stats.matches_played > 0);
}
