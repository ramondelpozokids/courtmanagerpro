-- ============================================================
-- 020 — Simplificación y documentación de políticas RLS
-- Comportamiento idéntico: solo elimina redundancias y documenta.
-- ============================================================

-- ------------------------------------------------------------
-- 1) Tablas 004: sustituir subconsulta duplicada por helper
--    Equivalente a user_belongs_to_team(team_id).
-- ------------------------------------------------------------

DROP POLICY IF EXISTS "coaching_staff_team_access" ON coaching_staff;
CREATE POLICY "coaching_staff_team_access" ON coaching_staff
  FOR ALL USING (user_belongs_to_team(team_id))
  WITH CHECK (user_belongs_to_team(team_id));
COMMENT ON POLICY "coaching_staff_team_access" ON coaching_staff IS
  'Staff técnico: miembros activos del equipo (helper user_belongs_to_team).';

DROP POLICY IF EXISTS "garment_units_team_access" ON garment_units;
CREATE POLICY "garment_units_team_access" ON garment_units
  FOR ALL USING (user_belongs_to_team(team_id))
  WITH CHECK (user_belongs_to_team(team_id));
COMMENT ON POLICY "garment_units_team_access" ON garment_units IS
  'Unidades de prenda: miembros activos del equipo.';

DROP POLICY IF EXISTS "sizing_products_team_access" ON sizing_products;
CREATE POLICY "sizing_products_team_access" ON sizing_products
  FOR ALL USING (user_belongs_to_team(team_id))
  WITH CHECK (user_belongs_to_team(team_id));
COMMENT ON POLICY "sizing_products_team_access" ON sizing_products IS
  'Productos de tallaje: miembros activos del equipo.';

-- ------------------------------------------------------------
-- 2) Calendario (017): user_is_manager ⊆ user_can_write → redundante
--    Antes: user_is_manager OR user_can_write OR user_is_admin
--    Ahora: user_can_write OR user_is_admin  (mismo conjunto de roles)
-- ------------------------------------------------------------

DROP POLICY IF EXISTS "official_matches_write" ON official_matches;
CREATE POLICY "official_matches_write" ON official_matches
  FOR ALL USING (user_can_write(team_id) OR user_is_admin())
  WITH CHECK (user_can_write(team_id) OR user_is_admin());
COMMENT ON POLICY "official_matches_write" ON official_matches IS
  'Escritura calendario oficial: staff con write del equipo o admin global.';

DROP POLICY IF EXISTS "match_sync_log_write" ON match_sync_log;
CREATE POLICY "match_sync_log_write" ON match_sync_log
  FOR ALL USING (user_can_write(team_id) OR user_is_admin())
  WITH CHECK (user_can_write(team_id) OR user_is_admin());
COMMENT ON POLICY "match_sync_log_write" ON match_sync_log IS
  'Escritura log de sync de partidos: write del equipo o admin global.';

DROP POLICY IF EXISTS "match_history_insert" ON match_history;
CREATE POLICY "match_history_insert" ON match_history
  FOR INSERT WITH CHECK (user_can_write(team_id) OR user_is_admin());
COMMENT ON POLICY "match_history_insert" ON match_history IS
  'Insert historial de partidos: write del equipo o admin global.';

DROP POLICY IF EXISTS "match_sync_cache_write" ON match_sync_cache;
CREATE POLICY "match_sync_cache_write" ON match_sync_cache
  FOR ALL USING (user_can_write(team_id) OR user_is_admin())
  WITH CHECK (user_can_write(team_id) OR user_is_admin());
COMMENT ON POLICY "match_sync_cache_write" ON match_sync_cache IS
  'Escritura caché de sync: write del equipo o admin global.';

-- ------------------------------------------------------------
-- 3) Documentación de políticas core (002) — sin cambiar expresiones
-- ------------------------------------------------------------

COMMENT ON POLICY "profiles_select" ON profiles IS
  'Lectura de perfil propio o todos si admin global.';
COMMENT ON POLICY "profiles_update" ON profiles IS
  'Actualización del propio perfil o cualquiera si admin.';
COMMENT ON POLICY "profiles_insert" ON profiles IS
  'Alta de perfiles (registro/admin).';

COMMENT ON POLICY "teams_select" ON teams IS
  'Listado de equipos a los que pertenece el usuario o admin.';
COMMENT ON POLICY "teams_insert" ON teams IS
  'Creación de equipos (admin).';
COMMENT ON POLICY "teams_update" ON teams IS
  'Actualización de equipos (admin/manager).';

COMMENT ON POLICY "user_teams_select" ON user_teams IS
  'Membresías visibles para el propio usuario o admin.';
COMMENT ON POLICY "user_teams_insert" ON user_teams IS
  'Alta de membresías (admin).';
COMMENT ON POLICY "user_teams_update" ON user_teams IS
  'Actualización de membresías (admin).';

COMMENT ON POLICY "players_select" ON players IS
  'Plantilla visible para miembros del equipo.';
COMMENT ON POLICY "players_select_own" ON players IS
  'Jugador autenticado ve su propio registro (OR con players_select).';
COMMENT ON POLICY "players_insert" ON players IS
  'Alta de jugadores: roles con user_can_write.';
COMMENT ON POLICY "players_update" ON players IS
  'Edición de jugadores: roles con user_can_write.';
COMMENT ON POLICY "players_delete" ON players IS
  'Borrado de jugadores: managers del equipo.';

COMMENT ON POLICY "inventory_select" ON inventory_items IS
  'Inventario legible por miembros del equipo.';
COMMENT ON POLICY "inventory_insert" ON inventory_items IS
  'Alta de ítems: user_can_write.';
COMMENT ON POLICY "inventory_update" ON inventory_items IS
  'Edición de ítems: user_can_write.';
COMMENT ON POLICY "inventory_delete" ON inventory_items IS
  'Borrado de ítems: managers.';

COMMENT ON POLICY "medical_select" ON medical_items IS
  'Material médico: admin global o roles médicos/utilería del equipo (016).';
COMMENT ON POLICY "medical_write" ON medical_items IS
  'Escritura material médico: admin global o roles médicos/utilería (016).';
