import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Monitor, CheckCircle2, ChevronRight, HelpCircle, ShieldCheck } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallBannerProps {
  forceOpen?: boolean;
  onCloseForceOpen?: () => void;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({
  forceOpen = false,
  onCloseForceOpen,
}) => {
  const { isInstallable, isInstalled, isIOS, isChrome, install } = usePWAInstall();
  const [isOpen, setIsOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    // If running in standalone mode (already installed), never show
    if (isInstalled) {
      setIsOpen(false);
      return;
    }

    // Check if dismissed previously in this session
    const dismissed = sessionStorage.getItem('kase_pwa_dismissed');
    if (!dismissed) {
      // Immediately display on load as requested by user
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isInstalled]);

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
    }
  }, [forceOpen]);

  const handleDismiss = () => {
    sessionStorage.setItem('kase_pwa_dismissed', 'true');
    setIsOpen(false);
    if (onCloseForceOpen) onCloseForceOpen();
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setInstallSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
          if (onCloseForceOpen) onCloseForceOpen();
        }, 2000);
        return;
      }
    }
    // If deferred prompt was not triggered (e.g. mobile Chrome requires user interaction or iOS)
    setShowGuide(true);
  };

  if (isInstalled && !forceOpen) return null;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 sm:bottom-4 z-50 px-2 sm:px-6 pointer-events-none animate-in slide-in-from-bottom-6 duration-300">
      <div className="max-w-xl mx-auto bg-[#121212]/95 backdrop-blur-md border border-emerald-500/40 rounded-2xl p-4 sm:p-5 shadow-2xl shadow-black/80 pointer-events-auto">
        {installSuccess ? (
          <div className="flex items-center gap-3 py-2 text-emerald-400">
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white">¡KaSe instalada con éxito!</h4>
              <p className="text-xs text-neutral-300">Ya puedes acceder desde el icono en tu pantalla de inicio.</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">PWA Disponible</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-neutral-800 text-neutral-300 font-mono">Google Chrome / Móvil</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-0.5">
                    Instalar KaSe en tu Celular o Escritorio
                  </h3>
                </div>
              </div>

              <button
                onClick={handleDismiss}
                aria-label="Cerrar aviso"
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-300 mt-2.5 leading-relaxed">
              Accede a tu panel de campañas con un solo toque desde tu pantalla de inicio, sin barras de navegación y con carga ultra-rápida.
            </p>

            <div className="mt-3.5 flex flex-wrap items-center gap-2">
              <button
                onClick={handleInstallClick}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer glow-emerald"
              >
                <Download className="w-4 h-4" />
                <span>Instalar Ahora en mi Celular / PC</span>
              </button>

              <button
                onClick={() => setShowGuide(!showGuide)}
                className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-xl border border-neutral-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
                <span>{showGuide ? 'Ocultar guía' : '¿Cómo se instala?'}</span>
              </button>

              <button
                onClick={handleDismiss}
                className="px-3 py-2 text-neutral-400 hover:text-white text-xs transition-colors cursor-pointer"
              >
                Recordar más tarde
              </button>
            </div>

            {/* Visual step by step instructions guide */}
            {showGuide && (
              <div className="mt-3.5 p-3 rounded-xl bg-black/60 border border-neutral-800 text-xs space-y-2.5 animate-in fade-in duration-200">
                <div className="font-semibold text-white flex items-center gap-2">
                  <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Pasos para instalar según tu navegador:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-neutral-300">
                  <div className="p-2 bg-neutral-900/80 rounded-lg border border-neutral-800">
                    <span className="font-bold text-emerald-400 block mb-1">En Google Chrome (Android / PC):</span>
                    <ol className="list-decimal list-inside space-y-1 text-neutral-300">
                      <li>Toca los <strong className="text-white">tres puntos verticales (⋮)</strong> arriba a la derecha.</li>
                      <li>Selecciona <strong className="text-white">"Instalar aplicación"</strong> o <strong className="text-white">"Agregar a la pantalla principal"</strong>.</li>
                      <li>Confirma y se añadirá el icono de KaSe a tu teléfono.</li>
                    </ol>
                  </div>

                  <div className="p-2 bg-neutral-900/80 rounded-lg border border-neutral-800">
                    <span className="font-bold text-sky-400 block mb-1">En Safari (iPhone / iPad):</span>
                    <ol className="list-decimal list-inside space-y-1 text-neutral-300">
                      <li>Toca el botón <strong className="text-white">Compartir (cuadro con flecha ⬆️)</strong> abajo.</li>
                      <li>Baja un poco y selecciona <strong className="text-white">"Agregar al inicio" (➕)</strong>.</li>
                      <li>Toca "Agregar" arriba a la derecha y ¡listo!</li>
                    </ol>
                  </div>
                </div>

                <div className="text-[10px] text-neutral-400 flex items-center gap-1.5 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>No consume memoria de tiendas (Play Store/App Store) y se actualiza de forma automática en cada apertura.</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
