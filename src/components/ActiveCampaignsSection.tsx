import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Inicialización limpia de Supabase para el cliente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface AuditLog {
  id: string;
  campaign_id: string;
  timestamp: string;
  level: string;
  module: string;
  message: string;
  publication_url?: string; // Campo para los links reales de redes sociales
}

interface ActiveCampaignsSectionProps {
  campaignId: string;
}

export const ActiveCampaignsSection: React.FC<ActiveCampaignsSectionProps> = ({ campaignId }) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [activeTab, setActiveTab] = useState<'motores' | 'publicaciones'>('motores');
  const [loading, setLoading] = useState(true);

  // Carga inicial y suscripción en tiempo real (segundo a segundo) a la nube de Supabase
  useEffect(() => {
    if (!campaignId) return;

    const fetchInitialLogs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('system_audit_logs')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('timestamp', { ascending: false });

      if (!error && data) {
        setLogs(data);
      }
      setLoading(false);
    };

    fetchInitialLogs();

    // Suscripción Realtime estricta: Escucha cada inserción en system_audit_logs de esta campaña
    const channel = supabase
      .channel(`realtime-logs-${campaignId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'system_audit_logs',
          filter: `campaign_id=eq.${campaignId}`,
        },
        (payload) => {
          setLogs((prevLogs) => [payload.new as AuditLog, ...prevLogs]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campaignId]);

  // Filtrar logs que contienen links reales de publicaciones
  const publicacionesLinks = logs.filter(log => log.publication_url || (log.message && log.message.includes('http')));

  // Función interna para renderizar explicaciones inteligentes de calentamiento o retraso
  const renderEngineStatus = (log: AuditLog) => {
    const isCalentamiento = log.message?.toLowerCase().includes('calentamiento') || log.message?.toLowerCase().includes('jitter');
    
    if (isCalentamiento) {
      return (
        <div className="bg-amber-950/40 border border-amber-500/30 rounded-lg p-4 mt-2 text-sm text-amber-200">
          <p className="font-bold flex items-center gap-2">
            ⚠️ Modo Calentamiento y Anti-Bloqueo Activo
          </p>
          <p className="mt-1 opacity-90">
            {log.message}. Este intervalo controlado (jittering) simula comportamiento humano natural. Evita de forma estricta que algoritmos como los de X (Twitter) o Meta marquen tu contenido como spam, protegiendo la visibilidad de tu campaña.
          </p>
          <p className="text-xs mt-2 text-amber-400 font-mono">
            Próxima ventana de acción programada de forma automática.
          </p>
        </div>
      );
    }
    return <p className="text-gray-300 mt-1 text-sm font-mono bg-black/30 p-2 rounded border border-gray-800">{log.message}</p>;
  };

  if (loading) {
    return <div className="text-center p-8 text-gray-400 font-mono">Conectando con los motores en la nube...</div>;
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-white w-full max-w-5xl mx-auto shadow-2xl">
      {/* Sistema de Navegación del Flujo Transparente */}
      <div className="flex border-b border-gray-800 mb-6 gap-4">
        <button
          onClick={() => setActiveTab('motores')}
          className={`pb-3 text-sm font-bold uppercase tracking-wider transition-all ${
            activeTab === 'motores' ? 'border-b-2 border-emerald-500 text-emerald-400' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          ⚙️ Actividad de Motores (Tiempo Real)
        </button>
        <button
          onClick={() => setActiveTab('publicaciones')}
          className={`pb-3 text-sm font-bold uppercase tracking-wider transition-all relative ${
            activeTab === 'publicaciones' ? 'border-b-2 border-emerald-500 text-emerald-400' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          🔗 Enlaces Verificables Generados
          {publicacionesLinks.length > 0 && (
            <span className="ml-2 bg-emerald-500 text-black text-xs px-2 py-0.5 rounded-full font-extrabold animate-pulse">
              {publicacionesLinks.length}
            </span>
          )}
        </button>
      </div>

      {/* SECCIÓN 1: ACTIVIDAD DE MOTORES SEGUNDO A SEGUNDO */}
      {activeTab === 'motores' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-gray-950 p-3 rounded-lg border border-gray-800">
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              MONITOREO EN VIVO: CONSULTANDO TABLAS REMOTAS DE SUPABASE
            </span>
            <span className="text-xs text-gray-500 font-mono">Total eventos: {logs.length}</span>
          </div>

          {publicacionesLinks.length > 0 && (
            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-lg p-3 text-xs text-emerald-300 flex justify-between items-center">
              <span>🚀 Los motores ya generaron impactos visibles para tu negocio en redes sociales.</span>
              <button 
                onClick={() => setActiveTab('publicaciones')}
                className="bg-emerald-500 text-black px-3 py-1 rounded font-bold hover:bg-emerald-400 transition-all text-xs"
              >
                Ver enlaces de publicidad →
              </button>
            </div>
          )}

          {logs.length === 0 ? (
            <div className="text-center py-12 text-gray-500 border border-dashed border-gray-800 rounded-lg font-mono">
              Esperando inicialización de los motores por parte del planificador cron...
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {logs.map((log) => (
                <div key={log.id} className="p-4 bg-gray-950 rounded-lg border border-gray-800 hover:border-gray-700 transition-all">
                  <div className="flex justify-between items-start text-xs mb-1">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold uppercase tracking-wide">
                      {log.module.replace('cron_', '')}
                    </span>
                    <span className="text-gray-500 font-mono">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  {renderEngineStatus(log)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECCIÓN 2: NUEVA SECCIÓN DE ENLACES VERIFICABLES CON LINKS REALES */}
      {activeTab === 'publicaciones' && (
        <div className="space-y-4">
          <p className="text-gray-400 text-sm">
            Aquí puedes auditar y comprobar con tus propios ojos cada impacto publicitario generado por nuestra infraestructura de IA en tus canales digitales.
          </p>

          {publicacionesLinks.length === 0 ? (
            <div className="text-center py-12 text-gray-500 border border-dashed border-gray-800 rounded-lg p-6 font-mono">
              <p>No se registran publicaciones externas completadas aún.</p>
              <p className="text-xs text-amber-400 mt-2">
                Motivo: Los motores se encuentran actualmente en fase de análisis de nicho y calentamiento de cuentas para evitar penalizaciones. Revisa la pestaña de "Actividad de Motores" para ver el progreso minuto a minuto.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto pr-2">
              {publicacionesLinks.map((pub) => {
                // Extraer el link dinámico si viene embebido en el mensaje o en su columna dedicada
                const urlMatch = pub.publication_url || (pub.message && pub.message.match(/https?:\/\/[^\s]+/)?.[0]);
                const finalUrl = urlMatch ? urlMatch.replace(/[.,)]+$/, '') : '#';
                
                // Detección automática de plataforma para la UI limpia
                let plataforma = 'Canal Digital';
                if (finalUrl.includes('x.com') || finalUrl.includes('twitter.com')) plataforma = 'X (Twitter)';
                if (finalUrl.includes('instagram.com')) plataforma = 'Instagram';
                if (finalUrl.includes('tiktok.com')) plataforma = 'TikTok';
                if (finalUrl.includes('youtube.com')) plataforma = 'YouTube';
                if (finalUrl.includes('linkedin.com')) plataforma = 'LinkedIn';

                return (
                  <div key={pub.id} className="p-4 bg-gray-950 rounded-lg border border-emerald-900/40 hover:border-emerald-500/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-emerald-400">{plataforma}</span>
                        <span className="text-gray-600 text-xs font-mono">• {new Date(pub.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-1 italic">"{pub.message}"</p>
                    </div>
                    {finalUrl !== '#' && (
