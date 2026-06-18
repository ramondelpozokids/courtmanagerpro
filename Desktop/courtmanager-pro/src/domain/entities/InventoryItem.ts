export type ItemCategory = "UNIFORM" | "TRAINING" | "FOOTWEAR" | "MEDICAL" | "ACCESSORY" | "LAUNDRY";

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: ItemCategory;
  stock: number;
  minStock: number; // For low stock alerts
  location: string; // e.g., "Main Warehouse", "Locker Room"
  qrCodeUrl?: string;
  barcode?: string;
  size?: string;
  price?: number;
  lastUpdated: string;
}
