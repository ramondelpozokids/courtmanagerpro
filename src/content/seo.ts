const DEFAULT_SITE_URL = 'https://courtmanagerpro.vercel.app';

function resolveSiteUrl(raw?: string): string {
  const cleaned = (raw || '').trim().replace(/^['"]|['"]$/g, '');
  if (!cleaned) return DEFAULT_SITE_URL;

  let candidate = cleaned;
  if (!/^https?:\/\//i.test(candidate)) {
    candidate = `https://${candidate}`;
  }

  try {
    const url = new URL(candidate);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return DEFAULT_SITE_URL;
    return `${url.protocol}//${url.host}`;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export const SITE_URL = resolveSiteUrl(process.env.NEXT_PUBLIC_APP_URL);

export const SITE_KEYWORDS = [
  'CourtManager Pro',
  'utilería baloncesto',
  'gestión equipación ACB',
  'inventario deportivo QR',
  'tallajes jugadores baloncesto',
  'Real Madrid Baloncesto',
  'software utilería profesional',
  'logística equipos deportivos',
  'lavandería club baloncesto',
  'material médico deportivo',
  'SaaS deportivo',
  'Euroliga equipamiento',
  'control stock camisetas',
  'packing list viajes ACB',
  'Carlos Rodriguez Kobe utilería',
];
