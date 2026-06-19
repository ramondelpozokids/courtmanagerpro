// Auto-generated from realmadrid.com — 2026-06-19T07:49:18.397Z
// Regenerar: node scripts/sync-rm-roster-stats.mjs

import type { PlayerCompetitionMap } from '@/lib/player-competitions';

export interface RmbOfficialPlayerRecord {
  slug: string;
  profile_url: string;
  full_name: string;
  dorsal: number;
  position: string;
  nationality: string | null;
  birth_date: string | null;
  birth_place: string | null;
  weight: string | null;
  height: string | null;
  photo_url: string | null;
  matches_played: number;
  points: number;
  rebounds: number;
  assists: number;
  minutes_played: number;
  valuation: number;
  ppg: number;
  rpg: number;
  apg: number;
  competition_stats: PlayerCompetitionMap;
}

export const RMB_OFFICIAL_STATS: Record<string, RmbOfficialPlayerRecord> = {
  "p1": {
    "slug": "facundo-campazzo",
    "profile_url": "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/facundo-campazzo",
    "full_name": "Facundo Campazzo",
    "dorsal": 7,
    "position": "Base",
    "nationality": "argentina",
    "birth_date": "1991-03-23",
    "birth_place": "Ciudad de Córdoba (Argentina)",
    "weight": "84 kg.",
    "height": "1,81 m.",
    "photo_url": "https://assets.realmadrid.com/is/image/realmadrid/CAMPAZZO_oscurecido_380x501",
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
          "updated_at": "2026-06-19T07:49:17.844Z"
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
          "updated_at": "2026-06-19T07:49:17.844Z"
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
          "updated_at": "2026-06-19T07:49:17.843Z"
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
          "updated_at": "2026-06-19T07:49:17.844Z"
        }
      }
    }
  },
  "p2": {
    "slug": "walter-samuel-tavares-da-veiga",
    "profile_url": "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/walter-samuel-tavares-da-veiga",
    "full_name": "Walter Samuel Tavares da Veiga",
    "dorsal": 22,
    "position": "Pívot",
    "nationality": "caboverdiano",
    "birth_date": "1992-03-22",
    "birth_place": "Maio (Cabo Verde)",
    "weight": "125 kg.",
    "height": "2,20 m.",
    "photo_url": "https://assets.realmadrid.com/is/image/realmadrid/TAVARES_oscurecido_380x501",
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
          "updated_at": "2026-06-19T07:49:17.895Z"
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
          "updated_at": "2026-06-19T07:49:17.895Z"
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
          "updated_at": "2026-06-19T07:49:17.895Z"
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
          "updated_at": "2026-06-19T07:49:17.895Z"
        }
      }
    }
  },
  "p3": {
    "slug": "mario-hezonja",
    "profile_url": "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/mario-hezonja",
    "full_name": "Mario Hezonja",
    "dorsal": 11,
    "position": "Alero",
    "nationality": "croata",
    "birth_date": "1995-02-25",
    "birth_place": "Dubrovnik (Croacia)",
    "weight": "110 kg.",
    "height": "2,06 m.",
    "photo_url": "https://assets.realmadrid.com/is/image/realmadrid/HEZONJA_oscurecido_380x501",
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
          "updated_at": "2026-06-19T07:49:17.932Z"
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
          "updated_at": "2026-06-19T07:49:17.932Z"
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
          "updated_at": "2026-06-19T07:49:17.931Z"
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
          "updated_at": "2026-06-19T07:49:17.931Z"
        }
      }
    }
  },
  "p4": {
    "slug": "gabriel-deck",
    "profile_url": "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/gabriel-deck",
    "full_name": "Gabriel Deck",
    "dorsal": 14,
    "position": "Alero",
    "nationality": "argentina",
    "birth_date": "1995-02-08",
    "birth_place": "Colonia Dora (Argentina)",
    "weight": "101 kg.",
    "height": "1,98 m.",
    "photo_url": "https://assets.realmadrid.com/is/image/realmadrid/DECK_oscurecido_380x501",
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
          "updated_at": "2026-06-19T07:49:17.968Z"
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
          "updated_at": "2026-06-19T07:49:17.968Z"
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
          "updated_at": "2026-06-19T07:49:17.968Z"
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
          "updated_at": "2026-06-19T07:49:17.968Z"
        }
      }
    }
  },
  "p5": {
    "slug": "theo-maledon",
    "profile_url": "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/theo-maledon",
    "full_name": "Théo Maledon",
    "dorsal": 12,
    "position": "Base",
    "nationality": null,
    "birth_date": "2001-06-12",
    "birth_place": "Ruan (Francia)",
    "weight": "87 kg.",
    "height": "1,95 m.",
    "photo_url": "https://assets.realmadrid.com/is/image/realmadrid/MALEDON_oscurecido_380x501",
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
          "updated_at": "2026-06-19T07:49:18.004Z"
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
          "updated_at": "2026-06-19T07:49:18.004Z"
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
          "updated_at": "2026-06-19T07:49:18.004Z"
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
          "updated_at": "2026-06-19T07:49:18.004Z"
        }
      }
    }
  },
  "p6": {
    "slug": "sergio-llull-melia",
    "profile_url": "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/sergio-llull-melia",
    "full_name": "Sergio Llull Meliá",
    "dorsal": 23,
    "position": "Base-escolta",
    "nationality": "espanola",
    "birth_date": "1987-11-15",
    "birth_place": "Mahón (Menorca)",
    "weight": "100 kg.",
    "height": "1,90 m.",
    "photo_url": "https://assets.realmadrid.com/is/image/realmadrid/LLULL_oscurecido_380x501",
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
          "updated_at": "2026-06-19T07:49:18.035Z"
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
          "updated_at": "2026-06-19T07:49:18.035Z"
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
          "updated_at": "2026-06-19T07:49:18.035Z"
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
          "updated_at": "2026-06-19T07:49:18.035Z"
        }
      }
    }
  },
  "p7": {
    "slug": "usman-garuba",
    "profile_url": "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/usman-garuba",
    "full_name": "Usman Garuba",
    "dorsal": 16,
    "position": "Ala-pívot",
    "nationality": null,
    "birth_date": "2002-03-09",
    "birth_place": "Madrid",
    "weight": "116 kg.",
    "height": "2,03 m.",
    "photo_url": "https://assets.realmadrid.com/is/image/realmadrid/GARUBA_oscurecido_380x501",
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
          "updated_at": "2026-06-19T07:49:18.069Z"
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
          "updated_at": "2026-06-19T07:49:18.069Z"
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
          "updated_at": "2026-06-19T07:49:18.069Z"
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
          "updated_at": "2026-06-19T07:49:18.069Z"
        }
      }
    }
  },
  "p8": {
    "slug": "andres-feliz",
    "profile_url": "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/andres-feliz",
    "full_name": "Andrés Feliz",
    "dorsal": 24,
    "position": "Base",
    "nationality": null,
    "birth_date": "1997-07-15",
    "birth_place": "Santo Domingo (República Dominicana)",
    "weight": "94 kg.",
    "height": "1,86 m.",
    "photo_url": "https://assets.realmadrid.com/is/image/realmadrid/FELIZ_oscurecido_380x501",
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
          "updated_at": "2026-06-19T07:49:18.101Z"
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
          "updated_at": "2026-06-19T07:49:18.101Z"
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
          "updated_at": "2026-06-19T07:49:18.101Z"
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
          "updated_at": "2026-06-19T07:49:18.101Z"
        }
      }
    }
  },
  "p9": {
    "slug": "david-kramer",
    "profile_url": "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/david-kramer",
    "full_name": "David  Krämer",
    "dorsal": 1,
    "position": "Alero",
    "nationality": null,
    "birth_date": "1997-01-14",
    "birth_place": "Myjava (Eslovaquia)",
    "weight": "93 kg.",
    "height": "1,98 m.",
    "photo_url": "https://assets.realmadrid.com/is/image/realmadrid/KRAMER_oscurecido_380x501",
    "matches_played": 47,
    "points": 249,
    "rebounds": 78,
    "assists": 24,
    "minutes_played": 588,
    "valuation": 188,
    "ppg": 5.3,
    "rpg": 1.7,
    "apg": 0.5,
    "competition_stats": {
      "liga_endesa": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 30,
          "points": 202,
          "rebounds": 54,
          "assists": 12,
          "minutes_played": 388,
          "valuation": 172,
          "steals": 16,
          "blocks": 1,
          "ppg": 6.7,
          "rpg": 1.8,
          "apg": 0.4,
          "source": "realmadrid.com",
          "updated_at": "2026-06-19T07:49:18.135Z"
        }
      },
      "euroliga": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 14,
          "points": 35,
          "rebounds": 17,
          "assists": 12,
          "minutes_played": 159,
          "valuation": 12,
          "steals": 3,
          "blocks": 0,
          "ppg": 2.5,
          "rpg": 1.2,
          "apg": 0.9,
          "source": "realmadrid.com",
          "updated_at": "2026-06-19T07:49:18.135Z"
        }
      },
      "supercopa_endesa": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 2,
          "points": 12,
          "rebounds": 4,
          "assists": 0,
          "minutes_played": 31,
          "valuation": 3,
          "steals": 0,
          "blocks": 0,
          "ppg": 6,
          "rpg": 2,
          "apg": 0,
          "source": "realmadrid.com",
          "updated_at": "2026-06-19T07:49:18.135Z"
        }
      },
      "copa_del_rey": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 1,
          "points": 0,
          "rebounds": 3,
          "assists": 0,
          "minutes_played": 10,
          "valuation": 1,
          "steals": 0,
          "blocks": 0,
          "ppg": 0,
          "rpg": 3,
          "apg": 0,
          "source": "realmadrid.com",
          "updated_at": "2026-06-19T07:49:18.135Z"
        }
      }
    }
  },
  "p10": {
    "slug": "alberto-abalde-diaz",
    "profile_url": "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/alberto-abalde-diaz",
    "full_name": "Alberto Abalde Díaz",
    "dorsal": 6,
    "position": "Alero",
    "nationality": "espanola",
    "birth_date": "1995-12-15",
    "birth_place": "Ferrol",
    "weight": "92 kg.",
    "height": "2,02 m.",
    "photo_url": "https://assets.realmadrid.com/is/image/realmadrid/ABALDE_oscurecido_380x501",
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
          "updated_at": "2026-06-19T07:49:18.171Z"
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
          "updated_at": "2026-06-19T07:49:18.171Z"
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
          "updated_at": "2026-06-19T07:49:18.171Z"
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
          "updated_at": "2026-06-19T07:49:18.171Z"
        }
      }
    }
  },
  "p11": {
    "slug": "gabriele-procida",
    "profile_url": "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/gabriele-procida",
    "full_name": "Gabriele Procida",
    "dorsal": 9,
    "position": "Alero",
    "nationality": null,
    "birth_date": "2002-06-01",
    "birth_place": "Como (Italia)",
    "weight": "91 kg.",
    "height": "2,01 m.",
    "photo_url": "https://assets.realmadrid.com/is/image/realmadrid/PROCIDA_oscurecido_380x501",
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
          "updated_at": "2026-06-19T07:49:18.206Z"
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
          "updated_at": "2026-06-19T07:49:18.206Z"
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
          "updated_at": "2026-06-19T07:49:18.206Z"
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
  "p12": {
    "slug": "trey-lyles",
    "profile_url": "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/trey-lyles",
    "full_name": "Trey Lyles",
    "dorsal": 0,
    "position": "Ala-pívot",
    "nationality": null,
    "birth_date": "1995-11-05",
    "birth_place": "Saskatoon (Canadá)",
    "weight": "115 kg.",
    "height": "2,06 m.",
    "photo_url": "https://assets.realmadrid.com/is/image/realmadrid/LYLES_oscurecido_380x501",
    "matches_played": 74,
    "points": 925,
    "rebounds": 347,
    "assists": 115,
    "minutes_played": 1541,
    "valuation": 1066,
    "ppg": 12.5,
    "rpg": 4.7,
    "apg": 1.6,
    "competition_stats": {
      "liga_endesa": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 28,
          "points": 327,
          "rebounds": 141,
          "assists": 49,
          "minutes_played": 583,
          "valuation": 394,
          "steals": 12,
          "blocks": 21,
          "ppg": 11.7,
          "rpg": 5,
          "apg": 1.8,
          "source": "realmadrid.com",
          "updated_at": "2026-06-19T07:49:18.238Z"
        }
      },
      "euroliga": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 42,
          "points": 565,
          "rebounds": 190,
          "assists": 64,
          "minutes_played": 890,
          "valuation": 634,
          "steals": 23,
          "blocks": 20,
          "ppg": 13.5,
          "rpg": 4.5,
          "apg": 1.5,
          "source": "realmadrid.com",
          "updated_at": "2026-06-19T07:49:18.238Z"
        }
      },
      "supercopa_endesa": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 1,
          "points": 9,
          "rebounds": 4,
          "assists": 0,
          "minutes_played": 16,
          "valuation": 7,
          "steals": 0,
          "blocks": 0,
          "ppg": 9,
          "rpg": 4,
          "apg": 0,
          "source": "realmadrid.com",
          "updated_at": "2026-06-19T07:49:18.238Z"
        }
      },
      "copa_del_rey": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 3,
          "points": 24,
          "rebounds": 12,
          "assists": 2,
          "minutes_played": 52,
          "valuation": 31,
          "steals": 2,
          "blocks": 3,
          "ppg": 8,
          "rpg": 4,
          "apg": 0.7,
          "source": "realmadrid.com",
          "updated_at": "2026-06-19T07:49:18.238Z"
        }
      }
    }
  },
  "p13": {
    "slug": "chukwuma-julian-okeke",
    "profile_url": "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/chukwuma-julian-okeke",
    "full_name": "Chukwuma Julian Okeke",
    "dorsal": 8,
    "position": "Ala-pívot",
    "nationality": null,
    "birth_date": "1998-08-18",
    "birth_place": "Atlanta (Estados Unidos)",
    "weight": "109 kg.",
    "height": "2,01 m. ",
    "photo_url": "https://assets.realmadrid.com/is/image/realmadrid/OKEKE_oscurecido_380x501",
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
          "updated_at": "2026-06-19T07:49:18.272Z"
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
          "updated_at": "2026-06-19T07:49:18.272Z"
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
          "updated_at": "2026-06-19T07:49:18.272Z"
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
  "p14": {
    "slug": "izan-almansa",
    "profile_url": "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/izan-almansa",
    "full_name": "Izan Almansa",
    "dorsal": 13,
    "position": "Ala-pívot",
    "nationality": null,
    "birth_date": "2005-06-07",
    "birth_place": "Murcia (España)",
    "weight": "105 kg.",
    "height": "2,07 m.",
    "photo_url": "https://assets.realmadrid.com/is/image/realmadrid/ALMANSA_oscurecidos_380x501",
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
          "updated_at": "2026-06-19T07:49:18.306Z"
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
          "updated_at": "2026-06-19T07:49:18.306Z"
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
          "updated_at": "2026-06-19T07:49:18.306Z"
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
  "p15": {
    "slug": "mady-sissoko",
    "profile_url": "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/mady-sissoko",
    "full_name": "Mady Sissoko",
    "dorsal": 5,
    "position": "Pívot",
    "nationality": null,
    "birth_date": "2000-12-20",
    "birth_place": "Tangafoya (Mali)",
    "weight": "109 kg.",
    "height": "2,06 m.",
    "photo_url": "https://assets.realmadrid.com/is/image/realmadrid/SISSOKO_380x501",
    "matches_played": 3,
    "points": 18,
    "rebounds": 14,
    "assists": 0,
    "minutes_played": 44,
    "valuation": 25,
    "ppg": 6,
    "rpg": 4.7,
    "apg": 0,
    "competition_stats": {
      "liga_endesa": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 3,
          "points": 18,
          "rebounds": 14,
          "assists": 0,
          "minutes_played": 44,
          "valuation": 25,
          "steals": 0,
          "blocks": 2,
          "ppg": 6,
          "rpg": 4.7,
          "apg": 0,
          "source": "realmadrid.com",
          "updated_at": "2026-06-19T07:49:18.336Z"
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
  "p16": {
    "slug": "alex-len",
    "profile_url": "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/alex-len",
    "full_name": "Alex Len",
    "dorsal": 25,
    "position": "Pívot",
    "nationality": null,
    "birth_date": "1993-06-16",
    "birth_place": "Antratsit (Ucrania)",
    "weight": "121 kg.",
    "height": "2,13 m.",
    "photo_url": "https://assets.realmadrid.com/is/image/realmadrid/ALEX_LEN_380x501",
    "matches_played": 46,
    "points": 223,
    "rebounds": 126,
    "assists": 23,
    "minutes_played": 511,
    "valuation": 287,
    "ppg": 4.8,
    "rpg": 2.7,
    "apg": 0.5,
    "competition_stats": {
      "liga_endesa": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 21,
          "points": 150,
          "rebounds": 76,
          "assists": 15,
          "minutes_played": 281,
          "valuation": 202,
          "steals": 11,
          "blocks": 26,
          "ppg": 7.1,
          "rpg": 3.6,
          "apg": 0.7,
          "source": "realmadrid.com",
          "updated_at": "2026-06-19T07:49:18.365Z"
        }
      },
      "euroliga": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 23,
          "points": 69,
          "rebounds": 46,
          "assists": 7,
          "minutes_played": 211,
          "valuation": 85,
          "steals": 3,
          "blocks": 20,
          "ppg": 3,
          "rpg": 2,
          "apg": 0.3,
          "source": "realmadrid.com",
          "updated_at": "2026-06-19T07:49:18.365Z"
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
          "phase": "Temporada regular",
          "matches_played": 2,
          "points": 4,
          "rebounds": 4,
          "assists": 1,
          "minutes_played": 19,
          "valuation": 0,
          "steals": 0,
          "blocks": 1,
          "ppg": 2,
          "rpg": 2,
          "apg": 0.5,
          "source": "realmadrid.com",
          "updated_at": "2026-06-19T07:49:18.365Z"
        }
      }
    }
  },
  "p17": {
    "slug": "omer-yurtseven",
    "profile_url": "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/omer-yurtseven",
    "full_name": "Ömer Yurtseven",
    "dorsal": 77,
    "position": "Pívot",
    "nationality": "turca",
    "birth_date": "1998-06-19",
    "birth_place": "Taskent (Uzbekistán)",
    "weight": "120 Kg.",
    "height": "2,13 m.",
    "photo_url": "https://assets.realmadrid.com/is/image/realmadrid/YURTSEVEN_380x501",
    "matches_played": 5,
    "points": 44,
    "rebounds": 15,
    "assists": 3,
    "minutes_played": 68,
    "valuation": 53,
    "ppg": 8.8,
    "rpg": 3,
    "apg": 0.6,
    "competition_stats": {
      "liga_endesa": {
        "stats": {
          "season": "2025-2026",
          "phase": "Temporada regular",
          "matches_played": 5,
          "points": 44,
          "rebounds": 15,
          "assists": 3,
          "minutes_played": 68,
          "valuation": 53,
          "steals": 2,
          "blocks": 6,
          "ppg": 8.8,
          "rpg": 3,
          "apg": 0.6,
          "source": "realmadrid.com",
          "updated_at": "2026-06-19T07:49:18.397Z"
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
  }
} as Record<string, RmbOfficialPlayerRecord>;

export function getOfficialStatsByLegacyId(legacyId: string): RmbOfficialPlayerRecord | null {
  return RMB_OFFICIAL_STATS[legacyId] ?? null;
}

export function getOfficialStatsByPlayerId(playerId: string): RmbOfficialPlayerRecord | null {
  if (RMB_OFFICIAL_STATS[playerId]) return RMB_OFFICIAL_STATS[playerId];
  const match = playerId.match(/^00000000-0000-4000-8000-0*(\d+)$/i);
  if (!match) return null;
  return RMB_OFFICIAL_STATS[`p${Number(match[1])}`] ?? null;
}
