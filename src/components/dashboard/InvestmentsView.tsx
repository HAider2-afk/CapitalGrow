import React, { useState } from 'react';
import { Layers, PlusCircle, CheckCircle2, ShieldCheck, ArrowRight, AlertCircle, Sparkles, Box } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Plan } from '../../types';
import { ThreePlanBadge } from '../three3d/ThreePlanBadge';
import { Card3DTilt } from '../three3d/Card3DTilt';
import { ThreeCoinCelebration } from '../three3d/ThreeCoinCelebration';

export const InvestmentsView: React.FC = () => {
  const { plans, holdings, formatCurrency, investInPlan, setCurrentView } = useApp();
  const { user } = useAuth();

  const [selectedPlan, setSelectedPlan] = useState<Plan>(plans[1] || plans[0]);
  const [allocationAmount, setAllocationAmount] = useState<number>(10000);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  const handleAllocate = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMsg(null);

    if (!user) return;
    if (user.balance < allocationAmount) {
      setFeedbackMsg({
        type: 'error',
        text: `Insufficient cash balance. You have ${formatCurrency(
          user.balance
        )} available. Please deposit funds first.`
      });
      return;
    }

    if (allocationAmount < selectedPlan.minInvestment) {
      setFeedbackMsg({
        type: 'error',
        text: `Minimum allocation for ${selectedPlan.name} is ${formatCurrency(selectedPlan.minInvestment)}.`
      });
      return;
    }

    const success = investInPlan(selectedPlan.id, allocationAmount);
    if (success) {
      setFeedbackMsg({
        type: 'success',
        text: `Successfully allocated ${formatCurrency(allocationAmount)} into ${selectedPlan.name} strategy!`
      });
      setShowCelebration(true);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-[18px] bg-[#131926] border border-white/10 text-white shadow-xl">
        <div>
          <h2 className="font-heading text-2xl font-bold">Investment Management</h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
            Deploy capital across risk-hedged strategies with transparent terms
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs font-mono text-[#94A3B8]">Liquid Balance</div>
          <div className="text-xl font-bold font-mono-num text-[#34D399]">
            {formatCurrency(user?.balance || 0)}
          </div>
        </div>
      </div>

      {/* 2-Column: Allocate Capital Form + Active Strategy Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Plan Selector & Allocation input */}
        <div className="lg:col-span-6 p-6 rounded-[18px] bg-[#131926] border border-white/10 text-white shadow-xl">
          <h3 className="font-heading text-lg font-bold mb-1">Allocate Capital</h3>
          <p className="text-xs text-[#94A3B8] mb-5">
            Select an investment tier and enter commitment amount
          </p>

          {feedbackMsg && (
            <div
              className={`p-3.5 rounded-xl text-xs font-medium mb-4 flex items-center gap-2 ${
                feedbackMsg.type === 'success'
                  ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30'
                  : 'bg-[#E5484D]/20 text-[#E5484D] border border-[#E5484D]/30'
              }`}
            >
              {feedbackMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{feedbackMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleAllocate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white mb-2">
                1. Select Strategy Tier
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {plans.map((p) => {
                  const isSelected = selectedPlan.id === p.id;
                  return (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setSelectedPlan(p)}
                      className={`p-3 rounded-xl text-left border transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'bg-[#10B981]/20 border-[#10B981] text-white shadow-md'
                          : 'bg-white/5 border-white/10 text-[#94A3B8] hover:bg-white/10'
                      }`}
                    >
                      <ThreePlanBadge
                        planType={p.name}
                        color={isSelected ? '#10B981' : '#10B981'}
                        size={42}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs text-white truncate">{p.name}</div>
                        <div className="text-[11px] font-mono text-[#34D399] font-semibold">
                          {p.projectedReturn}
                        </div>
                        <div className="text-[10px] text-[#94A3B8] mt-0.5 truncate">
                          Min {formatCurrency(p.minInvestment)}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-white">
                  2. Allocation Amount
                </label>
                <span className="text-[11px] font-mono text-[#94A3B8]">
                  Max: {formatCurrency(user?.balance || 0)}
                </span>
              </div>
              <input
                type="number"
                min={selectedPlan.minInvestment}
                max={user?.balance || 500000}
                step={500}
                value={allocationAmount}
                onChange={(e) => setAllocationAmount(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-[10px] bg-[#0B0F17] border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-[#10B981]"
                required
              />

              {/* Quick Amount Chips */}
              <div className="flex gap-2 mt-2">
                {[5000, 10000, 25000, 50000].map((amt) => (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => setAllocationAmount(amt)}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-white/5 hover:bg-white/10 text-[#94A3B8] border border-white/10 transition-colors"
                  >
                    +{formatCurrency(amt)}
                  </button>
                ))}
              </div>
            </div>

            {/* Plan Info preview box */}
            <div className="p-3.5 rounded-xl bg-[#0B0F17] border border-white/5 space-y-1.5 text-xs text-[#94A3B8]">
              <div className="flex justify-between">
                <span>Selected Risk Class:</span>
                <span className="font-semibold text-white capitalize">{selectedPlan.riskLabel}</span>
              </div>
              <div className="flex justify-between">
                <span>Target Annual Yield:</span>
                <span className="font-bold text-[#34D399] font-mono">{selectedPlan.projectedReturn}</span>
              </div>
              <div className="flex justify-between">
                <span>Est. Net Monthly Yield:</span>
                <span className="font-mono text-white">
                  ~{formatCurrency((allocationAmount * 0.12) / 12)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-[10px] bg-gradient-to-r from-[#10B981] to-[#10B981] text-white font-semibold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Confirm & Deploy {formatCurrency(allocationAmount)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right: Active Investment Positions */}
        <div className="lg:col-span-6 p-6 rounded-[18px] bg-[#131926] border border-white/10 text-white shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-heading text-lg font-bold mb-1">Your Active Investments</h3>
            <p className="text-xs text-[#94A3B8] mb-4">
              Real-time snapshot of your allocated investment strategies
            </p>

            <div className="space-y-3">
              {holdings.map((h) => (
                <div
                  key={h.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 transition-all text-left"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-base text-white font-heading">{h.planName}</div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#34D399]">
                      {h.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs font-mono mt-3">
                    <div>
                      <div className="text-[10px] text-[#94A3B8]">Invested</div>
                      <div className="font-bold text-white mt-0.5">{formatCurrency(h.investedAmount)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#94A3B8]">Valuation</div>
                      <div className="font-bold text-[#34D399] mt-0.5">{formatCurrency(h.currentValue)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#94A3B8]">Gain</div>
                      <div className="font-bold text-[#10B981] mt-0.5">+{h.returnPercentage}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#94A3B8]">
            <span>Need liquid capital?</span>
            <button
              onClick={() => setCurrentView('withdraw')}
              className="text-[#10B981] font-semibold hover:underline"
            >
              Request Withdrawal →
            </button>
          </div>
        </div>
      </div>

      {/* 3D Strategy Showcase Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4 text-[#10B981]" />
            <h3 className="font-heading text-lg font-bold text-white">
              3D Interactive Strategy Gems
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/10 text-[#34D399]">
              Hover & Tilt
            </span>
          </div>
          <span className="text-xs text-[#94A3B8] hidden sm:inline">
            Physics-driven 3D crystals mapped to risk categories
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((p) => {
            const isCurrentSelected = selectedPlan.id === p.id;
            return (
              <Card3DTilt key={p.id} maxTilt={10} glare={true} className="rounded-[18px]">
                <div
                  className={`p-5 rounded-[18px] border transition-all h-full flex flex-col justify-between ${
                    isCurrentSelected
                      ? 'bg-gradient-to-b from-[#202052] to-[#16173a] border-[#10B981] shadow-xl'
                      : 'bg-[#181a3d] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <ThreePlanBadge
                        planType={p.name}
                        color={isCurrentSelected ? '#10B981' : '#10B981'}
                        size={56}
                      />
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#94A3B8]">
                        {p.riskLabel}
                      </span>
                    </div>

                    <h4 className="font-heading text-base font-bold text-white">{p.name}</h4>
                    <p className="text-xs text-[#94A3B8] mt-1 line-clamp-2">{p.description || p.returnSubtext}</p>

                    <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-[#94A3B8]">Target ROI:</span>
                        <span className="text-[#34D399] font-bold">{p.projectedReturn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#94A3B8]">Lockup:</span>
                        <span className="text-white">{p.lockupPeriod || 'Flexible (30-90 Days)'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#94A3B8]">Min Investment:</span>
                        <span className="text-white">{formatCurrency(p.minInvestment)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPlan(p);
                      setAllocationAmount(p.minInvestment);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`mt-4 w-full py-2 rounded-xl text-xs font-semibold transition-all ${
                      isCurrentSelected
                        ? 'bg-[#10B981] text-[#0B0F17] font-bold shadow'
                        : 'bg-white/10 hover:bg-white/15 text-white'
                    }`}
                  >
                    {isCurrentSelected ? 'Strategy Selected ✓' : 'Select Strategy'}
                  </button>
                </div>
              </Card3DTilt>
            );
          })}
        </div>
      </div>

      {/* 3D Success Celebration Modal */}
      {showCelebration && (
        <ThreeCoinCelebration
          title="Capital Successfully Deployed!"
          subtitle={`Your capital is now active under the ${selectedPlan.name} strategy and generating compounding daily yield.`}
          amount={formatCurrency(allocationAmount)}
          onClose={() => setShowCelebration(false)}
        />
      )}
    </div>
  );
};
