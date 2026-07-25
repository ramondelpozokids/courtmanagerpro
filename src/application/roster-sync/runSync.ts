import type { SupabaseClient } from '@supabase/supabase-js';
import { applyRosterDiff } from './applyDiff';
import { computeRosterDiff } from './diffEngine';
import { syncPhotosForSnapshot } from './photoSync';
import { createDefaultRosterSource } from './sources/realMadridOfficial';
import {
  REAL_MADRID_PLANTILLA_URL,
  REAL_MADRID_SOURCE_LABEL,
  type DbPlayerRow,
  type DbStaffRow,
  type OfficialRosterSnapshot,
  type RunSyncOptions,
  type RunSyncResult,
  type RosterSource,
} from './sources/types';
import { applyDemoRosterSync, getDemoSyncStatus, loadDemoCache } from './demoStore';
import { isDemoMode } from '@/lib/app-mode';

const DEFAULT_SKIP_HOURS = 23;

function emptyResult(
  partial: Partial<RunSyncResult> & Pick<RunSyncResult, 'status' | 'durationMs'>
): RunSyncResult {
  return {
    skipped: false,
    syncLogId: null,
    changesCount: 0,
    playersAdded: 0,
    playersRemoved: 0,
    playersUpdated: 0,
    staffAdded: 0,
    staffRemoved: 0,
    staffUpdated: 0,
    errorMessage: null,
    sourceUrl: REAL_MADRID_PLANTILLA_URL,
    fetchedAt: null,
    usedCache: false,
    ...partial,
  };
}

async function loadDbRows(supabase: SupabaseClient, teamId: string) {
  const [{ data: players }, { data: staff }] = await Promise.all([
    supabase
      .from('players')
      .select('id, team_id, dorsal, full_name, position, photo_url, is_active, official_slug, source')
      .eq('team_id', teamId),
    supabase
      .from('coaching_staff')
      .select('id, team_id, full_name, role, photo_url, is_active, official_slug, source')
      .eq('team_id', teamId),
  ]);

  return {
    players: (players || []) as DbPlayerRow[],
    staff: (staff || []) as DbStaffRow[],
  };
}

async function createSyncLog(
  supabase: SupabaseClient,
  teamId: string,
  trigger: RunSyncOptions['trigger'],
  startedAt: string
): Promise<string> {
  const { data, error } = await supabase
    .from('sync_log')
    .insert({
      team_id: teamId,
      started_at: startedAt,
      status: 'ok',
      trigger,
      source_url: REAL_MADRID_PLANTILLA_URL,
    })
    .select('id')
    .single();

  if (error || !data) throw new Error(error?.message || 'No se pudo crear sync_log');
  return data.id as string;
}

async function finishSyncLog(
  supabase: SupabaseClient,
  syncLogId: string,
  fields: Record<string, unknown>
) {
  await supabase.from('sync_log').update(fields).eq('id', syncLogId);
}

export async function getRosterSyncStatus(
  supabase: SupabaseClient | null,
  teamId: string
): Promise<{
  lastSync: Record<string, unknown> | null;
  sourceLabel: string;
  hasPendingChanges: boolean;
  syncedOk: boolean;
  usedCache: boolean;
  lastUpdatedAt: string | null;
}> {
  if (!supabase || isDemoMode()) {
    const demo = getDemoSyncStatus(teamId);
    return {
      lastSync: demo.lastSync as unknown as Record<string, unknown> | null,
      sourceLabel: demo.sourceLabel,
      hasPendingChanges: demo.hasPendingChanges,
      syncedOk: demo.syncedOk,
      usedCache: demo.usedCache,
      lastUpdatedAt: demo.lastUpdatedAt,
    };
  }

  const { data: last } = await supabase
    .from('sync_log')
    .select('*')
    .eq('team_id', teamId)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const status = (last?.status as string) || null;
  const changes = Number(last?.changes_count || 0);

  return {
    lastSync: last,
    sourceLabel: REAL_MADRID_SOURCE_LABEL,
    hasPendingChanges: changes > 0 && status === 'ok',
    syncedOk: status === 'ok' || status === 'offline_cache' || status === 'skipped',
    usedCache: status === 'offline_cache',
    lastUpdatedAt: (last?.finished_at || last?.started_at || null) as string | null,
  };
}

export async function runRosterSync(params: {
  supabase: SupabaseClient | null;
  options: RunSyncOptions;
  source?: RosterSource;
  downloadPhotos?: boolean;
}): Promise<RunSyncResult> {
  const started = Date.now();
  const startedAt = new Date().toISOString();
  const { options } = params;
  const skipHours = options.skipIfRecentHours ?? DEFAULT_SKIP_HOURS;
  const source = params.source || createDefaultRosterSource();
  const downloadPhotos = params.downloadPhotos !== false;

  // Demo / offline path
  if (!params.supabase || isDemoMode()) {
    return applyDemoRosterSync({
      teamId: options.teamId,
      trigger: options.trigger,
      force: options.force,
      skipHours,
      source,
    });
  }

  const supabase = params.supabase;

  // Idempotent startup skip
  if (!options.force && options.trigger === 'startup') {
    const { data: last } = await supabase
      .from('sync_log')
      .select('started_at, status')
      .eq('team_id', options.teamId)
      .in('status', ['ok', 'offline_cache', 'skipped'])
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (last?.started_at) {
      const ageH = (Date.now() - new Date(last.started_at).getTime()) / 3_600_000;
      if (ageH < skipHours) {
        const syncLogId = await createSyncLog(supabase, options.teamId, options.trigger, startedAt);
        await finishSyncLog(supabase, syncLogId, {
          finished_at: new Date().toISOString(),
          duration_ms: Date.now() - started,
          status: 'skipped',
          changes_count: 0,
          metadata: { reason: 'recent_sync', ageHours: ageH },
        });
        return emptyResult({
          skipped: true,
          status: 'skipped',
          syncLogId,
          durationMs: Date.now() - started,
          fetchedAt: last.started_at,
        });
      }
    }
  }

  let syncLogId: string | null = null;
  try {
    syncLogId = await createSyncLog(supabase, options.teamId, options.trigger, startedAt);
  } catch (err) {
    console.error('[roster-sync] sync_log create failed:', err);
  }

  let snapshot: OfficialRosterSnapshot | null = null;
  let usedCache = false;
  let fetchError: string | null = null;

  try {
    snapshot = await source.fetchRoster();
  } catch (err) {
    fetchError = err instanceof Error ? err.message : String(err);
    console.error('[roster-sync] fetch failed:', fetchError);

    const { data: cacheRow } = await supabase
      .from('roster_sync_cache')
      .select('payload, fetched_at, source_url')
      .eq('team_id', options.teamId)
      .maybeSingle();

    if (cacheRow?.payload) {
      snapshot = cacheRow.payload as OfficialRosterSnapshot;
      usedCache = true;
    } else {
      const demoCache = loadDemoCache(options.teamId);
      if (demoCache) {
        snapshot = demoCache;
        usedCache = true;
      }
    }
  }

  if (!snapshot) {
    const durationMs = Date.now() - started;
    if (syncLogId) {
      await finishSyncLog(supabase, syncLogId, {
        finished_at: new Date().toISOString(),
        duration_ms: durationMs,
        status: 'error',
        error_message: fetchError || 'Plantilla no disponible',
        changes_count: 0,
      });
    }
    return emptyResult({
      status: 'error',
      syncLogId,
      durationMs,
      errorMessage: fetchError || 'Plantilla no disponible',
    });
  }

  try {
    const { players, staff } = await loadDbRows(supabase, options.teamId);
    const diff = computeRosterDiff(snapshot, players, staff);

    let playerPhotos: Record<string, string> = {};
    let staffPhotos: Record<string, string> = {};
    if (downloadPhotos && !usedCache) {
      try {
        const photos = await syncPhotosForSnapshot(snapshot.players, snapshot.staff);
        playerPhotos = photos.playerPhotos;
        staffPhotos = photos.staffPhotos;
        for (const p of snapshot.players) {
          if (playerPhotos[p.slug]) p.photo_url = playerPhotos[p.slug];
        }
        for (const s of snapshot.staff) {
          if (staffPhotos[s.slug]) s.photo_url = staffPhotos[s.slug];
        }
      } catch (photoErr) {
        console.warn('[roster-sync] photo sync partial failure:', photoErr);
      }
    }

    if (!syncLogId) {
      syncLogId = await createSyncLog(supabase, options.teamId, options.trigger, startedAt);
    }

    await applyRosterDiff({
      supabase,
      teamId: options.teamId,
      diff,
      snapshot,
      playerPhotos,
      staffPhotos,
      syncLogId,
    });

    const durationMs = Date.now() - started;
    const status = usedCache ? 'offline_cache' : fetchError ? 'partial' : 'ok';

    await finishSyncLog(supabase, syncLogId, {
      finished_at: new Date().toISOString(),
      duration_ms: durationMs,
      status,
      players_added: diff.players_added,
      players_removed: diff.players_removed,
      players_updated: diff.players_updated,
      staff_added: diff.staff_added,
      staff_removed: diff.staff_removed,
      staff_updated: diff.staff_updated,
      changes_count: diff.changes.length,
      error_message: fetchError,
      source_url: snapshot.source_url,
    });

    console.info(
      `[roster-sync] done status=${status} changes=${diff.changes.length} duration=${durationMs}ms`
    );

    return {
      skipped: false,
      status,
      syncLogId,
      durationMs,
      changesCount: diff.changes.length,
      playersAdded: diff.players_added,
      playersRemoved: diff.players_removed,
      playersUpdated: diff.players_updated,
      staffAdded: diff.staff_added,
      staffRemoved: diff.staff_removed,
      staffUpdated: diff.staff_updated,
      errorMessage: fetchError,
      sourceUrl: snapshot.source_url,
      fetchedAt: snapshot.fetched_at,
      usedCache,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[roster-sync] apply failed:', msg);
    const durationMs = Date.now() - started;
    if (syncLogId) {
      await finishSyncLog(supabase, syncLogId, {
        finished_at: new Date().toISOString(),
        duration_ms: durationMs,
        status: 'error',
        error_message: msg,
      });
    }
    return emptyResult({
      status: 'error',
      syncLogId,
      durationMs,
      errorMessage: msg,
      usedCache,
      fetchedAt: snapshot.fetched_at,
    });
  }
}
