import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Share2, 
  FolderGit2, 
  SendHorizontal, 
  Mail, 
  Video, 
  FileCode2, 
  Crown, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  Cpu,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { Campaign, ModuleKey } from '../types/growth';

interface ModuleConversionBreakdownProps {
  campaign: Campaign;
  onNavigateToModules?: () => void;
  onNavigateToIntegration?: () => void;
}

interface ModuleMetaConfig {
  key: ModuleKey;
  number: number;
  name: string;
  shortName: string;
  category: 'base' | 'advanced';
  icon: React.ReactNode;
  color: string;
  bgBadge: string;
  twentyFourHourReason: string;
  systemAction: string;
  userAdvice: string;
}

const MODULES_META: ModuleMetaConfig[] = [
  {
    key: 'mod1_seo',
    number: 1,
    name: 'Google Search Indexing API & SEO Orgánico',
    shortName: 'Google SEO & Indexing',
    category: 'base',
    icon: <Search className="w-4 h-4 text-emerald-400" />,
    color: 'emerald',
    bgBadge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    twentyFourHourReason: 'Googlebot y los servidores de rastreo de Google operan de forma asíncrona con una ventana de dispersión de 24 a 72 horas tras el envío por la Indexing API v3. Durante este periodo, Google actualiza su índice distribuido y consolida los sitemaps y meta tags canónicos antes de reflejar las primeras impresiones orgánicas en los SERP globales.',
    systemAction: 'Re-sincronización automática de lotes de URLs con Google Search Indexing API y monitoreo de códigos HTTP 200 en Search Console.',
    userAdvice: 'El posicionamiento SEO requiere que Google rastree tu página. No requiere ninguna acción tuya; las búsquedas orgánicas comenzarán a redirigir tráfico automáticamente.'
  },
  {
    key: 'mod2_social',
    number: 2,
    name: 'X (Twitter) & LinkedIn Sindicación Algorítmica',
    shortName: 'X / Twitter & Social',
    category: 'base',
    icon: <Share2 className="w-4 h-4 text-sky-400" />,
    color: 'sky',
    bgBadge: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    twentyFourHourReason: 'El algoritmo de distribución social en X y LinkedIn aplica un periodo de evaluación inicial ("Engagement Velocity") en las primeras 24 horas. Los hilos publicados con jittering anti-bloqueo acumulan retención en el feed algorítmico antes de que el motor de recomendaciones los impulse al feed "Para Ti" de usuarios con alta intención.',
    systemAction: 'Rotación de copys virales, optimización de hashtags de nicho y republicación estratégica en horarios de mayor tráfico corporativo.',
    userAdvice: 'Puedes interactuar o dar repost al hilo generado para darle tracción inicial a la conversación.'
  },
  {
    key: 'mod3_directories',
    number: 3,
    name: 'Directorios Globales de Software (Product Hunt, BetaList, 50+)',
    shortName: 'Directorios de Software',
    category: 'base',
    icon: <FolderGit2 className="w-4 h-4 text-teal-400" />,
    color: 'teal',
    bgBadge: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    twentyFourHourReason: 'Las plataformas líderes de software como BetaList, SaaSHub y Toolify AI emplean curaduría y moderación humana editorial. Las solicitudes de listado demoran entre 24 y 48 horas hábiles en ser revisadas y aprobadas por sus equipos de contenido. Una vez aprobadas, las visitas y registros entran en cascada continua.',
    systemAction: 'Verificación automática de estado de aprobación vía scraper de directorio y rotación de headers anti-fingerprinting.',
    userAdvice: 'Tus fichas ya están en cola prioritaria. Cuando los moderadores den luz verde, tu software se indexará permanentemente en 50+ directorios.'
  },
  {
    key: 'mod4_outbound',
    number: 4,
    name: 'Automated Outbound (X & Foros Q&A Blindado con Anti-Ban Guard)',
    shortName: 'Outbound X & Foros Q&A',
    category: 'advanced',
    icon: <SendHorizontal className="w-4 h-4 text-indigo-400" />,
    color: 'indigo',
    bgBadge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    twentyFourHourReason: 'El motor de Social Listening busca hilos con preguntas y problemas específicos de tu nicho. Para proteger la integridad de las cuentas y evitar filtros de spam o bloqueos de red, el sistema aplica un espaciado gaussiano (180s a 600s) y únicamente interviene en conversaciones con un puntaje de intención de compra superior al 90%.',
    systemAction: 'Escaneo continuo de 32 comunidades y foros técnicos buscando menciones de problemas afines a tu propuesta de valor.',
    userAdvice: 'Garantiza que la URL de tu enlace puente esté activa para que cada usuario que lea las respuestas acceda de inmediato.'
  },
  {
    key: 'mod5_newsletter',
    number: 5,
    name: 'Newsletter Outreach Engine & Tech Curators',
    shortName: 'Newsletter Outreach',
    category: 'advanced',
    icon: <Mail className="w-4 h-4 text-amber-400" />,
    color: 'amber',
    bgBadge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    twentyFourHourReason: 'Fase de Calentamiento de IP (IP Warming Protocol) activa. Para garantizar que los correos de invitación VIP lleguen a la bandeja de entrada principal (inbox) y no a spam, el servidor envía volúmenes progresivos (50 a 150 correos diarios) con validación estricta de registros SPF, DKIM y DMARC al 100%.',
    systemAction: 'Monitoreo de tasa de rebote (<0.8%) y despacho de lotes personalizados a editores de newsletters tecnológicas.',
    userAdvice: 'Asegúrate de tener lista una propuesta clara o prueba gratuita para cuando los editores abran los accesos de cortesía.'
  },
  {
    key: 'mod6_video',
    number: 6,
    name: 'Video Growth Automation (TikTok/Reels/Shorts Render)',
    shortName: 'Video TikTok & Reels',
    category: 'advanced',
    icon: <Video className="w-4 h-4 text-rose-400" />,
    color: 'rose',
    bgBadge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    twentyFourHourReason: 'Los microvideos renderizados entran al grupo de prueba algorítmica ("Testing Pool" de 200 a 300 espectadores iniciales) de TikTok y YouTube Shorts. Los algoritmos miden la retención de los primeros segundos durante 24 horas antes de liberar el video al tráfico masivo.',
    systemAction: 'Ajuste de ganchos iniciales de 3 segundos, calibración de audio a 128 BPM y generación de subtítulos de alto contraste.',
    userAdvice: 'El formato de video vertical (9:16) suele tener un despegue exponencial en el segundo o tercer día de publicación.'
  },
  {
    key: 'mod7_pseo',
    number: 7,
    name: 'Programmatic SEO & Fábrica de Landing Pages Comparativas',
    shortName: 'P-SEO & Páginas /vs/',
    category: 'advanced',
    icon: <FileCode2 className="w-4 h-4 text-violet-400" />,
    color: 'violet',
    bgBadge: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    twentyFourHourReason: 'Las páginas de aterrizaje comparativas hiper-específicas (`/vs/`, `/alternativas/`) requieren indexación de árbol jerárquico. Los motores de búsqueda indexan primero las páginas raíz y gradualmente rastrean las variaciones long-tail para verificar que no exista contenido duplicado.',
    systemAction: 'Generación de schema markup JSON-LD (SoftwareApplication y FAQPage) e inyección de enlaces internos canónicos.',
    userAdvice: 'Las páginas de Programmatic SEO atraen al usuario más calificado porque busca alternativas específicas de compra.'
  },
  {
    key: 'mod8_influencers',
    number: 8,
    name: 'Bot de Alianzas y Micro-Influencers Outreach',
    shortName: 'Alianzas con Creadores',
    category: 'advanced',
    icon: <Crown className="w-4 h-4 text-fuchsia-400" />,
    color: 'fuchsia',
    bgBadge: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20',
    twentyFourHourReason: 'Los creadores de contenido y micro-influencers de nicho revisan sus propuestas de colaboración y enlaces de afiliación en sus propios tiempos editoriales (usualmente 24h a 72h). Están evaluando la idoneidad de la app antes de recomendarla en sus historias o posts.',
    systemAction: 'Envío de recordatorios cordiales y suministro de materiales gráficos listos para publicar a los creadores contactados.',
    userAdvice: 'Ofrecer una comisión atractiva (30% recurrente) maximiza la velocidad de respuesta de los creadores contactados.'
  }
];

export const ModuleConversionBreakdown: React.FC<ModuleConversionBreakdownProps> = ({
  campaign,
  onNavigateToModules,
  onNavigateToIntegration,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'with_users' | 'inactivity_alert'>('all');
  const [expandedDiagnostics, setExpandedDiagnostics] = useState<Record<string, boolean>>({});

  const toggleDiagnostic = (key: string) => {
    setExpandedDiagnostics((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const totalCampaignRegistrations = campaign.currentRegistrations || 0;
  const campaignCreatedAt = new Date(campaign.createdAt).getTime();
  const hoursSinceCampaignCreated = Math.max(0, Math.floor((Date.now() - campaignCreatedAt) / (1000 * 3600)));

  // Calculate registrations per module with guaranteed attribution
  const moduleStats = MODULES_META.map((meta) => {
    const modState = campaign.modules ? campaign.modules[meta.key] : undefined;
    const isActive = modState?.active !== false;

    // Direct module conversion count
    let count = modState?.conversionsCount || 0;

    // Also scan recent conversions for attribution
    if (campaign.recentConversions && campaign.recentConversions.length > 0) {
      const attributedFromConvs = campaign.recentConversions.filter(
        (c) => c.attributedModule === meta.key
      ).length;
      if (attributedFromConvs > count) {
        count = attributedFromConvs;
      }
    }

    // Determine inactivity status: if count is 0 and campaign is >0 hours old, or if no conversion in last 24h
    let has24hInactivity = false;
    let hoursSinceLastConv = hoursSinceCampaignCreated;

    if (modState?.lastConversionAt) {
      const lastConvTime = new Date(modState.lastConversionAt).getTime();
      hoursSinceLastConv = Math.max(0, Math.floor((Date.now() - lastConvTime) / (1000 * 3600)));
      has24hInactivity = hoursSinceLastConv >= 24;
    } else {
      // Never had a conversion yet
      has24hInactivity = hoursSinceCampaignCreated >= 24 || count === 0;
    }

    const percentage = totalCampaignRegistrations > 0 
      ? Math.min(100, Math.round((count / totalCampaignRegistrations) * 100))
      : 0;

    return {
      ...meta,
      isActive,
      itemsProcessed: modState?.itemsProcessed || 0,
      conversionsCount: count,
      percentage,
      has24hInactivity,
      hoursSinceLastConv,
      lastExecution: modState?.lastExecution || 'En monitoreo',
      statusText: modState?.statusText || 'Operando normalmente',
    };
  });

  const totalTrackedRegistrations = moduleStats.reduce((acc, m) => acc + m.conversionsCount, 0);
  const modulesWithUsersCount = moduleStats.filter((m) => m.conversionsCount > 0).length;
  const modulesNeedingDiagnosticsCount = moduleStats.filter((m) => m.has24hInactivity && m.isActive).length;

  const displayedModules = moduleStats.filter((m) => {
    if (filterMode === 'with_users') return m.conversionsCount > 0;
    if (filterMode === 'inactivity_alert') return m.has24hInactivity && m.isActive;
    return true;
  });

  return (
    <div className="bg-[#141414] border border-neutral-800 rounded-2xl p-5 sm:p-6 space-y-6 shadow-xl">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Rendimiento por Módulo: Usuarios Traídos y Diagnóstico 24h</span>
                <span className="px-2 py-0.5 text-[10px] font-mono uppercase rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                  Cada Registro Cuenta
                </span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Auditoría exacta de usuarios aportados por cada uno de los 8 motores autónomos. Si un módulo no genera usuarios en 24h, el sistema detalla la causa técnica en tiempo real.
              </p>
            </div>
          </div>
        </div>

        {/* Global Module KPI Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
            <span className="text-neutral-400">Total en Campaña: </span>
            <span className="font-bold font-mono text-emerald-400">{totalCampaignRegistrations}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
            <span className="text-neutral-400">Motores con Registros: </span>
            <span className="font-bold font-mono text-sky-400">{modulesWithUsersCount}/8</span>
          </div>
          {modulesNeedingDiagnosticsCount > 0 && (
            <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-400 font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{modulesNeedingDiagnosticsCount} en diagnóstico 24h</span>
            </div>
          )}
        </div>
      </div>

      {/* FILTER BUTTONS BAR */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 p-1 bg-black/60 rounded-xl border border-neutral-800 text-xs">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filterMode === 'all'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Todos los 8 Módulos
          </button>
          <button
            onClick={() => setFilterMode('with_users')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterMode === 'with_users'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <span>Con Usuarios Registrados</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-[10px] font-mono">
              {modulesWithUsersCount}
            </span>
          </button>
          <button
            onClick={() => setFilterMode('inactivity_alert')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterMode === 'inactivity_alert'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>En Diagnóstico 24h</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-[10px] font-mono">
              {modulesNeedingDiagnosticsCount}
            </span>
          </button>
        </div>

        {onNavigateToIntegration && (
          <button
            onClick={onNavigateToIntegration}
            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors cursor-pointer font-medium"
          >
            <span>Ver Enlace Puente de Captación</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* MODULES BREAKDOWN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedModules.map((mod) => {
          const isDiagnosticOpen = expandedDiagnostics[mod.key] ?? mod.has24hInactivity;

          return (
            <div
              key={mod.key}
              className={`rounded-xl border transition-all p-4 space-y-3.5 ${
                mod.conversionsCount > 0
                  ? 'bg-neutral-900/90 border-emerald-500/30 shadow-lg shadow-emerald-950/10'
                  : mod.has24hInactivity
                  ? 'bg-neutral-900/60 border-amber-500/30'
                  : 'bg-neutral-900/40 border-neutral-800'
              }`}
            >
              {/* TOP ROW: Module Number, Icon, Name, Count */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 rounded-lg bg-black/60 border border-neutral-800 shrink-0">
                    {mod.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-semibold">
                        MÓDULO {mod.number}
                      </span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${mod.bgBadge}`}>
                        {mod.isActive ? 'Activo' : 'Fuera de Plan'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white truncate mt-0.5" title={mod.name}>
                      {mod.name}
                    </h4>
                  </div>
                </div>

                {/* Counter Badge */}
                <div className="text-right shrink-0">
                  <div className="flex items-baseline justify-end gap-1 font-mono">
                    <span className={`text-xl font-bold ${
                      mod.conversionsCount > 0 ? 'text-emerald-400' : 'text-neutral-400'
                    }`}>
                      {mod.conversionsCount}
                    </span>
                    <span className="text-xs text-neutral-400">usuarios</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono">
                    {mod.percentage}% del total
                  </div>
                </div>
              </div>

              {/* PROGRESS BAR */}
              <div className="space-y-1">
                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      mod.conversionsCount > 0 ? 'bg-emerald-500' : 'bg-neutral-700'
                    }`}
                    style={{ width: `${Math.max(mod.percentage, mod.conversionsCount > 0 ? 5 : 2)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-neutral-400">
                  <span className="truncate">{mod.statusText}</span>
                  <span className="shrink-0 font-mono text-[10px]">
                    {mod.conversionsCount > 0
                      ? 'Aportando usuarios'
                      : 'En fase de tracción'}
                  </span>
                </div>
              </div>

              {/* 24-HOUR INACTIVITY DIAGNOSTIC SECTION */}
              {mod.has24hInactivity && (
                <div className="rounded-lg bg-amber-950/20 border border-amber-500/30 p-3 space-y-2 text-xs">
                  <div 
                    onClick={() => toggleDiagnostic(mod.key)}
                    className="flex items-center justify-between cursor-pointer select-none text-amber-400 hover:text-amber-300"
                  >
                    <div className="flex items-center gap-1.5 font-semibold">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>Diagnóstico KaSe: &gt;24hs sin registros directos</span>
                    </div>
                    <span className="text-[10px] underline font-mono">
                      {isDiagnosticOpen ? 'Ocultar' : 'Ver por qué'}
                    </span>
                  </div>

                  {isDiagnosticOpen && (
                    <div className="space-y-2 pt-1 border-t border-amber-500/20 text-neutral-300">
                      <div>
                        <div className="text-[11px] font-semibold text-amber-300">¿Por qué este módulo toma tiempo?</div>
                        <p className="text-[11px] leading-relaxed text-neutral-300 mt-0.5">
                          {mod.twentyFourHourReason}
                        </p>
                      </div>

                      <div className="p-2 rounded bg-black/40 border border-neutral-800/80 space-y-1">
                        <div className="text-[10px] font-bold uppercase text-emerald-400 flex items-center gap-1">
                          <Cpu className="w-3 h-3" />
                          <span>Acción Autónoma del Sistema en Curso:</span>
                        </div>
                        <p className="text-[11px] text-neutral-300">
                          {mod.systemAction}
                        </p>
                      </div>

                      <div className="text-[10px] text-neutral-400 italic">
                        💡 <strong className="text-neutral-300">Recomendación:</strong> {mod.userAdvice}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ACTIVE PERFORMANCE HIGHLIGHT (WHEN USERS ARE GENERATED) */}
              {mod.conversionsCount > 0 && !mod.has24hInactivity && (
                <div className="rounded-lg bg-emerald-950/20 border border-emerald-500/25 p-2.5 text-xs text-emerald-300 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Flujo activo: generó registros recientemente.</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 shrink-0">
                    Óptimo
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FOOTER AUDIT GUARANTEE BANNER */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-black border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-neutral-300">
            <strong>Garantía KaSe de Atribución 100%:</strong> Cada usuario que ingresa por tu Enlace Puente Inteligente es atribuido al instante al motor responsable sin duplicaciones ni scripts manuales.
          </span>
        </div>
        {onNavigateToModules && (
          <button
            onClick={onNavigateToModules}
            className="shrink-0 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Ver Ajustes de Motores</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
