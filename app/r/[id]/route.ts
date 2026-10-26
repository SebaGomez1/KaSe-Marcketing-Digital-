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
    const ipMasked = ip.replace(/:\d+$/, ':***');

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
      // Omitir incremento si es un prefetch automático del navegador o bucle de recarga inmediata
      if (isPrefetch || isLoopDetected || !supabase) return;

      try {
        // Llamada RPC atómica nativa que actualiza contadores en un solo round-trip
        const { data: rpcResult, error } = await supabase.rpc('increment_clicks', {
          target_campaign_id: campaignId,
          client_ip: ipMasked,
          client_referrer: reqReferer || 'Enlace Puente KaSe (Edge Runtime)',
        });

        if (error) {
          // Fallback resiliente si la función RPC aún no fue creada en el editor SQL
          await Promise.allSettled([
            supabase.from('conversions').insert({
              id: `conv_edge_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
              campaign_id: campaignId,
              campana_id: campaignId,
              timestamp: new Date().toISOString(),
              method: 'organic_click',
              referrer: reqReferer || 'Enlace Puente KaSe (Edge)',
              ip_masked: ipMasked,
            }),
            supabase.from('metricas_clicks').upsert({
              campana_id: campaignId,
              clics_contador: 1,
              fecha_actualizacion: new Date().toISOString(),
            }, { onConflict: 'campana_id' }),
            supabase.from('campaigns').update({
              updated_at: new Date().toISOString(),
            }).eq('id', campaignId)
          ]);
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
