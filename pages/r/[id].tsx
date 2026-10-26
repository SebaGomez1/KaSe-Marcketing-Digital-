import { GetServerSideProps } from 'next';
import { supabase, handleBridgeInterceptionDirectSupabase } from '../../src/lib/db';

interface BridgePageProps {
  redirectUrl: string;
  campaignId: string;
}

export const getServerSideProps: GetServerSideProps<BridgePageProps> = async (context) => {
  const { id } = context.params || {};
  const campaignId = (Array.isArray(id) ? id[0] : id) || '';

  if (!campaignId) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const rawRef = context.req.headers['referer'] || (context.query.ref as string) || 'Enlace Puente KaSe (Orgánico)';
  const referrer = Array.isArray(rawRef) ? rawRef[0] : rawRef;
  const ip = (context.req.headers['x-forwarded-for'] as string) || context.req.socket?.remoteAddress || '185.12.***.***';
  const ipMasked = ip ? ip.split(',')[0].trim().replace(/:\d+$/, ':***') : '185.12.***.***';

  // 1. Reemplazo de JSON fs por consulta SQL directa en Supabase
  // 2. Intercepta el parámetro de campaña y guarda el registro asociándolo estrictamente a 'user_id' o 'campana_id'
  const result = await handleBridgeInterceptionDirectSupabase(campaignId, referrer, ipMasked);

  if (result.success && result.redirectUrl) {
    return {
      redirect: {
        destination: result.redirectUrl,
        statusCode: 307,
      },
    };
  }

  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
};

export default function BridgeRedirectPage({ redirectUrl, campaignId }: BridgePageProps) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0a', color: '#fff', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>Redirigiendo a través del Enlace Puente Inteligente...</p>
        <p style={{ color: '#888', fontSize: '0.875rem' }}>ID Campaña: {campaignId}</p>
        {redirectUrl && (
          <a href={redirectUrl} style={{ color: '#10b981', textDecoration: 'underline', marginTop: '1rem', display: 'inline-block' }}>
            Haga clic aquí si no es redirigido automáticamente
          </a>
        )}
      </div>
    </div>
  );
}
