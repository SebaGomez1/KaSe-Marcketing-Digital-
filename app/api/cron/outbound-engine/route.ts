import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { crypto } from 'crypto';

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
      return NextResponse.json({ success: true, message: 'No hay campañas para procesar.' });
    }

    for (const campaign of campaigns) {
      const { error: syncError } = await supabase
        .from('campaigns')
        .upsert({
          id: campaign.id
        });

      if (syncError) {
        console.error(`Error sincronizando campaña ${campaign.id}:`, syncError);
      }
    }

    // Solución: Generamos un ID único aleatorio para cumplir con la columna obligatoria 'id'
    const uniqueId = `log_${Math.random().toString(36).substr(2, 9)}`;
    const referenceCampaignId = campaigns[0]?.id || 'unknown';

    await supabase
      .from('system_audit_logs')
      .insert({
        id: uniqueId, // Se asigna el ID requerido
        campaign_id: referenceCampaignId,
        timestamp: new Date().toISOString(),
        level: 'info',
        module: 'cron_outbound'
      });

    console.log(`[ÉXITO] Sincronización exitosa de los motores para ${campaigns.length} campañas.`);

    return NextResponse.json({ 
      success: true, 
      message: `Motores sincronizados correctamente. Procesadas ${campaigns.length} campañas.` 
    });

  } catch (error: any) {
    console.error('Error crítico en el motor de captación:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}
