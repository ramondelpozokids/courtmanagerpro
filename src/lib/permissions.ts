import {
  SUPERADMIN_EMAIL,
  CARLOS_EMAIL,
  normalizeEmail,
} from '@/lib/access-constants';
import {
  isSuperadminIdentity,
  type SuperadminAccessSources,
} from '@/lib/superadmin-access';

export type { SuperadminAccessSources };
export { SUPERADMIN_EMAIL, CARLOS_EMAIL, normalizeEmail };

export const ALL_CLUB_SLUGS = ['rmb', 'fcb', 'fbat', 'vbc'] as const;

export function isSuperadminUser(
  role?: string | null,
  email?: string | null,
  ...moreEmails: Array<string | null | undefined>
): boolean {
  return isSuperadminIdentity({
    role,
    profileEmail: email,
    userEmail: email,
    sessionEmail: moreEmails[0] ?? email,
  }) || moreEmails.some((e) => normalizeEmail(e) === SUPERADMIN_EMAIL);
}

export function isSuperadminFromSources(sources: SuperadminAccessSources): boolean {
  return isSuperadminIdentity(sources);
}

/** SuperAdmin: acceso ilimitado a cualquier comprobación de módulo o ruta. */
export function grantSuperadminAccess(
  role?: string | null,
  email?: string | null,
  ...moreEmails: Array<string | null | undefined>
): boolean {
  return isSuperadminIdentity({
    role,
    profileEmail: email,
    userEmail: email,
    sessionEmail: moreEmails[0],
  }) || moreEmails.some((e) => normalizeEmail(e) === SUPERADMIN_EMAIL);
}

/** Superadmin: acceso total sin límites (módulos, escritura, demos, proyecto). */
export function hasUnrestrictedAccess(role?: string | null, email?: string | null): boolean {
  return isSuperadminUser(role, email);
}

/** Superadmin: vista global de jugadores de todos los clubes demo. */
export function canViewAllClubPlayers(role?: string | null, email?: string | null): boolean {
  return isSuperadminUser(role, email);
}

export function isCarlosUser(email?: string | null): boolean {
  return normalizeEmail(email) === CARLOS_EMAIL;
}

export function resolveUserEmail(
  sources: {
    profileEmail?: string | null;
    userEmail?: string | null;
    sessionEmail?: string | null;
  }
): string | null {
  const session = normalizeEmail(sources.sessionEmail);
  const profile = normalizeEmail(sources.profileEmail);
  const user = normalizeEmail(sources.userEmail);

  if (session === SUPERADMIN_EMAIL || profile === SUPERADMIN_EMAIL || user === SUPERADMIN_EMAIL) {
    return SUPERADMIN_EMAIL;
  }
  if (session === CARLOS_EMAIL || profile === CARLOS_EMAIL || user === CARLOS_EMAIL) {
    return CARLOS_EMAIL;
  }

  return profile ?? user ?? session;
}

export function resolveUserAccess(role?: string | null, email?: string | null) {
  const normalizedEmail = normalizeEmail(email);
  const isSuperadmin = isSuperadminUser(role, normalizedEmail);
  return {
    email: normalizedEmail,
    role: (isSuperadmin ? 'superadmin' : role ?? null) as string | null,
    isSuperadmin,
    unrestricted: isSuperadmin,
  };
}

/** Acceso operativo total: todos los módulos y escritura de datos del club. */
export function hasFullClubAccess(role?: string | null, email?: string | null): boolean {
  if (isSuperadminUser(role, email)) return true;
  if (isCarlosUser(email)) return true;
  return false;
}

/** Alias: Carlos y SuperAdmin comparten la misma regla de acceso operativo. */
export function hasOperationalAccess(role?: string | null, email?: string | null): boolean {
  return hasFullClubAccess(role, email);
}

/**
 * Cambios de proyecto / plataforma (stats oficiales, configuración, roles).
 * Solo Ramón — ni Carlos ni ningún otro usuario.
 */
export function canModifyProject(role?: string | null, email?: string | null): boolean {
  return isSuperadminUser(role, email);
}

export function getPermContext(user?: {
  profile?: { role?: string; email?: string };
  email?: string;
  sessionEmail?: string;
} | null): { role: string | null; email: string | null; isSuperadmin: boolean } {
  const email = resolveUserEmail({
    profileEmail: user?.profile?.email,
    userEmail: user?.email,
    sessionEmail: user?.sessionEmail,
  });
  const isSuperadmin = isSuperadminIdentity({
    role: user?.profile?.role,
    profileEmail: user?.profile?.email,
    userEmail: user?.email,
    sessionEmail: user?.sessionEmail,
  });
  const role = isSuperadmin ? 'superadmin' : user?.profile?.role ?? null;
  return { role, email, isSuperadmin };
}

/** Roles with full write access (inventario, tallas, alertas, informes). */
export function canWriteClubData(role?: string | null, email?: string | null): boolean {
  if (grantSuperadminAccess(role, email)) return true;
  if (hasFullClubAccess(role, email)) return true;
  if (!role) return false;
  if (role === 'consulta' || role === 'player' || role === 'coach') return false;
  return ['admin', 'equipment_manager', 'assistant'].includes(role);
}

/** Invitado: solo lectura en módulos públicos del club. */
export function isGuestReadonly(role?: string | null, email?: string | null): boolean {
  if (grantSuperadminAccess(role, email)) return false;
  if (hasFullClubAccess(role, email)) return false;
  return role === 'consulta';
}

export function isReadonlyUser(role?: string | null, email?: string | null): boolean {
  if (grantSuperadminAccess(role, email)) return false;
  if (hasFullClubAccess(role, email)) return false;
  return role === 'consulta' || role === 'player' || role === 'coach';
}

export function canAccessMedical(role?: string | null, email?: string | null): boolean {
  if (grantSuperadminAccess(role, email)) return true;
  if (hasFullClubAccess(role, email)) return true;
  if (!role) return false;
  if (role === 'consulta') return false;
  return ['admin', 'equipment_manager', 'medical'].includes(role);
}

export function canAccessReports(role?: string | null, email?: string | null): boolean {
  if (grantSuperadminAccess(role, email)) return true;
  if (hasFullClubAccess(role, email)) return true;
  if (!role) return false;
  if (role === 'consulta') return false;
  return ['admin', 'equipment_manager'].includes(role);
}

export function canManageAlerts(role?: string | null, email?: string | null): boolean {
  if (grantSuperadminAccess(role, email)) return true;
  if (hasFullClubAccess(role, email)) return true;
  if (!role) return false;
  if (role === 'consulta') return false;
  return ['admin', 'equipment_manager', 'assistant', 'medical'].includes(role);
}

export function canViewAlerts(role?: string | null, email?: string | null): boolean {
  if (grantSuperadminAccess(role, email)) return true;
  if (!role && !email) return false;
  if (role === 'consulta') return true;
  return canManageAlerts(role, email);
}

export function canProcessRequests(role?: string | null, email?: string | null): boolean {
  if (grantSuperadminAccess(role, email)) return true;
  if (hasFullClubAccess(role, email)) return true;
  if (!role) return false;
  if (isGuestReadonly(role, email) || role === 'player' || role === 'coach') return false;
  return ['admin', 'equipment_manager', 'assistant'].includes(role);
}

export function canCreateRequest(role?: string | null, email?: string | null): boolean {
  if (grantSuperadminAccess(role, email)) return true;
  if (hasFullClubAccess(role, email)) return true;
  if (!role) return false;
  if (role === 'consulta') return false;
  return ['admin', 'equipment_manager', 'assistant', 'player', 'medical', 'coach'].includes(role);
}

/** Resumen de roles para documentación y UI */
export const ROLE_ACCESS_SUMMARY = {
  consulta: 'Invitado — solo lectura (noticias, tienda, calendario, tallas, viajes)',
  player: 'Jugador — peticiones propias, lectura limitada',
  coach: 'Entrenador — lectura ampliada, sin edición de inventario',
  assistant: 'Utillero asistente — operativa diaria de stock y solicitudes',
  equipment_manager: 'Carlos Kobe — acceso total operativo al club (sin cambios de proyecto)',
  admin: 'Administrador club — operativa completa del día a día',
  medical: 'Staff médico — botiquines y alertas sanitarias',
  superadmin: 'Ramón del Pozo Rott — acceso total sin límites (proyecto + todos los clubes demo)',
} as const;
