import { redirect } from 'next/navigation';
import { handleBridgeInterceptionDirectSupabase } from '../../../src/lib/db';

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined };
}

export default async function BridgeAppRouterPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const campaignId = resolvedParams?.id || '';

  if (!campaignId) {
    redirect('/');
  }

  // Intercepta el ID de la campaña y guarda el registro asociándolo a campana_id y user_id en Supabase
  const result = await handleBridgeInterceptionDirectSupabase(campaignId, 'Enlace Puente KaSe (Next.js App Router)');

  if (result.success && result.redirectUrl) {
    redirect(result.redirectUrl);
  }

  redirect('/');
}
