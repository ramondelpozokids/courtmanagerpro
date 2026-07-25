import type { InventoryDiffPreview } from '@/application/inventory/documentImport/types';

export type StoredInventoryPreview = {
  preview: InventoryDiffPreview;
  teamId: string;
  userId: string | null;
  createdAt: number;
};

const previewStore = new Map<string, StoredInventoryPreview>();

export function putInventoryPreview(id: string, value: StoredInventoryPreview) {
  previewStore.set(id, value);
}

export function takeInventoryPreview(previewId: string): StoredInventoryPreview | null {
  const row = previewStore.get(previewId);
  if (!row) return null;
  if (Date.now() - row.createdAt > 3_600_000) {
    previewStore.delete(previewId);
    return null;
  }
  return row;
}

export function deleteInventoryPreview(previewId: string) {
  previewStore.delete(previewId);
}
