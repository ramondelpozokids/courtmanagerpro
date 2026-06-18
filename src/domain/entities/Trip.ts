export interface PackingItem {
  id: string;
  itemName: string;
  quantityRequired: number;
  quantityPacked: number;
  category: string;
  isPacked: boolean;
}

export interface Trip {
  id: string;
  destination: string;
  opponent: string;
  departureDate: string;
  returnDate: string;
  status: "PLANNING" | "READY" | "COMPLETED";
  packingList: PackingItem[];
  notes?: string;
}
