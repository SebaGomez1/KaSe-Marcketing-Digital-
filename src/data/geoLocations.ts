export interface CityData {
  name: string;
  population: number;
  lat: number;
  lng: number;
  nearbyRadiusKm: number;
  countryCode?: string;
  countryName?: string;
}

export interface RegionData {
  name: string;
  cities: CityData[];
}

export interface CountryData {
  code: string;
  name: string;
  flag: string;
  regions: RegionData[];
}

export const WORLD_COUNTRIES_CATALOG: CountryData[] = [
  {
    "code": "GLOBAL",
    "name": "Audiencia Global (Mundial - Sin Restricción)",
    "flag": "🌐",
    "regions": [
      {
        "name": "Mundial",
        "cities": [
          {
            "name": "Tráfico Global Cualificado por Idioma e Intención",
            "population": 150000000,
            "lat": 0,
            "lng": 0,
            "nearbyRadiusKm": 10000
          }
        ]
      }
    ]
  },
  {
    "code": "UY",
    "name": "Uruguay",
    "flag": "🇺🇾",
    "regions": [
      {
        "name": "Montevideo",
        "cities": [
          {
            "name": "Montevideo Capital",
            "population": 1380000,
            "lat": -34.9011,
            "lng": -56.1645,
            "nearbyRadiusKm": 25
          },
          {
            "name": "Pocitos / Punta Carretas",
            "population": 120000,
            "lat": -34.9215,
            "lng": -56.1512,
            "nearbyRadiusKm": 15
          },
          {
            "name": "Carrasco / Punta Gorda",
            "population": 65000,
            "lat": -34.8872,
            "lng": -56.0592,
            "nearbyRadiusKm": 15
          },
          {
            "name": "Centro / Cordón",
            "population": 140000,
            "lat": -34.9062,
            "lng": -56.1856,
            "nearbyRadiusKm": 10
          }
        ]
      },
      {
        "name": "Canelones",
        "cities": [
          {
            "name": "Ciudad de la Costa",
            "population": 112000,
            "lat": -34.8211,
            "lng": -55.9528,
            "nearbyRadiusKm": 20
          },
          {
            "name": "Las Piedras",
            "population": 71000,
            "lat": -34.7297,
            "lng": -56.2197,
            "nearbyRadiusKm": 25
          },
          {
            "name": "Pando",
            "population": 26000,
            "lat": -34.7172,
            "lng": -55.9547,
            "nearbyRadiusKm": 30
          },
          {
            "name": "Canelones Capital",
            "population": 20000,
            "lat": -34.5228,
            "lng": -56.2778,
            "nearbyRadiusKm": 35
          }
        ]
      },
      {
        "name": "Maldonado",
        "cities": [
          {
            "name": "Punta del Este",
            "population": 24000,
            "lat": -34.9667,
            "lng": -54.95,
            "nearbyRadiusKm": 20
          },
          {
            "name": "Maldonado Capital",
            "population": 63000,
            "lat": -34.9,
            "lng": -54.95,
            "nearbyRadiusKm": 20
          },
          {
            "name": "San Carlos",
            "population": 27000,
            "lat": -34.7917,
            "lng": -54.9167,
            "nearbyRadiusKm": 25
          }
        ]
      },
      {
        "name": "Colonia",
        "cities": [
          {
            "name": "Colonia del Sacramento",
            "population": 27000,
            "lat": -34.4626,
            "lng": -57.84,
            "nearbyRadiusKm": 30
          },
          {
            "name": "Carmelo",
            "population": 18000,
            "lat": -34,
            "lng": -58.2833,
            "nearbyRadiusKm": 35
          }
        ]
      },
      {
        "name": "Salto",
        "cities": [
          {
            "name": "Salto Capital",
            "population": 104000,
            "lat": -31.3833,
            "lng": -57.9667,
            "nearbyRadiusKm": 40
          }
        ]
      },
      {
        "name": "Paysandú",
        "cities": [
          {
            "name": "Paysandú Capital",
            "population": 76000,
            "lat": -32.3214,
            "lng": -58.0756,
            "nearbyRadiusKm": 40
          }
        ]
      },
      {
        "name": "Rivera",
        "cities": [
          {
            "name": "Rivera Capital",
            "population": 79000,
            "lat": -30.9025,
            "lng": -55.5506,
            "nearbyRadiusKm": 40
          }
        ]
      },
      {
        "name": "Tacuarembó",
        "cities": [
          {
            "name": "Tacuarembó Capital",
            "population": 54000,
            "lat": -31.7333,
            "lng": -55.9833,
            "nearbyRadiusKm": 45
          }
        ]
      }
    ]
  },
  {
    "code": "AR",
    "name": "Argentina",
    "flag": "🇦🇷",
    "regions": [
      {
        "name": "Buenos Aires (CABA & AMBA)",
        "cities": [
          {
            "name": "Ciudad Autónoma de Buenos Aires (CABA)",
            "population": 3120000,
            "lat": -34.6037,
            "lng": -58.3816,
            "nearbyRadiusKm": 25
          },
          {
            "name": "Zona Norte (Vicente López / San Isidro / Tigre)",
            "population": 850000,
            "lat": -34.4714,
            "lng": -58.5286,
            "nearbyRadiusKm": 25
          },
          {
            "name": "Zona Oeste (Morón / Ramos Mejía / Castelar)",
            "population": 640000,
            "lat": -34.6534,
            "lng": -58.6198,
            "nearbyRadiusKm": 25
          },
          {
            "name": "Zona Sur (Quilmes / Lomas de Zamora)",
            "population": 920000,
            "lat": -34.76,
            "lng": -58.4,
            "nearbyRadiusKm": 30
          },
          {
            "name": "La Plata",
            "population": 770000,
            "lat": -34.9205,
            "lng": -57.9536,
            "nearbyRadiusKm": 40
          },
          {
            "name": "Mar del Plata",
            "population": 650000,
            "lat": -38.0055,
            "lng": -57.556,
            "nearbyRadiusKm": 45
          },
          {
            "name": "Bahía Blanca",
            "population": 310000,
            "lat": -38.7183,
            "lng": -62.2663,
            "nearbyRadiusKm": 45
          }
        ]
      },
      {
        "name": "Córdoba",
        "cities": [
          {
            "name": "Córdoba Capital",
            "population": 1560000,
            "lat": -31.4201,
            "lng": -64.1888,
            "nearbyRadiusKm": 35
          },
          {
            "name": "Villa Carlos Paz",
            "population": 75000,
            "lat": -31.4241,
            "lng": -64.4978,
            "nearbyRadiusKm": 30
          },
          {
            "name": "Río Cuarto",
            "population": 180000,
            "lat": -33.1307,
            "lng": -64.3499,
            "nearbyRadiusKm": 45
          }
        ]
      },
      {
        "name": "Santa Fe",
        "cities": [
          {
            "name": "Rosario",
            "population": 1340000,
            "lat": -32.9468,
            "lng": -60.6393,
            "nearbyRadiusKm": 35
          },
          {
            "name": "Santa Fe Capital",
            "population": 420000,
            "lat": -31.6333,
            "lng": -60.7,
            "nearbyRadiusKm": 40
          }
        ]
      },
      {
        "name": "Mendoza",
        "cities": [
          {
            "name": "Gran Mendoza",
            "population": 1100000,
            "lat": -32.8895,
            "lng": -68.8458,
            "nearbyRadiusKm": 35
          },
          {
            "name": "San Rafael",
            "population": 190000,
            "lat": -34.6177,
            "lng": -68.3301,
            "nearbyRadiusKm": 50
          }
        ]
      },
      {
        "name": "Tucumán",
        "cities": [
          {
            "name": "San Miguel de Tucumán",
            "population": 830000,
            "lat": -26.8241,
            "lng": -65.2226,
            "nearbyRadiusKm": 35
          }
        ]
      },
      {
        "name": "Salta",
        "cities": [
          {
            "name": "Salta Capital",
            "population": 535000,
            "lat": -24.7821,
            "lng": -65.4232,
            "nearbyRadiusKm": 40
          }
        ]
      },
      {
        "name": "Neuquén",
        "cities": [
          {
            "name": "Neuquén Capital",
            "population": 300000,
            "lat": -38.9516,
            "lng": -68.0591,
            "nearbyRadiusKm": 40
          },
          {
            "name": "San Carlos de Bariloche",
            "population": 130000,
            "lat": -41.1335,
            "lng": -71.3103,
            "nearbyRadiusKm": 35
          }
        ]
      }
    ]
  },
  {
    "code": "BR",
    "name": "Brasil",
    "flag": "🇧🇷",
    "regions": [
      {
        "name": "São Paulo",
        "cities": [
          {
            "name": "São Paulo Capital",
            "population": 12330000,
            "lat": -23.5505,
            "lng": -46.6333,
            "nearbyRadiusKm": 40
          },
          {
            "name": "Campinas",
            "population": 1210000,
            "lat": -22.9056,
            "lng": -47.0608,
            "nearbyRadiusKm": 35
          },
          {
            "name": "Santos / Baixada Santista",
            "population": 433000,
            "lat": -23.9608,
            "lng": -46.3336,
            "nearbyRadiusKm": 30
          }
        ]
      },
      {
        "name": "Rio de Janeiro",
        "cities": [
          {
            "name": "Rio de Janeiro Capital",
            "population": 6750000,
            "lat": -22.9068,
            "lng": -43.1729,
            "nearbyRadiusKm": 40
          },
          {
            "name": "Niterói",
            "population": 515000,
            "lat": -22.8832,
            "lng": -43.1034,
            "nearbyRadiusKm": 25
          }
        ]
      },
      {
        "name": "Paraná",
        "cities": [
          {
            "name": "Curitiba",
            "population": 1960000,
            "lat": -25.4284,
            "lng": -49.2733,
            "nearbyRadiusKm": 35
          }
        ]
      },
      {
        "name": "Rio Grande do Sul",
        "cities": [
          {
            "name": "Porto Alegre",
            "population": 1488000,
            "lat": -30.0346,
            "lng": -51.2177,
            "nearbyRadiusKm": 35
          }
        ]
      },
      {
        "name": "Minas Gerais",
        "cities": [
          {
            "name": "Belo Horizonte",
            "population": 2520000,
            "lat": -19.9167,
            "lng": -43.9345,
            "nearbyRadiusKm": 35
          }
        ]
      },
      {
        "name": "Santa Catarina",
        "cities": [
          {
            "name": "Florianópolis",
            "population": 508000,
            "lat": -27.5954,
            "lng": -48.548,
            "nearbyRadiusKm": 30
          },
          {
            "name": "Joinville",
            "population": 597000,
            "lat": -26.3045,
            "lng": -48.8487,
            "nearbyRadiusKm": 35
          }
        ]
      }
    ]
  },
  {
    "code": "CL",
    "name": "Chile",
    "flag": "🇨🇱",
    "regions": [
      {
        "name": "Región Metropolitana",
        "cities": [
          {
            "name": "Gran Santiago (Las Condes / Providencia / Centro)",
            "population": 6800000,
            "lat": -33.4489,
            "lng": -70.6693,
            "nearbyRadiusKm": 35
          }
        ]
      },
      {
        "name": "Valparaíso",
        "cities": [
          {
            "name": "Valparaíso / Viña del Mar",
            "population": 980000,
            "lat": -33.0472,
            "lng": -71.6127,
            "nearbyRadiusKm": 30
          }
        ]
      },
      {
        "name": "Biobío",
        "cities": [
          {
            "name": "Concepción",
            "population": 970000,
            "lat": -36.827,
            "lng": -73.0503,
            "nearbyRadiusKm": 35
          }
        ]
      },
      {
        "name": "Antofagasta",
        "cities": [
          {
            "name": "Antofagasta",
            "population": 390000,
            "lat": -23.65,
            "lng": -70.4,
            "nearbyRadiusKm": 40
          }
        ]
      }
    ]
  },
  {
    "code": "CO",
    "name": "Colombia",
    "flag": "🇨🇴",
    "regions": [
      {
        "name": "Bogotá D.C.",
        "cities": [
          {
            "name": "Bogotá Capital",
            "population": 7900000,
            "lat": 4.711,
            "lng": -74.0721,
            "nearbyRadiusKm": 35
          }
        ]
      },
      {
        "name": "Antioquia",
        "cities": [
          {
            "name": "Medellín / Valle de Aburrá",
            "population": 2600000,
            "lat": 6.2442,
            "lng": -75.5812,
            "nearbyRadiusKm": 30
          }
        ]
      },
      {
        "name": "Valle del Cauca",
        "cities": [
          {
            "name": "Cali",
            "population": 2200000,
            "lat": 3.4516,
            "lng": -76.532,
            "nearbyRadiusKm": 30
          }
        ]
      },
      {
        "name": "Atlántico",
        "cities": [
          {
            "name": "Barranquilla",
            "population": 1300000,
            "lat": 10.9685,
            "lng": -74.7813,
            "nearbyRadiusKm": 30
          }
        ]
      },
      {
        "name": "Santander",
        "cities": [
          {
            "name": "Bucaramanga",
            "population": 580000,
            "lat": 7.1254,
            "lng": -73.1198,
            "nearbyRadiusKm": 30
          }
        ]
      }
    ]
  },
  {
    "code": "PE",
    "name": "Perú",
    "flag": "🇵🇪",
    "regions": [
      {
        "name": "Lima Metropolitana",
        "cities": [
          {
            "name": "Lima Capital / Miraflores / San Isidro",
            "population": 9800000,
            "lat": -12.0464,
            "lng": -77.0428,
            "nearbyRadiusKm": 35
          }
        ]
      },
      {
        "name": "Arequipa",
        "cities": [
          {
            "name": "Arequipa",
            "population": 1080000,
            "lat": -16.409,
            "lng": -71.5375,
            "nearbyRadiusKm": 35
          }
        ]
      },
      {
        "name": "La Libertad",
        "cities": [
          {
            "name": "Trujillo",
            "population": 920000,
            "lat": -8.1118,
            "lng": -79.0286,
            "nearbyRadiusKm": 30
          }
        ]
      },
      {
        "name": "Cusco",
        "cities": [
          {
            "name": "Cusco",
            "population": 430000,
            "lat": -13.5319,
            "lng": -71.9675,
            "nearbyRadiusKm": 30
          }
        ]
      }
    ]
  },
  {
    "code": "EC",
    "name": "Ecuador",
    "flag": "🇪🇨",
    "regions": [
      {
        "name": "Pichincha",
        "cities": [
          {
            "name": "Quito Capital",
            "population": 2800000,
            "lat": -0.1807,
            "lng": -78.4678,
            "nearbyRadiusKm": 35
          }
        ]
      },
      {
        "name": "Guayas",
        "cities": [
          {
            "name": "Guayaquil",
            "population": 2700000,
            "lat": -2.1894,
            "lng": -79.8891,
            "nearbyRadiusKm": 35
          }
        ]
      },
      {
        "name": "Azuay",
        "cities": [
          {
            "name": "Cuenca",
            "population": 630000,
            "lat": -2.9001,
            "lng": -79.0059,
            "nearbyRadiusKm": 30
          }
        ]
      }
    ]
  },
  {
    "code": "PY",
    "name": "Paraguay",
    "flag": "🇵🇾",
    "regions": [
      {
        "name": "Asunción / Central",
        "cities": [
          {
            "name": "Asunción Capital",
            "population": 520000,
            "lat": -25.2637,
            "lng": -57.5759,
            "nearbyRadiusKm": 25
          },
          {
            "name": "Gran Asunción (San Lorenzo / Luque / Fernando)",
            "population": 1800000,
            "lat": -25.3333,
            "lng": -57.5167,
            "nearbyRadiusKm": 35
          }
        ]
      },
      {
        "name": "Alto Paraná",
        "cities": [
          {
            "name": "Ciudad del Este",
            "population": 300000,
            "lat": -25.5097,
            "lng": -54.6111,
            "nearbyRadiusKm": 30
          }
        ]
      }
    ]
  },
  {
    "code": "BO",
    "name": "Bolivia",
    "flag": "🇧🇴",
    "regions": [
      {
        "name": "Santa Cruz",
        "cities": [
          {
            "name": "Santa Cruz de la Sierra",
            "population": 1900000,
            "lat": -17.7833,
            "lng": -63.1821,
            "nearbyRadiusKm": 35
          }
        ]
      },
      {
        "name": "La Paz",
        "cities": [
          {
            "name": "La Paz / El Alto",
            "population": 1800000,
            "lat": -16.5,
            "lng": -68.15,
            "nearbyRadiusKm": 35
          }
        ]
      },
      {
        "name": "Cochabamba",
        "cities": [
          {
            "name": "Cochabamba",
            "population": 750000,
            "lat": -17.3895,
            "lng": -66.1568,
            "nearbyRadiusKm": 30
          }
        ]
      }
    ]
  },
  {
    "code": "VE",
    "name": "Venezuela",
    "flag": "🇻🇪",
    "regions": [
      {
        "name": "Distrito Capital",
        "cities": [
          {
            "name": "Caracas Capital",
            "population": 3100000,
            "lat": 10.4806,
            "lng": -66.9036,
            "nearbyRadiusKm": 35
          }
        ]
      },
      {
        "name": "Zulia",
        "cities": [
          {
            "name": "Maracaibo",
            "population": 1600000,
            "lat": 10.6427,
            "lng": -71.6125,
            "nearbyRadiusKm": 35
          }
        ]
      },
      {
        "name": "Carabobo",
        "cities": [
          {
            "name": "Valencia",
            "population": 1400000,
            "lat": 10.162,
            "lng": -68.0077,
            "nearbyRadiusKm": 30
          }
        ]
      }
    ]
  },
  {
    "code": "MX",
    "name": "México",
    "flag": "🇲🇽",
    "regions": [
      {
        "name": "Ciudad de México",
        "cities": [
          {
            "name": "CDMX (Área Metropolitana)",
            "population": 9200000,
            "lat": 19.4326,
            "lng": -99.1332,
            "nearbyRadiusKm": 35
          }
        ]
      },
      {
        "name": "Nuevo León",
        "cities": [
          {
            "name": "Monterrey / San Pedro Garza García",
            "population": 1300000,
            "lat": 25.6866,
            "lng": -100.3161,
            "nearbyRadiusKm": 30
          }
        ]
      },
      {
        "name": "Jalisco",
        "cities": [
          {
            "name": "Guadalajara / Zapopan",
            "population": 1500000,
            "lat": 20.6597,
            "lng": -103.3496,
            "nearbyRadiusKm": 30
          }
        ]
      },
      {
        "name": "Puebla",
        "cities": [
          {
            "name": "Puebla Capital",
            "population": 1690000,
            "lat": 19.0414,
            "lng": -98.2063,
            "nearbyRadiusKm": 30
          }
        ]
      },
      {
        "name": "Querétaro",
        "cities": [
          {
            "name": "Santiago de Querétaro",
            "population": 1050000,
            "lat": 20.5888,
            "lng": -100.3899,
            "nearbyRadiusKm": 30
          }
        ]
      },
      {
        "name": "Yucatán / Quintana Roo",
        "cities": [
          {
            "name": "Mérida",
            "population": 995000,
            "lat": 20.9674,
            "lng": -89.5926,
            "nearbyRadiusKm": 30
          },
          {
            "name": "Cancún",
            "population": 888000,
            "lat": 21.1619,
            "lng": -86.8515,
            "nearbyRadiusKm": 30
          }
        ]
      }
    ]
  },
  {
    "code": "US",
    "name": "Estados Unidos",
    "flag": "🇺🇸",
    "regions": [
      {
        "name": "California",
        "cities": [
          {
            "name": "San Francisco / Silicon Valley",
            "population": 870000,
            "lat": 37.7749,
            "lng": -122.4194,
            "nearbyRadiusKm": 45
          },
          {
            "name": "Los Ángeles",
            "population": 3900000,
            "lat": 34.0522,
            "lng": -118.2437,
            "nearbyRadiusKm": 50
          },
          {
            "name": "San Diego",
            "population": 1380000,
            "lat": 32.7157,
            "lng": -117.1611,
            "nearbyRadiusKm": 35
          }
        ]
      },
      {
        "name": "Florida",
        "cities": [
          {
            "name": "Miami (Tech & LatAm Hub)",
            "population": 450000,
            "lat": 25.7617,
            "lng": -80.1918,
            "nearbyRadiusKm": 35
          },
          {
            "name": "Orlando",
            "population": 310000,
            "lat": 28.5383,
            "lng": -81.3792,
            "nearbyRadiusKm": 40
          },
          {
            "name": "Tampa",
            "population": 390000,
            "lat": 27.9506,
            "lng": -82.4572,
            "nearbyRadiusKm": 35
          }
        ]
      },
      {
        "name": "Texas",
        "cities": [
          {
            "name": "Austin (Tech Hub)",
            "population": 960000,
            "lat": 30.2672,
            "lng": -97.7431,
            "nearbyRadiusKm": 35
          },
          {
            "name": "Houston",
            "population": 2300000,
            "lat": 29.7604,
            "lng": -95.3698,
            "nearbyRadiusKm": 45
          },
          {
            "name": "Dallas / Fort Worth",
            "population": 1300000,
            "lat": 32.7767,
            "lng": -96.797,
            "nearbyRadiusKm": 45
          }
        ]
      },
      {
        "name": "New York",
        "cities": [
          {
            "name": "New York City (Manhattan & Brooklyn)",
            "population": 8300000,
            "lat": 40.7128,
            "lng": -74.006,
            "nearbyRadiusKm": 40
          }
        ]
      },
      {
        "name": "Washington",
        "cities": [
          {
            "name": "Seattle",
            "population": 740000,
            "lat": 47.6062,
            "lng": -122.3321,
            "nearbyRadiusKm": 35
          }
        ]
      }
    ]
  },
  {
    "code": "CA",
    "name": "Canadá",
    "flag": "🇨🇦",
    "regions": [
      {
        "name": "Ontario",
        "cities": [
          {
            "name": "Toronto",
            "population": 2930000,
            "lat": 43.6532,
            "lng": -79.3832,
            "nearbyRadiusKm": 35
          },
          {
            "name": "Ottawa",
            "population": 994000,
            "lat": 45.4215,
            "lng": -75.6972,
            "nearbyRadiusKm": 35
          }
        ]
      },
      {
        "name": "Quebec",
        "cities": [
          {
            "name": "Montreal",
            "population": 1780000,
            "lat": 45.5017,
            "lng": -73.5673,
            "nearbyRadiusKm": 35
          }
        ]
      },
      {
        "name": "British Columbia",
        "cities": [
          {
            "name": "Vancouver",
            "population": 675000,
            "lat": 49.2827,
            "lng": -123.1207,
            "nearbyRadiusKm": 35
          }
        ]
      }
    ]
  },
  {
    "code": "CR",
    "name": "Costa Rica",
    "flag": "🇨🇷",
    "regions": [
      {
        "name": "San José / Valle Central",
        "cities": [
          {
            "name": "San José Capital",
            "population": 1400000,
            "lat": 9.9281,
            "lng": -84.0907,
            "nearbyRadiusKm": 30
          },
          {
            "name": "Heredia / Alajuela",
            "population": 520000,
            "lat": 10.0024,
            "lng": -84.1165,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "PA",
    "name": "Panamá",
    "flag": "🇵🇦",
    "regions": [
      {
        "name": "Panamá",
        "cities": [
          {
            "name": "Ciudad de Panamá (Fintech & Hub)",
            "population": 1500000,
            "lat": 8.9824,
            "lng": -79.5199,
            "nearbyRadiusKm": 30
          }
        ]
      }
    ]
  },
  {
    "code": "DO",
    "name": "República Dominicana",
    "flag": "🇩🇴",
    "regions": [
      {
        "name": "Santo Domingo",
        "cities": [
          {
            "name": "Santo Domingo Capital",
            "population": 3300000,
            "lat": 18.4861,
            "lng": -69.9312,
            "nearbyRadiusKm": 35
          },
          {
            "name": "Santiago de los Caballeros",
            "population": 1100000,
            "lat": 19.4517,
            "lng": -70.697,
            "nearbyRadiusKm": 30
          }
        ]
      }
    ]
  },
  {
    "code": "GT",
    "name": "Guatemala",
    "flag": "🇬🇹",
    "regions": [
      {
        "name": "Guatemala",
        "cities": [
          {
            "name": "Ciudad de Guatemala",
            "population": 2900000,
            "lat": 14.6349,
            "lng": -90.5069,
            "nearbyRadiusKm": 35
          }
        ]
      }
    ]
  },
  {
    "code": "SV",
    "name": "El Salvador",
    "flag": "🇸🇻",
    "regions": [
      {
        "name": "San Salvador",
        "cities": [
          {
            "name": "San Salvador Capital",
            "population": 1700000,
            "lat": 13.6929,
            "lng": -89.2182,
            "nearbyRadiusKm": 30
          }
        ]
      }
    ]
  },
  {
    "code": "HN",
    "name": "Honduras",
    "flag": "🇭🇳",
    "regions": [
      {
        "name": "Francisco Morazán / Cortés",
        "cities": [
          {
            "name": "Tegucigalpa",
            "population": 1150000,
            "lat": 14.0723,
            "lng": -87.1921,
            "nearbyRadiusKm": 30
          },
          {
            "name": "San Pedro Sula",
            "population": 800000,
            "lat": 15.5,
            "lng": -88.0333,
            "nearbyRadiusKm": 30
          }
        ]
      }
    ]
  },
  {
    "code": "PR",
    "name": "Puerto Rico",
    "flag": "🇵🇷",
    "regions": [
      {
        "name": "San Juan",
        "cities": [
          {
            "name": "San Juan",
            "population": 340000,
            "lat": 18.4655,
            "lng": -66.1057,
            "nearbyRadiusKm": 30
          }
        ]
      }
    ]
  },
  {
    "code": "ES",
    "name": "España",
    "flag": "🇪🇸",
    "regions": [
      {
        "name": "Comunidad de Madrid",
        "cities": [
          {
            "name": "Madrid Capital",
            "population": 3340000,
            "lat": 40.4168,
            "lng": -3.7038,
            "nearbyRadiusKm": 30
          },
          {
            "name": "Alcobendas / San Sebastián de los Reyes",
            "population": 210000,
            "lat": 40.5475,
            "lng": -3.6421,
            "nearbyRadiusKm": 20
          },
          {
            "name": "Móstoles / Alcorcón",
            "population": 380000,
            "lat": 40.3232,
            "lng": -3.8649,
            "nearbyRadiusKm": 25
          }
        ]
      },
      {
        "name": "Cataluña",
        "cities": [
          {
            "name": "Barcelona Capital",
            "population": 1660000,
            "lat": 41.3851,
            "lng": 2.1734,
            "nearbyRadiusKm": 25
          },
          {
            "name": "Hospitalet de Llobregat",
            "population": 265000,
            "lat": 41.3597,
            "lng": 2.0997,
            "nearbyRadiusKm": 15
          },
          {
            "name": "Terrassa / Sabadell",
            "population": 440000,
            "lat": 41.5632,
            "lng": 2.0089,
            "nearbyRadiusKm": 25
          }
        ]
      },
      {
        "name": "Comunidad Valenciana",
        "cities": [
          {
            "name": "Valencia Capital",
            "population": 800000,
            "lat": 39.4699,
            "lng": -0.3763,
            "nearbyRadiusKm": 25
          },
          {
            "name": "Alicante",
            "population": 340000,
            "lat": 38.3452,
            "lng": -0.481,
            "nearbyRadiusKm": 30
          }
        ]
      },
      {
        "name": "Andalucía",
        "cities": [
          {
            "name": "Sevilla",
            "population": 685000,
            "lat": 37.3891,
            "lng": -5.9845,
            "nearbyRadiusKm": 30
          },
          {
            "name": "Málaga (Tech Hub Costa del Sol)",
            "population": 580000,
            "lat": 36.7213,
            "lng": -4.4214,
            "nearbyRadiusKm": 25
          }
        ]
      },
      {
        "name": "País Vasco",
        "cities": [
          {
            "name": "Bilbao",
            "population": 345000,
            "lat": 43.263,
            "lng": -2.935,
            "nearbyRadiusKm": 25
          },
          {
            "name": "San Sebastián",
            "population": 188000,
            "lat": 43.3183,
            "lng": -1.9812,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "GB",
    "name": "Reino Unido",
    "flag": "🇬🇧",
    "regions": [
      {
        "name": "Greater London",
        "cities": [
          {
            "name": "Londres (City & Tech City)",
            "population": 8980000,
            "lat": 51.5074,
            "lng": -0.1278,
            "nearbyRadiusKm": 35
          }
        ]
      },
      {
        "name": "North West",
        "cities": [
          {
            "name": "Manchester",
            "population": 553000,
            "lat": 53.4808,
            "lng": -2.2426,
            "nearbyRadiusKm": 30
          }
        ]
      },
      {
        "name": "Scotland",
        "cities": [
          {
            "name": "Edimburgo",
            "population": 526000,
            "lat": 55.9533,
            "lng": -3.1883,
            "nearbyRadiusKm": 30
          }
        ]
      }
    ]
  },
  {
    "code": "DE",
    "name": "Alemania",
    "flag": "🇩🇪",
    "regions": [
      {
        "name": "Berlin",
        "cities": [
          {
            "name": "Berlín Capital (Startup Hub)",
            "population": 3670000,
            "lat": 52.52,
            "lng": 13.405,
            "nearbyRadiusKm": 35
          }
        ]
      },
      {
        "name": "Bavaria",
        "cities": [
          {
            "name": "Múnich",
            "population": 1488000,
            "lat": 48.1351,
            "lng": 11.582,
            "nearbyRadiusKm": 35
          }
        ]
      },
      {
        "name": "Hesse",
        "cities": [
          {
            "name": "Fráncfort (Fintech Hub)",
            "population": 764000,
            "lat": 50.1109,
            "lng": 8.6821,
            "nearbyRadiusKm": 30
          }
        ]
      }
    ]
  },
  {
    "code": "FR",
    "name": "Francia",
    "flag": "🇫🇷",
    "regions": [
      {
        "name": "Île-de-France",
        "cities": [
          {
            "name": "París Capital",
            "population": 2160000,
            "lat": 48.8566,
            "lng": 2.3522,
            "nearbyRadiusKm": 35
          }
        ]
      },
      {
        "name": "Auvergne-Rhône-Alpes",
        "cities": [
          {
            "name": "Lyon",
            "population": 522000,
            "lat": 45.764,
            "lng": 4.8357,
            "nearbyRadiusKm": 30
          }
        ]
      }
    ]
  },
  {
    "code": "IT",
    "name": "Italia",
    "flag": "🇮🇹",
    "regions": [
      {
        "name": "Lombardia",
        "cities": [
          {
            "name": "Milán (Business Hub)",
            "population": 1400000,
            "lat": 45.4642,
            "lng": 9.19,
            "nearbyRadiusKm": 35
          }
        ]
      },
      {
        "name": "Lazio",
        "cities": [
          {
            "name": "Roma Capital",
            "population": 2870000,
            "lat": 41.9028,
            "lng": 12.4964,
            "nearbyRadiusKm": 35
          }
        ]
      }
    ]
  },
  {
    "code": "PT",
    "name": "Portugal",
    "flag": "🇵🇹",
    "regions": [
      {
        "name": "Lisboa",
        "cities": [
          {
            "name": "Lisboa Capital (Web Summit Hub)",
            "population": 545000,
            "lat": 38.7223,
            "lng": -9.1393,
            "nearbyRadiusKm": 30
          }
        ]
      },
      {
        "name": "Porto",
        "cities": [
          {
            "name": "Oporto",
            "population": 237000,
            "lat": 41.1579,
            "lng": -8.6291,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "NL",
    "name": "Países Bajos",
    "flag": "🇳🇱",
    "regions": [
      {
        "name": "North Holland",
        "cities": [
          {
            "name": "Ámsterdam",
            "population": 872000,
            "lat": 52.3676,
            "lng": 4.9041,
            "nearbyRadiusKm": 30
          },
          {
            "name": "Róterdam",
            "population": 651000,
            "lat": 51.9244,
            "lng": 4.4777,
            "nearbyRadiusKm": 30
          }
        ]
      }
    ]
  },
  {
    "code": "CH",
    "name": "Suiza",
    "flag": "🇨🇭",
    "regions": [
      {
        "name": "Zürich",
        "cities": [
          {
            "name": "Zúrich (Fintech & Tech Hub)",
            "population": 421000,
            "lat": 47.3769,
            "lng": 8.5417,
            "nearbyRadiusKm": 30
          },
          {
            "name": "Ginebra",
            "population": 203000,
            "lat": 46.2044,
            "lng": 6.1432,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "SE",
    "name": "Suecia",
    "flag": "🇸🇪",
    "regions": [
      {
        "name": "Stockholm",
        "cities": [
          {
            "name": "Estocolmo",
            "population": 975000,
            "lat": 59.3293,
            "lng": 18.0686,
            "nearbyRadiusKm": 30
          }
        ]
      }
    ]
  },
  {
    "code": "IE",
    "name": "Irlanda",
    "flag": "🇮🇪",
    "regions": [
      {
        "name": "Leinster",
        "cities": [
          {
            "name": "Dublín (Silicon Docks HQ)",
            "population": 544000,
            "lat": 53.3498,
            "lng": -6.2603,
            "nearbyRadiusKm": 30
          }
        ]
      }
    ]
  },
  {
    "code": "JP",
    "name": "Japón",
    "flag": "🇯🇵",
    "regions": [
      {
        "name": "Tokyo",
        "cities": [
          {
            "name": "Tokio Capital",
            "population": 14000000,
            "lat": 35.6762,
            "lng": 139.6503,
            "nearbyRadiusKm": 45
          },
          {
            "name": "Osaka",
            "population": 2750000,
            "lat": 34.6937,
            "lng": 135.5023,
            "nearbyRadiusKm": 35
          }
        ]
      }
    ]
  },
  {
    "code": "AU",
    "name": "Australia",
    "flag": "🇦🇺",
    "regions": [
      {
        "name": "New South Wales",
        "cities": [
          {
            "name": "Sídney",
            "population": 5312000,
            "lat": -33.8688,
            "lng": 151.2093,
            "nearbyRadiusKm": 40
          }
        ]
      },
      {
        "name": "Victoria",
        "cities": [
          {
            "name": "Melbourne",
            "population": 5078000,
            "lat": -37.8136,
            "lng": 144.9631,
            "nearbyRadiusKm": 40
          }
        ]
      }
    ]
  },
  {
    "code": "SG",
    "name": "Singapur",
    "flag": "🇸🇬",
    "regions": [
      {
        "name": "Singapore",
        "cities": [
          {
            "name": "Singapur (Global Hub)",
            "population": 5686000,
            "lat": 1.3521,
            "lng": 103.8198,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "AE",
    "name": "Emiratos Árabes Unidos",
    "flag": "🇦🇪",
    "regions": [
      {
        "name": "Dubai & Abu Dhabi",
        "cities": [
          {
            "name": "Dubái (Global Business Hub)",
            "population": 3500000,
            "lat": 25.2048,
            "lng": 55.2708,
            "nearbyRadiusKm": 35
          },
          {
            "name": "Abu Dabi",
            "population": 1500000,
            "lat": 24.4539,
            "lng": 54.3773,
            "nearbyRadiusKm": 35
          }
        ]
      }
    ]
  },
  {
    "code": "IL",
    "name": "Israel",
    "flag": "🇮🇱",
    "regions": [
      {
        "name": "Tel Aviv",
        "cities": [
          {
            "name": "Tel Aviv (Silicon Wadi)",
            "population": 460000,
            "lat": 32.0853,
            "lng": 34.7818,
            "nearbyRadiusKm": 30
          }
        ]
      }
    ]
  },
  {
    "code": "IN",
    "name": "India",
    "flag": "🇮🇳",
    "regions": [
      {
        "name": "Karnataka & Maharashtra",
        "cities": [
          {
            "name": "Bangalore (Silicon Valley of India)",
            "population": 8443000,
            "lat": 12.9716,
            "lng": 77.5946,
            "nearbyRadiusKm": 40
          },
          {
            "name": "Bombay / Mumbai",
            "population": 12442000,
            "lat": 19.076,
            "lng": 72.8777,
            "nearbyRadiusKm": 45
          }
        ]
      }
    ]
  },
  {
    "code": "ZA",
    "name": "Sudáfrica",
    "flag": "🇿🇦",
    "regions": [
      {
        "name": "Gauteng & Western Cape",
        "cities": [
          {
            "name": "Johannesburgo",
            "population": 4434000,
            "lat": -26.2041,
            "lng": 28.0473,
            "nearbyRadiusKm": 40
          },
          {
            "name": "Ciudad del Cabo",
            "population": 4336000,
            "lat": -33.9249,
            "lng": 18.4241,
            "nearbyRadiusKm": 40
          }
        ]
      }
    ]
  },
  {
    "code": "NO",
    "name": "Noruega",
    "flag": "🇳🇴",
    "regions": [
      {
        "name": "Oslo",
        "cities": [
          {
            "name": "Oslo",
            "population": 693000,
            "lat": 59.9139,
            "lng": 10.7522,
            "nearbyRadiusKm": 30
          }
        ]
      }
    ]
  },
  {
    "code": "DK",
    "name": "Dinamarca",
    "flag": "🇩🇰",
    "regions": [
      {
        "name": "Copenhagen",
        "cities": [
          {
            "name": "Copenhague",
            "population": 602000,
            "lat": 55.6761,
            "lng": 12.5683,
            "nearbyRadiusKm": 30
          }
        ]
      }
    ]
  },
  {
    "code": "FI",
    "name": "Finlandia",
    "flag": "🇫🇮",
    "regions": [
      {
        "name": "Helsinki",
        "cities": [
          {
            "name": "Helsinki",
            "population": 656000,
            "lat": 60.1699,
            "lng": 24.9384,
            "nearbyRadiusKm": 30
          }
        ]
      }
    ]
  },
  {
    "code": "PL",
    "name": "Polonia",
    "flag": "🇵🇱",
    "regions": [
      {
        "name": "Mazovia",
        "cities": [
          {
            "name": "Varsovia",
            "population": 1790000,
            "lat": 52.2297,
            "lng": 21.0122,
            "nearbyRadiusKm": 35
          },
          {
            "name": "Cracovia",
            "population": 780000,
            "lat": 50.0647,
            "lng": 19.945,
            "nearbyRadiusKm": 30
          }
        ]
      }
    ]
  },
  {
    "code": "AT",
    "name": "Austria",
    "flag": "🇦🇹",
    "regions": [
      {
        "name": "Viena",
        "cities": [
          {
            "name": "Viena",
            "population": 1910000,
            "lat": 48.2082,
            "lng": 16.3738,
            "nearbyRadiusKm": 30
          }
        ]
      }
    ]
  },
  {
    "code": "BE",
    "name": "Bélgica",
    "flag": "🇧🇪",
    "regions": [
      {
        "name": "Bruselas",
        "cities": [
          {
            "name": "Bruselas",
            "population": 1208000,
            "lat": 50.8503,
            "lng": 4.3517,
            "nearbyRadiusKm": 30
          }
        ]
      }
    ]
  },
  {
    "code": "CZ",
    "name": "República Checa",
    "flag": "🇨🇿",
    "regions": [
      {
        "name": "Praga",
        "cities": [
          {
            "name": "Praga",
            "population": 1309000,
            "lat": 50.0755,
            "lng": 14.4378,
            "nearbyRadiusKm": 30
          }
        ]
      }
    ]
  },
  {
    "code": "GR",
    "name": "Grecia",
    "flag": "🇬🇷",
    "regions": [
      {
        "name": "Ática",
        "cities": [
          {
            "name": "Atenas",
            "population": 3153000,
            "lat": 37.9838,
            "lng": 23.7275,
            "nearbyRadiusKm": 35
          }
        ]
      }
    ]
  },
  {
    "code": "HU",
    "name": "Hungría",
    "flag": "🇭🇺",
    "regions": [
      {
        "name": "Budapest",
        "cities": [
          {
            "name": "Budapest",
            "population": 1752000,
            "lat": 47.4979,
            "lng": 19.0402,
            "nearbyRadiusKm": 35
          }
        ]
      }
    ]
  },
  {
    "code": "RO",
    "name": "Rumania",
    "flag": "🇷🇴",
    "regions": [
      {
        "name": "Bucarest",
        "cities": [
          {
            "name": "Bucarest",
            "population": 1830000,
            "lat": 44.4268,
            "lng": 26.1025,
            "nearbyRadiusKm": 35
          }
        ]
      }
    ]
  },
  {
    "code": "NZ",
    "name": "Nueva Zelanda",
    "flag": "🇳🇿",
    "regions": [
      {
        "name": "Auckland",
        "cities": [
          {
            "name": "Auckland",
            "population": 1657000,
            "lat": -36.8485,
            "lng": 174.7633,
            "nearbyRadiusKm": 35
          },
          {
            "name": "Wellington",
            "population": 215000,
            "lat": -41.2865,
            "lng": 174.7762,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "KR",
    "name": "Corea del Sur",
    "flag": "🇰🇷",
    "regions": [
      {
        "name": "Seúl",
        "cities": [
          {
            "name": "Seúl",
            "population": 9776000,
            "lat": 37.5665,
            "lng": 126.978,
            "nearbyRadiusKm": 40
          }
        ]
      }
    ]
  },
  {
    "code": "TW",
    "name": "Taiwán",
    "flag": "🇹🇼",
    "regions": [
      {
        "name": "Taipéi",
        "cities": [
          {
            "name": "Taipéi",
            "population": 2600000,
            "lat": 25.033,
            "lng": 121.5654,
            "nearbyRadiusKm": 30
          }
        ]
      }
    ]
  },
  {
    "code": "TH",
    "name": "Tailandia",
    "flag": "🇹🇭",
    "regions": [
      {
        "name": "Bangkok",
        "cities": [
          {
            "name": "Bangkok",
            "population": 10539000,
            "lat": 13.7563,
            "lng": 100.5018,
            "nearbyRadiusKm": 40
          }
        ]
      }
    ]
  },
  {
    "code": "VN",
    "name": "Vietnam",
    "flag": "🇻🇳",
    "regions": [
      {
        "name": "Ho Chi Minh / Hanoi",
        "cities": [
          {
            "name": "Ho Chi Minh City",
            "population": 8993000,
            "lat": 10.8231,
            "lng": 106.6297,
            "nearbyRadiusKm": 40
          }
        ]
      }
    ]
  },
  {
    "code": "MY",
    "name": "Malasia",
    "flag": "🇲🇾",
    "regions": [
      {
        "name": "Kuala Lumpur",
        "cities": [
          {
            "name": "Kuala Lumpur",
            "population": 1800000,
            "lat": 3.139,
            "lng": 101.6869,
            "nearbyRadiusKm": 35
          }
        ]
      }
    ]
  },
  {
    "code": "ID",
    "name": "Indonesia",
    "flag": "🇮🇩",
    "regions": [
      {
        "name": "Yakarta",
        "cities": [
          {
            "name": "Yakarta",
            "population": 10560000,
            "lat": -6.2088,
            "lng": 106.8456,
            "nearbyRadiusKm": 45
          }
        ]
      }
    ]
  },
  {
    "code": "PH",
    "name": "Filipinas",
    "flag": "🇵🇭",
    "regions": [
      {
        "name": "Manila",
        "cities": [
          {
            "name": "Gran Manila",
            "population": 13480000,
            "lat": 14.5995,
            "lng": 120.9842,
            "nearbyRadiusKm": 45
          }
        ]
      }
    ]
  },
  {
    "code": "SA",
    "name": "Arabia Saudita",
    "flag": "🇸🇦",
    "regions": [
      {
        "name": "Riad",
        "cities": [
          {
            "name": "Riad",
            "population": 7676000,
            "lat": 24.7136,
            "lng": 46.6753,
            "nearbyRadiusKm": 40
          }
        ]
      }
    ]
  },
  {
    "code": "QA",
    "name": "Catar",
    "flag": "🇶🇦",
    "regions": [
      {
        "name": "Doha",
        "cities": [
          {
            "name": "Doha",
            "population": 956000,
            "lat": 25.2854,
            "lng": 51.531,
            "nearbyRadiusKm": 30
          }
        ]
      }
    ]
  },
  {
    "code": "EG",
    "name": "Egipto",
    "flag": "🇪🇬",
    "regions": [
      {
        "name": "El Cairo",
        "cities": [
          {
            "name": "El Cairo",
            "population": 9540000,
            "lat": 30.0444,
            "lng": 31.2357,
            "nearbyRadiusKm": 45
          }
        ]
      }
    ]
  },
  {
    "code": "MA",
    "name": "Marruecos",
    "flag": "🇲🇦",
    "regions": [
      {
        "name": "Casablanca",
        "cities": [
          {
            "name": "Casablanca",
            "population": 3360000,
            "lat": 33.5731,
            "lng": -7.5898,
            "nearbyRadiusKm": 35
          }
        ]
      }
    ]
  },
  {
    "code": "NG",
    "name": "Nigeria",
    "flag": "🇳🇬",
    "regions": [
      {
        "name": "Lagos",
        "cities": [
          {
            "name": "Lagos",
            "population": 15388000,
            "lat": 6.5244,
            "lng": 3.3792,
            "nearbyRadiusKm": 45
          }
        ]
      }
    ]
  },
  {
    "code": "KE",
    "name": "Kenia",
    "flag": "🇰🇪",
    "regions": [
      {
        "name": "Nairobi",
        "cities": [
          {
            "name": "Nairobi",
            "population": 4397000,
            "lat": -1.2921,
            "lng": 36.8219,
            "nearbyRadiusKm": 40
          }
        ]
      }
    ]
  },
  {
    "code": "TR",
    "name": "Turquía",
    "flag": "🇹🇷",
    "regions": [
      {
        "name": "Estambul",
        "cities": [
          {
            "name": "Estambul",
            "population": 15460000,
            "lat": 41.0082,
            "lng": 28.9784,
            "nearbyRadiusKm": 45
          },
          {
            "name": "Ankara",
            "population": 5663000,
            "lat": 39.9334,
            "lng": 32.8597,
            "nearbyRadiusKm": 40
          }
        ]
      }
    ]
  },
  {
    "code": "UA",
    "name": "Ucrania",
    "flag": "🇺🇦",
    "regions": [
      {
        "name": "Kiev",
        "cities": [
          {
            "name": "Kiev",
            "population": 2962000,
            "lat": 50.4501,
            "lng": 30.5234,
            "nearbyRadiusKm": 35
          }
        ]
      }
    ]
  },
  {
    "code": "RU",
    "name": "Rusia",
    "flag": "🇷🇺",
    "regions": [
      {
        "name": "Moscú",
        "cities": [
          {
            "name": "Moscú",
            "population": 12615000,
            "lat": 55.7558,
            "lng": 37.6173,
            "nearbyRadiusKm": 45
          },
          {
            "name": "San Petersburgo",
            "population": 5384000,
            "lat": 59.9343,
            "lng": 30.3351,
            "nearbyRadiusKm": 40
          }
        ]
      }
    ]
  },
  {
    "code": "CU",
    "name": "Cuba",
    "flag": "🇨🇺",
    "regions": [
      {
        "name": "La Habana",
        "cities": [
          {
            "name": "La Habana",
            "population": 2130000,
            "lat": 23.1136,
            "lng": -82.3666,
            "nearbyRadiusKm": 30
          }
        ]
      }
    ]
  },
  {
    "code": "NI",
    "name": "Nicaragua",
    "flag": "🇳🇮",
    "regions": [
      {
        "name": "Managua",
        "cities": [
          {
            "name": "Managua",
            "population": 1055000,
            "lat": 12.115,
            "lng": -86.2362,
            "nearbyRadiusKm": 30
          }
        ]
      }
    ]
  },
  {
    "code": "JM",
    "name": "Jamaica",
    "flag": "🇯🇲",
    "regions": [
      {
        "name": "Kingston",
        "cities": [
          {
            "name": "Kingston",
            "population": 662000,
            "lat": 17.9712,
            "lng": -76.7936,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "TT",
    "name": "Trinidad y Tobago",
    "flag": "🇹🇹",
    "regions": [
      {
        "name": "Port of Spain",
        "cities": [
          {
            "name": "Puerto España",
            "population": 37000,
            "lat": 10.6549,
            "lng": -61.5019,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "IS",
    "name": "Islandia",
    "flag": "🇮🇸",
    "regions": [
      {
        "name": "Reikiavik",
        "cities": [
          {
            "name": "Reikiavik",
            "population": 131000,
            "lat": 64.1466,
            "lng": -21.9426,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "LU",
    "name": "Luxemburgo",
    "flag": "🇱🇺",
    "regions": [
      {
        "name": "Luxemburgo",
        "cities": [
          {
            "name": "Luxemburgo Ciudad",
            "population": 124000,
            "lat": 49.6116,
            "lng": 6.1319,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "AD",
    "name": "Andorra",
    "flag": "🇦🇩",
    "regions": [
      {
        "name": "Andorra la Vella",
        "cities": [
          {
            "name": "Andorra la Vella",
            "population": 22000,
            "lat": 42.5063,
            "lng": 1.5218,
            "nearbyRadiusKm": 15
          }
        ]
      }
    ]
  },
  {
    "code": "MC",
    "name": "Mónaco",
    "flag": "🇲🇨",
    "regions": [
      {
        "name": "Mónaco",
        "cities": [
          {
            "name": "Mónaco",
            "population": 39000,
            "lat": 43.7384,
            "lng": 7.4246,
            "nearbyRadiusKm": 10
          }
        ]
      }
    ]
  },
  {
    "code": "GY",
    "name": "Guyana",
    "flag": "🇬🇾",
    "regions": [
      {
        "name": "Demerara",
        "cities": [
          {
            "name": "Georgetown",
            "population": 200000,
            "lat": 6.8013,
            "lng": -58.1551,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "SR",
    "name": "Surinam",
    "flag": "🇸🇷",
    "regions": [
      {
        "name": "Paramaribo",
        "cities": [
          {
            "name": "Paramaribo",
            "population": 240000,
            "lat": 5.852,
            "lng": -55.2038,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "BZ",
    "name": "Belice",
    "flag": "🇧🇿",
    "regions": [
      {
        "name": "Belice Distrito",
        "cities": [
          {
            "name": "Ciudad de Belice",
            "population": 65000,
            "lat": 17.5046,
            "lng": -88.1962,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "AG",
    "name": "Antigua y Barbuda",
    "flag": "🇦🇬",
    "regions": [
      {
        "name": "Saint John",
        "cities": [
          {
            "name": "Saint John's",
            "population": 22000,
            "lat": 17.1274,
            "lng": -61.8468,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "BS",
    "name": "Bahamas",
    "flag": "🇧🇸",
    "regions": [
      {
        "name": "New Providence",
        "cities": [
          {
            "name": "Nassau",
            "population": 275000,
            "lat": 25.0443,
            "lng": -77.3504,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "BB",
    "name": "Barbados",
    "flag": "🇧🇧",
    "regions": [
      {
        "name": "Saint Michael",
        "cities": [
          {
            "name": "Bridgetown",
            "population": 110000,
            "lat": 13.106,
            "lng": -59.6132,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "DM",
    "name": "Dominica",
    "flag": "🇩🇲",
    "regions": [
      {
        "name": "Saint George",
        "cities": [
          {
            "name": "Roseau",
            "population": 15000,
            "lat": 15.3092,
            "lng": -61.3794,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "GD",
    "name": "Granada",
    "flag": "🇬🇩",
    "regions": [
      {
        "name": "Saint George",
        "cities": [
          {
            "name": "St. George's",
            "population": 34000,
            "lat": 12.0561,
            "lng": -61.7488,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "HT",
    "name": "Haití",
    "flag": "🇭🇹",
    "regions": [
      {
        "name": "Ouest",
        "cities": [
          {
            "name": "Puerto Príncipe",
            "population": 987000,
            "lat": 18.5944,
            "lng": -72.3074,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "KN",
    "name": "San Cristóbal y Nieves",
    "flag": "🇰🇳",
    "regions": [
      {
        "name": "Saint George Basseterre",
        "cities": [
          {
            "name": "Basseterre",
            "population": 14000,
            "lat": 17.3026,
            "lng": -62.7177,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "LC",
    "name": "Santa Lucía",
    "flag": "🇱🇨",
    "regions": [
      {
        "name": "Castries",
        "cities": [
          {
            "name": "Castries",
            "population": 70000,
            "lat": 14.0101,
            "lng": -60.9875,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "VC",
    "name": "San Vicente y las Granadinas",
    "flag": "🇻🇨",
    "regions": [
      {
        "name": "Saint George",
        "cities": [
          {
            "name": "Kingstown",
            "population": 13000,
            "lat": 13.16,
            "lng": -61.2248,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "AL",
    "name": "Albania",
    "flag": "🇦🇱",
    "regions": [
      {
        "name": "Tirana",
        "cities": [
          {
            "name": "Tirana",
            "population": 557000,
            "lat": 41.3275,
            "lng": 19.8187,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "BY",
    "name": "Bielorrusia",
    "flag": "🇧🇾",
    "regions": [
      {
        "name": "Minsk",
        "cities": [
          {
            "name": "Minsk",
            "population": 2020000,
            "lat": 53.9006,
            "lng": 27.559,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "BA",
    "name": "Bosnia y Herzegovina",
    "flag": "🇧🇦",
    "regions": [
      {
        "name": "Sarajevo",
        "cities": [
          {
            "name": "Sarajevo",
            "population": 275000,
            "lat": 43.8563,
            "lng": 18.4131,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "BG",
    "name": "Bulgaria",
    "flag": "🇧🇬",
    "regions": [
      {
        "name": "Sofía",
        "cities": [
          {
            "name": "Sofía",
            "population": 1243000,
            "lat": 42.6977,
            "lng": 23.3219,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "CY",
    "name": "Chipre",
    "flag": "🇨🇾",
    "regions": [
      {
        "name": "Nicosia",
        "cities": [
          {
            "name": "Nicosia",
            "population": 240000,
            "lat": 35.1856,
            "lng": 33.3823,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "VA",
    "name": "Ciudad del Vaticano",
    "flag": "🇻🇦",
    "regions": [
      {
        "name": "Vaticano",
        "cities": [
          {
            "name": "Ciudad del Vaticano",
            "population": 800,
            "lat": 41.9029,
            "lng": 12.4534,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "HR",
    "name": "Croacia",
    "flag": "🇭🇷",
    "regions": [
      {
        "name": "Zagreb",
        "cities": [
          {
            "name": "Zagreb",
            "population": 806000,
            "lat": 45.815,
            "lng": 15.9819,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "SK",
    "name": "Eslovaquia",
    "flag": "🇸🇰",
    "regions": [
      {
        "name": "Bratislava",
        "cities": [
          {
            "name": "Bratislava",
            "population": 437000,
            "lat": 48.1486,
            "lng": 17.1077,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "SI",
    "name": "Eslovenia",
    "flag": "🇸🇮",
    "regions": [
      {
        "name": "Liubliana",
        "cities": [
          {
            "name": "Liubliana",
            "population": 295000,
            "lat": 46.0569,
            "lng": 14.5058,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "EE",
    "name": "Estonia",
    "flag": "🇪🇪",
    "regions": [
      {
        "name": "Harju",
        "cities": [
          {
            "name": "Tallin",
            "population": 437000,
            "lat": 59.437,
            "lng": 24.7535,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "XK",
    "name": "Kosovo",
    "flag": "🇽🇰",
    "regions": [
      {
        "name": "Pristina",
        "cities": [
          {
            "name": "Pristina",
            "population": 216000,
            "lat": 42.6629,
            "lng": 21.1655,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "LV",
    "name": "Letonia",
    "flag": "🇱🇻",
    "regions": [
      {
        "name": "Riga",
        "cities": [
          {
            "name": "Riga",
            "population": 614000,
            "lat": 56.9496,
            "lng": 24.1052,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "LI",
    "name": "Liechtenstein",
    "flag": "🇱🇮",
    "regions": [
      {
        "name": "Vaduz",
        "cities": [
          {
            "name": "Vaduz",
            "population": 5700,
            "lat": 47.141,
            "lng": 9.5209,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "LT",
    "name": "Lituania",
    "flag": "🇱🇹",
    "regions": [
      {
        "name": "Vilna",
        "cities": [
          {
            "name": "Vilna",
            "population": 592000,
            "lat": 54.6872,
            "lng": 25.2797,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "MK",
    "name": "Macedonia del Norte",
    "flag": "🇲🇰",
    "regions": [
      {
        "name": "Skopie",
        "cities": [
          {
            "name": "Skopie",
            "population": 546000,
            "lat": 41.9981,
            "lng": 21.4254,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "MT",
    "name": "Malta",
    "flag": "🇲🇹",
    "regions": [
      {
        "name": "La Valeta",
        "cities": [
          {
            "name": "La Valeta",
            "population": 6000,
            "lat": 35.8989,
            "lng": 14.5146,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "MD",
    "name": "Moldavia",
    "flag": "🇲🇩",
    "regions": [
      {
        "name": "Chisináu",
        "cities": [
          {
            "name": "Chisináu",
            "population": 532000,
            "lat": 47.0105,
            "lng": 28.8638,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "ME",
    "name": "Montenegro",
    "flag": "🇲🇪",
    "regions": [
      {
        "name": "Podgorica",
        "cities": [
          {
            "name": "Podgorica",
            "population": 151000,
            "lat": 42.4304,
            "lng": 19.2594,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "SM",
    "name": "San Marino",
    "flag": "🇸🇲",
    "regions": [
      {
        "name": "San Marino",
        "cities": [
          {
            "name": "San Marino",
            "population": 4000,
            "lat": 43.9424,
            "lng": 12.4578,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "RS",
    "name": "Serbia",
    "flag": "🇷🇸",
    "regions": [
      {
        "name": "Belgrado",
        "cities": [
          {
            "name": "Belgrado",
            "population": 1374000,
            "lat": 44.7866,
            "lng": 20.4489,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "AF",
    "name": "Afganistán",
    "flag": "🇦🇫",
    "regions": [
      {
        "name": "Kabul",
        "cities": [
          {
            "name": "Kabul",
            "population": 4434000,
            "lat": 34.5553,
            "lng": 69.2075,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "AM",
    "name": "Armenia",
    "flag": "🇦🇲",
    "regions": [
      {
        "name": "Ereván",
        "cities": [
          {
            "name": "Ereván",
            "population": 1092000,
            "lat": 40.1792,
            "lng": 44.4991,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "AZ",
    "name": "Azerbaiyán",
    "flag": "🇦🇿",
    "regions": [
      {
        "name": "Bakú",
        "cities": [
          {
            "name": "Bakú",
            "population": 2300000,
            "lat": 40.4093,
            "lng": 49.8671,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "BH",
    "name": "Baréin",
    "flag": "🇧🇭",
    "regions": [
      {
        "name": "Manama",
        "cities": [
          {
            "name": "Manama",
            "population": 200000,
            "lat": 26.2285,
            "lng": 50.586,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "BD",
    "name": "Bangladés",
    "flag": "🇧🇩",
    "regions": [
      {
        "name": "Daca",
        "cities": [
          {
            "name": "Daca",
            "population": 22478000,
            "lat": 23.8103,
            "lng": 90.4125,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "BN",
    "name": "Brunéi",
    "flag": "🇧🇳",
    "regions": [
      {
        "name": "Bandar Seri Begawan",
        "cities": [
          {
            "name": "Bandar Seri Begawan",
            "population": 100000,
            "lat": 4.9031,
            "lng": 114.9398,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "BT",
    "name": "Bután",
    "flag": "🇧🇹",
    "regions": [
      {
        "name": "Timbu",
        "cities": [
          {
            "name": "Timbu",
            "population": 114000,
            "lat": 27.4728,
            "lng": 89.6393,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "KH",
    "name": "Camboya",
    "flag": "🇰🇭",
    "regions": [
      {
        "name": "Nom Pen",
        "cities": [
          {
            "name": "Nom Pen",
            "population": 2129000,
            "lat": 11.5564,
            "lng": 104.9282,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "CN",
    "name": "China",
    "flag": "🇨🇳",
    "regions": [
      {
        "name": "Pekín / Shanghái",
        "cities": [
          {
            "name": "Shanghái",
            "population": 26320000,
            "lat": 31.2304,
            "lng": 121.4737,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "KP",
    "name": "Corea del Norte",
    "flag": "🇰🇵",
    "regions": [
      {
        "name": "Pionyang",
        "cities": [
          {
            "name": "Pionyang",
            "population": 3084000,
            "lat": 39.0392,
            "lng": 125.7625,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "GE",
    "name": "Georgia",
    "flag": "🇬🇪",
    "regions": [
      {
        "name": "Tiflis",
        "cities": [
          {
            "name": "Tiflis",
            "population": 1150000,
            "lat": 41.7151,
            "lng": 44.8271,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "IQ",
    "name": "Irak",
    "flag": "🇮🇶",
    "regions": [
      {
        "name": "Bagdad",
        "cities": [
          {
            "name": "Bagdad",
            "population": 7100000,
            "lat": 33.3152,
            "lng": 44.3661,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "IR",
    "name": "Irán",
    "flag": "🇮🇷",
    "regions": [
      {
        "name": "Teherán",
        "cities": [
          {
            "name": "Teherán",
            "population": 9000000,
            "lat": 35.6892,
            "lng": 51.389,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "JO",
    "name": "Jordania",
    "flag": "🇯🇴",
    "regions": [
      {
        "name": "Amán",
        "cities": [
          {
            "name": "Amán",
            "population": 4000000,
            "lat": 31.9454,
            "lng": 35.9284,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "KZ",
    "name": "Kazajistán",
    "flag": "🇰🇿",
    "regions": [
      {
        "name": "Almaty",
        "cities": [
          {
            "name": "Almaty",
            "population": 2000000,
            "lat": 43.222,
            "lng": 76.8512,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "KG",
    "name": "Kirguistán",
    "flag": "🇰🇬",
    "regions": [
      {
        "name": "Biskek",
        "cities": [
          {
            "name": "Biskek",
            "population": 1050000,
            "lat": 42.8746,
            "lng": 74.5698,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "KW",
    "name": "Kuwait",
    "flag": "🇰🇼",
    "regions": [
      {
        "name": "Ciudad de Kuwait",
        "cities": [
          {
            "name": "Ciudad de Kuwait",
            "population": 3000000,
            "lat": 29.3759,
            "lng": 47.9774,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "LA",
    "name": "Laos",
    "flag": "🇱🇦",
    "regions": [
      {
        "name": "Vientián",
        "cities": [
          {
            "name": "Vientián",
            "population": 948000,
            "lat": 17.9757,
            "lng": 102.6331,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "LB",
    "name": "Líbano",
    "flag": "🇱🇧",
    "regions": [
      {
        "name": "Beirut",
        "cities": [
          {
            "name": "Beirut",
            "population": 2200000,
            "lat": 33.8938,
            "lng": 35.5018,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "MV",
    "name": "Maldivas",
    "flag": "🇲🇻",
    "regions": [
      {
        "name": "Malé",
        "cities": [
          {
            "name": "Malé",
            "population": 252000,
            "lat": 4.1755,
            "lng": 73.5093,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "MN",
    "name": "Mongolia",
    "flag": "🇲🇳",
    "regions": [
      {
        "name": "Ulán Bator",
        "cities": [
          {
            "name": "Ulán Bator",
            "population": 1450000,
            "lat": 47.9212,
            "lng": 106.9186,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "MM",
    "name": "Myanmar",
    "flag": "🇲🇲",
    "regions": [
      {
        "name": "Rangún",
        "cities": [
          {
            "name": "Rangún",
            "population": 5430000,
            "lat": 16.8661,
            "lng": 96.1951,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "NP",
    "name": "Nepal",
    "flag": "🇳🇵",
    "regions": [
      {
        "name": "Katmandú",
        "cities": [
          {
            "name": "Katmandú",
            "population": 1442000,
            "lat": 27.7172,
            "lng": 85.324,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "OM",
    "name": "Omán",
    "flag": "🇴🇲",
    "regions": [
      {
        "name": "Mascate",
        "cities": [
          {
            "name": "Mascate",
            "population": 1400000,
            "lat": 23.588,
            "lng": 58.3829,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "PK",
    "name": "Pakistán",
    "flag": "🇵🇰",
    "regions": [
      {
        "name": "Karachi",
        "cities": [
          {
            "name": "Karachi",
            "population": 16000000,
            "lat": 24.8607,
            "lng": 67.0011,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "PS",
    "name": "Palestina",
    "flag": "🇵🇸",
    "regions": [
      {
        "name": "Ramala / Gaza",
        "cities": [
          {
            "name": "Ramala",
            "population": 310000,
            "lat": 31.9038,
            "lng": 35.2034,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "SY",
    "name": "Siria",
    "flag": "🇸🇾",
    "regions": [
      {
        "name": "Damasco",
        "cities": [
          {
            "name": "Damasco",
            "population": 2000000,
            "lat": 33.5138,
            "lng": 36.2765,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "LK",
    "name": "Sri Lanka",
    "flag": "🇱🇰",
    "regions": [
      {
        "name": "Colombo",
        "cities": [
          {
            "name": "Colombo",
            "population": 752000,
            "lat": 6.9271,
            "lng": 79.8612,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "TJ",
    "name": "Tayikistán",
    "flag": "🇹🇯",
    "regions": [
      {
        "name": "Dusambé",
        "cities": [
          {
            "name": "Dusambé",
            "population": 863000,
            "lat": 38.5598,
            "lng": 68.787,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "TL",
    "name": "Timor Oriental",
    "flag": "🇹🇱",
    "regions": [
      {
        "name": "Dili",
        "cities": [
          {
            "name": "Dili",
            "population": 222000,
            "lat": -8.5569,
            "lng": 125.5603,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "TM",
    "name": "Turkmenistán",
    "flag": "🇹🇲",
    "regions": [
      {
        "name": "Asjabad",
        "cities": [
          {
            "name": "Asjabad",
            "population": 1030000,
            "lat": 37.9601,
            "lng": 58.3261,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "UZ",
    "name": "Uzbekistán",
    "flag": "🇺🇿",
    "regions": [
      {
        "name": "Taskent",
        "cities": [
          {
            "name": "Taskent",
            "population": 2500000,
            "lat": 41.2995,
            "lng": 69.2401,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "YE",
    "name": "Yemen",
    "flag": "🇾🇪",
    "regions": [
      {
        "name": "Saná",
        "cities": [
          {
            "name": "Saná",
            "population": 2957000,
            "lat": 15.3694,
            "lng": 44.191,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "AO",
    "name": "Angola",
    "flag": "🇦🇴",
    "regions": [
      {
        "name": "Luanda",
        "cities": [
          {
            "name": "Luanda",
            "population": 8300000,
            "lat": -8.839,
            "lng": 13.2894,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "DZ",
    "name": "Argelia",
    "flag": "🇩🇿",
    "regions": [
      {
        "name": "Argel",
        "cities": [
          {
            "name": "Argel",
            "population": 2800000,
            "lat": 36.7538,
            "lng": 3.0588,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "BJ",
    "name": "Benín",
    "flag": "🇧🇯",
    "regions": [
      {
        "name": "Cotonú",
        "cities": [
          {
            "name": "Cotonú",
            "population": 679000,
            "lat": 6.3654,
            "lng": 2.4183,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "BW",
    "name": "Botsuana",
    "flag": "🇧🇼",
    "regions": [
      {
        "name": "Gaborone",
        "cities": [
          {
            "name": "Gaborone",
            "population": 270000,
            "lat": -24.6282,
            "lng": 25.9231,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "BF",
    "name": "Burkina Faso",
    "flag": "🇧🇫",
    "regions": [
      {
        "name": "Uagadugú",
        "cities": [
          {
            "name": "Uagadugú",
            "population": 2453000,
            "lat": 12.3714,
            "lng": -1.5197,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "BI",
    "name": "Burundi",
    "flag": "🇧🇮",
    "regions": [
      {
        "name": "Buyumbura",
        "cities": [
          {
            "name": "Buyumbura",
            "population": 1000000,
            "lat": -3.3731,
            "lng": 29.3644,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "CV",
    "name": "Cabo Verde",
    "flag": "🇨🇻",
    "regions": [
      {
        "name": "Praia",
        "cities": [
          {
            "name": "Praia",
            "population": 159000,
            "lat": 14.933,
            "lng": -23.5133,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "CM",
    "name": "Camerún",
    "flag": "🇨🇲",
    "regions": [
      {
        "name": "Douala / Yaundé",
        "cities": [
          {
            "name": "Douala",
            "population": 3660000,
            "lat": 4.0511,
            "lng": 9.7679,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "TD",
    "name": "Chad",
    "flag": "🇹🇩",
    "regions": [
      {
        "name": "Yamena",
        "cities": [
          {
            "name": "Yamena",
            "population": 1092000,
            "lat": 12.1348,
            "lng": 15.0557,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "KM",
    "name": "Comoras",
    "flag": "🇰🇲",
    "regions": [
      {
        "name": "Moroni",
        "cities": [
          {
            "name": "Moroni",
            "population": 111000,
            "lat": -11.7172,
            "lng": 43.2473,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "CI",
    "name": "Costa de Marfil",
    "flag": "🇨🇮",
    "regions": [
      {
        "name": "Abiyán",
        "cities": [
          {
            "name": "Abiyán",
            "population": 5616000,
            "lat": 5.36,
            "lng": -4.0083,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "ER",
    "name": "Eritrea",
    "flag": "🇪🇷",
    "regions": [
      {
        "name": "Asmara",
        "cities": [
          {
            "name": "Asmara",
            "population": 963000,
            "lat": 15.3229,
            "lng": 38.9251,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "SZ",
    "name": "Esuatini (Suazilandia)",
    "flag": "🇸🇿",
    "regions": [
      {
        "name": "Mbabane",
        "cities": [
          {
            "name": "Mbabane",
            "population": 95000,
            "lat": -26.3054,
            "lng": 31.1367,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "ET",
    "name": "Etiopía",
    "flag": "🇪🇹",
    "regions": [
      {
        "name": "Adís Abeba",
        "cities": [
          {
            "name": "Adís Abeba",
            "population": 5228000,
            "lat": 9.032,
            "lng": 38.7469,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "GA",
    "name": "Gabón",
    "flag": "🇬🇦",
    "regions": [
      {
        "name": "Libreville",
        "cities": [
          {
            "name": "Libreville",
            "population": 703000,
            "lat": 0.4162,
            "lng": 9.4673,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "GM",
    "name": "Gambia",
    "flag": "🇬🇲",
    "regions": [
      {
        "name": "Banjul",
        "cities": [
          {
            "name": "Banjul",
            "population": 31000,
            "lat": 13.4549,
            "lng": -16.579,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "GH",
    "name": "Ghana",
    "flag": "🇬🇭",
    "regions": [
      {
        "name": "Acra",
        "cities": [
          {
            "name": "Acra",
            "population": 2557000,
            "lat": 5.6037,
            "lng": -0.187,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "GN",
    "name": "Guinea",
    "flag": "🇬🇳",
    "regions": [
      {
        "name": "Conakri",
        "cities": [
          {
            "name": "Conakri",
            "population": 1930000,
            "lat": 9.6412,
            "lng": -13.5784,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "GW",
    "name": "Guinea-Bisáu",
    "flag": "🇬🇼",
    "regions": [
      {
        "name": "Bisáu",
        "cities": [
          {
            "name": "Bisáu",
            "population": 492000,
            "lat": 11.8816,
            "lng": -15.6178,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "GQ",
    "name": "Guinea Ecuatorial",
    "flag": "🇬🇶",
    "regions": [
      {
        "name": "Malabo",
        "cities": [
          {
            "name": "Malabo",
            "population": 297000,
            "lat": 3.7504,
            "lng": 8.7371,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "LS",
    "name": "Lesoto",
    "flag": "🇱🇸",
    "regions": [
      {
        "name": "Maseru",
        "cities": [
          {
            "name": "Maseru",
            "population": 330000,
            "lat": -29.3151,
            "lng": 27.4869,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "LR",
    "name": "Liberia",
    "flag": "🇱🇷",
    "regions": [
      {
        "name": "Monrovia",
        "cities": [
          {
            "name": "Monrovia",
            "population": 1021000,
            "lat": 6.3156,
            "lng": -10.8074,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "LY",
    "name": "Libia",
    "flag": "🇱🇾",
    "regions": [
      {
        "name": "Trípoli",
        "cities": [
          {
            "name": "Trípoli",
            "population": 1170000,
            "lat": 32.8872,
            "lng": 13.1913,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "MG",
    "name": "Madagascar",
    "flag": "🇲🇬",
    "regions": [
      {
        "name": "Antananarivo",
        "cities": [
          {
            "name": "Antananarivo",
            "population": 1275000,
            "lat": -18.8792,
            "lng": 47.5079,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "MW",
    "name": "Malaui",
    "flag": "🇲🇼",
    "regions": [
      {
        "name": "Lilongüe",
        "cities": [
          {
            "name": "Lilongüe",
            "population": 989000,
            "lat": -13.9626,
            "lng": 33.7741,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "ML",
    "name": "Malí",
    "flag": "🇲🇱",
    "regions": [
      {
        "name": "Bamako",
        "cities": [
          {
            "name": "Bamako",
            "population": 2713000,
            "lat": 12.6392,
            "lng": -8.0029,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "MU",
    "name": "Mauricio",
    "flag": "🇲🇺",
    "regions": [
      {
        "name": "Port Louis",
        "cities": [
          {
            "name": "Port Louis",
            "population": 147000,
            "lat": -20.1609,
            "lng": 57.5012,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "MR",
    "name": "Mauritania",
    "flag": "🇲🇷",
    "regions": [
      {
        "name": "Nuakchot",
        "cities": [
          {
            "name": "Nuakchot",
            "population": 1195000,
            "lat": 18.0735,
            "lng": -15.9582,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "MZ",
    "name": "Mozambique",
    "flag": "🇲🇿",
    "regions": [
      {
        "name": "Maputo",
        "cities": [
          {
            "name": "Maputo",
            "population": 1120000,
            "lat": -25.9692,
            "lng": 32.5732,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "NA",
    "name": "Namibia",
    "flag": "🇳🇦",
    "regions": [
      {
        "name": "Windhoek",
        "cities": [
          {
            "name": "Windhoek",
            "population": 431000,
            "lat": -22.5609,
            "lng": 17.0658,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "NE",
    "name": "Níger",
    "flag": "🇳🇪",
    "regions": [
      {
        "name": "Niamey",
        "cities": [
          {
            "name": "Niamey",
            "population": 1302000,
            "lat": 13.5116,
            "lng": 2.1254,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "CF",
    "name": "República Centroafricana",
    "flag": "🇨🇫",
    "regions": [
      {
        "name": "Bangui",
        "cities": [
          {
            "name": "Bangui",
            "population": 889000,
            "lat": 4.3947,
            "lng": 18.5582,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "CG",
    "name": "República del Congo",
    "flag": "🇨🇬",
    "regions": [
      {
        "name": "Brazzaville",
        "cities": [
          {
            "name": "Brazzaville",
            "population": 2145000,
            "lat": -4.2634,
            "lng": 15.2429,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "CD",
    "name": "Rep. Democrática del Congo",
    "flag": "🇨🇩",
    "regions": [
      {
        "name": "Kinshasa",
        "cities": [
          {
            "name": "Kinshasa",
            "population": 17000000,
            "lat": -4.4419,
            "lng": 15.2663,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "RW",
    "name": "Ruanda",
    "flag": "🇷🇼",
    "regions": [
      {
        "name": "Kigali",
        "cities": [
          {
            "name": "Kigali",
            "population": 1208000,
            "lat": -1.9706,
            "lng": 30.1044,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "ST",
    "name": "Santo Tomé y Príncipe",
    "flag": "🇸🇹",
    "regions": [
      {
        "name": "Santo Tomé",
        "cities": [
          {
            "name": "Santo Tomé",
            "population": 71000,
            "lat": 0.3302,
            "lng": 6.7273,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "SN",
    "name": "Senegal",
    "flag": "🇸🇳",
    "regions": [
      {
        "name": "Dakar",
        "cities": [
          {
            "name": "Dakar",
            "population": 3938000,
            "lat": 14.7167,
            "lng": -17.4677,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "SC",
    "name": "Seychelles",
    "flag": "🇸🇨",
    "regions": [
      {
        "name": "Victoria",
        "cities": [
          {
            "name": "Victoria",
            "population": 26000,
            "lat": -4.6191,
            "lng": 55.4513,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "SL",
    "name": "Sierra Leona",
    "flag": "🇸🇱",
    "regions": [
      {
        "name": "Freetown",
        "cities": [
          {
            "name": "Freetown",
            "population": 1200000,
            "lat": 8.484,
            "lng": -13.2299,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "SO",
    "name": "Somalia",
    "flag": "🇸🇴",
    "regions": [
      {
        "name": "Mogadiscio",
        "cities": [
          {
            "name": "Mogadiscio",
            "population": 2587000,
            "lat": 2.0469,
            "lng": 45.3182,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "SD",
    "name": "Sudán",
    "flag": "🇸🇩",
    "regions": [
      {
        "name": "Jartum",
        "cities": [
          {
            "name": "Jartum",
            "population": 5274000,
            "lat": 15.5007,
            "lng": 32.5599,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "SS",
    "name": "Sudán del Sur",
    "flag": "🇸🇸",
    "regions": [
      {
        "name": "Yuba",
        "cities": [
          {
            "name": "Yuba",
            "population": 525000,
            "lat": 4.8594,
            "lng": 31.5713,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "TZ",
    "name": "Tanzania",
    "flag": "🇹🇿",
    "regions": [
      {
        "name": "Dar es-Salam",
        "cities": [
          {
            "name": "Dar es-Salam",
            "population": 7400000,
            "lat": -6.7924,
            "lng": 39.2083,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "TG",
    "name": "Togo",
    "flag": "🇹🇬",
    "regions": [
      {
        "name": "Lomé",
        "cities": [
          {
            "name": "Lomé",
            "population": 837000,
            "lat": 6.1256,
            "lng": 1.2254,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "TN",
    "name": "Túnez",
    "flag": "🇹🇳",
    "regions": [
      {
        "name": "Túnez",
        "cities": [
          {
            "name": "Túnez",
            "population": 1056000,
            "lat": 36.8065,
            "lng": 10.1815,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "UG",
    "name": "Uganda",
    "flag": "🇺🇬",
    "regions": [
      {
        "name": "Kampala",
        "cities": [
          {
            "name": "Kampala",
            "population": 1680000,
            "lat": 0.3476,
            "lng": 32.5825,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "DJ",
    "name": "Yibuti",
    "flag": "🇩🇯",
    "regions": [
      {
        "name": "Yibuti Ciudad",
        "cities": [
          {
            "name": "Yibuti",
            "population": 623000,
            "lat": 11.8251,
            "lng": 42.5903,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "ZM",
    "name": "Zambia",
    "flag": "🇿🇲",
    "regions": [
      {
        "name": "Lusaka",
        "cities": [
          {
            "name": "Lusaka",
            "population": 2900000,
            "lat": -15.3875,
            "lng": 28.3228,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "ZW",
    "name": "Zimbabue",
    "flag": "🇿🇼",
    "regions": [
      {
        "name": "Harare",
        "cities": [
          {
            "name": "Harare",
            "population": 1542000,
            "lat": -17.8252,
            "lng": 31.0335,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "FJ",
    "name": "Fiyi",
    "flag": "🇫🇯",
    "regions": [
      {
        "name": "Suva",
        "cities": [
          {
            "name": "Suva",
            "population": 93000,
            "lat": -18.1248,
            "lng": 178.4501,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "MH",
    "name": "Islas Marshall",
    "flag": "🇲🇭",
    "regions": [
      {
        "name": "Majuro",
        "cities": [
          {
            "name": "Majuro",
            "population": 28000,
            "lat": 7.1315,
            "lng": 171.1845,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "SB",
    "name": "Islas Salomón",
    "flag": "🇸🇧",
    "regions": [
      {
        "name": "Honiara",
        "cities": [
          {
            "name": "Honiara",
            "population": 84000,
            "lat": -9.4456,
            "lng": 159.9729,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "KI",
    "name": "Kiribati",
    "flag": "🇰🇮",
    "regions": [
      {
        "name": "Tarawa",
        "cities": [
          {
            "name": "Tarawa Sur",
            "population": 63000,
            "lat": 1.3382,
            "lng": 173.0176,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "FM",
    "name": "Micronesia",
    "flag": "🇫🇲",
    "regions": [
      {
        "name": "Pohnpei",
        "cities": [
          {
            "name": "Palikir",
            "population": 7000,
            "lat": 6.9248,
            "lng": 158.1611,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "NR",
    "name": "Nauru",
    "flag": "🇳🇷",
    "regions": [
      {
        "name": "Yaren",
        "cities": [
          {
            "name": "Yaren",
            "population": 10000,
            "lat": -0.5477,
            "lng": 166.9209,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "PW",
    "name": "Palaos",
    "flag": "🇵🇼",
    "regions": [
      {
        "name": "Koror",
        "cities": [
          {
            "name": "Koror",
            "population": 11000,
            "lat": 7.3419,
            "lng": 134.4792,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "PG",
    "name": "Papúa Nueva Guinea",
    "flag": "🇵🇬",
    "regions": [
      {
        "name": "Distrito Capital",
        "cities": [
          {
            "name": "Port Moresby",
            "population": 383000,
            "lat": -9.4438,
            "lng": 147.1803,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "WS",
    "name": "Samoa",
    "flag": "🇼🇸",
    "regions": [
      {
        "name": "Tuamasaga",
        "cities": [
          {
            "name": "Apia",
            "population": 37000,
            "lat": -13.8328,
            "lng": -171.7686,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "TO",
    "name": "Tonga",
    "flag": "🇹🇴",
    "regions": [
      {
        "name": "Tongatapu",
        "cities": [
          {
            "name": "Nuku'alofa",
            "population": 24000,
            "lat": -21.1393,
            "lng": -175.2018,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "TV",
    "name": "Tuvalu",
    "flag": "🇹🇻",
    "regions": [
      {
        "name": "Funafuti",
        "cities": [
          {
            "name": "Funafuti",
            "population": 6300,
            "lat": -8.5211,
            "lng": 179.1962,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  },
  {
    "code": "VU",
    "name": "Vanuatu",
    "flag": "🇻🇺",
    "regions": [
      {
        "name": "Shefa",
        "cities": [
          {
            "name": "Port Vila",
            "population": 51000,
            "lat": -17.7333,
            "lng": 168.3273,
            "nearbyRadiusKm": 25
          }
        ]
      }
    ]
  }
];

export const GEOGRAPHICAL_DATABASE: CountryData[] = WORLD_COUNTRIES_CATALOG;

/**
 * Búsqueda inteligente de países por nombre, código o coincidencia parcial
 */
export function searchCountries(query: string): CountryData[] {
  if (!query || !query.trim()) return WORLD_COUNTRIES_CATALOG;
  const q = query.trim().toLowerCase();
  return WORLD_COUNTRIES_CATALOG.filter(
    (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
  );
}

/**
 * Búsqueda libre de ciudades en el país o en todo el mundo
 */
export function searchCitiesInCountry(countryCode: string, query: string): CityData[] {
  const country = WORLD_COUNTRIES_CATALOG.find((c) => c.code === countryCode);
  if (!country) return [];

  const allCities: CityData[] = [];
  country.regions.forEach((r) => {
    r.cities.forEach((ci) => {
      allCities.push({ ...ci, countryCode: country.code, countryName: country.name });
    });
  });

  if (!query || !query.trim()) return allCities;
  const q = query.trim().toLowerCase();
  return allCities.filter((c) => c.name.toLowerCase().includes(q));
}

/**
 * Obtener o generar ciudad personalizada en cualquier parte del mundo
 */
export function resolveCustomCity(cityName: string, countryCode: string): CityData {
  const cleanName = (cityName || '').trim();
  const country = WORLD_COUNTRIES_CATALOG.find((c) => c.code === countryCode) || WORLD_COUNTRIES_CATALOG[0];

  // Try to find exact or partial match in database
  for (const region of country.regions) {
    const found = region.cities.find((ci) => ci.name.toLowerCase() === cleanName.toLowerCase());
    if (found) return { ...found, countryCode: country.code, countryName: country.name };
  }

  // If not found in static list, return custom city with standard geographic heuristics
  return {
    name: cleanName || (country.regions[0]?.cities[0]?.name || 'Ciudad Principal'),
    population: country.code === 'GLOBAL' ? 150000000 : 350000,
    lat: country.regions[0]?.cities[0]?.lat || 0,
    lng: country.regions[0]?.cities[0]?.lng || 0,
    nearbyRadiusKm: 30,
    countryCode: country.code,
    countryName: country.name,
  };
}

/**
 * Algoritmo de Viabilidad de Meta en 30 Días:
 * Calcula la relación entre la meta contratada y la capacidad de absorción poblacional en un mes.
 */
export function calculateGeoFeasibility(
  targetGoal: number,
  cityPopulation: number,
  cityName: string
): { isFeasible30Days: boolean; warning?: string; recommendedRadiusKm: number } {
  const maxSafeMonthlyConversions = Math.max(50, Math.floor(cityPopulation * 0.035));

  if (targetGoal > maxSafeMonthlyConversions) {
    const recommendedRadius = cityPopulation < 100000 ? 50 : 25;
    return {
      isFeasible30Days: false,
      recommendedRadiusKm: recommendedRadius,
      warning: `⚠️ La audiencia en la ciudad seleccionada (${cityName}, ~${cityPopulation.toLocaleString()} hab.) podría ser insuficiente para absorber ${targetGoal.toLocaleString()} conversiones en 30 días sin saturar el nicho. Te recomendamos activar la "Expansión Automática por Proximidad" para que los motores amplíen el radio concéntrico a ciudades colindantes (+${recommendedRadius} km) o seleccionar ciudades adicionales.`,
    };
  }

  return {
    isFeasible30Days: true,
    recommendedRadiusKm: 15,
  };
}
