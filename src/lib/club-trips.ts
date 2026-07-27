import type { Trip } from '@/domain/entities/Trip';
import { CLUB_TEAM_IDS } from '@/lib/club-team-ids';
import { atmTrips } from '@/data/clubs/atm-data';
import { rmfTrips } from '@/data/clubs/rmf-data';
import { initialTrips } from '@/infrastructure/supabase/repositories/InMemoryDB';

type PackTrip = {
  id: string;
  destination: string;
  opponent: string;
  departureDate: string;
  returnDate: string;
  status: string;
  notes?: string;
  packingList?: Array<{
    id: string;
    itemName: string;
    category: string;
    quantityRequired: number;
    quantityPacked: number;
    isPacked: boolean;
  }>;
};

function mapPackTrips(trips: PackTrip[]): Trip[] {
  return trips.map((t) => ({
    id: t.id,
    destination: t.destination,
    opponent: t.opponent,
    departureDate: t.departureDate,
    returnDate: t.returnDate,
    status:
      t.status === 'en_curso'
        ? 'READY'
        : t.status === 'completado'
          ? 'COMPLETED'
          : 'PLANNING',
    notes: t.notes,
    packingList: (t.packingList || []).map((pi) => ({
      id: pi.id,
      itemName: pi.itemName,
      category: pi.category,
      quantityRequired: pi.quantityRequired,
      quantityPacked: pi.quantityPacked,
      isPacked: pi.isPacked,
    })),
  })) as Trip[];
}

/** Viajes del pack local por club — NUNCA mezclar team_id. */
export function mapPackTripsForTeam(teamId: string): Trip[] {
  if (teamId === CLUB_TEAM_IDS.atm) return mapPackTrips(atmTrips as PackTrip[]);
  if (teamId === CLUB_TEAM_IDS.rmf) return mapPackTrips(rmfTrips as PackTrip[]);
  if (teamId === CLUB_TEAM_IDS.rmb) return mapPackTrips(initialTrips as PackTrip[]);
  return [];
}

/** @deprecated usar mapPackTripsForTeam(CLUB_TEAM_IDS.atm) */
export function mapAtmPackTrips(): Trip[] {
  return mapPackTripsForTeam(CLUB_TEAM_IDS.atm);
}
