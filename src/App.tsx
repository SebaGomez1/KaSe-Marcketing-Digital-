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
import { Campaign, ModuleDefinition, User } from './types/growth';
import avatarImg from './assets/images/avatar_growth_lead_1792397446672.jpg';
import { Smartphone, Download, ShieldCheck } from 'lucide-react';

export default function App() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeCampaignId, setActiveCampaignId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [selectedModule, setSelectedModule] = useState<ModuleDefinition | null>(null);
  
  // Modals state
  const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [campaignForCheckout, setCampaignForCheckout] = useState<Campaign | null>(null);

  // User Authentication State (Persisted in localStorage with auto-detect for Kathy)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = typeof window !== 'undefined' ? window.localStorage.getItem('kase_current_user') : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.email || parsed.name)) {
          return parsed;
        }
      }
    } catch (e) {
      // ignore
    }
    return null;
  });

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

  // Direct admin bypass via URL parameter (?admin=kathy or ?kathy=true)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === 'kathy' || params.get('kathy') === 'true') {
        const kathyUser: User = {
          id: 'kathy_super_admin',
          name: 'Kathy Seba',
          email: 'kathyseba2020@gmail.com',
          role: 'super_admin',
          createdAt: new Date().toISOString(),
          acquisitionSource: 'kase_internal_campaign',
        };
        setCurrentUser(kathyUser);
        setActiveTab('admin_global');
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Fetch campaigns from backend
  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/campaigns');
      const data = await res.json();
      if (data.campaigns && data.campaigns.length > 0) {
        setCampaigns(data.campaigns);
        if (!activeCampaignId || !data.campaigns.some((c: Campaign) => c.id === activeCampaignId)) {
          setActiveCampaignId(data.campaigns[0].id);
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
  }, []);

  // Route Guard: Unauthenticated visitors can ONLY view landing (Hero), guide (¿Cómo funciona?) or reviews (Reseñas)
  useEffect(() => {
    if (!currentUser && activeTab !== 'landing' && activeTab !== 'guide' && activeTab !== 'reviews') {
      setActiveTab('landing');
    }
  }, [currentUser, activeTab]);

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
  const handleUpdatePlan = async (plan: 'starter' | 'growth' | 'enterprise', targetRegistrations: number) => {
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

  // Safe New Campaign Trigger: Requires login first
  const handleOpenNewCampaign = () => {
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
    } catch (e) {
      // ignore
    }
    setCurrentUser(null);
    setActiveTab('landing');
  };

  const isSuperAdmin = (currentUser?.email || '').toLowerCase() === 'kathyseba2020@gmail.com';

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-neutral-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
              if (!currentUser) {
                setIsAuthModalOpen(true);
              } else {
                setActiveTab(tab);
              }
            }}
            onOpenNewCampaign={handleOpenNewCampaign}
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

            {activeTab === 'modules' && (
              <ModulesGrid
                campaign={activeCampaign}
                onSelectModule={(mod) => setSelectedModule(mod)}
              />
            )}

            {activeTab === 'integration' && (
              <IntegrationPanel
                campaign={activeCampaign}
                onRefreshCampaign={fetchCampaigns}
              />
            )}

            {activeTab === 'plans' && (
              <PlansComparison
                campaign={activeCampaign}
                onUpdatePlan={handleUpdatePlan}
                currentUser={currentUser}
                onRequestOneDollarCheckout={handleOpenOneDollarCheckout}
              />
            )}

            {activeTab === 'logs' && (
              <SystemAuditLogs campaign={activeCampaign} />
            )}
          </>
        ) : (
          <div className="py-20 text-center space-y-4">
            <h2 className="text-xl font-bold text-white">No hay campañas registradas</h2>
            <p className="text-xs text-neutral-400">
              Da de alta tu primer producto para iniciar la automatización de captación.
            </p>
            <button
              onClick={handleOpenNewCampaign}
              className="px-4 py-2 bg-emerald-400 text-black font-semibold rounded-lg text-xs cursor-pointer"
            >
              + Crear Primera Campaña
            </button>
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
      {selectedModule && activeCampaign && (
        <ModuleDetailModal
          moduleDef={selectedModule}
          campaign={activeCampaign}
          onClose={() => setSelectedModule(null)}
        />
      )}

      {/* New Campaign Creation Modal (With Conditional Logic & Pixel Verifier) */}
      <NewCampaignModal
        isOpen={isNewCampaignOpen}
        onClose={() => setIsNewCampaignOpen(false)}
        onCreated={handleCreatedCampaign}
        currentUser={currentUser}
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
        onOpenNewCampaign={handleOpenNewCampaign}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenOneDollarCheckout={handleOpenOneDollarCheckout}
        currentUser={currentUser}
        onSelectCampaign={(id) => setActiveCampaignId(id)}
      />
    </div>
  );
}
