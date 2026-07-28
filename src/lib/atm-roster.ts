import { atmPlayers, ATM_TEAM_ID } from '@/data/clubs/atm-data';
import type { Player } from '@/types';

/** Jugadores del pack ATM como filas Player (fuente canónica 26/27). */
export function atmPackAsPlayers(teamId: string = ATM_TEAM_ID): Player[] {
  return atmPlayers.map((p) => ({
    id: p.id,
    team_id: teamId,
    user_id: null,
    dorsal: p.number,
    full_name: `${p.firstName} ${p.lastName}`.trim(),
    position: p.position.toLowerCase() as Player['position'],
    nationality: p.nationality || 'España',
    birth_date: p.birthDate || '1995-01-01',
    photo_url: p.imageUrl || null,
    is_active: true,
    jersey_name: null,
    contract_end: null,
    notes: null,
    metadata: {},
    shirt_size: p.sizes.jersey,
    shorts_size: p.sizes.shorts,
    shoe_size: Number(p.sizes.shoes) || 44,
    jacket_size: p.sizes.warmupShirt,
    underwear_size: 'L',
    sock_size: p.sizes.socks,
    suit_size: null,
    hat_size: null,
    official_slug: p.profile_url?.split('/').pop() || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
}

/**
 * Si Supabase/HTML trae una plantilla más corta que el pack ATM (p.ej. 23 vs 27),
 * usamos el pack y conservamos tallas/ids de la fila live cuando coinciden por dorsal.
 */
export function preferAtmRosterIfStale(live: Player[], teamId: string): Player[] {
  if (teamId !== ATM_TEAM_ID) return live;
  const pack = atmPackAsPlayers(teamId);
  if (!live.length) return pack;
  if (live.length >= pack.length) return live;

  return pack.map((packP) => {
    const liveP =
      live.find((l) => l.dorsal === packP.dorsal) ||
      live.find(
        (l) =>
          String(l.full_name || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') ===
          packP.full_name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
      );
    if (!liveP) return packP;
    return {
      ...packP,
      id: liveP.id,
      shirt_size: liveP.shirt_size || packP.shirt_size,
      shorts_size: liveP.shorts_size || packP.shorts_size,
      shoe_size: liveP.shoe_size || packP.shoe_size,
      jacket_size: liveP.jacket_size || packP.jacket_size,
      sock_size: liveP.sock_size || packP.sock_size,
      underwear_size: liveP.underwear_size || packP.underwear_size,
      photo_url: liveP.photo_url || packP.photo_url,
      metadata: liveP.metadata,
    };
  });
}

export function equipoConjuntoTotal(playersCount: number, staffCount: number): number {
  return playersCount + staffCount;
}
