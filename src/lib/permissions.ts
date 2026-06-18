/** Roles with full write access (inventario, tallas, alertas, informes). */
export function canWriteClubData(role?: string | null): boolean {
  if (!role) return false;
  if (role === 'superadmin') return true;
  if (role === 'consulta' || role === 'player' || role === 'coach') return false;
  return ['admin', 'equipment_manager', 'assistant'].includes(role);
}

/** Invitado: solo lectura en módulos públicos del club. */
export function isGuestReadonly(role?: string | null): boolean {
  return role === 'consulta';
}

export function isReadonlyUser(role?: string | null): boolean {
  return role === 'consulta' || role === 'player' || role === 'coach';
}

export function canAccessMedical(role?: string | null): boolean {
  if (!role) return false;
  if (role === 'superadmin') return true;
  if (role === 'consulta') return false;
  return ['admin', 'equipment_manager', 'medical'].includes(role);
}

export function canAccessReports(role?: string | null): boolean {
  if (!role) return false;
  if (role === 'superadmin') return true;
  if (role === 'consulta') return false;
  return ['admin', 'equipment_manager'].includes(role);
}

export function canManageAlerts(role?: string | null): boolean {
  if (!role) return false;
  if (role === 'superadmin') return true;
  if (role === 'consulta') return false;
  return ['admin', 'equipment_manager', 'assistant', 'medical'].includes(role);
}

export function canViewAlerts(role?: string | null): boolean {
  if (!role) return false;
  if (role === 'consulta') return true;
  return canManageAlerts(role);
}

export function canProcessRequests(role?: string | null): boolean {
  if (!role) return false;
  if (role === 'superadmin') return true;
  if (isGuestReadonly(role) || role === 'player' || role === 'coach') return false;
  return ['admin', 'equipment_manager', 'assistant'].includes(role);
}

export function canCreateRequest(role?: string | null): boolean {
  if (!role) return false;
  if (role === 'consulta') return false;
  if (role === 'superadmin') return true;
  return ['admin', 'equipment_manager', 'assistant', 'player', 'medical', 'coach'].includes(role);
}

/** Resumen de roles para documentación y UI */
export const ROLE_ACCESS_SUMMARY = {
  consulta: 'Invitado — solo lectura (noticias, tienda, calendario, tallas, viajes)',
  player: 'Jugador — peticiones propias, lectura limitada',
  coach: 'Entrenador — lectura ampliada, sin edición de inventario',
  assistant: 'Utillero asistente — operativa diaria de stock y solicitudes',
  equipment_manager: 'Carlos Kobe — administrador de utilería (control total operativo)',
  admin: 'Administrador club — mismo nivel operativo que utilería',
  medical: 'Staff médico — botiquines y alertas sanitarias',
  superadmin: 'Ramón del Pozo Rott — bypass total, creador de la plataforma',
} as const;
