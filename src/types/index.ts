// ============================================================
// CourtManager Pro — TypeScript Types Completos
// src/types/index.ts
// ============================================================

// ============================================================
// ENUMS
// ============================================================

export type UserRole =
  | 'admin'
  | 'equipment_manager'
  | 'assistant'
  | 'player'
  | 'medical'
  | 'coach';

export type PlayerPosition =
  | 'base'
  | 'escolta'
  | 'alero'
  | 'ala_pivot'
  | 'pivot';

export type ItemCategory =
  | 'camiseta_juego'
  | 'camiseta_entrenamiento'
  | 'pantalon_juego'
  | 'pantalon_entrenamiento'
  | 'zapatillas'
  | 'calcetines'
  | 'ropa_interior'
  | 'chaqueta'
  | 'chandal'
  | 'accesorios'
  | 'equipamiento_cancha'
  | 'electronica'
  | 'medico'
  | 'higiene'
  | 'otro';

export type ItemCondition =
  | 'nuevo'
  | 'excelente'
  | 'bueno'
  | 'regular'
  | 'deteriorado'
  | 'baja';

export type RequestStatus =
  | 'pendiente'
  | 'aprobada'
  | 'rechazada'
  | 'en_proceso'
  | 'completada'
  | 'cancelada';

export type RequestPriority = 'urgente' | 'alta' | 'normal' | 'baja';

export type TripType =
  | 'liga_acb'
  | 'copa_del_rey'
  | 'eurocup'
  | 'euroleague'
  | 'amistoso'
  | 'pretemporada';

export type TripStatus =
  | 'planificado'
  | 'en_preparacion'
  | 'en_curso'
  | 'completado'
  | 'cancelado';

export type LaundryStatus = 'sucio' | 'en_lavado' | 'limpio' | 'entregado';

export type AlertType =
  | 'stock_bajo'
  | 'caducidad_proxima'
  | 'solicitud_pendiente'
  | 'item_deteriorado'
  | 'viaje_proximo'
  | 'lavanderia_pendiente'
  | 'asignacion_vencida'
  | 'calendario_cambio'
  | 'calendario_nuevo'
  | 'calendario_resultado'
  | 'cumpleanos'
  | 'cumpleanos_email_error'
  | 'utileria_aviso'
  | 'utileria_tarea'
  | 'utileria_nota'
  | 'utileria_informe';

export type AlertSeverity = 'info' | 'warning' | 'critical';

// ============================================================
// ENTIDADES PRINCIPALES
// ============================================================

export interface Profile {
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
}

export interface Team {
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
}

export interface PlayerSizes {
  shirt_size: string | null;
  shorts_size: string | null;
  shoe_size: number | null;
  jacket_size: string | null;
  underwear_size: string | null;
  sock_size: string | null;
  suit_size: string | null;
  hat_size: string | null;
}

export interface Player extends PlayerSizes {
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
  jersey_name: string | null;
  contract_end: string | null;
  notes: string | null;
  metadata: Record<string, unknown>;
  source?: string;
  activated_at?: string | null;
  deactivated_at?: string | null;
  official_slug?: string | null;
  created_at: string;
  updated_at: string;
}

export type RosterChangeType =
  | 'alta'
  | 'baja'
  | 'dorsal'
  | 'posicion'
  | 'foto'
  | 'nombre'
  | 'staff_alta'
  | 'staff_baja'
  | 'staff_cargo'
  | 'staff_foto'
  | 'staff_nombre';

export type SyncTrigger = 'startup' | 'cron' | 'manual';
export type SyncStatus = 'ok' | 'partial' | 'error' | 'offline_cache' | 'skipped';

export type MatchStatus =
  | 'pendiente'
  | 'en_juego'
  | 'finalizado'
  | 'suspendido'
  | 'aplazado';

export type MatchHomeAway = 'local' | 'visitante' | 'neutral';

export type MatchResult = 'victoria' | 'derrota' | 'empate' | 'prorroga';

export interface OfficialMatch {
  id: string;
  team_id: string;
  official_id: string | null;
  official_slug: string;
  match_date: string;
  match_time: string | null;
  match_datetime: string | null;
  rival: string;
  home_away: MatchHomeAway;
  competition: string;
  competition_slug: string | null;
  jornada: string | null;
  venue: string | null;
  city: string | null;
  country: string | null;
  status: MatchStatus;
  score_home: number | null;
  score_away: number | null;
  score_text: string | null;
  partial_score: string | null;
  result: MatchResult | null;
  official_url: string | null;
  source: string;
  last_synced_at: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MatchHistoryEntry {
  id: string;
  team_id: string;
  match_id: string | null;
  changed_at: string;
  change_type: string;
  entity_name: string;
  old_value: string | null;
  new_value: string | null;
  source: string;
  sync_log_id: string | null;
  created_at: string;
}

export interface MatchSyncLog {
  id: string;
  team_id: string;
  started_at: string;
  finished_at: string | null;
  duration_ms: number | null;
  status: SyncStatus;
  matches_added: number;
  matches_updated: number;
  matches_removed: number;
  results_updated: number;
  changes_count: number;
  error_message: string | null;
  source_url: string | null;
  trigger: SyncTrigger;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface SyncLog {
  id: string;
  team_id: string;
  started_at: string;
  finished_at: string | null;
  duration_ms: number | null;
  status: SyncStatus;
  players_added: number;
  players_removed: number;
  players_updated: number;
  staff_added: number;
  staff_removed: number;
  staff_updated: number;
  changes_count: number;
  error_message: string | null;
  source_url: string | null;
  trigger: SyncTrigger;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface RosterHistoryEntry {
  id: string;
  team_id: string;
  changed_at: string;
  change_type: RosterChangeType | string;
  entity_type: 'player' | 'staff';
  entity_id: string | null;
  entity_name: string;
  old_value: string | null;
  new_value: string | null;
  source: string;
  sync_log_id: string | null;
  created_at: string;
}

export interface InventoryHistoryEntry {
  id: string;
  team_id: string;
  changed_at: string;
  user_id: string | null;
  document_origin: string | null;
  change_type: 'alta' | 'baja' | 'modificacion' | 'cantidad';
  item_id: string | null;
  item_name: string;
  old_qty: number | null;
  new_qty: number | null;
  payload: Record<string, unknown>;
  created_at: string;
}

export interface PlayerWithAssignments extends Player {
  assignments: ItemAssignment[];
  total_items: number;
}

export interface InventoryItem {
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
}

export interface ItemAssignment {
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
  // Joins
  item?: InventoryItem;
  player?: Player;
  assigned_by_profile?: Profile;
}

export interface Request {
  id: string;
  team_id: string;
  requester_id: string;
  player_id: string | null;
  title: string;
  description: string | null;
  priority: RequestPriority;
  status: RequestStatus;
  category: ItemCategory | null;
  quantity: number | null;
  size: string | null;
  estimated_cost: number | null;
  actual_cost: number | null;
  approved_by: string | null;
  approved_at: string | null;
  completed_by: string | null;
  completed_at: string | null;
  rejection_reason: string | null;
  due_date: string | null;
  attachments: string[];
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  // Joins
  requester?: Profile;
  player?: Player;
  items?: RequestItem[];
  comments?: RequestComment[];
}

export interface RequestItem {
  id: string;
  request_id: string;
  item_id: string | null;
  item_name: string;
  quantity: number;
  size: string | null;
  notes: string | null;
  fulfilled: boolean;
  created_at: string;
}

export interface RequestComment {
  id: string;
  request_id: string;
  author_id: string;
  content: string;
  is_internal: boolean;
  created_at: string;
  author?: Profile;
}

export interface Trip {
  id: string;
  team_id: string;
  name: string;
  trip_type: TripType;
  status: TripStatus;
  destination: string;
  opponent: string | null;
  departure_date: string;
  return_date: string;
  departure_from: string | null;
  accommodation: string | null;
  transport_type: string | null;
  flight_number: string | null;
  hotel_name: string | null;
  hotel_address: string | null;
  created_by: string;
  notes: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  // Joins
  players?: TripPlayer[];
  items?: TripItem[];
}

export interface TripPlayer {
  id: string;
  trip_id: string;
  player_id: string;
  included: boolean;
  notes: string | null;
  created_at: string;
  player?: Player;
}

export interface TripItem {
  id: string;
  trip_id: string;
  item_id: string | null;
  item_name: string;
  quantity: number;
  quantity_packed: number;
  quantity_returned: number;
  is_packed: boolean;
  is_returned: boolean;
  notes: string | null;
  created_at: string;
  item?: InventoryItem;
}

export interface LaundryBatch {
  id: string;
  team_id: string;
  name: string;
  created_by: string;
  status: LaundryStatus;
  sent_at: string | null;
  expected_return: string | null;
  returned_at: string | null;
  laundry_service: string | null;
  cost: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items?: LaundryItem[];
}

export interface LaundryItem {
  id: string;
  batch_id: string;
  item_id: string | null;
  player_id: string | null;
  item_name: string;
  quantity: number;
  status: LaundryStatus;
  notes: string | null;
  created_at: string;
  player?: Player;
}

export interface MedicalItem {
  id: string;
  team_id: string;
  name: string;
  description: string | null;
  category: string;
  brand: string | null;
  reference: string | null;
  barcode: string | null;
  stock_total: number;
  stock_min: number;
  unit: string;
  expiry_date: string | null;
  batch_number: string | null;
  storage_temp: string | null;
  prescription_required: boolean;
  location: string | null;
  supplier: string | null;
  unit_cost: number | null;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Alert {
  id: string;
  team_id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  entity_type: string | null;
  entity_id: string | null;
  is_read: boolean;
  is_dismissed: boolean;
  read_by: string | null;
  read_at: string | null;
  auto_generated: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
}

// ============================================================
// DASHBOARD
// ============================================================

export interface DashboardStats {
  total_players: number;
  total_items: number;
  low_stock_items: number;
  pending_requests: number;
  active_assignments: number;
  upcoming_trips: number;
  laundry_pending: number;
  critical_alerts: number;
  expiring_medical: number;
}

// ============================================================
// API TYPES
// ============================================================

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

// ============================================================
// FORM TYPES (con Zod)
// ============================================================

export interface CreatePlayerForm {
  dorsal: number;
  full_name: string;
  position: PlayerPosition;
  nationality?: string;
  birth_date?: string;
  jersey_name?: string;
  shirt_size?: string;
  shorts_size?: string;
  shoe_size?: number;
  jacket_size?: string;
  notes?: string;
}

export interface CreateInventoryItemForm {
  name: string;
  description?: string;
  category: ItemCategory;
  brand?: string;
  model?: string;
  sku?: string;
  barcode?: string;
  stock_total: number;
  stock_min: number;
  stock_max?: number;
  condition: ItemCondition;
  size?: string;
  color?: string;
  unit_cost?: number;
  location?: string;
  location_detail?: string;
  notes?: string;
}

export interface CreateRequestForm {
  player_id?: string;
  title: string;
  description?: string;
  priority: RequestPriority;
  category?: ItemCategory;
  quantity?: number;
  size?: string;
  estimated_cost?: number;
  due_date?: string;
  items?: Omit<RequestItem, 'id' | 'request_id' | 'fulfilled' | 'created_at'>[];
}

export interface AssignItemForm {
  item_id: string;
  player_id: string;
  quantity: number;
  condition_out?: ItemCondition;
  expected_return?: string;
  notes?: string;
}

export interface CreateTripForm {
  name: string;
  trip_type: TripType;
  destination: string;
  opponent?: string;
  departure_date: string;
  return_date: string;
  departure_from?: string;
  transport_type?: string;
  flight_number?: string;
  hotel_name?: string;
  hotel_address?: string;
  notes?: string;
  player_ids?: string[];
}

// ============================================================
// FILTER & SORT TYPES
// ============================================================

export interface InventoryFilters {
  category?: ItemCategory;
  condition?: ItemCondition;
  low_stock?: boolean;
  search?: string;
  location?: string;
}

export interface RequestFilters {
  status?: RequestStatus;
  priority?: RequestPriority;
  player_id?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: string;
  direction: SortDirection;
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
}

// ============================================================
// QR / BARCODE
// ============================================================

export interface QRCodeData {
  type: 'inventory_item' | 'player' | 'trip';
  id: string;
  team_id: string;
  name: string;
  timestamp: number;
}

// ============================================================
// NOTIFICATION
// ============================================================

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

// ============================================================
// AUTH
// ============================================================

export interface AuthUser {
  id: string;
  email: string;
  profile: Profile;
  teams: UserTeam[];
  currentTeam: Team | null;
}

export interface UserTeam {
  team: Team;
  role: UserRole;
  is_active: boolean;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  full_name: string;
  role?: UserRole;
}
