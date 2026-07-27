-- ============================================================
-- 021 — ATM: fotos LALIGA, material médico (como RMF), baja botas
-- Ejecutar en SQL Editor de Supabase (producción).
-- ============================================================

-- Baja botas genéricas del inventario ATM
UPDATE inventory_items
SET is_active = false, updated_at = NOW()
WHERE team_id = '00000000-0000-4000-8000-000acb423458'::uuid
  AND (sku = 'ATM-BOOTS-COMP' OR name ILIKE '%Botas competición%');

-- Material médico ATM (espejo operativo RMF / LaLiga)
INSERT INTO medical_items (
  id, team_id, name, category, brand, reference, stock_total, stock_min,
  expiry_date, batch_number, location, kit, prescription_required, unit_cost, is_active
) VALUES
(
  '00000000-0000-4000-8007-000000000001'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Vendas elásticas (partido)', 'material_cura', 'Mueller', 'ATM-T-01',
  40, 15, '2028-12-31', 'ATM-B-01', 'Botiquín Fisioterapia', 'Fisioterapia', false, 4.5, true
),
(
  '00000000-0000-4000-8007-000000000002'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Spray frío / hielo químico', 'fármaco', 'Biofreeze', 'ATM-S-01',
  10, 8, '2027-08-15', 'ATM-B-02', 'Nevera Vestuario', 'Vestuario Principal', false, 8, true
),
(
  '00000000-0000-4000-8007-000000000003'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Geles antiinflamatorios (Voltaren)', 'fármaco', 'Voltaren', 'ATM-G-22',
  12, 5, '2027-05-10', 'ATM-B-03', 'Armario Médico', 'Armario Central', true, 12, true
),
(
  '00000000-0000-4000-8007-000000000004'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Botiquín partido LaLiga', 'botiquin', 'ATM Medical', 'BQ-LL-ATM',
  3, 2, '2027-06-30', 'ATM-B-04', 'Vestuario — Banquillo', 'Botiquín Partido', false, 260, true
),
(
  '00000000-0000-4000-8007-000000000005'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Botiquín viaje Champions / Europa', 'botiquin', 'ATM Medical', 'BQ-CH-ATM',
  2, 2, '2027-03-15', 'ATM-B-05', 'Almacén Logística', 'Botiquín Viaje', false, 320, true
),
(
  '00000000-0000-4000-8007-000000000006'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Vendaje cohesivo (Coban)', 'material_cura', '3M', 'ATM-CB-10',
  36, 12, '2029-01-01', 'ATM-B-06', 'Botiquín Fisioterapia', 'Fisioterapia', false, 3.2, true
),
(
  '00000000-0000-4000-8007-000000000007'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Gasas estériles 10x10', 'material_cura', 'Hartmann', 'ATM-GS',
  20, 10, '2028-08-20', 'ATM-B-07', 'Armario Médico', 'Armario Central', false, 18, true
),
(
  '00000000-0000-4000-8007-000000000008'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Suero fisiológico 0,9% (500ml)', 'suero', 'B Braun', 'ATM-SF-500',
  10, 8, '2026-11-30', 'ATM-B-08', 'Nevera Vestuario', 'Vestuario Principal', false, 2.5, true
),
(
  '00000000-0000-4000-8007-000000000009'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Paracetamol 1g', 'fármaco', 'Cinfa', 'ATM-PC',
  8, 6, '2027-02-28', 'ATM-B-09', 'Armario Médico', 'Armario Central', true, 6, true
),
(
  '00000000-0000-4000-8007-00000000000a'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Ibuprofeno 600mg', 'fármaco', 'Kern', 'ATM-IB',
  6, 4, '2027-04-15', 'ATM-B-10', 'Armario Médico', 'Armario Central', true, 7.5, true
),
(
  '00000000-0000-4000-8007-00000000000b'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Esparadrapo hipoalergénico', 'material_cura', 'Urgo', 'ATM-ESP',
  18, 8, '2028-05-01', 'ATM-B-11', 'Botiquín Fisioterapia', 'Fisioterapia', false, 5, true
),
(
  '00000000-0000-4000-8007-00000000000c'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Bolsas de hielo', 'crioterapia', 'Instant Ice', 'ATM-HI',
  50, 25, '2027-12-31', 'ATM-B-12', 'Nevera Vestuario', 'Vestuario Principal', false, 1.2, true
),
(
  '00000000-0000-4000-8007-00000000000d'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Desinfectante clorhexidina 500ml', 'desinfección', 'Betadine', 'ATM-DS',
  6, 4, '2026-09-30', 'ATM-B-13', 'Botiquín Fisioterapia', 'Fisioterapia', false, 9, true
),
(
  '00000000-0000-4000-8007-00000000000e'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Kit RCP + guantes', 'emergencia', 'Laerdal', 'ATM-RCP',
  4, 2, '2028-01-01', 'ATM-B-14', 'Botiquín Partido', 'Botiquín Partido', false, 45, true
),
(
  '00000000-0000-4000-8007-00000000000f'::uuid,
  '00000000-0000-4000-8000-000acb423458'::uuid,
  'Electrodos TENS / EMS (Pack 4)', 'electroterapia', 'Compex', 'ATM-TENS',
  12, 6, '2027-08-01', 'ATM-B-15', 'Sala Fisioterapia', 'Fisioterapia', false, 22, true
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  stock_total = EXCLUDED.stock_total,
  stock_min = EXCLUDED.stock_min,
  kit = EXCLUDED.kit,
  location = EXCLUDED.location,
  is_active = true,
  updated_at = NOW();
