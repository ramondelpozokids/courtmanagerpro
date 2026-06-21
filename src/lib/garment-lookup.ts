import { db } from '@/infrastructure/supabase/repositories/InMemoryDB';
import { findDemoGarmentByCode } from '@/lib/garment-units-seed';
import { findGarmentInList } from '@/lib/garment-match';
import { parseScannedValue, isGarmentQrCode, normalizeScanCode } from '@/lib/qr-codes';
import type { GarmentUnit } from '@/types/garment';
import type { InventoryItem } from '@/types';

export interface ScanLookupResult {
  kind: 'garment' | 'inventory';
  garment?: GarmentUnit;
  inventory?: InventoryItem;
  code: string;
}

export function lookupGarmentInDb(code: string): GarmentUnit | null {
  const normalized = parseScannedValue(code);
  if (!normalized) return null;

  const fromDb = findGarmentInList(db.garmentUnits, normalized);
  if (fromDb) return fromDb;

  return findDemoGarmentByCode(normalized);
}

export function lookupInventoryByCode(code: string): InventoryItem | null {
  const normalized = normalizeScanCode(parseScannedValue(code));
  if (!normalized) return null;

  const item = db.inventory.find(
    (i) =>
      i.qr_code?.toUpperCase() === normalized.toUpperCase() ||
      i.sku?.toUpperCase() === normalized.toUpperCase() ||
      normalizeScanCode(i.barcode || '') === normalized ||
      i.barcode === normalized
  );
  return item || null;
}

export function resolveScan(code: string): ScanLookupResult | null {
  const normalized = parseScannedValue(code);
  if (!normalized) return null;

  const garment = lookupGarmentInDb(normalized);
  if (garment) {
    garment.last_scanned_at = new Date().toISOString();
    return { kind: 'garment', garment, code: normalized };
  }

  const inventory = lookupInventoryByCode(normalized);
  if (inventory) {
    return { kind: 'inventory', inventory, code: normalized };
  }

  return null;
}

export function recordGarmentWash(qrCode: string): GarmentUnit | null {
  const unit = lookupGarmentInDb(qrCode);
  if (!unit) return null;
  unit.wash_count += 1;
  unit.last_wash_date = new Date().toISOString().slice(0, 10);
  if (unit.wash_count > 20) unit.condition = 'desgastado';
  else if (unit.wash_count > 10) unit.condition = 'bueno';
  return unit;
}
