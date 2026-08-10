import type { SupabaseClient } from '@supabase/supabase-js';
import { BIRTHDAY_ALERT_RECIPIENT_EMAILS } from '@/config/birthday-alerts';
import { CLUB_TEAM_IDS } from '@/lib/club-team-ids';
import type { MatchDiff, OfficialCalendarSnapshot } from './types';

function matchEntitySource(teamId: string, snapshot: OfficialCalendarSnapshot): string {
  if (teamId === CLUB_TEAM_IDS.atm || snapshot.source_id?.includes('atletico')) {
    return 'atleticodemadrid.com';
  }
  return 'realmadrid.com';
}

export async function applyMatchDiff(params: {
  supabase: SupabaseClient;
  teamId: string;
  diff: MatchDiff;
  snapshot: OfficialCalendarSnapshot;
  syncLogId: string | null;
}): Promise<void> {
  const { supabase, teamId, diff, snapshot, syncLogId } = params;
  const now = new Date().toISOString();
  const entitySource = matchEntitySource(teamId, snapshot);

  for (const change of diff.changes) {
    if (change.change_type === 'baja' && change.match_id) {
      await supabase
        .from('official_matches')
        .update({ is_active: false, updated_at: now, last_synced_at: now })
        .eq('id', change.match_id);
    }
  }

  for (const f of snapshot.fixtures) {
    const payload = {
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
      source: entitySource,
      last_synced_at: now,
      is_active: true,
      updated_at: now,
      raw: f,
    };

    const { data: existing } = await supabase
      .from('official_matches')
      .select('id')
      .eq('team_id', teamId)
      .eq('official_slug', f.official_slug)
      .maybeSingle();

    if (existing?.id) {
      const { error } = await supabase.from('official_matches').update(payload).eq('id', existing.id);
      if (error) throw new Error(`update match ${f.official_slug}: ${error.message}`);
    } else {
      const { error } = await supabase.from('official_matches').insert({ ...payload, created_at: now });
      if (error) throw new Error(`insert match ${f.official_slug}: ${error.message}`);
    }
  }

  if (diff.changes.length > 0) {
    // Resolve match ids for history
    const { data: rows } = await supabase
      .from('official_matches')
      .select('id, official_slug')
      .eq('team_id', teamId);

    const idBySlug = new Map((rows || []).map((r: any) => [r.official_slug, r.id as string]));

    const history = diff.changes.map((c) => ({
      team_id: teamId,
      match_id: c.match_id || idBySlug.get(c.slug) || null,
      changed_at: now,
      change_type: c.change_type,
      entity_name: c.entity_name,
      old_value: c.old_value,
      new_value: c.new_value,
      source: snapshot.source_url,
      sync_log_id: syncLogId,
      created_at: now,
    }));

    const { error } = await supabase.from('match_history').insert(history);
    if (error) console.warn('[calendar-sync] match_history:', error.message);
  }

  await supabase.from('match_sync_cache').upsert({
    team_id: teamId,
    source_id: snapshot.source_id,
    source_url: snapshot.source_url,
    payload: snapshot,
    fetched_at: snapshot.fetched_at,
    updated_at: now,
  });
}

/** Cambios que importan a utillería (viaje / hora / sede). No spamear resultados ni altas masivas. */
const ACTIONABLE_CALENDAR_CHANGES = new Set([
  'fecha',
  'hora',
  'rival',
  'pabellon',
  'baja',
]);

const MAX_ALERTS_PER_SYNC = 8;
/** Si hay más altas, una sola alerta resumen (primera sync / temporada nueva). */
const BULK_NUEVO_THRESHOLD = 3;

function calendarAlertSource(teamId: string): string {
  return teamId === CLUB_TEAM_IDS.atm ? 'atleticodemadrid.com' : 'realmadrid.com';
}

/** Destinatarios operativos: Ramón (superadmin) + Carlos (utilería). */
const OPERATIONAL_NOTIFY = BIRTHDAY_ALERT_RECIPIENT_EMAILS;

export type CalendarAlertRow = {
  team_id: string;
  type: string;
  severity: string;
  title: string;
  message: string;
  entity_type: string;
  entity_id: string | null;
  is_read: boolean;
  is_dismissed: boolean;
  auto_generated: boolean;
  metadata: Record<string, unknown>;
};

/** Construye alertas de calendario (misma regla en prod y demo). */
export function buildCalendarAlertRows(teamId: string, diff: MatchDiff): CalendarAlertRow[] {
  if (diff.changes.length === 0) return [];

  const source = calendarAlertSource(teamId);
  const rows: CalendarAlertRow[] = [];
  const nuevos = diff.changes.filter((c) => c.change_type === 'nuevo');
  const actionable = diff.changes.filter((c) => ACTIONABLE_CALENDAR_CHANGES.has(c.change_type));

  if (nuevos.length > BULK_NUEVO_THRESHOLD) {
    rows.push({
      team_id: teamId,
      type: 'calendario_nuevo',
      severity: 'info',
      title: 'Calendario oficial actualizado',
      message: `${nuevos.length} partidos sincronizados desde la web oficial. Revisa el calendario.`,
      entity_type: 'official_match',
      entity_id: null,
      is_read: false,
      is_dismissed: false,
      auto_generated: true,
      metadata: {
        change_type: 'nuevo',
        source,
        bulk: true,
        count: nuevos.length,
        notify: [...OPERATIONAL_NOTIFY],
      },
    });
  } else {
    for (const c of nuevos.slice(0, MAX_ALERTS_PER_SYNC)) {
      rows.push({
        team_id: teamId,
        type: 'calendario_nuevo',
        severity: 'info',
        title: 'Nuevo partido oficial',
        message: `${c.entity_name}: ${c.new_value || ''}`.trim(),
        entity_type: 'official_match',
        entity_id: c.match_id,
        is_read: false,
        is_dismissed: false,
        auto_generated: true,
        metadata: {
          change_type: 'nuevo',
          source,
          slug: c.slug,
          notify: [...OPERATIONAL_NOTIFY],
        },
      });
    }
  }

  for (const c of actionable) {
    if (rows.length >= MAX_ALERTS_PER_SYNC) break;

    const title =
      c.change_type === 'baja'
        ? 'Partido retirado del calendario'
        : c.change_type === 'hora' || c.change_type === 'fecha'
          ? 'Cambio de horario oficial'
          : 'Cambio en calendario oficial';

    const message =
      c.change_type === 'hora'
        ? `${c.entity_name}: hora ${c.old_value} → ${c.new_value}`
        : c.change_type === 'fecha'
          ? `${c.entity_name}: fecha ${c.old_value} → ${c.new_value}`
          : c.change_type === 'baja'
            ? `${c.entity_name}: retirado del calendario oficial`
            : `${c.entity_name}: ${c.change_type} ${c.old_value || ''} → ${c.new_value || ''}`.trim();

    rows.push({
      team_id: teamId,
      type: c.change_type === 'baja' ? 'calendario_baja' : 'calendario_cambio',
      severity: 'warning',
      title,
      message,
      entity_type: 'official_match',
      entity_id: c.match_id,
      is_read: false,
      is_dismissed: false,
      auto_generated: true,
      metadata: {
        change_type: c.change_type,
        source,
        slug: c.slug,
        notify: [...OPERATIONAL_NOTIFY],
      },
    });
  }

  return rows.slice(0, MAX_ALERTS_PER_SYNC);
}

export async function createCalendarAlerts(params: {
  supabase: SupabaseClient;
  teamId: string;
  diff: MatchDiff;
}): Promise<void> {
  const { supabase, teamId, diff } = params;
  const alerts = buildCalendarAlertRows(teamId, diff);
  if (alerts.length === 0) return;
  const { error } = await supabase.from('alerts').insert(alerts);
  if (error) {
    console.warn('[calendar-sync] alerts insert failed:', error.message);
  }
}
