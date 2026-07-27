import type { ClubSlug } from '@/data/clubs/types';
import { getClubPack, getClubSlugByTeamId } from '@/data/clubs';
import { packToTeam } from '@/lib/club-demo-loader';
import { CLUB_TEAM_IDS } from '@/lib/club-team-ids';
import { DEFAULT_TEAM_ID } from '@/lib/team-constants';
import type { Team } from '@/types';

/** UUID del club activo (preview/switcher) — fuente de verdad frente a currentTeam desfasado. */
export function resolveActiveTeamId(options: {
  clubSlug?: ClubSlug | null;
  brandingTeamId?: string | null;
  currentTeamId?: string | null;
}): string {
  const { clubSlug, brandingTeamId, currentTeamId } = options;
  if (clubSlug && CLUB_TEAM_IDS[clubSlug]) return CLUB_TEAM_IDS[clubSlug];
  if (brandingTeamId) return brandingTeamId;
  if (currentTeamId) return currentTeamId;
  return DEFAULT_TEAM_ID;
}

/** Lee el equipo guardado en localStorage (tras switch RMB/RMF/ATM). */
export function resolveTeamFromStorage(): Team | null {
  if (typeof window === 'undefined') return null;
  const id = localStorage.getItem('currentTeamId');
  if (!id) return null;
  const slug = getClubSlugByTeamId(id);
  if (!slug) return null;
  return packToTeam(getClubPack(slug));
}
