import { getOfficialStatsByLegacyId } from '@/data/rmb-official-stats';
import { getPlayerCompetitionStats, type PlayerCompetitionMap } from '@/lib/player-competitions';

export function normalizePlayerProfile(player: Record<string, unknown> | null) {
  if (!player) return null;

  const legacyId = resolveLegacyId(player);
  const official = legacyId ? getOfficialStatsByLegacyId(legacyId) : null;
  const meta = (player.metadata || {}) as Record<string, unknown>;
  const competition_stats = getPlayerCompetitionStats(player);

  return {
    ...player,
    full_name: player.full_name ?? official?.full_name ?? player.full_name,
    dorsal: player.dorsal ?? official?.dorsal,
    birth_place: player.birth_place ?? meta.birth_place ?? official?.birth_place,
    weight: player.weight ?? meta.weight ?? official?.weight,
    height: player.height ?? meta.height ?? official?.height,
    matches_played: player.matches_played ?? meta.matches_played ?? official?.matches_played,
    points: player.points ?? meta.points ?? official?.points,
    rebounds: player.rebounds ?? meta.rebounds ?? official?.rebounds,
    assists: player.assists ?? meta.assists ?? official?.assists,
    minutes_played: player.minutes_played ?? meta.minutes_played ?? official?.minutes_played,
    valuation: player.valuation ?? meta.valuation ?? official?.valuation,
    debut: player.debut ?? meta.debut,
    trajectory: player.trajectory ?? meta.trajectory,
    palmares: player.palmares ?? meta.palmares,
    profile_url: player.profile_url ?? meta.profile_url ?? official?.profile_url,
    photo_url: player.photo_url ?? official?.photo_url,
    action_image: player.action_image ?? meta.action_image,
    competition_stats,
  };
}

function resolveLegacyId(player: Record<string, unknown>): string | null {
  if (typeof player.id === 'string' && /^p\d+$/i.test(player.id)) return player.id;
  const meta = (player.metadata || {}) as Record<string, unknown>;
  if (typeof meta.legacy_id === 'string') return meta.legacy_id;
  return null;
}

export function buildPlayerMetadataExtras(player: Record<string, unknown>) {
  const legacyId = resolveLegacyId(player) || String(player.id);
  const official = getOfficialStatsByLegacyId(legacyId);
  const competition_stats = official?.competition_stats ?? getPlayerCompetitionStats(player);

  return {
    legacy_id: legacyId,
    birth_place: official?.birth_place ?? player.birth_place ?? null,
    weight: official?.weight ?? player.weight ?? null,
    height: official?.height ?? player.height ?? null,
    matches_played: official?.matches_played ?? player.matches_played ?? null,
    points: official?.points ?? player.points ?? null,
    rebounds: official?.rebounds ?? player.rebounds ?? null,
    assists: official?.assists ?? player.assists ?? null,
    minutes_played: official?.minutes_played ?? player.minutes_played ?? null,
    valuation: official?.valuation ?? player.valuation ?? null,
    debut: player.debut ?? null,
    trajectory: player.trajectory ?? null,
    palmares: player.palmares ?? [],
    profile_url: official?.profile_url ?? player.profile_url ?? null,
    action_image: player.actionImage ?? null,
    competition_stats,
    stats_source: official ? 'realmadrid.com' : 'local',
    stats_synced_at: official?.competition_stats?.liga_endesa?.stats?.updated_at ?? null,
  };
}
