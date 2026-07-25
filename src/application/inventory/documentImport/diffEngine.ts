import {
  mapCategory,
  normalizeItemKey,
  type ExtractedInventoryItem,
  type InventoryDiffChange,
  type InventoryDiffPreview,
} from './types';

export interface ExistingInventoryRow {
  id: string;
  name: string;
  sku: string | null;
  size: string | null;
  stock_total: number;
  stock_available: number;
  category: string;
  brand: string | null;
  is_active: boolean;
}

export function computeInventoryDiff(
  extracted: ExtractedInventoryItem[],
  existing: ExistingInventoryRow[],
  documentOrigin: string
): InventoryDiffPreview {
  const active = existing.filter((e) => e.is_active !== false);
  const byKey = new Map<string, ExistingInventoryRow>();
  for (const row of active) {
    byKey.set(normalizeItemKey(row.name, row.sku, row.size), row);
    if (row.sku) byKey.set(normalizeItemKey(row.sku, row.sku, row.size), row);
  }

  const matchedIds = new Set<string>();
  const added: InventoryDiffChange[] = [];
  const modified: InventoryDiffChange[] = [];

  for (const item of extracted) {
    const key = normalizeItemKey(item.name, item.sku, item.size);
    const skuKey = item.sku ? normalizeItemKey(item.sku, item.sku, item.size) : null;
    const match = byKey.get(key) || (skuKey ? byKey.get(skuKey) : undefined);

    const qty = item.quantity ?? null;
    const category = mapCategory(item.category);

    if (!match) {
      added.push({
        change_type: 'alta',
        item_id: null,
        item_name: item.name,
        old_qty: null,
        new_qty: qty,
        payload: {
          ...item,
          category,
        },
      });
      continue;
    }

    matchedIds.add(match.id);
    const changes: string[] = [];
    if (qty != null && qty !== match.stock_total) changes.push('cantidad');
    if (item.brand && item.brand !== match.brand) changes.push('marca');
    if (category && category !== match.category) changes.push('categoria');

    if (changes.length > 0) {
      modified.push({
        change_type: qty != null && qty !== match.stock_total ? 'cantidad' : 'modificacion',
        item_id: match.id,
        item_name: match.name,
        old_qty: match.stock_total,
        new_qty: qty != null ? qty : match.stock_total,
        payload: {
          ...item,
          category,
          fields: changes,
        },
      });
    }
  }

  // Soft-remove: items in DB not present in document (only if document has enough items)
  const removed: InventoryDiffChange[] = [];
  if (extracted.length >= 3) {
    for (const row of active) {
      if (matchedIds.has(row.id)) continue;
      // Only propose baja for items that look document-managed (have sku) to avoid wiping unrelated stock
      if (!row.sku) continue;
      removed.push({
        change_type: 'baja',
        item_id: row.id,
        item_name: row.name,
        old_qty: row.stock_total,
        new_qty: 0,
        payload: { reason: 'no_aparece_en_documento' },
      });
    }
  }

  return {
    document_origin: documentOrigin,
    added,
    modified,
    removed,
    summary: {
      added: added.length,
      modified: modified.length,
      removed: removed.length,
    },
  };
}
