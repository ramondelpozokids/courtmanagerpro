/** Stable UUID for Real Madrid Baloncesto (Supabase seed). */
export const DEFAULT_TEAM_ID = '00000000-0000-4000-8000-000acb123456';

/** Legacy slug used by in-memory demo data. */
export const LEGACY_TEAM_SLUG = 'team-acb-123';

export function demoPlayerIdToUuid(demoId: string): string {
  const match = demoId.match(/^p(\d+)$/i);
  if (!match) return demoId;
  return `00000000-0000-4000-8000-${match[1].padStart(12, '0')}`;
}

export function uuidToDemoPlayerId(id: string): string | null {
  const match = id.match(/^00000000-0000-4000-8000-0*(\d+)$/i);
  if (!match) return null;
  return `p${Number(match[1])}`;
}

export function resolveTeamId(teamId?: string | null): string {
  if (!teamId || teamId === LEGACY_TEAM_SLUG) return DEFAULT_TEAM_ID;
  return teamId;
}
