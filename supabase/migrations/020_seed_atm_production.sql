-- ============================================================
-- CourtManager Pro — 020 Seed ATM (Atlético de Madrid) producción
-- Generado desde src/data/clubs/atm-data.ts
-- Fuentes: atleticodemadrid.com plantilla / calendario / store
-- ============================================================

INSERT INTO teams (id, name, short_name, season, league, primary_color, secondary_color, metadata)
VALUES (
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Atlético de Madrid',
  'ATM',
  '2025-2026',
  'LaLiga',
  '#FFFFFF',
  '#E8151E',
  '{"demoSlug":"atm","sport":"football"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  season = EXCLUDED.season,
  league = EXCLUDED.league,
  updated_at = NOW();

-- Jugadores (23)
INSERT INTO players (
  id, team_id, dorsal, full_name, position, nationality, birth_date, photo_url,
  is_active, shirt_size, shorts_size, shoe_size, jacket_size, sock_size,
  jersey_name, metadata
) VALUES (
  '00000000-0000-4000-8004-000000000001'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  1,
  'Juan Agustín Musso',
  'portero'::player_position,
  'Argentina',
  '1994-05-06',
  'https://assets.laliga.com/squad/2026/t175/p121537/512x556/p121537_t175_2026_0_001_000.png',
  true,
  'XL',
  'L',
  45,
  'XL',
  'L',
  'MUSSO',
  '{"official_slug":"juan-agustin-musso-2025-2026","demo_id":"p1","profile_url":"https://www.atleticodemadrid.com/jugadores/juan-agustin-musso-2025-2026"}'::jsonb
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
  '00000000-0000-4000-8004-000000000002'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  13,
  'Jan Oblak',
  'portero'::player_position,
  'Eslovenia',
  '1993-01-07',
  'https://assets.laliga.com/squad/2026/t175/p81352/512x556/p81352_t175_2026_0_001_000.png',
  true,
  'XL',
  'L',
  45,
  'XL',
  'L',
  'OBLAK',
  '{"official_slug":"jan-oblak-2025-2026","demo_id":"p2","profile_url":"https://www.atleticodemadrid.com/jugadores/jan-oblak-2025-2026"}'::jsonb
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
  '00000000-0000-4000-8004-000000000003'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  2,
  'José María Giménez',
  'defensa'::player_position,
  'Uruguay',
  '1995-01-20',
  'https://assets.laliga.com/squad/2026/t175/p151883/512x556/p151883_t175_2026_0_001_000.png',
  true,
  'L',
  'L',
  44,
  'L',
  'M',
  'GIMÉNEZ',
  '{"official_slug":"jose-maria-gimenez-de-vargas-2025-2026","demo_id":"p3","profile_url":"https://www.atleticodemadrid.com/jugadores/jose-maria-gimenez-de-vargas-2025-2026"}'::jsonb
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
  '00000000-0000-4000-8004-000000000004'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  3,
  'Matteo Ruggeri',
  'defensa'::player_position,
  'Italia',
  '2002-07-11',
  'https://assets.laliga.com/squad/2026/t175/p487992/512x556/p487992_t175_2026_0_001_000.png',
  true,
  'L',
  'L',
  44,
  'L',
  'M',
  'RUGGERI',
  '{"official_slug":"matteo-ruggeri-2025-2026","demo_id":"p4","profile_url":"https://www.atleticodemadrid.com/jugadores/matteo-ruggeri-2025-2026"}'::jsonb
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
  '00000000-0000-4000-8004-000000000005'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  15,
  'Clément Lenglet',
  'defensa'::player_position,
  'Francia',
  '1995-06-17',
  '/clubs/atm/players/lenglet.png',
  true,
  'XL',
  'L',
  45,
  'XL',
  'L',
  'LENGLET',
  '{"official_slug":"clement-nicolas-laurent-lenglet-2025-2026","demo_id":"p5","profile_url":"https://www.atleticodemadrid.com/jugadores/clement-nicolas-laurent-lenglet-2025-2026"}'::jsonb
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
  '00000000-0000-4000-8004-000000000006'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  16,
  'Nahuel Molina',
  'defensa'::player_position,
  'Argentina',
  '1998-04-06',
  'https://assets.laliga.com/squad/2026/t175/p221586/512x556/p221586_t175_2026_0_001_000.png',
  true,
  'L',
  'L',
  44,
  'L',
  'M',
  'MOLINA',
  '{"official_slug":"nahuel-molina-lucero-2025-2026","demo_id":"p6","profile_url":"https://www.atleticodemadrid.com/jugadores/nahuel-molina-lucero-2025-2026"}'::jsonb
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
  '00000000-0000-4000-8004-000000000007'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  17,
  'Dávid Hancko',
  'defensa'::player_position,
  'Eslovaquia',
  '1997-12-13',
  'https://assets.laliga.com/squad/2026/t175/p235093/512x556/p235093_t175_2026_0_001_000.png',
  true,
  'XL',
  'L',
  45,
  'XL',
  'L',
  'HANCKO',
  '{"official_slug":"david-hancko-2025-2026","demo_id":"p7","profile_url":"https://www.atleticodemadrid.com/jugadores/david-hancko-2025-2026"}'::jsonb
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
  '00000000-0000-4000-8004-000000000008'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  18,
  'Marc Pubill',
  'defensa'::player_position,
  'España',
  '2003-06-21',
  'https://assets.laliga.com/squad/2026/t175/p562720/512x556/p562720_t175_2026_0_001_000.png',
  true,
  'L',
  'L',
  44,
  'L',
  'M',
  'PUBILL',
  '{"official_slug":"marc-pubill-pages-2025-2026","demo_id":"p8","profile_url":"https://www.atleticodemadrid.com/jugadores/marc-pubill-pages-2025-2026"}'::jsonb
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
  '00000000-0000-4000-8004-000000000009'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  24,
  'Robin Le Normand',
  'defensa'::player_position,
  'España',
  '1996-11-11',
  'https://assets.laliga.com/squad/2026/t175/p224919/512x556/p224919_t175_2026_0_001_000.png',
  true,
  'XL',
  'L',
  45,
  'XL',
  'L',
  'LE NORMAND',
  '{"official_slug":"robin-aime-robert-le-normand-2025-2026","demo_id":"p9","profile_url":"https://www.atleticodemadrid.com/jugadores/robin-aime-robert-le-normand-2025-2026"}'::jsonb
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
  '00000000-0000-4000-8004-000000000010'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  4,
  'Rodrigo Mendoza',
  'centrocampista'::player_position,
  'España',
  '2005-01-01',
  'https://assets.laliga.com/squad/2026/t175/p578538/512x556/p578538_t175_2026_0_001_000.png',
  true,
  'M',
  'M',
  42,
  'M',
  'M',
  'MENDOZA',
  '{"official_slug":"rodrigo-mendoza-martinez-moya-2025-2026","demo_id":"p10","profile_url":"https://www.atleticodemadrid.com/jugadores/rodrigo-mendoza-martinez-moya-2025-2026"}'::jsonb
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
  '00000000-0000-4000-8004-000000000011'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  5,
  'Johnny Cardoso',
  'centrocampista'::player_position,
  'Brasil',
  '2001-09-20',
  'https://assets.laliga.com/squad/2026/t175/p488662/512x556/p488662_t175_2026_0_001_000.png',
  true,
  'L',
  'L',
  44,
  'L',
  'M',
  'CARDOSO',
  '{"official_slug":"jo-o-lucas-de-souza-cardoso-2025-2026","demo_id":"p11","profile_url":"https://www.atleticodemadrid.com/jugadores/jo-o-lucas-de-souza-cardoso-2025-2026"}'::jsonb
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
  '00000000-0000-4000-8004-000000000012'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  6,
  'Koke Resurrección',
  'centrocampista'::player_position,
  'España',
  '1992-01-08',
  '/clubs/atm/players/koke.png',
  true,
  'L',
  'L',
  44,
  'L',
  'M',
  'RESURRECCIÓN',
  '{"official_slug":"jorge-resurreccion-merodio-2025-2026","demo_id":"p12","profile_url":"https://www.atleticodemadrid.com/jugadores/jorge-resurreccion-merodio-2025-2026"}'::jsonb
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
  '00000000-0000-4000-8004-000000000013'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  8,
  'Pablo Barrios',
  'centrocampista'::player_position,
  'España',
  '2003-06-15',
  'https://assets.laliga.com/squad/2026/t175/p503523/512x556/p503523_t175_2026_0_001_000.png',
  true,
  'M',
  'M',
  42,
  'M',
  'M',
  'BARRIOS',
  '{"official_slug":"pablo-barrios-rivas-2025-2026","demo_id":"p13","profile_url":"https://www.atleticodemadrid.com/jugadores/pablo-barrios-rivas-2025-2026"}'::jsonb
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
  '00000000-0000-4000-8004-000000000014'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  10,
  'Álex Baena',
  'centrocampista'::player_position,
  'España',
  '2001-07-20',
  'https://assets.laliga.com/squad/2026/t175/p248501/512x556/p248501_t175_2026_0_001_000.png',
  true,
  'M',
  'M',
  42,
  'M',
  'M',
  'BAENA',
  '{"official_slug":"alejandro-baena-rodriguez-2025-2026","demo_id":"p14","profile_url":"https://www.atleticodemadrid.com/jugadores/alejandro-baena-rodriguez-2025-2026"}'::jsonb
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
  '00000000-0000-4000-8004-000000000015'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  14,
  'Marcos Llorente',
  'centrocampista'::player_position,
  'España',
  '1995-01-30',
  'https://assets.laliga.com/squad/2026/t175/p192364/512x556/p192364_t175_2026_0_001_000.png',
  true,
  'L',
  'L',
  44,
  'L',
  'M',
  'LLORENTE',
  '{"official_slug":"marcos-llorente-moreno-2025-2026","demo_id":"p15","profile_url":"https://www.atleticodemadrid.com/jugadores/marcos-llorente-moreno-2025-2026"}'::jsonb
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
  '00000000-0000-4000-8004-000000000016'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  20,
  'Giuliano Simeone',
  'centrocampista'::player_position,
  'Argentina',
  '2002-12-18',
  'https://assets.laliga.com/squad/2026/t175/p482652/512x556/p482652_t175_2026_0_001_000.png',
  true,
  'M',
  'M',
  42,
  'M',
  'M',
  'SIMEONE',
  '{"official_slug":"giuliano-simeone-baldini-2025-2026","demo_id":"p16","profile_url":"https://www.atleticodemadrid.com/jugadores/giuliano-simeone-baldini-2025-2026"}'::jsonb
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
  '00000000-0000-4000-8004-000000000017'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  21,
  'Obed Vargas',
  'centrocampista'::player_position,
  'México',
  '2005-08-01',
  'https://assets.laliga.com/squad/2026/t175/p502868/512x556/p502868_t175_2026_0_001_000.png',
  true,
  'M',
  'M',
  42,
  'M',
  'M',
  'VARGAS',
  '{"official_slug":"obed-gomez-vargas-2025-2026","demo_id":"p17","profile_url":"https://www.atleticodemadrid.com/jugadores/obed-gomez-vargas-2025-2026"}'::jsonb
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
  '00000000-0000-4000-8004-000000000018'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  23,
  'Morten Hjulmand',
  'centrocampista'::player_position,
  'Dinamarca',
  '1999-06-25',
  '/clubs/atm/players/hjulmand.png',
  true,
  'L',
  'L',
  44,
  'L',
  'M',
  'HJULMAND',
  '{"official_slug":"morten-hjulmand-2025-2026","demo_id":"p18","profile_url":"https://www.atleticodemadrid.com/jugadores/morten-hjulmand-2025-2026"}'::jsonb
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
  '00000000-0000-4000-8004-000000000019'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  7,
  'Kang-in Lee',
  'centrocampista'::player_position,
  'Corea del Sur',
  '2001-02-19',
  '/clubs/atm/players/kang-in-lee.png',
  true,
  'M',
  'M',
  42,
  'M',
  'M',
  'LEE',
  '{"official_slug":"kang-in-lee-ficha-por-el-atletico-de-madrid","demo_id":"p19","profile_url":"https://www.atleticodemadrid.com/noticias/kang-in-lee-ficha-por-el-atletico-de-madrid","birth_place":"Incheon, Corea del Sur","height_cm":173,"weight_kg":66}'::jsonb
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
  '00000000-0000-4000-8004-000000000020'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  9,
  'Alexander Sørloth',
  'delantero'::player_position,
  'Noruega',
  '1995-12-05',
  'https://assets.laliga.com/squad/2026/t175/p143877/512x556/p143877_t175_2026_0_001_000.png',
  true,
  'XXL',
  'XL',
  46,
  'XXL',
  'XL',
  'SØRLOTH',
  '{"official_slug":"alexander-s-rloth-2025-2026","demo_id":"p20","profile_url":"https://www.atleticodemadrid.com/jugadores/alexander-s-rloth-2025-2026"}'::jsonb
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
  '00000000-0000-4000-8004-000000000021'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  11,
  'Thiago Almada',
  'delantero'::player_position,
  'Argentina',
  '2001-04-26',
  'https://assets.laliga.com/squad/2026/t175/p461360/512x556/p461360_t175_2026_0_001_000.png',
  true,
  'M',
  'M',
  42,
  'M',
  'M',
  'ALMADA',
  '{"official_slug":"thiago-ezequiel-almada-2025-2026","demo_id":"p21","profile_url":"https://www.atleticodemadrid.com/jugadores/thiago-ezequiel-almada-2025-2026"}'::jsonb
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
  '00000000-0000-4000-8004-000000000022'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  19,
  'Julián Álvarez',
  'delantero'::player_position,
  'Argentina',
  '2000-01-31',
  'https://assets.laliga.com/squad/2026/t175/p461358/512x556/p461358_t175_2026_0_001_000.png',
  true,
  'M',
  'M',
  42,
  'M',
  'M',
  'ÁLVAREZ',
  '{"official_slug":"julian-alvarez-2025-2026","demo_id":"p22","profile_url":"https://www.atleticodemadrid.com/jugadores/julian-alvarez-2025-2026"}'::jsonb
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
  '00000000-0000-4000-8004-000000000023'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  22,
  'Ademola Lookman',
  'delantero'::player_position,
  'Nigeria',
  '1997-10-20',
  'https://assets.laliga.com/squad/2026/t175/p219352/512x556/p219352_t175_2026_0_001_000.png',
  true,
  'M',
  'M',
  42,
  'M',
  'M',
  'LOOKMAN',
  '{"official_slug":"ademola-olajade-alade-aylola-lookman-2025-2026","demo_id":"p23","profile_url":"https://www.atleticodemadrid.com/jugadores/ademola-olajade-alade-aylola-lookman-2025-2026"}'::jsonb
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

-- Cuerpo técnico (5)
INSERT INTO coaching_staff (
  id, team_id, full_name, role, email, nationality, photo_url,
  shirt_size, shorts_size, shoe_size, is_active, notes
) VALUES (
  '00000000-0000-4000-8005-000000000001'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Diego Pablo Simeone',
  'Entrenador principal',
  'dsimeone@atleticodemadrid.com',
  'Argentina',
  'https://img.a.transfermarkt.technology/portrait/header/2868-1666861792.jpg?lm=1',
  'L',
  'L',
  43,
  true,
  '{"official_slug":"2066","demo_id":"c1"}'
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
  '00000000-0000-4000-8005-000000000002'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Hernán Bonvicini',
  'Entrenador asistente',
  'hbonvicini@atleticodemadrid.com',
  'Argentina',
  '/clubs/atm/logo.png',
  'L',
  'L',
  43,
  true,
  '{"official_slug":"13","demo_id":"c2"}'
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
  '00000000-0000-4000-8005-000000000003'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Gabi Fernández',
  'Entrenador asistente',
  'gabi@atleticodemadrid.com',
  'España',
  'https://img.a.transfermarkt.technology/portrait/header/97091-1732139341.JPG?lm=1',
  'L',
  'L',
  43,
  true,
  '{"official_slug":"13","demo_id":"c3"}'
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
  '00000000-0000-4000-8005-000000000004'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Luis Piñedo',
  'Preparador físico',
  'lpinedo@atleticodemadrid.com',
  'España',
  '/clubs/atm/logo.png',
  'L',
  'L',
  43,
  true,
  '{"official_slug":"13","demo_id":"c4"}'
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
  '00000000-0000-4000-8005-000000000005'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Pablo Vercellone',
  'Entrenador de arqueros',
  'pvercellone@atleticodemadrid.com',
  'Argentina',
  '/clubs/atm/logo.png',
  'L',
  'L',
  43,
  true,
  '{"official_slug":"13","demo_id":"c5"}'
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  photo_url = EXCLUDED.photo_url,
  updated_at = NOW();

-- Inventario (92)
-- Liberar QRs antiguos del team ATM para evitar choque unique (inventory_items_qr_code_key)
UPDATE inventory_items
SET
  qr_code = CASE
    WHEN qr_code IS NULL OR qr_code = '' THEN qr_code
    ELSE left(qr_code || '-legacy-' || replace(id::text, '-', ''), 120)
  END,
  is_active = false,
  updated_at = NOW()
WHERE team_id = '00000000-0000-4000-8000-000acb423458'::uuid
  AND is_active = true;

-- Upsert inventario expandido (1 fila por talla)
INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000001'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Match Hombre 1ª Equipación 26/27',
  'camiseta_juego'::item_category,
  'II2740-101-S',
  'ATM-i1-II2740-101-S',
  8,
  6,
  2,
  'S',
  159.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw59595213/II2740-101.jpg',
  true,
  '{"demo_id":"i1","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000002'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Match Hombre 1ª Equipación 26/27',
  'camiseta_juego'::item_category,
  'II2740-101-M',
  'ATM-i2-II2740-101-M',
  16,
  12,
  4,
  'M',
  159.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw59595213/II2740-101.jpg',
  true,
  '{"demo_id":"i2","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000003'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Match Hombre 1ª Equipación 26/27',
  'camiseta_juego'::item_category,
  'II2740-101-L',
  'ATM-i3-II2740-101-L',
  30,
  20,
  8,
  'L',
  159.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw59595213/II2740-101.jpg',
  true,
  '{"demo_id":"i3","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000004'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Match Hombre 1ª Equipación 26/27',
  'camiseta_juego'::item_category,
  'II2740-101-XL',
  'ATM-i4-II2740-101-XL',
  18,
  12,
  4,
  'XL',
  159.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw59595213/II2740-101.jpg',
  true,
  '{"demo_id":"i4","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000005'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Match Hombre 1ª Equipación 26/27',
  'camiseta_juego'::item_category,
  'II2740-101-XXL',
  'ATM-i5-II2740-101-XXL',
  8,
  4,
  2,
  'XXL',
  159.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw59595213/II2740-101.jpg',
  true,
  '{"demo_id":"i5","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000006'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Hombre 1ª Equipación 26/27',
  'camiseta_juego'::item_category,
  'II1893-101-S',
  'ATM-i6-II1893-101-S',
  12,
  8,
  3,
  'S',
  109.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw6a9d0b45/II1893-101_jugador.jpg',
  true,
  '{"demo_id":"i6","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000007'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Hombre 1ª Equipación 26/27',
  'camiseta_juego'::item_category,
  'II1893-101-M',
  'ATM-i7-II1893-101-M',
  22,
  16,
  5,
  'M',
  109.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw6a9d0b45/II1893-101_jugador.jpg',
  true,
  '{"demo_id":"i7","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000008'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Hombre 1ª Equipación 26/27',
  'camiseta_juego'::item_category,
  'II1893-101-L',
  'ATM-i8-II1893-101-L',
  36,
  26,
  10,
  'L',
  109.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw6a9d0b45/II1893-101_jugador.jpg',
  true,
  '{"demo_id":"i8","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000009'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Hombre 1ª Equipación 26/27',
  'camiseta_juego'::item_category,
  'II1893-101-XL',
  'ATM-i9-II1893-101-XL',
  22,
  16,
  5,
  'XL',
  109.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw6a9d0b45/II1893-101_jugador.jpg',
  true,
  '{"demo_id":"i9","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000010'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Hombre 1ª Equipación 26/27',
  'camiseta_juego'::item_category,
  'II1893-101-XXL',
  'ATM-i10-II1893-101-XXL',
  8,
  6,
  2,
  'XXL',
  109.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw6a9d0b45/II1893-101_jugador.jpg',
  true,
  '{"demo_id":"i10","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000011'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Manga Larga Hombre 1ª Equipación 26/27',
  'camiseta_juego'::item_category,
  'IQ6643-101-S',
  'ATM-i11-IQ6643-101-S',
  6,
  4,
  1,
  'S',
  119.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/on/demandware.static/-/Sites-atm-master-catalog/default/dwb4038a4f/New%20Folder/IQ6643-101_1.jpg',
  true,
  '{"demo_id":"i11","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/camiseta-manga-larga-hombre-1-equipacion-26-27/IQ6643-101.html","product_url":"https://shop.atleticodemadrid.com/es/camiseta-manga-larga-hombre-1-equipacion-26-27/IQ6643-101.html","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000012'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Manga Larga Hombre 1ª Equipación 26/27',
  'camiseta_juego'::item_category,
  'IQ6643-101-M',
  'ATM-i12-IQ6643-101-M',
  12,
  8,
  3,
  'M',
  119.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/on/demandware.static/-/Sites-atm-master-catalog/default/dwb4038a4f/New%20Folder/IQ6643-101_1.jpg',
  true,
  '{"demo_id":"i12","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/camiseta-manga-larga-hombre-1-equipacion-26-27/IQ6643-101.html","product_url":"https://shop.atleticodemadrid.com/es/camiseta-manga-larga-hombre-1-equipacion-26-27/IQ6643-101.html","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000013'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Manga Larga Hombre 1ª Equipación 26/27',
  'camiseta_juego'::item_category,
  'IQ6643-101-L',
  'ATM-i13-IQ6643-101-L',
  22,
  16,
  5,
  'L',
  119.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/on/demandware.static/-/Sites-atm-master-catalog/default/dwb4038a4f/New%20Folder/IQ6643-101_1.jpg',
  true,
  '{"demo_id":"i13","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/camiseta-manga-larga-hombre-1-equipacion-26-27/IQ6643-101.html","product_url":"https://shop.atleticodemadrid.com/es/camiseta-manga-larga-hombre-1-equipacion-26-27/IQ6643-101.html","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000014'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Manga Larga Hombre 1ª Equipación 26/27',
  'camiseta_juego'::item_category,
  'IQ6643-101-XL',
  'ATM-i14-IQ6643-101-XL',
  12,
  8,
  3,
  'XL',
  119.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/on/demandware.static/-/Sites-atm-master-catalog/default/dwb4038a4f/New%20Folder/IQ6643-101_1.jpg',
  true,
  '{"demo_id":"i14","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/camiseta-manga-larga-hombre-1-equipacion-26-27/IQ6643-101.html","product_url":"https://shop.atleticodemadrid.com/es/camiseta-manga-larga-hombre-1-equipacion-26-27/IQ6643-101.html","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000015'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Manga Larga Hombre 1ª Equipación 26/27',
  'camiseta_juego'::item_category,
  'IQ6643-101-XXL',
  'ATM-i15-IQ6643-101-XXL',
  8,
  4,
  2,
  'XXL',
  119.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/on/demandware.static/-/Sites-atm-master-catalog/default/dwb4038a4f/New%20Folder/IQ6643-101_1.jpg',
  true,
  '{"demo_id":"i15","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/camiseta-manga-larga-hombre-1-equipacion-26-27/IQ6643-101.html","product_url":"https://shop.atleticodemadrid.com/es/camiseta-manga-larga-hombre-1-equipacion-26-27/IQ6643-101.html","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000016'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Pantalón Corto 1ª Equipación 26/27',
  'pantalon_juego'::item_category,
  'II1977-455-S',
  'ATM-i16-II1977-455-S',
  10,
  6,
  2,
  'S',
  54.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dwfbd93d53/II1977-455_6.jpg',
  true,
  '{"demo_id":"i16","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000017'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Pantalón Corto 1ª Equipación 26/27',
  'pantalon_juego'::item_category,
  'II1977-455-M',
  'ATM-i17-II1977-455-M',
  20,
  14,
  4,
  'M',
  54.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dwfbd93d53/II1977-455_6.jpg',
  true,
  '{"demo_id":"i17","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000018'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Pantalón Corto 1ª Equipación 26/27',
  'pantalon_juego'::item_category,
  'II1977-455-L',
  'ATM-i18-II1977-455-L',
  32,
  22,
  8,
  'L',
  54.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dwfbd93d53/II1977-455_6.jpg',
  true,
  '{"demo_id":"i18","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000019'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Pantalón Corto 1ª Equipación 26/27',
  'pantalon_juego'::item_category,
  'II1977-455-XL',
  'ATM-i19-II1977-455-XL',
  18,
  12,
  4,
  'XL',
  54.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dwfbd93d53/II1977-455_6.jpg',
  true,
  '{"demo_id":"i19","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000020'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Pantalón Corto 1ª Equipación 26/27',
  'pantalon_juego'::item_category,
  'II1977-455-XXL',
  'ATM-i20-II1977-455-XXL',
  10,
  6,
  2,
  'XXL',
  54.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dwfbd93d53/II1977-455_6.jpg',
  true,
  '{"demo_id":"i20","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000021'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Medias 1ª Equipación 26/27',
  'calcetines'::item_category,
  'IQ6645-455-S',
  'ATM-i21-IQ6645-455-S',
  24,
  18,
  6,
  'S',
  24.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw82fb8356/IQ6645-455_1.jpg',
  true,
  '{"demo_id":"i21","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000022'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Medias 1ª Equipación 26/27',
  'calcetines'::item_category,
  'IQ6645-455-M',
  'ATM-i22-IQ6645-455-M',
  54,
  40,
  12,
  'M',
  24.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw82fb8356/IQ6645-455_1.jpg',
  true,
  '{"demo_id":"i22","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000023'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Medias 1ª Equipación 26/27',
  'calcetines'::item_category,
  'IQ6645-455-L',
  'ATM-i23-IQ6645-455-L',
  42,
  32,
  12,
  'L',
  24.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw82fb8356/IQ6645-455_1.jpg',
  true,
  '{"demo_id":"i23","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000024'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Match Hombre 2ª Equipación 26/27',
  'camiseta_juego'::item_category,
  'IR1435-011-S',
  'ATM-i24-IR1435-011-S',
  6,
  4,
  1,
  'S',
  159.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dwc5b5bad6/IR1435-011_CENTERED.jpg',
  true,
  '{"demo_id":"i24","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/camiseta-match-hombre-2-equipacion-26-27/IR1435-011.html","product_url":"https://shop.atleticodemadrid.com/es/camiseta-match-hombre-2-equipacion-26-27/IR1435-011.html","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000025'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Match Hombre 2ª Equipación 26/27',
  'camiseta_juego'::item_category,
  'IR1435-011-M',
  'ATM-i25-IR1435-011-M',
  12,
  8,
  3,
  'M',
  159.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dwc5b5bad6/IR1435-011_CENTERED.jpg',
  true,
  '{"demo_id":"i25","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/camiseta-match-hombre-2-equipacion-26-27/IR1435-011.html","product_url":"https://shop.atleticodemadrid.com/es/camiseta-match-hombre-2-equipacion-26-27/IR1435-011.html","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000026'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Match Hombre 2ª Equipación 26/27',
  'camiseta_juego'::item_category,
  'IR1435-011-L',
  'ATM-i26-IR1435-011-L',
  22,
  16,
  5,
  'L',
  159.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dwc5b5bad6/IR1435-011_CENTERED.jpg',
  true,
  '{"demo_id":"i26","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/camiseta-match-hombre-2-equipacion-26-27/IR1435-011.html","product_url":"https://shop.atleticodemadrid.com/es/camiseta-match-hombre-2-equipacion-26-27/IR1435-011.html","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000027'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Match Hombre 2ª Equipación 26/27',
  'camiseta_juego'::item_category,
  'IR1435-011-XL',
  'ATM-i27-IR1435-011-XL',
  12,
  8,
  3,
  'XL',
  159.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dwc5b5bad6/IR1435-011_CENTERED.jpg',
  true,
  '{"demo_id":"i27","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/camiseta-match-hombre-2-equipacion-26-27/IR1435-011.html","product_url":"https://shop.atleticodemadrid.com/es/camiseta-match-hombre-2-equipacion-26-27/IR1435-011.html","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000028'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Match Hombre 2ª Equipación 26/27',
  'camiseta_juego'::item_category,
  'IR1435-011-XXL',
  'ATM-i28-IR1435-011-XXL',
  8,
  4,
  2,
  'XXL',
  159.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dwc5b5bad6/IR1435-011_CENTERED.jpg',
  true,
  '{"demo_id":"i28","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/camiseta-match-hombre-2-equipacion-26-27/IR1435-011.html","product_url":"https://shop.atleticodemadrid.com/es/camiseta-match-hombre-2-equipacion-26-27/IR1435-011.html","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000029'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Hombre 2ª Equipación 26/27',
  'camiseta_juego'::item_category,
  'II1932-011-S',
  'ATM-i29-II1932-011-S',
  6,
  4,
  1,
  'S',
  109.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw2fde1d06/II1932-011_CENTERED.jpg',
  true,
  '{"demo_id":"i29","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/segunda-equipacion/hombre","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/segunda-equipacion/hombre","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000030'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Hombre 2ª Equipación 26/27',
  'camiseta_juego'::item_category,
  'II1932-011-M',
  'ATM-i30-II1932-011-M',
  12,
  8,
  3,
  'M',
  109.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw2fde1d06/II1932-011_CENTERED.jpg',
  true,
  '{"demo_id":"i30","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/segunda-equipacion/hombre","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/segunda-equipacion/hombre","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000031'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Hombre 2ª Equipación 26/27',
  'camiseta_juego'::item_category,
  'II1932-011-L',
  'ATM-i31-II1932-011-L',
  22,
  16,
  5,
  'L',
  109.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw2fde1d06/II1932-011_CENTERED.jpg',
  true,
  '{"demo_id":"i31","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/segunda-equipacion/hombre","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/segunda-equipacion/hombre","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000032'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Hombre 2ª Equipación 26/27',
  'camiseta_juego'::item_category,
  'II1932-011-XL',
  'ATM-i32-II1932-011-XL',
  12,
  8,
  3,
  'XL',
  109.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw2fde1d06/II1932-011_CENTERED.jpg',
  true,
  '{"demo_id":"i32","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/segunda-equipacion/hombre","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/segunda-equipacion/hombre","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000033'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Hombre 2ª Equipación 26/27',
  'camiseta_juego'::item_category,
  'II1932-011-XXL',
  'ATM-i33-II1932-011-XXL',
  8,
  4,
  2,
  'XXL',
  109.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw2fde1d06/II1932-011_CENTERED.jpg',
  true,
  '{"demo_id":"i33","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/segunda-equipacion/hombre","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/segunda-equipacion/hombre","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000034'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Pantalón Corto 2ª Equipación 26/27',
  'pantalon_juego'::item_category,
  'II2031-010-S',
  'ATM-i34-II2031-010-S',
  8,
  5,
  2,
  'S',
  54.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dwf8a4510b/II2031-010_SIN.jpg',
  true,
  '{"demo_id":"i34","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/pantalon-corto-2-equipacion-26-27/II2031-010.html","product_url":"https://shop.atleticodemadrid.com/es/pantalon-corto-2-equipacion-26-27/II2031-010.html","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000035'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Pantalón Corto 2ª Equipación 26/27',
  'pantalon_juego'::item_category,
  'II2031-010-M',
  'ATM-i35-II2031-010-M',
  14,
  10,
  3,
  'M',
  54.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dwf8a4510b/II2031-010_SIN.jpg',
  true,
  '{"demo_id":"i35","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/pantalon-corto-2-equipacion-26-27/II2031-010.html","product_url":"https://shop.atleticodemadrid.com/es/pantalon-corto-2-equipacion-26-27/II2031-010.html","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000036'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Pantalón Corto 2ª Equipación 26/27',
  'pantalon_juego'::item_category,
  'II2031-010-L',
  'ATM-i36-II2031-010-L',
  26,
  18,
  6,
  'L',
  54.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dwf8a4510b/II2031-010_SIN.jpg',
  true,
  '{"demo_id":"i36","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/pantalon-corto-2-equipacion-26-27/II2031-010.html","product_url":"https://shop.atleticodemadrid.com/es/pantalon-corto-2-equipacion-26-27/II2031-010.html","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000037'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Pantalón Corto 2ª Equipación 26/27',
  'pantalon_juego'::item_category,
  'II2031-010-XL',
  'ATM-i37-II2031-010-XL',
  14,
  10,
  3,
  'XL',
  54.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dwf8a4510b/II2031-010_SIN.jpg',
  true,
  '{"demo_id":"i37","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/pantalon-corto-2-equipacion-26-27/II2031-010.html","product_url":"https://shop.atleticodemadrid.com/es/pantalon-corto-2-equipacion-26-27/II2031-010.html","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000038'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Pantalón Corto 2ª Equipación 26/27',
  'pantalon_juego'::item_category,
  'II2031-010-XXL',
  'ATM-i38-II2031-010-XXL',
  8,
  5,
  1,
  'XXL',
  54.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dwf8a4510b/II2031-010_SIN.jpg',
  true,
  '{"demo_id":"i38","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/pantalon-corto-2-equipacion-26-27/II2031-010.html","product_url":"https://shop.atleticodemadrid.com/es/pantalon-corto-2-equipacion-26-27/II2031-010.html","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000039'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Medias 2ª Equipación 26/27',
  'calcetines'::item_category,
  'IQ6648-010-S',
  'ATM-i39-IQ6648-010-S',
  16,
  12,
  4,
  'S',
  24.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw19ade56f/New%20Folder/IQ6648-010.jpg',
  true,
  '{"demo_id":"i39","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/segunda-equipacion/hombre","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/segunda-equipacion/hombre","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000040'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Medias 2ª Equipación 26/27',
  'calcetines'::item_category,
  'IQ6648-010-M',
  'ATM-i40-IQ6648-010-M',
  38,
  28,
  8,
  'M',
  24.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw19ade56f/New%20Folder/IQ6648-010.jpg',
  true,
  '{"demo_id":"i40","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/segunda-equipacion/hombre","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/segunda-equipacion/hombre","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000041'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Medias 2ª Equipación 26/27',
  'calcetines'::item_category,
  'IQ6648-010-L',
  'ATM-i41-IQ6648-010-L',
  36,
  25,
  8,
  'L',
  24.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw19ade56f/New%20Folder/IQ6648-010.jpg',
  true,
  '{"demo_id":"i41","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/segunda-equipacion/hombre","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/segunda-equipacion/hombre","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000042'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Match Hombre 3ª Equipación 25/26',
  'camiseta_juego'::item_category,
  'HM3200-407-S',
  'ATM-i42-HM3200-407-S',
  5,
  3,
  1,
  'S',
  149.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw60d3e5ba/HM3200-407_.jpg',
  true,
  '{"demo_id":"i42","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000043'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Match Hombre 3ª Equipación 25/26',
  'camiseta_juego'::item_category,
  'HM3200-407-M',
  'ATM-i43-HM3200-407-M',
  8,
  6,
  2,
  'M',
  149.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw60d3e5ba/HM3200-407_.jpg',
  true,
  '{"demo_id":"i43","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000044'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Match Hombre 3ª Equipación 25/26',
  'camiseta_juego'::item_category,
  'HM3200-407-L',
  'ATM-i44-HM3200-407-L',
  16,
  10,
  4,
  'L',
  149.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw60d3e5ba/HM3200-407_.jpg',
  true,
  '{"demo_id":"i44","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000045'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Match Hombre 3ª Equipación 25/26',
  'camiseta_juego'::item_category,
  'HM3200-407-XL',
  'ATM-i45-HM3200-407-XL',
  8,
  5,
  2,
  'XL',
  149.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw60d3e5ba/HM3200-407_.jpg',
  true,
  '{"demo_id":"i45","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000046'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Match Hombre 3ª Equipación 25/26',
  'camiseta_juego'::item_category,
  'HM3200-407-XXL',
  'ATM-i46-HM3200-407-XXL',
  3,
  2,
  1,
  'XXL',
  149.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw60d3e5ba/HM3200-407_.jpg',
  true,
  '{"demo_id":"i46","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000047'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Hombre 3ª Equipación 25/26',
  'camiseta_juego'::item_category,
  'HM3192-407-S',
  'ATM-i47-HM3192-407-S',
  6,
  4,
  1,
  'S',
  99.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw45340fbb/HM3192-407_.jpg',
  true,
  '{"demo_id":"i47","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000048'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Hombre 3ª Equipación 25/26',
  'camiseta_juego'::item_category,
  'HM3192-407-M',
  'ATM-i48-HM3192-407-M',
  12,
  8,
  3,
  'M',
  99.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw45340fbb/HM3192-407_.jpg',
  true,
  '{"demo_id":"i48","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000049'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Hombre 3ª Equipación 25/26',
  'camiseta_juego'::item_category,
  'HM3192-407-L',
  'ATM-i49-HM3192-407-L',
  18,
  12,
  4,
  'L',
  99.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw45340fbb/HM3192-407_.jpg',
  true,
  '{"demo_id":"i49","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000050'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Hombre 3ª Equipación 25/26',
  'camiseta_juego'::item_category,
  'HM3192-407-XL',
  'ATM-i50-HM3192-407-XL',
  10,
  7,
  2,
  'XL',
  99.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw45340fbb/HM3192-407_.jpg',
  true,
  '{"demo_id":"i50","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000051'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Hombre 3ª Equipación 25/26',
  'camiseta_juego'::item_category,
  'HM3192-407-XXL',
  'ATM-i51-HM3192-407-XXL',
  4,
  3,
  1,
  'XXL',
  99.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw45340fbb/HM3192-407_.jpg',
  true,
  '{"demo_id":"i51","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000052'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Pantalón Corto 3ª Equipación 25/26',
  'pantalon_juego'::item_category,
  'IF1452-407-S',
  'ATM-i52-IF1452-407-S',
  6,
  4,
  1,
  'S',
  49.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw5f0e8aac/IF1452-407_01.jpg',
  true,
  '{"demo_id":"i52","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000053'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Pantalón Corto 3ª Equipación 25/26',
  'pantalon_juego'::item_category,
  'IF1452-407-M',
  'ATM-i53-IF1452-407-M',
  12,
  8,
  3,
  'M',
  49.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw5f0e8aac/IF1452-407_01.jpg',
  true,
  '{"demo_id":"i53","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000054'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Pantalón Corto 3ª Equipación 25/26',
  'pantalon_juego'::item_category,
  'IF1452-407-L',
  'ATM-i54-IF1452-407-L',
  20,
  14,
  4,
  'L',
  49.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw5f0e8aac/IF1452-407_01.jpg',
  true,
  '{"demo_id":"i54","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000055'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Pantalón Corto 3ª Equipación 25/26',
  'pantalon_juego'::item_category,
  'IF1452-407-XL',
  'ATM-i55-IF1452-407-XL',
  12,
  8,
  3,
  'XL',
  49.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw5f0e8aac/IF1452-407_01.jpg',
  true,
  '{"demo_id":"i55","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000056'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Pantalón Corto 3ª Equipación 25/26',
  'pantalon_juego'::item_category,
  'IF1452-407-XXL',
  'ATM-i56-IF1452-407-XXL',
  5,
  4,
  1,
  'XXL',
  49.95,
  'Ciudad Deportiva — Est. 1 Equipación',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw5f0e8aac/IF1452-407_01.jpg',
  true,
  '{"demo_id":"i56","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000057'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Medias 3ª Equipación 25/26',
  'calcetines'::item_category,
  'HM3220-406-S',
  'ATM-i57-HM3220-406-S',
  14,
  10,
  4,
  'S',
  22.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dwf38a98ea/HM3220-406_zoom.jpg',
  true,
  '{"demo_id":"i57","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000058'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Medias 3ª Equipación 25/26',
  'calcetines'::item_category,
  'HM3220-406-M',
  'ATM-i58-HM3220-406-M',
  36,
  25,
  8,
  'M',
  22.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dwf38a98ea/HM3220-406_zoom.jpg',
  true,
  '{"demo_id":"i58","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000059'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Medias 3ª Equipación 25/26',
  'calcetines'::item_category,
  'HM3220-406-L',
  'ATM-i59-HM3220-406-L',
  30,
  20,
  8,
  'L',
  22.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dwf38a98ea/HM3220-406_zoom.jpg',
  true,
  '{"demo_id":"i59","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000060'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Portero Hombre 25/26',
  'camiseta_juego'::item_category,
  'HQ9235-084-L',
  'ATM-i60-HQ9235-084-L',
  6,
  4,
  2,
  'L',
  109.95,
  'Ciudad Deportiva — Almacén Porteros',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw2eef5d35/HQ9235-084.jpg',
  true,
  '{"demo_id":"i60","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/equipacion-de-portero/hombre","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/equipacion-de-portero/hombre","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000061'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Portero Hombre 25/26',
  'camiseta_juego'::item_category,
  'HQ9235-084-XL',
  'ATM-i61-HQ9235-084-XL',
  12,
  8,
  3,
  'XL',
  109.95,
  'Ciudad Deportiva — Almacén Porteros',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw2eef5d35/HQ9235-084.jpg',
  true,
  '{"demo_id":"i61","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/equipacion-de-portero/hombre","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/equipacion-de-portero/hombre","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000062'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Portero Hombre 25/26',
  'camiseta_juego'::item_category,
  'HQ9235-084-XXL',
  'ATM-i62-HQ9235-084-XXL',
  7,
  4,
  1,
  'XXL',
  109.95,
  'Ciudad Deportiva — Almacén Porteros',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw2eef5d35/HQ9235-084.jpg',
  true,
  '{"demo_id":"i62","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/equipacion-de-portero/hombre","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/equipacion-de-portero/hombre","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000063'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Entrenamiento Nike Hombre 26/27',
  'camiseta_entrenamiento'::item_category,
  'II2770-702-S',
  'ATM-i63-II2770-702-S',
  14,
  10,
  3,
  'S',
  54.95,
  'Ciudad Deportiva — Est. 2 Entrenamiento',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw2c70d141/II2770-702_.jpg',
  true,
  '{"demo_id":"i63","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/entrenamiento","product_url":"https://shop.atleticodemadrid.com/es/entrenamiento","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000064'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Entrenamiento Nike Hombre 26/27',
  'camiseta_entrenamiento'::item_category,
  'II2770-702-M',
  'ATM-i64-II2770-702-M',
  28,
  20,
  6,
  'M',
  54.95,
  'Ciudad Deportiva — Est. 2 Entrenamiento',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw2c70d141/II2770-702_.jpg',
  true,
  '{"demo_id":"i64","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/entrenamiento","product_url":"https://shop.atleticodemadrid.com/es/entrenamiento","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000065'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Entrenamiento Nike Hombre 26/27',
  'camiseta_entrenamiento'::item_category,
  'II2770-702-L',
  'ATM-i65-II2770-702-L',
  44,
  32,
  12,
  'L',
  54.95,
  'Ciudad Deportiva — Est. 2 Entrenamiento',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw2c70d141/II2770-702_.jpg',
  true,
  '{"demo_id":"i65","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/entrenamiento","product_url":"https://shop.atleticodemadrid.com/es/entrenamiento","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000066'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Entrenamiento Nike Hombre 26/27',
  'camiseta_entrenamiento'::item_category,
  'II2770-702-XL',
  'ATM-i66-II2770-702-XL',
  24,
  18,
  6,
  'XL',
  54.95,
  'Ciudad Deportiva — Est. 2 Entrenamiento',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw2c70d141/II2770-702_.jpg',
  true,
  '{"demo_id":"i66","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/entrenamiento","product_url":"https://shop.atleticodemadrid.com/es/entrenamiento","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000067'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Entrenamiento Nike Hombre 26/27',
  'camiseta_entrenamiento'::item_category,
  'II2770-702-XXL',
  'ATM-i67-II2770-702-XXL',
  10,
  8,
  3,
  'XXL',
  54.95,
  'Ciudad Deportiva — Est. 2 Entrenamiento',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw2c70d141/II2770-702_.jpg',
  true,
  '{"demo_id":"i67","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/entrenamiento","product_url":"https://shop.atleticodemadrid.com/es/entrenamiento","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000068'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Away Prematch Hombre Nike 26/27',
  'camiseta_entrenamiento'::item_category,
  'ATM-PREMATCH-AWAY-S',
  'ATM-i68-ATM-PREMATCH-AWAY-S',
  6,
  4,
  1,
  'S',
  69.95,
  'Ciudad Deportiva — Est. 2 Entrenamiento',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw2fde1d06/II1932-011_CENTERED.jpg',
  true,
  '{"demo_id":"i68","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/entrenamiento","product_url":"https://shop.atleticodemadrid.com/es/entrenamiento","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000069'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Away Prematch Hombre Nike 26/27',
  'camiseta_entrenamiento'::item_category,
  'ATM-PREMATCH-AWAY-M',
  'ATM-i69-ATM-PREMATCH-AWAY-M',
  14,
  10,
  3,
  'M',
  69.95,
  'Ciudad Deportiva — Est. 2 Entrenamiento',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw2fde1d06/II1932-011_CENTERED.jpg',
  true,
  '{"demo_id":"i69","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/entrenamiento","product_url":"https://shop.atleticodemadrid.com/es/entrenamiento","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000070'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Away Prematch Hombre Nike 26/27',
  'camiseta_entrenamiento'::item_category,
  'ATM-PREMATCH-AWAY-L',
  'ATM-i70-ATM-PREMATCH-AWAY-L',
  22,
  16,
  6,
  'L',
  69.95,
  'Ciudad Deportiva — Est. 2 Entrenamiento',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw2fde1d06/II1932-011_CENTERED.jpg',
  true,
  '{"demo_id":"i70","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/entrenamiento","product_url":"https://shop.atleticodemadrid.com/es/entrenamiento","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000071'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Away Prematch Hombre Nike 26/27',
  'camiseta_entrenamiento'::item_category,
  'ATM-PREMATCH-AWAY-XL',
  'ATM-i71-ATM-PREMATCH-AWAY-XL',
  12,
  8,
  3,
  'XL',
  69.95,
  'Ciudad Deportiva — Est. 2 Entrenamiento',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw2fde1d06/II1932-011_CENTERED.jpg',
  true,
  '{"demo_id":"i71","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/entrenamiento","product_url":"https://shop.atleticodemadrid.com/es/entrenamiento","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000072'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Away Prematch Hombre Nike 26/27',
  'camiseta_entrenamiento'::item_category,
  'ATM-PREMATCH-AWAY-XXL',
  'ATM-i72-ATM-PREMATCH-AWAY-XXL',
  6,
  4,
  2,
  'XXL',
  69.95,
  'Ciudad Deportiva — Est. 2 Entrenamiento',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw2fde1d06/II1932-011_CENTERED.jpg',
  true,
  '{"demo_id":"i72","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/entrenamiento","product_url":"https://shop.atleticodemadrid.com/es/entrenamiento","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000073'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Sudadera Drill Top Nike Hombre 26/27',
  'camiseta_entrenamiento'::item_category,
  'II2666-702-S',
  'ATM-i73-II2666-702-S',
  6,
  4,
  1,
  'S',
  74.95,
  'Ciudad Deportiva — Est. 2 Entrenamiento',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dwa77c1ae6/II2666-702.jpg',
  true,
  '{"demo_id":"i73","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/entrenamiento","product_url":"https://shop.atleticodemadrid.com/es/entrenamiento","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000074'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Sudadera Drill Top Nike Hombre 26/27',
  'camiseta_entrenamiento'::item_category,
  'II2666-702-M',
  'ATM-i74-II2666-702-M',
  12,
  8,
  3,
  'M',
  74.95,
  'Ciudad Deportiva — Est. 2 Entrenamiento',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dwa77c1ae6/II2666-702.jpg',
  true,
  '{"demo_id":"i74","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/entrenamiento","product_url":"https://shop.atleticodemadrid.com/es/entrenamiento","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000075'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Sudadera Drill Top Nike Hombre 26/27',
  'camiseta_entrenamiento'::item_category,
  'II2666-702-L',
  'ATM-i75-II2666-702-L',
  18,
  12,
  4,
  'L',
  74.95,
  'Ciudad Deportiva — Est. 2 Entrenamiento',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dwa77c1ae6/II2666-702.jpg',
  true,
  '{"demo_id":"i75","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/entrenamiento","product_url":"https://shop.atleticodemadrid.com/es/entrenamiento","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000076'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Sudadera Drill Top Nike Hombre 26/27',
  'camiseta_entrenamiento'::item_category,
  'II2666-702-XL',
  'ATM-i76-II2666-702-XL',
  10,
  7,
  2,
  'XL',
  74.95,
  'Ciudad Deportiva — Est. 2 Entrenamiento',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dwa77c1ae6/II2666-702.jpg',
  true,
  '{"demo_id":"i76","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/entrenamiento","product_url":"https://shop.atleticodemadrid.com/es/entrenamiento","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000077'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Sudadera Drill Top Nike Hombre 26/27',
  'camiseta_entrenamiento'::item_category,
  'II2666-702-XXL',
  'ATM-i77-II2666-702-XXL',
  4,
  4,
  2,
  'XXL',
  74.95,
  'Ciudad Deportiva — Est. 2 Entrenamiento',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dwa77c1ae6/II2666-702.jpg',
  true,
  '{"demo_id":"i77","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/entrenamiento","product_url":"https://shop.atleticodemadrid.com/es/entrenamiento","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000078'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Pantalón Corto Entrenamiento Nike Hombre 26/27',
  'camiseta_entrenamiento'::item_category,
  'II2299-702-S',
  'ATM-i78-II2299-702-S',
  8,
  6,
  2,
  'S',
  47.95,
  'Ciudad Deportiva — Est. 2 Entrenamiento',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw6e1f0b8e/II2299-702.jpg',
  true,
  '{"demo_id":"i78","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/entrenamiento","product_url":"https://shop.atleticodemadrid.com/es/entrenamiento","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000079'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Pantalón Corto Entrenamiento Nike Hombre 26/27',
  'camiseta_entrenamiento'::item_category,
  'II2299-702-M',
  'ATM-i79-II2299-702-M',
  18,
  12,
  4,
  'M',
  47.95,
  'Ciudad Deportiva — Est. 2 Entrenamiento',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw6e1f0b8e/II2299-702.jpg',
  true,
  '{"demo_id":"i79","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/entrenamiento","product_url":"https://shop.atleticodemadrid.com/es/entrenamiento","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000080'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Pantalón Corto Entrenamiento Nike Hombre 26/27',
  'camiseta_entrenamiento'::item_category,
  'II2299-702-L',
  'ATM-i80-II2299-702-L',
  28,
  20,
  6,
  'L',
  47.95,
  'Ciudad Deportiva — Est. 2 Entrenamiento',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw6e1f0b8e/II2299-702.jpg',
  true,
  '{"demo_id":"i80","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/entrenamiento","product_url":"https://shop.atleticodemadrid.com/es/entrenamiento","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000081'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Pantalón Corto Entrenamiento Nike Hombre 26/27',
  'camiseta_entrenamiento'::item_category,
  'II2299-702-XL',
  'ATM-i81-II2299-702-XL',
  18,
  12,
  4,
  'XL',
  47.95,
  'Ciudad Deportiva — Est. 2 Entrenamiento',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw6e1f0b8e/II2299-702.jpg',
  true,
  '{"demo_id":"i81","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/entrenamiento","product_url":"https://shop.atleticodemadrid.com/es/entrenamiento","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000082'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Pantalón Corto Entrenamiento Nike Hombre 26/27',
  'camiseta_entrenamiento'::item_category,
  'II2299-702-XXL',
  'ATM-i82-II2299-702-XXL',
  8,
  5,
  2,
  'XXL',
  47.95,
  'Ciudad Deportiva — Est. 2 Entrenamiento',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw6e1f0b8e/II2299-702.jpg',
  true,
  '{"demo_id":"i82","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/entrenamiento","product_url":"https://shop.atleticodemadrid.com/es/entrenamiento","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000083'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Pantalón Entrenamiento Nike Hombre 26/27',
  'camiseta_entrenamiento'::item_category,
  'ATM-TRAIN-PANT-S',
  'ATM-i83-ATM-TRAIN-PANT-S',
  5,
  3,
  1,
  'S',
  74.95,
  'Ciudad Deportiva — Est. 2 Entrenamiento',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw6e1f0b8e/II2299-702.jpg',
  true,
  '{"demo_id":"i83","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/entrenamiento","product_url":"https://shop.atleticodemadrid.com/es/entrenamiento","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000084'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Pantalón Entrenamiento Nike Hombre 26/27',
  'camiseta_entrenamiento'::item_category,
  'ATM-TRAIN-PANT-M',
  'ATM-i84-ATM-TRAIN-PANT-M',
  10,
  7,
  2,
  'M',
  74.95,
  'Ciudad Deportiva — Est. 2 Entrenamiento',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw6e1f0b8e/II2299-702.jpg',
  true,
  '{"demo_id":"i84","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/entrenamiento","product_url":"https://shop.atleticodemadrid.com/es/entrenamiento","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000085'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Pantalón Entrenamiento Nike Hombre 26/27',
  'camiseta_entrenamiento'::item_category,
  'ATM-TRAIN-PANT-L',
  'ATM-i85-ATM-TRAIN-PANT-L',
  18,
  12,
  4,
  'L',
  74.95,
  'Ciudad Deportiva — Est. 2 Entrenamiento',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw6e1f0b8e/II2299-702.jpg',
  true,
  '{"demo_id":"i85","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/entrenamiento","product_url":"https://shop.atleticodemadrid.com/es/entrenamiento","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000086'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Pantalón Entrenamiento Nike Hombre 26/27',
  'camiseta_entrenamiento'::item_category,
  'ATM-TRAIN-PANT-XL',
  'ATM-i86-ATM-TRAIN-PANT-XL',
  8,
  5,
  2,
  'XL',
  74.95,
  'Ciudad Deportiva — Est. 2 Entrenamiento',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw6e1f0b8e/II2299-702.jpg',
  true,
  '{"demo_id":"i86","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/entrenamiento","product_url":"https://shop.atleticodemadrid.com/es/entrenamiento","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000087'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Pantalón Entrenamiento Nike Hombre 26/27',
  'camiseta_entrenamiento'::item_category,
  'ATM-TRAIN-PANT-XXL',
  'ATM-i87-ATM-TRAIN-PANT-XXL',
  4,
  3,
  1,
  'XXL',
  74.95,
  'Ciudad Deportiva — Est. 2 Entrenamiento',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw6e1f0b8e/II2299-702.jpg',
  true,
  '{"demo_id":"i87","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/entrenamiento","product_url":"https://shop.atleticodemadrid.com/es/entrenamiento","brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000088'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Espinilleras Oficiales Nike',
  'accesorios'::item_category,
  'ATM-SHIN-M',
  'ATM-i88-ATM-SHIN-M',
  50,
  36,
  12,
  'M',
  35,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  '/clubs/atm/logo.png',
  true,
  '{"demo_id":"i88","gender":"masculino","source":"shop.atleticodemadrid.com","product_url":null,"brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000089'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Espinilleras Oficiales Nike',
  'accesorios'::item_category,
  'ATM-SHIN-L',
  'ATM-i89-ATM-SHIN-L',
  40,
  28,
  10,
  'L',
  35,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  '/clubs/atm/logo.png',
  true,
  '{"demo_id":"i89","gender":"masculino","source":"shop.atleticodemadrid.com","product_url":null,"brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000090'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Guantes Portero Nike Match',
  'accesorios'::item_category,
  'ATM-GK-GLOVE-9',
  'ATM-i90-ATM-GK-GLOVE-9',
  12,
  8,
  3,
  '9',
  89.95,
  'Ciudad Deportiva — Almacén Porteros',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw2eef5d35/HQ9235-084.jpg',
  true,
  '{"demo_id":"i90","gender":"masculino","source":"shop.atleticodemadrid.com","product_url":null,"brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000091'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Guantes Portero Nike Match',
  'accesorios'::item_category,
  'ATM-GK-GLOVE-10',
  'ATM-i91-ATM-GK-GLOVE-10',
  12,
  7,
  3,
  '10',
  89.95,
  'Ciudad Deportiva — Almacén Porteros',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw2eef5d35/HQ9235-084.jpg',
  true,
  '{"demo_id":"i91","gender":"masculino","source":"shop.atleticodemadrid.com","product_url":null,"brand":"Nike"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000092'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Botiquín viaje Champions / LaLiga',
  'medico'::item_category,
  'ATM-MED-KIT',
  'ATM-i92-ATM-MED-KIT',
  4,
  3,
  2,
  '—',
  250,
  'Vestuario Metropolitano — Banquillo',
  '/clubs/atm/logo.png',
  true,
  '{"demo_id":"i92","gender":"masculino","source":"shop.atleticodemadrid.com","product_url":null,"brand":"ATM Medical"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  qr_code = EXCLUDED.qr_code,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();

-- Vincular perfiles (Ramón / Carlos) a ATM
INSERT INTO user_teams (user_id, team_id, role, is_active)
SELECT p.id, '00000000-0000-4000-8000-000acb423458'::uuid, COALESCE(p.role, 'admin'::user_role), true
FROM profiles p
WHERE lower(p.email) IN (
  'info@ramondelpozorott.es',
  'charlie-r-k@hotmail.com',
  'carlos@realmadrid.com'
)
ON CONFLICT DO NOTHING;
