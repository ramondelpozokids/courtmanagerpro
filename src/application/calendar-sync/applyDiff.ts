import type { SupabaseClient } from '@supabase/supabase-js';
import type { MatchDiff, OfficialCalendarSnapshot } from './types';
import { OFFICIAL_CALENDAR_SOURCE_ID } from './types';

export async function applyMatchDiff(params: {
  supabase: SupabaseClient;
  teamId: string;
  diff: MatchDiff;
  snapshot: OfficialCalendarSnapshot;
  syncLogId: string;
}): Promise<void> {
  const { supabase, teamId, diff, snapshot, syncLogId } = params;
  const now = new Date().toISOString();

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
      source: 'realmadrid.com',
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
    if (error) throw new Error(`match_history: ${error.message}`);
  }

  await supabase.from('match_sync_cache').upsert({
    team_id: teamId,
    source_id: OFFICIAL_CALENDAR_SOURCE_ID,
    source_url: snapshot.source_url,
    payload: snapshot,
    fetched_at: snapshot.fetched_at,
    updated_at: now,
  });
}

export async function createCalendarAlerts(params: {
  supabase: SupabaseClient;
  teamId: string;
  diff: MatchDiff;
}): Promise<void> {
  const { supabase, teamId, diff } = params;
  if (diff.changes.length === 0) return;

  const alerts = diff.changes
    .filter((c) =>
      ['nuevo', 'fecha', 'hora', 'rival', 'pabellon', 'resultado', 'marcador', 'estado'].includes(
        c.change_type
      )
    )
    .slice(0, 30)
    .map((c) => {
      let type = 'calendario_cambio';
      if (c.change_type === 'nuevo') type = 'calendario_nuevo';
      if (c.change_type === 'resultado' || c.change_type === 'marcador') type = 'calendario_resultado';

      const title =
        c.change_type === 'nuevo'
          ? 'Nuevo partido oficial'
          : c.change_type === 'marcador' || c.change_type === 'resultado'
            ? 'Resultado oficial publicado'
            : 'Cambio en calendario oficial';

      const message =
        c.change_type === 'hora'
          ? `${c.entity_name}: hora ${c.old_value} → ${c.new_value} (Real Madrid Oficial)`
          : c.change_type === 'fecha'
            ? `${c.entity_name}: fecha ${c.old_value} → ${c.new_value} (Real Madrid Oficial)`
            : `${c.entity_name}: ${c.change_type} ${c.old_value || ''} → ${c.new_value || ''}`.trim();

      return {
        team_id: teamId,
        type,
        severity: c.change_type === 'nuevo' || c.change_type === 'marcador' ? 'info' : 'warning',
        title,
        message,
        entity_type: 'official_match',
        entity_id: c.match_id,
        is_read: false,
        is_dismissed: false,
        auto_generated: true,
        metadata: {
          change_type: c.change_type,
          source: 'realmadrid.com',
          slug: c.slug,
        },
      };
    });

  if (alerts.length === 0) return;
  const { error } = await supabase.from('alerts').insert(alerts);
  if (error) {
    console.warn('[calendar-sync] alerts insert failed:', error.message);
  }
}
