import type { SupabaseClient } from '@supabase/supabase-js';
import { madridTodayIso } from '@/lib/alerts-state';
import { mapPackTripsForTeam } from '@/lib/club-trips';

type UpcomingFixture = {
  match_date: string;
  match_time?: string | null;
  rival: string;
  venue?: string | null;
  home_away?: string | null;
  competition?: string | null;
};

function formatEsDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${Number(d)}/${Number(m)}/${y}`;
}

function keyFor(f: UpcomingFixture): string {
  return `${f.match_date}|${f.rival.trim().toLowerCase()}`;
}

async function fixturesFromOfficialMatches(
  supabase: SupabaseClient,
  teamId: string,
  today: string
): Promise<UpcomingFixture[]> {
  const { data, error } = await supabase
    .from('official_matches')
    .select('match_date, match_time, rival, venue, city, home_away, competition, status')
    .eq('team_id', teamId)
    .eq('is_active', true)
    .gte('match_date', today)
    .order('match_date', { ascending: true })
    .limit(12);

  if (error || !data?.length) return [];
  return (data as Array<Record<string, unknown>>)
    .filter((row) => String(row.status || '') !== 'finalizado')
    .slice(0, 8)
    .map((row) => ({
      match_date: String(row.match_date || '').slice(0, 10),
      match_time: row.match_time ? String(row.match_time).slice(0, 5) : null,
      rival: String(row.rival || 'Rival'),
      venue: (row.venue as string) || (row.city as string) || null,
      home_away: (row.home_away as string) || null,
      competition: (row.competition as string) || null,
    }));
}

function fixturesFromPack(teamId: string): UpcomingFixture[] {
  return mapPackTripsForTeam(teamId)
    .slice(0, 8)
    .map((t) => ({
      match_date: String(t.departureDate || t.returnDate || '').slice(0, 10),
      rival: t.opponent,
      venue: t.destination,
      home_away: null,
      competition: null,
    }))
    .filter((f) => f.match_date && f.rival);
}

/** Crea alertas de partidos/viajes futuros si la bandeja se quedó vacía de eventos. */
export async function ensureUpcomingEventAlerts(
  supabase: SupabaseClient,
  teamId: string
): Promise<void> {
  const today = madridTodayIso();
  let fixtures = await fixturesFromOfficialMatches(supabase, teamId, today);
  if (!fixtures.length) fixtures = fixturesFromPack(teamId);
  if (!fixtures.length) return;

  const { data: existing } = await supabase
    .from('alerts')
    .select('id, type, metadata, is_dismissed')
    .eq('team_id', teamId)
    .eq('type', 'viaje_proximo')
    .eq('is_dismissed', false);

  const have = new Set(
    (existing || []).map((row) => {
      const meta = (row.metadata || {}) as Record<string, unknown>;
      return `${String(meta.match_date || '').slice(0, 10)}|${String(meta.rival || '').trim().toLowerCase()}`;
    })
  );

  const rows = fixtures
    .filter((f) => !have.has(keyFor(f)))
    .map((f) => {
      const where = f.home_away === 'local' ? 'local' : f.home_away === 'visitante' ? 'visitante' : '';
      const when = [formatEsDate(f.match_date), f.match_time].filter(Boolean).join(' ');
      const place = f.venue ? ` · ${f.venue}` : '';
      const comp = f.competition ? ` · ${f.competition}` : '';
      return {
        team_id: teamId,
        type: 'viaje_proximo',
        severity: 'info',
        title: 'Partido próximo',
        message: `${when} · ${where ? `${where} vs ` : ''}${f.rival}${place}${comp}`.replace('·  ·', '·'),
        entity_type: 'official_match',
        is_read: false,
        is_dismissed: false,
        auto_generated: true,
        metadata: {
          match_date: f.match_date,
          rival: f.rival,
          source: 'upcoming_fixture',
        },
      };
    });

  if (!rows.length) return;
  const { error } = await supabase.from('alerts').insert(rows);
  if (error) console.warn('[alerts] upcoming insert failed:', error.message);
}
