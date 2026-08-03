import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { authenticate, assertUserBelongsToTeam, isServerProduction } from '@/lib/security/auth';
import { DEFAULT_TEAM_ID, resolveTeamId } from '@/lib/team-constants';

export function teamIdFrom(req: NextRequest, body?: { team_id?: string }): string {
  return resolveTeamId(
    body?.team_id || req.nextUrl.searchParams.get('team_id') || DEFAULT_TEAM_ID
  );
}

export function isMissingTableError(error: unknown): boolean {
  const msg = String(
    (error as { message?: string } | null)?.message || error || ''
  );
  return /does not exist|schema cache|could not find the table|relation .* does not exist/i.test(
    msg
  );
}

/** false = tablas 011 no aplicadas → usar store demo (lectura/escritura). */
export async function equipmentDbAvailable(
  supabase: { from: (t: string) => any }
): Promise<boolean> {
  try {
    const { error } = await supabase.from('equipment_team_members').select('id').limit(1);
    if (!error) return true;
    return !isMissingTableError(error);
  } catch (err) {
    return !isMissingTableError(err);
  }
}

/**
 * Auth + anti-IDOR del módulo utilería.
 * En producción: sesión válida y pertenencia al team_id de la petición.
 */
export async function withEquipmentAuth(
  req: NextRequest,
  body?: { team_id?: string }
) {
  const teamId = teamIdFrom(req, body);
  if (!isServerProduction()) {
    return {
      supabase: null as null,
      user: null as null,
      response: null as NextResponse | null,
      teamId,
    };
  }
  const { supabase, user, response } = await authenticate();
  if (response || !user) {
    return { supabase: null, user: null, response: response!, teamId };
  }
  const access = await assertUserBelongsToTeam(supabase as any, user.id, teamId);
  if (!access.ok) {
    return { supabase: null, user: null, response: access.response, teamId };
  }
  return { supabase, user, response: null as NextResponse | null, teamId };
}

export async function insertHistory(
  supabase: { from: (t: string) => any },
  teamId: string,
  actor_name: string,
  action: string,
  entity_type: string,
  entity_id: string | null,
  details?: string | null
) {
  const { error } = await supabase.from('equipment_history').insert({
    team_id: teamId,
    actor_name,
    action,
    entity_type,
    entity_id,
    details: details || null,
  });
  if (error && !isMissingTableError(error)) {
    console.warn('[equipment-history]', error.message);
  }
}

export function actorFromUser(user: { email?: string | null; user_metadata?: Record<string, unknown> } | null): string {
  if (!user) return 'Carlos Rodríguez Kobe';
  const meta = user.user_metadata || {};
  const name = (meta.full_name || meta.name) as string | undefined;
  return name || user.email || 'Usuario';
}
