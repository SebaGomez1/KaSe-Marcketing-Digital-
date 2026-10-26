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
  Sliders,
  Sparkles,
  ArrowRight,
  MapPin,
  AlertTriangle,
  Code2,
  Copy,
  RefreshCw,
  Globe2,
  Search
} from 'lucide-react';
import { Campaign, CampaignType, CAMPAIGN_TYPES_CATALOG, GeoTargeting, User, EngineValidationResult, isUserSuperAdmin } from '../types/growth';
import { 
  GEOGRAPHICAL_DATABASE, 
  WORLD_COUNTRIES_CATALOG, 
  searchCountries, 
  resolveCustomCity, 
  calculateGeoFeasibility, 
  CityData 
} from '../data/geoLocations';

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
  // Strict null-guards: Fallback to neutral default values if campaign or initialPlan is undefined
  const resolvedPlan = initialPlan || campaign?.plan || 'starter';
  const defaultInitialQty =
    resolvedPlan === 'basic'
      ? 1000
      : resolvedPlan === 'growth'
      ? 10000
      : resolvedPlan === 'enterprise'
      ? 100000
      : 2000;

  const [selectedType, setSelectedType] = useState<CampaignType>(campaign?.campaignType || 'user_registrations');
  const [name, setName] = useState(campaign?.name || '');
  const [targetUrl, setTargetUrl] = useState(campaign?.targetUrl || 'https://');
  const [niche, setNiche] = useState(campaign?.niche || 'Fintech & B2B SaaS');
  const [description, setDescription] = useState(campaign?.description || '');
  const [adminSuccessCamp, setAdminSuccessCamp] = useState<Campaign | null>(null);
  const [isTestOneDollarMode, setIsTestOneDollarMode] = useState<boolean>(false);

  // Engine & API Verification in Vercel State (Zero-Mock Requirement)
  const [engineValidation, setEngineValidation] = useState<EngineValidationResult | null>(null);
  const [isValidatingEngines, setIsValidatingEngines] = useState<boolean>(true);

  // Conditional Fields
  const [interactionPreferences, setInteractionPreferences] = useState('Comentarios positivos y preguntas frecuentes orientadas al nicho');
  const [communicationTone, setCommunicationTone] = useState('');

  // Geographic Smart Segmentation
  const [selectedCountryCode, setSelectedCountryCode] = useState('GLOBAL');
  const [selectedRegionName, setSelectedRegionName] = useState('Mundial');
  const [selectedCityName, setSelectedCityName] = useState('Tráfico Global Cualificado por Idioma e Intención');
  const [cityInputText, setCityInputText] = useState('Tráfico Global Cualificado por Idioma e Intención');
  const [countrySearchQuery, setCountrySearchQuery] = useState('');
  const [autoExpandProximity, setAutoExpandProximity] = useState(true);

  // Pricing Range Calibration (Strategic Intent Qualification - Only for user_registrations & plan_sales)
  const [minPlanPrice, setMinPlanPrice] = useState<string>('29');
  const [maxPlanPrice, setMaxPlanPrice] = useState<string>('199');
  const [currency, setCurrency] = useState<'USD' | 'UYU'>('USD');
  
  // Target Conversion Goal - with strict null-guards
  const [targetQuantity, setTargetQuantity] = useState<number>(campaign?.targetRegistrations || defaultInitialQty);
  const [plan, setPlan] = useState<'basic' | 'starter' | 'growth' | 'enterprise'>(resolvedPlan);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync initialPlan / campaign when modal opens with neutral fallback guards
  useEffect(() => {
    if (!isOpen) return;
    const targetPlan = initialPlan || campaign?.plan || 'starter';
    setPlan(targetPlan);
    if (campaign?.targetRegistrations) {
      setTargetQuantity(campaign.targetRegistrations);
    } else {
      if (targetPlan === 'basic') setTargetQuantity(1000);
      else if (targetPlan === 'starter') setTargetQuantity(2000);
      else if (targetPlan === 'growth') setTargetQuantity(10000);
      else if (targetPlan === 'enterprise') setTargetQuantity(100000);
      else setTargetQuantity(2000);
    }
  }, [initialPlan, campaign, isOpen]);

  // Fetch real Vercel API status for the selected plan
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setIsValidatingEngines(true);

    fetch(`/api/system/validate-engines?plan=${plan}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && data.validation) {
          setEngineValidation(data.validation);
        }
      })
      .catch((err) => console.warn('Error validating engines:', err))
      .finally(() => {
        if (isMounted) setIsValidatingEngines(false);
      });

    return () => {
      isMounted = false;
    };
  }, [plan, isOpen]);

  if (!isOpen) return null;

  const isKathy = isUserSuperAdmin(currentUser);

  if (adminSuccessCamp) {
    return (
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-neutral-900 border border-emerald-500/50 rounded-2xl p-6 sm:p-8 space-y-5 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
            🎉
          </div>
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500 text-black uppercase tracking-wider">
              Super Administrador: Activación Directa
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              ¡Campaña Activada 100% Gratis!
            </h2>
            <p className="text-xs text-neutral-300 leading-relaxed max-w-md mx-auto">
              Tu campaña <strong className="text-white">"{adminSuccessCamp.name}"</strong> está en marcha. Se han encendido los motores autónomos en segundo plano sin pasar por pasarela de pago.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/60 border border-neutral-800 text-left space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-neutral-400">Meta Contratada:</span>
              <span className="text-white font-bold">{adminSuccessCamp.targetRegistrations.toLocaleString()} {adminSuccessCamp.targetUnitLabel}</span>
            </div>
            <div className="flex justify-between border-t border-neutral-800 pt-1 text-emerald-400 font-bold">
              <span>Costo para Kathy Seba:</span>
              <span>$0.00 USD (Exención Vitalicia)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Estado de Motores:</span>
              <span className="text-emerald-400">🟢 100% OPERANDO</span>
            </div>
          </div>

          <button
            onClick={() => {
              setAdminSuccessCamp(null);
              onClose();
            }}
            className="w-full py-3 bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs rounded-lg transition-all glow-emerald cursor-pointer"
          >
            Ir al Dashboard a Ver Motores en Marcha →
          </button>
        </div>
      </div>
    );
  }

  const currentTypeMeta = CAMPAIGN_TYPES_CATALOG.find((t) => t.id === selectedType) || CAMPAIGN_TYPES_CATALOG[0];

  // Selected Country, Region & City objects
  const countryObj = GEOGRAPHICAL_DATABASE.find((c) => c.code === selectedCountryCode) || GEOGRAPHICAL_DATABASE[0];
  const regionObj = countryObj.regions.find((r) => r.name === selectedRegionName) || countryObj.regions[0];

  // Resolve custom or selected city
  const effectiveCityName = (cityInputText || selectedCityName || 'Ciudad Principal').trim();
  const resolvedCity = resolveCustomCity(effectiveCityName, selectedCountryCode);
  const cityPopulation = resolvedCity.population || 500000;
  const feasibility = calculateGeoFeasibility(targetQuantity, cityPopulation, effectiveCityName);

  // Available cities in currently selected country
  const availableCitiesInCountry: CityData[] = [];
  countryObj.regions.forEach((r) => {
    r.cities.forEach((c) => availableCitiesInCountry.push(c));
  });

  // Filtered countries based on user search query
  const filteredCountries = searchCountries(countrySearchQuery);

  // Handle Country Change
  const handleCountryChange = (code: string) => {
    setSelectedCountryCode(code);
    const country = GEOGRAPHICAL_DATABASE.find((c) => c.code === code) || GEOGRAPHICAL_DATABASE[0];
    if (country.regions.length > 0) {
      setSelectedRegionName(country.regions[0].name);
      if (country.regions[0].cities.length > 0) {
        const defCity = country.regions[0].cities[0].name;
        setSelectedCityName(defCity);
        setCityInputText(defCity);
      }
    }
  };

  // Handle Region Change
  const handleRegionChange = (rName: string) => {
    setSelectedRegionName(rName);
    const region = countryObj.regions.find((r) => r.name === rName);
    if (region && region.cities.length > 0) {
      setSelectedCityName(region.cities[0].name);
      setCityInputText(region.cities[0].name);
    }
  };

  // Handle Free City Input Change
  const handleCityInputChange = (text: string) => {
    setCityInputText(text);
    setSelectedCityName(text);
  };

  // Determine which fields to display conditionally
  const requiresPricingCalibration = selectedType === 'user_registrations' || selectedType === 'plan_sales';
  const isSocialEngagement = selectedType === 'likes_engagement';
  const isCommentsReviews = selectedType === 'comments_reviews';
  const isYouTube = selectedType === 'youtube_growth';

  // Dynamic Label for Step 2 Target URL
  const getTargetUrlLabel = () => {
    if (selectedType === 'social_followers' || selectedType === 'likes_engagement') {
      return 'URL de tu Perfil o Enlace de la Publicación *';
    }
    if (selectedType === 'comments_reviews') {
      return 'Enlace de la Publicación o URL de la Ficha de Producto *';
    }
    if (selectedType === 'youtube_growth') {
      return 'URL del Video o Canal de YouTube *';
    }
    return 'URL de Destino / Web *';
  };

  // Dynamic Label for Step 4 Goal
  const getGoalLabel = () => {
    if (selectedType === 'social_followers' || selectedType === 'likes_engagement') {
      return 'Cantidad de Seguidores / Likes que deseas contratar *';
    }
    if (selectedType === 'comments_reviews') {
      return 'Cantidad de Comentarios / Reseñas que deseas contratar *';
    }
    if (selectedType === 'youtube_growth') {
      return 'Cantidad de Reproducciones / Suscriptores que deseas contratar *';
    }
    if (selectedType === 'plan_sales') {
      return 'Cantidad de Ventas de Planes que deseas contratar *';
    }
    return 'Cantidad de Registros de Usuarios que deseas contratar *';
  };

  const getDynamicPricing = (type: CampaignType, qty: number) => {
    if (type === 'user_registrations') {
      if (qty <= 1000) {
        const unitPrice = 0.25;
        const price = Math.round(qty * unitPrice);
        return {
          totalPrice: Math.max(250, price),
          unitPrice: '0.250',
          plan: 'basic' as const,
          planName: 'Básico Económico ($250 USD - Módulos 1 a 3)',
        };
      } else if (qty <= 2000) {
        const unitPrice = 0.245;
        const price = Math.round(qty * unitPrice);
        return {
          totalPrice: price,
          unitPrice: '0.245',
          plan: 'starter' as const,
          planName: 'Starter ($490 USD - Módulos 1 a 3)',
        };
      } else if (qty <= 10000) {
        const unitPrice = 0.189;
        const price = Math.round(qty * unitPrice);
        return {
          totalPrice: price,
          unitPrice: '0.189',
          plan: 'growth' as const,
          planName: 'Growth ($1,890 USD - Módulos 1 a 5)',
        };
      } else {
        const unitPrice = 0.089;
        const price = Math.round(qty * unitPrice);
        return {
          totalPrice: price,
          unitPrice: '0.089',
          plan: 'enterprise' as const,
          planName: 'Enterprise VIP ($8,900 USD - Los 8 Módulos)',
        };
      }
    }

    if (type === 'plan_sales') {
      const unitPrice = 12.5;
      const price = Math.round(qty * unitPrice);
      let assignedPlan: 'basic' | 'starter' | 'growth' | 'enterprise' = 'starter';
      let planName = 'Starter (Módulos 1 a 3)';
      if (qty <= 20) {
        assignedPlan = 'basic';
        planName = 'Básico Económico (Módulos 1 a 3)';
      } else if (qty <= 40) {
        assignedPlan = 'starter';
        planName = 'Starter (Módulos 1 a 3)';
      } else if (qty <= 100) {
        assignedPlan = 'growth';
        planName = 'Growth (Módulos 1 a 5)';
      } else {
        assignedPlan = 'enterprise';
        planName = 'Enterprise VIP (Los 8 Módulos)';
      }
      return {
        totalPrice: Math.max(150, price),
        unitPrice: '12.50',
        plan: assignedPlan,
        planName,
      };
    }

    const meta = CAMPAIGN_TYPES_CATALOG.find((t) => t.id === type) || CAMPAIGN_TYPES_CATALOG[0];
    const unitPrice = meta.pricePerUnitEstimateUSD;
    const price = Math.round(qty * unitPrice);
    let assignedPlan: 'basic' | 'starter' | 'growth' | 'enterprise' = 'starter';
    let planName = 'Starter (Módulos 1 a 3)';
    if (price <= 300) {
      assignedPlan = 'basic';
      planName = 'Básico Económico (Módulos 1 a 3)';
    } else if (price <= 700) {
      assignedPlan = 'starter';
      planName = 'Starter (Módulos 1 a 3)';
    } else if (price <= 2500) {
      assignedPlan = 'growth';
      planName = 'Growth (Módulos 1 a 5)';
    } else {
      assignedPlan = 'enterprise';
      planName = 'Enterprise VIP (Los 8 Módulos)';
    }

    return {
      totalPrice: Math.max(50, price),
      unitPrice: unitPrice.toFixed(3),
      plan: assignedPlan,
      planName,
    };
  };

  const handleTypeSelect = (type: CampaignType) => {
    setSelectedType(type);
    const meta = CAMPAIGN_TYPES_CATALOG.find((t) => t.id === type);
    if (meta) {
      setTargetQuantity(meta.defaultTarget);
      const pricing = getDynamicPricing(type, meta.defaultTarget);
      setPlan(pricing.plan);
    }
  };

  const handleTargetChange = (val: number) => {
    setTargetQuantity(val);
    const pricing = getDynamicPricing(selectedType, val);
    setPlan(pricing.plan);
  };

  const calculateEstimate = (qty: number) => {
    return getDynamicPricing(selectedType, qty).totalPrice;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const numMin = parseFloat(String(minPlanPrice)) || 0;
    const numMax = parseFloat(String(maxPlanPrice)) || 0;

    if (requiresPricingCalibration && (numMin < 0 || (numMax > 0 && numMax < numMin))) {
      setError('El precio del plan más caro debe ser igual o mayor al plan más barato.');
      setLoading(false);
      return;
    }

    if (isCommentsReviews && !communicationTone.trim()) {
      setError('Por favor indica las líneas de comunicación deseadas o ejemplos de comentarios.');
      setLoading(false);
      return;
    }

    const geoData: GeoTargeting = {
      country: countryObj.name,
      region: selectedRegionName || 'Región Central',
      city: effectiveCityName,
      estimatedCityPopulation: cityPopulation,
      autoExpandProximity,
      radiusKm: autoExpandProximity ? feasibility.recommendedRadiusKm : 0,
      feasibilityWarning: feasibility.warning,
      isFeasible30Days: feasibility.isFeasible30Days,
    };

    const pricing = getDynamicPricing(selectedType, targetQuantity);

    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          targetUrl,
          niche,
          description,
          campaignType: selectedType,
          targetUnitLabel: currentTypeMeta.unitLabelPlural,
          minPlanPrice: requiresPricingCalibration ? numMin : undefined,
          maxPlanPrice: requiresPricingCalibration ? numMax : undefined,
          currency: requiresPricingCalibration ? currency : undefined,
          targetRegistrations: targetQuantity,
          plan: pricing.plan,
          bridgeVerified: true,
          interactionPreferences: isSocialEngagement ? interactionPreferences : undefined,
          geoTargeting: geoData,
          status: 'active',
          creatorEmail: currentUser?.email,
          isSuperAdmin: isKathy && !isTestOneDollarMode,
          isOneDollarTestPlan: isTestOneDollarMode,
          price: isTestOneDollarMode ? 1 : (isKathy ? 0 : pricing.totalPrice),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al dar de alta la campaña');
      }

      onCreated(data.campaign);
      if (isTestOneDollarMode && onRequestCheckout) {
        onRequestCheckout(data.campaign);
        onClose();
      } else {
        setAdminSuccessCamp(data.campaign);
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const getCampaignIcon = (typeId: CampaignType) => {
    switch (typeId) {
      case 'user_registrations':
        return <Users className="w-4 h-4 text-emerald-400" />;
      case 'plan_sales':
        return <CreditCard className="w-4 h-4 text-cyan-400" />;
      case 'social_followers':
        return <UserCheck className="w-4 h-4 text-sky-400" />;
      case 'likes_engagement':
        return <Heart className="w-4 h-4 text-rose-400" />;
      case 'comments_reviews':
        return <MessageSquareText className="w-4 h-4 text-amber-400" />;
      case 'youtube_growth':
        return <Youtube className="w-4 h-4 text-red-500" />;
      default:
        return <Zap className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      {/* Floating mobile close button */}
      <button
        onClick={onClose}
        aria-label="Cerrar modal"
        className="fixed top-3 right-3 z-50 p-2 bg-neutral-900/90 text-neutral-300 hover:text-white rounded-full border border-neutral-700 shadow-2xl sm:hidden cursor-pointer"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="relative bg-[#121212] border border-neutral-700 rounded-xl max-w-3xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 px-4 sm:px-6 py-3.5 border-b border-neutral-800 bg-[#161616] flex items-center justify-between shrink-0">
          <div className="pr-2">
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Alta de Campaña Autónoma con Apagado Exacto KaSe</span>
            </h2>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Lógica condicional adaptativa, segmentación geográfica y garantía estricta de cumplimiento.
            </p>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-200 bg-neutral-800 hover:bg-neutral-700 hover:text-white border border-neutral-700 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
            <span className="hidden xs:inline">Cerrar</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-xs overscroll-contain">
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 rounded text-red-300">
              {error}
            </div>
          )}

          {/* SECTION 1: SELECCIONA EL TIPO DE CAMPAÑA (Disparador Dinámico) */}
          <div>
            <label className="block text-neutral-200 font-bold mb-2 flex items-center justify-between">
              <span>1. Selecciona el Tipo de Campaña *</span>
              <span className="text-[11px] font-normal text-emerald-400">Define la lógica dinámica posterior</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CAMPAIGN_TYPES_CATALOG.map((cat) => {
                const isSelected = selectedType === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleTypeSelect(cat.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/10 text-white shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                        : 'border-neutral-800 bg-neutral-900/80 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <div className="p-1 rounded bg-black/40 border border-neutral-800">
                        {getCampaignIcon(cat.id)}
                      </div>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-white text-[11px] leading-tight line-clamp-1">
                        {cat.title.replace('Campaña de ', '').replace('Campaña para ', '')}
                      </div>
                      <div className="text-[10px] text-neutral-400 mt-0.5 line-clamp-1">{cat.tagline}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanation box for selected campaign type */}
            <div className="mt-2.5 p-3 rounded-lg bg-black/60 border border-neutral-800 text-[11px] space-y-1">
              <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Cómo opera: {currentTypeMeta.title}</span>
              </div>
              <p className="text-neutral-300 leading-relaxed">
                {currentTypeMeta.howItWorks}
              </p>
              <div className="text-neutral-400 font-mono text-[10px] pt-1 border-t border-neutral-800/80">
                🔒 Validación externa auditada: {currentTypeMeta.verificationMethod}
              </div>
            </div>
          </div>

          {/* SECTION 2: DATOS DEL PRODUCTO & SEGMENTACIÓN GEOGRÁFICA INTELIGENTE */}
          <div className="space-y-4 pt-3 border-t border-neutral-800">
            <h3 className="text-neutral-200 font-bold flex items-center justify-between">
              <span>2. Datos del Producto / Web / Enlace</span>
              <span className="text-[11px] font-normal text-neutral-400">Campos adaptados al objetivo</span>
            </h3>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Nombre de la Aplicación, Producto, Perfil o Canal *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: FinPulse AI, NovaMetrics, TechMaster Studio, @canaloficial"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  {getTargetUrlLabel()}
                </label>
                <input
                  type="url"
                  required
                  placeholder={
                    isYouTube
                      ? 'https://youtube.com/@tucanal o https://youtube.com/watch?v=...'
                      : selectedType === 'social_followers' || selectedType === 'likes_engagement'
                      ? 'https://x.com/tuperfil o https://instagram.com/p/...'
                      : 'https://tudominio.com'
                  }
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Categoría o Nicho *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: B2B SaaS, Citas / Social, Cripto, Salud, Educación"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* CONDITIONAL FIELD: Likes & Engagement preferred focus */}
            {isSocialEngagement && (
              <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
                <label className="block text-neutral-200 font-semibold text-xs">
                  ¿Qué tipo de interacciones o enfoque prefieres? *
                </label>
                <p className="text-[11px] text-neutral-400">
                  Especifica si buscas comentarios positivos, preguntas frecuentes, debate técnico o interacción directa con usuarios de tu nicho.
                </p>
                <input
                  type="text"
                  required
                  value={interactionPreferences}
                  onChange={(e) => setInteractionPreferences(e.target.value)}
                  placeholder="Ej: Comentarios positivos, preguntas frecuentes, interactuar con el nicho tech"
                  className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            {/* CONDITIONAL FIELD: Comentarios & Reseñas tone instructions */}
            {isCommentsReviews && (
              <div className="p-3.5 bg-neutral-900 border border-amber-500/30 rounded-xl space-y-2">
                <label className="block text-amber-300 font-bold text-xs">
                  Líneas de comunicación deseadas (Obligatorio) *
                </label>
                <p className="text-[11px] text-neutral-400">
                  Deja ejemplos o instrucciones del tono de comentarios y reseñas que tus motores deben generar (ej. testimonios profesionales, preguntas de compradores, tono entusiasta o técnico):
                </p>
                <textarea
                  rows={3}
                  required
                  value={communicationTone}
                  onChange={(e) => setCommunicationTone(e.target.value)}
                  placeholder="Ejemplo: Comentarios de usuarios satisfechos destacando la rapidez del software, o preguntas reales sobre integración API..."
                  className="w-full bg-black border border-neutral-700 rounded-lg p-2.5 text-white text-xs focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>
            )}

            {/* PARTE 4: MÓDULO DE SEGMENTACIÓN GEOGRÁFICA INTELIGENTE CON BUSCADOR GLOBAL */}
            <div className="p-4 bg-neutral-900/90 border border-emerald-500/30 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <h4 className="font-bold text-white text-xs">
                    Segmentación Geográfica Inteligente (Buscador Mundial de Países y Ciudades)
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  {WORLD_COUNTRIES_CATALOG.length} Países + Cualquier Ciudad
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Enfoca el tráfico de tus motores exactamente donde están tus clientes ideales. Busca cualquier país del mundo y escribe o selecciona cualquier ciudad específica:
              </p>

              {/* 1. BUSCADOR DE PAÍS */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="text-neutral-300 text-[11px] font-semibold flex items-center gap-1.5">
                    <span>1. País Seleccionado:</span>
                    <span className="text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                      <span>{countryObj.flag}</span>
                      <span>{countryObj.name}</span>
                      <span className="font-mono text-[10px] text-neutral-400">({countryObj.code})</span>
                    </span>
                  </label>
                  <span className="text-[10px] text-neutral-500 font-mono">Búsqueda rápida mundial</span>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="text"
                    value={countrySearchQuery}
                    onChange={(e) => setCountrySearchQuery(e.target.value)}
                    placeholder="Buscar país en todo el mundo (ej. España, Japón, Brasil, Uruguay, México, Alemania...)"
                    className="w-full pl-9 pr-3 py-2 bg-black border border-neutral-700 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500 placeholder-neutral-500 transition-colors"
                  />
                  {countrySearchQuery && (
                    <button
                      type="button"
                      onClick={() => setCountrySearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Quick Country Shortcuts */}
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-[10px] text-neutral-400 font-mono">Países populares:</span>
                  {[
                    { code: 'GLOBAL', label: '🌐 Global', flag: '🌐' },
                    { code: 'UY', label: 'Uruguay', flag: '🇺🇾' },
                    { code: 'AR', label: 'Argentina', flag: '🇦🇷' },
                    { code: 'ES', label: 'España', flag: '🇪🇸' },
                    { code: 'MX', label: 'México', flag: '🇲🇽' },
                    { code: 'US', label: 'EE.UU.', flag: '🇺🇸' },
                    { code: 'CL', label: 'Chile', flag: '🇨🇱' },
                    { code: 'CO', label: 'Colombia', flag: '🇨🇴' },
                    { code: 'PE', label: 'Perú', flag: '🇵🇪' },
                    { code: 'BR', label: 'Brasil', flag: '🇧🇷' },
                  ].map((qp) => (
                    <button
                      key={qp.code}
                      type="button"
                      onClick={() => {
                        handleCountryChange(qp.code);
                        setCountrySearchQuery('');
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer flex items-center gap-1 ${
                        selectedCountryCode === qp.code
                          ? 'bg-emerald-400 text-black font-bold shadow'
                          : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800'
                      }`}
                    >
                      <span>{qp.flag}</span>
                      <span>{qp.label}</span>
                    </button>
                  ))}
                </div>

                {/* Country Matching List (TODOS LOS PAÍSES DISPONIBLES) */}
                <div className="text-[10px] text-neutral-400 font-mono flex items-center justify-between">
                  <span>Listado completo de países ({filteredCountries.length} disponibles):</span>
                  {selectedCountryCode && (
                    <span className="text-emerald-400">Activo: {countryObj.flag} {countryObj.name}</span>
                  )}
                </div>
                <div className="max-h-52 overflow-y-auto rounded-lg border border-neutral-800 bg-black/70 p-1.5 grid grid-cols-2 sm:grid-cols-3 gap-1">
                  {filteredCountries.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        handleCountryChange(c.code);
                        setCountrySearchQuery('');
                      }}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] text-left transition-colors cursor-pointer truncate ${
                        selectedCountryCode === c.code
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shadow-sm'
                          : 'text-neutral-300 hover:bg-neutral-800/80 hover:text-white'
                      }`}
                      title={`${c.name} (${c.code})`}
                    >
                      <span className="text-sm shrink-0">{c.flag}</span>
                      <span className="truncate">{c.name}</span>
                    </button>
                  ))}
                  {filteredCountries.length === 0 && (
                    <div className="col-span-full text-center text-[11px] text-neutral-500 py-3 font-mono">
                      No se encontraron países para "{countrySearchQuery}".
                    </div>
                  )}
                </div>
              </div>

              {/* 2. BUSCADOR Y ENTRADA LIBRE DE CIUDAD */}
              <div className="space-y-2 pt-2 border-t border-neutral-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <label className="text-neutral-300 text-[11px] font-semibold flex items-center gap-1.5">
                    <span>2. Ciudad Núcleo:</span>
                    <strong className="text-white bg-neutral-800 border border-neutral-700 px-2 py-0.5 rounded font-mono text-xs">
                      {effectiveCityName}
                    </strong>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      (~{cityPopulation.toLocaleString()} hab.)
                    </span>
                  </label>
                  <span className="text-[10px] text-sky-400 font-mono">
                    Admite cualquier ciudad del mundo
                  </span>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="text"
                    value={cityInputText}
                    onChange={(e) => handleCityInputChange(e.target.value)}
                    placeholder="Escribe o busca cualquier ciudad del mundo (ej. Punta del Este, Rosario, Lyon, Arequipa, Miami...)"
                    className="w-full pl-9 pr-3 py-2 bg-black border border-neutral-700 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500 placeholder-neutral-500 transition-colors"
                  />
                  {cityInputText && (
                    <button
                      type="button"
                      onClick={() => handleCityInputChange('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Quick Suggestion Chips for Selected Country */}
                {availableCitiesInCountry.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] text-neutral-500 uppercase font-mono block">
                      Ciudades destacadas en {countryObj.name} (Clic para seleccionar rápido):
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                      {availableCitiesInCountry.map((city) => (
                        <button
                          key={city.name}
                          type="button"
                          onClick={() => {
                            setSelectedCityName(city.name);
                            setCityInputText(city.name);
                          }}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                            effectiveCityName.toLowerCase() === city.name.toLowerCase()
                              ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/50 font-bold'
                              : 'bg-black/60 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700'
                          }`}
                        >
                          {city.name} <span className="text-[9px] text-neutral-500 font-mono">(~{(city.population / 1000).toFixed(0)}k)</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ALGORITMO DE VIABILIDAD DE META */}
              {!feasibility.isFeasible30Days && (
                <div className="p-3 bg-amber-950/40 border border-amber-600/60 rounded-lg text-amber-200 text-[11px] flex items-start gap-2 leading-relaxed">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold mb-0.5">Alerta de Viabilidad Poblacional (30 Días):</strong>
                    {feasibility.warning}
                  </div>
                </div>
              )}

              {/* EXPANSIÓN AUTOMÁTICA POR PROXIMIDAD (CÍRCULOS CONCÉNTRICOS) */}
              <div className="p-3 bg-black/50 border border-neutral-800 rounded-lg flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="autoExpand"
                  checked={autoExpandProximity}
                  onChange={(e) => setAutoExpandProximity(e.target.checked)}
                  className="w-4 h-4 accent-emerald-400 rounded mt-0.5 cursor-pointer shrink-0"
                />
                <label htmlFor="autoExpand" className="cursor-pointer text-[11px] leading-relaxed">
                  <strong className="text-white font-semibold block">
                    Activar Expansión Automática por Proximidad (Círculos concéntricos por radio de KM) [Recomendado]
                  </strong>
                  <span className="text-neutral-400">
                    Si el mercado local en {selectedCityName} se agota a mitad de campaña, los motores autónomos amplían automáticamente el alcance a las ciudades colindantes (+{feasibility.recommendedRadiusKm} km) en orden de proximidad por coordenadas, garantizando que los usuarios continúen perteneciendo a los alrededores geográficos del núcleo original.
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* SECTION 3: CALIBRACIÓN DE PRECIOS & PÍXEL KASE (CONDICIONAL: Solo Registros y Venta de Planes) */}
          {requiresPricingCalibration && (
            <div className="p-4 bg-neutral-900/90 border border-emerald-500/30 rounded-xl space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
                    <h4 className="font-bold text-white text-xs">
                      3. Calibración de Precios de tu Web (Pregunta Estratégica)
                    </h4>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    ¿Cuánto valen los planes que ofreces actualmente en tu página?
                  </p>
                </div>

                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as 'USD' | 'UYU')}
                  className="bg-black border border-neutral-700 rounded px-2 py-1 text-white font-mono text-[11px] focus:outline-none focus:border-emerald-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="UYU">UYU ($)</option>
                </select>
              </div>

              {/* Quick Pricing Presets */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-neutral-400 font-mono">Selección rápida de rangos comunes:</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { label: '$9 a $49', min: '9', max: '49' },
                    { label: '$29 a $199', min: '29', max: '199' },
                    { label: '$49 a $299', min: '49', max: '299' },
                    { label: '$99 a $499', min: '99', max: '499' },
                    { label: '$500 a $2,500', min: '500', max: '2500' },
                  ].map((pr) => (
                    <button
                      key={pr.label}
                      type="button"
                      onClick={() => {
                        setMinPlanPrice(pr.min);
                        setMaxPlanPrice(pr.max);
                      }}
                      className={`px-2.5 py-1 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                        String(minPlanPrice) === pr.min && String(maxPlanPrice) === pr.max
                          ? 'bg-emerald-400 text-black font-bold'
                          : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800'
                      }`}
                    >
                      {pr.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    ¿Cuánto vale el plan <strong className="text-white">MÁS BARATO</strong> en tu página? *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-neutral-400 font-mono">$</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      value={minPlanPrice}
                      onChange={(e) => setMinPlanPrice(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full bg-black border border-neutral-700 rounded-lg pl-7 pr-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                      placeholder="29"
                    />
                    <span className="absolute right-3 top-2 text-neutral-500 text-[10px] font-mono">{currency}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    ¿Cuánto vale el plan <strong className="text-white">MÁS CARO</strong> en tu página? *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-neutral-400 font-mono">$</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      value={maxPlanPrice}
                      onChange={(e) => setMaxPlanPrice(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full bg-black border border-neutral-700 rounded-lg pl-7 pr-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                      placeholder="199"
                    />
                    <span className="absolute right-3 top-2 text-neutral-500 text-[10px] font-mono">{currency}</span>
                  </div>
                </div>
              </div>

              {/* Strategic explanation banner */}
              <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-[11px] text-emerald-200/90 leading-relaxed flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white font-semibold block">¿Por qué preguntamos el valor de tus planes?</strong>
                  Para calibrar el algoritmo psicográfico. KaSe perfila a usuarios con el poder adquisitivo exacto para pagar entre <strong className="text-white">${minPlanPrice} y ${maxPlanPrice} {currency}</strong>, descartando personas sin capacidad de compra y concentrando el tráfico en compradores reales.
                </div>
              </div>

              {/* ATRIBUCIÓN Y SEGUIMIENTO 100% AUTÓNOMO (ENRUTADOR PUENTE - ZERO INSTALL) */}
              <div className="pt-3 border-t border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Atribución y Enrutador Puente Autónomo (Zero-Install)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[10px] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    100% AUTÓNOMO
                  </span>
                </div>

                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1.5 text-[11px] text-neutral-300">
                  <p className="leading-relaxed">
                    ✨ <strong>Sin instalación manual de scripts:</strong> Esta campaña canalizará todo el tráfico derivado por los 8 motores a través del <strong>Enrutador Puente Inteligente (<code className="text-emerald-400">/r/:id</code>)</strong>, interceptando y contabilizando cada visita y compra hacia <strong className="text-neutral-200 font-mono">{targetUrl}</strong> de forma 100% transparente y automática.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: META DE CONVERSIÓN Y PLAN KASE */}
          <div className="pt-3 border-t border-neutral-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-neutral-200 font-bold">
                {getGoalLabel()}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={500000}
                  value={targetQuantity}
                  onChange={(e) => handleTargetChange(Math.max(1, parseInt(e.target.value || '1', 10)))}
                  className="bg-neutral-900 border border-emerald-500/50 rounded px-2.5 py-1 text-xs font-mono font-bold text-emerald-400 w-28 text-right focus:outline-none focus:border-emerald-400"
                />
                <span className="text-xs text-neutral-400 font-medium">{currentTypeMeta.unitLabelPlural}</span>
              </div>
            </div>

            {/* Quick Preset Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-neutral-400 font-mono">Selección rápida:</span>
              {currentTypeMeta.targetPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleTargetChange(preset)}
                  className={`px-2 py-1 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                    targetQuantity === preset
                      ? 'bg-emerald-400 text-black font-bold'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800'
                  }`}
                >
                  {preset.toLocaleString()}
                </button>
              ))}
            </div>

            {/* Range slider for fluid selection */}
            <input
              type="range"
              min={currentTypeMeta.targetPresets[0] || 10}
              max={currentTypeMeta.targetPresets[currentTypeMeta.targetPresets.length - 1] || 10000}
              step={selectedType === 'plan_sales' ? 5 : 100}
              value={targetQuantity}
              onChange={(e) => handleTargetChange(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-400 cursor-pointer h-2 bg-neutral-900 rounded border border-neutral-800"
            />

            {/* Tier & Price breakdown card */}
            {(() => {
              const pricing = getDynamicPricing(selectedType, targetQuantity);
              return (
                <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-300">
                      Volumen contratado: <strong className="text-white font-mono">{targetQuantity.toLocaleString()} {currentTypeMeta.unitLabelPlural}</strong>
                    </span>
                    <span className="text-emerald-400 font-bold text-sm font-mono">
                      ${pricing.totalPrice.toLocaleString()} USD / mes
                    </span>
                  </div>

                  <div className="text-[11px] text-neutral-400 pt-1 border-t border-neutral-800 flex items-center justify-between">
                    <span>Nivel de Suite asignado:</span>
                    <span className="font-bold text-white uppercase font-mono px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700">
                      Plan {pricing.plan} ({pricing.planName})
                    </span>
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono text-right">
                    ~${pricing.unitPrice} USD por {currentTypeMeta.unitLabel}
                  </div>
                </div>
              );
            })()}

            {/* Super Admin Benefit Notice & Test Option */}
            {isKathy && (
              <div className="space-y-2">
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-white">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Beneficio Super Administrador (Kathy Seba)</span>
                  </div>
                  <p className="text-[11px] text-neutral-300">
                    Has visualizado la tarifa comercial (~${calculateEstimate(targetQuantity).toLocaleString()} USD) para tu auditoría. Como Super Admin tus campañas son 100% gratis ($0.00). Si quieres probar tu pasarela de cobro real de Mercado Pago, activa la casilla de prueba abajo.
                  </p>
                </div>

                {/* TEST CHECKOUT $1.00 USD TOGGLE FOR KATHY */}
                <div className="p-3 rounded-xl bg-amber-950/40 border-2 border-amber-500/60 flex items-start gap-3 shadow-md">
                  <input
                    type="checkbox"
                    id="testOneDollarCheckout"
                    checked={isTestOneDollarMode}
                    onChange={(e) => setIsTestOneDollarMode(e.target.checked)}
                    className="w-4 h-4 accent-amber-400 rounded mt-0.5 cursor-pointer shrink-0"
                  />
                  <label htmlFor="testOneDollarCheckout" className="cursor-pointer text-xs">
                    <strong className="text-amber-300 font-bold block flex items-center gap-1.5">
                      <span>💳</span>
                      <span>Modo Autoprueba de Mercado Pago ($1.00 USD)</span>
                    </strong>
                    <span className="text-neutral-300 text-[11px] leading-relaxed block mt-0.5">
                      Marcar para pasar al checkout y probar un cobro real de $1.00 USD con tu tarjeta para comprobar que tu API de producción de Mercado Pago Uruguay recibe y acredita el dinero en tu cuenta.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Strict Compliance Guarantee */}
            <div className="text-[11px] text-neutral-400 flex items-start gap-2 bg-black/40 p-2.5 rounded-lg border border-neutral-800/80">
              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Garantía Estricta KaSe:</strong> Al registrarse de forma exacta el #{targetQuantity.toLocaleString()} ({currentTypeMeta.unitLabelPlural}), los motores autónomos se pausan al instante. No hay sobrecostes ni cobros sorpresa.
              </span>
            </div>

            {/* VERCEL APIS VERIFICATION GATE (SEGURIDAD Y PROTECCIÓN AL CLIENTE) */}
            <div className={`p-4 rounded-xl border text-xs space-y-3 ${
              isValidatingEngines
                ? 'bg-neutral-900 border-neutral-700 text-neutral-300'
                : (!engineValidation || !engineValidation.canProceed)
                ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
            }`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-bold text-xs">
                  {isValidatingEngines ? (
                    <>
                      <RefreshCw className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
                      <span className="text-amber-300">
                        Verificando APIs de Motores en Vercel...
                      </span>
                    </>
                  ) : (!engineValidation || !engineValidation.canProceed) ? (
                    <>
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span className="text-rose-300">
                        ACTIVACIÓN Y COBRO BLOQUEADOS: APIs PENDIENTES EN VERCEL
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-emerald-300">
                        APIs de Motores 100% Verificadas y Conectadas en Vercel
                      </span>
                    </>
                  )}
                </div>
              </div>

              {isValidatingEngines ? (
                <div className="space-y-1 text-[11px] text-neutral-400">
                  <p>Consultando el estado de conexión de los motores del plan <strong>{plan.toUpperCase()}</strong> en las variables de entorno de Vercel...</p>
                </div>
              ) : (!engineValidation || !engineValidation.canProceed) ? (
                <div className="space-y-2 text-[11px] text-neutral-300">
                  <p className="leading-relaxed">
                    Por <strong>política de seguridad y garantía estricta de entrega de servicio 100% real</strong>, no se puede proceder al checkout ni cobrar campañas hasta que las APIs de los motores del plan <strong>{plan.toUpperCase()}</strong> estén configuradas por la administración en Vercel. Esto garantiza que ningún usuario pague por un servicio sin respaldo técnico activo:
                  </p>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {(engineValidation?.missingModules || []).map((m) => (
                      <div key={m.id} className="p-2 rounded-lg bg-black/60 border border-rose-900/40 text-[11px]">
                        <div className="font-semibold text-rose-300 flex items-center justify-between">
                          <span>🔴 {m.name}</span>
                          <span className="font-mono text-[10px] text-neutral-400">{m.platform}</span>
                        </div>
                        <div className="text-neutral-400 text-[10px] mt-0.5">
                          Variables requeridas en Vercel: <code className="text-amber-300 font-mono">{m.missingVars.join(', ')}</code>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 bg-black/40 rounded border border-neutral-800 text-[10px] text-neutral-400">
                    💡 <strong>Garantía Total para el Usuario:</strong> Tú como usuario no configuras ninguna API técnica. Este bloqueo es un seguro estricto de la plataforma para protegerte de cobros antes de que los motores estén conectados y listos.
                  </div>
                </div>
              ) : (
                <div className="space-y-1 text-[11px] text-neutral-300">
                  <p className="leading-relaxed">
                    Todos los motores del plan <strong>{plan.toUpperCase()}</strong> tienen sus credenciales validadas en Vercel. Al pasar al checkout se procederá al cobro y la campaña comenzará de inmediato con tráfico 100% real.
                  </p>
                  <p className="text-[10px] text-emerald-400">
                    ✨ Cero configuración para el cliente: infraestructura autónoma gestionada y respaldada por KaSe.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Modal Footer */}
          <div className="pt-4 border-t border-neutral-800 flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-700 transition-colors cursor-pointer text-xs font-medium"
            >
              ✕ Cancelar
            </button>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={loading}
                className={`px-5 py-2.5 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  loading
                    ? 'bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed opacity-75'
                    : isTestOneDollarMode
                    ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-lg shadow-amber-500/30 font-extrabold'
                    : 'bg-emerald-400 hover:bg-emerald-300 text-black glow-emerald'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>
                  {loading
                    ? 'Preparando...'
                    : isValidatingEngines
                    ? '⏳ Verificando APIs...'
                    : isTestOneDollarMode
                    ? '💳 Pagar $1.00 USD con Mercado Pago'
                    : isKathy
                    ? '🚀 Iniciar Campaña Autónoma ($0.00 Super Admin)'
                    : '🚀 Iniciar Campaña con Tráfico Autónomo'}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
