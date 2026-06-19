/**
 * Sincroniza estadísticas oficiales desde realmadrid.com (ng-state SSR).
 * Uso: node scripts/sync-rm-roster-stats.mjs
 */

import { writeFileSync, mkdirSync } from 'fs';

const PLAYERS = [
  { legacyId: 'p1', slug: 'facundo-campazzo' },
  { legacyId: 'p2', slug: 'walter-samuel-tavares-da-veiga' },
  { legacyId: 'p3', slug: 'mario-hezonja' },
  { legacyId: 'p4', slug: 'gabriel-deck' },
  { legacyId: 'p5', slug: 'theo-maledon' },
  { legacyId: 'p6', slug: 'sergio-llull-melia' },
  { legacyId: 'p7', slug: 'usman-garuba' },
  { legacyId: 'p8', slug: 'andres-feliz' },
  { legacyId: 'p9', slug: 'david-kramer' },
  { legacyId: 'p10', slug: 'alberto-abalde-diaz' },
  { legacyId: 'p11', slug: 'gabriele-procida' },
  { legacyId: 'p12', slug: 'trey-lyles' },
  { legacyId: 'p13', slug: 'chukwuma-julian-okeke' },
  { legacyId: 'p14', slug: 'izan-almansa' },
  { legacyId: 'p15', slug: 'mady-sissoko' },
  { legacyId: 'p16', slug: 'alex-len' },
  { legacyId: 'p17', slug: 'omer-yurtseven' },
];

const SLUG_TO_ID = {
  'liga-endesa': 'liga_endesa',
  euroliga: 'euroliga',
  'supercopa-endesa': 'supercopa_endesa',
  'copa-del-rey': 'copa_del_rey',
};

const SEASON = '2025-2026';

function num(v) {
  if (v == null || v === '') return 0;
  const n = Number(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

function extractNgState(html) {
  const match = html.match(/<script id="ng-state" type="application\/json">([\s\S]*?)<\/script>/);
  if (!match) return null;
  return JSON.parse(match[1]);
}

function findPlayerPayload(state) {
  for (const value of Object.values(state || {})) {
    const items = value?.b?.data?.playerList?.items;
    if (Array.isArray(items) && items[0]) return items[0];
  }
  return null;
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

async function fetchPlayer(slug) {
  const url = `https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/${slug}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept-Language': 'es-ES,es;q=0.9',
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${slug}`);
  return res.text();
}

const output = {};

for (const player of PLAYERS) {
  try {
    const html = await fetchPlayer(player.slug);
    const state = extractNgState(html);
    const payload = findPlayerPayload(state);
    if (!payload) throw new Error('player payload not found');

    const seasonStats =
      payload.statistics?.find((s) => s.season === SEASON) || payload.statistics?.[0];

    const globalStats = mapGlobal(seasonStats?.aggregatedStatistic);
    const competition_stats = mapCompetitionStats(seasonStats?.competitionStatistics);

    output[player.legacyId] = {
      slug: player.slug,
      profile_url: `https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/${player.slug}`,
      full_name: `${payload.name} ${payload.surnames}`.trim(),
      dorsal: num(payload.number),
      position: payload.position,
      nationality: payload.nationality,
      birth_date: payload.birthDate,
      birth_place: payload.birthPlace,
      weight: payload.weight,
      height: payload.height,
      photo_url: payload.squadImage?._dmS7Url || payload.image?._dmS7Url || null,
      ...globalStats,
      competition_stats,
    };

    console.log(`OK ${player.legacyId} ${output[player.legacyId].full_name}`);
  } catch (err) {
    console.error(`FAIL ${player.legacyId} ${player.slug}:`, err.message);
  }
}

const ts = `// Auto-generated from realmadrid.com — ${new Date().toISOString()}
// Regenerar: node scripts/sync-rm-roster-stats.mjs

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

export const RMB_OFFICIAL_STATS: Record<string, RmbOfficialPlayerRecord> = ${JSON.stringify(output, null, 2)} as Record<string, RmbOfficialPlayerRecord>;

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

mkdirSync('src/data', { recursive: true });
writeFileSync('src/data/rmb-official-stats.ts', ts, 'utf8');
console.log(`Written ${Object.keys(output).length} players to src/data/rmb-official-stats.ts`);
