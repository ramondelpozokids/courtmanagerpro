import { Player } from "@/types";

export interface IPlayerRepository {
  getById(id: string): Promise<Player | null>;
  getAll(): Promise<Player[]>;
  create(player: any): Promise<Player>;
  update(id: string, player: Partial<Player>): Promise<Player>;
  delete(id: string): Promise<boolean>;
}
