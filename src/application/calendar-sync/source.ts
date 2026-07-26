import {
  calendarSportForTeamId,
  getOfficialCalendarMeta,
  type CalendarSport,
  type OfficialCalendarSnapshot,
} from './types';
import {
  mapDiaryItemToFixture,
  isBasketballFirstTeamFixture,
  isFootballFirstTeamFixture,
} from './parser';

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
  Accept: 'application/json,text/html',
  'Accept-Language': 'es-ES,es;q=0.9',
  Referer: 'https://www.realmadrid.com/es-ES/calendario',
  Origin: 'https://www.realmadrid.com',
};

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

async function fetchWithRetry(url: string, attempts = 3): Promise<Response> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { headers: HEADERS, next: { revalidate: 0 } as any });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (err) {
      lastError = err;
      console.warn(`[calendar-sync] retry ${i + 1}/${attempts}`, err);
      await sleep(400 * Math.pow(2, i));
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

function diaryUrl(fromIso: string, toIso: string, tag: string): string {
  const filterSquad = `{"tag":{"_expressions":[{"_operator":"CONTAINS","value":"${tag}"}],"_logOp":"OR"}}`;
  const alang = '/content/dam/portals/realmadrid-com/es-es/sports/';
  return (
    'https://publish.realmadrid.com/graphql/execute.json/realmadridmastersite/' +
    `diaryV2%3BfromDate=${encodeURIComponent(fromIso)}%3BtoDate=${encodeURIComponent(toIso)}%3Balang=${alang}%3BfilterSquad=${filterSquad}`
  );
}

function seasonWindow(): { from: string; to: string } {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();
  const startYear = m >= 6 ? y : y - 1;
  return {
    from: `${startYear}-07-01T00:00:00.000Z`,
    to: `${startYear + 1}-07-31T23:59:00.000Z`,
  };
}

/** Ventana amplia: temporada anterior (resultados) + nueva (amistosos/liga cuando existan). */
function extendedWindow(): { from: string; to: string } {
  const { from } = seasonWindow();
  const startYear = Number(from.slice(0, 4));
  return {
    from: `${startYear - 1}-08-01T00:00:00.000Z`,
    to: `${startYear + 1}-12-31T23:59:00.000Z`,
  };
}

export async function fetchOfficialCalendar(
  sport: CalendarSport = 'basketball'
): Promise<OfficialCalendarSnapshot> {
  const meta = getOfficialCalendarMeta(sport);
  const { from, to } = extendedWindow();
  const url = diaryUrl(from, to, meta.tag);
  const res = await fetchWithRetry(url);
  const json = (await res.json()) as {
    data?: { matchList?: { items?: Array<Record<string, unknown>> } };
    errors?: Array<{ message?: string }>;
  };

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).filter(Boolean).join('; ') || 'GraphQL error');
  }

  const items = json.data?.matchList?.items || [];
  const fixtures = items
    .map((item) => mapDiaryItemToFixture(item, sport))
    .filter((f): f is NonNullable<typeof f> => Boolean(f))
    .filter((f) =>
      sport === 'football' ? isFootballFirstTeamFixture(f) : isBasketballFirstTeamFixture(f)
    );

  const bySlug = new Map(fixtures.map((f) => [f.official_slug, f]));
  const unique = [...bySlug.values()].sort((a, b) =>
    a.match_datetime < b.match_datetime ? -1 : 1
  );

  if (unique.length === 0) {
    throw new Error(
      sport === 'football'
        ? 'Calendario oficial de fútbol vacío o no parseable'
        : 'Calendario oficial de baloncesto vacío o no parseable'
    );
  }

  return {
    source_id: meta.sourceId,
    source_url: meta.pageUrl,
    source_label: meta.sourceLabel,
    fetched_at: new Date().toISOString(),
    fixtures: unique,
  };
}

export async function fetchOfficialBasketballCalendar(): Promise<OfficialCalendarSnapshot> {
  return fetchOfficialCalendar('basketball');
}

export async function fetchOfficialFootballCalendar(): Promise<OfficialCalendarSnapshot> {
  return fetchOfficialCalendar('football');
}

export async function fetchOfficialCalendarForTeam(
  teamId: string
): Promise<OfficialCalendarSnapshot> {
  return fetchOfficialCalendar(calendarSportForTeamId(teamId));
}
