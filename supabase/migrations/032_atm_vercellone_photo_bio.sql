-- Pablo Vercellone: confirmar ficha (nombre legal / Buenos Aires / 24-04-1968)
-- Foto local actualizada en /clubs/atm/staff/vercellone.png

UPDATE coaching_staff SET
  full_name = 'Pablo Vercellone',
  role = 'Entrenador de porteros',
  nationality = 'Argentina',
  photo_url = '/clubs/atm/staff/vercellone.png',
  notes = '{"demo_id":"c5","birth_date":"1968-04-24","birth_place":"Buenos Aires, Argentina","legal_name":"Pablo Ignacio Vercellone","nationality":"Argentina","contract_until":"2027-06-30"}',
  updated_at = NOW()
WHERE id = '00000000-0000-4000-8008-000000000005'::uuid;
