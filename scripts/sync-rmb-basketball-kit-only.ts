/**
 * Inventario RMB = SOLO kit baloncesto 26/27 (10 piezas).
 * Desactiva todo lo demás (Adobe Scan, fútbol training, 25/26…).
 *
 * Uso: npx tsx scripts/sync-rmb-basketball-kit-only.ts
 */
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { createSeedClient } from './supabase-seed-client';
import { DEFAULT_TEAM_ID } from '../src/lib/team-constants';
import {
  RMB_BASKETBALL_KIT_2627,
  RMB_BASKETBALL_KIT_SKUS,
} from '../src/data/rmb-basketball-kit-2627';

function loadEnvFile() {
  const envPath = resolve(process.cwd(), '.env.local');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
}

async function main() {
  loadEnvFile();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createSeedClient(url, serviceKey);
  const keep = new Set(RMB_BASKETBALL_KIT_SKUS);
  console.log(`RMB · solo ${keep.size} piezas baloncesto 26/27`);

  const { data: allRows, error: listErr } = await supabase
    .from('inventory_items')
    .select('id, sku, name, is_active')
    .eq('team_id', DEFAULT_TEAM_ID);
  if (listErr) throw new Error(listErr.message);

  let deactivated = 0;
  for (const row of allRows || []) {
    if (keep.has(row.sku)) continue;
    if (row.is_active === false) continue;
    const { error } = await supabase
      .from('inventory_items')
      .update({
        is_active: false,
        notes: `Retirado ${new Date().toISOString().slice(0, 10)} — solo kit baloncesto 26/27 activo`,
        updated_at: new Date().toISOString(),
      })
      .eq('id', row.id);
    if (!error) {
      deactivated += 1;
      console.log(`– ${row.sku || '—'} · ${row.name}`);
    }
  }

  let upserted = 0;
  for (const kit of RMB_BASKETBALL_KIT_2627) {
    const row = {
      team_id: DEFAULT_TEAM_ID,
      name: kit.name,
      sku: kit.sku,
      category: kit.category,
      size: kit.size,
      stock_total: kit.stock_total,
      stock_available: kit.stock_available,
      stock_assigned: 0,
      stock_min: kit.stock_min,
      unit_cost: kit.unit_cost,
      currency: 'EUR',
      location: kit.location,
      brand: kit.brand,
      notes: kit.notes,
      image_url: kit.image_url,
      qr_code: kit.qr_code,
      condition: 'nuevo',
      is_active: true,
      updated_at: new Date().toISOString(),
    };

    const { data: existing } = await supabase
      .from('inventory_items')
      .select('id')
      .eq('team_id', DEFAULT_TEAM_ID)
      .eq('sku', kit.sku)
      .maybeSingle();

    if (existing?.id) {
      const { error } = await supabase.from('inventory_items').update(row).eq('id', existing.id);
      if (error) console.warn(`UPDATE ${kit.sku}: ${error.message}`);
      else {
        console.log(`✓ ${kit.sku}`);
        upserted += 1;
      }
    } else {
      const { error } = await supabase.from('inventory_items').insert(row);
      if (error) console.warn(`INSERT ${kit.sku}: ${error.message}`);
      else {
        console.log(`+ ${kit.sku}`);
        upserted += 1;
      }
    }
  }

  const { data: active } = await supabase
    .from('inventory_items')
    .select('sku, name, unit_cost')
    .eq('team_id', DEFAULT_TEAM_ID)
    .eq('is_active', true)
    .order('name');

  console.log('\n=== Resumen ===');
  console.log(`Desactivados: ${deactivated}`);
  console.log(`Kit activo: ${upserted}/${RMB_BASKETBALL_KIT_2627.length}`);
  console.log(`Activos en BD: ${active?.length ?? 0}`);
  for (const r of active || []) console.log(`  ${r.sku} · €${r.unit_cost} · ${r.name}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
