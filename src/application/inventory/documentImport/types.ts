import { z } from 'zod';
import type { ItemCategory } from '@/types';

export const extractedInventoryItemSchema = z.object({
  name: z.string().min(1),
  sku: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  brand: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  size: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  quantity: z.number().int().nonnegative().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export type ExtractedInventoryItem = z.infer<typeof extractedInventoryItemSchema>;

export type InventoryDiffChangeType = 'alta' | 'baja' | 'modificacion' | 'cantidad';

export interface InventoryDiffChange {
  change_type: InventoryDiffChangeType;
  item_id: string | null;
  item_name: string;
  old_qty: number | null;
  new_qty: number | null;
  payload: Record<string, unknown>;
}

export interface InventoryDiffPreview {
  document_origin: string;
  added: InventoryDiffChange[];
  modified: InventoryDiffChange[];
  removed: InventoryDiffChange[];
  summary: {
    added: number;
    modified: number;
    removed: number;
  };
}

const KNOWN: ItemCategory[] = [
  'camiseta_juego',
  'camiseta_entrenamiento',
  'pantalon_juego',
  'pantalon_entrenamiento',
  'zapatillas',
  'calcetines',
  'ropa_interior',
  'chaqueta',
  'chandal',
  'accesorios',
  'equipamiento_cancha',
  'electronica',
  'medico',
  'higiene',
  'otro',
];

export const CATEGORY_ALIASES: Record<string, ItemCategory> = {
  camiseta: 'camiseta_entrenamiento',
  camisetas: 'camiseta_entrenamiento',
  equipacion: 'camiseta_juego',
  equipacion_juego: 'camiseta_juego',
  balon: 'equipamiento_cancha',
  balones: 'equipamiento_cancha',
  zapatilla: 'zapatillas',
  zapatillas: 'zapatillas',
  medico: 'medico',
  material_medico: 'medico',
  conos: 'equipamiento_cancha',
  petos: 'accesorios',
  canasta: 'equipamiento_cancha',
  canastas: 'equipamiento_cancha',
  reloj: 'electronica',
  relojes: 'electronica',
  electronico: 'electronica',
  electronica: 'electronica',
  pantalon: 'pantalon_entrenamiento',
  chaqueta: 'chaqueta',
  calcetines: 'calcetines',
  chandal: 'chandal',
  accesorios: 'accesorios',
  higiene: 'higiene',
  otros: 'otro',
  otro: 'otro',
};

export function mapCategory(raw: string | null | undefined): ItemCategory {
  if (!raw) return 'otro';
  const key = raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_');
  if (CATEGORY_ALIASES[key]) return CATEGORY_ALIASES[key];
  if ((KNOWN as string[]).includes(key)) return key as ItemCategory;
  return 'otro';
}

export function normalizeItemKey(name: string, sku?: string | null, size?: string | null): string {
  const base = (sku || name)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const sz = (size || '').toLowerCase().trim();
  return sz ? `${base}__${sz}` : base;
}
