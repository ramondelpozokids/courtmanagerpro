-- ============================================================
-- 022 — Fix QR duplicado ATM + reactivar inventario expandido
-- Ejecutar ANTES de volver a pegar 020 (o solo esto + la parte
-- de inventario de 020). El médico (021) ya está OK.
-- ============================================================

-- 1) Liberar QRs que chocan (p.ej. ATM-MED-KIT-ATM)
UPDATE inventory_items
SET
  qr_code = left(coalesce(qr_code, 'qr') || '-legacy-' || replace(id::text, '-', ''), 120),
  is_active = false,
  updated_at = NOW()
WHERE team_id = '00000000-0000-4000-8000-000acb423458'::uuid
  AND (
    qr_code = 'ATM-MED-KIT-ATM'
    OR qr_code LIKE '%-ATM'
    OR sku = 'ATM-BOOTS-COMP'
    OR name ILIKE '%Botas competición%'
  );

-- Tras esto, vuelve a ejecutar supabase/migrations/020_seed_atm_production.sql
-- (jugadores + staff + inventario con QRs únicos ATM-{id}-{sku}).
