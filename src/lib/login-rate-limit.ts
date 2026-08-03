/**
 * Rate limit para POST /api/auth/login (por IP y por email).
 * Preferencia: Redis vía Upstash REST (contador compartido entre instancias).
 * Fallback: memoria local si no hay UPSTASH_* (solo útil en demo/dev).
 */
import { ATM_DEMO_EMAIL } from '@/lib/atm-demo-access';

type Bucket = { count: number; resetAt: number };

type LimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSec: number;
};

const ipBuckets = new Map<string, Bucket>();
const emailBuckets = new Map<string, Bucket>();

const WINDOW_MS = 15 * 60 * 1000;
const WINDOW_SEC = Math.ceil(WINDOW_MS / 1000);
const MAX_ATTEMPTS_IP = 8;
const MAX_ATTEMPTS_EMAIL = 5;

const KEY_PREFIX = 'cm:login-rl:';

function getUpstashConfig(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;
  return { url: url.replace(/\/$/, ''), token };
}

function touchMemory(map: Map<string, Bucket>, key: string, max: number): LimitResult {
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

/**
 * INCR + TTL en Upstash. Si la clave es nueva (TTL &lt; 0), fija EXPIRE de la ventana.
 * Devuelve null si Upstash no está configurado o falla (caller usa memoria).
 */
async function touchRedis(key: string, max: number): Promise<LimitResult | null> {
  const cfg = getUpstashConfig();
  if (!cfg) return null;

  try {
    const redisKey = `${KEY_PREFIX}${key}`;
    const pipelineRes = await fetch(`${cfg.url}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cfg.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', redisKey],
        ['TTL', redisKey],
      ]),
      cache: 'no-store',
    });

    if (!pipelineRes.ok) {
      console.error('[login-rate-limit] Upstash pipeline HTTP', pipelineRes.status);
      return null;
    }

    const rows = (await pipelineRes.json()) as Array<{ result?: number } | number>;
    const count = Number(
      typeof rows[0] === 'object' && rows[0] !== null ? rows[0].result : rows[0]
    );
    let ttl = Number(
      typeof rows[1] === 'object' && rows[1] !== null ? rows[1].result : rows[1]
    );

    if (!Number.isFinite(count)) {
      console.error('[login-rate-limit] Upstash respuesta inválida');
      return null;
    }

    // Primera vez (o sin TTL): ventana fija de WINDOW_SEC
    if (!Number.isFinite(ttl) || ttl < 0) {
      const expireRes = await fetch(
        `${cfg.url}/expire/${encodeURIComponent(redisKey)}/${WINDOW_SEC}`,
        {
          headers: { Authorization: `Bearer ${cfg.token}` },
          cache: 'no-store',
        }
      );
      if (!expireRes.ok) {
        console.error('[login-rate-limit] Upstash EXPIRE HTTP', expireRes.status);
      }
      ttl = WINDOW_SEC;
    }

    if (count > max) {
      return {
        ok: false,
        remaining: 0,
        retryAfterSec: Math.max(1, Math.ceil(ttl)),
      };
    }

    return {
      ok: true,
      remaining: Math.max(0, max - count),
      retryAfterSec: Math.max(1, Math.ceil(ttl)),
    };
  } catch (err) {
    console.error('[login-rate-limit] Upstash error', err);
    return null;
  }
}

async function touch(map: Map<string, Bucket>, key: string, max: number): Promise<LimitResult> {
  const redis = await touchRedis(key, max);
  if (redis) return redis;
  return touchMemory(map, key, max);
}

export function getClientIp(request: { headers: Headers }): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

export function isDistributedRateLimitEnabled(): boolean {
  return getUpstashConfig() !== null;
}

export async function checkLoginRateLimit(
  ip: string,
  email?: string | null
): Promise<LimitResult> {
  const byIp = await touch(ipBuckets, `ip:${ip}`, MAX_ATTEMPTS_IP);
  if (!byIp.ok) return byIp;

  const normalized = (email || '').trim().toLowerCase();
  if (normalized) {
    const maxEmail = normalized === ATM_DEMO_EMAIL ? 3 : MAX_ATTEMPTS_EMAIL;
    const byEmail = await touch(emailBuckets, `email:${normalized}`, maxEmail);
    if (!byEmail.ok) return byEmail;
    return {
      ok: true,
      remaining: Math.min(byIp.remaining, byEmail.remaining),
      retryAfterSec: Math.max(byIp.retryAfterSec, byEmail.retryAfterSec),
    };
  }

  return byIp;
}

/** Limpieza de buckets en memoria. Con Upstash el TTL de Redis sustituye esto. */
export function pruneLoginRateLimitBuckets(): void {
  if (getUpstashConfig()) return;
  const now = Date.now();
  for (const [key, b] of ipBuckets) {
    if (now >= b.resetAt) ipBuckets.delete(key);
  }
  for (const [key, b] of emailBuckets) {
    if (now >= b.resetAt) emailBuckets.delete(key);
  }
}
