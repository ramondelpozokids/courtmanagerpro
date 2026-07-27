-- Gabi: restaurar foto Transfermarkt + ficha Wikipedia.

UPDATE coaching_staff SET
  full_name = 'Gabi Fernández',
  role = 'Entrenador asistente',
  nationality = 'España',
  photo_url = 'https://img.a.transfermarkt.technology/portrait/header/97091-1732139341.JPG?lm=1',
  notes = '{"demo_id":"c3","birth_date":"1983-07-10","birth_place":"Madrid, España","legal_name":"Gabriel Luis Fernández Arenas","height_cm":180,"known_as":"Gabi","trajectory":"Excentrocampista (nº 14 Atlético / Al-Sadd). Asistente ATM desde 2026-27; DT Real Zaragoza 2025."}',
  updated_at = NOW()
WHERE id = '00000000-0000-4000-8008-000000000003'::uuid;
