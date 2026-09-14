-- CourtManager Pro — 039 ATM jugadores 26/27 que faltaban en producción
-- Fuente: https://www.atleticodemadrid.com/jugadores-primer-equipo/
-- Añade: Esquivel, Romero, Grimaldo, Martínez, Ortiz, Jonathan David.
-- Retratos: fichas oficiales (destacado), no el listado de cuerpo entero.

-- Liberar dorsales 15/16/21/22/25/30 si los ocupa un inactivo (unicidad team_id+dorsal)
UPDATE players
SET dorsal = 80 + dorsal, updated_at = NOW()
WHERE team_id = '00000000-0000-4000-8000-000acb423458'::uuid
  AND is_active = false
  AND dorsal IN (15, 16, 21, 22, 25, 30);

INSERT INTO players (
  id, team_id, dorsal, full_name, position, nationality, birth_date, photo_url,
  is_active, shirt_size, shorts_size, shoe_size, jacket_size, sock_size,
  jersey_name, metadata
) VALUES
(
  '00000000-0000-4000-8004-000000000024'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  25, 'Salvador Esquivel', 'portero'::player_position, 'España', '2005-09-30',
  'https://img-estaticos.atleticodemadrid.com/system/fotos/20941/destacado_600x600/esquivel(1).png',
  true, 'L', 'L', 44, 'L', 'M', 'ESQUIVEL',
  '{"official_slug":"salvador-esquivel-gamez-2026-2027-2","demo_id":"p28","profile_url":"https://www.atleticodemadrid.com/jugadores/salvador-esquivel-gamez-2026-2027-2"}'::jsonb
),
(
  '00000000-0000-4000-8004-000000000025'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  21, 'Cristian Romero', 'defensa'::player_position, 'Argentina', '1998-04-27',
  'https://img-estaticos.atleticodemadrid.com/system/fotos/20938/destacado_600x600/cuti%20romero-ficha.png',
  true, 'L', 'L', 44, 'L', 'M', 'ROMERO',
  '{"official_slug":"cristian-gabriel-romero-2026-2027","demo_id":"p30","profile_url":"https://www.atleticodemadrid.com/jugadores/cristian-gabriel-romero-2026-2027"}'::jsonb
),
(
  '00000000-0000-4000-8004-000000000026'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  22, 'Alejandro Grimaldo', 'defensa'::player_position, 'España', '1995-09-20',
  'https://img-estaticos.atleticodemadrid.com/system/fotos/20932/destacado_600x600/grimaldo-ficha.png',
  true, 'L', 'L', 44, 'L', 'M', 'GRIMALDO',
  '{"official_slug":"alejandro-grimaldo-garcia-2026-2027","demo_id":"p25","profile_url":"https://www.atleticodemadrid.com/jugadores/alejandro-grimaldo-garcia-2026-2027"}'::jsonb
),
(
  '00000000-0000-4000-8004-000000000027'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  30, 'Daniel Martínez', 'defensa'::player_position, 'España', '2004-05-05',
  'https://img-estaticos.atleticodemadrid.com/system/fotos/20943/destacado_600x600/dani-martinez.png',
  true, 'L', 'L', 44, 'L', 'M', 'MARTINEZ',
  '{"official_slug":"daniel-martinez-moreno-2026-2027-2","demo_id":"p31","profile_url":"https://www.atleticodemadrid.com/jugadores/daniel-martinez-moreno-2026-2027-2"}'::jsonb
),
(
  '00000000-0000-4000-8004-000000000028'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  16, 'Arnau Ortiz', 'centrocampista'::player_position, 'España', '2001-10-29',
  'https://img-estaticos.atleticodemadrid.com/system/fotos/19709/destacado_600x600/arnau%20ortiz-ficha.png',
  true, 'M', 'M', 42, 'M', 'M', 'ORTIZ',
  '{"official_slug":"arnau-ortiz-sanchez-2026-2027","demo_id":"p32","profile_url":"https://www.atleticodemadrid.com/jugadores/arnau-ortiz-sanchez-2026-2027"}'::jsonb
),
(
  '00000000-0000-4000-8004-000000000029'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  15, 'Jonathan David', 'delantero'::player_position, 'Canadá', '2000-01-14',
  'https://img-estaticos.atleticodemadrid.com/system/fotos/20961/destacado_600x600/jonathan(1).png',
  true, 'M', 'M', 42, 'M', 'M', 'DAVID',
  '{"official_slug":"jonathan-david-2026-2027-2","demo_id":"p33","profile_url":"https://www.atleticodemadrid.com/jugadores/jonathan-david-2026-2027-2"}'::jsonb
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

-- Retratos de ficha para quienes ya estaban (sustituye assets LaLiga / listado con dorsal)
UPDATE players SET photo_url = 'https://img-estaticos.atleticodemadrid.com/system/fotos/19596/destacado_600x600/musso-ficha.png', updated_at = NOW()
WHERE team_id = '00000000-0000-4000-8000-000acb423458'::uuid AND full_name = 'Juan Agustín Musso';
UPDATE players SET photo_url = 'https://img-estaticos.atleticodemadrid.com/system/fotos/19582/destacado_600x600/oblak-ficha.png', updated_at = NOW()
WHERE team_id = '00000000-0000-4000-8000-000acb423458'::uuid AND full_name = 'Jan Oblak';
UPDATE players SET photo_url = 'https://img-estaticos.atleticodemadrid.com/system/fotos/19600/destacado_600x600/hancko-ficha.png', updated_at = NOW()
WHERE team_id = '00000000-0000-4000-8000-000acb423458'::uuid AND full_name = 'Dávid Hancko';
UPDATE players SET photo_url = 'https://img-estaticos.atleticodemadrid.com/system/fotos/19599/destacado_600x600/pubill-ficha.png', updated_at = NOW()
WHERE team_id = '00000000-0000-4000-8000-000acb423458'::uuid AND full_name = 'Marc Pubill';
UPDATE players SET photo_url = 'https://img-estaticos.atleticodemadrid.com/system/fotos/19591/destacado_600x600/le%20normand-ficha.png', updated_at = NOW()
WHERE team_id = '00000000-0000-4000-8000-000acb423458'::uuid AND full_name ILIKE '%Le Normand%';
UPDATE players SET photo_url = 'https://img-estaticos.atleticodemadrid.com/system/fotos/19607/destacado_600x600/vargas-ficha.png', updated_at = NOW()
WHERE team_id = '00000000-0000-4000-8000-000acb423458'::uuid AND full_name ILIKE '%Vargas%';
UPDATE players SET photo_url = 'https://img-estaticos.atleticodemadrid.com/system/fotos/19606/destacado_600x600/mendoza-ficha.png', updated_at = NOW()
WHERE team_id = '00000000-0000-4000-8000-000acb423458'::uuid AND full_name ILIKE 'Rodrigo Mendoza%';
UPDATE players SET photo_url = 'https://img-estaticos.atleticodemadrid.com/system/fotos/19602/destacado_600x600/cardoso-ficha.png', updated_at = NOW()
WHERE team_id = '00000000-0000-4000-8000-000acb423458'::uuid AND full_name ILIKE '%Cardoso%';
UPDATE players SET photo_url = 'https://img-estaticos.atleticodemadrid.com/system/fotos/19581/destacado_600x600/koke-ficha.png', updated_at = NOW()
WHERE team_id = '00000000-0000-4000-8000-000acb423458'::uuid AND full_name ILIKE '%Koke%';
UPDATE players SET photo_url = 'https://img-estaticos.atleticodemadrid.com/system/fotos/20936/destacado_600x600/kang%20in%20lee-ficha.png', updated_at = NOW()
WHERE team_id = '00000000-0000-4000-8000-000acb423458'::uuid AND full_name ILIKE '%Kang%';
UPDATE players SET photo_url = 'https://img-estaticos.atleticodemadrid.com/system/fotos/19588/destacado_600x600/barrios-ficha.png', updated_at = NOW()
WHERE team_id = '00000000-0000-4000-8000-000acb423458'::uuid AND full_name ILIKE 'Pablo Barrios%';
UPDATE players SET photo_url = 'https://img-estaticos.atleticodemadrid.com/system/fotos/19597/destacado_600x600/baena-ficha.png', updated_at = NOW()
WHERE team_id = '00000000-0000-4000-8000-000acb423458'::uuid AND full_name ILIKE '%Baena%';
UPDATE players SET photo_url = 'https://img-estaticos.atleticodemadrid.com/system/fotos/19585/destacado_600x600/llorente-ficha.png', updated_at = NOW()
WHERE team_id = '00000000-0000-4000-8000-000acb423458'::uuid AND full_name ILIKE 'Marcos Llorente%';
UPDATE players SET photo_url = 'https://img-estaticos.atleticodemadrid.com/system/fotos/19590/destacado_600x600/giuliano-ficha.png', updated_at = NOW()
WHERE team_id = '00000000-0000-4000-8000-000acb423458'::uuid AND full_name ILIKE 'Giuliano%';
UPDATE players SET photo_url = 'https://img-estaticos.atleticodemadrid.com/system/fotos/20934/destacado_600x600/hjulmand-ficha.png', updated_at = NOW()
WHERE team_id = '00000000-0000-4000-8000-000acb423458'::uuid AND full_name ILIKE '%Hjulmand%';
UPDATE players SET photo_url = 'https://img-estaticos.atleticodemadrid.com/system/fotos/19592/destacado_600x600/sorloth-ficha.png', updated_at = NOW()
WHERE team_id = '00000000-0000-4000-8000-000acb423458'::uuid AND full_name ILIKE '%Sørloth%';
UPDATE players SET photo_url = 'https://img-estaticos.atleticodemadrid.com/system/fotos/19605/destacado_600x600/lookman-ficha.png', updated_at = NOW()
WHERE team_id = '00000000-0000-4000-8000-000acb423458'::uuid AND full_name ILIKE '%Lookman%';
UPDATE players SET photo_url = 'https://img-estaticos.atleticodemadrid.com/system/fotos/19593/destacado_600x600/julian-ficha.png', updated_at = NOW()
WHERE team_id = '00000000-0000-4000-8000-000acb423458'::uuid AND full_name ILIKE '%Álvarez%';
