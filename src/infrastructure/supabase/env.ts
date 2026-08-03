/**
 * Variables críticas de entorno.
 * En producción: sin fallbacks dummy — fallar el arranque si faltan.
 * En demo/dev/build local: se permiten placeholders para no romper el bundle.
 */

const FALLBACK_URL = 'https://dummy-project.supabase.co';
const FALLBACK_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bW15LXByb2plY3QifQ.dummy-key';
const FALLBACK_SERVICE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bW15LXByb2plY3QifQ.dummy-service-role-key';

function cleanEnv(value: string | undefined): string {
  return (value || '').trim().replace(/^['"]|['"]$/g, '');
}

/** Producción real: Vercel Production o flag explícito (sin fallbacks). */
export function isStrictProductionEnv(): boolean {
  if (process.env.VERCEL_ENV === 'production') return true;
  if (process.env.COURTMANAGER_STRICT_ENV === 'true') return true;
  return false;
}

function isPlaceholderUrl(value: string): boolean {
  return (
    !value ||
    value.includes('tu-proyecto') ||
    value.includes('your-project') ||
    value.includes('dummy-project')
  );
}

function isPlaceholderKey(value: string): boolean {
  return !value || value.includes('dummy-key') || value.includes('dummy-service') || value.length < 20;
}

/**
 * Aborta el proceso si faltan variables críticas en producción.
 * Llamar desde instrumentation (arranque Node).
 */
export function assertCriticalEnv(): void {
  if (!isStrictProductionEnv()) return;

  const missing: string[] = [];
  const url = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anon = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const service = cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const cron = cleanEnv(process.env.CRON_SECRET);

  if (isPlaceholderUrl(url)) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (isPlaceholderKey(anon)) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  if (isPlaceholderKey(service)) missing.push('SUPABASE_SERVICE_ROLE_KEY');
  if (!cron) missing.push('CRON_SECRET');

  if (missing.length > 0) {
    throw new Error(
      `[CourtManager Pro] Arranque abortado: faltan variables críticas en producción: ${missing.join(', ')}. Sin fallbacks.`
    );
  }

  if (!process.env.UPSTASH_REDIS_REST_URL?.trim() || !process.env.UPSTASH_REDIS_REST_TOKEN?.trim()) {
    console.warn(
      '[CourtManager Pro] UPSTASH_REDIS_REST_URL/TOKEN no configurados: el rate limit de login no será distribuido entre instancias.'
    );
  }
}

/** URL válida para @supabase/supabase-js; fallback solo fuera de producción estricta. */
export function resolveSupabaseUrl(raw?: string): string {
  const cleaned = cleanEnv(raw);
  if (isStrictProductionEnv() && isPlaceholderUrl(cleaned)) {
    throw new Error(
      '[CourtManager Pro] NEXT_PUBLIC_SUPABASE_URL crítica ausente o inválida en producción (sin fallback).'
    );
  }
  if (isPlaceholderUrl(cleaned)) {
    return FALLBACK_URL;
  }
  try {
    const url = new URL(cleaned);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      if (isStrictProductionEnv()) {
        throw new Error('[CourtManager Pro] NEXT_PUBLIC_SUPABASE_URL con protocolo inválido.');
      }
      return FALLBACK_URL;
    }
    return `${url.protocol}//${url.host}`;
  } catch (err) {
    if (isStrictProductionEnv()) throw err;
    return FALLBACK_URL;
  }
}

export function resolveSupabaseAnonKey(raw?: string): string {
  const cleaned = cleanEnv(raw);
  if (isStrictProductionEnv() && isPlaceholderKey(cleaned)) {
    throw new Error(
      '[CourtManager Pro] NEXT_PUBLIC_SUPABASE_ANON_KEY crítica ausente o inválida en producción (sin fallback).'
    );
  }
  if (isPlaceholderKey(cleaned)) {
    return FALLBACK_ANON_KEY;
  }
  return cleaned;
}

export function resolveSupabaseServiceKey(raw?: string): string {
  const cleaned = cleanEnv(raw);
  if (isStrictProductionEnv() && isPlaceholderKey(cleaned)) {
    throw new Error(
      '[CourtManager Pro] SUPABASE_SERVICE_ROLE_KEY crítica ausente o inválida en producción (sin fallback).'
    );
  }
  if (isPlaceholderKey(cleaned)) {
    return FALLBACK_SERVICE_KEY;
  }
  return cleaned;
}

export const supabaseUrl = resolveSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
export const supabaseAnonKey = resolveSupabaseAnonKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
export const supabaseServiceRoleKey = resolveSupabaseServiceKey(process.env.SUPABASE_SERVICE_ROLE_KEY);
