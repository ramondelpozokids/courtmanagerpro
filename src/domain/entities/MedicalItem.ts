export interface MedicalItem {
  id: string;
  name: string;
  quantity: number;
  minQuantity: number;
  expiryDate: string;
  batchNumber: string;
  status: "OK" | "EXPIRING_SOON" | "EXPIRED";
  location: string;
  kit?: string;
  brand?: string;
  category?: string;
  prescription_required?: boolean;
}
