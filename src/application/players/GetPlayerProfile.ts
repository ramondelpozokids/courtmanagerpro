import { Player } from "../../types";
import { IPlayerRepository } from "../../domain/repositories/IPlayerRepository";

export class GetPlayerProfile {
  constructor(private playerRepository: IPlayerRepository) {}

  async execute(id: string): Promise<Player> {
    const player = await this.playerRepository.getById(id);
    if (!player) {
      throw new Error("Player not found");
    }
    return player;
  }
}
