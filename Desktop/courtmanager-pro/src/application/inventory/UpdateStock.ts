import { InventoryItem } from "../../types";
import { IInventoryRepository } from "../../domain/repositories/IInventoryRepository";

export class UpdateStock {
  constructor(private inventoryRepository: IInventoryRepository) {}

  async execute(id: string, qtyChange: number, action: "ADD" | "SET" | "REDUCE"): Promise<InventoryItem> {
    const item = await this.inventoryRepository.getById(id);
    if (!item) {
      throw new Error("Inventory item not found");
    }

    let finalStock = item.stock_available;
    if (action === "ADD") {
      finalStock += qtyChange;
    } else if (action === "REDUCE") {
      finalStock = Math.max(0, finalStock - qtyChange);
    } else if (action === "SET") {
      finalStock = Math.max(0, qtyChange);
    }

    return this.inventoryRepository.updateStock(id, finalStock);
  }
}
