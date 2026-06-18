import { InventoryItem } from "@/types";

export interface IInventoryRepository {
  getById(id: string): Promise<InventoryItem | null>;
  getAll(): Promise<InventoryItem[]>;
  getByCategory(category: string): Promise<InventoryItem[]>;
  updateStock(id: string, newStock: number): Promise<InventoryItem>;
  create(item: Omit<InventoryItem, "id">): Promise<InventoryItem>;
  update(id: string, item: Partial<InventoryItem>): Promise<InventoryItem>;
  delete(id: string): Promise<boolean>;
}
