import {
  getOfficialPlayerByLegacyId,
  getOfficialStaffByLegacyId,
  getOfficialStaffByName,
  getOfficialStaffBySlug,
} from '@/data/rmb-official-roster';
import { getOfficialStatsByLegacyId } from '@/data/rmb-official-stats';
import { getPlayerCompetitionStats } from '@/lib/player-competitions';
import { getRmbProvisionalPlayer } from '@/data/rmb-provisional-players';
import { resolvePlayerPhotoUrl } from '@/lib/player-photo';

export function normalizePlayerProfile(player: Record<string, unknown> | null) {
  if (!player) return null;

  const legacyId = resolveLegacyId(player);
  const official = legacyId ? getOfficialPlayerByLegacyId(legacyId) : null;
  const officialStats = legacyId ? getOfficialStatsByLegacyId(legacyId) : null;
  const meta = (player.metadata || {}) as Record<string, unknown>;
  const competition_stats = getPlayerCompetitionStats(player);

  const provisional = getRmbProvisionalPlayer(
    (meta.official_slug as string) || official?.slug || String(player.full_name || '')
  );

  return {
    ...player,
    full_name: official?.full_name ?? player.full_name ?? officialStats?.full_name ?? player.full_name,
    dorsal: official?.dorsal ?? player.dorsal ?? officialStats?.dorsal,
    nationality: official?.nationality ?? provisional?.nationality ?? player.nationality,
    birth_date: official?.birth_date ?? provisional?.birth_date ?? player.birth_date ?? meta.birth_date,
    birth_place: official?.birth_place ?? provisional?.birth_place ?? player.birth_place ?? meta.birth_place ?? officialStats?.birth_place,
    weight: official?.weight ?? provisional?.weight ?? player.weight ?? meta.weight ?? officialStats?.weight,
    height: official?.height ?? provisional?.height ?? player.height ?? meta.height ?? officialStats?.height,
    matches_played: official?.matches_played ?? player.matches_played ?? meta.matches_played ?? officialStats?.matches_played,
    points: official?.points ?? player.points ?? meta.points ?? officialStats?.points,
    rebounds: official?.rebounds ?? player.rebounds ?? meta.rebounds ?? officialStats?.rebounds,
    assists: official?.assists ?? player.assists ?? meta.assists ?? officialStats?.assists,
    minutes_played: official?.minutes_played ?? player.minutes_played ?? meta.minutes_played ?? officialStats?.minutes_played,
    valuation: official?.valuation ?? player.valuation ?? meta.valuation ?? officialStats?.valuation,
    debut: official?.debut ?? player.debut ?? meta.debut,
    trajectory: official?.trajectory ?? provisional?.trajectory ?? player.trajectory ?? meta.trajectory,
    palmares: official?.palmares?.length ? official.palmares : player.palmares ?? meta.palmares,
    profile_url: official?.profile_url ?? player.profile_url ?? meta.profile_url ?? officialStats?.profile_url,
    photo_url:
      resolvePlayerPhotoUrl({
        official_slug: (meta.official_slug as string) || official?.slug || null,
        photo_url:
          (typeof player.photo_url === 'string' ? player.photo_url : null) ??
          official?.photo_url ??
          officialStats?.photo_url ??
          null,
        fullName: String(official?.full_name ?? player.full_name ?? officialStats?.full_name ?? ''),
      }) ??
      official?.photo_url ??
      (typeof player.photo_url === 'string' ? player.photo_url : null) ??
      officialStats?.photo_url ??
      null,
    photo_provisional: Boolean(provisional && !official && (meta.photo_provisional || provisional.slug)),
    action_image: player.action_image ?? meta.action_image,
    competition_stats,
  };
}

export type NormalizedStaffProfile = {
  id?: string;
  full_name: string;
  role: string;
  nationality: string;
  birth_date: string | null;
  birth_place: string | null;
  photo_url: string | null;
  profile_url: string | null;
  trajectory: string;
  trajectory_items: string[];
  palmares: string[];
  email?: string | null;
  shirt_size?: string | null;
  shorts_size?: string | null;
  shoe_size?: string | number | null;
};

/** Notas de coaching_staff: JSON con profile_url / birth_* o URL suelta de sync. */
export function parseStaffNotes(notes: unknown): Record<string, unknown> {
  if (notes == null) return {};
  if (typeof notes === 'object' && !Array.isArray(notes)) {
    return notes as Record<string, unknown>;
  }
  if (typeof notes !== 'string') return {};
  const trimmed = notes.trim();
  if (!trimmed) return {};
  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      return {};
    }
  }
  if (/^https?:\/\//i.test(trimmed)) return { profile_url: trimmed };
  return {};
}

export function normalizeStaffProfile(
  staff: Record<string, unknown> | null,
  options?: { applyOfficialRoster?: boolean }
): NormalizedStaffProfile | null {
  if (!staff) return null;
  // Solo RMB: no mapear IDs ATM/RMF/VBC a Pedro Martínez et al.
  const applyOfficial = options?.applyOfficialRoster === true;
  const notes = parseStaffNotes(staff.notes);
  const meta =
    staff.metadata && typeof staff.metadata === 'object' && !Array.isArray(staff.metadata)
      ? (staff.metadata as Record<string, unknown>)
      : {};
  const legacyId =
    applyOfficial && typeof staff.id === 'string' && /^c\d+$/i.test(staff.id)
      ? staff.id
      : typeof notes.demo_id === 'string' && /^c\d+$/i.test(notes.demo_id)
        ? notes.demo_id
        : null;
  const slugCandidate =
    (typeof notes.official_slug === 'string' && notes.official_slug) ||
    (typeof meta.official_slug === 'string' && meta.official_slug) ||
    null;
  const official = applyOfficial
    ? (legacyId ? getOfficialStaffByLegacyId(legacyId) : null) ||
      (slugCandidate ? getOfficialStaffBySlug(slugCandidate) : null) ||
      getOfficialStaffByName(String(staff.full_name || ''))
    : null;
  const birthPlace =
    (official?.birth_place ??
      (typeof staff.birth_place === 'string' ? staff.birth_place : null) ??
      (typeof notes.birth_place === 'string' ? notes.birth_place : null) ??
      (typeof meta.birth_place === 'string' ? meta.birth_place : null)) ||
    null;
  const nationalityRaw =
    official?.nationality ?? (typeof staff.nationality === 'string' ? staff.nationality : null);
  const nationality = nationalityRaw || 'España';
  const notesTrajectoryItems = Array.isArray(notes.trajectory_items)
    ? (notes.trajectory_items as string[])
    : [];
  const notesPalmares = Array.isArray(notes.palmares) ? (notes.palmares as string[]) : [];
  const trajectoryItems = official?.trajectory_items?.length
    ? official.trajectory_items
    : Array.isArray(staff.trajectory_items)
      ? (staff.trajectory_items as string[])
      : notesTrajectoryItems;
  const palmares = official?.palmares?.length
    ? official.palmares
    : Array.isArray(staff.palmares)
      ? (staff.palmares as string[])
      : notesPalmares;
  const profileFromNotes =
    typeof notes.profile_url === 'string' ? notes.profile_url : null;
  const trajectoryFromNotes =
    typeof notes.trajectory === 'string' ? notes.trajectory : null;

  return {
    id: typeof staff.id === 'string' ? staff.id : legacyId || undefined,
    full_name: String(official?.full_name ?? staff.full_name ?? ''),
    role: String(
      official?.role === 'Entrenador'
        ? 'Entrenador Principal'
        : official?.role ?? staff.role ?? 'Cuerpo técnico'
    ),
    nationality,
    birth_date:
      official?.birth_date ??
      (typeof staff.birth_date === 'string' ? staff.birth_date : null) ??
      (typeof notes.birth_date === 'string' ? notes.birth_date : null) ??
      (typeof meta.birth_date === 'string' ? meta.birth_date : null),
    birth_place: birthPlace,
    photo_url:
      resolvePlayerPhotoUrl({
        slug: official?.slug || slugCandidate,
        photo_url:
          (typeof staff.photo_url === 'string' ? staff.photo_url : null) ??
          official?.photo_url ??
          null,
        fullName: String(official?.full_name ?? staff.full_name ?? ''),
        isStaff: true,
      }) ??
      official?.photo_url ??
      (typeof staff.photo_url === 'string' ? staff.photo_url : null),
    profile_url:
      official?.profile_url ??
      (typeof staff.profile_url === 'string' ? staff.profile_url : null) ??
      profileFromNotes,
    trajectory: String(
      official?.trajectory ?? staff.trajectory ?? trajectoryFromNotes ?? ''
    ),
    trajectory_items: trajectoryItems,
    palmares,
    email: typeof staff.email === 'string' ? staff.email : null,
    shirt_size: typeof staff.shirt_size === 'string' ? staff.shirt_size : null,
    shorts_size: typeof staff.shorts_size === 'string' ? staff.shorts_size : null,
    shoe_size:
      typeof staff.shoe_size === 'string' || typeof staff.shoe_size === 'number'
        ? staff.shoe_size
        : null,
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
