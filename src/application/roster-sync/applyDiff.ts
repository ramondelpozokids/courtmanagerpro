import type { SupabaseClient } from '@supabase/supabase-js';
import type { OfficialRosterSnapshot, RosterDiff } from './sources/types';
import { REAL_MADRID_SOURCE_ID } from './sources/types';

function officialEntitySource(snapshot: OfficialRosterSnapshot): string {
  if (snapshot.source_id?.includes('atletico')) return 'atleticodemadrid.com';
  return 'realmadrid.com';
}

/**
 * Apply roster diff atomically (best-effort sequential ops with soft-delete).
 * Never hard-deletes players or staff.
 */
export async function applyRosterDiff(params: {
  supabase: SupabaseClient;
  teamId: string;
  diff: RosterDiff;
  snapshot: OfficialRosterSnapshot;
  playerPhotos: Record<string, string>;
  staffPhotos: Record<string, string>;
  syncLogId: string;
  nowIso?: string;
}): Promise<{ syncLogId: string }> {
  const { supabase, teamId, diff, snapshot, playerPhotos, staffPhotos, syncLogId } = params;
  const now = params.nowIso || new Date().toISOString();
  const entitySource = officialEntitySource(snapshot);

  for (const change of diff.changes) {
    if (change.change_type === 'baja' && change.entity_id) {
      const { error } = await supabase
        .from('players')
        .update({ is_active: false, deactivated_at: now, updated_at: now })
        .eq('id', change.entity_id);
      if (error) throw new Error(`baja player: ${error.message}`);
    }
    if (change.change_type === 'staff_baja' && change.entity_id) {
      const { error } = await supabase
        .from('coaching_staff')
        .update({ is_active: false, deactivated_at: now, updated_at: now })
        .eq('id', change.entity_id);
      if (error) throw new Error(`baja staff: ${error.message}`);
    }
  }

  for (const op of snapshot.players) {
    const photo = playerPhotos[op.slug] || op.photo_url;
    const dorsal = op.dorsal > 0 ? op.dorsal : 99;

    const { data: bySlug } = await supabase
      .from('players')
      .select('id')
      .eq('team_id', teamId)
      .eq('official_slug', op.slug)
      .maybeSingle();

    let targetId = bySlug?.id as string | undefined;

    if (!targetId) {
      const { data: byName } = await supabase
        .from('players')
        .select('id')
        .eq('team_id', teamId)
        .ilike('full_name', op.full_name)
        .maybeSingle();
      targetId = byName?.id;
    }

    // Free dorsal on other rows to avoid UNIQUE(team_id, dorsal)
    if (dorsal > 0 && dorsal < 9000) {
      const { data: conflicts } = await supabase
        .from('players')
        .select('id')
        .eq('team_id', teamId)
        .eq('dorsal', dorsal);
      for (const row of conflicts || []) {
        if (targetId && row.id === targetId) continue;
        await supabase
          .from('players')
          .update({ dorsal: 9000 + Math.floor(Math.random() * 800), updated_at: now })
          .eq('id', row.id);
      }
    }

    const payload = {
      team_id: teamId,
      dorsal,
      full_name: op.full_name,
      position: op.position_demo,
      photo_url: photo,
      nationality: op.nationality,
      birth_date: op.birth_date,
      is_active: true,
      source: entitySource,
      official_slug: op.slug,
      activated_at: now,
      deactivated_at: null,
      updated_at: now,
      jersey_name: op.last_name?.toUpperCase() || null,
      metadata: {
        slug: op.slug,
        profile_url: op.profile_url,
        first_name: op.first_name,
        last_name: op.last_name,
        official_position: op.position,
      },
    };

    if (targetId) {
      const { error } = await supabase.from('players').update(payload).eq('id', targetId);
      if (error) throw new Error(`update player ${op.slug}: ${error.message}`);
    } else {
      const { error } = await supabase.from('players').insert({ ...payload, created_at: now });
      if (error) throw new Error(`insert player ${op.slug}: ${error.message}`);
    }
  }

  for (const os of snapshot.staff) {
    const photo = staffPhotos[os.slug] || os.photo_url;

    const { data: bySlug } = await supabase
      .from('coaching_staff')
      .select('id')
      .eq('team_id', teamId)
      .eq('official_slug', os.slug)
      .maybeSingle();

    let targetId = bySlug?.id as string | undefined;
    if (!targetId) {
      const { data: byName } = await supabase
        .from('coaching_staff')
        .select('id')
        .eq('team_id', teamId)
        .ilike('full_name', os.full_name)
        .maybeSingle();
      targetId = byName?.id;
    }

    let existingNotes: Record<string, unknown> = {};
    if (targetId) {
      const { data: existing } = await supabase
        .from('coaching_staff')
        .select('notes')
        .eq('id', targetId)
        .maybeSingle();
      const raw = existing?.notes;
      if (typeof raw === 'string' && raw.trim().startsWith('{')) {
        try {
          existingNotes = JSON.parse(raw) as Record<string, unknown>;
        } catch {
          existingNotes = {};
        }
      } else if (raw && typeof raw === 'object') {
        existingNotes = raw as Record<string, unknown>;
      }
    }

    const payload = {
      team_id: teamId,
      full_name: os.full_name,
      role: os.role,
      photo_url: photo,
      nationality: os.nationality || 'España',
      is_active: true,
      source: entitySource,
      official_slug: os.slug,
      activated_at: now,
      deactivated_at: null,
      updated_at: now,
      notes: JSON.stringify({
        ...existingNotes,
        profile_url: os.profile_url,
        official_slug: os.slug,
      }),
    };

    if (targetId) {
      const { error } = await supabase.from('coaching_staff').update(payload).eq('id', targetId);
      if (error) throw new Error(`update staff ${os.slug}: ${error.message}`);
    } else {
      const { error } = await supabase.from('coaching_staff').insert({ ...payload, created_at: now });
      if (error) throw new Error(`insert staff ${os.slug}: ${error.message}`);
    }
  }

  if (diff.changes.length > 0) {
    const historyRows = diff.changes.map((c) => ({
      team_id: teamId,
      changed_at: now,
      change_type: c.change_type,
      entity_type: c.entity_type,
      entity_id: c.entity_id,
      entity_name: c.entity_name,
      old_value: c.old_value,
      new_value: c.new_value,
      source: snapshot.source_url,
      sync_log_id: syncLogId,
      created_at: now,
    }));
    const { error: histError } = await supabase.from('roster_history').insert(historyRows);
    if (histError) throw new Error(`roster_history: ${histError.message}`);
  }

  const { error: cacheError } = await supabase.from('roster_sync_cache').upsert({
    team_id: teamId,
    source_id: snapshot.source_id || REAL_MADRID_SOURCE_ID,
    source_url: snapshot.source_url,
    payload: snapshot,
    fetched_at: snapshot.fetched_at,
    updated_at: now,
  });
  if (cacheError) {
    console.warn('[roster-sync] cache upsert failed:', cacheError.message);
  }

  return { syncLogId };
}
