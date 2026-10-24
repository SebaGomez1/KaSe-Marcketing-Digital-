import React, { useState, useEffect } from 'react';
import { X, CreditCard, ShieldCheck, Zap, CheckCircle2, Lock, ArrowRight, ExternalLink, Info, AlertTriangle } from 'lucide-react';
import { Campaign, EngineValidationResult } from '../types/growth';

interface MercadoPagoCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign;
  onPaymentSuccess: (activatedCampaign: Campaign) => void;
}

export const MercadoPagoCheckoutModal: React.FC<MercadoPagoCheckoutModalProps> = ({
  isOpen,
  onClose,
  campaign,
  onPaymentSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [payerEmail, setPayerEmail] = useState('cliente@empresa.com');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isSimulation, setIsSimulation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGatewayLive, setIsGatewayLive] = useState(false);
  const [checkingGateway, setCheckingGateway] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);
  const [engineValidation, setEngineValidation] = useState<EngineValidationResult | null>(null);

  // Check if real Mercado Pago keys are active AND validate engines for campaign plan
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setCheckingGateway(true);

    Promise.all([
      fetch('/api/payments/mercadopago/config').then((r) => r.json()),
      fetch(`/api/system/validate-engines?plan=${campaign.plan || 'starter'}`).then((r) => r.json()),
    ])
      .then(([gwData, valData]) => {
        if (isMounted) {
          setIsGatewayLive(!!gwData.isLive);
          if (valData.success && valData.validation) {
            setEngineValidation(valData.validation);
          }
        }
      })
      .catch(() => {
        if (isMounted) setIsGatewayLive(false);
      })
      .finally(() => {
        if (isMounted) setCheckingGateway(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, campaign.plan]);

  if (!isOpen) return null;

  const planAmounts = {
    starter: 490,
    growth: 1890,
    enterprise: 8900,
  };

  const amount = campaign.billing?.monthlyAmount || planAmounts[campaign.plan] || 490;
  const currency = campaign.currency || 'USD';

  // 1. REAL MERCADO PAGO REDIRECT (CHECKOUT PRO)
  const handleRealMercadoPagoCheckout = async () => {
    setRedirecting(true);
    setError(null);
    try {
      const res = await fetch('/api/payments/mercadopago/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: campaign.id,
          amount,
          currency,
          title: `Campaña KaSe - ${campaign.name}`,
          payerEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al conectar con Mercado Pago');

      if (data.checkoutUrl) {
        // Redirect the user to the official Mercado Pago page where card numbers are securely requested
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('No se pudo generar el enlace de pago seguro');
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar checkout');
      setRedirecting(false);
    }
  };

  // 2. SANDBOX / DEMO SIMULATION (NO REAL MONEY CHARGED)
  const handleSimulatePaymentApproval = async () => {
    setLoading(true);
    setError(null);
    setIsSimulation(true);
    try {
      const res = await fetch('/api/payments/mercadopago/simulate-approval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: campaign.id,
          amount,
          currency,
          payerEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al procesar cobro');

      setPaymentSuccess(true);
      setTimeout(() => {
        onPaymentSuccess(data.campaign);
        onClose();
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'Error de pasarela');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative bg-[#121212] border border-emerald-500/40 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl my-auto text-neutral-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 font-mono border border-sky-500/30">
                MERCADO PAGO URUGUAY
              </span>
              <span className="text-[11px] text-neutral-400 font-mono">
                {isGatewayLive ? 'Pasarela Oficial' : 'Modo Demostración'}
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              Activación de Campaña Autónoma
            </h3>
          </div>
        </div>

        {paymentSuccess ? (
          <div className="py-6 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-white">
              {isSimulation ? '¡Campaña Activada en Modo Prueba!' : '¡Cobro Aprobado por Mercado Pago!'}
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed">
              {isSimulation ? (
                <>
                  Se ha simulado con éxito la confirmación del Webhook IPN de Mercado Pago. El estado de la campaña cambió a <strong className="text-emerald-400">"Activa"</strong> y los 8 motores autónomos se han encendido en segundo plano. <span className="block mt-1 text-emerald-300 font-semibold">(No se realizó ningún cargo a tarjeta de crédito).</span>
                </>
              ) : (
                <>
                  El Webhook IPN ha confirmado el pago. El estado de la campaña cambió a <strong className="text-emerald-400">"Activa"</strong> y los motores autónomos se han encendido en segundo plano.
                </>
              )}
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            {error && (
              <div className="p-2.5 bg-red-950/40 border border-red-800/60 rounded text-red-300">
                {error}
              </div>
            )}

            {/* Notification / Status badge */}
            {!checkingGateway && !isGatewayLive && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-300 text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Modo Demostración / Prueba Técnica</span>
                </div>
                <p className="text-[11px] text-amber-200/90 leading-relaxed">
                  Las credenciales privadas de cobro real (<code className="text-amber-100 bg-amber-950/60 px-1 rounded">MERCADO_PAGO_ACCESS_TOKEN</code>) aún no están configuradas en Vercel. Por seguridad, el sistema no solicita tarjetas de crédito reales y te permite <strong>probar la activación de los motores con $0.00 de costo</strong>.
                </p>
              </div>
            )}

            {/* Order Summary */}
            <div className="p-3.5 bg-neutral-900 rounded-xl border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Campaña a Iniciar:</span>
                <span className="font-bold text-white font-mono">{campaign.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Meta Contratada:</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {campaign.targetRegistrations.toLocaleString()} {campaign.targetUnitLabel}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Nivel de Suite:</span>
                <span className="font-mono text-white uppercase font-bold">
                  Plan {campaign.plan}
                </span>
              </div>
              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                <span className="text-neutral-200 font-semibold">Total a Facturar:</span>
                <span className="text-base font-bold font-mono text-emerald-400">
                  ${amount.toLocaleString()} {currency} / mes
                </span>
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1">
                Correo Electrónico de Facturación Mercado Pago *
              </label>
              <input
                type="email"
                required
                value={payerEmail}
                onChange={(e) => setPayerEmail(e.target.value)}
                className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Why no card here accordion/notice */}
            <div className="rounded-xl border border-neutral-800 bg-black/40 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowExplanation(!showExplanation)}
                className="w-full px-3 py-2 text-left flex items-center justify-between text-[11px] text-neutral-300 hover:text-white transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                  ¿Por qué no se pide el número de tarjeta aquí?
                </span>
                <span className="text-xs text-neutral-500">{showExplanation ? '−' : '+'}</span>
              </button>
              {showExplanation && (
                <div className="p-3 pt-0 text-[11px] text-neutral-400 border-t border-neutral-800/60 mt-1 leading-relaxed space-y-1.5">
                  <p>
                    Por estrictas normas internacionales de seguridad bancaria (<strong>normativa PCI-DSS</strong>), ninguna aplicación seria debe recopilar números de tarjeta en formularios propios.
                  </p>
                  <p>
                    En producción, al hacer clic en pagar, serás redirigido a la ventana oficial protegida de <strong>Mercado Pago Uruguay</strong> (donde se ingresa Visa, Mastercard, Oca, o cupón de Abitab/RedPagos). Luego Mercado Pago envía una notificación encriptada (IPN Webhook) para activar la campaña automáticamente.
                  </p>
                </div>
              )}
            </div>

            {/* Zero Risk Guarantee */}
            <div className="p-3 bg-neutral-900/60 rounded-xl border border-neutral-800 text-[11px] text-neutral-400 flex items-start gap-2">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Compromiso de Apagado Exacto KaSe:</strong> Únicamente cuando se completen las <strong className="text-neutral-200">{campaign.targetRegistrations.toLocaleString()} conversiones</strong> garantizadas se detendrán los motores. No hay sobrecuotas ocultas.
              </span>
            </div>

            {/* Escudo de Seguridad KaSe: Verificación de Motores en Vercel */}
            {engineValidation && !engineValidation.canProceed && (
              <div className="p-3 bg-rose-950/50 border border-rose-500/60 rounded-xl space-y-1.5 text-xs">
                <div className="flex items-center gap-2 font-bold text-rose-300">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Escudo de Seguridad KaSe: Cobro Preventivamente Bloqueado</span>
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  No se autoriza el cobro al cliente hasta verificar que las APIs del motor para el plan <strong>{campaign.plan.toUpperCase()}</strong> estén conectadas y operativas en Vercel. Esto protege al cliente y garantiza la entrega del 100% del servicio contratado.
                </p>
                <div className="text-[10px] text-rose-300 font-mono">
                  Motores pendientes: {engineValidation.missingModules.map((m) => m.name).join('; ')}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2 pt-2">
              {isGatewayLive ? (
                <>
                  <button
                    type="button"
                    onClick={handleRealMercadoPagoCheckout}
                    disabled={redirecting || loading || (engineValidation ? !engineValidation.canProceed : false)}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      engineValidation && !engineValidation.canProceed
                        ? 'bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed opacity-75'
                        : 'bg-sky-500 hover:bg-sky-400 text-black cursor-pointer shadow-lg shadow-sky-500/20'
                    }`}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>
                      {redirecting
                        ? 'Conectando con Mercado Pago...'
                        : engineValidation && !engineValidation.canProceed
                        ? '⛔ Cobro Bloqueado: Conecta las APIs en Vercel'
                        : `Pagar $${amount} ${currency} en Mercado Pago Uruguay`}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSimulatePaymentApproval}
                    disabled={loading || redirecting || (engineValidation ? !engineValidation.canProceed : false)}
                    className="w-full py-2 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-mono text-[11px] flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {loading
                        ? 'Simulando...'
                        : engineValidation && !engineValidation.canProceed
                        ? '⛔ Simulación Bloqueada: APIs Faltantes'
                        : 'Ejecutar simulación técnica de prueba ($0.00)'}
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleSimulatePaymentApproval}
                    disabled={loading || (engineValidation ? !engineValidation.canProceed : false)}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 ${
                      engineValidation && !engineValidation.canProceed
                        ? 'bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed opacity-75'
                        : 'bg-emerald-400 hover:bg-emerald-300 text-black glow-emerald cursor-pointer'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    <span>
                      {loading
                        ? 'Confirmando Pago y Encendiendo Motores...'
                        : engineValidation && !engineValidation.canProceed
                        ? '⛔ Cobro Bloqueado: Conecta las APIs en Vercel'
                        : `Pagar y Activar Motores ($${amount} ${currency})`}
                    </span>
                  </button>
                  <p className="text-[10px] text-neutral-500 text-center font-mono">
                    💡 Activación garantizada de tráfico real y enrutamiento con apagado exacto por píxel.
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
