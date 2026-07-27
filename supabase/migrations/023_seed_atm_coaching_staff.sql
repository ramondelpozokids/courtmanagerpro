-- ============================================================
-- ATM cuerpo técnico (Simeone + staff) — IDs 8008
-- Corrige seed 020 que usaba prefijo 8005 (colisionaba conceptualmente
-- con material médico) y asegura team_id / is_active en ON CONFLICT.
-- ============================================================

-- Desactivar filas antiguas (8005) si existían en coaching_staff
UPDATE coaching_staff
SET is_active = false, updated_at = NOW()
WHERE id IN (
  '00000000-0000-4000-8005-000000000001'::uuid,
  '00000000-0000-4000-8005-000000000002'::uuid,
  '00000000-0000-4000-8005-000000000003'::uuid,
  '00000000-0000-4000-8005-000000000004'::uuid,
  '00000000-0000-4000-8005-000000000005'::uuid
)
AND team_id = '00000000-0000-4000-8000-000acb423458'::uuid;

INSERT INTO coaching_staff (
  id, team_id, full_name, role, email, nationality, photo_url,
  shirt_size, shorts_size, shoe_size, is_active, notes
) VALUES (
  '00000000-0000-4000-8008-000000000001'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Diego Pablo Simeone',
  'Entrenador principal',
  'dsimeone@atleticodemadrid.com',
  'Argentina',
  'https://img.a.transfermarkt.technology/portrait/header/2868-1666861792.jpg?lm=1',
  'L', 'L', 43, true,
  '{"official_slug":"2066","demo_id":"c1"}'
)
ON CONFLICT (id) DO UPDATE SET
  team_id = EXCLUDED.team_id,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  email = EXCLUDED.email,
  nationality = EXCLUDED.nationality,
  photo_url = EXCLUDED.photo_url,
  shirt_size = EXCLUDED.shirt_size,
  shorts_size = EXCLUDED.shorts_size,
  shoe_size = EXCLUDED.shoe_size,
  is_active = true,
  notes = EXCLUDED.notes,
  updated_at = NOW();

INSERT INTO coaching_staff (
  id, team_id, full_name, role, email, nationality, photo_url,
  shirt_size, shorts_size, shoe_size, is_active, notes
) VALUES (
  '00000000-0000-4000-8008-000000000002'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Hernán Bonvicini',
  'Entrenador asistente',
  'hbonvicini@atleticodemadrid.com',
  'Argentina',
  '/clubs/atm/logo.png',
  'L', 'L', 43, true,
  '{"official_slug":"13","demo_id":"c2"}'
)
ON CONFLICT (id) DO UPDATE SET
  team_id = EXCLUDED.team_id,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  email = EXCLUDED.email,
  nationality = EXCLUDED.nationality,
  photo_url = EXCLUDED.photo_url,
  shirt_size = EXCLUDED.shirt_size,
  shorts_size = EXCLUDED.shorts_size,
  shoe_size = EXCLUDED.shoe_size,
  is_active = true,
  notes = EXCLUDED.notes,
  updated_at = NOW();

INSERT INTO coaching_staff (
  id, team_id, full_name, role, email, nationality, photo_url,
  shirt_size, shorts_size, shoe_size, is_active, notes
) VALUES (
  '00000000-0000-4000-8008-000000000003'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Gabi Fernández',
  'Entrenador asistente',
  'gabi@atleticodemadrid.com',
  'España',
  'https://img.a.transfermarkt.technology/portrait/header/97091-1732139341.JPG?lm=1',
  'L', 'L', 43, true,
  '{"official_slug":"13","demo_id":"c3"}'
)
ON CONFLICT (id) DO UPDATE SET
  team_id = EXCLUDED.team_id,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  email = EXCLUDED.email,
  nationality = EXCLUDED.nationality,
  photo_url = EXCLUDED.photo_url,
  shirt_size = EXCLUDED.shirt_size,
  shorts_size = EXCLUDED.shorts_size,
  shoe_size = EXCLUDED.shoe_size,
  is_active = true,
  notes = EXCLUDED.notes,
  updated_at = NOW();

INSERT INTO coaching_staff (
  id, team_id, full_name, role, email, nationality, photo_url,
  shirt_size, shorts_size, shoe_size, is_active, notes
) VALUES (
  '00000000-0000-4000-8008-000000000004'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Luis Piñedo',
  'Preparador físico',
  'lpinedo@atleticodemadrid.com',
  'España',
  '/clubs/atm/logo.png',
  'L', 'L', 43, true,
  '{"official_slug":"13","demo_id":"c4"}'
)
ON CONFLICT (id) DO UPDATE SET
  team_id = EXCLUDED.team_id,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  email = EXCLUDED.email,
  nationality = EXCLUDED.nationality,
  photo_url = EXCLUDED.photo_url,
  shirt_size = EXCLUDED.shirt_size,
  shorts_size = EXCLUDED.shorts_size,
  shoe_size = EXCLUDED.shoe_size,
  is_active = true,
  notes = EXCLUDED.notes,
  updated_at = NOW();

INSERT INTO coaching_staff (
  id, team_id, full_name, role, email, nationality, photo_url,
  shirt_size, shorts_size, shoe_size, is_active, notes
) VALUES (
  '00000000-0000-4000-8008-000000000005'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Pablo Vercellone',
  'Entrenador de arqueros',
  'pvercellone@atleticodemadrid.com',
  'Argentina',
  '/clubs/atm/logo.png',
  'L', 'L', 43, true,
  '{"official_slug":"13","demo_id":"c5"}'
)
ON CONFLICT (id) DO UPDATE SET
  team_id = EXCLUDED.team_id,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  email = EXCLUDED.email,
  nationality = EXCLUDED.nationality,
  photo_url = EXCLUDED.photo_url,
  shirt_size = EXCLUDED.shirt_size,
  shorts_size = EXCLUDED.shorts_size,
  shoe_size = EXCLUDED.shoe_size,
  is_active = true,
  notes = EXCLUDED.notes,
  updated_at = NOW();
