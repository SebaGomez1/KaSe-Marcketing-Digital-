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
      return Response.json({ success: true, message: 'No hay campañas activas para procesar.' });
    }

    for (const campaign of campaigns) {
      const { error: syncError } = await supabase
        .from('campaigns')
        .upsert({
          id: campaign.id,
          updated_at: new Date().toISOString(),
          status: 'active'
        });

      if (syncError) {
        console.error(`Error sincronizando campaña ${campaign.id}:`, syncError);
      }
    }

    await supabase
      .from('system_audit_logs')
      .insert({
        event_type: 'cron_outbound_engine',
        message: `Sincronización exitosa de ${campaigns.length} motores de captación de tráfico.`,
        created_at: new Date().toISOString()
      });

    return Response.json({ 
      success: true, 
      message: `Motores sincronizados correctamente de forma nativa. Procesadas ${campaigns.length} campañas.` 
    });

  } catch (error: any) {
    console.error('Error crítico en el motor de captación:', error);
    return Response.json(
      { success: false, error: error.message || 'Error interno del servidor en los motores.' },
      { status: 500 }
    );
  }
}
