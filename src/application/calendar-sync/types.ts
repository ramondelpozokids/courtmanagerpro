import type { MatchHomeAway, MatchResult, MatchStatus, SyncTrigger } from '@/types';
import { getClubPack, getClubSlugByTeamId } from '@/data/clubs';
import { CLUB_TEAM_IDS } from '@/lib/club-team-ids';
import { ATLETICO_CALENDAR_PAGE_URL } from '@/application/roster-sync/sources/types';

export type CalendarSport = 'basketball' | 'football';

export const BASKETBALL_FIRST_TEAM_TAG =
  'realmadrid-com:sports/baloncesto/primer-equipo-masculino';

export const FOOTBALL_FIRST_TEAM_TAG =
  'realmadrid-com:sports/futbol/primer-equipo-masculino';

export const BASKETBALL_CALENDAR_PAGE_URL =
  'https://www.realmadrid.com/es-ES/calendario?filter-football=&filter-basketball=realmadrid-com:sports/baloncesto/primer-equipo-masculino';

export const FOOTBALL_CALENDAR_PAGE_URL =
  'https://www.realmadrid.com/es-ES/calendario?filter-football=realmadrid-com:sports%2Ffutbol%2Fprimer-equipo-masculino&filter-basketball=';

/**
 * Enlace web oficial RMF (fútbol). La web de RM a veces salta a baloncesto;
 * este filtro fuerza primer equipo masculino de fútbol (mes en curso / siguiente vía sync).
 */
export function footballOfficialCalendarPageUrl(): string {
  return FOOTBALL_CALENDAR_PAGE_URL;
}

/** @deprecated Use getOfficialCalendarMeta(sport).pageUrl */
export const OFFICIAL_CALENDAR_PAGE_URL = BASKETBALL_CALENDAR_PAGE_URL;

export const OFFICIAL_CALENDAR_SOURCE_ID = 'real_madrid_official_calendar';
export const OFFICIAL_CALENDAR_SOURCE_LABEL = 'Real Madrid — Primer Equipo Baloncesto';

export const FOOTBALL_CALENDAR_SOURCE_ID = 'real_madrid_official_football_calendar';
export const FOOTBALL_CALENDAR_SOURCE_LABEL = 'Real Madrid — Primer Equipo Fútbol';

export function getOfficialCalendarMeta(sport: CalendarSport) {
  if (sport === 'football') {
    return {
      sport,
      tag: FOOTBALL_FIRST_TEAM_TAG,
      pageUrl: FOOTBALL_CALENDAR_PAGE_URL,
      sourceId: FOOTBALL_CALENDAR_SOURCE_ID,
      sourceLabel: FOOTBALL_CALENDAR_SOURCE_LABEL,
    } as const;
  }
  return {
    sport,
    tag: BASKETBALL_FIRST_TEAM_TAG,
    pageUrl: BASKETBALL_CALENDAR_PAGE_URL,
    sourceId: OFFICIAL_CALENDAR_SOURCE_ID,
    sourceLabel: OFFICIAL_CALENDAR_SOURCE_LABEL,
  } as const;
}

export function getOfficialCalendarMetaForTeam(teamId: string) {
  // ATM — fútbol (Atlético) — NUNCA realmadrid.com
  if (teamId === CLUB_TEAM_IDS.atm) {
    return {
      sport: 'football' as const,
      tag: 'atletico-madrid:primer-equipo',
      pageUrl: ATLETICO_CALENDAR_PAGE_URL,
      sourceId: 'atletico_madrid_official_calendar',
      sourceLabel: 'Atlético de Madrid — Primer Equipo',
    } as const;
  }
  // RMF — fútbol Real Madrid (enlace con filtro fútbol; no baloncesto)
  if (teamId === CLUB_TEAM_IDS.rmf) {
    return {
      ...getOfficialCalendarMeta('football'),
      pageUrl: footballOfficialCalendarPageUrl(),
    } as const;
  }
  // RMB — baloncesto Real Madrid
  if (teamId === CLUB_TEAM_IDS.rmb) {
    return getOfficialCalendarMeta('basketball');
  }
  return getOfficialCalendarMeta(calendarSportForTeamId(teamId));
}

export function calendarSportForTeamId(teamId: string): CalendarSport {
  const slug = getClubSlugByTeamId(teamId);
  if (!slug) return 'basketball';
  return getClubPack(slug).branding.sport === 'football' ? 'football' : 'basketball';
}

export interface OfficialFixture {
  official_id: string | null;
  official_slug: string;
  match_datetime: string;
  match_date: string;
  match_time: string | null;
  rival: string;
  home_away: MatchHomeAway;
  competition: string;
  competition_slug: string | null;
  jornada: string | null;
  venue: string | null;
  city: string | null;
  country: string | null;
  status: MatchStatus;
  score_home: number | null;
  score_away: number | null;
  score_text: string | null;
  partial_score: string | null;
  result: MatchResult | null;
  official_url: string;
}

export interface OfficialCalendarSnapshot {
  source_id: string;
  source_url: string;
  source_label: string;
  fetched_at: string;
  fixtures: OfficialFixture[];
}

export interface DbMatchRow {
  id: string;
  team_id: string;
  official_slug: string;
  match_date: string;
  match_time: string | null;
  match_datetime: string | null;
  rival: string;
  home_away: string;
  competition: string;
  jornada: string | null;
  venue: string | null;
  city: string | null;
  country: string | null;
  status: string;
  score_home: number | null;
  score_away: number | null;
  score_text: string | null;
  result: string | null;
  is_active: boolean;
}

export type MatchDiffChangeType =
  | 'nuevo'
  | 'fecha'
  | 'hora'
  | 'rival'
  | 'pabellon'
  | 'competicion'
  | 'jornada'
  | 'estado'
  | 'resultado'
  | 'marcador'
  | 'baja';

export interface MatchDiffChange {
  change_type: MatchDiffChangeType;
  match_id: string | null;
  entity_name: string;
  old_value: string | null;
  new_value: string | null;
  slug: string;
  fixture?: OfficialFixture;
}

export interface MatchDiff {
  changes: MatchDiffChange[];
  matches_added: number;
  matches_updated: number;
  matches_removed: number;
  results_updated: number;
}

export interface RunCalendarSyncOptions {
  teamId: string;
  trigger: SyncTrigger;
  force?: boolean;
  skipIfRecentHours?: number;
}

export interface RunCalendarSyncResult {
  skipped: boolean;
  status: 'ok' | 'partial' | 'error' | 'offline_cache' | 'skipped';
  syncLogId: string | null;
  durationMs: number;
  changesCount: number;
  matchesAdded: number;
  matchesUpdated: number;
  matchesRemoved: number;
  resultsUpdated: number;
  errorMessage: string | null;
  sourceUrl: string;
  fetchedAt: string | null;
  usedCache: boolean;
}
