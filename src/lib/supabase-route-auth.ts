/**
 * Helpers de ruta API — wrappers del flujo único en `@/lib/security/auth`.
 * Preferir `authenticate` / `authorize` / `assertUserBelongsToTeam` en código nuevo.
 */
import type { NextRequest } from 'next/server';
import {
  authenticate,
  authenticateForProduction,
  isServerProduction,
} from '@/lib/security/auth';
import { isProductionApp } from '@/lib/app-mode';

/** @deprecated Usar `authenticate` de `@/lib/security/auth`. */
export async function requireApiUser() {
  return authenticate();
}

/**
 * En producción exige sesión. En demo/mock no bloquea (InMemory local).
 * @deprecated Usar `authenticateForProduction` de `@/lib/security/auth`.
 */
export async function requireProductionApiUser() {
  return authenticateForProduction();
}

export { isServerProduction };

/**
 * Cron en producción: solo Authorization Bearer CRON_SECRET.
 * No confiar en x-vercel-cron (spoofable). Vercel envía el Bearer si CRON_SECRET está definido.
 */
export function isCronAuthorized(req: NextRequest): boolean {
  if (!isProductionApp()) return true;
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  return req.headers.get('authorization') === `Bearer ${secret}`;
}
