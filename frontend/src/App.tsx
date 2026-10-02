import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/sections/HeroSection';
import { QuickVerifySection } from './components/sections/QuickVerifySection';
import { ProblemSection } from './components/sections/ProblemSection';
import { HowItWorksSection } from './components/sections/HowItWorksSection';
import { InfoSection } from './components/sections/InfoSection';
import { RewardsSection } from './components/sections/RewardsSection';
import { PricingSection } from './components/sections/PricingSection';
import { BackedBySection } from './components/sections/BackedBySection';
import { UseCasesSection } from './components/sections/UseCasesSection';
import { FinalCtaSection } from './components/sections/FinalCtaSection';
import { Footer } from './components/layout/Footer';
import { AuthModal, RoleType, AuthMode } from './components/auth/AuthModal';
import { BrandPendingApprovalScreen } from './components/auth/BrandPendingApprovalScreen';
import { ProductVerifyPage } from './components/verify/ProductVerifyPage';
import { ToastContainer } from './components/common/ToastContainer';
import { ManufacturerDashboard } from './features/manufacturer/ManufacturerDashboard';
import { PartnerDashboard } from './features/partner/PartnerDashboard';
import { PartnerRole } from './features/partner/types';
import { ConsumerApp } from './features/consumer/ConsumerApp';
import { AdminDashboard } from './features/admin/AdminDashboard';
import { api, UserSession } from './services/api';
import { toast } from './services/toast';

export const App: React.FC = () => {
  // Navigation / Routing State: 'landing' | 'verify' | 'dashboard' | 'partner' | 'consumer' | 'admin'
  const [currentView, setCurrentView] = useState<'landing' | 'verify' | 'dashboard' | 'partner' | 'consumer' | 'admin'>('landing');
  const [activeVerifyCode, setActiveVerifyCode] = useState<string>('TC-8924-GENUINE');
  const [activePartnerRole, setActivePartnerRole] = useState<PartnerRole>('distributor');

  // Authenticated Session State
  const [session, setSession] = useState<UserSession | null>(() => api.auth.getSession());

  // Auth modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [initialRole, setInitialRole] = useState<RoleType | undefined>(undefined);
  const [initialMode, setInitialMode] = useState<AuthMode>('signup');

  // Refresh user profile from backend on app mount
  useEffect(() => {
    let isMounted = true;
    async function restoreSession() {
      const existingToken = api.getToken();
      if (existingToken) {
        try {
          const res = await api.auth.getMe();
          if (isMounted && res.success && res.data?.user) {
            setSession(res.data.user);
          }
        } catch {
          // Token expired or server unreachable, clear smoothly
        }
      }
    }
    restoreSession();

    // Listen for global 401 unauthorized / auth-expired events
    const handleAuthExpired = () => {
      setSession(null);
      setAuthModalOpen(true);
    };
    window.addEventListener('trustchain:auth-expired', handleAuthExpired);

    return () => {
      isMounted = false;
      window.removeEventListener('trustchain:auth-expired', handleAuthExpired);
    };
  }, []);

  // Check URL path on mount and on popstate
  useEffect(() => {
    const handleUrlRouting = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;

      if (path.startsWith('/verify')) {
        const parts = path.split('/').filter(Boolean);
        const code = parts[1] || 'TC-8924-GENUINE';
        setActiveVerifyCode(code);
        setCurrentView('verify');
      } else if (hash.startsWith('#verify')) {
        const parts = hash.split('/');
        const code = parts[1] || 'TC-8924-GENUINE';
        setActiveVerifyCode(code);
        setCurrentView('verify');
      } else if (path.startsWith('/admin') || hash === '#admin') {
        setCurrentView('admin');
      } else if (path.startsWith('/dashboard') || path.startsWith('/manufacturer') || hash === '#dashboard') {
        setCurrentView('dashboard');
      } else if (path.startsWith('/partner') || hash === '#partner') {
        setCurrentView('partner');
      } else if (path.startsWith('/app') || path.startsWith('/consumer') || hash === '#app' || hash === '#consumer') {
        setCurrentView('consumer');
      } else {
        setCurrentView('landing');
      }
    };

    handleUrlRouting();
    window.addEventListener('popstate', handleUrlRouting);
    window.addEventListener('hashchange', handleUrlRouting);

    return () => {
      window.removeEventListener('popstate', handleUrlRouting);
      window.removeEventListener('hashchange', handleUrlRouting);
    };
  }, []);

  const navigateToVerifyPage = (code: string = 'TC-8924-GENUINE') => {
    setActiveVerifyCode(code);
    setCurrentView('verify');
    window.history.pushState({}, '', `/verify/${code}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToDashboard = () => {
    setCurrentView('dashboard');
    window.history.pushState({}, '', '/dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPartner = (role: PartnerRole = 'distributor') => {
    setActivePartnerRole(role);
    setCurrentView('partner');
    window.history.pushState({}, '', '/partner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToConsumer = () => {
    setCurrentView('consumer');
    window.history.pushState({}, '', '/app');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAdmin = () => {
    setCurrentView('admin');
    window.history.pushState({}, '', '/admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    setCurrentView('landing');
    window.history.pushState({}, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (role?: RoleType, mode: AuthMode = 'signup') => {
    setInitialRole(role);
    setInitialMode(mode);
    setAuthModalOpen(true);
  };

  // Called when login or signup succeeds in AuthModal
  const handleLoginSuccess = (newSession: UserSession) => {
    setSession(newSession);
    setAuthModalOpen(false);

    // Dynamic Role-Based Redirects
    if (newSession.role === 'admin') {
      navigateToAdmin();
    } else if (newSession.role === 'manufacturer') {
      navigateToDashboard();
    } else if (newSession.role === 'distributor' || newSession.role === 'retailer') {
      navigateToPartner(newSession.role as PartnerRole);
    } else if (newSession.role === 'consumer') {
      navigateToConsumer();
    } else {
      navigateToHome();
    }
  };

  const handleLogout = () => {
    api.auth.logout();
    setSession(null);
    navigateToHome();
  };

  // ------------------------------------------------------------
  // PROTECTED ROUTE GUARDS & CONTENT RENDERER
  // ------------------------------------------------------------
  const renderCurrentView = () => {
    // 1. ADMIN ROUTE (/admin) - Protected
    if (currentView === 'admin') {
      if (!session || session.role !== 'admin') {
        return (
          <div className="min-h-screen flex items-center justify-center p-6 text-center">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-black/10 shadow-xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
                <span className="text-xl font-bold">HQ</span>
              </div>
              <h3 className="text-xl font-medium text-black">Admin Access Required</h3>
              <p className="text-xs text-black/60 leading-relaxed">
                Platform administration features and system health telemetry are restricted to authorized administrators.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenAuth('admin', 'login')}
                  className="w-full py-3 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
                >
                  Admin Sign In
                </button>
                <button
                  type="button"
                  onClick={navigateToHome}
                  className="w-full py-2.5 bg-white text-black/70 hover:text-black text-xs font-medium rounded-full hover:bg-black/5 transition-colors cursor-pointer"
                >
                  Return to Home
                </button>
              </div>
            </div>
          </div>
        );
      }

      return (
        <AdminDashboard
          onExitDashboard={navigateToHome}
          onNavigateToVerify={() => navigateToVerifyPage('TC-8924-GENUINE')}
        />
      );
    }

    // 2. CONSUMER ROUTE (/app) - Allows public browsing / guest scanner
    if (currentView === 'consumer') {
      return (
        <ConsumerApp
          onNavigateHome={navigateToHome}
          onNavigateToVerify={(code) => navigateToVerifyPage(code)}
        />
      );
    }

    // 3. PARTNER ROUTE (/partner) - Protected
    if (currentView === 'partner') {
      if (!session || (session.role !== 'distributor' && session.role !== 'retailer' && session.role !== 'admin')) {
        return (
          <div className="min-h-screen flex items-center justify-center p-6 text-center">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-black/10 shadow-xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto">
                <span className="text-xl font-bold">📦</span>
              </div>
              <h3 className="text-xl font-medium text-black">Supply Partner Login Required</h3>
              <p className="text-xs text-black/60 leading-relaxed">
                Log in to access your warehouse inventory, custody handoffs, and retail point-of-sale terminal.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenAuth('partner', 'login')}
                  className="w-full py-3 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
                >
                  Sign In as Partner
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenAuth('partner', 'signup')}
                  className="w-full py-2.5 bg-white text-black/70 hover:text-black text-xs font-medium rounded-full border border-black/10 hover:bg-black/5 transition-colors cursor-pointer"
                >
                  Join via Brand Invite Token
                </button>
              </div>
            </div>
          </div>
        );
      }

      return (
        <PartnerDashboard
          initialRole={activePartnerRole}
          onExitDashboard={navigateToHome}
          onNavigateToVerify={() => navigateToVerifyPage('TC-8924-GENUINE')}
        />
      );
    }

    // 4. MANUFACTURER DASHBOARD ROUTE (/dashboard) - Protected & Pending Check
    if (currentView === 'dashboard') {
      if (!session || (session.role !== 'manufacturer' && session.role !== 'admin')) {
        return (
          <div className="min-h-screen flex items-center justify-center p-6 text-center">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-black/10 shadow-xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#2B2644]/10 text-[#2B2644] flex items-center justify-center mx-auto">
                <span className="text-xl font-bold">🏭</span>
              </div>
              <h3 className="text-xl font-medium text-black">Brand Portal Access</h3>
              <p className="text-xs text-black/60 leading-relaxed">
                Please log in with your registered corporate manufacturer credentials to manage batches and anti-counterfeit analytics.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenAuth('manufacturer', 'login')}
                  className="w-full py-3 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
                >
                  Manufacturer Sign In
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenAuth('manufacturer', 'signup')}
                  className="w-full py-2.5 bg-white text-black/70 hover:text-black text-xs font-medium rounded-full border border-black/10 hover:bg-black/5 transition-colors cursor-pointer"
                >
                  Register New Brand (KYB)
                </button>
              </div>
            </div>
          </div>
        );
      }

      // Check if Brand KYB is Still Pending
      if (session.brandStatus !== 'approved' && session.role !== 'admin') {
        return (
          <BrandPendingApprovalScreen
            session={session}
            onStatusApproved={(updatedSession) => {
              setSession(updatedSession);
            }}
            onLogout={handleLogout}
          />
        );
      }

      return (
        <ManufacturerDashboard
          onExitDashboard={navigateToHome}
          onNavigateToVerify={() => navigateToVerifyPage('TC-8924-GENUINE')}
        />
      );
    }

    // 5. PUBLIC QR VERIFY ROUTE (/verify/:code)
    if (currentView === 'verify') {
      return (
        <ProductVerifyPage
          code={activeVerifyCode}
          onBackToHome={navigateToHome}
          onPromptLogin={() => handleOpenAuth('consumer', 'signup')}
        />
      );
    }

    // 6. DEFAULT: FULL LANDING PAGE
    return (
      <>
        {/* Navbar + HeroSection container */}
        <div className="relative min-h-screen lg:h-screen flex flex-col overflow-hidden">
          <Navbar onOpenAuth={handleOpenAuth} />
          <HeroSection onOpenAuth={handleOpenAuth} />
        </div>

        {/* Quick Verify: QR Scan & Manual Code input without login */}
        <QuickVerifySection onNavigateToVerifyPage={navigateToVerifyPage} />

        {/* The Counterfeit Problem */}
        <ProblemSection />

        {/* How It Works */}
        <HowItWorksSection />

        {/* Deep-Dive Info: Provenance, Clone-Proofing, Zero Crypto Friction */}
        <InfoSection />

        {/* Rewards: Scan Points, Streak Multipliers, Fake Report Bounties, Redemptions */}
        <RewardsSection />

        {/* Pricing: 3 INR Plans (Starter, Growth, Enterprise) */}
        <PricingSection onOpenAuth={handleOpenAuth} />

        {/* Backed By & Standards Infinite Marquee */}
        <BackedBySection />

        {/* Use Modes & Brand Protection */}
        <UseCasesSection />

        {/* Final CTA: "Fight counterfeits, one scan at a time" */}
        <FinalCtaSection onOpenAuth={handleOpenAuth} />

        {/* Footer: Contact, Privacy, Terms, Team */}
        <Footer />
      </>
    );
  };

  return (
    <div className="flex flex-col bg-[#F5F5F5] min-h-screen selection:bg-black selection:text-white">
      {/* Toast Notifications System */}
      <ToastContainer />

      {/* Global Quick Navigation Bar for Evaluators */}
      <div className="bg-black text-white px-4 py-2 text-xs border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-[88rem] mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <button
              type="button"
              onClick={navigateToHome}
              className="text-white/80 hover:text-white font-medium cursor-pointer"
            >
              TrustChain Platform:
            </button>
            {session && (
              <span className="bg-white/15 px-2 py-0.5 rounded text-[11px] font-medium text-white/90">
                {session.role.toUpperCase()} • {session.name}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={navigateToHome}
              className={`font-medium underline underline-offset-4 cursor-pointer ${
                currentView === 'landing' ? 'text-white font-bold' : 'text-white/70 hover:text-white'
              }`}
            >
              Landing
            </button>
            <span className="text-white/40">|</span>
            <button
              type="button"
              onClick={navigateToConsumer}
              className={`font-medium underline underline-offset-4 cursor-pointer flex items-center gap-1 ${
                currentView === 'consumer' ? 'text-amber-300 font-bold' : 'text-amber-300 hover:text-amber-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Consumer App
            </button>
            <span className="text-white/40">|</span>
            <button
              type="button"
              onClick={navigateToDashboard}
              className={`font-medium underline underline-offset-4 cursor-pointer ${
                currentView === 'dashboard' ? 'text-emerald-400 font-bold' : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              Manufacturer
            </button>
            <span className="text-white/40">|</span>
            <button
              type="button"
              onClick={() => navigateToPartner('distributor')}
              className={`font-medium underline underline-offset-4 cursor-pointer ${
                currentView === 'partner' ? 'text-blue-400 font-bold' : 'text-blue-400 hover:text-blue-300'
              }`}
            >
              Partner
            </button>
            <span className="text-white/40">|</span>
            <button
              type="button"
              onClick={navigateToAdmin}
              className={`font-medium underline underline-offset-4 cursor-pointer flex items-center gap-1 ${
                currentView === 'admin' ? 'text-rose-300 font-bold' : 'text-rose-300 hover:text-rose-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              Admin (HQ)
            </button>
            <span className="text-white/40">|</span>
            <button
              type="button"
              onClick={() => navigateToVerifyPage('TC-8924-GENUINE')}
              className={`font-medium underline underline-offset-4 cursor-pointer ${
                currentView === 'verify' ? 'text-white font-bold' : 'text-white/70 hover:text-white'
              }`}
            >
              Verify
            </button>
            {session && (
              <>
                <span className="text-white/40">|</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-rose-300 hover:text-rose-200 font-medium underline underline-offset-4 cursor-pointer"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main View Router */}
      {renderCurrentView()}

      {/* Interactive Auth Modal (Consumer / Brand / Supply Partner / Admin) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialRole={initialRole}
        initialMode={initialMode}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default App;
