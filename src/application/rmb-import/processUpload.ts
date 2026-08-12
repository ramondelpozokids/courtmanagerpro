import type { SupabaseClient } from '@supabase/supabase-js';
import { analyzeInventoryDocument } from '@/application/inventory/documentImport/analyze';
import { applyInventoryDiff } from '@/application/inventory/documentImport/applyDiff';
import type { ExistingInventoryRow } from '@/application/inventory/documentImport/diffEngine';
import { db } from '@/infrastructure/supabase/repositories/InMemoryDB';
import { isProductionApp } from '@/lib/app-mode';
import { parseSizingUtileriaCsv } from './parseSizingCsv';
import { applySizingCsvToRmb } from './applySizing';
import { applyPlayerPhotoToRmb } from './applyPhoto';

export type RmbImportKind = 'sizing_csv' | 'player_photo' | 'inventory_document' | 'unsupported';

export interface RmbImportResult {
  kind: RmbImportKind;
  filename: string;
  message: string;
  updated?: number;
  missing?: string[];
  details?: string[];
  applied?: number;
  playerName?: string;
  photoUrl?: string;
}

const IMAGE_EXT = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif']);
const DOC_EXT = new Set(['pdf', 'doc', 'docx']);
const CSV_EXT = new Set(['csv', 'txt', 'tsv']);

function extOf(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

function detectKind(filename: string, mime: string): RmbImportKind {
  const ext = extOf(filename);
  if (CSV_EXT.has(ext) || mime.includes('csv') || mime.includes('text/plain')) return 'sizing_csv';
  if (IMAGE_EXT.has(ext) || mime.startsWith('image/')) return 'player_photo';
  if (DOC_EXT.has(ext) || mime.includes('pdf') || mime.includes('word')) return 'inventory_document';
  return 'unsupported';
}

async function loadExistingInventory(
  supabase: SupabaseClient | null,
  teamId: string
): Promise<ExistingInventoryRow[]> {
  if (isProductionApp() && supabase) {
    const { data, error } = await (supabase as any)
      .from('inventory_items')
      .select('id, name, sku, size, stock_total, stock_available, category, brand, is_active')
      .eq('team_id', teamId);
    if (error) throw new Error(error.message);
    return (data || []) as ExistingInventoryRow[];
  }
  return db.inventory.map((i: any) => ({
    id: String(i.id),
    name: String(i.name),
    sku: i.sku || null,
    size: i.size || null,
    stock_total: Number(i.stock_total ?? i.quantity ?? 0),
    stock_available: Number(i.stock_available ?? i.quantity ?? 0),
    category: String(i.category || 'otro'),
    brand: i.brand || null,
    is_active: i.is_active !== false,
  }));
}

export async function processRmbUpload(params: {
  supabase: SupabaseClient | null;
  serviceSupabase: SupabaseClient | null;
  teamId: string;
  userId: string | null;
  buffer: Buffer;
  filename: string;
  mimeType: string;
}): Promise<RmbImportResult> {
  const kind = detectKind(params.filename, params.mimeType);
  const writeClient = params.serviceSupabase || params.supabase;

  if (kind === 'unsupported') {
    throw new Error('Formato no soportado. Usa CSV (tallas), JPG/PNG (fotos) o PDF/DOC (inventario).');
  }

  if (kind === 'sizing_csv') {
    if (!writeClient) throw new Error('Supabase no configurado para importar tallas.');
    const text = params.buffer.toString('utf8');
    const rows = parseSizingUtileriaCsv(text);
    const result = await applySizingCsvToRmb({
      supabase: writeClient,
      teamId: params.teamId,
      rows,
      sourceFile: params.filename,
    });
    return {
      kind,
      filename: params.filename,
      message: `Tallas actualizadas: ${result.updated} jugador(es).`,
      updated: result.updated,
      missing: result.missing,
      details: result.details,
    };
  }

  if (kind === 'player_photo') {
    if (!writeClient) throw new Error('Supabase no configurado para importar fotos.');
    const result = await applyPlayerPhotoToRmb({
      supabase: writeClient,
      teamId: params.teamId,
      buffer: params.buffer,
      filename: params.filename,
      mimeType: params.mimeType,
    });
    return {
      kind,
      filename: params.filename,
      message: `Foto actualizada: ${result.playerName}.`,
      playerName: result.playerName,
      photoUrl: result.photoUrl,
      updated: 1,
    };
  }

  const existing = await loadExistingInventory(params.supabase, params.teamId);
  const analyzed = await analyzeInventoryDocument({
    buffer: params.buffer,
    filename: params.filename,
    mimeType: params.mimeType,
    existingItems: existing,
  });

  const applied = await applyInventoryDiff({
    supabase: params.supabase,
    teamId: params.teamId,
    userId: params.userId,
    preview: analyzed.preview,
    demo: !isProductionApp(),
  });

  return {
    kind,
    filename: params.filename,
    message: `Inventario actualizado (${applied.applied} cambios).`,
    applied: applied.applied,
    details: analyzed.warning ? [analyzed.warning] : undefined,
  };
}
