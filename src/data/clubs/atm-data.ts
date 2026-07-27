/** Pack producción — Atlético de Madrid · Primer Equipo de Fútbol
 * Fuentes oficiales:
 * - https://www.atleticodemadrid.com/equipos/atletico-de-madrid-2025-2026
 * - https://www.atleticodemadrid.com/calendario-completo-primer-equipo/
 * - shop.atleticodemadrid.com (hombre: 1ª / 2ª IR1435-011 · II2031-010 / 3ª / entrenamiento)
 * - https://www.atleticodemadrid.com/patrocinadores
 * - https://www.atleticodemadrid.com/noticias-nuevo-estadio
 * Fotos jugadores (ref.): https://www.laliga.com/clubes/atletico-de-madrid/plantilla
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

const defaultSizes = {
  L: { jersey: 'L', shorts: 'L', shoes: '44', socks: 'M', warmupShirt: 'L' },
  XL: { jersey: 'XL', shorts: 'L', shoes: '45', socks: 'L', warmupShirt: 'XL' },
  XXL: { jersey: 'XXL', shorts: 'XL', shoes: '46', socks: 'XL', warmupShirt: 'XXL' },
  M: { jersey: 'M', shorts: 'M', shoes: '42', socks: 'M', warmupShirt: 'M' },
};

function playerUrl(slug: string) {
  return `https://www.atleticodemadrid.com/jugadores/${slug}`;
}

/** Ref. fotos LALIGA EA SPORTS 26/27 (solo assets, no sync de plantilla)
 * https://www.laliga.com/clubes/atletico-de-madrid/plantilla
 * Patrón: assets.laliga.com/squad/2026/t175/{optaId}/512x556/{optaId}_t175_2026_0_001_000.png
 */
const laligaPhoto = (optaId: string) =>
  `https://assets.laliga.com/squad/2026/t175/${optaId}/512x556/${optaId}_t175_2026_0_001_000.png`;

/** Fallback club (jugadores no listados en plantilla LALIGA 26/27) */
const clubPhoto = (path: string) =>
  `https://img-estaticos.atleticodemadrid.com/system/foto_listados/${path}`;

const ATM_PLAYER_PHOTOS: Record<string, string> = {
  'juan-agustin-musso-2025-2026': laligaPhoto('p121537'),
  'jan-oblak-2025-2026': laligaPhoto('p81352'),
  'jose-maria-gimenez-de-vargas-2025-2026': laligaPhoto('p151883'),
  'matteo-ruggeri-2025-2026': laligaPhoto('p487992'),
  'clement-nicolas-laurent-lenglet-2025-2026': '/clubs/atm/players/lenglet.png',
  'nahuel-molina-lucero-2025-2026': laligaPhoto('p221586'),
  'david-hancko-2025-2026': laligaPhoto('p235093'),
  'marc-pubill-pages-2025-2026': laligaPhoto('p562720'),
  'robin-aime-robert-le-normand-2025-2026': laligaPhoto('p224919'),
  'rodrigo-mendoza-martinez-moya-2025-2026': laligaPhoto('p578538'),
  'jo-o-lucas-de-souza-cardoso-2025-2026': laligaPhoto('p488662'),
  'jorge-resurreccion-merodio-2025-2026': '/clubs/atm/players/koke.png',
  'pablo-barrios-rivas-2025-2026': laligaPhoto('p503523'),
  'alejandro-baena-rodriguez-2025-2026': laligaPhoto('p248501'),
  'marcos-llorente-moreno-2025-2026': laligaPhoto('p192364'),
  'giuliano-simeone-baldini-2025-2026': laligaPhoto('p482652'),
  'obed-gomez-vargas-2025-2026': laligaPhoto('p502868'),
  'nicolas-ivan-gonzalez-2025-2026':
    clubPhoto('19397/thumb_300x400/23_NICO.jpg?1757006316'),
  'antoine-griezmann-2025-2026':
    clubPhoto('18077/thumb_300x400/DORSALES_WEB_7_GRIEZMANN.jpg?1750111755'),
  'alexander-s-rloth-2025-2026': laligaPhoto('p143877'),
  'thiago-ezequiel-almada-2025-2026': laligaPhoto('p461360'),
  'julian-alvarez-2025-2026': laligaPhoto('p461358'),
  'ademola-olajade-alade-aylola-lookman-2025-2026': laligaPhoto('p219352'),
  'morten-hjulmand-2025-2026': '/clubs/atm/players/hjulmand.png',
  'kang-in-lee-ficha-por-el-atletico-de-madrid': '/clubs/atm/players/kang-in-lee.png',
};

function resolvePlayerPhoto(profileUrl: string, fallback: string) {
  const slug = profileUrl.split('/').pop() || '';
  return ATM_PLAYER_PHOTOS[slug] || fallback;
}

function mk(p: DemoPlayer) {
  return {
    ...p,
    imageUrl: resolvePlayerPhoto(p.profile_url, p.imageUrl),
    status: 'ACTIVE' as const,
    birth_place: '—',
    matches_played: 0,
    points: 0,
    rebounds: 0,
    assists: 0,
    palmares: ['Atlético de Madrid — Primer Equipo 25/26'],
  };
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
    imageUrl: '/clubs/atm/players/lenglet.png',
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
    imageUrl: '/clubs/atm/players/koke.png',
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
    imageUrl: '/clubs/atm/players/hjulmand.png',
    profile_url: playerUrl('morten-hjulmand-2025-2026'),
    sizes: defaultSizes.L,
  }),
  // Delanteros
  mk({
    id: 'p19',
    firstName: 'Kang-in',
    lastName: 'Lee',
    number: 7,
    position: 'centrocampista',
    nationality: 'Corea del Sur',
    birthDate: '2001-02-19',
    imageUrl: '/clubs/atm/players/kang-in-lee.png',
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

/** Cuerpo técnico primer equipo masculino — Cholo + asistentes + PF + porteros
 * Fuentes: club / Wikipedia / Transfermarkt
 * Asistentes: Bonvicini + Gabi. PF: Óscar Pitillas. Porteros: Vercellone.
 */
const TM_STAFF =
  'https://img.a.transfermarkt.technology/portrait/header';

export const atmCoachingStaff = [
  {
    id: 'c1',
    full_name: 'Diego Pablo Simeone',
    role: 'Entrenador principal',
    email: 'dsimeone@atleticodemadrid.com',
    shirt_size: 'L',
    shorts_size: 'L',
    shoe_size: 43,
    nationality: 'Argentina',
    birth_date: '1970-04-28',
    birth_place: 'Buenos Aires, Argentina',
    photo_url: `${TM_STAFF}/2868-1666861792.jpg?lm=1`,
    profile_url: 'https://www.transfermarkt.es/diego-simeone/profil/trainer/2066',
    trajectory:
      'Dirige al Atlético de Madrid desde el 23 de diciembre de 2011. Exfutbolista argentino nacionalizado español; consolidó al club en la élite europea.',
  },
  {
    id: 'c2',
    full_name: 'Hernán Bonvicini',
    role: 'Entrenador asistente',
    email: 'hbonvicini@atleticodemadrid.com',
    shirt_size: 'L',
    shorts_size: 'L',
    shoe_size: 43,
    nationality: 'Argentina',
    birth_date: '1979-05-17',
    birth_place: 'La Plata, Argentina',
    photo_url: '/clubs/atm/staff/bonvicini.png?v=2',
    profile_url: 'https://www.transfermarkt.es/atletico-de-madrid/mitarbeiter/verein/13',
    trajectory:
      'Hernán Alejandro Bonvicini — entrenador asistente del primer equipo del Club Atlético de Madrid S.A.D. Nacido en La Plata el 17/05/1979.',
  },
  {
    id: 'c3',
    full_name: 'Gabi Fernández',
    role: 'Entrenador asistente',
    email: 'gabi@atleticodemadrid.com',
    shirt_size: 'L',
    shorts_size: 'L',
    shoe_size: 43,
    nationality: 'España',
    birth_date: '1983-07-10',
    birth_place: 'Madrid, España',
    photo_url: `${TM_STAFF}/97091-1732139341.JPG?lm=1`,
    profile_url: 'https://www.transfermarkt.es/gabi/profil/spieler/97091',
    trajectory:
      'Gabriel Luis Fernández Arenas, conocido como Gabi. Excentrocampista (nº 14 Atlético de Madrid / Al-Sadd). Entrenador asistente del Atlético desde la temporada 2026-27; antes director técnico del Real Zaragoza (2025). Nacido en Madrid el 10/07/1983. Estatura 1,80 m.',
  },
  {
    id: 'c4',
    full_name: 'Óscar Pitillas',
    role: 'Preparador físico',
    email: 'opitillas@atleticodemadrid.com',
    shirt_size: 'L',
    shorts_size: 'L',
    shoe_size: 43,
    nationality: 'España',
    birth_date: '1971-01-16',
    birth_place: 'Valencia, España',
    photo_url: '/clubs/atm/staff/pitillas.png',
    profile_url: 'https://www.transfermarkt.es/oscar-pitillas/profil/trainer/16403',
    trajectory:
      'Óscar Miguel Pitillas Torra — preparador físico del Atlético de Madrid (temporada 2025/26). Nacido en Valencia el 16/01/1971. En el club desde 2016 (antes 2003–2014 y NYCFC 2014–2016). Exatleta olímpico (400 m vallas).',
  },
  {
    id: 'c5',
    full_name: 'Pablo Vercellone',
    role: 'Entrenador de porteros',
    email: 'pvercellone@atleticodemadrid.com',
    shirt_size: 'L',
    shorts_size: 'L',
    shoe_size: 43,
    nationality: 'Argentina',
    birth_date: '1968-04-24',
    birth_place: 'Buenos Aires, Argentina',
    photo_url: '/clubs/atm/staff/vercellone.png',
    profile_url: 'https://www.transfermarkt.es/pablo-vercellone/profil/trainer/11448',
    trajectory:
      'Pablo Ignacio Vercellone — entrenador de porteros del Atlético de Madrid. Nacido en Buenos Aires el 24/04/1968. Contrato hasta 30/06/2027.',
  },
];

/** Material médico LaLiga — mismo esquema operativo que RMF */
export const atmMedical = [
  {
    id: 'am1',
    name: 'Vendas elásticas (partido)',
    quantity: 40,
    minQuantity: 15,
    expiryDate: '2028-12-31',
    batchNumber: 'ATM-B-01',
    status: 'OK',
    location: 'Botiquín Fisioterapia',
    kit: 'Fisioterapia',
    team_id: ATM_TEAM_ID,
    category: 'material_cura',
    brand: 'Mueller',
    reference: 'ATM-T-01',
    unit_cost: 4.5,
    is_active: true,
  },
  {
    id: 'am2',
    name: 'Spray frío / hielo químico',
    quantity: 10,
    minQuantity: 8,
    expiryDate: '2027-08-15',
    batchNumber: 'ATM-B-02',
    status: 'OK',
    location: 'Nevera Vestuario',
    kit: 'Vestuario Principal',
    team_id: ATM_TEAM_ID,
    category: 'fármaco',
    brand: 'Biofreeze',
    reference: 'ATM-S-01',
    unit_cost: 8,
    is_active: true,
  },
  {
    id: 'am3',
    name: 'Geles antiinflamatorios (Voltaren)',
    quantity: 12,
    minQuantity: 5,
    expiryDate: '2027-05-10',
    batchNumber: 'ATM-B-03',
    status: 'OK',
    location: 'Armario Médico',
    kit: 'Armario Central',
    team_id: ATM_TEAM_ID,
    category: 'fármaco',
    brand: 'Voltaren',
    reference: 'ATM-G-22',
    unit_cost: 12,
    is_active: true,
    prescription_required: true,
  },
  {
    id: 'am4',
    name: 'Botiquín partido LaLiga',
    quantity: 3,
    minQuantity: 2,
    expiryDate: '2027-06-30',
    batchNumber: 'ATM-B-04',
    status: 'OK',
    location: 'Vestuario — Banquillo',
    kit: 'Botiquín Partido',
    team_id: ATM_TEAM_ID,
    category: 'botiquin',
    brand: 'ATM Medical',
    reference: 'BQ-LL-ATM',
    unit_cost: 260,
    is_active: true,
  },
  {
    id: 'am5',
    name: 'Botiquín viaje Champions / Europa',
    quantity: 2,
    minQuantity: 2,
    expiryDate: '2027-03-15',
    batchNumber: 'ATM-B-05',
    status: 'OK',
    location: 'Almacén Logística',
    kit: 'Botiquín Viaje',
    team_id: ATM_TEAM_ID,
    category: 'botiquin',
    brand: 'ATM Medical',
    reference: 'BQ-CH-ATM',
    unit_cost: 320,
    is_active: true,
  },
  {
    id: 'am6',
    name: 'Vendaje cohesivo (Coban)',
    quantity: 36,
    minQuantity: 12,
    expiryDate: '2029-01-01',
    batchNumber: 'ATM-B-06',
    status: 'OK',
    location: 'Botiquín Fisioterapia',
    kit: 'Fisioterapia',
    team_id: ATM_TEAM_ID,
    category: 'material_cura',
    brand: '3M',
    reference: 'ATM-CB-10',
    unit_cost: 3.2,
    is_active: true,
  },
  {
    id: 'am7',
    name: 'Gasas estériles 10x10',
    quantity: 20,
    minQuantity: 10,
    expiryDate: '2028-08-20',
    batchNumber: 'ATM-B-07',
    status: 'OK',
    location: 'Armario Médico',
    kit: 'Armario Central',
    team_id: ATM_TEAM_ID,
    category: 'material_cura',
    brand: 'Hartmann',
    reference: 'ATM-GS',
    unit_cost: 18,
    is_active: true,
  },
  {
    id: 'am8',
    name: 'Suero fisiológico 0,9% (500ml)',
    quantity: 10,
    minQuantity: 8,
    expiryDate: '2026-11-30',
    batchNumber: 'ATM-B-08',
    status: 'EXPIRING_SOON',
    location: 'Nevera Vestuario',
    kit: 'Vestuario Principal',
    team_id: ATM_TEAM_ID,
    category: 'suero',
    brand: 'B Braun',
    reference: 'ATM-SF-500',
    unit_cost: 2.5,
    is_active: true,
  },
  {
    id: 'am9',
    name: 'Paracetamol 1g',
    quantity: 8,
    minQuantity: 6,
    expiryDate: '2027-02-28',
    batchNumber: 'ATM-B-09',
    status: 'OK',
    location: 'Armario Médico',
    kit: 'Armario Central',
    team_id: ATM_TEAM_ID,
    category: 'fármaco',
    brand: 'Cinfa',
    reference: 'ATM-PC',
    unit_cost: 6,
    is_active: true,
    prescription_required: true,
  },
  {
    id: 'am10',
    name: 'Ibuprofeno 600mg',
    quantity: 6,
    minQuantity: 4,
    expiryDate: '2027-04-15',
    batchNumber: 'ATM-B-10',
    status: 'OK',
    location: 'Armario Médico',
    kit: 'Armario Central',
    team_id: ATM_TEAM_ID,
    category: 'fármaco',
    brand: 'Kern',
    reference: 'ATM-IB',
    unit_cost: 7.5,
    is_active: true,
    prescription_required: true,
  },
  {
    id: 'am11',
    name: 'Esparadrapo hipoalergénico',
    quantity: 18,
    minQuantity: 8,
    expiryDate: '2028-05-01',
    batchNumber: 'ATM-B-11',
    status: 'OK',
    location: 'Botiquín Fisioterapia',
    kit: 'Fisioterapia',
    team_id: ATM_TEAM_ID,
    category: 'material_cura',
    brand: 'Urgo',
    reference: 'ATM-ESP',
    unit_cost: 5,
    is_active: true,
  },
  {
    id: 'am12',
    name: 'Bolsas de hielo',
    quantity: 50,
    minQuantity: 25,
    expiryDate: '2027-12-31',
    batchNumber: 'ATM-B-12',
    status: 'OK',
    location: 'Nevera Vestuario',
    kit: 'Vestuario Principal',
    team_id: ATM_TEAM_ID,
    category: 'crioterapia',
    brand: 'Instant Ice',
    reference: 'ATM-HI',
    unit_cost: 1.2,
    is_active: true,
  },
  {
    id: 'am13',
    name: 'Desinfectante clorhexidina 500ml',
    quantity: 6,
    minQuantity: 4,
    expiryDate: '2026-09-30',
    batchNumber: 'ATM-B-13',
    status: 'EXPIRING_SOON',
    location: 'Botiquín Fisioterapia',
    kit: 'Fisioterapia',
    team_id: ATM_TEAM_ID,
    category: 'desinfección',
    brand: 'Betadine',
    reference: 'ATM-DS',
    unit_cost: 9,
    is_active: true,
  },
  {
    id: 'am14',
    name: 'Kit RCP + guantes',
    quantity: 4,
    minQuantity: 2,
    expiryDate: '2028-01-01',
    batchNumber: 'ATM-B-14',
    status: 'OK',
    location: 'Botiquín Partido',
    kit: 'Botiquín Partido',
    team_id: ATM_TEAM_ID,
    category: 'emergencia',
    brand: 'Laerdal',
    reference: 'ATM-RCP',
    unit_cost: 45,
    is_active: true,
  },
  {
    id: 'am15',
    name: 'Electrodos TENS / EMS (Pack 4)',
    quantity: 12,
    minQuantity: 6,
    expiryDate: '2027-08-01',
    batchNumber: 'ATM-B-15',
    status: 'OK',
    location: 'Sala Fisioterapia',
    kit: 'Fisioterapia',
    team_id: ATM_TEAM_ID,
    category: 'electroterapia',
    brand: 'Compex',
    reference: 'ATM-TENS',
    unit_cost: 22,
    is_active: true,
  },
];

const LOC_KIT = 'Ciudad Deportiva — Almacén Equipaciones Hombre';
const LOC_EST1 = 'Ciudad Deportiva — Est. 1 Equipación';
const LOC_EST2 = 'Ciudad Deportiva — Est. 2 Entrenamiento';
const LOC_VEST = 'Vestuario Metropolitano — Banquillo';
const LOC_GK = 'Ciudad Deportiva — Almacén Porteros';
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
  location?: string;
  brand?: string;
}) {
  return {
    ...p,
    brand: p.brand || 'Nike',
    location: p.location || LOC_KIT,
    qr_code: p.sku,
    unit_cost: p.price,
    is_active: true,
    updated_at: nowIso(),
    gender: 'masculino' as const,
    source: p.product_url || STORE,
  };
}

/** Expande un producto a tallas (estilo almacén RMB: 1 línea por talla/SKU). */
function expandBySize(
  base: {
    idPrefix: string;
    name: string;
    skuBase: string;
    category: string;
    price: number;
    image_url: string;
    product_url?: string;
    location?: string;
    brand?: string;
  },
  rows: { size: string; available: number; total: number; min: number }[],
  startId: number
): ReturnType<typeof kitItem>[] {
  return rows.map((r, idx) =>
    kitItem({
      id: `i${startId + idx}`,
      name: base.name,
      sku: `${base.skuBase}-${r.size}`,
      category: base.category,
      price: base.price,
      stock_total: r.total,
      stock_available: r.available,
      stock_min: r.min,
      size: r.size,
      image_url: base.image_url,
      product_url: base.product_url,
      location: base.location,
      brand: base.brand,
    })
  );
}

/** Distribución típica utilería (totales desde export almacén ATM 2026-07-27). */
const SZ = {
  kit54: [
    { size: 'S', available: 6, total: 8, min: 2 },
    { size: 'M', available: 12, total: 16, min: 4 },
    { size: 'L', available: 20, total: 30, min: 8 },
    { size: 'XL', available: 12, total: 18, min: 4 },
    { size: 'XXL', available: 4, total: 8, min: 2 },
  ],
  kit72: [
    { size: 'S', available: 8, total: 12, min: 3 },
    { size: 'M', available: 16, total: 22, min: 5 },
    { size: 'L', available: 26, total: 36, min: 10 },
    { size: 'XL', available: 16, total: 22, min: 5 },
    { size: 'XXL', available: 6, total: 8, min: 2 },
  ],
  kit40: [
    { size: 'S', available: 4, total: 6, min: 1 },
    { size: 'M', available: 8, total: 12, min: 3 },
    { size: 'L', available: 16, total: 22, min: 5 },
    { size: 'XL', available: 8, total: 12, min: 3 },
    { size: 'XXL', available: 4, total: 8, min: 2 },
  ],
  kit60: [
    { size: 'S', available: 6, total: 10, min: 2 },
    { size: 'M', available: 14, total: 20, min: 4 },
    { size: 'L', available: 22, total: 32, min: 8 },
    { size: 'XL', available: 12, total: 18, min: 4 },
    { size: 'XXL', available: 6, total: 10, min: 2 },
  ],
  socks90: [
    { size: 'S', available: 18, total: 24, min: 6 },
    { size: 'M', available: 40, total: 54, min: 12 },
    { size: 'L', available: 32, total: 42, min: 12 },
  ],
  socks65: [
    { size: 'S', available: 12, total: 16, min: 4 },
    { size: 'M', available: 28, total: 38, min: 8 },
    { size: 'L', available: 25, total: 36, min: 8 },
  ],
  train88: [
    { size: 'S', available: 10, total: 14, min: 3 },
    { size: 'M', available: 20, total: 28, min: 6 },
    { size: 'L', available: 32, total: 44, min: 12 },
    { size: 'XL', available: 18, total: 24, min: 6 },
    { size: 'XXL', available: 8, total: 10, min: 3 },
  ],
};

/**
 * Inventario utilería ATM — hombre / masculino
 * Estructura tipo RM: 1 fila por talla (SKU-talla), fotos tienda oficial, sin botas genéricas.
 * Stocks alineados con export almacén_atm_2026-07-27 (+ accesorios estilo RMF).
 */
let _invId = 1;
const nextId = () => {
  const n = _invId;
  _invId += 1;
  return n;
};

export const atmInventory = [
  ...expandBySize(
    {
      idPrefix: 'home-match',
      name: 'Camiseta Match Hombre 1ª Equipación 26/27',
      skuBase: 'II2740-101',
      category: 'camiseta_juego',
      price: 159.95,
      image_url: ATM_SHOP_IMAGES.homeMatch,
      product_url: ATM_STORE_HOME_URL,
      location: LOC_EST1,
    },
    SZ.kit54,
    nextId()
  ),
  ...(() => {
    _invId += 4;
    return [];
  })(),
  ...expandBySize(
    {
      idPrefix: 'home-replica',
      name: 'Camiseta Hombre 1ª Equipación 26/27',
      skuBase: 'II1893-101',
      category: 'camiseta_juego',
      price: 109.95,
      image_url: ATM_SHOP_IMAGES.homeReplica,
      product_url: ATM_STORE_HOME_URL,
      location: LOC_EST1,
    },
    SZ.kit72,
    (_invId = 6) && 6
  ),
  ...(() => {
    _invId = 11;
    return expandBySize(
      {
        idPrefix: 'home-ls',
        name: 'Camiseta Manga Larga Hombre 1ª Equipación 26/27',
        skuBase: 'IQ6643-101',
        category: 'camiseta_juego',
        price: 119.95,
        image_url: ATM_SHOP_IMAGES.homeLongSleeve,
        product_url: ATM_STORE_HOME_LS_URL,
        location: LOC_EST1,
      },
      SZ.kit40,
      11
    );
  })(),
  ...(() => {
    _invId = 16;
    return expandBySize(
      {
        idPrefix: 'home-short',
        name: 'Pantalón Corto 1ª Equipación 26/27',
        skuBase: 'II1977-455',
        category: 'pantalon_juego',
        price: 54.95,
        image_url: ATM_SHOP_IMAGES.homeShort,
        product_url: ATM_STORE_HOME_URL,
        location: LOC_EST1,
      },
      SZ.kit60,
      16
    );
  })(),
  ...(() => {
    _invId = 21;
    return expandBySize(
      {
        idPrefix: 'home-sock',
        name: 'Medias 1ª Equipación 26/27',
        skuBase: 'IQ6645-455',
        category: 'calcetines',
        price: 24.95,
        image_url: ATM_SHOP_IMAGES.homeSock,
        product_url: ATM_STORE_HOME_URL,
        location: LOC_KIT,
      },
      SZ.socks90,
      21
    );
  })(),
  ...(() => {
    _invId = 24;
    return expandBySize(
      {
        idPrefix: 'away-match',
        name: 'Camiseta Match Hombre 2ª Equipación 26/27',
        skuBase: 'IR1435-011',
        category: 'camiseta_juego',
        price: 159.95,
        image_url: ATM_SHOP_IMAGES.awayMatch,
        product_url: ATM_STORE_AWAY_MATCH_URL,
        location: LOC_EST1,
      },
      SZ.kit40,
      24
    );
  })(),
  ...(() => {
    _invId = 29;
    return expandBySize(
      {
        idPrefix: 'away-replica',
        name: 'Camiseta Hombre 2ª Equipación 26/27',
        skuBase: 'II1932-011',
        category: 'camiseta_juego',
        price: 109.95,
        image_url: ATM_SHOP_IMAGES.awayReplica,
        product_url: ATM_STORE_AWAY_MEN_URL,
        location: LOC_EST1,
      },
      SZ.kit40,
      29
    );
  })(),
  ...(() => {
    _invId = 34;
    return expandBySize(
      {
        idPrefix: 'away-short',
        name: 'Pantalón Corto 2ª Equipación 26/27',
        skuBase: 'II2031-010',
        category: 'pantalon_juego',
        price: 54.95,
        image_url: ATM_SHOP_IMAGES.awayShort,
        product_url: ATM_STORE_AWAY_SHORT_URL,
        location: LOC_EST1,
      },
      [
        { size: 'S', available: 5, total: 8, min: 2 },
        { size: 'M', available: 10, total: 14, min: 3 },
        { size: 'L', available: 18, total: 26, min: 6 },
        { size: 'XL', available: 10, total: 14, min: 3 },
        { size: 'XXL', available: 5, total: 8, min: 1 },
      ],
      34
    );
  })(),
  ...(() => {
    _invId = 39;
    return expandBySize(
      {
        idPrefix: 'away-sock',
        name: 'Medias 2ª Equipación 26/27',
        skuBase: 'IQ6648-010',
        category: 'calcetines',
        price: 24.95,
        image_url: ATM_SHOP_IMAGES.awaySock,
        product_url: ATM_STORE_AWAY_MEN_URL,
        location: LOC_KIT,
      },
      SZ.socks65,
      39
    );
  })(),
  ...(() => {
    _invId = 42;
    return expandBySize(
      {
        idPrefix: 'third-match',
        name: 'Camiseta Match Hombre 3ª Equipación 25/26',
        skuBase: 'HM3200-407',
        category: 'camiseta_juego',
        price: 149.95,
        image_url: ATM_SHOP_IMAGES.thirdMatch,
        product_url: ATM_STORE_THIRD_MEN_URL,
        location: LOC_EST1,
      },
      [
        { size: 'S', available: 3, total: 5, min: 1 },
        { size: 'M', available: 6, total: 8, min: 2 },
        { size: 'L', available: 10, total: 16, min: 4 },
        { size: 'XL', available: 5, total: 8, min: 2 },
        { size: 'XXL', available: 2, total: 3, min: 1 },
      ],
      42
    );
  })(),
  ...(() => {
    _invId = 47;
    return expandBySize(
      {
        idPrefix: 'third-replica',
        name: 'Camiseta Hombre 3ª Equipación 25/26',
        skuBase: 'HM3192-407',
        category: 'camiseta_juego',
        price: 99.95,
        image_url: ATM_SHOP_IMAGES.thirdReplica,
        product_url: ATM_STORE_THIRD_MEN_URL,
        location: LOC_EST1,
      },
      [
        { size: 'S', available: 4, total: 6, min: 1 },
        { size: 'M', available: 8, total: 12, min: 3 },
        { size: 'L', available: 12, total: 18, min: 4 },
        { size: 'XL', available: 7, total: 10, min: 2 },
        { size: 'XXL', available: 3, total: 4, min: 1 },
      ],
      47
    );
  })(),
  ...(() => {
    _invId = 52;
    return expandBySize(
      {
        idPrefix: 'third-short',
        name: 'Pantalón Corto 3ª Equipación 25/26',
        skuBase: 'IF1452-407',
        category: 'pantalon_juego',
        price: 49.95,
        image_url: ATM_SHOP_IMAGES.thirdShort,
        product_url: ATM_STORE_THIRD_MEN_URL,
        location: LOC_EST1,
      },
      [
        { size: 'S', available: 4, total: 6, min: 1 },
        { size: 'M', available: 8, total: 12, min: 3 },
        { size: 'L', available: 14, total: 20, min: 4 },
        { size: 'XL', available: 8, total: 12, min: 3 },
        { size: 'XXL', available: 4, total: 5, min: 1 },
      ],
      52
    );
  })(),
  ...(() => {
    _invId = 57;
    return expandBySize(
      {
        idPrefix: 'third-sock',
        name: 'Medias 3ª Equipación 25/26',
        skuBase: 'HM3220-406',
        category: 'calcetines',
        price: 22.95,
        image_url: ATM_SHOP_IMAGES.thirdSock,
        product_url: ATM_STORE_THIRD_MEN_URL,
        location: LOC_KIT,
      },
      [
        { size: 'S', available: 10, total: 14, min: 4 },
        { size: 'M', available: 25, total: 36, min: 8 },
        { size: 'L', available: 20, total: 30, min: 8 },
      ],
      57
    );
  })(),
  ...(() => {
    _invId = 60;
    return expandBySize(
      {
        idPrefix: 'gk',
        name: 'Camiseta Portero Hombre 25/26',
        skuBase: 'HQ9235-084',
        category: 'camiseta_juego',
        price: 109.95,
        image_url: ATM_SHOP_IMAGES.gkJersey,
        product_url: ATM_STORE_GK_MEN_URL,
        location: LOC_GK,
      },
      [
        { size: 'L', available: 4, total: 6, min: 2 },
        { size: 'XL', available: 8, total: 12, min: 3 },
        { size: 'XXL', available: 4, total: 7, min: 1 },
      ],
      60
    );
  })(),
  ...(() => {
    _invId = 63;
    return expandBySize(
      {
        idPrefix: 'train-tee',
        name: 'Camiseta Entrenamiento Nike Hombre 26/27',
        skuBase: 'II2770-702',
        category: 'entrenamiento',
        price: 54.95,
        image_url: ATM_SHOP_IMAGES.trainingTee,
        product_url: ATM_STORE_TRAINING_URL,
        location: LOC_EST2,
      },
      SZ.train88,
      63
    );
  })(),
  ...(() => {
    _invId = 68;
    return expandBySize(
      {
        idPrefix: 'prematch',
        name: 'Camiseta Away Prematch Hombre Nike 26/27',
        skuBase: 'ATM-PREMATCH-AWAY',
        category: 'entrenamiento',
        price: 69.95,
        image_url: ATM_SHOP_IMAGES.awayReplica,
        product_url: ATM_STORE_TRAINING_URL,
        location: LOC_EST2,
      },
      [
        { size: 'S', available: 4, total: 6, min: 1 },
        { size: 'M', available: 10, total: 14, min: 3 },
        { size: 'L', available: 16, total: 22, min: 6 },
        { size: 'XL', available: 8, total: 12, min: 3 },
        { size: 'XXL', available: 4, total: 6, min: 2 },
      ],
      68
    );
  })(),
  ...(() => {
    _invId = 73;
    return expandBySize(
      {
        idPrefix: 'drill',
        name: 'Sudadera Drill Top Nike Hombre 26/27',
        skuBase: 'II2666-702',
        category: 'entrenamiento',
        price: 74.95,
        image_url: ATM_SHOP_IMAGES.drillTop,
        product_url: ATM_STORE_TRAINING_URL,
        location: LOC_EST2,
      },
      [
        { size: 'S', available: 4, total: 6, min: 1 },
        { size: 'M', available: 8, total: 12, min: 3 },
        { size: 'L', available: 12, total: 18, min: 4 },
        { size: 'XL', available: 7, total: 10, min: 2 },
        { size: 'XXL', available: 4, total: 4, min: 2 },
      ],
      73
    );
  })(),
  ...(() => {
    _invId = 78;
    return expandBySize(
      {
        idPrefix: 'train-short',
        name: 'Pantalón Corto Entrenamiento Nike Hombre 26/27',
        skuBase: 'II2299-702',
        category: 'entrenamiento',
        price: 47.95,
        image_url: ATM_SHOP_IMAGES.trainingShort,
        product_url: ATM_STORE_TRAINING_URL,
        location: LOC_EST2,
      },
      [
        { size: 'S', available: 6, total: 8, min: 2 },
        { size: 'M', available: 12, total: 18, min: 4 },
        { size: 'L', available: 20, total: 28, min: 6 },
        { size: 'XL', available: 12, total: 18, min: 4 },
        { size: 'XXL', available: 5, total: 8, min: 2 },
      ],
      78
    );
  })(),
  ...(() => {
    _invId = 83;
    return expandBySize(
      {
        idPrefix: 'train-pant',
        name: 'Pantalón Entrenamiento Nike Hombre 26/27',
        skuBase: 'ATM-TRAIN-PANT',
        category: 'entrenamiento',
        price: 74.95,
        image_url: ATM_SHOP_IMAGES.trainingShort,
        product_url: ATM_STORE_TRAINING_URL,
        location: LOC_EST2,
      },
      [
        { size: 'S', available: 3, total: 5, min: 1 },
        { size: 'M', available: 7, total: 10, min: 2 },
        { size: 'L', available: 12, total: 18, min: 4 },
        { size: 'XL', available: 5, total: 8, min: 2 },
        { size: 'XXL', available: 3, total: 4, min: 1 },
      ],
      83
    );
  })(),
  // Accesorios estilo RMF (sin botas genéricas)
  kitItem({
    id: 'i88',
    name: 'Espinilleras Oficiales Nike',
    sku: 'ATM-SHIN-M',
    category: 'accesorios',
    price: 35,
    stock_total: 50,
    stock_available: 36,
    stock_min: 12,
    size: 'M',
    image_url: '/clubs/atm/logo.png',
    location: LOC_KIT,
    brand: 'Nike',
  }),
  kitItem({
    id: 'i89',
    name: 'Espinilleras Oficiales Nike',
    sku: 'ATM-SHIN-L',
    category: 'accesorios',
    price: 35,
    stock_total: 40,
    stock_available: 28,
    stock_min: 10,
    size: 'L',
    image_url: '/clubs/atm/logo.png',
    location: LOC_KIT,
    brand: 'Nike',
  }),
  kitItem({
    id: 'i90',
    name: 'Guantes Portero Nike Match',
    sku: 'ATM-GK-GLOVE-9',
    category: 'accesorios',
    price: 89.95,
    stock_total: 12,
    stock_available: 8,
    stock_min: 3,
    size: '9',
    image_url: ATM_SHOP_IMAGES.gkJersey,
    location: LOC_GK,
    brand: 'Nike',
  }),
  kitItem({
    id: 'i91',
    name: 'Guantes Portero Nike Match',
    sku: 'ATM-GK-GLOVE-10',
    category: 'accesorios',
    price: 89.95,
    stock_total: 12,
    stock_available: 7,
    stock_min: 3,
    size: '10',
    image_url: ATM_SHOP_IMAGES.gkJersey,
    location: LOC_GK,
    brand: 'Nike',
  }),
  kitItem({
    id: 'i92',
    name: 'Botiquín viaje Champions / LaLiga',
    sku: 'ATM-MED-KIT',
    category: 'medico',
    price: 250,
    stock_total: 4,
    stock_available: 3,
    stock_min: 2,
    size: '—',
    image_url: '/images/botiquin.svg',
    location: LOC_VEST,
    brand: 'ATM Medical',
  }),
];

export const atmRequests = [
  {
    id: 'r1',
    playerId: 'p19',
    playerName: 'Kang-in Lee',
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
    itemName: 'Camiseta Match Hombre 2ª Equipación 26/27',
    quantity: 1,
    status: 'aprobada',
    priority: 'alta',
    requestDate: '2026-07-25',
    notes: 'Talla M — pretemporada',
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
    message: 'Botiquín viaje primer equipo cerca del mínimo (3 unidades)',
    entity_type: 'inventory_item',
    entity_id: 'i92',
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
    message: 'Solicitud pendiente — Kang-in Lee (camiseta match)',
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
