import type { ClubSlug } from '@/data/clubs/types';
import { isDemoMode, isProductionApp } from '@/lib/app-mode';

/** Clubs seleccionables por superadmin (RM reales + demos comerciales). */
export const SUPERADMIN_PREVIEW_CLUBS = ['rmb', 'rmf', 'fcb', 'vbc'] as const;
export type SuperadminPreviewClub = (typeof SUPERADMIN_PREVIEW_CLUBS)[number];

/** Solo demos comerciales (no Real Madrid). */
export const COMMERCIAL_DEMO_CLUBS = ['fcb', 'vbc'] as const;

const STORAGE_KEY = 'superadminPreviewClub';
const PRESENTATION_MODE_KEY = 'cmPresentationMode';

let activePreviewSlug: ClubSlug = 'rmb';

/** Modo presentación RM: oculta FCB/VBC en el selector. */
export function readPresentationMode(): boolean {
  if (typeof window === 'undefined') return true;
  const v = localStorage.getItem(PRESENTATION_MODE_KEY);
  if (v === null) return true; // por defecto ON para demo ante el club
  return v === '1';
}

export function setPresentationMode(on: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PRESENTATION_MODE_KEY, on ? '1' : '0');
}

/** FCB/VBC → InMemoryDB. RMB/RMF → Supabase en producción. */
export function isPreviewDemoClub(slug: ClubSlug): boolean {
  return slug === 'fcb' || slug === 'vbc';
}

export function isRealMadridClubSlug(slug: ClubSlug): boolean {
  return slug === 'rmb' || slug === 'rmf';
}

export function isSuperadminPreviewClub(slug: ClubSlug): slug is SuperadminPreviewClub {
  return (SUPERADMIN_PREVIEW_CLUBS as readonly string[]).includes(slug);
}

export function setActiveClubPreviewSlug(slug: ClubSlug): void {
  activePreviewSlug = slug;
  if (typeof window !== 'undefined' && isProductionApp()) {
    localStorage.setItem(STORAGE_KEY, slug);
  }
}

export function readActiveClubPreviewSlug(): ClubSlug {
  if (typeof window === 'undefined') return 'rmb';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'rmf' || stored === 'fcb' || stored === 'vbc' || stored === 'rmb') return stored;
  return 'rmb';
}

export function getActiveClubPreviewSlug(): ClubSlug {
  return activePreviewSlug;
}

/** Datos ficticios InMemoryDB (demo comercial FCB/VBC o NEXT_PUBLIC_DEMO_MODE). */
export function usesDemoClubData(): boolean {
  if (isDemoMode()) return true;
  return isPreviewDemoClub(activePreviewSlug);
}

/** Datos reales Supabase (RMB / RMF en producción). */
export function usesProductionClubData(): boolean {
  return isProductionApp() && !isPreviewDemoClub(activePreviewSlug);
}

export function shouldUseDemoDataFallback(rows: unknown[] | null | undefined): boolean {
  if (usesProductionClubData()) return false;
  return !rows || rows.length === 0;
}
