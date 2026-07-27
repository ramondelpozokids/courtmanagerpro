-- Óscar Pitillas: foto oficial club + ficha (nombre legal / Valencia / 16-01-1971)

UPDATE coaching_staff SET
  full_name = 'Óscar Pitillas',
  role = 'Preparador físico',
  email = 'opitillas@atleticodemadrid.com',
  nationality = 'España',
  photo_url = '/clubs/atm/staff/pitillas.png',
  notes = '{"demo_id":"c4","birth_date":"1971-01-16","birth_place":"Valencia, España","legal_name":"Óscar Miguel Pitillas Torra","nationality":"España","profile_url":"https://www.transfermarkt.es/oscar-pitillas/profil/trainer/16403"}',
  updated_at = NOW()
WHERE id = '00000000-0000-4000-8008-000000000004'::uuid;
