-- Hernán Bonvicini: foto local (ya no escudo ATM)

UPDATE coaching_staff SET
  full_name = 'Hernán Bonvicini',
  role = 'Entrenador asistente',
  nationality = 'Argentina',
  photo_url = '/clubs/atm/staff/bonvicini.png',
  notes = '{"demo_id":"c2","birth_date":"1979-05-17","birth_place":"La Plata, Argentina","legal_name":"Hernán Alejandro Bonvicini"}',
  updated_at = NOW()
WHERE id = '00000000-0000-4000-8008-000000000002'::uuid;
