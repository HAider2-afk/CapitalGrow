/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Hero } from './components/marketing/Hero';
import { StatsStrip } from './components/marketing/StatsStrip';
import { PlansGrid } from './components/marketing/PlansGrid';
import { HowItWorks } from './components/marketing/HowItWorks';
import { FaqAccordion } from './components/marketing/FaqAccordion';
import { AuthModal } from './components/auth/AuthModal';
import { OverviewView } from './components/dashboard/OverviewView';
import { PortfolioView } from './components/dashboard/PortfolioView';
import { TransactionsView } from './components/dashboard/TransactionsView';
import { CashierSection } from './components/dashboard/CashierSection';
import { AdminView } from './components/dashboard/AdminView';
import { ProfileView } from './components/dashboard/ProfileView';
import { SecurityView } from './components/dashboard/SecurityView';
import { KycView } from './components/dashboard/KycView';
import { SupportView } from './components/dashboard/SupportView';
import { ReferralsView } from './components/dashboard/ReferralsView';
import { NotificationsView } from './components/dashboard/NotificationsView';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { X, Shield } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false
    }
  }
});

const SinglePageApp: React.FC = () => {
  const { currentView, setCurrentView } = useApp();

  // Scroll in-page when specific navigation views are selected
  useEffect(() => {
    if (currentView === 'investments') {
      document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' });
    } else if (currentView === 'deposit' || currentView === 'withdraw') {
      document.getElementById('deposit')?.scrollIntoView({ behavior: 'smooth' });
    } else if (currentView === 'transactions') {
      document.getElementById('activity')?.scrollIntoView({ behavior: 'smooth' });
    } else if (currentView === 'portfolio') {
      document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentView]);

  // Handle escape key to close active modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (
          currentView === 'admin' ||
          currentView === 'profile' ||
          currentView === 'security' ||
          currentView === 'kyc' ||
          currentView === 'support' ||
          currentView === 'referrals' ||
          currentView === 'notifications'
        ) {
          setCurrentView('overview');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView, setCurrentView]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans antialiased selection:bg-[#10B981] selection:text-white">
      {/* Sticky Single-Page Navigation Header */}
      <Header />

      {/* Main Single Page Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <section id="home">
          <Hero />
        </section>

        {/* Audited Trust & Stats Strip */}
        <StatsStrip />

        {/* Section 1: Real-Time Investor Dashboard & 3D Spatial Terminal */}
        <section id="overview" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
          <div className="border-b border-slate-200/80 pb-4">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Investor Dashboard & Spatial Terminal
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Live portfolio telemetry, marked-to-market balances, and interactive 3D WebGL spatial liquidity engine
            </p>
          </div>
          <OverviewView />
        </section>

        {/* Section 2: Investment Plans & Real-Time Compounding Calculator */}
        <section id="plans" className="py-16 bg-white border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="font-heading text-3xl font-bold tracking-tight text-slate-900">
                Institutional-Grade Investment Plans
              </h2>
              <p className="text-sm text-slate-500 mt-1.5">
                Multi-tier capital structures with guaranteed capital return and automated daily compounding
              </p>
            </div>
            <PlansGrid />
          </div>
        </section>

        {/* Section 3: Capital Cashier & Settlements (Deposit & Withdraw Single Screen) */}
        <CashierSection />

        {/* Section 4: Active Holdings & Asset Allocation */}
        <section id="portfolio" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
          <div className="border-b border-slate-200/80 pb-4">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Portfolio Holdings & Capital Allocation
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Real-time audit of allocated capital, active contracts, maturity countdowns, and performance breakdown
            </p>
          </div>
          <PortfolioView />
        </section>

        {/* Section 5: Transaction History & Immutable Audit Ledger */}
        <section id="activity" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
          <TransactionsView />
        </section>

        {/* Section 6: How It Works & Security Assurances */}
        <section id="how" className="py-16 bg-white border-y border-slate-200/80">
          <HowItWorks />
        </section>

        {/* Section 7: Frequently Asked Questions */}
        <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <FaqAccordion />
        </section>
      </main>

      {/* Single-Page Footer */}
      <Footer />

      {/* ================= MODAL DIALOGS (In-Place Overlays for Admin & Settings) ================= */}

      {/* Administrative Operations Modal */}
      {currentView === 'admin' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setCurrentView('overview');
          }}
        >
          <div className="relative w-full max-w-6xl max-h-[92vh] overflow-y-auto bg-[#131926] rounded-2xl border border-white/10 p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10 sticky top-0 bg-[#131926] z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-heading text-xl font-bold text-white">Administrative Console</h2>
                  <p className="text-xs text-slate-400">Audit deposits, verify receipts, and manage accounts</p>
                </div>
              </div>
              <button
                onClick={() => setCurrentView('overview')}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close admin modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <AdminView />
          </div>
        </div>
      )}

      {/* Secondary Account Modals (Profile, Security, KYC, Support, Referrals, Notifications) */}
      {(currentView === 'profile' ||
        currentView === 'security' ||
        currentView === 'kyc' ||
        currentView === 'support' ||
        currentView === 'referrals' ||
        currentView === 'notifications') && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setCurrentView('overview');
          }}
        >
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#131926] rounded-2xl border border-white/10 p-6 shadow-2xl text-white">
            <button
              onClick={() => setCurrentView('overview')}
              className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-20"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
            {currentView === 'profile' && <ProfileView />}
            {currentView === 'security' && <SecurityView />}
            {currentView === 'kyc' && <KycView />}
            {currentView === 'support' && <SupportView />}
            {currentView === 'referrals' && <ReferralsView />}
            {currentView === 'notifications' && <NotificationsView />}
          </div>
        </div>
      )}

      {/* Auth Modal (Login / Register / Demo login) */}
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppProvider>
            <SinglePageApp />
          </AppProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
