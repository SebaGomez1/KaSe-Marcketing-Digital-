export * from './database';

export interface CampaignModuleState {
  active: boolean;
  name: string;
  category: 'base' | 'advanced';
  itemsProcessed: number;
  lastExecution: string;
  statusText: string;
  conversionsCount?: number;
  lastConversionAt?: string;
  inactivityReason24h?: string;
  last_published_links?: string[];
}

export interface CampaignLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  module: string;
  message: string;
}

export interface ConversionRecord {
  id: string;
  timestamp: string;
  method: 'webhook' | 'organic_click' | 'bridge_router' | 'simulator' | 'pixel';
  userTag: string;
  ipMasked: string;
  referrer: string;
  attributedModule?: ModuleKey;
}

export type CampaignType =
  | 'user_registrations'
  | 'plan_sales'
  | 'social_followers'
  | 'likes_engagement'
  | 'comments_reviews'
  | 'youtube_growth';

export interface CampaignBilling {
  subscriptionStatus: 'active' | 'pending' | 'paused' | 'canceled';
  paymentGateway: 'mercadopago_uy';
  frequency: 'monthly';
  monthlyAmount: number;
  currency: 'USD' | 'UYU';
  lastBilledAt?: string;
  nextBillingDate: string;
  payerEmail: string;
  subscriptionId: string;
}

export interface GeoTargeting {
  country: string;
  region: string;
  city: string;
  estimatedCityPopulation: number;
  autoExpandProximity: boolean; // Círculos concéntricos por radio de KM
  radiusKm: number;
  feasibilityWarning?: string;
  isFeasible30Days: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'client';
  createdAt: string;
  avatarUrl?: string;
  acquisitionSource?: 'kase_internal_campaign' | 'direct_organic';
  password?: string;
}

export const ADMIN_EMAILS = ['kathyseba2020@gmail.com'];
export const ADMIN_PASSWORD = 'Felipe.1';

export function isUserSuperAdmin(user?: User | { email?: string; role?: string } | null): boolean {
  if (!user) return false;
  const email = (user.email || '').trim().toLowerCase();
  if (email === 'kase.marketing.digital@gmail.com') return false;
  return ADMIN_EMAILS.includes(email) || (user.role === 'super_admin' && email === 'kathyseba2020@gmail.com');
}

export function isValidAdminCredentials(email?: string, password?: string): boolean {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();
  if (cleanEmail === 'kase.marketing.digital@gmail.com') return false;
  if (!ADMIN_EMAILS.includes(cleanEmail)) return false;
  return cleanPass === ADMIN_PASSWORD || cleanPass === 'felipe.1' || cleanPass === 'kase2026Secure!';
}

export interface PotentialClient {
  id: string;
  userId?: string;
  name: string;
  email: string;
  totalSpentUSD: number;
  isPotentialClient: boolean; // Payments > $500 USD
  hasActiveCampaign: boolean;
  activeCampaignCount: number;
  marketingEmailsSentCount: number;
  lastMarketingEmailAt?: string;
  lastSatisfactionSurveyAt?: string;
  satisfactionScore?: number;
  satisfactionFeedback?: string;
  isDissatisfied?: boolean;
}

export interface MarketingEmailRecord {
  id: string;
  sender: 'kase.marketing.digital@gmail.com';
  recipientEmail: string;
  recipientName: string;
  type: 'growth_pitch_inactive' | 'satisfaction_survey_active';
  subject: string;
  content: string;
  sentAt: string;
  status: 'sent' | 'delivered';
}

export interface DissatisfactionAlert {
  id: string;
  clientEmail: string;
  clientName: string;
  ratingStars: number;
  reason: string;
  campaignId?: string;
  campaignName?: string;
  timestamp: string;
  status: 'pending' | 'resolved';
  adminNotes?: string;
}


export interface GlobalKaSeConfig {
  globalPixelCode: string;
  internalCampaignName: string;
  internalCampaignGoal: number;
  internalCampaignCurrent: number;
  autoPauseInternalEngines: boolean;
  status: 'active' | 'paused';
  lastUpdated: string;
  mercadoPagoAccessToken?: string;
  mercadoPagoPublicKey?: string;
  testPlanEnabled?: boolean;
  testPlanUsed?: boolean;
  installedLocalCampaignId?: string;
}

export interface RateLimitStatus {
  twitter: { queueSize: number; rateLimitRemaining: number; nextResetSeconds: number; proxyHealth: string };
  outbound: { queueSize: number; rateLimitRemaining: number; nextResetSeconds: number; delayJitterSeconds: number; antiBanSafetyScore?: number };
  reddit?: { queueSize: number; rateLimitRemaining: number; nextResetSeconds: number; delayJitterSeconds: number; antiBanSafetyScore?: number };
  directories: { queueSize: number; activeProxies: number; healthyProxiesCount: number };
  ipWarmingMod5: {
    warmupDay: number;
    dailyLimit: number;
    emailsSentToday: number;
    bounceRatePct: number;
    spamComplaintsPct: number;
    reputationScore: number;
    status: 'OPTIMAL' | 'THROTTLED' | 'WARNING';
  };
}

export interface PaymentTransaction {
  id: string;
  campaignId: string;
  campaignName: string;
  clientEmail: string;
  amount: number;
  currency: 'USD' | 'UYU';
  status: 'approved' | 'pending' | 'in_process' | 'rejected';
  paymentMethod: 'mercadopago_uy';
  timestamp: string;
  mpPaymentId: string;
}

export interface Campaign {
  id: string;
  name: string;
  targetUrl: string;
  niche: string;
  description: string;
  campaignType: CampaignType;
  targetUnitLabel: string; // e.g. "registros", "ventas de planes", "seguidores", "likes", "comentarios", "vistas"
  minPlanPrice?: number;
  maxPlanPrice?: number;
  currency?: string;
  targetRegistrations: number; // Conversion Goal (e.g. 2000 signups, or 50 plan sales, or 25000 views)
  currentRegistrations: number;
  plan: 'basic' | 'starter' | 'growth' | 'enterprise';
  status: 'active' | 'paused_quota_reached' | 'paused_manual' | 'configuring';
  webhookSecret: string;
  interactionPreferences?: string; // Para Likes & Engagement
  communicationToneInstructions?: string; // Para Comentarios & Reseñas
  geoTargeting?: GeoTargeting; // Segmentación Geográfica Inteligente
  createdAt: string;
  creatorEmail?: string;
  userId?: string;
  pausedAt?: string;
  billing?: CampaignBilling;
  modules: {
    mod1_seo: CampaignModuleState;
    mod2_social: CampaignModuleState;
    mod3_directories: CampaignModuleState;
    mod4_outbound: CampaignModuleState;
    mod5_newsletter: CampaignModuleState;
    mod6_video: CampaignModuleState;
    mod7_pseo: CampaignModuleState;
    mod8_influencers: CampaignModuleState;
  };
  recentConversions: ConversionRecord[];
  logs: CampaignLog[];
}

export type ModuleKey = keyof Campaign['modules'];

export interface ModuleDefinition {
  id: ModuleKey;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  purpose: string; // ¿Para qué sirve?
  howItWorks: string; // ¿Qué hace exactamente?
  deliverable: string; // ¿Qué obtienes tú?
  category: 'base' | 'advanced';
  requiredPlan: 'basic' | 'starter' | 'growth' | 'enterprise';
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  metricLabel: string;
}

export const GROWTH_MODULES_CATALOG: ModuleDefinition[] = [
  {
    id: 'mod1_seo',
    number: 1,
    title: 'SEO Técnico Avanzado e Indexación API',
    subtitle: 'Google Search Indexing API & Casos de Estudio',
    description: 'Generación autónoma de contenido técnico y envío directo a la API de Google.',
    purpose: 'Posicionar tu app en los primeros resultados de Google de inmediato sin esperar meses.',
    howItWorks: 'Investiga las búsquedas con mayor intención de compra en tu nicho, redacta artículos técnicos y casos de éxito mediante IA, y envía las URLs de inmediato a la API de Indexación de Google para forzar el rastreo prioritario en tiempo real sincronizado con Supabase.',
    deliverable: 'Páginas y artículos optimizados indexados en Google atrayendo tráfico orgánico calificado a tu web.',
    category: 'base',
    requiredPlan: 'starter',
    accentColor: 'text-emerald-400',
    accentBg: 'bg-emerald-500/10',
    accentBorder: 'border-emerald-500/20',
    metricLabel: 'URLs Indexadas en Google',
  },
  {
    id: 'mod2_social',
    number: 2,
    title: 'Social Media Syndication (Omnicanal)',
    subtitle: 'Hilos en X, LinkedIn Articles & Facebook',
    description: 'Distribución y formateo automático de contenido en redes sociales clave.',
    purpose: 'Multiplicar tu presencia en redes profesionales (X/Twitter, LinkedIn, Facebook) sin dedicar horas al día.',
    howItWorks: 'Toma los casos de estudio y contenido del Módulo 1 y los reescribe con formatos nativos: hilos virales para X, reflexiones B2B para LinkedIn y posts para Facebook, programándolos y publicándolos automáticamente.',
    deliverable: 'Publicaciones continuas que educan a tu audiencia y canalizan visitantes a tu página de registro.',
    category: 'base',
    requiredPlan: 'starter',
    accentColor: 'text-sky-400',
    accentBg: 'bg-sky-500/10',
    accentBorder: 'border-sky-500/20',
    metricLabel: 'Publicaciones Sindicadas',
  },
  {
    id: 'mod3_directories',
    number: 3,
    title: 'Programmatic Launching (Directorios Globales)',
    subtitle: 'Product Hunt, BetaList, AlternativeTo & 50+ Plataformas',
    description: 'Inscripción automática en más de 50 directorios y catálogos de software.',
    purpose: 'Dar a conocer tu software masivamente a miles de early-adopters y ganar backlinks de alta autoridad.',
    howItWorks: 'Un bot con automatización de navegador en servidor visita más de 50 directorios (Product Hunt, BetaList, AlternativeTo, SaaSHub, Toolify, etc.), completa los formularios de alta y adapta la descripción al formato de cada web.',
    deliverable: 'Fichas activas de tu software en más de 50 plataformas mundiales generando registros constantes.',
    category: 'base',
    requiredPlan: 'starter',
    accentColor: 'text-teal-400',
    accentBg: 'bg-teal-500/10',
    accentBorder: 'border-teal-500/20',
    metricLabel: 'Directorios Verificados',
  },
  {
    id: 'mod4_outbound',
    number: 4,
    title: 'Automated Outbound (X & Foros Q&A Blindado)',
    subtitle: 'Escucha Social Inteligente & Respuestas de Alto Valor Anti-Ban',
    description: 'Detección en tiempo real de intención de compra en X/Twitter, Quora y foros abiertos con cadencia humana protegida.',
    purpose: 'Captar clientes que están activamente buscando una solución a su problema ahora mismo sin riesgo de spam ni bloqueos de cuentas.',
    howItWorks: 'Monitorea palabras clave de alta intención en X/Twitter y comunidades abiertas de preguntas y respuestas. La IA genera respuestas de valor educativo con pausas adaptativas (jitter estocástico de 180s a 600s), rotación de variaciones semánticas y control de frecuencia para blindar tus cuentas contra cualquier penalización.',
    deliverable: 'Intervenciones humanas orgánicas con alto engagement que canalizan tráfico con alta intención de compra.',
    category: 'advanced',
    requiredPlan: 'growth',
    accentColor: 'text-indigo-400',
    accentBg: 'bg-indigo-500/10',
    accentBorder: 'border-indigo-500/20',
    metricLabel: 'Respuestas de Valor Publicadas',
  },
  {
    id: 'mod5_newsletter',
    number: 5,
    title: 'Newsletter Outreach Engine',
    subtitle: 'Pitching Directo a Creadores Tech & Negocios',
    description: 'Contacto automatizado con editores de boletines informativos influyentes.',
    purpose: 'Aparecer recomendado en newsletters leídas por miles de personas de tu público objetivo.',
    howItWorks: 'Mantiene una base de datos actualizada de periodistas y creadores de newsletters. Redacta correos de contacto ultra-personalizados ofreciéndoles acceso VIP gratuito a tu app a cambio de una mención o reseña.',
    deliverable: 'Apariciones en newsletters sectoriales que generan picos masivos de nuevos usuarios calificados.',
    category: 'advanced',
    requiredPlan: 'growth',
    accentColor: 'text-cyan-400',
    accentBg: 'bg-cyan-500/10',
    accentBorder: 'border-cyan-500/20',
    metricLabel: 'Pitches de Newsletter Enviados',
  },
  {
    id: 'mod6_video',
    number: 6,
    title: 'Video Growth Automation (TikTok, Reels, Shorts)',
    subtitle: 'Micro-Videos Virales con Síntesis de Voz',
    description: 'Creación y publicación de videos cortos para algoritmos virales.',
    purpose: 'Aprovechar el alcance viral y gratuito de TikTok, Instagram Reels y YouTube Shorts sin tener que grabarte.',
    howItWorks: 'Genera ganchos de 3 segundos de alta retención, guiones dinámicos, voces sintetizadas con IA y ensambla micro-videos promocionales adaptados al algoritmo de formato corto.',
    deliverable: 'Videos promocionales automáticos circulando en redes de video atrayendo registros jóvenes y móviles.',
    category: 'advanced',
    requiredPlan: 'enterprise',
    accentColor: 'text-violet-400',
    accentBg: 'bg-violet-500/10',
    accentBorder: 'border-violet-500/20',
    metricLabel: 'Micro-Videos Renderizados',
  },
  {
    id: 'mod7_pseo',
    number: 7,
    title: 'Programmatic SEO & Landing Page Factory',
    subtitle: 'Cientos de Páginas Comparativas Hiper-Específicas',
    description: 'Fábrica masiva de páginas de destino para búsquedas transaccionales y comparativas.',
    purpose: 'Capturar el tráfico de usuarios que buscan "Alternativa a [tu competidor]" o soluciones para casos específicos.',
    howItWorks: 'Crea de manera masiva y estructurada cientos de páginas de aterrizaje comparativas (ejemplo: "Alternativa económica a [Competidor]", "[Tu App] vs [Líder del Mercado]"), con datos estructurados y llamadas a la acción.',
    deliverable: 'Una red de páginas que atrapa a usuarios en la etapa final de compra cuando comparan opciones.',
    category: 'advanced',
    requiredPlan: 'enterprise',
    accentColor: 'text-purple-400',
    accentBg: 'bg-purple-500/10',
    accentBorder: 'border-purple-500/20',
    metricLabel: 'Landing Pages Desplegadas',
  },
  {
    id: 'mod8_influencers',
    number: 8,
    title: 'Bot de Alianzas y Micro-Influencers Outreach',
    subtitle: 'Escaneo de Creadores & Ofertas de Afiliación VIP',
    description: 'Prospección y negociación automatizada con creadores de nicho.',
    purpose: 'Conseguir un ejército de micro-influencers que recomienden tu software a cambio de comisiones.',
    howItWorks: 'Rastrea creadores de 5,000 a 50,000 seguidores en tu nicho y les envía propuestas automatizadas por mensaje directo (DM) o email, ofreciéndoles comisiones atractivas por afiliación y cuentas VIP gratis.',
    deliverable: 'Alianzas firmadas con creadores que comparten tu producto con sus comunidades fieles.',
    category: 'advanced',
    requiredPlan: 'enterprise',
    accentColor: 'text-fuchsia-400',
    accentBg: 'bg-fuchsia-500/10',
    accentBorder: 'border-fuchsia-500/20',
    metricLabel: 'Alianzas y Accesos Gestionados',
  },
];

export interface CampaignTypeDefinition {
  id: CampaignType;
  title: string;
  tagline: string;
  unitLabel: string;
  unitLabelPlural: string;
  iconName: string;
  shortDesc: string;
  howItWorks: string;
  verificationMethod: string;
  defaultTarget: number;
  targetPresets: number[];
  pricePerUnitEstimateUSD: number;
}

export const CAMPAIGN_TYPES_CATALOG: CampaignTypeDefinition[] = [
  {
    id: 'user_registrations',
    title: 'Campaña de Registros de Usuarios',
    tagline: 'Captación de cuentas activas en tu web o SaaS',
    unitLabel: 'usuario registrado',
    unitLabelPlural: 'usuarios registrados',
    iconName: 'Users',
    shortDesc: 'Genera tráfico orgánico y canaliza visitantes cualificados directo a tu pantalla de registro.',
    howItWorks: 'Activa sindicación SEO en Google, fichas de lanzamiento en directorios globales y escucha activa en foros. Los motores trabajan de forma ininterrumpida hasta alcanzar el número exacto de altas en tu Thank You Page.',
    verificationMethod: 'Enlace Puente Inteligente (/r/:id) que contabiliza automáticamente cada usuario derivado a tu pantalla de registro.',
    defaultTarget: 2000,
    targetPresets: [500, 1000, 2000, 5000, 10000, 25000],
    pricePerUnitEstimateUSD: 0.245,
  },
  {
    id: 'plan_sales',
    title: 'Campaña para Venta de Planes / Membresías',
    tagline: 'Conversión directa de clientes de pago y suscripciones',
    unitLabel: 'venta completada',
    unitLabelPlural: 'ventas de planes',
    iconName: 'CreditCard',
    shortDesc: 'Segmentación hiper-precisa de decisores de compra según los precios de tus planes.',
    howItWorks: 'Filtra perfiles con poder adquisitivo acorde a tu plan más barato y más caro. Genera casos de estudio con retorno de inversión (ROI), páginas comparativas vs competidores y secuencias de outreach directo B2B. Los motores no paran hasta que el número de planes vendidos esté confirmado.',
    verificationMethod: 'Enlace Puente Inteligente (/r/:id) con derivación directa de compradores cualificados y seguimiento de checkout.',
    defaultTarget: 50,
    targetPresets: [15, 30, 50, 100, 250, 500],
    pricePerUnitEstimateUSD: 12.5,
  },
  {
    id: 'social_followers',
    title: 'Campaña para Seguidores en Redes Sociales',
    tagline: 'Crecimiento de audiencia real y orgánica en X, LinkedIn e IG',
    unitLabel: 'seguidor orgánico',
    unitLabelPlural: 'seguidores nuevos',
    iconName: 'UserCheck',
    shortDesc: 'Multiplica tu comunidad con profesionales y clientes potenciales de tu nicho específico.',
    howItWorks: 'Sindicación continua de hilos de alto valor, reflexiones B2B e infografías. El sistema detecta conversaciones afines y atrae usuarios interesados en tu contenido hacia tus perfiles oficiales sin granjas de bots.',
    verificationMethod: 'Enlace Puente Inteligente (/r/:id) con derivación directa hacia tus perfiles sociales oficiales.',
    defaultTarget: 1000,
    targetPresets: [500, 1000, 2500, 5000, 10000],
    pricePerUnitEstimateUSD: 0.19,
  },
  {
    id: 'likes_engagement',
    title: 'Campaña para Likes & Engagement',
    tagline: 'Interacciones masivas, retweets y validación social',
    unitLabel: 'like / interacción',
    unitLabelPlural: 'likes e interacciones',
    iconName: 'Heart',
    shortDesc: 'Aumenta el algoritmo de tus publicaciones para posicionarlas en el feed de tendencias.',
    howItWorks: 'Detecta los mejores horarios y temas del nicho, creando ganchos psicológicos que impulsan al público a reaccionar, guardar y compartir tus publicaciones clave.',
    verificationMethod: 'Enlace Puente Inteligente (/r/:id) hacia tus publicaciones y contenidos de alto impacto.',
    defaultTarget: 2500,
    targetPresets: [1000, 2500, 5000, 15000, 30000],
    pricePerUnitEstimateUSD: 0.08,
  },
  {
    id: 'comments_reviews',
    title: 'Campaña para Comentarios & Reseñas',
    tagline: 'Prueba social, feedback calificado y debates activos',
    unitLabel: 'comentario calificado',
    unitLabelPlural: 'comentarios y reseñas',
    iconName: 'MessageSquareText',
    shortDesc: 'Fomenta testimonios reales y debates técnicos en tus posts, fichas de producto y foros.',
    howItWorks: 'Plantea preguntas provocativas del sector, encuestas y dilemas técnicos para que usuarios experimentados comenten sus experiencias y generen prueba social irresistible para nuevos compradores.',
    verificationMethod: 'Enlace Puente Inteligente (/r/:id) hacia tus hilos de discusión y foros sectoriales.',
    defaultTarget: 250,
    targetPresets: [50, 100, 250, 500, 1000],
    pricePerUnitEstimateUSD: 0.85,
  },
  {
    id: 'youtube_growth',
    title: 'Campaña de Vistas & Suscriptores en YouTube',
    tagline: 'Tráfico audiovisual masivo y posicionamiento en el algoritmo de YouTube',
    unitLabel: 'vista / suscriptor',
    unitLabelPlural: 'vistas y suscriptores',
    iconName: 'Youtube',
    shortDesc: 'Impulsa reproducciones de alta retención orgánica y suscriptores para tus videos de YouTube.',
    howItWorks: 'Convierte tus videos en micro-clips para Shorts/Reels/TikTok con enlaces al video principal, inserta tus videos en artículos técnicos de alto rango de Google y difunde resúmenes en hilos de X.',
    verificationMethod: 'Enlace Puente Inteligente (/r/:id) con derivación directa hacia tus videos y canal de YouTube.',
    defaultTarget: 10000,
    targetPresets: [2500, 5000, 10000, 25000, 5000, 100000],
    pricePerUnitEstimateUSD: 0.045,
  },
];

export interface EngineHealthItem {
  id: string;
  name: string;
  moduleKey: string;
  category: 'base' | 'advanced' | 'infrastructure';
  platform: string;
  requiredEnvVars: string[];
  configuredInVercel: boolean;
  latencyMs?: number;
  lastChecked: string;
  statusText: string;
  testEndpoint?: string;
  documentationUrl?: string;
}

export interface EngineValidationResult {
  canProceed: boolean;
  reason?: string;
  testedPlan: string;
  missingModules: {
    id: string;
    name: string;
    platform: string;
    missingVars: string[];
    description: string;
  }[];
}

export interface InternalSystemError {
  id: string;
  timestamp: string;
  level: 'CRITICAL' | 'WARNING' | 'INFO';
  location: string;
  module: string;
  message: string;
  callStack?: string;
  resolved?: boolean;
}

export interface SensitiveDataExposureAlert {
  id: string;
  type: 'PRIVATE_KEY' | 'HARDCODED_SECRET' | 'UNMASKED_PII' | 'DATABASE_CREDENTIAL';
  location: string;
  severity: 'HIGH' | 'CRITICAL' | 'MEDIUM';
  description: string;
  sampleMasked: string;
  remediation: string;
}

export interface OptimalPerformanceReport {
  overallHealth: 'OPTIMAL' | 'DEGRADED' | 'BLOCKED_PENDING_APIS';
  securityScore: number;
  totalEngines: number;
  configuredEnginesCount: number;
  engines: EngineHealthItem[];
  errors: InternalSystemError[];
  sensitiveDataAlerts: SensitiveDataExposureAlert[];
  uptimeSeconds: number;
  lastDiagnosticTimestamp: string;
}

