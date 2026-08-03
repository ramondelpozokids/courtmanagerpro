/**
 * Modo de la aplicación:
 * - Demo: multi-club, InMemoryDB, auth mock, localStorage.
 * - Producción: un club real (Supabase), sin fallback a datos ficticios.
 *
 * Seguridad: en hosting de producción (VERCEL_ENV=production) NUNCA se relajan
 * los controles aunque DEMO_MODE esté mal configurado.
 */

import { shouldUseDemoDataFallback } from '@/lib/club-preview';

/** Hosting Vercel Production — fuente de verdad para no relajar seguridad. */
export function isHostingProduction(): boolean {
  return process.env.VERCEL_ENV === 'production';
}

export function isMockMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  return !url || url.includes('your-project') || url.includes('dummy-project');
}

/** Demo comercial (multi-club) o sin Supabase. */
export function isDemoMode(): boolean {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') return true;
  return isMockMode();
}

/**
 * Club real operando con Supabase — controles de seguridad de producción.
 * En Vercel Production siempre true (evita DEMO_MODE accidental que abra APIs/cron).
 */
export function isProductionApp(): boolean {
  if (isHostingProduction()) {
    return true;
  }
  return !isDemoMode();
}

/** Solo en demo / preview: rellenar con datos ficticios si Supabase está vacío. */
export function shouldUseDemoFallback(rows: unknown[] | null | undefined): boolean {
  return shouldUseDemoDataFallback(rows);
}
