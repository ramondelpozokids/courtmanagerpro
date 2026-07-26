/**
 * Genera supabase/migrations/014_seed_rmf_production.sql desde rmf-data.ts
 * Uso: npx tsx scripts/generate-rmf-seed.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const mod = await import(pathToFileURL(path.join(root, 'src/data/clubs/rmf-data.ts')).href);
const { rmfPlayers, rmfInventory, rmfCoachingStaff } = mod;

const TEAM = '00000000-0000-4000-8000-000acb223458';

function sqlStr(v) {
  if (v == null || v === '') return 'NULL';
  return `'${String(v).replace(/'/g, "''")}'`;
}

function playerUuid(demoId) {
  const n = Number(String(demoId).replace(/\D/g, '')) || 1;
  return `00000000-0000-4000-8001-${String(n).padStart(12, '0')}`;
}

function staffUuid(demoId) {
  const n = Number(String(demoId).replace(/\D/g, '')) || 1;
  return `00000000-0000-4000-8002-${String(n).padStart(12, '0')}`;
}

function invUuid(demoId) {
  const n = Number(String(demoId).replace(/\D/g, '')) || 1;
  return `00000000-0000-4000-8003-${String(n).padStart(12, '0')}`;
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
-- CourtManager Pro — 014 Seed RMF (Real Madrid Fútbol) producción
-- Generado desde src/data/clubs/rmf-data.ts
--
-- PREREQUISITO: ejecutar antes 014_rmf_enum_extensions.sql
-- (y confirmar esa query). Si ya corriste los ALTER TYPE en el
-- intento fallido, puedes lanzar solo este archivo.
-- ============================================================

-- Equipo (idempotente)
INSERT INTO teams (id, name, short_name, season, league, primary_color, secondary_color, metadata)
VALUES (
  '${TEAM}'::uuid,
  'Real Madrid Fútbol',
  'RMF',
  '2026-2027',
  'LaLiga',
  '#FFFFFF',
  '#FEBE10',
  '{"demoSlug":"rmf","sport":"football"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  season = EXCLUDED.season,
  league = EXCLUDED.league,
  updated_at = NOW();

`;

const enumSql = `-- ============================================================
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
`;

sql += `-- Jugadores (${rmfPlayers.length})\n`;
for (const p of rmfPlayers) {
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

sql += `-- Cuerpo técnico (${rmfCoachingStaff.length})\n`;
for (const s of rmfCoachingStaff) {
  const id = staffUuid(s.id);
  const slug = (s.profile_url || '').split('/').filter(Boolean).pop() || s.full_name.toLowerCase().replace(/\s+/g, '-');
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

sql += `-- Inventario (${rmfInventory.length})\n`;
for (const i of rmfInventory) {
  const id = invUuid(i.id);
  const cat = catMap[i.category] || 'accesorios';
  const qr = `${i.sku || i.id}-RMF`;
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
  ${sqlStr(JSON.stringify({ demo_id: i.id, gender: i.gender || null, source: i.source || null }))}::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  stock_total = EXCLUDED.stock_total,
  stock_available = EXCLUDED.stock_available,
  image_url = EXCLUDED.image_url,
  updated_at = NOW();\n\n`;
}

sql += `-- Vincular perfiles existentes (Ramón / Carlos) a RMF si ya están
INSERT INTO user_teams (user_id, team_id, role, is_active)
SELECT p.id, '${TEAM}'::uuid, COALESCE(p.role, 'admin'::user_role), true
FROM profiles p
WHERE lower(p.email) IN (
  'info@ramondelpozorott.es',
  'charlie-r-k@hotmail.com',
  'carlos@realmadrid.com'
)
ON CONFLICT DO NOTHING;

-- También asegurar membresía RMB
INSERT INTO user_teams (user_id, team_id, role, is_active)
SELECT p.id, '00000000-0000-4000-8000-000acb123456'::uuid, COALESCE(p.role, 'admin'::user_role), true
FROM profiles p
WHERE lower(p.email) IN (
  'info@ramondelpozorott.es',
  'charlie-r-k@hotmail.com',
  'carlos@realmadrid.com'
)
ON CONFLICT DO NOTHING;

-- Extensión ligera: metadata en laundry (si falta)
ALTER TABLE laundry_batches ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
`;

const enumOut = path.join(root, 'supabase/migrations/014_rmf_enum_extensions.sql');
fs.writeFileSync(enumOut, enumSql);
console.log('Wrote', enumOut, 'bytes', enumSql.length);

const out = path.join(root, 'supabase/migrations/014_seed_rmf_production.sql');
fs.writeFileSync(out, sql);
console.log('Wrote', out, 'bytes', sql.length);
