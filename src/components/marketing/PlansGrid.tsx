import React, { useState } from 'react';
import { Check, ShieldAlert, Sparkles, ArrowRight, Info, Calculator } from 'lucide-react';
import { Plan, RiskLevel } from '../../types';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

interface PlansGridProps {
  onSelectPlan?: (plan: Plan) => void;
}

export const PlansGrid: React.FC<PlansGridProps> = ({ onSelectPlan }) => {
  const { plans, formatCurrency, investInPlan } = useApp();
  const { isAuthenticated, openAuthModal, user } = useAuth();
  const [selectedPlanDetails, setSelectedPlanDetails] = useState<Plan | null>(null);
  const [calcAmount, setCalcAmount] = useState<number>(5000);
  const [investSuccess, setInvestSuccess] = useState<string | null>(null);

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'low':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EEECFF] text-[#635BFF] border border-[#635BFF]/30">
            <span className="w-2 h-2 rounded-full bg-[#18C8B5]" /> Low Risk (Tier 1)
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FBF0E2] text-[#F59E0B] border border-[#F59E0B]/30">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" /> Moderate Risk (Tier 2)
          </span>
        );
      case 'mod-high':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F5EEFF] text-[#8B5CF6] border border-[#8B5CF6]/30">
            <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" /> Mod–High Risk (Tier 3)
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F8E4E2] text-[#E5484D] border border-[#E5484D]/30">
            <span className="w-2 h-2 rounded-full bg-[#E5484D]" /> High Risk (Tier 4)
          </span>
        );
    }
  };

  const getBorderColor = (risk: RiskLevel, recommended?: boolean) => {
    if (recommended) return 'border-[#635BFF] ring-2 ring-[#635BFF]/20 shadow-xl';
    switch (risk) {
      case 'low':
        return 'border-t-4 border-t-[#18C8B5]';
      case 'moderate':
        return 'border-t-4 border-t-[#F59E0B]';
      case 'mod-high':
        return 'border-t-4 border-t-[#8B5CF6]';
      case 'high':
        return 'border-t-4 border-t-[#E5484D]';
    }
  };

  const handleAction = (plan: Plan) => {
    if (!isAuthenticated) {
      openAuthModal('register');
      return;
    }
    if (onSelectPlan) {
      onSelectPlan(plan);
    } else {
      setSelectedPlanDetails(plan);
    }
  };

  return (
    <section id="plans" className="py-20 bg-[#F6F7FC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E4E6F0] text-xs font-semibold text-[#635BFF]">
            Transparent Risk-Graded Architecture
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#20204A]">
            Choose your investment plan
          </h2>
          <p className="text-base text-[#667085] max-w-2xl mx-auto">
            Every plan discloses its risk level, minimum allocation, and asset composition upfront. Historical yields are illustrative estimates — never guaranteed.
          </p>
        </div>

        {/* 4 Tiered Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((plan) => {
            const isRec = plan.recommended;
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between bg-white rounded-[18px] p-6 border border-[#E4E6F0] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${getBorderColor(
                  plan.riskLevel,
                  isRec
                )}`}
              >
                {isRec && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-[#635BFF] to-[#18C8B5] text-white text-[11px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Most Popular
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-heading text-xl font-bold text-[#20204A]">
                      {plan.name}
                    </h3>
                  </div>

                  {/* Risk Badge */}
                  <div className="mt-3">{getRiskBadge(plan.riskLevel)}</div>

                  {/* Minimum investment */}
                  <div className="mt-5 pb-4 border-b border-[#E4E6F0]">
                    <div className="text-xs font-mono text-[#667085]">Minimum Investment</div>
                    <div className="text-2xl font-bold font-heading text-[#20204A] mt-0.5">
                      {formatCurrency(plan.minInvestment)}
                    </div>
                  </div>

                  {/* Projected Return */}
                  <div className="my-4 p-3 rounded-xl bg-[#F6F7FC] border border-[#E4E6F0]/80">
                    <div className="text-[11px] font-mono text-[#667085]">Projected Return Target</div>
                    <div className="text-lg font-bold text-[#635BFF] font-mono-num">
                      {plan.projectedReturn}
                    </div>
                    <div className="text-[11px] text-[#667085] mt-1 leading-snug">
                      {plan.returnSubtext}
                    </div>
                  </div>

                  {/* Features list */}
                  <ul className="space-y-2.5 my-5 text-sm text-[#17182B]">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-[#667085]">
                        <Check className="w-4 h-4 text-[#18C8B5] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#E4E6F0] mt-4 space-y-2">
                  <button
                    onClick={() => handleAction(plan)}
                    className={`w-full py-2.5 px-4 rounded-[10px] font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                      isRec
                        ? 'bg-gradient-to-r from-[#635BFF] to-[#18C8B5] text-white shadow-md hover:shadow-lg'
                        : 'bg-[#F6F7FC] hover:bg-[#EEECFF] text-[#20204A] border border-[#E4E6F0] hover:border-[#635BFF]/40'
                    }`}
                  >
                    <span>{isAuthenticated ? 'Allocate & Invest' : 'Get Started'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setSelectedPlanDetails(plan)}
                    className="w-full text-center text-xs font-semibold text-[#667085] hover:text-[#635BFF] py-1 transition-colors"
                  >
                    Yield Calculator & Prospectus
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mandatory Legal Disclaimer */}
        <div className="mt-12 bg-white rounded-[14px] p-5 border border-[#E4E6F0] text-xs text-[#667085] leading-relaxed flex items-start gap-3 shadow-sm">
          <ShieldAlert className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-[#20204A] block">
              Statutory Risk & Performance Disclaimer:
            </span>
            <p>
              Investment performance is not guaranteed, and you may lose some or all of your invested capital. The 6–12%, 12–18%, 18–26%, and 26–38% figures shown are illustrative historical ranges, not promises or warranties of future gains. Fees, withdrawal restrictions, and liquidity conditions vary by plan and are governed strictly by your signed investor prospectus.
            </p>
          </div>
        </div>
      </div>

      {/* Plan Details & Calculator Modal */}
      {selectedPlanDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[18px] max-w-lg w-full p-6 relative shadow-2xl border border-[#E4E6F0] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setSelectedPlanDetails(null);
                setInvestSuccess(null);
              }}
              className="absolute top-4 right-4 text-[#667085] hover:text-[#20204A] text-lg font-bold p-1"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-5 h-5 text-[#635BFF]" />
              <h3 className="font-heading text-xl font-bold text-[#20204A]">
                {selectedPlanDetails.name} Plan Simulator
              </h3>
            </div>

            <p className="text-xs text-[#667085] mb-4">
              Simulate potential compounding returns based on conservative historical baselines.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#20204A] mb-1.5">
                  Investment Capital ({formatCurrency(calcAmount)})
                </label>
                <input
                  type="range"
                  min={selectedPlanDetails.minInvestment}
                  max={500000}
                  step={500}
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(Number(e.target.value))}
                  className="w-full accent-[#635BFF] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-mono text-[#667085] mt-1">
                  <span>Min: {formatCurrency(selectedPlanDetails.minInvestment)}</span>
                  <span>Max: {formatCurrency(500000)}</span>
                </div>
              </div>

              {/* Simulation Result */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-[#F6F7FC] rounded-xl border border-[#E4E6F0]">
                <div>
                  <div className="text-[11px] font-mono text-[#667085]">1-Year Projected Range</div>
                  <div className="text-base font-bold text-[#635BFF] font-mono-num mt-1">
                    {formatCurrency(calcAmount * 1.08)} – {formatCurrency(calcAmount * 1.18)}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-mono text-[#667085]">Est. Net Monthly Yield</div>
                  <div className="text-base font-bold text-[#18C8B5] font-mono-num mt-1">
                    ~{formatCurrency((calcAmount * 0.12) / 12)}
                  </div>
                </div>
              </div>

              {investSuccess && (
                <div className="p-3 bg-[#EEECFF] text-[#635BFF] rounded-lg text-xs font-medium border border-[#635BFF]/30">
                  {investSuccess}
                </div>
              )}

              {/* Action buttons */}
              <div className="pt-2 flex gap-3">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      if (user && user.balance >= calcAmount) {
                        investInPlan(selectedPlanDetails.id, calcAmount);
                        setInvestSuccess(`Allocated ${formatCurrency(calcAmount)} into ${selectedPlanDetails.name}!`);
                      } else {
                        setInvestSuccess(
                          `Insufficient ready balance (${formatCurrency(user?.balance || 0)}). Please deposit funds first in your dashboard.`
                        );
                      }
                    }}
                    className="flex-1 py-2.5 rounded-[10px] bg-[#635BFF] text-white font-semibold text-sm hover:bg-[#5349EE] transition-colors"
                  >
                    Confirm Allocation ({formatCurrency(calcAmount)})
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedPlanDetails(null);
                      openAuthModal('register');
                    }}
                    className="flex-1 py-2.5 rounded-[10px] bg-[#635BFF] text-white font-semibold text-sm hover:bg-[#5349EE] transition-colors"
                  >
                    Sign Up to Invest
                  </button>
                )}
                <button
                  onClick={() => setSelectedPlanDetails(null)}
                  className="px-4 py-2.5 rounded-[10px] border border-[#E4E6F0] text-[#667085] hover:text-[#20204A] font-semibold text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
