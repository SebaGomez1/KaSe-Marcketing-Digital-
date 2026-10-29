import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kase-storage.supabase.co', 
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
);

// Objeto NextResponse universal para compatibilidad con Vercel
const NextResponse = {
  json: (body: any, init?: { status?: number; headers?: Record<string, string> }) => {
    return new Response(JSON.stringify(body), {
      status: init?.status ?? 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
        ...(init?.headers || {}),
      },
    });
  },
  redirect: (url: URL | string, status = 307) => {
    const destination = typeof url === 'string' ? url : url.toString();
    return new Response(null, {
      status,
      headers: {
        Location: destination,
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
      },
    });
  },
};

export async function GET(request: Request, context: { params: { id: string } | Promise<{ id: string }> }) {
  try {
    // Extraer el ID de forma segura controlando la estructura dinámica de Next.js
    const resolvedParams = await Promise.resolve(context?.params);
    const id = resolvedParams?.id;
    if (!id) return NextResponse.json({ error: 'Falta ID de campaña' }, { status: 400 });

    // Buscar la campaña real en Supabase para el enrutamiento limpio
    const { data: campaign, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !campaign) {
      console.error(`Puente fallido: Campaña con ID ${id} no encontrada.`);
      return NextResponse.json({ error: 'Enlace de puente no encontrado o expirado' }, { status: 404 });
    }

    // Redirección directa al destino real de la campaña con estado 200/307 seguro
    let destinationUrl = (campaign.target_url || campaign.targetUrl || campaign.destination || '').trim();
    if (!destinationUrl) {
      destinationUrl = '/';
    } else if (!destinationUrl.startsWith('http://') && !destinationUrl.startsWith('https://')) {
      destinationUrl = `https://${destinationUrl}`;
    }

    return NextResponse.redirect(new URL(destinationUrl, request.url));

  } catch (err: any) {
    console.error("Fallo crítico en invocación del puente:", err.message);
    return NextResponse.json({ error: 'FUNCTION_INVOCATION_FAILED', details: err.message }, { status: 500 });
  }
}

export default async function handler(req: any, res: any) {
  try {
    const id = req.query?.id || req.params?.id;
    if (!id) return res.status(400).json({ error: 'Falta ID de campaña' });

    const { data: campaign, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !campaign) {
      return res.status(404).json({ error: 'Enlace de puente no encontrado o expirado' });
    }

    let destinationUrl = (campaign.target_url || campaign.targetUrl || campaign.destination || '').trim();
    if (!destinationUrl) {
      destinationUrl = '/';
    } else if (!destinationUrl.startsWith('http://') && !destinationUrl.startsWith('https://')) {
      destinationUrl = `https://${destinationUrl}`;
    }

    res.setHeader('Location', destinationUrl);
    res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate');
    return res.redirect(307, destinationUrl);
  } catch (err: any) {
    return res.status(500).json({ error: 'FUNCTION_INVOCATION_FAILED', details: err.message });
  }
}
