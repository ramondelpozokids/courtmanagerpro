import type { ClubNewsItem } from '@/data/clubs/types';

export const RMB_OFFICIAL_NEWS_PAGE =
  'https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/inicio';

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept-Language': 'es-ES,es;q=0.9',
  Accept: 'text/html,application/xhtml+xml',
};

const TAG_LABELS: Record<string, string> = {
  cronicas: 'Crónica',
  actualidad: 'Actualidad',
  'ruedas-de-prensa': 'Rueda de prensa',
  comunicados: 'Comunicado',
  entrevistas: 'Entrevista',
};

function extractNgState(html: string): Record<string, unknown> | null {
  const match = html.match(/<script id="ng-state" type="application\/json">([\s\S]*?)<\/script>/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function imageUrl(ref: Record<string, unknown> | null | undefined): string {
  if (!ref) return '/clubs/rmb/hero.png';
  const base = String(ref._dmS7Url || ref._publishUrl || '');
  if (base.includes('assets.realmadrid.com')) {
    return `${base}?$Desktop$&fit=wrap&wid=800`;
  }
  return base || '/clubs/rmb/hero.png';
}

function stripHtml(html: unknown): string {
  if (!html || typeof html !== 'object') return '';
  const raw = String((html as { html?: string }).html || '');
  return raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function tagLabel(tags: unknown): string {
  const raw = Array.isArray(tags) ? String(tags[0] || '') : String(tags || '');
  const last = raw.split('/').pop() || '';
  return TAG_LABELS[last] || 'Noticias';
}

function newsUrl(item: Record<string, unknown>): string {
  const slug = String(item.slug || '');
  const raw = Array.isArray(item.tag) ? String(item.tag[0] || '') : '';
  const path = raw.replace(/^realmadrid-com:/, '').replace(/^\/+/, '');
  if (path && slug) return `https://www.realmadrid.com/es-ES/${path}/${slug}`;
  return `${RMB_OFFICIAL_NEWS_PAGE}`;
}

function mapItem(item: Record<string, unknown>): ClubNewsItem | null {
  const slug = String(item.slug || '');
  if (!slug) return null;
  const title = String(item.highlightedTitle || item.title || '').trim();
  if (!title) return null;
  const description =
    stripHtml(item.highlightedText) || title;
  return {
    id: slug,
    title,
    tag: tagLabel(item.tag),
    image: imageUrl(item.image as Record<string, unknown>),
    description,
    date: String(item.date || '').slice(0, 10),
    url: newsUrl(item),
  };
}

export async function fetchRmbOfficialNews(): Promise<ClubNewsItem[]> {
  const res = await fetch(RMB_OFFICIAL_NEWS_PAGE, {
    headers: HEADERS,
    next: { revalidate: 1800 },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const state = extractNgState(html);
  if (!state) throw new Error('ng-state no encontrado');

  const collected: Record<string, unknown>[] = [];
  for (const value of Object.values(state)) {
    const modules = (value as { b?: { data?: { page?: { item?: { modules?: unknown } } } } })?.b
      ?.data?.page?.item?.modules;
    if (!Array.isArray(modules)) continue;
    for (const mod of modules as Array<Record<string, unknown>>) {
      if (mod.highlightedNews && typeof mod.highlightedNews === 'object') {
        collected.push(mod.highlightedNews as Record<string, unknown>);
      }
      if (Array.isArray(mod.newsList)) {
        collected.push(...(mod.newsList as Record<string, unknown>[]));
      }
    }
  }

  const seen = new Set<string>();
  const items: ClubNewsItem[] = [];
  for (const raw of collected) {
    const mapped = mapItem(raw);
    if (!mapped || seen.has(mapped.id)) continue;
    seen.add(mapped.id);
    items.push(mapped);
  }

  items.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  return items;
}
