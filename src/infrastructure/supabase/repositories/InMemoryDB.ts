import { Player } from "../../../types";
import { InventoryItem } from "../../../types";
import { Request } from "../../../types";
import { Trip } from "../../../types";
import { LaundryBatch } from "../../../types";
import { MedicalItem } from "../../../types";
import { Alert } from "../../../types";
import type { SizingProduct } from "@/content/sizing-products";

// Standard demo players (Real Real Madrid Baloncesto 2025/2026 Complete Roster!)
export const initialPlayers: any[] = [
  {
    id: "p1",
    firstName: "Facundo",
    lastName: "Campazzo",
    number: 7,
    position: "base",
    status: "ACTIVE",
    sizes: { jersey: "M", shorts: "M", shoes: "42.5", socks: "M", warmupShirt: "M" },
    nationality: "Argentina",
    birthDate: "1991-03-23", // Corrected to 23/03/1991!
    imageUrl: "https://assets.realmadrid.com/is/image/realmadrid/CAMPAZZO_oscurecido_380x501?$Desktop$&fit=wrap&wid=288&hei=384",
    profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/facundo-campazzo",
    
    // Real Extended Details from RealMadrid.com!
    birth_place: "Ciudad de Córdoba (Argentina)",
    weight: "84 kg.",
    height: "1,81 m.",
    matches_played: 80,
    points: 878,
    rebounds: 148,
    assists: 382,
    minutes_played: 1876,
    valuation: 1050,
    debut: "Real Madrid 89-76 Valencia Basket (26/09/2014)",
    trajectory: "Real Madrid (2023 - Actualidad), Estrella Roja (2022-2023), Dallas Mavericks (2022), Denver Nuggets (2020-2022), Real Madrid (2017-2020), UCAM Murcia (2015-2017), Real Madrid (2014-2015), Peñarol (2008-2014)",
    palmares: [
      "2 Copas de Europa",
      "5 Ligas ACB",
      "3 Copas del Rey",
      "5 Supercopas de España",
      "4 Ligas Argentinas",
      "1 Liga de las Américas",
      "1 Copa Argentina",
      "1 Plata Mundial",
      "2 Platas AmeriCup",
      "1 Oro Sudamericano",
      "1 MVP Liga ACB",
      "2 MVP de la Final de la ACB",
      "2 MVP Copa del Rey",
      "3 Trofeos MVP de la Supercopa",
      "1 Mejor quinteto de la Euroliga",
      "3 Trofeos Mejor quinteto Liga ACB"
    ]
  },
  {
    id: "p2",
    firstName: "Walter Samuel",
    lastName: "Tavares da Veiga",
    number: 22,
    position: "pivot",
    status: "ACTIVE",
    sizes: { jersey: "XXXL", shorts: "XXXL", shoes: "52", socks: "XL", warmupShirt: "XXXL" },
    nationality: "Cabo Verde",
    birthDate: "1992-03-22",
    imageUrl: "https://assets.realmadrid.com/is/image/realmadrid/TAVARES_oscurecido_380x501?$Desktop$&fit=wrap&wid=288&hei=384",
    actionImage: "https://assets.realmadrid.com/is/image/realmadrid/ND_TAVARES_PREMIO_MEJOR_DEFENSOR_SG21227?$Desktop$&fit=wrap&wid=400",
    profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/walter-samuel-tavares-da-veiga",
    
    // Real Extended Details from RealMadrid.com!
    birth_place: "Maio (Cabo Verde)",
    weight: "125 kg.",
    height: "2,20 m.",
    matches_played: 65,
    points: 615,
    rebounds: 424,
    assists: 37,
    minutes_played: 1449,
    valuation: 1026,
    debut: "Real Madrid 80-84 Barcelona (12/11/2017)",
    trajectory: "Real Madrid (2017 - Actualidad), Raptors 905 G-League (2016-2017), Cleveland Cavaliers (2016-2017), Bakersfield Jam G-League (2015-2016), Austin Spurs G-League (2015-2016), Atlanta Hawks (2015-2016), Herbalife Gran Canaria (2012-2015), UB La Palma LEB Oro (2011-2012)",
    palmares: [
      "2 Copas de Europa",
      "5 Ligas ACB",
      "2 Copas del Rey",
      "6 Supercopas de España",
      "1 MVP Final Four",
      "1 MVP de la Final de la ACB",
      "1 MVP de la Supercopa",
      "3 Trofeos Mejor quinteto de la Euroliga",
      "3 Trofeos Mejor quinteto Liga ACB",
      "6 Trofeos Mejor Defensor Liga ACB",
      "3 Trofeos Mejor Defensor Euroliga",
      "1 Mejor Quinteto Eurocup",
      "1 Mejor Defensor G League",
      "1 Mejor quinteto del Afrobasket"
    ]
  },
  {
    id: "p3",
    firstName: "Mario",
    lastName: "Hezonja",
    number: 11,
    position: "alero",
    status: "ACTIVE",
    sizes: { jersey: "XL", shorts: "XL", shoes: "47.5", socks: "L", warmupShirt: "XL" },
    nationality: "Croacia",
    birthDate: "1995-02-25",
    imageUrl: "https://assets.realmadrid.com/is/image/realmadrid/HEZONJA_oscurecido_380x501?$Desktop$&fit=wrap&wid=288&hei=384",
    actionImage: "https://assets.realmadrid.com/is/image/realmadrid/ND-LIGA-ENDESA-PLAYOFF-P1-RM-TENERIFE-PREMIOS-HEZONJA_SG20301?$Desktop$&fit=wrap&wid=400",
    profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/mario-hezonja",
    
    // Real Extended Details from RealMadrid.com!
    birth_place: "Dubrovnik (Croacia)",
    weight: "110 kg.",
    height: "2,06 m.",
    matches_played: 80,
    points: 1203,
    rebounds: 348,
    assists: 172,
    minutes_played: 1852,
    valuation: 1187,
    debut: "Betis 69-100 Real Madrid (24/09/2022)",
    trajectory: "Real Madrid (2022 - Actualidad), Unics Kazan (2021-2022), Panathinaikos (2020-2021), Portland Trail Blazers (2019-2020), New York Knicks (2018-2019), Orlando Magic (2015-2018), Barcelona (2012-2015)",
    palmares: [
      "1 Copa de Europa",
      "2 Ligas ACB",
      "2 Supercopas de España",
      "1 Copa del Rey",
      "1 Liga Griega",
      "1 Copa Griega",
      "1 Copa de Croacia",
      "1 MVP Liga ACB",
      "2 Trofeos Mejor quinteto Liga ACB",
      "1 MVP Liga Rusa",
      "1 Euroliga Júnior",
      "1 Bronce Mundial Sub-19",
      "1 Bronce Mundial Sub-17"
    ]
  },
  {
    id: "p4",
    firstName: "Gabriel",
    lastName: "Deck",
    number: 14,
    position: "alero",
    status: "ACTIVE",
    sizes: { jersey: "XL", shorts: "XL", shoes: "46.5", socks: "L", warmupShirt: "XL" },
    nationality: "Argentina",
    birthDate: "1995-02-08",
    imageUrl: "https://assets.realmadrid.com/is/image/realmadrid/DECK_oscurecido_380x501?$Desktop$&fit=wrap&wid=288&hei=384",
    profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/gabriel-deck",
    
    // Real Extended Details from RealMadrid.com!
    birth_place: "Colonia Dora (Argentina)",
    weight: "101 kg.",
    height: "1,98 m.",
    matches_played: 66,
    points: 489,
    rebounds: 231,
    assists: 70,
    minutes_played: 1389,
    valuation: 590,
    debut: "Obradoiro 61-81 Real Madrid (21/09/2018)",
    trajectory: "Real Madrid (2022 - Actualidad), Oklahoma City Thunder (2021), Real Madrid (2018-2021), San Lorenzo de Almagro (2016-2018), Quimsa (2009-2016)",
    palmares: [
      "1 Copa de Europa",
      "4 Ligas ACB",
      "2 Copas del Rey",
      "5 Supercopas de España",
      "1 Oro AmeriCup",
      "1 Oro Juegos Panamericanos",
      "1 Plata Mundial",
      "2 Platas AmeriCup",
      "3 Ligas Argentinas",
      "1 Liga de las Américas",
      "1 Liga Sudamericana de Clubes",
      "1 MVP de la AmeriCup",
      "2 Trofeos MVP de la Final de la Liga argentina",
      "1 MVP de la Liga argentina",
      "1 MVP de la Liga de las Américas",
      "1 Mejor quinteto de la AmeriCup",
      "2 Trofeos Mejor Quinteto de la Liga Argentina"
    ]
  },
  {
    id: "p5",
    firstName: "Théo",
    lastName: "Maledon",
    number: 12, // Updated to 12!
    position: "base",
    status: "ACTIVE",
    sizes: { jersey: "L", shorts: "L", shoes: "45", socks: "M", warmupShirt: "L" },
    nationality: "Francia",
    birthDate: "2001-06-12",
    imageUrl: "https://assets.realmadrid.com/is/image/realmadrid/MALEDON_oscurecido_380x501?$Desktop$&fit=wrap&wid=288&hei=384",
    profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/theo-maledon",
    
    // Real Extended Details from RealMadrid.com!
    birth_place: "Ruan (Francia)",
    weight: "87 kg",
    height: "1,95 m",
    matches_played: 73,
    points: 689,
    rebounds: 165,
    assists: 230,
    minutes_played: 1321,
    valuation: 835,
    debut: null,
    trajectory: "Real Madrid (2025 - Actualidad), LDLC ASVEL Villeurbanne (2024-25), Phoenix Suns (2023-24), Charlotte Hornets (2022-24), Oklahoma City Thunder (2020-22)",
    palmares: [
      "1 Liga de Francia",
      "1 Copa de Francia",
      "1 Plata Eurobasket",
      "1 Euroliga Júnior",
      "1 Oro Europeo Sub-16",
      "1 Plata Mundial Sub-17"
    ]
  },
  {
    id: "p6",
    firstName: "Sergio",
    lastName: "Llull",
    number: 23,
    position: "escolta",
    status: "ACTIVE",
    sizes: { jersey: "L", shorts: "L", shoes: "44", socks: "M", warmupShirt: "L" },
    nationality: "España",
    birthDate: "1987-11-15",
    imageUrl: "https://assets.realmadrid.com/is/image/realmadrid/LLULL_oscurecido_380x501?$Desktop$&fit=wrap&wid=288&hei=384",
    actionImage: "https://assets.realmadrid.com/is/image/realmadrid/ND_PRESIDENTE_LLULL_SG25640?$Desktop$&fit=wrap&wid=400",
    profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/sergio-llull-melia",
    
    // Real Extended Details from RealMadrid.com!
    birth_place: "Mahón (Menorca)",
    weight: "100 kg.",
    height: "1,90 m.",
    matches_played: 81,
    points: 410,
    rebounds: 85,
    assists: 151,
    minutes_played: 1102,
    valuation: 330,
    debut: "Real Madrid 84-81 Valencia Basket (17/05/2007)",
    trajectory: "Real Madrid (2007 - Actualidad), Ricoh Manresa (2006-2007), Finques Olesa (2005-2006)",
    palmares: [
      "3 Copas de Europa",
      "1 Copa Intercontinental",
      "9 Ligas ACB",
      "7 Copas del Rey",
      "9 Supercopas de España",
      "1 Oro Mundobasket",
      "3 Oros Eurobasket",
      "1 Plata JJOO Londres",
      "1 Bronce JJOO Río",
      "1 Europeo Junior",
      "1 Plata Europeo sub-20",
      "1 Bronce Eurobasket",
      "1 MVP de la Euroliga",
      "1 MVP Liga ACB",
      "1 MVP Intercontinental",
      "2 Trofeos MVP Copa del Rey",
      "3 Trofeos MVP de la Supercopa",
      "2 Trofeos MVP de la Final de la ACB",
      "1 Mejor quinteto de la Euroliga",
      "3 Trofeos Mejor quinteto Liga ACB"
    ]
  },
  {
    id: "p7",
    firstName: "Usman",
    lastName: "Garuba",
    number: 16,
    position: "ala_pivot",
    status: "ACTIVE",
    sizes: { jersey: "XXL", shorts: "XXL", shoes: "49.5", socks: "XL", warmupShirt: "XXL" },
    nationality: "España",
    birthDate: "2002-03-09",
    imageUrl: "https://assets.realmadrid.com/is/image/realmadrid/GARUBA_oscurecido_380x501?$Desktop$&fit=wrap&wid=288&hei=384",
    profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/usman-garuba",
    
    // Real Extended Details from RealMadrid.com!
    birth_place: "Madrid",
    weight: "116 kg.",
    height: "2,03 m.",
    matches_played: 71,
    points: 377,
    rebounds: 213,
    assists: 44,
    minutes_played: 901,
    valuation: 475,
    debut: "Real Madrid 90-77 San Pablo Burgos (28/10/2018)",
    trajectory: "Real Madrid (2024 - Actualidad), Santa Cruz Warriors G-League (2023-2024), Golden State Warriors (2023-2024), Rio Grande Valley Vipers G-League (2021-2022), Houston Rockets (2021-2023), Real Madrid (2019-2021)",
    palmares: [
      "2 Ligas ACB",
      "1 Copa del Rey",
      "2 Supercopas de España",
      "1 Oro Eurobasket",
      "1 Euroliga Júnior",
      "1 Rising Star Euroliga",
      "1 Mejor joven Liga ACB"
    ]
  },
  {
    id: "p8",
    firstName: "Andrés",
    lastName: "Feliz",
    number: 24,
    position: "base",
    status: "ACTIVE",
    sizes: { jersey: "M", shorts: "L", shoes: "43", socks: "M", warmupShirt: "L" },
    nationality: "República Dominicana",
    birthDate: "1997-07-15",
    imageUrl: "https://assets.realmadrid.com/is/image/realmadrid/FELIZ_oscurecido_380x501?$Desktop$&fit=wrap&wid=288&hei=384",
    profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/andres-feliz",
    
    // Real Extended Details from RealMadrid.com!
    birth_place: "Santo Domingo (República Dominicana)",
    weight: "94 kg.",
    height: "1,86 m.",
    matches_played: 75,
    points: 559,
    rebounds: 207,
    assists: 163,
    minutes_played: 1271,
    valuation: 603,
    debut: null,
    trajectory: "Real Madrid (2024 - Actualidad), Joventut Badalona (2021-2024), C. B. Prat L.E.B. Oro (2020-2021), University of Illinois (2018-2020), Northwest Football G-League",
    palmares: [
      "1 Liga ACB",
      "1 Trofeo Mejor quinteto Liga ACB"
    ]
  },
  {
    id: "p9",
    firstName: "David",
    lastName: "Kramer",
    number: 1,
    position: "alero",
    status: "ACTIVE",
    sizes: { jersey: "L", shorts: "L", shoes: "45", socks: "M", warmupShirt: "L" },
    nationality: "Alemania",
    birthDate: "1997-01-14",
    imageUrl: "https://assets.realmadrid.com/is/image/realmadrid/KRAMER_oscurecido_380x501?$Desktop$&fit=wrap&wid=288&hei=384",
    profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/david-kramer",
    
    // Real Extended Details from RealMadrid.com!
    birth_place: "Myjava (Eslovaquia)",
    weight: "93 kg.",
    height: "1,98 m.",
    matches_played: 47,
    points: 249,
    rebounds: 78,
    assists: 24,
    minutes_played: 588,
    valuation: 188,
    debut: null,
    trajectory: "Real Madrid (2025 - Actualidad), La Laguna Tenerife (2024-25), Covirán Granada (2023-24), Basketball Löwen Braunschweig (2021-23), Bayern de Múnich (2020-21)",
    palmares: [
      "1 Oro Mundobasket"
    ]
  },
  {
    id: "p10",
    firstName: "Alberto",
    lastName: "Abalde",
    number: 6,
    position: "alero",
    status: "ACTIVE",
    sizes: { jersey: "XL", shorts: "XL", shoes: "46", socks: "L", warmupShirt: "XL" },
    nationality: "España",
    birthDate: "1995-12-15",
    imageUrl: "https://assets.realmadrid.com/is/image/realmadrid/ABALDE_oscurecido_380x501?$Desktop$&fit=wrap&wid=288&hei=384",
    profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/alberto-abalde-diaz",
    
    // Real Extended Details from RealMadrid.com!
    birth_place: "Ferrol",
    weight: "92 kg.",
    height: "2,02 m.",
    matches_played: 79,
    points: 379,
    rebounds: 122,
    assists: 93,
    minutes_played: 1265,
    valuation: 332,
    debut: "Tenerife 79-92 Real Madrid (12/09/2020)",
    trajectory: "Real Madrid (2020 - Actualidad), Valencia Basket (2017-2020), Joventut Badalona (2013-2017)",
    palmares: [
      "1 Copa de Europa",
      "3 Ligas ACB",
      "1 Copa del Rey",
      "4 Supercopas de España",
      "1 Eurocup",
      "2 Platas Europeo Sub-20"
    ]
  },
  {
    id: "p11",
    firstName: "Gabriele",
    lastName: "Procida",
    number: 9, // Updated to 9!
    position: "alero",
    status: "ACTIVE",
    sizes: { jersey: "L", shorts: "L", shoes: "46", socks: "M", warmupShirt: "L" },
    nationality: "Italia",
    birthDate: "2002-06-01",
    imageUrl: "https://assets.realmadrid.com/is/image/realmadrid/PROCIDA_oscurecido_380x501?$Desktop$&fit=wrap&wid=288&hei=384",
    profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/gabriele-procida",
    
    // Real Extended Details from RealMadrid.com!
    birth_place: "Como (Italia)",
    weight: "91 kg.",
    height: "2,01 m.",
    matches_played: 38,
    points: 203,
    rebounds: 53,
    assists: 21,
    minutes_played: 465,
    valuation: 174,
    debut: null,
    trajectory: "Real Madrid (2025 - Actualidad), Alba Berlín (2022-2025), Fortitudo Bologna (2021-2022), Pallacanestro Cantú (2019-2021)",
    palmares: [
      "1 Rising Star Euroliga"
    ]
  },
  {
    id: "p12",
    firstName: "Trey",
    lastName: "Lyles",
    number: 10,
    position: "ala_pivot",
    status: "ACTIVE",
    sizes: { jersey: "XXXL", shorts: "XXXL", shoes: "50", socks: "XL", warmupShirt: "XXXL" },
    nationality: "Canadá",
    birthDate: "1995-11-05",
    imageUrl: "https://assets.realmadrid.com/is/image/realmadrid/LYLES_oscurecido_380x501?$Desktop$&fit=wrap&wid=288&hei=384",
    profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/trey-lyles",
    
    // Real Extended Details from RealMadrid.com!
    birth_place: "Saskatoon (Canadá)",
    weight: "115 kg.",
    height: "2,06 m.",
    matches_played: 74,
    points: 925,
    rebounds: 347,
    assists: 115,
    minutes_played: 1541,
    valuation: 1066,
    debut: null,
    trajectory: "Real Madrid (2025 - Actualidad), Sacramento Kings (2021-2025), Detroit Pistons (2021-2022), San Antonio Spurs (2019-2021), Denver Nuggets (2017-2019), Utah Jazz (2015-2017)",
    palmares: []
  },
  {
    id: "p13",
    firstName: "Chuma",
    lastName: "Okeke",
    number: 8, // Updated to 8!
    position: "ala_pivot",
    status: "ACTIVE",
    sizes: { jersey: "XXL", shorts: "XXL", shoes: "47", socks: "L", warmupShirt: "XXL" },
    nationality: "Estados Unidos",
    birthDate: "1998-08-18",
    imageUrl: "https://assets.realmadrid.com/is/image/realmadrid/OKEKE_oscurecido_380x501?$Desktop$&fit=wrap&wid=288&hei=384",
    profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/chukwuma-julian-okeke",
    
    // Real Extended Details from RealMadrid.com!
    birth_place: "Atlanta (Estados Unidos)",
    weight: "109 kg.",
    height: "2,01 m.",
    matches_played: 69,
    points: 411,
    rebounds: 264,
    assists: 56,
    minutes_played: 1280,
    valuation: 549,
    debut: null,
    trajectory: "Real Madrid (2025 - Actualidad), Cleveland Cavaliers (2025), Philadelphia 76ers (2025), Westchester Knicks (2024-25), Lakeland Magic (2022-23), Orlando Magic (2020-24)"
  },
  {
    id: "p14",
    firstName: "Izan",
    lastName: "Almansa",
    number: 13, // Updated to 13!
    position: "ala_pivot",
    status: "ACTIVE",
    sizes: { jersey: "XL", shorts: "XL", shoes: "48", socks: "L", warmupShirt: "XL" },
    nationality: "España",
    birthDate: "2005-06-07",
    imageUrl: "https://assets.realmadrid.com/is/image/realmadrid/ALMANSA_oscurecidos_380x501?$Desktop$&fit=wrap&wid=288&hei=384",
    actionImage: "https://assets.realmadrid.com/is/image/realmadrid/ND-J18-LIGA-ENDESA-RM-ZARAGOZA-ALMANSA_SG15582?$Desktop$&fit=wrap&wid=400",
    profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/izan-almansa",
    
    // Real Extended Details from RealMadrid.com!
    birth_place: "Murcia (España)",
    weight: "105 kg.",
    height: "2,07 m.",
    matches_played: 22,
    points: 99,
    rebounds: 44,
    assists: 7,
    minutes_played: 209,
    valuation: 108,
    debut: null,
    trajectory: "Real Madrid (2025 - Actualidad), Perth Wildcats (2024-2025), G League Ignite (2023-2024), YNG Dreamerz (2022-2023), Overtime Elite (2021-2022), Cantera del Real Madrid (2019-2021)",
    palmares: [
      "1 Liga U",
      "1 Oro Mundial sub-19",
      "1 Oro Europeo sub-18"
    ]
  },
  {
    id: "p15",
    firstName: "Mady",
    lastName: "Sissoko",
    number: 5, // Updated to 5!
    position: "pivot",
    status: "ACTIVE",
    sizes: { jersey: "XXL", shorts: "XXL", shoes: "50", socks: "XL", warmupShirt: "XXL" },
    nationality: "Mali",
    birthDate: "2000-12-20",
    imageUrl: "https://assets.realmadrid.com/is/image/realmadrid/SISSOKO_380x501?$Desktop$&fit=wrap&wid=288&hei=384",
    profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/mady-sissoko",
    
    // Real Extended Details from RealMadrid.com!
    birth_place: "Tangafoya (Mali)",
    weight: "109 kg.",
    height: "2,06 m.",
    matches_played: 3,
    points: 18,
    rebounds: 14,
    assists: 0,
    minutes_played: 44,
    valuation: 25,
    debut: null,
    trajectory: "Real Madrid (2026 - Actualidad), Pallacanestro Trieste (2025-26), California Golden Bears (2024-25), Michigan State NCAA (2020-24)"
  },
  {
    id: "p16",
    firstName: "Alex",
    lastName: "Len",
    number: 25,
    position: "pivot",
    status: "ACTIVE",
    sizes: { jersey: "XXXL", shorts: "XXXL", shoes: "51.5", socks: "XL", warmupShirt: "XXXL" },
    nationality: "Ucrania",
    birthDate: "1993-06-16",
    imageUrl: "https://assets.realmadrid.com/is/image/realmadrid/ALEX_LEN_380x501?$Desktop$&fit=wrap&wid=288&hei=384",
    profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/alex-len",
    
    // Real Extended Details from RealMadrid.com!
    birth_place: "Antratsit (Ucrania)",
    weight: "121 kg.",
    height: "2,13 m.",
    matches_played: 46,
    points: 223,
    rebounds: 126,
    assists: 23,
    minutes_played: 511,
    valuation: 287,
    debut: "Real Madrid (2025)",
    trajectory: "Real Madrid (2025 - Actualidad), Los Ángeles Lakers (2025), Sacramento Kings (2021-2025), Washington Wizards (2020-2021), Toronto Raptors (2020-2021), Sacramento Kings (2019-2020), Atlanta Hawks (2018-2020), Phoenix Suns (2013-2018), Universidad de Maryland (2011-2013)",
    palmares: []
  },
  {
    id: "p17",
    firstName: "Ömer",
    lastName: "Yurtseven",
    number: 77,
    position: "pivot",
    status: "ACTIVE",
    sizes: { jersey: "XXXL", shorts: "XXXL", shoes: "51", socks: "XL", warmupShirt: "XXXL" },
    nationality: "Turquía",
    birthDate: "1998-06-19",
    imageUrl: "https://assets.realmadrid.com/is/image/realmadrid/YURTSEVEN_380x501?$Desktop$&fit=wrap&wid=288&hei=384",
    profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/omer-yurtseven",
    
    // Real Extended Details from RealMadrid.com!
    birth_place: "Taskent (Uzbekistán)",
    weight: "120 kg.",
    height: "2,13 m.",
    matches_played: 5,
    points: 44,
    rebounds: 15,
    assists: 3,
    minutes_played: 68,
    valuation: 53,
    debut: "Real Madrid (2026)",
    trajectory: "Real Madrid (2026 - Actualidad), Golden State Warriors (2026), Panathinaikos (2024-2026), Utah Jazz (2023-2024), Miami Heat (2021-2023), Universidad de Georgetown (2018-2020), Universidad de North Carolina State (2016-2018)",
    palmares: [
      "2 Copas de Grecia",
      "1 Copa de Turquía",
      "1 Plata Eurobasket",
      "1 Plata Europeo Sub-20",
      "1 Plata Europeo Sub-18"
    ]
  }
];

export const initialInventory: any[] = [
  {
    id: "i1",
    name: "Camiseta Oficial Real Madrid Baloncesto Local 25/26",
    sku: "RMB-HOME-2526",
    category: "camiseta_juego",
    stock_total: 45,
    stock_available: 45,
    stock_assigned: 0,
    stock_min: 15,
    location: "Almacén Principal (Estantería A)",
    qr_code: "RMB-HOME-2526",
    barcode: "8412345678901",
    size: "XL",
    price: 85,
    unit_cost: 85,
    is_active: true,
    lastUpdated: "2026-06-17",
    updated_at: new Date().toISOString(),
    image_url: "https://shop.realmadrid.com/cdn/shop/files/image_07d5be34-9b06-4afd-9aa9-2bfd0a489720.jpg?v=1768385431&width=832"
  },
  {
    id: "i2",
    name: "Camiseta Oficial Real Madrid Visitante 25/26",
    sku: "RMB-AWAY-2526",
    category: "camiseta_juego",
    stock_total: 8, // Trigger alert
    stock_available: 8,
    stock_assigned: 0,
    stock_min: 15,
    location: "Almacén Principal (Estantería A)",
    qr_code: "RMB-AWAY-2526",
    barcode: "8412345678918",
    size: "XL",
    price: 85,
    unit_cost: 85,
    is_active: true,
    lastUpdated: "2026-06-16",
    updated_at: new Date().toISOString(),
    image_url: "https://shop.realmadrid.com/cdn/shop/files/image_b4701b50-3403-4235-ab4f-d74f11c29772.jpg?v=1767814661&width=832"
  },
  {
    id: "i3",
    name: "Pantalón Corto Juego Blanco RMB 25/26",
    sku: "RMB-SHORTS-H",
    category: "pantalon_juego",
    stock_total: 32,
    stock_available: 32,
    stock_assigned: 0,
    stock_min: 10,
    location: "Almacén Principal (Estantería B)",
    qr_code: "RMB-SHORTS-H",
    barcode: "8412345678925",
    size: "XL",
    price: 45,
    unit_cost: 45,
    is_active: true,
    lastUpdated: "2026-06-15",
    updated_at: new Date().toISOString(),
    image_url: "https://shop.realmadrid.com/cdn/shop/files/image_3e0e5795-0cfe-45e7-8b2d-607ea47a8d94.jpg?v=1768407965&width=832"
  },
  {
    id: "i4",
    name: "Zapatillas Baloncesto Pro Bounce RMB Edition",
    sku: "RMB-FW-PRO",
    category: "zapatillas",
    stock_total: 2, // Low stock trigger
    stock_available: 2,
    stock_assigned: 0,
    stock_min: 5,
    location: "Zapatero Vestuario",
    qr_code: "RMB-FW-PRO",
    barcode: "8412345678932",
    size: "47.5",
    price: 140,
    lastUpdated: "2026-06-14",
    unit_cost: 140,
    is_active: true,
    image_url: null
  },
  {
    id: "i5",
    name: "Medias de Compresión Blancas",
    sku: "SO-COMP-W",
    category: "calcetines",
    stock_total: 120,
    stock_available: 120,
    stock_assigned: 0,
    stock_min: 30,
    location: "Almacén Principal (Caja 12)",
    qr_code: "SO-COMP-W",
    barcode: "8412345678949",
    size: "L",
    price: 15,
    unit_cost: 15,
    is_active: true,
    lastUpdated: "2026-06-10",
    updated_at: new Date().toISOString(),
    image_url: null
  },
  {
    id: "i6",
    name: "Camiseta de Entrenamiento Reversible",
    sku: "TS-TRAIN-REV",
    category: "camiseta_entrenamiento",
    stock_total: 55,
    stock_available: 55,
    stock_assigned: 0,
    stock_min: 20,
    location: "Almacén Principal (Estantería C)",
    qr_code: "TS-TRAIN-REV",
    barcode: "8412345678956",
    size: "XXL",
    price: 35,
    unit_cost: 35,
    is_active: true,
    lastUpdated: "2026-06-12",
    updated_at: new Date().toISOString(),
    image_url: "https://shop.realmadrid.com/cdn/shop/files/JY5987_1_APPAREL_Photography_FrontCenterView_white.jpg?v=1769011072&width=832"
  },
  {
    id: "i7",
    name: "Chaqueta Cortavientos de Calentamiento",
    sku: "RMB-JACK-WARM",
    category: "chaqueta",
    stock_total: 20,
    stock_available: 20,
    stock_assigned: 0,
    stock_min: 5,
    location: "Almacén Principal (Estantería C)",
    qr_code: "RMB-JACK-WARM",
    barcode: "8412345678963",
    size: "XL",
    price: 95,
    unit_cost: 95,
    is_active: true,
    lastUpdated: "2026-06-12",
    updated_at: new Date().toISOString(),
    image_url: "https://shop.realmadrid.com/cdn/shop/files/image_0dc6e676-5277-4b85-9620-74d9e6e37daa.jpg?v=1768385666&width=832"
  },
  {
    id: "i8",
    name: "Pantalón Corto Juego Morado RMB 25/26",
    sku: "RMB-SHORTS-A",
    category: "pantalon_juego",
    stock_total: 18,
    stock_available: 18,
    stock_assigned: 0,
    stock_min: 8,
    location: "Almacén Principal (Estantería B)",
    qr_code: "RMB-SHORTS-A",
    barcode: "8412345678970",
    size: "XL",
    price: 45,
    unit_cost: 45,
    is_active: true,
    lastUpdated: "2026-06-15",
    updated_at: new Date().toISOString(),
    image_url: "https://shop.realmadrid.com/cdn/shop/files/image_91f0f462-612c-4d62-a57e-ab26ebbec659.jpg?v=1768385652&width=832"
  },
  {
    id: "i9",
    name: "Chubasquero Real Madrid AW JKT 25/26 (Adidas JP4057)",
    sku: "JP4057",
    category: "chaqueta",
    stock_total: 18,
    stock_available: 14,
    stock_assigned: 4,
    stock_min: 6,
    location: "Vestuario principal — perchero capitanes",
    qr_code: "CMP-RMB-I9-P6-001",
    barcode: "4068807308923",
    size: "2XL",
    price: 120,
    unit_cost: 120,
    is_active: true,
    lastUpdated: "2026-06-19",
    updated_at: new Date().toISOString(),
    image_url: "/garments/rmb/llull-chubasquero-jp4057.jpg",
    brand: "Adidas",
    notes: "REAL AW JKT · RFID EAN 696 KH · Demo Sergio Llull #23"
  }
];

export const initialRequests: any[] = [
  {
    id: "r1",
    playerId: "p1",
    playerName: "Facundo Campazzo",
    itemId: "i1",
    itemName: "Camiseta Oficial Real Madrid Baloncesto Local 25/26",
    quantity: 2,
    size: "M",
    status: "PENDING",
    requestDate: "2026-06-17",
    notes: "Para partido de Euroliga"
  },
  {
    id: "r2",
    playerId: "p2",
    playerName: "Walter Samuel Tavares",
    itemId: "i4",
    itemName: "Zapatillas Baloncesto Pro Bounce RMB Edition",
    quantity: 1,
    size: "52",
    status: "APPROVED",
    requestDate: "2026-06-16",
    neededByDate: "2026-06-20",
    notes: "Repuesto urgente para semifinal ACB"
  },
  {
    id: "r3",
    playerId: "p4",
    playerName: "Gabriel Deck",
    itemId: "i5",
    itemName: "Medias de Compresión Blancas",
    quantity: 5,
    size: "XL",
    status: "DELIVERED",
    requestDate: "2026-06-15",
    notes: "Entregado por Carlos Kobe en vestuario",
    category: "accesorios"
  },
  {
    id: "r4",
    playerId: "p3",
    playerName: "Mario Hezonja",
    itemId: "i2",
    itemName: "Camiseta Visitante 25/26",
    quantity: 1,
    size: "XL",
    status: "PENDING",
    requestDate: "2026-06-18",
    notes: "Rotura en partido vs Baskonia — reposición urgente",
    category: "equipacion"
  },
  {
    id: "r5",
    playerId: "p8",
    playerName: "Izan Almansa",
    itemId: "i6",
    itemName: "Camiseta Entrenamiento Reversible",
    quantity: 2,
    size: "XXL",
    status: "PENDING",
    requestDate: "2026-06-18",
    notes: "Talla actualizada tras control médico",
    category: "entrenamiento"
  },
  {
    id: "r6",
    playerId: "p12",
    playerName: "Theo Maledon",
    itemId: "i7",
    itemName: "Chaqueta Cortavientos Calentamiento",
    quantity: 1,
    size: "L",
    status: "APPROVED",
    requestDate: "2026-06-17",
    neededByDate: "2026-06-22",
    notes: "Viaje a Málaga — Euroliga",
    category: "entrenamiento"
  },
  {
    id: "r7",
    playerId: "p16",
    playerName: "Alex Len",
    itemId: "i3",
    itemName: "Pantalón Corto Juego Blanco",
    quantity: 2,
    size: "XXXL",
    status: "APPROVED",
    requestDate: "2026-06-16",
    notes: "Stock bajo en almacén — pedido a proveedor Adidas",
    category: "equipacion"
  },
  {
    id: "r8",
    playerId: "p6",
    playerName: "Mady Sissoko",
    itemId: "i4",
    itemName: "Zapatillas Pro Bounce RMB Edition",
    quantity: 1,
    size: "47",
    status: "PENDING",
    requestDate: "2026-06-18",
    notes: "Desgaste suela — cambio mid-season",
    category: "calzado"
  },
  {
    id: "r9",
    playerId: "p10",
    playerName: "Gabriel Vezenkov",
    itemName: "Chándal Completo 25/26",
    quantity: 1,
    size: "XL",
    status: "DELIVERED",
    requestDate: "2026-06-10",
    notes: "Entrega pre-temporada completada",
    category: "entrenamiento"
  },
  {
    id: "r10",
    playerId: "p14",
    playerName: "Sergio Llull",
    itemName: "Polo Staff Oficial",
    quantity: 1,
    size: "L",
    status: "PENDING",
    requestDate: "2026-06-18",
    notes: "Material promocional acto institucional",
    category: "accesorios"
  }
];

export const initialTrips: any[] = [
  {
    id: "t1",
    destination: "Málaga",
    opponent: "Unicaja",
    departureDate: "2026-06-20",
    returnDate: "2026-06-22",
    status: "planificado",
    packingList: [
      { id: "tp1", itemName: "Equipación Local Blanca (Camisetas + Shorts)", quantityRequired: 15, quantityPacked: 15, category: "camiseta_juego", isPacked: true },
      { id: "tp2", itemName: "Equipación Visitante Morada", quantityRequired: 15, quantityPacked: 5, category: "camiseta_juego", isPacked: false },
      { id: "tp3", itemName: "Camisetas de Calentamiento", quantityRequired: 15, quantityPacked: 15, category: "camiseta_entrenamiento", isPacked: true },
      { id: "tp4", itemName: "Toallas Oficiales RMB", quantityRequired: 30, quantityPacked: 10, category: "accesorios", isPacked: false },
      { id: "tp5", itemName: "Botiquín Médico Principal", quantityRequired: 2, quantityPacked: 2, category: "medico", isPacked: true }
    ],
    notes: "Partido crítico Liga Endesa. Asegurar doble petate de balones oficiales."
  },
  {
    id: "t2",
    destination: "Atenas",
    opponent: "Panathinaikos",
    departureDate: "2026-06-26",
    returnDate: "2026-06-28",
    status: "planificado",
    packingList: [
      { id: "tp10", itemName: "Equipación Visitante Morada", quantityRequired: 15, quantityPacked: 0, category: "camiseta_juego", isPacked: false },
      { id: "tp11", itemName: "Camisetas de Calentamiento", quantityRequired: 15, quantityPacked: 0, category: "camiseta_entrenamiento", isPacked: false },
      { id: "tp12", itemName: "Botiquín Sanitario", quantityRequired: 2, quantityPacked: 0, category: "medico", isPacked: false }
    ],
    notes: "Vuelo chárter Iberia. Restricción de 32kg por petate de utilería."
  }
];

export const initialLaundry: any[] = [
  { id: "l1", name: "Lote Entrenamiento Principal - RMB", itemCount: 24, status: "WASHING", receivedDate: "2026-06-18", responsible: "Carlos R. Kobe (Utillero)" },
  { id: "l2", name: "Juego Blanco vs Barça Baloncesto", itemCount: 18, status: "READY", receivedDate: "2026-06-17", completedDate: "2026-06-18", responsible: "Carlos R. Kobe (Utillero)" },
  { id: "l3", name: "Chándales de Viaje", itemCount: 15, status: "PENDING", receivedDate: "2026-06-18", responsible: "Carlos R. Kobe (Utillero)" }
];

export const initialMedical: any[] = [
  { id: "m1", name: "Vendas de Compresión Elástica (Tape)", quantity: 48, minQuantity: 20, expiryDate: "2028-12-31", batchNumber: "B-8822", status: "OK", location: "Botiquín Fisioterapia", kit: "Fisioterapia", team_id: "team-acb-123", category: "material_cura", brand: "Mueller", reference: "T-9922", unit_cost: 4.5, is_active: true },
  { id: "m2", name: "Spray Frío / Hielo Químico", quantity: 6, minQuantity: 15, expiryDate: "2026-08-15", batchNumber: "B-1090", status: "EXPIRING_SOON", location: "Nevera Vestuario", kit: "Vestuario Principal", team_id: "team-acb-123", category: "fármaco", brand: "Biofreeze", reference: "S-109", unit_cost: 8, is_active: true },
  { id: "m3", name: "Geles Antiinflamatorios (Voltaren)", quantity: 15, minQuantity: 5, expiryDate: "2026-05-10", batchNumber: "B-2291", status: "EXPIRED", location: "Armario Médico", kit: "Armario Central", team_id: "team-acb-123", category: "fármaco", brand: "Voltaren", reference: "G-22", unit_cost: 12, is_active: true, prescription_required: true },
  { id: "m4", name: "Botiquín de Urgencias ACB (Completo)", quantity: 4, minQuantity: 2, expiryDate: "2027-06-30", batchNumber: "B-7001", status: "OK", location: "Vestuario — Banquillo", kit: "Botiquín Partido", team_id: "team-acb-123", category: "botiquin", brand: "RMB Medical", reference: "BQ-ACB-01", unit_cost: 280, is_active: true },
  { id: "m5", name: "Botiquín de Viaje Euroliga", quantity: 2, minQuantity: 2, expiryDate: "2027-03-15", batchNumber: "B-7002", status: "OK", location: "Almacén Logística", kit: "Botiquín Viaje", team_id: "team-acb-123", category: "botiquin", brand: "RMB Medical", reference: "BQ-EU-01", unit_cost: 350, is_active: true },
  { id: "m6", name: "Vendaje Cohesivo (Coban)", quantity: 36, minQuantity: 12, expiryDate: "2029-01-01", batchNumber: "B-3310", status: "OK", location: "Botiquín Fisioterapia", kit: "Fisioterapia", team_id: "team-acb-123", category: "material_cura", brand: "3M", reference: "CB-10", unit_cost: 3.2, is_active: true },
  { id: "m7", name: "Gasas Estériles 10x10 (Paquete 100)", quantity: 22, minQuantity: 10, expiryDate: "2028-08-20", batchNumber: "B-4412", status: "OK", location: "Armario Médico", kit: "Armario Central", team_id: "team-acb-123", category: "material_cura", brand: "Hartmann", reference: "GS-100", unit_cost: 18, is_active: true },
  { id: "m8", name: "Suero Fisiológico 0,9% (500ml)", quantity: 8, minQuantity: 20, expiryDate: "2026-11-30", batchNumber: "B-5520", status: "EXPIRING_SOON", location: "Nevera Vestuario", kit: "Vestuario Principal", team_id: "team-acb-123", category: "suero", brand: "B Braun", reference: "SF-500", unit_cost: 2.5, is_active: true },
  { id: "m9", name: "Paracetamol 1g (Caja 20 sobres)", quantity: 5, minQuantity: 8, expiryDate: "2027-02-28", batchNumber: "B-6611", status: "OK", location: "Armario Médico", kit: "Armario Central", team_id: "team-acb-123", category: "fármaco", brand: "Cinfa", reference: "PC-1G", unit_cost: 6, is_active: true, prescription_required: true },
  { id: "m10", name: "Ibuprofeno 600mg (Caja 40 comp.)", quantity: 4, minQuantity: 6, expiryDate: "2027-04-15", batchNumber: "B-6612", status: "OK", location: "Armario Médico", kit: "Armario Central", team_id: "team-acb-123", category: "fármaco", brand: "Kern", reference: "IB-600", unit_cost: 7.5, is_active: true, prescription_required: true },
  { id: "m11", name: "Esparadrapo Hipoalergénico (Rollo 5m)", quantity: 18, minQuantity: 8, expiryDate: "2028-05-01", batchNumber: "B-7720", status: "OK", location: "Botiquín Fisioterapia", kit: "Fisioterapia", team_id: "team-acb-123", category: "material_cura", brand: "Urgo", reference: "ESP-5", unit_cost: 5, is_active: true },
  { id: "m12", name: "Bolsas de Hielo Instantáneo", quantity: 45, minQuantity: 30, expiryDate: "2027-12-31", batchNumber: "B-8830", status: "OK", location: "Nevera Vestuario", kit: "Vestuario Principal", team_id: "team-acb-123", category: "crioterapia", brand: "Instant Ice", reference: "HI-01", unit_cost: 1.2, is_active: true },
  { id: "m13", name: "Desinfectante Clorhexidina 500ml", quantity: 6, minQuantity: 4, expiryDate: "2026-09-30", batchNumber: "B-9940", status: "EXPIRING_SOON", location: "Botiquín Fisioterapia", kit: "Fisioterapia", team_id: "team-acb-123", category: "desinfección", brand: "Betadine", reference: "DS-500", unit_cost: 9, is_active: true },
  { id: "m14", name: "Mascarillas RCP + Guantes (Kit 10 uds)", quantity: 3, minQuantity: 2, expiryDate: "2028-01-01", batchNumber: "B-9950", status: "OK", location: "Botiquín Partido", kit: "Botiquín Partido", team_id: "team-acb-123", category: "emergencia", brand: "Laerdal", reference: "RCP-10", unit_cost: 45, is_active: true },
  { id: "m15", name: "Electrodos TENS / EMS (Pack 4)", quantity: 12, minQuantity: 6, expiryDate: "2027-08-01", batchNumber: "B-9960", status: "OK", location: "Sala Fisioterapia", kit: "Fisioterapia", team_id: "team-acb-123", category: "electroterapia", brand: "Compex", reference: "TENS-4", unit_cost: 22, is_active: true },
];

export const initialAlerts: any[] = [
  { id: "a1", team_id: "team-acb-123", type: "stock_bajo", severity: "critical", title: "Stock Crítico", message: "Zapatillas Baloncesto Pro Bounce RMB Edition están bajo mínimos (2 unidades)", entity_type: "inventory_item", entity_id: "i4", is_read: false, is_dismissed: false, read_by: null, read_at: null, auto_generated: true, metadata: {}, created_at: "2026-06-18T08:30:00.000Z" },
  { id: "a2", team_id: "team-acb-123", type: "caducidad_proxima", severity: "warning", message: "Geles Antiinflamatorios Rápido han CADUCADO el 2026-05-10", entity_type: "medical_item", entity_id: "m3", is_read: false, is_dismissed: false, read_by: null, read_at: null, auto_generated: true, metadata: {}, created_at: "2026-06-17T10:00:00.000Z" },
  { id: "a3", team_id: "team-acb-123", type: "solicitud_pendiente", severity: "info", message: "Nueva solicitud de equipación de Facundo Campazzo", entity_type: "request", entity_id: "r1", is_read: false, is_dismissed: false, read_by: null, read_at: null, auto_generated: true, metadata: {}, created_at: "2026-06-18T09:15:00.000Z" },
  { id: "a4", team_id: "team-acb-123", type: "cumpleaños", severity: "info", title: "Cumpleaños de la Plantilla", message: "¡ALERTA DE CUMPLEAÑOS! El pívot Alex Len cumple años el 16 de Junio. Preparar lote de equipación oficial de regalo.", entity_type: "player", entity_id: "p16", is_read: false, is_dismissed: false, read_by: null, read_at: null, auto_generated: true, metadata: {}, created_at: "2026-06-16T09:00:00.000Z" },
  { id: "a5", team_id: "team-acb-123", type: "cumpleaños", severity: "info", title: "Cumpleaños de la Plantilla", message: "¡ALERTA DE CUMPLEAÑOS! El base Theo Maledon cumple años el 12 de Junio. Preparar lote de equipación oficial de regalo.", entity_type: "player", entity_id: "p5", is_read: false, is_dismissed: false, read_by: null, read_at: null, auto_generated: true, metadata: {}, created_at: "2026-06-12T09:00:00.000Z" }
];

export const initialCoachingStaff: any[] = [
  {
    id: "c1",
    full_name: "Sergio Scariolo",
    role: "Entrenador Principal",
    email: "scariolo@realmadrid.com",
    shirt_size: "L",
    shorts_size: "L",
    shoe_size: 43,
    photo_url: "https://assets.realmadrid.com/is/image/realmadrid/SERGIO-SCARIOLO_VC17787_380x501?$Desktop$&fit=wrap&wid=288&hei=384",
    nationality: "Italia",
    profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/sergio-scariolo",
    
    // Detailed fields for Premium view!
    birth_place: "Brescia, Italia",
    birth_date: "1961-04-01",
    trajectory: "Real Madrid (2025-Actualidad), Virtus Bolonia (2021-23), Entrenador asistente Toronto Raptors (2018-21), Selección española (2015-25), Laboral Kutxa (2013-14), EA7 Emporio Armani Milán (2011-13), Khimki (2008-10), Selección española (2009-12), Unicaja (2003-08), Real Madrid (1999-02), Tau Cerámica (1997-99), Bolonia (1993-97), Desio (1991-93), Scavolini de Pésaro (1989-91)",
    palmares: [
      "1 Oro Mundobasket",
      "4 Oros Eurobasket",
      "1 Plata JJOO Londres",
      "1 Bronce JJOO Río",
      "1 Bronce Eurobasket",
      "1 Campeonato de la NBA",
      "2 Ligas ACB",
      "1 Liga de Italia",
      "1 Eurocup",
      "2 Copas del Rey",
      "2 Supercopas de Italia"
    ]
  },
  { id: "c2", full_name: "Luis Guil", role: "Entrenador Ayudante", email: "guil@realmadrid.com", shirt_size: "XL", shorts_size: "L", shoe_size: 44, photo_url: "/images/staff/luis_guil.jpg", nationality: "España", profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/luis-guil" },
  { id: "c3", full_name: "Stefan Ivanovic", role: "Entrenador Ayudante", email: "ivanovic@realmadrid.com", shirt_size: "L", shorts_size: "L", shoe_size: 43, photo_url: "/images/staff/stefan_ivanovic.jpg", nationality: "Montenegro", profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/stefan-ivanovic" },
  { id: "c4", full_name: "Isidoro Calín", role: "Entrenador Ayudante", email: "calin@realmadrid.com", shirt_size: "XXL", shorts_size: "XL", shoe_size: 45, photo_url: "/images/staff/isidoro_calin.jpg", nationality: "España", profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/isidoro-calin" },
  { id: "c5", full_name: "Matteo Cassinerio", role: "Entrenador Ayudante", email: "cassinerio@realmadrid.com", shirt_size: "L", shorts_size: "L", shoe_size: 43, photo_url: "/images/staff/matteo_cassinerio.jpg", nationality: "Italia", profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/matteo-cassinerio" },
  { id: "c6", full_name: "Piti Hurtado", role: "Entrenador Ayudante (Estadística/Audiovisual)", email: "piti@realmadrid.com", shirt_size: "XL", shorts_size: "XL", shoe_size: 44, photo_url: "/images/staff/piti_hurtado.jpg", nationality: "España", profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/piti-hurtado" },
  { id: "c7", full_name: "David Jimeno", role: "Entrenador Ayudante (Mejora Individual)", email: "jimeno@realmadrid.com", shirt_size: "L", shorts_size: "L", shoe_size: 43, photo_url: "/images/staff/david_jimeno.jpg", nationality: "España", profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/david-jimeno" },
  { id: "c8", full_name: "Juan Trapero", role: "Preparador Físico", email: "trapero@realmadrid.com", shirt_size: "XL", shorts_size: "L", shoe_size: 44, photo_url: "/images/staff/juan_trapero.jpg", nationality: "España", profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/juan-trapero" }
];

class InMemoryDatabase {
  players = [...initialPlayers];
  inventory = [...initialInventory];
  requests = [...initialRequests];
  trips = [...initialTrips];
  laundry = [...initialLaundry];
  medical = [...initialMedical];
  alerts = [...initialAlerts];
  coachingStaff = [...initialCoachingStaff];
  customSizingProducts: SizingProduct[] = [];
  garmentUnits: any[] = [];
}

export const db = new InMemoryDatabase();
export type DBType = InMemoryDatabase;

export interface ClubDemoDataSlice {
  players: any[];
  inventory: any[];
  requests: any[];
  trips: any[];
  laundry: any[];
  alerts: any[];
  coachingStaff?: any[];
  garmentUnits?: any[];
}

export function loadClubDemoData(data: ClubDemoDataSlice): void {
  db.players = [...data.players];
  db.inventory = [...data.inventory];
  db.requests = [...data.requests];
  db.trips = [...data.trips];
  db.laundry = [...data.laundry];
  db.alerts = [...data.alerts];
  db.coachingStaff = [...(data.coachingStaff ?? initialCoachingStaff)];
  db.garmentUnits = [...(data.garmentUnits ?? [])];
}
