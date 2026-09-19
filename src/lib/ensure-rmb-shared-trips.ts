import type { SupabaseClient } from '@supabase/supabase-js';
import { CLUB_TEAM_IDS } from '@/lib/club-team-ids';
import { mapPackTripsForTeam } from '@/lib/club-trips';

function tripTypeFromNotes(notes?: string): string {
  const t = String(notes || '').toLowerCase();
  if (t.includes('euroliga') || t.includes('euroleague')) return 'euroleague';
  if (t.includes('endesa') || t.includes('acb')) return 'liga_acb';
  return 'amistoso';
}

/**
 * RMB: si no hay viajes en Supabase, copia el pack oficial.
 * Así el packing que guarda Ramón lo ve Carlos (mismo team_id). ATM/RMF no se tocan.
 */
export async function ensureRmbSharedTrips(
  supabase: SupabaseClient,
  teamId: string,
  createdBy: string
): Promise<void> {
  if (teamId !== CLUB_TEAM_IDS.rmb) return;

  const { data: existing, error } = await supabase
    .from('trips')
    .select('id')
    .eq('team_id', teamId)
    .limit(1);
  if (error || existing?.length) return;

  const pack = mapPackTripsForTeam(teamId);
  if (!pack.length) return;

  for (const t of pack) {
    const { data: trip, error: insErr } = await supabase
      .from('trips')
      .insert({
        team_id: teamId,
        name: `${t.opponent} · ${t.destination}`,
        trip_type: tripTypeFromNotes(t.notes),
        status: 'planificado',
        destination: t.destination,
        opponent: t.opponent,
        departure_date: t.departureDate,
        return_date: t.returnDate,
        created_by: createdBy,
        notes: t.notes || null,
      })
      .select('id')
      .single();
    if (insErr || !trip?.id) {
      console.warn('[trips] RMB seed skipped:', insErr?.message);
      return;
    }
    const packing = t.packingList || [];
    if (packing.length) {
      await supabase.from('trip_items').insert(
        packing.map((pi) => ({
          trip_id: trip.id,
          item_name: pi.itemName,
          quantity: pi.quantityRequired || 1,
          quantity_packed: pi.quantityPacked || 0,
          is_packed: Boolean(pi.isPacked),
          notes: pi.category || 'General',
        }))
      );
    }
  }
}
