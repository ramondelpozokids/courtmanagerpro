import { normalizeScanCode } from '@/lib/qr-codes';
import type { GarmentUnit } from '@/types/garment';

function codesForUnit(unit: GarmentUnit): Set<string> {
  const set = new Set<string>();
  const add = (value?: string | null) => {
    if (!value) return;
    set.add(normalizeScanCode(value).toUpperCase());
    set.add(value.trim().toUpperCase());
  };

  add(unit.qr_code);
  add(unit.barcode);
  add(unit.product_ref);
  unit.scan_aliases?.forEach(add);

  return set;
}

export function garmentMatchesScanCode(unit: GarmentUnit, raw: string): boolean {
  const needle = normalizeScanCode(raw).toUpperCase();
  if (!needle) return false;

  const haystack = codesForUnit(unit);
  if (haystack.has(needle)) return true;

  // QR Adidas / URLs que contienen el EAN o la referencia
  for (const code of haystack) {
    if (needle.includes(code) || code.includes(needle)) return true;
  }

  return false;
}

export function findGarmentInList(units: GarmentUnit[], raw: string): GarmentUnit | null {
  return units.find((u) => garmentMatchesScanCode(u, raw)) ?? null;
}
