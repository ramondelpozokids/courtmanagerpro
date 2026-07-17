import {
  getOfficialPlayerByLegacyId,
  getOfficialStaffByLegacyId,
} from '@/data/rmb-official-roster';
import { getOfficialStatsByLegacyId } from '@/data/rmb-official-stats';
import { getPlayerCompetitionStats } from '@/lib/player-competitions';

export function normalizePlayerProfile(player: Record<string, unknown> | null) {
  if (!player) return null;

  const legacyId = resolveLegacyId(player);
  const official = legacyId ? getOfficialPlayerByLegacyId(legacyId) : null;
  const officialStats = legacyId ? getOfficialStatsByLegacyId(legacyId) : null;
  const meta = (player.metadata || {}) as Record<string, unknown>;
  const competition_stats = getPlayerCompetitionStats(player);

  return {
    ...player,
    full_name: official?.full_name ?? player.full_name ?? officialStats?.full_name ?? player.full_name,
    dorsal: official?.dorsal ?? player.dorsal ?? officialStats?.dorsal,
    nationality: official?.nationality ?? player.nationality,
    birth_date: official?.birth_date ?? player.birth_date ?? meta.birth_date,
    birth_place: official?.birth_place ?? player.birth_place ?? meta.birth_place ?? officialStats?.birth_place,
    weight: official?.weight ?? player.weight ?? meta.weight ?? officialStats?.weight,
    height: official?.height ?? player.height ?? meta.height ?? officialStats?.height,
    matches_played: official?.matches_played ?? player.matches_played ?? meta.matches_played ?? officialStats?.matches_played,
    points: official?.points ?? player.points ?? meta.points ?? officialStats?.points,
    rebounds: official?.rebounds ?? player.rebounds ?? meta.rebounds ?? officialStats?.rebounds,
    assists: official?.assists ?? player.assists ?? meta.assists ?? officialStats?.assists,
    minutes_played: official?.minutes_played ?? player.minutes_played ?? meta.minutes_played ?? officialStats?.minutes_played,
    valuation: official?.valuation ?? player.valuation ?? meta.valuation ?? officialStats?.valuation,
    debut: official?.debut ?? player.debut ?? meta.debut,
    trajectory: official?.trajectory ?? player.trajectory ?? meta.trajectory,
    palmares: official?.palmares?.length ? official.palmares : player.palmares ?? meta.palmares,
    profile_url: official?.profile_url ?? player.profile_url ?? meta.profile_url ?? officialStats?.profile_url,
    photo_url: official?.photo_url ?? player.photo_url ?? officialStats?.photo_url,
    action_image: player.action_image ?? meta.action_image,
    competition_stats,
  };
}

export function normalizeStaffProfile(staff: Record<string, unknown> | null) {
  if (!staff) return null;
  const legacyId =
    typeof staff.id === 'string' && /^c\d+$/i.test(staff.id) ? staff.id : null;
  const official = legacyId ? getOfficialStaffByLegacyId(legacyId) : null;
  const birthPlace = (official?.birth_place ?? staff.birth_place) as string | null | undefined;
  let nationality = (official?.nationality ?? staff.nationality) as string | null | undefined;
  if (!nationality) {
    nationality = birthPlace?.toLowerCase().includes('españa') ? 'España' : 'España';
  }

  return {
    ...staff,
    full_name: official?.full_name ?? staff.full_name,
    role: official?.role === 'Entrenador' ? 'Entrenador Principal' : official?.role ?? staff.role,
    nationality,
    birth_date: official?.birth_date ?? staff.birth_date,
    birth_place: birthPlace,
    photo_url: official?.photo_url ?? staff.photo_url,
    profile_url: official?.profile_url ?? staff.profile_url,
    trajectory: official?.trajectory ?? staff.trajectory,
    trajectory_items:
      official?.trajectory_items?.length
        ? official.trajectory_items
        : staff.trajectory_items ?? [],
    palmares: official?.palmares?.length ? official.palmares : staff.palmares,
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
  const official = getOfficialPlayerByLegacyId(legacyId);
  const officialStats = getOfficialStatsByLegacyId(legacyId);
  const competition_stats =
    official?.competition_stats ??
    officialStats?.competition_stats ??
    getPlayerCompetitionStats(player);

  return {
    legacy_id: legacyId,
    slug: official?.slug ?? null,
    birth_place: official?.birth_place ?? player.birth_place ?? null,
    weight: official?.weight ?? player.weight ?? null,
    height: official?.height ?? player.height ?? null,
    matches_played: official?.matches_played ?? player.matches_played ?? null,
    points: official?.points ?? player.points ?? null,
    rebounds: official?.rebounds ?? player.rebounds ?? null,
    assists: official?.assists ?? player.assists ?? null,
    minutes_played: official?.minutes_played ?? player.minutes_played ?? null,
    valuation: official?.valuation ?? player.valuation ?? null,
    debut: official?.debut ?? player.debut ?? null,
    trajectory: official?.trajectory ?? player.trajectory ?? null,
    palmares: official?.palmares?.length ? official.palmares : player.palmares ?? [],
    profile_url: official?.profile_url ?? player.profile_url ?? null,
    action_image: player.actionImage ?? null,
    competition_stats,
    stats_source: official || officialStats ? 'realmadrid.com' : 'local',
    stats_synced_at:
      (official?.competition_stats as any)?.liga_endesa?.stats?.updated_at ??
      officialStats?.competition_stats?.liga_endesa?.stats?.updated_at ??
      null,
  };
}
