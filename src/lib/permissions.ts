/** Ramón del Pozo Rott — único superadmin con permisos de proyecto. */
export const SUPERADMIN_EMAIL = 'info@ramondelpozorott.es';

/** Carlos Rodriguez Kobe — acceso operativo total al club. */
export const CARLOS_EMAIL = 'charlie-r-k@hotmail.com';

export function normalizeEmail(email?: string | null): string | null {
  return email?.trim().toLowerCase() ?? null;
}

export function isSuperadminUser(role?: string | null, email?: string | null): boolean {
  if (role === 'superadmin') return true;
  return normalizeEmail(email) === SUPERADMIN_EMAIL;
}

export function isCarlosUser(email?: string | null): boolean {
  return normalizeEmail(email) === CARLOS_EMAIL;
}

/** Acceso operativo total: todos los módulos y escritura de datos del club. */
export function hasFullClubAccess(role?: string | null, email?: string | null): boolean {
  if (isSuperadminUser(role, email)) return true;
  if (isCarlosUser(email)) return true;
  return false;
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
} | null): { role: string | null; email: string | null } {
  return {
    role: user?.profile?.role ?? null,
    email: user?.profile?.email ?? user?.email ?? null,
  };
}

/** Roles with full write access (inventario, tallas, alertas, informes). */
export function canWriteClubData(role?: string | null, email?: string | null): boolean {
  if (hasFullClubAccess(role, email)) return true;
  if (!role) return false;
  if (role === 'consulta' || role === 'player' || role === 'coach') return false;
  return ['admin', 'equipment_manager', 'assistant'].includes(role);
}

/** Invitado: solo lectura en módulos públicos del club. */
export function isGuestReadonly(role?: string | null, email?: string | null): boolean {
  if (hasFullClubAccess(role, email)) return false;
  return role === 'consulta';
}

export function isReadonlyUser(role?: string | null, email?: string | null): boolean {
  if (hasFullClubAccess(role, email)) return false;
  return role === 'consulta' || role === 'player' || role === 'coach';
}

export function canAccessMedical(role?: string | null, email?: string | null): boolean {
  if (hasFullClubAccess(role, email)) return true;
  if (!role) return false;
  if (role === 'consulta') return false;
  return ['admin', 'equipment_manager', 'medical'].includes(role);
}

export function canAccessReports(role?: string | null, email?: string | null): boolean {
  if (hasFullClubAccess(role, email)) return true;
  if (!role) return false;
  if (role === 'consulta') return false;
  return ['admin', 'equipment_manager'].includes(role);
}

export function canManageAlerts(role?: string | null, email?: string | null): boolean {
  if (hasFullClubAccess(role, email)) return true;
  if (!role) return false;
  if (role === 'consulta') return false;
  return ['admin', 'equipment_manager', 'assistant', 'medical'].includes(role);
}

export function canViewAlerts(role?: string | null, email?: string | null): boolean {
  if (!role && !email) return false;
  if (role === 'consulta') return true;
  return canManageAlerts(role, email);
}

export function canProcessRequests(role?: string | null, email?: string | null): boolean {
  if (hasFullClubAccess(role, email)) return true;
  if (!role) return false;
  if (isGuestReadonly(role, email) || role === 'player' || role === 'coach') return false;
  return ['admin', 'equipment_manager', 'assistant'].includes(role);
}

export function canCreateRequest(role?: string | null, email?: string | null): boolean {
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
  superadmin: 'Ramón del Pozo Rott — único autorizado para modificar el proyecto',
} as const;
