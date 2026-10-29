import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    if (!id) return NextResponse.json({ error: 'Falta ID' }, { status: 400 });
    // Consulta remota en tiempo real (Solución Error 500)
    const { data: campaign, error } = await supabase.from('campaigns').select('*').eq('id', id).single();
    if (error || !campaign) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    return NextResponse.redirect(new URL(campaign.target_url || campaign.destination, request.url));
  } catch (err: any) {
    return NextResponse.json({ error: 'FUNCTION_INVOCATION_FAILED', details: err.message }, { status: 500 });
  }
}
