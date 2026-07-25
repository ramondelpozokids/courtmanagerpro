import { canWriteClubData, hasOperationalAccess, isSuperadminUser } from '@/lib/permissions';

/** Acceso privado al centro de utillería: utilleros / managers / superadmin. */
export function canAccessEquipmentTeam(role?: string | null, email?: string | null): boolean {
  if (isSuperadminUser(role, email) || hasOperationalAccess(role, email)) return true;
  return canWriteClubData(role, email);
}
