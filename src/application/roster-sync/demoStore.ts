import {
  RMB_OFFICIAL_PLAYERS,
  RMB_OFFICIAL_SOURCE,
  RMB_OFFICIAL_STAFF,
  RMB_OFFICIAL_SYNCED_AT,
} from '@/data/rmb-official-roster';
import { getClubPack } from '@/data/clubs';
import { db } from '@/infrastructure/supabase/repositories/InMemoryDB';
import { CLUB_TEAM_IDS } from '@/lib/club-team-ids';
import { computeRosterDiff } from './diffEngine';
import { mapPosition } from './parser';
import { createRosterSourceForTeam, plantillaUrlForTeam } from './sources/realMadridOfficial';
import {
  ATLETICO_FOOTBALL_PLANTILLA_URL,
  ATLETICO_SOURCE_ID,
  ATLETICO_SOURCE_LABEL,
  REAL_MADRID_FOOTBALL_PLANTILLA_URL,
  REAL_MADRID_PLANTILLA_URL,
  REAL_MADRID_SOURCE_ID,
  REAL_MADRID_SOURCE_LABEL,
  type DbPlayerRow,
  type DbStaffRow,
  type OfficialPlayer,
  type OfficialRosterSnapshot,
  type OfficialStaff,
  type RosterSource,
  type RunSyncResult,
} from './sources/types';
import type { SyncTrigger } from '@/types';

interface DemoSyncLog {
  id: string;
  team_id: string;
  started_at: string;
  finished_at: string | null;
  duration_ms: number | null;
  status: string;
  players_added: number;
  players_removed: number;
  players_updated: number;
  staff_added: number;
  staff_removed: number;
  staff_updated: number;
  changes_count: number;
  error_message: string | null;
  source_url: string | null;
  trigger: SyncTrigger;
  metadata: Record<string, unknown>;
  created_at: string;
}

interface DemoHistoryRow {
  id: string;
  team_id: string;
  changed_at: string;
  change_type: string;
  entity_type: 'player' | 'staff';
  entity_id: string | null;
  entity_name: string;
  old_value: string | null;
  new_value: string | null;
  source: string;
  sync_log_id: string | null;
  created_at: string;
}

const demoSyncLogs: DemoSyncLog[] = [];
const demoHistory: DemoHistoryRow[] = [];
const demoCacheByTeam = new Map<string, OfficialRosterSnapshot>();

function uuid(): string {
  return `00000000-0000-4000-8000-${Date.now().toString(16).padStart(12, '0')}`;
}

function officialFromBundledBasketball(): OfficialRosterSnapshot {
  const players: OfficialPlayer[] = RMB_OFFICIAL_PLAYERS.map((p) => ({
    slug: p.slug,
    full_name: p.full_name,
    first_name: p.firstName,
    last_name: p.lastName,
    dorsal: p.dorsal,
    position: p.position,
    position_demo: mapPosition(p.position_demo || p.position, p.opta_position),
    photo_url: p.photo_url,
    nationality: p.nationality,
    birth_date: p.birth_date,
    profile_url: p.profile_url,
  }));

  const staff: OfficialStaff[] = RMB_OFFICIAL_STAFF.map((s) => ({
    slug: s.slug,
    full_name: s.full_name,
    first_name: s.firstName,
    last_name: s.lastName,
    role: s.role,
    photo_url: s.photo_url,
    nationality: s.nationality,
    profile_url: s.profile_url,
  }));

  return {
    source_id: REAL_MADRID_SOURCE_ID,
    source_url: RMB_OFFICIAL_SOURCE || REAL_MADRID_PLANTILLA_URL,
    source_label: REAL_MADRID_SOURCE_LABEL,
    fetched_at: RMB_OFFICIAL_SYNCED_AT || new Date().toISOString(),
    players,
    staff,
  };
}

function officialFromRmfPack(): OfficialRosterSnapshot {
  const pack = getClubPack('rmf');
  const players: OfficialPlayer[] = (pack.players || []).map((p: any) => {
    const slug =
      String(p.profile_url || '')
        .split('/')
        .filter(Boolean)
        .pop() ||
      `${p.firstName || ''}-${p.lastName || ''}`
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    return {
      slug,
      full_name: p.full_name || `${p.firstName || ''} ${p.lastName || ''}`.trim(),
      first_name: p.firstName || '',
      last_name: p.lastName || '',
      dorsal: Number(p.number ?? p.dorsal ?? 0),
      position: p.position || null,
      position_demo: mapPosition(p.position),
      photo_url: p.imageUrl || p.photo_url || null,
      nationality: p.nationality || null,
      birth_date: p.birthDate || p.birth_date || null,
      profile_url: p.profile_url || `${REAL_MADRID_FOOTBALL_PLANTILLA_URL}/${slug}`,
    };
  });

  const staff: OfficialStaff[] = (pack.coachingStaff || []).map((s: any) => {
    const slug =
      String(s.profile_url || '')
        .split('/')
        .filter(Boolean)
        .pop() ||
      String(s.full_name || s.name || 'staff')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    return {
      slug,
      full_name: String(s.full_name || s.name || ''),
      first_name: String(s.full_name || s.name || '').split(' ')[0] || '',
      last_name: String(s.full_name || s.name || '').split(' ').slice(1).join(' '),
      role: String(s.role || 'Cuerpo técnico'),
      photo_url: s.photo_url || s.imageUrl || null,
      nationality: s.nationality || null,
      profile_url: s.profile_url || `${REAL_MADRID_FOOTBALL_PLANTILLA_URL}/${slug}`,
    };
  });

  return {
    source_id: REAL_MADRID_SOURCE_ID,
    source_url: REAL_MADRID_FOOTBALL_PLANTILLA_URL,
    source_label: REAL_MADRID_SOURCE_LABEL,
    fetched_at: new Date().toISOString(),
    players,
    staff,
  };
}

function officialFallbackForTeam(teamId: string): OfficialRosterSnapshot {
  if (teamId === CLUB_TEAM_IDS.atm) {
    const pack = getClubPack('atm');
    const players: OfficialPlayer[] = (pack.players || []).map((p: any) => {
      const slug =
        String(p.profile_url || '')
          .split('/')
          .filter(Boolean)
          .pop() || p.id;
      return {
        slug,
        full_name: p.full_name || `${p.firstName || ''} ${p.lastName || ''}`.trim(),
        first_name: p.firstName || '',
        last_name: p.lastName || '',
        dorsal: Number(p.number ?? p.dorsal ?? 0),
        position: p.position || null,
        position_demo: mapPosition(p.position),
        photo_url: p.imageUrl || p.photo_url || null,
        nationality: p.nationality || null,
        birth_date: p.birthDate || p.birth_date || null,
        profile_url: p.profile_url || `${ATLETICO_FOOTBALL_PLANTILLA_URL}/${slug}`,
      };
    });
    const staff: OfficialStaff[] = (pack.coachingStaff || []).map((s: any) => ({
      slug: s.id || String(s.full_name || 'staff'),
      full_name: String(s.full_name || s.name || ''),
      first_name: String(s.full_name || s.name || '').split(' ')[0] || '',
      last_name: String(s.full_name || s.name || '').split(' ').slice(1).join(' '),
      role: String(s.role || 'Cuerpo técnico'),
      photo_url: s.photo_url || null,
      nationality: s.nationality || null,
      profile_url: s.profile_url || ATLETICO_FOOTBALL_PLANTILLA_URL,
    }));
    return {
      source_id: ATLETICO_SOURCE_ID,
      source_url: ATLETICO_FOOTBALL_PLANTILLA_URL,
      source_label: ATLETICO_SOURCE_LABEL,
      fetched_at: new Date().toISOString(),
      players,
      staff,
    };
  }
  if (teamId === CLUB_TEAM_IDS.rmf) return officialFromRmfPack();
  return officialFromBundledBasketball();
}

export function loadDemoCache(teamId: string): OfficialRosterSnapshot | null {
  return demoCacheByTeam.get(teamId) || officialFallbackForTeam(teamId);
}

function dbRowsFromMemory(): { players: DbPlayerRow[]; staff: DbStaffRow[] } {
  const players: DbPlayerRow[] = db.players.map((p: any) => ({
    id: String(p.id),
    team_id: String(p.team_id || 'team-acb-123'),
    dorsal: Number(p.number ?? p.dorsal ?? 0),
    full_name: p.full_name || `${p.firstName || ''} ${p.lastName || ''}`.trim(),
    position: String(p.position || 'alero'),
    photo_url: p.photo_url || p.imageUrl || null,
    is_active: p.status ? p.status === 'ACTIVE' : p.is_active !== false,
    official_slug: p.slug || p.official_slug || null,
    source: p.source || 'realmadrid.com',
  }));

  const staff: DbStaffRow[] = db.coachingStaff.map((s: any) => ({
    id: String(s.id),
    team_id: String(s.team_id || 'team-acb-123'),
    full_name: String(s.full_name || s.name || ''),
    role: String(s.role || 'Cuerpo técnico'),
    photo_url: s.photo_url || s.imageUrl || null,
    is_active: s.is_active !== false,
    official_slug: s.slug || s.official_slug || null,
    source: s.source || 'realmadrid.com',
  }));

  return { players, staff };
}

function applySnapshotToMemory(snapshot: OfficialRosterSnapshot) {
  const bySlugPlayer = new Map(db.players.map((p: any) => [p.slug || p.official_slug, p]));
  const nextPlayers: any[] = [];

  for (const op of snapshot.players) {
    const existing = bySlugPlayer.get(op.slug);
    if (existing) {
      nextPlayers.push({
        ...existing,
        firstName: op.first_name || existing.firstName,
        lastName: op.last_name || existing.lastName,
        number: op.dorsal || existing.number,
        position: op.position_demo,
        imageUrl: op.photo_url || existing.imageUrl,
        status: 'ACTIVE',
        slug: op.slug,
        source: 'realmadrid.com',
        official_slug: op.slug,
        nationality: op.nationality || existing.nationality,
        birthDate: op.birth_date || existing.birthDate,
        profile_url: op.profile_url,
      });
    } else {
      nextPlayers.push({
        id: `p-sync-${op.slug}`,
        firstName: op.first_name,
        lastName: op.last_name,
        number: op.dorsal,
        position: op.position_demo,
        status: 'ACTIVE',
        sizes: { jersey: 'L', shorts: 'L', shoes: '44', socks: 'L', warmupShirt: 'L' },
        nationality: op.nationality || 'España',
        birthDate: op.birth_date || undefined,
        imageUrl: op.photo_url || undefined,
        profile_url: op.profile_url,
        slug: op.slug,
        source: 'realmadrid.com',
        official_slug: op.slug,
      });
    }
  }

  // Keep inactive historical players (soft delete)
  for (const p of db.players) {
    const slug = p.slug || p.official_slug;
    if (slug && snapshot.players.some((op) => op.slug === slug)) continue;
    if (p.source === 'realmadrid.com' || p.slug) {
      nextPlayers.push({ ...p, status: 'INACTIVE' });
    } else {
      nextPlayers.push(p);
    }
  }

  db.players = nextPlayers;

  const bySlugStaff = new Map(db.coachingStaff.map((s: any) => [s.slug || s.official_slug, s]));
  const nextStaff: any[] = [];
  for (const os of snapshot.staff) {
    const existing = bySlugStaff.get(os.slug);
    if (existing) {
      nextStaff.push({
        ...existing,
        full_name: os.full_name,
        role: os.role,
        photo_url: os.photo_url || existing.photo_url,
        is_active: true,
        slug: os.slug,
        official_slug: os.slug,
        source: 'realmadrid.com',
      });
    } else {
      nextStaff.push({
        id: `c-sync-${os.slug}`,
        full_name: os.full_name,
        role: os.role,
        photo_url: os.photo_url,
        nationality: os.nationality || 'España',
        is_active: true,
        slug: os.slug,
        official_slug: os.slug,
        source: 'realmadrid.com',
      });
    }
  }
  for (const s of db.coachingStaff) {
    const slug = s.slug || s.official_slug;
    if (slug && snapshot.staff.some((os) => os.slug === slug)) continue;
    if (s.source === 'realmadrid.com' || s.slug) {
      nextStaff.push({ ...s, is_active: false });
    } else {
      nextStaff.push(s);
    }
  }
  db.coachingStaff = nextStaff;
}

export function getDemoSyncStatus(teamId: string) {
  const last = [...demoSyncLogs].filter((l) => l.team_id === teamId).sort((a, b) =>
    a.started_at < b.started_at ? 1 : -1
  )[0];

  const bundled = officialFallbackForTeam(teamId);
  return {
    lastSync: last || null,
    sourceLabel: REAL_MADRID_SOURCE_LABEL,
    hasPendingChanges: Boolean(last && last.changes_count > 0 && last.status === 'ok'),
    syncedOk: !last || last.status === 'ok' || last.status === 'offline_cache' || last.status === 'skipped',
    usedCache: last?.status === 'offline_cache',
    lastUpdatedAt: last?.finished_at || last?.started_at || bundled.fetched_at,
  };
}

export function getDemoRosterHistory(teamId: string, limit = 50) {
  return demoHistory
    .filter((h) => h.team_id === teamId)
    .sort((a, b) => (a.changed_at < b.changed_at ? 1 : -1))
    .slice(0, limit);
}

export function getDemoSyncLogs(teamId: string, limit = 20) {
  return demoSyncLogs
    .filter((l) => l.team_id === teamId)
    .sort((a, b) => (a.started_at < b.started_at ? 1 : -1))
    .slice(0, limit);
}

export async function applyDemoRosterSync(params: {
  teamId: string;
  trigger: SyncTrigger;
  force?: boolean;
  skipHours: number;
  source?: RosterSource;
}): Promise<RunSyncResult> {
  const started = Date.now();
  const startedAt = new Date().toISOString();
  const source = params.source || createRosterSourceForTeam(params.teamId);
  const plantillaUrl = plantillaUrlForTeam(params.teamId);

  if (!params.force && params.trigger === 'startup') {
    const last = getDemoSyncStatus(params.teamId).lastSync as DemoSyncLog | null;
    if (last?.started_at) {
      const ageH = (Date.now() - new Date(last.started_at).getTime()) / 3_600_000;
      if (ageH < params.skipHours) {
        const syncLogId = uuid();
        demoSyncLogs.push({
          id: syncLogId,
          team_id: params.teamId,
          started_at: startedAt,
          finished_at: new Date().toISOString(),
          duration_ms: Date.now() - started,
          status: 'skipped',
          players_added: 0,
          players_removed: 0,
          players_updated: 0,
          staff_added: 0,
          staff_removed: 0,
          staff_updated: 0,
          changes_count: 0,
          error_message: null,
          source_url: plantillaUrl,
          trigger: params.trigger,
          metadata: { reason: 'recent_sync' },
          created_at: startedAt,
        });
        return {
          skipped: true,
          status: 'skipped',
          syncLogId,
          durationMs: Date.now() - started,
          changesCount: 0,
          playersAdded: 0,
          playersRemoved: 0,
          playersUpdated: 0,
          staffAdded: 0,
          staffRemoved: 0,
          staffUpdated: 0,
          errorMessage: null,
          sourceUrl: plantillaUrl,
          fetchedAt: last.started_at,
          usedCache: false,
        };
      }
    }
  }

  let snapshot: OfficialRosterSnapshot | null = null;
  let usedCache = false;
  let fetchError: string | null = null;

  try {
    snapshot = await source.fetchRoster();
  } catch (err) {
    fetchError = err instanceof Error ? err.message : String(err);
    console.warn('[roster-sync:demo] fetch failed, using cache:', fetchError);
    snapshot = loadDemoCache(params.teamId);
    usedCache = true;
  }

  if (!snapshot || snapshot.players.length === 0) {
    snapshot = officialFallbackForTeam(params.teamId);
    usedCache = true;
  }

  const { players, staff } = dbRowsFromMemory();
  const diff = computeRosterDiff(snapshot, players, staff);
  applySnapshotToMemory(snapshot);
  demoCacheByTeam.set(params.teamId, snapshot);

  const syncLogId = uuid();
  const finished = new Date().toISOString();
  const durationMs = Date.now() - started;
  const status = usedCache ? 'offline_cache' : 'ok';

  demoSyncLogs.push({
    id: syncLogId,
    team_id: params.teamId,
    started_at: startedAt,
    finished_at: finished,
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
    trigger: params.trigger,
    metadata: {},
    created_at: startedAt,
  });

  for (const c of diff.changes) {
    demoHistory.push({
      id: uuid(),
      team_id: params.teamId,
      changed_at: finished,
      change_type: c.change_type,
      entity_type: c.entity_type,
      entity_id: c.entity_id,
      entity_name: c.entity_name,
      old_value: c.old_value,
      new_value: c.new_value,
      source: snapshot.source_url,
      sync_log_id: syncLogId,
      created_at: finished,
    });
  }

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
}
