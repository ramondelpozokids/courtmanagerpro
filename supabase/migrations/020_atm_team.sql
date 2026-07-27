-- Equipo Atlético de Madrid Fútbol (ATM) — producción como RMF
INSERT INTO teams (id, name, short_name, season, league, primary_color, secondary_color, metadata)
VALUES (
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Atlético de Madrid',
  'ATM',
  '2025-2026',
  'LaLiga',
  '#FFFFFF',
  '#E8151E',
  '{"demoSlug":"atm","sport":"football","plantillaUrl":"https://www.atleticodemadrid.com/equipos/atletico-de-madrid-2025-2026","calendarUrl":"https://www.atleticodemadrid.com/calendario-completo-primer-equipo/","storeUrl":"https://www.atleticodemadrid.com/atm/atleti-store"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  season = EXCLUDED.season,
  league = EXCLUDED.league,
  primary_color = EXCLUDED.primary_color,
  secondary_color = EXCLUDED.secondary_color,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();
