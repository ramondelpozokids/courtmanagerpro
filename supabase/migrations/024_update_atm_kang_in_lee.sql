-- Kang-in Lee (#7) — foto local + centrocampista + ficha
UPDATE players
SET
  full_name = 'Kang-in Lee',
  position = 'centrocampista'::player_position,
  birth_date = '2001-02-19',
  nationality = 'Corea del Sur',
  photo_url = '/clubs/atm/players/kang-in-lee.png',
  jersey_name = 'LEE',
  metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object(
    'demo_id', 'p19',
    'official_slug', 'kang-in-lee-ficha-por-el-atletico-de-madrid',
    'profile_url', 'https://www.atleticodemadrid.com/noticias/kang-in-lee-ficha-por-el-atletico-de-madrid',
    'birth_place', 'Incheon, Corea del Sur',
    'height_cm', 173,
    'weight_kg', 66
  ),
  updated_at = NOW()
WHERE id = '00000000-0000-4000-8004-000000000019'::uuid
   OR (
     team_id = '00000000-0000-4000-8000-000acb423458'::uuid
     AND dorsal = 7
     AND full_name ILIKE '%kang%lee%'
   );
