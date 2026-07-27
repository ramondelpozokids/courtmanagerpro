-- Forzar fotos locales Koke (#6) y Clément Lenglet (#15) en ATM
UPDATE players
SET
  photo_url = '/clubs/atm/players/koke.png',
  updated_at = NOW()
WHERE team_id = '00000000-0000-4000-8000-000acb423458'::uuid
  AND (
    id = '00000000-0000-4000-8004-000000000012'::uuid
    OR dorsal = 6
    OR full_name ILIKE '%koke%'
    OR full_name ILIKE '%resurrec%'
  );

UPDATE players
SET
  photo_url = '/clubs/atm/players/lenglet.png',
  updated_at = NOW()
WHERE team_id = '00000000-0000-4000-8000-000acb423458'::uuid
  AND (
    id = '00000000-0000-4000-8004-000000000005'::uuid
    OR dorsal = 15
    OR full_name ILIKE '%lenglet%'
  );
