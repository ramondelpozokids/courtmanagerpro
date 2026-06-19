import {
  buildCompetitionStatsFromLegacy,
  getPlayerCompetitionStats,
  type PlayerCompetitionMap,
} from '@/lib/player-competitions';

export function normalizePlayerProfile(player: Record<string, unknown> | null) {
  if (!player) return null;

  const meta = (player.metadata || {}) as Record<string, unknown>;
  const competition_stats = getPlayerCompetitionStats(player);

  return {
    ...player,
    birth_place: player.birth_place ?? meta.birth_place,
    weight: player.weight ?? meta.weight,
    height: player.height ?? meta.height,
    matches_played: player.matches_played ?? meta.matches_played,
    points: player.points ?? meta.points,
    rebounds: player.rebounds ?? meta.rebounds,
    assists: player.assists ?? meta.assists,
    minutes_played: player.minutes_played ?? meta.minutes_played,
    valuation: player.valuation ?? meta.valuation,
    debut: player.debut ?? meta.debut,
    trajectory: player.trajectory ?? meta.trajectory,
    palmares: player.palmares ?? meta.palmares,
    profile_url: player.profile_url ?? meta.profile_url,
    action_image: player.action_image ?? meta.action_image,
    competition_stats,
  };
}

export function buildPlayerMetadataExtras(player: Record<string, unknown>) {
  const competition_stats =
    (player.competition_stats as PlayerCompetitionMap | undefined) ??
    buildCompetitionStatsFromLegacy(player);

  return {
    legacy_id: player.id,
    birth_place: player.birth_place ?? null,
    weight: player.weight ?? null,
    height: player.height ?? null,
    matches_played: player.matches_played ?? null,
    points: player.points ?? null,
    rebounds: player.rebounds ?? null,
    assists: player.assists ?? null,
    minutes_played: player.minutes_played ?? null,
    valuation: player.valuation ?? null,
    debut: player.debut ?? null,
    trajectory: player.trajectory ?? null,
    palmares: player.palmares ?? [],
    profile_url: player.profile_url ?? null,
    action_image: player.actionImage ?? null,
    competition_stats,
  };
}
