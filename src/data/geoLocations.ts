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
  // --- OPCIÓN GLOBAL ---
  {
    code: 'GLOBAL',
    name: 'Audiencia Global (Mundial - Sin Restricción)',
    flag: '🌐',
    regions: [
      {
        name: 'Mundial',
        cities: [
          { name: 'Tráfico Global Cualificado por Idioma e Intención', population: 150000000, lat: 0, lng: 0, nearbyRadiusKm: 10000 },
        ],
      },
    ],
  },

  // --- AMÉRICA DEL SUR ---
  {
    code: 'UY',
    name: 'Uruguay',
    flag: '🇺🇾',
    regions: [
      {
        name: 'Montevideo',
        cities: [
          { name: 'Montevideo Capital', population: 1380000, lat: -34.9011, lng: -56.1645, nearbyRadiusKm: 25 },
          { name: 'Pocitos / Punta Carretas', population: 120000, lat: -34.9215, lng: -56.1512, nearbyRadiusKm: 15 },
          { name: 'Carrasco / Punta Gorda', population: 65000, lat: -34.8872, lng: -56.0592, nearbyRadiusKm: 15 },
          { name: 'Centro / Cordón', population: 140000, lat: -34.9062, lng: -56.1856, nearbyRadiusKm: 10 },
        ],
      },
      {
        name: 'Canelones',
        cities: [
          { name: 'Ciudad de la Costa', population: 112000, lat: -34.8211, lng: -55.9528, nearbyRadiusKm: 20 },
          { name: 'Las Piedras', population: 71000, lat: -34.7297, lng: -56.2197, nearbyRadiusKm: 25 },
          { name: 'Pando', population: 26000, lat: -34.7172, lng: -55.9547, nearbyRadiusKm: 30 },
          { name: 'Canelones Capital', population: 20000, lat: -34.5228, lng: -56.2778, nearbyRadiusKm: 35 },
        ],
      },
      {
        name: 'Maldonado',
        cities: [
          { name: 'Punta del Este', population: 24000, lat: -34.9667, lng: -54.9500, nearbyRadiusKm: 20 },
          { name: 'Maldonado Capital', population: 63000, lat: -34.9000, lng: -54.9500, nearbyRadiusKm: 20 },
          { name: 'San Carlos', population: 27000, lat: -34.7917, lng: -54.9167, nearbyRadiusKm: 25 },
        ],
      },
      {
        name: 'Colonia',
        cities: [
          { name: 'Colonia del Sacramento', population: 27000, lat: -34.4626, lng: -57.8400, nearbyRadiusKm: 30 },
          { name: 'Carmelo', population: 18000, lat: -34.0000, lng: -58.2833, nearbyRadiusKm: 35 },
        ],
      },
      {
        name: 'Salto',
        cities: [
          { name: 'Salto Capital', population: 104000, lat: -31.3833, lng: -57.9667, nearbyRadiusKm: 40 },
        ],
      },
      {
        name: 'Paysandú',
        cities: [
          { name: 'Paysandú Capital', population: 76000, lat: -32.3214, lng: -58.0756, nearbyRadiusKm: 40 },
        ],
      },
      {
        name: 'Rivera',
        cities: [
          { name: 'Rivera Capital', population: 79000, lat: -30.9025, lng: -55.5506, nearbyRadiusKm: 40 },
        ],
      },
      {
        name: 'Tacuarembó',
        cities: [
          { name: 'Tacuarembó Capital', population: 54000, lat: -31.7333, lng: -55.9833, nearbyRadiusKm: 45 },
        ],
      },
    ],
  },
  {
    code: 'AR',
    name: 'Argentina',
    flag: '🇦🇷',
    regions: [
      {
        name: 'Buenos Aires (CABA & AMBA)',
        cities: [
          { name: 'Ciudad Autónoma de Buenos Aires (CABA)', population: 3120000, lat: -34.6037, lng: -58.3816, nearbyRadiusKm: 25 },
          { name: 'Zona Norte (Vicente López / San Isidro / Tigre)', population: 850000, lat: -34.4714, lng: -58.5286, nearbyRadiusKm: 25 },
          { name: 'Zona Oeste (Morón / Ramos Mejía / Castelar)', population: 640000, lat: -34.6534, lng: -58.6198, nearbyRadiusKm: 25 },
          { name: 'Zona Sur (Quilmes / Lomas de Zamora)', population: 920000, lat: -34.7600, lng: -58.4000, nearbyRadiusKm: 30 },
          { name: 'La Plata', population: 770000, lat: -34.9205, lng: -57.9536, nearbyRadiusKm: 40 },
          { name: 'Mar del Plata', population: 650000, lat: -38.0055, lng: -57.5560, nearbyRadiusKm: 45 },
          { name: 'Bahía Blanca', population: 310000, lat: -38.7183, lng: -62.2663, nearbyRadiusKm: 45 },
        ],
      },
      {
        name: 'Córdoba',
        cities: [
          { name: 'Córdoba Capital', population: 1560000, lat: -31.4201, lng: -64.1888, nearbyRadiusKm: 35 },
          { name: 'Villa Carlos Paz', population: 75000, lat: -31.4241, lng: -64.4978, nearbyRadiusKm: 30 },
          { name: 'Río Cuarto', population: 180000, lat: -33.1307, lng: -64.3499, nearbyRadiusKm: 45 },
        ],
      },
      {
        name: 'Santa Fe',
        cities: [
          { name: 'Rosario', population: 1340000, lat: -32.9468, lng: -60.6393, nearbyRadiusKm: 35 },
          { name: 'Santa Fe Capital', population: 420000, lat: -31.6333, lng: -60.7000, nearbyRadiusKm: 40 },
        ],
      },
      {
        name: 'Mendoza',
        cities: [
          { name: 'Gran Mendoza', population: 1100000, lat: -32.8895, lng: -68.8458, nearbyRadiusKm: 35 },
          { name: 'San Rafael', population: 190000, lat: -34.6177, lng: -68.3301, nearbyRadiusKm: 50 },
        ],
      },
      {
        name: 'Tucumán',
        cities: [
          { name: 'San Miguel de Tucumán', population: 830000, lat: -26.8241, lng: -65.2226, nearbyRadiusKm: 35 },
        ],
      },
      {
        name: 'Salta',
        cities: [
          { name: 'Salta Capital', population: 535000, lat: -24.7821, lng: -65.4232, nearbyRadiusKm: 40 },
        ],
      },
      {
        name: 'Neuquén',
        cities: [
          { name: 'Neuquén Capital', population: 300000, lat: -38.9516, lng: -68.0591, nearbyRadiusKm: 40 },
          { name: 'San Carlos de Bariloche', population: 130000, lat: -41.1335, lng: -71.3103, nearbyRadiusKm: 35 },
        ],
      },
    ],
  },
  {
    code: 'BR',
    name: 'Brasil',
    flag: '🇧🇷',
    regions: [
      {
        name: 'São Paulo',
        cities: [
          { name: 'São Paulo Capital', population: 12330000, lat: -23.5505, lng: -46.6333, nearbyRadiusKm: 40 },
          { name: 'Campinas', population: 1210000, lat: -22.9056, lng: -47.0608, nearbyRadiusKm: 35 },
          { name: 'Santos / Baixada Santista', population: 433000, lat: -23.9608, lng: -46.3336, nearbyRadiusKm: 30 },
        ],
      },
      {
        name: 'Rio de Janeiro',
        cities: [
          { name: 'Rio de Janeiro Capital', population: 6750000, lat: -22.9068, lng: -43.1729, nearbyRadiusKm: 40 },
          { name: 'Niterói', population: 515000, lat: -22.8832, lng: -43.1034, nearbyRadiusKm: 25 },
        ],
      },
      {
        name: 'Paraná',
        cities: [
          { name: 'Curitiba', population: 1960000, lat: -25.4284, lng: -49.2733, nearbyRadiusKm: 35 },
        ],
      },
      {
        name: 'Rio Grande do Sul',
        cities: [
          { name: 'Porto Alegre', population: 1488000, lat: -30.0346, lng: -51.2177, nearbyRadiusKm: 35 },
        ],
      },
      {
        name: 'Minas Gerais',
        cities: [
          { name: 'Belo Horizonte', population: 2520000, lat: -19.9167, lng: -43.9345, nearbyRadiusKm: 35 },
        ],
      },
      {
        name: 'Santa Catarina',
        cities: [
          { name: 'Florianópolis', population: 508000, lat: -27.5954, lng: -48.5480, nearbyRadiusKm: 30 },
          { name: 'Joinville', population: 597000, lat: -26.3045, lng: -48.8487, nearbyRadiusKm: 35 },
        ],
      },
    ],
  },
  {
    code: 'CL',
    name: 'Chile',
    flag: '🇨🇱',
    regions: [
      {
        name: 'Región Metropolitana',
        cities: [
          { name: 'Gran Santiago (Las Condes / Providencia / Centro)', population: 6800000, lat: -33.4489, lng: -70.6693, nearbyRadiusKm: 35 },
        ],
      },
      {
        name: 'Valparaíso',
        cities: [
          { name: 'Valparaíso / Viña del Mar', population: 980000, lat: -33.0472, lng: -71.6127, nearbyRadiusKm: 30 },
        ],
      },
      {
        name: 'Biobío',
        cities: [
          { name: 'Concepción', population: 970000, lat: -36.8270, lng: -73.0503, nearbyRadiusKm: 35 },
        ],
      },
      {
        name: 'Antofagasta',
        cities: [
          { name: 'Antofagasta', population: 390000, lat: -23.6500, lng: -70.4000, nearbyRadiusKm: 40 },
        ],
      },
    ],
  },
  {
    code: 'CO',
    name: 'Colombia',
    flag: '🇨🇴',
    regions: [
      {
        name: 'Bogotá D.C.',
        cities: [
          { name: 'Bogotá Capital', population: 7900000, lat: 4.7110, lng: -74.0721, nearbyRadiusKm: 35 },
        ],
      },
      {
        name: 'Antioquia',
        cities: [
          { name: 'Medellín / Valle de Aburrá', population: 2600000, lat: 6.2442, lng: -75.5812, nearbyRadiusKm: 30 },
        ],
      },
      {
        name: 'Valle del Cauca',
        cities: [
          { name: 'Cali', population: 2200000, lat: 3.4516, lng: -76.5320, nearbyRadiusKm: 30 },
        ],
      },
      {
        name: 'Atlántico',
        cities: [
          { name: 'Barranquilla', population: 1300000, lat: 10.9685, lng: -74.7813, nearbyRadiusKm: 30 },
        ],
      },
      {
        name: 'Santander',
        cities: [
          { name: 'Bucaramanga', population: 580000, lat: 7.1254, lng: -73.1198, nearbyRadiusKm: 30 },
        ],
      },
    ],
  },
  {
    code: 'PE',
    name: 'Perú',
    flag: '🇵🇪',
    regions: [
      {
        name: 'Lima Metropolitana',
        cities: [
          { name: 'Lima Capital / Miraflores / San Isidro', population: 9800000, lat: -12.0464, lng: -77.0428, nearbyRadiusKm: 35 },
        ],
      },
      {
        name: 'Arequipa',
        cities: [
          { name: 'Arequipa', population: 1080000, lat: -16.4090, lng: -71.5375, nearbyRadiusKm: 35 },
        ],
      },
      {
        name: 'La Libertad',
        cities: [
          { name: 'Trujillo', population: 920000, lat: -8.1118, lng: -79.0286, nearbyRadiusKm: 30 },
        ],
      },
      {
        name: 'Cusco',
        cities: [
          { name: 'Cusco', population: 430000, lat: -13.5319, lng: -71.9675, nearbyRadiusKm: 30 },
        ],
      },
    ],
  },
  {
    code: 'EC',
    name: 'Ecuador',
    flag: '🇪🇨',
    regions: [
      {
        name: 'Pichincha',
        cities: [
          { name: 'Quito Capital', population: 2800000, lat: -0.1807, lng: -78.4678, nearbyRadiusKm: 35 },
        ],
      },
      {
        name: 'Guayas',
        cities: [
          { name: 'Guayaquil', population: 2700000, lat: -2.1894, lng: -79.8891, nearbyRadiusKm: 35 },
        ],
      },
      {
        name: 'Azuay',
        cities: [
          { name: 'Cuenca', population: 630000, lat: -2.9001, lng: -79.0059, nearbyRadiusKm: 30 },
        ],
      },
    ],
  },
  {
    code: 'PY',
    name: 'Paraguay',
    flag: '🇵🇾',
    regions: [
      {
        name: 'Asunción / Central',
        cities: [
          { name: 'Asunción Capital', population: 520000, lat: -25.2637, lng: -57.5759, nearbyRadiusKm: 25 },
          { name: 'Gran Asunción (San Lorenzo / Luque / Fernando)', population: 1800000, lat: -25.3333, lng: -57.5167, nearbyRadiusKm: 35 },
        ],
      },
      {
        name: 'Alto Paraná',
        cities: [
          { name: 'Ciudad del Este', population: 300000, lat: -25.5097, lng: -54.6111, nearbyRadiusKm: 30 },
        ],
      },
    ],
  },
  {
    code: 'BO',
    name: 'Bolivia',
    flag: '🇧🇴',
    regions: [
      {
        name: 'Santa Cruz',
        cities: [
          { name: 'Santa Cruz de la Sierra', population: 1900000, lat: -17.7833, lng: -63.1821, nearbyRadiusKm: 35 },
        ],
      },
      {
        name: 'La Paz',
        cities: [
          { name: 'La Paz / El Alto', population: 1800000, lat: -16.5000, lng: -68.1500, nearbyRadiusKm: 35 },
        ],
      },
      {
        name: 'Cochabamba',
        cities: [
          { name: 'Cochabamba', population: 750000, lat: -17.3895, lng: -66.1568, nearbyRadiusKm: 30 },
        ],
      },
    ],
  },
  {
    code: 'VE',
    name: 'Venezuela',
    flag: '🇻🇪',
    regions: [
      {
        name: 'Distrito Capital',
        cities: [
          { name: 'Caracas Capital', population: 3100000, lat: 10.4806, lng: -66.9036, nearbyRadiusKm: 35 },
        ],
      },
      {
        name: 'Zulia',
        cities: [
          { name: 'Maracaibo', population: 1600000, lat: 10.6427, lng: -71.6125, nearbyRadiusKm: 35 },
        ],
      },
      {
        name: 'Carabobo',
        cities: [
          { name: 'Valencia', population: 1400000, lat: 10.1620, lng: -68.0077, nearbyRadiusKm: 30 },
        ],
      },
    ],
  },

  // --- AMÉRICA DEL NORTE & CENTROAMÉRICA / CARIBE ---
  {
    code: 'MX',
    name: 'México',
    flag: '🇲🇽',
    regions: [
      {
        name: 'Ciudad de México',
        cities: [
          { name: 'CDMX (Área Metropolitana)', population: 9200000, lat: 19.4326, lng: -99.1332, nearbyRadiusKm: 35 },
        ],
      },
      {
        name: 'Nuevo León',
        cities: [
          { name: 'Monterrey / San Pedro Garza García', population: 1300000, lat: 25.6866, lng: -100.3161, nearbyRadiusKm: 30 },
        ],
      },
      {
        name: 'Jalisco',
        cities: [
          { name: 'Guadalajara / Zapopan', population: 1500000, lat: 20.6597, lng: -103.3496, nearbyRadiusKm: 30 },
        ],
      },
      {
        name: 'Puebla',
        cities: [
          { name: 'Puebla Capital', population: 1690000, lat: 19.0414, lng: -98.2063, nearbyRadiusKm: 30 },
        ],
      },
      {
        name: 'Querétaro',
        cities: [
          { name: 'Santiago de Querétaro', population: 1050000, lat: 20.5888, lng: -100.3899, nearbyRadiusKm: 30 },
        ],
      },
      {
        name: 'Yucatán / Quintana Roo',
        cities: [
          { name: 'Mérida', population: 995000, lat: 20.9674, lng: -89.5926, nearbyRadiusKm: 30 },
          { name: 'Cancún', population: 888000, lat: 21.1619, lng: -86.8515, nearbyRadiusKm: 30 },
        ],
      },
    ],
  },
  {
    code: 'US',
    name: 'Estados Unidos',
    flag: '🇺🇸',
    regions: [
      {
        name: 'California',
        cities: [
          { name: 'San Francisco / Silicon Valley', population: 870000, lat: 37.7749, lng: -122.4194, nearbyRadiusKm: 45 },
          { name: 'Los Ángeles', population: 3900000, lat: 34.0522, lng: -118.2437, nearbyRadiusKm: 50 },
          { name: 'San Diego', population: 1380000, lat: 32.7157, lng: -117.1611, nearbyRadiusKm: 35 },
        ],
      },
      {
        name: 'Florida',
        cities: [
          { name: 'Miami (Tech & LatAm Hub)', population: 450000, lat: 25.7617, lng: -80.1918, nearbyRadiusKm: 35 },
          { name: 'Orlando', population: 310000, lat: 28.5383, lng: -81.3792, nearbyRadiusKm: 40 },
          { name: 'Tampa', population: 390000, lat: 27.9506, lng: -82.4572, nearbyRadiusKm: 35 },
        ],
      },
      {
        name: 'Texas',
        cities: [
          { name: 'Austin (Tech Hub)', population: 960000, lat: 30.2672, lng: -97.7431, nearbyRadiusKm: 35 },
          { name: 'Houston', population: 2300000, lat: 29.7604, lng: -95.3698, nearbyRadiusKm: 45 },
          { name: 'Dallas / Fort Worth', population: 1300000, lat: 32.7767, lng: -96.7970, nearbyRadiusKm: 45 },
        ],
      },
      {
        name: 'New York',
        cities: [
          { name: 'New York City (Manhattan & Brooklyn)', population: 8300000, lat: 40.7128, lng: -74.0060, nearbyRadiusKm: 40 },
        ],
      },
      {
        name: 'Washington',
        cities: [
          { name: 'Seattle', population: 740000, lat: 47.6062, lng: -122.3321, nearbyRadiusKm: 35 },
        ],
      },
    ],
  },
  {
    code: 'CA',
    name: 'Canadá',
    flag: '🇨🇦',
    regions: [
      {
        name: 'Ontario',
        cities: [
          { name: 'Toronto', population: 2930000, lat: 43.6532, lng: -79.3832, nearbyRadiusKm: 35 },
          { name: 'Ottawa', population: 994000, lat: 45.4215, lng: -75.6972, nearbyRadiusKm: 35 },
        ],
      },
      {
        name: 'Quebec',
        cities: [
          { name: 'Montreal', population: 1780000, lat: 45.5017, lng: -73.5673, nearbyRadiusKm: 35 },
        ],
      },
      {
        name: 'British Columbia',
        cities: [
          { name: 'Vancouver', population: 675000, lat: 49.2827, lng: -123.1207, nearbyRadiusKm: 35 },
        ],
      },
    ],
  },
  {
    code: 'CR',
    name: 'Costa Rica',
    flag: '🇨🇷',
    regions: [
      {
        name: 'San José / Valle Central',
        cities: [
          { name: 'San José Capital', population: 1400000, lat: 9.9281, lng: -84.0907, nearbyRadiusKm: 30 },
          { name: 'Heredia / Alajuela', population: 520000, lat: 10.0024, lng: -84.1165, nearbyRadiusKm: 25 },
        ],
      },
    ],
  },
  {
    code: 'PA',
    name: 'Panamá',
    flag: '🇵🇦',
    regions: [
      {
        name: 'Panamá',
        cities: [
          { name: 'Ciudad de Panamá (Fintech & Hub)', population: 1500000, lat: 8.9824, lng: -79.5199, nearbyRadiusKm: 30 },
        ],
      },
    ],
  },
  {
    code: 'DO',
    name: 'República Dominicana',
    flag: '🇩🇴',
    regions: [
      {
        name: 'Santo Domingo',
        cities: [
          { name: 'Santo Domingo Capital', population: 3300000, lat: 18.4861, lng: -69.9312, nearbyRadiusKm: 35 },
          { name: 'Santiago de los Caballeros', population: 1100000, lat: 19.4517, lng: -70.6970, nearbyRadiusKm: 30 },
        ],
      },
    ],
  },
  {
    code: 'GT',
    name: 'Guatemala',
    flag: '🇬🇹',
    regions: [
      {
        name: 'Guatemala',
        cities: [
          { name: 'Ciudad de Guatemala', population: 2900000, lat: 14.6349, lng: -90.5069, nearbyRadiusKm: 35 },
        ],
      },
    ],
  },
  {
    code: 'SV',
    name: 'El Salvador',
    flag: '🇸🇻',
    regions: [
      {
        name: 'San Salvador',
        cities: [
          { name: 'San Salvador Capital', population: 1700000, lat: 13.6929, lng: -89.2182, nearbyRadiusKm: 30 },
        ],
      },
    ],
  },
  {
    code: 'HN',
    name: 'Honduras',
    flag: '🇭🇳',
    regions: [
      {
        name: 'Francisco Morazán / Cortés',
        cities: [
          { name: 'Tegucigalpa', population: 1150000, lat: 14.0723, lng: -87.1921, nearbyRadiusKm: 30 },
          { name: 'San Pedro Sula', population: 800000, lat: 15.5000, lng: -88.0333, nearbyRadiusKm: 30 },
        ],
      },
    ],
  },
  {
    code: 'PR',
    name: 'Puerto Rico',
    flag: '🇵🇷',
    regions: [
      {
        name: 'San Juan',
        cities: [
          { name: 'San Juan', population: 340000, lat: 18.4655, lng: -66.1057, nearbyRadiusKm: 30 },
        ],
      },
    ],
  },

  // --- EUROPA ---
  {
    code: 'ES',
    name: 'España',
    flag: '🇪🇸',
    regions: [
      {
        name: 'Comunidad de Madrid',
        cities: [
          { name: 'Madrid Capital', population: 3340000, lat: 40.4168, lng: -3.7038, nearbyRadiusKm: 30 },
          { name: 'Alcobendas / San Sebastián de los Reyes', population: 210000, lat: 40.5475, lng: -3.6421, nearbyRadiusKm: 20 },
          { name: 'Móstoles / Alcorcón', population: 380000, lat: 40.3232, lng: -3.8649, nearbyRadiusKm: 25 },
        ],
      },
      {
        name: 'Cataluña',
        cities: [
          { name: 'Barcelona Capital', population: 1660000, lat: 41.3851, lng: 2.1734, nearbyRadiusKm: 25 },
          { name: 'Hospitalet de Llobregat', population: 265000, lat: 41.3597, lng: 2.0997, nearbyRadiusKm: 15 },
          { name: 'Terrassa / Sabadell', population: 440000, lat: 41.5632, lng: 2.0089, nearbyRadiusKm: 25 },
        ],
      },
      {
        name: 'Comunidad Valenciana',
        cities: [
          { name: 'Valencia Capital', population: 800000, lat: 39.4699, lng: -0.3763, nearbyRadiusKm: 25 },
          { name: 'Alicante', population: 340000, lat: 38.3452, lng: -0.4810, nearbyRadiusKm: 30 },
        ],
      },
      {
        name: 'Andalucía',
        cities: [
          { name: 'Sevilla', population: 685000, lat: 37.3891, lng: -5.9845, nearbyRadiusKm: 30 },
          { name: 'Málaga (Tech Hub Costa del Sol)', population: 580000, lat: 36.7213, lng: -4.4214, nearbyRadiusKm: 25 },
        ],
      },
      {
        name: 'País Vasco',
        cities: [
          { name: 'Bilbao', population: 345000, lat: 43.2630, lng: -2.9350, nearbyRadiusKm: 25 },
          { name: 'San Sebastián', population: 188000, lat: 43.3183, lng: -1.9812, nearbyRadiusKm: 25 },
        ],
      },
    ],
  },
  {
    code: 'GB',
    name: 'Reino Unido',
    flag: '🇬🇧',
    regions: [
      {
        name: 'Greater London',
        cities: [
          { name: 'Londres (City & Tech City)', population: 8980000, lat: 51.5074, lng: -0.1278, nearbyRadiusKm: 35 },
        ],
      },
      {
        name: 'North West',
        cities: [
          { name: 'Manchester', population: 553000, lat: 53.4808, lng: -2.2426, nearbyRadiusKm: 30 },
        ],
      },
      {
        name: 'Scotland',
        cities: [
          { name: 'Edimburgo', population: 526000, lat: 55.9533, lng: -3.1883, nearbyRadiusKm: 30 },
        ],
      },
    ],
  },
  {
    code: 'DE',
    name: 'Alemania',
    flag: '🇩🇪',
    regions: [
      {
        name: 'Berlin',
        cities: [
          { name: 'Berlín Capital (Startup Hub)', population: 3670000, lat: 52.5200, lng: 13.4050, nearbyRadiusKm: 35 },
        ],
      },
      {
        name: 'Bavaria',
        cities: [
          { name: 'Múnich', population: 1488000, lat: 48.1351, lng: 11.5820, nearbyRadiusKm: 35 },
        ],
      },
      {
        name: 'Hesse',
        cities: [
          { name: 'Fráncfort (Fintech Hub)', population: 764000, lat: 50.1109, lng: 8.6821, nearbyRadiusKm: 30 },
        ],
      },
    ],
  },
  {
    code: 'FR',
    name: 'Francia',
    flag: '🇫🇷',
    regions: [
      {
        name: 'Île-de-France',
        cities: [
          { name: 'París Capital', population: 2160000, lat: 48.8566, lng: 2.3522, nearbyRadiusKm: 35 },
        ],
      },
      {
        name: 'Auvergne-Rhône-Alpes',
        cities: [
          { name: 'Lyon', population: 522000, lat: 45.7640, lng: 4.8357, nearbyRadiusKm: 30 },
        ],
      },
    ],
  },
  {
    code: 'IT',
    name: 'Italia',
    flag: '🇮🇹',
    regions: [
      {
        name: 'Lombardia',
        cities: [
          { name: 'Milán (Business Hub)', population: 1400000, lat: 45.4642, lng: 9.1900, nearbyRadiusKm: 35 },
        ],
      },
      {
        name: 'Lazio',
        cities: [
          { name: 'Roma Capital', population: 2870000, lat: 41.9028, lng: 12.4964, nearbyRadiusKm: 35 },
        ],
      },
    ],
  },
  {
    code: 'PT',
    name: 'Portugal',
    flag: '🇵🇹',
    regions: [
      {
        name: 'Lisboa',
        cities: [
          { name: 'Lisboa Capital (Web Summit Hub)', population: 545000, lat: 38.7223, lng: -9.1393, nearbyRadiusKm: 30 },
        ],
      },
      {
        name: 'Porto',
        cities: [
          { name: 'Oporto', population: 237000, lat: 41.1579, lng: -8.6291, nearbyRadiusKm: 25 },
        ],
      },
    ],
  },
  {
    code: 'NL',
    name: 'Países Bajos',
    flag: '🇳🇱',
    regions: [
      {
        name: 'North Holland',
        cities: [
          { name: 'Ámsterdam', population: 872000, lat: 52.3676, lng: 4.9041, nearbyRadiusKm: 30 },
          { name: 'Róterdam', population: 651000, lat: 51.9244, lng: 4.4777, nearbyRadiusKm: 30 },
        ],
      },
    ],
  },
  {
    code: 'CH',
    name: 'Suiza',
    flag: '🇨🇭',
    regions: [
      {
        name: 'Zürich',
        cities: [
          { name: 'Zúrich (Fintech & Tech Hub)', population: 421000, lat: 47.3769, lng: 8.5417, nearbyRadiusKm: 30 },
          { name: 'Ginebra', population: 203000, lat: 46.2044, lng: 6.1432, nearbyRadiusKm: 25 },
        ],
      },
    ],
  },
  {
    code: 'SE',
    name: 'Suecia',
    flag: '🇸🇪',
    regions: [
      {
        name: 'Stockholm',
        cities: [
          { name: 'Estocolmo', population: 975000, lat: 59.3293, lng: 18.0686, nearbyRadiusKm: 30 },
        ],
      },
    ],
  },
  {
    code: 'IE',
    name: 'Irlanda',
    flag: '🇮🇪',
    regions: [
      {
        name: 'Leinster',
        cities: [
          { name: 'Dublín (Silicon Docks HQ)', population: 544000, lat: 53.3498, lng: -6.2603, nearbyRadiusKm: 30 },
        ],
      },
    ],
  },

  // --- ASIA & OCEANÍA ---
  {
    code: 'JP',
    name: 'Japón',
    flag: '🇯🇵',
    regions: [
      {
        name: 'Tokyo',
        cities: [
          { name: 'Tokio Capital', population: 14000000, lat: 35.6762, lng: 139.6503, nearbyRadiusKm: 45 },
          { name: 'Osaka', population: 2750000, lat: 34.6937, lng: 135.5023, nearbyRadiusKm: 35 },
        ],
      },
    ],
  },
  {
    code: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    regions: [
      {
        name: 'New South Wales',
        cities: [
          { name: 'Sídney', population: 5312000, lat: -33.8688, lng: 151.2093, nearbyRadiusKm: 40 },
        ],
      },
      {
        name: 'Victoria',
        cities: [
          { name: 'Melbourne', population: 5078000, lat: -37.8136, lng: 144.9631, nearbyRadiusKm: 40 },
        ],
      },
    ],
  },
  {
    code: 'SG',
    name: 'Singapur',
    flag: '🇸🇬',
    regions: [
      {
        name: 'Singapore',
        cities: [
          { name: 'Singapur (Global Hub)', population: 5686000, lat: 1.3521, lng: 103.8198, nearbyRadiusKm: 25 },
        ],
      },
    ],
  },
  {
    code: 'AE',
    name: 'Emiratos Árabes Unidos',
    flag: '🇦🇪',
    regions: [
      {
        name: 'Dubai & Abu Dhabi',
        cities: [
          { name: 'Dubái (Global Business Hub)', population: 3500000, lat: 25.2048, lng: 55.2708, nearbyRadiusKm: 35 },
          { name: 'Abu Dabi', population: 1500000, lat: 24.4539, lng: 54.3773, nearbyRadiusKm: 35 },
        ],
      },
    ],
  },
  {
    code: 'IL',
    name: 'Israel',
    flag: '🇮🇱',
    regions: [
      {
        name: 'Tel Aviv',
        cities: [
          { name: 'Tel Aviv (Silicon Wadi)', population: 460000, lat: 32.0853, lng: 34.7818, nearbyRadiusKm: 30 },
        ],
      },
    ],
  },
  {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    regions: [
      {
        name: 'Karnataka & Maharashtra',
        cities: [
          { name: 'Bangalore (Silicon Valley of India)', population: 8443000, lat: 12.9716, lng: 77.5946, nearbyRadiusKm: 40 },
          { name: 'Bombay / Mumbai', population: 12442000, lat: 19.0760, lng: 72.8777, nearbyRadiusKm: 45 },
        ],
      },
    ],
  },
  {
    code: 'ZA',
    name: 'Sudáfrica',
    flag: '🇿🇦',
    regions: [
      {
        name: 'Gauteng & Western Cape',
        cities: [
          { name: 'Johannesburgo', population: 4434000, lat: -26.2041, lng: 28.0473, nearbyRadiusKm: 40 },
          { name: 'Ciudad del Cabo', population: 4336000, lat: -33.9249, lng: 18.4241, nearbyRadiusKm: 40 },
        ],
      },
    ],
  },

  // --- RESTO DE PAÍSES DEL MUNDO (Catálogo Completo) ---
  { code: 'NO', name: 'Noruega', flag: '🇳🇴', regions: [{ name: 'Oslo', cities: [{ name: 'Oslo', population: 693000, lat: 59.9139, lng: 10.7522, nearbyRadiusKm: 30 }] }] },
  { code: 'DK', name: 'Dinamarca', flag: '🇩🇰', regions: [{ name: 'Copenhagen', cities: [{ name: 'Copenhague', population: 602000, lat: 55.6761, lng: 12.5683, nearbyRadiusKm: 30 }] }] },
  { code: 'FI', name: 'Finlandia', flag: '🇫🇮', regions: [{ name: 'Helsinki', cities: [{ name: 'Helsinki', population: 656000, lat: 60.1699, lng: 24.9384, nearbyRadiusKm: 30 }] }] },
  { code: 'PL', name: 'Polonia', flag: '🇵🇱', regions: [{ name: 'Mazovia', cities: [{ name: 'Varsovia', population: 1790000, lat: 52.2297, lng: 21.0122, nearbyRadiusKm: 35 }, { name: 'Cracovia', population: 780000, lat: 50.0647, lng: 19.9450, nearbyRadiusKm: 30 }] }] },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', regions: [{ name: 'Viena', cities: [{ name: 'Viena', population: 1910000, lat: 48.2082, lng: 16.3738, nearbyRadiusKm: 30 }] }] },
  { code: 'BE', name: 'Bélgica', flag: '🇧🇪', regions: [{ name: 'Bruselas', cities: [{ name: 'Bruselas', population: 1208000, lat: 50.8503, lng: 4.3517, nearbyRadiusKm: 30 }] }] },
  { code: 'CZ', name: 'República Checa', flag: '🇨🇿', regions: [{ name: 'Praga', cities: [{ name: 'Praga', population: 1309000, lat: 50.0755, lng: 14.4378, nearbyRadiusKm: 30 }] }] },
  { code: 'GR', name: 'Grecia', flag: '🇬🇷', regions: [{ name: 'Ática', cities: [{ name: 'Atenas', population: 3153000, lat: 37.9838, lng: 23.7275, nearbyRadiusKm: 35 }] }] },
  { code: 'HU', name: 'Hungría', flag: '🇭🇺', regions: [{ name: 'Budapest', cities: [{ name: 'Budapest', population: 1752000, lat: 47.4979, lng: 19.0402, nearbyRadiusKm: 35 }] }] },
  { code: 'RO', name: 'Rumania', flag: '🇷🇴', regions: [{ name: 'Bucarest', cities: [{ name: 'Bucarest', population: 1830000, lat: 44.4268, lng: 26.1025, nearbyRadiusKm: 35 }] }] },
  { code: 'NZ', name: 'Nueva Zelanda', flag: '🇳🇿', regions: [{ name: 'Auckland', cities: [{ name: 'Auckland', population: 1657000, lat: -36.8485, lng: 174.7633, nearbyRadiusKm: 35 }, { name: 'Wellington', population: 215000, lat: -41.2865, lng: 174.7762, nearbyRadiusKm: 25 }] }] },
  { code: 'KR', name: 'Corea del Sur', flag: '🇰🇷', regions: [{ name: 'Seúl', cities: [{ name: 'Seúl', population: 9776000, lat: 37.5665, lng: 126.9780, nearbyRadiusKm: 40 }] }] },
  { code: 'TW', name: 'Taiwán', flag: '🇹🇼', regions: [{ name: 'Taipéi', cities: [{ name: 'Taipéi', population: 2600000, lat: 25.0330, lng: 121.5654, nearbyRadiusKm: 30 }] }] },
  { code: 'TH', name: 'Tailandia', flag: '🇹🇭', regions: [{ name: 'Bangkok', cities: [{ name: 'Bangkok', population: 10539000, lat: 13.7563, lng: 100.5018, nearbyRadiusKm: 40 }] }] },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', regions: [{ name: 'Ho Chi Minh / Hanoi', cities: [{ name: 'Ho Chi Minh City', population: 8993000, lat: 10.8231, lng: 106.6297, nearbyRadiusKm: 40 }] }] },
  { code: 'MY', name: 'Malasia', flag: '🇲🇾', regions: [{ name: 'Kuala Lumpur', cities: [{ name: 'Kuala Lumpur', population: 1800000, lat: 3.1390, lng: 101.6869, nearbyRadiusKm: 35 }] }] },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', regions: [{ name: 'Yakarta', cities: [{ name: 'Yakarta', population: 10560000, lat: -6.2088, lng: 106.8456, nearbyRadiusKm: 45 }] }] },
  { code: 'PH', name: 'Filipinas', flag: '🇵🇭', regions: [{ name: 'Manila', cities: [{ name: 'Gran Manila', population: 13480000, lat: 14.5995, lng: 120.9842, nearbyRadiusKm: 45 }] }] },
  { code: 'SA', name: 'Arabia Saudita', flag: '🇸🇦', regions: [{ name: 'Riad', cities: [{ name: 'Riad', population: 7676000, lat: 24.7136, lng: 46.6753, nearbyRadiusKm: 40 }] }] },
  { code: 'QA', name: 'Catar', flag: '🇶🇦', regions: [{ name: 'Doha', cities: [{ name: 'Doha', population: 956000, lat: 25.2854, lng: 51.5310, nearbyRadiusKm: 30 }] }] },
  { code: 'EG', name: 'Egipto', flag: '🇪🇬', regions: [{ name: 'El Cairo', cities: [{ name: 'El Cairo', population: 9540000, lat: 30.0444, lng: 31.2357, nearbyRadiusKm: 45 }] }] },
  { code: 'MA', name: 'Marruecos', flag: '🇲🇦', regions: [{ name: 'Casablanca', cities: [{ name: 'Casablanca', population: 3360000, lat: 33.5731, lng: -7.5898, nearbyRadiusKm: 35 }] }] },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', regions: [{ name: 'Lagos', cities: [{ name: 'Lagos', population: 15388000, lat: 6.5244, lng: 3.3792, nearbyRadiusKm: 45 }] }] },
  { code: 'KE', name: 'Kenia', flag: '🇰🇪', regions: [{ name: 'Nairobi', cities: [{ name: 'Nairobi', population: 4397000, lat: -1.2921, lng: 36.8219, nearbyRadiusKm: 40 }] }] },
  { code: 'TR', name: 'Turquía', flag: '🇹🇷', regions: [{ name: 'Estambul', cities: [{ name: 'Estambul', population: 15460000, lat: 41.0082, lng: 28.9784, nearbyRadiusKm: 45 }, { name: 'Ankara', population: 5663000, lat: 39.9334, lng: 32.8597, nearbyRadiusKm: 40 }] }] },
  { code: 'UA', name: 'Ucrania', flag: '🇺🇦', regions: [{ name: 'Kiev', cities: [{ name: 'Kiev', population: 2962000, lat: 50.4501, lng: 30.5234, nearbyRadiusKm: 35 }] }] },
  { code: 'RU', name: 'Rusia', flag: '🇷🇺', regions: [{ name: 'Moscú', cities: [{ name: 'Moscú', population: 12615000, lat: 55.7558, lng: 37.6173, nearbyRadiusKm: 45 }, { name: 'San Petersburgo', population: 5384000, lat: 59.9343, lng: 30.3351, nearbyRadiusKm: 40 }] }] },
  { code: 'CU', name: 'Cuba', flag: '🇨🇺', regions: [{ name: 'La Habana', cities: [{ name: 'La Habana', population: 2130000, lat: 23.1136, lng: -82.3666, nearbyRadiusKm: 30 }] }] },
  { code: 'NI', name: 'Nicaragua', flag: '🇳🇮', regions: [{ name: 'Managua', cities: [{ name: 'Managua', population: 1055000, lat: 12.1150, lng: -86.2362, nearbyRadiusKm: 30 }] }] },
  { code: 'JM', name: 'Jamaica', flag: '🇯🇲', regions: [{ name: 'Kingston', cities: [{ name: 'Kingston', population: 662000, lat: 17.9712, lng: -76.7936, nearbyRadiusKm: 25 }] }] },
  { code: 'TT', name: 'Trinidad y Tobago', flag: '🇹🇹', regions: [{ name: 'Port of Spain', cities: [{ name: 'Puerto España', population: 37000, lat: 10.6549, lng: -61.5019, nearbyRadiusKm: 25 }] }] },
  { code: 'IS', name: 'Islandia', flag: '🇮🇸', regions: [{ name: 'Reikiavik', cities: [{ name: 'Reikiavik', population: 131000, lat: 64.1466, lng: -21.9426, nearbyRadiusKm: 25 }] }] },
  { code: 'LU', name: 'Luxemburgo', flag: '🇱🇺', regions: [{ name: 'Luxemburgo', cities: [{ name: 'Luxemburgo Ciudad', population: 124000, lat: 49.6116, lng: 6.1319, nearbyRadiusKm: 25 }] }] },
  { code: 'AD', name: 'Andorra', flag: '🇦🇩', regions: [{ name: 'Andorra la Vella', cities: [{ name: 'Andorra la Vella', population: 22000, lat: 42.5063, lng: 1.5218, nearbyRadiusKm: 15 }] }] },
  { code: 'MC', name: 'Mónaco', flag: '🇲🇨', regions: [{ name: 'Mónaco', cities: [{ name: 'Mónaco', population: 39000, lat: 43.7384, lng: 7.4246, nearbyRadiusKm: 10 }] }] },
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
    lat: 0,
    lng: 0,
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
  // Penetración orgánica mensual máxima esperable en un nicho digital local: aprox 2.5% - 4% de la población total
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
