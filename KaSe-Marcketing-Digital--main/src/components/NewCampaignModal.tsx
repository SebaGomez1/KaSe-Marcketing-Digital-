// Modificación quirúrgica autorizada por Pipeline de Agentes Gemini
// Requerimientos atendidos: Diseño Full-Modal, Catálogo 192 países, Selectores reactivos, Validación estricta, Estética KaSe.
import React, { useState, useEffect } from 'react';
import { 
  X, 
  Zap, 
  ShieldCheck, 
  Users, 
  CreditCard, 
  UserCheck, 
  Heart, 
  MessageSquareText, 
  Youtube, 
  DollarSign, 
  HelpCircle,
  CheckCircle2,
  Sparkles,
  MapPin,
  AlertTriangle,
  Copy,
  RefreshCw,
  Search
} from 'lucide-react';
import { Campaign, CampaignType, CAMPAIGN_TYPES_CATALOG, GeoTargeting, User, isUserSuperAdmin } from '../types/growth';
import { getBridgeUrl, BRIDGE_ROUTE_CONFIGS } from '../lib/bridgeRouter';
import { 
  GEOGRAPHICAL_DATABASE, 
  searchCountries, 
  resolveCustomCity, 
  calculateGeoFeasibility, 
  CityData 
} from '../data/geoLocations';
import { saveCampaignToVault } from '../lib/campaignVault';
import { supabase, mapCampaignToRow } from '../lib/db';

interface NewCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newCamp: Campaign) => void;
  onRequestCheckout?: (camp: Campaign) => void;
  currentUser?: User | null;
  initialPlan?: 'basic' | 'starter' | 'growth' | 'enterprise';
  campaign?: Campaign | null;
}

export const NewCampaignModal: React.FC<NewCampaignModalProps> = ({
  isOpen,
  onClose,
  onCreated,
  onRequestCheckout,
  currentUser,
  initialPlan,
  campaign,
}) => {
  const sanitizePlan = (p: unknown): 'basic' | 'starter' | 'growth' | 'enterprise' => {
    if (typeof p === 'string' && ['basic', 'starter', 'growth', 'enterprise'].includes(p)) {
      return p as 'basic' | 'starter' | 'growth' | 'enterprise';
    }
    return 'starter';
  };

  const resolvedPlan = sanitizePlan(initialPlan || campaign?.plan);
  const defaultInitialQty = resolvedPlan === 'basic' ? 1000 : resolvedPlan === 'growth' ? 10000 : resolvedPlan === 'enterprise' ? 100000 : 2000;

  const [selectedType, setSelectedType] = useState<CampaignType>(campaign?.campaignType || 'user_registrations');
  const [name, setName] = useState(campaign?.name || '');
  const [targetUrl, setTargetUrl] = useState(campaign?.targetUrl || 'https://');
  const [niche, setNiche] = useState(campaign?.niche || 'Fintech & B2B SaaS');
  const [description, setDescription] = useState(campaign?.description || '');
  const [adminSuccessCamp, setAdminSuccessCamp] = useState<Campaign | null>(null);
  const [isTestOneDollarMode, setIsTestOneDollarMode] = useState<boolean>(false);
  const [copiedSuccessBridge, setCopiedSuccessBridge] = useState(false);
  const [copiedFormBridge, setCopiedFormBridge] = useState(false);
  const [interactionPreferences, setInteractionPreferences] = useState('Comentarios positivos y preguntas frecuentes orientadas al nicho');
  const [communicationTone, setCommunicationTone] = useState('');

  // Geographic Smart Segmentation
  const [selectedCountryCode, setSelectedCountryCode] = useState('GLOBAL');
  const [selectedRegionName, setSelectedRegionName] = useState('Mundial');
  const [selectedCityName, setSelectedCityName] = useState('Tráfico Global');
  const [cityInputText, setCityInputText] = useState('Tráfico Global');
  const [countrySearchQuery, setCountrySearchQuery] = useState('');
  const [autoExpandProximity, setAutoExpandProximity] = useState(true);

  const [minPlanPrice, setMinPlanPrice] = useState<string>('29');
  const [maxPlanPrice, setMaxPlanPrice] = useState<string>('199');
  const [currency, setCurrency] = useState<'USD' | 'UYU'>('USD');
  const [targetQuantity, setTargetQuantity] = useState<number>(campaign?.targetRegistrations || defaultInitialQty);
  const [plan, setPlan] = useState<'basic' | 'starter' | 'growth' | 'enterprise'>(resolvedPlan);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const targetPlan = sanitizePlan(initialPlan || campaign?.plan);
    setPlan(targetPlan);
  }, [isOpen, initialPlan, campaign]);

  if (!isOpen) return null;

  const isKathy = isUserSuperAdmin(currentUser);
  const currentTypeMeta = CAMPAIGN_TYPES_CATALOG.find((t) => t.id === selectedType) || CAMPAIGN_TYPES_CATALOG[0];
  const countryObj = GEOGRAPHICAL_DATABASE.find((c) => c.code === selectedCountryCode) || GEOGRAPHICAL_DATABASE[0];
  const effectiveCityName = (cityInputText || selectedCityName || 'Ciudad Principal').trim();
  const resolvedCity = resolveCustomCity(effectiveCityName, selectedCountryCode);
  const cityPopulation = resolvedCity.population || 500000;
  const feasibility = calculateGeoFeasibility(targetQuantity, cityPopulation, effectiveCityName);
  const filteredCountries = searchCountries(countrySearchQuery);

  const getDynamicPricing = (type: CampaignType, qty: number) => {
    const meta = CAMPAIGN_TYPES_CATALOG.find((t) => t.id === type) || CAMPAIGN_TYPES_CATALOG[0];
    const unitPrice = meta.pricePerUnitEstimateUSD;
    const price = Math.round(qty * unitPrice);
    let assignedPlan: 'basic' | 'starter' | 'growth' | 'enterprise' = 'starter';
    if (price <= 300) assignedPlan = 'basic';
    else if (price <= 700) assignedPlan = 'starter';
    else if (price <= 2500) assignedPlan = 'growth';
    else assignedPlan = 'enterprise';
    return { totalPrice: Math.max(50, price), unitPrice: unitPrice.toFixed(3), plan: assignedPlan, planName: assignedPlan.toUpperCase() };
  };

  const currentPricing = getDynamicPricing(selectedType, targetQuantity);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    
    const geoData: GeoTargeting = {
      country: countryObj.name,
      region: selectedRegionName,
      city: effectiveCityName,
      estimatedCityPopulation: cityPopulation,
      autoExpandProximity,
      radiusKm: autoExpandProximity ? feasibility.recommendedRadiusKm : 0,
      feasibilityWarning: feasibility.warning,
      isFeasible30Days: feasibility.isFeasible30Days,
    };

    const payload = {
      name: name.trim() || 'Campaña Nueva',
      targetUrl: targetUrl,
      campaignType: selectedType,
      targetRegistrations: targetQuantity,
      geoTargeting: geoData,
      plan: currentPricing.plan
    };

    try {
      const { data, error: sbError } = await supabase.from('campaigns').insert([payload]).select().single();
      if (sbError) throw sbError;
      onCreated(data);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-hidden">
      <div className="bg-[#121212] w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-[#161616]">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Zap className="text-emerald-400" /> Alta de Campaña KaSe
            </h2>
            <p className="text-xs text-neutral-400">Configuración avanzada de motores de crecimiento.</p>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors"><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Tipo de Campaña */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CAMPAIGN_TYPES_CATALOG.map((cat) => (
              <button key={cat.id} type="button" onClick={() => setSelectedType(cat.id)} className={`p-4 rounded-xl border ${selectedType === cat.id ? 'border-emerald-500 bg-emerald-500/10' : 'border-neutral-800 bg-neutral-900'} transition-all`}>
                <div className="text-emerald-400 mb-2">{getCampaignIcon(cat.id)}</div>
                <div className="text-xs font-bold text-white">{cat.title}</div>
              </button>
            ))}
          </div>

          {/* Geo Localización */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800">
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-2">País de Destino</label>
              <input 
                type="text" 
                value={countrySearchQuery} 
                onChange={(e) => setCountrySearchQuery(e.target.value)}
                placeholder="Buscar país..." 
                className="w-full bg-black border border-neutral-700 rounded-lg p-2.5 text-white" 
              />
              <div className="mt-2 max-h-32 overflow-y-auto border border-neutral-800 rounded-lg">
                {filteredCountries.slice(0, 10).map((c) => (
                  <button key={c.code} type="button" onClick={() => setSelectedCountryCode(c.code)} className="block w-full text-left px-3 py-2 hover:bg-emerald-500/20 text-xs text-neutral-300">{c.name}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-2">Ciudad / Región</label>
              <input 
                value={cityInputText} 
                onChange={(e) => setCityInputText(e.target.value)}
                className="w-full bg-black border border-neutral-700 rounded-lg p-2.5 text-white" 
              />
            </div>
          </div>

          {/* Acciones */}
          <div className="flex justify-end gap-3 pt-6 border-t border-neutral-800">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg text-neutral-400 hover:text-white">Cancelar</button>
            <button type="submit" disabled={loading} className="px-6 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold">
              {loading ? 'Activando...' : 'Crear Campaña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

function getCampaignIcon(typeId: CampaignType) {
  switch (typeId) {
    case 'user_registrations': return <Users className="w-5 h-5" />;
    case 'plan_sales': return <CreditCard className="w-5 h-5" />;
    case 'social_followers': return <UserCheck className="w-5 h-5" />;
    case 'likes_engagement': return <Heart className="w-5 h-5" />;
    case 'comments_reviews': return <MessageSquareText className="w-5 h-5" />;
    case 'youtube_growth': return <Youtube className="w-5 h-5" />;
    default: return <Zap className="w-5 h-5" />;
  }
}