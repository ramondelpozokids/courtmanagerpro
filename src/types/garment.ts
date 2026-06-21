export type GarmentStatus =
  | 'disponible'
  | 'asignada'
  | 'en_lavanderia'
  | 'en_viaje'
  | 'baja';

export interface GarmentUnit {
  id: string;
  qr_code: string;
  team_id: string;
  item_id: string;
  item_name: string;
  display_name: string;
  category: string;
  player_id: string | null;
  player_name: string | null;
  player_number: number | null;
  size: string;
  wash_count: number;
  status: GarmentStatus;
  location: string;
  image_url: string | null;
  last_wash_date: string | null;
  condition: 'nuevo' | 'bueno' | 'desgastado';
  last_scanned_at: string | null;
  /** Referencia de fábrica (p. ej. JP4057). */
  product_ref?: string | null;
  /** EAN / código de barras impreso en etiqueta. */
  barcode?: string | null;
  brand?: string | null;
  rfid_tag?: string | null;
  /** Códigos alternativos que resuelven a esta prenda (QR Adidas, pistola HID…). */
  scan_aliases?: string[];
}

export const GARMENT_STATUS_LABELS: Record<GarmentStatus, string> = {
  disponible: 'Disponible',
  asignada: 'Asignada',
  en_lavanderia: 'En lavandería',
  en_viaje: 'En viaje',
  baja: 'Baja',
};

export const GARMENT_STATUS_COLORS: Record<GarmentStatus, string> = {
  disponible: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900',
  asignada: 'text-blue-600 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900',
  en_lavanderia: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900',
  en_viaje: 'text-purple-600 bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900',
  baja: 'text-slate-500 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
};
