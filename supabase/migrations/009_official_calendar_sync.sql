-- ============================================================
-- CourtManager Pro — Migración 009
-- Calendario oficial primer equipo baloncesto (realmadrid.com)
-- ============================================================

ALTER TYPE alert_type ADD VALUE IF NOT EXISTS 'calendario_cambio';
ALTER TYPE alert_type ADD VALUE IF NOT EXISTS 'calendario_nuevo';
ALTER TYPE alert_type ADD VALUE IF NOT EXISTS 'calendario_resultado';

CREATE TABLE IF NOT EXISTS official_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  official_id TEXT,
  official_slug TEXT NOT NULL,
  match_date DATE NOT NULL,
  match_time TIME,
  match_datetime TIMESTAMPTZ,
  rival TEXT NOT NULL,
  home_away TEXT NOT NULL CHECK (home_away IN ('local', 'visitante', 'neutral')),
  competition TEXT NOT NULL,
  competition_slug TEXT,
  jornada TEXT,
  venue TEXT,
  city TEXT,
  country TEXT,
  status TEXT NOT NULL DEFAULT 'pendiente'
    CHECK (status IN ('pendiente', 'en_juego', 'finalizado', 'suspendido', 'aplazado')),
  score_home INTEGER,
  score_away INTEGER,
  score_text TEXT,
  partial_score TEXT,
  result TEXT CHECK (result IS NULL OR result IN ('victoria', 'derrota', 'empate', 'prorroga')),
  official_url TEXT,
  source TEXT NOT NULL DEFAULT 'realmadrid.com',
  last_synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  raw JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (team_id, official_slug)
);

CREATE INDEX IF NOT EXISTS idx_official_matches_team_date
  ON official_matches(team_id, match_datetime);
CREATE INDEX IF NOT EXISTS idx_official_matches_team_status
  ON official_matches(team_id, status);

CREATE TABLE IF NOT EXISTS match_sync_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  duration_ms INTEGER,
  status TEXT NOT NULL DEFAULT 'ok'
    CHECK (status IN ('ok', 'partial', 'error', 'offline_cache', 'skipped')),
  matches_added INTEGER NOT NULL DEFAULT 0,
  matches_updated INTEGER NOT NULL DEFAULT 0,
  matches_removed INTEGER NOT NULL DEFAULT 0,
  results_updated INTEGER NOT NULL DEFAULT 0,
  changes_count INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  source_url TEXT,
  trigger TEXT NOT NULL DEFAULT 'manual'
    CHECK (trigger IN ('startup', 'cron', 'manual')),
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_match_sync_log_team_started
  ON match_sync_log(team_id, started_at DESC);

CREATE TABLE IF NOT EXISTS match_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  match_id UUID REFERENCES official_matches(id) ON DELETE SET NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  change_type TEXT NOT NULL,
  entity_name TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  source TEXT NOT NULL DEFAULT 'realmadrid.com',
  sync_log_id UUID REFERENCES match_sync_log(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_match_history_team_changed
  ON match_history(team_id, changed_at DESC);

CREATE TABLE IF NOT EXISTS match_sync_cache (
  team_id UUID PRIMARY KEY REFERENCES teams(id) ON DELETE CASCADE,
  source_id TEXT NOT NULL DEFAULT 'real_madrid_official_calendar',
  source_url TEXT,
  payload JSONB NOT NULL DEFAULT '{}',
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE official_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_sync_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_sync_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "official_matches_select" ON official_matches
  FOR SELECT USING (user_belongs_to_team(team_id) OR user_is_admin());
CREATE POLICY "official_matches_write" ON official_matches
  FOR ALL USING (user_is_manager(team_id) OR user_is_admin())
  WITH CHECK (user_is_manager(team_id) OR user_is_admin());

CREATE POLICY "match_sync_log_select" ON match_sync_log
  FOR SELECT USING (user_belongs_to_team(team_id) OR user_is_admin());
CREATE POLICY "match_sync_log_write" ON match_sync_log
  FOR ALL USING (user_is_manager(team_id) OR user_is_admin())
  WITH CHECK (user_is_manager(team_id) OR user_is_admin());

CREATE POLICY "match_history_select" ON match_history
  FOR SELECT USING (user_belongs_to_team(team_id) OR user_is_admin());
CREATE POLICY "match_history_insert" ON match_history
  FOR INSERT WITH CHECK (user_is_manager(team_id) OR user_is_admin());

CREATE POLICY "match_sync_cache_select" ON match_sync_cache
  FOR SELECT USING (user_belongs_to_team(team_id) OR user_is_admin());
CREATE POLICY "match_sync_cache_write" ON match_sync_cache
  FOR ALL USING (user_is_manager(team_id) OR user_is_admin())
  WITH CHECK (user_is_manager(team_id) OR user_is_admin());
