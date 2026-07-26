-- Equipo Real Madrid Fútbol (RMF) para solicitudes reales en Supabase
INSERT INTO teams (id, name, short_name, season, league, primary_color, secondary_color, metadata)
VALUES (
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Real Madrid Fútbol',
  'RMF',
  '2026-2027',
  'LaLiga',
  '#FFFFFF',
  '#FEBE10',
  '{"demoSlug":"rmf","sport":"football"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  season = EXCLUDED.season,
  league = EXCLUDED.league,
  updated_at = NOW();
