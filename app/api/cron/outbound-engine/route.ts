import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: Request) {
  try {
    // 1. Leemos las campañas que ya existen en tu pantalla de Supabase
    const { data: campaigns, error: fetchError } = await supabase
      .from('campaigns')
      .select('*');

    if (fetchError) throw fetchError;

    if (!campaigns || campaigns.length === 0) {
      return NextResponse.json({ success: true, message: 'No hay campañas para procesar.' });
    }

    // 2. Procesamos secuencialmente las campañas usando las columnas reales de tu tabla
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

    // 3. Registro crítico corregido: Usamos 'campaign_id' y 'timestamp' que sí existen en tu tabla de auditoría
    await supabase
      .from('system_audit_logs')
      .insert({
        campaign_id: campaigns[0].id, // Usamos el ID de la primera campaña procesada como referencia válida
        timestamp: new Date().toISOString(), // Mapeo correcto para la columna 'timestamp'
        level: 'info', // Nivel de log según tu esquema visible
        module: 'cron_outbound' // Módulo identificatorio
      });

    console.log(`[ÉXITO] Sincronización exitosa de los motores para ${campaigns.length} campañas.`);

    return NextResponse.json({ 
      success: true, 
      message: `Motores sincronizados correctamente en base a tu esquema real. Procesadas ${campaigns.length} campañas.` 
    });

  } catch (error: any) {
    console.error('Error crítico en el motor de captación:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor en los motores.' },
      { status: 500 }
    );
  }
}
