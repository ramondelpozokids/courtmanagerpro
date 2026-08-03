/**
 * Acceso de API con perfil/rol — delega en el flujo único authenticate → authorize.
 * @deprecated Preferir `authenticate` + `authorize` de `@/lib/security/auth`.
 */
import { authenticate, authorize, profileFromAuthUser } from '@/lib/security/auth';

export async function getApiUserAccess() {
  const auth = await authenticate();
  if (auth.response || !auth.user) {
    return {
      supabase: auth.supabase as any,
      user: null,
      access: null,
      response: { status: 401 as const },
    };
  }

  const authorized = await authorize(auth);
  return {
    supabase: authorized.supabase as any,
    user: authorized.user,
    access: authorized.access,
    profileRow: authorized.profileRow,
    response: null,
  };
}

export function profileFromApiUser(
  profileRow: { role: string; email: string; full_name?: string } | null,
  authEmail?: string | null
) {
  return profileFromAuthUser(profileRow, authEmail);
}
