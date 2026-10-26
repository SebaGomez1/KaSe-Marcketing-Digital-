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

// Supabase / PostgreSQL configuration from Environment Variables (Universal Support: Node, Next.js, Vite)
const rawDbUrl = (process.env.DATABASE_URL || '').trim();
const rawSupabaseUrl = (
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) ||
  ''
).trim();
const rawAnonKey = (
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) ||
  ''
).trim();

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
  !rawAnonKey.includes('MY_') &&
  supabaseEndpoint !== 'https://supabase.co' &&
  supabaseEndpoint !== 'http://supabase.co' &&
  !supabaseEndpoint.includes('xxx.supabase.co')
);

// Determine direct PostgreSQL connection string (Supabase Connection Pooler / Neon / Cloud SQL)
export const isPostgresConfigured = Boolean(
  rawDbUrl && 
  (rawDbUrl.startsWith('postgres://') || rawDbUrl.startsWith('postgresql://')) &&
  !rawDbUrl.includes('MY_') &&
  !rawDbUrl.includes('MY_DATABASE_URL') &&
  (() => {
    try {
      new URL(rawDbUrl);
      return true;
    } catch {
      return false;
    }
  })()
);

// Initialize Supabase Client if configured
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseEndpoint, rawAnonKey, {
      auth: { persistSession: false },
    })
  : null;

// Initialize PostgreSQL Pool if connection string is configured
let initializedPool: pg.Pool | null = null;
if (isPostgresConfigured) {
  try {
    initializedPool = new Pool({
      connectionString: rawDbUrl,
      ssl: rawDbUrl.includes('localhost') ? false : { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
      max: 10,
    });
  } catch (err) {
    console.warn('[DB Error Postgres Pool init]:', err);
    initializedPool = null;
  }
}
export const pgPool: pg.Pool | null = initializedPool;

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
    userId: row.user_id || row.creator_email || undefined,
    creatorEmail: row.creator_email || row.user_id || undefined,
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
    clicksCount: Number(row.clicks_count || 0),
    plan: row.plan || 'starter',
    status: row.status || 'configuring',
    webhookSecret: row.webhook_secret || `whsec_${row.id}`,
    interactionPreferences: row.interaction_preferences || undefined,
    communicationToneInstructions: row.communication_tone_instructions || undefined,
    geoTargeting: row.geo_targeting ? (typeof row.geo_targeting === 'string' ? JSON.parse(row.geo_targeting) : row.geo_targeting) : undefined,
    createdAt: row.created_at || new Date().toISOString(),
    pausedAt: row.paused_at || undefined,
    billing: row.billing ? (typeof row.billing === 'string' ? JSON.parse(row.billing) : row.billing) : undefined,
    modules: defaultModules,
    recentConversions,
    logs,
  };
}

// Map Campaign object to DB columns for insert/upsert
export function mapCampaignToRow(campaign: any): any {
  if (!campaign) return null;
  return {
    id: campaign.id,
    user_id: campaign.userId || campaign.creatorEmail || campaign.user_id || null,
    creator_email: campaign.creatorEmail || campaign.userId || campaign.creator_email || null,
    name: campaign.name || 'Sin título',
    target_url: campaign.targetUrl || campaign.target_url || '',
    niche: campaign.niche || 'General',
    description: campaign.description || null,
    campaign_type: campaign.campaignType || campaign.campaign_type || 'user_registrations',
    target_unit_label: campaign.targetUnitLabel || campaign.target_unit_label || 'registros',
    min_plan_price: campaign.minPlanPrice !== undefined && campaign.minPlanPrice !== null 
      ? Number(campaign.minPlanPrice) 
      : (campaign.min_plan_price !== undefined && campaign.min_plan_price !== null ? Number(campaign.min_plan_price) : null),
    max_plan_price: campaign.maxPlanPrice !== undefined && campaign.maxPlanPrice !== null 
      ? Number(campaign.maxPlanPrice) 
      : (campaign.max_plan_price !== undefined && campaign.max_plan_price !== null ? Number(campaign.max_plan_price) : null),
    currency: campaign.currency || 'USD',
    target_registrations: Number(campaign.targetRegistrations ?? campaign.target_registrations ?? 2000),
    current_registrations: Number(campaign.currentRegistrations ?? campaign.current_registrations ?? 0),
    clicks_count: Number(campaign.clicksCount ?? campaign.clicks_count ?? 0),
    plan: campaign.plan || 'starter',
    status: campaign.status || 'active',
    webhook_secret: campaign.webhookSecret || campaign.webhook_secret || `whsec_${campaign.id}`,
    interaction_preferences: campaign.interactionPreferences || campaign.interaction_preferences || null,
    communication_tone_instructions: campaign.communicationToneInstructions || campaign.communication_tone_instructions || null,
    geo_targeting: campaign.geoTargeting 
      ? (typeof campaign.geoTargeting === 'string' ? campaign.geoTargeting : JSON.stringify(campaign.geoTargeting)) 
      : (campaign.geo_targeting ? (typeof campaign.geo_targeting === 'string' ? campaign.geo_targeting : JSON.stringify(campaign.geo_targeting)) : null),
    created_at: campaign.createdAt || campaign.created_at || new Date().toISOString(),
    paused_at: campaign.pausedAt || campaign.paused_at || null,
    billing: campaign.billing 
      ? (typeof campaign.billing === 'string' ? campaign.billing : JSON.stringify(campaign.billing)) 
      : null,
  };
}

// Direct SQL / Supabase query with strict data isolation for user panel
export async function fetchUserCampaignsFromSupabase(userId: string): Promise<Campaign[]> {
  if (!supabase) return [];
  try {
    const { data: rows, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !rows || rows.length === 0) {
      // Also fallback to check creator_email if user_id was stored as email
      const { data: emailRows } = await supabase
        .from('campaigns')
        .select('*')
        .eq('creator_email', userId)
        .order('created_at', { ascending: false });
      if (!emailRows || emailRows.length === 0) return [];
      return emailRows.map((r) => mapRowToCampaign(r));
    }

    const campIds = rows.map((c) => c.id);
    const [modulesRes, convsRes, logsRes] = await Promise.all([
      supabase.from('campaign_modules').select('*').in('campaign_id', campIds),
      supabase.from('conversions').select('*').in('campaign_id', campIds).order('timestamp', { ascending: false }).limit(200),
      supabase.from('system_audit_logs').select('*').in('campaign_id', campIds).order('timestamp', { ascending: false }).limit(200),
    ]);

    const moduleRowsByCamp: Record<string, any[]> = {};
    (modulesRes.data || []).forEach((m) => {
      if (!moduleRowsByCamp[m.campaign_id]) moduleRowsByCamp[m.campaign_id] = [];
      moduleRowsByCamp[m.campaign_id].push(m);
    });

    const convRowsByCamp: Record<string, any[]> = {};
    (convsRes.data || []).forEach((c) => {
      if (!convRowsByCamp[c.campaign_id]) convRowsByCamp[c.campaign_id] = [];
      convRowsByCamp[c.campaign_id].push(c);
    });

    const logRowsByCamp: Record<string, any[]> = {};
    (logsRes.data || []).forEach((l) => {
      if (!logRowsByCamp[l.campaign_id]) logRowsByCamp[l.campaign_id] = [];
      logRowsByCamp[l.campaign_id].push(l);
    });

    return rows.map((r) => 
      mapRowToCampaign(r, moduleRowsByCamp[r.id] || [], convRowsByCamp[r.id] || [], logRowsByCamp[r.id] || [])
    );
  } catch (err) {
    console.warn('[Direct Supabase fetchUserCampaigns error]:', err);
    return [];
  }
}

// Direct SQL / Supabase handler for Enlace Puente dynamic route
export async function handleBridgeInterceptionDirectSupabase(
  campaignId: string, 
  referrer: string = 'Enlace Puente KaSe', 
  ipMasked: string = '185.12.***.***'
): Promise<{ redirectUrl: string; success: boolean; campaignName?: string }> {
  if (!supabase) {
    return { redirectUrl: '/', success: false };
  }

  try {
    // 1. Operación atómica nativa vía .rpc('increment_clicks') para evitar condiciones de carrera
    try {
      const { data: rpcData, error: rpcErr } = await supabase.rpc('increment_clicks', {
        target_campaign_id: campaignId,
        client_ip: ipMasked,
        client_referrer: referrer,
      });

      if (!rpcErr && rpcData && rpcData.destination_url && rpcData.destination_url !== '/') {
        return {
          redirectUrl: rpcData.destination_url,
          success: true,
          campaignName: 'Campaña KaSe',
        };
      }
    } catch (e) {
      // RPC fallback
    }

    // 2. Consulta y persistencia directa si RPC no estuviera disponible
    const { data: campaign, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .maybeSingle();

    if (error || !campaign) {
      return { redirectUrl: '/', success: false };
    }

    const assignedUserId = campaign.user_id || campaign.creator_email || 'usuario_anonimo';
    const newClicks = Number(campaign.clicks_count || 0) + 1;
    const currentRegs = Number(campaign.current_registrations || 0);
    const targetRegs = Number(campaign.target_registrations || 2000);

    const convId = `click_bridge_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const nowIso = new Date().toISOString();

    // 2. Persist click record strictly associated to user_id and campana_id in Supabase
    await Promise.allSettled([
      // Insert organic click telemetry record
      supabase.from('conversions').insert({
        id: convId,
        campaign_id: campaign.id,
        campana_id: campaign.id,
        user_id: assignedUserId,
        timestamp: nowIso,
        method: 'organic_click',
        user_tag: `bridge_click_${Math.random().toString(36).substring(2, 7)}`,
        ip_masked: ipMasked,
        referrer: referrer,
      }),
      // Clicks count update without tampering with completed registration quota
      supabase.from('campaigns').update({
        clicks_count: newClicks,
        updated_at: nowIso,
      }).eq('id', campaign.id),
      // System audit log directly to Supabase
      supabase.from('system_audit_logs').insert({
        id: `log_bridge_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        campaign_id: campaign.id,
        user_id: assignedUserId,
        timestamp: nowIso,
        level: 'SUCCESS',
        module: 'ENRUTADOR_PUENTE',
        message: `⚡ Enlace Puente interceptado: +1 clic orgánico derivado al destino (campana_id: ${campaign.id}, user_id: ${assignedUserId}). Clics totales: ${newClicks}. Registros contratados: ${currentRegs}/${targetRegs}.`,
      })
    ]);

    return { 
      redirectUrl: campaign.target_url || '/', 
      success: true, 
      campaignName: campaign.name 
    };
  } catch (e) {
    console.error('[Error handleBridgeInterceptionDirectSupabase]:', e);
    return { redirectUrl: '/', success: false };
  }
}
