/**
 * Rate limit in-memory para POST /api/auth/login (por IP y por email).
 * En serverless multi-instancia es best-effort; reduce fuerza bruta en pentests.
 */
import { ATM_DEMO_EMAIL } from '@/lib/atm-demo-access';

type Bucket = { count: number; resetAt: number };

const ipBuckets = new Map<string, Bucket>();
const emailBuckets = new Map<string, Bucket>();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS_IP = 8;
const MAX_ATTEMPTS_EMAIL = 5;

function touch(map: Map<string, Bucket>, key: string, max: number): {
  ok: boolean;
  remaining: number;
  retryAfterSec: number;
} {
  const now = Date.now();
  let bucket = map.get(key);
  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + WINDOW_MS };
    map.set(key, bucket);
  }
  if (bucket.count >= max) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }
  bucket.count += 1;
  return {
    ok: true,
    remaining: Math.max(0, max - bucket.count),
    retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
  };
}

export function getClientIp(request: { headers: Headers }): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

export function checkLoginRateLimit(
  ip: string,
  email?: string | null
): {
  ok: boolean;
  remaining: number;
  retryAfterSec: number;
} {
  const byIp = touch(ipBuckets, `ip:${ip}`, MAX_ATTEMPTS_IP);
  if (!byIp.ok) return byIp;

  const normalized = (email || '').trim().toLowerCase();
  if (normalized) {
    const maxEmail = normalized === ATM_DEMO_EMAIL ? 3 : MAX_ATTEMPTS_EMAIL;
    const byEmail = touch(emailBuckets, `email:${normalized}`, maxEmail);
    if (!byEmail.ok) return byEmail;
    return {
      ok: true,
      remaining: Math.min(byIp.remaining, byEmail.remaining),
      retryAfterSec: Math.max(byIp.retryAfterSec, byEmail.retryAfterSec),
    };
  }

  return byIp;
}

export function pruneLoginRateLimitBuckets(): void {
  const now = Date.now();
  for (const [key, b] of ipBuckets) {
    if (now >= b.resetAt) ipBuckets.delete(key);
  }
  for (const [key, b] of emailBuckets) {
    if (now >= b.resetAt) emailBuckets.delete(key);
  }
}
