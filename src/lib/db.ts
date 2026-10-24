import { createClient, SupabaseClient } from '@supabase/supabase-js';
import pg from 'pg';
import { 
  Campaign, 
  CampaignModuleState, 
  CampaignLog, 
  ConversionRecord, 
  User 
} from '../types/growth';

const { Pool } = pg;

// Supabase / PostgreSQL configuration from Environment Variables
const rawDbUrl = process.env.DATABASE_URL?.trim() || '';
const rawSupabaseUrl = process.env.SUPABASE_URL?.trim() || '';
const rawAnonKey = process.env.SUPABASE_ANON_KEY?.trim() || process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || '';

// Determine Supabase HTTP API config
const supabaseEndpoint = rawSupabaseUrl.startsWith('http') 
  ? rawSupabaseUrl 
  : rawDbUrl.startsWith('http') 
  ? rawDbUrl 
  : '';

export const isSupabaseConfigured = Boolean(
  supabaseEndpoint && 
  rawAnonKey && 
  !supabaseEndpoint.includes('MY_') && 
  !rawAnonKey.includes('MY_')
);

// Determine direct PostgreSQL connection string (Supabase Connection Pooler / Neon / Cloud SQL)
export const isPostgresConfigured = Boolean(
  rawDbUrl && 
  (rawDbUrl.startsWith('postgres://') || rawDbUrl.startsWith('postgresql://')) &&
  !rawDbUrl.includes('MY_')
);

// Initialize Supabase Client if configured
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseEndpoint, rawAnonKey, {
      auth: { persistSession: false },
    })
  : null;

// Initialize PostgreSQL Pool if connection string is configured
export const pgPool: pg.Pool | null = isPostgresConfigured
  ? new Pool({
      connectionString: rawDbUrl,
      ssl: rawDbUrl.includes('localhost') ? false : { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
      max: 10,
    })
  : null;

export interface DbStatusInfo {
  isConfigured: boolean;
  provider: 'supabase' | 'postgresql' | 'local_fallback';
  endpointMasked: string;
  hasAnonKey: boolean;
  activePool: boolean;
  connectionSuccess?: boolean;
  latencyMs?: number;
  lastChecked?: string;
  error?: string;
}

export async function testDbConnection(): Promise<DbStatusInfo> {
  const now = new Date().toISOString();

  if (isSupabaseConfigured && supabase) {
    const start = Date.now();
    try {
      const { data, error } = await supabase.from('global_config').select('id').limit(1);
      const latencyMs = Date.now() - start;
      if (error) {
        return {
          isConfigured: true,
          provider: 'supabase',
          endpointMasked: maskUrl(supabaseEndpoint),
          hasAnonKey: true,
          activePool: true,
          connectionSuccess: false,
          latencyMs,
          lastChecked: now,
          error: error.message,
        };
      }
      return {
        isConfigured: true,
        provider: 'supabase',
        endpointMasked: maskUrl(supabaseEndpoint),
        hasAnonKey: true,
        activePool: true,
        connectionSuccess: true,
        latencyMs,
        lastChecked: now,
      };
    } catch (err: any) {
      return {
        isConfigured: true,
        provider: 'supabase',
        endpointMasked: maskUrl(supabaseEndpoint),
        hasAnonKey: true,
        activePool: true,
        connectionSuccess: false,
        lastChecked: now,
        error: err.message || 'Error al conectar con Supabase',
      };
    }
  }

  if (isPostgresConfigured && pgPool) {
    const start = Date.now();
    try {
      const client = await pgPool.connect();
      await client.query('SELECT 1');
      client.release();
      const latencyMs = Date.now() - start;
      return {
        isConfigured: true,
        provider: 'postgresql',
        endpointMasked: maskUrl(rawDbUrl),
        hasAnonKey: Boolean(rawAnonKey),
        activePool: true,
        connectionSuccess: true,
        latencyMs,
        lastChecked: now,
      };
    } catch (err: any) {
      return {
        isConfigured: true,
        provider: 'postgresql',
        endpointMasked: maskUrl(rawDbUrl),
        hasAnonKey: Boolean(rawAnonKey),
        activePool: false,
        connectionSuccess: false,
        lastChecked: now,
        error: err.message || 'Error de conexión PostgreSQL',
      };
    }
  }

  return {
    isConfigured: false,
    provider: 'local_fallback',
    endpointMasked: 'Modo Local Resiliente (data/campaigns.json)',
    hasAnonKey: false,
    activePool: false,
    connectionSuccess: true,
    lastChecked: now,
  };
}

function maskUrl(urlStr: string): string {
  try {
    if (urlStr.startsWith('http')) {
      const parsed = new URL(urlStr);
      return `${parsed.protocol}//${parsed.hostname.slice(0, 4)}***.${parsed.hostname.split('.').slice(-2).join('.')}`;
    }
    return urlStr.replace(/:[^:@]+@/, ':***@').slice(0, 30) + '...';
  } catch {
    return 'URL Configurada';
  }
}

// Convert DB snake_case record to Campaign TypeScript model
export function mapRowToCampaign(
  row: any, 
  moduleRows: any[] = [], 
  convRows: any[] = [], 
  logRows: any[] = []
): Campaign {
  const defaultModules: any = {
    mod1_seo: { active: true, name: 'SEO Técnico Avanzado', category: 'base', itemsProcessed: 48, lastExecution: 'Hace 14 min', statusText: 'API Google Indexing activa' },
    mod2_social: { active: true, name: 'Social Media Syndication', category: 'base', itemsProcessed: 116, lastExecution: 'Hace 32 min', statusText: 'Sindicación en X y LinkedIn' },
    mod3_directories: { active: true, name: 'Programmatic Launching', category: 'base', itemsProcessed: 39, lastExecution: 'Hace 1 h', statusText: 'Directorios verificados' },
    mod4_outbound: { active: row.plan === 'growth' || row.plan === 'enterprise', name: 'Automated Outbound & Social Outreach', category: 'advanced', itemsProcessed: 0, lastExecution: 'Activo', statusText: 'X / Twitter & Foros Q&A (Anti-Ban Guard)' },
    mod5_newsletter: { active: row.plan === 'growth' || row.plan === 'enterprise', name: 'Newsletter Outreach', category: 'advanced', itemsProcessed: 0, lastExecution: 'Activo', statusText: 'Warming óptimo' },
    mod6_video: { active: row.plan === 'enterprise', name: 'Video Growth Automation', category: 'advanced', itemsProcessed: 0, lastExecution: 'Activo', statusText: 'TikTok/Reels' },
    mod7_pseo: { active: row.plan === 'enterprise', name: 'Programmatic SEO', category: 'advanced', itemsProcessed: 0, lastExecution: 'Activo', statusText: 'Páginas comparativas' },
    mod8_influencers: { active: row.plan === 'enterprise', name: 'Bot de Alianzas', category: 'advanced', itemsProcessed: 0, lastExecution: 'Activo', statusText: 'Micro-influencers' },
  };

  if (moduleRows && moduleRows.length > 0) {
    moduleRows.forEach((m) => {
      const key = m.module_key as keyof typeof defaultModules;
      if (defaultModules[key]) {
        defaultModules[key] = {
          active: Boolean(m.active),
          name: m.name || defaultModules[key].name,
          category: m.category || defaultModules[key].category,
          itemsProcessed: Number(m.items_processed || 0),
          lastExecution: m.last_execution || 'Reciente',
          statusText: m.status_text || 'Operando',
        };
      }
    });
  }

  const recentConversions: ConversionRecord[] = (convRows || []).map((c) => ({
    id: c.id,
    timestamp: c.timestamp || new Date().toISOString(),
    method: c.method || 'webhook',
    userTag: c.user_tag || 'web_lead',
    ipMasked: c.ip_masked || '194.22.***.***',
    referrer: c.referrer || 'Direct',
  }));

  const logs: CampaignLog[] = (logRows || []).map((l) => ({
    id: l.id,
    timestamp: l.timestamp || new Date().toISOString(),
    level: l.level || 'INFO',
    module: l.module || 'CORE',
    message: l.message || '',
  }));

  return {
    id: row.id,
    name: row.name,
    targetUrl: row.target_url,
    niche: row.niche || 'Tecnología',
    description: row.description || '',
    campaignType: row.campaign_type || 'user_registrations',
    targetUnitLabel: row.target_unit_label || 'usuarios registrados',
    minPlanPrice: row.min_plan_price ? Number(row.min_plan_price) : undefined,
    maxPlanPrice: row.max_plan_price ? Number(row.max_plan_price) : undefined,
    currency: row.currency || 'USD',
    targetRegistrations: Number(row.target_registrations || 2000),
    currentRegistrations: Number(row.current_registrations || 0),
    plan: row.plan || 'starter',
    status: row.status || 'configuring',
    webhookSecret: row.webhook_secret || `whsec_${row.id}`,
    interactionPreferences: row.interaction_preferences || undefined,
    communicationToneInstructions: row.communication_tone_instructions || undefined,
    geoTargeting: row.geo_targeting || undefined,
    createdAt: row.created_at || new Date().toISOString(),
    pausedAt: row.paused_at || undefined,
    billing: row.billing || undefined,
    modules: defaultModules,
    recentConversions,
    logs,
  };
}

// Map Campaign object to DB columns for insert/upsert
export function mapCampaignToRow(campaign: Campaign): any {
  return {
    id: campaign.id,
    name: campaign.name,
    target_url: campaign.targetUrl,
    niche: campaign.niche,
    description: campaign.description,
    campaign_type: campaign.campaignType,
    target_unit_label: campaign.targetUnitLabel,
    min_plan_price: campaign.minPlanPrice !== undefined ? campaign.minPlanPrice : null,
    max_plan_price: campaign.maxPlanPrice !== undefined ? campaign.maxPlanPrice : null,
    currency: campaign.currency || 'USD',
    target_registrations: campaign.targetRegistrations,
    current_registrations: campaign.currentRegistrations,
    plan: campaign.plan,
    status: campaign.status,
    webhook_secret: campaign.webhookSecret,
    interaction_preferences: campaign.interactionPreferences || null,
    communication_tone_instructions: campaign.communicationToneInstructions || null,
    geo_targeting: campaign.geoTargeting ? JSON.stringify(campaign.geoTargeting) : null,
    created_at: campaign.createdAt || new Date().toISOString(),
    paused_at: campaign.pausedAt || null,
    billing: campaign.billing ? JSON.stringify(campaign.billing) : null,
  };
}
