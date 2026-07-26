-- ============================================================
-- CourtManager Pro — 014a Enum extensions for RMF
-- IMPORTANT: Ejecutar SOLO este archivo y confirmar (Run).
-- Luego ejecutar 014_seed_rmf_production.sql en otra query.
-- Postgres no permite usar un valor de enum recién añadido
-- en la misma transacción (error 55P04).
-- ============================================================

ALTER TYPE player_position ADD VALUE IF NOT EXISTS 'portero';
ALTER TYPE player_position ADD VALUE IF NOT EXISTS 'defensa';
ALTER TYPE player_position ADD VALUE IF NOT EXISTS 'centrocampista';
ALTER TYPE player_position ADD VALUE IF NOT EXISTS 'delantero';

ALTER TYPE item_category ADD VALUE IF NOT EXISTS 'accesorios';
ALTER TYPE item_category ADD VALUE IF NOT EXISTS 'medico';
ALTER TYPE item_category ADD VALUE IF NOT EXISTS 'zapatillas';
ALTER TYPE item_category ADD VALUE IF NOT EXISTS 'calcetines';
