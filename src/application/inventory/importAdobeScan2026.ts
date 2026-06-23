/**
 * Importa inventario OCR Adobe Scan 2026 → Supabase inventory_items.
 * Uso: npx tsx src/application/inventory/importAdobeScan2026.ts
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { randomUUID } from 'crypto';
import { createSeedClient } from '../../../scripts/supabase-seed-client';
import { DEFAULT_TEAM_ID } from '@/lib/team-constants';
import { expandAdobeScanItems } from './adobeScan2026Data';

function loadEnvFile() {
  const envPath = resolve(process.cwd(), '.env.local');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
}

function norm(value: string | null | undefined): string {
  return (value ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function dedupeKey(row: {
  sku: string | null;
  name: string;
  size: string | null;
  model: string | null;
}): string {
  const sku = norm(row.sku);
  if (sku) return `sku:${sku}`;
  return `row:${norm(row.name)}|${norm(row.size)}|${norm(row.model)}`;
}

async function main() {
  loadEnvFile();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!url || !serviceKey) {
    throw new Error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local');
  }

  const supabase = createSeedClient(url, serviceKey);
  const toImport = expandAdobeScanItems();

  const { data: existing, error: fetchError } = await supabase
    .from('inventory_items')
    .select('sku, name, size, model, description')
    .eq('team_id', DEFAULT_TEAM_ID);

  if (fetchError) throw new Error(fetchError.message);

  const existingKeys = new Set(
    (existing ?? []).map((row) =>
      dedupeKey({
        sku: row.sku,
        name: row.name,
        size: row.size,
        model: row.model ?? null,
      })
    )
  );

  let inserted = 0;
  let skipped = 0;

  for (const item of toImport) {
    const key = dedupeKey({
      sku: item.sku,
      name: item.name,
      size: item.size,
      model: item.ref,
    });
    if (existingKeys.has(key)) {
      skipped++;
      continue;
    }

    const payload = {
      team_id: DEFAULT_TEAM_ID,
      name: item.name,
      description: item.description,
      category: item.category,
      brand: 'Adidas',
      model: item.ref,
      sku: item.sku,
      qr_code: randomUUID(),
      stock_total: 1,
      stock_available: 1,
      stock_assigned: 0,
      stock_min: 0,
      condition: 'nuevo',
      size: item.size,
      color: item.color,
      currency: 'EUR',
      location: 'Almacén utilería — Adobe Scan 2026',
      is_active: true,
      notes: 'Importado Adobe Scan 23 jun 2026',
      metadata: { source: 'adobe-scan-2026-06-23' },
    };

    const { error } = await supabase.from('inventory_items').insert(payload);
    if (error) {
      if (error.message.includes('duplicate') || error.message.includes('unique')) {
        skipped++;
        existingKeys.add(key);
        continue;
      }
      throw new Error(`${item.sku}: ${error.message}`);
    }

    existingKeys.add(key);
    inserted++;
  }

  console.log('\n=== Import inventario Adobe Scan 2026 ===');
  console.log(`Extraídos (únicos): ${toImport.length}`);
  console.log(`Insertados:         ${inserted}`);
  console.log(`Omitidos (dup):     ${skipped}`);
  console.log('');
}

main().catch((err: unknown) => {
  console.error('❌', (err as Error).message);
  process.exit(1);
});
