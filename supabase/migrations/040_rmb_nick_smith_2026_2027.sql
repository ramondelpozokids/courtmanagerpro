-- CourtManager Pro — 040 RMB plantilla oficial 2026-09-19
-- Fuente: https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla
-- Alta: Nick Smith (#1, escolta). Baja: Eli John Ndiaye (#44).
-- El pack embebido (rmb-official-roster.ts) ya refleja esto; esta SQL alinea producción.

-- Liberar dorsal 1 si lo ocupa un inactivo u otro jugador que no sea Smith
UPDATE players
SET dorsal = 91, is_active = false, updated_at = NOW()
WHERE team_id = '00000000-0000-4000-8000-000acb123456'::uuid
  AND dorsal = 1
  AND full_name NOT ILIKE '%nick smith%';

-- Baja Ndiaye (dorsal 44 ya no está en plantilla oficial)
UPDATE players
SET is_active = false,
    dorsal = 944,
    updated_at = NOW()
WHERE team_id = '00000000-0000-4000-8000-000acb123456'::uuid
  AND (
    metadata->>'official_slug' = 'eli-john-ndiaye'
    OR metadata->>'legacy_id' = 'p16'
    OR full_name ILIKE '%ndiaye%'
  );

INSERT INTO players (
  id, team_id, dorsal, full_name, position, nationality, birth_date, photo_url,
  is_active, shirt_size, shorts_size, shoe_size, jacket_size, sock_size,
  jersey_name, metadata
) VALUES (
  '00000000-0000-4000-8000-000000000020'::uuid,
  '00000000-0000-4000-8000-000acb123456'::uuid,
  1,
  'Nick Smith',
  'escolta'::player_position,
  'Estados Unidos',
  '2004-04-18',
  'https://assets.realmadrid.com/is/image/realmadrid/NICK_SMITH_CARITA_1500X2000?$Desktop$&fit=wrap&wid=288&hei=384',
  true,
  'L',
  'L',
  45,
  'L',
  'M',
  'SMITH',
  '{"official_slug":"nick-smith","legacy_id":"p20","source":"realmadrid.com","season":"2026-2027","profile_url":"https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/nick-smith"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  dorsal = EXCLUDED.dorsal,
  full_name = EXCLUDED.full_name,
  position = EXCLUDED.position,
  nationality = EXCLUDED.nationality,
  birth_date = EXCLUDED.birth_date,
  photo_url = EXCLUDED.photo_url,
  is_active = true,
  shirt_size = EXCLUDED.shirt_size,
  shorts_size = EXCLUDED.shorts_size,
  shoe_size = EXCLUDED.shoe_size,
  jacket_size = EXCLUDED.jacket_size,
  sock_size = EXCLUDED.sock_size,
  jersey_name = EXCLUDED.jersey_name,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();
