import {
  ATLETICO_FOOTBALL_PLANTILLA_URL,
  REAL_MADRID_FOOTBALL_PLANTILLA_URL,
  REAL_MADRID_PLANTILLA_URL,
  REAL_MADRID_SOURCE_ID,
  REAL_MADRID_SOURCE_LABEL,
  type OfficialPlayer,
  type OfficialRosterSnapshot,
  type OfficialStaff,
  type RosterSource,
} from './types';
import {
  capitalizeNationality,
  extractNgState,
  findSquad,
  imageUrl,
  mapPosition,
  num,
  parseSquadFromHtmlFallback,
} from '../parser';
import { CLUB_TEAM_IDS } from '@/lib/club-team-ids';
import { createAtleticoRosterSource } from './atleticoOfficial';

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept-Language': 'es-ES,es;q=0.9',
  Accept: 'text/html,application/xhtml+xml',
};

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

async function fetchHtmlWithRetry(url: string, attempts = 3): Promise<string> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { headers: HEADERS, next: { revalidate: 0 } });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      return await res.text();
    } catch (err) {
      lastError = err;
      const delay = 400 * Math.pow(2, i);
      console.warn(`[roster-sync] fetch retry ${i + 1}/${attempts} for ${url}:`, err);
      await sleep(delay);
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

function listItemToPlayer(item: Record<string, unknown>, plantillaUrl: string): OfficialPlayer {
  const slug = String(item.slug || '');
  const name = String(item.name || '');
  const surnames = String(item.surnames || item.nickname || '');
  const full_name =
    `${name} ${surnames}`.trim() || String(item.nickname || slug.replace(/-/g, ' '));

  return {
    slug,
    full_name,
    first_name: name || full_name.split(' ')[0] || '',
    last_name: surnames || full_name.split(' ').slice(1).join(' ') || '',
    dorsal: num(item.number),
    position: (item.position as string) || null,
    position_demo: mapPosition(item.position, item.optaPosition),
    photo_url: imageUrl(item.squadImage as Record<string, unknown>) || imageUrl(item.image as Record<string, unknown>),
    nationality: capitalizeNationality(item.nationality),
    birth_date: (item.birthDate as string) || null,
    profile_url: `${plantillaUrl}/${slug}`,
  };
}

function listItemToStaff(item: Record<string, unknown>, plantillaUrl: string): OfficialStaff {
  const slug = String(item.slug || '');
  const name = String(item.name || '');
  const surnames = String(item.surnames || item.nickname || '');
  const full_name =
    `${name} ${surnames}`.trim() || String(item.nickname || slug.replace(/-/g, ' '));

  return {
    slug,
    full_name,
    first_name: name || full_name.split(' ')[0] || '',
    last_name: surnames || full_name.split(' ').slice(1).join(' ') || '',
    role: String(item.role || 'Cuerpo técnico'),
    photo_url:
      imageUrl(item.squadImage as Record<string, unknown>) ||
      imageUrl(item.image as Record<string, unknown>),
    nationality: capitalizeNationality(item.nationality),
    profile_url: `${plantillaUrl}/${slug}`,
  };
}

export class RealMadridOfficialSource implements RosterSource {
  id = REAL_MADRID_SOURCE_ID;
  label = REAL_MADRID_SOURCE_LABEL;
  url: string;

  constructor(plantillaUrl: string = REAL_MADRID_PLANTILLA_URL) {
    this.url = plantillaUrl;
  }

  async fetchRoster(): Promise<OfficialRosterSnapshot> {
    const html = await fetchHtmlWithRetry(this.url);
    const state = extractNgState(html);
    let squad = findSquad(state);

    let listPlayers: Array<Record<string, unknown>> = [];
    let listCoaches: Array<Record<string, unknown>> = [];

    if (squad) {
      listPlayers = Array.isArray(squad.players) ? (squad.players as Array<Record<string, unknown>>) : [];
      listCoaches = Array.isArray(squad.coaches) ? (squad.coaches as Array<Record<string, unknown>>) : [];
    }

    if (listPlayers.length === 0 && listCoaches.length === 0) {
      console.warn('[roster-sync] ng-state squad empty — falling back to HTML structure');
      const fallback = parseSquadFromHtmlFallback(html, this.url);
      listPlayers = fallback.players;
      listCoaches = fallback.coaches;
    }

    if (listPlayers.length === 0 && listCoaches.length === 0) {
      throw new Error('No se pudo parsear la plantilla oficial (estructura HTML desconocida)');
    }

    const players = listPlayers
      .filter((p) => p?.slug)
      .map((p) => listItemToPlayer(p, this.url));

    const staff = listCoaches
      .filter((c) => c?.slug)
      .map((c) => listItemToStaff(c, this.url));

    return {
      source_id: this.id,
      source_url: this.url,
      source_label: this.label,
      fetched_at: new Date().toISOString(),
      players,
      staff,
    };
  }
}

/** RMB → baloncesto; RMF → fútbol RM; ATM → fútbol Atlético. */
export function plantillaUrlForTeam(teamId: string): string {
  if (teamId === CLUB_TEAM_IDS.atm) return ATLETICO_FOOTBALL_PLANTILLA_URL;
  if (teamId === CLUB_TEAM_IDS.rmf) return REAL_MADRID_FOOTBALL_PLANTILLA_URL;
  return REAL_MADRID_PLANTILLA_URL;
}

export function createRosterSourceForTeam(teamId: string): RosterSource {
  if (teamId === CLUB_TEAM_IDS.atm) return createAtleticoRosterSource();
  return new RealMadridOfficialSource(plantillaUrlForTeam(teamId));
}

/** @deprecated Prefer createRosterSourceForTeam(teamId) */
export function createDefaultRosterSource(): RosterSource {
  return new RealMadridOfficialSource(REAL_MADRID_PLANTILLA_URL);
}
