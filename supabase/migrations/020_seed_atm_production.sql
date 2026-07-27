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
  'https://img-estaticos.atleticodemadrid.com/system/foto_listados/18096/thumb_300x400/1_J.-MUSSO.jpg?1755263473',
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
  'https://img-estaticos.atleticodemadrid.com/system/foto_listados/18070/thumb_300x400/DORSALES_WEB_13_OBLAK.jpg?1750111725',
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
  'https://img-estaticos.atleticodemadrid.com/system/foto_listados/18071/thumb_300x400/DORSALES_WEB_2_JMGIMENEZ.jpg?1750111730',
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
  'https://img-estaticos.atleticodemadrid.com/system/foto_listados/19360/thumb_300x400/3_RUGGERI.jpg?1755262860',
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
  'https://img-estaticos.atleticodemadrid.com/system/foto_listados/18095/thumb_300x400/DORSALES_WEB_15_LENGLET.jpg?1750111830',
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
  'https://img-estaticos.atleticodemadrid.com/system/foto_listados/18079/thumb_300x400/DORSALES_WEB_16_MOLINA.jpg?1750111764',
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
  'https://img-estaticos.atleticodemadrid.com/system/foto_listados/19362/thumb_300x400/17_HANCKO.jpg?1755264229',
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
  'https://img-estaticos.atleticodemadrid.com/system/foto_listados/19361/thumb_300x400/18_MARC-PUBILL.jpg?1755263273',
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
  'https://img-estaticos.atleticodemadrid.com/system/foto_listados/18090/thumb_300x400/DORSALES_WEB_24_LENORMAND.jpg?1750111810',
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
  'https://img-estaticos.atleticodemadrid.com/system/foto_listados/19453/thumb_300x400/4_MENDOZA.jpg?1770231751',
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
  'https://img-estaticos.atleticodemadrid.com/system/foto_listados/19364/thumb_300x400/5_JOHNNY.jpg?1755269339',
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
  'https://img-estaticos.atleticodemadrid.com/system/foto_listados/18069/thumb_300x400/DORSALES_WEB_6_KOKE.jpg?1750111721',
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
  'https://img-estaticos.atleticodemadrid.com/system/foto_listados/18081/thumb_300x400/8_BARRIOS.jpg?1755263307',
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
  'https://img-estaticos.atleticodemadrid.com/system/foto_listados/19359/thumb_300x400/10_A%CC%81LEX-B..jpg?1755261293',
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
  'https://img-estaticos.atleticodemadrid.com/system/foto_listados/18075/thumb_300x400/DORSALES_WEB_14_MLLORENTE.jpg?1750111747',
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
  'https://img-estaticos.atleticodemadrid.com/system/foto_listados/18088/thumb_300x400/20_GIULIANO.jpg?1755261331',
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
  'https://img-estaticos.atleticodemadrid.com/system/foto_listados/19454/thumb_300x400/21_OBED-VARGAS.jpg?1770231974',
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
  'https://img-estaticos.atleticodemadrid.com/system/foto_listados/18091/thumb_300x400/DORSALES_WEB_9_SORLOTH.jpg?1750111814',
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
  'https://img-estaticos.atleticodemadrid.com/system/foto_listados/19363/thumb_300x400/11_ALMADA.jpg?1755268842',
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
  'https://img-estaticos.atleticodemadrid.com/system/foto_listados/18092/thumb_300x400/DORSALES_WEB_19_JALVAREZ.jpg?1750111819',
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
  'https://img-estaticos.atleticodemadrid.com/system/foto_listados/19452/thumb_300x400/22_LOOKMAN%20(1).jpg?1770231421',
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

-- Inventario (21)
INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '00000000-0000-4000-8006-000000000001'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Match Hombre 1ª Equipación 26/27',
  'camiseta_juego'::item_category,
  'II2740-101',
  'II2740-101-ATM',
  80,
  54,
  20,
  'L',
  159.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw59595213/II2740-101.jpg',
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
  'II1893-101',
  'II1893-101-ATM',
  100,
  72,
  25,
  'L',
  109.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw6a9d0b45/II1893-101_jugador.jpg',
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
  'IQ6643-101',
  'IQ6643-101-ATM',
  40,
  28,
  10,
  'L',
  119.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  'https://shop.atleticodemadrid.com/on/demandware.static/-/Sites-atm-master-catalog/default/dwb4038a4f/New%20Folder/IQ6643-101_1.jpg',
  true,
  '{"demo_id":"i3","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/camiseta-manga-larga-hombre-1-equipacion-26-27/IQ6643-101.html","product_url":"https://shop.atleticodemadrid.com/es/camiseta-manga-larga-hombre-1-equipacion-26-27/IQ6643-101.html"}'::jsonb
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
  'II1977-455',
  'II1977-455-ATM',
  90,
  60,
  20,
  'L',
  54.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dwfbd93d53/II1977-455_6.jpg',
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
  'IQ6645-455',
  'IQ6645-455-ATM',
  120,
  90,
  30,
  'M',
  24.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw82fb8356/IQ6645-455_1.jpg',
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
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dwc5b5bad6/IR1435-011_CENTERED.jpg',
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
  '00000000-0000-4000-8006-000000000019'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Hombre 2ª Equipación 26/27',
  'camiseta_juego'::item_category,
  'II1932-011',
  'II1932-011-ATM',
  55,
  38,
  12,
  'L',
  109.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw2fde1d06/II1932-011_CENTERED.jpg',
  true,
  '{"demo_id":"i19","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/segunda-equipacion/hombre","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/segunda-equipacion/hombre"}'::jsonb
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
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dwf8a4510b/II2031-010_SIN.jpg',
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
  '00000000-0000-4000-8006-000000000020'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Medias 2ª Equipación 26/27',
  'calcetines'::item_category,
  'IQ6648-010',
  'IQ6648-010-ATM',
  90,
  65,
  20,
  'M',
  24.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw19ade56f/New%20Folder/IQ6648-010.jpg',
  true,
  '{"demo_id":"i20","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/segunda-equipacion/hombre","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/segunda-equipacion/hombre"}'::jsonb
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
  'HM3200-407',
  'HM3200-407-ATM',
  40,
  26,
  10,
  'L',
  149.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw60d3e5ba/HM3200-407_.jpg',
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
  'HM3192-407',
  'HM3192-407-ATM',
  50,
  34,
  12,
  'L',
  99.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw45340fbb/HM3192-407_.jpg',
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
  'IF1452-407',
  'IF1452-407-ATM',
  55,
  38,
  12,
  'L',
  49.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw5f0e8aac/IF1452-407_01.jpg',
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
  'HM3220-406',
  'HM3220-406-ATM',
  80,
  55,
  20,
  'M',
  22.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dwf38a98ea/HM3220-406_zoom.jpg',
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
  '00000000-0000-4000-8006-000000000021'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Camiseta Portero Hombre 25/26',
  'camiseta_juego'::item_category,
  'HQ9235-084',
  'HQ9235-084-ATM',
  25,
  16,
  6,
  'XL',
  109.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw2eef5d35/HQ9235-084.jpg',
  true,
  '{"demo_id":"i21","gender":"masculino","source":"https://shop.atleticodemadrid.com/es/equipaciones/equipacion-de-portero/hombre","product_url":"https://shop.atleticodemadrid.com/es/equipaciones/equipacion-de-portero/hombre"}'::jsonb
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
  'II2770-702',
  'II2770-702-ATM',
  120,
  88,
  30,
  'L',
  54.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw2c70d141/II2770-702_.jpg',
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
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw2fde1d06/II1932-011_CENTERED.jpg',
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
  'II2666-702',
  'II2666-702-ATM',
  50,
  35,
  12,
  'L',
  74.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dwa77c1ae6/II2666-702.jpg',
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
  'II2299-702',
  'II2299-702-ATM',
  80,
  55,
  20,
  'L',
  47.95,
  'Ciudad Deportiva — Almacén Equipaciones Hombre',
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw6e1f0b8e/II2299-702.jpg',
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
  'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default/dw6e1f0b8e/II2299-702.jpg',
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
