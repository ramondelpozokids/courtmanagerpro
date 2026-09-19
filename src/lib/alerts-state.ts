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

/** Alertas de calendario de partidos ya jugados (resultados, marcador, fecha pasada). */
export function isPastCalendarAlert(alert: AlertLike): boolean {
  const type = String(alert.type || '').toLowerCase();
  if (!type.includes('calendario')) return false;

  const meta = alert.metadata && typeof alert.metadata === 'object' ? alert.metadata : {};
  const change = String(meta.change_type || '').toLowerCase();
  const blob = `${alert.title || ''} ${alert.message || ''}`;

  if (type === 'calendario_resultado' || change === 'resultado' || change === 'marcador') {
    return true;
  }
  if (change === 'estado' && /finalizado/.test(blob.toLowerCase())) return true;

  const metaDate = String(
    meta.match_date || (meta.fixture as { match_date?: string } | undefined)?.match_date || ''
  ).slice(0, 10);
  const dates = [metaDate, ...isoDatesInText(blob)].filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d));
  if (!dates.length) return false;
  const eventDate = dates.sort()[dates.length - 1];
  return eventDate < madridTodayIso();
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
