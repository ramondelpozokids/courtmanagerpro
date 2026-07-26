-- ============================================================
-- 019 — Historial de movimientos de inventario (almacén)
-- ============================================================

CREATE TABLE IF NOT EXISTS stock_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  item_id UUID REFERENCES inventory_items(id) ON DELETE SET NULL,
  item_name TEXT NOT NULL,
  qty_delta INTEGER NOT NULL,
  stock_after INTEGER,
  reason TEXT NOT NULL DEFAULT 'ajuste',
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  actor_name TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stock_movements_team_date
  ON stock_movements(team_id, created_at DESC);

ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "stock_movements_select" ON stock_movements;
CREATE POLICY "stock_movements_select" ON stock_movements
FOR SELECT USING (user_belongs_to_team(team_id) OR user_is_admin());

DROP POLICY IF EXISTS "stock_movements_write" ON stock_movements;
CREATE POLICY "stock_movements_write" ON stock_movements
FOR ALL USING (user_can_write(team_id) OR user_is_admin())
WITH CHECK (user_can_write(team_id) OR user_is_admin());
