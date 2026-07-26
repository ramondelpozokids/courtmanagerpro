-- ============================================================
-- CourtManager Pro — 014 Seed RMF (Real Madrid Fútbol) producción
-- Generado desde src/data/clubs/rmf-data.ts
--
-- PREREQUISITO: ejecutar antes 014_rmf_enum_extensions.sql
-- (y confirmar esa query). Si ya corriste los ALTER TYPE en el
-- intento fallido, puedes lanzar solo este archivo.
-- ============================================================

-- Equipo (idempotente)
INSERT INTO teams (id, name, short_name, season, league, primary_color, secondary_color, metadata)
VALUES (
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Real Madrid Fútbol',
  'RMF',
  '2026-2027',
  'LaLiga',
  '#FFFFFF',
  '#FEBE10',
  '{"demoSlug":"rmf","sport":"football"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  season = EXCLUDED.season,
  league = EXCLUDED.league,
  updated_at = NOW();

-- Jugadores (25)
INSERT INTO players (
  id, team_id, dorsal, full_name, position, nationality, birth_date, photo_url,
  is_active, shirt_size, shorts_size, shoe_size, jacket_size, sock_size,
  jersey_name, metadata
) VALUES (
  '00000000-0000-4000-8001-000000000001'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  1,
  'Thibaut Courtois',
  'portero'::player_position,
  'Bélgica',
  '1992-05-11',
  'https://assets.realmadrid.com/is/image/realmadrid/COURTOIS_EQUIPO_CARITA_380x501_26-27?$Desktop$&fit=wrap&wid=400',
  true,
  'XXL',
  'XL',
  46,
  'XXL',
  'XL',
  'COURTOIS',
  '{"official_slug":"thibaut-courtois","demo_id":"p1","profile_url":"https://www.realmadrid.com/es-ES/futbol/primer-equipo-masculino/plantilla/thibaut-courtois"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  dorsal = EXCLUDED.dorsal,
  position = EXCLUDED.position,
  birth_date = EXCLUDED.birth_date,
  photo_url = EXCLUDED.photo_url,
  shirt_size = EXCLUDED.shirt_size,
  shorts_size = EXCLUDED.shorts_size,
  shoe_size = EXCLUDED.shoe_size,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

INSERT INTO players (
  id, team_id, dorsal, full_name, position, nationality, birth_date, photo_url,
  is_active, shirt_size, shorts_size, shoe_size, jacket_size, sock_size,
  jersey_name, metadata
) VALUES (
  '00000000-0000-4000-8001-000000000002'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  13,
  'Andriy Lunin',
  'portero'::player_position,
  'Ucrania',
  '1999-02-11',
  'https://assets.realmadrid.com/is/image/realmadrid/LUNIN_EQUIPO_CARITA_380x501_26-27?$Desktop$&fit=wrap&wid=400',
  true,
  'XL',
  'L',
  45,
  'XL',
  'L',
  'LUNIN',
  '{"official_slug":"andriy-lunin","demo_id":"p2","profile_url":"https://www.realmadrid.com/es-ES/futbol/primer-equipo-masculino/plantilla/andriy-lunin"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  dorsal = EXCLUDED.dorsal,
  position = EXCLUDED.position,
  birth_date = EXCLUDED.birth_date,
  photo_url = EXCLUDED.photo_url,
  shirt_size = EXCLUDED.shirt_size,
  shorts_size = EXCLUDED.shorts_size,
  shoe_size = EXCLUDED.shoe_size,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

INSERT INTO players (
  id, team_id, dorsal, full_name, position, nationality, birth_date, photo_url,
  is_active, shirt_size, shorts_size, shoe_size, jacket_size, sock_size,
  jersey_name, metadata
) VALUES (
  '00000000-0000-4000-8001-000000000003'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  20,
  'Denzel Dumfries',
  'defensa'::player_position,
  'Países Bajos',
  '1996-04-18',
  'https://assets.realmadrid.com/is/image/realmadrid/DUMFRIES_EQUIPO_CARITA_380x501%20%E2%80%93%209%201?$Desktop$&fit=wrap&wid=400',
  true,
  'XL',
  'L',
  45,
  'XL',
  'L',
  'DUMFRIES',
  '{"official_slug":"denzel-dumfries","demo_id":"p3","profile_url":"https://www.realmadrid.com/es-ES/futbol/primer-equipo-masculino/plantilla/denzel-dumfries"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  dorsal = EXCLUDED.dorsal,
  position = EXCLUDED.position,
  birth_date = EXCLUDED.birth_date,
  photo_url = EXCLUDED.photo_url,
  shirt_size = EXCLUDED.shirt_size,
  shorts_size = EXCLUDED.shorts_size,
  shoe_size = EXCLUDED.shoe_size,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

INSERT INTO players (
  id, team_id, dorsal, full_name, position, nationality, birth_date, photo_url,
  is_active, shirt_size, shorts_size, shoe_size, jacket_size, sock_size,
  jersey_name, metadata
) VALUES (
  '00000000-0000-4000-8001-000000000004'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  4,
  'Ibrahima Konaté',
  'defensa'::player_position,
  'Francia',
  '1999-05-25',
  'https://assets.realmadrid.com/is/image/realmadrid/konate_EQUIPO_CARITA_380x501%20%E2%80%93%207%20(1)?$Desktop$&fit=wrap&wid=400',
  true,
  'XXL',
  'XL',
  46,
  'XXL',
  'XL',
  'KONATÉ',
  '{"official_slug":"ibrahima-konate","demo_id":"p4","profile_url":"https://www.realmadrid.com/es-ES/futbol/primer-equipo-masculino/plantilla/ibrahima-konate"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  dorsal = EXCLUDED.dorsal,
  position = EXCLUDED.position,
  birth_date = EXCLUDED.birth_date,
  photo_url = EXCLUDED.photo_url,
  shirt_size = EXCLUDED.shirt_size,
  shorts_size = EXCLUDED.shorts_size,
  shoe_size = EXCLUDED.shoe_size,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

INSERT INTO players (
  id, team_id, dorsal, full_name, position, nationality, birth_date, photo_url,
  is_active, shirt_size, shorts_size, shoe_size, jacket_size, sock_size,
  jersey_name, metadata
) VALUES (
  '00000000-0000-4000-8001-000000000005'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  2,
  'Marc Cucurella',
  'defensa'::player_position,
  'España',
  '1998-07-22',
  'https://assets.realmadrid.com/is/image/realmadrid/CUCURELLA_EQUIPO_CARITA_380x501%20%E2%80%93%206?$Desktop$&fit=wrap&wid=400',
  true,
  'L',
  'L',
  44,
  'L',
  'M',
  'CUCURELLA',
  '{"official_slug":"marc-cucurella-saseta","demo_id":"p5","profile_url":"https://www.realmadrid.com/es-ES/futbol/primer-equipo-masculino/plantilla/marc-cucurella-saseta"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  dorsal = EXCLUDED.dorsal,
  position = EXCLUDED.position,
  birth_date = EXCLUDED.birth_date,
  photo_url = EXCLUDED.photo_url,
  shirt_size = EXCLUDED.shirt_size,
  shorts_size = EXCLUDED.shorts_size,
  shoe_size = EXCLUDED.shoe_size,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

INSERT INTO players (
  id, team_id, dorsal, full_name, position, nationality, birth_date, photo_url,
  is_active, shirt_size, shorts_size, shoe_size, jacket_size, sock_size,
  jersey_name, metadata
) VALUES (
  '00000000-0000-4000-8001-000000000006'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  3,
  'Éder Militão',
  'defensa'::player_position,
  'Brasil',
  '1998-01-18',
  'https://assets.realmadrid.com/is/image/realmadrid/MILITAO_EQUIPO_CARITA_380x501_26-27?$Desktop$&fit=wrap&wid=400',
  true,
  'XL',
  'L',
  45,
  'XL',
  'L',
  'MILITÃO',
  '{"official_slug":"eder-gabriel-militao","demo_id":"p6","profile_url":"https://www.realmadrid.com/es-ES/futbol/primer-equipo-masculino/plantilla/eder-gabriel-militao"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  dorsal = EXCLUDED.dorsal,
  position = EXCLUDED.position,
  birth_date = EXCLUDED.birth_date,
  photo_url = EXCLUDED.photo_url,
  shirt_size = EXCLUDED.shirt_size,
  shorts_size = EXCLUDED.shorts_size,
  shoe_size = EXCLUDED.shoe_size,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

INSERT INTO players (
  id, team_id, dorsal, full_name, position, nationality, birth_date, photo_url,
  is_active, shirt_size, shorts_size, shoe_size, jacket_size, sock_size,
  jersey_name, metadata
) VALUES (
  '00000000-0000-4000-8001-000000000007'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  12,
  'Trent Alexander-Arnold',
  'defensa'::player_position,
  'Inglaterra',
  '1998-10-07',
  'https://assets.realmadrid.com/is/image/realmadrid/TRENT_EQUIPO_CARITA_380x501_26-27?$Desktop$&fit=wrap&wid=400',
  true,
  'L',
  'L',
  44,
  'L',
  'M',
  'ALEXANDER-ARNOLD',
  '{"official_slug":"trent-alexander-arnold","demo_id":"p7","profile_url":"https://www.realmadrid.com/es-ES/futbol/primer-equipo-masculino/plantilla/trent-alexander-arnold"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  dorsal = EXCLUDED.dorsal,
  position = EXCLUDED.position,
  birth_date = EXCLUDED.birth_date,
  photo_url = EXCLUDED.photo_url,
  shirt_size = EXCLUDED.shirt_size,
  shorts_size = EXCLUDED.shorts_size,
  shoe_size = EXCLUDED.shoe_size,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

INSERT INTO players (
  id, team_id, dorsal, full_name, position, nationality, birth_date, photo_url,
  is_active, shirt_size, shorts_size, shoe_size, jacket_size, sock_size,
  jersey_name, metadata
) VALUES (
  '00000000-0000-4000-8001-000000000008'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  17,
  'Raúl Asencio',
  'defensa'::player_position,
  'España',
  '2003-02-13',
  'https://assets.realmadrid.com/is/image/realmadrid/ASENCIO_EQUIPO_CARITA_380x501_26-27?$Desktop$&fit=wrap&wid=400',
  true,
  'L',
  'L',
  44,
  'L',
  'M',
  'ASENCIO',
  '{"official_slug":"raul-asencio-del-rosario","demo_id":"p8","profile_url":"https://www.realmadrid.com/es-ES/futbol/primer-equipo-masculino/plantilla/raul-asencio-del-rosario"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  dorsal = EXCLUDED.dorsal,
  position = EXCLUDED.position,
  birth_date = EXCLUDED.birth_date,
  photo_url = EXCLUDED.photo_url,
  shirt_size = EXCLUDED.shirt_size,
  shorts_size = EXCLUDED.shorts_size,
  shoe_size = EXCLUDED.shoe_size,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

INSERT INTO players (
  id, team_id, dorsal, full_name, position, nationality, birth_date, photo_url,
  is_active, shirt_size, shorts_size, shoe_size, jacket_size, sock_size,
  jersey_name, metadata
) VALUES (
  '00000000-0000-4000-8001-000000000009'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  18,
  'Álvaro Carreras',
  'defensa'::player_position,
  'España',
  '2003-03-23',
  'https://assets.realmadrid.com/is/image/realmadrid/CARRERAS_EQUIPO_CARITA_380x501_26-27?$Desktop$&fit=wrap&wid=400',
  true,
  'L',
  'L',
  44,
  'L',
  'M',
  'CARRERAS',
  '{"official_slug":"alvaro-fernandez-carreras","demo_id":"p9","profile_url":"https://www.realmadrid.com/es-ES/futbol/primer-equipo-masculino/plantilla/alvaro-fernandez-carreras"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  dorsal = EXCLUDED.dorsal,
  position = EXCLUDED.position,
  birth_date = EXCLUDED.birth_date,
  photo_url = EXCLUDED.photo_url,
  shirt_size = EXCLUDED.shirt_size,
  shorts_size = EXCLUDED.shorts_size,
  shoe_size = EXCLUDED.shoe_size,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

INSERT INTO players (
  id, team_id, dorsal, full_name, position, nationality, birth_date, photo_url,
  is_active, shirt_size, shorts_size, shoe_size, jacket_size, sock_size,
  jersey_name, metadata
) VALUES (
  '00000000-0000-4000-8001-000000000010'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  22,
  'Antonio Rüdiger',
  'defensa'::player_position,
  'Alemania',
  '1993-03-03',
  'https://assets.realmadrid.com/is/image/realmadrid/RUDIGUER_EQUIPO_CARITA_380x501_26-27?$Desktop$&fit=wrap&wid=400',
  true,
  'XXL',
  'XL',
  46,
  'XXL',
  'XL',
  'RÜDIGER',
  '{"official_slug":"antonio-rudiger","demo_id":"p10","profile_url":"https://www.realmadrid.com/es-ES/futbol/primer-equipo-masculino/plantilla/antonio-rudiger"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  dorsal = EXCLUDED.dorsal,
  position = EXCLUDED.position,
  birth_date = EXCLUDED.birth_date,
  photo_url = EXCLUDED.photo_url,
  shirt_size = EXCLUDED.shirt_size,
  shorts_size = EXCLUDED.shorts_size,
  shoe_size = EXCLUDED.shoe_size,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

INSERT INTO players (
  id, team_id, dorsal, full_name, position, nationality, birth_date, photo_url,
  is_active, shirt_size, shorts_size, shoe_size, jacket_size, sock_size,
  jersey_name, metadata
) VALUES (
  '00000000-0000-4000-8001-000000000011'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  23,
  'Ferland Mendy',
  'defensa'::player_position,
  'Francia',
  '1995-06-08',
  'https://assets.realmadrid.com/is/image/realmadrid/MENDY_EQUIPO_CARITA_380x501_26-27?$Desktop$&fit=wrap&wid=400',
  true,
  'L',
  'L',
  44,
  'L',
  'M',
  'MENDY',
  '{"official_slug":"ferland-mendy","demo_id":"p11","profile_url":"https://www.realmadrid.com/es-ES/futbol/primer-equipo-masculino/plantilla/ferland-mendy"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  dorsal = EXCLUDED.dorsal,
  position = EXCLUDED.position,
  birth_date = EXCLUDED.birth_date,
  photo_url = EXCLUDED.photo_url,
  shirt_size = EXCLUDED.shirt_size,
  shorts_size = EXCLUDED.shorts_size,
  shoe_size = EXCLUDED.shoe_size,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

INSERT INTO players (
  id, team_id, dorsal, full_name, position, nationality, birth_date, photo_url,
  is_active, shirt_size, shorts_size, shoe_size, jacket_size, sock_size,
  jersey_name, metadata
) VALUES (
  '00000000-0000-4000-8001-000000000012'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  24,
  'Dean Huijsen',
  'defensa'::player_position,
  'España',
  '2005-04-14',
  'https://assets.realmadrid.com/is/image/realmadrid/DEAN_EQUIPO_CARITA_380x501_26-27?$Desktop$&fit=wrap&wid=400',
  true,
  'XL',
  'L',
  45,
  'XL',
  'L',
  'HUIJSEN',
  '{"official_slug":"dean-huijsen","demo_id":"p12","profile_url":"https://www.realmadrid.com/es-ES/futbol/primer-equipo-masculino/plantilla/dean-huijsen"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  dorsal = EXCLUDED.dorsal,
  position = EXCLUDED.position,
  birth_date = EXCLUDED.birth_date,
  photo_url = EXCLUDED.photo_url,
  shirt_size = EXCLUDED.shirt_size,
  shorts_size = EXCLUDED.shorts_size,
  shoe_size = EXCLUDED.shoe_size,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

INSERT INTO players (
  id, team_id, dorsal, full_name, position, nationality, birth_date, photo_url,
  is_active, shirt_size, shorts_size, shoe_size, jacket_size, sock_size,
  jersey_name, metadata
) VALUES (
  '00000000-0000-4000-8001-000000000013'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  19,
  'Bernardo Silva',
  'centrocampista'::player_position,
  'Portugal',
  '1994-08-10',
  'https://assets.realmadrid.com/is/image/realmadrid/BERNARDO%20SILVA_EQUIPO_CARITA_380x501%20%E2%80%93%2010?$Desktop$&fit=wrap&wid=400',
  true,
  'M',
  'M',
  42,
  'M',
  'M',
  'SILVA',
  '{"official_slug":"bernardo-silva","demo_id":"p13","profile_url":"https://www.realmadrid.com/es-ES/futbol/primer-equipo-masculino/plantilla/bernardo-silva"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  dorsal = EXCLUDED.dorsal,
  position = EXCLUDED.position,
  birth_date = EXCLUDED.birth_date,
  photo_url = EXCLUDED.photo_url,
  shirt_size = EXCLUDED.shirt_size,
  shorts_size = EXCLUDED.shorts_size,
  shoe_size = EXCLUDED.shoe_size,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

INSERT INTO players (
  id, team_id, dorsal, full_name, position, nationality, birth_date, photo_url,
  is_active, shirt_size, shorts_size, shoe_size, jacket_size, sock_size,
  jersey_name, metadata
) VALUES (
  '00000000-0000-4000-8001-000000000014'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  5,
  'Jude Bellingham',
  'centrocampista'::player_position,
  'Inglaterra',
  '2003-06-29',
  'https://assets.realmadrid.com/is/image/realmadrid/BELLINGHAM_EQUIPO_CARITA_550X650_26-27?$Desktop$&fit=wrap&wid=400',
  true,
  'XL',
  'L',
  45,
  'XL',
  'L',
  'BELLINGHAM',
  '{"official_slug":"jude-bellingham","demo_id":"p14","profile_url":"https://www.realmadrid.com/es-ES/futbol/primer-equipo-masculino/plantilla/jude-bellingham"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  dorsal = EXCLUDED.dorsal,
  position = EXCLUDED.position,
  birth_date = EXCLUDED.birth_date,
  photo_url = EXCLUDED.photo_url,
  shirt_size = EXCLUDED.shirt_size,
  shorts_size = EXCLUDED.shorts_size,
  shoe_size = EXCLUDED.shoe_size,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

INSERT INTO players (
  id, team_id, dorsal, full_name, position, nationality, birth_date, photo_url,
  is_active, shirt_size, shorts_size, shoe_size, jacket_size, sock_size,
  jersey_name, metadata
) VALUES (
  '00000000-0000-4000-8001-000000000015'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  6,
  'Eduardo Camavinga',
  'centrocampista'::player_position,
  'Francia',
  '2002-11-10',
  'https://assets.realmadrid.com/is/image/realmadrid/CAMAVINGA_EQUIPO_CARITA_550X650_26-27?$Desktop$&fit=wrap&wid=400',
  true,
  'L',
  'L',
  44,
  'L',
  'M',
  'CAMAVINGA',
  '{"official_slug":"eduardo-camavinga","demo_id":"p15","profile_url":"https://www.realmadrid.com/es-ES/futbol/primer-equipo-masculino/plantilla/eduardo-camavinga"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  dorsal = EXCLUDED.dorsal,
  position = EXCLUDED.position,
  birth_date = EXCLUDED.birth_date,
  photo_url = EXCLUDED.photo_url,
  shirt_size = EXCLUDED.shirt_size,
  shorts_size = EXCLUDED.shorts_size,
  shoe_size = EXCLUDED.shoe_size,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

INSERT INTO players (
  id, team_id, dorsal, full_name, position, nationality, birth_date, photo_url,
  is_active, shirt_size, shorts_size, shoe_size, jacket_size, sock_size,
  jersey_name, metadata
) VALUES (
  '00000000-0000-4000-8001-000000000016'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  8,
  'Federico Valverde',
  'centrocampista'::player_position,
  'Uruguay',
  '1998-07-22',
  'https://assets.realmadrid.com/is/image/realmadrid/VALVERDE_EQUIPO_CARITA_380x501_26-27?$Desktop$&fit=wrap&wid=400',
  true,
  'L',
  'L',
  44,
  'L',
  'M',
  'VALVERDE',
  '{"official_slug":"federico-santiago-valverde-dipetta","demo_id":"p16","profile_url":"https://www.realmadrid.com/es-ES/futbol/primer-equipo-masculino/plantilla/federico-santiago-valverde-dipetta"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  dorsal = EXCLUDED.dorsal,
  position = EXCLUDED.position,
  birth_date = EXCLUDED.birth_date,
  photo_url = EXCLUDED.photo_url,
  shirt_size = EXCLUDED.shirt_size,
  shorts_size = EXCLUDED.shorts_size,
  shoe_size = EXCLUDED.shoe_size,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

INSERT INTO players (
  id, team_id, dorsal, full_name, position, nationality, birth_date, photo_url,
  is_active, shirt_size, shorts_size, shoe_size, jacket_size, sock_size,
  jersey_name, metadata
) VALUES (
  '00000000-0000-4000-8001-000000000017'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  14,
  'Aurélien Tchouaméni',
  'centrocampista'::player_position,
  'Francia',
  '2000-01-27',
  'https://assets.realmadrid.com/is/image/realmadrid/TCHOUAMENI_EQUIPO_CARITA_380x501_26-27?$Desktop$&fit=wrap&wid=400',
  true,
  'XL',
  'L',
  45,
  'XL',
  'L',
  'TCHOUAMÉNI',
  '{"official_slug":"aurelien-tchouameni","demo_id":"p17","profile_url":"https://www.realmadrid.com/es-ES/futbol/primer-equipo-masculino/plantilla/aurelien-tchouameni"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  dorsal = EXCLUDED.dorsal,
  position = EXCLUDED.position,
  birth_date = EXCLUDED.birth_date,
  photo_url = EXCLUDED.photo_url,
  shirt_size = EXCLUDED.shirt_size,
  shorts_size = EXCLUDED.shorts_size,
  shoe_size = EXCLUDED.shoe_size,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

INSERT INTO players (
  id, team_id, dorsal, full_name, position, nationality, birth_date, photo_url,
  is_active, shirt_size, shorts_size, shoe_size, jacket_size, sock_size,
  jersey_name, metadata
) VALUES (
  '00000000-0000-4000-8001-000000000018'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  15,
  'Arda Güler',
  'centrocampista'::player_position,
  'Turquía',
  '2005-02-25',
  'https://assets.realmadrid.com/is/image/realmadrid/ARDA_EQUIPO_CARITA_380x501_26-27?$Desktop$&fit=wrap&wid=400',
  true,
  'M',
  'M',
  42,
  'M',
  'M',
  'GÜLER',
  '{"official_slug":"arda-guler","demo_id":"p18","profile_url":"https://www.realmadrid.com/es-ES/futbol/primer-equipo-masculino/plantilla/arda-guler"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  dorsal = EXCLUDED.dorsal,
  position = EXCLUDED.position,
  birth_date = EXCLUDED.birth_date,
  photo_url = EXCLUDED.photo_url,
  shirt_size = EXCLUDED.shirt_size,
  shorts_size = EXCLUDED.shorts_size,
  shoe_size = EXCLUDED.shoe_size,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

INSERT INTO players (
  id, team_id, dorsal, full_name, position, nationality, birth_date, photo_url,
  is_active, shirt_size, shorts_size, shoe_size, jacket_size, sock_size,
  jersey_name, metadata
) VALUES (
  '00000000-0000-4000-8001-000000000019'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  7,
  'Vinícius Júnior',
  'delantero'::player_position,
  'Brasil',
  '2000-07-12',
  'https://assets.realmadrid.com/is/image/realmadrid/VINI_EQUIPO_CARITA_380x501_26-27?$Desktop$&fit=wrap&wid=400',
  true,
  'L',
  'L',
  44,
  'L',
  'M',
  'JÚNIOR',
  '{"official_slug":"vinicius-paixao-de-oliveira-junior","demo_id":"p19","profile_url":"https://www.realmadrid.com/es-ES/futbol/primer-equipo-masculino/plantilla/vinicius-paixao-de-oliveira-junior"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  dorsal = EXCLUDED.dorsal,
  position = EXCLUDED.position,
  birth_date = EXCLUDED.birth_date,
  photo_url = EXCLUDED.photo_url,
  shirt_size = EXCLUDED.shirt_size,
  shorts_size = EXCLUDED.shorts_size,
  shoe_size = EXCLUDED.shoe_size,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

INSERT INTO players (
  id, team_id, dorsal, full_name, position, nationality, birth_date, photo_url,
  is_active, shirt_size, shorts_size, shoe_size, jacket_size, sock_size,
  jersey_name, metadata
) VALUES (
  '00000000-0000-4000-8001-000000000020'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  10,
  'Kylian Mbappé',
  'delantero'::player_position,
  'Francia',
  '1998-12-20',
  'https://assets.realmadrid.com/is/image/realmadrid/MBAPPE_EQUIPO_CARITA_380x501_26-27?$Desktop$&fit=wrap&wid=400',
  true,
  'L',
  'L',
  44,
  'L',
  'M',
  'MBAPPÉ',
  '{"official_slug":"kylian-mbappe","demo_id":"p20","profile_url":"https://www.realmadrid.com/es-ES/futbol/primer-equipo-masculino/plantilla/kylian-mbappe"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  dorsal = EXCLUDED.dorsal,
  position = EXCLUDED.position,
  birth_date = EXCLUDED.birth_date,
  photo_url = EXCLUDED.photo_url,
  shirt_size = EXCLUDED.shirt_size,
  shorts_size = EXCLUDED.shorts_size,
  shoe_size = EXCLUDED.shoe_size,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

INSERT INTO players (
  id, team_id, dorsal, full_name, position, nationality, birth_date, photo_url,
  is_active, shirt_size, shorts_size, shoe_size, jacket_size, sock_size,
  jersey_name, metadata
) VALUES (
  '00000000-0000-4000-8001-000000000021'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  11,
  'Rodrygo Goes',
  'delantero'::player_position,
  'Brasil',
  '2001-01-09',
  'https://assets.realmadrid.com/is/image/realmadrid/RODRYGO_EQUIPO_CARITA_380x501_26-27?$Desktop$&fit=wrap&wid=400',
  true,
  'L',
  'L',
  44,
  'L',
  'M',
  'GOES',
  '{"official_slug":"rodrygo-goes","demo_id":"p21","profile_url":"https://www.realmadrid.com/es-ES/futbol/primer-equipo-masculino/plantilla/rodrygo-goes"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  dorsal = EXCLUDED.dorsal,
  position = EXCLUDED.position,
  birth_date = EXCLUDED.birth_date,
  photo_url = EXCLUDED.photo_url,
  shirt_size = EXCLUDED.shirt_size,
  shorts_size = EXCLUDED.shorts_size,
  shoe_size = EXCLUDED.shoe_size,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

INSERT INTO players (
  id, team_id, dorsal, full_name, position, nationality, birth_date, photo_url,
  is_active, shirt_size, shorts_size, shoe_size, jacket_size, sock_size,
  jersey_name, metadata
) VALUES (
  '00000000-0000-4000-8001-000000000022'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  16,
  'Gonzalo García',
  'delantero'::player_position,
  'España',
  '2004-03-24',
  'https://assets.realmadrid.com/is/image/realmadrid/GONZALO_EQUIPO_CARITA_380x501_26-27?$Desktop$&fit=wrap&wid=400',
  true,
  'L',
  'L',
  44,
  'L',
  'M',
  'GARCÍA',
  '{"official_slug":"gonzalo-garcia-torres","demo_id":"p22","profile_url":"https://www.realmadrid.com/es-ES/futbol/primer-equipo-masculino/plantilla/gonzalo-garcia-torres"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  dorsal = EXCLUDED.dorsal,
  position = EXCLUDED.position,
  birth_date = EXCLUDED.birth_date,
  photo_url = EXCLUDED.photo_url,
  shirt_size = EXCLUDED.shirt_size,
  shorts_size = EXCLUDED.shorts_size,
  shoe_size = EXCLUDED.shoe_size,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

INSERT INTO players (
  id, team_id, dorsal, full_name, position, nationality, birth_date, photo_url,
  is_active, shirt_size, shorts_size, shoe_size, jacket_size, sock_size,
  jersey_name, metadata
) VALUES (
  '00000000-0000-4000-8001-000000000023'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  21,
  'Brahim Díaz',
  'delantero'::player_position,
  'Marruecos',
  '1999-08-03',
  'https://assets.realmadrid.com/is/image/realmadrid/BRAHIM_EQUIPO_CARITA_380x501_26-27?$Desktop$&fit=wrap&wid=400',
  true,
  'M',
  'M',
  42,
  'M',
  'M',
  'DÍAZ',
  '{"official_slug":"brahim-diaz","demo_id":"p23","profile_url":"https://www.realmadrid.com/es-ES/futbol/primer-equipo-masculino/plantilla/brahim-diaz"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  dorsal = EXCLUDED.dorsal,
  position = EXCLUDED.position,
  birth_date = EXCLUDED.birth_date,
  photo_url = EXCLUDED.photo_url,
  shirt_size = EXCLUDED.shirt_size,
  shorts_size = EXCLUDED.shorts_size,
  shoe_size = EXCLUDED.shoe_size,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

INSERT INTO players (
  id, team_id, dorsal, full_name, position, nationality, birth_date, photo_url,
  is_active, shirt_size, shorts_size, shoe_size, jacket_size, sock_size,
  jersey_name, metadata
) VALUES (
  '00000000-0000-4000-8001-000000000024'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  30,
  'Franco Mastantuono',
  'delantero'::player_position,
  'Argentina',
  '2007-08-14',
  'https://assets.realmadrid.com/is/image/realmadrid/FRANCO_EQUIPO_CARITA_380x501_26-27?$Desktop$&fit=wrap&wid=400',
  true,
  'L',
  'L',
  44,
  'L',
  'M',
  'MASTANTUONO',
  '{"official_slug":"franco-mastantuono","demo_id":"p24","profile_url":"https://www.realmadrid.com/es-ES/futbol/primer-equipo-masculino/plantilla/franco-mastantuono"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  dorsal = EXCLUDED.dorsal,
  position = EXCLUDED.position,
  birth_date = EXCLUDED.birth_date,
  photo_url = EXCLUDED.photo_url,
  shirt_size = EXCLUDED.shirt_size,
  shorts_size = EXCLUDED.shorts_size,
  shoe_size = EXCLUDED.shoe_size,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

INSERT INTO players (
  id, team_id, dorsal, full_name, position, nationality, birth_date, photo_url,
  is_active, shirt_size, shorts_size, shoe_size, jacket_size, sock_size,
  jersey_name, metadata
) VALUES (
  '00000000-0000-4000-8001-000000000025'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  9,
  'Endrick Felipe',
  'delantero'::player_position,
  'Brasil',
  '2006-07-21',
  'https://assets.realmadrid.com/is/image/realmadrid/ENDRICK_EQUIPO_CARITA_380x501_26-27?$Desktop$&fit=wrap&wid=400',
  true,
  'L',
  'L',
  44,
  'L',
  'M',
  'FELIPE',
  '{"official_slug":"endrick-felipe-moreira-de-sousa","demo_id":"p25","profile_url":"https://www.realmadrid.com/es-ES/futbol/primer-equipo-masculino/plantilla/endrick-felipe-moreira-de-sousa"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  dorsal = EXCLUDED.dorsal,
  position = EXCLUDED.position,
  birth_date = EXCLUDED.birth_date,
  photo_url = EXCLUDED.photo_url,
  shirt_size = EXCLUDED.shirt_size,
  shorts_size = EXCLUDED.shorts_size,
  shoe_size = EXCLUDED.shoe_size,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

-- Cuerpo técnico (9)
INSERT INTO coaching_staff (
  id, team_id, full_name, role, email, nationality, photo_url,
  shirt_size, shorts_size, shoe_size, is_active, notes
) VALUES (
  '00000000-0000-4000-8002-000000000001'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'José Mourinho',
  'Entrenador',
  'mourinho@realmadrid.com',
  'Portugal',
  'https://assets.realmadrid.com/is/image/realmadrid/Mourinho_EQUIPO_CARITA_380x501%20%E2%80%93%201?$Desktop$&fit=wrap&wid=400',
  'L',
  'L',
  43,
  true,
  '{"official_slug":"jose-mourinho","demo_id":"c1"}'
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  photo_url = EXCLUDED.photo_url,
  updated_at = NOW();

INSERT INTO coaching_staff (
  id, team_id, full_name, role, email, nationality, photo_url,
  shirt_size, shorts_size, shoe_size, is_active, notes
) VALUES (
  '00000000-0000-4000-8002-000000000002'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'João Tralhão',
  'Segundo entrenador',
  'jtralhao@realmadrid.com',
  'Portugal',
  'https://assets.realmadrid.com/is/image/realmadrid/JOAO%20TRAVALHO%202%20ENTRENADOR_EQUIPO_CARITA_380x501%20%E2%80%93%203?$Desktop$&fit=wrap&wid=400',
  'L',
  'L',
  43,
  true,
  '{"official_slug":"joao-tralhao","demo_id":"c2"}'
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  photo_url = EXCLUDED.photo_url,
  updated_at = NOW();

INSERT INTO coaching_staff (
  id, team_id, full_name, role, email, nationality, photo_url,
  shirt_size, shorts_size, shoe_size, is_active, notes
) VALUES (
  '00000000-0000-4000-8002-000000000003'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Pedro Machado',
  'Asistente técnico',
  'pmachado@realmadrid.com',
  'Portugal',
  'https://assets.realmadrid.com/is/image/realmadrid/PEDRO%20MACHADO%20ASISTENTE%20TECNICO%20_EQUIPO_CARITA_380x501%20%E2%80%93%205?$Desktop$&fit=wrap&wid=400',
  'L',
  'L',
  43,
  true,
  '{"official_slug":"pedro-machado","demo_id":"c3"}'
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  photo_url = EXCLUDED.photo_url,
  updated_at = NOW();

INSERT INTO coaching_staff (
  id, team_id, full_name, role, email, nationality, photo_url,
  shirt_size, shorts_size, shoe_size, is_active, notes
) VALUES (
  '00000000-0000-4000-8002-000000000004'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Sami Khedira',
  'Asistente técnico',
  'skhedira@realmadrid.com',
  'Alemania',
  'https://assets.realmadrid.com/is/image/realmadrid/SAMI%20KHEDIRA%20ASISTENTE%20TECNICO_EQUIPO_CARITA_380x501%20%E2%80%93%208?$Desktop$&fit=wrap&wid=400',
  'XL',
  'L',
  44,
  true,
  '{"official_slug":"sami-khedira","demo_id":"c4"}'
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  photo_url = EXCLUDED.photo_url,
  updated_at = NOW();

INSERT INTO coaching_staff (
  id, team_id, full_name, role, email, nationality, photo_url,
  shirt_size, shorts_size, shoe_size, is_active, notes
) VALUES (
  '00000000-0000-4000-8002-000000000005'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Nuno Santos',
  'Entrenador porteros',
  'nsantos@realmadrid.com',
  'Portugal',
  'https://assets.realmadrid.com/is/image/realmadrid/NUNO%20SANTOS%20PREPARADOR%20FISICO_EQUIPO_CARITA_380x501%20%E2%80%93%204?$Desktop$&fit=wrap&wid=400',
  'L',
  'L',
  43,
  true,
  '{"official_slug":"nuno-santos","demo_id":"c5"}'
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  photo_url = EXCLUDED.photo_url,
  updated_at = NOW();

INSERT INTO coaching_staff (
  id, team_id, full_name, role, email, nationality, photo_url,
  shirt_size, shorts_size, shoe_size, is_active, notes
) VALUES (
  '00000000-0000-4000-8002-000000000006'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Antonio Dias',
  'Preparador físico',
  'adias@realmadrid.com',
  'Portugal',
  'https://assets.realmadrid.com/is/image/realmadrid/ANTONIO%20DIAS%20PREPARADOR%20FISICO_EQUIPO_CARITA_380x501%20%E2%80%93%202?$Desktop$&fit=wrap&wid=400',
  'L',
  'L',
  43,
  true,
  '{"official_slug":"antonio-dias","demo_id":"c6"}'
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  photo_url = EXCLUDED.photo_url,
  updated_at = NOW();

INSERT INTO coaching_staff (
  id, team_id, full_name, role, email, nationality, photo_url,
  shirt_size, shorts_size, shoe_size, is_active, notes
) VALUES (
  '00000000-0000-4000-8002-000000000007'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Antonio Pintus',
  'Preparador físico',
  'apintus@realmadrid.com',
  'Italia',
  'https://assets.realmadrid.com/is/image/realmadrid/PINTUS_2%20_EQUIPO_CARITA_380x501%20%E2%80%93%206?$Desktop$&fit=wrap&wid=400',
  'L',
  'L',
  43,
  true,
  '{"official_slug":"antonio-pintus","demo_id":"c7"}'
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  photo_url = EXCLUDED.photo_url,
  updated_at = NOW();

INSERT INTO coaching_staff (
  id, team_id, full_name, role, email, nationality, photo_url,
  shirt_size, shorts_size, shoe_size, is_active, notes
) VALUES (
  '00000000-0000-4000-8002-000000000008'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Sandro Carriço',
  'Sports Sciences',
  'scarrico@realmadrid.com',
  'Portugal',
  'https://assets.realmadrid.com/is/image/realmadrid/SANDRO%20CARRI%C3%87O_EQUIPO_CARITA_380x501%20%E2%80%93%209?$Desktop$&fit=wrap&wid=400',
  'L',
  'L',
  43,
  true,
  '{"official_slug":"sandro-carrico","demo_id":"c8"}'
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  photo_url = EXCLUDED.photo_url,
  updated_at = NOW();

INSERT INTO coaching_staff (
  id, team_id, full_name, role, email, nationality, photo_url,
  shirt_size, shorts_size, shoe_size, is_active, notes
) VALUES (
  '00000000-0000-4000-8002-000000000009'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Roberto Merella',
  'Analista jefe',
  'rmerella@realmadrid.com',
  'Italia',
  'https://assets.realmadrid.com/is/image/realmadrid/ROBETO%20MERELLA%20ANALISTA_EQUIPO_CARITA_380x501%20%E2%80%93%207?$Desktop$&fit=wrap&wid=400',
  'M',
  'M',
  42,
  true,
  '{"official_slug":"roberto-merella","demo_id":"c9"}'
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  photo_url = EXCLUDED.photo_url,
  updated_at = NOW();

-- Inventario (26)
INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8003-000000000001'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Camiseta Hombre Primera Equipación Blanca 26/27',
  'camiseta_juego'::item_category,
  'RMCFMZ094101',
  'RMCFMZ094101-RMF',
  80,
  52,
  20,
  'L',
  100,
  'Ciudad Real Madrid — Almacén Equipaciones Hombre',
  'https://cdn.shopify.com/s/files/1/0985/4143/7258/files/JZ7206_01.jpg?v=1779796394',
  true,
  '{"demo_id":"i1","gender":"masculino","source":"shop.realmadrid.com"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  image_url = EXCLUDED.image_url,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8003-000000000002'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Camiseta Authentic Hombre Primera Equipación Blanca 26/27',
  'camiseta_juego'::item_category,
  'RMCFMZ094201',
  'RMCFMZ094201-RMF',
  40,
  28,
  12,
  'L',
  150,
  'Ciudad Real Madrid — Almacén Equipaciones Hombre',
  'https://cdn.shopify.com/s/files/1/0985/4143/7258/files/JZ7218_01.jpg?v=1779796490',
  true,
  '{"demo_id":"i2","gender":"masculino","source":"shop.realmadrid.com"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  image_url = EXCLUDED.image_url,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8003-000000000003'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Camiseta Hombre Manga Larga Primera Equipación Blanca 26/27',
  'camiseta_juego'::item_category,
  'RMCFMZ094401',
  'RMCFMZ094401-RMF',
  36,
  24,
  10,
  'L',
  110,
  'Ciudad Real Madrid — Almacén Equipaciones Hombre',
  'https://cdn.shopify.com/s/files/1/0985/4143/7258/files/KC3952_01.jpg?v=1779726360',
  true,
  '{"demo_id":"i3","gender":"masculino","source":"shop.realmadrid.com"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  image_url = EXCLUDED.image_url,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8003-000000000004'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Camiseta Authentic Hombre Manga Larga Primera Equipación Blanca 26/27',
  'camiseta_juego'::item_category,
  'RMCFMZ094301',
  'RMCFMZ094301-RMF',
  24,
  16,
  8,
  'L',
  160,
  'Ciudad Real Madrid — Almacén Equipaciones Hombre',
  'https://cdn.shopify.com/s/files/1/0985/4143/7258/files/KC3943_01.jpg?v=1779725574',
  true,
  '{"demo_id":"i4","gender":"masculino","source":"shop.realmadrid.com"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  image_url = EXCLUDED.image_url,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8003-000000000005'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Pantalón Corto Hombre Authentic Primera Equipación 26/27 Blanco',
  'pantalon_juego'::item_category,
  'RMCFMP040801',
  'RMCFMP040801-RMF',
  75,
  50,
  18,
  'L',
  55,
  'Ciudad Real Madrid — Almacén Equipaciones Hombre',
  'https://cdn.shopify.com/s/files/1/0985/4143/7258/files/JZ7208_1_APPAREL_Photography_FrontCenterView_white_7d5f9038-d01e-4757-ae27-d0c9e0b9a991.jpg?v=1779788770',
  true,
  '{"demo_id":"i5","gender":"masculino","source":"shop.realmadrid.com"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  image_url = EXCLUDED.image_url,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8003-000000000006'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Medias Primera Equipación Blanca 26/27',
  'calcetines'::item_category,
  'RMCFMF025800',
  'RMCFMF025800-RMF',
  120,
  90,
  30,
  'L',
  23,
  'Ciudad Real Madrid — Almacén Equipaciones Hombre',
  'https://cdn.shopify.com/s/files/1/0985/4143/7258/files/KB9778_1_HARDWARE_Photography_SideCenterView_white.jpg?v=1779725491',
  true,
  '{"demo_id":"i6","gender":"masculino","source":"shop.realmadrid.com"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  image_url = EXCLUDED.image_url,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8003-000000000007'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Camiseta Portero Hombre Negra 26/27',
  'camiseta_juego'::item_category,
  'RMCFMZ094001',
  'RMCFMZ094001-RMF',
  16,
  10,
  4,
  'XL',
  100,
  'Ciudad Real Madrid — Almacén Equipaciones Hombre',
  'https://cdn.shopify.com/s/files/1/0985/4143/7258/files/KC3988_1_APPAREL_Photography_FrontCenterView_white.jpg?v=1779788582',
  true,
  '{"demo_id":"i7","gender":"masculino","source":"shop.realmadrid.com"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  image_url = EXCLUDED.image_url,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8003-000000000008'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Pantalón Hombre Portero Negro 26/27',
  'pantalon_juego'::item_category,
  'RMCFMP040601',
  'RMCFMP040601-RMF',
  16,
  11,
  4,
  'XL',
  45,
  'Ciudad Real Madrid — Almacén Equipaciones Hombre',
  'https://cdn.shopify.com/s/files/1/0985/4143/7258/files/KE8558_1_APPAREL_Photography_FrontCenterView_white.jpg?v=1779788671',
  true,
  '{"demo_id":"i8","gender":"masculino","source":"shop.realmadrid.com"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  image_url = EXCLUDED.image_url,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8003-000000000009'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Camiseta Hombre Segunda Equipación Verde 26/27',
  'camiseta_juego'::item_category,
  'RMCFMZ093501',
  'RMCFMZ093501-RMF',
  70,
  48,
  18,
  'L',
  100,
  'Ciudad Real Madrid — Almacén Equipaciones Hombre',
  'https://cdn.shopify.com/s/files/1/0985/4143/7258/files/away_replica_df1c66dc-d245-4326-868c-b8d024cc740b.jpg?v=1784797396',
  true,
  '{"demo_id":"i9","gender":"masculino","source":"shop.realmadrid.com"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  image_url = EXCLUDED.image_url,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8003-000000000010'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Camiseta Authentic Hombre Segunda Equipación Verde 26/27',
  'camiseta_juego'::item_category,
  'RMCFMZ093601',
  'RMCFMZ093601-RMF',
  36,
  22,
  10,
  'L',
  150,
  'Ciudad Real Madrid — Almacén Equipaciones Hombre',
  'https://cdn.shopify.com/s/files/1/0985/4143/7258/files/away_authentic_212ead93-85c4-4f0d-9aec-5b4405cf7251.jpg?v=1784796579',
  true,
  '{"demo_id":"i10","gender":"masculino","source":"shop.realmadrid.com"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  image_url = EXCLUDED.image_url,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8003-000000000011'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Camiseta Hombre Manga Larga Segunda Equipación Verde 26/27',
  'camiseta_juego'::item_category,
  'RMCFMZ093701',
  'RMCFMZ093701-RMF',
  30,
  18,
  8,
  'L',
  110,
  'Ciudad Real Madrid — Almacén Equipaciones Hombre',
  'https://cdn.shopify.com/s/files/1/0985/4143/7258/files/KC3970_2_APPAREL_Photography_FrontCenterView_white.jpg?v=1783680686',
  true,
  '{"demo_id":"i11","gender":"masculino","source":"shop.realmadrid.com"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  image_url = EXCLUDED.image_url,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8003-000000000012'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Camiseta Authentic Hombre Manga Larga Segunda Equipación Verde 26/27',
  'camiseta_juego'::item_category,
  'RMCFMZ093801',
  'RMCFMZ093801-RMF',
  20,
  12,
  6,
  'L',
  160,
  'Ciudad Real Madrid — Almacén Equipaciones Hombre',
  'https://cdn.shopify.com/s/files/1/0985/4143/7258/files/RMCFMZ0938_01.jpg?v=1784101394',
  true,
  '{"demo_id":"i12","gender":"masculino","source":"shop.realmadrid.com"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  image_url = EXCLUDED.image_url,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8003-000000000013'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Pantalón Corto Hombre Authentic Segunda Equipación 26/27 Verde',
  'pantalon_juego'::item_category,
  'RMCFMP040401',
  'RMCFMP040401-RMF',
  70,
  46,
  16,
  'L',
  55,
  'Ciudad Real Madrid — Almacén Equipaciones Hombre',
  'https://cdn.shopify.com/s/files/1/0985/4143/7258/files/JZ7210_1_APPAREL_Photography_FrontCenterView_white.jpg?v=1783588240',
  true,
  '{"demo_id":"i13","gender":"masculino","source":"shop.realmadrid.com"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  image_url = EXCLUDED.image_url,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8003-000000000014'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Medias Segunda Equipación Verde 26/27',
  'calcetines'::item_category,
  'RMCFMF025700',
  'RMCFMF025700-RMF',
  110,
  78,
  28,
  'L',
  23,
  'Ciudad Real Madrid — Almacén Equipaciones Hombre',
  'https://cdn.shopify.com/s/files/1/0985/4143/7258/files/KB9780_1_HARDWARE_Photography_SideCenterView_white.jpg?v=1783582670',
  true,
  '{"demo_id":"i14","gender":"masculino","source":"shop.realmadrid.com"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  image_url = EXCLUDED.image_url,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8003-000000000015'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Camiseta Portero Hombre Azul 26/27',
  'camiseta_juego'::item_category,
  'RMCFMZ093901',
  'RMCFMZ093901-RMF',
  14,
  8,
  4,
  'XL',
  100,
  'Ciudad Real Madrid — Almacén Equipaciones Hombre',
  'https://cdn.shopify.com/s/files/1/0985/4143/7258/files/RMCFMZ0939_01.jpg?v=1784125703',
  true,
  '{"demo_id":"i15","gender":"masculino","source":"shop.realmadrid.com"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  image_url = EXCLUDED.image_url,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8003-000000000016'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Pantalón Hombre Portero Azul 26/27',
  'pantalon_juego'::item_category,
  'RMCFMP040701',
  'RMCFMP040701-RMF',
  14,
  9,
  4,
  'XL',
  45,
  'Ciudad Real Madrid — Almacén Equipaciones Hombre',
  'https://cdn.shopify.com/s/files/1/0985/4143/7258/files/KC3987_5_APPAREL_Photography_StandardBottomPartView_white_3075dabc-37f0-427e-a7fa-00faae3f8bd5.jpg?v=1783588736',
  true,
  '{"demo_id":"i16","gender":"masculino","source":"shop.realmadrid.com"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  image_url = EXCLUDED.image_url,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8003-000000000017'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Botas de Fútbol Hombre adidas F50 League Amarillas',
  'zapatillas'::item_category,
  'JR8995',
  'JR8995-RMF',
  36,
  14,
  12,
  '44',
  90,
  'Almacén Calzado Fútbol — Hombre',
  'https://cdn.shopify.com/s/files/1/0985/4143/7258/files/JR8995_11_FOOTWEAR_Photography_SideLateralBottomView_white.jpg?v=1770031826',
  true,
  '{"demo_id":"i17","gender":"masculino","source":"shop.realmadrid.com"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  image_url = EXCLUDED.image_url,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8003-000000000017'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Botas de Fútbol Hombre adidas Predator Elite Rojas',
  'zapatillas'::item_category,
  'JS0433',
  'JS0433-RMF',
  24,
  8,
  8,
  '44',
  270,
  'Almacén Calzado Fútbol — Hombre',
  'https://cdn.shopify.com/s/files/1/0985/4143/7258/files/JS0433_11_FOOTWEAR_Photography_SideLateralBottomView_white.jpg?v=1770031691',
  true,
  '{"demo_id":"i17b","gender":"masculino","source":"shop.realmadrid.com"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  image_url = EXCLUDED.image_url,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8003-000000000017'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Botas de Fútbol Hombre adidas Predator Elite Sin Cordones Rojas',
  'zapatillas'::item_category,
  'JS0407',
  'JS0407-RMF',
  18,
  6,
  6,
  '44',
  280,
  'Almacén Calzado Fútbol — Hombre',
  'https://cdn.shopify.com/s/files/1/0985/4143/7258/files/JS0407_11_FOOTWEAR_Photography_SideLateralBottomView_white.jpg?v=1770031550',
  true,
  '{"demo_id":"i17c","gender":"masculino","source":"shop.realmadrid.com"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  image_url = EXCLUDED.image_url,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8003-000000000017'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Botas de Fútbol Hombre adidas Predator Elite Lengüeta Rojas',
  'zapatillas'::item_category,
  'JS0380',
  'JS0380-RMF',
  16,
  5,
  6,
  '44',
  280,
  'Almacén Calzado Fútbol — Hombre',
  'https://cdn.shopify.com/s/files/1/0985/4143/7258/files/JS0380_11_FOOTWEAR_Photography_SideLateralBottomView_white.jpg?v=1770031399',
  true,
  '{"demo_id":"i17d","gender":"masculino","source":"shop.realmadrid.com"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  image_url = EXCLUDED.image_url,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8003-000000000018'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Espinilleras Oficiales',
  'accesorios'::item_category,
  'RMF-SHIN',
  'RMF-SHIN-RMF',
  60,
  44,
  15,
  'M',
  35,
  'Ciudad Real Madrid — Almacén Equipaciones Hombre',
  '/clubs/rmf/logo.png',
  true,
  '{"demo_id":"i18","gender":"masculino","source":"shop.realmadrid.com"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  image_url = EXCLUDED.image_url,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8003-000000000019'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Guantes Portero Azul/Blanco Real Madrid',
  'accesorios'::item_category,
  'RM6GUPO6',
  'RM6GUPO6-RMF',
  20,
  9,
  6,
  '10',
  30,
  'Almacén Porteros',
  'https://cdn.shopify.com/s/files/1/0985/4143/7258/files/image_054fad21-d80f-4c29-9968-423da93480a4.jpg?v=1767815365',
  true,
  '{"demo_id":"i19","gender":"masculino","source":"shop.realmadrid.com"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  image_url = EXCLUDED.image_url,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8003-000000000019'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Guantes adidas Field Player 24/25',
  'accesorios'::item_category,
  'IY2877',
  'IY2877-RMF',
  40,
  28,
  12,
  'L',
  28,
  'Ciudad Real Madrid — Accesorios',
  'https://cdn.shopify.com/s/files/1/0985/4143/7258/files/image_c4222c94-d3f0-433b-aa2f-9a1f8ba7edc1.jpg?v=1767816214',
  true,
  '{"demo_id":"i19b","gender":"masculino","source":"shop.realmadrid.com"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  image_url = EXCLUDED.image_url,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8003-000000000019'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Guantes adidas Verde 26/27',
  'accesorios'::item_category,
  'KR4603',
  'KR4603-RMF',
  36,
  22,
  10,
  'L',
  28,
  'Ciudad Real Madrid — Accesorios',
  'https://cdn.shopify.com/s/files/1/0985/4143/7258/files/KR4603_1_HARDWARE_Photography_FrontCenterView_white.jpg?v=1779720432',
  true,
  '{"demo_id":"i19c","gender":"masculino","source":"shop.realmadrid.com"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  image_url = EXCLUDED.image_url,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8003-000000000019'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Guantes adidas 25/26',
  'accesorios'::item_category,
  'JX0018',
  'JX0018-RMF',
  30,
  18,
  10,
  'L',
  28,
  'Ciudad Real Madrid — Accesorios',
  'https://cdn.shopify.com/s/files/1/0985/4143/7258/files/image_53fcbee6-70f8-431d-913f-9b28ba4108c5.jpg?v=1767814840',
  true,
  '{"demo_id":"i19d","gender":"masculino","source":"shop.realmadrid.com"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  image_url = EXCLUDED.image_url,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8003-000000000020'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Botiquín Viaje Champions',
  'medico'::item_category,
  'RMF-MED-KIT',
  'RMF-MED-KIT-RMF',
  8,
  5,
  3,
  'Único',
  180,
  'Área Médica',
  '/clubs/rmf/logo.png',
  true,
  '{"demo_id":"i20","gender":"masculino","source":"shop.realmadrid.com"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  image_url = EXCLUDED.image_url,
  updated_at = NOW();

-- Vincular perfiles existentes (Ramón / Carlos) a RMF si ya están
INSERT INTO user_teams (user_id, team_id, role, is_active)
SELECT p.id, '00000000-0000-4000-8000-000acb223458'::uuid, COALESCE(p.role, 'admin'::user_role), true
FROM profiles p
WHERE lower(p.email) IN (
  'info@ramondelpozorott.es',
  'charlie-r-k@hotmail.com',
  'carlos@realmadrid.com'
)
ON CONFLICT DO NOTHING;

-- También asegurar membresía RMB
INSERT INTO user_teams (user_id, team_id, role, is_active)
SELECT p.id, '00000000-0000-4000-8000-000acb123456'::uuid, COALESCE(p.role, 'admin'::user_role), true
FROM profiles p
WHERE lower(p.email) IN (
  'info@ramondelpozorott.es',
  'charlie-r-k@hotmail.com',
  'carlos@realmadrid.com'
)
ON CONFLICT DO NOTHING;

-- Extensión ligera: metadata en laundry (si falta)
ALTER TABLE laundry_batches ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
