/**
 * Sincroniza inventario RMB producción con la equipación oficial adidas 26/27
 * (shop.realmadrid.com/collections/jerseys-kits-basketball).
 *
 * Uso: npx tsx scripts/sync-rmb-kit-2627.ts
 *
 * - Upsert SKUs nuevos 26/27 (con imagen y marca)
 * - Desactiva referencias antiguas 25/26 de juego (no borra stock histórico)
 */
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { createSeedClient } from './supabase-seed-client';
import { DEFAULT_TEAM_ID } from '../src/lib/team-constants';

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

const CDN = 'https://cdn.shopify.com/s/files/1/0985/4143/7258/files';

type KitRow = {
  name: string;
  sku: string;
  category: string;
  size: string;
  stock_total: number;
  stock_available: number;
  stock_min: number;
  unit_cost: number;
  location: string;
  brand: string;
  notes: string;
  image_url: string;
  qr_code: string;
};

/** Catálogo oficial hombre 26/27 — precios tienda oficial */
const KIT_2627: KitRow[] = [
  {
    name: 'Camiseta Baloncesto Primera Equipación Hombre 26/27 Blanca',
    sku: 'RMB-HOME-2627',
    category: 'camiseta_juego',
    size: 'XL',
    stock_total: 45,
    stock_available: 45,
    stock_min: 15,
    unit_cost: 90,
    location: 'Almacén A — Est. 1',
    brand: 'Adidas',
    notes: 'Adidas KT9672 · Climacool · shop RMCFMZ0949',
    image_url: `${CDN}/KT9672_2_APPAREL_Photography_Front_Center_View_white_48a54e3f-f5f8-49c3-b9f6-97f81fd2ea7e.jpg?v=1782476312&width=832`,
    qr_code: 'RMB-HOME-2627',
  },
  {
    name: 'Camiseta Baloncesto Segunda Equipación Hombre 26/27 Verde',
    sku: 'RMB-AWAY-2627',
    category: 'camiseta_juego',
    size: 'XL',
    stock_total: 40,
    stock_available: 40,
    stock_min: 15,
    unit_cost: 90,
    location: 'Almacén A — Est. 1',
    brand: 'Adidas',
    notes: 'Adidas KT9674 · shop RMCFMZ0950',
    image_url: `${CDN}/KT9674_2_APPAREL_Photography_Front_Center_View_white.jpg?v=1783937292&width=832`,
    qr_code: 'RMB-AWAY-2627',
  },
  {
    name: 'Pantalón Corto Baloncesto Primera Equipación Hombre 26/27 Blanco',
    sku: 'RMB-SHORTS-H-2627',
    category: 'pantalon_juego',
    size: 'XL',
    stock_total: 40,
    stock_available: 40,
    stock_min: 10,
    unit_cost: 60,
    location: 'Almacén A — Est. 2',
    brand: 'Adidas',
    notes: 'Adidas KU1387 · shop RMCFMP0445',
    image_url: `${CDN}/KU1387_01.jpg?v=1782466897&width=832`,
    qr_code: 'RMB-SHORTS-H-2627',
  },
  {
    name: 'Pantalón Corto Baloncesto Segunda Equipación Hombre 26/27 Verde',
    sku: 'RMB-SHORTS-A-2627',
    category: 'pantalon_juego',
    size: 'XL',
    stock_total: 36,
    stock_available: 36,
    stock_min: 8,
    unit_cost: 60,
    location: 'Almacén A — Est. 2',
    brand: 'Adidas',
    notes: 'Adidas KT8981 · shop RMCFMP0444',
    image_url: `${CDN}/KT8981_01.jpg?v=1783514779&width=832`,
    qr_code: 'RMB-SHORTS-A-2627',
  },
  {
    name: 'Chaqueta Calentamiento Baloncesto Hombre 26/27 Blanca',
    sku: 'RMB-WARM-JKT-2627',
    category: 'chaqueta',
    size: 'XL',
    stock_total: 24,
    stock_available: 24,
    stock_min: 5,
    unit_cost: 90,
    location: 'Almacén A — Est. 3',
    brand: 'Adidas',
    notes: 'Adidas KU1388 · shop RMCFMS0587',
    image_url: `${CDN}/KU1388_01.jpg?v=1782466810&width=832`,
    qr_code: 'RMB-WARM-JKT-2627',
  },
  {
    name: 'Sudadera Manga Corta Calentamiento Baloncesto Hombre 26/27 Blanca',
    sku: 'RMB-WARM-SS-2627',
    category: 'camiseta_entrenamiento',
    size: 'XL',
    stock_total: 24,
    stock_available: 24,
    stock_min: 8,
    unit_cost: 60,
    location: 'Almacén A — Est. 3',
    brand: 'Adidas',
    notes: 'Adidas KT8983 · shop RMCFMT1540',
    image_url: `${CDN}/KT8983_01.jpg?v=1782466690&width=832`,
    qr_code: 'RMB-WARM-SS-2627',
  },
  {
    name: 'Pantalón Calentamiento Baloncesto Hombre 26/27 Blanco',
    sku: 'RMB-WARM-PANT-2627',
    category: 'pantalon_entrenamiento',
    size: 'XL',
    stock_total: 22,
    stock_available: 22,
    stock_min: 8,
    unit_cost: 75,
    location: 'Almacén A — Est. 3',
    brand: 'Adidas',
    notes: 'Adidas KU1394 · shop RMCFMP0446',
    image_url: `${CDN}/KU1394_01.jpg?v=1782466853&width=832`,
    qr_code: 'RMB-WARM-PANT-2627',
  },
  {
    name: 'Camiseta Reversible Entrenamiento Baloncesto Hombre 26/27 Blanca',
    sku: 'RMB-TRAIN-REV-W-2627',
    category: 'camiseta_entrenamiento',
    size: 'XL',
    stock_total: 40,
    stock_available: 40,
    stock_min: 15,
    unit_cost: 40,
    location: 'Almacén A — Est. 3',
    brand: 'Adidas',
    notes: 'Adidas KU1396 · shop RMCFMT1542',
    image_url: `${CDN}/KU1396_01.jpg?v=1784545116&width=832`,
    qr_code: 'RMB-TRAIN-REV-W-2627',
  },
  {
    name: 'Camiseta Reversible Entrenamiento Baloncesto Hombre 26/27 Verde',
    sku: 'RMB-TRAIN-REV-G-2627',
    category: 'camiseta_entrenamiento',
    size: 'XL',
    stock_total: 40,
    stock_available: 40,
    stock_min: 15,
    unit_cost: 40,
    location: 'Almacén A — Est. 3',
    brand: 'Adidas',
    notes: 'Adidas KU1395 · shop RMCFMT1541',
    image_url: `${CDN}/KU1395_1_APPAREL_Photography_FrontCenterView_white.jpg?v=1786528847&width=832`,
    qr_code: 'RMB-TRAIN-REV-G-2627',
  },
  {
    name: 'Chaqueta Manga Corta Baloncesto Hombre 26/27 Blanca',
    sku: 'RMB-SS-JKT-2627',
    category: 'chaqueta',
    size: 'XL',
    stock_total: 20,
    stock_available: 20,
    stock_min: 5,
    unit_cost: 70,
    location: 'Almacén A — Est. 3',
    brand: 'Adidas',
    notes: 'Adidas KT9680 · shop RMCFMJ0212',
    image_url: `${CDN}/KT9680_01.jpg?v=1782466735&width=832`,
    qr_code: 'RMB-SS-JKT-2627',
  },
];

/** SKUs / patrones de temporada anterior a desactivar (no borrar). */
const LEGACY_SKU_PATTERNS = [
  'RMB-HOME-2526',
  'RMB-AWAY-2526',
  'RMB-JER-HOME-2526',
  'RMB-JER-AWAY-2526',
  'RMB-SHT-2526',
  'RMB-SHORTS-H',
  'RMB-SHORTS-A',
  'RMB-JACK-WARM',
  'TS-TRAIN-REV',
];

async function main() {
  loadEnvFile();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local');
    process.exit(1);
  }

  const supabase = createSeedClient(url, serviceKey);
  console.log(`Conectando a ${url.replace(/^https:\/\//, '')}…`);
  console.log(`Team: ${DEFAULT_TEAM_ID}`);

  const { data: before, error: listErr } = await supabase
    .from('inventory_items')
    .select('id, sku, name, is_active, stock_available')
    .eq('team_id', DEFAULT_TEAM_ID)
    .order('sku');
  if (listErr) throw new Error(listErr.message);
  console.log(`Inventario actual RMB: ${before?.length ?? 0} filas`);

  let upserted = 0;
  for (const kit of KIT_2627) {
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
      .select('id, stock_total, stock_available, stock_assigned')
      .eq('team_id', DEFAULT_TEAM_ID)
      .eq('sku', kit.sku)
      .maybeSingle();

    if (existing?.id) {
      // Conservar stock real si ya hay movimiento
      const keepStock =
        (existing.stock_assigned ?? 0) > 0 ||
        (existing.stock_available ?? 0) !== (existing.stock_total ?? 0);
      const { error } = await supabase
        .from('inventory_items')
        .update({
          name: row.name,
          category: row.category,
          size: row.size,
          stock_min: row.stock_min,
          unit_cost: row.unit_cost,
          location: row.location,
          brand: row.brand,
          notes: row.notes,
          image_url: row.image_url,
          qr_code: row.qr_code,
          is_active: true,
          updated_at: row.updated_at,
          ...(keepStock
            ? {}
            : {
                stock_total: row.stock_total,
                stock_available: row.stock_available,
                stock_assigned: 0,
              }),
        })
        .eq('id', existing.id);
      if (error) {
        console.warn(`UPDATE ${kit.sku}: ${error.message}`);
      } else {
        console.log(`✓ actualizado ${kit.sku}`);
        upserted += 1;
      }
    } else {
      const { error } = await supabase.from('inventory_items').insert(row);
      if (error) {
        console.warn(`INSERT ${kit.sku}: ${error.message}`);
      } else {
        console.log(`+ insertado ${kit.sku}`);
        upserted += 1;
      }
    }
  }

  // Desactivar legacy 25/26 (misma categoría de juego / calentamiento antiguo)
  const { data: legacyHits } = await supabase
    .from('inventory_items')
    .select('id, sku, name')
    .eq('team_id', DEFAULT_TEAM_ID)
    .in('sku', LEGACY_SKU_PATTERNS);

  let deactivated = 0;
  for (const hit of legacyHits || []) {
    const { error } = await supabase
      .from('inventory_items')
      .update({
        is_active: false,
        notes: `Retirado temporada 25/26 — sustituido por kit 26/27 (${new Date().toISOString().slice(0, 10)})`,
        updated_at: new Date().toISOString(),
      })
      .eq('id', hit.id);
    if (!error) {
      console.log(`– desactivado ${hit.sku} (${hit.name})`);
      deactivated += 1;
    }
  }

  // También por nombre si SKU distinto pero marca 25/26
  const { data: byName } = await supabase
    .from('inventory_items')
    .select('id, sku, name, is_active')
    .eq('team_id', DEFAULT_TEAM_ID)
    .eq('is_active', true)
    .or('name.ilike.%25/26%,name.ilike.%2526%');

  for (const hit of byName || []) {
    if (KIT_2627.some((k) => k.sku === hit.sku)) continue;
    if ((hit.sku || '').includes('2627')) continue;
    // Solo piezas de juego/calentamiento obvias
    if (!/camiseta|pantal|chaqueta|chandal|reversible|cortaviento/i.test(hit.name)) continue;
    const { error } = await supabase
      .from('inventory_items')
      .update({
        is_active: false,
        notes: `Retirado temporada 25/26 — kit 26/27 activo`,
        updated_at: new Date().toISOString(),
      })
      .eq('id', hit.id);
    if (!error) {
      console.log(`– desactivado por nombre ${hit.sku || '—'} · ${hit.name}`);
      deactivated += 1;
    }
  }

  const { data: after } = await supabase
    .from('inventory_items')
    .select('sku, name, is_active, unit_cost')
    .eq('team_id', DEFAULT_TEAM_ID)
    .eq('is_active', true)
    .ilike('sku', '%2627%')
    .order('sku');

  console.log('\n=== Resumen ===');
  console.log(`Upserts 26/27: ${upserted}/${KIT_2627.length}`);
  console.log(`Legacy desactivado: ${deactivated}`);
  console.log('Activos 26/27:');
  for (const r of after || []) {
    console.log(`  ${r.sku} · ${r.name} · €${r.unit_cost}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
