import type { ClubSlug } from '@/data/clubs/types';
import type { GarmentStatus, GarmentUnit } from '@/types/garment';
import { buildGarmentQrCode } from '@/lib/qr-codes';
import { getFeaturedGarmentsForClub } from '@/lib/featured-garments';
import { findGarmentInList } from '@/lib/garment-match';

const SHORT_NAMES: Record<string, string> = {
  camiseta_juego: 'Camiseta Juego',
  pantalon_juego: 'Pantalón Juego',
  camiseta_entrenamiento: 'Camiseta Entrenamiento',
  zapatillas: 'Zapatillas',
  calcetines: 'Calcetines',
  chaqueta: 'Chubasquero',
  calzado: 'Calzado',
  entrenamiento: 'Entrenamiento',
};

function shortItemLabel(category: string, playerNumber: number | null): string {
  const base = SHORT_NAMES[category] || 'Prenda';
  if (category === 'camiseta_juego' && playerNumber != null) {
    return `${base} #${playerNumber}`;
  }
  if (category === 'chaqueta' && playerNumber != null) {
    return `${base} #${playerNumber}`;
  }
  return base;
}

function pickStatus(index: number, playerId: string): GarmentStatus {
  if (playerId === 'p1') return 'disponible';
  const cycle: GarmentStatus[] = ['asignada', 'asignada', 'en_lavanderia', 'en_viaje', 'disponible'];
  return cycle[index % cycle.length];
}

function pickWashCount(index: number, playerId: string): number {
  if (playerId === 'p1') return 23;
  return 8 + ((index * 7) % 28);
}

export function buildGarmentUnitsForClub(
  slug: ClubSlug,
  teamId: string,
  players: any[],
  inventory: any[]
): GarmentUnit[] {
  const gameItems = inventory.filter((i) =>
    ['camiseta_juego', 'pantalon_juego', 'camiseta_entrenamiento', 'zapatillas'].includes(i.category)
  );
  const primaryItem = gameItems.find((i) => i.category === 'camiseta_juego') || gameItems[0] || inventory[0];
  if (!primaryItem) return [];

  const units: GarmentUnit[] = [];
  const roster = players.filter((p) => p.status === 'ACTIVE' || p.status === undefined).slice(0, 14);

  roster.forEach((p, index) => {
    const item = index % 3 === 0 ? primaryItem : gameItems[index % gameItems.length] || primaryItem;
    const qr_code = buildGarmentQrCode(slug, item.id, p.id);
    const playerNumber = p.number ?? null;
    const size =
      p.id === 'p1' ? 'L' : p.sizes?.jersey || p.sizes?.shorts || item.size || 'L';

    units.push({
      id: `gu-${slug}-${item.id}-${p.id}`,
      qr_code,
      team_id: teamId,
      item_id: item.id,
      item_name: item.name,
      display_name: shortItemLabel(item.category, playerNumber),
      category: item.category,
      player_id: p.id,
      player_name: `${p.firstName} ${p.lastName}`,
      player_number: playerNumber,
      size,
      wash_count: pickWashCount(index, p.id),
      status: pickStatus(index, p.id),
      location: item.location || 'Almacén utilería',
      image_url: item.image_url || p.imageUrl || null,
      last_wash_date: '2026-06-16',
      condition: pickWashCount(index, p.id) > 20 ? 'desgastado' : pickWashCount(index, p.id) > 12 ? 'bueno' : 'nuevo',
      last_scanned_at: null,
    });
  });

  return [...units, ...getFeaturedGarmentsForClub(slug)];
}

/** Lookup estático para API serverless (datos demo de los 3 clubes). */
let cachedAllUnits: GarmentUnit[] | null = null;

export function resetDemoGarmentCache(): void {
  cachedAllUnits = null;
}

export function getAllDemoGarmentUnits(): GarmentUnit[] {
  if (cachedAllUnits) return cachedAllUnits;

  // Lazy import to avoid circular deps at module init
  const { CLUB_PACKS } = require('@/data/clubs') as typeof import('@/data/clubs');
  cachedAllUnits = Object.values(CLUB_PACKS).flatMap((pack) =>
    buildGarmentUnitsForClub(
      pack.branding.slug,
      pack.branding.teamId,
      pack.players,
      pack.inventory
    )
  );
  return cachedAllUnits;
}

export function findDemoGarmentByCode(code: string): GarmentUnit | null {
  return findGarmentInList(getAllDemoGarmentUnits(), code);
}
