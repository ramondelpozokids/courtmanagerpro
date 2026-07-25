import { OFFICIAL_STORE } from '@/config/store';

export type OfficialStoreAvailability = 'available' | 'unavailable' | 'unknown';

export interface OfficialStoreCheckResult {
  available: boolean;
  status: OfficialStoreAvailability;
  checkedAt: string;
  statusCode: number | null;
  error: string | null;
  url: string;
}

const STORAGE_KEY = 'cm-official-store-status';

export function openOfficialStore(): void {
  if (typeof window === 'undefined') return;
  window.open(OFFICIAL_STORE.url, '_blank', 'noopener,noreferrer');
}

export function readStoredStoreStatus(): OfficialStoreCheckResult | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as OfficialStoreCheckResult;
  } catch {
    return null;
  }
}

export function persistStoreStatus(result: OfficialStoreCheckResult): void {
  if (typeof window === 'undefined') return;
  try {
    const payload = JSON.stringify(result);
    sessionStorage.setItem(STORAGE_KEY, payload);
    localStorage.setItem(STORAGE_KEY, payload);
  } catch {
    /* ignore quota */
  }
}

/** Client helper: asks our API to HEAD/GET the official shop (no product download). */
export async function checkOfficialStore(): Promise<OfficialStoreCheckResult> {
  try {
    const res = await fetch('/api/store/status', { method: 'GET', cache: 'no-store' });
    const json = (await res.json()) as { data?: OfficialStoreCheckResult; error?: string };
    const data = json.data;
    if (!data) {
      const fallback: OfficialStoreCheckResult = {
        available: false,
        status: 'unavailable',
        checkedAt: new Date().toISOString(),
        statusCode: res.status,
        error: json.error || 'Sin respuesta',
        url: OFFICIAL_STORE.url,
      };
      persistStoreStatus(fallback);
      return fallback;
    }
    persistStoreStatus(data);
    return data;
  } catch (err) {
    const fallback: OfficialStoreCheckResult = {
      available: false,
      status: 'unavailable',
      checkedAt: new Date().toISOString(),
      statusCode: null,
      error: err instanceof Error ? err.message : String(err),
      url: OFFICIAL_STORE.url,
    };
    persistStoreStatus(fallback);
    return fallback;
  }
}
