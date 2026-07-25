-- ============================================================
-- CourtManager Pro — Migración 010
-- Notificaciones de cumpleaños por correo
-- ============================================================

ALTER TYPE alert_type ADD VALUE IF NOT EXISTS 'cumpleanos_email_error';

CREATE TABLE IF NOT EXISTS birthday_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  person_name TEXT NOT NULL,
  person_role TEXT NOT NULL,
  person_type TEXT NOT NULL CHECK (person_type IN ('player', 'staff')),
  person_id TEXT,
  birthday_date DATE NOT NULL,
  turning_age INTEGER,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'sent'
    CHECK (status IN ('sent', 'failed', 'pending', 'retrying')),
  attempts INTEGER NOT NULL DEFAULT 1,
  error_message TEXT,
  dedupe_key TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (team_id, dedupe_key)
);

CREATE INDEX IF NOT EXISTS idx_birthday_notifications_team_sent
  ON birthday_notifications(team_id, sent_at DESC);

CREATE INDEX IF NOT EXISTS idx_birthday_notifications_dedupe
  ON birthday_notifications(dedupe_key);

ALTER TABLE birthday_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "birthday_notifications_select" ON birthday_notifications
  FOR SELECT USING (user_belongs_to_team(team_id) OR user_is_admin());

CREATE POLICY "birthday_notifications_write" ON birthday_notifications
  FOR ALL USING (user_is_manager(team_id) OR user_is_admin())
  WITH CHECK (user_is_manager(team_id) OR user_is_admin());
