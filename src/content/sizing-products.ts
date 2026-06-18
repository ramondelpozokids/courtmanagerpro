export type SizingCategory =
  | 'equipacion'
  | 'entrenamiento'
  | 'calzado'
  | 'accesorios'
  | 'viaje';

export interface SizingProduct {
  id: string;
  label: string;
  shortLabel: string;
  category: SizingCategory;
  inputType: 'text' | 'number';
  defaultSize?: string;
  /** Clave legacy en player.sizes para migración */
  legacyKey?: string;
  custom?: boolean;
}

export const SIZING_CATEGORY_LABELS: Record<SizingCategory, string> = {
  equipacion: 'Equipación Oficial',
  entrenamiento: 'Entrenamiento & Chándal',
  calzado: 'Calzado',
  accesorios: 'Accesorios',
  viaje: 'Viaje & Pre-Partido',
};

/** Catálogo base inspirado en shop.realmadrid.com — Baloncesto 25/26 */
export const DEFAULT_SIZING_PRODUCTS: SizingProduct[] = [
  // Equipación oficial de juego
  { id: 'jersey_home', label: 'Camiseta Local 25/26', shortLabel: 'C. Local', category: 'equipacion', inputType: 'text', defaultSize: 'XL', legacyKey: 'jersey' },
  { id: 'jersey_away', label: 'Camiseta Visitante 25/26', shortLabel: 'C. Visit.', category: 'equipacion', inputType: 'text', defaultSize: 'XL' },
  { id: 'jersey_third', label: 'Tercera Equipación 25/26', shortLabel: '3ª Eq.', category: 'equipacion', inputType: 'text', defaultSize: 'XL' },
  { id: 'shorts_game', label: 'Pantalón Corto Juego', shortLabel: 'P. Juego', category: 'equipacion', inputType: 'text', defaultSize: 'XL', legacyKey: 'shorts' },
  { id: 'jersey_shootaround', label: 'Camiseta Shootaround', shortLabel: 'Shoot.', category: 'equipacion', inputType: 'text', defaultSize: 'XL' },

  // Entrenamiento (shop.realmadrid.com → Entrenamiento Baloncesto)
  { id: 'training_shirt', label: 'Camiseta Entrenamiento', shortLabel: 'C. Entr.', category: 'entrenamiento', inputType: 'text', defaultSize: 'XL' },
  { id: 'training_shorts', label: 'Pantalón Corto Entrenamiento', shortLabel: 'P.C. Entr.', category: 'entrenamiento', inputType: 'text', defaultSize: 'XL' },
  { id: 'training_pants_long', label: 'Pantalón Largo Entrenamiento', shortLabel: 'P.L. Entr.', category: 'entrenamiento', inputType: 'text', defaultSize: 'XL' },
  { id: 'tracksuit_jacket', label: 'Chándal — Chaqueta', shortLabel: 'Chándal ↑', category: 'entrenamiento', inputType: 'text', defaultSize: 'XL', legacyKey: 'warmupShirt' },
  { id: 'tracksuit_pants', label: 'Chándal — Pantalón', shortLabel: 'Chándal ↓', category: 'entrenamiento', inputType: 'text', defaultSize: 'XL' },
  { id: 'hoodie', label: 'Sudadera con Capucha', shortLabel: 'Sudadera', category: 'entrenamiento', inputType: 'text', defaultSize: 'XL' },
  { id: 'windbreaker', label: 'Chaqueta Cortavientos', shortLabel: 'Cortav.', category: 'entrenamiento', inputType: 'text', defaultSize: 'XL' },
  { id: 'polo_staff', label: 'Polo Staff / Cuerpo Técnico', shortLabel: 'Polo', category: 'entrenamiento', inputType: 'text', defaultSize: 'L' },

  // Calzado
  { id: 'shoes_game', label: 'Zapatillas de Juego', shortLabel: 'Z. Juego', category: 'calzado', inputType: 'number', defaultSize: '46', legacyKey: 'shoes' },
  { id: 'shoes_training', label: 'Zapatillas Entrenamiento', shortLabel: 'Z. Entr.', category: 'calzado', inputType: 'number', defaultSize: '46' },
  { id: 'slides', label: 'Chanclas / Slide', shortLabel: 'Chanclas', category: 'calzado', inputType: 'number', defaultSize: '46' },

  // Accesorios
  { id: 'socks', label: 'Calcetines / Medias Compresión', shortLabel: 'Calcet.', category: 'accesorios', inputType: 'text', defaultSize: 'L', legacyKey: 'socks' },
  { id: 'baselayer', label: 'Mallas / Primera Capa', shortLabel: 'Mallas', category: 'accesorios', inputType: 'text', defaultSize: 'L' },
  { id: 'compression_sleeve', label: 'Manga Compresión', shortLabel: 'Manga', category: 'accesorios', inputType: 'text', defaultSize: 'L' },
  { id: 'cap', label: 'Gorra Oficial', shortLabel: 'Gorra', category: 'accesorios', inputType: 'text', defaultSize: 'M' },
  { id: 'towel', label: 'Toalla Oficial', shortLabel: 'Toalla', category: 'accesorios', inputType: 'text', defaultSize: 'Única' },
  { id: 'wristband', label: 'Muñequeras', shortLabel: 'Muñeq.', category: 'accesorios', inputType: 'text', defaultSize: 'M' },

  // Viaje & pre-partido
  { id: 'pre_match_jacket', label: 'Chaqueta Pre-Partido', shortLabel: 'Pre-P.', category: 'viaje', inputType: 'text', defaultSize: 'XL' },
  { id: 'travel_jacket', label: 'Chaqueta Colección Viaje', shortLabel: 'Viaje ↑', category: 'viaje', inputType: 'text', defaultSize: 'XL' },
  { id: 'travel_pants', label: 'Pantalón Colección Viaje', shortLabel: 'Viaje ↓', category: 'viaje', inputType: 'text', defaultSize: 'XL' },
  { id: 'duffel_bag', label: 'Petate / Bolsa Viaje', shortLabel: 'Petate', category: 'viaje', inputType: 'text', defaultSize: 'Única' },
  { id: 'backpack', label: 'Mochila Oficial', shortLabel: 'Mochila', category: 'viaje', inputType: 'text', defaultSize: 'Única' },
];

export function mergeSizingCatalog(custom: SizingProduct[] = []): SizingProduct[] {
  const ids = new Set(DEFAULT_SIZING_PRODUCTS.map((p) => p.id));
  const extra = custom.filter((p) => !ids.has(p.id));
  return [...DEFAULT_SIZING_PRODUCTS, ...extra];
}

/** Migra tallas legacy y rellena huecos del catálogo */
export function normalizeSizes(
  raw: Record<string, string | number | undefined> | undefined,
  catalog: SizingProduct[]
): Record<string, string> {
  const sizes: Record<string, string> = {};

  if (raw) {
    for (const [k, v] of Object.entries(raw)) {
      if (v !== undefined && v !== null && v !== '') sizes[k] = String(v);
    }
  }

  for (const product of catalog) {
    if (sizes[product.id]) continue;
    if (product.legacyKey && sizes[product.legacyKey]) {
      sizes[product.id] = sizes[product.legacyKey];
    } else if (product.defaultSize) {
      sizes[product.id] = product.defaultSize;
    } else {
      sizes[product.id] = '—';
    }
  }

  return sizes;
}

/** Migra staff con campos planos a objeto sizes */
export function staffToSizes(staff: {
  shirt_size?: string;
  shorts_size?: string;
  shoe_size?: number | string;
  sizes?: Record<string, string | number>;
}, catalog: SizingProduct[]): Record<string, string> {
  const base: Record<string, string | number | undefined> = {
    ...(staff.sizes || {}),
    tracksuit_jacket: staff.sizes?.tracksuit_jacket ?? staff.shirt_size,
    tracksuit_pants: staff.sizes?.tracksuit_pants ?? staff.shorts_size,
    shoes_game: staff.sizes?.shoes_game ?? staff.shoe_size,
  };
  return normalizeSizes(base, catalog);
}

export function sizesToStaffFields(sizes: Record<string, string>) {
  return {
    sizes,
    shirt_size: sizes.tracksuit_jacket || sizes.polo_staff || sizes.training_shirt,
    shorts_size: sizes.tracksuit_pants || sizes.training_shorts,
    shoe_size: Number(sizes.shoes_game || sizes.shoes_training || 43),
  };
}
