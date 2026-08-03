import { normalizeEmail } from '@/lib/access-constants';
import { CLUB_TEAM_IDS } from '@/lib/club-team-ids';
import { isDemoMode } from '@/lib/app-mode';

/** Cuenta de evaluación Atleti Lab — NUNCA es superadmin. */
export const ATM_DEMO_EMAIL = 'demo.atm@courtmanager.pro';

/**
 * Contraseña deliberadamente corta para pruebas ATM (pedido explícito).
 * Mitigaciones: rol limitado, solo team ATM, kill-switch, rate limit reforzado.
 * Desactivar tras la evaluación: ATM_DEMO_ENABLED=false
 */
export const ATM_DEMO_PASSWORD = '123456';

export const ATM_DEMO_FULL_NAME = 'Evaluación Atleti Lab';
export const ATM_DEMO_ROLE = 'equipment_manager' as const;
export const ATM_DEMO_TEAM_ID = CLUB_TEAM_IDS.atm;
export const ATM_DEMO_CLUB_SLUG = 'atm' as const;

export function isAtmDemoEmail(email?: string | null): boolean {
  return normalizeEmail(email) === ATM_DEMO_EMAIL;
}

/**
 * Kill-switch: en producción exige ATM_DEMO_ENABLED o NEXT_PUBLIC_ATM_DEMO_ENABLED = true.
 * En demo comercial / desarrollo local está activo por defecto.
 */
export function isAtmDemoAccessEnabled(): boolean {
  const flag = (
    process.env.ATM_DEMO_ENABLED ||
    process.env.NEXT_PUBLIC_ATM_DEMO_ENABLED ||
    ''
  )
    .trim()
    .toLowerCase();
  if (flag === 'false' || flag === '0' || flag === 'off') return false;
  if (flag === 'true' || flag === '1' || flag === 'on') return true;
  if (isDemoMode()) return true;
  // Producción sin flag explícito: desactivado (seguridad por defecto).
  return false;
}

/** Mostrar pista de acceso en /login (solo si se activa a propósito). */
export function showAtmDemoLoginHint(): boolean {
  if (!isAtmDemoAccessEnabled()) return false;
  return (
    process.env.NEXT_PUBLIC_ATM_DEMO_HINT === 'true' ||
    isDemoMode()
  );
}
