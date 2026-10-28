import { redirect } from 'next/navigation';
import { handleBridgeInterceptionDirectSupabase } from '../../../src/lib/db';

export const BASE_URL = 'https://ka-se-marcketing-digital.vercel.app';

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined };
}

export default async function BridgeAppRouterPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const campaignId = resolvedParams?.id || '';

  if (!campaignId) {
    redirect(`${BASE_URL}/`);
  }

  // Intercepta el ID de la campaña y guarda el registro asociándolo a campana_id y user_id en Supabase
  const result = await handleBridgeInterceptionDirectSupabase(campaignId, 'Enlace Puente KaSe (Next.js App Router)');

  if (result.success && result.redirectUrl) {
    let finalUrl = result.redirectUrl.trim();
    if (
      !finalUrl ||
      finalUrl === '/' ||
      finalUrl.includes('kase2020') ||
      finalUrl.toLowerCase().includes('kathyseba') ||
      finalUrl.toLowerCase().includes('gmail.com') ||
      !finalUrl.startsWith('http')
    ) {
      finalUrl = `${BASE_URL}/`;
    }
    redirect(finalUrl);
  }

  redirect(`${BASE_URL}/`);
}
