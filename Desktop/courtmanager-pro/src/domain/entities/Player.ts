export interface PlayerSizes {
  jersey: string;       // e.g., "XL"
  shorts: string;       // e.g., "XL"
  shoes: string;        // e.g., "47.5"
  socks: string;        // e.g., "L"
  warmupShirt: string;  // e.g., "XXL"
}

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  number: number;
  position: "PG" | "SG" | "SF" | "PF" | "C"; // Base, Escolta, Alero, Ala-Pívot, Pívot
  status: "ACTIVE" | "INJURED" | "INACTIVE";
  sizes: PlayerSizes;
  imageUrl?: string;
  nationality?: string;
  birthDate?: string;
}
