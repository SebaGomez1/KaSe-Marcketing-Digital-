/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CampaignHeader } from './components/CampaignHeader';
import { CampaignOverview } from './components/CampaignOverview';
import { ModulesGrid } from './components/ModulesGrid';
import { ModuleDetailModal } from './components/ModuleDetailModal';
import { IntegrationPanel } from './components/IntegrationPanel';
import { TrafficSimulator } from './components/TrafficSimulator';
import { PlansComparison } from './components/PlansComparison';
import { SystemAuditLogs } from './components/SystemAuditLogs';
import { NewCampaignModal } from './components/NewCampaignModal';
import { ClientOnboardingGuide } from './components/ClientOnboardingGuide';
import { PWAInstallModal } from './components/PWAInstallModal';
import { SuperAdminPanel } from './components/SuperAdminPanel';
import { AuthModal } from './components/AuthModal';
import { MercadoPagoCheckoutModal } from './components/MercadoPagoCheckoutModal';
import { LandingHero } from './components/LandingHero';
import { CustomerReviewsSection } from './components/CustomerReviewsSection';
import { ActiveCampaignsSection } from './components/ActiveCampaignsSection';
import { KaseAssistantWidget } from './components/KaseAssistantWidget';
import { Campaign, ModuleDefinition, User, isUserSuperAdmin } from './types/growth';
import avatarImg from './assets/images/avatar_growth_lead_1792397446672.jpg';
import { Smartphone, Download, ShieldCheck, WifiOff } from 'lucide-react';

export default function App() {
  // 1. Persistent Authentication State Initialization (Immediate execution from persistent storage)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = typeof window !== 'undefined' ? window.localStorage.getItem('kase_current_user') : null;
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (parsed && (parsed.email || parsed.name || parsed.id)) {
        if (parsed.email && parsed.email.toLowerCase() === 'kase.marketing.digital@gmail.com') {
          parsed.role = 'client';
        } else if (isUserSuperAdmin(parsed) || (parsed.email && parsed.email.toLowerCase() === 'kathyseba2020@gmail.com')) {
          parsed.role = 'super_admin';
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  // Active View Persistent Mirroring (Retains viewport across reloads)
  const [activeTab, setActiveTab] = useState<string>(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedTab = window.localStorage.getItem('kase_active_tab');
        const savedUser = window.localStorage.getItem('kase_current_user');
        if (savedUser) {
          if (savedTab && savedTab !== 'landing') {
            return savedTab;
          }
          const parsedUser = JSON.parse(savedUser);
          if (parsedUser.role === 'super_admin' || parsedUser.email?.toLowerCase() === 'kathyseba2020@gmail.com') {
            return 'admin_global';
          }
          return 'dashboard';
        }
      }
    } catch {
      // ignore
    }
    return 'landing';
  });

  // Cached Campaigns Immediate Population (Zero-flash: renders active metrics in <10ms on reload)
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = window.localStorage.getItem('kase_cached_campaigns');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [activeCampaignId, setActiveCampaignId] = useState<string>(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedId = window.localStorage.getItem('kase_active_campaign_id');
        if (savedId) return savedId;
        const savedCamps = window.localStorage.getItem('kase_cached_campaigns');
        if (savedCamps) {
          const parsed = JSON.parse(savedCamps);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed[0].id;
        }
      }
    } catch {
      // ignore
    }
    return '';
  });

  const [selectedModule, setSelectedModule] = useState<ModuleDefinition | null>(null);
  
  // Modals state
  const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [campaignForCheckout, setCampaignForCheckout] = useState<Campaign | null>(null);
  const [selectedInitialPlan, setSelectedInitialPlan] = useState<'basic' | 'starter' | 'growth' | 'enterprise'>('starter');

  // Internet Connectivity Guard (Strict Online Enforcement)
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      fetchCampaigns();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync user state to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        window.localStorage.setItem('kase_current_user', JSON.stringify(currentUser));
      } else {
        window.localStorage.removeItem('kase_current_user');
      }
    } catch (e) {
      // ignore
    }
  }, [currentUser]);

  // Sync activeTab to localStorage so reload preserves viewport
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && activeTab) {
        window.localStorage.setItem('kase_active_tab', activeTab);
      }
    } catch (e) {
      // ignore
    }
  }, [activeTab]);

  // Sync activeCampaignId to localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && activeCampaignId) {
        window.localStorage.setItem('kase_active_campaign_id', activeCampaignId);
      }
    } catch (e) {
      // ignore
    }
  }, [activeCampaignId]);

  // Direct admin bypass via URL parameter (?admin=kathy or ?kathy=true)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === 'kathy' || params.get('kathy') === 'true') {
        const kathyUser: User = {
          id: 'kase_super_admin',
          name: 'Kathy Seba (Super Admin)',
          email: 'kathyseba2020@gmail.com',
          role: 'super_admin',
          createdAt: new Date().toISOString(),
          acquisitionSource: 'direct_organic',
        };
        setCurrentUser(kathyUser);
        setActiveTab('admin_global');
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Fetch campaigns from backend with strict user_id data isolation and cross-device sync
  const fetchCampaigns = async () => {
    try {
      const authenticatedUserId = currentUser?.id || currentUser?.email || '';
      const isSuperAdmin = currentUser?.role === 'super_admin' || currentUser?.email?.toLowerCase().trim() === 'kathyseba2020@gmail.com';

      // Strict user_id parameter passed to query: Global Admin gets all, client gets partitioned
      const queryParam = isSuperAdmin
        ? ''
        : authenticatedUserId
        ? `?user_id=${encodeURIComponent(authenticatedUserId)}&email=${encodeURIComponent(currentUser?.email || '')}`
        : '?user_id=anonymous_unauthenticated';

      const res = await fetch(`/api/campaigns${queryParam}`);
      if (!res.ok) {
        return;
      }
      const data = await res.json();
      const loadedCampaigns = Array.isArray(data.campaigns) ? data.campaigns : [];

      // Ensure data isolation on the client as well: never render admin campaigns if not super_admin
      const isolatedCampaigns = isSuperAdmin
        ? loadedCampaigns
        : loadedCampaigns.filter(
            (c: Campaign) =>
              (c.userId && (c.userId === authenticatedUserId || c.userId === currentUser?.email)) ||
              (c.creatorEmail && c.creatorEmail.toLowerCase() === (currentUser?.email || '').toLowerCase())
          );

      if (isolatedCampaigns.length > 0) {
        setCampaigns(isolatedCampaigns);
        try {
          window.localStorage.setItem('kase_cached_campaigns', JSON.stringify(isolatedCampaigns));
        } catch {}

        setActiveCampaignId((prevId) => {
          if (prevId && isolatedCampaigns.some((c: Campaign) => c.id === prevId)) {
            return prevId;
          }
          return isolatedCampaigns[0].id;
        });
      } else {
        // Only clear cache if explicitly logged out
        if (!currentUser) {
          setCampaigns([]);
          setActiveCampaignId('');
          try {
            window.localStorage.removeItem('kase_cached_campaigns');
            window.localStorage.removeItem('kase_active_campaign_id');
          } catch {}
        }
      }
    } catch (err) {
      console.error('Error fetching campaigns:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();

    // Absolute Unitary Conversion Tracking: Poll every 3.5s to render atomized unit-by-unit increments (+1)
    if (!currentUser) return;
    const syncTimer = setInterval(() => {
      fetchCampaigns();
    }, 3500);

    return () => clearInterval(syncTimer);
  }, [currentUser?.id, currentUser?.email]);

  // Route Guard: Unauthenticated visitors can ONLY view landing (Hero), guide (¿Cómo funciona?) or reviews (Reseñas)
  useEffect(() => {
    if (!currentUser && activeTab !== 'landing' && activeTab !== 'guide' && activeTab !== 'reviews') {
      setActiveTab('landing');
    }
  }, [currentUser, activeTab]);

  // Fix: Immediately scroll viewport to the top on every tab or campaign change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeTab, activeCampaignId]);

  const activeCampaign = campaigns.find((c) => c.id === activeCampaignId) || campaigns[0];

  // Quick Action: Simulate Burst
  const handleSimulateBurst = async (count: number) => {
    if (!activeCampaign) return;
    setIsActionLoading(true);
    try {
      const res = await fetch(`/api/campaigns/${activeCampaign.id}/simulate-burst`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count }),
      });
      await res.json();
      await fetchCampaigns();
    } catch (err) {
      console.error('Error in simulate burst:', err);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Quick Action: Reset Counter
  const handleResetCounter = async () => {
    if (!activeCampaign) return;
    setIsActionLoading(true);
    try {
      await fetch(`/api/campaigns/${activeCampaign.id}/reset-counter`, {
        method: 'POST',
      });
      await fetchCampaigns();
    } catch (err) {
      console.error('Error resetting counter:', err);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Quick Action: Toggle Status
  const handleToggleStatus = async () => {
    if (!activeCampaign) return;
    setIsActionLoading(true);
    const newStatus = activeCampaign.status === 'active' ? 'paused_manual' : 'active';
    try {
      await fetch(`/api/campaigns/${activeCampaign.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      await fetchCampaigns();
    } catch (err) {
      console.error('Error toggling status:', err);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Update Plan
  const handleUpdatePlan = async (plan: 'basic' | 'starter' | 'growth' | 'enterprise', targetRegistrations: number) => {
    if (!activeCampaign) return;
    setIsActionLoading(true);
    try {
      await fetch(`/api/campaigns/${activeCampaign.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, targetRegistrations }),
      });
      await fetchCampaigns();
    } catch (err) {
      console.error('Error updating plan:', err);
    } finally {
      setIsActionLoading(false);
    }
  };

  // On New Campaign Created (PLG flow -> triggers Checkout modal)
  const handleCreatedCampaign = (newCamp: Campaign) => {
    setCampaigns((prev) => [newCamp, ...prev]);
    setActiveCampaignId(newCamp.id);
    if (currentUser?.email) {
      const userKey = `kase_campaigns_${currentUser.email.toLowerCase().trim()}`;
      try {
        const existing = JSON.parse(window.localStorage.getItem(userKey) || '[]');
        const updated = [newCamp, ...existing.filter((c: Campaign) => c.id !== newCamp.id)];
        window.localStorage.setItem(userKey, JSON.stringify(updated));
      } catch (e) {}
    }
    setCampaignForCheckout(newCamp);
    setIsCheckoutModalOpen(true);
  };

  // On Payment Success (Mercado Pago IPN simulation or real confirmation)
  const handlePaymentSuccess = (activatedCamp: Campaign) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === activatedCamp.id ? activatedCamp : c))
    );
    setActiveTab('dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] text-neutral-400 flex items-center justify-center font-mono text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Iniciando Suite Monolítica Modular KaSe...</span>
        </div>
      </div>
    );
  }

  // Safe New Campaign Trigger: Requires login first, can pre-select plan
  const handleOpenNewCampaign = (planId?: 'basic' | 'starter' | 'growth' | 'enterprise') => {
    if (planId) {
      setSelectedInitialPlan(planId);
    }
    if (!currentUser) {
      setIsAuthModalOpen(true);
    } else {
      setIsNewCampaignOpen(true);
    }
  };

  // Direct $1.00 USD Test Checkout Trigger for Kathy
  const handleOpenOneDollarCheckout = () => {
    const baseCamp = activeCampaign || campaigns[0];
    const testCamp: Campaign = {
      ...(baseCamp || {
        id: `kase_test_1usd_${Date.now()}`,
        name: 'Autoprueba Mercado Pago ($1.00 USD)',
        targetUrl: 'https://kase-marketing.vercel.app',
        niche: 'Fintech & SaaS',
        description: 'Prueba de cobro de $1.00 USD en pasarela de producción Mercado Pago Uruguay',
        campaignType: 'user_registrations',
        targetUnitLabel: 'usuarios registrados',
        targetRegistrations: 10,
        currentRegistrations: 0,
        plan: 'starter',
        status: 'configuring',
        createdAt: new Date().toISOString(),
        modules: {} as any,
        recentConversions: [],
        logs: [],
      }),
      billing: {
        subscriptionStatus: 'pending',
        paymentGateway: 'mercadopago_uy',
        frequency: 'monthly',
        monthlyAmount: 1,
        currency: 'USD',
        nextBillingDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
        payerEmail: currentUser?.email || 'kathyseba2020@gmail.com',
        subscriptionId: `sub_test_1usd_${Date.now()}`,
      },
    };
    setCampaignForCheckout(testCamp);
    setIsCheckoutModalOpen(true);
  };

  // Logout handler to return to Hero
  const handleLogout = () => {
    try {
      window.localStorage.removeItem('kase_current_user');
      window.localStorage.removeItem('kase_active_tab');
      window.localStorage.removeItem('kase_cached_campaigns');
      window.localStorage.removeItem('kase_active_campaign_id');
    } catch (e) {
      // ignore
    }
    setCurrentUser(null);
    setCampaigns([]);
    setActiveCampaignId('');
    setActiveTab('landing');
  };

  const isSuperAdmin = (currentUser?.email || '').toLowerCase() === 'kathyseba2020@gmail.com';

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-neutral-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200 w-full max-w-full overflow-x-hidden">
      {/* Top Bar Contract (1 line brand, nav links, actions) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewCampaign={handleOpenNewCampaign}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        currentUser={currentUser}
        avatarUrl={avatarImg}
        onRequestOneDollarCheckout={handleOpenOneDollarCheckout}
      />

      {/* Offline Alert Bar: Application strictly operates online */}
      {!isOnline && (
        <div className="bg-rose-950/95 border-b border-rose-500/60 px-4 py-2.5 text-center text-xs font-bold text-rose-200 flex items-center justify-center gap-2 sticky top-16 z-50 backdrop-blur-md shadow-lg shadow-rose-950/40">
          <WifiOff className="w-4 h-4 text-rose-400 animate-pulse shrink-0" />
          <span>CONEXIÓN A INTERNET REQUERIDA: KaSe y el Agente de IA operan ÚNICAMENTE EN LÍNEA para comunicarse con los motores y procesar datos en tiempo real.</span>
        </div>
      )}

      {/* Campaign Header & Selector: STRICTLY visible only when user is logged in and not on public or macro tabs */}
      {currentUser && activeCampaign && activeTab !== 'admin_global' && activeTab !== 'landing' && activeTab !== 'reviews' && activeTab !== 'guide' && activeTab !== 'active_campaigns' && (
        <CampaignHeader
          campaign={activeCampaign}
          allCampaigns={campaigns}
          onSelectCampaign={(id) => setActiveCampaignId(id)}
          onToggleStatus={handleToggleStatus}
          onResetCounter={handleResetCounter}
          isActionLoading={isActionLoading}
        />
      )}

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 overflow-x-hidden">
        {/* PUBLIC HERO & LANDING PAGE (PLG) */}
        {activeTab === 'landing' ? (
          <LandingHero
            currentUser={currentUser}
            onLoginSuccess={(user) => {
              setCurrentUser(user);
              if (user.role === 'super_admin') {
                setActiveTab('admin_global');
              } else {
                setActiveTab('dashboard');
              }
            }}
            onGoToDashboard={() => setActiveTab('dashboard')}
            onOpenNewCampaign={handleOpenNewCampaign}
            onGoToReviews={() => setActiveTab('reviews')}
            onGoToGuide={() => setActiveTab('guide')}
            onOpenInstallModal={() => setIsInstallModalOpen(true)}
            onRequestOneDollarCheckout={handleOpenOneDollarCheckout}
          />
        ) : activeTab === 'reviews' ? (
          <CustomerReviewsSection
            currentUser={currentUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        ) : activeTab === 'guide' ? (
          <ClientOnboardingGuide
            currentUser={currentUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onNavigateTab={(tab) => {
              if (!currentUser && tab !== 'plans' && tab !== 'guide' && tab !== 'reviews' && tab !== 'landing' && tab !== 'modules') {
                setIsAuthModalOpen(true);
              } else {
                setActiveTab(tab);
              }
            }}
            onOpenNewCampaign={handleOpenNewCampaign}
          />
        ) : activeTab === 'plans' ? (
          <PlansComparison
            campaign={activeCampaign}
            onUpdatePlan={handleUpdatePlan}
            currentUser={currentUser}
            onRequestOneDollarCheckout={handleOpenOneDollarCheckout}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onOpenNewCampaignWithPlan={(planId) => {
              setSelectedInitialPlan(planId);
              if (!currentUser) {
                setIsAuthModalOpen(true);
              } else {
                setIsNewCampaignOpen(true);
              }
            }}
          />
        ) : activeTab === 'modules' ? (
          <ModulesGrid
            campaign={activeCampaign}
            onSelectModule={(mod) => setSelectedModule(mod)}
            onOpenNewCampaign={handleOpenNewCampaign}
            onOpenPlans={() => setActiveTab('plans')}
          />
        ) : !currentUser ? (
          <LandingHero
            currentUser={currentUser}
            onLoginSuccess={(user) => {
              setCurrentUser(user);
              if (user.role === 'super_admin') {
                setActiveTab('admin_global');
              } else {
                setActiveTab('dashboard');
              }
            }}
            onGoToDashboard={() => setActiveTab('dashboard')}
            onOpenNewCampaign={handleOpenNewCampaign}
            onGoToReviews={() => setActiveTab('reviews')}
            onGoToGuide={() => setActiveTab('guide')}
            onGoToModules={() => setActiveTab('modules')}
            onOpenInstallModal={() => setIsInstallModalOpen(true)}
            onRequestOneDollarCheckout={handleOpenOneDollarCheckout}
          />
        ) : activeTab === 'admin_global' && isSuperAdmin ? (
          <SuperAdminPanel
            currentUser={currentUser}
            allCampaigns={campaigns}
            onRefreshCampaigns={fetchCampaigns}
          />
        ) : activeTab === 'active_campaigns' ? (
          <ActiveCampaignsSection
            campaigns={campaigns}
            activeCampaignId={activeCampaignId}
            onSelectCampaign={(id) => {
              setActiveCampaignId(id);
              setActiveTab('dashboard');
            }}
            onOpenNewCampaign={handleOpenNewCampaign}
            onToggleStatus={handleToggleStatus}
            onGoToDashboard={(id) => {
              setActiveCampaignId(id);
              setActiveTab('dashboard');
            }}
            currentUser={currentUser}
          />
        ) : activeCampaign ? (
          <>
            {activeTab === 'dashboard' && (
              <CampaignOverview
                campaign={activeCampaign}
                onSimulateBurst={handleSimulateBurst}
                onOpenIntegration={() => setActiveTab('integration')}
                onOpenModules={() => setActiveTab('modules')}
                onOpenGuide={() => setActiveTab('guide')}
                onOpenPlans={() => setActiveTab('plans')}
                isSimulating={isActionLoading}
              />
            )}

            {activeTab === 'integration' && (
              <IntegrationPanel
                campaign={activeCampaign}
                onRefreshCampaign={fetchCampaigns}
              />
            )}

            {activeTab === 'logs' && (
              <SystemAuditLogs campaign={activeCampaign} />
            )}
          </>
        ) : (
          <div className="py-12 sm:py-20 max-w-2xl mx-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto text-2xl shadow-xl shadow-emerald-500/10">
              🚀
            </div>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero-Mock: Funcionamiento Real Garantizado</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                No hay campañas activas actualmente
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Todas las campañas previas han sido procesadas. Configura una nueva campaña con el link de tu web o red social y los objetivos de tráfico. Los motores autónomos de KaSe se encargan del 100% de la ejecución sin necesidad de que crees ni configures ninguna API.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 text-left space-y-3 max-w-lg mx-auto text-xs text-neutral-300">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Protocolo de Ejecución Autónoma KaSe:</span>
              </div>
              <ul className="space-y-1.5 list-disc list-inside text-neutral-400 text-[11px]">
                <li>Zero-API: Tú solo ingresas tu link y datos de campaña; KaSe ejecuta el tráfico.</li>
                <li>Monitoreo de conversiones e impresiones en tiempo real.</li>
                <li>Garantía de crecimiento orgánico y tasa de conversión protegida.</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => handleOpenNewCampaign()}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold rounded-xl text-xs transition-all glow-emerald cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                + Configurar y Validar Nueva Campaña
              </button>
              {isSuperAdmin && (
                <button
                  onClick={() => setActiveTab('admin_global')}
                  className="w-full sm:w-auto px-5 py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  🛡️ Ver Funcionamiento Óptimo
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* FLOATING ACTION BUTTON: DEDICATED MOBILE & DESKTOP INSTALL BUTTON */}
      <div className="fixed bottom-4 left-4 z-40">
        <button
          onClick={() => setIsInstallModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-2xl shadow-emerald-500/50 transition-all transform hover:scale-105 cursor-pointer glow-emerald"
          title="Instalar App KaSe en tu celular"
        >
          <span className="text-base">📱</span>
          <span>Instalar App</span>
        </button>
      </div>

      {/* Module Inspector & AI Generation Modal */}
      {selectedModule && (
        <ModuleDetailModal
          moduleDef={selectedModule}
          campaign={activeCampaign}
          onClose={() => setSelectedModule(null)}
        />
      )}

      {/* New Campaign Creation Modal (With Zero-Install Smart Bridge Router & Dynamic Geo Targeting) */}
      <NewCampaignModal
        isOpen={isNewCampaignOpen}
        onClose={() => setIsNewCampaignOpen(false)}
        onCreated={handleCreatedCampaign}
        currentUser={currentUser}
        initialPlan={selectedInitialPlan || 'starter'}
        campaign={activeCampaign || null}
        onRequestCheckout={(camp) => {
          setCampaignForCheckout(camp);
          setIsCheckoutModalOpen(true);
        }}
      />

      {/* Dedicated PWA Install Modal (Chrome & Safari step-by-step) */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Authentication Modal (PLG Free Signup + Super Admin kathyseba2020@gmail.com) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          if (user.role === 'super_admin') {
            setActiveTab('admin_global');
          }
        }}
      />

      {/* Mercado Pago Checkout & IPN Modal */}
      {campaignForCheckout && (
        <MercadoPagoCheckoutModal
          isOpen={isCheckoutModalOpen}
          onClose={() => setIsCheckoutModalOpen(false)}
          campaign={campaignForCheckout}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Quiet Minimal Footer */}
      <footer className="border-t border-neutral-900 bg-[#0B0B0B] py-6 px-4 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-neutral-400 font-semibold">KaSe - Marketing Digital</span>
            <span aria-hidden="true">·</span>
            <span>Suite Monolítica Modular de Crecimiento Orgánico</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Control de Cuota Autónomo</span>
            <span aria-hidden="true">·</span>
            <span>Zero-Access Security</span>
            <span aria-hidden="true">·</span>
            <span>IP Warming & Rate Limit Safe</span>
          </div>
        </div>
      </footer>

      {/* ALWAYS ACCESSIBLE & NON-INTRUSIVE: KaSi COPILOTO INTELIGENTE */}
      <KaseAssistantWidget
        activeTab={activeTab}
        onNavigateTab={(tab) => setActiveTab(tab)}
        activeCampaign={activeCampaign}
        campaigns={campaigns}
        onToggleCampaignStatus={handleToggleStatus}
        onResetCounter={handleResetCounter}
        onSimulateBurst={(count) => handleSimulateBurst(count)}
        onOpenNewCampaign={handleOpenNewCampaign}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenOneDollarCheckout={handleOpenOneDollarCheckout}
        currentUser={currentUser}
        onSelectCampaign={(id) => setActiveCampaignId(id)}
        isOnline={isOnline}
      />
    </div>
  );
}
