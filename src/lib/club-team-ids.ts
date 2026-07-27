import type { ClubSlug } from '@/data/clubs/types';

export const CLUB_TEAM_IDS: Record<ClubSlug, string> = {
  rmb: '00000000-0000-4000-8000-000acb123456',
  rmf: '00000000-0000-4000-8000-000acb223458',
  fcb: '00000000-0000-4000-8000-000acb223457',
  vbc: '00000000-0000-4000-8000-000acb323458',
  atm: '00000000-0000-4000-8000-000acb423458',
};

export const DEMO_CLUB_STORAGE_KEY = 'demoClubSlug';

export function isClubTeamId(teamId: string): teamId is (typeof CLUB_TEAM_IDS)[ClubSlug] {
  return Object.values(CLUB_TEAM_IDS).includes(teamId);
}

/**
 * Clubs con datos reales en Supabase (producción).
 * Incluye Real Madrid (RMB/RMF) y Atlético de Madrid Fútbol (ATM).
 */
export function isRealMadridTeamId(teamId: string | null | undefined): boolean {
  return (
    teamId === CLUB_TEAM_IDS.rmb ||
    teamId === CLUB_TEAM_IDS.rmf ||
    teamId === CLUB_TEAM_IDS.atm
  );
}

/** Alias explícito para tenants live (misma lógica). */
export function isLiveProductionTeamId(teamId: string | null | undefined): boolean {
  return isRealMadridTeamId(teamId);
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: string | null | undefined): boolean {
  return Boolean(value && UUID_RE.test(value));
}
