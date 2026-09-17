import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Menu,
  X,
  ArrowDownLeft,
  ArrowUpRight,
  Shield,
  User,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { ThemeSelector } from './ThemeSelector';

export const Header: React.FC = () => {
  const { isAuthenticated, user, openAuthModal, logout } = useAuth();
  const { currency, setCurrency, formatCurrency, setCurrentView } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading text-2xl font-bold tracking-tight text-slate-900">
                Capital<span className="text-emerald-600">Grow</span>
              </span>
            </a>
            <span className="hidden lg:inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-500/20">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> SECP Compliance Ready
            </span>
          </div>

          {/* Single-Page In-Page Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-7">
            <button
              onClick={() => scrollToSection('overview')}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Terminal
            </button>
            <button
              onClick={() => scrollToSection('plans')}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Investment Plans
            </button>
            <button
              onClick={() => scrollToSection('deposit')}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Deposit
            </button>
            <button
              onClick={() => scrollToSection('portfolio')}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Holdings
            </button>
            <button
              onClick={() => scrollToSection('activity')}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Ledger
            </button>
            <button
              onClick={() => scrollToSection('how')}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              FAQ
            </button>
          </nav>

          {/* Actions & Balance / Auth */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Theme & Typography Customizer */}
            <ThemeSelector />

            {/* Currency switcher */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="text-xs font-mono font-semibold bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-emerald-500 cursor-pointer"
              title="Select display currency"
            >
              <option value="Rs.">PKR (Rs.)</option>
              <option value="$">USD ($)</option>
              <option value="€">EUR (€)</option>
              <option value="£">GBP (£)</option>
            </select>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {/* Balance chip with instant deposit/withdraw */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs">
                  <span className="text-slate-500 font-medium">Bal:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {formatCurrency(user?.balance || 0)}
                  </span>
                  <div className="flex items-center gap-1 ml-1 pl-1.5 border-l border-slate-300">
                    <button
                      onClick={() => {
                        setCurrentView('deposit');
                        scrollToSection('deposit');
                      }}
                      className="p-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                      title="Deposit Funds"
                    >
                      <ArrowDownLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setCurrentView('withdraw');
                        scrollToSection('deposit');
                      }}
                      className="p-1 rounded-md bg-slate-800 hover:bg-slate-900 text-white transition-colors cursor-pointer"
                      title="Withdraw Funds"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {user?.role === 'admin' && (
                  <button
                    onClick={() => setCurrentView('admin')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    Admin
                  </button>
                )}

                <div className="flex items-center gap-1.5 pl-1">
                  <span className="text-xs font-medium text-slate-700 hidden lg:inline">
                    {user?.fullName?.split(' ')[0]}
                  </span>
                  <button
                    onClick={logout}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-800 text-xs font-semibold hover:border-slate-800 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu hamburger button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-900 hover:bg-slate-100"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2">
          <button
            onClick={() => scrollToSection('overview')}
            className="w-full text-left py-2 text-sm font-medium text-slate-800 hover:text-emerald-600"
          >
            Dashboard Terminal
          </button>
          <button
            onClick={() => scrollToSection('plans')}
            className="w-full text-left py-2 text-sm font-medium text-slate-800 hover:text-emerald-600"
          >
            Investment Plans
          </button>
          <button
            onClick={() => scrollToSection('deposit')}
            className="w-full text-left py-2 text-sm font-medium text-slate-800 hover:text-emerald-600"
          >
            Deposit & Cashier
          </button>
          <button
            onClick={() => scrollToSection('portfolio')}
            className="w-full text-left py-2 text-sm font-medium text-slate-800 hover:text-emerald-600"
          >
            Portfolio Holdings
          </button>
          <button
            onClick={() => scrollToSection('activity')}
            className="w-full text-left py-2 text-sm font-medium text-slate-800 hover:text-emerald-600"
          >
            Audit Ledger
          </button>
          <button
            onClick={() => scrollToSection('how')}
            className="w-full text-left py-2 text-sm font-medium text-slate-800 hover:text-emerald-600"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('faq')}
            className="w-full text-left py-2 text-sm font-medium text-slate-800 hover:text-emerald-600"
          >
            FAQ
          </button>

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            <div className="flex items-center justify-between py-1">
              <span className="text-xs font-semibold text-slate-700">Theme & Style:</span>
              <ThemeSelector />
            </div>
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Balance:</span>
                  <span className="font-mono font-bold text-slate-900">{formatCurrency(user?.balance || 0)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setMobileMenuOpen(false); setCurrentView('deposit'); }}
                    className="py-2 rounded-lg bg-emerald-600 text-white font-semibold text-xs flex items-center justify-center gap-1"
                  >
                    <ArrowDownLeft className="w-3.5 h-3.5" /> Deposit
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); setCurrentView('withdraw'); }}
                    className="py-2 rounded-lg bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-1"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" /> Withdraw
                  </button>
                </div>
                {user?.role === 'admin' && (
                  <button
                    onClick={() => { setMobileMenuOpen(false); setCurrentView('admin'); }}
                    className="w-full py-2 rounded-lg bg-amber-500 text-white font-semibold text-xs flex items-center justify-center gap-1"
                  >
                    <Shield className="w-3.5 h-3.5" /> Admin Console
                  </button>
                )}
                <button
                  onClick={() => { setMobileMenuOpen(false); logout(); }}
                  className="w-full py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setMobileMenuOpen(false); openAuthModal('login'); }}
                  className="py-2 rounded-lg border border-slate-200 text-slate-800 font-semibold text-xs"
                >
                  Log In
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); openAuthModal('register'); }}
                  className="py-2 rounded-lg bg-emerald-600 text-white font-semibold text-xs"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
