import React, { useState } from 'react';
import { 
  Smartphone, 
  Download, 
  X, 
  CheckCircle2, 
  Share2, 
  MoreVertical, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  ArrowRight 
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, isChrome, install } = usePWAInstall();
  const [installSuccess, setInstallSuccess] = useState(false);
  const [deviceTab, setDeviceTab] = useState<'android' | 'ios'>(isIOS ? 'ios' : 'android');

  if (!isOpen) return null;

  const handleDirectInstall = async () => {
    if (isInstallable) {
      const res = await install();
      if (res) {
        setInstallSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2200);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative bg-[#121212] border border-emerald-500/40 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl shadow-emerald-500/10 my-auto text-neutral-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                PWA OFICIAL
              </span>
              <span className="text-xs text-neutral-400 font-mono">100% Nativo</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
              Instalar KaSe Marketing en tu Celular
            </h3>
          </div>
        </div>

        {installSuccess ? (
          <div className="p-6 bg-emerald-500/10 border border-emerald-500/40 rounded-xl text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-white">¡Aplicación Instalada con Éxito!</h4>
            <p className="text-xs text-neutral-300">
              Busca el icono de KaSe en la pantalla de inicio de tu celular para ingresar directo.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-neutral-300 leading-relaxed">
              Instala la aplicación en tu smartphone Android o iPhone para monitorear el progreso de tus campañas, recibir alertas de conversiones en tiempo real y gestionar tus motores sin depender de la barra de navegación del explorador.
            </p>

            {/* Direct 1-Click Install Button if supported */}
            {isInstallable && (
              <button
                onClick={handleDirectInstall}
                className="w-full py-3 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-sm flex items-center justify-center gap-2 transition-all glow-emerald cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <Download className="w-4 h-4" />
                <span>Instalar Ahora en 1 Clic (Nativo)</span>
              </button>
            )}

            {/* Device Selector Tabs */}
            <div className="pt-2">
              <div className="flex rounded-lg bg-neutral-900 p-1 border border-neutral-800 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setDeviceTab('android')}
                  className={`flex-1 py-1.5 rounded-md transition-all text-center cursor-pointer ${
                    deviceTab === 'android'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  📱 Android (Google Chrome)
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceTab('ios')}
                  className={`flex-1 py-1.5 rounded-md transition-all text-center cursor-pointer ${
                    deviceTab === 'ios'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  🍏 iPhone / iPad (Safari)
                </button>
              </div>

              {/* Instructions per device */}
              <div className="mt-3 p-4 rounded-xl bg-black/60 border border-neutral-800 space-y-3 text-xs">
                {deviceTab === 'android' ? (
                  <div className="space-y-2.5">
                    <div className="font-bold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-400 flex items-center justify-center text-[11px] font-mono">1</span>
                      <span>Abre el menú de Google Chrome:</span>
                    </div>
                    <p className="text-neutral-300 pl-7">
                      Toca el icono de los <strong className="text-white">tres puntos verticales (⋮)</strong> en la esquina superior derecha del navegador.
                    </p>

                    <div className="font-bold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-400 flex items-center justify-center text-[11px] font-mono">2</span>
                      <span>Selecciona la opción de instalación:</span>
                    </div>
                    <p className="text-neutral-300 pl-7">
                      Presiona <strong className="text-emerald-400">"Instalar aplicación"</strong> o <strong className="text-white">"Agregar a la pantalla principal"</strong>.
                    </p>

                    <div className="font-bold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-400 flex items-center justify-center text-[11px] font-mono">3</span>
                      <span>Confirmación inmediata:</span>
                    </div>
                    <p className="text-neutral-300 pl-7">
                      Toca "Instalar" en la ventana emergente. ¡Listo! Se creará el acceso directo con icono oficial en tu pantalla.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <div className="font-bold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-400 flex items-center justify-center text-[11px] font-mono">1</span>
                      <span>Toca el botón Compartir en Safari:</span>
                    </div>
                    <p className="text-neutral-300 pl-7">
                      En la barra inferior de Safari, pulsa el icono de <strong className="text-white">Compartir (el cuadro con una flecha hacia arriba ⎋)</strong>.
                    </p>

                    <div className="font-bold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-400 flex items-center justify-center text-[11px] font-mono">2</span>
                      <span>Elige "Agregar al inicio":</span>
                    </div>
                    <p className="text-neutral-300 pl-7">
                      Desliza hacia abajo en el menú de opciones y selecciona <strong className="text-emerald-400">"Agregar al inicio" (+)</strong>.
                    </p>

                    <div className="font-bold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-400 flex items-center justify-center text-[11px] font-mono">3</span>
                      <span>Confirmar:</span>
                    </div>
                    <p className="text-neutral-300 pl-7">
                      Pulsa "Agregar" en la esquina superior derecha. La app quedará instalada como app nativa sin marco de navegador.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Benefits summary */}
            <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-neutral-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sin ocupar memoria en tienda (PWA ultraligera)</span>
              </span>
              <span className="font-mono text-emerald-400 font-bold">&lt; 2 MB</span>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold border border-neutral-700 transition-colors cursor-pointer"
            >
              Entendido / Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
