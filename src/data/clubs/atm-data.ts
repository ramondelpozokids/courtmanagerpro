/** Pack producción — Atlético de Madrid · Primer Equipo de Fútbol
 * Fuentes oficiales:
 * - https://www.atleticodemadrid.com/equipos/atletico-de-madrid-2025-2026
 * - https://www.atleticodemadrid.com/calendario-completo-primer-equipo/
 * - shop.atleticodemadrid.com (hombre: 1ª / 2ª IR1435-011 · II2031-010 / 3ª / entrenamiento)
 * - https://www.atleticodemadrid.com/patrocinadores
 * - https://www.atleticodemadrid.com/noticias-nuevo-estadio
 * Actualizado: 2026-07-27
 */

export const ATM_OFFICIAL_PLANTILLA_URL =
  'https://www.atleticodemadrid.com/equipos/atletico-de-madrid-2025-2026';
export const ATM_OFFICIAL_CALENDAR_URL =
  'https://www.atleticodemadrid.com/calendario-completo-primer-equipo/';
export const ATM_OFFICIAL_STORE_URL = 'https://shop.atleticodemadrid.com/es';
export const ATM_STORE_HOME_URL =
  'https://shop.atleticodemadrid.com/es/equipaciones/primera-equipacion?srule=Novedades&start=0&sz=11';
export const ATM_STORE_HOME_LS_URL =
  'https://shop.atleticodemadrid.com/es/camiseta-manga-larga-hombre-1-equipacion-26-27/IQ6643-101.html';
export const ATM_STORE_AWAY_MEN_URL =
  'https://shop.atleticodemadrid.com/es/equipaciones/segunda-equipacion/hombre';
export const ATM_STORE_AWAY_MATCH_URL =
  'https://shop.atleticodemadrid.com/es/camiseta-match-hombre-2-equipacion-26-27/IR1435-011.html';
export const ATM_STORE_AWAY_SHORT_URL =
  'https://shop.atleticodemadrid.com/es/pantalon-corto-2-equipacion-26-27/II2031-010.html';
export const ATM_STORE_THIRD_MEN_URL =
  'https://shop.atleticodemadrid.com/es/equipaciones/tercera-equipacion/hombre';
export const ATM_STORE_GK_MEN_URL =
  'https://shop.atleticodemadrid.com/es/equipaciones/equipacion-de-portero/hombre';
export const ATM_STORE_TRAINING_URL = 'https://shop.atleticodemadrid.com/es/entrenamiento';
export const ATM_SPONSORS_URL = 'https://www.atleticodemadrid.com/patrocinadores';
export const ATM_STADIUM_NEWS_URL = 'https://www.atleticodemadrid.com/noticias-nuevo-estadio';

/** Fotos producto tienda oficial (Demandware catalog) — hombre */
const CAT = 'https://shop.atleticodemadrid.com/dw/image/v2/BKQJ_PRD/on/demandware.static/-/Sites-atm-master-catalog/default';
export const ATM_SHOP_IMAGES = {
  homeMatch: `${CAT}/dw59595213/II2740-101.jpg`,
  homeReplica: `${CAT}/dw6a9d0b45/II1893-101_jugador.jpg`,
  homeLongSleeve: `https://shop.atleticodemadrid.com/on/demandware.static/-/Sites-atm-master-catalog/default/dwb4038a4f/New%20Folder/IQ6643-101_1.jpg`,
  homeShort: `${CAT}/dwfbd93d53/II1977-455_6.jpg`,
  homeSock: `${CAT}/dw82fb8356/IQ6645-455_1.jpg`,
  awayMatch: `${CAT}/dwc5b5bad6/IR1435-011_CENTERED.jpg`,
  awayReplica: `${CAT}/dw2fde1d06/II1932-011_CENTERED.jpg`,
  awayShort: `${CAT}/dwf8a4510b/II2031-010_SIN.jpg`,
  awaySock: `${CAT}/dw19ade56f/New%20Folder/IQ6648-010.jpg`,
  thirdMatch: `${CAT}/dw60d3e5ba/HM3200-407_.jpg`,
  thirdReplica: `${CAT}/dw45340fbb/HM3192-407_.jpg`,
  thirdShort: `${CAT}/dw5f0e8aac/IF1452-407_01.jpg`,
  thirdSock: `${CAT}/dwf38a98ea/HM3220-406_zoom.jpg`,
  gkJersey: `${CAT}/dw2eef5d35/HQ9235-084.jpg`,
  trainingTee: `${CAT}/dw2c70d141/II2770-702_.jpg`,
  trainingShort: `${CAT}/dw6e1f0b8e/II2299-702.jpg`,
  drillTop: `${CAT}/dwa77c1ae6/II2666-702.jpg`,
} as const;
/** Principales + camiseta (oficial atleticodemadrid.com/patrocinadores) */
export const ATM_SPONSORS_MAIN = [
  'Riyadh Air',
  'Nike',
  'Visit Rwanda',
  'Kraken',
] as const;
export const ATM_SPONSORS_PREMIUM = [
  'Mahou',
  'Hyundai',
  'EA Sports',
  'Movistar',
  'CaixaBank',
  'Coca-Cola',
] as const;
export const ATM_TEAM_ID = '00000000-0000-4000-8000-000acb423458';
export const ATM_OFFICIAL_SYNCED_AT = '2026-07-27T13:20:00.000Z';

const PLANTILLA_URL = ATM_OFFICIAL_PLANTILLA_URL;

type DemoPlayer = {
  id: string;
  firstName: string;
  lastName: string;
  number: number;
  position: string;
  nationality: string;
  birthDate: string;
  imageUrl: string;
  profile_url: string;
  sizes: { jersey: string; shorts: string; shoes: string; socks: string; warmupShirt: string };
};

function mk(p: DemoPlayer) {
  return {
    ...p,
    status: 'ACTIVE' as const,
    birth_place: '—',
    matches_played: 0,
    points: 0,
    rebounds: 0,
    assists: 0,
    palmares: ['Atlético de Madrid — Primer Equipo 25/26'],
  };
}

const defaultSizes = {
  L: { jersey: 'L', shorts: 'L', shoes: '44', socks: 'M', warmupShirt: 'L' },
  XL: { jersey: 'XL', shorts: 'L', shoes: '45', socks: 'L', warmupShirt: 'XL' },
  XXL: { jersey: 'XXL', shorts: 'XL', shoes: '46', socks: 'XL', warmupShirt: 'XXL' },
  M: { jersey: 'M', shorts: 'M', shoes: '42', socks: 'M', warmupShirt: 'M' },
};

function playerUrl(slug: string) {
  return `https://www.atleticodemadrid.com/jugadores/${slug}`;
}

/** Plantilla oficial 2025-2026 — atleticodemadrid.com */
export const atmPlayers = [
  // Porteros
  mk({
    id: 'p1',
    firstName: 'Juan Agustín',
    lastName: 'Musso',
    number: 1,
    position: 'portero',
    nationality: 'Argentina',
    birthDate: '1994-05-06',
    imageUrl: '/clubs/atm/logo.png',
    profile_url: playerUrl('juan-agustin-musso-2025-2026'),
    sizes: defaultSizes.XL,
  }),
  mk({
    id: 'p2',
    firstName: 'Jan',
    lastName: 'Oblak',
    number: 13,
    position: 'portero',
    nationality: 'Eslovenia',
    birthDate: '1993-01-07',
    imageUrl: '/clubs/atm/logo.png',
    profile_url: playerUrl('jan-oblak-2025-2026'),
    sizes: defaultSizes.XL,
  }),
  // Defensas
  mk({
    id: 'p3',
    firstName: 'José María',
    lastName: 'Giménez',
    number: 2,
    position: 'defensa',
    nationality: 'Uruguay',
    birthDate: '1995-01-20',
    imageUrl: '/clubs/atm/logo.png',
    profile_url: playerUrl('jose-maria-gimenez-de-vargas-2025-2026'),
    sizes: defaultSizes.L,
  }),
  mk({
    id: 'p4',
    firstName: 'Matteo',
    lastName: 'Ruggeri',
    number: 3,
    position: 'defensa',
    nationality: 'Italia',
    birthDate: '2002-07-11',
    imageUrl: '/clubs/atm/logo.png',
    profile_url: playerUrl('matteo-ruggeri-2025-2026'),
    sizes: defaultSizes.L,
  }),
  mk({
    id: 'p5',
    firstName: 'Clément',
    lastName: 'Lenglet',
    number: 15,
    position: 'defensa',
    nationality: 'Francia',
    birthDate: '1995-06-17',
    imageUrl: '/clubs/atm/logo.png',
    profile_url: playerUrl('clement-nicolas-laurent-lenglet-2025-2026'),
    sizes: defaultSizes.XL,
  }),
  mk({
    id: 'p6',
    firstName: 'Nahuel',
    lastName: 'Molina',
    number: 16,
    position: 'defensa',
    nationality: 'Argentina',
    birthDate: '1998-04-06',
    imageUrl: '/clubs/atm/logo.png',
    profile_url: playerUrl('nahuel-molina-lucero-2025-2026'),
    sizes: defaultSizes.L,
  }),
  mk({
    id: 'p7',
    firstName: 'Dávid',
    lastName: 'Hancko',
    number: 17,
    position: 'defensa',
    nationality: 'Eslovaquia',
    birthDate: '1997-12-13',
    imageUrl: '/clubs/atm/logo.png',
    profile_url: playerUrl('david-hancko-2025-2026'),
    sizes: defaultSizes.XL,
  }),
  mk({
    id: 'p8',
    firstName: 'Marc',
    lastName: 'Pubill',
    number: 18,
    position: 'defensa',
    nationality: 'España',
    birthDate: '2003-06-21',
    imageUrl: '/clubs/atm/logo.png',
    profile_url: playerUrl('marc-pubill-pages-2025-2026'),
    sizes: defaultSizes.L,
  }),
  mk({
    id: 'p9',
    firstName: 'Robin',
    lastName: 'Le Normand',
    number: 24,
    position: 'defensa',
    nationality: 'España',
    birthDate: '1996-11-11',
    imageUrl: '/clubs/atm/logo.png',
    profile_url: playerUrl('robin-aime-robert-le-normand-2025-2026'),
    sizes: defaultSizes.XL,
  }),
  // Centrocampistas
  mk({
    id: 'p10',
    firstName: 'Rodrigo',
    lastName: 'Mendoza',
    number: 4,
    position: 'centrocampista',
    nationality: 'España',
    birthDate: '2005-01-01',
    imageUrl: '/clubs/atm/logo.png',
    profile_url: playerUrl('rodrigo-mendoza-martinez-moya-2025-2026'),
    sizes: defaultSizes.M,
  }),
  mk({
    id: 'p11',
    firstName: 'Johnny',
    lastName: 'Cardoso',
    number: 5,
    position: 'centrocampista',
    nationality: 'Brasil',
    birthDate: '2001-09-20',
    imageUrl: '/clubs/atm/logo.png',
    profile_url: playerUrl('jo-o-lucas-de-souza-cardoso-2025-2026'),
    sizes: defaultSizes.L,
  }),
  mk({
    id: 'p12',
    firstName: 'Koke',
    lastName: 'Resurrección',
    number: 6,
    position: 'centrocampista',
    nationality: 'España',
    birthDate: '1992-01-08',
    imageUrl: '/clubs/atm/logo.png',
    profile_url: playerUrl('jorge-resurreccion-merodio-2025-2026'),
    sizes: defaultSizes.L,
  }),
  mk({
    id: 'p13',
    firstName: 'Pablo',
    lastName: 'Barrios',
    number: 8,
    position: 'centrocampista',
    nationality: 'España',
    birthDate: '2003-06-15',
    imageUrl: '/clubs/atm/logo.png',
    profile_url: playerUrl('pablo-barrios-rivas-2025-2026'),
    sizes: defaultSizes.M,
  }),
  mk({
    id: 'p14',
    firstName: 'Álex',
    lastName: 'Baena',
    number: 10,
    position: 'centrocampista',
    nationality: 'España',
    birthDate: '2001-07-20',
    imageUrl: '/clubs/atm/logo.png',
    profile_url: playerUrl('alejandro-baena-rodriguez-2025-2026'),
    sizes: defaultSizes.M,
  }),
  mk({
    id: 'p15',
    firstName: 'Marcos',
    lastName: 'Llorente',
    number: 14,
    position: 'centrocampista',
    nationality: 'España',
    birthDate: '1995-01-30',
    imageUrl: '/clubs/atm/logo.png',
    profile_url: playerUrl('marcos-llorente-moreno-2025-2026'),
    sizes: defaultSizes.L,
  }),
  mk({
    id: 'p16',
    firstName: 'Giuliano',
    lastName: 'Simeone',
    number: 20,
    position: 'centrocampista',
    nationality: 'Argentina',
    birthDate: '2002-12-18',
    imageUrl: '/clubs/atm/logo.png',
    profile_url: playerUrl('giuliano-simeone-baldini-2025-2026'),
    sizes: defaultSizes.M,
  }),
  mk({
    id: 'p17',
    firstName: 'Obed',
    lastName: 'Vargas',
    number: 21,
    position: 'centrocampista',
    nationality: 'México',
    birthDate: '2005-08-01',
    imageUrl: '/clubs/atm/logo.png',
    profile_url: playerUrl('obed-gomez-vargas-2025-2026'),
    sizes: defaultSizes.M,
  }),
  mk({
    id: 'p18',
    firstName: 'Morten',
    lastName: 'Hjulmand',
    number: 23,
    position: 'centrocampista',
    nationality: 'Dinamarca',
    birthDate: '1999-06-25',
    imageUrl: '/clubs/atm/logo.png',
    profile_url: PLANTILLA_URL,
    sizes: defaultSizes.L,
  }),
  // Delanteros
  mk({
    id: 'p19',
    firstName: 'Kang In',
    lastName: 'Lee',
    number: 7,
    position: 'delantero',
    nationality: 'Corea del Sur',
    birthDate: '2001-02-19',
    imageUrl: '/clubs/atm/logo.png',
    profile_url: 'https://www.atleticodemadrid.com/noticias/kang-in-lee-ficha-por-el-atletico-de-madrid',
    sizes: defaultSizes.M,
  }),
  mk({
    id: 'p20',
    firstName: 'Alexander',
    lastName: 'Sørloth',
    number: 9,
    position: 'delantero',
    nationality: 'Noruega',
    birthDate: '1995-12-05',
    imageUrl: '/clubs/atm/logo.png',
    profile_url: playerUrl('alexander-s-rloth-2025-2026'),
    sizes: defaultSizes.XXL,
  }),
  mk({
    id: 'p21',
    firstName: 'Thiago',
    lastName: 'Almada',
    number: 11,
    position: 'delantero',
    nationality: 'Argentina',
    birthDate: '2001-04-26',
    imageUrl: '/clubs/atm/logo.png',
    profile_url: playerUrl('thiago-ezequiel-almada-2025-2026'),
    sizes: defaultSizes.M,
  }),
  mk({
    id: 'p22',
    firstName: 'Julián',
    lastName: 'Álvarez',
    number: 19,
    position: 'delantero',
    nationality: 'Argentina',
    birthDate: '2000-01-31',
    imageUrl: '/clubs/atm/logo.png',
    profile_url: playerUrl('julian-alvarez-2025-2026'),
    sizes: defaultSizes.M,
  }),
  mk({
    id: 'p23',
    firstName: 'Ademola',
    lastName: 'Lookman',
    number: 22,
    position: 'delantero',
    nationality: 'Nigeria',
    birthDate: '1997-10-20',
    imageUrl: '/clubs/atm/logo.png',
    profile_url: playerUrl('ademola-olajade-alade-aylola-lookman-2025-2026'),
    sizes: defaultSizes.M,
  }),
];

export const atmCoachingStaff = [
  {
    id: 'c1',
    full_name: 'Diego Pablo Simeone',
    role: 'Entrenador',
    email: 'dsimeone@atleticodemadrid.com',
    shirt_size: 'L',
    shorts_size: 'L',
    shoe_size: 43,
    nationality: 'Argentina',
    photo_url: '/clubs/atm/logo.png',
    profile_url: PLANTILLA_URL,
  },
  {
    id: 'c2',
    full_name: 'Gustavo López',
    role: 'Asistente de entrenador',
    email: 'glopez@atleticodemadrid.com',
    shirt_size: 'L',
    shorts_size: 'L',
    shoe_size: 43,
    nationality: 'Argentina',
    photo_url: '/clubs/atm/logo.png',
    profile_url: PLANTILLA_URL,
  },
  {
    id: 'c3',
    full_name: 'Hernán Bonvicini',
    role: 'Asistente de entrenador',
    email: 'hbonvicini@atleticodemadrid.com',
    shirt_size: 'L',
    shorts_size: 'L',
    shoe_size: 43,
    nationality: 'Argentina',
    photo_url: '/clubs/atm/logo.png',
    profile_url: PLANTILLA_URL,
  },
  {
    id: 'c4',
    full_name: 'Nelson Vivas',
    role: 'Segundo entrenador',
    email: 'nvivas@atleticodemadrid.com',
    shirt_size: 'L',
    shorts_size: 'L',
    shoe_size: 43,
    nationality: 'Argentina',
    photo_url: '/clubs/atm/logo.png',
    profile_url: PLANTILLA_URL,
  },
  {
    id: 'c5',
    full_name: 'Luis Piñedo Betrián',
    role: 'Preparador físico',
    email: 'lpinedo@atleticodemadrid.com',
    shirt_size: 'L',
    shorts_size: 'L',
    shoe_size: 43,
    nationality: 'España',
    photo_url: '/clubs/atm/logo.png',
    profile_url: PLANTILLA_URL,
  },
  {
    id: 'c6',
    full_name: 'Pablo Vercellone',
    role: 'Preparador de porteros',
    email: 'pvercellone@atleticodemadrid.com',
    shirt_size: 'L',
    shorts_size: 'L',
    shoe_size: 43,
    nationality: 'Argentina',
    photo_url: '/clubs/atm/logo.png',
    profile_url: PLANTILLA_URL,
  },
];

const LOC_KIT = 'Ciudad Deportiva — Almacén Equipaciones Hombre';
const nowIso = () => new Date().toISOString();
const STORE = 'shop.atleticodemadrid.com';

function kitItem(p: {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock_total: number;
  stock_available: number;
  stock_min: number;
  size: string;
  image_url: string;
  product_url?: string;
}) {
  return {
    ...p,
    location: LOC_KIT,
    qr_code: p.sku,
    unit_cost: p.price,
    is_active: true,
    updated_at: nowIso(),
    gender: 'masculino' as const,
    source: p.product_url || STORE,
  };
}

/**
 * Inventario utilería — SOLO hombre / masculino
 * Fuentes tienda: 1ª · 2ª hombre · 3ª hombre · portero hombre · entrenamiento
 * Precios EUR tienda ES (referencia web club / tienda oficial).
 */
export const atmInventory = [
  // ——— 1ª equipación hombre ———
  kitItem({
    id: 'i1',
    name: 'Camiseta Match Hombre 1ª Equipación 26/27',
    sku: 'II2740-101',
    category: 'camiseta_juego',
    price: 159.95,
    stock_total: 80,
    stock_available: 54,
    stock_min: 20,
    size: 'L',
    image_url: ATM_SHOP_IMAGES.homeMatch,
    product_url: ATM_STORE_HOME_URL,
  }),
  kitItem({
    id: 'i2',
    name: 'Camiseta Hombre 1ª Equipación 26/27',
    sku: 'II1893-101',
    category: 'camiseta_juego',
    price: 109.95,
    stock_total: 100,
    stock_available: 72,
    stock_min: 25,
    size: 'L',
    image_url: ATM_SHOP_IMAGES.homeReplica,
    product_url: ATM_STORE_HOME_URL,
  }),
  kitItem({
    id: 'i3',
    name: 'Camiseta Manga Larga Hombre 1ª Equipación 26/27',
    sku: 'IQ6643-101',
    category: 'camiseta_juego',
    price: 119.95,
    stock_total: 40,
    stock_available: 28,
    stock_min: 10,
    size: 'L',
    image_url: ATM_SHOP_IMAGES.homeLongSleeve,
    product_url: ATM_STORE_HOME_LS_URL,
  }),
  kitItem({
    id: 'i4',
    name: 'Pantalón Corto 1ª Equipación 26/27',
    sku: 'II1977-455',
    category: 'pantalon_juego',
    price: 54.95,
    stock_total: 90,
    stock_available: 60,
    stock_min: 20,
    size: 'L',
    image_url: ATM_SHOP_IMAGES.homeShort,
    product_url: ATM_STORE_HOME_URL,
  }),
  kitItem({
    id: 'i5',
    name: 'Medias 1ª Equipación 26/27',
    sku: 'IQ6645-455',
    category: 'calcetines',
    price: 24.95,
    stock_total: 120,
    stock_available: 90,
    stock_min: 30,
    size: 'M',
    image_url: ATM_SHOP_IMAGES.homeSock,
    product_url: ATM_STORE_HOME_URL,
  }),
  // ——— 2ª equipación hombre ———
  kitItem({
    id: 'i6',
    name: 'Camiseta Match Hombre 2ª Equipación 26/27',
    sku: 'IR1435-011',
    category: 'camiseta_juego',
    price: 159.95,
    stock_total: 60,
    stock_available: 40,
    stock_min: 15,
    size: 'L',
    image_url: ATM_SHOP_IMAGES.awayMatch,
    product_url: ATM_STORE_AWAY_MATCH_URL,
  }),
  kitItem({
    id: 'i19',
    name: 'Camiseta Hombre 2ª Equipación 26/27',
    sku: 'II1932-011',
    category: 'camiseta_juego',
    price: 109.95,
    stock_total: 55,
    stock_available: 38,
    stock_min: 12,
    size: 'L',
    image_url: ATM_SHOP_IMAGES.awayReplica,
    product_url: ATM_STORE_AWAY_MEN_URL,
  }),
  kitItem({
    id: 'i7',
    name: 'Pantalón Corto 2ª Equipación 26/27',
    sku: 'II2031-010',
    category: 'pantalon_juego',
    price: 54.95,
    stock_total: 70,
    stock_available: 48,
    stock_min: 15,
    size: 'L',
    image_url: ATM_SHOP_IMAGES.awayShort,
    product_url: ATM_STORE_AWAY_SHORT_URL,
  }),
  kitItem({
    id: 'i20',
    name: 'Medias 2ª Equipación 26/27',
    sku: 'IQ6648-010',
    category: 'calcetines',
    price: 24.95,
    stock_total: 90,
    stock_available: 65,
    stock_min: 20,
    size: 'M',
    image_url: ATM_SHOP_IMAGES.awaySock,
    product_url: ATM_STORE_AWAY_MEN_URL,
  }),
  // ——— 3ª equipación hombre ———
  kitItem({
    id: 'i8',
    name: 'Camiseta Match Hombre 3ª Equipación 25/26',
    sku: 'HM3200-407',
    category: 'camiseta_juego',
    price: 149.95,
    stock_total: 40,
    stock_available: 26,
    stock_min: 10,
    size: 'L',
    image_url: ATM_SHOP_IMAGES.thirdMatch,
    product_url: ATM_STORE_THIRD_MEN_URL,
  }),
  kitItem({
    id: 'i9',
    name: 'Camiseta Hombre 3ª Equipación 25/26',
    sku: 'HM3192-407',
    category: 'camiseta_juego',
    price: 99.95,
    stock_total: 50,
    stock_available: 34,
    stock_min: 12,
    size: 'L',
    image_url: ATM_SHOP_IMAGES.thirdReplica,
    product_url: ATM_STORE_THIRD_MEN_URL,
  }),
  kitItem({
    id: 'i10',
    name: 'Pantalón Corto 3ª Equipación 25/26',
    sku: 'IF1452-407',
    category: 'pantalon_juego',
    price: 49.95,
    stock_total: 55,
    stock_available: 38,
    stock_min: 12,
    size: 'L',
    image_url: ATM_SHOP_IMAGES.thirdShort,
    product_url: ATM_STORE_THIRD_MEN_URL,
  }),
  kitItem({
    id: 'i11',
    name: 'Medias 3ª Equipación 25/26',
    sku: 'HM3220-406',
    category: 'calcetines',
    price: 22.95,
    stock_total: 80,
    stock_available: 55,
    stock_min: 20,
    size: 'M',
    image_url: ATM_SHOP_IMAGES.thirdSock,
    product_url: ATM_STORE_THIRD_MEN_URL,
  }),
  // ——— Portero hombre ———
  kitItem({
    id: 'i21',
    name: 'Camiseta Portero Hombre 25/26',
    sku: 'HQ9235-084',
    category: 'camiseta_juego',
    price: 109.95,
    stock_total: 25,
    stock_available: 16,
    stock_min: 6,
    size: 'XL',
    image_url: ATM_SHOP_IMAGES.gkJersey,
    product_url: ATM_STORE_GK_MEN_URL,
  }),
  // ——— Entrenamiento hombre ———
  kitItem({
    id: 'i12',
    name: 'Camiseta Entrenamiento Nike Hombre 26/27',
    sku: 'II2770-702',
    category: 'entrenamiento',
    price: 54.95,
    stock_total: 120,
    stock_available: 88,
    stock_min: 30,
    size: 'L',
    image_url: ATM_SHOP_IMAGES.trainingTee,
    product_url: ATM_STORE_TRAINING_URL,
  }),
  kitItem({
    id: 'i13',
    name: 'Camiseta Away Prematch Hombre Nike 26/27',
    sku: 'ATM-PREMATCH-AWAY-2627',
    category: 'entrenamiento',
    price: 69.95,
    stock_total: 60,
    stock_available: 42,
    stock_min: 15,
    size: 'L',
    image_url: ATM_SHOP_IMAGES.awayReplica,
    product_url: ATM_STORE_TRAINING_URL,
  }),
  kitItem({
    id: 'i14',
    name: 'Sudadera Drill Top Nike Hombre 26/27',
    sku: 'II2666-702',
    category: 'entrenamiento',
    price: 74.95,
    stock_total: 50,
    stock_available: 35,
    stock_min: 12,
    size: 'L',
    image_url: ATM_SHOP_IMAGES.drillTop,
    product_url: ATM_STORE_TRAINING_URL,
  }),
  kitItem({
    id: 'i15',
    name: 'Pantalón Corto Entrenamiento Nike Hombre 26/27',
    sku: 'II2299-702',
    category: 'entrenamiento',
    price: 47.95,
    stock_total: 80,
    stock_available: 55,
    stock_min: 20,
    size: 'L',
    image_url: ATM_SHOP_IMAGES.trainingShort,
    product_url: ATM_STORE_TRAINING_URL,
  }),
  kitItem({
    id: 'i16',
    name: 'Pantalón Entrenamiento Nike Hombre 26/27',
    sku: 'ATM-TRAIN-PANT-2627',
    category: 'entrenamiento',
    price: 74.95,
    stock_total: 45,
    stock_available: 30,
    stock_min: 10,
    size: 'L',
    image_url: ATM_SHOP_IMAGES.trainingShort,
    product_url: ATM_STORE_TRAINING_URL,
  }),
  kitItem({
    id: 'i17',
    name: 'Botas competición (stock genérico hombre)',
    sku: 'ATM-BOOTS-COMP',
    category: 'zapatillas',
    price: 180,
    stock_total: 30,
    stock_available: 12,
    stock_min: 10,
    size: '42',
    image_url: '/clubs/atm/logo.png',
  }),
  kitItem({
    id: 'i18',
    name: 'Botiquín viaje primer equipo',
    sku: 'ATM-MED-KIT',
    category: 'medico',
    price: 250,
    stock_total: 4,
    stock_available: 3,
    stock_min: 2,
    size: '—',
    image_url: '/clubs/atm/logo.png',
  }),
];

export const atmRequests = [
  {
    id: 'r1',
    playerId: 'p19',
    playerName: 'Kang In Lee',
    itemName: 'Camiseta Match Hombre 1ª Equipación 26/27',
    quantity: 2,
    status: 'pendiente',
    priority: 'normal',
    requestDate: '2026-07-26',
    notes: 'Repuesto pretemporada — dorsal 7',
  },
  {
    id: 'r2',
    playerId: 'p22',
    playerName: 'Julián Álvarez',
    itemName: 'Botas competición (stock genérico hombre)',
    quantity: 1,
    status: 'aprobada',
    priority: 'alta',
    requestDate: '2026-07-25',
    notes: 'Talla 42',
  },
];

export const atmTrips = [
  {
    id: 't1',
    destination: 'Strawberry Arena',
    opponent: 'Manchester United',
    departureDate: '2026-07-31',
    returnDate: '2026-08-02',
    status: 'planificado',
    packingList: [
      {
        id: 'tp1',
        itemName: 'Camiseta Match Hombre 1ª Equipación 26/27',
        quantityRequired: 25,
        quantityPacked: 10,
        category: 'camiseta_juego',
        isPacked: false,
      },
      {
        id: 'tp2',
        itemName: 'Botiquín viaje primer equipo',
        quantityRequired: 2,
        quantityPacked: 1,
        category: 'medico',
        isPacked: false,
      },
    ],
    notes: 'Amistoso 1 ago — calendario oficial Atleti',
  },
  {
    id: 't2',
    destination: 'Seoul World Cup Stadium',
    opponent: 'Manchester City',
    departureDate: '2026-08-07',
    returnDate: '2026-08-10',
    status: 'planificado',
    packingList: [
      {
        id: 'tp3',
        itemName: 'Camiseta Match Hombre 2ª Equipación 26/27',
        quantityRequired: 25,
        quantityPacked: 0,
        category: 'camiseta_juego',
        isPacked: false,
      },
    ],
    notes: 'Coupang Play Series — 9 ago',
  },
  {
    id: 't3',
    destination: 'CEPAC Vélodrome',
    opponent: 'Olympique de Marsella',
    departureDate: '2026-08-13',
    returnDate: '2026-08-15',
    status: 'planificado',
    packingList: [
      {
        id: 'tp4',
        itemName: 'Camiseta Match Hombre 1ª Equipación 26/27',
        quantityRequired: 25,
        quantityPacked: 0,
        category: 'camiseta_juego',
        isPacked: false,
      },
    ],
    notes: 'Amistoso 14 ago — Marsella',
  },
];

export const atmAlerts = [
  {
    id: 'a1',
    team_id: ATM_TEAM_ID,
    type: 'stock_bajo',
    severity: 'warning',
    title: 'Stock bajo',
    message: 'Botas competición cerca del mínimo (12 unidades)',
    entity_type: 'inventory_item',
    entity_id: 'i17',
    is_read: false,
    is_dismissed: false,
    auto_generated: true,
    metadata: {},
    created_at: '2026-07-27T08:00:00.000Z',
  },
  {
    id: 'a2',
    team_id: ATM_TEAM_ID,
    type: 'solicitud_pendiente',
    severity: 'info',
    title: 'Solicitud pendiente',
    message: 'Solicitud pendiente — Kang In Lee (camiseta match)',
    entity_type: 'request',
    entity_id: 'r1',
    is_read: false,
    is_dismissed: false,
    auto_generated: true,
    metadata: {},
    created_at: '2026-07-27T09:00:00.000Z',
  },
];

export const atmLaundry = [
  {
    id: 'l1',
    name: 'Lote entrenamiento Ciudad Deportiva',
    itemCount: 38,
    status: 'WASHING',
    receivedDate: '2026-07-26',
    responsible: 'Utillero Primer Equipo',
  },
  {
    id: 'l2',
    name: 'Pretemporada — sesión matinal',
    itemCount: 32,
    status: 'READY',
    receivedDate: '2026-07-25',
    completedDate: '2026-07-26',
    responsible: 'Utillero Primer Equipo',
  },
];
