import { Player } from "../../types";
import { IPlayerRepository } from "../../domain/repositories/IPlayerRepository";

export class UpdatePlayer {
  constructor(private playerRepository: IPlayerRepository) {}

  async execute(id: string, playerData: Partial<Player>): Promise<Player> {
    const player = await this.playerRepository.getById(id);
    if (!player) {
      throw new Error("Player not found");
    }
    return this.playerRepository.update(id, playerData);
  }
}
