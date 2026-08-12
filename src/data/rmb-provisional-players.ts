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

export const RMB_PROVISIONAL_PLAYERS: RmbProvisionalPlayer[] = [
  {
    slug: 'max-shulga',
    full_name: 'Max Shulga',
    photoPath: '/assets/players/max-shulga.webp',
    note: 'Foto provisional hasta alta en plantilla oficial RMB (realmadrid.com)',
    birth_date: '2002-06-25',
    birth_place: 'Kiev, Ucrania',
    nationality: 'Ucrania',
    height: '1,96 m.',
    weight: '95 kg.',
    position: 'escolta',
    dorsal: 5,
    trajectory:
      'Boston Celtics (NBA) · Maine Celtics (G League) · base/escolta · fichaje RMB 2026/27 (pendiente de oficialización en realmadrid.com)',
  },
  {
    slug: 'olivier-sarr',
    full_name: 'Olivier Sarr',
    photoPath: '/assets/players/olivier-sarr.webp',
    note: 'Foto provisional hasta alta en plantilla oficial RMB (realmadrid.com)',
    birth_date: '1999-02-20',
    birth_place: 'Niort, Francia',
    nationality: 'Francia',
    height: '2,08 m.',
    weight: '109 kg.',
    position: 'pivot',
    dorsal: 17,
    trajectory:
      'Cleveland Cavaliers (NBA) · Cleveland Charge (G League) · pívot · hermano de Alexandre Sarr · fichaje RMB 2026/27 (pendiente de oficialización en realmadrid.com)',
  },
];

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
