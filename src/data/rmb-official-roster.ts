// Auto-generated from realmadrid.com — 2026-07-17T09:55:29.738Z
// Source: https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla
// Regenerar: npm run sync:rm-plantilla

export interface RmbOfficialTrophyStats {
  season?: string;
  phase?: string;
  matches_played: number;
  points: number;
  rebounds: number;
  assists: number;
  minutes_played?: number;
  valuation?: number;
  steals?: number;
  blocks?: number;
  ppg?: number;
  rpg?: number;
  apg?: number;
  source?: string;
  updated_at?: string;
}

export interface RmbOfficialPlayerProfile {
  legacyId: string;
  slug: string;
  profile_url: string;
  firstName: string;
  lastName: string;
  full_name: string;
  nickname: string | null;
  dorsal: number;
  position: string | null;
  position_demo: string;
  opta_position: string | null;
  nationality: string | null;
  birth_date: string | null;
  birth_place: string | null;
  weight: string | null;
  height: string | null;
  photo_url: string | null;
  debut: string | null;
  trajectory: string;
  trajectory_items: string[];
  palmares: string[];
  matches_played: number;
  points: number;
  rebounds: number;
  assists: number;
  minutes_played: number;
  valuation: number;
  ppg: number;
  rpg: number;
  apg: number;
  competition_stats: Record<string, { stats: RmbOfficialTrophyStats }>;
}

export interface RmbOfficialStaffProfile {
  legacyId: string;
  slug: string;
  profile_url: string;
  full_name: string;
  firstName: string;
  lastName: string;
  role: string;
  nationality: string | null;
  birth_date: string | null;
  birth_place: string | null;
  photo_url: string | null;
  trajectory: string;
  trajectory_items: string[];
  palmares: string[];
}

export const RMB_OFFICIAL_SOURCE = "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla";
export const RMB_OFFICIAL_SYNCED_AT = "2026-07-17T09:55:29.738Z";

export const RMB_OFFICIAL_PLAYERS: RmbOfficialPlayerProfile[] = [
  {
    "legacyId": "p1",
    "slug": "facundo-campazzo",
    "profile_url": "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/facundo-campazzo",
    "firstName": "Facundo",
    "lastName": "Campazzo",
    "full_name": "Facundo Campazzo",
    "nickname": "Campazzo",
    "dorsal": 7,
    "position": "Base",
    "position_demo": "base",
    "opta_position": "point_guard",
    "nationality": "Argentina",
    "birth_date": "1991-03-23",
    "birth_place": "Ciudad de Córdoba (Argentina)",
    "weight": "84 kg.",
    "height": "1,81 m.",
    "photo_url": "https://assets.realmadrid.com/is/image/realmadrid/CAMPAZZO_380x501?$Desktop$&fit=wrap&wid=288&hei=384",
    "debut": "26/09/2014 Real Madrid 89-76 Valencia Basket",
    "trajectory": "Peñarol (2008-2014), Real Madrid (2014-2015), UCAM Murcia (2015-2017), Real Madrid (2017-2020), Denver Nuggets (2020-2022), Dallas Mavericks (2022), Estrella Roja (2022-2023), Real Madrid (2023- )",
    "trajectory_items": [
      "Peñarol (2008-2014)",
      "Real Madrid (2014-2015)",
      "UCAM Murcia (2015-2017)",
      "Real Madrid (2017-2020)",
      "Denver Nuggets (2020-2022)",
      "Dallas Mavericks (2022)",
      "Estrella Roja (2022-2023)",
      "Real Madrid (2023- )"
    ],
    "palmares": [
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
    ],
    "matches_played": 80,
    "points": 878,
    "rebounds": 148,
    "assists": 382,
    "minutes_played": 1876,
    "valuation": 1050,
    "ppg": 11,
    "rpg": 1.9,
    "apg": 4.8,
    "competition_stats": {
      "liga_endesa": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 31,
          "points": 289,
          "rebounds": 58,
          "assists": 142,
          "minutes_played": 695,
          "valuation": 348,
          "steals": 35,
          "blocks": 2,
          "ppg": 9.3,
          "rpg": 1.9,
          "apg": 4.6,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:54:49.146Z"
        }
      },
      "euroliga": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 44,
          "points": 528,
          "rebounds": 84,
          "assists": 224,
          "minutes_played": 1073,
          "valuation": 635,
          "steals": 50,
          "blocks": 0,
          "ppg": 12,
          "rpg": 1.9,
          "apg": 5.1,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:54:49.146Z"
        }
      },
      "supercopa_endesa": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 2,
          "points": 23,
          "rebounds": 1,
          "assists": 7,
          "minutes_played": 43,
          "valuation": 17,
          "steals": 1,
          "blocks": 0,
          "ppg": 11.5,
          "rpg": 0.5,
          "apg": 3.5,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:54:49.145Z"
        }
      },
      "copa_del_rey": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 3,
          "points": 38,
          "rebounds": 5,
          "assists": 9,
          "minutes_played": 65,
          "valuation": 50,
          "steals": 4,
          "blocks": 0,
          "ppg": 12.7,
          "rpg": 1.7,
          "apg": 3,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:54:49.146Z"
        }
      }
    }
  },
  {
    "legacyId": "p5",
    "slug": "theo-maledon",
    "profile_url": "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/theo-maledon",
    "firstName": "Théo",
    "lastName": "Maledon",
    "full_name": "Théo Maledon",
    "nickname": "Maledon",
    "dorsal": 12,
    "position": "Base",
    "position_demo": "base",
    "opta_position": "point_guard",
    "nationality": null,
    "birth_date": "2001-06-12",
    "birth_place": "Ruan (Francia)",
    "weight": "87 kg.",
    "height": "1,95 m.",
    "photo_url": "https://assets.realmadrid.com/is/image/realmadrid/MALEDON_380x501?$Desktop$&fit=wrap&wid=288&hei=384",
    "debut": null,
    "trajectory": "Cantera del SPO Rouen, Centre Federal du Basket-ball (2015-17), LDLC ASVEL Villeurbanne (2017-20), Oklahoma City Thunder (2020-21), Oklahoma City Blue (G-League) (2021-22), Charlotte Hornets (2022-23), Greensboro Swarm (G-League) (2022-23), Charlotte Hornets (2023-24), Phoenix Suns (2023-24), Sioux Fall Skyforce (G-League) (2024), LDLC ASVEL Villeurbanne (2024-25), Real Madrid (2025- )",
    "trajectory_items": [
      "Cantera del SPO Rouen",
      "Centre Federal du Basket-ball (2015-17)",
      "LDLC ASVEL Villeurbanne (2017-20)",
      "Oklahoma City Thunder (2020-21)",
      "Oklahoma City Blue (G-League) (2021-22)",
      "Charlotte Hornets (2022-23)",
      "Greensboro Swarm (G-League) (2022-23)",
      "Charlotte Hornets (2023-24)",
      "Phoenix Suns (2023-24)",
      "Sioux Fall Skyforce (G-League) (2024)",
      "LDLC ASVEL Villeurbanne (2024-25)",
      "Real Madrid (2025- )"
    ],
    "palmares": [
      "1 Liga de Francia",
      "1 Copa de Francia",
      "1 Plata Eurobasket",
      "1 Euroliga Júnior",
      "1 Oro Europeo Sub-16",
      "1 Plata Mundial Sub-17"
    ],
    "matches_played": 73,
    "points": 689,
    "rebounds": 165,
    "assists": 230,
    "minutes_played": 1321,
    "valuation": 835,
    "ppg": 9.4,
    "rpg": 2.3,
    "apg": 3.2,
    "competition_stats": {
      "liga_endesa": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 31,
          "points": 294,
          "rebounds": 74,
          "assists": 105,
          "minutes_played": 608,
          "valuation": 359,
          "steals": 15,
          "blocks": 7,
          "ppg": 9.5,
          "rpg": 2.4,
          "apg": 3.4,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:54:52.971Z"
        }
      },
      "euroliga": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 38,
          "points": 356,
          "rebounds": 84,
          "assists": 112,
          "minutes_played": 647,
          "valuation": 426,
          "steals": 20,
          "blocks": 3,
          "ppg": 9.4,
          "rpg": 2.2,
          "apg": 2.9,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:54:52.971Z"
        }
      },
      "supercopa_endesa": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 1,
          "points": 2,
          "rebounds": 0,
          "assists": 1,
          "minutes_played": 3,
          "valuation": 3,
          "steals": 0,
          "blocks": 0,
          "ppg": 2,
          "rpg": 0,
          "apg": 1,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:54:52.971Z"
        }
      },
      "copa_del_rey": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 3,
          "points": 37,
          "rebounds": 7,
          "assists": 12,
          "minutes_played": 63,
          "valuation": 47,
          "steals": 2,
          "blocks": 0,
          "ppg": 12.3,
          "rpg": 2.3,
          "apg": 4,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:54:52.971Z"
        }
      }
    }
  },
  {
    "legacyId": "p8",
    "slug": "andres-feliz",
    "profile_url": "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/andres-feliz",
    "firstName": "Andrés",
    "lastName": "Feliz",
    "full_name": "Andrés Feliz",
    "nickname": "Feliz",
    "dorsal": 24,
    "position": "Base",
    "position_demo": "base",
    "opta_position": "point_guard",
    "nationality": null,
    "birth_date": "1997-07-15",
    "birth_place": "Santo Domingo (República Dominicana)",
    "weight": "94 kg.",
    "height": "1,86 m.",
    "photo_url": "https://assets.realmadrid.com/is/image/realmadrid/FELIZ_380x501?$Desktop$&fit=wrap&wid=288&hei=384",
    "debut": null,
    "trajectory": "Northwest Florida State College (2016-2018), University of Illinois (2018-2020), C. B. Prat LEB Oro (2020-2021), Joventut (2021-2024), Real Madrid (2024- )",
    "trajectory_items": [
      "Northwest Florida State College (2016-2018)",
      "University of Illinois (2018-2020)",
      "C. B. Prat LEB Oro (2020-2021)",
      "Joventut (2021-2024)",
      "Real Madrid (2024- )"
    ],
    "palmares": [
      "1 Liga ACB",
      "1 Trofeo Mejor quinteto Liga ACB"
    ],
    "matches_played": 75,
    "points": 559,
    "rebounds": 207,
    "assists": 163,
    "minutes_played": 1271,
    "valuation": 603,
    "ppg": 7.5,
    "rpg": 2.8,
    "apg": 2.2,
    "competition_stats": {
      "liga_endesa": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 31,
          "points": 239,
          "rebounds": 86,
          "assists": 69,
          "minutes_played": 526,
          "valuation": 287,
          "steals": 19,
          "blocks": 2,
          "ppg": 7.7,
          "rpg": 2.8,
          "apg": 2.2,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:54:56.649Z"
        }
      },
      "euroliga": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 39,
          "points": 268,
          "rebounds": 99,
          "assists": 77,
          "minutes_played": 649,
          "valuation": 262,
          "steals": 23,
          "blocks": 1,
          "ppg": 6.9,
          "rpg": 2.5,
          "apg": 2,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:54:56.649Z"
        }
      },
      "supercopa_endesa": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 2,
          "points": 17,
          "rebounds": 7,
          "assists": 8,
          "minutes_played": 40,
          "valuation": 18,
          "steals": 5,
          "blocks": 0,
          "ppg": 8.5,
          "rpg": 3.5,
          "apg": 4,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:54:56.649Z"
        }
      },
      "copa_del_rey": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 3,
          "points": 35,
          "rebounds": 15,
          "assists": 9,
          "minutes_played": 56,
          "valuation": 36,
          "steals": 0,
          "blocks": 1,
          "ppg": 11.7,
          "rpg": 5,
          "apg": 3,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:54:56.649Z"
        }
      }
    }
  },
  {
    "legacyId": "p6",
    "slug": "sergio-llull-melia",
    "profile_url": "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/sergio-llull-melia",
    "firstName": "Sergio",
    "lastName": "Llull Meliá",
    "full_name": "Sergio Llull Meliá",
    "nickname": "Llull",
    "dorsal": 23,
    "position": "Base-escolta",
    "position_demo": "escolta",
    "opta_position": "guard_foreward",
    "nationality": "Espanola",
    "birth_date": "1987-11-15",
    "birth_place": "Mahón (Menorca)",
    "weight": "100 kg.",
    "height": "1,90 m.",
    "photo_url": "https://assets.realmadrid.com/is/image/realmadrid/LLULL_380x501?$Desktop$&fit=wrap&wid=288&hei=384",
    "debut": "17/05/2007  Real Madrid 84-81 Valencia Basket",
    "trajectory": "La Salle Mahón (2002-2003), CB i Unió Manresana (2003-2005), Finques Olesa (2005-2006), Ricoh Manresa (2006-2007), Real Madrid (2007- )",
    "trajectory_items": [
      "La Salle Mahón (2002-2003)",
      "CB i Unió Manresana (2003-2005)",
      "Finques Olesa (2005-2006)",
      "Ricoh Manresa (2006-2007)",
      "Real Madrid (2007- )"
    ],
    "palmares": [
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
    ],
    "matches_played": 81,
    "points": 410,
    "rebounds": 85,
    "assists": 151,
    "minutes_played": 1102,
    "valuation": 330,
    "ppg": 5.1,
    "rpg": 1,
    "apg": 1.9,
    "competition_stats": {
      "liga_endesa": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 36,
          "points": 250,
          "rebounds": 47,
          "assists": 88,
          "minutes_played": 599,
          "valuation": 221,
          "steals": 14,
          "blocks": 0,
          "ppg": 6.9,
          "rpg": 1.3,
          "apg": 2.4,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:55:00.580Z"
        }
      },
      "euroliga": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 40,
          "points": 124,
          "rebounds": 30,
          "assists": 59,
          "minutes_played": 426,
          "valuation": 76,
          "steals": 6,
          "blocks": 0,
          "ppg": 3.1,
          "rpg": 0.8,
          "apg": 1.5,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:55:00.580Z"
        }
      },
      "supercopa_endesa": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 2,
          "points": 21,
          "rebounds": 2,
          "assists": 1,
          "minutes_played": 37,
          "valuation": 18,
          "steals": 1,
          "blocks": 0,
          "ppg": 10.5,
          "rpg": 1,
          "apg": 0.5,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:55:00.580Z"
        }
      },
      "copa_del_rey": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 3,
          "points": 15,
          "rebounds": 6,
          "assists": 3,
          "minutes_played": 40,
          "valuation": 15,
          "steals": 4,
          "blocks": 0,
          "ppg": 5,
          "rpg": 2,
          "apg": 1,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:55:00.580Z"
        }
      }
    }
  },
  {
    "legacyId": "p10",
    "slug": "alberto-abalde-diaz",
    "profile_url": "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/alberto-abalde-diaz",
    "firstName": "Alberto",
    "lastName": "Abalde Díaz",
    "full_name": "Alberto Abalde Díaz",
    "nickname": "Abalde",
    "dorsal": 6,
    "position": "Alero",
    "position_demo": "alero",
    "opta_position": "foreward",
    "nationality": "Espanola",
    "birth_date": "1995-12-15",
    "birth_place": "Ferrol",
    "weight": "92 kg.",
    "height": "2,02 m.",
    "photo_url": "https://assets.realmadrid.com/is/image/realmadrid/ABALDE_380x501?$Desktop$&fit=wrap&wid=288&hei=384",
    "debut": "12/09/2020 Tenerife 79-92 Real Madrid",
    "trajectory": "Joventut (2013-2017), Valencia Basket (2017-2020), Real Madrid (2020- )",
    "trajectory_items": [
      "Joventut (2013-2017)",
      "Valencia Basket (2017-2020)",
      "Real Madrid (2020- )"
    ],
    "palmares": [
      "1 Copa de Europa",
      "3 Ligas ACB",
      "1 Copa del Rey",
      "4 Supercopas de España",
      "1 Eurocup",
      "2 Platas Europeo Sub-20"
    ],
    "matches_played": 79,
    "points": 379,
    "rebounds": 122,
    "assists": 93,
    "minutes_played": 1265,
    "valuation": 332,
    "ppg": 4.8,
    "rpg": 1.5,
    "apg": 1.2,
    "competition_stats": {
      "liga_endesa": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 32,
          "points": 167,
          "rebounds": 47,
          "assists": 37,
          "minutes_played": 523,
          "valuation": 159,
          "steals": 16,
          "blocks": 1,
          "ppg": 5.2,
          "rpg": 1.5,
          "apg": 1.2,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:55:03.932Z"
        }
      },
      "euroliga": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 42,
          "points": 192,
          "rebounds": 66,
          "assists": 53,
          "minutes_played": 654,
          "valuation": 158,
          "steals": 18,
          "blocks": 1,
          "ppg": 4.6,
          "rpg": 1.6,
          "apg": 1.3,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:55:03.932Z"
        }
      },
      "supercopa_endesa": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 2,
          "points": 8,
          "rebounds": 5,
          "assists": 0,
          "minutes_played": 34,
          "valuation": 5,
          "steals": 0,
          "blocks": 0,
          "ppg": 4,
          "rpg": 2.5,
          "apg": 0,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:55:03.932Z"
        }
      },
      "copa_del_rey": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 3,
          "points": 12,
          "rebounds": 4,
          "assists": 3,
          "minutes_played": 54,
          "valuation": 10,
          "steals": 0,
          "blocks": 0,
          "ppg": 4,
          "rpg": 1.3,
          "apg": 1,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:55:03.932Z"
        }
      }
    }
  },
  {
    "legacyId": "p11",
    "slug": "gabriele-procida",
    "profile_url": "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/gabriele-procida",
    "firstName": "Gabriele",
    "lastName": "Procida",
    "full_name": "Gabriele Procida",
    "nickname": "Procida",
    "dorsal": 9,
    "position": "Alero",
    "position_demo": "alero",
    "opta_position": "foreward",
    "nationality": null,
    "birth_date": "2002-06-01",
    "birth_place": "Como (Italia)",
    "weight": "91 kg.",
    "height": "2,01 m.",
    "photo_url": "https://assets.realmadrid.com/is/image/realmadrid/PROCIDA_380x501?$Desktop$&fit=wrap&wid=288&hei=384",
    "debut": null,
    "trajectory": "Pallacanestro Cantú (2019-2021), Fortitudo Bologna (2021-2022), Alba Berlín (2022-2025), Real Madrid (2025- )",
    "trajectory_items": [
      "Pallacanestro Cantú (2019-2021)",
      "Fortitudo Bologna (2021-2022)",
      "Alba Berlín (2022-2025)",
      "Real Madrid (2025- )"
    ],
    "palmares": [
      "1 Rising Star Euroliga"
    ],
    "matches_played": 38,
    "points": 203,
    "rebounds": 53,
    "assists": 21,
    "minutes_played": 465,
    "valuation": 174,
    "ppg": 5.3,
    "rpg": 1.4,
    "apg": 0.6,
    "competition_stats": {
      "liga_endesa": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 29,
          "points": 187,
          "rebounds": 47,
          "assists": 20,
          "minutes_played": 417,
          "valuation": 169,
          "steals": 15,
          "blocks": 4,
          "ppg": 6.4,
          "rpg": 1.6,
          "apg": 0.7,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:55:06.998Z"
        }
      },
      "euroliga": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 8,
          "points": 13,
          "rebounds": 4,
          "assists": 1,
          "minutes_played": 40,
          "valuation": 7,
          "steals": 0,
          "blocks": 0,
          "ppg": 1.6,
          "rpg": 0.5,
          "apg": 0.1,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:55:06.998Z"
        }
      },
      "supercopa_endesa": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 1,
          "points": 3,
          "rebounds": 2,
          "assists": 0,
          "minutes_played": 8,
          "valuation": -2,
          "steals": 0,
          "blocks": 0,
          "ppg": 3,
          "rpg": 2,
          "apg": 0,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:55:06.998Z"
        }
      },
      "copa_del_rey": {
        "stats": {
          "season": "2025-2026",
          "matches_played": 0,
          "points": 0,
          "rebounds": 0,
          "assists": 0,
          "minutes_played": 0,
          "valuation": 0,
          "ppg": 0,
          "rpg": 0,
          "apg": 0
        }
      }
    }
  },
  {
    "legacyId": "p3",
    "slug": "mario-hezonja",
    "profile_url": "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/mario-hezonja",
    "firstName": "Mario",
    "lastName": "Hezonja",
    "full_name": "Mario Hezonja",
    "nickname": "Hezonja",
    "dorsal": 11,
    "position": "Alero",
    "position_demo": "alero",
    "opta_position": "foreward",
    "nationality": "Croata",
    "birth_date": "1995-02-25",
    "birth_place": "Dubrovnik (Croacia)",
    "weight": "110 kg.",
    "height": "2,06 m.",
    "photo_url": "https://assets.realmadrid.com/is/image/realmadrid/HEZONJA_380x501?$Desktop$&fit=wrap&wid=288&hei=384",
    "debut": "24/09/2022 Betis 69-100 Real Madrid",
    "trajectory": "KK Dubrovnik (2008-2010), KK Zagreb (2010-2012), Barcelona (2012-2015), Orlando Magic (2015-2018), New York Knicks (2018-2019), Portland Trail Blazers (2019-2020), Panathinaikos (2020-2021), Unics Kazan (2021-2022), Real Madrid (2022-)",
    "trajectory_items": [
      "KK Dubrovnik (2008-2010)",
      "KK Zagreb (2010-2012)",
      "Barcelona (2012-2015)",
      "Orlando Magic (2015-2018)",
      "New York Knicks (2018-2019)",
      "Portland Trail Blazers (2019-2020)",
      "Panathinaikos (2020-2021)",
      "Unics Kazan (2021-2022)",
      "Real Madrid (2022-)"
    ],
    "palmares": [
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
    ],
    "matches_played": 80,
    "points": 1203,
    "rebounds": 348,
    "assists": 172,
    "minutes_played": 1852,
    "valuation": 1187,
    "ppg": 15,
    "rpg": 4.3,
    "apg": 2.1,
    "competition_stats": {
      "liga_endesa": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 31,
          "points": 543,
          "rebounds": 151,
          "assists": 58,
          "minutes_played": 741,
          "valuation": 591,
          "steals": 29,
          "blocks": 2,
          "ppg": 17.5,
          "rpg": 4.9,
          "apg": 1.9,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:55:10.322Z"
        }
      },
      "euroliga": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 44,
          "points": 587,
          "rebounds": 178,
          "assists": 106,
          "minutes_played": 995,
          "valuation": 544,
          "steals": 37,
          "blocks": 2,
          "ppg": 13.3,
          "rpg": 4,
          "apg": 2.4,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:55:10.322Z"
        }
      },
      "supercopa_endesa": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 2,
          "points": 21,
          "rebounds": 11,
          "assists": 1,
          "minutes_played": 44,
          "valuation": 16,
          "steals": 0,
          "blocks": 0,
          "ppg": 10.5,
          "rpg": 5.5,
          "apg": 0.5,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:55:10.322Z"
        }
      },
      "copa_del_rey": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 3,
          "points": 52,
          "rebounds": 8,
          "assists": 7,
          "minutes_played": 72,
          "valuation": 36,
          "steals": 1,
          "blocks": 0,
          "ppg": 17.3,
          "rpg": 2.7,
          "apg": 2.3,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:55:10.322Z"
        }
      }
    }
  },
  {
    "legacyId": "p4",
    "slug": "gabriel-deck",
    "profile_url": "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/gabriel-deck",
    "firstName": "Gabriel",
    "lastName": "Deck",
    "full_name": "Gabriel Deck",
    "nickname": "Deck",
    "dorsal": 14,
    "position": "Alero",
    "position_demo": "alero",
    "opta_position": "foreward",
    "nationality": "Argentina",
    "birth_date": "1995-02-08",
    "birth_place": "Colonia Dora (Argentina)",
    "weight": "101 kg.",
    "height": "1,98 m.",
    "photo_url": "https://assets.realmadrid.com/is/image/realmadrid/DECK_380x501?$Desktop$&fit=wrap&wid=288&hei=384",
    "debut": "21/09/2018 Obradoiro 61-81 Real Madrid",
    "trajectory": "Quimsa (2009-2016), San Lorenzo de Almagro (2016-2018), Real Madrid (2018-2021), Oklahoma City Thunders (2021), Real Madrid (2022-)",
    "trajectory_items": [
      "Quimsa (2009-2016)",
      "San Lorenzo de Almagro (2016-2018)",
      "Real Madrid (2018-2021)",
      "Oklahoma City Thunders (2021)",
      "Real Madrid (2022-)"
    ],
    "palmares": [
      "1 Copa de Europa",
      "4 Ligas ACB",
      "2 Copas del Rey",
      "5 Supercopas de España",
      "1 Oro AmeriCup",
      "1 Oro Juegos Panamericanos",
      "1 Plata Mundial",
      "2 Platas Americup",
      "3 Ligas Argentinas",
      "1 Liga de las Américas",
      "1 Liga Sudamericana de Clubes",
      "1 MVP de la AmeriCup",
      "2 Trofeos MVP de la Final de la Liga argentina",
      "1 MVP de la Liga argentina",
      "1 MVP de la Liga de las Américas",
      "1 Mejor quinteto de la Americup",
      "2 Trofeos Mejor Quinteto de la Liga Argentina"
    ],
    "matches_played": 66,
    "points": 489,
    "rebounds": 231,
    "assists": 70,
    "minutes_played": 1389,
    "valuation": 590,
    "ppg": 7.4,
    "rpg": 3.5,
    "apg": 1.1,
    "competition_stats": {
      "liga_endesa": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 20,
          "points": 147,
          "rebounds": 67,
          "assists": 17,
          "minutes_played": 442,
          "valuation": 159,
          "steals": 12,
          "blocks": 3,
          "ppg": 7.3,
          "rpg": 3.4,
          "apg": 0.8,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:55:13.833Z"
        }
      },
      "euroliga": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 41,
          "points": 290,
          "rebounds": 145,
          "assists": 49,
          "minutes_played": 837,
          "valuation": 358,
          "steals": 16,
          "blocks": 2,
          "ppg": 7.1,
          "rpg": 3.5,
          "apg": 1.2,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:55:13.833Z"
        }
      },
      "supercopa_endesa": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 2,
          "points": 23,
          "rebounds": 9,
          "assists": 2,
          "minutes_played": 46,
          "valuation": 34,
          "steals": 2,
          "blocks": 0,
          "ppg": 11.5,
          "rpg": 4.5,
          "apg": 1,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:55:13.833Z"
        }
      },
      "copa_del_rey": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 3,
          "points": 29,
          "rebounds": 10,
          "assists": 2,
          "minutes_played": 64,
          "valuation": 39,
          "steals": 2,
          "blocks": 2,
          "ppg": 9.7,
          "rpg": 3.3,
          "apg": 0.7,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:55:13.833Z"
        }
      }
    }
  },
  {
    "legacyId": "p18",
    "slug": "jaime-pradilla-gayan",
    "profile_url": "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/jaime-pradilla-gayan",
    "firstName": "Jaime",
    "lastName": "Pradilla Gayán",
    "full_name": "Jaime Pradilla Gayán",
    "nickname": "Pradilla",
    "dorsal": 4,
    "position": "Ala-pívot",
    "position_demo": "ala-pivot",
    "opta_position": "center_foreward",
    "nationality": "Española",
    "birth_date": "2001-01-03",
    "birth_place": "Zaragoza (España)",
    "weight": "105 kg.",
    "height": "2,05 m.",
    "photo_url": "https://assets.realmadrid.com/is/image/realmadrid/PRADILLA_380x501 – 1?$Desktop$&fit=wrap&wid=288&hei=384",
    "debut": null,
    "trajectory": "Casademont Zaragoza (2018-2019), Palencia Basket (2019-2020), Valencia Basket (2020-2026), Real Madrid (2026- )",
    "trajectory_items": [
      "Casademont Zaragoza (2018-2019)",
      "Palencia Basket (2019-2020)",
      "Valencia Basket (2020-2026)",
      "Real Madrid (2026- )"
    ],
    "palmares": [
      "1 Liga ACB",
      "1 Supercopa de España",
      "1 Oro Eurobasket",
      "1 Oro Europeo Sub-18",
      "1 Oro Europeo Sub-16"
    ],
    "matches_played": 0,
    "points": 0,
    "rebounds": 0,
    "assists": 0,
    "minutes_played": 0,
    "valuation": 0,
    "ppg": 0,
    "rpg": 0,
    "apg": 0,
    "competition_stats": {
      "liga_endesa": {
        "stats": {
          "season": "2025-2026",
          "matches_played": 0,
          "points": 0,
          "rebounds": 0,
          "assists": 0,
          "minutes_played": 0,
          "valuation": 0,
          "ppg": 0,
          "rpg": 0,
          "apg": 0
        }
      },
      "euroliga": {
        "stats": {
          "season": "2025-2026",
          "matches_played": 0,
          "points": 0,
          "rebounds": 0,
          "assists": 0,
          "minutes_played": 0,
          "valuation": 0,
          "ppg": 0,
          "rpg": 0,
          "apg": 0
        }
      },
      "supercopa_endesa": {
        "stats": {
          "season": "2025-2026",
          "matches_played": 0,
          "points": 0,
          "rebounds": 0,
          "assists": 0,
          "minutes_played": 0,
          "valuation": 0,
          "ppg": 0,
          "rpg": 0,
          "apg": 0
        }
      },
      "copa_del_rey": {
        "stats": {
          "season": "2025-2026",
          "matches_played": 0,
          "points": 0,
          "rebounds": 0,
          "assists": 0,
          "minutes_played": 0,
          "valuation": 0,
          "ppg": 0,
          "rpg": 0,
          "apg": 0
        }
      }
    }
  },
  {
    "legacyId": "p13",
    "slug": "chukwuma-julian-okeke",
    "profile_url": "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/chukwuma-julian-okeke",
    "firstName": "Chukwuma Julian",
    "lastName": "Okeke ",
    "full_name": "Chukwuma Julian Okeke",
    "nickname": "Okeke",
    "dorsal": 8,
    "position": "Ala-pívot",
    "position_demo": "ala-pivot",
    "opta_position": "center_foreward",
    "nationality": null,
    "birth_date": "1998-08-18",
    "birth_place": "Atlanta (Estados Unidos)",
    "weight": "109 kg.",
    "height": "2,01 m. ",
    "photo_url": "https://assets.realmadrid.com/is/image/realmadrid/OKEKE_380x501?$Desktop$&fit=wrap&wid=288&hei=384",
    "debut": null,
    "trajectory": "Westlake High School de Atlanta, Universidad de Auburn (2017-19), Orlando Magic (2020-24), Lakeland Magic (2022-23), Westchester Knicks (2024-25), Philadelphia 76ers (2025), Cleveland Cavaliers (2025), Real Madrid (2025-)",
    "trajectory_items": [
      "Westlake High School de Atlanta",
      "Universidad de Auburn (2017-19)",
      "Orlando Magic (2020-24)",
      "Lakeland Magic (2022-23)",
      "Westchester Knicks (2024-25)",
      "Philadelphia 76ers (2025)",
      "Cleveland Cavaliers (2025)",
      "Real Madrid (2025-)"
    ],
    "palmares": [],
    "matches_played": 69,
    "points": 411,
    "rebounds": 264,
    "assists": 56,
    "minutes_played": 1280,
    "valuation": 549,
    "ppg": 6,
    "rpg": 3.8,
    "apg": 0.8,
    "competition_stats": {
      "liga_endesa": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 25,
          "points": 167,
          "rebounds": 90,
          "assists": 21,
          "minutes_played": 489,
          "valuation": 200,
          "steals": 18,
          "blocks": 8,
          "ppg": 6.7,
          "rpg": 3.6,
          "apg": 0.8,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:55:21.098Z"
        }
      },
      "euroliga": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 43,
          "points": 242,
          "rebounds": 167,
          "assists": 34,
          "minutes_played": 770,
          "valuation": 342,
          "steals": 25,
          "blocks": 21,
          "ppg": 5.6,
          "rpg": 3.9,
          "apg": 0.8,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:55:21.098Z"
        }
      },
      "supercopa_endesa": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 1,
          "points": 2,
          "rebounds": 7,
          "assists": 1,
          "minutes_played": 21,
          "valuation": 7,
          "steals": 1,
          "blocks": 1,
          "ppg": 2,
          "rpg": 7,
          "apg": 1,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:55:21.098Z"
        }
      },
      "copa_del_rey": {
        "stats": {
          "season": "2025-2026",
          "matches_played": 0,
          "points": 0,
          "rebounds": 0,
          "assists": 0,
          "minutes_played": 0,
          "valuation": 0,
          "ppg": 0,
          "rpg": 0,
          "apg": 0
        }
      }
    }
  },
  {
    "legacyId": "p14",
    "slug": "izan-almansa",
    "profile_url": "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/izan-almansa",
    "firstName": "Izan",
    "lastName": "Almansa",
    "full_name": "Izan Almansa",
    "nickname": "Almansa",
    "dorsal": 13,
    "position": "Ala-pívot",
    "position_demo": "ala-pivot",
    "opta_position": "center_foreward",
    "nationality": null,
    "birth_date": "2005-06-07",
    "birth_place": "Murcia (España)",
    "weight": "105 kg.",
    "height": "2,07 m.",
    "photo_url": "https://assets.realmadrid.com/is/image/realmadrid/ALMANSA_380x501?$Desktop$&fit=wrap&wid=288&hei=384",
    "debut": null,
    "trajectory": "Cantera del UCAM Murcia (2016-2019), Cantera del Real Madrid (2019-2021), -Cadete B (2019-2020)-, -Cadete A (2020-2021), Overtime Elite (2021-2022), YNG Dreamerz (2022-2023), G League Ignite (2023-2024), Perth Wildcats (2024-2025), Real Madrid (2025- )",
    "trajectory_items": [
      "Cantera del UCAM Murcia (2016-2019)",
      "Cantera del Real Madrid (2019-2021)",
      "-Cadete B (2019-2020)-",
      "-Cadete A (2020-2021)",
      "Overtime Elite (2021-2022)",
      "YNG Dreamerz (2022-2023)",
      "G League Ignite (2023-2024)",
      "Perth Wildcats (2024-2025)",
      "Real Madrid (2025- )"
    ],
    "palmares": [
      "1 Liga U",
      "1 Oro Mundial sub-19",
      "1 Oro Europeo sub-18"
    ],
    "matches_played": 22,
    "points": 99,
    "rebounds": 44,
    "assists": 7,
    "minutes_played": 209,
    "valuation": 108,
    "ppg": 4.5,
    "rpg": 2,
    "apg": 0.3,
    "competition_stats": {
      "liga_endesa": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 19,
          "points": 97,
          "rebounds": 44,
          "assists": 7,
          "minutes_played": 199,
          "valuation": 110,
          "steals": 4,
          "blocks": 5,
          "ppg": 5.1,
          "rpg": 2.3,
          "apg": 0.4,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:55:24.237Z"
        }
      },
      "euroliga": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 3,
          "points": 2,
          "rebounds": 0,
          "assists": 0,
          "minutes_played": 10,
          "valuation": -2,
          "steals": 0,
          "blocks": 0,
          "ppg": 0.7,
          "rpg": 0,
          "apg": 0,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:55:24.237Z"
        }
      },
      "supercopa_endesa": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 0,
          "points": 0,
          "rebounds": 0,
          "assists": 0,
          "minutes_played": 0,
          "valuation": 0,
          "steals": 0,
          "blocks": 0,
          "ppg": 0,
          "rpg": 0,
          "apg": 0,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:55:24.237Z"
        }
      },
      "copa_del_rey": {
        "stats": {
          "season": "2025-2026",
          "matches_played": 0,
          "points": 0,
          "rebounds": 0,
          "assists": 0,
          "minutes_played": 0,
          "valuation": 0,
          "ppg": 0,
          "rpg": 0,
          "apg": 0
        }
      }
    }
  },
  {
    "legacyId": "p7",
    "slug": "usman-garuba",
    "profile_url": "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/usman-garuba",
    "firstName": "Usman",
    "lastName": "Garuba",
    "full_name": "Usman Garuba",
    "nickname": "Garuba",
    "dorsal": 16,
    "position": "Ala-pívot",
    "position_demo": "ala-pivot",
    "opta_position": "center_foreward",
    "nationality": null,
    "birth_date": "2002-03-09",
    "birth_place": "Madrid",
    "weight": "116 kg.",
    "height": "2,03 m.",
    "photo_url": "https://assets.realmadrid.com/is/image/realmadrid/GARUBA_380x501?$Desktop$&fit=wrap&wid=288&hei=384",
    "debut": "28/10/2018 Real Madrid 90-77 San Pablo Burgos",
    "trajectory": "-Azuqueca C.B. (2012-2013), -Categorías inferiores del Real Madrid (2013-2019), -Real Madrid (2019-2021), -Houston Rockets (2021-2023), -Rio Grande Valley Vipers G-League (2021-2022), -Golden State Warriors (2023-2024), -Santa Cruz Warriors G-League (2023-2024), -Real Madrid (2024- )",
    "trajectory_items": [
      "-Azuqueca C.B. (2012-2013)",
      "-Categorías inferiores del Real Madrid (2013-2019)",
      "-Real Madrid (2019-2021)",
      "-Houston Rockets (2021-2023)",
      "-Rio Grande Valley Vipers G-League (2021-2022)",
      "-Golden State Warriors (2023-2024)",
      "-Santa Cruz Warriors G-League (2023-2024)",
      "-Real Madrid (2024- )"
    ],
    "palmares": [
      "2 Ligas ACB",
      "1 Copa del Rey",
      "2 Supercopas de España",
      "1 Oro Eurobasket",
      "1 Euroliga Júnior",
      "1 Rising Star Euroliga",
      "1 Mejor joven Liga ACB"
    ],
    "matches_played": 71,
    "points": 377,
    "rebounds": 213,
    "assists": 44,
    "minutes_played": 901,
    "valuation": 475,
    "ppg": 5.3,
    "rpg": 3,
    "apg": 0.6,
    "competition_stats": {
      "liga_endesa": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 26,
          "points": 140,
          "rebounds": 82,
          "assists": 20,
          "minutes_played": 335,
          "valuation": 186,
          "steals": 21,
          "blocks": 21,
          "ppg": 5.4,
          "rpg": 3.2,
          "apg": 0.8,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:55:27.537Z"
        }
      },
      "euroliga": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 40,
          "points": 210,
          "rebounds": 110,
          "assists": 21,
          "minutes_played": 500,
          "valuation": 256,
          "steals": 30,
          "blocks": 27,
          "ppg": 5.3,
          "rpg": 2.8,
          "apg": 0.5,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:55:27.537Z"
        }
      },
      "supercopa_endesa": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 2,
          "points": 7,
          "rebounds": 7,
          "assists": 1,
          "minutes_played": 23,
          "valuation": 10,
          "steals": 3,
          "blocks": 1,
          "ppg": 3.5,
          "rpg": 3.5,
          "apg": 0.5,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:55:27.536Z"
        }
      },
      "copa_del_rey": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 3,
          "points": 20,
          "rebounds": 14,
          "assists": 2,
          "minutes_played": 43,
          "valuation": 23,
          "steals": 0,
          "blocks": 1,
          "ppg": 6.7,
          "rpg": 4.7,
          "apg": 0.7,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:55:27.537Z"
        }
      }
    }
  },
  {
    "legacyId": "p2",
    "slug": "walter-samuel-tavares-da-veiga",
    "profile_url": "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/walter-samuel-tavares-da-veiga",
    "firstName": "Walter Samuel",
    "lastName": "Tavares da Veiga",
    "full_name": "Walter Samuel Tavares da Veiga",
    "nickname": "Tavares",
    "dorsal": 22,
    "position": "Pívot",
    "position_demo": "pivot",
    "opta_position": "center",
    "nationality": "Caboverdiano",
    "birth_date": "1992-03-22",
    "birth_place": "Maio (Cabo Verde)",
    "weight": "125 kg.",
    "height": "2,20 m.",
    "photo_url": "https://assets.realmadrid.com/is/image/realmadrid/TAVARES_380x501?$Desktop$&fit=wrap&wid=288&hei=384",
    "debut": "12/11/2017 Real Madrid 80-84 Barcelona",
    "trajectory": "UB La Palma. LEB Oro. (2011-2012), Herbalife Gran Canaria (2012-2015), Atlanta Hawks (2015-2016), Austin Spurs G-League (2015-2016), Canton Charge G-League (2015-2016), Bakersfield Jam G-League (2015-2016), Raptors 905 G-League (2016-2017), Cleveland Cavaliers (2016-2017), Raptors 905 G-League (2017), Real Madrid (2017- )",
    "trajectory_items": [
      "UB La Palma. LEB Oro. (2011-2012)",
      "Herbalife Gran Canaria (2012-2015)",
      "Atlanta Hawks (2015-2016)",
      "Austin Spurs G-League (2015-2016)",
      "Canton Charge G-League (2015-2016)",
      "Bakersfield Jam G-League (2015-2016)",
      "Raptors 905 G-League (2016-2017)",
      "Cleveland Cavaliers (2016-2017)",
      "Raptors 905 G-League (2017)",
      "Real Madrid (2017- )"
    ],
    "palmares": [
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
    ],
    "matches_played": 65,
    "points": 615,
    "rebounds": 424,
    "assists": 37,
    "minutes_played": 1449,
    "valuation": 1026,
    "ppg": 9.5,
    "rpg": 6.5,
    "apg": 0.6,
    "competition_stats": {
      "liga_endesa": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 21,
          "points": 196,
          "rebounds": 134,
          "assists": 10,
          "minutes_played": 456,
          "valuation": 345,
          "steals": 16,
          "blocks": 46,
          "ppg": 9.3,
          "rpg": 6.4,
          "apg": 0.5,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:55:28.679Z"
        }
      },
      "euroliga": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 39,
          "points": 373,
          "rebounds": 258,
          "assists": 22,
          "minutes_played": 888,
          "valuation": 603,
          "steals": 22,
          "blocks": 72,
          "ppg": 9.6,
          "rpg": 6.6,
          "apg": 0.6,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:55:28.679Z"
        }
      },
      "supercopa_endesa": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 2,
          "points": 15,
          "rebounds": 14,
          "assists": 2,
          "minutes_played": 42,
          "valuation": 25,
          "steals": 1,
          "blocks": 5,
          "ppg": 7.5,
          "rpg": 7,
          "apg": 1,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:55:28.679Z"
        }
      },
      "copa_del_rey": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 3,
          "points": 31,
          "rebounds": 18,
          "assists": 3,
          "minutes_played": 63,
          "valuation": 53,
          "steals": 1,
          "blocks": 4,
          "ppg": 10.3,
          "rpg": 6,
          "apg": 1,
          "source": "realmadrid.com",
          "updated_at": "2026-07-17T09:55:28.679Z"
        }
      }
    }
  }
];

export const RMB_OFFICIAL_STAFF: RmbOfficialStaffProfile[] = [
  {
    "legacyId": "c1",
    "slug": "pedro-martinez",
    "profile_url": "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/pedro-martinez",
    "full_name": "Pedro Martínez",
    "firstName": "Pedro",
    "lastName": "Martínez",
    "role": "Entrenador",
    "nationality": null,
    "birth_date": "1961-06-29",
    "birth_place": "Barcelona, España",
    "photo_url": "https://assets.realmadrid.com/is/image/realmadrid/PEDRO MARTINEZ_380x501-1?$Desktop$&fit=wrap&wid=288&hei=384",
    "trajectory": "Joventut categorías inferiores (1986-89), Joventut entrenador ayudante (1989-90), Joventut (1990), Manresa (1990-94), Joventut (1994-95), Salamanca (1995-96), Granada (1997-98), Menorca (1999-00), Ourense (2001), Tenerife (2001-02), Gran Canaria (2002-05), Baskonia (2005), Estudiantes (2006-07), Girona (2007-08), Cajasol (2008-09), Gran Canaria (2009-14), Manresa (2014-15), Valencia Basket (20015-17), Baskonia (2017-18), Gran Canaria (2019), Manresa (2019-24), Valencia Basket (2024-26), Real Madrid (2026- )",
    "trajectory_items": [
      "Joventut categorías inferiores (1986-89)",
      "Joventut entrenador ayudante (1989-90)",
      "Joventut (1990)",
      "Manresa (1990-94)",
      "Joventut (1994-95)",
      "Salamanca (1995-96)",
      "Granada (1997-98)",
      "Menorca (1999-00)",
      "Ourense (2001)",
      "Tenerife (2001-02)",
      "Gran Canaria (2002-05)",
      "Baskonia (2005)",
      "Estudiantes (2006-07)",
      "Girona (2007-08)",
      "Cajasol (2008-09)",
      "Gran Canaria (2009-14)",
      "Manresa (2014-15)",
      "Valencia Basket (20015-17)",
      "Baskonia (2017-18)",
      "Gran Canaria (2019)",
      "Manresa (2019-24)",
      "Valencia Basket (2024-26)",
      "Real Madrid (2026- )"
    ],
    "palmares": [
      "2 Ligas ACB",
      "2 Supercopas de España",
      "1 Copa Korac"
    ]
  }
];

export function getOfficialPlayerByLegacyId(legacyId: string): RmbOfficialPlayerProfile | null {
  return RMB_OFFICIAL_PLAYERS.find((p) => p.legacyId === legacyId) ?? null;
}

export function getOfficialPlayerBySlug(slug: string): RmbOfficialPlayerProfile | null {
  return RMB_OFFICIAL_PLAYERS.find((p) => p.slug === slug) ?? null;
}

export function getOfficialStaffByLegacyId(legacyId: string): RmbOfficialStaffProfile | null {
  return RMB_OFFICIAL_STAFF.find((s) => s.legacyId === legacyId) ?? null;
}
