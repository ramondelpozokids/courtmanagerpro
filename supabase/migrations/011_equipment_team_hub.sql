-- ============================================================
-- CourtManager Pro — Migración 011
-- Centro de Comunicación de Utillería
-- ============================================================

ALTER TYPE alert_type ADD VALUE IF NOT EXISTS 'utileria_aviso';
ALTER TYPE alert_type ADD VALUE IF NOT EXISTS 'utileria_tarea';
ALTER TYPE alert_type ADD VALUE IF NOT EXISTS 'utileria_nota';
ALTER TYPE alert_type ADD VALUE IF NOT EXISTS 'utileria_informe';

CREATE TABLE IF NOT EXISTS equipment_team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Utillero',
  phone_mobile TEXT,
  phone_landline TEXT,
  email TEXT,
  whatsapp TEXT,
  photo_url TEXT,
  joined_at DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  last_seen_at TIMESTAMPTZ,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_eq_members_team_active
  ON equipment_team_members(team_id) WHERE is_active = true;

CREATE TABLE IF NOT EXISTS equipment_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  author_id UUID REFERENCES equipment_team_members(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_eq_notes_team_created
  ON equipment_notes(team_id, created_at DESC);

CREATE TABLE IF NOT EXISTS equipment_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  author_id UUID REFERENCES equipment_team_members(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  attachments JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_eq_reports_team_created
  ON equipment_reports(team_id, created_at DESC);

CREATE TABLE IF NOT EXISTS equipment_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  assignee_id UUID REFERENCES equipment_team_members(id) ON DELETE SET NULL,
  assignee_name TEXT,
  priority TEXT NOT NULL DEFAULT 'normal'
    CHECK (priority IN ('baja', 'normal', 'alta', 'urgente')),
  status TEXT NOT NULL DEFAULT 'pendiente'
    CHECK (status IN ('pendiente', 'en_curso', 'finalizada')),
  due_date DATE,
  created_by_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_eq_tasks_team_status
  ON equipment_tasks(team_id, status);

CREATE TABLE IF NOT EXISTS equipment_notices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  notice_type TEXT NOT NULL DEFAULT 'info'
    CHECK (notice_type IN ('urgente', 'importante', 'info')),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  author_name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_eq_notices_team_created
  ON equipment_notices(team_id, created_at DESC);

CREATE TABLE IF NOT EXISTS equipment_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  actor_name TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_eq_history_team_created
  ON equipment_history(team_id, created_at DESC);

ALTER TABLE equipment_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_history ENABLE ROW LEVEL SECURITY;

-- Solo managers / utillería (write) o miembros del equipo
CREATE POLICY "eq_members_select" ON equipment_team_members
  FOR SELECT USING (user_belongs_to_team(team_id) OR user_is_admin());
CREATE POLICY "eq_members_write" ON equipment_team_members
  FOR ALL USING (user_can_write(team_id) OR user_is_admin())
  WITH CHECK (user_can_write(team_id) OR user_is_admin());

CREATE POLICY "eq_notes_select" ON equipment_notes
  FOR SELECT USING (user_belongs_to_team(team_id) OR user_is_admin());
CREATE POLICY "eq_notes_write" ON equipment_notes
  FOR ALL USING (user_can_write(team_id) OR user_is_admin())
  WITH CHECK (user_can_write(team_id) OR user_is_admin());

CREATE POLICY "eq_reports_select" ON equipment_reports
  FOR SELECT USING (user_belongs_to_team(team_id) OR user_is_admin());
CREATE POLICY "eq_reports_write" ON equipment_reports
  FOR ALL USING (user_can_write(team_id) OR user_is_admin())
  WITH CHECK (user_can_write(team_id) OR user_is_admin());

CREATE POLICY "eq_tasks_select" ON equipment_tasks
  FOR SELECT USING (user_belongs_to_team(team_id) OR user_is_admin());
CREATE POLICY "eq_tasks_write" ON equipment_tasks
  FOR ALL USING (user_can_write(team_id) OR user_is_admin())
  WITH CHECK (user_can_write(team_id) OR user_is_admin());

CREATE POLICY "eq_notices_select" ON equipment_notices
  FOR SELECT USING (user_belongs_to_team(team_id) OR user_is_admin());
CREATE POLICY "eq_notices_write" ON equipment_notices
  FOR ALL USING (user_can_write(team_id) OR user_is_admin())
  WITH CHECK (user_can_write(team_id) OR user_is_admin());

CREATE POLICY "eq_history_select" ON equipment_history
  FOR SELECT USING (user_belongs_to_team(team_id) OR user_is_admin());
CREATE POLICY "eq_history_insert" ON equipment_history
  FOR INSERT WITH CHECK (user_can_write(team_id) OR user_is_admin());
