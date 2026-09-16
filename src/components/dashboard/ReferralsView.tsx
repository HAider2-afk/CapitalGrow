import React, { useState } from 'react';
import { Gift, Copy, Check, Users, Award, TrendingUp, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const ReferralsView: React.FC = () => {
  const { user } = useAuth();
  const { formatCurrency } = useApp();
  const [copied, setCopied] = useState(false);

  const referralLink = `https://capitalgrow.platform/join?ref=${user?.referralCode || 'CG-7XQ2'}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const leaderboard = [
    { rank: 1, name: 'Bilal Rashid', referrals: 38, rewards: 11000 },
    { rank: 2, name: 'Sana Malik', referrals: 29, rewards: 8450 },
    { rank: 3, name: 'You (Aisha Khan)', referrals: 14, rewards: 4200, isCurrent: true },
    { rank: 4, name: 'Hamza Tariq', referrals: 12, rewards: 3600 },
    { rank: 5, name: 'Zeeshan Iqbal', referrals: 8, rewards: 2400 }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-left">
      {/* Referral Link Card */}
      <div className="p-6 rounded-[18px] bg-[#131926] border border-white/10 text-white shadow-xl space-y-4">
        <div>
          <h2 className="font-heading text-2xl font-bold">Referral Program</h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
            Invite fellow investors and earn fixed promotional credits upon their verified deposit
          </p>
        </div>

        {/* Link box */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 rounded-xl bg-[#0B0F17] border border-white/10">
          <span className="flex-1 px-3 py-1.5 text-xs font-mono text-[#94A3B8] truncate select-all">
            {referralLink}
          </span>
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied!' : 'Copy Referral Link'}</span>
          </button>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#60A5FA] to-[#2563EB] text-white">
            <div className="text-[11px] font-medium text-white/80">Total Referrals</div>
            <div className="text-2xl font-bold font-mono-num mt-1">14 Users</div>
            <div className="text-[10px] text-white/70 mt-1">Registered with your code</div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#10B981] to-[#0E9F6E] text-white">
            <div className="text-[11px] font-medium text-white/80">Active Investors</div>
            <div className="text-2xl font-bold font-mono-num mt-1">9 Active</div>
            <div className="text-[10px] text-white/70 mt-1">Funded minimum deposit</div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#F472B6] to-[#DB2777] text-white">
            <div className="text-[11px] font-medium text-white/80">Rewards Earned</div>
            <div className="text-2xl font-bold font-mono-num mt-1">{formatCurrency(4200)}</div>
            <div className="text-[10px] text-white/70 mt-1">Credited to wallet balance</div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#EA7A08] text-white">
            <div className="text-[11px] font-medium text-white/80">Pending Rewards</div>
            <div className="text-2xl font-bold font-mono-num mt-1">{formatCurrency(600)}</div>
            <div className="text-[10px] text-white/70 mt-1">Awaiting KYC clearance</div>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="p-6 rounded-[18px] bg-[#131926] border border-white/10 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading text-lg font-bold">Community Leaderboard</h3>
            <p className="text-xs text-[#94A3B8]">Top advocate partners this quarter</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[#94A3B8] text-[11px] uppercase font-mono">
                <th className="pb-3 font-semibold">Rank</th>
                <th className="pb-3 font-semibold">Investor</th>
                <th className="pb-3 font-semibold">Verified Referrals</th>
                <th className="pb-3 font-semibold text-right">Rewards Disbursed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leaderboard.map((u) => (
                <tr
                  key={u.rank}
                  className={`hover:bg-white/5 transition-colors ${
                    u.isCurrent ? 'bg-white/5 font-semibold text-[#34D399]' : ''
                  }`}
                >
                  <td className="py-3 font-mono font-bold">#{u.rank}</td>
                  <td className="py-3 font-medium text-white">{u.name}</td>
                  <td className="py-3 font-mono">{u.referrals} users</td>
                  <td className="py-3 font-mono text-right text-[#34D399] font-bold">
                    {formatCurrency(u.rewards)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-[#94A3B8] mt-4 pt-3 border-t border-white/10">
          * Referral bonus structure is a flat marketing credit for direct peer introductions. It does not constitute multi-level marketing (MLM) or investment yield promises.
        </p>
      </div>
    </div>
  );
};
