/**
 * Punto central único de acceso SuperAdmin.
 * Toda comprobación de permisos debe pasar por aquí primero.
 */
import { SUPERADMIN_EMAIL, normalizeEmail } from '@/lib/access-constants';

export type SuperadminAccessSources = {
  role?: string | null;
  profileEmail?: string | null;
  userEmail?: string | null;
  sessionEmail?: string | null;
};

/** ¿Es Ramón del Pozo Rott (SuperAdmin)? — fuente única de verdad. */
export function isSuperadminIdentity(sources?: SuperadminAccessSources | null): boolean {
  if (!sources) return false;
  if (sources.role === 'superadmin') return true;

  const candidates = [
    sources.sessionEmail,
    sources.userEmail,
    sources.profileEmail,
  ].map(normalizeEmail);

  return candidates.some((email) => email === SUPERADMIN_EMAIL);
}

/** SuperAdmin = acceso total a cualquier módulo, ruta o acción. */
export function superadminHasFullAccess(sources?: SuperadminAccessSources | null): boolean {
  return isSuperadminIdentity(sources);
}
