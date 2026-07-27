import { atmPlayers, atmCoachingStaff } from '@/data/clubs/atm-data';

const PLACEHOLDER_RE =
  /\/clubs\/atm\/logo\.png|\/clubs\/rm[bf]\/logo|\/logo\.png|default-player|default\.jpg|placeholder|realmadrid\.com/i;

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** True si la URL no es una foto real de jugador. */
export function isAtmPlaceholderPhoto(url: string | null | undefined): boolean {
  if (!url) return true;
  return PLACEHOLDER_RE.test(url);
}

function packPlayerPhoto(opts: {
  dorsal?: number | null;
  fullName?: string | null;
}): string | null {
  if (opts.dorsal != null) {
    const byDorsal = atmPlayers.find((p) => p.number === opts.dorsal);
    if (byDorsal?.imageUrl && !isAtmPlaceholderPhoto(byDorsal.imageUrl)) {
      return byDorsal.imageUrl;
    }
  }

  if (opts.fullName) {
    const n = norm(opts.fullName);
    const byName = atmPlayers.find((p) => {
      const full = norm(`${p.firstName} ${p.lastName}`);
      return (
        full === n ||
        n.includes(full) ||
        full.includes(n) ||
        (n.includes(norm(p.lastName)) && n.includes(norm(p.firstName)))
      );
    });
    if (byName?.imageUrl && !isAtmPlaceholderPhoto(byName.imageUrl)) {
      return byName.imageUrl;
    }
  }

  return null;
}

/**
 * Foto ATM: prioriza pack local (Koke, Lenglet, etc.) sobre URLs de Supabase
 * rotas / escudo / hotlinks RMB.
 */
export function resolveAtmPackPlayerPhoto(opts: {
  dorsal?: number | null;
  fullName?: string | null;
  photo_url?: string | null;
}): string | null {
  const fromPack = packPlayerPhoto(opts);
  if (fromPack) return fromPack;

  if (opts.photo_url && !isAtmPlaceholderPhoto(opts.photo_url)) {
    return opts.photo_url;
  }

  return null;
}

export function resolveAtmPackStaffPhoto(opts: {
  fullName?: string | null;
  photo_url?: string | null;
}): string | null {
  if (opts.fullName) {
    const n = norm(opts.fullName);
    const hit = atmCoachingStaff.find((s) => {
      const sn = norm(s.full_name);
      return sn === n;
    });
    if (hit?.photo_url && !isAtmPlaceholderPhoto(hit.photo_url)) {
      return hit.photo_url;
    }
  }
  if (opts.photo_url && !isAtmPlaceholderPhoto(opts.photo_url)) {
    return opts.photo_url;
  }
  return null;
}
