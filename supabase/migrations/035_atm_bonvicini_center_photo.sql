-- Recentralizar foto Bonvicini (cache-bust)

UPDATE coaching_staff SET
  photo_url = '/clubs/atm/staff/bonvicini.png?v=2',
  updated_at = NOW()
WHERE id = '00000000-0000-4000-8008-000000000002'::uuid;
