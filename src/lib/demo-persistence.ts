import type { ClubSlug } from '@/data/clubs/types';
import { db } from '@/infrastructure/supabase/repositories/InMemoryDB';
import { DEMO_CLUB_STORAGE_KEY } from '@/lib/club-team-ids';
import { isDemoMode } from '@/lib/app-mode';
import { usesDemoClubData } from '@/lib/club-preview';

const STORAGE_PREFIX = 'cm-demo-state';

export interface PersistedDemoState {
  players: any[];
  coachingStaff: any[];
  customSizingProducts: any[];
}

function storageKey(slug: ClubSlug): string {
  return `${STORAGE_PREFIX}:${slug}`;
}

export function readActiveDemoSlug(): ClubSlug | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(DEMO_CLUB_STORAGE_KEY);
  if (stored === 'rmb' || stored === 'fcb' || stored === 'fbat' || stored === 'vbc') return stored;
  return null;
}

export function loadPersistedDemoState(slug: ClubSlug): PersistedDemoState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(storageKey(slug));
    if (!raw) return null;
    return JSON.parse(raw) as PersistedDemoState;
  } catch {
    return null;
  }
}

export function savePersistedDemoState(slug: ClubSlug, state: PersistedDemoState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(
    storageKey(slug),
    JSON.stringify({
      players: state.players,
      coachingStaff: state.coachingStaff,
      customSizingProducts: state.customSizingProducts,
    })
  );
}

/** Guarda plantilla, staff y catálogo de tallas del club demo activo en localStorage. */
export function persistDemoDb(slug?: ClubSlug | null): void {
  if (!isDemoMode() && !usesDemoClubData()) return;
  const activeSlug = slug ?? readActiveDemoSlug();
  if (!activeSlug || typeof window === 'undefined') return;

  savePersistedDemoState(activeSlug, {
    players: [...db.players],
    coachingStaff: [...db.coachingStaff],
    customSizingProducts: [...db.customSizingProducts],
  });

  window.dispatchEvent(new CustomEvent('demo-db-changed', { detail: { slug: activeSlug } }));
}

export function clearPersistedDemoState(slug: ClubSlug): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(storageKey(slug));
}
