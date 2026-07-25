import type { SupabaseClient } from '@supabase/supabase-js';
import { mapCategory } from './types';
import type { InventoryDiffPreview } from './types';
import { db } from '@/infrastructure/supabase/repositories/InMemoryDB';

export interface InventoryHistoryRow {
  id: string;
  team_id: string;
  changed_at: string;
  user_id: string | null;
  document_origin: string | null;
  change_type: 'alta' | 'baja' | 'modificacion' | 'cantidad';
  item_id: string | null;
  item_name: string;
  old_qty: number | null;
  new_qty: number | null;
  payload: Record<string, unknown>;
  created_at: string;
}

const demoHistory: InventoryHistoryRow[] = [];

function uuid(): string {
  return `invh-${Date.now().toString(16)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getDemoInventoryHistory(teamId: string, limit = 50) {
  return demoHistory
    .filter((h) => h.team_id === teamId)
    .sort((a, b) => (a.changed_at < b.changed_at ? 1 : -1))
    .slice(0, limit);
}

function pushHistory(
  rows: Omit<InventoryHistoryRow, 'id' | 'created_at' | 'changed_at'>[],
  now: string
) {
  for (const row of rows) {
    demoHistory.push({
      ...row,
      id: uuid(),
      changed_at: now,
      created_at: now,
    });
  }
}

export async function applyInventoryDiff(params: {
  supabase: SupabaseClient | null;
  teamId: string;
  userId: string | null;
  preview: InventoryDiffPreview;
  demo?: boolean;
}): Promise<{ applied: number; historyIds: string[] }> {
  const { teamId, userId, preview } = params;
  const now = new Date().toISOString();
  const historyIds: string[] = [];
  let applied = 0;

  if (!params.supabase || params.demo) {
    for (const change of preview.added) {
      const payload = change.payload as Record<string, unknown>;
      const qty = change.new_qty ?? 0;
      const id = `i-doc-${Math.random().toString(36).slice(2, 9)}`;
      db.inventory.push({
        id,
        name: change.item_name,
        sku: (payload.sku as string) || null,
        category: mapCategory(payload.category as string),
        brand: (payload.brand as string) || null,
        model: (payload.model as string) || null,
        size: (payload.size as string) || null,
        color: (payload.color as string) || null,
        stock_total: qty,
        stock_available: qty,
        stock_assigned: 0,
        stock_min: 1,
        is_active: true,
        team_id: teamId,
        condition: 'nuevo',
        description: (payload.notes as string) || null,
      });
      applied += 1;
      pushHistory(
        [
          {
            team_id: teamId,
            user_id: userId,
            document_origin: preview.document_origin,
            change_type: 'alta',
            item_id: id,
            item_name: change.item_name,
            old_qty: null,
            new_qty: qty,
            payload,
          },
        ],
        now
      );
    }

    for (const change of preview.modified) {
      if (!change.item_id) continue;
      const idx = db.inventory.findIndex((i: any) => i.id === change.item_id);
      if (idx === -1) continue;
      const item = db.inventory[idx];
      const qty = change.new_qty ?? item.stock_total;
      const assigned = item.stock_assigned || 0;
      db.inventory[idx] = {
        ...item,
        stock_total: qty,
        stock_available: Math.max(0, qty - assigned),
        brand: (change.payload.brand as string) || item.brand,
        category: mapCategory((change.payload.category as string) || item.category),
      };
      applied += 1;
      pushHistory(
        [
          {
            team_id: teamId,
            user_id: userId,
            document_origin: preview.document_origin,
            change_type: change.change_type,
            item_id: change.item_id,
            item_name: change.item_name,
            old_qty: change.old_qty,
            new_qty: qty,
            payload: change.payload,
          },
        ],
        now
      );
    }

    for (const change of preview.removed) {
      if (!change.item_id) continue;
      const idx = db.inventory.findIndex((i: any) => i.id === change.item_id);
      if (idx === -1) continue;
      db.inventory[idx] = { ...db.inventory[idx], is_active: false, stock_available: 0 };
      applied += 1;
      pushHistory(
        [
          {
            team_id: teamId,
            user_id: userId,
            document_origin: preview.document_origin,
            change_type: 'baja',
            item_id: change.item_id,
            item_name: change.item_name,
            old_qty: change.old_qty,
            new_qty: 0,
            payload: change.payload,
          },
        ],
        now
      );
    }

    return { applied, historyIds: demoHistory.slice(-applied).map((h) => h.id) };
  }

  const supabase = params.supabase;
  const historyRows: Array<Record<string, unknown>> = [];

  for (const change of preview.added) {
    const payload = change.payload as Record<string, unknown>;
    const qty = change.new_qty ?? 0;
    const { data, error } = await supabase
      .from('inventory_items')
      .insert({
        team_id: teamId,
        name: change.item_name,
        sku: (payload.sku as string) || null,
        category: mapCategory(payload.category as string),
        brand: (payload.brand as string) || null,
        model: (payload.model as string) || null,
        size: (payload.size as string) || null,
        color: (payload.color as string) || null,
        stock_total: qty,
        stock_available: qty,
        stock_assigned: 0,
        stock_min: 1,
        is_active: true,
        condition: 'nuevo',
        notes: (payload.notes as string) || null,
        metadata: { imported_from: preview.document_origin },
      })
      .select('id')
      .single();
    if (error) throw new Error(`alta inventario: ${error.message}`);
    applied += 1;
    historyRows.push({
      team_id: teamId,
      changed_at: now,
      user_id: userId,
      document_origin: preview.document_origin,
      change_type: 'alta',
      item_id: data.id,
      item_name: change.item_name,
      old_qty: null,
      new_qty: qty,
      payload,
      created_at: now,
    });
  }

  for (const change of preview.modified) {
    if (!change.item_id) continue;
    const qty = change.new_qty;
    const updates: Record<string, unknown> = { updated_at: now };
    if (qty != null) {
      updates.stock_total = qty;
      // Keep assigned; recompute available later if needed
      updates.stock_available = qty;
    }
    if (change.payload.brand) updates.brand = change.payload.brand;
    if (change.payload.category) updates.category = mapCategory(change.payload.category as string);

    const { error } = await supabase.from('inventory_items').update(updates).eq('id', change.item_id);
    if (error) throw new Error(`mod inventario: ${error.message}`);
    applied += 1;
    historyRows.push({
      team_id: teamId,
      changed_at: now,
      user_id: userId,
      document_origin: preview.document_origin,
      change_type: change.change_type,
      item_id: change.item_id,
      item_name: change.item_name,
      old_qty: change.old_qty,
      new_qty: change.new_qty,
      payload: change.payload,
      created_at: now,
    });
  }

  for (const change of preview.removed) {
    if (!change.item_id) continue;
    const { error } = await supabase
      .from('inventory_items')
      .update({ is_active: false, stock_available: 0, updated_at: now })
      .eq('id', change.item_id);
    if (error) throw new Error(`baja inventario: ${error.message}`);
    applied += 1;
    historyRows.push({
      team_id: teamId,
      changed_at: now,
      user_id: userId,
      document_origin: preview.document_origin,
      change_type: 'baja',
      item_id: change.item_id,
      item_name: change.item_name,
      old_qty: change.old_qty,
      new_qty: 0,
      payload: change.payload,
      created_at: now,
    });
  }

  if (historyRows.length > 0) {
    const { data, error } = await supabase.from('inventory_history').insert(historyRows).select('id');
    if (error) throw new Error(`inventory_history: ${error.message}`);
    historyIds.push(...(data || []).map((r: { id: string }) => r.id));
  }

  return { applied, historyIds };
}
