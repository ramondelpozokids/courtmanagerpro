-- Botiquín ATM: imagen de botiquín (no escudo del club)
UPDATE inventory_items
SET
  image_url = '/images/botiquin.svg',
  updated_at = NOW()
WHERE team_id = '00000000-0000-4000-8000-000acb423458'::uuid
  AND (
    sku = 'ATM-MED-KIT'
    OR category = 'medico'
    OR name ILIKE '%botiqu%'
  )
  AND (
    image_url IS NULL
    OR image_url ILIKE '%/logo.png'
    OR image_url ILIKE '%/clubs/atm/logo%'
    OR image_url ILIKE '%realmadrid%'
  );

-- Mismo criterio para RMF (botiquín viaje)
UPDATE inventory_items
SET
  image_url = '/images/botiquin.svg',
  updated_at = NOW()
WHERE sku = 'RMF-MED-KIT'
  AND (
    image_url IS NULL
    OR image_url ILIKE '%/logo.png'
    OR image_url ILIKE '%/clubs/rmf/logo%'
  );
