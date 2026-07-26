-- ============================================================
-- 018 — Permitir borrar solicitudes (aprobadas / rechazadas / etc.)
-- ============================================================

DROP POLICY IF EXISTS "requests_delete" ON requests;
CREATE POLICY "requests_delete" ON requests
FOR DELETE USING (user_is_manager(team_id) OR user_can_write(team_id) OR user_is_admin());
