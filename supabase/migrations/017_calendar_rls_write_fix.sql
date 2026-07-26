-- ============================================================
-- 017 — Calendario oficial: RLS para utilería + lectura admin
-- Evita calendario vacío en RMF/RMB por permisos de escritura.
-- ============================================================

DROP POLICY IF EXISTS "official_matches_write" ON official_matches;
CREATE POLICY "official_matches_write" ON official_matches
  FOR ALL USING (user_is_manager(team_id) OR user_can_write(team_id) OR user_is_admin())
  WITH CHECK (user_is_manager(team_id) OR user_can_write(team_id) OR user_is_admin());

DROP POLICY IF EXISTS "match_sync_log_write" ON match_sync_log;
CREATE POLICY "match_sync_log_write" ON match_sync_log
  FOR ALL USING (user_is_manager(team_id) OR user_can_write(team_id) OR user_is_admin())
  WITH CHECK (user_is_manager(team_id) OR user_can_write(team_id) OR user_is_admin());

DROP POLICY IF EXISTS "match_history_insert" ON match_history;
CREATE POLICY "match_history_insert" ON match_history
  FOR INSERT WITH CHECK (user_is_manager(team_id) OR user_can_write(team_id) OR user_is_admin());

DROP POLICY IF EXISTS "match_sync_cache_write" ON match_sync_cache;
CREATE POLICY "match_sync_cache_write" ON match_sync_cache
  FOR ALL USING (user_is_manager(team_id) OR user_can_write(team_id) OR user_is_admin())
  WITH CHECK (user_is_manager(team_id) OR user_can_write(team_id) OR user_is_admin());
