import { NextResponse } from 'next/server';
import { isSuperadminUser } from '@/lib/permissions';
import { isUuid } from '@/lib/club-team-ids';

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
): Promise<{ ok: true } | { ok: false; response: NextResponse }> {
  if (!teamId || !isUuid(teamId)) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'team_id inválido' }, { status: 400 }),
    };
  }

  const pg = supabase as any;

  const { data: profile } = await pg
    .from('profiles')
    .select('role, email')
    .eq('id', userId)
    .maybeSingle();

  if (isSuperadminUser(profile?.role, profile?.email)) {
    return { ok: true };
  }

  const { data: membership } = await pg
    .from('user_teams')
    .select('id')
    .eq('user_id', userId)
    .eq('team_id', teamId)
    .eq('is_active', true)
    .maybeSingle();

  if (!membership) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
    };
  }

  return { ok: true };
}
