import { createClient } from '@supabase/supabase-js';

const rawDbUrl = (process.env.DATABASE_URL || '').trim();
const supabaseUrl = (
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  (rawDbUrl.startsWith('http') ? rawDbUrl : '')
).trim();

const supabaseServiceKey = (
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  ''
).trim();

function getClient() {
  if (!supabaseUrl || !supabaseServiceKey) return null;
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
}

export async function GET(request: Request) {
  const startTime = Date.now();
  console.log(`\n========================================`);
  console.log(`[APP CRON PASO 1/5] ⏰ Disparo recibido en /app/api/cron/outbound-engine | Hora: ${new Date().toISOString()}`);
  console.log(`[APP CRON PASO 2/5] 🔑 Verificando variables: URL=[${supabaseUrl ? 'OK' : 'MISSING'}], Key=[${supabaseServiceKey ? 'OK' : 'MISSING'}]`);
  console.log(`========================================`);

  try {
    const supabase = getClient();
    if (!supabase) {
      console.warn('[APP CRON ADVERTENCIA] Supabase no configurado en variables de entorno.');
      return Response.json({
        success: true,
        message: 'Supabase no configurado en variables de entorno; pulso registrado.',
        system_audit_logs: [],
      });
    }

    console.log('[APP CRON PASO 3/5] 📡 Consultando campañas activas...');
    const { data: campaigns, error: fetchError } = await supabase
      .from('campaigns')
      .select('*');

    if (fetchError) {
      console.error('[APP CRON ERROR] Error en select de campaigns:', fetchError.message || fetchError);
      throw fetchError;
    }

    if (!campaigns || campaigns.length === 0) {
      console.log('[APP CRON INFO] No hay campañas para procesar.');
      return Response.json({ success: true, message: 'No campaigns found.', system_audit_logs: [] });
    }

    console.log(`[APP CRON PASO 4/5] ⚙️ Sincronizando ${campaigns.length} campañas en paralelo...`);
    const updatePromises = campaigns.map((campaign) =>
      supabase
        .from('campaigns')
        .update({
          status: 'active',
          paused_at: null,
        })
        .eq('id', campaign.id)
    );
    const results = await Promise.allSettled(updatePromises);
    const updatedCount = results.filter((r) => r.status === 'fulfilled' && !(r.value as any)?.error).length;

    const firstCampaignId = campaigns[0].id;
    const uniqueId = `log_app_cron_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    // Registro en bitácora sin user_id para máxima compatibilidad
    try {
      await supabase.from('system_audit_logs').insert({
        id: uniqueId,
        campaign_id: firstCampaignId,
        timestamp: new Date().toISOString(),
        level: 'INFO',
        module: 'cron_outbound',
        message: `Sincronización exitosa de motores para ${campaigns.length} campañas. Actualizadas: ${updatedCount}.`,
      });
    } catch (logErr: any) {
      console.warn('[APP CRON AVISO] Fallback en registro de bitácora:', logErr?.message || logErr);
    }

    const { data: auditLogs } = await supabase
      .from('system_audit_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(30);

    const duration = Date.now() - startTime;
    console.log(`[APP CRON PASO 5/5] ✅ Motores sincronizados exitosamente en ${duration}ms. Enviando HTTP 200.`);

    return Response.json({
      success: true,
      message: 'Motors synchronized completed.',
      executed_at: new Date().toISOString(),
      campaigns_processed: campaigns.length,
      updated_count: updatedCount,
      duration_ms: duration,
      latest_log_id: uniqueId,
      system_audit_logs: auditLogs || [],
    });
  } catch (error: any) {
    console.error('[APP CRON ERROR CRÍTICO]:', error);
    return Response.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return GET(request);
}
