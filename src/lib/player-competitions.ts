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

const LEAGUE_PHASES: Record<CompetitionId, string> = {
  liga_endesa: 'Fase Regular',
  euroliga: 'Fase Regular',
  supercopa_endesa: 'Final',
  copa_del_rey: 'Octavos de Final',
};

function splitInteger(total: number, weights: number[]): number[] {
  if (total <= 0 || weights.every((w) => w <= 0)) {
    return weights.map(() => 0);
  }
  const sum = weights.reduce((acc, w) => acc + w, 0);
  const raw = weights.map((w) => (total * w) / sum);
  const floored = raw.map((v) => Math.floor(v));
  let remainder = total - floored.reduce((acc, v) => acc + v, 0);
  const order = raw
    .map((value, index) => ({ index, fraction: value - floored[index] }))
    .sort((a, b) => b.fraction - a.fraction);
  for (const item of order) {
    if (remainder <= 0) break;
    floored[item.index] += 1;
    remainder -= 1;
  }
  return floored;
}

function getLeagueMatchSplit(totalMatches: number): Record<CompetitionId, number> {
  if (totalMatches <= 5) {
    return {
      liga_endesa: totalMatches,
      euroliga: 0,
      supercopa_endesa: 0,
      copa_del_rey: 0,
    };
  }

  const supercopa = totalMatches >= 20 ? 1 : 0;
  const copa = totalMatches >= 70 ? 4 : totalMatches >= 45 ? 3 : totalMatches >= 25 ? 2 : 0;
  const euroliga = Math.max(Math.round(totalMatches * 0.42), 0);
  const liga = Math.max(totalMatches - euroliga - supercopa - copa, 0);

  return {
    liga_endesa: liga,
    euroliga,
    supercopa_endesa: supercopa,
    copa_del_rey: copa,
  };
}

function buildLeagueStats(
  matches: number,
  points: number,
  rebounds: number,
  assists: number,
  minutes: number,
  valuation: number,
  competition: CompetitionId,
  phase?: string
): PlayerCompetitionStats {
  return {
    season: '2025-2026',
    phase: phase ?? LEAGUE_PHASES[competition],
    matches_played: matches,
    points,
    rebounds,
    assists,
    minutes_played: minutes,
    valuation,
    ppg: matches ? Number((points / matches).toFixed(1)) : 0,
    rpg: matches ? Number((rebounds / matches).toFixed(1)) : 0,
    apg: matches ? Number((assists / matches).toFixed(1)) : 0,
  };
}

function getDemoPlayoffGames(legacyId: string): PlayerGameLog[] | undefined {
  if (legacyId !== 'p15') return undefined;

  return [
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
  ];
}

export function buildCompetitionStatsFromLegacy(player: Record<string, unknown>): PlayerCompetitionMap {
  const legacyId = String(player.id || (player.metadata as Record<string, unknown> | undefined)?.legacy_id || '');
  const totalMatches = Number(player.matches_played) || 0;

  const baseShell: PlayerCompetitionMap = {
    liga_endesa: { stats: { ...EMPTY_STATS, season: '2025-2026' } },
    euroliga: { stats: { ...EMPTY_STATS, season: '2025-2026' } },
    supercopa_endesa: { stats: { ...EMPTY_STATS, season: '2025-2026' } },
    copa_del_rey: { stats: { ...EMPTY_STATS, season: '2025-2026' } },
  };

  if (totalMatches === 0) return baseShell;

  const split = getLeagueMatchSplit(totalMatches);
  const weights = [
    split.liga_endesa,
    split.euroliga,
    split.supercopa_endesa,
    split.copa_del_rey,
  ];

  const [ligaPts, euroPts, superPts, copaPts] = splitInteger(Number(player.points) || 0, weights);
  const [ligaReb, euroReb, superReb, copaReb] = splitInteger(Number(player.rebounds) || 0, weights);
  const [ligaAst, euroAst, superAst, copaAst] = splitInteger(Number(player.assists) || 0, weights);
  const [ligaMin, euroMin, superMin, copaMin] = splitInteger(Number(player.minutes_played) || 0, weights);
  const [ligaVal, euroVal, superVal, copaVal] = splitInteger(Number(player.valuation) || 0, weights);

  const ligaPhase = totalMatches <= 5 || legacyId === 'p15' ? 'Cuartos de Final' : 'Fase Regular';

  return {
    liga_endesa: {
      stats: buildLeagueStats(
        split.liga_endesa,
        ligaPts,
        ligaReb,
        ligaAst,
        ligaMin,
        ligaVal,
        'liga_endesa',
        ligaPhase
      ),
      games: getDemoPlayoffGames(legacyId),
    },
    euroliga: {
      stats: buildLeagueStats(
        split.euroliga,
        euroPts,
        euroReb,
        euroAst,
        euroMin,
        euroVal,
        'euroliga'
      ),
    },
    supercopa_endesa: {
      stats: buildLeagueStats(
        split.supercopa_endesa,
        superPts,
        superReb,
        superAst,
        superMin,
        superVal,
        'supercopa_endesa'
      ),
    },
    copa_del_rey: {
      stats: buildLeagueStats(
        split.copa_del_rey,
        copaPts,
        copaReb,
        copaAst,
        copaMin,
        copaVal,
        'copa_del_rey'
      ),
    },
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
