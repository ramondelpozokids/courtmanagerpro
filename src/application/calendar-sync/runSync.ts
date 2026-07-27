import type { SupabaseClient } from '@supabase/supabase-js';
import { applyMatchDiff, createCalendarAlerts } from './applyDiff';
import { computeMatchDiff } from './diffEngine';
import {
  applyDemoCalendarSync,
  getDemoMatchSyncStatus,
} from './demoStore';
import { fetchOfficialCalendarForTeam } from './source';
import {
  calendarSportForTeamId,
  getOfficialCalendarMeta,
  getOfficialCalendarMetaForTeam,
  type DbMatchRow,
  type OfficialCalendarSnapshot,
  type RunCalendarSyncOptions,
  type RunCalendarSyncResult,
} from './types';
import { isDemoMode } from '@/lib/app-mode';

const DEFAULT_SKIP_HOURS = 11;

function emptyResult(
  partial: Partial<RunCalendarSyncResult> & Pick<RunCalendarSyncResult, 'status' | 'durationMs'>,
  sourceUrl?: string
): RunCalendarSyncResult {
  return {
    skipped: false,
    syncLogId: null,
    changesCount: 0,
    matchesAdded: 0,
    matchesUpdated: 0,
    matchesRemoved: 0,
    resultsUpdated: 0,
    errorMessage: null,
    sourceUrl: sourceUrl || getOfficialCalendarMeta('basketball').pageUrl,
    fetchedAt: null,
    usedCache: false,
    ...partial,
  };
}

export async function getCalendarSyncStatus(supabase: SupabaseClient | null, teamId: string) {
  const meta = getOfficialCalendarMetaForTeam(teamId);
  if (!supabase || isDemoMode()) {
    const demo = getDemoMatchSyncStatus(teamId);
    return {
      ...demo,
      source: demo.sourceLabel,
    };
  }

  const { data: last } = await supabase
    .from('match_sync_log')
    .select('*')
    .eq('team_id', teamId)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    lastSync: last,
    sourceLabel: meta.sourceLabel,
    source: meta.sourceLabel,
    syncedOk: !last || ['ok', 'offline_cache', 'skipped'].includes(last.status),
    usedCache: last?.status === 'offline_cache',
    lastUpdatedAt: last?.finished_at || last?.started_at || null,
    changesCount: Number(last?.changes_count || 0),
  };
}

export async function runCalendarSync(params: {
  supabase: SupabaseClient | null;
  options: RunCalendarSyncOptions;
}): Promise<RunCalendarSyncResult> {
  const started = Date.now();
  const startedAt = new Date().toISOString();
  const { options } = params;
  const skipHours = options.skipIfRecentHours ?? DEFAULT_SKIP_HOURS;
  const meta = getOfficialCalendarMeta(calendarSportForTeamId(options.teamId));

  if (!params.supabase || isDemoMode()) {
    return applyDemoCalendarSync(options);
  }

  const supabase = params.supabase;

  if (!options.force && options.trigger === 'startup') {
    const { data: last } = await supabase
      .from('match_sync_log')
      .select('started_at, status')
      .eq('team_id', options.teamId)
      .in('status', ['ok', 'offline_cache', 'skipped'])
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (last?.started_at) {
      const ageH = (Date.now() - new Date(last.started_at).getTime()) / 3_600_000;
      if (ageH < skipHours) {
        const { data } = await supabase
          .from('match_sync_log')
          .insert({
            team_id: options.teamId,
            started_at: startedAt,
            finished_at: new Date().toISOString(),
            duration_ms: Date.now() - started,
            status: 'skipped',
            trigger: options.trigger,
            source_url: meta.pageUrl,
            metadata: { reason: 'recent_sync', ageHours: ageH },
          })
          .select('id')
          .single();
        return emptyResult(
          {
            skipped: true,
            status: 'skipped',
            syncLogId: data?.id || null,
            durationMs: Date.now() - started,
            fetchedAt: last.started_at,
          },
          meta.pageUrl
        );
      }
    }
  }

  const { data: logRow } = await supabase
    .from('match_sync_log')
    .insert({
      team_id: options.teamId,
      started_at: startedAt,
      status: 'ok',
      trigger: options.trigger,
      source_url: meta.pageUrl,
    })
    .select('id')
    .single();

  const syncLogId = logRow?.id as string | undefined;

  let snapshot: OfficialCalendarSnapshot | null = null;
  let usedCache = false;
  let fetchError: string | null = null;

  try {
    snapshot = await fetchOfficialCalendarForTeam(options.teamId);
  } catch (err) {
    fetchError = err instanceof Error ? err.message : String(err);
    console.error('[calendar-sync] fetch failed:', fetchError);
    const { data: cache } = await supabase
      .from('match_sync_cache')
      .select('payload, fetched_at')
      .eq('team_id', options.teamId)
      .maybeSingle();
    if (cache?.payload) {
      snapshot = cache.payload as OfficialCalendarSnapshot;
      usedCache = true;
    }
  }

  if (!snapshot || snapshot.fixtures.length === 0) {
    const durationMs = Date.now() - started;
    if (syncLogId) {
      await supabase
        .from('match_sync_log')
        .update({
          finished_at: new Date().toISOString(),
          duration_ms: durationMs,
          status: 'error',
          error_message: fetchError || 'Calendario vacío',
        })
        .eq('id', syncLogId);
    }
    return emptyResult(
      {
        status: 'error',
        syncLogId: syncLogId || null,
        durationMs,
        errorMessage: fetchError || 'Calendario vacío',
      },
      meta.pageUrl
    );
  }

  try {
    const { data: rows } = await supabase
      .from('official_matches')
      .select(
        'id, team_id, official_slug, match_date, match_time, match_datetime, rival, home_away, competition, jornada, venue, city, country, status, score_home, score_away, score_text, result, is_active'
      )
      .eq('team_id', options.teamId);

    const diff = computeMatchDiff(snapshot, (rows || []) as DbMatchRow[]);

    await applyMatchDiff({
      supabase,
      teamId: options.teamId,
      diff,
      snapshot,
      syncLogId: syncLogId || null,
    });
    await createCalendarAlerts({ supabase, teamId: options.teamId, diff });

    const durationMs = Date.now() - started;
    const status = usedCache ? 'offline_cache' : fetchError ? 'partial' : 'ok';

    if (syncLogId) {
      await supabase
        .from('match_sync_log')
        .update({
          finished_at: new Date().toISOString(),
          duration_ms: durationMs,
          status,
          matches_added: diff.matches_added,
          matches_updated: diff.matches_updated,
          matches_removed: diff.matches_removed,
          results_updated: diff.results_updated,
          changes_count: diff.changes.length,
          error_message: fetchError,
          source_url: snapshot.source_url,
        })
        .eq('id', syncLogId);
    }

    console.info(
      `[calendar-sync] done status=${status} changes=${diff.changes.length} duration=${durationMs}ms`
    );

    return {
      skipped: false,
      status,
      syncLogId: syncLogId || null,
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
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const durationMs = Date.now() - started;
    if (syncLogId) {
      await supabase
        .from('match_sync_log')
        .update({
          finished_at: new Date().toISOString(),
          duration_ms: durationMs,
          status: 'error',
          error_message: msg,
        })
        .eq('id', syncLogId);
    }
    return emptyResult(
      {
        status: 'error',
        syncLogId: syncLogId || null,
        durationMs,
        errorMessage: msg,
        usedCache,
        fetchedAt: snapshot.fetched_at,
      },
      meta.pageUrl
    );
  }
}
