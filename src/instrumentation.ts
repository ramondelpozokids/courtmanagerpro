/**
 * Validación al arranque del runtime Node (Next.js instrumentation).
 * Aborta si faltan variables críticas en producción.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'edge') return;

  const { assertCriticalEnv } = await import('@/infrastructure/supabase/env');
  const { validateProductionAppMode } = await import('@/lib/app-mode-validate');

  assertCriticalEnv();
  validateProductionAppMode();
}
