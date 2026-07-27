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
  '/clubs/atm/logo.png',
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
  '/clubs/atm/logo.png',
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
  '/clubs/atm/logo.png',
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
  '/clubs/atm/logo.png',
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
  '/clubs/atm/logo.png',
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
  '/clubs/atm/logo.png',
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
  '/clubs/atm/logo.png',
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
  '/clubs/atm/logo.png',
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
  '/clubs/atm/logo.png',
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
  '/clubs/atm/logo.png',
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
  '/clubs/atm/logo.png',
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
  '/clubs/atm/logo.png',
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
  '/clubs/atm/logo.png',
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
  '/clubs/atm/logo.png',
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
  '/clubs/atm/logo.png',
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
  '/clubs/atm/logo.png',
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
  '/clubs/atm/logo.png',
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
  '/clubs/atm/logo.png',
  true,
  'L',
  'L',
  44,
  'L',
  'M',
  'HJULMAND',
  '{"official_slug":"atletico-de-madrid-2025-2026","demo_id":"p18","profile_url":"https://www.atleticodemadrid.com/equipos/atletico-de-madrid-2025-2026"}'::jsonb
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
  'Kang In Lee',
  'delantero'::player_position,
  'Corea del Sur',
  '2001-02-19',
  '/clubs/atm/logo.png',
  true,
  'M',
  'M',
  42,
  'M',
  'M',
  'LEE',
  '{"official_slug":"kang-in-lee-ficha-por-el-atletico-de-madrid","demo_id":"p19","profile_url":"https://www.atleticodemadrid.com/noticias/kang-in-lee-ficha-por-el-atletico-de-madrid"}'::jsonb
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
  '/clubs/atm/logo.png',
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
  '/clubs/atm/logo.png',
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
  '/clubs/atm/logo.png',
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
  '/clubs/atm/logo.png',
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

-- Cuerpo técnico (6)
INSERT INTO coaching_staff (
  id, team_id, full_name, role, email, nationality, photo_url,
  shirt_size, shorts_size, shoe_size, is_active, notes
) VALUES (
  '00000000-0000-4000-8005-000000000001'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Diego Pablo Simeone',
  'Entrenador',
  'dsimeone@atleticodemadrid.com',
  'Argentina',
  '/clubs/atm/logo.png',
  'L',
  'L',
  43,
  true,
  '{"official_slug":"atletico-de-madrid-2025-2026","demo_id":"c1"}'
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
  'Gustavo López',
  'Asistente de entrenador',
  'glopez@atleticodemadrid.com',
  'Argentina',
  '/clubs/atm/logo.png',
  'L',
  'L',
  43,
  true,
  '{"official_slug":"atletico-de-madrid-2025-2026","demo_id":"c2"}'
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
  'Hernán Bonvicini',
  'Asistente de entrenador',
  'hbonvicini@atleticodemadrid.com',
  'Argentina',
  '/clubs/atm/logo.png',
  'L',
  'L',
  43,
  true,
  '{"official_slug":"atletico-de-madrid-2025-2026","demo_id":"c3"}'
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
  'Nelson Vivas',
  'Segundo entrenador',
  'nvivas@atleticodemadrid.com',
  'Argentina',
  '/clubs/atm/logo.png',
  'L',
  'L',
  43,
  true,
  '{"official_slug":"atletico-de-madrid-2025-2026","demo_id":"c4"}'
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
  'Luis Piñedo Betrián',
  'Preparador físico',
  'lpinedo@atleticodemadrid.com',
  'España',
  '/clubs/atm/logo.png',
  'L',
  'L',
  43,
  true,
  '{"official_slug":"atletico-de-madrid-2025-2026","demo_id":"c5"}'
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
  '00000000-0000-4000-8005-000000000006'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Pablo Vercellone',
  'Preparador de porteros',
  'pvercellone@atleticodemadrid.com',
  'Argentina',
  '/clubs/atm/logo.png',
  'L',
  'L',
  43,
  true,
  '{"official_slug":"atletico-de-madrid-2025-2026","demo_id":"c6"}'
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  photo_url = EXCLUDED.photo_url,
  updated_at = NOW();

-- Inventario (18)
INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000001'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Match Hombre 1ª Equipación 26/27',
  'camiseta_juego'::item_category,
  'ATM-HOME-MATCH-2627',
  'ATM-HOME-MATCH-2627-ATM',
  80,
  54,
  20,
  'L',
  159.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  '/clubs/atm/vestuario.png',
  true,
  '{"demo_id":"i1","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11"}'::jsonb
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
  '00000000-0000-4000-8006-000000000002'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Hombre 1ª Equipación 26/27',
  'camiseta_juego'::item_category,
  'ATM-HOME-REPLICA-2627',
  'ATM-HOME-REPLICA-2627-ATM',
  100,
  72,
  25,
  'L',
  109.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  '/clubs/atm/vestuario.png',
  true,
  '{"demo_id":"i2","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11"}'::jsonb
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
  '00000000-0000-4000-8006-000000000003'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Manga Larga Hombre 1ª Equipación 26/27',
  'camiseta_juego'::item_category,
  'ATM-HOME-LS-2627',
  'ATM-HOME-LS-2627-ATM',
  40,
  28,
  10,
  'L',
  119.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  '/clubs/atm/vestuario.png',
  true,
  '{"demo_id":"i3","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11"}'::jsonb
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
  '00000000-0000-4000-8006-000000000004'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Pantalón Corto 1ª Equipación 26/27',
  'pantalon_juego'::item_category,
  'ATM-HOME-SHORT-2627',
  'ATM-HOME-SHORT-2627-ATM',
  90,
  60,
  20,
  'L',
  54.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  '/clubs/atm/vestuario.png',
  true,
  '{"demo_id":"i4","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11"}'::jsonb
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
  '00000000-0000-4000-8006-000000000005'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Medias 1ª Equipación 26/27',
  'calcetines'::item_category,
  'ATM-HOME-SOCK-2627',
  'ATM-HOME-SOCK-2627-ATM',
  120,
  90,
  30,
  'M',
  24.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  '/clubs/atm/logo.png',
  true,
  '{"demo_id":"i5","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11"}'::jsonb
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
  '00000000-0000-4000-8006-000000000006'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Match Hombre 2ª Equipación 26/27',
  'camiseta_juego'::item_category,
  'IR1435-011',
  'IR1435-011-ATM',
  60,
  40,
  15,
  'L',
  159.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  '/clubs/atm/logo.png',
  true,
  '{"demo_id":"i6","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/camiseta-match-hombre-2-equipacion-26-27/IR1435-011.html","product_url":"https://shop.atleticodemadrid.com/es/camiseta-match-hombre-2-equipacion-26-27/IR1435-011.html"}'::jsonb
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
  '00000000-0000-4000-8006-000000000007'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Pantalón Corto 2ª Equipación 26/27',
  'pantalon_juego'::item_category,
  'II2031-010',
  'II2031-010-ATM',
  70,
  48,
  15,
  'L',
  54.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  '/clubs/atm/logo.png',
  true,
  '{"demo_id":"i7","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/pantalon-corto-2-equipacion-26-27/II2031-010.html","product_url":"https://shop.atleticodemadrid.com/es/pantalon-corto-2-equipacion-26-27/II2031-010.html"}'::jsonb
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
  '00000000-0000-4000-8006-000000000008'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Match Hombre 3ª Equipación 25/26',
  'camiseta_juego'::item_category,
  'ATM-THIRD-MATCH-2526',
  'ATM-THIRD-MATCH-2526-ATM',
  40,
  26,
  10,
  'L',
  149.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  '/clubs/atm/logo.png',
  true,
  '{"demo_id":"i8","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre"}'::jsonb
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
  '00000000-0000-4000-8006-000000000009'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Hombre 3ª Equipación 25/26',
  'camiseta_juego'::item_category,
  'ATM-THIRD-REPLICA-2526',
  'ATM-THIRD-REPLICA-2526-ATM',
  50,
  34,
  12,
  'L',
  99.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  '/clubs/atm/logo.png',
  true,
  '{"demo_id":"i9","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre"}'::jsonb
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
  '00000000-0000-4000-8006-000000000010'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Pantalón Corto 3ª Equipación 25/26',
  'pantalon_juego'::item_category,
  'ATM-THIRD-SHORT-2526',
  'ATM-THIRD-SHORT-2526-ATM',
  55,
  38,
  12,
  'L',
  49.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  '/clubs/atm/logo.png',
  true,
  '{"demo_id":"i10","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre"}'::jsonb
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
  '00000000-0000-4000-8006-000000000011'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Medias 3ª Equipación 25/26',
  'calcetines'::item_category,
  'ATM-THIRD-SOCK-2526',
  'ATM-THIRD-SOCK-2526-ATM',
  80,
  55,
  20,
  'M',
  22.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  '/clubs/atm/logo.png',
  true,
  '{"demo_id":"i11","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre"}'::jsonb
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
  '00000000-0000-4000-8006-000000000012'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Entrenamiento Nike Hombre 26/27',
  'camiseta_entrenamiento'::item_category,
  'ATM-TRAIN-TEE-2627',
  'ATM-TRAIN-TEE-2627-ATM',
  120,
  88,
  30,
  'L',
  54.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  '/clubs/atm/vestuario.png',
  true,
  '{"demo_id":"i12","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/entrenamiento","product_url":"https://shop.atleticodemadrid.com/es/entrenamiento"}'::jsonb
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
  '00000000-0000-4000-8006-000000000013'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Away Prematch Hombre Nike 26/27',
  'camiseta_entrenamiento'::item_category,
  'ATM-PREMATCH-AWAY-2627',
  'ATM-PREMATCH-AWAY-2627-ATM',
  60,
  42,
  15,
  'L',
  69.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  '/clubs/atm/logo.png',
  true,
  '{"demo_id":"i13","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/entrenamiento","product_url":"https://shop.atleticodemadrid.com/es/entrenamiento"}'::jsonb
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
  '00000000-0000-4000-8006-000000000014'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Sudadera Drill Top Nike Hombre 26/27',
  'camiseta_entrenamiento'::item_category,
  'ATM-DRILL-TOP-2627',
  'ATM-DRILL-TOP-2627-ATM',
  50,
  35,
  12,
  'L',
  74.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  '/clubs/atm/logo.png',
  true,
  '{"demo_id":"i14","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/entrenamiento","product_url":"https://shop.atleticodemadrid.com/es/entrenamiento"}'::jsonb
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
  '00000000-0000-4000-8006-000000000015'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Pantalón Corto Entrenamiento Nike Hombre 26/27',
  'camiseta_entrenamiento'::item_category,
  'ATM-TRAIN-SHORT-2627',
  'ATM-TRAIN-SHORT-2627-ATM',
  80,
  55,
  20,
  'L',
  47.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  '/clubs/atm/logo.png',
  true,
  '{"demo_id":"i15","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/entrenamiento","product_url":"https://shop.atleticodemadrid.com/es/entrenamiento"}'::jsonb
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
  '00000000-0000-4000-8006-000000000016'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Pantalón Entrenamiento Nike Hombre 26/27',
  'camiseta_entrenamiento'::item_category,
  'ATM-TRAIN-PANT-2627',
  'ATM-TRAIN-PANT-2627-ATM',
  45,
  30,
  10,
  'L',
  74.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  '/clubs/atm/logo.png',
  true,
  '{"demo_id":"i16","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/entrenamiento","product_url":"https://shop.atleticodemadrid.com/es/entrenamiento"}'::jsonb
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
  '00000000-0000-4000-8006-000000000017'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Botas competición (stock genérico hombre)',
  'zapatillas'::item_category,
  'ATM-BOOTS-COMP',
  'ATM-BOOTS-COMP-ATM',
  30,
  12,
  10,
  '42',
  180,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  '/clubs/atm/logo.png',
  true,
  '{"demo_id":"i17","gender":"masculino","source":"shop.atleticodemadrid.com","product_url":null}'::jsonb
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
  '00000000-0000-4000-8006-000000000018'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Botiquín viaje primer equipo',
  'medico'::item_category,
  'ATM-MED-KIT',
  'ATM-MED-KIT-ATM',
  4,
  3,
  2,
  '—',
  250,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  '/clubs/atm/logo.png',
  true,
  '{"demo_id":"i18","gender":"masculino","source":"shop.atleticodemadrid.com","product_url":null}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  image_url = EXCLUDED.image_url,
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
