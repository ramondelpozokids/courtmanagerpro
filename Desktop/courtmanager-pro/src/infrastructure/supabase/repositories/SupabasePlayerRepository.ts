import { Player } from "@/types";
import { IPlayerRepository } from "../../../domain/repositories/IPlayerRepository";
import { db } from "./InMemoryDB";

export class SupabasePlayerRepository implements IPlayerRepository {
  async getById(id: string): Promise<Player | null> {
    const p = db.players.find((player) => player.id === id);
    if (!p) return null;

    // Adapt mock to Player interface
    return {
      id: p.id,
      team_id: "team-acb-123",
      user_id: p.id === "p1" ? "u1" : null,
      dorsal: p.number,
      full_name: `${p.firstName} ${p.lastName}`,
      position: p.position.toLowerCase() as any,
      nationality: p.nationality || "España",
      birth_date: p.birthDate || "1995-01-01",
      photo_url: p.imageUrl || null,
      is_active: p.status === 'ACTIVE',
      shirt_size: p.sizes.jersey,
      shorts_size: p.sizes.shorts,
      shoe_size: Number(p.sizes.shoes) || 47,
      jacket_size: p.sizes.warmupShirt,
      underwear_size: "XL",
      sock_size: p.sizes.socks,
      suit_size: "52",
      hat_size: "M",
      jersey_name: p.lastName.toUpperCase(),
      contract_end: "2027-06-30",
      notes: null,
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  async getAll(): Promise<Player[]> {
    const list: Player[] = [];
    for (const p of db.players) {
      const adapted = await this.getById(p.id);
      if (adapted) list.push(adapted);
    }
    return list;
  }

  async create(player: any): Promise<Player> {
    const id = "p_" + Math.random().toString(36).substr(2, 9);
    const newPlayer = {
      id,
      firstName: player.full_name.split(" ")[0] || "Nuevo",
      lastName: player.full_name.split(" ").slice(1).join(" ") || "Jugador",
      number: player.dorsal || 10,
      position: (player.position || "base").toUpperCase() as any,
      status: "ACTIVE" as const,
      sizes: {
        jersey: player.shirt_size || "XL",
        shorts: player.shorts_size || "XL",
        shoes: String(player.shoe_size || 47),
        socks: "L",
        warmupShirt: player.jacket_size || "XXL"
      },
      nationality: player.nationality || "España",
      birthDate: player.birth_date || "1998-05-10"
    };
    db.players.push(newPlayer as any);
    return (await this.getById(id)) as Player;
  }

  async update(id: string, playerUpdates: Partial<Player>): Promise<Player> {
    const index = db.players.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Player not found");
    
    // Simple mock update
    db.players[index] = {
      ...db.players[index],
      firstName: playerUpdates.full_name?.split(" ")[0] || db.players[index].firstName,
      lastName: playerUpdates.full_name?.split(" ").slice(1).join(" ") || db.players[index].lastName,
      number: playerUpdates.dorsal || db.players[index].number,
      status: playerUpdates.is_active === false ? "INACTIVE" : "ACTIVE"
    } as any;

    return (await this.getById(id)) as Player;
  }

  async delete(id: string): Promise<boolean> {
    const initialLen = db.players.length;
    db.players = db.players.filter((p) => p.id !== id);
    return db.players.length < initialLen;
  }
}
