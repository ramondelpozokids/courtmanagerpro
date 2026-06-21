import type { ClubSlug } from '@/data/clubs/types';
import { isDemoMode, isProductionApp } from '@/lib/app-mode';

export const SUPERADMIN_PREVIEW_CLUBS = ['rmb', 'fcb', 'vbc'] as const;
export type SuperadminPreviewClub = (typeof SUPERADMIN_PREVIEW_CLUBS)[number];

const STORAGE_KEY = 'superadminPreviewClub';

let activePreviewSlug: ClubSlug = 'rmb';

export function isPreviewDemoClub(slug: ClubSlug): boolean {
  return slug === 'fcb' || slug === 'fbat' || slug === 'vbc';
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
  if (stored === 'fcb' || stored === 'vbc' || stored === 'rmb') return stored;
  return 'rmb';
}

export function getActiveClubPreviewSlug(): ClubSlug {
  return activePreviewSlug;
}

/** Datos ficticios InMemoryDB (demo comercial o superadmin en FCB/VBC). */
export function usesDemoClubData(): boolean {
  if (isDemoMode()) return true;
  return isPreviewDemoClub(activePreviewSlug);
}

/** Datos reales Supabase (Carlos / RMB en producción). */
export function usesProductionClubData(): boolean {
  return isProductionApp() && !isPreviewDemoClub(activePreviewSlug);
}

export function shouldUseDemoDataFallback(rows: unknown[] | null | undefined): boolean {
  if (usesProductionClubData()) return false;
  return !rows || rows.length === 0;
}
