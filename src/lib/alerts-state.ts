/**
 * Reglas puras de bandeja de alertas.
 * Badge del menú y listado deben usar siempre el mismo cómputo.
 */

export type AlertLike = {
  id?: string;
  is_read?: boolean | null;
  is_dismissed?: boolean | null;
};

/** Alertas visibles en bandeja (no descartadas). */
export function visibleAlerts<T extends AlertLike>(alerts: T[]): T[] {
  return alerts.filter((a) => !a.is_dismissed);
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
