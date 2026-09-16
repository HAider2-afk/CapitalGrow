/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Hero } from './components/marketing/Hero';
import { StatsStrip } from './components/marketing/StatsStrip';
import { PlansGrid } from './components/marketing/PlansGrid';
import { HowItWorks } from './components/marketing/HowItWorks';
import { FaqAccordion } from './components/marketing/FaqAccordion';
import { AuthModal } from './components/auth/AuthModal';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LayoutDashboard, Globe, Sparkles } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false
    }
  }
});

const MainContainer: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [viewMode, setViewMode] = useState<'marketing' | 'dashboard'>('dashboard');

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans antialiased selection:bg-[#10B981] selection:text-white">
      {/* Floating Demo Mode Switcher Bar */}
      <aside aria-label="Demo switcher" className="bg-[#131926] text-white px-4 py-2 border-b border-white/10 text-xs flex flex-wrap items-center justify-between gap-2 z-40 sticky top-0 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-semibold text-[#34D399]">
            <Sparkles className="w-3.5 h-3.5 text-[#10B981]" /> CapitalGrow Platform Preview
          </span>
          <span className="hidden sm:inline text-white/50">|</span>
          <span className="hidden sm:inline text-[#94A3B8]">
            {isAuthenticated ? (
              <>Logged in as: <strong className="text-white">{user?.fullName}</strong> ({user?.role})</>
            ) : (
              'Guest mode'
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('marketing')}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 font-medium ${
              viewMode === 'marketing'
                ? 'bg-[#10B981] text-white shadow'
                : 'text-[#94A3B8] hover:text-white hover:bg-white/10'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Public Marketing Site</span>
          </button>
          <button
            onClick={() => setViewMode('dashboard')}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 font-medium ${
              viewMode === 'dashboard'
                ? 'bg-[#10B981] text-white shadow'
                : 'text-[#94A3B8] hover:text-white hover:bg-white/10'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Investor Dashboard</span>
          </button>
        </div>
      </aside>

      {/* Main View Router */}
      {viewMode === 'marketing' ? (
        <>
          <Header onEnterDashboard={() => setViewMode('dashboard')} />
          <main className="flex-1">
            <Hero onEnterDashboard={() => setViewMode('dashboard')} />
            <StatsStrip />
            <PlansGrid />
            <HowItWorks />
            <FaqAccordion />
          </main>
          <Footer />
        </>
      ) : (
        <DashboardLayout onExitToSite={() => setViewMode('marketing')} />
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
            <MainContainer />
          </AppProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
