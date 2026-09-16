import React, { useState, useEffect } from 'react';
import { ArrowDownToLine, ArrowUpFromLine, ShieldCheck } from 'lucide-react';
import { DepositView } from './DepositView';
import { WithdrawView } from './WithdrawView';
import { useApp } from '../../context/AppContext';

export const CashierSection: React.FC = () => {
  const { currentView, setCurrentView } = useApp();
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');

  // Synchronize with external navigation calls
  useEffect(() => {
    if (currentView === 'deposit') {
      setActiveTab('deposit');
    } else if (currentView === 'withdraw') {
      setActiveTab('withdraw');
    }
  }, [currentView]);

  return (
    <section id="deposit" className="py-16 bg-slate-900 border-y border-slate-800 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-medium border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" /> SECP Regulated Custodial Settlement
          </div>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-white">
            Capital Cashier & Settlements
          </h2>
          <p className="text-sm text-slate-400">
            Direct deposit allocation via domestic banking rails and real-time Raast 1-Link withdrawals
          </p>
        </div>

        {/* Cashier Mode Selector (Deposit vs Withdraw) */}
        <div className="flex justify-center">
          <div className="inline-flex p-1 rounded-xl bg-slate-800/80 border border-white/10">
            <button
              onClick={() => {
                setActiveTab('deposit');
                setCurrentView('deposit');
              }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'deposit'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowDownToLine className="w-4 h-4" /> Deposit Funds
            </button>
            <button
              onClick={() => {
                setActiveTab('withdraw');
                setCurrentView('withdraw');
              }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'withdraw'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowUpFromLine className="w-4 h-4" /> Withdraw Funds
            </button>
          </div>
        </div>

        {/* Single Screen Form Rendered Directly in Page */}
        <div>
          {activeTab === 'deposit' ? <DepositView /> : <WithdrawView />}
        </div>
      </div>
    </section>
  );
};
