export interface MedicalItem {
  id: string;
  name: string;
  quantity: number;
  minQuantity: number;
  expiryDate: string;
  batchNumber: string;
  status: "OK" | "EXPIRING_SOON" | "EXPIRED";
  location: string;
}
