import React, { useState } from 'react';
import { 
  Users, 
  Target, 
  Cpu, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Play, 
  ArrowUpRight,
  Code2,
  Radio,
  Star,
  MessageSquare,
  Send,
  X,
  AlertCircle,
  Clock,
  Zap
} from 'lucide-react';
import { Campaign } from '../types/growth';
import { ModuleConversionBreakdown } from './ModuleConversionBreakdown';
import { useLiveRelativeTime } from '../utils/timeFormat';

interface CampaignOverviewProps {
  campaign: Campaign;
  onOpenIntegration: () => void;
  onOpenModules: () => void;
  onOpenGuide: () => void;
  onOpenPlans: () => void;
}

export const CampaignOverview: React.FC<CampaignOverviewProps> = ({
  campaign,
  onOpenIntegration,
  onOpenModules,
  onOpenGuide,
  onOpenPlans,
}) => {
  if (!campaign) return null;
  const { currentRegistrations, targetRegistrations, status, plan, modules } = campaign;
  const liveCreationTime = useLiveRelativeTime(campaign.createdAt, 1000);

  // Weekly Satisfaction Survey Modal State
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
  const [surveyStars, setSurveyStars] = useState(5);
  const [surveyFeedback, setSurveyFeedback] = useState('');
  const [isSubmittingSurvey, setIsSubmittingSurvey] = useState(false);
  const [surveyResultMsg, setSurveyResultMsg] = useState<{ type: 'success' | 'alert'; text: string } | null>(null);

  const handleSubmitSurvey = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingSurvey(true);
    setSurveyResultMsg(null);
    try {
      const res = await fetch('/api/marketing/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientEmail: campaign.billing?.payerEmail || 'cliente@kase.com',
          clientName: campaign.name,
          ratingStars: surveyStars,
          message: surveyFeedback,
          campaignId: campaign.id,
        }),
      });
      const data = await res.json();
      if (data.isDissatisfied) {
        setSurveyResultMsg({
          type: 'alert',
          text: '🚨 Tu comentario ha sido recibido. El Agente de IA ha generado una alerta urgente a la administración de Kathy Seba (Super Admin) para atender tu desconformidad con máxima prioridad.',
        });
      } else {
        setSurveyResultMsg({
          type: 'success',
          text: '⭐ ¡Muchas gracias por tu valoración de conformidad! Tu retroalimentación nos ayuda a seguir optimizando los 8 motores.',
        });
      }
      setTimeout(() => {
        if (!data.isDissatisfied) {
          setIsSurveyModalOpen(false);
          setSurveyResultMsg(null);
          setSurveyFeedback('');
        }
      }, 3500);
    } catch (err) {
      console.error('Error submitting satisfaction feedback:', err);
      setSurveyResultMsg({
        type: 'alert',
        text: 'Hubo un error al enviar tu valoración. Por favor intenta nuevamente.',
      });
    } finally {
      setIsSubmittingSurvey(false);
    }
  };
  const progressPercent = Math.min(100, Math.round((currentRegistrations / targetRegistrations) * 100));
  const remaining = Math.max(0, targetRegistrations - currentRegistrations);
  const isQuotaReached = status === 'paused_quota_reached' || currentRegistrations >= targetRegistrations;

  // Count active modules
  const activeModulesCount = Object.values(modules).filter((m) => m.active).length;

  return (
    <div className="space-y-6">
      {/* 0. FRIENDLY ONBOARDING BANNER (What to do, where to go) */}
      <div className="bg-[#141414] border border-neutral-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>¿Cómo funciona el flujo de tu campaña?</span>
              <span className="text-[10px] font-mono text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                1. Configuras meta &rarr; 2. Enlace Puente &rarr; 3. KaSe atrae usuarios &rarr; 4. Auto-Pausa
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Solo pagas por usuarios registrados reales. No necesitas dar contraseñas ni acceso a tus servidores.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto flex-wrap">
          <button
            onClick={() => setIsSurveyModalOpen(true)}
            className="w-full sm:w-auto px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-md text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <Star className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
            <span>⭐ Valorar Campaña</span>
          </button>
          <button
            onClick={onOpenGuide}
            className="w-full sm:w-auto px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-md text-xs font-medium text-emerald-400 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Ver Guía</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onOpenPlans}
            className="w-full sm:w-auto px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
          >
            Ver Planes & Precios
          </button>
        </div>
      </div>
      {/* 1. AUTO-PAUSE ALERT BANNER (Displayed prominently when quota is reached) */}
      {isQuotaReached && (
        <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-5 text-amber-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5 text-amber-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-amber-300">
                  Tope Programado Cumplido: Motores Pausados de Forma Inteligente
                </h3>
                <p className="text-xs text-amber-200/90 leading-relaxed">
                  KaSe ha completado el 100% de la meta contratada ({currentRegistrations.toLocaleString()} de {targetRegistrations.toLocaleString()} usuarios registrados). Los 8 módulos autónomos se han detenido en segundo plano para evitar sobrecostos al cliente.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-mono text-amber-300 bg-amber-900/50 px-2.5 py-1 rounded border border-amber-600/30">
                100% COMPLETADO
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. DOMINANT FOCAL ANCHOR: CONVERSION GOAL METER */}
      <div className="bg-[#161616] border border-neutral-800 rounded-xl p-6 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-neutral-800">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-neutral-400">
              <Target className="w-4 h-4 text-sky-400" />
              <span>Control Autónomo de Cuota Contratada</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-emerald-400">Auto-Pausa Activa</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <Clock className="w-3 h-3 text-emerald-400" />
                <span>{liveCreationTime}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono bg-neutral-900 text-neutral-300 border border-neutral-700" title="Fecha y hora de publicación en producción">
                <span>📅 Publicada:</span>
                <strong className="text-white">
                  {new Date(campaign.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                </strong>
                <strong className="text-emerald-400">
                  {new Date(campaign.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false })} hs
                </strong>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              <span className="font-mono tabular-nums text-sky-400">
                {currentRegistrations.toLocaleString()}
              </span>{' '}
              <span className="text-neutral-500 font-light">/</span>{' '}
              <span className="font-mono tabular-nums text-neutral-200">
                {targetRegistrations.toLocaleString()}
              </span>{' '}
              <span className="text-base font-medium text-neutral-400">
                {campaign.targetUnitLabel || 'usuarios registrados'}
              </span>
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
              <p className="max-w-xl leading-relaxed">
                Monitoreo continuo en tiempo real mediante tu Enlace Puente Inteligente. El sistema se desactiva de forma estricta al llegar a la cuota.
              </p>
              {campaign.minPlanPrice !== undefined && campaign.maxPlanPrice !== undefined && (
                <div className="px-2.5 py-1 rounded-md bg-emerald-950/30 border border-emerald-500/20 text-emerald-300 text-[11px] font-mono">
                  Targeting calibrado para planes de <strong className="text-white">${campaign.minPlanPrice} - ${campaign.maxPlanPrice} {campaign.currency || 'USD'}</strong>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="text-right sm:text-right">
              <div className="text-3xl font-extrabold font-mono tabular-nums text-emerald-400">
                {progressPercent}%
              </div>
              <div className="text-xs text-neutral-400">
                {remaining > 0 ? (
                  <span>
                    Faltan <strong className="font-mono text-neutral-200">{remaining.toLocaleString()}</strong> {campaign.targetUnitLabel || 'unidades'}
                  </span>
                ) : (
                  <span className="text-amber-400 font-medium">Meta alcanzada (Motores en Pausa)</span>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="relative pt-6">
          <div className="w-full h-3 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
            <div
              className={`h-full transition-all duration-700 ease-out ${
                isQuotaReached
                  ? 'bg-gradient-to-r from-emerald-500 via-sky-400 to-amber-400'
                  : 'bg-gradient-to-r from-emerald-500 to-sky-400'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-500 mt-2 font-mono tabular-nums">
            <span>0</span>
            <span>{(targetRegistrations * 0.25).toLocaleString()}</span>
            <span>{(targetRegistrations * 0.5).toLocaleString()}</span>
            <span>{(targetRegistrations * 0.75).toLocaleString()}</span>
            <span className="text-sky-400 font-semibold">{targetRegistrations.toLocaleString()} (Meta)</span>
          </div>

          {/* Live Engine Activity & Traffic Acceleration Control */}
          <div className="mt-5 pt-4 border-t border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${status === 'active' ? 'bg-emerald-400 opacity-75' : 'bg-neutral-500'}`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${status === 'active' ? 'bg-emerald-500' : 'bg-neutral-600'}`}></span>
              </span>
              <span className="font-semibold text-neutral-200">
                {status === 'active'
                  ? '8 Motores Autónomos Activos: Escaneando y atrayendo tráfico en vivo'
                  : 'Motores en pausa programada'}
              </span>
              <span className="text-neutral-500 hidden md:inline">|</span>
              <span className="text-neutral-400 hidden md:inline">
                Cadencia: <span className="text-emerald-400 font-mono">100% Orgánico</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. FOUR KPI METRIC STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-[#161616] border border-neutral-800 rounded-xl p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Usuarios Registrados</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">
            {currentRegistrations.toLocaleString()}
          </div>
          <div className="text-xs text-neutral-400">
            Contabilizados de forma externa
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-[#161616] border border-neutral-800 rounded-xl p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Estado del Motor</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white flex items-center gap-2">
            {!isQuotaReached && status === 'active' ? (
              <span className="text-emerald-400 text-lg font-semibold">100% Autónomo</span>
            ) : isQuotaReached ? (
              <span className="text-amber-400 text-lg font-semibold">Pausa Inteligente</span>
            ) : (
              <span className="text-neutral-400 text-lg font-semibold">Pausado Manual</span>
            )}
          </div>
          <div className="text-xs text-neutral-400">
            {isQuotaReached ? 'Cuota cumplida' : 'Procesos en segundo plano'}
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-[#161616] border border-neutral-800 rounded-xl p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Módulos de Captación</span>
            <Radio className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">
            {activeModulesCount} <span className="text-sm font-normal text-neutral-500">/ 8</span>
          </div>
          <div className="text-xs text-neutral-400 flex items-center justify-between">
            <span>Plan {plan.toUpperCase()}</span>
            <button
              onClick={onOpenModules}
              className="text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
            >
              Ver todos →
            </button>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-[#161616] border border-neutral-800 rounded-xl p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Tráfico Puente Interceptado</span>
            <ShieldCheck className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-cyan-300">
            {(campaign.clicksCount || 0).toLocaleString()} <span className="text-xs font-normal text-neutral-500">clics</span>
          </div>
          <div className="text-xs text-neutral-400 flex items-center justify-between">
            <span>Visitas orgánicas derivadas</span>
            <button
              onClick={onOpenIntegration}
              className="text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
            >
              Ver Enlace →
            </button>
          </div>
        </div>
      </div>
 
      {/* 3.5 SECCIÓN DE DESGLOSE POR MÓDULO & DIAGNÓSTICO INTELIGENTE 24H */}
      <ModuleConversionBreakdown
        campaign={campaign}
        onNavigateToModules={onOpenModules}
        onNavigateToIntegration={onOpenIntegration}
      />

      {/* 4. REAL-TIME ACTIVITY & LIVE CONVERSIONS FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Conversion Timeline Feed */}
        <div className="lg:col-span-2 bg-[#161616] border border-neutral-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div>
              <h3 className="text-sm font-bold text-white">
                Flujo de Conversiones en Tiempo Real
              </h3>
              <p className="text-xs text-neutral-400">
                Usuarios interceptados y contabilizados en tiempo real mediante tu Enlace Puente (/r/:id)
              </p>
            </div>
            <span className="text-xs font-mono text-neutral-400 tabular-nums">
              {campaign.recentConversions.length} eventos recientes
            </span>
          </div>

          {campaign.recentConversions.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Code2 className="w-8 h-8 text-neutral-600 mx-auto" />
              <div className="text-sm text-neutral-300 font-medium">Esperando primeras conversiones orgánicas</div>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                Tus 8 motores de adquisición están activos. Cada usuario humano que ingrese mediante tu Enlace Puente Inteligente aparecerá aquí de forma automática e inmediata.
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Tráfico 100% Humano · Sin Bots ni Cuotas Quemadas</span>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-neutral-800/80 max-h-80 overflow-y-auto pr-1">
              {campaign.recentConversions.map((conv) => (
                <div key={conv.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        conv.method === 'webhook'
                          ? 'bg-sky-400'
                          : conv.method === 'organic_click' || conv.method === 'bridge_router'
                          ? 'bg-emerald-400'
                          : 'bg-indigo-400'
                      }`}
                    />
                    <div className="min-w-0">
                      <div className="font-mono text-neutral-200 truncate">
                        {conv.userTag}
                      </div>
                      <div className="text-neutral-500 flex items-center gap-2 truncate">
                        <span>{conv.method.toUpperCase()}</span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{conv.referrer}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono text-neutral-400">
                      {new Date(conv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                    <div className="text-neutral-500 text-[10px] font-mono">
                      {conv.ipMasked}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Autonomous Architecture Summary */}
        <div className="bg-[#161616] border border-neutral-800 rounded-xl p-5 space-y-4">
          <div className="pb-3 border-b border-neutral-800">
            <h3 className="text-sm font-bold text-white">
              Ecosistema de Captación
            </h3>
            <p className="text-xs text-neutral-400">
              Orquestación autónoma coordinada
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
              <div className="font-medium text-emerald-400 flex items-center justify-between">
                <span>Módulos Base (1, 2, 3)</span>
                <span className="text-[10px] font-mono text-neutral-400">Activos</span>
              </div>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                SEO técnico, Indexación API directa a Google y envío automatizado a 50+ directorios de software.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
              <div className="font-medium text-sky-400 flex items-center justify-between">
                <span>Módulos Growth (4, 5)</span>
                <span className="text-[10px] font-mono text-neutral-400">
                  {plan === 'growth' || plan === 'enterprise' ? 'Activos' : 'Plan Growth'}
                </span>
              </div>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                Outbound en X & Foros Q&A con respuestas de valor contextual, protección Anti-Ban y motor de pitching para newsletters.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
              <div className="font-medium text-purple-400 flex items-center justify-between">
                <span>Módulos Enterprise (6, 7, 8)</span>
                <span className="text-[10px] font-mono text-neutral-400">
                  {plan === 'enterprise' ? 'Activos' : 'Plan Enterprise'}
                </span>
              </div>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                Micro-videos virales (Reels/TikTok), Programmatic SEO a gran escala y bot de alianzas con influencers.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onOpenModules}
              className="w-full py-2 px-3 text-xs font-medium text-center text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Explorar los 8 Módulos</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. WEEKLY SATISFACTION SURVEY MODAL (1x WEEK PROTOCOL) */}
      {isSurveyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-neutral-950 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Star className="w-5 h-5 fill-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Encuesta Semanal de Satisfacción
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Remitente oficial: kase.marketing.digital@gmail.com
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSurveyModalOpen(false)}
                className="text-neutral-500 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitSurvey} className="space-y-4">
              <div className="space-y-1.5 text-center py-2">
                <label className="text-xs font-medium text-neutral-300 block">
                  ¿Cómo calificarías el desempeño de tu campaña esta semana?
                </label>
                <div className="flex items-center justify-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSurveyStars(star)}
                      className="p-1 text-2xl transition-transform hover:scale-110 cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= surveyStars
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-neutral-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="text-[11px] font-mono text-neutral-400 mt-1">
                  {surveyStars >= 4 ? '🟢 Conforme con el servicio' : '🔴 Desconforme (Alerta inmediata al Administrador)'}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-300 flex items-center justify-between">
                  <span>Mensaje de conformidad o desconformidad:</span>
                  <span className="text-[10px] text-neutral-500 font-mono">KaSi AI Supervisor</span>
                </label>
                <textarea
                  value={surveyFeedback}
                  onChange={(e) => setSurveyFeedback(e.target.value)}
                  placeholder="Escribe aquí tu opinión, sugerencia o motivo de desconformidad si algo no cumple tus expectativas..."
                  rows={3}
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-emerald-500 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              {surveyResultMsg && (
                <div
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-start gap-2 ${
                    surveyResultMsg.type === 'alert'
                      ? 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                      : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                  }`}
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{surveyResultMsg.text}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSurveyModalOpen(false)}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingSurvey}
                  className="px-5 py-2 bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold rounded-xl text-xs transition-all shadow-md shadow-emerald-500/20 cursor-pointer flex items-center gap-1.5"
                >
                  <Send className={`w-3.5 h-3.5 ${isSubmittingSurvey ? 'animate-spin' : ''}`} />
                  <span>{isSubmittingSurvey ? 'Enviando...' : 'Enviar Valoración'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
