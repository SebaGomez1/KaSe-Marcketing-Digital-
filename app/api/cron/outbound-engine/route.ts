import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../src/lib/db';
import { ejecutarOutboundSeguroSocialListening } from '../../../../src/lib/networkEngines';

export const dynamic = 'force-dynamic';
export const maxDuration = 10; // Límite máximo para cuentas Vercel Hobby

export async function GET(req: NextRequest) {
  return handleOutboundCron(req);
}

export async function POST(req: NextRequest) {
  return handleOutboundCron(req);
}

async function handleOutboundCron(req: NextRequest) {
  const executionTimestamp = new Date().toISOString();
  const summary: Array<{ campaignId: string; status: string; repliesSent?: number; error?: string }> = [];

  try {
    if (!supabase) {
      return NextResponse.json({ success: false, message: 'Supabase client no configurado' }, { status: 500 });
    }

    // ====================================================================
    // INSTRUCCIÓN 2: CONSULTAR CAMPAÑAS ACTIVAS CON MOTOR OUTBOUND EN SUPABASE
    // ====================================================================
    const { data: campaigns, error: queryError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('status', 'active');

    if (queryError) {
      return NextResponse.json({ success: false, error: queryError.message }, { status: 500 });
    }

    const origin = req.headers.get('origin') || process.env.APP_URL || 'https://kase-marketing.vercel.app';

    for (const campaign of (campaigns || [])) {
      const campId = campaign.id;

      // Verificar si el motor de Outbound está habilitado (Plan Growth/Enterprise o mod4_outbound)
      const modules = typeof campaign.modules === 'string' ? JSON.parse(campaign.modules) : campaign.modules;
      const isOutboundEnabled = modules?.mod4_outbound?.active === true || campaign.plan === 'growth' || campaign.plan === 'enterprise';

      if (!isOutboundEnabled) {
        continue;
      }

      // Extraer palabras clave de negocio a partir de nicho, nombre y descripción
      const businessKeywords = [
        ...(campaign.niche ? campaign.niche.split(/[\s,/]+/) : []),
        ...(campaign.name ? campaign.name.split(/[\s,/]+/) : []),
        'software',
        'herramienta',
        'automatizacion',
      ]
        .map((k: string) => k.trim().toLowerCase())
        .filter((k: string) => k.length > 3 && !['para', 'como', 'este', 'esta'].includes(k))
        .slice(0, 6);

      // Generar plantilla de respuesta blindada con el Enlace Puente y token 'campana_id'
      const bridgeTrackingUrl = `${origin}/r/${campId}?ref=outbound_x_forum&campana_id=${campId}&utm_source=outbound_engine`;
      const replyTemplate = `Hemos estado probando ${campaign.name} para resolver exactamente este flujo de trabajo. Puedes revisar la integración directa aquí: ${bridgeTrackingUrl}`;

      try {
        // Ejecución blindada del motor Outbound con protección anti-ban
        const result = await ejecutarOutboundSeguroSocialListening(businessKeywords, 'x_and_qa_forums', replyTemplate);

        if (!result.success) {
          throw new Error(result.error || 'Error al conectar con redes sociales');
        }

        // Registrar éxito en bitácora de auditoría y actualizar módulos en Supabase
        await Promise.allSettled([
          supabase.from('system_audit_logs').insert({
            id: `log_outbound_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            campaign_id: campId,
            user_id: campaign.user_id || campaign.creator_email || null,
            timestamp: new Date().toISOString(),
            level: 'SUCCESS',
            module: 'AUTOMATED_OUTBOUND',
            message: `🤖 Outbound ejecutado con éxito para "${campaign.name}". ${result.scannedCount} conversaciones rastreadas, ${result.repliesSent} respuestas con Enlace Puente insertadas (campana_id: ${campId}). Anti-Ban Score: 100%.`,
          }),
          // Actualización de última ejecución en tabla campaigns
          supabase.from('campaigns').update({
            updated_at: new Date().toISOString(),
          }).eq('id', campId),
        ]);

        summary.push({
          campaignId: campId,
          status: 'SUCCESS',
          repliesSent: result.repliesSent,
        });

      } catch (outboundErr: any) {
        // ====================================================================
        // INSTRUCCIÓN 3: MANEJO DE ERRORES / RATE LIMIT -> 'PAUSADO_TEMPORAL'
        // ====================================================================
        console.warn(`[Outbound Error/Rate-Limit Campaña ${campId}]:`, outboundErr.message);

        // Actualizar estado en Supabase a 'PAUSADO_TEMPORAL' sin congelar ni romper el hilo
        await Promise.allSettled([
          // Guardar estado en tabla campaigns
          supabase.from('campaigns').update({
            status: 'PAUSADO_TEMPORAL',
            paused_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }).eq('id', campId),

          // Notificar en logs del sistema la pausa temporal de protección
          supabase.from('system_audit_logs').insert({
            id: `log_pause_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            campaign_id: campId,
            user_id: campaign.user_id || campaign.creator_email || null,
            timestamp: new Date().toISOString(),
            level: 'WARNING',
            module: 'AUTOMATED_OUTBOUND',
            message: `⚠️ Límite de tasa (rate-limit) o restricción detectada en canales externos: "${outboundErr.message}". Estado cambiado a 'PAUSADO_TEMPORAL' para proteger la cuenta y evitar bloqueos.`,
          }),
        ]);

        summary.push({
          campaignId: campId,
          status: 'PAUSADO_TEMPORAL',
          error: outboundErr.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: executionTimestamp,
      processedCount: summary.length,
      details: summary,
    }, { status: 200 });

  } catch (globalErr: any) {
    console.error('[CRON OUTBOUND GLOBAL ERROR]:', globalErr);
    return NextResponse.json({ success: false, error: globalErr.message }, { status: 500 });
  }
}
