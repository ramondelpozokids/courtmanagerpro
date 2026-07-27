/**
 * Plantilla oficial Atlético de Madrid
 * Fuente: https://www.atleticodemadrid.com/equipos/atletico-de-madrid-2025-2026
 */
import {
  ATLETICO_FOOTBALL_PLANTILLA_URL,
  ATLETICO_SOURCE_ID,
  ATLETICO_SOURCE_LABEL,
  type OfficialPlayer,
  type OfficialRosterSnapshot,
  type OfficialStaff,
  type RosterSource,
} from './types';
import { mapPosition, num } from '../parser';
import { atmCoachingStaff, atmPlayers } from '@/data/clubs/atm-data';
import type { PlayerPosition } from '@/types';

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept-Language': 'es-ES,es;q=0.9',
  Accept: 'text/html,application/xhtml+xml',
};

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, { headers: HEADERS, cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

function decodeHtml(s: string): string {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&uuml;/gi, 'ü')
    .replace(/&ouml;/gi, 'ö')
    .replace(/&aacute;/gi, 'á')
    .replace(/&eacute;/gi, 'é')
    .replace(/&iacute;/gi, 'í')
    .replace(/&oacute;/gi, 'ó')
    .replace(/&uacute;/gi, 'ú')
    .replace(/&ntilde;/gi, 'ñ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function guessPosition(dorsal: number): PlayerPosition {
  if (dorsal === 1 || dorsal === 13) return 'portero';
  if ([2, 3, 15, 16, 17, 18, 24].includes(dorsal)) return 'defensa';
  if ([7, 9, 11, 19, 22].includes(dorsal)) return 'delantero';
  return 'centrocampista';
}

function parsePlayersFromHtml(html: string): OfficialPlayer[] {
  const re =
    /href="(https?:\/\/www\.atleticodemadrid\.com\/jugadores\/([^"]+))"[^>]*>[\s\S]*?(?:src="(https:\/\/img-estaticos\.atleticodemadrid\.com[^"]+)"[\s\S]*?)?(\d{1,2})\s*([A-ZÁÉÍÓÚÜÑ0-9 .'\-]+?)\s*</gi;
  // Prefer link+img cards
  const cardRe =
    /href="(https?:\/\/www\.atleticodemadrid\.com\/jugadores\/([^"]+))"[\s\S]{0,800}?src="(https:\/\/img-estaticos\.atleticodemadrid\.com[^"]+)"[\s\S]{0,400}?(\d{1,2})\s*<\/?[^>]*>?\s*([A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 .'\-]+)/gi;
  const seen = new Set<string>();
  const players: OfficialPlayer[] = [];
  let m: RegExpExecArray | null;
  while ((m = cardRe.exec(html)) !== null) {
    const profile_url = m[1];
    const slug = m[2];
    if (seen.has(slug)) continue;
    seen.add(slug);
    const photo_url = m[3] || null;
    const dorsal = num(m[4]) || 0;
    const display = decodeHtml(m[5]);
    const parts = display.split(/\s+/);
    const first_name = parts[0] || display;
    const last_name = parts.slice(1).join(' ') || display;
    const position_demo = guessPosition(dorsal);
    players.push({
      slug,
      full_name: display,
      first_name,
      last_name,
      dorsal,
      position: position_demo,
      position_demo,
      photo_url,
      nationality: null,
      birth_date: null,
      profile_url,
    });
  }
  if (players.length > 0) return players;

  while ((m = re.exec(html)) !== null) {
    const profile_url = m[1];
    const slug = m[2];
    if (seen.has(slug)) continue;
    seen.add(slug);
    const dorsal = num(m[4]) || 0;
    const display = decodeHtml(m[5]);
    const parts = display.split(/\s+/);
    const first_name = parts[0] || display;
    const last_name = parts.slice(1).join(' ') || display;
    const position_demo = guessPosition(dorsal);
    players.push({
      slug,
      full_name: display,
      first_name,
      last_name,
      dorsal,
      position: position_demo,
      position_demo,
      photo_url: m[3] || null,
      nationality: null,
      birth_date: null,
      profile_url,
    });
  }
  return players;
}

function packFallback(): OfficialRosterSnapshot {
  const players: OfficialPlayer[] = atmPlayers.map((p) => ({
    slug: p.profile_url.split('/').pop() || p.id,
    full_name: `${p.firstName} ${p.lastName}`.trim(),
    first_name: p.firstName,
    last_name: p.lastName,
    dorsal: p.number,
    position: p.position,
    position_demo: mapPosition(p.position),
    photo_url: p.imageUrl || null,
    nationality: p.nationality,
    birth_date: p.birthDate,
    profile_url: p.profile_url,
  }));
  const staff: OfficialStaff[] = atmCoachingStaff.map((s) => {
    const parts = String(s.full_name).split(/\s+/);
    return {
      slug: s.id,
      full_name: s.full_name,
      first_name: parts[0] || s.full_name,
      last_name: parts.slice(1).join(' ') || '',
      role: s.role,
      photo_url: s.photo_url || null,
      nationality: s.nationality || null,
      profile_url: s.profile_url || ATLETICO_FOOTBALL_PLANTILLA_URL,
    };
  });
  return {
    source_id: ATLETICO_SOURCE_ID,
    source_url: ATLETICO_FOOTBALL_PLANTILLA_URL,
    source_label: ATLETICO_SOURCE_LABEL,
    fetched_at: new Date().toISOString(),
    players,
    staff,
  };
}

export class AtleticoOfficialSource implements RosterSource {
  id = ATLETICO_SOURCE_ID;
  label = ATLETICO_SOURCE_LABEL;
  url: string;

  constructor(plantillaUrl: string = ATLETICO_FOOTBALL_PLANTILLA_URL) {
    this.url = plantillaUrl;
  }

  async fetchRoster(): Promise<OfficialRosterSnapshot> {
    try {
      const html = await fetchHtml(this.url);
      const players = parsePlayersFromHtml(html);
      if (players.length === 0) {
        console.warn('[roster-sync] ATM HTML vacío — fallback pack');
        return packFallback();
      }
      const fallback = packFallback();
      return {
        source_id: this.id,
        source_url: this.url,
        source_label: this.label,
        fetched_at: new Date().toISOString(),
        players,
        staff: fallback.staff,
      };
    } catch (err) {
      console.warn('[roster-sync] ATM fetch failed — fallback pack', err);
      return packFallback();
    }
  }
}

export function createAtleticoRosterSource(): RosterSource {
  return new AtleticoOfficialSource();
}
