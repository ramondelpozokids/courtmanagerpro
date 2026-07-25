import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { isServerProduction, requireApiUser } from '@/lib/supabase-route-auth';
import { DEFAULT_TEAM_ID, resolveTeamId } from '@/lib/team-constants';

export function teamIdFrom(req: NextRequest, body?: { team_id?: string }): string {
  return resolveTeamId(
    body?.team_id || req.nextUrl.searchParams.get('team_id') || DEFAULT_TEAM_ID
  );
}

export async function withEquipmentAuth() {
  if (!isServerProduction()) {
    return { supabase: null as null, user: null as null, response: null as NextResponse | null };
  }
  const { supabase, user, response } = await requireApiUser();
  if (response || !user) return { supabase: null, user: null, response: response! };
  return { supabase, user, response: null as NextResponse | null };
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
  await supabase.from('equipment_history').insert({
    team_id: teamId,
    actor_name,
    action,
    entity_type,
    entity_id,
    details: details || null,
  });
}

export function actorFromUser(user: { email?: string | null; user_metadata?: Record<string, unknown> } | null): string {
  if (!user) return 'Carlos Rodríguez Kobe';
  const meta = user.user_metadata || {};
  const name = (meta.full_name || meta.name) as string | undefined;
  return name || user.email || 'Usuario';
}
