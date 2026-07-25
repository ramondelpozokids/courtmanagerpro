import { normalizeName } from './parser';
import type {
  DbPlayerRow,
  DbStaffRow,
  OfficialPlayer,
  OfficialRosterSnapshot,
  OfficialStaff,
  RosterDiff,
  RosterDiffChange,
} from './sources/types';

function matchPlayer(db: DbPlayerRow[], official: OfficialPlayer): DbPlayerRow | undefined {
  if (official.slug) {
    const bySlug = db.find((p) => p.official_slug === official.slug);
    if (bySlug) return bySlug;
  }
  const byDorsalName = db.find(
    (p) =>
      p.is_active &&
      p.dorsal === official.dorsal &&
      normalizeName(p.full_name) === normalizeName(official.full_name)
  );
  if (byDorsalName) return byDorsalName;

  return db.find(
    (p) => p.is_active && normalizeName(p.full_name) === normalizeName(official.full_name)
  );
}

function matchStaff(db: DbStaffRow[], official: OfficialStaff): DbStaffRow | undefined {
  if (official.slug) {
    const bySlug = db.find((s) => s.official_slug === official.slug);
    if (bySlug) return bySlug;
  }
  return db.find(
    (s) => s.is_active && normalizeName(s.full_name) === normalizeName(official.full_name)
  );
}

function photoChanged(oldUrl: string | null, newUrl: string | null): boolean {
  if (!newUrl) return false;
  if (!oldUrl) return true;
  const strip = (u: string) => u.split('?')[0];
  return strip(oldUrl) !== strip(newUrl);
}

export function computeRosterDiff(
  snapshot: OfficialRosterSnapshot,
  dbPlayers: DbPlayerRow[],
  dbStaff: DbStaffRow[]
): RosterDiff {
  const changes: RosterDiffChange[] = [];
  let players_added = 0;
  let players_removed = 0;
  let players_updated = 0;
  let staff_added = 0;
  let staff_removed = 0;
  let staff_updated = 0;

  const matchedPlayerIds = new Set<string>();
  const matchedStaffIds = new Set<string>();

  for (const op of snapshot.players) {
    const existing = matchPlayer(dbPlayers, op);
    if (!existing) {
      players_added += 1;
      changes.push({
        change_type: 'alta',
        entity_type: 'player',
        entity_id: null,
        entity_name: op.full_name,
        old_value: null,
        new_value: `#${op.dorsal} ${op.full_name} (${op.position_demo})`,
        slug: op.slug,
        official: op,
      });
      continue;
    }

    matchedPlayerIds.add(existing.id);
    let updated = false;

    if (existing.dorsal !== op.dorsal && op.dorsal > 0) {
      updated = true;
      changes.push({
        change_type: 'dorsal',
        entity_type: 'player',
        entity_id: existing.id,
        entity_name: op.full_name,
        old_value: String(existing.dorsal),
        new_value: String(op.dorsal),
        slug: op.slug,
        official: op,
      });
    }

    if (existing.position !== op.position_demo) {
      updated = true;
      changes.push({
        change_type: 'posicion',
        entity_type: 'player',
        entity_id: existing.id,
        entity_name: op.full_name,
        old_value: existing.position,
        new_value: op.position_demo,
        slug: op.slug,
        official: op,
      });
    }

    if (normalizeName(existing.full_name) !== normalizeName(op.full_name)) {
      updated = true;
      changes.push({
        change_type: 'nombre',
        entity_type: 'player',
        entity_id: existing.id,
        entity_name: op.full_name,
        old_value: existing.full_name,
        new_value: op.full_name,
        slug: op.slug,
        official: op,
      });
    }

    if (photoChanged(existing.photo_url, op.photo_url)) {
      updated = true;
      changes.push({
        change_type: 'foto',
        entity_type: 'player',
        entity_id: existing.id,
        entity_name: op.full_name,
        old_value: existing.photo_url,
        new_value: op.photo_url,
        slug: op.slug,
        official: op,
      });
    }

    if (!existing.is_active) {
      updated = true;
      changes.push({
        change_type: 'alta',
        entity_type: 'player',
        entity_id: existing.id,
        entity_name: op.full_name,
        old_value: 'inactivo',
        new_value: 'activo',
        slug: op.slug,
        official: op,
      });
    }

    if (updated) players_updated += 1;
  }

  for (const dp of dbPlayers) {
    if (!dp.is_active) continue;
    if (matchedPlayerIds.has(dp.id)) continue;
    // Only soft-remove players previously synced from official source (or with slug)
    if (dp.source && dp.source !== 'realmadrid.com' && dp.source !== 'real_madrid_official' && !dp.official_slug) {
      continue;
    }
    players_removed += 1;
    changes.push({
      change_type: 'baja',
      entity_type: 'player',
      entity_id: dp.id,
      entity_name: dp.full_name,
      old_value: 'activo',
      new_value: 'baja',
      slug: dp.official_slug,
    });
  }

  for (const os of snapshot.staff) {
    const existing = matchStaff(dbStaff, os);
    if (!existing) {
      staff_added += 1;
      changes.push({
        change_type: 'staff_alta',
        entity_type: 'staff',
        entity_id: null,
        entity_name: os.full_name,
        old_value: null,
        new_value: `${os.full_name} — ${os.role}`,
        slug: os.slug,
        official: os,
      });
      continue;
    }

    matchedStaffIds.add(existing.id);
    let updated = false;

    if (existing.role !== os.role) {
      updated = true;
      changes.push({
        change_type: 'staff_cargo',
        entity_type: 'staff',
        entity_id: existing.id,
        entity_name: os.full_name,
        old_value: existing.role,
        new_value: os.role,
        slug: os.slug,
        official: os,
      });
    }

    if (normalizeName(existing.full_name) !== normalizeName(os.full_name)) {
      updated = true;
      changes.push({
        change_type: 'staff_nombre',
        entity_type: 'staff',
        entity_id: existing.id,
        entity_name: os.full_name,
        old_value: existing.full_name,
        new_value: os.full_name,
        slug: os.slug,
        official: os,
      });
    }

    if (photoChanged(existing.photo_url, os.photo_url)) {
      updated = true;
      changes.push({
        change_type: 'staff_foto',
        entity_type: 'staff',
        entity_id: existing.id,
        entity_name: os.full_name,
        old_value: existing.photo_url,
        new_value: os.photo_url,
        slug: os.slug,
        official: os,
      });
    }

    if (!existing.is_active) {
      updated = true;
      changes.push({
        change_type: 'staff_alta',
        entity_type: 'staff',
        entity_id: existing.id,
        entity_name: os.full_name,
        old_value: 'inactivo',
        new_value: 'activo',
        slug: os.slug,
        official: os,
      });
    }

    if (updated) staff_updated += 1;
  }

  for (const ds of dbStaff) {
    if (!ds.is_active) continue;
    if (matchedStaffIds.has(ds.id)) continue;
    if (ds.source && ds.source !== 'realmadrid.com' && ds.source !== 'real_madrid_official' && !ds.official_slug) {
      continue;
    }
    staff_removed += 1;
    changes.push({
      change_type: 'staff_baja',
      entity_type: 'staff',
      entity_id: ds.id,
      entity_name: ds.full_name,
      old_value: 'activo',
      new_value: 'baja',
      slug: ds.official_slug,
    });
  }

  return {
    changes,
    players_added,
    players_removed,
    players_updated,
    staff_added,
    staff_removed,
    staff_updated,
  };
}
