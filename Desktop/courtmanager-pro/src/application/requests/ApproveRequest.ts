import { Request } from "../../types";
import { IRequestRepository } from "../../domain/repositories/IRequestRepository";
import { IInventoryRepository } from "../../domain/repositories/IInventoryRepository";

export class ApproveRequest {
  constructor(
    private requestRepository: IRequestRepository,
    private inventoryRepository: IInventoryRepository
  ) {}

  async execute(id: string, action: "APPROVE" | "REJECT" | "DELIVER"): Promise<Request> {
    const request = await this.requestRepository.getById(id);
    if (!request) {
      throw new Error("Request not found");
    }

    if (action === "REJECT") {
      return this.requestRepository.updateStatus(id, "rechazada");
    }

    if (action === "APPROVE") {
      return this.requestRepository.updateStatus(id, "aprobada");
    }

    if (action === "DELIVER") {
      // Deduct stock from inventory when delivered
      if (request.player_id) {
        const item = await this.inventoryRepository.getById(request.player_id); // using standard reference
        if (item) {
          const newStock = Math.max(0, item.stock_available - (request.quantity || 1));
          await this.inventoryRepository.updateStock(item.id, newStock);
        }
      }
      return this.requestRepository.updateStatus(id, "completada");
    }

    throw new Error("Invalid action for request processing");
  }
}
