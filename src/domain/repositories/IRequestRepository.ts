import { Request, RequestStatus } from "@/types";

export interface IRequestRepository {
  getById(id: string): Promise<Request | null>;
  getAll(): Promise<Request[]>;
  getByPlayerId(playerId: string): Promise<Request[]>;
  updateStatus(id: string, status: RequestStatus): Promise<Request>;
  create(request: any): Promise<Request>;
}
