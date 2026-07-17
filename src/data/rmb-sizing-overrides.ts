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

export const RMB_PLAYER_SIZE_OVERRIDES: Record<string, RmbPlayerSizeOverride> = {
  'facundo-campazzo': {
    legacyId: 'p1',
    jersey: 'M',
    shorts: 'M',
    shoes: '42.5',
    socks: 'M',
    warmupShirt: 'M',
  },
  'walter-samuel-tavares-da-veiga': {
    legacyId: 'p2',
    jersey: 'XXXL',
    shorts: 'XXXL',
    shoes: '52',
    socks: 'XL',
    warmupShirt: 'XXXL',
  },
  'mario-hezonja': {
    legacyId: 'p3',
    jersey: 'XL',
    shorts: 'XL',
    shoes: '47.5',
    socks: 'L',
    warmupShirt: 'XL',
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
    jersey: 'L',
    shorts: 'L',
    shoes: '44',
    socks: 'M',
    warmupShirt: 'L',
  },
  'usman-garuba': {
    legacyId: 'p7',
    jersey: 'XXL',
    shorts: 'XXL',
    shoes: '49.5',
    socks: 'XL',
    warmupShirt: 'XXL',
  },
  'andres-feliz': {
    legacyId: 'p8',
    jersey: 'M',
    shorts: 'L',
    shoes: '43',
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
  'chukwuma-julian-okeke': {
    legacyId: 'p13',
    jersey: 'XXL',
    shorts: 'XXL',
    shoes: '47',
    socks: 'L',
    warmupShirt: 'XXL',
  },
  'izan-almansa': {
    legacyId: 'p14',
    jersey: 'XL',
    shorts: 'XL',
    shoes: '48',
    socks: 'L',
    warmupShirt: 'XL',
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
