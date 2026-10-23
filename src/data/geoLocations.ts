export interface CityData {
  name: string;
  population: number;
  lat: number;
  lng: number;
  nearbyRadiusKm: number;
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

export const GEOGRAPHICAL_DATABASE: CountryData[] = [
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
          { name: 'Maldonado Capital', population: 63000, lat: -34.9000, lng: -54.9500, nearbyRadiusKm: 20 },
          { name: 'Punta del Este', population: 24000, lat: -34.9667, lng: -54.9500, nearbyRadiusKm: 20 },
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
          { name: 'Ciudad Autónoma de Buenos Aires', population: 3120000, lat: -34.6037, lng: -58.3816, nearbyRadiusKm: 25 },
          { name: 'Zona Norte (Vicente López / San Isidro)', population: 580000, lat: -34.4714, lng: -58.5286, nearbyRadiusKm: 25 },
          { name: 'Zona Oeste (Morón / Ramos Mejía)', population: 640000, lat: -34.6534, lng: -58.6198, nearbyRadiusKm: 25 },
          { name: 'La Plata', population: 770000, lat: -34.9205, lng: -57.9536, nearbyRadiusKm: 40 },
          { name: 'Mar del Plata', population: 650000, lat: -38.0055, lng: -57.5560, nearbyRadiusKm: 45 },
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
    ],
  },
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
          { name: 'Málaga (Tech Hub)', population: 580000, lat: 36.7213, lng: -4.4214, nearbyRadiusKm: 25 },
        ],
      },
    ],
  },
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
          { name: 'Gran Santiago', population: 6800000, lat: -33.4489, lng: -70.6693, nearbyRadiusKm: 35 },
        ],
      },
      {
        name: 'Valparaíso',
        cities: [
          { name: 'Valparaíso / Viña del Mar', population: 980000, lat: -33.0472, lng: -71.6127, nearbyRadiusKm: 30 },
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
        ],
      },
      {
        name: 'Florida',
        cities: [
          { name: 'Miami (Tech & LatAm Hub)', population: 450000, lat: 25.7617, lng: -80.1918, nearbyRadiusKm: 35 },
          { name: 'Orlando', population: 310000, lat: 28.5383, lng: -81.3792, nearbyRadiusKm: 40 },
        ],
      },
      {
        name: 'New York',
        cities: [
          { name: 'New York City', population: 8300000, lat: 40.7128, lng: -74.0060, nearbyRadiusKm: 40 },
        ],
      },
    ],
  },
  {
    code: 'GLOBAL',
    name: 'Audiencia Global (Sin Restricción Geográfica)',
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
];

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
