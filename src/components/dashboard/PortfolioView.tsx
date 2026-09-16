import React, { useState } from 'react';
import { PieChart, TrendingUp, ArrowUpRight, PlusCircle, CheckCircle, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HoldingsBarChart } from '../charts/HoldingsBarChart';

export const PortfolioView: React.FC = () => {
  const { holdings, formatCurrency, setCurrentView, totalInvested, totalProfit } = useApp();
  const [selectedHolding, setSelectedHolding] = useState<any | null>(null);

  const totalCurrentValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top summary card */}
      <div className="p-6 rounded-[18px] bg-[#131926] border border-white/10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-mono text-[#94A3B8] uppercase tracking-wider">
            Total Active Portfolio Value
          </span>
          <div className="font-heading text-3xl sm:text-4xl font-bold mt-1 text-white font-mono-num">
            {formatCurrency(totalCurrentValue)}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-[#34D399]">
            <TrendingUp className="w-4 h-4 text-[#10B981]" />
            <span className="font-semibold">
              Net Gain: +{formatCurrency(totalProfit)} (
              {totalInvested > 0 ? ((totalProfit / totalInvested) * 100).toFixed(1) : 0}%)
            </span>
            <span className="text-[#94A3B8]">across {holdings.length} plans</span>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('investments')}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-[10px] bg-gradient-to-r from-[#10B981] to-[#10B981] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
        >
          <PlusCircle className="w-4 h-4" /> Allocate to New Plan
        </button>
      </div>

      {/* Bar Chart Panel: Invested vs Current Value */}
      <div className="p-6 rounded-[18px] bg-[#131926] border border-white/10 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading text-lg font-bold">Capital Allocation vs Current Valuation</h3>
            <p className="text-xs text-[#94A3B8]">
              Direct comparison of principal invested versus current marked-to-market valuation per plan
            </p>
          </div>
        </div>
        <HoldingsBarChart holdings={holdings} isDark={true} />
      </div>

      {/* Holdings Table */}
      <div className="p-6 rounded-[18px] bg-[#131926] border border-white/10 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading text-lg font-bold">Holdings by Plan</h3>
            <p className="text-xs text-[#94A3B8]">Detailed breakdown of individual strategy positions</p>
          </div>
        </div>

        {/* Mobile Holdings Cards (phones only) */}
        <div className="block md:hidden space-y-3">
          {holdings.map((h) => {
            const gain = h.currentValue - h.investedAmount;
            const gainPercent = ((gain / h.investedAmount) * 100).toFixed(1);
            return (
              <div
                key={h.id}
                className="p-4 rounded-[16px] bg-white/5 border border-white/10 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-white font-heading text-base">{h.planName}</div>
                    <div className="text-[10px] text-[#94A3B8] font-mono mt-0.5">
                      Started: {h.startDate}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full capitalize ${
                      h.riskLevel === 'low'
                        ? 'bg-[#10B981]/20 text-[#34D399]'
                        : h.riskLevel === 'moderate'
                        ? 'bg-[#F59E0B]/20 text-[#F59E0B]'
                        : 'bg-[#8B5CF6]/20 text-[#A78BFA]'
                    }`}
                  >
                    {h.riskLevel}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-xs">
                  <div>
                    <div className="text-[10px] text-[#94A3B8]">Invested Principal</div>
                    <div className="font-mono font-semibold text-white mt-0.5">
                      {formatCurrency(h.investedAmount)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#94A3B8]">Current Valuation</div>
                    <div className="font-mono font-bold text-[#34D399] mt-0.5">
                      {formatCurrency(h.currentValue)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="text-xs font-mono font-bold text-[#34D399]">
                    +{gainPercent}% (+{formatCurrency(gain)})
                  </div>
                  <button
                    onClick={() => setSelectedHolding(h)}
                    className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
                  >
                    Manage
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Holdings Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[#94A3B8] text-[11px] uppercase font-mono tracking-wider">
                <th className="pb-3 font-semibold">Plan Strategy</th>
                <th className="pb-3 font-semibold">Risk Class</th>
                <th className="pb-3 font-semibold">Invested Principal</th>
                <th className="pb-3 font-semibold">Current Value</th>
                <th className="pb-3 font-semibold">Net Return</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {holdings.map((h) => {
                const gain = h.currentValue - h.investedAmount;
                const gainPercent = ((gain / h.investedAmount) * 100).toFixed(1);
                return (
                  <tr key={h.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4">
                      <div className="font-bold text-white font-heading text-base">{h.planName}</div>
                      <div className="text-[11px] text-[#94A3B8] font-mono">Started: {h.startDate}</div>
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-block text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full capitalize ${
                          h.riskLevel === 'low'
                            ? 'bg-[#10B981]/20 text-[#34D399]'
                            : h.riskLevel === 'moderate'
                            ? 'bg-[#F59E0B]/20 text-[#F59E0B]'
                            : 'bg-[#8B5CF6]/20 text-[#A78BFA]'
                        }`}
                      >
                        {h.riskLevel}
                      </span>
                    </td>
                    <td className="py-4 font-mono font-medium text-white">
                      {formatCurrency(h.investedAmount)}
                    </td>
                    <td className="py-4 font-mono font-bold text-[#34D399]">
                      {formatCurrency(h.currentValue)}
                    </td>
                    <td className="py-4 font-mono font-bold text-[#34D399]">
                      +{gainPercent}% (+{formatCurrency(gain)})
                    </td>
                    <td className="py-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#34D399]">
                        <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" /> {h.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => setSelectedHolding(h)}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Holding Details Drawer / Modal */}
      {selectedHolding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#131926] border border-white/15 rounded-[18px] max-w-md w-full p-6 text-white text-left relative shadow-2xl">
            <button
              onClick={() => setSelectedHolding(null)}
              className="absolute top-4 right-4 text-[#94A3B8] hover:text-white font-bold p-1"
            >
              ✕
            </button>

            <h3 className="font-heading text-xl font-bold text-white mb-1">
              {selectedHolding.planName} Holding Overview
            </h3>
            <p className="text-xs text-[#94A3B8] mb-4">
              Holding ID: <span className="font-mono text-white">{selectedHolding.id}</span>
            </p>

            <div className="space-y-3 bg-[#0B0F17] p-4 rounded-xl border border-white/5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Invested Principal:</span>
                <span className="font-bold text-white">{formatCurrency(selectedHolding.investedAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Current Valuation:</span>
                <span className="font-bold text-[#34D399]">{formatCurrency(selectedHolding.currentValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Net Total Gain:</span>
                <span className="font-bold text-[#10B981]">
                  +{formatCurrency(selectedHolding.currentValue - selectedHolding.investedAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Compounding Frequency:</span>
                <span className="text-white">Daily Accrual</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Lockup Penalty:</span>
                <span className="text-[#34D399]">None (Flexible Exit)</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setSelectedHolding(null);
                  setCurrentView('withdraw');
                }}
                className="flex-1 py-2.5 rounded-[10px] bg-gradient-to-r from-[#10B981] to-[#8B5CF6] text-white font-semibold text-xs transition-all"
              >
                Liquidate to Balance
              </button>
              <button
                onClick={() => setSelectedHolding(null)}
                className="px-4 py-2.5 rounded-[10px] bg-white/10 text-white font-semibold text-xs hover:bg-white/15"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
