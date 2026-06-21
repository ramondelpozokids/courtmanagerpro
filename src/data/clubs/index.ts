import type { ClubDemoPack, ClubSlug } from '@/data/clubs/types';
import {
  initialPlayers,
  initialInventory,
  initialRequests,
  initialTrips,
  initialLaundry,
  initialAlerts,
} from '@/infrastructure/supabase/repositories/InMemoryDB';
import { CLUB_TEAM_IDS } from '@/lib/club-team-ids';
import { fcbPlayers, fcbInventory, fcbRequests, fcbTrips, fcbAlerts, fcbLaundry } from '@/data/clubs/fcb-data';
import { vbcPlayers, vbcInventory, vbcRequests, vbcTrips, vbcAlerts, vbcLaundry } from '@/data/clubs/vbc-data';

const rmbPack: ClubDemoPack = {
  branding: {
    slug: 'rmb',
    teamId: CLUB_TEAM_IDS.rmb,
    name: 'Real Madrid Baloncesto',
    shortName: 'RMB',
    tagline: 'Sede Social Real Madrid',
    venue: 'WiZink Center · Madrid',
    primaryColor: '#FFFFFF',
    secondaryColor: '#FEBE10',
    accentColor: '#EA580C',
    logoUrl: '/clubs/rmb/logo.png',
    heroUrl: '/clubs/rmb/hero.png',
    blogHeroUrl: 'https://assets.realmadrid.com/is/image/realmadrid/ND-COPAS-DE-EUROPA_SALA-DE-JUNTAS_HE02434?$Desktop$&fit=wrap&wid=1440',
  },
  blog: {
    portalTitle: 'RMB Portal: Noticias, Historia e Indumentaria',
    portalSubtitle: 'Ficha editorial, historia de la década y colección técnica oficial del Real Madrid Baloncesto.',
    historyTitle: 'Algo de Historia — La Década Dorada (2021-2030)',
    historySubtitle: 'Un repaso exclusivo por las hazañas del Real Madrid Baloncesto en competiciones ACB y Euroliga.',
    historyIntro: [
      'El **21 de mayo de 2023**, el Real Madrid conquistó la **Undécima Copa de Europa** en Kaunas tras derrotar al Olympiacos (78-79) con una canasta para la historia de **Sergio Llull** a falta de tres segundos.',
      'En esta década dorada también se han cosechado grandes victorias domésticas: las **Ligas 2021/22, 2023/24 y 2024/25**, la **Copa del Rey 2024** y las **Supercopas 2021, 2022 y 2023**.',
    ],
    milestones: [
      { year: '2021', title: '8ª Supercopa de España', description: 'Remontada de 19 puntos para vencer al Barcelona por 83-88.' },
      { year: '2022', title: '36ª Liga y MVP Tavares', description: 'Global 3-1 en la final frente al Barcelona.' },
      { year: '2023', title: 'La Undécima Copa de Europa — Milagro de Kaunas', description: 'Canasta de Llull a falta de 3 segundos frente al Olympiacos.' },
      { year: '2024', title: '10ª Supercopa y 29ª Copa del Rey', description: 'Dominio en Murcia y Málaga.' },
      { year: '2025', title: '37ª Liga de Baloncesto', description: 'Final 3-0 ante el Valencia Basket.' },
    ],
    timeline: [
      { title: 'Septiembre 2021 — 8ª Supercopa de España', description: 'Remontada legendaria de 19 puntos frente al Barcelona (83-88).' },
      { title: 'Septiembre 2022 — Clásico y 5ª Supercopa Consecutiva', description: 'Victoria 89-83 en un duelo épico con Chus Mateo al frente.' },
      { title: '21 de Mayo 2023 — La Épica Canasta de Llull', description: 'Undécima Copa de Europa en Kaunas frente al Olympiacos.' },
      { title: 'Temporada 2023/24 — 10ª Supercopa & 29ª Copa del Rey', description: 'Dominio en competiciones domésticas.' },
      { title: 'Temporada 2024/25 — La 37ª Liga en Valencia', description: 'Playoffs 3-0 ante el Valencia Basket.' },
    ],
    palmares: [
      { label: 'Copa de Europa', count: 1, detail: '(2022-23)' },
      { label: 'Ligas Endesa', count: 3, detail: '(21/22, 23/24, 24/25)' },
      { label: 'Copa del Rey', count: 1, detail: '(2023-24)' },
      { label: 'Supercopas', count: 4, detail: '(21, 22, 23, 24)' },
    ],
    equipacionTitle: 'Camiseta Oficial Real Madrid Baloncesto 25/26',
    equipacionDescription: 'Equipaciones oficiales ACB y Euroliga con tejido transpirable, detalles dorados y escudo termosellado.',
    equipacionItems: [
      { name: 'Camiseta Juego Local', price: '€85.00', image: 'https://shop.realmadrid.com/cdn/shop/files/image_07d5be34-9b06-4afd-9aa9-2bfd0a489720.jpg?v=1768385431&width=832' },
      { name: 'Camiseta Visitante', price: '€85.00', image: 'https://shop.realmadrid.com/cdn/shop/files/image_b4701b50-3403-4235-ab4f-d74f11c29772.jpg?v=1767814661&width=832' },
      { name: 'Pantalón Corto Local', price: '€45.00', image: 'https://shop.realmadrid.com/cdn/shop/files/image_3e0e5795-0cfe-45e7-8b2d-607ea47a8d94.jpg?v=1768407965&width=832' },
      { name: 'Cortavientos Técnico', price: '€95.00', image: 'https://shop.realmadrid.com/cdn/shop/files/image_0dc6e676-5277-4b85-9620-74d9e6e37daa.jpg?v=1768385666&width=832' },
    ],
  },
  news: [
    { id: 'n1', title: "Walter Tavares recibe el premio al Mejor Defensor de la Temporada", tag: 'ACB', image: 'https://assets.realmadrid.com/is/image/realmadrid/ND_TAVARES_PREMIO_MEJOR_DEFENSOR_SG21227?$Desktop$&fit=wrap&wid=400', description: 'El pívot de Cabo Verde sigue agigantando su palmarés como Mejor Defensor de la Liga Endesa.', date: '2026-06-18' },
    { id: 'n2', title: 'Mario Hezonja brilla con actuaciones estelares en los Playoffs', tag: 'Liga Endesa', image: 'https://assets.realmadrid.com/is/image/realmadrid/ND-LIGA-ENDESA-PLAYOFF-P1-RM-TENERIFE-PREMIOS-HEZONJA_SG20301?$Desktop$&fit=wrap&wid=400', description: 'Hezonja lideró las eliminatorias para consolidar el camino al campeonato.', date: '2026-06-15' },
    { id: 'n3', title: 'Izan Almansa destaca en la rotación contra el Zaragoza', tag: 'Cantera & Futuro', image: 'https://assets.realmadrid.com/is/image/realmadrid/ND-J18-LIGA-ENDESA-RM-ZARAGOZA-ALMANSA_SG15582?$Desktop$&fit=wrap&wid=400', description: 'El joven interior firmó un partido soberbio dominando el rebote ofensivo.', date: '2026-06-12' },
    { id: 'n4', title: 'Homenaje especial a Sergio Llull', tag: 'Leyenda', image: 'https://assets.realmadrid.com/is/image/realmadrid/ND_PRESIDENTE_LLULL_SG25640?$Desktop$&fit=wrap&wid=400', description: 'El capitán histórico fue homenajeado por la junta directiva en la sala de juntas.', date: '2026-06-10' },
    { id: 'n5', title: 'Cantera merengue conquista la Liga U', tag: 'Cantera', image: 'https://assets.realmadrid.com/is/image/realmadrid/ND-LIGA-U-RM-BARCELONA-GRUPO-COPA_SG11471?$Desktop$&fit=wrap&wid=400', description: 'Victoria en la final del torneo juvenil frente al Barcelona.', date: '2026-06-08' },
    { id: 'n6', title: 'Estreno de equipación de calentamiento blanca', tag: 'Utilería', image: 'https://assets.realmadrid.com/is/image/realmadrid/ND_LUIK_1VC5447?$Desktop$&fit=wrap&wid=400', description: 'Nuevos cortavientos técnicos para la logística de viaje Euroliga.', date: '2026-06-05' },
  ],
  players: initialPlayers,
  inventory: initialInventory,
  requests: initialRequests,
  trips: initialTrips,
  laundry: initialLaundry,
  alerts: initialAlerts,
};

const fcbPack: ClubDemoPack = {
  branding: {
    slug: 'fcb',
    teamId: CLUB_TEAM_IDS.fcb,
    name: 'FC Barcelona Basquet',
    shortName: 'FCB',
    tagline: 'Palau Blaugrana · Ciutat Esportiva',
    venue: 'Palau Blaugrana · Barcelona',
    primaryColor: '#004D98',
    secondaryColor: '#A50044',
    accentColor: '#FFD700',
    logoUrl: '/clubs/fcb/logo.svg',
    heroUrl: '/clubs/fcb/hero.jpg',
    blogHeroUrl: '/clubs/fcb/hero.jpg',
  },
  blog: {
    portalTitle: 'FCB Portal: Noticias, Historia e Indumentaria',
    portalSubtitle: 'Editorial del primer equipo, palmarés reciente y colección técnica blaugrana.',
    historyTitle: 'Historia Reciente del Barça Basquet (2020-2030)',
    historySubtitle: 'De la reconstrucción post-Euroliga al retorno como candidato al título en ACB y Europa.',
    historyIntro: [
      'El FC Barcelona Basquet ha vivido una década de transición y renacimiento, con **Niko Mirotic** como referente y una cantera que sigue alimentando el primer equipo.',
      'Tras la **Euroliga 2022-23** y múltiples finales ACB, el club apuesta por la continuidad de proyecto con **Roger Grimau** al frente del banquillo.',
    ],
    milestones: [
      { year: '2021', title: 'Final ACB vs Baskonia', description: 'El Barça compite por el título doméstico con plantilla joven.' },
      { year: '2022', title: 'Semifinal Euroliga', description: 'El Palau Blaugrana vibra en playoffs europeos.' },
      { year: '2023', title: 'Copa del Rey en Badalona', description: 'Título copero que relanza la confianza del vestuario.' },
      { year: '2024', title: 'Supercopa Endesa', description: 'El Barça levanta la Supercopa en un curso dominante.' },
      { year: '2025', title: 'Playoffs ACB — Clásico', description: 'Serie épica ante el Real Madrid en semifinales.' },
    ],
    timeline: [
      { title: '2021 — Nueva etapa con Mirotic', description: 'El pívot esloveno-español se consolida como líder del proyecto.' },
      { title: '2022 — Euroliga y Palau lleno', description: 'Semifinal europea con ambiente espectacular en Barcelona.' },
      { title: '2023 — Copa del Rey', description: 'Título copero que refuerza la identidad blaugrana.' },
      { title: '2024 — Supercopa Endesa', description: 'Dominio en competición de pretemporada.' },
      { title: '2025 — Clásico en Playoffs', description: 'Serie de alto voltaje contra el Real Madrid.' },
    ],
    palmares: [
      { label: 'Euroliga', count: 2, detail: '(2003, 2010)' },
      { label: 'Ligas Endesa', count: 19, detail: 'Histórico' },
      { label: 'Copa del Rey', count: 27, detail: 'Histórico' },
      { label: 'Supercopas', count: 14, detail: 'Histórico' },
    ],
    equipacionTitle: 'Equipación Oficial FC Barcelona Basquet 25/26',
    equipacionDescription: 'Camisetas blaugrana con tejido Nike Dri-FIT ADV, escudo bordado y detalles dorados para competición ACB y Euroliga.',
    equipacionItems: [
      { name: 'Camiseta Local Blaugrana', price: '€85.00', image: '/clubs/fcb/logo.svg' },
      { name: 'Camiseta Visitante', price: '€85.00', image: '/clubs/fcb/logo.svg' },
      { name: 'Pantalón Juego', price: '€45.00', image: '/clubs/fcb/logo.svg' },
      { name: 'Chándal Entrenamiento', price: '€95.00', image: '/clubs/fcb/logo.svg' },
    ],
  },
  news: [
    { id: 'n1', title: 'Niko Mirotic lidera la victoria en el Clásico ACB', tag: 'ACB', image: '/clubs/fcb/hero.jpg', description: 'El pívot fue MVP del partido con 24 puntos y 11 rebotes ante el Real Madrid.', date: '2026-06-18' },
    { id: 'n2', title: 'Alex Abrines renueva hasta 2028', tag: 'Fichajes', image: '/clubs/fcb/logo.svg', description: 'El alero mallorquín amplía su contrato como referente del proyecto blaugrana.', date: '2026-06-16' },
    { id: 'n3', title: 'Hugo González brilla con la selección U20', tag: 'Selección', image: '/clubs/fcb/hero.jpg', description: 'El base canterano suma otro hito internacional con España.', date: '2026-06-14' },
    { id: 'n4', title: 'Roger Grimau: "Tenemos plantilla para pelear por todo"', tag: 'Entrenador', image: '/clubs/fcb/logo.svg', description: 'El entrenador valora la profundidad de banquillo de cara a Euroliga.', date: '2026-06-12' },
    { id: 'n5', title: 'Palau Blaugrana sold out para el playoff', tag: 'Afición', image: '/clubs/fcb/hero.jpg', description: 'Entradas agotadas para la semifinal ACB.', date: '2026-06-10' },
    { id: 'n6', title: 'Nueva equipación visitante presentada', tag: 'Utilería', image: '/clubs/fcb/logo.svg', description: 'El primer equipo estrena el segundo uniforme de la temporada 25/26.', date: '2026-06-08' },
  ],
  players: fcbPlayers,
  inventory: fcbInventory,
  requests: fcbRequests,
  trips: fcbTrips,
  laundry: fcbLaundry,
  alerts: fcbAlerts,
};

const vbcPack: ClubDemoPack = {
  branding: {
    slug: 'vbc',
    teamId: CLUB_TEAM_IDS.vbc,
    name: 'Valencia Basket',
    shortName: 'VBC',
    tagline: 'Roig Arena · Ciutat de les Arts i les Ciències',
    venue: 'Roig Arena · Valencia',
    primaryColor: '#FF6600',
    secondaryColor: '#000000',
    accentColor: '#FFFFFF',
    logoUrl: '/clubs/vbc/logo.svg',
    heroUrl: '/clubs/vbc/hero.jpg',
    blogHeroUrl: '/clubs/vbc/hero.jpg',
  },
  blog: {
    portalTitle: 'VBC Portal: Noticias, Historia e Indumentaria',
    portalSubtitle: 'Crónicas taronja, palmarés reciente y equipación oficial del Valencia Basket.',
    historyTitle: 'Historia Reciente del Valencia Basket (2020-2030)',
    historySubtitle: 'Del título de 2017 a la final ACB 2025: la era taronja en la élite del baloncesto español.',
    historyIntro: [
      'El Valencia Basket ha sido protagonista en la élite europea con **Brandon Davies** y **Chris Jones** liderando un proyecto ambicioso en la **Roig Arena**.',
      'Tras la **final ACB 2025** ante el Real Madrid, el club refuerza su apuesta por la cantera valenciana y la identidad taronja.',
    ],
    milestones: [
      { year: '2017', title: 'Campeón Liga Endesa', description: 'Título histórico en un final apoteósico.' },
      { year: '2019', title: 'Final Euroliga', description: 'El VBC se codea con los mejores de Europa.' },
      { year: '2022', title: 'Copa del Rey', description: 'Título copero en una edición memorable.' },
      { year: '2024', title: 'Semifinal Playoffs ACB', description: 'El taronja compite por el título doméstico.' },
      { year: '2025', title: 'Final ACB vs Real Madrid', description: 'Serie final 0-3 que consolida al VBC en la élite.' },
    ],
    timeline: [
      { title: '2017 — Campeón de Liga', description: 'El Valencia levanta el título de Liga Endesa.' },
      { title: '2019 — Final Euroliga', description: 'El club alcanza la final continental.' },
      { title: '2022 — Copa del Rey', description: 'Nuevo título en competición KO.' },
      { title: '2024 — Playoffs ACB', description: 'Semifinal con ambiente espectacular en Roig Arena.' },
      { title: '2025 — Final ACB', description: 'Serie final ante el Real Madrid (0-3).' },
    ],
    palmares: [
      { label: 'Ligas Endesa', count: 1, detail: '(2016-17)' },
      { label: 'Copa del Rey', count: 4, detail: 'Histórico' },
      { label: 'Supercopas', count: 1, detail: '(2020)' },
      { label: 'Euroliga', count: 0, detail: 'Final 2019' },
    ],
    equipacionTitle: 'Equipación Oficial Valencia Basket 25/26',
    equipacionDescription: 'Camisetas taronja y negras con tejido técnico, escudo bordado y patrocinios oficiales para ACB y competiciones europeas.',
    equipacionItems: [
      { name: 'Camiseta Local Taronja', price: '€80.00', image: '/clubs/vbc/logo.svg' },
      { name: 'Camiseta Visitante', price: '€80.00', image: '/clubs/vbc/logo.svg' },
      { name: 'Pantalón Juego', price: '€42.00', image: '/clubs/vbc/logo.svg' },
      { name: 'Chándal Entrenamiento', price: '€90.00', image: '/clubs/vbc/logo.svg' },
    ],
  },
  news: [
    { id: 'n1', title: 'Brandon Davies MVP del partido ante Joventut', tag: 'ACB', image: '/clubs/vbc/hero.jpg', description: 'El pívot taronja domina la pintura con 26 puntos y 14 rebotes.', date: '2026-06-18' },
    { id: 'n2', title: 'Chris Jones lidera la asistencia en Euroliga', tag: 'Euroliga', image: '/clubs/vbc/logo.svg', description: 'El base americano suma 12 asistencias en la victoria en Belgrado.', date: '2026-06-16' },
    { id: 'n3', title: 'Jaime Pradilla convocado con la selección', tag: 'Selección', image: '/clubs/vbc/hero.jpg', description: 'El joven ala-pívot valenciano debuta con España absoluta.', date: '2026-06-14' },
    { id: 'n4', title: 'Roig Arena: récord de asistencia en playoffs', tag: 'Afición', image: '/clubs/vbc/hero.jpg', description: 'Más de 9.000 aficionados taronja en semifinales ACB.', date: '2026-06-12' },
    { id: 'n5', title: 'Josep Puerto renueva con el club', tag: 'Fichajes', image: '/clubs/vbc/logo.svg', description: 'El alero balear amplía su vinculación con el Valencia Basket.', date: '2026-06-10' },
    { id: 'n6', title: 'Nueva equipación naranja presentada', tag: 'Utilería', image: '/clubs/vbc/logo.svg', description: 'Estreno oficial del uniforme local 25/26 en entrenamiento.', date: '2026-06-08' },
  ],
  players: vbcPlayers,
  inventory: vbcInventory,
  requests: vbcRequests,
  trips: vbcTrips,
  laundry: vbcLaundry,
  alerts: vbcAlerts,
};

export const CLUB_PACKS: Record<ClubSlug, ClubDemoPack> = {
  rmb: rmbPack,
  fcb: fcbPack,
  vbc: vbcPack,
};

export const CLUB_LIST: ClubDemoPack[] = [rmbPack, fcbPack, vbcPack];

export function getClubPack(slug: ClubSlug): ClubDemoPack {
  return CLUB_PACKS[slug];
}

export function getClubSlugByTeamId(teamId: string): ClubSlug | null {
  const entry = Object.entries(CLUB_PACKS).find(([, pack]) => pack.branding.teamId === teamId);
  return entry ? (entry[0] as ClubSlug) : null;
}
