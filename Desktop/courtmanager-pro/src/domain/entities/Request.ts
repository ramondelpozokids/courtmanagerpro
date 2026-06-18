export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "DELIVERED";

export interface Request {
  id: string;
  playerId: string;
  playerName: string;
  itemId: string;
  itemName: string;
  quantity: number;
  size: string;
  status: RequestStatus;
  requestDate: string;
  neededByDate?: string;
  notes?: string;
}
