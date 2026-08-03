/**
 * Validación de configuración de modo al arrancar (MEDIUM-04).
 * Separado de app-mode.ts para poder testear isProductionApp sin side-effects de arranque.
 */
import { isDemoMode, isHostingProduction, isProductionApp } from '@/lib/app-mode';

export function validateProductionAppMode(): void {
  if (!isHostingProduction()) return;

  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    console.error(
      '[CourtManager Pro] NEXT_PUBLIC_DEMO_MODE=true en Vercel Production. ' +
        'isProductionApp() permanece true: los controles de seguridad NO se relajan.'
    );
  }

  if (!isProductionApp()) {
    throw new Error(
      '[CourtManager Pro] Invariante rota: isProductionApp() debe ser true en VERCEL_ENV=production.'
    );
  }

  // En hosting prod, isDemoMode puede ser true por flag, pero la seguridad no depende de él.
  if (isDemoMode() && isProductionApp()) {
    console.warn(
      '[CourtManager Pro] Demo flag activo bajo hosting production; auth/API siguen en modo producción.'
    );
  }
}
