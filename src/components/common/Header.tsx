import React, { useState } from 'react';
import { ShieldCheck, TrendingUp, Menu, X, ArrowRight, LayoutDashboard, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  onEnterDashboard: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onEnterDashboard }) => {
  const { isAuthenticated, user, openAuthModal } = useAuth();
  const { currency, setCurrency } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <a href="#home" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading text-2xl font-bold tracking-tight text-slate-900">
                Capital<span className="text-emerald-600">Grow</span>
              </span>
            </a>
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#10B981] border border-[#10B981]/20">
              <ShieldCheck className="w-3 h-3" /> SECP Compliance Ready
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#plans" className="text-sm font-medium text-[#475569] hover:text-[#131926] transition-colors">
              Investment Plans
            </a>
            <a href="#how" className="text-sm font-medium text-[#475569] hover:text-[#131926] transition-colors">
              How It Works
            </a>
            <a href="#analytics" className="text-sm font-medium text-[#475569] hover:text-[#131926] transition-colors">
              Platform Analytics
            </a>
            <a href="#faq" className="text-sm font-medium text-[#475569] hover:text-[#131926] transition-colors">
              FAQ
            </a>
          </nav>

          {/* Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Currency switcher */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="text-xs font-mono font-semibold bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-[#131926] focus:outline-none focus:border-[#10B981]"
              title="Select display currency"
            >
              <option value="Rs.">PKR (Rs.)</option>
              <option value="$">USD ($)</option>
              <option value="€">EUR (€)</option>
              <option value="£">GBP (£)</option>
            </select>

            {isAuthenticated ? (
              <button
                onClick={onEnterDashboard}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] bg-gradient-to-r from-[#131926] to-[#10B981] text-white text-sm font-semibold hover:shadow-lg hover:shadow-[#10B981]/25 hover:-translate-y-0.5 transition-all"
              >
                <LayoutDashboard className="w-4 h-4" />
                Go to Dashboard
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-4 py-2 rounded-[10px] border border-[#E2E8F0] text-[#131926] text-sm font-semibold hover:border-[#131926] transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-gradient-to-r from-[#10B981] to-[#10B981] text-white text-sm font-semibold hover:shadow-lg hover:shadow-[#10B981]/25 hover:-translate-y-0.5 transition-all"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile menu hamburger button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#131926] hover:bg-[#F8FAFC]"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-[#E2E8F0] px-4 pt-3 pb-6 space-y-3">
          <a
            href="#plans"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-[#131926]"
          >
            Investment Plans
          </a>
          <a
            href="#how"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-[#131926]"
          >
            How It Works
          </a>
          <a
            href="#analytics"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-[#131926]"
          >
            Platform Analytics
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-[#131926]"
          >
            FAQ
          </a>
          <div className="pt-3 border-t border-[#E2E8F0] flex flex-col gap-2">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onEnterDashboard();
                }}
                className="w-full py-2.5 rounded-[10px] bg-[#10B981] text-white font-semibold text-sm flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('login');
                  }}
                  className="w-full py-2 rounded-[10px] border border-[#E2E8F0] text-[#131926] font-semibold text-sm"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('register');
                  }}
                  className="w-full py-2.5 rounded-[10px] bg-[#10B981] text-white font-semibold text-sm"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
