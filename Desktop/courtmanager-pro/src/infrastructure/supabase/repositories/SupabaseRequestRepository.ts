import { Request, RequestStatus } from "@/types";
import { IRequestRepository } from "../../../domain/repositories/IRequestRepository";
import { db } from "./InMemoryDB";

export class SupabaseRequestRepository implements IRequestRepository {
  async getById(id: string): Promise<Request | null> {
    const r = db.requests.find((req) => req.id === id);
    if (!r) return null;

    return {
      id: r.id,
      team_id: "team-acb-123",
      requester_id: "u1",
      player_id: r.playerId,
      title: `Petición: ${r.itemName}`,
      description: r.notes || null,
      priority: "normal",
      status: (r.status === "PENDING" ? "pendiente" : r.status === "APPROVED" ? "aprobada" : r.status === "DELIVERED" ? "completada" : "rechazada") as any,
      category: "camiseta_juego",
      quantity: r.quantity,
      size: r.size,
      estimated_cost: 85,
      actual_cost: 85,
      approved_by: null,
      approved_at: null,
      completed_by: null,
      completed_at: null,
      rejection_reason: null,
      due_date: null,
      attachments: [],
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  async getAll(): Promise<Request[]> {
    const list: Request[] = [];
    for (const r of db.requests) {
      const adapted = await this.getById(r.id);
      if (adapted) list.push(adapted);
    }
    return list;
  }

  async getByPlayerId(playerId: string): Promise<Request[]> {
    const all = await this.getAll();
    return all.filter((r) => r.player_id === playerId);
  }

  async updateStatus(id: string, status: RequestStatus): Promise<Request> {
    const index = db.requests.findIndex((r) => r.id === id);
    if (index === -1) throw new Error("Request not found");
    
    // map status back to mock
    const mapped = status === "aprobada" ? "APPROVED" : status === "completada" ? "DELIVERED" : "REJECTED";
    db.requests[index].status = mapped as any;

    return (await this.getById(id)) as Request;
  }

  async create(request: any): Promise<Request> {
    const id = "r_" + Math.random().toString(36).substr(2, 9);
    const newRequest = {
      id,
      playerId: request.player_id || "p1",
      playerName: request.title || "Jugador",
      itemId: "i1",
      itemName: request.title || "Material",
      quantity: request.quantity || 1,
      size: request.size || "XL",
      status: "PENDING" as const,
      requestDate: new Date().toISOString().split("T")[0],
      notes: request.description || ""
    };
    db.requests.unshift(newRequest as any);

    return (await this.getById(id)) as Request;
  }
}
