import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../src/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const body = await req.json().catch(() => ({}));

    // 1. Extraer ID de la notificación y tipo de evento
    const paymentId =
      body?.data?.id ||
      searchParams.get('data.id') ||
      searchParams.get('id') ||
      body?.id;

    const eventType =
      body?.type ||
      searchParams.get('type') ||
      body?.action ||
      searchParams.get('topic');

    const isPaymentNotification =
      eventType === 'payment' ||
      eventType === 'payment.created' ||
      eventType === 'payment.updated' ||
      Boolean(paymentId);

    if (!isPaymentNotification || !paymentId) {
      return NextResponse.json({ received: true, ignored: true }, { status: 200 });
    }

    // 2. Consultar detalles del pago usando estrictamente la variable de entorno del backend
    const mpAccessToken = (process.env.MERCADO_PAGO_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN || '').trim();
    let paymentData: any = null;

    if (mpAccessToken) {
      const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${mpAccessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (mpRes.ok) {
        paymentData = await mpRes.json();
      }
    }

    // Verificar si el pago fue aprobado
    const paymentStatus = paymentData?.status || body?.status || (body?.action === 'payment.created' ? 'approved' : null);
    if (paymentStatus !== 'approved') {
      return NextResponse.json({ received: true, status: paymentStatus || 'pending' }, { status: 200 });
    }

    // Identificar ID de la campaña desde external_reference o metadata
    const campaignId =
      paymentData?.external_reference ||
      paymentData?.metadata?.campaign_id ||
      body?.data?.external_reference ||
      body?.external_reference;

    if (!campaignId) {
      return NextResponse.json({ received: true, warning: 'missing_campaign_reference' }, { status: 200 });
    }

    // 3. Consulta SQL directa a Supabase: Actualizar a 'ACTIVA' e incrementar bloque de 50 ventas (Plan Growth)
    if (supabase) {
      const { data: campaignRow } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .maybeSingle();

      const currentSales = Number(campaignRow?.current_registrations || 0);
      const newSales = currentSales + 50; // Bloque de 50 ventas contratadas
      const nowIso = new Date().toISOString();

      await Promise.allSettled([
        // Actualizar en tabla 'campaigns'
        supabase.from('campaigns').update({
          status: 'active',
          current_registrations: newSales,
          paused_at: null,
          billing: {
            subscriptionStatus: 'active',
            paymentGateway: 'mercadopago_uy',
            lastBilledAt: nowIso,
            mpPaymentId: paymentId,
            plan: 'growth',
            salesBlock: 50,
          }).eq('id', campaignId),

        // Registro de auditoría
        supabase.from('system_audit_logs').insert({
          id: `log_mp_wh_${Date.now()}`,
          campaign_id: campaignId,
          timestamp: nowIso,
          level: 'SUCCESS',
          module: 'MERCADO_PAGO_IPN',
          message: `🎉 Pago confirmado vía Mercado Pago (ID: ${paymentId}). Campaña activada a estado ACTIVA (+50 ventas del Plan Growth acreditadas).`,
        }),
      ]);
    }

    return NextResponse.json({
      success: true,
      status: 'ACTIVA',
      campaignId,
      salesCredited: 50,
      paymentId,
    }, { status: 200 });

  } catch (error: any) {
    console.error('[Error Mercado Pago Webhook Route]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
