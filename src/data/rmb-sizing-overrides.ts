/**
 * Tallas internas del club (no están en realmadrid.com).
 * Se conservan al sincronizar la plantilla oficial por slug.
 * Para jugadores/staff nuevos, se usan valores por defecto.
 */

export interface RmbPlayerSizeOverride {
  legacyId?: string;
  jersey: string;
  shorts: string;
  shoes: string;
  socks: string;
  warmupShirt: string;
}

export interface RmbStaffSizeOverride {
  legacyId?: string;
  shirt_size: string;
  shorts_size: string;
  shoe_size: number;
}

export const DEFAULT_PLAYER_SIZES: RmbPlayerSizeOverride = {
  jersey: 'L',
  shorts: 'L',
  shoes: '45',
  socks: 'M',
  warmupShirt: 'L',
};

export const DEFAULT_STAFF_SIZES: RmbStaffSizeOverride = {
  shirt_size: 'L',
  shorts_size: 'L',
  shoe_size: 43,
};

/** Tallas importadas — nota utilería LUNES R. MEDICO Y TINO (12-08-2026) */
export const RMB_PLAYER_SIZE_OVERRIDES: Record<string, RmbPlayerSizeOverride> = {
  'max-shulga': {
    legacyId: 'p3',
    jersey: 'XL',
    shorts: 'XL',
    shoes: '45',
    socks: 'M',
    warmupShirt: 'XL',
  },
  'facundo-campazzo': {
    legacyId: 'p1',
    jersey: 'L',
    shorts: 'L',
    shoes: '42.5',
    socks: 'M',
    warmupShirt: 'L',
  },
  'walter-samuel-tavares-da-veiga': {
    legacyId: 'p2',
    jersey: '2XL',
    shorts: '2XL',
    shoes: '52',
    socks: 'XL',
    warmupShirt: '2XL',
  },
  'gabriel-deck': {
    legacyId: 'p4',
    jersey: 'XL',
    shorts: 'XL',
    shoes: '46.5',
    socks: 'L',
    warmupShirt: 'XL',
  },
  'theo-maledon': {
    legacyId: 'p5',
    jersey: 'L',
    shorts: 'L',
    shoes: '45',
    socks: 'M',
    warmupShirt: 'L',
  },
  'sergio-llull-melia': {
    legacyId: 'p6',
    jersey: 'XL',
    shorts: 'XL',
    shoes: '44',
    socks: 'M',
    warmupShirt: 'XL',
  },
  'usman-garuba': {
    legacyId: 'p7',
    jersey: '2XL',
    shorts: '2XL',
    shoes: '49.5',
    socks: 'XL',
    warmupShirt: '2XL',
  },
  'andres-feliz': {
    legacyId: 'p8',
    jersey: 'L',
    shorts: 'L',
    shoes: '43',
    socks: 'M',
    warmupShirt: 'L',
  },
  'timothe-luwawu-cabarrot': {
    legacyId: 'p9',
    jersey: 'L',
    shorts: 'L',
    shoes: '45',
    socks: 'M',
    warmupShirt: 'L',
  },
  'alberto-abalde-diaz': {
    legacyId: 'p10',
    jersey: 'XL',
    shorts: 'XL',
    shoes: '46',
    socks: 'L',
    warmupShirt: 'XL',
  },
  'gabriele-procida': {
    legacyId: 'p11',
    jersey: 'L',
    shorts: 'L',
    shoes: '46',
    socks: 'M',
    warmupShirt: 'L',
  },
  'mikael-olli-axel-jantunen': {
    legacyId: 'p12',
    jersey: 'XL',
    shorts: 'XL',
    shoes: '47',
    socks: 'L',
    warmupShirt: 'XL',
  },
  'chukwuma-julian-okeke': {
    legacyId: 'p13',
    jersey: 'XL',
    shorts: 'XL',
    shoes: '47',
    socks: 'L',
    warmupShirt: 'XL',
  },
  'izan-almansa': {
    legacyId: 'p14',
    jersey: 'XL',
    shorts: 'XL',
    shoes: '48',
    socks: 'L',
    warmupShirt: 'XL',
  },
  'olivier-sarr': {
    legacyId: 'p19',
    jersey: '2XL',
    shorts: '2XL',
    shoes: '50',
    socks: 'XL',
    warmupShirt: '2XL',
  },
  'jaime-pradilla-gayan': {
    legacyId: 'p18',
    jersey: 'XL',
    shorts: 'XL',
    shoes: '46',
    socks: 'L',
    warmupShirt: 'XL',
  },
};

export const RMB_STAFF_SIZE_OVERRIDES: Record<string, RmbStaffSizeOverride> = {
  'pedro-martinez': {
    legacyId: 'c1',
    shirt_size: 'L',
    shorts_size: 'L',
    shoe_size: 43,
  },
};
