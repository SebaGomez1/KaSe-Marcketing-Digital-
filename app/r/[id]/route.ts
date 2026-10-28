import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../src/lib/db';

export const runtime = 'edge';

// Caché en memoria de borde para mitigar bloqueos y consultas repetidas
const targetUrlCache = new Map<string, { url: string; cachedAt: number }>();
const CACHE_TTL_MS = 60000; // 60 segundos de caché por campaña

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(context.params);
    const campaignId = (resolvedParams?.id || '').trim();

    if (!campaignId) {
      return NextResponse.redirect(new URL('/', req.url), 302);
    }

    // ====================================================================
    // INSTRUCCIÓN 3: VALIDACIÓN DE CABECERAS Y MITIGACIÓN DE BUCLES / DUPLICADOS
    // ====================================================================
    const reqHost = req.headers.get('x-forwarded-host') || req.headers.get('host') || '';
    const reqReferer = req.headers.get('referer') || '';
    const userAgent = req.headers.get('user-agent') || '';
    const isPrefetch = req.headers.get('purpose') === 'prefetch' || req.headers.get('x-purpose') === 'preview';
    const isLoopDetected = reqReferer.includes(`/r/${campaignId}`);

    // Detección de IP en Edge
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
               req.headers.get('x-real-ip') || 
               '185.12.***.***';
    const cleanIp = ip.toLowerCase().replace(/^::ffff:/, '').trim();
    const isLocal = cleanIp === '127.0.0.1' || cleanIp === '::1' || cleanIp === 'localhost' || cleanIp.startsWith('127.') || cleanIp === '0.0.0.0';
    const ipMasked = ip.replace(/:\d+$/, ':***');

    // REQUERIMIENTO 3: Identificar motor de búsqueda y plataforma de procedencia / UTMs
    const urlObj = new URL(req.url);
    const utmSource = urlObj.searchParams.get('utm_source') || '';
    const utmMedium = urlObj.searchParams.get('utm_medium') || '';
    const utmCampaign = urlObj.searchParams.get('utm_campaign') || '';

    const refLower = reqReferer.toLowerCase();
    let origen_motor = 'directo / no_detectado';
    if (refLower.includes('google.') || refLower.includes('google/')) origen_motor = 'google';
    else if (refLower.includes('bing.')) origen_motor = 'bing';
    else if (refLower.includes('yahoo.')) origen_motor = 'yahoo';
    else if (refLower.includes('duckduckgo.')) origen_motor = 'duckduckgo';
    else if (refLower.includes('ecosia.')) origen_motor = 'ecosia';
    else if (refLower.includes('baidu.')) origen_motor = 'baidu';
    else if (refLower.includes('yandex.')) origen_motor = 'yandex';
    else origen_motor = 'no_motor';

    const utmParts = [];
    if (utmSource) utmParts.push(`utm_source=${utmSource}`);
    if (utmMedium) utmParts.push(`utm_medium=${utmMedium}`);
    if (utmCampaign) utmParts.push(`utm_campaign=${utmCampaign}`);

    let plataforma_atraccion = utmParts.length > 0 ? utmParts.join('&') : 'organico_directo';
    if (utmParts.length === 0) {
      if (refLower.includes('facebook.') || refLower.includes('fb.me')) plataforma_atraccion = 'facebook';
      else if (refLower.includes('instagram.')) plataforma_atraccion = 'instagram';
      else if (refLower.includes('twitter.') || refLower.includes('x.com') || refLower.includes('t.co')) plataforma_atraccion = 'twitter_x';
      else if (refLower.includes('linkedin.')) plataforma_atraccion = 'linkedin';
      else if (refLower.includes('tiktok.')) plataforma_atraccion = 'tiktok';
      else if (refLower.includes('youtube.')) plataforma_atraccion = 'youtube';
      else if (refLower.includes('reddit.')) plataforma_atraccion = 'reddit';
    }

    const fecha_acceso = new Date().toISOString();

    // ====================================================================
    // OBTENCIÓN RÁPIDA DE LA URL DE DESTINO (CACHÉ EDGE FIRST)
    // ====================================================================
    let destinationUrl = '/';
    const cached = targetUrlCache.get(campaignId);

    if (cached && (Date.now() - cached.cachedAt) < CACHE_TTL_MS) {
      destinationUrl = cached.url;
    } else if (supabase) {
      // Búsqueda rápida para el redirect
      const { data: cRow } = await supabase
        .from('campaigns')
        .select('target_url')
        .eq('id', campaignId)
        .maybeSingle();

      if (cRow?.target_url) {
        destinationUrl = cRow.target_url;
      }

      if (destinationUrl !== '/') {
        targetUrlCache.set(campaignId, { url: destinationUrl, cachedAt: Date.now() });
      }
    }

    // Romper bucles si la URL de destino apunta a la misma ruta
    if (destinationUrl.includes(`/r/${campaignId}`) || (reqHost && destinationUrl.includes(reqHost) && destinationUrl.includes('/r/'))) {
      destinationUrl = '/';
    }

    // ====================================================================
    // INSTRUCCIÓN 1: OPERACIÓN ATÓMICA CON .rpc('increment_clicks')
    // ====================================================================
    const executeAtomicClickIncrement = async () => {
      // Omitir incremento si es un prefetch, bucle o IP local 127.0.0.1 (Requerimiento 2)
      if (isPrefetch || isLoopDetected || isLocal || !supabase) return;

      try {
        // Llamada RPC atómica nativa que actualiza contadores en un solo round-trip
        const { data: rpcResult, error } = await supabase.rpc('increment_clicks', {
          target_campaign_id: campaignId,
          client_ip: ipMasked,
          client_referrer: reqReferer || 'Enlace Puente KaSe (Edge Runtime)',
        });

        const auditLogPayload = {
          id: `log_edge_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          campaign_id: campaignId,
          timestamp: fecha_acceso,
          fecha_acceso,
          origen_motor,
          plataforma_atraccion,
          level: 'SUCCESS',
          module: 'ENRUTADOR_PUENTE_EDGE',
          message: `⚡ Enlace Puente Edge: +1 clic orgánico derivado al destino. Motor: ${origen_motor}. Plataforma: ${plataforma_atraccion}. IP: ${ipMasked}.`,
          metadata: {
            origen_motor,
            plataforma_atraccion,
            fecha_acceso,
            client_ip: ipMasked,
          },
        };

        if (error) {
          // Fallback resiliente si la función RPC aún no fue creada en el editor SQL
          await Promise.allSettled([
            supabase.from('conversions').insert({
              id: `conv_edge_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
              campaign_id: campaignId,
              campana_id: campaignId,
              timestamp: fecha_acceso,
              method: 'organic_click',
              referrer: reqReferer || 'Enlace Puente KaSe (Edge)',
              ip_masked: ipMasked,
            }),
            supabase.from('metricas_clicks').upsert({
              campana_id: campaignId,
              clics_contador: 1,
              fecha_actualizacion: fecha_acceso,
            }, { onConflict: 'campana_id' }),
            supabase.from('campaigns').update({
              status: 'active',
              paused_at: null,
            }).eq('id', campaignId),
            supabase.from('system_audit_logs').insert(auditLogPayload),
          ]);
        } else {
          await supabase.from('system_audit_logs').insert(auditLogPayload);
        }
      } catch (err) {
        console.warn('[Edge waitUntil Background Error]:', err);
      }
    };

    // ====================================================================
    // INSTRUCCIÓN 2: REDIRECCIÓN INMEDIATA (HTTP 307) Y waitUntil EN BACKGROUND
    // ====================================================================
    const redirectResponse = NextResponse.redirect(destinationUrl, {
      status: 307,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'X-KaSe-Bridge': 'Edge-Optimized-v2',
      },
    });

    // Ejecutar incremento atómico en segundo plano mediante event.waitUntil
    const anyContext = context as any;
    if (typeof anyContext?.waitUntil === 'function') {
      anyContext.waitUntil(executeAtomicClickIncrement());
    } else {
      // En entornos donde waitUntil no está expuesto en context, no bloquear la respuesta
      executeAtomicClickIncrement().catch(() => {});
    }

    return redirectResponse;
  } catch (error) {
    return NextResponse.redirect(new URL('/', req.url), 302);
  }
}
