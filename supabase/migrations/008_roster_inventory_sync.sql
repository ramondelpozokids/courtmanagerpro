-- ============================================================
-- CourtManager Pro — Migración 008
-- Sync plantilla oficial + historial inventario por documento
-- ============================================================

-- Ciclo de vida / fuente oficial en jugadores
ALTER TABLE players
  ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS activated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS deactivated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS official_slug TEXT;

UPDATE players
SET activated_at = COALESCE(activated_at, created_at)
WHERE activated_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_players_team_official_slug
  ON players(team_id, official_slug)
  WHERE official_slug IS NOT NULL;

-- Ciclo de vida / fuente oficial en cuerpo técnico
ALTER TABLE coaching_staff
  ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS activated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS deactivated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS official_slug TEXT;

UPDATE coaching_staff
SET activated_at = COALESCE(activated_at, created_at)
WHERE activated_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_coaching_staff_team_official_slug
  ON coaching_staff(team_id, official_slug)
  WHERE official_slug IS NOT NULL;

-- ============================================================
-- sync_log
-- ============================================================
CREATE TABLE IF NOT EXISTS sync_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  duration_ms INTEGER,
  status TEXT NOT NULL DEFAULT 'ok'
    CHECK (status IN ('ok', 'partial', 'error', 'offline_cache', 'skipped')),
  players_added INTEGER NOT NULL DEFAULT 0,
  players_removed INTEGER NOT NULL DEFAULT 0,
  players_updated INTEGER NOT NULL DEFAULT 0,
  staff_added INTEGER NOT NULL DEFAULT 0,
  staff_removed INTEGER NOT NULL DEFAULT 0,
  staff_updated INTEGER NOT NULL DEFAULT 0,
  changes_count INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  source_url TEXT,
  trigger TEXT NOT NULL DEFAULT 'manual'
    CHECK (trigger IN ('startup', 'cron', 'manual')),
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sync_log_team_started
  ON sync_log(team_id, started_at DESC);

-- ============================================================
-- roster_history
-- ============================================================
CREATE TABLE IF NOT EXISTS roster_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  change_type TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('player', 'staff')),
  entity_id UUID,
  entity_name TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  source TEXT NOT NULL DEFAULT 'realmadrid.com',
  sync_log_id UUID REFERENCES sync_log(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_roster_history_team_changed
  ON roster_history(team_id, changed_at DESC);

-- ============================================================
-- roster_sync_cache (fallback offline)
-- ============================================================
CREATE TABLE IF NOT EXISTS roster_sync_cache (
  team_id UUID PRIMARY KEY REFERENCES teams(id) ON DELETE CASCADE,
  source_id TEXT NOT NULL DEFAULT 'real_madrid_official',
  source_url TEXT,
  payload JSONB NOT NULL DEFAULT '{}',
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- inventory_history
-- ============================================================
CREATE TABLE IF NOT EXISTS inventory_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  document_origin TEXT,
  change_type TEXT NOT NULL
    CHECK (change_type IN ('alta', 'baja', 'modificacion', 'cantidad')),
  item_id UUID REFERENCES inventory_items(id) ON DELETE SET NULL,
  item_name TEXT NOT NULL,
  old_qty INTEGER,
  new_qty INTEGER,
  payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_history_team_changed
  ON inventory_history(team_id, changed_at DESC);

-- ============================================================
-- RLS
-- ============================================================
ALTER TABLE sync_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE roster_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE roster_sync_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sync_log_select" ON sync_log
  FOR SELECT USING (user_belongs_to_team(team_id) OR user_is_admin());

CREATE POLICY "sync_log_insert" ON sync_log
  FOR INSERT WITH CHECK (user_is_manager(team_id) OR user_is_admin());

CREATE POLICY "sync_log_update" ON sync_log
  FOR UPDATE USING (user_is_manager(team_id) OR user_is_admin());

CREATE POLICY "roster_history_select" ON roster_history
  FOR SELECT USING (user_belongs_to_team(team_id) OR user_is_admin());

CREATE POLICY "roster_history_insert" ON roster_history
  FOR INSERT WITH CHECK (user_is_manager(team_id) OR user_is_admin());

CREATE POLICY "roster_sync_cache_select" ON roster_sync_cache
  FOR SELECT USING (user_belongs_to_team(team_id) OR user_is_admin());

CREATE POLICY "roster_sync_cache_upsert" ON roster_sync_cache
  FOR ALL USING (user_is_manager(team_id) OR user_is_admin())
  WITH CHECK (user_is_manager(team_id) OR user_is_admin());

CREATE POLICY "inventory_history_select" ON inventory_history
  FOR SELECT USING (user_belongs_to_team(team_id) OR user_is_admin());

CREATE POLICY "inventory_history_insert" ON inventory_history
  FOR INSERT WITH CHECK (user_can_write(team_id) OR user_is_admin());
