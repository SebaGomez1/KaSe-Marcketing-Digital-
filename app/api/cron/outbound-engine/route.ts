import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: Request) {
  try {
    const { data: campaigns, error: fetchError } = await supabase
      .from('campaigns')
      .select('*');

    if (fetchError) throw fetchError;

    if (!campaigns || campaigns.length === 0) {
      return Response.json({ success: true, message: 'No campaigns found.', system_audit_logs: [] });
    }

    for (const campaign of campaigns) {
      // Usar columnas validadas en el esquema (status, paused_at). NO enviar updated_at que dispara PGRST204
      let { error: syncError } = await supabase
        .from('campaigns')
        .update({
          status: 'active',
          paused_at: null
        })
        .eq('id', campaign.id);

      if (syncError) {
        const { error: upsertErr } = await supabase
          .from('campaigns')
          .upsert({
            id: campaign.id,
            status: 'active',
            paused_at: null
          }, { onConflict: 'id' });
        syncError = upsertErr;
      }

      if (syncError) {
        console.error(`Error sincronizando campaña ${campaign.id}:`, syncError.message || syncError);
      }
    }

    const firstCampaignId = campaigns[0].id;
    const uniqueId = `log_${Math.random().toString(36).substr(2, 9)}`;

    await supabase
      .from('system_audit_logs')
      .insert({
        id: uniqueId,
        campaign_id: firstCampaignId,
        timestamp: new Date().toISOString(),
        level: 'INFO',
        module: 'cron_outbound',
        message: `Sincronización exitosa de motores para ${campaigns.length} campañas.`
      });

    console.log(`[SUCCESS] Motors sync completed.`);

    // Obtener las ejecuciones recientes de system_audit_logs para mostrarlas en la respuesta
    const { data: auditLogs } = await supabase
      .from('system_audit_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(30);

    return Response.json({ 
      success: true, 
      message: `Motors synchronized completed.`,
      executed_at: new Date().toISOString(),
      campaigns_processed: campaigns.length,
      latest_log_id: uniqueId,
      system_audit_logs: auditLogs || []
    });

  } catch (error: any) {
    console.error('Critical error:', error);
    return Response.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
