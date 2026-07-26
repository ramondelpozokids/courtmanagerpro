/**
 * Rate limit in-memory para POST /api/auth/login (por IP).
 * En serverless multi-instancia es best-effort; suficiente como capa anti-fuerza bruta.
 */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 12;

export function getClientIp(request: { headers: Headers }): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

export function checkLoginRateLimit(ip: string): {
  ok: boolean;
  remaining: number;
  retryAfterSec: number;
} {
  const now = Date.now();
  let bucket = buckets.get(ip);
  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + WINDOW_MS };
    buckets.set(ip, bucket);
  }
  if (bucket.count >= MAX_ATTEMPTS) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }
  bucket.count += 1;
  return {
    ok: true,
    remaining: Math.max(0, MAX_ATTEMPTS - bucket.count),
    retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
  };
}

/** Limpieza ocasional para no crecer sin límite en procesos largos. */
export function pruneLoginRateLimitBuckets(): void {
  const now = Date.now();
  for (const [ip, b] of buckets) {
    if (now >= b.resetAt) buckets.delete(ip);
  }
}
