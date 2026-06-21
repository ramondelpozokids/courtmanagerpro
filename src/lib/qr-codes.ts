import { SITE_URL } from '@/content/seo';

/** URL escaneable que abre la ficha de la prenda en la PWA (Fase 1 — móvil). */
export function buildGarmentScanUrl(qrCode: string): string {
  const base =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || SITE_URL;
  return `${base.replace(/\/$/, '')}/scan/${encodeURIComponent(qrCode)}`;
}

/** Extrae el código CMP-… desde URL, texto plano o SKU. */
export function parseScannedValue(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';

  try {
    const url = new URL(trimmed);
    const pathMatch = url.pathname.match(/\/scan\/([^/?#]+)/i);
    if (pathMatch?.[1]) return decodeURIComponent(pathMatch[1]);
    const q = url.searchParams.get('code');
    if (q) return q.trim();
  } catch {
    /* not a URL */
  }

  return trimmed;
}

export function isGarmentQrCode(code: string): boolean {
  return /^CMP-[A-Z0-9-]+$/i.test(code);
}

/** Normaliza códigos de pistola / EAN (quita espacios del «4 068807 308923»). */
export function normalizeScanCode(code: string): string {
  const parsed = parseScannedValue(code).trim();
  if (/^[\d\s]+$/.test(parsed)) {
    return parsed.replace(/\s/g, '');
  }
  return parsed;
}

export function buildGarmentQrCode(
  clubSlug: string,
  itemId: string,
  playerId: string,
  suffix = '001'
): string {
  return `CMP-${clubSlug.toUpperCase()}-${itemId.toUpperCase()}-${playerId.toUpperCase()}-${suffix}`;
}
