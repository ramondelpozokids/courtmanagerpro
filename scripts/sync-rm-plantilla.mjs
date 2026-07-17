/**
 * Sincroniza plantilla completa (jugadores + cuerpo técnico) desde
 * https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla
 *
 * Extrae listado, imágenes, ficha personal, trayectoria, palmarés y estadísticas.
 * Uso: node scripts/sync-rm-plantilla.mjs
 */

import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'fs';

const PLANTILLA_URL = 'https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla';
const SEASON = '2025-2026';

const SLUG_TO_ID = {
  'liga-endesa': 'liga_endesa',
  euroliga: 'euroliga',
  'supercopa-endesa': 'supercopa_endesa',
  'copa-del-rey': 'copa_del_rey',
};

const OPTA_TO_DEMO = {
  point_guard: 'base',
  shooting_guard: 'escolta',
  small_forward: 'alero',
  power_forward: 'ala-pivot',
  center: 'pivot',
};

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept-Language': 'es-ES,es;q=0.9',
};

function num(v) {
  if (v == null || v === '') return 0;
  const n = Number(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchHtml(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

function extractNgState(html) {
  const match = html.match(/<script id="ng-state" type="application\/json">([\s\S]*?)<\/script>/);
  if (!match) return null;
  return JSON.parse(match[1]);
}

function findSquad(state) {
  for (const value of Object.values(state || {})) {
    const items = value?.b?.data?.seasonList?.items;
    if (Array.isArray(items) && items[0]?.squad) return items[0].squad;
  }
  return null;
}

function findPlayerPayload(state) {
  for (const value of Object.values(state || {})) {
    const items = value?.b?.data?.playerList?.items;
    if (Array.isArray(items) && items[0]) return items[0];
  }
  return null;
}

function findCoachPayload(state) {
  for (const value of Object.values(state || {})) {
    const items = value?.b?.data?.coachList?.items;
    if (Array.isArray(items) && items[0]) return items[0];
  }
  return null;
}

function imageUrl(ref) {
  if (!ref) return null;
  const base = ref._dmS7Url || ref._publishUrl || null;
  if (!base) return null;
  if (base.includes('assets.realmadrid.com')) {
    return `${base}?$Desktop$&fit=wrap&wid=288&hei=384`;
  }
  return base;
}

function stripHtml(html = '') {
  return String(html)
    .replace(/<\/li>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

function parseHistory(history) {
  const lines = stripHtml(history?.html || history || '');
  let debut = null;
  const trajectoryLines = [];
  for (const line of lines) {
    const debutMatch = line.match(/^Debut con el Real Madrid:\s*(.+)$/i);
    if (debutMatch) {
      debut = debutMatch[1].trim();
      continue;
    }
    trajectoryLines.push(line);
  }
  return {
    trajectory: trajectoryLines.join(', '),
    trajectory_items: trajectoryLines,
    debut,
  };
}

function mapTrophies(trophyList = []) {
  return trophyList
    .filter((t) => t?.titleName)
    .map((t) => {
      const n = String(t.number || '').trim();
      const title = String(t.titleName).trim();
      return n && n !== '0' ? `${n} ${title}` : title;
    });
}

function mapPosition(position, optaPosition) {
  if (optaPosition && OPTA_TO_DEMO[optaPosition]) return OPTA_TO_DEMO[optaPosition];
  const p = String(position || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  if (p.includes('pivot') && p.includes('ala')) return 'ala-pivot';
  if (p.includes('pivot')) return 'pivot';
  if (p.includes('alero')) return 'alero';
  if (p.includes('escolta')) return 'escolta';
  if (p.includes('base')) return 'base';
  return 'alero';
}

function capitalizeNationality(n) {
  if (!n) return null;
  return String(n).charAt(0).toUpperCase() + String(n).slice(1);
}

function emptyStats() {
  return {
    season: SEASON,
    matches_played: 0,
    points: 0,
    rebounds: 0,
    assists: 0,
    minutes_played: 0,
    valuation: 0,
    ppg: 0,
    rpg: 0,
    apg: 0,
  };
}

function mapCompetitionStats(competitionStatistics = []) {
  const map = {
    liga_endesa: { stats: emptyStats() },
    euroliga: { stats: emptyStats() },
    supercopa_endesa: { stats: emptyStats() },
    copa_del_rey: { stats: emptyStats() },
  };

  for (const row of competitionStatistics) {
    const slug = row.competition?.slug;
    const id = SLUG_TO_ID[slug];
    if (!id) continue;

    const matches = num(row.partidos_jugados);
    const points = num(row.puntos_totales);
    const rebounds = num(row.rebotes_totales);
    const assists = num(row.asistencias);
    const minutes = num(row.minutos_jugados);
    const valuation = num(row.valoracion);

    map[id] = {
      stats: {
        season: SEASON,
        phase: 'Temporada regular',
        matches_played: matches,
        points,
        rebounds,
        assists,
        minutes_played: minutes,
        valuation,
        steals: num(row.balones_recuperados),
        blocks: num(row.tapones_favor),
        ppg: matches ? Number((points / matches).toFixed(1)) : 0,
        rpg: matches ? Number((rebounds / matches).toFixed(1)) : 0,
        apg: matches ? Number((assists / matches).toFixed(1)) : 0,
        source: 'realmadrid.com',
        updated_at: new Date().toISOString(),
      },
    };
  }

  return map;
}

function mapGlobal(aggregated = {}) {
  const matches = num(aggregated.partidos_jugados);
  const points = num(aggregated.puntos_totales);
  const rebounds = num(aggregated.rebotes_totales);
  const assists = num(aggregated.asistencias);
  return {
    matches_played: matches,
    points,
    rebounds,
    assists,
    minutes_played: num(aggregated.minutos_jugados),
    valuation: num(aggregated.valoracion),
    ppg: matches ? Number((points / matches).toFixed(1)) : 0,
    rpg: matches ? Number((rebounds / matches).toFixed(1)) : 0,
    apg: matches ? Number((assists / matches).toFixed(1)) : 0,
  };
}

function loadKnownLegacyIds() {
  const known = {};
  const path = 'src/data/rmb-sizing-overrides.ts';
  if (!existsSync(path)) return known;
  const text = readFileSync(path, 'utf8');
  const re = /['"]([^'"]+)['"]:\s*\{[^}]*legacyId:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(text))) known[m[1]] = m[2];
  return known;
}

function assignLegacyIds(slugs, prefix, known) {
  const used = new Set(Object.values(known));
  let next = 1;
  const out = {};
  for (const slug of slugs) {
    if (known[slug] && !Object.values(out).includes(known[slug])) {
      out[slug] = known[slug];
      used.add(known[slug]);
      continue;
    }
    while (used.has(`${prefix}${next}`)) next += 1;
    out[slug] = `${prefix}${next}`;
    used.add(out[slug]);
    next += 1;
  }
  return out;
}

async function syncPlayer(slug, legacyId) {
  const profile_url = `${PLANTILLA_URL}/${slug}`;
  const html = await fetchHtml(profile_url);
  const state = extractNgState(html);
  const payload = findPlayerPayload(state);
  if (!payload) throw new Error('player payload not found');

  const history = parseHistory(payload.history);
  const seasonStats =
    payload.statistics?.find((s) => s.season === SEASON) || payload.statistics?.[0];
  const globalStats = mapGlobal(seasonStats?.aggregatedStatistic);
  const competition_stats = mapCompetitionStats(seasonStats?.competitionStatistics);

  return {
    legacyId,
    slug,
    profile_url,
    firstName: payload.name || '',
    lastName: payload.surnames || payload.nickname || '',
    full_name: `${payload.name || ''} ${payload.surnames || ''}`.trim() || payload.nickname,
    nickname: payload.nickname || null,
    dorsal: num(payload.number),
    position: payload.position || null,
    position_demo: mapPosition(payload.position, payload.optaPosition),
    opta_position: payload.optaPosition || null,
    nationality: capitalizeNationality(payload.nationality),
    birth_date: payload.birthDate || null,
    birth_place: payload.birthPlace || null,
    weight: payload.weight || null,
    height: payload.height || null,
    photo_url: imageUrl(payload.squadImage) || imageUrl(payload.image),
    debut: history.debut,
    trajectory: history.trajectory,
    trajectory_items: history.trajectory_items,
    palmares: mapTrophies(payload.trophyList),
    ...globalStats,
    competition_stats,
  };
}

async function syncCoach(slug, legacyId, listItem = {}) {
  const profile_url = `${PLANTILLA_URL}/${slug}`;
  const html = await fetchHtml(profile_url);
  const state = extractNgState(html);
  const payload = findCoachPayload(state) || {};
  const history = parseHistory(payload.history);
  const name = payload.name || listItem.name || '';
  const surnames = payload.surnames || listItem.surnames || '';
  const full_name =
    `${name} ${surnames}`.trim() || payload.nickname || listItem.nickname || slug;

  return {
    legacyId,
    slug,
    profile_url,
    full_name,
    firstName: name,
    lastName: surnames,
    role: payload.role || listItem.role || 'Cuerpo técnico',
    nationality: capitalizeNationality(payload.nationality),
    birth_date: payload.birthDate || null,
    birth_place: payload.birthPlace || null,
    photo_url:
      imageUrl(payload.squadImage) ||
      imageUrl(payload.image) ||
      imageUrl(listItem.squadImage),
    trajectory: history.trajectory,
    trajectory_items: history.trajectory_items,
    palmares: mapTrophies(payload.trophyList),
  };
}

console.log('Fetching plantilla list…');
const listHtml = await fetchHtml(PLANTILLA_URL);
const listState = extractNgState(listHtml);
const squad = findSquad(listState);
if (!squad) throw new Error('squad not found on plantilla page');

const listPlayers = Array.isArray(squad.players) ? squad.players : [];
const listCoaches = Array.isArray(squad.coaches) ? squad.coaches : [];
console.log(`Found ${listPlayers.length} players, ${listCoaches.length} coaches`);

const known = loadKnownLegacyIds();
const playerIds = assignLegacyIds(
  listPlayers.map((p) => p.slug),
  'p',
  known
);
const coachIds = assignLegacyIds(
  listCoaches.map((c) => c.slug),
  'c',
  Object.fromEntries(
    Object.entries(known).filter(([, id]) => String(id).startsWith('c'))
  )
);

const players = [];
const statsByLegacy = {};

for (const item of listPlayers) {
  try {
    const legacyId = playerIds[item.slug];
    const record = await syncPlayer(item.slug, legacyId);
    // Prefer list image if detail lacks one
    if (!record.photo_url) record.photo_url = imageUrl(item.squadImage);
    if (!record.dorsal && item.number) record.dorsal = num(item.number);
    if (!record.position && item.position) {
      record.position = item.position;
      record.position_demo = mapPosition(item.position, item.optaPosition);
    }
    players.push(record);
    statsByLegacy[legacyId] = {
      slug: record.slug,
      profile_url: record.profile_url,
      full_name: record.full_name,
      dorsal: record.dorsal,
      position: record.position,
      nationality: record.nationality,
      birth_date: record.birth_date,
      birth_place: record.birth_place,
      weight: record.weight,
      height: record.height,
      photo_url: record.photo_url,
      matches_played: record.matches_played,
      points: record.points,
      rebounds: record.rebounds,
      assists: record.assists,
      minutes_played: record.minutes_played,
      valuation: record.valuation,
      ppg: record.ppg,
      rpg: record.rpg,
      apg: record.apg,
      competition_stats: record.competition_stats,
    };
    console.log(`OK player ${legacyId} ${record.full_name}`);
  } catch (err) {
    console.error(`FAIL player ${item.slug}:`, err.message);
  }
  await sleep(250);
}

const staff = [];
for (const item of listCoaches) {
  try {
    const legacyId = coachIds[item.slug];
    const record = await syncCoach(item.slug, legacyId, item);
    staff.push(record);
    console.log(`OK staff ${legacyId} ${record.full_name}`);
  } catch (err) {
    console.error(`FAIL staff ${item.slug}:`, err.message);
  }
  await sleep(250);
}

mkdirSync('src/data', { recursive: true });

const syncedAt = new Date().toISOString();

const rosterTs = `// Auto-generated from realmadrid.com — ${syncedAt}
// Source: ${PLANTILLA_URL}
// Regenerar: npm run sync:rm-plantilla

export interface RmbOfficialTrophyStats {
  season?: string;
  phase?: string;
  matches_played: number;
  points: number;
  rebounds: number;
  assists: number;
  minutes_played?: number;
  valuation?: number;
  steals?: number;
  blocks?: number;
  ppg?: number;
  rpg?: number;
  apg?: number;
  source?: string;
  updated_at?: string;
}

export interface RmbOfficialPlayerProfile {
  legacyId: string;
  slug: string;
  profile_url: string;
  firstName: string;
  lastName: string;
  full_name: string;
  nickname: string | null;
  dorsal: number;
  position: string | null;
  position_demo: string;
  opta_position: string | null;
  nationality: string | null;
  birth_date: string | null;
  birth_place: string | null;
  weight: string | null;
  height: string | null;
  photo_url: string | null;
  debut: string | null;
  trajectory: string;
  trajectory_items: string[];
  palmares: string[];
  matches_played: number;
  points: number;
  rebounds: number;
  assists: number;
  minutes_played: number;
  valuation: number;
  ppg: number;
  rpg: number;
  apg: number;
  competition_stats: Record<string, { stats: RmbOfficialTrophyStats }>;
}

export interface RmbOfficialStaffProfile {
  legacyId: string;
  slug: string;
  profile_url: string;
  full_name: string;
  firstName: string;
  lastName: string;
  role: string;
  nationality: string | null;
  birth_date: string | null;
  birth_place: string | null;
  photo_url: string | null;
  trajectory: string;
  trajectory_items: string[];
  palmares: string[];
}

export const RMB_OFFICIAL_SOURCE = ${JSON.stringify(PLANTILLA_URL)};
export const RMB_OFFICIAL_SYNCED_AT = ${JSON.stringify(syncedAt)};

export const RMB_OFFICIAL_PLAYERS: RmbOfficialPlayerProfile[] = ${JSON.stringify(players, null, 2)};

export const RMB_OFFICIAL_STAFF: RmbOfficialStaffProfile[] = ${JSON.stringify(staff, null, 2)};

export function getOfficialPlayerByLegacyId(legacyId: string): RmbOfficialPlayerProfile | null {
  return RMB_OFFICIAL_PLAYERS.find((p) => p.legacyId === legacyId) ?? null;
}

export function getOfficialPlayerBySlug(slug: string): RmbOfficialPlayerProfile | null {
  return RMB_OFFICIAL_PLAYERS.find((p) => p.slug === slug) ?? null;
}

export function getOfficialStaffByLegacyId(legacyId: string): RmbOfficialStaffProfile | null {
  return RMB_OFFICIAL_STAFF.find((s) => s.legacyId === legacyId) ?? null;
}
`;

writeFileSync('src/data/rmb-official-roster.ts', rosterTs, 'utf8');

const statsTs = `// Auto-generated from realmadrid.com — ${syncedAt}
// Regenerar: npm run sync:rm-plantilla  (o npm run sync:rm-stats)

import type { PlayerCompetitionMap } from '@/lib/player-competitions';

export interface RmbOfficialPlayerRecord {
  slug: string;
  profile_url: string;
  full_name: string;
  dorsal: number;
  position: string;
  nationality: string | null;
  birth_date: string | null;
  birth_place: string | null;
  weight: string | null;
  height: string | null;
  photo_url: string | null;
  matches_played: number;
  points: number;
  rebounds: number;
  assists: number;
  minutes_played: number;
  valuation: number;
  ppg: number;
  rpg: number;
  apg: number;
  competition_stats: PlayerCompetitionMap;
}

export const RMB_OFFICIAL_STATS: Record<string, RmbOfficialPlayerRecord> = ${JSON.stringify(statsByLegacy, null, 2)} as Record<string, RmbOfficialPlayerRecord>;

export function getOfficialStatsByLegacyId(legacyId: string): RmbOfficialPlayerRecord | null {
  return RMB_OFFICIAL_STATS[legacyId] ?? null;
}

export function getOfficialStatsByPlayerId(playerId: string): RmbOfficialPlayerRecord | null {
  if (RMB_OFFICIAL_STATS[playerId]) return RMB_OFFICIAL_STATS[playerId];
  const match = playerId.match(/^00000000-0000-4000-8000-0*(\\d+)$/i);
  if (!match) return null;
  return RMB_OFFICIAL_STATS[\`p\${Number(match[1])}\`] ?? null;
}
`;

writeFileSync('src/data/rmb-official-stats.ts', statsTs, 'utf8');

console.log(
  `Written ${players.length} players + ${staff.length} staff → src/data/rmb-official-roster.ts`
);
console.log(`Written stats for ${Object.keys(statsByLegacy).length} players → src/data/rmb-official-stats.ts`);
