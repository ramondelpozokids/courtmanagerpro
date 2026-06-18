import { Player } from "../../types";
import { IPlayerRepository } from "../../domain/repositories/IPlayerRepository";

export class CreatePlayer {
  constructor(private playerRepository: IPlayerRepository) {}

  async execute(playerData: any): Promise<Player> {
    if (!playerData.full_name) {
      throw new Error("Full name is required");
    }
    if (playerData.dorsal < 0 || playerData.dorsal > 99) {
      throw new Error("Jersey number must be between 0 and 99");
    }
    return this.playerRepository.create(playerData);
  }
}
