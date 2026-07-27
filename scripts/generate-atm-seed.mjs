/**
 * Genera supabase/migrations/020_seed_atm_production.sql desde atm-data.ts
 * Uso: npx tsx scripts/generate-atm-seed.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const mod = await import(pathToFileURL(path.join(root, 'src/data/clubs/atm-data.ts')).href);
const { atmPlayers, atmInventory, atmCoachingStaff } = mod;

const TEAM = '00000000-0000-4000-8000-000acb423458';

function sqlStr(v) {
  if (v == null || v === '') return 'NULL';
  return `'${String(v).replace(/'/g, "''")}'`;
}

function playerUuid(demoId) {
  const n = Number(String(demoId).replace(/\D/g, '')) || 1;
  return `00000000-0000-4000-8004-${String(n).padStart(12, '0')}`;
}

function staffUuid(demoId) {
  const n = Number(String(demoId).replace(/\D/g, '')) || 1;
  return `00000000-0000-4000-8005-${String(n).padStart(12, '0')}`;
}

function invUuid(demoId) {
  const digits = String(demoId).replace(/\D/g, '') || '1';
  // Evitar colisiones i1 vs i10: usar el número completo pad 12
  return `00000000-0000-4000-8006-${digits.padStart(12, '0')}`;
}

const posMap = {
  portero: 'portero',
  defensa: 'defensa',
  centrocampista: 'centrocampista',
  delantero: 'delantero',
};

const catMap = {
  camiseta_juego: 'camiseta_juego',
  pantalon_juego: 'pantalon_juego',
  calcetines: 'calcetines',
  zapatillas: 'zapatillas',
  accesorios: 'accesorios',
  medico: 'medico',
  entrenamiento: 'camiseta_entrenamiento',
  calzado: 'zapatillas',
};

let sql = `-- ============================================================
-- CourtManager Pro — 020 Seed ATM (Atlético de Madrid) producción
-- Generado desde src/data/clubs/atm-data.ts
-- Fuentes: atleticodemadrid.com plantilla / calendario / store
-- ============================================================

INSERT INTO teams (id, name, short_name, season, league, primary_color, secondary_color, metadata)
VALUES (
  '${TEAM}'::uuid,
  'Atlético de Madrid',
  'ATM',
  '2025-2026',
  'LaLiga',
  '#FFFFFF',
  '#E8151E',
  '{"demoSlug":"atm","sport":"football"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  season = EXCLUDED.season,
  league = EXCLUDED.league,
  updated_at = NOW();

`;

sql += `-- Jugadores (${atmPlayers.length})\n`;
for (const p of atmPlayers) {
  const id = playerUuid(p.id);
  const pos = posMap[p.position] || 'delantero';
  const slug = (p.profile_url || '').split('/').filter(Boolean).pop() || p.lastName.toLowerCase();
  sql += `INSERT INTO players (
  id, team_id, dorsal, full_name, position, nationality, birth_date, photo_url,
  is_active, shirt_size, shorts_size, shoe_size, jacket_size, sock_size,
  jersey_name, metadata
) VALUES (
  '${id}'::uuid,
  '${TEAM}'::uuid,
  ${Number(p.number) || 0},
  ${sqlStr(`${p.firstName} ${p.lastName}`)},
  '${pos}'::player_position,
  ${sqlStr(p.nationality)},
  ${sqlStr(p.birthDate)},
  ${sqlStr(p.imageUrl)},
  true,
  ${sqlStr(p.sizes?.jersey)},
  ${sqlStr(p.sizes?.shorts)},
  ${Number(p.sizes?.shoes) || 44},
  ${sqlStr(p.sizes?.warmupShirt)},
  ${sqlStr(p.sizes?.socks)},
  ${sqlStr(String(p.lastName || '').toUpperCase())},
  ${sqlStr(JSON.stringify({ official_slug: slug, demo_id: p.id, profile_url: p.profile_url || null }))}::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  dorsal = EXCLUDED.dorsal,
  position = EXCLUDED.position,
  birth_date = EXCLUDED.birth_date,
  photo_url = EXCLUDED.photo_url,
  shirt_size = EXCLUDED.shirt_size,
  shorts_size = EXCLUDED.shorts_size,
  shoe_size = EXCLUDED.shoe_size,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();\n\n`;
}

sql += `-- Cuerpo técnico (${atmCoachingStaff.length})\n`;
for (const s of atmCoachingStaff) {
  const id = staffUuid(s.id);
  const slug =
    (s.profile_url || '').split('/').filter(Boolean).pop() ||
    s.full_name.toLowerCase().replace(/\s+/g, '-');
  sql += `INSERT INTO coaching_staff (
  id, team_id, full_name, role, email, nationality, photo_url,
  shirt_size, shorts_size, shoe_size, is_active, notes
) VALUES (
  '${id}'::uuid,
  '${TEAM}'::uuid,
  ${sqlStr(s.full_name)},
  ${sqlStr(s.role)},
  ${sqlStr(s.email)},
  ${sqlStr(s.nationality || 'España')},
  ${sqlStr(s.photo_url)},
  ${sqlStr(s.shirt_size || 'L')},
  ${sqlStr(s.shorts_size || 'L')},
  ${Number(s.shoe_size) || 43},
  true,
  ${sqlStr(JSON.stringify({ official_slug: slug, demo_id: s.id }))}
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  photo_url = EXCLUDED.photo_url,
  updated_at = NOW();\n\n`;
}

sql += `-- Inventario (${atmInventory.length})\n`;
for (const i of atmInventory) {
  const id = invUuid(i.id);
  const cat = catMap[i.category] || 'accesorios';
  const qr = `${i.sku || i.id}-ATM`;
  sql += `INSERT INTO inventory_items (
  id, team_id, name, category, sku, qr_code,
  stock_total, stock_available, stock_min, size, unit_cost,
  location, image_url, is_active, metadata
) VALUES (
  '${id}'::uuid,
  '${TEAM}'::uuid,
  ${sqlStr(i.name)},
  '${cat}'::item_category,
  ${sqlStr(i.sku)},
  ${sqlStr(qr)},
  ${Number(i.stock_total) || 0},
  ${Number(i.stock_available) || 0},
  ${Number(i.stock_min) || 5},
  ${sqlStr(i.size)},
  ${Number(i.unit_cost ?? i.price) || 0},
  ${sqlStr(i.location)},
  ${sqlStr(i.image_url)},
  true,
  ${sqlStr(JSON.stringify({
    demo_id: i.id,
    gender: i.gender || null,
    source: i.source || null,
    product_url: i.product_url || null,
    brand: i.brand || null,
  }))}::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  category = EXCLUDED.category,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  stock_min = EXCLUDED.stock_min,
  size = EXCLUDED.size,
  unit_cost = EXCLUDED.unit_cost,
  location = EXCLUDED.location,
  image_url = EXCLUDED.image_url,
  metadata = EXCLUDED.metadata,
  is_active = true,
  updated_at = NOW();\n\n`;
}

sql += `-- Vincular perfiles (Ramón / Carlos) a ATM
INSERT INTO user_teams (user_id, team_id, role, is_active)
SELECT p.id, '${TEAM}'::uuid, COALESCE(p.role, 'admin'::user_role), true
FROM profiles p
WHERE lower(p.email) IN (
  'info@ramondelpozorott.es',
  'charlie-r-k@hotmail.com',
  'carlos@realmadrid.com'
)
ON CONFLICT DO NOTHING;
`;

const out = path.join(root, 'supabase/migrations/020_seed_atm_production.sql');
fs.writeFileSync(out, sql);
console.log('Wrote', out, 'bytes', sql.length);
