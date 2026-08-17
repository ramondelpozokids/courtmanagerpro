/**
 * Jugadores fichados / en plantilla interna pero aún no en realmadrid.com.
 * Cuando aparezcan en `rmb-official-roster.ts`, ejecutar:
 *   npm run check:rmb-provisional
 */

export interface RmbProvisionalPlayer {
  slug: string;
  full_name: string;
  /** Ruta bajo /public */
  photoPath: string;
  note?: string;
  birth_date?: string;
  birth_place?: string;
  nationality?: string;
  height?: string;
  weight?: string;
  position?: string;
  dorsal?: number;
  trajectory?: string;
}

export const RMB_PROVISIONAL_PLAYERS: RmbProvisionalPlayer[] = [];

function normKey(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getRmbProvisionalPlayer(slugOrName: string | null | undefined) {
  if (!slugOrName) return null;
  const norm = normKey(slugOrName);
  return (
    RMB_PROVISIONAL_PLAYERS.find((p) => p.slug === norm) ||
    RMB_PROVISIONAL_PLAYERS.find((p) => normKey(p.full_name).includes(norm) || norm.includes(normKey(p.full_name))) ||
    RMB_PROVISIONAL_PLAYERS.find((p) =>
      p.full_name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .includes(slugOrName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
    ) ||
    null
  );
}

export function isRmbProvisionalSlug(slug: string | null | undefined, officialSlugs: Set<string>) {
  if (!slug) return false;
  return RMB_PROVISIONAL_PLAYERS.some((p) => p.slug === slug) && !officialSlugs.has(slug);
}
