-- Vincular superadmin Ramón (ejecutar tras crear usuario en Supabase Auth)
-- Sustituir <UUID-RAMON> por el id real de Authentication → Users

INSERT INTO profiles (id, email, full_name, role, department, is_active, avatar_url)
VALUES (
  '<UUID-RAMON>',
  'info@ramondelpozorott.es',
  'Ramón del Pozo Rott',
  'admin',
  'Superadmin',
  true,
  '/images/ramon-del-pozo.png'
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = 'admin',
  department = EXCLUDED.department,
  is_active = true,
  avatar_url = EXCLUDED.avatar_url;

INSERT INTO user_teams (user_id, team_id, role, is_active)
VALUES (
  '<UUID-RAMON>',
  '00000000-0000-4000-8000-000acb123456',
  'admin',
  true
)
ON CONFLICT DO NOTHING;
