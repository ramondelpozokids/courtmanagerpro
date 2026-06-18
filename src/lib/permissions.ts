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
