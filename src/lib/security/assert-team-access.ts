import { isSuperadminUser } from '@/lib/permissions';
import { isUuid } from '@/lib/club-team-ids';
import { badRequest, forbidden } from '@/lib/security/api-error';

type SupabaseLike = {
  from: (table: string) => {
    select: (cols: string) => {
      eq: (col: string, val: string) => any;
    };
  };
};

/**
 * Defensa en profundidad anti-IDOR: el usuario debe pertenecer al equipo
 * (o ser superadmin). RLS sigue siendo la capa final en Postgres.
 */
export async function assertUserBelongsToTeam(
  supabase: SupabaseLike,
  userId: string,
  teamId: string | null | undefined
): Promise<{ ok: true } | { ok: false; response: ReturnType<typeof badRequest> }> {
  if (!teamId || !isUuid(teamId)) {
    return {
      ok: false,
      response: badRequest('team_id inválido'),
    };
  }

  const access = await getAccessibleTeamIds(supabase, userId);
  if (access.superadmin) return { ok: true };
  if (!access.teamIds.includes(teamId)) {
    return { ok: false, response: forbidden() };
  }
  return { ok: true };
}

/** Equipos activos del usuario (o superadmin con acceso total). */
export async function getAccessibleTeamIds(
  supabase: SupabaseLike,
  userId: string
): Promise<{ superadmin: true; teamIds: string[] } | { superadmin: false; teamIds: string[] }> {
  const pg = supabase as any;

  const { data: profile } = await pg
    .from('profiles')
    .select('role, email')
    .eq('id', userId)
    .maybeSingle();

  if (isSuperadminUser(profile?.role, profile?.email)) {
    return { superadmin: true, teamIds: [] };
  }

  const { data: rows } = await pg
    .from('user_teams')
    .select('team_id')
    .eq('user_id', userId)
    .eq('is_active', true);

  const teamIds = (rows || [])
    .map((r: { team_id?: string }) => r.team_id)
    .filter((id: string | undefined): id is string => Boolean(id));

  return { superadmin: false, teamIds };
}
