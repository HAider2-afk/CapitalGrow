import React, { useState } from 'react';
import {
  TrendingUp,
  Wallet,
  PieChart,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  Layers,
  Clock,
  CheckCircle2,
  AlertCircle,
  Box,
  Globe
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { PerformanceChart } from '../charts/PerformanceChart';
import { Card3DTilt } from '../three3d/Card3DTilt';
import { ThreeVaultVisualizer } from '../three3d/ThreeVaultVisualizer';
import { ThreeGlobalGlobe } from '../three3d/ThreeGlobalGlobe';
import { ErrorBoundary } from '../common/ErrorBoundary';

export const OverviewView: React.FC = () => {
  const {
    totalPortfolioValue,
    totalInvested,
    totalProfit,
    portfolioGrowthPercentage,
    formatCurrency,
    holdings,
    transactions,
    setCurrentView,
    isDarkMode
  } = useApp();
  const { user } = useAuth();
  const [active3DTab, setActive3DTab] = useState<'vault' | 'globe'>('vault');

  const kpis = [
    {
      label: 'Portfolio Value',
      value: formatCurrency(totalPortfolioValue),
      delta: `▲ +${portfolioGrowthPercentage}% this month`,
      deltaType: 'up',
      gradient: 'from-[#10B981] to-[#047857]',
      subtext: 'Across all active portfolios'
    },
    {
      label: 'Invested Capital',
      value: formatCurrency(totalInvested),
      delta: `${holdings.length} Active Plans`,
      deltaType: 'neutral',
      gradient: 'from-[#F59E0B] to-[#D97706]',
      subtext: 'Principal committed'
    },
    {
      label: 'Available Balance',
      value: formatCurrency(user?.balance || 0),
      delta: 'Ready for allocation',
      deltaType: 'neutral',
      gradient: 'from-[#2563EB] to-[#1D4ED8]',
      subtext: 'Liquid cash reserves'
    },
    {
      label: 'Total Net Returns',
      value: `+${formatCurrency(totalProfit)}`,
      delta: '▲ Since account inception',
      deltaType: 'up',
      gradient: 'from-[#059669] to-[#047857]',
      subtext: 'Audited capital gains'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Quick Action Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-[18px] bg-gradient-to-r from-[#131926] via-[#0B0F17] to-[#0B0F17] text-white border border-white/10 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-[#10B981]/20 to-transparent pointer-events-none" />
        <div className="space-y-1 relative z-10 text-left">
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-xl sm:text-2xl font-bold">
              Welcome back, {user?.fullName || 'Investor'}
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30">
              KYC Level 2 Verified
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Your aggregate holdings are compounding at a projected 12.8% annualized rate.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 relative z-10 w-full sm:w-auto">
          <button
            onClick={() => {
              setCurrentView('deposit');
              document.getElementById('deposit')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-[10px] bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-semibold text-xs sm:text-sm transition-all shadow-md whitespace-nowrap cursor-pointer"
          >
            <ArrowDownLeft className="w-4 h-4" /> Deposit Funds
          </button>
          <button
            onClick={() => {
              setCurrentView('withdraw');
              document.getElementById('deposit')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-[10px] bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm border border-white/10 transition-all whitespace-nowrap cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4" /> Withdraw
          </button>
          <button
            onClick={() => {
              setCurrentView('investments');
              document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-md whitespace-nowrap cursor-pointer"
          >
            <Layers className="w-4 h-4" /> New Plan
          </button>
        </div>
      </div>

      {/* 4 Colored KPI Cards with 3D Tilt */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <Card3DTilt key={idx} maxTilt={8} glare={true} className="rounded-[18px]">
            <div
              className={`p-5 rounded-[18px] bg-gradient-to-br ${kpi.gradient} text-white shadow-lg relative overflow-hidden h-full`}
            >
              <div className="text-xs font-medium text-white/80">{kpi.label}</div>
              <div className="font-heading text-2xl sm:text-3xl font-bold my-1.5 tracking-tight font-mono-num">
                {kpi.value}
              </div>
              <div className="flex items-center justify-between text-xs text-white/90 pt-1 border-t border-white/15">
                <span className="font-mono font-medium">{kpi.delta}</span>
                <span className="text-[10px] text-white/60">{kpi.subtext}</span>
              </div>
            </div>
          </Card3DTilt>
        ))}
      </div>

      {/* 3D Real-Time Spatial Engine */}
      <div className="rounded-[22px] bg-[#131926] border border-white/10 p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Box className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading text-base sm:text-lg font-bold text-white flex items-center gap-2">
                3D Real-Time Spatial Engine
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  WebGL 3D
                </span>
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Interactive 3D geometry, portfolio crystals, and multi-hub liquidity routing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/30 border border-white/10 self-stretch sm:self-auto">
            <button
              onClick={() => setActive3DTab('vault')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                active3DTab === 'vault'
                  ? 'bg-emerald-500 text-white shadow'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D Asset Vault</span>
            </button>
            <button
              onClick={() => setActive3DTab('globe')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                active3DTab === 'globe'
                  ? 'bg-gradient-to-r from-[#10B981] to-[#059669] text-[#0B0F17] shadow font-bold'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>3D Liquidity Mesh</span>
            </button>
          </div>
        </div>

        {/* Dynamic 3D Canvas Switcher */}
        <ErrorBoundary title="3D Spatial Engine Recovery Mode">
          {active3DTab === 'vault' ? (
            <ThreeVaultVisualizer
              portfolioValue={formatCurrency(totalPortfolioValue)}
              profitRate={`+${portfolioGrowthPercentage}%`}
            />
          ) : (
            <ThreeGlobalGlobe />
          )}
        </ErrorBoundary>
      </div>

      {/* Main 2-Column: Portfolio Performance Graph + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Chart.js Line Chart with Timeframes */}
        <div className="lg:col-span-8 p-6 rounded-[18px] bg-[#131926] border border-white/10 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading text-lg font-bold">Portfolio Valuation Trajectory</h3>
              <p className="text-xs text-[#94A3B8]">
                Composite performance over selected accounting period
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono text-[#94A3B8]">Current Benchmark</div>
              <div className="text-base font-bold text-[#34D399] font-mono-num">
                {formatCurrency(totalPortfolioValue)}
              </div>
            </div>
          </div>

          <PerformanceChart isDark={true} />
        </div>

        {/* Right: Recent Activity Log */}
        <div className="lg:col-span-4 p-6 rounded-[18px] bg-[#131926] border border-white/10 text-white shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-bold">Recent Activity</h3>
              <button
                onClick={() => setCurrentView('transactions')}
                className="text-xs font-semibold text-[#10B981] hover:underline"
              >
                View all
              </button>
            </div>

            <div className="space-y-3.5">
              {transactions.slice(0, 5).map((txn) => {
                const isDeposit = txn.type === 'Deposit';
                const isWithdrawal = txn.type === 'Withdrawal';
                const isApproved = txn.status === 'Approved';
                const isPending = txn.status === 'Pending';

                return (
                  <div
                    key={txn.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                          isDeposit
                            ? 'bg-[#10B981]/20 text-[#34D399]'
                            : isWithdrawal
                            ? 'bg-[#F59E0B]/20 text-[#F59E0B]'
                            : 'bg-[#10B981]/20 text-[#A78BFA]'
                        }`}
                      >
                        {isDeposit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">
                          {txn.type} ({txn.method.split(' ')[0]})
                        </div>
                        <div className="text-[10px] text-[#94A3B8] font-mono">{txn.date}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold font-mono-num text-white">
                        {formatCurrency(txn.amount)}
                      </div>
                      <span
                        className={`inline-block text-[10px] font-mono px-1.5 py-0.2 rounded-full font-medium ${
                          isApproved
                            ? 'text-[#34D399] bg-[#10B981]/15'
                            : isPending
                            ? 'text-[#F59E0B] bg-[#F59E0B]/15'
                            : 'text-[#E5484D] bg-[#E5484D]/15'
                        }`}
                      >
                        {txn.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 text-center">
            <span className="text-[11px] text-[#94A3B8] flex items-center justify-center gap-1 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
              Automated reconciliation: OK
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
