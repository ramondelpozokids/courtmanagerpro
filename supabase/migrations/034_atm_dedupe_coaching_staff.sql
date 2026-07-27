-- ATM: eliminar duplicados de cuerpo técnico (p.ej. 2× Pablo Vercellone, Piñedo vs Pitillas)
-- Canonical IDs: 8008-001 … 8008-005

-- 1) Desactivar cualquier staff ATM activo que NO sea el set canónico 8008
UPDATE coaching_staff
SET is_active = false, updated_at = NOW()
WHERE team_id = '00000000-0000-4000-8000-000acb423458'::uuid
  AND is_active = true
  AND id NOT IN (
    '00000000-0000-4000-8008-000000000001'::uuid,
    '00000000-0000-4000-8008-000000000002'::uuid,
    '00000000-0000-4000-8008-000000000003'::uuid,
    '00000000-0000-4000-8008-000000000004'::uuid,
    '00000000-0000-4000-8008-000000000005'::uuid
  );

-- 2) Asegurar canónicos activos + datos correctos
UPDATE coaching_staff SET
  full_name = 'Diego Pablo Simeone',
  role = 'Entrenador principal',
  nationality = 'Argentina',
  is_active = true,
  updated_at = NOW()
WHERE id = '00000000-0000-4000-8008-000000000001'::uuid;

UPDATE coaching_staff SET
  full_name = 'Hernán Bonvicini',
  role = 'Entrenador asistente',
  nationality = 'Argentina',
  is_active = true,
  updated_at = NOW()
WHERE id = '00000000-0000-4000-8008-000000000002'::uuid;

UPDATE coaching_staff SET
  full_name = 'Gabi Fernández',
  role = 'Entrenador asistente',
  nationality = 'España',
  is_active = true,
  updated_at = NOW()
WHERE id = '00000000-0000-4000-8008-000000000003'::uuid;

UPDATE coaching_staff SET
  full_name = 'Óscar Pitillas',
  role = 'Preparador físico',
  email = 'opitillas@atleticodemadrid.com',
  nationality = 'España',
  photo_url = '/clubs/atm/staff/pitillas.png',
  is_active = true,
  notes = '{"demo_id":"c4","birth_date":"1971-01-16","birth_place":"Valencia, España","legal_name":"Óscar Miguel Pitillas Torra"}',
  updated_at = NOW()
WHERE id = '00000000-0000-4000-8008-000000000004'::uuid;

UPDATE coaching_staff SET
  full_name = 'Pablo Vercellone',
  role = 'Entrenador de porteros',
  nationality = 'Argentina',
  photo_url = '/clubs/atm/staff/vercellone.png',
  is_active = true,
  notes = '{"demo_id":"c5","birth_date":"1968-04-24","birth_place":"Buenos Aires, Argentina","legal_name":"Pablo Ignacio Vercellone","nationality":"Argentina"}',
  updated_at = NOW()
WHERE id = '00000000-0000-4000-8008-000000000005'::uuid;
