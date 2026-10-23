import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ExternalLink, 
  Webhook, 
  Copy, 
  Check, 
  Play, 
  CheckCircle2, 
  Lock,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Campaign } from '../types/growth';

interface IntegrationPanelProps {
  campaign: Campaign;
  onRefreshCampaign: () => void;
}

export const IntegrationPanel: React.FC<IntegrationPanelProps> = ({
  campaign,
  onRefreshCampaign,
}) => {
  const [activeTab, setActiveTab] = useState<'bridge' | 'webhook'>('bridge');
  const [copiedBridge, setCopiedBridge] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  
  // Webhook tester state
  const [testEmail, setTestEmail] = useState('nuevo.usuario@empresa.com');
  const [testReferrer, setTestReferrer] = useState('https://google.com/search');
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [webhookResult, setWebhookResult] = useState<any>(null);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const bridgeUrl = `${baseUrl}/r/${campaign.id}`;
  const webhookUrl = `${baseUrl}/api/webhook/conversion/${campaign.id}`;

  const curlSnippet = `curl -X POST "${webhookUrl}" \\
  -H "Content-Type: application/json" \\
  -H "x-kase-secret: ${campaign.webhookSecret}" \\
  -d '{
    "userId": "usr_109283",
    "email": "${testEmail}",
    "referrer": "${testReferrer}"
  }'`;

  const nodeSnippet = `// Node.js / Express Backend Example
const trackConversion = async (userData) => {
  const response = await fetch('${webhookUrl}', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-kase-secret': '${campaign.webhookSecret}'
    },
    body: JSON.stringify({
      userId: userData.id,
      email: userData.email,
      referrer: req.headers['referer'] || 'direct'
    })
  });
  const data = await response.json();
  console.log('[KaSe] Conversión contabilizada:', data);
};`;

  const handleCopyBridge = () => {
    navigator.clipboard.writeText(bridgeUrl);
    setCopiedBridge(true);
    setTimeout(() => setCopiedBridge(false), 2000);
  };

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlSnippet);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const handleTestWebhook = async () => {
    setTestingWebhook(true);
    setWebhookResult(null);
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-kase-secret': campaign.webhookSecret,
        },
        body: JSON.stringify({
          userId: `test_usr_${Math.random().toString(36).substring(2, 7)}`,
          email: testEmail,
          referrer: testReferrer,
        }),
      });
      const data = await res.json();
      setWebhookResult(data);
      onRefreshCampaign();
    } catch (err: any) {
      setWebhookResult({ error: err.message || 'Error de conexión' });
    } finally {
      setTestingWebhook(false);
    }
  };

  return (
    <div className="bg-[#141414] border border-neutral-800 rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20">
              ZERO-INSTALL
            </span>
            <span className="text-xs text-neutral-400 font-mono">Arquitectura Autónoma</span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">
            Centro de Atribución y Conectividad Externa
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Canaliza visitas automáticamente con el Enrutador Puente o conecta tu backend vía Webhook blindado.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-lg shrink-0">
          <button
            onClick={() => setActiveTab('bridge')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'bridge'
                ? 'bg-emerald-500 text-black shadow-md font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Enrutador Puente (Recomendado)</span>
          </button>
          <button
            onClick={() => setActiveTab('webhook')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'webhook'
                ? 'bg-emerald-500 text-black shadow-md font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Webhook className="w-3.5 h-3.5" />
            <span>Webhook Criptográfico (API)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ENRUTADOR PUENTE AUTÓNOMO */}
      {activeTab === 'bridge' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Atribución 100% Autónoma sin Instalación de Scripts</span>
            </div>
            <p className="text-neutral-300 leading-relaxed">
              No necesitas modificar el código de tu sitio web ni pegar scripts manuales. Los 8 motores de crecimiento distribuyen tu enlace personalizado del <strong>Enrutador Puente</strong>. Cada visitante que hace clic es contabilizado de forma instantánea y redirigido en milisegundos hacia tu URL de destino.
            </p>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-white">
              Tu Enlace del Enrutador Puente Autónomo:
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                readOnly
                value={bridgeUrl}
                className="flex-1 bg-black border border-neutral-700 rounded-lg px-3.5 py-2.5 font-mono text-xs text-emerald-400 select-all"
              />
              <button
                onClick={handleCopyBridge}
                className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copiedBridge ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedBridge ? '¡Copiado!' : 'Copiar Enlace'}</span>
              </button>
              <a
                href={bridgeUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Probar Redirección</span>
              </a>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-neutral-400">
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              <span>Redirige de forma segura (HTTP 307) a: <strong className="text-white font-mono">{campaign.targetUrl}</strong></span>
            </div>
          </div>

          {/* Guarantee info */}
          <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Protocolo de Apagado de Cuota Exacto</span>
            </div>
            <p className="text-neutral-400 leading-relaxed text-[11px]">
              El Enrutador Puente audita en tiempo real cada clic. En el momento en que se alcance la cuota contratada de <strong className="text-emerald-400 font-mono">{campaign.targetRegistrations.toLocaleString()} {campaign.targetUnitLabel}</strong>, todos los 8 motores se apagan automáticamente para garantizar que no haya cobros imprevistos.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: WEBHOOK CRIPTOGRÁFICO BACKEND */}
      {activeTab === 'webhook' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-4 bg-purple-950/20 border border-purple-500/30 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-purple-400">
              <Lock className="w-4 h-4" />
              <span>Integración Backend Blindada Criptográficamente</span>
            </div>
            <p className="text-neutral-300 leading-relaxed">
              Si cuentas con un backend propio y prefieres reportar conversiones internas de forma programática, utiliza este Webhook. La petición requiere validar la cabecera <code className="text-purple-300 bg-purple-950/60 px-1 py-0.5 rounded">x-kase-secret</code> para evitar cualquier inyección fraudulenta.
            </p>
          </div>

          {/* Webhook URL & Secret */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white mb-1.5">
                Endpoint Receptor del Webhook (POST):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={webhookUrl}
                  className="flex-1 bg-black border border-neutral-700 rounded-lg px-3.5 py-2.5 font-mono text-xs text-purple-300 select-all"
                />
                <button
                  onClick={handleCopyWebhook}
                  className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  {copiedWebhook ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedWebhook ? '¡Copiado!' : 'Copiar URL'}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white mb-1.5">
                Clave Secreta de Firma (Cabecera x-kase-secret):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={campaign.webhookSecret}
                  className="flex-1 bg-black border border-neutral-700 rounded-lg px-3.5 py-2.5 font-mono text-xs text-amber-300 select-all"
                />
              </div>
            </div>
          </div>

          {/* cURL Snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white">Ejemplo cURL para Pruebas:</label>
              <button
                onClick={handleCopyCurl}
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copiar cURL</span>
              </button>
            </div>
            <pre className="p-3.5 bg-black border border-neutral-800 rounded-xl font-mono text-[11px] text-neutral-300 overflow-x-auto leading-relaxed">
              {curlSnippet}
            </pre>
          </div>

          {/* Live Webhook Tester */}
          <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 space-y-3">
            <h4 className="text-xs font-bold text-white">Simulador de Envío de Webhook en Vivo:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-neutral-400 block mb-1">Email del Usuario:</label>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="text-neutral-400 block mb-1">Referrer / Origen:</label>
                <input
                  type="text"
                  value={testReferrer}
                  onChange={(e) => setTestReferrer(e.target.value)}
                  className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleTestWebhook}
                disabled={testingWebhook}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-purple-500/20"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{testingWebhook ? 'Enviando...' : 'Disparar Webhook de Prueba'}</span>
              </button>
            </div>

            {webhookResult && (
              <pre className="p-3 bg-black border border-neutral-800 rounded-lg font-mono text-[11px] text-purple-300 overflow-x-auto">
                {JSON.stringify(webhookResult, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
