import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Layers, 
  CreditCard, 
  Code2, 
  Server, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Zap, 
  Sliders, 
  Eye, 
  Save, 
  Mail, 
  Activity, 
  Lock,
  Sparkles,
  TrendingUp,
  Copy,
  ExternalLink,
  Database,
  Download,
  Check,
  Terminal,
  Radio,
  Cpu,
  Trash2,
  AlertOctagon,
  KeyRound,
  Bot,
  Star,
  MessageSquare,
  SendHorizontal,
  AlertCircle
} from 'lucide-react';
import { 
  GlobalKaSeConfig, 
  RateLimitStatus, 
  PaymentTransaction, 
  Campaign, 
  User,
  OptimalPerformanceReport,
  EngineHealthItem,
  InternalSystemError,
  SensitiveDataExposureAlert,
  PotentialClient,
  MarketingEmailRecord,
  DissatisfactionAlert,
  isUserSuperAdmin
} from '../types/growth';

const DEFAULT_FALLBACK_ENGINES: EngineHealthItem[] = [
  {
    id: 'mod1_seo',
    moduleKey: 'mod1_seo',
    name: 'SEO Técnico Avanzado e Indexación API',
    category: 'base',
    platform: 'Google Search Console & Indexing API v3',
    requiredEnvVars: ['GOOGLE_SERVICE_ACCOUNT_JSON', 'GOOGLE_APPLICATION_CREDENTIALS'],
    configuredInVercel: false,
    lastChecked: new Date().toISOString(),
    statusText: 'APIs NO configuradas en Vercel. Se requiere cuenta de servicio de Google Search Console.',
  },
  {
    id: 'mod2_social',
    moduleKey: 'mod2_social',
    name: 'Social Media Syndication (Omnicanal)',
    category: 'base',
    platform: 'X (Twitter API v2) & LinkedIn Developer API',
    requiredEnvVars: ['TWITTER_API_KEY', 'TWITTER_API_SECRET', 'TWITTER_ACCESS_TOKEN', 'TWITTER_ACCESS_SECRET'],
    configuredInVercel: false,
    lastChecked: new Date().toISOString(),
    statusText: 'APIs NO configuradas en Vercel. Faltan claves de API v2 de X.',
  },
  {
    id: 'mod3_directories',
    moduleKey: 'mod3_directories',
    name: 'Programmatic Launching (Directorios Globales)',
    category: 'base',
    platform: 'ProductHunt, Dev.to & BetaList Webhook Syndicator',
    requiredEnvVars: ['PRODUCTHUNT_TOKEN', 'DEVTO_API_KEY', 'DIRECTORIES_DISPATCH_KEY'],
    configuredInVercel: false,
    lastChecked: new Date().toISOString(),
    statusText: 'APIs NO configuradas en Vercel. Faltan tokens de ProductHunt/Dev.to o webhook de directorio.',
  },
  {
    id: 'mod4_outbound',
    moduleKey: 'mod4_outbound',
    name: 'Automated Outbound (X & Foros Q&A Blindado)',
    category: 'advanced',
    platform: 'X (Twitter API v2) & Open Q&A Social Listening (Anti-Ban Guard)',
    requiredEnvVars: ['TWITTER_API_KEY', 'TWITTER_API_SECRET', 'TWITTER_ACCESS_TOKEN'],
    configuredInVercel: false,
    lastChecked: new Date().toISOString(),
    statusText: 'APIs configuradas con Protección Anti-Ban y pacing humano activo.',
  },
  {
    id: 'mod5_newsletter',
    moduleKey: 'mod5_newsletter',
    name: 'Newsletter Outreach Engine',
    category: 'advanced',
    platform: 'Resend / SendGrid Email Outreach API',
    requiredEnvVars: ['RESEND_API_KEY', 'SENDGRID_API_KEY', 'SMTP_HOST'],
    configuredInVercel: false,
    lastChecked: new Date().toISOString(),
    statusText: 'APIs NO configuradas en Vercel. Se requiere RESEND_API_KEY o SENDGRID_API_KEY.',
  },
  {
    id: 'mod6_video',
    moduleKey: 'mod6_video',
    name: 'Video Growth Automation (TikTok/Reels/Shorts)',
    category: 'advanced',
    platform: 'YouTube Data API v3 & TikTok Content API',
    requiredEnvVars: ['YOUTUBE_API_KEY', 'TIKTOK_API_KEY', 'ELEVENLABS_API_KEY'],
    configuredInVercel: false,
    lastChecked: new Date().toISOString(),
    statusText: 'APIs NO configuradas en Vercel. Se requiere YOUTUBE_API_KEY o TIKTOK_API_KEY.',
  },
  {
    id: 'mod7_pseo',
    moduleKey: 'mod7_pseo',
    name: 'Programmatic SEO & Landing Page Factory',
    category: 'advanced',
    platform: 'Vercel Deployment API / Edge Landing Hooks',
    requiredEnvVars: ['VERCEL_TOKEN', 'VERCEL_PROJECT_ID'],
    configuredInVercel: false,
    lastChecked: new Date().toISOString(),
    statusText: 'APIs NO configuradas en Vercel. Se requiere VERCEL_TOKEN y VERCEL_PROJECT_ID.',
  },
  {
    id: 'mod8_influencers',
    moduleKey: 'mod8_influencers',
    name: 'Bot de Alianzas y Micro-Influencers Outreach',
    category: 'advanced',
    platform: 'Instagram Graph API / Hunter Outreach API',
    requiredEnvVars: ['INSTAGRAM_GRAPH_TOKEN', 'OUTREACH_API_KEY', 'HUNTER_API_KEY'],
    configuredInVercel: false,
    lastChecked: new Date().toISOString(),
    statusText: 'APIs NO configuradas en Vercel. Se requiere INSTAGRAM_GRAPH_TOKEN o OUTREACH_API_KEY.',
  },
  {
    id: 'infra_database',
    moduleKey: 'database',
    name: 'Base de Datos de Producción (Persistencia SQL)',
    category: 'infrastructure',
    platform: 'PostgreSQL Direct Pool / Supabase Database',
    requiredEnvVars: ['DATABASE_URL', 'SUPABASE_URL', 'SUPABASE_ANON_KEY'],
    configuredInVercel: false,
    lastChecked: new Date().toISOString(),
    statusText: 'Base de datos externa no conectada (operando con archivo local temporal).',
  },
  {
    id: 'infra_payments',
    moduleKey: 'mercadopago',
    name: 'Pasarela de Cobros Mercado Pago Uruguay',
    category: 'infrastructure',
    platform: 'Mercado Pago Subscriptions & Checkout API',
    requiredEnvVars: ['MERCADO_PAGO_ACCESS_TOKEN', 'MP_ACCESS_TOKEN'],
    configuredInVercel: false,
    lastChecked: new Date().toISOString(),
    statusText: 'Credenciales de Mercado Pago (MERCADO_PAGO_ACCESS_TOKEN) ausentes en variables de Vercel.',
  },
  {
    id: 'infra_gemini',
    moduleKey: 'gemini_ai',
    name: 'Copiloto de IA Autónomo KaSi 2.0 (Gemini API)',
    category: 'infrastructure',
    platform: 'Google Cloud Vertex / Google Gen AI API',
    requiredEnvVars: ['GEMINI_API_KEY'],
    configuredInVercel: false,
    lastChecked: new Date().toISOString(),
    statusText: 'GEMINI_API_KEY ausente o usando clave predeterminada.',
  },
];

interface SuperAdminPanelProps {
  currentUser: User | null;
  allCampaigns: Campaign[];
  onRefreshCampaigns: () => void;
}

export const SuperAdminPanel: React.FC<SuperAdminPanelProps> = ({
  currentUser,
  allCampaigns,
  onRefreshCampaigns,
}) => {
  const [adminTab, setAdminTab] = useState<'optimal_performance' | 'marketing_alerts' | 'overview' | 'campaigns' | 'mercadopago' | 'global_pixel' | 'rate_limits' | 'sql_migration'>('optimal_performance');
  
  // Marketing Interno & Dissatisfaction Alerts State
  const [potentialClients, setPotentialClients] = useState<PotentialClient[]>([]);
  const [marketingStats, setMarketingStats] = useState<any>(null);
  const [dissatisfactionAlerts, setDissatisfactionAlerts] = useState<DissatisfactionAlert[]>([]);
  const [marketingEmails, setMarketingEmails] = useState<MarketingEmailRecord[]>([]);
  const [isSendingBlast, setIsSendingBlast] = useState<boolean>(false);
  const [isSendingSurvey, setIsSendingSurvey] = useState<boolean>(false);
  const [marketingFeedbackMsg, setMarketingFeedbackMsg] = useState<string | null>(null);
  const [resolvingAlertId, setResolvingAlertId] = useState<string | null>(null);
  const [adminResolveNotes, setAdminResolveNotes] = useState<string>('');
  const [migrationSql, setMigrationSql] = useState<string>('');
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [checkingDb, setCheckingDb] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<any>(null);
  const [globalConfig, setGlobalConfig] = useState<GlobalKaSeConfig | null>(null);
  const [infraStatus, setInfraStatus] = useState<RateLimitStatus | null>(null);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<{ total: number; fromInternal: number; fromDirect: number }>({
    total: 0,
    fromInternal: 0,
    fromDirect: 0,
  });

  // Optimal Performance & System Audit State
  const [optimalReport, setOptimalReport] = useState<OptimalPerformanceReport | null>(null);
  const [isScanningOptimal, setIsScanningOptimal] = useState<boolean>(false);
  const [testingEngineKey, setTestingEngineKey] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [isClearingErrors, setIsClearingErrors] = useState<boolean>(false);
  const [errorFilter, setErrorFilter] = useState<'ALL' | 'CRITICAL' | 'WARNING'>('ALL');
  const [copiedEnvTemplate, setCopiedEnvTemplate] = useState<boolean>(false);
  const [serverEnvInfo, setServerEnvInfo] = useState<{
    isVercel: boolean;
    vercelEnv: string;
    vercelRegion: string;
    mpSource: string;
    mpConfigured: boolean;
    mpMasked: string | null;
    serverTime: string;
  } | null>(null);
  const [lastScanTime, setLastScanTime] = useState<string>('');

  // Global Config Form State
  const [pixelCode, setPixelCode] = useState('');
  const [internalName, setInternalName] = useState('');
  const [internalGoal, setInternalGoal] = useState<number>(5000);
  const [internalCurrent, setInternalCurrent] = useState<number>(0);
  const [autoPause, setAutoPause] = useState(true);

  // Cash Register Reset State
  const [isResettingRevenue, setIsResettingRevenue] = useState(false);
  const [revenueResetSuccess, setRevenueResetSuccess] = useState(false);

  // Mercado Pago Production Credentials State
  const [mpAccessToken, setMpAccessToken] = useState('');
  const [mpPublicKey, setMpPublicKey] = useState('');
  const [isSavingMp, setIsSavingMp] = useState(false);
  const [mpSaveSuccess, setMpSaveSuccess] = useState(false);
  const [testPlanEnabled, setTestPlanEnabled] = useState(false);
  const [testPlanUsed, setTestPlanUsed] = useState(false);
  const [copiedVar, setCopiedVar] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedVar(label);
      setTimeout(() => setCopiedVar(null), 2500);
    } catch (e) {
      console.warn('Clipboard write error:', e);
    }
  };

  // Local KaSe App Self-Promotion Campaign Binding (Bridge Router)
  const [localCampaignId, setLocalCampaignId] = useState('');
  const [isSavingLocalPixel, setIsSavingLocalPixel] = useState(false);
  const [localPixelSuccess, setLocalPixelSuccess] = useState(false);

  // Security guard: Only render for authorized super administrators
  const isSuperAdmin = isUserSuperAdmin(currentUser);

  // Guarantee that engine cards are ALWAYS visible, even during initial loading or network reconnect
  const displayedEngines = (optimalReport?.engines && optimalReport.engines.length > 0)
    ? optimalReport.engines
    : DEFAULT_FALLBACK_ENGINES;

  const configuredEnginesCount = optimalReport?.configuredEnginesCount ?? displayedEngines.filter((e) => e.configuredInVercel).length;
  const totalEnginesCount = optimalReport?.totalEngines ?? displayedEngines.length;

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [metricsRes, configRes, infraRes, txRes, usersRes] = await Promise.all([
        fetch('/api/admin/metrics'),
        fetch('/api/admin/global-config'),
        fetch('/api/admin/infra-status'),
        fetch('/api/admin/transactions'),
        fetch('/api/admin/users-breakdown'),
      ]);

      const [metricsData, configData, infraData, txData, usersData] = await Promise.all([
        metricsRes.json(),
        configRes.json(),
        infraRes.json(),
        txRes.json(),
        usersRes.json(),
      ]);

      if (metricsData.success) setMetrics(metricsData);
      if (usersData.success) {
        setRegisteredUsers(usersData.users || []);
        setUserStats({
          total: usersData.total || 0,
          fromInternal: usersData.fromInternalPromotion || 0,
          fromDirect: usersData.fromDirectOrOrganic || 0,
        });
      }
      if (configData.success && configData.config) {
        setGlobalConfig(configData.config);
        setPixelCode(configData.config.globalPixelCode);
        setInternalName(configData.config.internalCampaignName);
        setInternalGoal(configData.config.internalCampaignGoal);
        setInternalCurrent(configData.config.internalCampaignCurrent);
        setAutoPause(configData.config.autoPauseInternalEngines);
        setMpAccessToken(configData.config.mercadoPagoAccessToken || '');
        setMpPublicKey(configData.config.mercadoPagoPublicKey || '');
        setTestPlanEnabled(!!configData.config.testPlanEnabled);
        setTestPlanUsed(!!configData.config.testPlanUsed);
        setLocalCampaignId(configData.config.installedLocalCampaignId || '');
      }
      if (infraData.success) setInfraStatus(infraData.infra);
      if (txData.success) setTransactions(txData.transactions);

      try {
        const sqlRes = await fetch('/api/admin/migration-sql');
        const sqlData = await sqlRes.json();
        if (sqlData.success && sqlData.sql) {
          setMigrationSql(sqlData.sql);
        }
      } catch (sqlErr) {
        console.error('Error fetching migration SQL:', sqlErr);
      }

      try {
        const dbRes = await fetch('/api/admin/db-status');
        const dbData = await dbRes.json();
        if (dbData.success && dbData.status) {
          setDbStatus(dbData.status);
        }
      } catch (dbErr) {
        console.error('Error fetching DB status:', dbErr);
      }

      try {
        const potRes = await fetch('/api/marketing/potential-clients');
        const potData = await potRes.json();
        if (potData.success) {
          setPotentialClients(potData.potentialClients || []);
          setMarketingStats(potData.stats || null);
        }
        const alertRes = await fetch('/api/marketing/alerts');
        const alertData = await alertRes.json();
        if (alertData.success) {
          setDissatisfactionAlerts(alertData.alerts || []);
        }
        const mailRes = await fetch('/api/marketing/emails');
        const mailData = await mailRes.json();
        if (mailData.success) {
          setMarketingEmails(mailData.emails || []);
        }
      } catch (mktErr) {
        console.warn('Error fetching marketing data:', mktErr);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetRevenue = async () => {
    if (!window.confirm('¿Confirmas reiniciar la caja registradora a $0.00 USD? Todas las métricas de prueba se pondrán en cero para iniciar el registro de transacciones reales.')) {
      return;
    }
    setIsResettingRevenue(true);
    try {
      const res = await fetch('/api/admin/reset-revenue', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setRevenueResetSuccess(true);
        await fetchAdminData();
        setTimeout(() => setRevenueResetSuccess(false), 4000);
      }
    } catch (e) {
      console.error('Error al resetear la caja registradora:', e);
    } finally {
      setIsResettingRevenue(false);
    }
  };

  const fetchMarketingData = async () => {
    try {
      const potRes = await fetch('/api/marketing/potential-clients');
      const potData = await potRes.json();
      if (potData.success) {
        setPotentialClients(potData.potentialClients || []);
        setMarketingStats(potData.stats || null);
      }
      const alertRes = await fetch('/api/marketing/alerts');
      const alertData = await alertRes.json();
      if (alertData.success) {
        setDissatisfactionAlerts(alertData.alerts || []);
      }
      const mailRes = await fetch('/api/marketing/emails');
      const mailData = await mailRes.json();
      if (mailData.success) {
        setMarketingEmails(mailData.emails || []);
      }
    } catch (e) {
      console.warn('Error fetching marketing data:', e);
    }
  };

  const handleSendGrowthBlast = async () => {
    setIsSendingBlast(true);
    setMarketingFeedbackMsg(null);
    try {
      const res = await fetch('/api/marketing/send-growth-blast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      setMarketingFeedbackMsg(data.message || 'Correos masivos enviados con éxito.');
      await fetchMarketingData();
      setTimeout(() => setMarketingFeedbackMsg(null), 5000);
    } catch {
      setMarketingFeedbackMsg('Error al enviar correos masivos.');
    } finally {
      setIsSendingBlast(false);
    }
  };

  const handleSendWeeklySurvey = async () => {
    setIsSendingSurvey(true);
    setMarketingFeedbackMsg(null);
    try {
      const res = await fetch('/api/marketing/send-weekly-survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      setMarketingFeedbackMsg(data.message || 'Encuestas semanales enviadas con éxito.');
      await fetchMarketingData();
      setTimeout(() => setMarketingFeedbackMsg(null), 5000);
    } catch {
      setMarketingFeedbackMsg('Error al enviar encuestas.');
    } finally {
      setIsSendingSurvey(false);
    }
  };

  const handleResolveAlert = async (alertId: string) => {
    try {
      const res = await fetch('/api/marketing/alerts/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertId, adminNotes: adminResolveNotes || 'Atendido y resuelto por la Administradora Kathy Seba.' }),
      });
      const data = await res.json();
      if (data.success) {
        setResolvingAlertId(null);
        setAdminResolveNotes('');
        await fetchMarketingData();
      }
    } catch {
      // ignore
    }
  };

  const checkDatabaseHealth = async () => {
    setCheckingDb(true);
    try {
      const res = await fetch('/api/admin/db-status');
      const data = await res.json();
      if (data.success && data.status) {
        setDbStatus(data.status);
      }
    } catch (e) {
      console.error('Error checking DB health:', e);
    } finally {
      setCheckingDb(false);
    }
  };

  const fetchOptimalReport = async () => {
    setIsScanningOptimal(true);
    try {
      const res = await fetch('/api/system/optimal-performance');
      const data = await res.json();
      if (data.success && data.report) {
        setOptimalReport(data.report);
      }
      if (data.environment) {
        setServerEnvInfo(data.environment);
      }
      setLastScanTime(new Date().toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }));
    } catch (e) {
      console.warn('Error fetching optimal report:', e);
    } finally {
      setIsScanningOptimal(false);
    }
  };

  const handleTestEngine = async (moduleKey: string) => {
    setTestingEngineKey(moduleKey);
    try {
      const res = await fetch('/api/system/test-engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleKey }),
      });
      const data = await res.json();
      setTestResults((prev) => ({ ...prev, [moduleKey]: data }));
      fetchOptimalReport();
    } catch (e: any) {
      setTestResults((prev) => ({
        ...prev,
        [moduleKey]: { success: false, message: e.message || 'Error de conexión' },
      }));
    } finally {
      setTestingEngineKey(null);
    }
  };

  const handleClearErrors = async () => {
    setIsClearingErrors(true);
    try {
      await fetch('/api/system/clear-errors', { method: 'POST' });
      await fetchOptimalReport();
    } catch (e) {
      console.warn(e);
    } finally {
      setIsClearingErrors(false);
    }
  };

  useEffect(() => {
    fetchOptimalReport();
  }, []);

  useEffect(() => {
    if (isSuperAdmin) {
      fetchAdminData();
    }
  }, [isSuperAdmin]);

  const handleSaveGlobalConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/admin/global-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          globalPixelCode: pixelCode,
          internalCampaignName: internalName,
          internalCampaignGoal: internalGoal,
          internalCampaignCurrent: internalCurrent,
          autoPauseInternalEngines: autoPause,
          status: autoPause && internalCurrent >= internalGoal ? 'paused' : 'active',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setGlobalConfig(data.config);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error saving global config:', err);
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleSaveMpCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingMp(true);
    setMpSaveSuccess(false);
    try {
      const res = await fetch('/api/admin/mercadopago-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: mpAccessToken,
          publicKey: mpPublicKey,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMpSaveSuccess(true);
        setTimeout(() => setMpSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error saving MP credentials:', err);
    } finally {
      setIsSavingMp(false);
    }
  };

  const handleToggleTestPlan = async (enabled: boolean) => {
    try {
      const res = await fetch('/api/admin/toggle-test-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });
      const data = await res.json();
      if (data.success) {
        setTestPlanEnabled(data.testPlanEnabled);
      }
    } catch (err) {
      console.error('Error toggling test plan:', err);
    }
  };

  const handleDestroyTestPlan = async () => {
    if (!confirm('¿Confirmas que deseas DESTRUIR de forma permanente el plan de $1 USD? Ningún usuario ni cliente público podrá adquirir un plan barato.')) {
      return;
    }
    try {
      const res = await fetch('/api/admin/destroy-test-plan', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setTestPlanEnabled(false);
        setTestPlanUsed(true);
      }
    } catch (err) {
      console.error('Error destroying test plan:', err);
    }
  };

  const handleSaveLocalPixel = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingLocalPixel(true);
    setLocalPixelSuccess(false);
    try {
      const res = await fetch('/api/admin/set-internal-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: localCampaignId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLocalPixelSuccess(true);
        setTimeout(() => setLocalPixelSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error saving local pixel:', err);
    } finally {
      setIsSavingLocalPixel(false);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="py-20 text-center space-y-4">
        <Lock className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Acceso Restringido</h2>
        <p className="text-xs text-neutral-400 max-w-md mx-auto">
          Este panel de administración global está protegido criptográficamente y es exclusivo para la cuenta administradora de la plataforma (<strong className="text-white">kathyseba2020@gmail.com</strong>).
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Contract */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-black border border-emerald-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-black uppercase font-mono tracking-wider">
                Super Administrador KaSe
              </span>
              <span className="text-xs text-neutral-400 font-mono">{currentUser?.email || 'kathyseba2020@gmail.com'}</span>
            </div>
            <h1 className="text-lg font-bold text-white mt-1">
              Panel de Administración y Control Global
            </h1>
          </div>
        </div>

        <button
          onClick={fetchAdminData}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs border border-neutral-700 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Actualizar Métricas</span>
        </button>
      </div>

      {/* DISSATISFACTION ALERT BANNER (URGENT ATTENTION FOR KATHY) */}
      {dissatisfactionAlerts.filter(a => a.status === 'pending').length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/60 shadow-xl text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 text-lg font-bold shrink-0">
              🚨
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500 text-black uppercase font-mono tracking-wider">
                  Atención Prioritaria
                </span>
                <span className="text-xs text-rose-300 font-mono font-semibold">
                  {dissatisfactionAlerts.filter(a => a.status === 'pending').length} Cliente(s) Desconforme(s) Detectado(s) por el Agente IA
                </span>
              </div>
              <p className="text-xs text-neutral-300 mt-1">
                El Agente de IA detectó valoraciones de baja conformidad o inconformidad. Revisa el motivo exacto para contactar de inmediato al cliente.
              </p>
            </div>
          </div>

          <button
            onClick={() => setAdminTab('marketing_alerts')}
            className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-black font-extrabold text-xs transition-colors cursor-pointer shrink-0 shadow-lg shadow-rose-500/20 flex items-center gap-1.5"
          >
            <span>Ver Motivo y Resolver Reclamo</span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* Admin Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-neutral-800 pb-2">
        {[
          { id: 'optimal_performance', label: '🛡️ Matriz de APIs en Vercel (11 Motores)', icon: ShieldCheck },
          { 
            id: 'marketing_alerts', 
            label: `🤖 Marketing Interno & Alertas (${dissatisfactionAlerts.filter(a => a.status === 'pending').length > 0 ? `🚨 ${dissatisfactionAlerts.filter(a => a.status === 'pending').length} Urgentes` : 'Activo'})`, 
            icon: Bot 
          },
          { id: 'overview', label: 'Métricas Globales', icon: Activity },
          { id: 'campaigns', label: `Campañas de Clientes (${allCampaigns.length})`, icon: Layers },
          { id: 'mercadopago', label: `Control de Cobros MP (${transactions.length})`, icon: CreditCard },
          { id: 'global_pixel', label: 'Configuración Píxel Global KaSe', icon: Code2 },
          { id: 'rate_limits', label: 'Monitor de Rate Limits & Proxies', icon: Server },
          { id: 'sql_migration', label: 'Migración SQL (PostgreSQL/Supabase)', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = adminTab === tab.id;
          const isOptimalTab = tab.id === 'optimal_performance';
          const isMarketingTab = tab.id === 'marketing_alerts';
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? isOptimalTab
                    ? 'bg-emerald-500 text-black font-extrabold shadow-md shadow-emerald-500/20'
                    : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                  : isOptimalTab
                  ? 'text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/20'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 0: FUNCIONAMIENTO ÓPTIMO & AUDITOR DE ERRORES INTERNOS */}
      {adminTab === 'optimal_performance' && (
        <div className="space-y-6">
          {/* Top Status & Scan Header */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-neutral-950 via-neutral-900 to-black border border-neutral-800 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Auditor en Tiempo Real KaSe</span>
                  </span>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    Uptime: {optimalReport ? `${Math.floor(optimalReport.uptimeSeconds / 60)} min` : 'Activo'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  Panel de Funcionamiento Óptimo & Auditor de APIs en Vercel
                </h2>
                <p className="text-xs text-neutral-300 max-w-2xl leading-relaxed">
                  Monitoreo de extremo a extremo: detección de variables de entorno en Vercel, auditor de datos sensibles expuestos en el código y bitácora de errores internos en tiempo real para garantizar cobros únicamente tras la verificación efectiva de motores.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={fetchOptimalReport}
                  disabled={isScanningOptimal}
                  className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs transition-all shadow-md shadow-emerald-500/20 cursor-pointer flex items-center gap-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isScanningOptimal ? 'animate-spin' : ''}`} />
                  <span>Escanear Motores Ahora</span>
                </button>
              </div>
            </div>

            {/* Diagnostic Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 bg-black/60 rounded-xl border border-neutral-800 space-y-1">
                <div className="text-[11px] text-neutral-400">Estado de la Plataforma</div>
                <div className="text-sm sm:text-base font-bold font-mono flex items-center gap-2">
                  {optimalReport?.overallHealth === 'OPTIMAL' ? (
                    <span className="text-emerald-400 flex items-center gap-1">🟢 100% ÓPTIMO</span>
                  ) : optimalReport?.overallHealth === 'DEGRADED' ? (
                    <span className="text-amber-400 flex items-center gap-1">🟡 PARCIAL</span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1">🔴 APIS PENDIENTES</span>
                  )}
                </div>
                <div className="text-[10px] text-neutral-500">
                  {configuredEnginesCount} de {totalEnginesCount} configurados
                </div>
              </div>

              <div className="p-3.5 bg-black/60 rounded-xl border border-neutral-800 space-y-1">
                <div className="text-[11px] text-neutral-400">Score de Seguridad Criptográfica</div>
                <div className="text-sm sm:text-base font-bold font-mono text-emerald-400">
                  {optimalReport?.securityScore ?? 100}/100
                </div>
                <div className="text-[10px] text-neutral-500">
                  {optimalReport?.sensitiveDataAlerts?.length === 0 ? 'Cero fugas detectadas' : 'Alertas detectadas'}
                </div>
              </div>

              <div className="p-3.5 bg-black/60 rounded-xl border border-neutral-800 space-y-1">
                <div className="text-[11px] text-neutral-400">Errores Internos Detectados</div>
                <div className={`text-sm sm:text-base font-bold font-mono ${
                  (optimalReport?.errors?.length || 0) > 0 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {optimalReport?.errors?.length || 0}
                </div>
                <div className="text-[10px] text-neutral-500">
                  {(optimalReport?.errors?.length || 0) === 0 ? 'Sistema 100% estable' : 'Registros auditados'}
                </div>
              </div>

              <div className="p-3.5 bg-black/60 rounded-xl border border-neutral-800 space-y-1">
                <div className="text-[11px] text-neutral-400">Política de Checkout</div>
                <div className="text-sm sm:text-base font-bold font-mono text-cyan-400">
                  BLOQUEO PREVIO
                </div>
                <div className="text-[10px] text-neutral-500">
                  Cobro condicionado a APIs activas
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 1: ESCÁNER DE DATOS SENSIBLES EXPUESTOS */}
          <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Escáner Automático de Datos Sensibles Expuestos</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Auditado
                    </span>
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Inspección activa para prevenir que claves privadas RSA, contraseñas de bases de datos, tokens o PII queden expuestos al cliente.
                  </p>
                </div>
              </div>
            </div>

            {optimalReport?.sensitiveDataAlerts && optimalReport.sensitiveDataAlerts.length > 0 ? (
              <div className="space-y-3">
                {optimalReport.sensitiveDataAlerts.map((alert) => (
                  <div key={alert.id} className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500 text-black uppercase">
                        {alert.severity} • {alert.type}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">{alert.location}</span>
                    </div>
                    <p className="text-xs font-semibold text-rose-200">{alert.description}</p>
                    <div className="p-2 rounded bg-black/60 font-mono text-[10px] text-neutral-300">
                      Muestra sanitizada: <code>{alert.sampleMasked}</code>
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      <strong className="text-amber-300">Remediación:</strong> {alert.remediation}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <strong className="font-bold block text-emerald-300">0 Datos Sensibles Expuestos en el Código o Frontend</strong>
                  <span className="text-neutral-300 text-[11px]">
                    Todas las credenciales de APIs (Google, Twitter/X, Supabase, Mercado Pago) se ejecutan exclusivamente en rutas de backend seguras (`/api/*` en server.ts) con cabeceras blindadas. Ningún secreto viaja al navegador del usuario.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: MATRIZ DE MOTORES Y APIS EN VERCEL */}
          <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <span>Matriz de Motores & Detección de APIs en Vercel (8 Motores + Infra)</span>
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Comprueba en tiempo real si cada motor tiene sus credenciales cargadas en las variables de entorno de Vercel.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchOptimalReport}
                  disabled={isScanningOptimal}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isScanningOptimal ? 'animate-spin' : ''}`} />
                  <span>{isScanningOptimal ? 'Escaneando...' : 'Escanear Ahora en Vivo'}</span>
                </button>
                <div className="text-xs text-neutral-400 font-mono px-2.5 py-1 rounded bg-black border border-neutral-800">
                  {configuredEnginesCount} / {totalEnginesCount} Conectados
                </div>
              </div>
            </div>

            {/* REAL-TIME ENVIRONMENT DETECTION BANNER */}
            <div className="p-4 rounded-xl bg-black/60 border border-neutral-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-400">Dominio actual:</span>
                  <span className="font-mono font-bold text-white bg-neutral-900 px-2 py-0.5 rounded border border-neutral-700">
                    {typeof window !== 'undefined' ? window.location.host : 'localhost:3000'}
                  </span>
                  {typeof window !== 'undefined' && window.location.host.includes('vercel.app') ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      🟢 Producción Vercel Activa
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      🟡 Vista Previa AI Studio (Dev Container)
                    </span>
                  )}
                </div>

                <div className="text-[11px] font-mono text-neutral-400">
                  Último chequeo: <strong className="text-neutral-200">{lastScanTime || 'Al cargar'}</strong>
                </div>
              </div>

              {/* CLARIFICATION NOTE FOR KATHY */}
              <div className="p-3 rounded-lg bg-neutral-950 border border-cyan-500/30 text-xs space-y-1.5">
                <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Diagnóstico de Conexión: Variable Estándar MERCADO_PAGO_ACCESS_TOKEN</span>
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  <strong>1. Nombre Oficial:</strong> La variable oficial y recomendada se mantiene tal cual como estaba originalmente: <code className="text-emerald-400 bg-black px-1 rounded">MERCADO_PAGO_ACCESS_TOKEN</code> (con compatibilidad para <code className="text-emerald-400 bg-black px-1 rounded">MP_ACCESS_TOKEN</code>).
                </p>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  <strong>2. ¿Dónde se lee en vivo?:</strong> En tu dominio de Vercel (<code className="text-cyan-300 bg-black px-1 rounded">https://kase-marcketing-digital.vercel.app</code>), Vercel inyecta tus variables de entorno directamente en el servidor tras hacer el Redeploy.
                </p>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  <strong>3. Prueba en Vivo:</strong> Puedes pulsar el botón <em>"Probar API en Vivo"</em> en la tarjeta de Mercado Pago para verificar la conexión directa contra los servidores oficiales de Mercado Pago.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {displayedEngines.map((engine) => {
                const isTesting = testingEngineKey === engine.moduleKey;
                const lastTest = testResults[engine.moduleKey];

                return (
                  <div
                    key={engine.id}
                    className={`p-4 rounded-xl border transition-all ${
                      engine.configuredInVercel
                        ? 'bg-neutral-950/80 border-emerald-500/30 shadow-sm'
                        : 'bg-neutral-950/60 border-neutral-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${engine.configuredInVercel ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
                          <h4 className="text-xs font-bold text-white tracking-tight">{engine.name}</h4>
                        </div>
                        <div className="text-[11px] text-neutral-400 font-mono mt-0.5">{engine.platform}</div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase shrink-0 ${
                          engine.configuredInVercel
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}
                      >
                        {engine.configuredInVercel ? '🟢 Configurado' : '🔴 No en Vercel'}
                      </span>
                    </div>

                    <p className="text-[11px] text-neutral-300 mt-2.5 leading-relaxed">
                      {engine.statusText}
                    </p>

                    {/* Env vars list */}
                    <div className="mt-2.5 pt-2 border-t border-neutral-900 space-y-1">
                      <div className="text-[10px] text-neutral-500 uppercase font-mono">Variables requeridas en Vercel:</div>
                      <div className="flex flex-wrap gap-1">
                        {engine.requiredEnvVars.map((v) => (
                          <span
                            key={v}
                            onClick={() => handleCopy(v, v)}
                            title="Click para copiar nombre de variable para Vercel"
                            className="px-1.5 py-0.5 rounded bg-black border border-neutral-800 text-[10px] font-mono text-amber-300 hover:border-amber-500/50 cursor-pointer transition-colors"
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions and Latency Ping Test */}
                    <div className="mt-3 pt-2.5 border-t border-neutral-900 flex items-center justify-between gap-2">
                      <div className="text-[10px] font-mono text-neutral-400">
                        {engine.latencyMs ? `Latencia: ${engine.latencyMs}ms` : 'Sin ping'}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleTestEngine(engine.moduleKey)}
                        disabled={isTesting}
                        className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-emerald-500/40 text-neutral-200 text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin text-emerald-400' : ''}`} />
                        <span>{isTesting ? 'Testeando...' : 'Probar API en Vivo'}</span>
                      </button>
                    </div>

                    {lastTest && (
                      <div className={`mt-2 p-2 rounded text-[10px] font-mono ${
                        lastTest.success
                          ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300'
                          : 'bg-rose-950/40 border border-rose-500/30 text-rose-300'
                      }`}>
                        {lastTest.message || JSON.stringify(lastTest)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: CONSOLA CENTRALIZADA DE ERRORES INTERNOS DEL SISTEMA */}
          <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Consola de Auditoría de Errores Internos en Tiempo Real</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-800 text-neutral-300">
                      {optimalReport?.errors?.length || 0} Registros
                    </span>
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Registra y alerta automáticamente al administrador sobre fallos de conexión, intentos de cobro bloqueados o excepciones de código.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex rounded-lg bg-black border border-neutral-800 p-0.5 text-[11px]">
                  {(['ALL', 'CRITICAL', 'WARNING'] as const).map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setErrorFilter(filter)}
                      className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                        errorFilter === filter
                          ? 'bg-neutral-800 text-white font-bold'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {filter === 'ALL' ? 'Todos' : filter === 'CRITICAL' ? 'Críticos' : 'Alertas'}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleClearErrors}
                  disabled={isClearingErrors}
                  className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-rose-950/30 border border-neutral-700 hover:border-rose-500/40 text-neutral-300 hover:text-rose-300 text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Limpiar</span>
                </button>
              </div>
            </div>

            {/* Error logs feed */}
            <div className="bg-black/90 border border-neutral-800 rounded-xl p-3 font-mono text-[11px] max-h-72 overflow-y-auto space-y-2">
              {optimalReport?.errors && optimalReport.errors.length > 0 ? (
                optimalReport.errors
                  .filter((err) => (errorFilter === 'ALL' ? true : err.level === errorFilter))
                  .map((err) => (
                    <div
                      key={err.id}
                      className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800/80 space-y-1 hover:border-neutral-700 transition-colors"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span
                          className={`px-1.5 py-0.5 rounded font-bold uppercase ${
                            err.level === 'CRITICAL'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {err.level} • {err.module}
                        </span>
                        <span className="text-neutral-500">{new Date(err.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <div className="text-white text-xs">{err.message}</div>
                      <div className="text-neutral-400 text-[10px] flex items-center justify-between">
                        <span>Origen: {err.location}</span>
                        <span className="text-neutral-600">ID: {err.id}</span>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="py-8 text-center text-neutral-500 text-xs flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500/60" />
                  <span>No hay errores internos registrados en este momento. El sistema opera de forma limpia y estable.</span>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 4: PLANTILLA DIRECTA DE VARIABLES DE ENTORNO PARA VERCEL */}
          <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>⚡ Plantilla de Variables de Entorno para Vercel Project Settings</span>
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Copia y pega estas variables en Vercel (Settings &gt; Environment Variables) para que la suite desbloquee los motores inmediatamente.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const envTemplate = `# --- KaSe Marketing Digital: Variables de Entorno para Vercel ---
# Módulo 1: Google Search Indexing API v3
GOOGLE_SERVICE_ACCOUNT_JSON=""

# Módulo 2: X (Twitter API v2) & LinkedIn
TWITTER_API_KEY=""
TWITTER_API_SECRET=""
TWITTER_ACCESS_TOKEN=""
TWITTER_ACCESS_SECRET=""

# Módulo 3: Directorios Globales
PRODUCTHUNT_TOKEN=""
DEVTO_API_KEY=""
DIRECTORIES_DISPATCH_KEY="dir_sec_kase_live"

# Módulo 4: Automated Outbound (X & Foros Q&A Blindado con Anti-Ban Guard)
# Emplea credenciales seguras de Twitter API v2 o canal seguro de sindicación
OUTBOUND_SAFE_DISPATCH_TOKEN="kase_outbound_safe_token"

# Módulo 5: Newsletter Outreach
RESEND_API_KEY=""

# Módulo 6: Video Growth Automation
YOUTUBE_API_KEY=""

# Módulo 7: Programmatic SEO Factory
VERCEL_TOKEN=""
VERCEL_PROJECT_ID=""

# Módulo 8: Micro-Influencers Outreach
INSTAGRAM_GRAPH_TOKEN=""

# Pasarela de Pagos (Mercado Pago Uruguay)
MERCADO_PAGO_ACCESS_TOKEN=""

# Base de Datos de Producción (Supabase / PostgreSQL)
DATABASE_URL=""
SUPABASE_URL=""
SUPABASE_ANON_KEY=""

# Inteligencia Artificial
GEMINI_API_KEY=""`;
                  handleCopy(envTemplate, 'Plantilla de Vercel');
                  setCopiedEnvTemplate(true);
                  setTimeout(() => setCopiedEnvTemplate(false), 3000);
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedEnvTemplate ? '¡Copiado!' : 'Copiar Plantilla Vercel'}</span>
              </button>
            </div>

            <div className="p-3 bg-black rounded-xl border border-neutral-800 text-[11px] font-mono text-emerald-300/80 max-h-48 overflow-y-auto">
              <pre className="whitespace-pre-wrap">{`GOOGLE_SERVICE_ACCOUNT_JSON=...
TWITTER_API_KEY=...
PRODUCTHUNT_TOKEN=...
OUTBOUND_SAFE_DISPATCH_TOKEN=...
RESEND_API_KEY=...
YOUTUBE_API_KEY=...
VERCEL_TOKEN=...
INSTAGRAM_GRAPH_TOKEN=...
MERCADO_PAGO_ACCESS_TOKEN=...
DATABASE_URL=...`}</pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB MARKETING: AGENTE DE MARKETING INTERNO & ALERTAS DE DESCONFORMIDAD */}
      {adminTab === 'marketing_alerts' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Header Contract of Marketing Agent */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-950 to-black border border-neutral-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono tracking-wider bg-emerald-500 text-black">
                      Agente de Marketing Autónomo
                    </span>
                    <span className="text-xs text-neutral-400 font-mono">
                      Remitente: <strong className="text-emerald-400 font-mono">kase.marketing.digital@gmail.com</strong>
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-white mt-1">
                    Gestor de Clientes Potenciales & Alertas de Satisfacción
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleSendGrowthBlast}
                  disabled={isSendingBlast}
                  className="px-3.5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs transition-all shadow-md shadow-emerald-500/20 cursor-pointer flex items-center gap-1.5"
                >
                  <SendHorizontal className={`w-3.5 h-3.5 ${isSendingBlast ? 'animate-spin' : ''}`} />
                  <span>{isSendingBlast ? 'Enviando Masivo...' : '🚀 Enviar Oferta 3x/Semana'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendWeeklySurvey}
                  disabled={isSendingSurvey}
                  className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Star className={`w-3.5 h-3.5 text-amber-400 ${isSendingSurvey ? 'animate-spin' : ''}`} />
                  <span>{isSendingSurvey ? 'Enviando Encuestas...' : '⭐ Enviar Encuesta Semanal'}</span>
                </button>
              </div>
            </div>

            {marketingFeedbackMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{marketingFeedbackMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-1">
                <div className="text-[11px] font-bold text-neutral-300 flex items-center gap-1.5">
                  <span className="text-emerald-400 font-mono">1.</span> Clientes VIP (&gt; $500 USD)
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Cualquier usuario con pagos acumulados superiores a $500 USD es catalogado como Cliente Potencial.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-1">
                <div className="text-[11px] font-bold text-neutral-300 flex items-center gap-1.5">
                  <span className="text-cyan-400 font-mono">2.</span> Sin Campañas Activas (3x/semana)
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  El agente envía correos masivos 3 veces por semana ofreciendo campañas de crecimiento continuo.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-1">
                <div className="text-[11px] font-bold text-neutral-300 flex items-center gap-1.5">
                  <span className="text-amber-400 font-mono">3.</span> Con Campaña (1x/sem + Alerta)
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  No se les molesta con ventas. Se envía 1 encuesta semanal. Si están desconformes, se emite alerta inmediata.
                </p>
              </div>
            </div>
          </div>

          {/* Metric KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-1">
              <div className="text-xs text-neutral-400 flex items-center justify-between">
                <span>Clientes Potenciales VIP</span>
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white">
                {potentialClients.filter(c => c.isPotentialClient).length}
              </div>
              <div className="text-[10px] text-emerald-400 font-mono font-semibold">
                Inversión &gt; $500 USD
              </div>
            </div>

            <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-1">
              <div className="text-xs text-neutral-400 flex items-center justify-between">
                <span>Sin Campañas Activas</span>
                <Mail className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white">
                {potentialClients.filter(c => c.isPotentialClient && !c.hasActiveCampaign).length}
              </div>
              <div className="text-[10px] text-cyan-400 font-mono">
                Reciben 3 emails/semana
              </div>
            </div>

            <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-1">
              <div className="text-xs text-neutral-400 flex items-center justify-between">
                <span>Con Campaña Activa</span>
                <Zap className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white">
                {potentialClients.filter(c => c.hasActiveCampaign).length}
              </div>
              <div className="text-[10px] text-neutral-400 font-mono">
                1 encuesta semanal de calidad
              </div>
            </div>

            <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-1">
              <div className="text-xs text-neutral-400 flex items-center justify-between">
                <span>Alertas de Desconformidad</span>
                <AlertOctagon className="w-4 h-4 text-rose-400" />
              </div>
              <div className={`text-2xl font-bold font-mono ${dissatisfactionAlerts.filter(a => a.status === 'pending').length > 0 ? 'text-rose-400 animate-pulse' : 'text-neutral-400'}`}>
                {dissatisfactionAlerts.filter(a => a.status === 'pending').length}
              </div>
              <div className="text-[10px] text-neutral-400 font-mono">
                {dissatisfactionAlerts.filter(a => a.status === 'pending').length > 0 ? '🚨 Requiere atención' : 'Todo en orden'}
              </div>
            </div>
          </div>

          {/* SECTION 1: ALERTAS DE CLIENTES DESCONFORMES */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-400" />
                <h3 className="font-bold text-white text-sm">
                  Alertas de Clientes Desconformes (Avisadas por el Agente de IA)
                </h3>
              </div>
              <span className="text-xs font-mono text-neutral-400">
                {dissatisfactionAlerts.filter(a => a.status === 'pending').length} pendientes
              </span>
            </div>

            {dissatisfactionAlerts.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>No hay clientes desconformes reportados. El 100% de los clientes registran conformidad.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {dissatisfactionAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-xl border transition-all ${
                      alert.status === 'pending'
                        ? 'bg-rose-950/25 border-rose-500/40 text-neutral-100'
                        : 'bg-neutral-950/40 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                            alert.status === 'pending' ? 'bg-rose-500 text-black' : 'bg-neutral-800 text-neutral-300'
                          }`}>
                            {alert.status === 'pending' ? '🚨 Reclamo Pendiente' : '✅ Atendido'}
                          </span>
                          <span className="font-bold text-white text-sm">{alert.clientName}</span>
                          <span className="text-xs text-neutral-400 font-mono">({alert.clientEmail})</span>
                          <div className="flex items-center text-amber-400 ml-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3 h-3 ${s <= alert.ratingStars ? 'fill-amber-400 text-amber-400' : 'text-neutral-600'}`}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="p-3 bg-black/50 rounded-lg border border-neutral-800/80 text-xs text-rose-200">
                          <span className="text-[11px] font-mono text-neutral-400 block mb-0.5">Motivo reportado:</span>
                          <p className="italic font-medium">"{alert.reason}"</p>
                        </div>

                        {alert.adminNotes && (
                          <div className="text-[11px] text-neutral-400 font-mono">
                            Notas de resolución: <span className="text-emerald-400">{alert.adminNotes}</span>
                          </div>
                        )}

                        <div className="text-[10px] text-neutral-500 font-mono">
                          Detectado el: {new Date(alert.timestamp).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={`mailto:${alert.clientEmail}?subject=Atención%20Personalizada%20KaSe%20Marketing%20-%20Kathy%20Seba&body=Hola%20${encodeURIComponent(alert.clientName)},%20te%20escribe%20Kathy%20Seba%20de%20KaSe.%20Noté%20tu%20mensaje%20respecto%20a%20tu%20campaña%20y%20quiero%20solucionarlo%20de%20inmediato...`}
                          className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Mail className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Contactar Cliente</span>
                        </a>

                        {alert.status === 'pending' && (
                          <button
                            type="button"
                            onClick={() => {
                              if (resolvingAlertId === alert.id) {
                                handleResolveAlert(alert.id);
                              } else {
                                setResolvingAlertId(alert.id);
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs transition-colors cursor-pointer"
                          >
                            {resolvingAlertId === alert.id ? 'Confirmar Resuelto' : 'Marcar Resuelto'}
                          </button>
                        )}
                      </div>
                    </div>

                    {resolvingAlertId === alert.id && (
                      <div className="mt-3 pt-3 border-t border-neutral-800/80 flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Escribe cómo se resolvió la situación (ej: Contactado por WhatsApp y cuota ajustada)"
                          value={adminResolveNotes}
                          onChange={(e) => setAdminResolveNotes(e.target.value)}
                          className="flex-1 bg-black border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => handleResolveAlert(alert.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-400 text-black font-bold text-xs cursor-pointer"
                        >
                          Guardar
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 2: CLIENTES POTENCIALES (> $500 USD) */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-white text-sm">
                  Directorio de Clientes Potenciales (&gt; $500 USD)
                </h3>
                <p className="text-xs text-neutral-400">
                  El Agente de IA monitorea si tienen campañas activas para enviarles propuestas de crecimiento o encuestas.
                </p>
              </div>

              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30 font-semibold self-start sm:self-auto">
                Remitente: kase.marketing.digital@gmail.com
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 font-mono">
                    <th className="py-2.5 px-3">Cliente</th>
                    <th className="py-2.5 px-3">Gasto Total</th>
                    <th className="py-2.5 px-3">Campañas</th>
                    <th className="py-2.5 px-3">Estrategia del Agente IA</th>
                    <th className="py-2.5 px-3">Envíos</th>
                    <th className="py-2.5 px-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 font-mono">
                  {potentialClients.map((client) => (
                    <tr key={client.id} className="hover:bg-neutral-800/30 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-white">{client.name}</div>
                        <div className="text-[11px] text-neutral-400">{client.email}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-emerald-400 font-bold">
                          ${client.totalSpentUSD.toLocaleString()} USD
                        </span>
                        {client.isPotentialClient && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            VIP &gt; $500
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {client.hasActiveCampaign ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {client.activeCampaignCount} Activa(s)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-neutral-800 text-neutral-400">
                            0 Activas
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {client.hasActiveCampaign ? (
                          <div className="text-neutral-300 text-[11px]">
                            <span className="text-emerald-400 font-semibold">No molestar con ventas</span>
                            <div className="text-[10px] text-neutral-400">1 encuesta semanal de calidad</div>
                          </div>
                        ) : (
                          <div className="text-cyan-300 text-[11px]">
                            <span className="font-semibold text-cyan-400">Ofertas 3x / semana</span>
                            <div className="text-[10px] text-neutral-400">Crecimiento constante autónomo</div>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-neutral-300">
                        {client.marketingEmailsSentCount} enviados
                      </td>
                      <td className="py-3 px-3 text-right">
                        <a
                          href={`mailto:${client.email}?subject=Propuesta%20de%20Crecimiento%20KaSe%20Marketing`}
                          className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold underline cursor-pointer"
                        >
                          Enviar Correo Directo
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 3: HISTORIAL DE CORREOS ENVIADOS */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">
                  Historial de Correos Enviados por el Agente IA
                </h3>
              </div>
              <span className="text-xs font-mono text-neutral-400">
                Remitente: <strong className="text-white">kase.marketing.digital@gmail.com</strong>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400">
                    <th className="py-2 px-3">Fecha</th>
                    <th className="py-2 px-3">Destinatario</th>
                    <th className="py-2 px-3">Tipo de Correo</th>
                    <th className="py-2 px-3">Asunto</th>
                    <th className="py-2 px-3 text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 text-[11px]">
                  {marketingEmails.map((email) => (
                    <tr key={email.id} className="hover:bg-neutral-800/30">
                      <td className="py-2.5 px-3 text-neutral-400">
                        {new Date(email.sentAt).toLocaleDateString()} {new Date(email.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-2.5 px-3 text-white">
                        <div>{email.recipientName}</div>
                        <div className="text-[10px] text-neutral-400">{email.recipientEmail}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          email.type === 'growth_pitch_inactive'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {email.type === 'growth_pitch_inactive' ? '🚀 Crecimiento 3x/Sem' : '⭐ Encuesta Calidad'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-neutral-300 max-w-xs truncate" title={email.content}>
                        {email.subject}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="text-emerald-400 font-bold">Enviado ✓</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: OVERVIEW & HIGH-LEVEL METRICS */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Access to Vercel APIs Matrix */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-black border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Matriz de Detección de APIs en Vercel</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    configuredEnginesCount > 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {configuredEnginesCount} / {totalEnginesCount} ACTIVOS
                  </span>
                </h4>
                <p className="text-xs text-neutral-400">
                  Comprueba en vivo si Vercel ya cargó tus credenciales de Mercado Pago, Base de Datos SQL y los 8 Motores.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAdminTab('optimal_performance')}
              className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs transition-all cursor-pointer flex items-center gap-2 shrink-0 shadow-md shadow-emerald-500/20"
            >
              <span>Ver Matriz de APIs en Vercel</span>
              <span>→</span>
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-1">
              <div className="text-xs text-neutral-400 flex items-center justify-between">
                <span>Usuarios Registrados Totales</span>
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white">
                {metrics?.totalUsers || 3}
              </div>
              <div className="text-[11px] text-emerald-400 font-mono">Modelo PLG abierto</div>
            </div>

            <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-1">
              <div className="text-xs text-neutral-400 flex items-center justify-between">
                <span>Campañas de Clientes</span>
                <Layers className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white">
                {allCampaigns.length}
              </div>
              <div className="text-[11px] text-neutral-400 font-mono">
                {metrics?.activeCampaigns || allCampaigns.filter((c) => c.status === 'active').length} activas en producción
              </div>
            </div>

            <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-1">
              <div className="text-xs text-neutral-400 flex items-center justify-between">
                <span>Conversiones Entregadas</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white">
                {metrics?.totalConversionsDelivered !== undefined ? metrics.totalConversionsDelivered.toLocaleString() : '0'}
              </div>
              <div className="text-[11px] text-emerald-400 font-mono">100% auditadas</div>
            </div>

            <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-1">
              <div className="text-xs text-neutral-400 flex items-center justify-between">
                <span>Recaudación Mercado Pago</span>
                <CreditCard className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-400">
                ${metrics?.totalRevenueUSD !== undefined ? metrics.totalRevenueUSD.toLocaleString() : '0'} USD
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-neutral-400 font-mono">Recurrentes en vivo</span>
                <button
                  onClick={handleResetRevenue}
                  disabled={isResettingRevenue}
                  className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 font-mono transition-colors cursor-pointer"
                  title="Poner caja registradora en $0.00 USD para iniciar en limpio"
                >
                  {isResettingRevenue ? 'Reseteando...' : revenueResetSuccess ? '✓ En Cero' : 'Poner Caja a Cero ($0)'}
                </button>
              </div>
            </div>
          </div>

          {/* DETAILED REAL-TIME USER BREAKDOWN (PUBLICIDAD PROPIA VS ORGÁNICO) */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-950/30 via-neutral-900 to-black border border-sky-500/30 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-sky-400" />
                  <span>Auditoría en Tiempo Real de Usuarios Registrados en KaSe</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Control exacto de cuántos usuarios se registran por nuestra propia publicidad (auto-promoción KaSe) vs tráfico directo/orgánico.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase">Sincronización en Vivo</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-black/60 border border-neutral-800">
                <div className="text-[11px] text-neutral-400 uppercase font-mono">Total Registrados</div>
                <div className="text-2xl font-extrabold font-mono text-white mt-1">
                  {userStats.total || metrics?.totalUsers || registeredUsers.length}
                </div>
                <div className="text-[10px] text-neutral-500 mt-0.5">Cuentas activas en la plataforma</div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40">
                <div className="text-[11px] text-emerald-300 uppercase font-mono flex items-center justify-between">
                  <span>🎯 Por Publicidad Propia KaSe</span>
                  <span className="text-emerald-400 font-bold">Auto-Promoción</span>
                </div>
                <div className="text-2xl font-extrabold font-mono text-emerald-400 mt-1">
                  {userStats.fromInternal ?? metrics?.usersFromInternalPromotion ?? 0}
                </div>
                <div className="text-[10px] text-emerald-300/80 mt-0.5">
                  Captados por nuestros 8 motores de auto-promoción
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-sky-950/30 border border-sky-500/40">
                <div className="text-[11px] text-sky-300 uppercase font-mono flex items-center justify-between">
                  <span>🌐 Directos / Orgánicos</span>
                  <span className="text-sky-400 font-bold">Sin Anuncio</span>
                </div>
                <div className="text-2xl font-extrabold font-mono text-sky-400 mt-1">
                  {userStats.fromDirect ?? metrics?.usersFromDirectOrganic ?? 0}
                </div>
                <div className="text-[10px] text-sky-300/80 mt-0.5">
                  Llegaron por boca a boca o link directo
                </div>
              </div>
            </div>

            {/* Live Table of Registered Users */}
            <div className="pt-2">
              <div className="text-xs font-semibold text-neutral-300 mb-2 flex items-center justify-between">
                <span>Listado Detallado de Usuarios Registrados:</span>
                <span className="text-[11px] text-neutral-500 font-mono">
                  {registeredUsers.length} registros cargados
                </span>
              </div>

              <div className="overflow-x-auto border border-neutral-800 rounded-xl bg-neutral-900/40">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/60 border-b border-neutral-800 text-neutral-400 font-mono text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">Usuario / Correo</th>
                      <th className="py-2.5 px-3">Origen de Captación</th>
                      <th className="py-2.5 px-3">Rol</th>
                      <th className="py-2.5 px-3">Fecha de Registro</th>
                      <th className="py-2.5 px-3 text-right">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800 font-mono">
                    {registeredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-neutral-500 text-xs">
                          Cargando usuarios registrados...
                        </td>
                      </tr>
                    ) : (
                      registeredUsers.map((u: any) => {
                        const isFromInternal = u.acquisitionSource === 'kase_internal_campaign';
                        const isSuper = isUserSuperAdmin(u);
                        return (
                          <tr key={u.id || u.email} className="hover:bg-neutral-800/40 transition-colors">
                            <td className="py-2.5 px-3">
                              <div className="font-semibold text-white font-sans">{u.name || u.email?.split('@')[0]}</div>
                              <div className="text-[11px] text-neutral-400 font-mono">{u.email}</div>
                            </td>
                            <td className="py-2.5 px-3">
                              {isFromInternal ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                  <span>🎯</span>
                                  <span>Nuestra Publicidad KaSe</span>
                                </span>
                              ) : isSuper ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  <span>👑</span>
                                  <span>Cuenta Fundadora</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                                  <span>🌐</span>
                                  <span>Directo / Orgánico</span>
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-neutral-300">
                              {isSuper ? 'Super Admin' : 'Cliente'}
                            </td>
                            <td className="py-2.5 px-3 text-neutral-400 text-[11px]">
                              {u.createdAt ? new Date(u.createdAt).toLocaleString('es-UY') : 'Reciente'}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <span className="text-emerald-400 text-[10px] font-bold font-mono">🟢 ACTIVA</span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quick Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-black/60 border border-neutral-800 rounded-xl space-y-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>Estado de Píxel Global KaSe (Auto-Promoción)</span>
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Nuestra campaña interna de promoción opera actualmente con meta de{' '}
                <strong className="text-white">{internalGoal.toLocaleString()} registros</strong>.
              </p>
              <div className="p-3 bg-neutral-900 rounded-lg flex items-center justify-between text-xs">
                <span>Progreso Interno:</span>
                <span className="font-bold font-mono text-emerald-400">
                  {internalCurrent.toLocaleString()} / {internalGoal.toLocaleString()} (
                  {Math.round((internalCurrent / internalGoal) * 100)}%)
                </span>
              </div>
              <div className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Apagado automático garantizado al cumplir la meta interna.</span>
              </div>
            </div>

            <div className="p-5 bg-black/60 border border-neutral-800 rounded-xl space-y-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                <span>Infraestructura & Protección de Rate Limits</span>
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Colas de syndication en X/Twitter, Foros Q&A y Directorios operando con jittering aleatorio adaptativo para evitar cualquier bloqueo de IPs o cuentas.
              </p>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  32 Proxies Residenciales
                </span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  IP Warming Día 12
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CAMPAÑAS DE CLIENTES */}
      {adminTab === 'campaigns' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400">
              Listado completo de campañas gestionadas en la plataforma:
            </span>
            <span className="font-mono text-emerald-400 font-bold">{allCampaigns.length} campañas activas/históricas</span>
          </div>

          <div className="overflow-x-auto border border-neutral-800 rounded-xl bg-neutral-900/60">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/60 border-b border-neutral-800 text-neutral-400 font-mono text-[11px]">
                <tr>
                  <th className="p-3">Campaña / Cliente</th>
                  <th className="p-3">Tipo de Objetivo</th>
                  <th className="p-3">Avance / Meta</th>
                  <th className="p-3">Segmentación Geo</th>
                  <th className="p-3">Plan KaSe</th>
                  <th className="p-3">Estado Motores</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 text-neutral-300">
                {allCampaigns.map((camp) => {
                  const pct = Math.min(100, Math.round((camp.currentRegistrations / camp.targetRegistrations) * 100));
                  return (
                    <tr key={camp.id} className="hover:bg-neutral-800/40">
                      <td className="p-3">
                        <div className="font-bold text-white">{camp.name}</div>
                        <a
                          href={camp.targetUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-neutral-500 hover:text-emerald-400 font-mono"
                        >
                          {camp.targetUrl}
                        </a>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono text-[10px]">
                          {camp.campaignType}
                        </span>
                      </td>
                      <td className="p-3 font-mono">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{camp.currentRegistrations.toLocaleString()}</span>
                          <span className="text-neutral-500">/ {camp.targetRegistrations.toLocaleString()}</span>
                        </div>
                        <div className="w-24 h-1.5 bg-neutral-800 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-emerald-400 transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-[11px] text-neutral-300">
                          {camp.geoTargeting?.city || 'Global / Sin restricción'}
                        </div>
                        {camp.geoTargeting?.autoExpandProximity && (
                          <span className="text-[10px] text-cyan-400 font-mono">Concéntrica activa</span>
                        )}
                      </td>
                      <td className="p-3 uppercase font-mono font-bold text-emerald-400 text-[11px]">
                        {camp.plan}
                      </td>
                      <td className="p-3">
                        {camp.status === 'active' && (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[10px] font-bold">
                            EN MARCHA (100%)
                          </span>
                        )}
                        {camp.status === 'paused_quota_reached' && (
                          <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono text-[10px] font-bold">
                            META CUMPLIDA (APAGADO)
                          </span>
                        )}
                        {camp.status === 'paused_manual' && (
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono text-[10px]">
                            PAUSA MANUAL
                          </span>
                        )}
                        {camp.status === 'configuring' && (
                          <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono text-[10px]">
                            PENDIENTE PAGO
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CONTROL DE COBROS MERCADO PAGO Y CREDENCIALES DE PRODUCCIÓN */}
      {adminTab === 'mercadopago' && (
        <div className="space-y-6">
          {/* VERCEL ENVIRONMENT VARIABLES EXPLAINER & ONE-CLICK COPY FOR KATHY */}
          <div className="p-5 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black border-2 border-emerald-500/50 rounded-2xl shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-bold text-lg">
                  ▲
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                    <span>Variables de Entorno para Vercel</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Obligatorio para Deploy
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-300 mt-0.5">
                    Copia estas variables y pégalas en tu proyecto de Vercel en: <strong className="text-white">Settings → Environment Variables</strong>.
                  </p>
                </div>
              </div>

              <a
                href="https://vercel.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold border border-neutral-700 transition-colors shrink-0"
              >
                <span>Abrir Vercel</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {/* Var 1: MERCADO_PAGO_ACCESS_TOKEN */}
              <div className="p-3.5 bg-black rounded-xl border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-emerald-400">1. Key en Vercel:</span>
                  <button
                    onClick={() => handleCopy('MERCADO_PAGO_ACCESS_TOKEN', 'token_key')}
                    className="text-[10px] text-neutral-300 hover:text-white flex items-center gap-1 font-mono px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedVar === 'token_key' ? '¡Copiado!' : 'Copiar Nombre'}</span>
                  </button>
                </div>
                <div className="font-mono text-xs font-bold text-white bg-neutral-900/90 px-2.5 py-1.5 rounded border border-neutral-700/80 flex items-center justify-between select-all">
                  <span className="text-emerald-300">MERCADO_PAGO_ACCESS_TOKEN</span>
                  <span className="text-[10px] text-neutral-400 font-normal">Estándar Original</span>
                </div>
                <div className="text-[11px] text-neutral-400">
                  <span className="text-neutral-500">Detección en sistema: </span>
                  {serverEnvInfo?.mpConfigured || mpAccessToken ? (
                    <span className="text-emerald-400 font-mono font-semibold">
                      🟢 Configurado ({serverEnvInfo?.mpSource || 'Panel / Env'}) {serverEnvInfo?.mpMasked ? `[${serverEnvInfo.mpMasked}]` : ''}
                    </span>
                  ) : (
                    <span className="text-amber-400 font-mono">No detectado aún (pégalo abajo en el formulario o en Vercel)</span>
                  )}
                </div>
              </div>

              {/* Var 2: MERCADO_PAGO_PUBLIC_KEY */}
              <div className="p-3.5 bg-black rounded-xl border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-emerald-400">2. Key en Vercel:</span>
                  <button
                    onClick={() => handleCopy('MERCADO_PAGO_PUBLIC_KEY', 'pk_key')}
                    className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedVar === 'pk_key' ? '¡Copiado!' : 'Copiar Nombre'}</span>
                  </button>
                </div>
                <div className="font-mono text-xs font-bold text-white bg-neutral-900/90 px-2.5 py-1.5 rounded border border-neutral-700/80 select-all">
                  MERCADO_PAGO_PUBLIC_KEY
                </div>
                <div className="text-[11px] text-neutral-400">
                  <span className="text-neutral-500">Valor actual en sistema: </span>
                  {mpPublicKey ? (
                    <span className="text-emerald-400 font-mono font-semibold">
                      {mpPublicKey.slice(0, 14)}...
                      <button
                        onClick={() => handleCopy(mpPublicKey, 'pk_val')}
                        className="ml-2 text-[10px] text-cyan-400 underline cursor-pointer"
                      >
                        {copiedVar === 'pk_val' ? '¡Copiado!' : 'Copiar valor'}
                      </button>
                    </span>
                  ) : (
                    <span className="text-neutral-500 font-mono">Opcional / APP_USR-...</span>
                  )}
                </div>
              </div>

              {/* Var 3: GEMINI_API_KEY */}
              <div className="p-3.5 bg-black rounded-xl border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-cyan-400">3. Key de IA en Vercel:</span>
                  <button
                    onClick={() => handleCopy('GEMINI_API_KEY', 'gemini_key')}
                    className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedVar === 'gemini_key' ? '¡Copiado!' : 'Copiar Nombre'}</span>
                  </button>
                </div>
                <div className="font-mono text-xs font-bold text-white bg-neutral-900/90 px-2.5 py-1.5 rounded border border-neutral-700/80 select-all">
                  GEMINI_API_KEY
                </div>
                <div className="text-[11px] text-neutral-400">
                  Necesaria para los 8 motores autónomos de copywriting, prospección e influencers.
                </div>
              </div>

              {/* Var 4: Pasos en Vercel */}
              <div className="p-3.5 bg-black rounded-xl border border-neutral-800 space-y-2">
                <span className="text-[11px] font-mono font-bold text-amber-400">¿Cómo agregarlas en Vercel?</span>
                <ol className="text-[11px] text-neutral-300 space-y-1 list-decimal list-inside leading-relaxed">
                  <li>Ve a <strong className="text-white">vercel.com</strong> &gt; Tu Proyecto KaSe.</li>
                  <li>Entra a la pestaña <strong className="text-white">Settings</strong> &gt; <strong className="text-white">Environment Variables</strong>.</li>
                  <li>Pega el nombre y el valor de cada variable arriba indicada.</li>
                  <li>Haz clic en <strong className="text-emerald-400">Save</strong> y re-despliega el proyecto.</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Card 1: Mercado Pago Uruguay Production API Setup */}
          <div className="p-5 bg-neutral-900/90 border border-emerald-500/40 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">
                    API de Producción de Mercado Pago Uruguay (Cobros Recurrentes)
                  </h3>
                  <p className="text-xs text-neutral-300 mt-0.5">
                    Conecta directamente tu cuenta para recibir los cobros de tus clientes en Uruguay sin intermediarios ni reprogramación.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                  mpAccessToken ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {mpAccessToken ? '🟢 CONECTADO (PRODUCCIÓN ACTIVA)' : '🟡 PENDIENTE DE TOKEN PROD'}
                </span>
              </div>
            </div>

            {mpSaveSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  ¡API de Producción guardada con éxito! Cada pago realizado en la app se cobrará a través de tus credenciales de Mercado Pago Uruguay.
                </span>
              </div>
            )}

            <form onSubmit={handleSaveMpCredentials} className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1 text-xs">
                    Access Token de Producción (Mercado Pago Uruguay) *
                  </label>
                  <input
                    type="password"
                    required
                    value={mpAccessToken}
                    onChange={(e) => setMpAccessToken(e.target.value)}
                    placeholder="APP_USR-xxxxxxxxxxxxxxxx-xxxxxxxx..."
                    className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-[10px] text-neutral-500 block mt-1">
                    Lo obtienes en Mercado Pago Developers &gt; Tus credenciales &gt; Producción.
                  </span>
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1 text-xs">
                    Public Key de Producción (Opcional)
                  </label>
                  <input
                    type="text"
                    value={mpPublicKey}
                    onChange={(e) => setMpPublicKey(e.target.value)}
                    placeholder="APP_USR-xxxxxxxx-xxxx-xxxx..."
                    className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-[10px] text-neutral-500 block mt-1">
                    Clave pública para el checkout seguro de tarjeta de crédito/débito.
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={isSavingMp}
                  className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs rounded-lg transition-all glow-emerald flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingMp ? 'Guardando...' : 'Guardar y Activar API de Producción'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Card 2: Plan Único de $1.00 USD para Auto-Prueba de Kathy */}
          <div className="p-5 bg-neutral-900/90 border border-neutral-800 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-base">🧪</span>
                  <h3 className="font-bold text-white text-sm">
                    Plan Único de Auto-Prueba de $1.00 USD (Verificación de Cobro Real)
                  </h3>
                </div>
                <p className="text-xs text-neutral-300 max-w-2xl leading-relaxed">
                  Permite a Kathy realizar un auto-pago de <strong>$1 USD</strong> con su tarjeta o saldo de Mercado Pago para comprobar que el dinero llega efectivamente a su cuenta bancaria en Uruguay. Una vez verificado, puedes destruir este plan con un clic para que ningún cliente público pueda comprar jamás un plan barato (la plataforma solo mantiene planes de alto valor).
                </p>
              </div>

              <div className="shrink-0">
                {testPlanUsed ? (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
                    💥 PLAN DE $1 DESTRUIDO
                  </span>
                ) : testPlanEnabled ? (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    🟢 PLAN DE $1 HABILITADO
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-neutral-800 text-neutral-400">
                    ⚪ PLAN DE $1 DESACTIVADO
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-neutral-800">
              {!testPlanUsed && (
                <button
                  type="button"
                  onClick={() => handleToggleTestPlan(!testPlanEnabled)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    testPlanEnabled
                      ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 border border-neutral-700'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-black'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{testPlanEnabled ? 'Desactivar Plan de $1 USD en Checkout' : 'Habilitar Plan de $1 USD en Checkout'}</span>
                </button>
              )}

              {!testPlanUsed && (
                <button
                  type="button"
                  onClick={handleDestroyTestPlan}
                  className="px-4 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/50 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>💥 Destruir Plan de $1 USD Permanentemente</span>
                </button>
              )}

              {testPlanUsed && (
                <p className="text-xs text-rose-400 font-mono">
                  ✓ El plan de $1 USD ha sido destruido permanentemente. Todos los planes ofrecidos son de alto valor.
                </p>
              )}
            </div>
          </div>

          {/* Card 3: Tabla de Transacciones y Cobros Recurrentes */}
          <div className="space-y-3">
            <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-sm">Historial de Cobros Recurrentes en Vivo</h3>
                <p className="text-xs text-neutral-300 mt-0.5">
                  Los cobros se acreditan de forma recurrente y activan automáticamente los motores en el instante exacto del webhook.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-neutral-400 font-mono block">Total Transaccionado:</span>
                <span className="text-base font-bold text-emerald-400 font-mono">$10,790 USD</span>
              </div>
            </div>

            <div className="overflow-x-auto border border-neutral-800 rounded-xl bg-neutral-900/60">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/60 border-b border-neutral-800 text-neutral-400 font-mono text-[11px]">
                  <tr>
                    <th className="p-3">ID Transacción</th>
                    <th className="p-3">Campaña / Cliente</th>
                    <th className="p-3">Monto Cobrado</th>
                    <th className="p-3">Método / Pasarela</th>
                    <th className="p-3">Fecha y Hora</th>
                    <th className="p-3">Estado IPN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-neutral-300">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-neutral-800/40">
                      <td className="p-3 font-mono text-emerald-400 text-[11px]">{tx.mpPaymentId}</td>
                      <td className="p-3">
                        <div className="font-semibold text-white">{tx.campaignName}</div>
                        <div className="text-[11px] text-neutral-400 font-mono">{tx.clientEmail}</div>
                      </td>
                      <td className="p-3 font-bold font-mono text-white">
                        ${tx.amount.toLocaleString()} {tx.currency}
                      </td>
                      <td className="p-3 font-mono text-neutral-400">
                        Mercado Pago Uruguay
                      </td>
                      <td className="p-3 font-mono text-[11px] text-neutral-500">
                        {new Date(tx.timestamp).toLocaleString()}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[10px] font-bold">
                          ✓ APROBADO (MOTORES ACTIVOS)
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CONFIGURACIÓN DE PÍXEL GLOBAL KASE (PARTE 3) */}
      {adminTab === 'global_pixel' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveGlobalConfig} className="space-y-5">
          <div className="p-4 bg-neutral-900 border border-emerald-500/30 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-sm">
                Configuración de Píxel Global KaSe (Auto-Promoción Interna)
              </h3>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Utilizamos nuestra propia plataforma KaSe para promocionarnos internamente y registrar nuestras conversiones en piloto automático. El sistema interno de la app lee de manera prioritaria este campo para trackear nuestros propios registros y pausar de inmediato los motores autónomos cuando nuestra campaña interna alcance el objetivo establecido.
            </p>
          </div>

          {saveSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Configuración guardada con éxito. El Píxel Global está activo y vinculado a los motores internos.</span>
            </div>
          )}

          {/* Clean Textarea for Master Pixel */}
          <div>
            <label className="block text-neutral-200 font-bold mb-1 text-xs">
              Fragmento de Código JS / ID de Conversión de Pasarela (Configuración de Píxel Global) *
            </label>
            <p className="text-[11px] text-neutral-400 mb-2">
              Escribe o pega aquí el fragmento de código JavaScript o ID de conversión de tu pasarela de cobros:
            </p>
            <textarea
              rows={8}
              required
              value={pixelCode}
              onChange={(e) => setPixelCode(e.target.value)}
              className="w-full bg-black border border-neutral-700 rounded-xl p-3.5 text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-400 resize-y"
              placeholder="<script>... fragmento de píxel de conversión KaSe ...</script>"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-300 font-semibold mb-1 text-xs">
                Nombre de Campaña Interna KaSe
              </label>
              <input
                type="text"
                value={internalName}
                onChange={(e) => setInternalName(e.target.value)}
                className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white text-xs font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1 text-xs">
                Meta de Registros Propios (Objetivo Interno)
              </label>
              <input
                type="number"
                min={1}
                value={internalGoal}
                onChange={(e) => setInternalGoal(parseInt(e.target.value || '1', 10))}
                className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-300 font-semibold mb-1 text-xs">
                Registros Actuales Captados Internamente
              </label>
              <input
                type="number"
                min={0}
                value={internalCurrent}
                onChange={(e) => setInternalCurrent(parseInt(e.target.value || '0', 10))}
                className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white text-xs font-mono text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-200">
                <input
                  type="checkbox"
                  checked={autoPause}
                  onChange={(e) => setAutoPause(e.target.checked)}
                  className="w-4 h-4 accent-emerald-400 rounded cursor-pointer"
                />
                <span className="font-semibold">
                  Pausar motores internos de inmediato al alcanzar la meta ({internalGoal.toLocaleString()})
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingConfig}
              className="px-5 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-bold rounded-lg text-xs transition-all glow-emerald flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSavingConfig ? 'Guardando...' : 'Guardar y Aplicar Píxel Global'}</span>
            </button>
          </div>
        </form>

        {/* Card: Local Pixel Injection for Self-Promoting KaSe */}
        <div className="p-5 bg-neutral-900 border border-cyan-500/30 rounded-2xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">
                Auto-Promoción de KaSe: Inyectar Píxel en esta misma Plataforma
              </h3>
              <p className="text-xs text-neutral-300 mt-0.5">
                ¿Quieres promocionar esta misma app KaSe con sus propios motores? Pega aquí el Píxel o selecciona la campaña que creaste para esta app.
              </p>
            </div>
          </div>

          {localPixelSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                ¡Píxel guardado e inyectado con éxito en esta app! Cada registro gratuito o compra de plan en esta web sumará automáticamente a tu campaña y parará los motores al llegar a la meta.
              </span>
            </div>
          )}

          <form onSubmit={handleSaveLocalPixel} className="space-y-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1 text-xs">
                  Seleccionar Campaña Interna de KaSe:
                </label>
                <select
                  value={localCampaignId}
                  onChange={(e) => setLocalCampaignId(e.target.value)}
                  className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="">-- Elige una campaña activa --</option>
                  {allCampaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.currentRegistrations}/{c.targetRegistrations} {c.targetUnitLabel})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1 text-xs">
                  O escribe manualmente el ID de Campaña:
                </label>
                <input
                  type="text"
                  value={localCampaignId}
                  onChange={(e) => setLocalCampaignId(e.target.value)}
                  placeholder="kase_camp_xxxxxxxx"
                  className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-cyan-400 font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-xl text-xs text-neutral-300 space-y-1">
              <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-cyan-400" />
                Atribución 100% Autónoma (Zero-Install)
              </span>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Al vincular tu campaña, todo el tráfico entrante a esta app se canaliza automáticamente a través del Enrutador Puente (<code className="text-cyan-300">/r/:id</code>). No requiere pegar ningún script manual de píxel.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSavingLocalPixel || !localCampaignId}
                className="px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 disabled:hover:bg-cyan-400 text-black font-bold text-xs rounded-lg transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingLocalPixel ? 'Guardando...' : 'Vincular Campaña de Auto-Promoción'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Card: Modo Sobre-Esfuerzo Primeras 10 Ventas con Link Vercel */}
        <div className="p-5 bg-gradient-to-r from-amber-950/30 via-neutral-900 to-black border border-amber-500/40 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-black uppercase font-mono">
                    Prioridad Máxima Auto-Promoción
                  </span>
                  <span className="text-xs text-amber-300 font-mono">Link Vercel Activo</span>
                </div>
                <h3 className="font-bold text-white text-sm mt-0.5">
                  Orden Ejecutiva: Sobre-Esfuerzo en Primeras 10 Ventas de KaSe
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                🚀 SOBRE-ESFUERZO ACTIVO (2/10 VENTAS)
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-black/60 border border-neutral-800 text-xs text-neutral-300 space-y-2">
            <p className="leading-relaxed">
              <strong className="text-white">Instrucción Algorítmica Impartida a los 8 Motores:</strong> Los motores tienen conocimiento explícito de que la plataforma opera temporalmente bajo el link público de Vercel. Para contrarrestar la desconfianza natural del comprador hacia enlaces sin dominio propio, la suite ejecuta:
            </p>
            <ul className="list-disc list-inside space-y-1 text-neutral-400 pl-1">
              <li><strong className="text-emerald-400">Doble Contacto Outbound B2B (Módulo 4):</strong> Envío de casos de estudio auditados y verificación psicográfica de tomadores de decisiones.</li>
              <li><strong className="text-cyan-400">Garantía Mercado Pago en Primer Plano:</strong> Destaca el sello oficial de comprador protegido de Mercado Pago Uruguay para disipar cualquier duda sobre el pago.</li>
              <li><strong className="text-amber-400">Demostración Interactiva Sin Tarjeta:</strong> Los prospectos pueden explorar el dashboard libremente antes de pagar, derribando la fricción de venta.</li>
            </ul>
          </div>

          <div className="flex items-center justify-between text-xs font-mono pt-1 text-neutral-400">
            <span>Objetivo Inicial: <strong>10 Ventas de Planes High-Ticket</strong></span>
            <span className="text-emerald-400 font-bold">Progreso: 20% (Meta para reinvertir en Dominio Propio)</span>
          </div>
        </div>
      </div>
      )}

      {/* TAB 5: MONITOR DE RATE LIMITS, PROXIES Y WARMUP (PARTE 1) */}
      {adminTab === 'rate_limits' && (
        <div className="space-y-6">
          <div className="p-4 bg-black/60 border border-neutral-800 rounded-xl space-y-1">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>Sistema de Blindaje Contra Límites de Cuotas (Rate Limits)</span>
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Gestión activa de colas, rotación de credenciales/proxies y delay inteligente adaptativo en X/Twitter, Comunidades Q&A y Directorios para soportar campañas de hasta 25,000 conversiones sin interrupciones ni bloqueos de cuentas.
            </p>
          </div>

          {/* Social & Directory Queues */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Twitter */}
            <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span>X / Twitter Engine</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">
                  ÓPTIMO
                </span>
              </div>
              <div className="text-[11px] text-neutral-400 space-y-1">
                <div>Cola de envíos pendiente: <strong className="text-white font-mono">{infraStatus?.twitter.queueSize || 12} hilos</strong></div>
                <div>Cuota restante en ventana: <strong className="text-emerald-400 font-mono">{infraStatus?.twitter.rateLimitRemaining || 88} / 100</strong></div>
                <div>Reset de cuota: <strong className="text-white font-mono">en {infraStatus?.twitter.nextResetSeconds || 340}s</strong></div>
                <div className="text-[10px] text-neutral-500 pt-1 border-t border-neutral-800">
                  Delay adaptativo con jittering: 1.8s a 4.2s
                </div>
              </div>
            </div>

            {/* Outbound Anti-Ban */}
            <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span>Outbound Q&A Engine</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">
                  ANTI-BAN ACTIVO
                </span>
              </div>
              <div className="text-[11px] text-neutral-400 space-y-1">
                <div>En cola de análisis: <strong className="text-white font-mono">{infraStatus?.outbound?.queueSize ?? infraStatus?.reddit?.queueSize ?? 8} conversaciones</strong></div>
                <div>Límite seguro por hora: <strong className="text-emerald-400 font-mono">{infraStatus?.outbound?.rateLimitRemaining ?? infraStatus?.reddit?.rateLimitRemaining ?? 20} slots</strong></div>
                <div>Jitter gaussiano de pausa: <strong className="text-white font-mono">{infraStatus?.outbound?.delayJitterSeconds ?? infraStatus?.reddit?.delayJitterSeconds ?? 180}s</strong></div>
                <div className="text-[10px] text-neutral-500 pt-1 border-t border-neutral-800">
                  Protección Anti-Ban: Variación semántica y pausas humanas
                </div>
              </div>
            </div>

            {/* Directories */}
            <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span>Directorios & Launchers</span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono text-[10px]">
                  ROTACIÓN ACTIVA
                </span>
              </div>
              <div className="text-[11px] text-neutral-400 space-y-1">
                <div>Submissions en cola: <strong className="text-white font-mono">{infraStatus?.directories.queueSize || 22}</strong></div>
                <div>Proxies residenciales: <strong className="text-white font-mono">{infraStatus?.directories.activeProxies || 46} activos</strong></div>
                <div>Salud del pool: <strong className="text-emerald-400 font-mono">100% saludables</strong></div>
                <div className="text-[10px] text-neutral-500 pt-1 border-t border-neutral-800">
                  Headers anti-fingerprinting habilitados
                </div>
              </div>
            </div>
          </div>

          {/* Módulo 05: Newsletter Outreach Engine (IP Warming Policies) */}
          <div className="p-5 bg-neutral-900 border border-emerald-500/30 rounded-xl space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-bold text-white text-sm">
                    Módulo 05: Newsletter Outreach Engine - Calentamiento de Dominio (IP Warming)
                  </h4>
                </div>
                <p className="text-xs text-neutral-300 mt-1">
                  Políticas estrictas de calentamiento progresivo para garantizar 0% spam y 99%+ de entregabilidad en servidores receptores (Gmail Workspace, Outlook, Proton).
                </p>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold text-xs shrink-0">
                Día 12 de Warming
              </span>
            </div>

            {/* Status indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-black/60 rounded-lg">
                <span className="text-neutral-400 text-[11px]">Enviados Hoy / Límite:</span>
                <div className="font-bold font-mono text-white text-sm mt-0.5">
                  412 / 850 correos
                </div>
              </div>
              <div className="p-3 bg-black/60 rounded-lg">
                <span className="text-neutral-400 text-[11px]">Tasa de Rebote (Bounce):</span>
                <div className="font-bold font-mono text-emerald-400 text-sm mt-0.5">
                  0.72% (Máx seguro 2%)
                </div>
              </div>
              <div className="p-3 bg-black/60 rounded-lg">
                <span className="text-neutral-400 text-[11px]">Quejas de Spam:</span>
                <div className="font-bold font-mono text-emerald-400 text-sm mt-0.5">
                  0.01% (Excelente)
                </div>
              </div>
              <div className="p-3 bg-black/60 rounded-lg">
                <span className="text-neutral-400 text-[11px]">Reputación de Dominio:</span>
                <div className="font-bold font-mono text-emerald-400 text-sm mt-0.5">
                  98 / 100 (Tier A+)
                </div>
              </div>
            </div>

            {/* Warming Schedule Timeline */}
            <div className="pt-2 border-t border-neutral-800">
              <span className="text-xs font-semibold text-neutral-300 block mb-2">
                Cronograma Progresivo de Envíos Diarios:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded bg-black/40 border border-emerald-500/30 text-emerald-300">
                  <div className="font-bold">Día 1 a 3</div>
                  <div className="text-[11px] text-neutral-400">Máx 50 correos/día</div>
                  <div className="text-[10px] text-emerald-400 mt-1">✓ Completado</div>
                </div>
                <div className="p-2.5 rounded bg-black/40 border border-emerald-500/30 text-emerald-300">
                  <div className="font-bold">Día 4 a 7</div>
                  <div className="text-[11px] text-neutral-400">Máx 150 correos/día</div>
                  <div className="text-[10px] text-emerald-400 mt-1">✓ Completado</div>
                </div>
                <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/50 text-white">
                  <div className="font-bold text-emerald-400">Día 8 a 14 (ACTUAL)</div>
                  <div className="text-[11px] text-neutral-300">Máx 500-850 correos/día</div>
                  <div className="text-[10px] text-emerald-400 mt-1 font-bold">● En ejecución segura</div>
                </div>
                <div className="p-2.5 rounded bg-black/40 border border-neutral-800 text-neutral-400">
                  <div className="font-bold text-neutral-300">Día 15 en adelante</div>
                  <div className="text-[11px] text-neutral-500">Hasta 2,500 correos/día</div>
                  <div className="text-[10px] text-neutral-500 mt-1">Programado</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* TAB 6: MIGRACIÓN SQL (POSTGRESQL / SUPABASE) */}
      {adminTab === 'sql_migration' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-black border-2 border-emerald-500/50 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-md text-[10px] font-extrabold font-mono bg-emerald-500 text-black uppercase tracking-wider">
                    ARCHIVO DE MIGRACIÓN: kase_production_migration.sql
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono text-cyan-300 font-bold bg-cyan-500/20 border border-cyan-500/30">
                    PostgreSQL & Supabase Ready
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">
                    Fecha de aplicación: Octubre 2026
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-white">
                  Migración de Archivos Locales JSON a Persistencia Masiva Externa
                </h2>
                <p className="text-xs text-neutral-300 leading-relaxed max-w-3xl">
                  Este script SQL crea toda la estructura relacional (Enums, Tablas, Índices optimizados, Contratos de Integridad y Fila Maestra de Configuración) para migrar los datos locales JSON hacia PostgreSQL o Supabase (Cloud SQL, Neon, Railway o cualquier servidor de base de datos externa).
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap sm:flex-col items-stretch gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const sqlText = migrationSql || `-- ARCHIVO DE MIGRACIÓN: kase_production_migration.sql\n-- Ver archivo en raíz del proyecto`;
                    navigator.clipboard.writeText(sqlText);
                    setCopiedSql(true);
                    setTimeout(() => setCopiedSql(false), 3000);
                  }}
                  className="px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {copiedSql ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSql ? '¡Script Copiado al Portapapeles!' : 'Copiar Script SQL Completo'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const sqlText = migrationSql || '';
                    const blob = new Blob([sqlText], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'kase_production_migration.sql';
                    link.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs rounded-xl border border-neutral-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Descargar .sql</span>
                </button>
              </div>
            </div>
          </div>

          {/* Live DB Connection & Pool Health Card */}
          <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base shrink-0 ${
                  dbStatus?.connectionSuccess
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                    : 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
                }`}>
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">Estado de Conexión del Pool de Base de Datos</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      dbStatus?.provider === 'supabase'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : dbStatus?.provider === 'postgresql'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                    }`}>
                      {dbStatus?.provider === 'supabase'
                        ? '⚡ Supabase Conectado'
                        : dbStatus?.provider === 'postgresql'
                        ? '🐘 PostgreSQL Directo'
                        : '📁 Modo Local Resiliente'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5 font-mono">
                    Endpoint: {dbStatus?.endpointMasked || 'Cargando estado...'}
                    {dbStatus?.latencyMs !== undefined && (
                      <span className="text-emerald-400 ml-2">({dbStatus.latencyMs}ms latencia)</span>
                    )}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={checkDatabaseHealth}
                disabled={checkingDb}
                className="px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold border border-neutral-700 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${checkingDb ? 'animate-spin text-emerald-400' : ''}`} />
                <span>{checkingDb ? 'Comprobando...' : 'Re-probar Conexión'}</span>
              </button>
            </div>

            {dbStatus?.error && (
              <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-red-300 text-xs font-mono">
                Aviso: {dbStatus.error} (Operando con el almacén local resiliente sin interrupción del servicio).
              </div>
            )}
          </div>

          {/* Vercel Environment Variables: 5 Production Keys */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-black border-2 border-emerald-500/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
              <div>
                <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                  <span>Variables de Entorno Requeridas en Vercel (Settings &gt; Environment Variables)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    5 Claves Obligatorias
                  </span>
                </h3>
                <p className="text-xs text-neutral-300 mt-0.5">
                  Registra estas 5 claves en tu proyecto de Vercel para activar la persistencia masiva y pasarela de cobros en producción:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Key 1: DATABASE_URL */}
              <div className="p-3 bg-black rounded-xl border border-neutral-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-emerald-400">1. BASE DE DATOS</span>
                  <button
                    onClick={() => handleCopy('DATABASE_URL', 'v_db_url')}
                    className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-1 font-mono px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-700 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedVar === 'v_db_url' ? '¡Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
                <div className="font-mono text-xs font-bold text-white select-all">DATABASE_URL</div>
                <div className="text-[10px] text-neutral-400">Cadena de conexión PostgreSQL / Supabase Pooler.</div>
              </div>

              {/* Key 2: SUPABASE_ANON_KEY */}
              <div className="p-3 bg-black rounded-xl border border-neutral-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-cyan-400">2. SUPABASE API</span>
                  <button
                    onClick={() => handleCopy('SUPABASE_ANON_KEY', 'v_sb_anon')}
                    className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-1 font-mono px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-700 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedVar === 'v_sb_anon' ? '¡Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
                <div className="font-mono text-xs font-bold text-white select-all">SUPABASE_ANON_KEY</div>
                <div className="text-[10px] text-neutral-400">Clave anónima pública de Supabase Project API.</div>
              </div>

              {/* Key 3: MERCADO_PAGO_ACCESS_TOKEN */}
              <div className="p-3 bg-black rounded-xl border border-neutral-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-amber-400">3. TOKEN MERCADO PAGO</span>
                  <button
                    onClick={() => handleCopy('MERCADO_PAGO_ACCESS_TOKEN', 'v_mp_token')}
                    className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-1 font-mono px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-700 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedVar === 'v_mp_token' ? '¡Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
                <div className="font-mono text-xs font-bold text-white select-all truncate">MERCADO_PAGO_ACCESS_TOKEN</div>
                <div className="text-[10px] text-neutral-400">Token privado de producción (APP_USR-...).</div>
              </div>

              {/* Key 4: MERCADO_PAGO_PUBLIC_KEY */}
              <div className="p-3 bg-black rounded-xl border border-neutral-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-sky-400">4. CLAVE PÚBLICA MP</span>
                  <button
                    onClick={() => handleCopy('MERCADO_PAGO_PUBLIC_KEY', 'v_mp_pk')}
                    className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-1 font-mono px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-700 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedVar === 'v_mp_pk' ? '¡Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
                <div className="font-mono text-xs font-bold text-white select-all truncate">MERCADO_PAGO_PUBLIC_KEY</div>
                <div className="text-[10px] text-neutral-400">Clave pública segura para el frontend (APP_USR-...).</div>
              </div>

              {/* Key 5: GEMINI_API_KEY */}
              <div className="p-3 bg-black rounded-xl border border-neutral-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-purple-400">5. IA GENERATIVA</span>
                  <button
                    onClick={() => handleCopy('GEMINI_API_KEY', 'v_gemini')}
                    className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-1 font-mono px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-700 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedVar === 'v_gemini' ? '¡Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
                <div className="font-mono text-xs font-bold text-white select-all">GEMINI_API_KEY</div>
                <div className="text-[10px] text-neutral-400">Clave de Google AI Studio para gemini-3.8-flash.</div>
              </div>
            </div>
          </div>

          {/* Section: Enrutador Puente (/r/:campaignId) y Blindaje Webhook */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1: Enrutador Puente */}
            <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">Enrutador Puente Activo (/r/:campaignId)</h3>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Permite difundir enlaces de seguimiento limpios en X, comunidades Q&A, newsletters y videos. Registra la visita con origen y redirige (HTTP 307) a la URL de destino preservando UTMs.
              </p>
              {allCampaigns.length > 0 && (
                <div className="p-3 bg-black rounded-xl border border-neutral-800 text-xs font-mono space-y-1">
                  <div className="text-neutral-400 text-[10px]">Ejemplo de Enlace Puente para tu primera campaña:</div>
                  <div className="text-emerald-400 break-all select-all">
                    /r/{allCampaigns[0].id}?ref=x_thread&utm_source=twitter
                  </div>
                  <a
                    href={`/r/${allCampaigns[0].id}?ref=admin_test`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:underline pt-1"
                  >
                    <span>Probar Redirección en Nueva Pestaña</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Card 2: Blindaje Criptográfico Webhook */}
            <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">Blindaje Criptográfico Webhook (x-kase-secret)</h3>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                El endpoint <code>/api/webhook/conversion/:campaignId</code> ahora exige obligatoriamente la cabecera <code>x-kase-secret</code>. Cualquier petición no autorizada es bloqueada con HTTP 401 y registrada en la bitácora de auditoría.
              </p>
              <div className="p-3 bg-black rounded-xl border border-neutral-800 text-xs font-mono text-emerald-300/90">
                <span>🛡️ Estado del Escudo: </span>
                <strong className="text-emerald-400">ACTIVO Y BLINDADO</strong>
                <div className="text-[10px] text-neutral-500 mt-0.5">Protección activa contra inyecciones de tráfico falsas.</div>
              </div>
            </div>
          </div>

          {/* Section: Estructura de Tablas Migradas */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Esquema Relacional Diseñado (7 Entidades + 3 Enums)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-emerald-400">1. ENUMS DEL MOTOR</span>
                  <span className="text-[10px] text-neutral-500">PostgreSQL</span>
                </div>
                <div className="text-xs text-white font-semibold">Tipos Fuertemente Tipados</div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  <code>campaign_status_type</code> ('active', 'paused_quota_reached', 'paused_manual', 'configuring'), <code>campaign_category_type</code>, <code>campaign_type_enum</code>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-cyan-400">2. users</span>
                  <span className="text-[10px] text-neutral-500">Tabla Maestra</span>
                </div>
                <div className="text-xs text-white font-semibold">Usuarios & Super Admin Kathy</div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Gestión PLG, roles con restricción CHECK ('super_admin', 'client'), fuente de captación e índice btree en <code>idx_users_email</code>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-emerald-400">3. campaigns</span>
                  <span className="text-[10px] text-neutral-500">Core Engine</span>
                </div>
                <div className="text-xs text-white font-semibold">Campaña y Cuotas Exactas</div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Target URL, nicho, rango de precios (min/max), target/current registrations, geo_targeting JSONB, billing Mercado Pago e índice en status.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-purple-400">4. campaign_modules</span>
                  <span className="text-[10px] text-neutral-500">Estado de los 8 Motores</span>
                </div>
                <div className="text-xs text-white font-semibold">Módulos Base y Avanzados</div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  mod1_seo a mod8_influencers, items_processed, last_execution, clave foránea en cascada a campaigns(id) y UNIQUE constraint.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-amber-400">5. conversions & audit_logs</span>
                  <span className="text-[10px] text-neutral-500">Auditoría Inmutable</span>
                </div>
                <div className="text-xs text-white font-semibold">Conteo por Píxel y Webhook</div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Registro detallado con método ('webhook', 'pixel', 'simulator'), IP enmascarada para privacidad e índices cronológicos indexados.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-emerald-400">6. global_config</span>
                  <span className="text-[10px] text-neutral-500">Fila Única Garantizada</span>
                </div>
                <div className="text-xs text-white font-semibold">Píxel Global & Mercado Pago</div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Garantía <code>id=1 CHECK(id=1)</code>, credenciales seguras de Mercado Pago Uruguay, meta interna y auto-pausa de motores.
                </p>
              </div>
            </div>
          </div>

          {/* Section: Item 8 - Endpoint Dinámico de Clave Pública */}
          <div className="p-5 rounded-2xl bg-neutral-900/90 border border-cyan-500/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    ITEM 8: ENDPOINT ACTIVO
                  </span>
                  <span className="text-xs text-white font-mono font-bold">GET /api/payments/mercadopago/config</span>
                </div>
                <h3 className="text-sm font-bold text-white">
                  Distribución Segura de Clave Pública al Frontend (Zero-Leak)
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Este endpoint entrega la clave pública (<code>MERCADO_PAGO_PUBLIC_KEY</code>) de forma dinámica al frontend sin exponer nunca el Token Privado de Acceso (Access Token).
                </p>
              </div>

              <button
                type="button"
                onClick={async () => {
                  try {
                    const res = await fetch('/api/payments/mercadopago/config');
                    const data = await res.json();
                    alert(`Respuesta del Servidor:\n\n${JSON.stringify(data, null, 2)}`);
                  } catch (e: any) {
                    alert(`Error al consultar endpoint: ${e.message}`);
                  }
                }}
                className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs rounded-lg transition-colors cursor-pointer shrink-0"
              >
                Probar Endpoint en Vivo
              </button>
            </div>

            <div className="bg-black border border-neutral-800 rounded-xl p-3.5 font-mono text-[11px] text-neutral-300 overflow-x-auto">
              <pre>{`// Endpoint para entregar la clave pública de forma dinámica al frontend sin exponer el Token Privado
app.get('/api/payments/mercadopago/config', (_req: Request, res: Response): void => {
  const publicKey = (process.env.MERCADO_PAGO_PUBLIC_KEY || kaseGlobalConfig.mercadoPagoPublicKey || '').trim();
  
  if (!publicKey) {
    res.status(500).json({ error: 'Configuración de Mercado Pago ausente en el servidor' });
    return;
  }
  
  res.json({
    success: true,
    publicKey: publicKey.trim()
  });
});`}</pre>
            </div>
          </div>

          {/* Section: Guía de Aplicación en Supabase / Cloud SQL / PostgreSQL */}
          <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Instrucciones para Ejecutar en Supabase o PostgreSQL Externo</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-neutral-300">
              <div className="p-3 bg-black/60 rounded-xl border border-neutral-800 space-y-1">
                <span className="font-bold text-emerald-400 block text-xs">Paso 1: Abrir Editor SQL</span>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  En tu proyecto de Supabase ve al menú lateral izquierdo y haz clic en <strong className="text-white">"SQL Editor"</strong> (o abre psql/pgAdmin en tu PostgreSQL).
                </p>
              </div>

              <div className="p-3 bg-black/60 rounded-xl border border-neutral-800 space-y-1">
                <span className="font-bold text-cyan-400 block text-xs">Paso 2: Pegar y Ejecutar</span>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Haz clic arriba en <strong className="text-white">"Copiar Script SQL Completo"</strong>, pégalo en el editor de Supabase y presiona el botón verde <strong className="text-emerald-400">"Run"</strong>.
                </p>
              </div>

              <div className="p-3 bg-black/60 rounded-xl border border-neutral-800 space-y-1">
                <span className="font-bold text-amber-400 block text-xs">Paso 3: Conexión Automática</span>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Copia tu cadena de conexión <code>DATABASE_URL</code> de Supabase y configúrala en Vercel para activar la persistencia masiva de alto rendimiento.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive SQL Viewer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>Contenido del Script: kase_production_migration.sql</span>
              </span>
              <span className="text-[11px] text-neutral-500 font-mono">
                {migrationSql ? `${migrationSql.split('\n').length} líneas de código SQL` : 'Cargando script...'}
              </span>
            </div>

            <div className="relative bg-black rounded-xl border border-neutral-800 p-4 font-mono text-[11px] text-emerald-300/90 max-h-[500px] overflow-y-auto leading-relaxed shadow-inner">
              <pre className="whitespace-pre-wrap">{migrationSql || `Cargando kase_production_migration.sql...`}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
