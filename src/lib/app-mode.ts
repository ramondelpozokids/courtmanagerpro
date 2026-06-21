/**
 * Modo de la aplicación:
 * - Demo: multi-club, InMemoryDB, auth mock, localStorage.
 * - Producción: un club real (Supabase), sin fallback a datos ficticios.
 *
 * Producción activa cuando hay Supabase configurado y NEXT_PUBLIC_DEMO_MODE !== 'true'.
 */

export function isMockMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  return !url || url.includes('your-project') || url.includes('dummy-project');
}

/** Demo comercial (multi-club) o sin Supabase. */
export function isDemoMode(): boolean {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') return true;
  return isMockMode();
}

/** Club real operando con Supabase — Carlos trabaja aquí. */
export function isProductionApp(): boolean {
  return !isDemoMode();
}

/** Solo en demo: rellenar con datos ficticios si Supabase está vacío. */
export function shouldUseDemoFallback(rows: unknown[] | null | undefined): boolean {
  if (isProductionApp()) return false;
  return !rows || rows.length === 0;
}
