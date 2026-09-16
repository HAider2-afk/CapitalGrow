import React from 'react';
import { Users, Coins, Percent, ArrowDownToLine } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StatsStrip: React.FC = () => {
  const { currency } = useApp();

  const stats = [
    {
      icon: Users,
      value: '10,000+',
      label: 'Verified Registered Users',
      subtext: 'Across individual & corporate tiers'
    },
    {
      icon: Coins,
      value: `${currency} 50M+`,
      label: 'Total Platform AUM Volume',
      subtext: 'Managed with segregated custody'
    },
    {
      icon: Percent,
      value: '11.4%',
      label: 'Average Annualized Yield',
      subtext: 'Historical composite over 3 cycles'
    },
    {
      icon: ArrowDownToLine,
      value: '99.8%',
      label: 'Withdrawals Processed <24h',
      subtext: 'Automated settlement clearing'
    }
  ];

  return (
    <div className="bg-[#0B1026] border-y border-white/10 text-white relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="py-6 sm:py-8 px-4 sm:px-6 lg:first:pl-0 lg:last:pr-0 flex items-start gap-3.5 sm:gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#18C8B5] shrink-0 mt-0.5">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="font-heading text-3xl lg:text-3xl font-bold tracking-tight text-white font-mono-num">
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-[#89A0AF] leading-tight">
                    {stat.label}
                  </div>
                  <div className="text-xs text-[#667085] leading-normal font-sans">
                    {stat.subtext}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-[#070A18] py-2 text-center text-[11px] font-mono text-[#667085] border-t border-white/5">
        Metrics audited quarterly by independent chartered accounting partners · Past figures are not guarantees of future returns
      </div>
    </div>
  );
};
