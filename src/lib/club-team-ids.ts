import type { ClubSlug } from '@/data/clubs/types';

export const CLUB_TEAM_IDS: Record<ClubSlug, string> = {
  rmb: '00000000-0000-4000-8000-000acb123456',
  fcb: '00000000-0000-4000-8000-000acb223457',
  vbc: '00000000-0000-4000-8000-000acb323458',
};

export const DEMO_CLUB_STORAGE_KEY = 'demoClubSlug';

export function isClubTeamId(teamId: string): teamId is (typeof CLUB_TEAM_IDS)[ClubSlug] {
  return Object.values(CLUB_TEAM_IDS).includes(teamId);
}
