import { parseScannedValue } from '@/lib/qr-codes';
import type { GarmentUnit } from '@/types/garment';
import type { ScanLookupResult } from '@/lib/garment-lookup';
import { usesDemoClubData } from '@/lib/club-preview';
import { resolveScan } from '@/lib/garment-lookup';

/** Escaneo en cliente: demo local o API Supabase en producción. */
export async function resolveScanClient(raw: string): Promise<ScanLookupResult | null> {
  const code = parseScannedValue(raw);
  if (!code) return null;

  if (usesDemoClubData()) {
    return resolveScan(code);
  }

  try {
    const res = await fetch(`/api/inventory/scan?code=${encodeURIComponent(code)}`, {
      credentials: 'include',
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.kind === 'garment' && json.data) {
      return { kind: 'garment', garment: json.data as GarmentUnit, code };
    }
    if (json.kind === 'inventory' && json.data) {
      return { kind: 'inventory', inventory: json.data, code };
    }
  } catch {
    return null;
  }
  return null;
}
