import { SupabasePlayerRepository } from "../infrastructure/supabase/repositories/SupabasePlayerRepository";
import { SupabaseInventoryRepository } from "../infrastructure/supabase/repositories/SupabaseInventoryRepository";
import { SupabaseRequestRepository } from "../infrastructure/supabase/repositories/SupabaseRequestRepository";

import { CreatePlayer } from "../application/players/CreatePlayer";
import { UpdatePlayer } from "../application/players/UpdatePlayer";
import { GetPlayerProfile } from "../application/players/GetPlayerProfile";
import { UpdateStock } from "../application/inventory/UpdateStock";
import { CreateRequest } from "../application/requests/CreateRequest";
import { ApproveRequest } from "../application/requests/ApproveRequest";

// Instantiate Concrete Repositories
export const playerRepository = new SupabasePlayerRepository();
export const inventoryRepository = new SupabaseInventoryRepository();
export const requestRepository = new SupabaseRequestRepository();

// Instantiate Use Cases with injected repositories
export const createPlayerUseCase = new CreatePlayer(playerRepository);
export const updatePlayerUseCase = new UpdatePlayer(playerRepository);
export const getPlayerProfileUseCase = new GetPlayerProfile(playerRepository);

export const updateStockUseCase = new UpdateStock(inventoryRepository);

export const createRequestUseCase = new CreateRequest(requestRepository);
export const approveRequestUseCase = new ApproveRequest(requestRepository, inventoryRepository);
