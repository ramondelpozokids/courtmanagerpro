import type { DbMatchRow, MatchDiff, MatchDiffChange, OfficialCalendarSnapshot } from './types';

function timeOnly(v: string | null | undefined): string {
  if (!v) return '';
  return v.slice(0, 5);
}

function dateOnly(v: string | null | undefined): string {
  if (!v) return '';
  return v.slice(0, 10);
}

export function computeMatchDiff(
  snapshot: OfficialCalendarSnapshot,
  dbRows: DbMatchRow[]
): MatchDiff {
  const changes: MatchDiffChange[] = [];
  let matches_added = 0;
  let matches_updated = 0;
  let matches_removed = 0;
  let results_updated = 0;

  const bySlug = new Map(dbRows.map((r) => [r.official_slug, r]));
  const matched = new Set<string>();

  for (const f of snapshot.fixtures) {
    const existing = bySlug.get(f.official_slug);
    if (!existing) {
      matches_added += 1;
      changes.push({
        change_type: 'nuevo',
        match_id: null,
        entity_name: `vs ${f.rival}`,
        old_value: null,
        new_value: `${f.match_date} ${f.match_time || ''} · ${f.competition}`,
        slug: f.official_slug,
        fixture: f,
      });
      continue;
    }

    matched.add(existing.id);
    let updated = false;

    if (dateOnly(existing.match_date) !== dateOnly(f.match_date)) {
      updated = true;
      changes.push({
        change_type: 'fecha',
        match_id: existing.id,
        entity_name: `Partido contra ${f.rival}`,
        old_value: dateOnly(existing.match_date),
        new_value: dateOnly(f.match_date),
        slug: f.official_slug,
        fixture: f,
      });
    }

    if (timeOnly(existing.match_time) !== timeOnly(f.match_time)) {
      updated = true;
      changes.push({
        change_type: 'hora',
        match_id: existing.id,
        entity_name: `Partido contra ${f.rival}`,
        old_value: timeOnly(existing.match_time) || '—',
        new_value: timeOnly(f.match_time) || '—',
        slug: f.official_slug,
        fixture: f,
      });
    }

    if (existing.rival !== f.rival) {
      updated = true;
      changes.push({
        change_type: 'rival',
        match_id: existing.id,
        entity_name: `Partido ${existing.rival} → ${f.rival}`,
        old_value: existing.rival,
        new_value: f.rival,
        slug: f.official_slug,
        fixture: f,
      });
    }

    if ((existing.venue || '') !== (f.venue || '')) {
      updated = true;
      changes.push({
        change_type: 'pabellon',
        match_id: existing.id,
        entity_name: `Partido contra ${f.rival}`,
        old_value: existing.venue || '—',
        new_value: f.venue || '—',
        slug: f.official_slug,
        fixture: f,
      });
    }

    if (existing.competition !== f.competition) {
      updated = true;
      changes.push({
        change_type: 'competicion',
        match_id: existing.id,
        entity_name: `Partido contra ${f.rival}`,
        old_value: existing.competition,
        new_value: f.competition,
        slug: f.official_slug,
        fixture: f,
      });
    }

    if ((existing.jornada || '') !== (f.jornada || '')) {
      updated = true;
      changes.push({
        change_type: 'jornada',
        match_id: existing.id,
        entity_name: `Partido contra ${f.rival}`,
        old_value: existing.jornada || '—',
        new_value: f.jornada || '—',
        slug: f.official_slug,
        fixture: f,
      });
    }

    if (existing.status !== f.status) {
      updated = true;
      changes.push({
        change_type: 'estado',
        match_id: existing.id,
        entity_name: `Partido contra ${f.rival}`,
        old_value: existing.status,
        new_value: f.status,
        slug: f.official_slug,
        fixture: f,
      });
    }

    const oldScore = existing.score_text || `${existing.score_home ?? ''}-${existing.score_away ?? ''}`;
    const newScore = f.score_text || `${f.score_home ?? ''}-${f.score_away ?? ''}`;
    if (
      (existing.score_home !== f.score_home || existing.score_away !== f.score_away) &&
      (f.score_home != null || f.score_away != null)
    ) {
      updated = true;
      results_updated += 1;
      changes.push({
        change_type: 'marcador',
        match_id: existing.id,
        entity_name: `Partido contra ${f.rival}`,
        old_value: oldScore === '-' ? '—' : oldScore,
        new_value: newScore,
        slug: f.official_slug,
        fixture: f,
      });
    }

    if ((existing.result || '') !== (f.result || '') && f.result) {
      updated = true;
      changes.push({
        change_type: 'resultado',
        match_id: existing.id,
        entity_name: `Partido contra ${f.rival}`,
        old_value: existing.result || '—',
        new_value: f.result,
        slug: f.official_slug,
        fixture: f,
      });
    }

    if (updated) matches_updated += 1;
  }

  for (const row of dbRows) {
    if (!row.is_active) continue;
    if (matched.has(row.id)) continue;
    if (![...bySlug.keys()].includes(row.official_slug) && !snapshot.fixtures.some((f) => f.official_slug === row.official_slug)) {
      // Fixture no longer in official calendar → soft deactivate only if was official
      matches_removed += 1;
      changes.push({
        change_type: 'baja',
        match_id: row.id,
        entity_name: `vs ${row.rival}`,
        old_value: 'activo',
        new_value: 'retirado del calendario oficial',
        slug: row.official_slug,
      });
    }
  }

  return {
    changes,
    matches_added,
    matches_updated,
    matches_removed,
    results_updated,
  };
}
