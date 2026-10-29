import { createClient } from '@supabase/supabase-js';

// Inicializar el cliente de Supabase del lado del servidor de Vercel
const supabaseUrl = 
  process.env.SUPABASE_URL || 
  process.env.NEXT_PUBLIC_SUPABASE_URL || 
  process.env.VITE_SUPABASE_URL || 
  '';
const supabaseAnonKey = 
  process.env.SUPABASE_SERVICE_ROLE_KEY || 
  process.env.SUPABASE_SERVICE_KEY || 
  process.env.SUPABASE_ANON_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.VITE_SUPABASE_ANON_KEY || 
  '';

const supabase = createClient(supabaseUrl || 'https://kase-storage.supabase.co', supabaseAnonKey || 'placeholder-anon-key');

// Objeto compatible con NextResponse para Vercel Serverless / Edge
const NextResponse = {
  json: (body: any, init?: { status?: number; headers?: Record<string, string> }) => {
    return new Response(JSON.stringify(body), {
      status: init?.status ?? 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
        ...(init?.headers || {}),
      },
    });
  },
};

export async function GET(request: Request | any, response?: any) {
  try {
    // Soporte para entorno Node.js Serverless de Vercel (req, res)
    if (response && typeof response.status === 'function') {
      const userId = request.query?.userId || request.query?.user_id;

      let query = supabase.from('campaigns').select('*');
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data: campaigns, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;

      return response.status(200).json(campaigns || []);
    }

    // Soporte para Web Standard Request (Vercel Edge / Next.js)
    let userId: string | null = null;
    if (request?.url) {
      const { searchParams } = new URL(request.url, 'http://localhost');
      userId = searchParams.get('userId') || searchParams.get('user_id');
    }

    let query = supabase.from('campaigns').select('*');
    
    if (userId) {
      query = query.eq('user_id', userId);
    }

    // Traer los datos reales desde internet
    const { data: campaigns, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    // Responder con éxito 200 OK de forma segura
    return NextResponse.json(campaigns || [], { status: 200 });

  } catch (err: any) {
    console.error("Error crítico en API de campañas:", err.message);
    if (response && typeof response.status === 'function') {
      return response.status(500).json({ 
        error: 'SERVER_API_ERROR', 
        details: err.message 
      });
    }
    return NextResponse.json({ 
      error: 'SERVER_API_ERROR', 
      details: err.message 
    }, { status: 500 });
  }
}

export default GET;
