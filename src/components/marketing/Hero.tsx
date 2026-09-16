import React from 'react';
import { ArrowRight, ShieldAlert, Sparkles, TrendingUp, Lock, CheckCircle2 } from 'lucide-react';
import { MiniChart } from '../charts/MiniChart';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

interface HeroProps {
  onEnterDashboard: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onEnterDashboard }) => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { formatCurrency } = useApp();

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-[#F6F7FC] via-white to-[#F6F7FC]">
      {/* Decorative subtle ambient depth */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/8 blur-3xl pointer-events-none -z-10 rounded-full" />
      <div className="absolute -top-10 right-0 w-[300px] h-[300px] bg-emerald-500/5 blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-500/25 shadow-sm">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700 tracking-wide uppercase">
                Next-Gen Multi-Asset Wealth Protocol
              </span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.12]">
              Build your financial future with <span className="text-emerald-600">smarter investing.</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl font-normal">
              Explore transparent investment opportunities, track your portfolio in real time, and execute audited cashflows from one secure, institutional-grade platform.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href="#plans"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30 hover:-translate-y-0.5 transition-all"
              >
                Explore Investment Plans
                <ArrowRight className="w-4 h-4" />
              </a>

              {isAuthenticated ? (
                <button
                  onClick={onEnterDashboard}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[10px] bg-slate-900 text-white font-semibold text-base hover:bg-slate-800 shadow-md transition-all"
                >
                  Launch Dashboard
                </button>
              ) : (
                <button
                  onClick={() => openAuthModal('register')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[10px] bg-white border border-slate-200 text-slate-900 font-semibold text-base hover:border-emerald-500 hover:bg-slate-50 transition-all shadow-sm"
                >
                  Create Free Account
                </button>
              )}
            </div>

            {/* Micro badges & Risk disclaimer */}
            <div className="pt-4 space-y-3">
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#667085]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#18C8B5]" />
                  <span>Instant Verification</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#18C8B5]" />
                  <span>Transparent Fee Model</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-[#635BFF]" />
                  <span>256-Bit Bank Encryption</span>
                </div>
              </div>

              <p className="text-xs text-[#667085] leading-normal pt-1">
                <span className="font-semibold text-[#20204A]">Important Notice:</span> No guaranteed returns. All investing carries capital risk — please review our{' '}
                <a href="#faq" className="underline hover:text-[#635BFF]">
                  Statutory Risk Disclosure
                </a>.
              </p>
            </div>
          </div>

          {/* Right Column: 3D Portfolio Value Live Card */}
          <div className="lg:col-span-5 relative">
            {/* Background glow accent */}
            <div className="absolute -inset-1 rounded-[22px] bg-gradient-to-r from-[#635BFF] via-[#8B5CF6] to-[#18C8B5] opacity-35 blur-xl group-hover:opacity-60 transition duration-1000 -z-10" />

            <div className="relative bg-[#20204A] rounded-[18px] p-6 sm:p-7 text-white shadow-2xl shadow-[#0B1026]/40 border border-white/10 backdrop-blur-xl">
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-mono tracking-wider text-[#89A0AF] uppercase">
                    <span className="w-2 h-2 rounded-full bg-[#18C8B5] animate-ping" />
                    <span>Live Portfolio (Platform Tier)</span>
                  </div>
                  <div className="font-heading text-3xl sm:text-4xl font-bold mt-1 tracking-tight text-white">
                    {formatCurrency(184320)}
                  </div>
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#18C8B5]/20 text-[#8FE3B0] border border-[#18C8B5]/30 text-xs font-mono font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +6.2% this cycle
                </div>
              </div>

              {/* Chart canvas */}
              <div className="my-2 bg-[#0B1026]/50 rounded-xl p-3 border border-white/5">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#89A0AF] mb-1">
                  <span>6-Month Trajectory</span>
                  <span className="text-[#8FE3B0] font-semibold">+Rs. 34,320 gain</span>
                </div>
                <MiniChart height={95} />
              </div>

              {/* Card Meta breakdown strip */}
              <div className="grid grid-cols-3 gap-3 pt-4 mt-2 border-t border-white/10 text-left">
                <div>
                  <div className="text-[11px] font-mono text-[#89A0AF]">Invested</div>
                  <div className="text-sm sm:text-base font-bold text-white font-mono-num mt-0.5">
                    {formatCurrency(150000)}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-mono text-[#89A0AF]">Available</div>
                  <div className="text-sm sm:text-base font-bold text-[#8FE3B0] font-mono-num mt-0.5">
                    {formatCurrency(12400)}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-mono text-[#89A0AF]">Active Plans</div>
                  <div className="text-sm sm:text-base font-bold text-white font-mono-num mt-0.5">
                    3 Active
                  </div>
                </div>
              </div>

              {/* Live Status indicator */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-[#89A0AF] font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#18C8B5]" />
                  Ledger Sync: Real-Time
                </span>
                <span className="text-white/80">Asset Rebalance: Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
