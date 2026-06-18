import {
  UserRole,
  PlayerPosition,
  ItemCategory,
  ItemCondition,
  RequestStatus,
  RequestPriority,
  TripType,
  TripStatus,
  LaundryStatus,
  AlertType,
  AlertSeverity
} from "./index";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          role: UserRole;
          phone: string | null;
          department: string | null;
          is_active: boolean;
          preferences: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at" | "updated_at"> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      teams: {
        Row: {
          id: string;
          name: string;
          short_name: string;
          logo_url: string | null;
          primary_color: string;
          secondary_color: string;
          season: string;
          league: string;
          is_active: boolean;
          metadata: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["teams"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["teams"]["Row"]>;
      };
      players: {
        Row: {
          id: string;
          team_id: string;
          user_id: string | null;
          dorsal: number;
          full_name: string;
          position: PlayerPosition;
          nationality: string | null;
          birth_date: string | null;
          photo_url: string | null;
          is_active: boolean;
          shirt_size: string | null;
          shorts_size: string | null;
          shoe_size: number | null;
          jacket_size: string | null;
          underwear_size: string | null;
          sock_size: string | null;
          suit_size: string | null;
          hat_size: string | null;
          jersey_name: string | null;
          contract_end: string | null;
          notes: string | null;
          metadata: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["players"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["players"]["Row"]>;
      };
      inventory_items: {
        Row: {
          id: string;
          team_id: string;
          name: string;
          description: string | null;
          category: ItemCategory;
          brand: string | null;
          model: string | null;
          sku: string | null;
          barcode: string | null;
          qr_code: string | null;
          stock_total: number;
          stock_available: number;
          stock_assigned: number;
          stock_min: number;
          stock_max: number | null;
          condition: ItemCondition;
          size: string | null;
          color: string | null;
          unit_cost: number | null;
          currency: string;
          location: string | null;
          location_detail: string | null;
          image_url: string | null;
          images: string[];
          is_active: boolean;
          notes: string | null;
          metadata: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["inventory_items"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["inventory_items"]["Row"]>;
      };
      item_assignments: {
        Row: {
          id: string;
          item_id: string;
          player_id: string;
          assigned_by: string;
          quantity: number;
          assigned_at: string;
          returned_at: string | null;
          expected_return: string | null;
          condition_out: ItemCondition | null;
          condition_in: ItemCondition | null;
          notes: string | null;
          is_returned: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["item_assignments"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["item_assignments"]["Row"]>;
      };
    };
  };
}
