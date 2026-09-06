-- Carlos (admin operativo) puede leer/escribir datos de club live
-- aunque falte fila en user_teams. No es superadmin de producto.

CREATE OR REPLACE FUNCTION user_belongs_to_team(p_team_id UUID)
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_teams
    WHERE user_id = auth.uid() AND team_id = p_team_id AND is_active = true
  )
  OR EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
      AND lower(email) = 'charlie-r-k@hotmail.com'
  );
$$;

CREATE OR REPLACE FUNCTION user_can_write(p_team_id UUID)
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_teams
    WHERE user_id = auth.uid() AND team_id = p_team_id AND is_active = true
    AND role IN ('admin', 'equipment_manager', 'assistant')
  )
  OR EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
      AND lower(email) = 'charlie-r-k@hotmail.com'
  );
$$;

CREATE OR REPLACE FUNCTION user_is_manager(p_team_id UUID)
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_teams
    WHERE user_id = auth.uid() AND team_id = p_team_id AND is_active = true
    AND role IN ('admin', 'equipment_manager')
  )
  OR EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
      AND lower(email) = 'charlie-r-k@hotmail.com'
  );
$$;
