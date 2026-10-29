import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL || 
  process.env.VITE_SUPABASE_URL || 
  '';
const supabaseAnonKey = 
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.VITE_SUPABASE_ANON_KEY || 
  '';

const supabase = createClient(
  supabaseUrl || 'https://kase-storage.supabase.co', 
  supabaseAnonKey || 'placeholder-anon-key'
);

// Objeto NextResponse compatible para Next.js y Vercel Serverless
const NextResponse = {
  json: (body: any, init?: { status?: number; headers?: Record<string, string> }) => {
    return new Response(JSON.stringify(body), {
      status: init?.status ?? 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        Pragma: 'no-cache',
        Expires: '0',
        ...(init?.headers || {}),
      },
    });
  },
};

export async function GET(request: Request) {
  try {
    // Forzar respuesta exitosa 200 OK eliminando cualquier dependencia de caché local (evita error 304)
    const response = NextResponse.json({ success: true, message: "Sincronización en la nube activa" }, { status: 200 });
    
    // Desactivar caché de Vercel de forma estricta para evitar estados 304
    response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
    return response;
  } catch (err: any) {
    return NextResponse.json({ error: 'SYNC_ERROR', details: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, campaigns } = body;

    if (!userId) return NextResponse.json({ error: 'Falta userId' }, { status: 400 });

    // Si el cliente envía datos, sincronizarlos directamente en la tabla remota de Supabase
    if (campaigns && campaigns.length > 0) {
      const { error } = await supabase
        .from('campaigns')
        .upsert(campaigns.map((c: any) => ({ ...c, user_id: userId })), { onConflict: 'id' });
        
      if (error) throw error;
    }

    return NextResponse.json({ success: true, syncedCount: campaigns?.length || 0 }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: 'SYNC_FAILED', details: err.message }, { status: 500 });
  }
}

export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'GET') {
    return res.status(200).json({ success: true, message: 'Sincronización en la nube activa' });
  }

  if (req.method === 'POST') {
    try {
      const { userId, campaigns } = req.body || {};
      if (!userId) return res.status(400).json({ error: 'Falta userId' });

      if (campaigns && campaigns.length > 0) {
        const { error } = await supabase
          .from('campaigns')
          .upsert(campaigns.map((c: any) => ({ ...c, user_id: userId })), { onConflict: 'id' });
        if (error) throw error;
      }

      return res.status(200).json({ success: true, syncedCount: campaigns?.length || 0 });
    } catch (err: any) {
      return res.status(500).json({ error: 'SYNC_FAILED', details: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
