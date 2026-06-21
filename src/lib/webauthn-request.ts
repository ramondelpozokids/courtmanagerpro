import { SITE_URL } from '@/content/seo';

function normalizeOrigin(raw: string): string {
  const trimmed = raw.trim();
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  return new URL(candidate).origin;
}

/** Origen real del navegador (móvil incluido). Prioriza body > header Origin > Referer > SITE_URL. */
export function resolveWebAuthnOrigin(
  bodyOrigin?: string | null,
  headerOrigin?: string | null,
  referer?: string | null
): string {
  const candidates = [bodyOrigin, headerOrigin, referer].filter(Boolean) as string[];
  for (const candidate of candidates) {
    try {
      return normalizeOrigin(candidate);
    } catch {
      /* try next */
    }
  }

  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }

  return normalizeOrigin(SITE_URL);
}

export function getOriginFromRequest(request: Request, bodyOrigin?: string | null): string {
  return resolveWebAuthnOrigin(
    bodyOrigin,
    request.headers.get('origin'),
    request.headers.get('referer')
  );
}
