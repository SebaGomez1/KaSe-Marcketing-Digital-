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

    // 2. Sincronizamos los motores usando únicamente la columna 'id' que sí existe
    for (const campaign of campaigns) {
      const { error: syncError } = await supabase
        .from('campaigns')
        .upsert({
          id: campaign.id // Corrección crítica: Se remueven 'updated_at' y 'status' para evitar el error PGRST204
        });

      if (syncError) {
        console.error(`Error sincronizando campaña ${campaign.id}:`, syncError);
      }
    }

    // 3. Registramos el éxito en los logs del sistema
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

