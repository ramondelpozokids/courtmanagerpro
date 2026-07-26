-- Allow managers/admins to delete equipment history entries
CREATE POLICY "eq_history_delete" ON equipment_history
  FOR DELETE USING (user_can_write(team_id) OR user_is_admin());
