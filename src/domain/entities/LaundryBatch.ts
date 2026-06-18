export interface LaundryBatch {
  id: string;
  name: string; // e.g., "Post-Match vs Unicaja"
  itemCount: number;
  status: "PENDING" | "WASHING" | "DRYING" | "READY";
  receivedDate: string;
  completedDate?: string;
  responsible: string;
}
