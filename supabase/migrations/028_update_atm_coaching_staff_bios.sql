-- ATM cuerpo técnico: fotos locales + fichas biográficas (sin captura UI / escudo)
-- IDs 8008 (ver 023_seed_atm_coaching_staff.sql)

UPDATE coaching_staff SET
  full_name = 'Diego Pablo Simeone',
  role = 'Entrenador principal',
  nationality = 'Argentina',
  photo_url = 'https://img.a.transfermarkt.technology/portrait/header/2868-1666861792.jpg?lm=1',
  notes = '{"demo_id":"c1","birth_date":"1970-04-28","birth_place":"Buenos Aires, Argentina","profile_url":"https://www.transfermarkt.es/diego-simeone/profil/trainer/2066"}',
  updated_at = NOW()
WHERE id = '00000000-0000-4000-8008-000000000001'::uuid;

UPDATE coaching_staff SET
  full_name = 'Hernán Bonvicini',
  role = 'Entrenador auxiliar',
  nationality = 'Argentina',
  photo_url = '/clubs/atm/logo.png',
  notes = '{"demo_id":"c2","birth_date":"1979-05-17","birth_place":"La Plata, Argentina","legal_name":"Hernán Alejandro Bonvicini"}',
  updated_at = NOW()
WHERE id = '00000000-0000-4000-8008-000000000002'::uuid;

UPDATE coaching_staff SET
  full_name = 'Gabi Fernández',
  role = 'Entrenador asistente',
  nationality = 'España',
  photo_url = '/clubs/atm/staff/gabi.png',
  notes = '{"demo_id":"c3","birth_date":"1983-07-10","birth_place":"Madrid, España","legal_name":"Gabriel Luis Fernández Arenas","height_cm":180}',
  updated_at = NOW()
WHERE id = '00000000-0000-4000-8008-000000000003'::uuid;

UPDATE coaching_staff SET
  full_name = 'Luis Piñedo',
  role = 'Preparador físico',
  nationality = 'España',
  photo_url = '/clubs/atm/staff/pinedo.png',
  notes = '{"demo_id":"c4","profile_url":"https://www.transfermarkt.es/luis-pinedo/profil/trainer/156674"}',
  updated_at = NOW()
WHERE id = '00000000-0000-4000-8008-000000000004'::uuid;

UPDATE coaching_staff SET
  full_name = 'Pablo Vercellone',
  role = 'Entrenador de arqueros',
  nationality = 'Argentina',
  photo_url = '/clubs/atm/staff/vercellone.png',
  notes = '{"demo_id":"c5","birth_date":"1968-04-24","birth_place":"Buenos Aires, Argentina","legal_name":"Pablo Ignacio Vercellone","contract_until":"2027-06-30"}',
  updated_at = NOW()
WHERE id = '00000000-0000-4000-8008-000000000005'::uuid;
