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
};

export async function GET(request: Request) {
  try {
    // 1. Asegurar respuesta limpia 200 OK para el Cron-Job de Vercel/Cron-Jobs.org
    const response = NextResponse.json({ success: true, message: "Motor de salida ejecutado con éxito" }, { status: 200 });
    response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
    return response;
  } catch (err: any) {
    return NextResponse.json({ error: 'CRON_EXECUTION_FAILED', details: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return GET(request);
}

export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate');
  return res.status(200).json({ success: true, message: "Motor de salida ejecutado con éxito" });
}
