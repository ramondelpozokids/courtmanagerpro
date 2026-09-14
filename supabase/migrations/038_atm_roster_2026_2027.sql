-- CourtManager Pro — ATM plantilla / staff / temporada 2026-2027
-- Fuente: https://www.atleticodemadrid.com/jugadores-primer-equipo/
--          https://www.atleticodemadrid.com/calendario-completo-primer-equipo/

UPDATE teams
SET season = '2026-2027',
    league = 'LaLiga',
    updated_at = NOW()
WHERE id = '00000000-0000-4000-8000-000acb423458'::uuid;

-- Jugadores que ya no están en la plantilla oficial 26/27
UPDATE players
SET is_active = false, updated_at = NOW()
WHERE team_id = '00000000-0000-4000-8000-000acb423458'::uuid
  AND (
    metadata->>'demo_id' IN ('p3', 'p4', 'p5', 'p6', 'p21', 'p24', 'p26', 'p27')
    OR full_name IN (
      'José María Giménez',
      'Matteo Ruggeri',
      'Clément Lenglet',
      'Nahuel Molina',
      'Thiago Almada',
      'Nicolás González',
      'Thomas Lemar',
      'Carlos Martín Domínguez'
    )
  );

UPDATE coaching_staff
SET is_active = false, updated_at = NOW()
WHERE team_id = '00000000-0000-4000-8000-000acb423458'::uuid
  AND full_name ILIKE '%Pitillas%';

-- Dorsales oficiales 26/27 (quienes continúan)
UPDATE players SET dorsal = 3, is_active = true, updated_at = NOW()
WHERE team_id = '00000000-0000-4000-8000-000acb423458'::uuid AND metadata->>'demo_id' = 'p17'; -- Obed Vargas
UPDATE players SET dorsal = 22, is_active = true, updated_at = NOW()
WHERE team_id = '00000000-0000-4000-8000-000acb423458'::uuid AND metadata->>'demo_id' = 'p25'; -- Grimaldo
UPDATE players SET dorsal = 11, is_active = true, updated_at = NOW()
WHERE team_id = '00000000-0000-4000-8000-000acb423458'::uuid AND metadata->>'demo_id' = 'p23'; -- Lookman
UPDATE players SET dorsal = 23, is_active = true, updated_at = NOW()
WHERE team_id = '00000000-0000-4000-8000-000acb423458'::uuid AND metadata->>'demo_id' = 'p18'; -- Hjulmand

-- Cuerpo técnico oficial 26/27 (c4 deja de ser Pitillas)
UPDATE coaching_staff SET
  full_name = 'Luis Piñedo Betrián',
  role = 'Preparador físico',
  email = 'lpinedo@atleticodemadrid.com',
  is_active = true,
  updated_at = NOW()
WHERE id = '00000000-0000-4000-8008-000000000004'::uuid;

INSERT INTO coaching_staff (
  id, team_id, full_name, role, email, nationality, photo_url,
  shirt_size, shorts_size, shoe_size, is_active, notes
) VALUES (
  '00000000-0000-4000-8008-000000000006'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Gustavo López',
  'Asistente de entrenador',
  'glopez@atleticodemadrid.com',
  'Argentina',
  'https://img-estaticos.atleticodemadrid.com/system/fotos/19594/ctecnico_120x120/busto__0000s_0000s_0000_magnific_4RZqNdR9Aa.jpg',
  'L', 'L', 43, true,
  '{"demo_id":"c6"}'
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  is_active = true,
  updated_at = NOW();

UPDATE coaching_staff SET
  full_name = 'Gabriel Fernández Arenas',
  role = 'Asistente de entrenador',
  is_active = true,
  updated_at = NOW()
WHERE id = '00000000-0000-4000-8008-000000000003'::uuid;

