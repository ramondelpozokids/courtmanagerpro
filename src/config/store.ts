import type { ClubSlug } from '@/data/clubs/types';

export const REAL_MADRID_OFFICIAL_STORE = {
  url: 'https://shop.realmadrid.com/',
  label: 'Tienda Oficial',
} as const;

export const ATM_OFFICIAL_STORE = {
  url: 'https://www.atleticodemadrid.com/atm/atleti-store',
  label: 'Atleti Store',
} as const;

/** @deprecated Prefer getOfficialStoreForSlug — RM por defecto. */
export const OFFICIAL_STORE = REAL_MADRID_OFFICIAL_STORE;

export function getOfficialStoreForSlug(slug?: ClubSlug | string | null): {
  url: string;
  label: string;
} {
  if (slug === 'atm') return { ...ATM_OFFICIAL_STORE };
  return { ...REAL_MADRID_OFFICIAL_STORE };
}
