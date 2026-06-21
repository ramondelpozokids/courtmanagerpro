/**
 * Seed producción Real Madrid — plantilla, staff, inventario base.
 *
 * Uso:
 *   npx tsx scripts/seed-production.ts
 *
 * Requiere .env.local con NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY
 * Ejecutar antes las migraciones 001–004 en Supabase SQL Editor.
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';
import { buildRosterSeedRows } from '../src/lib/roster-seed';
import { DEFAULT_TEAM_ID } from '../src/lib/team-constants';
import { initialCoachingStaff } from '../src/infrastructure/supabase/repositories/InMemoryDB';

function loadEnvFile() {
  const envPath = resolve(process.cwd(), '.env.local');
  if (!existsSync(envPath)) return;
  const content = readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
}

const SAMPLE_INVENTORY = [
  { name: 'Camiseta Oficial Local 25/26', category: 'camiseta_juego', sku: 'RMB-JER-HOME-2526', stock_total: 20, stock_available: 18, stock_min: 5, size: 'XL', unit_cost: 85, location: 'Almacén A — Est. 1' },
  { name: 'Camiseta Oficial Visitante 25/26', category: 'camiseta_juego', sku: 'RMB-JER-AWAY-2526', stock_total: 20, stock_available: 20, stock_min: 5, size: 'XL', unit_cost: 85, location: 'Almacén A — Est. 1' },
  { name: 'Pantalón Juego 25/26', category: 'pantalon_juego', sku: 'RMB-SHT-2526', stock_total: 20, stock_available: 19, stock_min: 5, size: 'XL', unit_cost: 65, location: 'Almacén A — Est. 2' },
  { name: 'Chaqueta Cortavientos AW JKT', category: 'chaqueta', sku: 'RMB-AW-JKT', stock_total: 17, stock_available: 15, stock_min: 3, size: '2XL', unit_cost: 120, location: 'Vestuario principal' },
  { name: 'Zapatillas Juego', category: 'zapatillas', sku: 'RMB-SHO-GAME', stock_total: 15, stock_available: 14, stock_min: 3, size: '46', unit_cost: 150, location: 'Almacén calzado' },
  { name: 'Calcetines Oficiales', category: 'calcetines', sku: 'RMB-SOCK', stock_total: 50, stock_available: 42, stock_min: 10, size: 'L', unit_cost: 18, location: 'Almacén A — Est. 3' },
];

async function main() {
  loadEnvFile();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local');
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log('1/4 — Equipo Real Madrid…');
  const { error: teamError } = await supabase.from('teams').upsert({
    id: DEFAULT_TEAM_ID,
    name: 'Real Madrid Baloncesto',
    short_name: 'RMB',
    season: '2025-2026',
    league: 'ACB',
    primary_color: '#FFFFFF',
    secondary_color: '#2C3E50',
    is_active: true,
    metadata: { mode: 'production' },
  });
  if (teamError) throw new Error(teamError.message);

  console.log('2/4 — Plantilla jugadores…');
  const rows = buildRosterSeedRows();
  const { error: playersError } = await supabase.from('players').upsert(rows, { onConflict: 'team_id,dorsal' });
  if (playersError) throw new Error(playersError.message);

  console.log('3/4 — Cuerpo técnico…');
  const staffRows = initialCoachingStaff.map((s) => ({
    team_id: DEFAULT_TEAM_ID,
    full_name: s.full_name,
    role: s.role,
    email: s.email,
    nationality: s.nationality || 'España',
    shirt_size: s.shirt_size || 'L',
    shorts_size: s.shorts_size || 'L',
    shoe_size: s.shoe_size ?? 43,
    photo_url: s.photo_url || null,
    sizing_metadata: {},
    is_active: true,
  }));

  await supabase.from('coaching_staff').delete().eq('team_id', DEFAULT_TEAM_ID);
  const { error: staffError } = await supabase.from('coaching_staff').insert(staffRows);
  if (staffError) throw new Error(staffError.message);

  console.log('4/4 — Inventario base…');
  const inventoryRows = SAMPLE_INVENTORY.map((item) => ({
    ...item,
    team_id: DEFAULT_TEAM_ID,
    stock_assigned: 0,
    condition: 'nuevo',
    currency: 'EUR',
    is_active: true,
  }));

  for (const item of inventoryRows) {
    const { error } = await supabase.from('inventory_items').upsert(item, {
      onConflict: 'team_id,sku',
      ignoreDuplicates: false,
    });
    if (error && !error.message.includes('duplicate')) {
      const { error: insertErr } = await supabase.from('inventory_items').insert(item);
      if (insertErr && !insertErr.message.includes('duplicate')) {
        console.warn('Inventario:', insertErr.message);
      }
    }
  }

  console.log('\n✅ Seed producción completado.\n');
  console.log('SIGUIENTE PASO — Crear usuario Carlos en Supabase Auth:');
  console.log('  1. Supabase Dashboard → Authentication → Users → Add user');
  console.log('  2. Email: charlie-r-k@hotmail.com');
  console.log('  3. Password: (el que elijáis para producción)');
  console.log('  4. Copiar el UUID del usuario y ejecutar en SQL Editor:\n');
  console.log(`INSERT INTO profiles (id, email, full_name, role, department, is_active)
VALUES ('<UUID-CARLOS>', 'charlie-r-k@hotmail.com', 'Carlos Rodriguez Kobe', 'equipment_manager', 'Utilería Principal', true)
ON CONFLICT (id) DO UPDATE SET role = 'equipment_manager';

INSERT INTO user_teams (user_id, team_id, role, is_active)
VALUES ('<UUID-CARLOS>', '${DEFAULT_TEAM_ID}', 'equipment_manager', true)
ON CONFLICT DO NOTHING;\n`);
  console.log('En Vercel: configurar las 4 variables de .env.example y NO poner NEXT_PUBLIC_DEMO_MODE=true');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
