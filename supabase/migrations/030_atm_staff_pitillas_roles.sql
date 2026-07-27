-- ATM cuerpo técnico oficial:
-- Principal: Simeone | Asistentes: Bonvicini + Gabi | Porteros: Vercellone | PF: Óscar Pitillas

UPDATE coaching_staff SET
  role = 'Entrenador asistente',
  notes = '{"demo_id":"c2","birth_date":"1979-05-17","birth_place":"La Plata, Argentina","legal_name":"Hernán Alejandro Bonvicini"}',
  updated_at = NOW()
WHERE id = '00000000-0000-4000-8008-000000000002'::uuid;

UPDATE coaching_staff SET
  role = 'Entrenador asistente',
  updated_at = NOW()
WHERE id = '00000000-0000-4000-8008-000000000003'::uuid;

UPDATE coaching_staff SET
  full_name = 'Óscar Pitillas',
  role = 'Preparador físico',
  email = 'opitillas@atleticodemadrid.com',
  nationality = 'España',
  photo_url = 'https://tmssl.akamaized.net/images/portrait/header/16403.jpg',
  notes = '{"demo_id":"c4","birth_date":"1971-01-16","birth_place":"Valencia, España","legal_name":"Óscar Miguel Pitillas Torra","profile_url":"https://www.transfermarkt.es/oscar-pitillas/profil/trainer/16403"}',
  updated_at = NOW()
WHERE id = '00000000-0000-4000-8008-000000000004'::uuid;

UPDATE coaching_staff SET
  role = 'Entrenador de porteros',
  notes = '{"demo_id":"c5","birth_date":"1968-04-24","birth_place":"Buenos Aires, Argentina","legal_name":"Pablo Ignacio Vercellone","contract_until":"2027-06-30"}',
  updated_at = NOW()
WHERE id = '00000000-0000-4000-8008-000000000005'::uuid;
