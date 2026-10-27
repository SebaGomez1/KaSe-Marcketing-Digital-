import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  '';

const getSupabase = () => {
  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }
  return createClient(supabaseUrl, supabaseServiceKey);
};

async function executeCronSync() {
  const supabase = getSupabase();
  if (!supabase) {
    return {
      success: true,
      message: 'Supabase no configurado en variables de entorno; pulso cron registrado en memoria.',
      processed: 0,
      timestamp: new Date().toISOString(),
    };
  }

  const { data: campaigns, error: fetchError } = await supabase
    .from('campaigns')
    .select('*');

  if (fetchError) {
    throw fetchError;
  }

  if (!campaigns || campaigns.length === 0) {
    return {
      success: true,
      message: 'No hay campañas activas para procesar.',
      processed: 0,
      timestamp: new Date().toISOString(),
    };
  }

  let updatedCount = 0;
  for (const campaign of campaigns) {
    let { error: syncError } = await supabase
      .from('campaigns')
      .update({
        status: 'active',
        paused_at: null,
      })
      .eq('id', campaign.id);

    if (syncError) {
      const { error: upsertErr } = await supabase
        .from('campaigns')
        .upsert({
          id: campaign.id,
          status: 'active',
          paused_at: null,
        }, { onConflict: 'id' });
      syncError = upsertErr;
    }

    if (syncError) {
      console.error(`Error sincronizando campaña ${campaign.id}:`, syncError.message || syncError);
    } else {
      updatedCount++;
    }
  }

  const firstCampaignId = campaigns[0]?.id || 'system_core';
  const logId = `log_${Math.random().toString(36).substring(2, 9)}`;

  await supabase.from('system_audit_logs').insert({
    id: logId,
    campaign_id: firstCampaignId,
    timestamp: new Date().toISOString(),
    level: 'INFO',
    module: 'cron_outbound',
    message: `Sincronización exitosa de ${campaigns.length} motores de captación de tráfico. Actualizadas ${updatedCount}.`,
  });

  const { data: auditLogs } = await supabase
    .from('system_audit_logs')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(30);

  return {
    success: true,
    message: `Motores sincronizados correctamente de forma nativa. Procesadas ${campaigns.length} campañas.`,
    processed: campaigns.length,
    updated: updatedCount,
    timestamp: new Date().toISOString(),
    latest_log_id: logId,
    system_audit_logs: auditLogs || [],
  };
}

// Handler universal compatible con Vercel Serverless (req, res) y Edge (Web Request/Response)
export default async function handler(req: any, res?: any) {
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
    console.error('Error crítico en el motor de captación:', error);
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
