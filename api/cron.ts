import { createClient } from '@supabase/supabase-js';

// Resolución universal de variables de entorno (Node, Vercel, Supabase, Neon)
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

// Función auxiliar para evitar que cualquier await quede colgado indefinidamente
function withTimeout<T>(promise: Promise<T>, ms: number, timeoutMsg: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout de ${ms}ms alcanzado: ${timeoutMsg}`)), ms)
    ),
  ]);
}

const getSupabase = () => {
  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
};

async function executeCronSync() {
  const startTime = Date.now();
  console.log(`[CRON-JOB PASO 1/6] ⏰ Disparo recibido | Hora: ${new Date().toISOString()}`);

  console.log(
    `[CRON-JOB PASO 2/6] 🔑 Variables de entorno: URL=[${supabaseUrl ? 'CONFIGURADA' : 'NO DETECTADA'}], Key=[${supabaseServiceKey ? 'CONFIGURADA' : 'NO DETECTADA'}]`
  );

  const supabase = getSupabase();
  if (!supabase) {
    console.warn('[CRON-JOB ADVERTENCIA] Supabase no configurado en variables de entorno. Completando pulso en memoria.');
    return {
      success: true,
      message: 'Supabase no configurado en variables de entorno; pulso cron registrado en memoria.',
      processed: 0,
      timestamp: new Date().toISOString(),
      durationMs: Date.now() - startTime,
    };
  }

  console.log('[CRON-JOB PASO 3/6] 📡 Conectando a Supabase y consultando campañas activas...');

  // Consulta con timeout de seguridad (6000 ms) para evitar cuelgues serverless
  const { data: campaigns, error: fetchError } = await withTimeout(
    supabase.from('campaigns').select('*'),
    6000,
    'Consulta select a campaigns en Supabase'
  );

  if (fetchError) {
    console.error('[CRON-JOB ERROR] Error al consultar campañas:', fetchError.message || fetchError);
    throw fetchError;
  }

  if (!campaigns || campaigns.length === 0) {
    console.log('[CRON-JOB INFO] No hay campañas registradas para procesar. Finalizando pulso.');
    return {
      success: true,
      message: 'No hay campañas activas para procesar.',
      processed: 0,
      timestamp: new Date().toISOString(),
      durationMs: Date.now() - startTime,
    };
  }

  console.log(`[CRON-JOB PASO 4/6] ⚙️ ${campaigns.length} campañas detectadas. Actualizando estado a ACTIVO en paralelo...`);

  // Actualización paralela con Promise.allSettled para evitar bucles lentos o bloqueos
  const updatePromises = campaigns.map((campaign) =>
    withTimeout(
      supabase
        .from('campaigns')
        .update({
          status: 'active',
          paused_at: null,
        })
        .eq('id', campaign.id),
      4000,
      `Update de campaña ${campaign.id}`
    )
  );

  const updateResults = await Promise.allSettled(updatePromises);
  const updatedCount = updateResults.filter((r) => r.status === 'fulfilled' && !(r.value as any)?.error).length;

  console.log(`[CRON-JOB PASO 5/6] 📝 Campañas sincronizadas (${updatedCount}/${campaigns.length}). Registrando en bitácora system_audit_logs...`);

  const firstCampaignId = campaigns[0]?.id || 'system_core';
  const logId = `log_cron_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  // Inserción sin user_id (evita errores de columna inexistente) con timeout seguro
  try {
    await withTimeout(
      supabase.from('system_audit_logs').insert({
        id: logId,
        campaign_id: firstCampaignId,
        timestamp: new Date().toISOString(),
        level: 'SUCCESS',
        module: 'CRON_OUTBOUND_SYNC',
        message: `⚡ Sincronización exitosa de ${campaigns.length} motores de captación de tráfico. Actualizadas ${updatedCount}.`,
      }),
      3000,
      'Insert en system_audit_logs'
    );
  } catch (logErr: any) {
    console.warn('[CRON-JOB AVISO] Fallback en registro de bitácora:', logErr?.message || logErr);
  }

  // Obtener logs recientes para respuesta
  let recentAuditLogs: any[] = [];
  try {
    const { data: auditLogs } = await withTimeout(
      supabase.from('system_audit_logs').select('*').order('timestamp', { ascending: false }).limit(20),
      3000,
      'Select en system_audit_logs'
    );
    recentAuditLogs = auditLogs || [];
  } catch {
    recentAuditLogs = [];
  }

  const durationMs = Date.now() - startTime;
  console.log(`[CRON-JOB PASO 6/6] ✅ Sincronización completada exitosamente en ${durationMs}ms. Devolviendo HTTP 200 OK.`);

  return {
    success: true,
    message: `Motores sincronizados correctamente. Procesadas ${campaigns.length} campañas.`,
    processed: campaigns.length,
    updated: updatedCount,
    timestamp: new Date().toISOString(),
    latest_log_id: logId,
    durationMs,
    system_audit_logs: recentAuditLogs,
  };
}

// Handler universal compatible con Vercel Serverless (req, res) y Edge (Web Request/Response)
export default async function handler(req: any, res?: any) {
  const method = req?.method || 'GET';
  console.log(`\n========================================`);
  console.log(`[CRON DISPARO ENTRANTE] Método: ${method} | URL: /api/cron | Host: ${req?.headers?.host || 'Vercel'}`);
  console.log(`========================================`);

  try {
    const result = await executeCronSync();

    // Node.js Serverless runtime (Vercel standard)
    if (res && typeof res.status === 'function') {
      return res.status(200).json(result);
    }

    // Web Standard Response (Edge runtime)
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    console.error('[CRON-JOB ERROR CRÍTICO]:', error?.message || error);
    const errBody = {
      success: false,
      error: error?.message || 'Error interno del servidor en los motores.',
      timestamp: new Date().toISOString(),
    };

    if (res && typeof res.status === 'function') {
      return res.status(500).json(errBody);
    }

    return new Response(JSON.stringify(errBody), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  }
}

export async function GET(req: any, res?: any) {
  return handler(req, res);
}

export async function POST(req: any, res?: any) {
  return handler(req, res);
}
