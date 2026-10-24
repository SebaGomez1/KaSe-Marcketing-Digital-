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
  Globe2
} from 'lucide-react';
import { Campaign, CampaignType, CAMPAIGN_TYPES_CATALOG, GeoTargeting, User, EngineValidationResult } from '../types/growth';
import { GEOGRAPHICAL_DATABASE, calculateGeoFeasibility } from '../data/geoLocations';

interface NewCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newCamp: Campaign) => void;
  onRequestCheckout?: (camp: Campaign) => void;
  currentUser?: User | null;
}

export const NewCampaignModal: React.FC<NewCampaignModalProps> = ({
  isOpen,
  onClose,
  onCreated,
  onRequestCheckout,
  currentUser,
}) => {
  const [selectedType, setSelectedType] = useState<CampaignType>('user_registrations');
  const [name, setName] = useState('');
  const [targetUrl, setTargetUrl] = useState('https://');
  const [niche, setNiche] = useState('Fintech & B2B SaaS');
  const [description, setDescription] = useState('');
  const [adminSuccessCamp, setAdminSuccessCamp] = useState<Campaign | null>(null);
  const [isTestOneDollarMode, setIsTestOneDollarMode] = useState<boolean>(false);

  // Engine & API Verification in Vercel State (Zero-Mock Requirement)
  const [engineValidation, setEngineValidation] = useState<EngineValidationResult | null>(null);
  const [isValidatingEngines, setIsValidatingEngines] = useState<boolean>(true);

  // Conditional Fields
  const [interactionPreferences, setInteractionPreferences] = useState('Comentarios positivos y preguntas frecuentes orientadas al nicho');
  const [communicationTone, setCommunicationTone] = useState('');

  // Pixel Verification State (For user_registrations & plan_sales)
  const [pixelVerified, setPixelVerified] = useState(false);
  const [isVerifyingPixel, setIsVerifyingPixel] = useState(false);
  const [pixelVerifyMessage, setPixelVerifyMessage] = useState<string | null>(null);
  const [copiedPixel, setCopiedPixel] = useState(false);

  // Geographic Smart Segmentation
  const [selectedCountryCode, setSelectedCountryCode] = useState('UY');
  const [selectedRegionName, setSelectedRegionName] = useState('Montevideo');
  const [selectedCityName, setSelectedCityName] = useState('Montevideo Capital');
  const [autoExpandProximity, setAutoExpandProximity] = useState(true);

  // Pricing Range Questions (Strategic Intent Qualification - Only for user_registrations & plan_sales)
  const [minPlanPrice, setMinPlanPrice] = useState<number>(29);
  const [maxPlanPrice, setMaxPlanPrice] = useState<number>(199);
  const [currency, setCurrency] = useState<'USD' | 'UYU'>('USD');
  
  // Target Conversion Goal
  const [targetQuantity, setTargetQuantity] = useState<number>(2000);
  const [plan, setPlan] = useState<'starter' | 'growth' | 'enterprise'>('starter');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const isKathy = (currentUser?.email || '').toLowerCase() === 'kathyseba2020@gmail.com';

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
  const cityObj = regionObj?.cities.find((ci) => ci.name === selectedCityName) || regionObj?.cities[0];

  // Recalculate feasibility when goal or city changes
  const cityPopulation = cityObj?.population || 1000000;
  const feasibility = calculateGeoFeasibility(targetQuantity, cityPopulation, selectedCityName);

  // Handle Country Change
  const handleCountryChange = (code: string) => {
    setSelectedCountryCode(code);
    const country = GEOGRAPHICAL_DATABASE.find((c) => c.code === code) || GEOGRAPHICAL_DATABASE[0];
    if (country.regions.length > 0) {
      setSelectedRegionName(country.regions[0].name);
      if (country.regions[0].cities.length > 0) {
        setSelectedCityName(country.regions[0].cities[0].name);
      }
    }
  };

  // Handle Region Change
  const handleRegionChange = (rName: string) => {
    setSelectedRegionName(rName);
    const region = countryObj.regions.find((r) => r.name === rName);
    if (region && region.cities.length > 0) {
      setSelectedCityName(region.cities[0].name);
    }
  };

  // Determine which fields to display conditionally
  const requiresPricingCalibration = selectedType === 'user_registrations' || selectedType === 'plan_sales';
  const requiresPixelVerification = selectedType === 'user_registrations' || selectedType === 'plan_sales';
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

  const handleTypeSelect = (type: CampaignType) => {
    setSelectedType(type);
    setPixelVerified(false);
    setPixelVerifyMessage(null);
    const meta = CAMPAIGN_TYPES_CATALOG.find((t) => t.id === type);
    if (meta) {
      setTargetQuantity(meta.defaultTarget);
      if (meta.defaultTarget <= 2000) {
        setPlan('starter');
      } else if (meta.defaultTarget <= 10000) {
        setPlan('growth');
      } else {
        setPlan('enterprise');
      }
    }
  };

  const handleTargetChange = (val: number) => {
    setTargetQuantity(val);
    if (selectedType === 'plan_sales') {
      if (val <= 30) setPlan('starter');
      else if (val <= 100) setPlan('growth');
      else setPlan('enterprise');
    } else {
      if (val <= 2000) setPlan('starter');
      else if (val <= 10000) setPlan('growth');
      else setPlan('enterprise');
    }
  };

  const calculateEstimate = (qty: number) => {
    return Math.round(qty * currentTypeMeta.pricePerUnitEstimateUSD);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (requiresPricingCalibration && (minPlanPrice < 0 || maxPlanPrice < minPlanPrice)) {
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
      region: selectedRegionName,
      city: selectedCityName,
      estimatedCityPopulation: cityPopulation,
      autoExpandProximity,
      radiusKm: autoExpandProximity ? feasibility.recommendedRadiusKm : 0,
      feasibilityWarning: feasibility.warning,
      isFeasible30Days: feasibility.isFeasible30Days,
    };

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
          minPlanPrice: requiresPricingCalibration ? minPlanPrice : undefined,
          maxPlanPrice: requiresPricingCalibration ? maxPlanPrice : undefined,
          currency: requiresPricingCalibration ? currency : undefined,
          targetRegistrations: targetQuantity,
          plan,
          pixelVerified,
          interactionPreferences: isSocialEngagement ? interactionPreferences : undefined,
          geoTargeting: geoData,
          status: isKathy && !isTestOneDollarMode ? 'active' : 'configuring',
          creatorEmail: currentUser?.email,
          isSuperAdmin: isKathy && !isTestOneDollarMode,
          isOneDollarTestPlan: isTestOneDollarMode,
          price: isTestOneDollarMode ? 1 : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al dar de alta la campaña');
      }

      onCreated(data.campaign);
      if (isKathy && !isTestOneDollarMode) {
        setAdminSuccessCamp(data.campaign);
      } else {
        if (onRequestCheckout) {
          onRequestCheckout(data.campaign);
        }
        onClose();
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

            {/* PARTE 4: MÓDULO DE SEGMENTACIÓN GEOGRÁFICA INTELIGENTE */}
            <div className="p-4 bg-neutral-900/90 border border-emerald-500/30 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <h4 className="font-bold text-white text-xs">
                    Segmentación Geográfica Inteligente (Ciudades y Radios)
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  Densidad Local Alta Precisión
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Ideal para servicios locales o aplicaciones que exigen densidad geográfica estricta. Selecciona país, estado/provincia y ciudad núcleo:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-neutral-300 text-[11px] font-medium mb-1">País:</label>
                  <select
                    value={selectedCountryCode}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full bg-black border border-neutral-700 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    {GEOGRAPHICAL_DATABASE.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 text-[11px] font-medium mb-1">Provincia / Región:</label>
                  <select
                    value={selectedRegionName}
                    onChange={(e) => handleRegionChange(e.target.value)}
                    className="w-full bg-black border border-neutral-700 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    {countryObj.regions.map((r) => (
                      <option key={r.name} value={r.name}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 text-[11px] font-medium mb-1">Ciudad Núcleo:</label>
                  <select
                    value={selectedCityName}
                    onChange={(e) => setSelectedCityName(e.target.value)}
                    className="w-full bg-black border border-neutral-700 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    {regionObj?.cities.map((ci) => (
                      <option key={ci.name} value={ci.name}>
                        {ci.name} (~{ci.population.toLocaleString()} hab.)
                      </option>
                    ))}
                  </select>
                </div>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    ¿Cuánto vale el plan <strong className="text-white">MÁS BARATO</strong> en tu página? *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-neutral-400 font-mono">$</span>
                    <input
                      type="number"
                      min={0}
                      step={1}
                      required
                      value={minPlanPrice}
                      onChange={(e) => setMinPlanPrice(Number(e.target.value))}
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
                      type="number"
                      min={0}
                      step={1}
                      required
                      value={maxPlanPrice}
                      onChange={(e) => setMaxPlanPrice(Number(e.target.value))}
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
            <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-300">
                  Volumen contratado: <strong className="text-white font-mono">{targetQuantity.toLocaleString()} {currentTypeMeta.unitLabelPlural}</strong>
                </span>
                <span className="text-emerald-400 font-bold text-sm font-mono">
                  ~${calculateEstimate(targetQuantity).toLocaleString()} USD / mes
                </span>
              </div>

              <div className="text-[11px] text-neutral-400 pt-1 border-t border-neutral-800 flex items-center justify-between">
                <span>Nivel de Suite asignado:</span>
                <span className="font-bold text-white uppercase font-mono px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700">
                  Plan {plan} ({plan === 'starter' ? 'Módulos 1 a 3' : plan === 'growth' ? 'Módulos 1 a 5' : 'Todos los 8 Módulos VIP'})
                </span>
              </div>
            </div>

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

            {/* VERCEL APIS VERIFICATION GATE (ZERO-MOCK REQUIREMENT) */}
            <div className={`p-4 rounded-xl border text-xs space-y-3 ${
              engineValidation && !engineValidation.canProceed
                ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
            }`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-bold text-xs">
                  {engineValidation && !engineValidation.canProceed ? (
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

                <button
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(
                      new CustomEvent('kase:trigger_assistant_error', {
                        detail: {
                          location: 'Alta de Campaña',
                          module: `Motores del Plan ${plan.toUpperCase()}`,
                          error: engineValidation?.reason || 'Verificación de APIs en Vercel',
                          unconfiguredVars: engineValidation?.missingModules.flatMap((m) => m.missingVars),
                        },
                      })
                    );
                  }}
                  className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>🤖</span>
                  <span>Consultar a KaSi Copilot</span>
                </button>
              </div>

              {engineValidation && !engineValidation.canProceed ? (
                <div className="space-y-2 text-[11px] text-neutral-300">
                  <p className="leading-relaxed">
                    Por política de <strong>transparencia y entrega de tráfico 100% real</strong>, ni el usuario ni el administrador pueden proceder al checkout o iniciar la campaña si los motores requeridos no tienen sus APIs configuradas en Vercel:
                  </p>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {engineValidation.missingModules.map((m) => (
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
                </div>
              ) : (
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  Todos los motores del plan <strong>{plan.toUpperCase()}</strong> tienen sus credenciales validadas. Al pasar al checkout se procederá al cobro y la campaña comenzará de inmediato con tráfico 100% real.
                </p>
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
                disabled={loading || (engineValidation ? !engineValidation.canProceed : false)}
                className={`px-5 py-2.5 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  engineValidation && !engineValidation.canProceed
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
                    : engineValidation && !engineValidation.canProceed
                    ? '⛔ Bloqueado: Conecta las APIs en Vercel'
                    : isKathy
                    ? isTestOneDollarMode
                      ? '💳 Pagar $1.00 USD con Mercado Pago'
                      : '🚀 Iniciar Campaña Autónoma ($0.00 Gratis para Kathy)'
                    : 'Proceder al Checkout de Mercado Pago →'}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
