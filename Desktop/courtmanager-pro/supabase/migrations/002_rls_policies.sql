-- ============================================================
-- CourtManager Pro — Row Level Security (RLS)
-- Migración 002: Políticas de seguridad
-- ============================================================

-- Activar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE laundry_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE laundry_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_teams ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- FUNCIONES HELPER para RLS
-- ============================================================

-- Obtener el rol del usuario en un equipo
CREATE OR REPLACE FUNCTION get_user_team_role(p_team_id UUID)
RETURNS user_role LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT role FROM user_teams
  WHERE user_id = auth.uid() AND team_id = p_team_id AND is_active = true
  LIMIT 1;
$$;

-- Verificar si el usuario pertenece al equipo
CREATE OR REPLACE FUNCTION user_belongs_to_team(p_team_id UUID)
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_teams
    WHERE user_id = auth.uid() AND team_id = p_team_id AND is_active = true
  );
$$;

-- Verificar si el usuario tiene permiso de escritura
CREATE OR REPLACE FUNCTION user_can_write(p_team_id UUID)
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_teams
    WHERE user_id = auth.uid() AND team_id = p_team_id AND is_active = true
    AND role IN ('admin', 'equipment_manager', 'assistant')
  );
$$;

-- Verificar si el usuario es admin o manager
CREATE OR REPLACE FUNCTION user_is_manager(p_team_id UUID)
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_teams
    WHERE user_id = auth.uid() AND team_id = p_team_id AND is_active = true
    AND role IN ('admin', 'equipment_manager')
  );
$$;

-- Verificar si el usuario es admin global
CREATE OR REPLACE FUNCTION user_is_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ============================================================
-- POLÍTICAS: profiles
-- ============================================================

-- Leer propio perfil siempre; admins leen todos
CREATE POLICY "profiles_select" ON profiles
FOR SELECT USING ( id = auth.uid() OR user_is_admin() );

-- Solo el propio usuario puede actualizar su perfil
CREATE POLICY "profiles_update" ON profiles
FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- Solo admins pueden crear perfiles directamente
CREATE POLICY "profiles_insert" ON profiles
FOR INSERT WITH CHECK (user_is_admin() OR id = auth.uid());

-- ============================================================
-- POLÍTICAS: teams
-- ============================================================
CREATE POLICY "teams_select" ON teams
FOR SELECT USING (user_belongs_to_team(id) OR user_is_admin());

CREATE POLICY "teams_insert" ON teams
FOR INSERT WITH CHECK (user_is_admin());

CREATE POLICY "teams_update" ON teams
FOR UPDATE USING (user_is_manager(id) OR user_is_admin());

-- ============================================================
-- POLÍTICAS: user_teams
-- ============================================================
CREATE POLICY "user_teams_select" ON user_teams
FOR SELECT USING (
  user_id = auth.uid() OR
  user_is_manager(team_id) OR
  user_is_admin()
);

CREATE POLICY "user_teams_insert" ON user_teams
FOR INSERT WITH CHECK (user_is_manager(team_id) OR user_is_admin());

CREATE POLICY "user_teams_update" ON user_teams
FOR UPDATE USING (user_is_manager(team_id) OR user_is_admin());

-- ============================================================
-- POLÍTICAS: players
-- ============================================================

-- Lectura: todos los miembros del equipo
CREATE POLICY "players_select" ON players
FOR SELECT USING (user_belongs_to_team(team_id));

-- Jugadores solo ven su propio registro
CREATE POLICY "players_select_own" ON players
FOR SELECT USING (user_id = auth.uid());

-- Escritura: staff
CREATE POLICY "players_insert" ON players
FOR INSERT WITH CHECK (user_can_write(team_id));

CREATE POLICY "players_update" ON players
FOR UPDATE USING (user_can_write(team_id));

CREATE POLICY "players_delete" ON players
FOR DELETE USING (user_is_manager(team_id));

-- ============================================================
-- POLÍTICAS: inventory_items
-- ============================================================
CREATE POLICY "inventory_select" ON inventory_items
FOR SELECT USING (user_belongs_to_team(team_id));

CREATE POLICY "inventory_insert" ON inventory_items
FOR INSERT WITH CHECK (user_can_write(team_id));

CREATE POLICY "inventory_update" ON inventory_items
FOR UPDATE USING (user_can_write(team_id));

CREATE POLICY "inventory_delete" ON inventory_items
FOR DELETE USING (user_is_manager(team_id));

-- ============================================================
-- POLÍTICAS: item_assignments
-- ============================================================
CREATE POLICY "assignments_select" ON item_assignments
FOR SELECT USING (
  -- Staff ve todas
  user_can_write((SELECT team_id FROM inventory_items WHERE id = item_id)) OR
  -- Jugadores ven sus propias asignaciones
  player_id IN (SELECT id FROM players WHERE user_id = auth.uid())
);

CREATE POLICY "assignments_insert" ON item_assignments
FOR INSERT WITH CHECK (
  user_can_write((SELECT team_id FROM inventory_items WHERE id = item_id))
);

CREATE POLICY "assignments_update" ON item_assignments
FOR UPDATE USING (
  user_can_write((SELECT team_id FROM inventory_items WHERE id = item_id))
);

-- ============================================================
-- POLÍTICAS: requests
-- ============================================================
CREATE POLICY "requests_select" ON requests
FOR SELECT USING (
  user_can_write(team_id) OR -- Staff ve todo
  requester_id = auth.uid() OR -- Solicitante ve su propia
  player_id IN (SELECT id FROM players WHERE user_id = auth.uid()) -- Jugador ve la suya
);

-- Cualquier miembro del equipo puede crear una solicitud
CREATE POLICY "requests_insert" ON requests
FOR INSERT WITH CHECK (user_belongs_to_team(team_id));

-- Staff puede actualizar; solicitante puede cancelar si está pendiente
CREATE POLICY "requests_update" ON requests
FOR UPDATE USING (
  user_can_write(team_id) OR
  (requester_id = auth.uid() AND status = 'pendiente')
);

-- ============================================================
-- POLÍTICAS: request_items
-- ============================================================
CREATE POLICY "request_items_select" ON request_items
FOR SELECT USING (
  request_id IN (SELECT id FROM requests WHERE user_can_write(team_id)) OR
  request_id IN (SELECT id FROM requests WHERE requester_id = auth.uid())
);

CREATE POLICY "request_items_insert" ON request_items
FOR INSERT WITH CHECK (
  request_id IN (SELECT id FROM requests WHERE user_belongs_to_team(team_id))
);

-- ============================================================
-- POLÍTICAS: request_comments
-- ============================================================
CREATE POLICY "comments_select" ON request_comments
FOR SELECT USING (
  -- Comentarios internos solo para staff
  (is_internal = false AND request_id IN (
    SELECT id FROM requests WHERE user_belongs_to_team(team_id)
  )) OR
  (request_id IN (SELECT id FROM requests WHERE user_can_write(team_id)))
);

CREATE POLICY "comments_insert" ON request_comments
FOR INSERT WITH CHECK (
  request_id IN (SELECT id FROM requests WHERE user_belongs_to_team(team_id))
);

-- ============================================================
-- POLÍTICAS: trips
-- ============================================================
CREATE POLICY "trips_select" ON trips
FOR SELECT USING (user_belongs_to_team(team_id));

CREATE POLICY "trips_insert" ON trips
FOR INSERT WITH CHECK (user_can_write(team_id));

CREATE POLICY "trips_update" ON trips
FOR UPDATE USING (user_can_write(team_id));

CREATE POLICY "trips_delete" ON trips
FOR DELETE USING (user_is_manager(team_id));

-- ============================================================
-- POLÍTICAS: trip_players, trip_items
-- ============================================================
CREATE POLICY "trip_players_select" ON trip_players
FOR SELECT USING (
  trip_id IN (SELECT id FROM trips WHERE user_belongs_to_team(team_id))
);

CREATE POLICY "trip_players_write" ON trip_players
FOR ALL USING (
  trip_id IN (SELECT id FROM trips WHERE user_can_write(team_id))
);

CREATE POLICY "trip_items_select" ON trip_items
FOR SELECT USING (
  trip_id IN (SELECT id FROM trips WHERE user_belongs_to_team(team_id))
);

CREATE POLICY "trip_items_write" ON trip_items
FOR ALL USING (
  trip_id IN (SELECT id FROM trips WHERE user_can_write(team_id))
);

-- ============================================================
-- POLÍTICAS: laundry
-- ============================================================
CREATE POLICY "laundry_batches_select" ON laundry_batches
FOR SELECT USING (user_belongs_to_team(team_id));

CREATE POLICY "laundry_batches_write" ON laundry_batches
FOR ALL USING (user_can_write(team_id));

CREATE POLICY "laundry_items_select" ON laundry_items
FOR SELECT USING (
  batch_id IN (SELECT id FROM laundry_batches WHERE user_belongs_to_team(team_id))
);

CREATE POLICY "laundry_items_write" ON laundry_items
FOR ALL USING (
  batch_id IN (SELECT id FROM laundry_batches WHERE user_can_write(team_id))
);

-- ============================================================
-- POLÍTICAS: medical
-- ============================================================

-- Médicos y staff con permisos ven material médico
CREATE POLICY "medical_select" ON medical_items
FOR SELECT USING (
  user_belongs_to_team(team_id) AND
  get_user_team_role(team_id) IN ('admin', 'equipment_manager', 'medical', 'assistant')
);

CREATE POLICY "medical_write" ON medical_items
FOR ALL USING (
  get_user_team_role(team_id) IN ('admin', 'equipment_manager', 'medical')
);

CREATE POLICY "medical_usage_select" ON medical_usage
FOR SELECT USING (
  item_id IN (SELECT id FROM medical_items WHERE user_belongs_to_team(team_id))
);

CREATE POLICY "medical_usage_insert" ON medical_usage
FOR INSERT WITH CHECK (
  item_id IN (SELECT id FROM medical_items WHERE user_belongs_to_team(team_id)) AND
  get_user_team_role(
    (SELECT team_id FROM medical_items WHERE id = item_id)
  ) IN ('admin', 'equipment_manager', 'medical')
);

-- ============================================================
-- POLÍTICAS: alerts
-- ============================================================
CREATE POLICY "alerts_select" ON alerts
FOR SELECT USING (user_belongs_to_team(team_id));

CREATE POLICY "alerts_update" ON alerts
FOR UPDATE USING (user_belongs_to_team(team_id));

CREATE POLICY "alerts_insert" ON alerts
FOR INSERT WITH CHECK (user_can_write(team_id));

-- ============================================================
-- POLÍTICAS: audit_log
-- ============================================================

-- Solo admins y managers ven el log
CREATE POLICY "audit_select" ON audit_log
FOR SELECT USING (user_is_admin() OR user_is_manager(team_id));

-- El trigger inserta con SECURITY DEFINER, los usuarios no insertan directamente
CREATE POLICY "audit_insert" ON audit_log
FOR INSERT WITH CHECK (false); -- Solo via función con SECURITY DEFINER
