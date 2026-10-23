import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Minimize2, 
  Maximize2, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Plus, 
  ExternalLink, 
  Check, 
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  Layers,
  Smartphone,
  CreditCard,
  Gauge,
  HelpCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { Campaign, User } from '../types/growth';

export interface KaseAssistantWidgetProps {
  activeTab?: string;
  onNavigateTab?: (tab: string) => void;
  activeCampaign?: Campaign | null;
  campaigns?: Campaign[];
  onToggleCampaignStatus?: () => Promise<void> | void;
  onResetCounter?: () => Promise<void> | void;
  onOpenNewCampaign?: () => void;
  onOpenInstallModal?: () => void;
  onOpenAuthModal?: () => void;
  onOpenOneDollarCheckout?: () => void;
  currentUser?: User | null;
  onSelectCampaign?: (id: string) => void;
}

interface ActionProposal {
  id: string;
  type: 'toggle_status' | 'navigate' | 'new_campaign' | 'install_app' | 'one_dollar_test' | 'reset_counter';
  title: string;
  description: string;
  target?: string;
  executed?: boolean;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  action?: ActionProposal;
}

export const KaseAssistantWidget: React.FC<KaseAssistantWidgetProps> = ({
  activeTab = 'dashboard',
  onNavigateTab,
  activeCampaign,
  campaigns = [],
  onToggleCampaignStatus,
  onResetCounter,
  onOpenNewCampaign,
  onOpenInstallModal,
  onOpenAuthModal,
  onOpenOneDollarCheckout,
  currentUser,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDockedHidden, setIsDockedHidden] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [executingActionId, setExecutingActionId] = useState<string | null>(null);

  const initialGreeting = `¡Hola! Soy KaSi ✨🤖, tu Copiloto Inteligente de KaSe Marketing Digital.

Estoy conectado directamente a todos los módulos y botones de tu panel. Conozco la estructura de tu campaña activa (${activeCampaign?.name || 'Vista General'}), los 8 motores de captación y el Enrutador Puente autónomo.

¿En qué te puedo ayudar o qué acción deseas que preparemos juntos? 🚀💬`;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: initialGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const speakText = (text: string) => {
    if (!voiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[*_#`~]/g, '').replace(/[\u{1F300}-\u{1F9FF}]/gu, '');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = 'es-ES';
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error', e);
    }
  };

  // Detect if the user wants to execute an action based on query text
  const detectActionProposal = (text: string): ActionProposal | undefined => {
    const q = text.toLowerCase();

    // 1. Pause / Resume campaign
    if (q.includes('pausar') || q.includes('frenar') || q.includes('detener') || q.includes('parar') || q.includes('apagar')) {
      if (activeCampaign && activeCampaign.status === 'active') {
        return {
          id: `act_${Date.now()}`,
          type: 'toggle_status',
          title: `Pausar Campaña "${activeCampaign.name}"`,
          description: 'Suspende de inmediato el flujo de los 8 motores para evitar consumir tu cuota.',
        };
      }
    }

    if (q.includes('reanudar') || q.includes('activar') || q.includes('encender') || q.includes('prender') || q.includes('continuar')) {
      if (activeCampaign && activeCampaign.status !== 'active') {
        return {
          id: `act_${Date.now()}`,
          type: 'toggle_status',
          title: `Reanudar Campaña "${activeCampaign.name}"`,
          description: 'Reactiva los 8 motores de crecimiento orgánico y el Enrutador Puente.',
        };
      }
    }

    // 2. New Campaign / Help creating a campaign (Very broad matching for everyday Spanish)
    if (
      q.includes('campaña') ||
      q.includes('campana') ||
      q.includes('dar de alta') ||
      q.includes('registrar app') ||
      q.includes('crear') ||
      q.includes('hacer') ||
      q.includes('lanzar') ||
      q.includes('empezar')
    ) {
      if (
        q.includes('hacer') ||
        q.includes('crear') ||
        q.includes('nueva') ||
        q.includes('alta') ||
        q.includes('ayud') ||
        q.includes('lanzar') ||
        q.includes('iniciar') ||
        q.includes('empezar') ||
        q.includes('configurar')
      ) {
        return {
          id: `act_${Date.now()}`,
          type: 'new_campaign',
          title: '➕ Abrir Formulario y Crear Campaña Ahora',
          description: 'Abre el asistente para registrar tu app, configurar tu nicho, URL y cuota meta.',
        };
      }
    }

    // 3. Navigate sections
    if (q.includes('simulador') || q.includes('ráfaga') || q.includes('rafaga') || q.includes('probar cuota')) {
      return {
        id: `act_${Date.now()}`,
        type: 'navigate',
        target: 'simulator',
        title: '🧪 Ir a Pestaña "Simulador de Cuota"',
        description: 'Te lleva al simulador para probar ráfagas de tráfico y corte automático.',
      };
    }

    if (q.includes('modulo') || q.includes('módulo') || q.includes('8') || q.includes('motores')) {
      return {
        id: `act_${Date.now()}`,
        type: 'navigate',
        target: 'modules',
        title: '🚀 Ir a Pestaña "Módulos (8)"',
        description: 'Te muestra el estado y configuración de cada uno de los 8 motores de crecimiento.',
      };
    }

    if (q.includes('precio') || q.includes('plan') || q.includes('cuanto cuesta') || q.includes('cuánto cuesta') || q.includes('comprar') || q.includes('pagar')) {
      return {
        id: `act_${Date.now()}`,
        type: 'navigate',
        target: 'plans',
        title: '💳 Ir a Pestaña "Planes y Precios"',
        description: 'Abre el comparador de planes oficiales y la calculadora personalizada.',
      };
    }

    if (q.includes('dashboard') || q.includes('inicio') || q.includes('tacometro') || q.includes('tacómetro') || q.includes('contador')) {
      return {
        id: `act_${Date.now()}`,
        type: 'navigate',
        target: 'dashboard',
        title: '📊 Ir al Dashboard Principal',
        description: 'Muestra los números en vivo de tu campaña, cuota y velocidad.',
      };
    }

    if (q.includes('integracion') || q.includes('integración') || q.includes('enlace') || q.includes('puente') || q.includes('webhook')) {
      return {
        id: `act_${Date.now()}`,
        type: 'navigate',
        target: 'integration',
        title: '🔌 Ir a "Integración Segura"',
        description: 'Copia tu Enlace Puente Inteligente (/r/:id) sin instalar ningún píxel.',
      };
    }

    if (q.includes('guia') || q.includes('guía') || q.includes('como funciona') || q.includes('cómo funciona') || q.includes('que hago') || q.includes('qué hago')) {
      return {
        id: `act_${Date.now()}`,
        type: 'navigate',
        target: 'guide',
        title: '📖 Ir a "¿Cómo funciona?" (Guía Oficial)',
        description: 'Paso a paso simple de cómo opera la arquitectura autónoma.',
      };
    }

    if (q.includes('instalar') || q.includes('celular') || q.includes('pwa') || q.includes('telefono') || q.includes('teléfono') || q.includes('app movil')) {
      return {
        id: `act_${Date.now()}`,
        type: 'install_app',
        title: '📱 Abrir Instalador de App Móvil (PWA)',
        description: 'Instala KaSe en tu celular Android o iPhone para tener acceso directo.',
      };
    }

    if ((q.includes('1 usd') || q.includes('1 dolar') || q.includes('un dolar') || q.includes('prueba mercado pago')) && currentUser?.role === 'super_admin') {
      return {
        id: `act_${Date.now()}`,
        type: 'one_dollar_test',
        title: '💳 Iniciar Autoprueba Mercado Pago ($1.00 USD)',
        description: 'Abre el checkout de $1 USD para comprobar acreditación bancaria directa.',
      };
    }

    if (q.includes('reiniciar contador') || q.includes('resetear contador') || q.includes('poner en cero') || q.includes('reset')) {
      return {
        id: `act_${Date.now()}`,
        type: 'reset_counter',
        title: `🔄 Resetear Contador de "${activeCampaign?.name || 'Campaña'}"`,
        description: 'Pone en 0 los registros y reactiva los motores de la campaña.',
      };
    }

    return undefined;
  };

  // Local knowledge answers when backend is unreachable or offline
  const getSmartReply = (question: string): string => {
    const q = question.toLowerCase();

    // 1. AYUDA DIRECTA PARA HACER O CREAR UNA CAMPAÑA
    if (
      q.includes('hacer una campaña') ||
      q.includes('hacer campaña') ||
      q.includes('crear una campaña') ||
      q.includes('crear campaña') ||
      q.includes('ayudame a hacer') ||
      q.includes('ayudar a hacer') ||
      q.includes('ayuda para campaña') ||
      q.includes('cómo hago una campaña') ||
      q.includes('como hago una campaña') ||
      q.includes('cómo crear una campaña') ||
      q.includes('como crear una campaña') ||
      q.includes('quiero hacer una campaña') ||
      q.includes('quiero crear una campaña') ||
      q.includes('dar de alta') ||
      q.includes('lanzar campaña') ||
      q.includes('empezar campaña')
    ) {
      return '¡Claro que sí! Con mucho gusto te ayudo a dar de alta y lanzar tu campaña paso a paso. 🚀✨\n\n' +
        'El proceso es muy rápido y solo te pide 4 datos básicos:\n' +
        '1️⃣ **Nombre de tu App o Producto**: Por ejemplo *"MiApp SaaS"* o *"Tienda Virtual"*.\n' +
        '2️⃣ **Enlace / Web de Destino**: La URL donde quieres que redirijamos a todos los visitantes.\n' +
        '3️⃣ **Tu Nicho o Sector**: Por ejemplo *"Productividad"*, *"E-commerce"*, *"Finanzas"*, etc.\n' +
        '4️⃣ **Tu Meta de Registros o Ventas**: Desde 1,000 hasta 25,000+ usuarios garantizados.\n\n' +
        '👇 **He preparado la acción aquí abajo.** Presiona el botón verde para abrir el formulario y crearla de inmediato con tu permiso:';
    }

    // 2. CLIENTES, VENTAS, TRÁFICO Y RESULTADOS
    if (q.includes('cliente') || q.includes('tráfico') || q.includes('trafico') || q.includes('visita') || q.includes('venta') || q.includes('cuanto usuario') || q.includes('cuánto usuario') || q.includes('llegan solo')) {
      return '¡Te explico con total precisión cómo funciona la llegada de clientes! 📈👥\n\n' +
        '1️⃣ **Los 8 Motores trabajan de forma autónoma**: Redactan y publican contenidos en X/Twitter, foros como Reddit, 50+ directorios de software, videos virales y envían URLs a Google Indexing API.\n' +
        '2️⃣ **Enlace Puente Inteligente**: Cada publicación lleva tu enlace `/r/:campaignId`. Cuando una persona real hace clic, el contador suma +1 al instante y la redirige a tu web.\n' +
        '3️⃣ **Tiempos de llegada**: El tráfico orgánico comienza a entrar progresivamente desde las primeras 24 a 48 horas tras activarse la campaña, aumentando su velocidad conforme Google y las redes indexan los enlaces.\n' +
        '4️⃣ **Auto-corte garantizado**: Al alcanzar exactamente tu cuota contratada, todos los motores se apagan de forma automática para no desperdiciar tráfico.';
    }

    // 3. ENRUTADOR PUENTE / PÍXEL
    if (q.includes('pixel') || q.includes('píxel') || q.includes('enlace') || q.includes('puente')) {
      return '¡Hola! ✨🎯 En KaSe hemos eliminado totalmente los viejos scripts de píxeles manuales:\n\n' +
        '1️⃣ **Enrutador Puente Inteligente**: Se procesa directamente en `/r/:campaignId`. Cada clic generado por los motores de tráfico pasa por este endpoint.\n' +
        '2️⃣ **Registro 100% Autónomo**: El servidor registra el click atómicamente en la base de datos (Supabase/Postgres) y suma +1 a `currentRegistrations`.\n' +
        '3️⃣ **Redirección Inmediata (HTTP 307)**: El usuario es transferido inmediatamente a la web de tu cliente sin esperas.\n' +
        '4️⃣ **Auto-Apagado por Cuota**: Si el contador alcanza la meta contratada, la función `evaluateQuotaAndEnforce()` apaga todos los motores al instante. ¡Cero scripts molestos en tu código! 🛡️⚡';
    }

    // 4. MÓDULOS DE MARKETING
    if (q.includes('modulo') || q.includes('módulo') || q.includes('8') || q.includes('motores')) {
      return '¡Claro que sí! 🚀💡 La suite cuenta con 8 motores autónomos de crecimiento orgánico:\n\n' +
        '🔹 **Mod 1 (SEO)**: Conector con Google Search Indexing API para indexar en <48h.\n' +
        '🔹 **Mod 2 (Redes)**: Publicación de hilos en X/Twitter vía API v2 y posts en LinkedIn.\n' +
        '🔹 **Mod 3 (Directorios)**: Fichas automáticas en Product Hunt, BetaList y 50+ directorios.\n' +
        '🔹 **Mod 4 (Reddit/Foros)**: Escucha activa de palabras clave y respuestas con valor vía Snoowrap.\n' +
        '🔹 **Mod 5 (Newsletters)**: Propuestas dirigidas a editores de boletines del sector.\n' +
        '🔹 **Mod 6 (Videos)**: Guiones de gancho (0-3s) para TikTok, Reels y Shorts.\n' +
        '🔹 **Mod 7 (pSEO)**: Páginas de comparación (/vs/alternativa) con alta conversión.\n' +
        '🔹 **Mod 8 (Influencers)**: Contacto con oferta de 30% recurrente para embajadores.\n\n' +
        '¡Puedes prender o apagar cualquiera desde la pestaña "Módulos (8)"! ✨🔥';
    }

    // 5. MERCADO PAGO, PRECIOS Y PAGOS
    if (q.includes('mercadopago') || q.includes('mercado pago') || q.includes('precio') || q.includes('plan') || q.includes('pago') || q.includes('costo') || q.includes('cuanto vale')) {
      return '¡Hablemos de finanzas y planes! 💳🇺🇾 Tu pasarela está conectada a Mercado Pago Uruguay mediante `/api/payments/mercadopago/create-preference`:\n\n' +
        '💰 **Planes Disponibles**:\n' +
        '- **Starter**: $490 USD (1,000 registros/ventas garantizados)\n' +
        '- **Growth**: $1,890 USD (5,000 registros/ventas garantizados)\n' +
        '- **Enterprise**: $8,900 USD (25,000 registros/ventas garantizados)\n\n' +
        'Además contamos con una calculadora interactiva en "Planes y Precios" para tarifas exactas a medida. Si eres Kathy, también tienes el botón para autoprueba de $1.00 USD. 💸✨';
    }

    // 6. GUÍA DE BOTONES
    if (q.includes('boton') || q.includes('botón') || q.includes('seccion') || q.includes('sección') || q.includes('donde') || q.includes('dónde') || q.includes('que hace') || q.includes('qué hace')) {
      return '¡Guía completa de cada botón de la plataforma! 🧭✨\n\n' +
        '🟢 **Navbar Superior**:\n' +
        '- Botón "+ Nueva Campaña": Abre el formulario para dar de alta una app con su nicho y cuota meta.\n' +
        '- Botón "📱 Instalar App": Abre el modal de instalación PWA en tu smartphone.\n' +
        '- Selector de Campañas: Cambia la app activa que se inspecciona en el panel.\n\n' +
        '📊 **Pestañas Principales**:\n' +
        '- "Dashboard": Tacómetro de registros, porcentaje de cuota, velocidad y botón de Pausar/Reanudar.\n' +
        '- "Módulos (8)": Los 8 motores con sus interruptores de encendido/apagado y botón de "Estrategia".\n' +
        '- "Integración Segura": Tu enlace puente inteligente `/r/:campaignId` para compartir sin instalar nada.\n' +
        '- "Simulador": Pruebas de saturación (+1, +25, +100 registros) para comprobar el apagado automático.\n' +
        '- "Planes y Precios": Selector de suscripción y cotizador.\n' +
        '- "Admin Global": Configuración de credenciales de Kathy Seba (Mercado Pago, Supabase, X, Google).\n\n' +
        '¿Deseas que ejecute alguna acción o te lleve a una pestaña? ¡Dímelo y lo hacemos! 🚀';
    }

    // 7. PAUSAR / REANUDAR
    if (q.includes('pausar') || q.includes('frenar') || q.includes('detener') || q.includes('parar')) {
      return `¡Entendido! He preparado la acción para pausar la campaña "${activeCampaign?.name || 'actual'}". Al confirmarla abajo, los 8 motores se detendrán al instante para no consumir más cuota. ⏸️🛡️`;
    }

    if (q.includes('reanudar') || q.includes('activar') || q.includes('encender') || q.includes('prender')) {
      return `¡Entendido! He preparado la acción para reanudar la campaña "${activeCampaign?.name || 'actual'}". Al confirmarla abajo, los motores retomarán la captación de tráfico de inmediato. ▶️⚡`;
    }

    // 8. QUÉ HAGO AHORA / POR DÓNDE EMPIEZO
    if (q.includes('que hago') || q.includes('qué hago') || q.includes('por donde empiezo') || q.includes('por dónde empiezo') || q.includes('como empiezo') || q.includes('cómo empiezo')) {
      return '¡Aquí tienes el camino simple para empezar ahora mismo! 🏁✨\n\n' +
        '1️⃣ **Paso 1: Dar de alta tu campaña**: Presiona el botón verde `+ Nueva Campaña` y pon el nombre y URL de tu web.\n' +
        '2️⃣ **Paso 2: Elegir tu plan de usuarios**: Selecciona cuántos registros quieres recibir (ej. 1,000 en Starter).\n' +
        '3️⃣ **Paso 3: Copiar tu Enlace Puente**: Ve a "Integración Segura" y usa tu enlace `/r/:id` en tus redes o anuncios.\n' +
        '4️⃣ **Paso 4: Relájate**: Los 8 motores generarán contenido y dirigirán el tráfico automáticamente hasta cumplir tu meta.';
    }

    return `¡Hola! Soy KaSi ✨🤖, tu Copiloto Oficial de KaSe. Conozco cada botón y módulo de tu plataforma. Puedo ayudarte a crear una campaña nueva, pausar o reanudar motores, guiarte a cualquier sección o responder cualquier duda técnica de tu negocio. ¿Qué te gustaría hacer ahora? ¡Dime y te ayudo al instante! 💡🚀`;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const action = detectActionProposal(text);

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let replyText = '';

      // Try server endpoint first with enriched context
      try {
        const historyPayload = messages.slice(-4).map((m) => ({
          role: m.role === 'user' ? 'user' : 'model',
          text: m.text,
        }));

        const res = await fetch('/api/ai/code-assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            message: text, 
            history: historyPayload,
            context: {
              activeTab,
              campaignName: activeCampaign?.name,
              campaignStatus: activeCampaign?.status,
              currentRegistrations: activeCampaign?.currentRegistrations,
              targetRegistrations: activeCampaign?.targetRegistrations,
              isSuperAdmin: currentUser?.role === 'super_admin',
            }
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.reply) {
            replyText = data.reply;
          }
        }
      } catch (err) {
        console.warn('Backend assistant offline, using local engine:', err);
      }

      if (!replyText) {
        replyText = getSmartReply(text);
      }

      const assistantMsg: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      speakText(replyText);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        text: getSmartReply(text),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Execute interactive action with explicit user confirmation
  const handleExecuteAction = async (msgId: string, action: ActionProposal) => {
    setExecutingActionId(action.id);
    try {
      if (action.type === 'toggle_status' && onToggleCampaignStatus) {
        await onToggleCampaignStatus();
      } else if (action.type === 'navigate' && action.target && onNavigateTab) {
        onNavigateTab(action.target);
      } else if (action.type === 'new_campaign') {
        if (!currentUser && onOpenAuthModal) {
          onOpenAuthModal();
        } else if (onOpenNewCampaign) {
          onOpenNewCampaign();
        }
      } else if (action.type === 'install_app' && onOpenInstallModal) {
        onOpenInstallModal();
      } else if (action.type === 'one_dollar_test' && onOpenOneDollarCheckout) {
        onOpenOneDollarCheckout();
      } else if (action.type === 'reset_counter' && onResetCounter) {
        await onResetCounter();
      }

      // Mark action as executed in message history
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id === msgId && m.action) {
            return {
              ...m,
              action: { ...m.action, executed: true },
            };
          }
          return m;
        })
      );
    } catch (err) {
      console.error('Error executing assistant action:', err);
    } finally {
      setExecutingActionId(null);
    }
  };

  const handleClearHistory = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setMessages([
      {
        id: 'welcome_reset',
        role: 'assistant',
        text: `¡Historial reiniciado! ✨🤖 Estoy listo para ayudarte con cualquier sección, botón o motor de KaSe. ¿Qué te gustaría hacer? 🚀`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <>
      {/* MINIMAL SLEEK TRIGGER BUTTON (Non-obstructive, compact 44x44px or collapsible notch) */}
      {!isOpen && !isDockedHidden && (
        <div className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6 flex items-center gap-1.5 select-none">
          {/* Subtle dock hide button */}
          <button
            onClick={() => setIsDockedHidden(true)}
            title="Ocultar a la orilla para máxima visibilidad"
            className="p-1 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 text-[10px] transition-all cursor-pointer opacity-70 hover:opacity-100"
          >
            <EyeOff className="w-3 h-3" />
          </button>

          {/* Main sleek launcher button */}
          <button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="group relative flex items-center gap-2 p-2.5 sm:px-3 sm:py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold shadow-xl shadow-emerald-500/25 transition-all transform hover:scale-105 active:scale-95 cursor-pointer border border-emerald-400/40"
            title="Abrir KaSi: Copiloto Inteligente de KaSe"
            aria-label="Abrir asistente inteligente"
          >
            <div className="relative w-6 h-6 rounded-full bg-black flex items-center justify-center text-emerald-400">
              <Bot className="w-3.5 h-3.5" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-black" />
            </div>

            <div className="hidden sm:flex items-center gap-1 text-xs">
              <span className="font-extrabold text-black">KaSi</span>
              <span className="text-[10px] bg-black/20 px-1 rounded font-mono font-bold">IA</span>
            </div>
          </button>
        </div>
      )}

      {/* DOCKED NOTCH (Minimal tab on the edge when user hides the full button) */}
      {!isOpen && isDockedHidden && (
        <button
          onClick={() => {
            setIsDockedHidden(false);
            setIsOpen(true);
          }}
          className="fixed bottom-6 right-0 z-40 px-2 py-1.5 bg-neutral-900/90 hover:bg-neutral-800 text-emerald-400 border-l border-y border-emerald-500/40 rounded-l-lg shadow-lg flex items-center gap-1.5 transition-all text-xs font-bold cursor-pointer"
          title="Restaurar Copiloto KaSi"
        >
          <Bot className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] font-mono text-emerald-300">KaSi</span>
        </button>
      )}

      {/* CHAT WINDOW MODAL */}
      {isOpen && (
        <div 
          className={`fixed z-50 transition-all duration-300 ease-in-out ${
            isMinimized 
              ? 'bottom-4 right-4 w-72 h-14' 
              : 'bottom-3 right-3 sm:bottom-5 sm:right-5 w-[94vw] sm:w-[420px] max-w-full h-[560px] max-h-[82vh]'
          } bg-[#0e0e0e] border border-neutral-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl`}
        >
          {/* HEADER */}
          <div className="px-3.5 py-2.5 bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border-b border-neutral-800 flex items-center justify-between gap-2 select-none">
            <div className="flex items-center gap-2">
              <div className="relative w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-400 p-0.5 shrink-0">
                <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-emerald-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-black" />
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-white truncate">KaSi · Copiloto de la Suite</h3>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-bold shrink-0">
                    ACTIVO
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400 truncate">
                  {activeCampaign ? `Campaña: ${activeCampaign.name}` : `Sección: ${activeTab}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-0.5 text-neutral-400 shrink-0">
              {/* Voice toggle */}
              <button
                type="button"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`p-1.5 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer ${voiceEnabled ? 'text-emerald-400' : 'text-neutral-500'}`}
                title={voiceEnabled ? 'Voz activada' : 'Activar lectura por voz'}
              >
                {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              {/* Clear history */}
              <button
                type="button"
                onClick={handleClearHistory}
                className="p-1.5 rounded-lg hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
                title="Reiniciar chat"
              >
                <RefreshCw className="w-3 h-3" />
              </button>

              {/* Minimize/Maximize */}
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
                title={isMinimized ? 'Expandir' : 'Minimizar'}
              >
                {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
              </button>

              {/* Close */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  }
                }}
                className="p-1.5 rounded-lg hover:bg-rose-950/40 hover:text-rose-400 transition-colors cursor-pointer"
                title="Cerrar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* CHAT BODY (Only when not minimized) */}
          {!isMinimized && (
            <>
              {/* QUICK SMART ACTIONS & NAVIGATION CHIPS */}
              <div className="px-3 py-1.5 bg-neutral-950 border-b border-neutral-900 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[10px]">
                {activeCampaign && (
                  <button
                    type="button"
                    onClick={() => handleSendMessage(activeCampaign.status === 'active' ? 'Pausa mi campaña' : 'Reanuda mi campaña')}
                    className="px-2 py-0.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-emerald-300 border border-neutral-800 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1"
                  >
                    {activeCampaign.status === 'active' ? (
                      <>
                        <Pause className="w-2.5 h-2.5 text-amber-400" />
                        <span>Pausar Campaña</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-2.5 h-2.5 text-emerald-400" />
                        <span>Reanudar Campaña</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleSendMessage('Quiero dar de alta una nueva campaña')}
                  className="px-2 py-0.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-sky-300 border border-neutral-800 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-2.5 h-2.5 text-sky-400" />
                  <span>+ Nueva Campaña</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSendMessage('¿Cómo funciona el Enrutador Puente sin píxel?')}
                  className="px-2 py-0.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-teal-300 border border-neutral-800 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>🔌</span>
                  <span>Enrutador Puente</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSendMessage('¿Qué hace cada uno de los 8 motores?')}
                  className="px-2 py-0.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-purple-300 border border-neutral-800 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>🚀</span>
                  <span>8 Módulos</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSendMessage('¿Qué hace cada botón de la aplicación?')}
                  className="px-2 py-0.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-amber-300 border border-neutral-800 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>🧭</span>
                  <span>Guía de Botones</span>
                </button>
              </div>

              {/* MESSAGES LIST */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-400 p-0.5 shrink-0 mt-0.5">
                          <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-emerald-400 text-[9px]">
                            🤖
                          </div>
                        </div>
                      )}

                      <div
                        className={`max-w-[88%] rounded-2xl px-3 py-2 space-y-2 shadow-md ${
                          isUser
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none'
                            : 'bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-bl-none'
                        }`}
                      >
                        <div className="whitespace-pre-wrap leading-relaxed text-[11px] selection:bg-black selection:text-white">
                          {msg.text}
                        </div>

                        {/* INTERACTIVE ACTION CARD WITH USER PERMISSION */}
                        {msg.action && (
                          <div className="mt-2 p-2.5 rounded-xl bg-black/60 border border-emerald-500/30 space-y-2">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-bold text-white flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-emerald-400" />
                                {msg.action.title}
                              </span>
                              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1 rounded">
                                Requiere Permiso
                              </span>
                            </div>
                            <p className="text-[10px] text-neutral-400">
                              {msg.action.description}
                            </p>

                            {msg.action.executed ? (
                              <div className="py-1 px-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold flex items-center gap-1.5">
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span>Acción confirmada y ejecutada con éxito</span>
                              </div>
                            ) : (
                              <button
                                type="button"
                                disabled={executingActionId === msg.action.id}
                                onClick={() => handleExecuteAction(msg.id, msg.action!)}
                                className="w-full py-1.5 px-3 rounded-lg bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-black font-extrabold text-[10px] transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-500/20"
                              >
                                {executingActionId === msg.action.id ? (
                                  <>
                                    <div className="w-2.5 h-2.5 rounded-full bg-black animate-ping" />
                                    <span>Ejecutando...</span>
                                  </>
                                ) : (
                                  <>
                                    <Check className="w-3 h-3 text-black" />
                                    <span>Confirmar y Ejecutar Acción</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        )}

                        <div
                          className={`text-[9px] font-mono text-right ${
                            isUser ? 'text-emerald-200/70' : 'text-neutral-500'
                          }`}
                        >
                          {msg.timestamp}
                        </div>
                      </div>

                      {isUser && (
                        <div className="w-5 h-5 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-white text-[9px] shrink-0 mt-0.5 font-bold">
                          Tú
                        </div>
                      )}
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex gap-2 justify-start items-center">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-[9px]">
                      🤖
                    </div>
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl rounded-bl-none px-3 py-2 flex items-center gap-2 text-neutral-400 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-[11px]">KaSi está respondiendo... ✨</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* INPUT FORM */}
              <div className="p-2.5 bg-neutral-950 border-t border-neutral-800">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-1.5"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Pídele a KaSi una acción o pregunta sobre cualquier botón..."
                    className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    className="p-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 disabled:opacity-40 disabled:hover:bg-emerald-400 text-black font-bold transition-all cursor-pointer shadow-sm shadow-emerald-500/20 shrink-0"
                    title="Enviar mensaje"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
                <div className="mt-1 flex items-center justify-between text-[9px] text-neutral-500 px-1">
                  <span>Guía y ejecuta con tu permiso directo</span>
                  <span className="font-mono text-emerald-400">100% Autónomo</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
