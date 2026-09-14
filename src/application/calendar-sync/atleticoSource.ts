/**
 * Calendario oficial Atlético de Madrid
 * Fuente: https://www.atleticodemadrid.com/calendario-completo-primer-equipo/
 */
import type { OfficialCalendarSnapshot, OfficialFixture } from './types';
import { ATLETICO_CALENDAR_PAGE_URL } from '@/application/roster-sync/sources/types';

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept-Language': 'es-ES,es;q=0.9',
  Accept: 'text/html,application/xhtml+xml',
  Referer: 'https://www.atleticodemadrid.com/',
};

const MONTHS: Record<string, number> = {
  enero: 1,
  febrero: 2,
  marzo: 3,
  abril: 4,
  mayo: 5,
  junio: 6,
  julio: 7,
  agosto: 8,
  septiembre: 9,
  octubre: 10,
  noviembre: 11,
  diciembre: 12,
};

function decode(s: string): string {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseSpanishDate(fragment: string, yearHint: number): { date: string; time: string | null } | null {
  const range = fragment.match(
    /(\d{1,2})\s+o\s+(?:domingo\s+)?(\d{1,2})\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i
  );
  if (range) {
    const day = Number(range[1]);
    const month = MONTHS[range[3].toLowerCase()];
    if (!month) return null;
    let year = yearHint;
    if (month <= 6) year = yearHint + 1;
    const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return { date, time: null };
  }
  const m = fragment.match(
    /(\d{1,2})\s+(?:de\s+)?(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)(?:\s*-\s*(\d{1,2}:\d{2}))?/i
  );
  if (!m) return null;
  const day = Number(m[1]);
  const month = MONTHS[m[2].toLowerCase()];
  if (!month) return null;
  let year = yearHint;
  if (month <= 6) year = yearHint + 1;
  const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return { date, time: m[3] || null };
}

function isAtleti(name: string): boolean {
  return /atl[eé]tico/i.test(name);
}

function parseFixturesFromHtml(html: string): OfficialFixture[] {
  const blocks = html.split(/class="header-calendar/);
  const fixtures: OfficialFixture[] = [];
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];
    const local = decode((block.match(/<li class="local">[\s\S]*?<dt>([^<]+)<\/dt>/i) || [])[1] || '');
    const visitante = decode((block.match(/<li class="visitante">[\s\S]*?<dt>([^<]+)<\/dt>/i) || [])[1] || '');
    if (!local || !visitante) continue;
    const home = isAtleti(local);
    const rival = home ? visitante : local;
    const info = decode((block.match(/class="info-calendario"[\s\S]*?<\/div>/i) || [])[0] || '');
    const parsed = parseSpanishDate(info, 2026);
    if (!parsed) continue;
    const timeMatch = info.match(/(\d{1,2}:\d{2})/);
    const time = timeMatch ? timeMatch[1] : parsed.time;
    const venueMatch = info.match(
      /(Riyadh Air Metropolitano|Anfield|Estadio[^-\n]{2,60}|Mendizorroza|Strawberry Arena|Seoul World Cup Stadium|CEPAC Vélodrome|MHPArena|Philips Stadion|Aspmyra Stadion|Camp Nou|El Sadar|La Rosaleda|El Sardinero|Mestalla|RCDE Stadium)/i
    );
    const venue = venueMatch ? venueMatch[1].replace(/<i>.*$/, '').trim() : '';
    let competition = 'LaLiga';
    if (/Amistoso/i.test(info) || /competicion-amis/i.test(block)) competition = 'Amistoso';
    else if (/Copa del Rey|competicion-copa/i.test(info + block)) competition = 'Copa del Rey';
    else if (/Coupang/i.test(info) || /competicion-coupang/i.test(block)) competition = 'Coupang Play Series';
    else if (/Champions|UEFA|jornada 1[\s\S]{0,80}Anfield|MHPArena|Philips|Aspmyra|Bayern|Liverpool|Stuttgart|Fenerbah|Bodo|PSV|Manchester Utd/i.test(block + info + rival)) {
      if (/Anfield|MHPArena|Philips|Aspmyra|Bayern|Liverpool|Stuttgart|Fenerbah|Bodo|PSV|Manchester Utd|Viking/i.test(block + rival + venue)) {
        competition = 'UEFA Champions League';
      }
    }
    if (/competicion-ucl|champions/i.test(block)) competition = 'UEFA Champions League';
    const jornadaMatch = info.match(/Jornada\s+(\d+)/i);
    const jornada = jornadaMatch ? jornadaMatch[1] : undefined;
    const scoreLocal = (block.match(/<li class="local">[\s\S]*?class="marcador">(\d+)</i) || [])[1];
    const scoreVisit = (block.match(/<li class="visitante">[\s\S]*?class="marcador">(\d+)</i) || [])[1];
    const played = scoreLocal != null && scoreVisit != null;
    const timeNorm = time || '00:00';
    const match_datetime = `${parsed.date}T${timeNorm.length === 5 ? timeNorm + ':00' : timeNorm}.000Z`;
    const slug = `atm-${parsed.date}-${rival.toLowerCase().replace(/\s+/g, '-')}`;
    fixtures.push({
      official_id: `atm-${i}`,
      official_slug: slug,
      match_datetime,
      match_date: parsed.date,
      match_time: time,
      rival,
      home_away: home ? 'local' : 'visitante',
      competition,
      competition_slug: competition.toLowerCase().replace(/\s+/g, '-'),
      jornada: jornada || null,
      venue,
      city: null,
      country: 'España',
      status: played ? 'finalizado' : 'pendiente',
      score_home: played ? Number(scoreLocal) : null,
      score_away: played ? Number(scoreVisit) : null,
      score_text: played ? `${scoreLocal}-${scoreVisit}` : null,
      partial_score: null,
      result: null,
      official_url: ATLETICO_CALENDAR_PAGE_URL,
    });
  }
  return fixtures;
}

function todayIsoLocal(): string {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`;
}

/** Amistosos / Coupang ya jugados (julio-agosto) no deben ocupar el calendario actual. */
export function isPastAtleticoFriendly(m: {
  match_date?: string | null;
  competition?: string | null;
}): boolean {
  const preseason = /amistoso|coupang/i.test(m.competition || '');
  const date = String(m.match_date || '').slice(0, 10);
  if (!preseason || !date) return false;
  return date < todayIsoLocal();
}

/** Seed mínimo alineado con calendario oficial 26/27 (si el scrape falla). */
function seedFixtures(): OfficialFixture[] {
  const rows: Array<{
    rival: string;
    home: boolean;
    date: string;
    time: string | null;
    competition: string;
    venue: string;
    jornada?: string;
  }> = [
    {
      rival: 'Osasuna',
      home: true,
      date: '2026-09-16',
      time: '19:00',
      competition: 'LaLiga',
      venue: 'Riyadh Air Metropolitano',
      jornada: '6',
    },
    {
      rival: 'Real Madrid',
      home: true,
      date: '2026-09-20',
      time: '16:15',
      competition: 'LaLiga',
      venue: 'Riyadh Air Metropolitano',
      jornada: '7',
    },
    {
      rival: 'Alavés',
      home: false,
      date: '2026-10-10',
      time: '16:15',
      competition: 'LaLiga',
      venue: 'Estadio de Mendizorroza',
      jornada: '8',
    },
    {
      rival: 'Manchester Utd',
      home: true,
      date: '2026-10-13',
      time: '21:00',
      competition: 'UEFA Champions League',
      venue: 'Riyadh Air Metropolitano',
      jornada: '2',
    },
    {
      rival: 'Espanyol',
      home: false,
      date: '2026-10-18',
      time: null,
      competition: 'LaLiga',
      venue: 'RCDE Stadium',
      jornada: '9',
    },
  ];

  return rows.map((r, i) => {
    const time = r.time || '00:00';
    const match_datetime = `${r.date}T${time.length === 5 ? time + ':00' : time}.000Z`;
    const slug = `atm-${r.date}-${r.rival.toLowerCase().replace(/\s+/g, '-')}`;
    return {
      official_id: `atm-${i + 1}`,
      official_slug: slug,
      match_datetime,
      match_date: r.date,
      match_time: r.time,
      rival: r.rival,
      home_away: r.home ? 'local' : 'visitante',
      competition: r.competition,
      competition_slug: r.competition.toLowerCase().replace(/\s+/g, '-'),
      jornada: r.jornada || null,
      venue: r.venue,
      city: null,
      country: 'España',
      status: 'pendiente',
      score_home: null,
      score_away: null,
      score_text: null,
      partial_score: null,
      result: null,
      official_url: ATLETICO_CALENDAR_PAGE_URL,
    } satisfies OfficialFixture;
  });
}

export async function fetchAtleticoOfficialCalendar(): Promise<OfficialCalendarSnapshot> {
  try {
    const res = await fetch(ATLETICO_CALENDAR_PAGE_URL, {
      headers: HEADERS,
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const parsed = parseFixturesFromHtml(html);
    const current = parsed.filter((f) => !isPastAtleticoFriendly(f));
    const fixtures = current.length >= 5 ? current : seedFixtures();
    if (current.length < 5) {
      console.warn(`[calendar-sync] ATM HTML parse ${parsed.length} (${current.length} vigentes) — using seed fixtures`);
    }
    return {
      source_id: 'atletico_madrid_official_calendar',
      source_url: ATLETICO_CALENDAR_PAGE_URL,
      source_label: 'Atlético de Madrid — Primer Equipo',
      fetched_at: new Date().toISOString(),
      fixtures,
    };
  } catch (err) {
    console.warn('[calendar-sync] ATM fetch failed — seed fixtures', err);
    return {
      source_id: 'atletico_madrid_official_calendar',
      source_url: ATLETICO_CALENDAR_PAGE_URL,
      source_label: 'Atlético de Madrid — Primer Equipo',
      fetched_at: new Date().toISOString(),
      fixtures: seedFixtures(),
    };
  }
}
