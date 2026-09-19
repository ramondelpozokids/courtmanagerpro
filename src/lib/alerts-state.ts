/**
 * Reglas puras de bandeja de alertas.
 * Badge del menú y listado deben usar siempre el mismo cómputo.
 */

export type AlertLike = {
  id?: string;
  type?: string | null;
  title?: string | null;
  message?: string | null;
  is_read?: boolean | null;
  is_dismissed?: boolean | null;
  metadata?: Record<string, unknown> | null;
};

export function madridTodayIso(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value || '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

function isoDatesInText(value: string): string[] {
  return [...value.matchAll(/\d{4}-\d{2}-\d{2}/g)].map((m) => m[0]);
}

function esDatesInText(value: string): string[] {
  const out: string[] = [];
  for (const m of value.matchAll(/(\d{1,2})\/(\d{1,2})\/(\d{4})/g)) {
    const d = m[1].padStart(2, '0');
    const mo = m[2].padStart(2, '0');
    out.push(`${m[3]}-${mo}-${d}`);
  }
  return out;
}

export type AlertDateSort = 'asc' | 'desc';

/** Fecha del partido/evento (metadata, ISO o 24/9/2026 en el texto). Si no hay, created_at. */
export function alertEventDateIso(alert: AlertLike & { created_at?: string | null }): string {
  const meta = alert.metadata && typeof alert.metadata === 'object' ? alert.metadata : {};
  const metaDate = String(
    meta.match_date ||
      meta.event_date ||
      (meta.fixture as { match_date?: string } | undefined)?.match_date ||
      ''
  ).slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(metaDate)) return metaDate;

  const blob = `${alert.title || ''} ${alert.message || ''}`;
  const fromText = [...isoDatesInText(blob), ...esDatesInText(blob)].sort();
  if (fromText.length) return fromText[0];

  const created = String(alert.created_at || '').slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(created) ? created : '9999-12-31';
}

export function sortAlertsByEventDate<T extends AlertLike & { created_at?: string | null }>(
  alerts: T[],
  direction: AlertDateSort = 'asc'
): T[] {
  const sign = direction === 'desc' ? -1 : 1;
  return [...alerts].sort((a, b) => {
    const da = alertEventDateIso(a);
    const db = alertEventDateIso(b);
    if (da !== db) return da < db ? -sign : sign;
    return String(a.created_at || '').localeCompare(String(b.created_at || '')) * sign;
  });
}

/** Alertas de calendario/viaje de partidos ya jugados (resultados, marcador, fecha pasada). */
export function isPastCalendarAlert(alert: AlertLike): boolean {
  const type = String(alert.type || '').toLowerCase();
  const meta = alert.metadata && typeof alert.metadata === 'object' ? alert.metadata : {};
  const change = String(meta.change_type || '').toLowerCase();
  const blob = `${alert.title || ''} ${alert.message || ''}`;

  const metaDate = String(
    meta.match_date || (meta.fixture as { match_date?: string } | undefined)?.match_date || ''
  ).slice(0, 10);
  const dates = [metaDate, ...isoDatesInText(blob), ...esDatesInText(blob)].filter((d) =>
    /^\d{4}-\d{2}-\d{2}$/.test(d)
  );
  if (dates.length) {
    const eventDate = dates.sort()[dates.length - 1];
    if (
      (type === 'viaje_proximo' || type.includes('calendario')) &&
      eventDate < madridTodayIso()
    ) {
      return true;
    }
  }

  if (!type.includes('calendario')) return false;
  if (type === 'calendario_resultado' || change === 'resultado' || change === 'marcador') {
    return true;
  }
  if (change === 'estado' && /finalizado/.test(blob.toLowerCase())) return true;
  return false;
}

/** Alertas visibles en bandeja (no descartadas ni de partidos ya jugados). */
export function visibleAlerts<T extends AlertLike>(alerts: T[]): T[] {
  return alerts.filter((a) => !a.is_dismissed && !isPastCalendarAlert(a));
}

/** Contador del badge: visibles y sin leer. */
export function countUnreadAlerts(alerts: AlertLike[]): number {
  return visibleAlerts(alerts).filter((a) => !a.is_read).length;
}

/**
 * Invariante: el número del menú debe coincidir con no leídas de la bandeja.
 * Si falla, hay un bug de sincronización UI.
 */
export function badgeMatchesInbox(alerts: AlertLike[], badgeCount: number): boolean {
  return countUnreadAlerts(alerts) === badgeCount;
}
