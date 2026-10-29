/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Enrutador Puente Inteligente KaSe - 6 Tipos de Campaña + Enrutador Hero
 */

import { CampaignType } from '../types/growth';

export interface BridgeRouteConfig {
  type: CampaignType | 'hero';
  slug: string;
  label: string;
  badge: string;
  description: string;
  countsAsRegistration: boolean;
}

export const BRIDGE_ROUTE_CONFIGS: Record<CampaignType | 'hero', BridgeRouteConfig> = {
  user_registrations: {
    type: 'user_registrations',
    slug: 'registros',
    label: 'Enrutador Registros de Usuario',
    badge: '/r/registros/:id',
    description: 'Canalización directa hacia la pantalla de registro / alta de cuentas.',
    countsAsRegistration: false, // Los clics al puente solo suman clicks_count; las altas se confirman en el destino
  },
  plan_sales: {
    type: 'plan_sales',
    slug: 'ventas',
    label: 'Enrutador Venta de Planes',
    badge: '/r/ventas/:id',
    description: 'Derivación de decisores hacia la página de planes, checkout o precios.',
    countsAsRegistration: false,
  },
  social_followers: {
    type: 'social_followers',
    slug: 'seguidores',
    label: 'Enrutador Seguidores Sociales',
    badge: '/r/seguidores/:id',
    description: 'Atracción y redirección orgánica hacia perfiles en X, LinkedIn e Instagram.',
    countsAsRegistration: false,
  },
  likes_engagement: {
    type: 'likes_engagement',
    slug: 'likes',
    label: 'Enrutador Likes & Engagement',
    badge: '/r/likes/:id',
    description: 'Canalización hacia publicaciones estratégicas para disparar interacciones.',
    countsAsRegistration: false,
  },
  comments_reviews: {
    type: 'comments_reviews',
    slug: 'comentarios',
    label: 'Enrutador Comentarios & Reseñas',
    badge: '/r/comentarios/:id',
    description: 'Derivación hacia hilos de foros y secciones de testimonios para prueba social.',
    countsAsRegistration: false,
  },
  youtube_growth: {
    type: 'youtube_growth',
    slug: 'youtube',
    label: 'Enrutador YouTube Growth',
    badge: '/r/youtube/:id',
    description: 'Tráfico de alta retención directo a videos y canal oficial de YouTube.',
    countsAsRegistration: false,
  },
  hero: {
    type: 'hero',
    slug: 'hero',
    label: 'Enrutador Hero Landing (Aislado)',
    badge: '/r/hero',
    description: 'Tráfico orgánico al portal KaSe. NUNCA suma como registro de usuario en campañas.',
    countsAsRegistration: false,
  },
};

/**
 * Devuelve la URL completa del enrutador puente para una campaña según su tipo
 */
export function getBridgeUrl(campaignId: string, campaignType?: CampaignType, origin?: string): string {
  const base = origin || (typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://ka-se-marcketing-digital.vercel.app');
  
  if (campaignId === 'hero' || campaignType === ('hero' as any)) {
    return `${base}/r/hero`;
  }

  const type = campaignType || 'user_registrations';
  const config = BRIDGE_ROUTE_CONFIGS[type] || BRIDGE_ROUTE_CONFIGS.user_registrations;
  return `${base}/r/${config.slug}/${campaignId}`;
}

/**
 * Devuelve la ruta relativa del puente según su tipo
 */
export function getBridgeRelativePath(campaignId: string, campaignType?: CampaignType): string {
  if (campaignId === 'hero') return '/r/hero';
  const type = campaignType || 'user_registrations';
  const config = BRIDGE_ROUTE_CONFIGS[type] || BRIDGE_ROUTE_CONFIGS.user_registrations;
  return `/r/${config.slug}/${campaignId}`;
}

/**
 * Obtiene la configuración de ruta según el slug
 */
export function getBridgeConfigBySlug(slug: string): BridgeRouteConfig {
  const found = Object.values(BRIDGE_ROUTE_CONFIGS).find((c) => c.slug === slug);
  return found || BRIDGE_ROUTE_CONFIGS.user_registrations;
}
