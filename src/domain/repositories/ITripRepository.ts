import { Trip } from "@/types";

export interface ITripRepository {
  getById(id: string): Promise<Trip | null>;
  getAll(): Promise<Trip[]>;
  create(trip: any): Promise<Trip>;
  update(id: string, trip: Partial<Trip>): Promise<Trip>;
  updatePackingItem(tripId: string, itemId: string, packed: boolean, qtyPacked: number): Promise<Trip>;
}
