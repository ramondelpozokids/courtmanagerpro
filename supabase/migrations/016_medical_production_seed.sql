-- ============================================================
-- 016 — Material médico real (RMB + RMF) + columna kit + RLS
-- Ejecutar en SQL Editor de Supabase (producción).
-- ============================================================

ALTER TABLE medical_items ADD COLUMN IF NOT EXISTS kit TEXT;

CREATE INDEX IF NOT EXISTS idx_medical_kit ON medical_items(team_id, kit);

-- Superadmin (profiles.role = admin) y staff médico/utilería
DROP POLICY IF EXISTS "medical_select" ON medical_items;
CREATE POLICY "medical_select" ON medical_items
FOR SELECT USING (
  user_is_admin() OR (
    user_belongs_to_team(team_id) AND
    get_user_team_role(team_id) IN ('admin', 'equipment_manager', 'medical', 'assistant')
  )
);

DROP POLICY IF EXISTS "medical_write" ON medical_items;
CREATE POLICY "medical_write" ON medical_items
FOR ALL USING (
  user_is_admin() OR
  get_user_team_role(team_id) IN ('admin', 'equipment_manager', 'medical')
);

-- ---------- Seed RMB ----------
INSERT INTO medical_items (
  id, team_id, name, category, brand, reference, stock_total, stock_min,
  expiry_date, batch_number, location, kit, prescription_required, unit_cost, is_active
) VALUES
(
  '00000000-0000-4000-8004-000000000001'::uuid,
  '00000000-0000-4000-8000-000acb123456'::uuid,
  'Vendas de Compresión Elástica (Tape)', 'material_cura', 'Mueller', 'T-9922',
  48, 20, '2028-12-31', 'B-8822', 'Botiquín Fisioterapia', 'Fisioterapia', false, 4.5, true
),
(
  '00000000-0000-4000-8004-000000000002'::uuid,
  '00000000-0000-4000-8000-000acb123456'::uuid,
  'Spray Frío / Hielo Químico', 'fármaco', 'Biofreeze', 'S-109',
  6, 15, '2026-08-15', 'B-1090', 'Nevera Vestuario', 'Vestuario Principal', false, 8, true
),
(
  '00000000-0000-4000-8004-000000000003'::uuid,
  '00000000-0000-4000-8000-000acb123456'::uuid,
  'Geles Antiinflamatorios (Voltaren)', 'fármaco', 'Voltaren', 'G-22',
  15, 5, '2026-05-10', 'B-2291', 'Armario Médico', 'Armario Central', true, 12, true
),
(
  '00000000-0000-4000-8004-000000000004'::uuid,
  '00000000-0000-4000-8000-000acb123456'::uuid,
  'Botiquín de Urgencias ACB (Completo)', 'botiquin', 'RMB Medical', 'BQ-ACB-01',
  4, 2, '2027-06-30', 'B-7001', 'Vestuario — Banquillo', 'Botiquín Partido', false, 280, true
),
(
  '00000000-0000-4000-8004-000000000005'::uuid,
  '00000000-0000-4000-8000-000acb123456'::uuid,
  'Botiquín de Viaje Euroliga', 'botiquin', 'RMB Medical', 'BQ-EU-01',
  2, 2, '2027-03-15', 'B-7002', 'Almacén Logística', 'Botiquín Viaje', false, 350, true
),
(
  '00000000-0000-4000-8004-000000000006'::uuid,
  '00000000-0000-4000-8000-000acb123456'::uuid,
  'Vendaje Cohesivo (Coban)', 'material_cura', '3M', 'CB-10',
  36, 12, '2029-01-01', 'B-3310', 'Botiquín Fisioterapia', 'Fisioterapia', false, 3.2, true
),
(
  '00000000-0000-4000-8004-000000000007'::uuid,
  '00000000-0000-4000-8000-000acb123456'::uuid,
  'Gasas Estériles 10x10 (Paquete 100)', 'material_cura', 'Hartmann', 'GS-100',
  22, 10, '2028-08-20', 'B-4412', 'Armario Médico', 'Armario Central', false, 18, true
),
(
  '00000000-0000-4000-8004-000000000008'::uuid,
  '00000000-0000-4000-8000-000acb123456'::uuid,
  'Suero Fisiológico 0,9% (500ml)', 'suero', 'B Braun', 'SF-500',
  8, 20, '2026-11-30', 'B-5520', 'Nevera Vestuario', 'Vestuario Principal', false, 2.5, true
),
(
  '00000000-0000-4000-8004-000000000009'::uuid,
  '00000000-0000-4000-8000-000acb123456'::uuid,
  'Paracetamol 1g (Caja 20 sobres)', 'fármaco', 'Cinfa', 'PC-1G',
  5, 8, '2027-02-28', 'B-6611', 'Armario Médico', 'Armario Central', true, 6, true
),
(
  '00000000-0000-4000-8004-00000000000a'::uuid,
  '00000000-0000-4000-8000-000acb123456'::uuid,
  'Ibuprofeno 600mg (Caja 40 comp.)', 'fármaco', 'Kern', 'IB-600',
  4, 6, '2027-04-15', 'B-6612', 'Armario Médico', 'Armario Central', true, 7.5, true
),
(
  '00000000-0000-4000-8004-00000000000b'::uuid,
  '00000000-0000-4000-8000-000acb123456'::uuid,
  'Esparadrapo Hipoalergénico (Rollo 5m)', 'material_cura', 'Urgo', 'ESP-5',
  18, 8, '2028-05-01', 'B-7720', 'Botiquín Fisioterapia', 'Fisioterapia', false, 5, true
),
(
  '00000000-0000-4000-8004-00000000000c'::uuid,
  '00000000-0000-4000-8000-000acb123456'::uuid,
  'Bolsas de Hielo Instantáneo', 'crioterapia', 'Instant Ice', 'HI-01',
  45, 30, '2027-12-31', 'B-8830', 'Nevera Vestuario', 'Vestuario Principal', false, 1.2, true
),
(
  '00000000-0000-4000-8004-00000000000d'::uuid,
  '00000000-0000-4000-8000-000acb123456'::uuid,
  'Desinfectante Clorhexidina 500ml', 'desinfección', 'Betadine', 'DS-500',
  6, 4, '2026-09-30', 'B-9940', 'Botiquín Fisioterapia', 'Fisioterapia', false, 9, true
),
(
  '00000000-0000-4000-8004-00000000000e'::uuid,
  '00000000-0000-4000-8000-000acb123456'::uuid,
  'Mascarillas RCP + Guantes (Kit 10 uds)', 'emergencia', 'Laerdal', 'RCP-10',
  3, 2, '2028-01-01', 'B-9950', 'Botiquín Partido', 'Botiquín Partido', false, 45, true
),
(
  '00000000-0000-4000-8004-00000000000f'::uuid,
  '00000000-0000-4000-8000-000acb123456'::uuid,
  'Electrodos TENS / EMS (Pack 4)', 'electroterapia', 'Compex', 'TENS-4',
  12, 6, '2027-08-01', 'B-9960', 'Sala Fisioterapia', 'Fisioterapia', false, 22, true
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  stock_total = EXCLUDED.stock_total,
  stock_min = EXCLUDED.stock_min,
  kit = EXCLUDED.kit,
  location = EXCLUDED.location,
  is_active = true,
  updated_at = NOW();

-- ---------- Seed RMF (fútbol — mismos botiquines operativos) ----------
INSERT INTO medical_items (
  id, team_id, name, category, brand, reference, stock_total, stock_min,
  expiry_date, batch_number, location, kit, prescription_required, unit_cost, is_active
) VALUES
(
  '00000000-0000-4000-8005-000000000001'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Vendas elásticas (partido)', 'material_cura', 'Mueller', 'RMF-T-01',
  40, 15, '2028-12-31', 'RMF-B-01', 'Botiquín Fisioterapia', 'Fisioterapia', false, 4.5, true
),
(
  '00000000-0000-4000-8005-000000000002'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Spray frío / hielo químico', 'fármaco', 'Biofreeze', 'RMF-S-01',
  10, 8, '2027-08-15', 'RMF-B-02', 'Nevera Vestuario', 'Vestuario Principal', false, 8, true
),
(
  '00000000-0000-4000-8005-000000000003'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Botiquín partido LaLiga', 'botiquin', 'RMF Medical', 'BQ-LL-01',
  3, 2, '2027-06-30', 'RMF-B-03', 'Vestuario — Banquillo', 'Botiquín Partido', false, 260, true
),
(
  '00000000-0000-4000-8005-000000000004'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Botiquín viaje Champions / LaLiga', 'botiquin', 'RMF Medical', 'BQ-CH-01',
  2, 2, '2027-03-15', 'RMF-B-04', 'Almacén Logística', 'Botiquín Viaje', false, 320, true
),
(
  '00000000-0000-4000-8005-000000000005'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Gasas estériles 10x10', 'material_cura', 'Hartmann', 'RMF-GS',
  20, 10, '2028-08-20', 'RMF-B-05', 'Armario Médico', 'Armario Central', false, 18, true
),
(
  '00000000-0000-4000-8005-000000000006'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Paracetamol 1g', 'fármaco', 'Cinfa', 'RMF-PC',
  8, 6, '2027-02-28', 'RMF-B-06', 'Armario Médico', 'Armario Central', true, 6, true
),
(
  '00000000-0000-4000-8005-000000000007'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Bolsas de hielo', 'crioterapia', 'Instant Ice', 'RMF-HI',
  50, 25, '2027-12-31', 'RMF-B-07', 'Nevera Vestuario', 'Vestuario Principal', false, 1.2, true
),
(
  '00000000-0000-4000-8005-000000000008'::uuid,
  '00000000-0000-4000-8000-000acb223458'::uuid,
  'Kit RCP + guantes', 'emergencia', 'Laerdal', 'RMF-RCP',
  4, 2, '2028-01-01', 'RMF-B-08', 'Botiquín Partido', 'Botiquín Partido', false, 45, true
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  stock_total = EXCLUDED.stock_total,
  kit = EXCLUDED.kit,
  location = EXCLUDED.location,
  is_active = true,
  updated_at = NOW();
