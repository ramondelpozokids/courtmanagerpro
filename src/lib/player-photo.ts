import {
  RMB_OFFICIAL_PLAYERS,
  RMB_OFFICIAL_STAFF,
} from '@/data/rmb-official-roster';

/** Fotos locales ya descargadas en public/assets/players */
const LOCAL_PLAYER_SLUGS = new Set(RMB_OFFICIAL_PLAYERS.map((p) => p.slug));
const LOCAL_STAFF_SLUGS = new Set(RMB_OFFICIAL_STAFF.map((s) => s.slug));

function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Prefiere foto local `/assets/players/{slug}.webp`; si no, remote. */
export function resolvePlayerPhotoUrl(opts: {
  slug?: string | null;
  official_slug?: string | null;
  photo_url?: string | null;
  imageUrl?: string | null;
  fullName?: string | null;
  isStaff?: boolean;
}): string | null {
  const slug =
    opts.official_slug ||
    opts.slug ||
    (opts.fullName ? slugifyName(opts.fullName) : null);

  if (slug) {
    if (opts.isStaff && LOCAL_STAFF_SLUGS.has(slug)) {
      return `/assets/players/staff-${slug}.webp`;
    }
    if (!opts.isStaff && LOCAL_PLAYER_SLUGS.has(slug)) {
      return `/assets/players/${slug}.webp`;
    }
    // Nombre ya en formato slug coincidente con fichero local
    if (!opts.isStaff && LOCAL_PLAYER_SLUGS.has(slugifyName(slug))) {
      return `/assets/players/${slugifyName(slug)}.webp`;
    }
  }

  // Match por nombre completo contra plantilla oficial
  if (opts.fullName) {
    const norm = (s: string) =>
      s
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    const lower = norm(opts.fullName);
    const official = RMB_OFFICIAL_PLAYERS.find((p) => {
      const candidates = [
        p.full_name,
        `${p.firstName} ${p.lastName}`,
        p.nickname || '',
      ].map(norm);
      return candidates.some((c) => c && (c === lower || lower.includes(c) || c.includes(lower)));
    });
    if (official) return `/assets/players/${official.slug}.webp`;

    if (opts.isStaff) {
      const staff = RMB_OFFICIAL_STAFF.find((s) => norm(s.full_name) === lower);
      if (staff) return `/assets/players/staff-${staff.slug}.webp`;
    }
  }

  const remote = opts.imageUrl || opts.photo_url || null;
  if (remote?.startsWith('/assets/players/')) return remote;
  // URLs remotas del club a menudo fallan (espacios / hotlink); local primero ya cubierto
  return remote;
}
