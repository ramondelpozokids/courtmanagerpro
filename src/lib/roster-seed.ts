import { initialPlayers } from '@/infrastructure/supabase/repositories/InMemoryDB';
import { DEFAULT_TEAM_ID, demoPlayerIdToUuid } from '@/lib/team-constants';

export interface RosterSeedRow {
  id: string;
  team_id: string;
  dorsal: number;
  full_name: string;
  position: string;
  nationality: string | null;
  birth_date: string | null;
  photo_url: string | null;
  is_active: boolean;
  shirt_size: string | null;
  shorts_size: string | null;
  shoe_size: number | null;
  jacket_size: string | null;
  sock_size: string | null;
  jersey_name: string | null;
  contract_end: string;
  metadata: Record<string, unknown>;
}

function sqlString(value: string | null | undefined): string {
  if (value == null) return 'NULL';
  return `'${value.replace(/'/g, "''")}'`;
}

function sqlJson(value: unknown): string {
  return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`;
}

export function buildRosterSeedRows(): RosterSeedRow[] {
  return initialPlayers.map((player) => ({
    id: demoPlayerIdToUuid(player.id),
    team_id: DEFAULT_TEAM_ID,
    dorsal: player.number,
    full_name: `${player.firstName} ${player.lastName}`,
    position: player.position,
    nationality: player.nationality || 'España',
    birth_date: player.birthDate || null,
    photo_url: player.imageUrl || null,
    is_active: player.status === 'ACTIVE',
    shirt_size: player.sizes?.jersey || null,
    shorts_size: player.sizes?.shorts || null,
    shoe_size: Number(player.sizes?.shoes) || null,
    jacket_size: player.sizes?.warmupShirt || null,
    sock_size: player.sizes?.socks || null,
    jersey_name: player.lastName?.toUpperCase() || null,
    contract_end: '2027-06-30',
    metadata: {
      legacy_id: player.id,
      birth_place: player.birth_place ?? null,
      weight: player.weight ?? null,
      height: player.height ?? null,
      matches_played: player.matches_played ?? null,
      points: player.points ?? null,
      rebounds: player.rebounds ?? null,
      assists: player.assists ?? null,
      minutes_played: player.minutes_played ?? null,
      valuation: player.valuation ?? null,
      debut: player.debut ?? null,
      trajectory: player.trajectory ?? null,
      palmares: player.palmares ?? [],
      profile_url: player.profile_url ?? null,
      action_image: player.actionImage ?? null,
    },
  }));
}

export function buildRosterSeedSql(): string {
  const rows = buildRosterSeedRows();

  const playerValues = rows
    .map((row) => `(
  ${sqlString(row.id)}::uuid,
  ${sqlString(row.team_id)}::uuid,
  ${row.dorsal},
  ${sqlString(row.full_name)},
  ${sqlString(row.position)}::player_position,
  ${sqlString(row.nationality)},
  ${row.birth_date ? sqlString(row.birth_date) : 'NULL'},
  ${sqlString(row.photo_url)},
  ${row.is_active},
  ${sqlString(row.shirt_size)},
  ${sqlString(row.shorts_size)},
  ${row.shoe_size ?? 'NULL'},
  ${sqlString(row.jacket_size)},
  ${sqlString(row.sock_size)},
  ${sqlString(row.jersey_name)},
  ${sqlString(row.contract_end)},
  ${sqlJson(row.metadata)}
)`)
    .join(',\n');

  return `-- CourtManager Pro — Seed plantilla Real Madrid Baloncesto 2025/26
-- Ejecutar en Supabase SQL Editor después de 001 y 002

INSERT INTO teams (id, name, short_name, season, league, primary_color, secondary_color, metadata)
VALUES (
  '${DEFAULT_TEAM_ID}'::uuid,
  'Real Madrid Baloncesto',
  'RMB',
  '2025-2026',
  'ACB',
  '#FFFFFF',
  '#2C3E50',
  '{"legacy_slug":"team-acb-123"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  season = EXCLUDED.season,
  updated_at = NOW();

INSERT INTO players (
  id, team_id, dorsal, full_name, position, nationality, birth_date, photo_url,
  is_active, shirt_size, shorts_size, shoe_size, jacket_size, sock_size,
  jersey_name, contract_end, metadata
)
VALUES
${playerValues}
ON CONFLICT (team_id, dorsal) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  position = EXCLUDED.position,
  nationality = EXCLUDED.nationality,
  birth_date = EXCLUDED.birth_date,
  photo_url = EXCLUDED.photo_url,
  is_active = EXCLUDED.is_active,
  shirt_size = EXCLUDED.shirt_size,
  shorts_size = EXCLUDED.shorts_size,
  shoe_size = EXCLUDED.shoe_size,
  jacket_size = EXCLUDED.jacket_size,
  sock_size = EXCLUDED.sock_size,
  jersey_name = EXCLUDED.jersey_name,
  contract_end = EXCLUDED.contract_end,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();
`;
}
