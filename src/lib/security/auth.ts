/**
 * Flujo único de autenticación / autorización para APIs.
 *
 *   authenticate() → authorize() → assertUserBelongsToTeam() → endpoint
 *
 * Los helpers legacy (`requireApiUser`, `getApiUserAccess`, `withEquipmentAuth`)
 * delegan aquí para no fragmentar el camino de seguridad.
 */
import type { User } from '@supabase/supabase-js';
import type { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { isProductionApp } from '@/lib/app-mode';
import { enrichProfileWithSuperadmin } from '@/lib/production-auth-fallback';
import { resolveUserAccess, resolveUserEmail } from '@/lib/permissions';
import { unauthorized } from '@/lib/security/api-error';
import { assertUserBelongsToTeam } from '@/lib/security/assert-team-access';
import type { Profile } from '@/types';

type ServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

export type AuthenticatedContext = {
  supabase: ServerClient;
  user: User;
  response: null;
};

export type UnauthenticatedContext = {
  supabase: ServerClient;
  user: null;
  response: NextResponse;
};

export type AuthContext = AuthenticatedContext | UnauthenticatedContext;

export type AuthorizedContext = AuthenticatedContext & {
  access: ReturnType<typeof resolveUserAccess>;
  profileRow: { role: string; email: string; full_name?: string } | null;
};

/**
 * Capa 1 — autenticación: sesión Supabase válida.
 */
export async function authenticate(): Promise<AuthContext> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      supabase,
      user: null,
      response: unauthorized(),
    };
  }

  return { supabase, user, response: null };
}

/**
 * En producción exige sesión. En demo/mock no bloquea (InMemory local).
 * Misma semántica que el antiguo `requireProductionApiUser`.
 */
export async function authenticateForProduction(): Promise<{
  supabase: ServerClient | null;
  user: User | null;
  response: NextResponse | null;
}> {
  if (!isProductionApp()) {
    return { supabase: null, user: null, response: null };
  }
  return authenticate();
}

/**
 * Capa 2 — autorización: rol/acceso a partir del perfil.
 */
export async function authorize(
  ctx: AuthenticatedContext
): Promise<AuthorizedContext> {
  const supabase = ctx.supabase as any;
  const { data: profileRow } = await supabase
    .from('profiles')
    .select('role, email, full_name')
    .eq('id', ctx.user.id)
    .maybeSingle();

  const email = resolveUserEmail({
    profileEmail: profileRow?.email,
    sessionEmail: ctx.user.email,
  });
  const access = resolveUserAccess(profileRow?.role, email);

  return {
    ...ctx,
    access,
    profileRow: profileRow ?? null,
  };
}

/**
 * Capa 3 — validación de equipo (anti-IDOR). Reexporta el helper existente.
 */
export { assertUserBelongsToTeam };

export function profileFromAuthUser(
  profileRow: { role: string; email: string; full_name?: string } | null,
  authEmail?: string | null
) {
  if (!profileRow) return null;
  return enrichProfileWithSuperadmin(profileRow as Profile, authEmail);
}

export function isServerProduction(): boolean {
  return isProductionApp();
}
