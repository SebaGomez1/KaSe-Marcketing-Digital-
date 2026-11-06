import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw, 
  Cpu, 
  CheckCircle2, 
  Terminal,
  ExternalLink
} from 'lucide-react';
import { Campaign, ModuleDefinition, CampaignModuleState } from '../types/growth';

interface ModuleDetailModalProps {
  moduleDef: ModuleDefinition;
  campaign?: Campaign | null;
  onClose: () => void;
}

export const ModuleDetailModal: React.FC<ModuleDetailModalProps> = ({
  moduleDef,
  campaign,
  onClose,
}) => {
  const [loadingAi, setLoadingAi] = useState(false);
  const [generatedAsset, setGeneratedAsset] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const modState: Partial<CampaignModuleState> & { active?: boolean; itemsProcessed?: number; lastExecution?: string; last_published_links?: string[] } = campaign?.modules?.[moduleDef.id] || {
    active: true,
    itemsProcessed: 0,
    lastExecution: 'Listo para ejecución autónoma',
    last_published_links: [],
  };

  const handleGenerateAsset = async () => {
    setLoadingAi(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/ai/generate-growth-asset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleType: moduleDef.id,
          appName: campaign?.name || 'KaSe Marketing Digital',
          niche: campaign?.niche || 'Marketing Autónomo & Captación SaaS',
          targetUrl: campaign?.targetUrl || 'https://kase.marketing',
          description: campaign?.description || 'Ecosistema de 8 motores para captación masiva de usuarios reales y ventas',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al invocar motor de IA');
      }

      setGeneratedAsset(data.data);
    } catch (err: any) {
      setErrorMsg(err.message || 'No se pudo conectar con el motor de IA');
    } finally {
      setLoadingAi(false);
    }
  };

  // Automatically trigger AI generation on open so user sees working results immediately
  useEffect(() => {
    handleGenerateAsset();
  }, [moduleDef.id]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      {/* Floating mobile close button in case modal overflows mobile screen */}
      <button
        onClick={onClose}
        aria-label="Cerrar modal"
        className="fixed top-3 right-3 z-50 p-2 bg-neutral-900/90 text-neutral-300 hover:text-white rounded-full border border-neutral-700 shadow-2xl sm:hidden cursor-pointer"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="relative bg-[#141414] border border-neutral-700 rounded-xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Sticky Header with visible touch-friendly close button */}
        <div className="sticky top-0 z-20 px-4 sm:px-6 py-3.5 border-b border-neutral-800 bg-[#181818] flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3 pr-2">
            <span className="font-mono text-xs text-neutral-400 font-semibold">
              {moduleDef.number < 10 ? `0${moduleDef.number}.` : `${moduleDef.number}.`}
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>{moduleDef.title}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-normal">
                  {moduleDef.category === 'base' ? 'Módulo Base' : 'Módulo Avanzado'}
                </span>
              </h2>
              <p className="text-[11px] text-neutral-400">{moduleDef.subtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-200 bg-neutral-800 hover:bg-neutral-700 hover:text-white border border-neutral-700 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
            <span className="hidden xs:inline">Cerrar</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-xs overscroll-contain">
          {/* 3 Core Client Explanations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-[#181818] border border-neutral-800 rounded-lg p-3.5 space-y-1">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">
                1. ¿Para qué sirve?
              </span>
              <p className="text-xs text-neutral-200 leading-relaxed">
                {moduleDef.purpose}
              </p>
            </div>

            <div className="bg-[#181818] border border-neutral-800 rounded-lg p-3.5 space-y-1">
              <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wide">
                2. ¿Qué hace la máquina?
              </span>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {moduleDef.howItWorks}
              </p>
            </div>

            <div className="bg-[#181818] border border-neutral-800 rounded-lg p-3.5 space-y-1">
              <span className="text-[11px] font-bold text-neutral-200 uppercase tracking-wide">
                3. ¿Qué obtienes tú?
              </span>
              <p className="text-xs text-neutral-200 leading-relaxed">
                {moduleDef.deliverable}
              </p>
            </div>
          </div>

          {/* Operational Metrics & State */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-lg">
              <div className="text-neutral-500">{moduleDef.metricLabel}</div>
              <div className="text-lg font-bold font-mono text-white mt-1 tabular-nums">
                {(modState?.itemsProcessed ?? 0).toLocaleString()}
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-lg">
              <div className="text-neutral-500">Última Ejecución en Segundo Plano</div>
              <div className="text-sm font-medium text-neutral-200 mt-1">
                {modState.lastExecution}
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-lg">
              <div className="text-neutral-500">Requisito de Plan</div>
              <div className="text-sm font-mono text-sky-400 mt-1 uppercase">
                Plan {moduleDef.requiredPlan}
              </div>
            </div>
          </div>

          {/* Real-Time Live Destination Verification Links (Minute-by-Minute Feed) */}
          {modState.last_published_links && modState.last_published_links.length > 0 && (
            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Enlaces de Verificación en Vivo (Publicados en Red):</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-900/40 px-2 py-0.5 rounded border border-emerald-600/30">
                  Verificado en Vivo
                </span>
              </div>
              <div className="space-y-1.5">
                {modState.last_published_links.map((link: string, idx: number) => (
                  <a
                    key={idx}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-2 p-2 rounded-lg bg-black/60 border border-neutral-800 hover:border-emerald-500/40 text-sky-400 hover:text-sky-300 text-xs font-mono transition-colors group cursor-pointer"
                  >
                    <span className="truncate">{link}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-70 group-hover:opacity-100" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* AI Generator Action Box */}
          <div className="bg-gradient-to-b from-neutral-900 to-[#121212] border border-neutral-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Demostración en Vivo con IA (Activo Generado para tu App)</span>
                </h4>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Ejemplo adaptado {campaign ? `a "${campaign.name}"` : 'demostrativo para tu nicho'} listo para ser inyectado en la red de difusión.
                </p>
              </div>

              <button
                onClick={handleGenerateAsset}
                disabled={loadingAi}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-black bg-emerald-400 hover:bg-emerald-300 rounded-md transition-colors cursor-pointer shrink-0 glow-emerald"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingAi ? 'animate-spin' : ''}`} />
                <span>{loadingAi ? 'Generando...' : 'Regenerar con IA'}</span>
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-950/40 border border-red-800/60 rounded text-red-300 text-xs">
                {errorMsg}
              </div>
            )}

            {/* AI Generated Output Display */}
            {generatedAsset ? (
              <div className="space-y-3 pt-2 border-t border-neutral-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Activo listo para difusión en {moduleDef.title}
                  </span>
                  <button
                    onClick={() => handleCopy(JSON.stringify(generatedAsset, null, 2))}
                    className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado' : 'Copiar Formato'}</span>
                  </button>
                </div>

                <div className="bg-black border border-neutral-800 rounded-lg p-4 font-mono text-[11px] text-neutral-300 overflow-x-auto max-h-72 leading-relaxed">
                  <pre>{JSON.stringify(generatedAsset, null, 2)}</pre>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-neutral-500 space-y-1">
                <RefreshCw className="w-5 h-5 mx-auto text-emerald-400 animate-spin mb-1" />
                <p>Cargando demostración con IA para tu aplicación...</p>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Footer with Cancel and Close */}
        <div className="sticky bottom-0 z-20 px-4 sm:px-6 py-3 border-t border-neutral-800 bg-[#181818] flex items-center justify-between shrink-0 text-xs">
          <span className="text-neutral-500 hidden sm:inline">
            Pipeline gestionado mediante colas de tareas autónomas
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium transition-colors cursor-pointer"
          >
            ✕ Cerrar Ventana
          </button>
        </div>
      </div>
    </div>
  );
};
