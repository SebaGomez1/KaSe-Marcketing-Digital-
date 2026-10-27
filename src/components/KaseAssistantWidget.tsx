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
  EyeOff,
  Wifi,
  WifiOff,
  Zap,
  BarChart3,
  Rocket,
  Flame,
  CheckCircle2,
  TrendingUp,
  Cpu,
  ShieldCheck,
  UserPlus
} from 'lucide-react';
import { Campaign, User } from '../types/growth';
import { generateKaSiReply } from '../lib/kasiKnowledgeEngine';

export interface KaseAssistantWidgetProps {
  activeTab?: string;
  onNavigateTab?: (tab: string) => void;
  activeCampaign?: Campaign | null;
  campaigns?: Campaign[];
  onToggleCampaignStatus?: () => Promise<void> | void;
  onSimulateBurst?: (count: number) => Promise<void> | void;
  onOpenNewCampaign?: () => void;
  onOpenInstallModal?: () => void;
  onOpenAuthModal?: () => void;
  onOpenOneDollarCheckout?: () => void;
  currentUser?: User | null;
  onSelectCampaign?: (id: string) => void;
  isOnline?: boolean;
}

export interface ActionProposal {
  id: string;
  type: 'toggle_status' | 'navigate' | 'new_campaign' | 'install_app' | 'one_dollar_test' | 'reset_counter' | 'simulate_burst' | 'audit_campaign' | 'open_auth';
  title: string;
  description: string;
  target?: string;
  count?: number;
  payload?: any;
  executed?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  action?: ActionProposal;
  suggestions?: string[];
  source?: string;
}

// Lightweight Markdown Formatter for pristine typography without external heavy deps
const FormattedMessage: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');

  return (
    <div className="space-y-1.5 text-[11px] leading-relaxed selection:bg-emerald-500/30 selection:text-white">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Bullet point
        if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const content = trimmed.substring(2);
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1 text-neutral-200">
              <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
              <div>{renderInlineFormatting(content)}</div>
            </div>
          );
        }

        // Numbered list item (e.g. "1️⃣", "1.", "2.")
        const numberMatch = trimmed.match(/^([0-9]+[.)]|[\u{1F300}-\u{1F9FF}]+)\s*(.*)$/u);
        if (numberMatch && (trimmed.startsWith('1️⃣') || trimmed.startsWith('2️⃣') || trimmed.startsWith('3️⃣') || trimmed.startsWith('4️⃣') || trimmed.startsWith('5️⃣') || trimmed.startsWith('1.') || trimmed.startsWith('2.'))) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1 text-neutral-200">
              <span className="text-emerald-400 font-mono font-bold shrink-0">{numberMatch[1]}</span>
              <div>{renderInlineFormatting(numberMatch[2])}</div>
            </div>
          );
        }

        // Heading with ### or ##
        if (trimmed.startsWith('### ') || trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
          const title = trimmed.replace(/^#+\s*/, '');
          return (
            <h4 key={idx} className="text-xs font-bold text-white tracking-wide pt-1 pb-0.5 border-b border-neutral-800/80">
              {renderInlineFormatting(title)}
            </h4>
          );
        }

        return (
          <p key={idx} className="text-neutral-200">
            {renderInlineFormatting(line)}
          </p>
        );
      })}
    </div>
  );
};

// Helper for bold, code, and highlights
function renderInlineFormatting(str: string): React.ReactNode[] {
  // Split on bold (**text**) and code (`text`)
  const parts = str.split(/(\*\*.*?\*\*|`.*?`)/g);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={i} className="font-bold text-white tracking-tight">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code key={i} className="px-1 py-0.5 mx-0.5 rounded bg-black/60 border border-neutral-800 text-emerald-300 font-mono text-[10px]">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export const KaseAssistantWidget: React.FC<KaseAssistantWidgetProps> = ({
  activeTab = 'dashboard',
  onNavigateTab,
  activeCampaign,
  campaigns = [],
  onToggleCampaignStatus,
  onSimulateBurst,
  onOpenNewCampaign,
  onOpenInstallModal,
  onOpenAuthModal,
  onOpenOneDollarCheckout,
  currentUser,
  onSelectCampaign,
  isOnline,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDockedHidden, setIsDockedHidden] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [executingActionId, setExecutingActionId] = useState<string | null>(null);

  // Internet Connection Status (Strict Online Requirement)
  const [localOnline, setLocalOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  useEffect(() => {
    const handleOnline = () => setLocalOnline(true);
    const handleOffline = () => setLocalOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Allow Hero or any other UI component to open KaSi on demand
  useEffect(() => {
    const handleOpenEvent = (e: any) => {
      setIsOpen(true);
      setIsMinimized(false);
      setIsDockedHidden(false);
      if (e?.detail?.message) {
        handleSendMessage(e.detail.message);
      }
    };

    window.addEventListener('kase-open-kasi', handleOpenEvent);
    return () => window.removeEventListener('kase-open-kasi', handleOpenEvent);
  }, []);

  const effectiveOnline = isOnline !== undefined ? isOnline : localOnline;

  const defaultGreeting = currentUser
    ? `¡Hola ${(currentUser.name || 'Empresario').split(' ')[0]}! ✨🤖 Soy **KaSi 2.0**, tu Copiloto Inteligente de KaSe.

🎯 **Campaña Activa**: ${activeCampaign ? `*${activeCampaign.name}* (${activeCampaign.currentRegistrations}/${activeCampaign.targetRegistrations} conversiones)` : '*Sin campaña activa*'}

¿En qué puedo ayudarte hoy con tu tráfico? ${activeCampaign ? 'Puedo auditar tus números, revisar los módulos o asesorarte para potenciar tus ventas.' : 'Tus 8 motores están listos: ¿deseas que encendamos una nueva campaña para tu web?'}`
    : `¡Hola! Soy **KaSi 2.0** ✨🤖, tu asesor de crecimiento de KaSe Marketing Digital.

Te ayudo a conocer cómo conseguir compradores y clientes reales para tu negocio en piloto automático mediante 8 motores autónomos en la nube.

🛡️ **Claridad total:** Tú **NO tienes que crear ni configurar ninguna API**. Toda la infraestructura opera de manera 100% autónoma en nuestra nube.

👉 Para ver los motores en acción y configurar tu primer embudo de clientes, **crea tu cuenta gratuita en 30 segundos**:`;

  const defaultSuggestions = currentUser
    ? activeCampaign
      ? [
          '📊 Ver Dashboard en vivo',
          '🔌 Ver Enlace Puente',
          '🚀 Auditar mi campaña actual',
          '💳 Planes y Precios'
        ]
      : [
          '🚀 Ir a Campañas Activas',
          '💳 Ver Planes y Precios',
          '➕ Configurar Nueva Campaña',
          '🛡️ Funcionamiento Óptimo'
        ]
    : [
        '📝 Crear cuenta gratuita',
        '🚀 ¿Cómo funciona KaSe?',
        '💰 Ver planes y precios',
        '🛡️ ¿Tengo que configurar APIs?'
      ];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: defaultGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: defaultSuggestions,
      action: !currentUser ? {
        id: 'welcome-auth-proposal',
        type: 'open_auth',
        title: 'Crear Cuenta Gratuita',
        description: 'Regístrate en 30 segundos y activa tus motores de tráfico'
      } : undefined
    },
  ]);

  // Sync greeting when currentUser changes (e.g. login or logout)
  useEffect(() => {
    setMessages([
      {
        id: `welcome_${currentUser ? 'in' : 'out'}_${Date.now()}`,
        role: 'assistant',
        text: defaultGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: defaultSuggestions,
        action: !currentUser ? {
          id: `welcome_auth_${Date.now()}`,
          type: 'open_auth',
          title: 'Crear Cuenta Gratuita',
          description: 'Regístrate en 30 segundos y activa tus motores de tráfico'
        } : undefined
      },
    ]);
  }, [currentUser?.email]);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll ONLY the chat internal container, never the page window!
  useEffect(() => {
    if (isOpen && !isMinimized && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isOpen, isMinimized, isLoading]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [isOpen, isMinimized]);

  const speakText = (text: string) => {
    if (!voiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      // Strip asterisks, hashes, backticks, emojis
      const clean = text
        .replace(/[*_#`~]/g, '')
        .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
        .trim();
      
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = 'es-ES';
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setIsSpeaking(false);
      console.warn('Speech synthesis error', e);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    // Strict Online Guard
    if (!effectiveOnline) {
      const userMsg: ChatMessage = {
        id: `user_${Date.now()}`,
        role: 'user',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      const offlineMsg: ChatMessage = {
        id: `offline_${Date.now()}`,
        role: 'assistant',
        text: '⚠️ **CONEXIÓN REQUERIDA**: KaSi opera **ÚNICAMENTE EN LÍNEA**. Conéctate a internet para comunicarte con la IA y ejecutar acciones en vivo en tu suite.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, userMsg, offlineMsg]);
      setInputMessage('');
      return;
    }

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    let actualText = text;
    if (text.startsWith('🔄 Reintentar')) {
      const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user' && !m.text.startsWith('🔄 Reintentar'));
      if (lastUserMsg) {
        actualText = lastUserMsg.text;
      }
    }

    let replyData: any = null;

    try {
      const historyPayload = messages.slice(-5).map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      // Abort controller with 6-second timeout so cellular phones never hang
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch('/api/ai/code-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({ 
          message: actualText, 
          history: historyPayload,
          context: {
            activeTab,
            activeCampaign: activeCampaign ? {
              id: activeCampaign.id,
              name: activeCampaign.name,
              niche: activeCampaign.niche,
              targetUrl: activeCampaign.targetUrl,
              status: activeCampaign.status,
              currentRegistrations: activeCampaign.currentRegistrations,
              targetRegistrations: activeCampaign.targetRegistrations,
              plan: activeCampaign.plan,
            } : null,
            isSuperAdmin: currentUser?.role === 'super_admin',
            userEmail: currentUser?.email,
            isInside: !!currentUser,
          }
        }),
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const parsed = await res.json();
          if (parsed && parsed.reply) {
            replyData = parsed;
          }
        }
      }
    } catch (networkErr) {
      // Backend unreachable, timed out, or static deployment: silently activate local KaSi engine
      console.warn('Backend API unreachable or timed out, activating local KaSi engine');
    }

    // Bulletproof: If backend didn't return valid JSON, generate instantaneous reply locally
    if (!replyData) {
      replyData = generateKaSiReply(actualText, {
        isInside: !!currentUser,
        currentUser,
        activeCampaign,
        activeTab,
        isSuperAdmin: currentUser?.role === 'super_admin'
      });
    }

    const assistantMsg: ChatMessage = {
      id: `assistant_${Date.now()}`,
      role: 'assistant',
      text: replyData.reply || 'He recibido tu mensaje. ¿En qué más puedo apoyarte?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      action: replyData.action,
      suggestions: replyData.suggestions || (
        currentUser ? [
          '🚀 Auditar mi campaña actual',
          '➕ Nueva campaña',
          '💳 Planes y ampliaciones',
          '🔌 Ver Enlace Puente'
        ] : [
          '📝 Crear cuenta gratuita',
          '🚀 ¿Cómo funciona KaSe?',
          '💰 Ver planes y precios',
          '🛡️ ¿Tengo que configurar APIs?'
        ]
      ),
      source: replyData.source || 'kase_autonomous_engine',
    };

    setMessages((prev) => [...prev, assistantMsg]);
    speakText(assistantMsg.text);
    setIsLoading(false);
  };

  // Execute interactive action with explicit user confirmation
  const handleExecuteAction = async (msgId: string, action: ActionProposal) => {
    setExecutingActionId(action.id);
    try {
      if (action.type === 'open_auth' && onOpenAuthModal) {
        onOpenAuthModal();
      } else if (action.type === 'toggle_status' && onToggleCampaignStatus) {
        await onToggleCampaignStatus();
      } else if (action.type === 'navigate' && action.target && onNavigateTab) {
        if (!activeCampaign && (action.target === 'dashboard' || action.target === 'integration' || action.target === 'modules')) {
          onNavigateTab('active_campaigns');
        } else {
          onNavigateTab(action.target);
        }
        setIsMinimized(true);
      } else if (action.type === 'new_campaign') {
        if (!currentUser && onOpenAuthModal) {
          onOpenAuthModal();
        } else if (onOpenNewCampaign) {
          onOpenNewCampaign();
        }
      } else if (action.type === 'simulate_burst') {
        // Only SuperAdmin or local dev
        if (currentUser?.role === 'super_admin' && activeCampaign) {
          await fetch(`/api/campaigns/${activeCampaign.id}/simulate-burst`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ count: action.count || 25 }),
          });
        }
      } else if (action.type === 'install_app' && onOpenInstallModal) {
        onOpenInstallModal();
      } else if (action.type === 'one_dollar_test' && onOpenOneDollarCheckout) {
        onOpenOneDollarCheckout();
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
    setIsSpeaking(false);
    setMessages([
      {
        id: `reset_${Date.now()}`,
        role: 'assistant',
        text: `¡Historial reiniciado! ✨🤖 Estoy listo para asistirte en cualquier motor, botón o campaña de KaSe. ¿Qué te gustaría hacer? 🚀`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: currentUser ? (
          activeCampaign ? [
            '📊 Ver Dashboard en vivo',
            '🔌 Ver Enlace Puente',
            '🚀 Auditar mi campaña actual',
            '💳 Planes y Precios'
          ] : [
            '🚀 Ir a Campañas Activas',
            '💳 Ver Planes y Precios',
            '➕ Configurar Nueva Campaña',
            '🛡️ Funcionamiento Óptimo'
          ]
        ) : [
          '📝 Crear cuenta gratuita',
          '🚀 ¿Cómo funciona KaSe?',
          '💰 Ver planes y precios',
          '🛡️ ¿Tengo que configurar APIs?'
        ]
      },
    ]);
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'open_auth':
        return <UserPlus className="w-3.5 h-3.5 text-emerald-400" />;
      case 'toggle_status':
        return activeCampaign?.status === 'active' ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />;
      case 'new_campaign':
        return <Plus className="w-3.5 h-3.5 text-sky-400" />;
      case 'simulate_burst':
        return <Zap className="w-3.5 h-3.5 text-amber-400" />;
      case 'navigate':
        return <ArrowRight className="w-3.5 h-3.5 text-teal-400" />;
      case 'one_dollar_test':
        return <CreditCard className="w-3.5 h-3.5 text-emerald-400" />;
      case 'install_app':
        return <Smartphone className="w-3.5 h-3.5 text-cyan-400" />;
      case 'reset_counter':
        return <RefreshCw className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <>
      {/* MINIMAL SLEEK TRIGGER BUTTON (Floating pill with live beacon) */}
      {!isOpen && !isDockedHidden && (
        <div className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6 flex items-center gap-1.5 select-none">
          {/* Subtle dock hide button */}
          <button
            onClick={() => setIsDockedHidden(true)}
            title="Ocultar a la orilla para máxima visibilidad"
            className="p-1 rounded-full bg-neutral-900/90 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 text-[10px] transition-all cursor-pointer opacity-70 hover:opacity-100"
          >
            <EyeOff className="w-3 h-3" />
          </button>

          {/* Main sleek launcher button */}
          <button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className={`group relative flex items-center gap-2 p-2.5 sm:px-3.5 sm:py-2.5 rounded-full ${
              effectiveOnline 
                ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 border-emerald-400/50 shadow-emerald-500/30' 
                : 'bg-neutral-900 border-rose-500/60 text-white shadow-rose-950/40'
            } font-bold shadow-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer border`}
            title={effectiveOnline ? "Abrir KaSi 2.0: Agente IA de Operaciones Autónomas" : "⚠️ KaSi requiere conexión a internet"}
            aria-label="Abrir copiloto inteligente"
          >
            <div className="relative w-6 h-6 rounded-full bg-black flex items-center justify-center text-emerald-400 shrink-0">
              <Bot className={`w-3.5 h-3.5 ${effectiveOnline ? 'text-emerald-400' : 'text-neutral-400'}`} />
              <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${effectiveOnline ? 'bg-emerald-400 ring-emerald-400/50' : 'bg-rose-500 ring-rose-500/50'} ring-2 ring-black`} />
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-xs">
              <span className={`font-extrabold tracking-tight ${effectiveOnline ? 'text-black' : 'text-neutral-200'}`}>KaSi 2.0</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${effectiveOnline ? 'bg-black/25 text-black' : 'bg-rose-500/30 text-rose-300'}`}>
                {effectiveOnline ? 'AGENTE IA' : 'OFFLINE'}
              </span>
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
          className="fixed bottom-6 right-0 z-40 px-2 py-1.5 bg-neutral-900/95 hover:bg-neutral-800 text-emerald-400 border-l border-y border-emerald-500/40 rounded-l-lg shadow-lg flex items-center gap-1.5 transition-all text-xs font-bold cursor-pointer"
          title="Restaurar Copiloto KaSi"
        >
          <Bot className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] font-mono text-emerald-300">KaSi 2.0</span>
        </button>
      )}

      {/* CHAT WINDOW MODAL */}
      {isOpen && (
        <div 
          className={`fixed z-50 transition-all duration-300 ease-in-out ${
            isMinimized 
              ? 'bottom-4 right-4 w-72 h-14' 
              : 'bottom-2 right-2 sm:bottom-5 sm:right-5 w-[96vw] sm:w-[450px] max-w-full h-[600px] max-h-[85vh]'
          } bg-[#0b0c0e]/95 border border-emerald-500/30 rounded-2xl shadow-2xl shadow-emerald-950/40 flex flex-col overflow-hidden backdrop-blur-2xl`}
        >
          {/* HEADER */}
          <div className="px-3.5 py-2.5 bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border-b border-neutral-800/90 flex items-center justify-between gap-2 select-none">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-0.5 shrink-0 shadow-sm shadow-emerald-500/30">
                <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-emerald-400">
                  <Bot className="w-4 h-4" />
                </div>
                {effectiveOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black animate-pulse" />
                )}
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-white truncate flex items-center gap-1">
                    <span>KaSi 2.0</span>
                    <span className="text-[10px] text-emerald-400 font-mono font-normal">· Agente de Crecimiento</span>
                  </h3>
                  {effectiveOnline ? (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold shrink-0 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      EN LÍNEA
                    </span>
                  ) : (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono font-bold shrink-0 flex items-center gap-1">
                      <WifiOff className="w-2.5 h-2.5" />
                      OFFLINE
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-neutral-400 truncate flex items-center gap-1">
                  <span className="text-neutral-500">Objetivo:</span>
                  <span className="text-emerald-400 font-semibold">{activeCampaign ? activeCampaign.name : 'Monitoreo de Plataforma'}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-0.5 text-neutral-400 shrink-0">
              {/* Voice toggle */}
              <button
                type="button"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`p-1.5 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer ${
                  voiceEnabled ? 'text-emerald-400 bg-emerald-500/10' : 'text-neutral-500'
                }`}
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
                  setIsSpeaking(false);
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
              {/* LIVE SOUNDWAVE ANIMATION (When Voice is Speaking) */}
              {isSpeaking && (
                <div className="px-3 py-1 bg-emerald-950/40 border-b border-emerald-500/20 flex items-center justify-between text-[10px] text-emerald-300">
                  <div className="flex items-center gap-1.5">
                    <Volume2 className="w-3 h-3 animate-pulse text-emerald-400" />
                    <span>KaSi está hablando...</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-4 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="w-1 h-5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '450ms' }} />
                  </div>
                </div>
              )}

              {/* TOP QUICK ACTION BAR */}
              <div className="px-3 py-1.5 bg-neutral-950/80 border-b border-neutral-900 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[10px]">
                {!currentUser ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenAuthModal) onOpenAuthModal();
                        else handleSendMessage('Quiero registrarme y crear mi cuenta gratuita');
                      }}
                      className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 font-medium shadow-sm shadow-emerald-950"
                    >
                      <UserPlus className="w-2.5 h-2.5 text-emerald-400" />
                      <span>Crear Cuenta Gratis</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSendMessage('¿Cómo funciona el tráfico autónomo de KaSe?')}
                      className="px-2 py-0.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-emerald-300 border border-neutral-800 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>🚀</span>
                      <span>¿Cómo Funciona?</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSendMessage('¿Cuáles son los planes y precios para empezar?')}
                      className="px-2 py-0.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-emerald-300 border border-neutral-800 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>💰</span>
                      <span>Planes y Precios</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSendMessage('¿Tengo que configurar alguna API o código?')}
                      className="px-2 py-0.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-emerald-300 border border-neutral-800 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                      <span>Cero APIs</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSendMessage('¿Cómo se garantiza que las visitas y clientes son 100% reales?')}
                      className="px-2 py-0.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-emerald-300 border border-neutral-800 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>👥</span>
                      <span>Tráfico Real</span>
                    </button>
                  </>
                ) : (
                  <>
                    {activeCampaign && (
                      <button
                        type="button"
                        onClick={() => handleSendMessage(activeCampaign.status === 'active' ? 'Pausa mi campaña' : 'Reanuda mi campaña')}
                        className="px-2 py-0.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-emerald-300 border border-neutral-800 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1"
                      >
                        {activeCampaign.status === 'active' ? (
                          <>
                            <Pause className="w-2.5 h-2.5 text-amber-400" />
                            <span>Pausar Motores</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-2.5 h-2.5 text-emerald-400" />
                            <span>Reanudar Motores</span>
                          </>
                        )}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleSendMessage('Audita mi campaña activa en tiempo real')}
                      className="px-2 py-0.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-emerald-300 border border-neutral-800 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <BarChart3 className="w-2.5 h-2.5 text-emerald-400" />
                      <span>Auditoría en Vivo</span>
                    </button>

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
                      onClick={() => handleSendMessage('¿Cómo puedo escalar mi campaña a un plan superior para multiplicar visitas?')}
                      className="px-2 py-0.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-amber-300 border border-neutral-800 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                      <span>Escalar Visitas</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSendMessage('Explícame cómo funciona el Enrutador Puente sin píxel')}
                      className="px-2 py-0.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-teal-300 border border-neutral-800 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>🔌</span>
                      <span>Enrutador Puente</span>
                    </button>
                  </>
                )}
              </div>

              {/* MESSAGES LIST */}
              <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
                {/* Offline Warning Card */}
                {!effectiveOnline && (
                  <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/60 text-rose-200 text-xs flex items-start gap-2.5 shadow-lg animate-pulse">
                    <WifiOff className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <strong className="block text-rose-300 text-[11px]">Conexión a Internet Obligatoria</strong>
                      <p className="text-[10px] text-neutral-300 leading-relaxed">
                        KaSi opera <strong>ÚNICAMENTE EN LÍNEA</strong>. Conéctate a Wi-Fi o red móvil para sincronizar motores y ejecutar acciones en vivo.
                      </p>
                    </div>
                  </div>
                )}

                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-400 p-0.5 shrink-0 mt-0.5 shadow-sm shadow-emerald-500/20">
                          <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-emerald-400 text-[10px]">
                            🤖
                          </div>
                        </div>
                      )}

                      <div
                        className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 space-y-2 shadow-md ${
                          isUser
                            ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white rounded-br-none'
                            : 'bg-[#121316] border border-neutral-800/90 text-neutral-200 rounded-bl-none'
                        }`}
                      >
                        {/* Message Content */}
                        <FormattedMessage text={msg.text} />

                        {/* INTERACTIVE ACTION CARD WITH 1-CLICK PERMISSION */}
                        {msg.action && (
                          <div className="mt-2.5 p-3 rounded-xl bg-black/70 border border-emerald-500/40 space-y-2 shadow-lg shadow-black/40">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-bold text-white flex items-center gap-1.5">
                                {getActionIcon(msg.action.type)}
                                {msg.action.title}
                              </span>
                              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                                1-Clic
                              </span>
                            </div>
                            
                            <p className="text-[10px] text-neutral-400 leading-relaxed">
                              {msg.action.description}
                            </p>

                            {msg.action.executed ? (
                              <div className="py-1.5 px-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span>Acción confirmada y ejecutada con éxito</span>
                              </div>
                            ) : (
                              <button
                                type="button"
                                disabled={!effectiveOnline || executingActionId === msg.action.id}
                                onClick={() => handleExecuteAction(msg.id, msg.action!)}
                                className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 disabled:opacity-40 text-black font-extrabold text-[10px] transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-98"
                              >
                                {executingActionId === msg.action.id ? (
                                  <>
                                    <div className="w-2.5 h-2.5 rounded-full bg-black animate-ping" />
                                    <span>Ejecutando en vivo...</span>
                                  </>
                                ) : (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                                    <span>Confirmar y Ejecutar Acción</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        )}

                        {/* SUGGESTION PILLS BELOW ASSISTANT REPLIES */}
                        {!isUser && msg.suggestions && msg.suggestions.length > 0 && (
                          <div className="pt-2 border-t border-neutral-800/80 space-y-1">
                            <span className="text-[9px] font-semibold text-neutral-500 block">Sugerencias rápidas:</span>
                            <div className="flex flex-wrap gap-1">
                              {msg.suggestions.map((sug, sIdx) => (
                                <button
                                  key={sIdx}
                                  type="button"
                                  onClick={() => handleSendMessage(sug)}
                                  className="px-2 py-0.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-emerald-300 border border-neutral-800 text-[10px] transition-colors cursor-pointer text-left"
                                >
                                  {sug}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Timestamp & Source */}
                        <div className="flex items-center justify-between text-[9px] font-mono pt-1 text-neutral-500">
                          <span>{msg.source ? `⚡ ${msg.source}` : ''}</span>
                          <span className={isUser ? 'text-emerald-200/70' : 'text-neutral-500'}>
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>

                      {isUser && (
                        <div className="w-6 h-6 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-white text-[9px] shrink-0 mt-0.5 font-bold">
                          Tú
                        </div>
                      )}
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex gap-2 justify-start items-center">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-[10px]">
                      🤖
                    </div>
                    <div className="bg-[#121316] border border-neutral-800/90 rounded-2xl rounded-bl-none px-3.5 py-2.5 flex items-center gap-2 text-neutral-400 text-xs shadow-md">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-[11px] text-neutral-300">KaSi está razonando y formulando respuesta... ✨</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* INPUT FORM (Disabled when offline) */}
              <div className="p-2.5 bg-neutral-950 border-t border-neutral-800/90">
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
                    disabled={!effectiveOnline || isLoading}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={
                      effectiveOnline 
                        ? "Pídele a KaSi que pause, audite o cree una campaña..." 
                        : "⚠️ Sin conexión a internet..."
                    }
                    className={`flex-1 bg-neutral-900 border ${
                      effectiveOnline 
                        ? 'border-neutral-800 focus:border-emerald-500 text-white' 
                        : 'border-rose-900/60 opacity-60 text-neutral-400 cursor-not-allowed'
                    } rounded-xl px-3.5 py-2 text-xs placeholder-neutral-500 focus:outline-none transition-colors`}
                  />
                  <button
                    type="submit"
                    disabled={!effectiveOnline || !inputMessage.trim() || isLoading}
                    className={`p-2.5 rounded-xl font-bold transition-all ${
                      effectiveOnline 
                        ? 'bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-black shadow-sm shadow-emerald-500/25 cursor-pointer' 
                        : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                    } disabled:opacity-40 shrink-0`}
                    title={effectiveOnline ? "Enviar mensaje" : "Sin conexión a internet"}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>

                <div className="mt-1.5 flex items-center justify-between text-[9px] text-neutral-500 px-1 font-mono">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>8 Motores Conectados · Enrutador Puente /r/:id</span>
                  </span>
                  <span className={effectiveOnline ? 'text-emerald-400 font-bold' : 'text-rose-400'}>
                    {effectiveOnline ? 'Gemini 3.8 Flash' : 'Offline'}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
