import type { PlayerPosition } from '@/types';

const OPTA_TO_DEMO: Record<string, PlayerPosition> = {
  point_guard: 'base',
  shooting_guard: 'escolta',
  small_forward: 'alero',
  power_forward: 'ala_pivot',
  center: 'pivot',
};

export function num(v: unknown): number {
  if (v == null || v === '') return 0;
  const n = Number(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

export function imageUrl(ref: Record<string, unknown> | null | undefined): string | null {
  if (!ref) return null;
  const base = (ref._dmS7Url || ref._publishUrl || null) as string | null;
  if (!base) return null;
  if (base.includes('assets.realmadrid.com')) {
    return `${base}?$Desktop$&fit=wrap&wid=288&hei=384`;
  }
  return base;
}

export function mapPosition(position: unknown, optaPosition?: unknown): PlayerPosition {
  if (optaPosition && OPTA_TO_DEMO[String(optaPosition)]) {
    return OPTA_TO_DEMO[String(optaPosition)];
  }
  const p = String(position || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/_/g, '-')
    .replace(/\s+/g, '-');
  if (p.includes('pivot') && p.includes('ala')) return 'ala_pivot';
  if (p.includes('pivot')) return 'pivot';
  if (p.includes('alero')) return 'alero';
  if (p.includes('escolta')) return 'escolta';
  if (p.includes('base')) return 'base';
  return 'alero';
}

export function capitalizeNationality(n: unknown): string | null {
  if (!n) return null;
  const s = String(n);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractNgState(html: string): Record<string, unknown> | null {
  const match = html.match(
    /<script id="ng-state" type="application\/json">([\s\S]*?)<\/script>/
  );
  if (!match) return null;
  try {
    return JSON.parse(match[1]) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function findSquad(state: Record<string, unknown> | null): Record<string, unknown> | null {
  if (!state) return null;
  for (const value of Object.values(state)) {
    const v = value as { b?: { data?: { seasonList?: { items?: Array<{ squad?: unknown }> } } } };
    const items = v?.b?.data?.seasonList?.items;
    if (Array.isArray(items) && items[0]?.squad) {
      return items[0].squad as Record<string, unknown>;
    }
  }
  return null;
}

/** Fallback HTML: enlaces a fichas de plantilla + dorsal/nombre aproximados. */
export function parseSquadFromHtmlFallback(html: string, plantillaUrl: string): {
  players: Array<Record<string, unknown>>;
  coaches: Array<Record<string, unknown>>;
} {
  const players: Array<Record<string, unknown>> = [];
  const coaches: Array<Record<string, unknown>> = [];
  const seen = new Set<string>();

  const linkRe =
    /href="([^"]*\/baloncesto\/primer-equipo\/plantilla\/([^"?#]+))"[^>]*>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = linkRe.exec(html))) {
    const slug = m[2];
    if (!slug || seen.has(slug) || slug.includes('/')) continue;
    seen.add(slug);

    const inner = m[3].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const dorsalMatch = inner.match(/\b(\d{1,2})\b/);
    const name = inner.replace(/\b\d{1,2}\b/g, '').trim() || slug.replace(/-/g, ' ');

    const isCoach =
      /entrenador|asistente|preparador|fisioterapeuta|medico|utilero|staff/i.test(inner) ||
      /entrenador|asistente|preparador/i.test(slug);

    const item = {
      slug,
      name: name.split(' ')[0] || name,
      surnames: name.split(' ').slice(1).join(' ') || '',
      nickname: name,
      number: dorsalMatch ? Number(dorsalMatch[1]) : 0,
      position: null,
      role: isCoach ? 'Cuerpo técnico' : null,
    };

    if (isCoach) coaches.push(item);
    else players.push(item);
  }

  if (players.length === 0 && coaches.length === 0) {
    // Second pass: any plantilla slug mentions
    const slugRe = /\/baloncesto\/primer-equipo\/plantilla\/([a-z0-9-]+)/gi;
    while ((m = slugRe.exec(html))) {
      const slug = m[1];
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);
      players.push({
        slug,
        name: slug.split('-')[0],
        surnames: slug.split('-').slice(1).join(' '),
        nickname: slug.replace(/-/g, ' '),
        number: 0,
        position: null,
      });
    }
  }

  void plantillaUrl;
  return { players, coaches };
}
