import {
  BASKETBALL_FIRST_TEAM_TAG,
  OFFICIAL_CALENDAR_PAGE_URL,
  OFFICIAL_CALENDAR_SOURCE_ID,
  OFFICIAL_CALENDAR_SOURCE_LABEL,
  type OfficialCalendarSnapshot,
} from './types';
import { mapDiaryItemToFixture, isBasketballFirstTeamFixture } from './parser';

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept: 'application/json,text/html',
  'Accept-Language': 'es-ES,es;q=0.9',
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

function diaryUrl(fromIso: string, toIso: string): string {
  const filterSquad = `{"tag":{"_expressions":[{"_operator":"CONTAINS","value":"${BASKETBALL_FIRST_TEAM_TAG}"}],"_logOp":"OR"}}`;
  const alang = '/content/dam/portals/realmadrid-com/es-es/sports/';
  return (
    'https://publish.realmadrid.com/graphql/execute.json/realmadridmastersite/' +
    `diaryV2%3BfromDate=${encodeURIComponent(fromIso)}%3BtoDate=${encodeURIComponent(toIso)}%3Balang=${alang}%3BfilterSquad=${filterSquad}`
  );
}

function seasonWindow(): { from: string; to: string } {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth(); // 0-11
  // Temporada ACB ~ jul/ago Y → jun/jul Y+1. Desde julio ya apuntamos a Y/(Y+1).
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

export async function fetchOfficialBasketballCalendar(): Promise<OfficialCalendarSnapshot> {
  const { from, to } = extendedWindow();
  const url = diaryUrl(from, to);
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
    .map((item) => mapDiaryItemToFixture(item))
    .filter((f): f is NonNullable<typeof f> => Boolean(f))
    .filter((f) => isBasketballFirstTeamFixture(f));

  // Deduplicate by slug
  const bySlug = new Map(fixtures.map((f) => [f.official_slug, f]));
  const unique = [...bySlug.values()].sort((a, b) =>
    a.match_datetime < b.match_datetime ? -1 : 1
  );

  if (unique.length === 0) {
    throw new Error('Calendario oficial de baloncesto vacío o no parseable');
  }

  return {
    source_id: OFFICIAL_CALENDAR_SOURCE_ID,
    source_url: OFFICIAL_CALENDAR_PAGE_URL,
    source_label: OFFICIAL_CALENDAR_SOURCE_LABEL,
    fetched_at: new Date().toISOString(),
    fixtures: unique,
  };
}
