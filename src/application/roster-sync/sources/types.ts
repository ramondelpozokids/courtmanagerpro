import type { PlayerPosition } from '@/types';
import type { SyncTrigger } from '@/types';

export const REAL_MADRID_PLANTILLA_URL =
  'https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla';

export const REAL_MADRID_SOURCE_ID = 'real_madrid_official';
export const REAL_MADRID_SOURCE_LABEL = 'Real Madrid Oficial';

export interface OfficialPlayer {
  slug: string;
  full_name: string;
  first_name: string;
  last_name: string;
  dorsal: number;
  position: string | null;
  position_demo: PlayerPosition;
  photo_url: string | null;
  nationality: string | null;
  birth_date: string | null;
  profile_url: string;
}

export interface OfficialStaff {
  slug: string;
  full_name: string;
  first_name: string;
  last_name: string;
  role: string;
  photo_url: string | null;
  nationality: string | null;
  profile_url: string;
}

export interface OfficialRosterSnapshot {
  source_id: string;
  source_url: string;
  source_label: string;
  fetched_at: string;
  players: OfficialPlayer[];
  staff: OfficialStaff[];
}

export interface RosterSource {
  id: string;
  label: string;
  url: string;
  fetchRoster(): Promise<OfficialRosterSnapshot>;
}

export interface DbPlayerRow {
  id: string;
  team_id: string;
  dorsal: number;
  full_name: string;
  position: string;
  photo_url: string | null;
  is_active: boolean;
  official_slug: string | null;
  source?: string | null;
}

export interface DbStaffRow {
  id: string;
  team_id: string;
  full_name: string;
  role: string;
  photo_url: string | null;
  is_active: boolean;
  official_slug: string | null;
  source?: string | null;
}

export type RosterDiffChangeType =
  | 'alta'
  | 'baja'
  | 'dorsal'
  | 'posicion'
  | 'foto'
  | 'nombre'
  | 'staff_alta'
  | 'staff_baja'
  | 'staff_cargo'
  | 'staff_foto'
  | 'staff_nombre';

export interface RosterDiffChange {
  change_type: RosterDiffChangeType;
  entity_type: 'player' | 'staff';
  entity_id: string | null;
  entity_name: string;
  old_value: string | null;
  new_value: string | null;
  slug?: string | null;
  official?: OfficialPlayer | OfficialStaff;
}

export interface RosterDiff {
  changes: RosterDiffChange[];
  players_added: number;
  players_removed: number;
  players_updated: number;
  staff_added: number;
  staff_removed: number;
  staff_updated: number;
}

export interface RunSyncOptions {
  teamId: string;
  trigger: SyncTrigger;
  force?: boolean;
  skipIfRecentHours?: number;
}

export interface RunSyncResult {
  skipped: boolean;
  status: 'ok' | 'partial' | 'error' | 'offline_cache' | 'skipped';
  syncLogId: string | null;
  durationMs: number;
  changesCount: number;
  playersAdded: number;
  playersRemoved: number;
  playersUpdated: number;
  staffAdded: number;
  staffRemoved: number;
  staffUpdated: number;
  errorMessage: string | null;
  sourceUrl: string;
  fetchedAt: string | null;
  usedCache: boolean;
}
