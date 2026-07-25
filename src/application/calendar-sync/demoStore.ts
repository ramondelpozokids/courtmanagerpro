import type { OfficialMatch } from '@/types';
import { computeMatchDiff } from './diffEngine';
import { fetchOfficialBasketballCalendar } from './source';
import {
  OFFICIAL_CALENDAR_PAGE_URL,
  OFFICIAL_CALENDAR_SOURCE_LABEL,
  type MatchDiff,
  type OfficialCalendarSnapshot,
  type OfficialFixture,
  type RunCalendarSyncOptions,
  type RunCalendarSyncResult,
} from './types';
import { db } from '@/infrastructure/supabase/repositories/InMemoryDB';

interface DemoMatchSyncLog {
  id: string;
  team_id: string;
  started_at: string;
  finished_at: string | null;
  duration_ms: number | null;
  status: string;
  matches_added: number;
  matches_updated: number;
  matches_removed: number;
  results_updated: number;
  changes_count: number;
  error_message: string | null;
  source_url: string | null;
  trigger: string;
  created_at: string;
}

interface DemoHistory {
  id: string;
  team_id: string;
  match_id: string | null;
  changed_at: string;
  change_type: string;
  entity_name: string;
  old_value: string | null;
  new_value: string | null;
  source: string;
  sync_log_id: string | null;
  created_at: string;
}

const logs: DemoMatchSyncLog[] = [];
const history: DemoHistory[] = [];
const cacheByTeam = new Map<string, OfficialCalendarSnapshot>();

declare global {
  // eslint-disable-next-line no-var
  var __cmOfficialMatches: OfficialMatch[] | undefined;
}

function uuid(): string {
  return `mcal-${Date.now().toString(16)}-${Math.random().toString(36).slice(2, 7)}`;
}

function ensureStore(): OfficialMatch[] {
  if (!globalThis.__cmOfficialMatches) globalThis.__cmOfficialMatches = [];
  return globalThis.__cmOfficialMatches;
}

export function getDemoOfficialMatches(teamId: string): OfficialMatch[] {
  return ensureStore().filter((m) => m.team_id === teamId && m.is_active !== false);
}

export function getDemoMatchHistory(teamId: string, limit = 50) {
  return history
    .filter((h) => h.team_id === teamId)
    .sort((a, b) => (a.changed_at < b.changed_at ? 1 : -1))
    .slice(0, limit);
}

export function getDemoMatchSyncStatus(teamId: string) {
  const last = [...logs]
    .filter((l) => l.team_id === teamId)
    .sort((a, b) => (a.started_at < b.started_at ? 1 : -1))[0];
  return {
    lastSync: last || null,
    sourceLabel: OFFICIAL_CALENDAR_SOURCE_LABEL,
    syncedOk: !last || ['ok', 'offline_cache', 'skipped'].includes(last.status),
    usedCache: last?.status === 'offline_cache',
    lastUpdatedAt: last?.finished_at || last?.started_at || null,
    changesCount: last?.changes_count || 0,
  };
}

function fixtureToMatch(teamId: string, f: OfficialFixture, id?: string): OfficialMatch {
  const now = new Date().toISOString();
  return {
    id: id || uuid(),
    team_id: teamId,
    official_id: f.official_id,
    official_slug: f.official_slug,
    match_date: f.match_date,
    match_time: f.match_time,
    match_datetime: f.match_datetime,
    rival: f.rival,
    home_away: f.home_away,
    competition: f.competition,
    competition_slug: f.competition_slug,
    jornada: f.jornada,
    venue: f.venue,
    city: f.city,
    country: f.country,
    status: f.status,
    score_home: f.score_home,
    score_away: f.score_away,
    score_text: f.score_text,
    partial_score: f.partial_score,
    result: f.result,
    official_url: f.official_url,
    source: 'realmadrid.com',
    last_synced_at: now,
    is_active: true,
    created_at: now,
    updated_at: now,
  };
}

function pushDemoAlerts(teamId: string, changes: MatchDiff['changes']) {
  for (const c of changes.slice(0, 20)) {
    let type = 'calendario_cambio';
    if (c.change_type === 'nuevo') type = 'calendario_nuevo';
    if (c.change_type === 'resultado' || c.change_type === 'marcador') type = 'calendario_resultado';
    db.alerts.unshift({
      id: `a-cal-${Math.random().toString(36).slice(2, 8)}`,
      team_id: teamId,
      type,
      severity: 'info',
      title:
        c.change_type === 'nuevo'
          ? 'Nuevo partido oficial'
          : c.change_type === 'marcador' || c.change_type === 'resultado'
            ? 'Resultado oficial publicado'
            : 'Cambio en calendario oficial',
      message: `${c.entity_name}: ${c.old_value || ''} → ${c.new_value || ''}`.trim(),
      entity_type: 'official_match',
      entity_id: c.match_id,
      is_read: false,
      is_dismissed: false,
      auto_generated: true,
      metadata: { change_type: c.change_type, source: 'realmadrid.com' },
      created_at: new Date().toISOString(),
    });
  }
}

export async function applyDemoCalendarSync(
  options: RunCalendarSyncOptions
): Promise<RunCalendarSyncResult> {
  const started = Date.now();
  const startedAt = new Date().toISOString();
  const skipHours = options.skipIfRecentHours ?? 11;

  if (!options.force && options.trigger === 'startup') {
    const status = getDemoMatchSyncStatus(options.teamId);
    if (status.lastUpdatedAt) {
      const ageH = (Date.now() - new Date(status.lastUpdatedAt).getTime()) / 3_600_000;
      if (ageH < skipHours) {
        const syncLogId = uuid();
        logs.push({
          id: syncLogId,
          team_id: options.teamId,
          started_at: startedAt,
          finished_at: new Date().toISOString(),
          duration_ms: Date.now() - started,
          status: 'skipped',
          matches_added: 0,
          matches_updated: 0,
          matches_removed: 0,
          results_updated: 0,
          changes_count: 0,
          error_message: null,
          source_url: OFFICIAL_CALENDAR_PAGE_URL,
          trigger: options.trigger,
          created_at: startedAt,
        });
        return {
          skipped: true,
          status: 'skipped',
          syncLogId,
          durationMs: Date.now() - started,
          changesCount: 0,
          matchesAdded: 0,
          matchesUpdated: 0,
          matchesRemoved: 0,
          resultsUpdated: 0,
          errorMessage: null,
          sourceUrl: OFFICIAL_CALENDAR_PAGE_URL,
          fetchedAt: status.lastUpdatedAt,
          usedCache: false,
        };
      }
    }
  }

  let snapshot: OfficialCalendarSnapshot | null = null;
  let usedCache = false;
  let fetchError: string | null = null;

  try {
    snapshot = await fetchOfficialBasketballCalendar();
  } catch (err) {
    fetchError = err instanceof Error ? err.message : String(err);
    snapshot = cacheByTeam.get(options.teamId) || null;
    usedCache = Boolean(snapshot);
  }

  if (!snapshot || snapshot.fixtures.length === 0) {
    const durationMs = Date.now() - started;
    const syncLogId = uuid();
    logs.push({
      id: syncLogId,
      team_id: options.teamId,
      started_at: startedAt,
      finished_at: new Date().toISOString(),
      duration_ms: durationMs,
      status: 'error',
      matches_added: 0,
      matches_updated: 0,
      matches_removed: 0,
      results_updated: 0,
      changes_count: 0,
      error_message: fetchError || 'Calendario no disponible',
      source_url: OFFICIAL_CALENDAR_PAGE_URL,
      trigger: options.trigger,
      created_at: startedAt,
    });
    return {
      skipped: false,
      status: 'error',
      syncLogId,
      durationMs,
      changesCount: 0,
      matchesAdded: 0,
      matchesUpdated: 0,
      matchesRemoved: 0,
      resultsUpdated: 0,
      errorMessage: fetchError || 'Calendario no disponible',
      sourceUrl: OFFICIAL_CALENDAR_PAGE_URL,
      fetchedAt: null,
      usedCache: false,
    };
  }

  const store = ensureStore();
  const current = store.filter((m) => m.team_id === options.teamId);
  const diff = computeMatchDiff(
    snapshot,
    current.map((m) => ({
      id: m.id,
      team_id: m.team_id,
      official_slug: m.official_slug,
      match_date: m.match_date,
      match_time: m.match_time,
      match_datetime: m.match_datetime,
      rival: m.rival,
      home_away: m.home_away,
      competition: m.competition,
      jornada: m.jornada,
      venue: m.venue,
      city: m.city,
      country: m.country,
      status: m.status,
      score_home: m.score_home,
      score_away: m.score_away,
      score_text: m.score_text,
      result: m.result,
      is_active: m.is_active,
    }))
  );

  const bySlug = new Map(current.map((m) => [m.official_slug, m]));
  const next: OfficialMatch[] = store.filter((m) => m.team_id !== options.teamId);

  for (const f of snapshot.fixtures) {
    const prev = bySlug.get(f.official_slug);
    next.push(fixtureToMatch(options.teamId, f, prev?.id));
  }
  for (const m of current) {
    if (!snapshot.fixtures.some((f) => f.official_slug === m.official_slug)) {
      next.push({ ...m, is_active: false, updated_at: new Date().toISOString() });
    }
  }
  globalThis.__cmOfficialMatches = next;
  cacheByTeam.set(options.teamId, snapshot);

  const syncLogId = uuid();
  const finished = new Date().toISOString();
  const durationMs = Date.now() - started;
  const status = usedCache ? 'offline_cache' : 'ok';

  logs.push({
    id: syncLogId,
    team_id: options.teamId,
    started_at: startedAt,
    finished_at: finished,
    duration_ms: durationMs,
    status,
    matches_added: diff.matches_added,
    matches_updated: diff.matches_updated,
    matches_removed: diff.matches_removed,
    results_updated: diff.results_updated,
    changes_count: diff.changes.length,
    error_message: fetchError,
    source_url: snapshot.source_url,
    trigger: options.trigger,
    created_at: startedAt,
  });

  for (const c of diff.changes) {
    history.push({
      id: uuid(),
      team_id: options.teamId,
      match_id: c.match_id,
      changed_at: finished,
      change_type: c.change_type,
      entity_name: c.entity_name,
      old_value: c.old_value,
      new_value: c.new_value,
      source: snapshot.source_url,
      sync_log_id: syncLogId,
      created_at: finished,
    });
  }

  if (diff.changes.length > 0) pushDemoAlerts(options.teamId, diff.changes);

  return {
    skipped: false,
    status,
    syncLogId,
    durationMs,
    changesCount: diff.changes.length,
    matchesAdded: diff.matches_added,
    matchesUpdated: diff.matches_updated,
    matchesRemoved: diff.matches_removed,
    resultsUpdated: diff.results_updated,
    errorMessage: fetchError,
    sourceUrl: snapshot.source_url,
    fetchedAt: snapshot.fetched_at,
    usedCache,
  };
}
