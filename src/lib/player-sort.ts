/** Orden estable de plantilla por demarcación (fútbol / baloncesto). */

const FOOTBALL_ORDER = ['portero', 'defensa', 'centrocampista', 'delantero'] as const;
const BASKET_ORDER = ['base', 'escolta', 'alero', 'ala-pivot', 'pivot'] as const;

export const FOOTBALL_POSITION_LABELS: Record<string, string> = {
  portero: 'Porteros',
  defensa: 'Defensas',
  centrocampista: 'Centrocampistas',
  delantero: 'Delanteros',
};

export const BASKET_POSITION_LABELS: Record<string, string> = {
  base: 'Bases',
  escolta: 'Escoltas',
  alero: 'Aleros',
  'ala-pivot': 'Ala-pívots',
  pivot: 'Pívots',
};

export function normalizePositionKey(position: string | null | undefined): string {
  return String(position || '')
    .toLowerCase()
    .trim()
    .replace(/_/g, '-');
}

function orderForSport(sport: string): readonly string[] {
  return sport === 'football' ? FOOTBALL_ORDER : BASKET_ORDER;
}

function labelsForSport(sport: string): Record<string, string> {
  return sport === 'football' ? FOOTBALL_POSITION_LABELS : BASKET_POSITION_LABELS;
}

function dorsalOf(p: { dorsal?: number | null; number?: number | null }): number {
  if (typeof p.dorsal === 'number') return p.dorsal;
  if (typeof p.number === 'number') return p.number;
  return 0;
}

function nameOf(p: {
  full_name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
}): string {
  if (p.full_name) return p.full_name;
  return `${p.firstName || ''} ${p.lastName || ''}`.trim();
}

export function comparePlayersByPosition<
  T extends {
    position: string;
    dorsal?: number | null;
    number?: number | null;
    full_name?: string | null;
    firstName?: string | null;
    lastName?: string | null;
  },
>(a: T, b: T, sport: string): number {
  const order = orderForSport(sport);
  const ra = order.indexOf(normalizePositionKey(a.position));
  const rb = order.indexOf(normalizePositionKey(b.position));
  const rankA = ra === -1 ? 99 : ra;
  const rankB = rb === -1 ? 99 : rb;
  if (rankA !== rankB) return rankA - rankB;
  const da = dorsalOf(a);
  const db = dorsalOf(b);
  if (da !== db) return da - db;
  return nameOf(a).localeCompare(nameOf(b), 'es');
}

export function sortPlayersByPosition<
  T extends {
    position: string;
    dorsal?: number | null;
    number?: number | null;
    full_name?: string | null;
    firstName?: string | null;
    lastName?: string | null;
  },
>(players: T[], sport: string): T[] {
  return [...players].sort((a, b) => comparePlayersByPosition(a, b, sport));
}

export function groupPlayersByPosition<
  T extends {
    position: string;
    dorsal?: number | null;
    number?: number | null;
    full_name?: string | null;
    firstName?: string | null;
    lastName?: string | null;
  },
>(
  players: T[],
  sport: string
): { key: string; label: string; players: T[] }[] {
  const sorted = sortPlayersByPosition(players, sport);
  const order = orderForSport(sport);
  const labels = labelsForSport(sport);
  const map = new Map<string, T[]>();

  for (const p of sorted) {
    const key = normalizePositionKey(p.position) || 'otros';
    const list = map.get(key);
    if (list) list.push(p);
    else map.set(key, [p]);
  }

  const groups: { key: string; label: string; players: T[] }[] = [];
  for (const key of order) {
    const list = map.get(key);
    if (list?.length) {
      groups.push({ key, label: labels[key] || key, players: list });
      map.delete(key);
    }
  }
  for (const [key, list] of map) {
    if (list.length) {
      groups.push({ key, label: labels[key] || key, players: list });
    }
  }
  return groups;
}

/** Ordena claves de posición para filtros (Porteros → …). */
export function sortPositionKeys(keys: string[], sport: string): string[] {
  const order = orderForSport(sport);
  return [...keys].sort((a, b) => {
    const ra = order.indexOf(normalizePositionKey(a));
    const rb = order.indexOf(normalizePositionKey(b));
    return (ra === -1 ? 99 : ra) - (rb === -1 ? 99 : rb);
  });
}
