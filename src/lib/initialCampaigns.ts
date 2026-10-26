import { Campaign } from '../types/growth';

// Lista oficial de IDs de campañas simuladas/falsas que han sido purgadas permanentemente
export const FAKE_MOCK_CAMPAIGN_IDS: string[] = [
  'kase_camp_finpulse',
  'kase_camp_78a1bc',
  'kase_camp_sales99',
  'kase_camp_yt88',
  'kase_camp_social04',
  'kase_camp_reviews06',
];

export function isFakeCampaign(campOrId: Campaign | string | undefined | null): boolean {
  if (!campOrId) return false;
  const id = typeof campOrId === 'string' ? campOrId : campOrId.id;
  if (!id) return false;
  if (FAKE_MOCK_CAMPAIGN_IDS.includes(id)) return true;
  // Validar también por URLs de prueba conocidas de las campañas falsas
  if (typeof campOrId !== 'string') {
    const url = campOrId.targetUrl || '';
    if (url.includes('finpulse.uy') || url.includes('pulseflow.app') || url.includes('educraft.lat') || url.includes('fitsync.fit') || url.includes('devmentor.ai') || url.includes('localgourmet.uy')) {
      return true;
    }
  }
  return false;
}

// Inicialización limpia: CERO campañas falsas o de mentira.
// La suite arranca 100% limpia para registrar únicamente campañas reales creadas por los usuarios.
export const INITIAL_PRODUCTION_CAMPAIGNS: Campaign[] = [];
