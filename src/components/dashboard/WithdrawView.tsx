import React, { useState } from 'react';
import {
  Building2,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  KeyRound,
  ArrowUpFromLine
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const WithdrawView: React.FC = () => {
  const { user } = useAuth();
  const { requestWithdrawal, formatCurrency } = useApp();

  const [withdrawAmount, setWithdrawAmount] = useState<number>(5000);
  const [payoutMethod, setPayoutMethod] = useState<'Bank Transfer' | 'JazzCash' | 'Easypaisa'>('Bank Transfer');
  const [accountTitle, setAccountTitle] = useState<string>(user?.fullName || 'Aisha Khan');
  const [accountNumber, setAccountNumber] = useState<string>('0281-992019481');
  const [otpCode, setOtpCode] = useState<string>('842910');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const availableBalance = user?.balance || 0;
  const minWithdrawal = 500;
  const feePercentage = 0.01;
  const feeAmount = Math.round(withdrawAmount * feePercentage);
  const netPayout = Math.max(0, withdrawAmount - feeAmount);

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (withdrawAmount < minWithdrawal) {
      setStatusMsg({
        type: 'error',
        text: `Minimum withdrawal amount is ${formatCurrency(minWithdrawal)}.`
      });
      return;
    }

    if (withdrawAmount > availableBalance) {
      setStatusMsg({
        type: 'error',
        text: `Requested amount exceeds available balance (${formatCurrency(availableBalance)}).`
      });
      return;
    }

    if (!otpCode || otpCode.length < 4) {
      setStatusMsg({
        type: 'error',
        text: 'Please enter the 6-digit authorization PIN.'
      });
      return;
    }

    const ok = requestWithdrawal(withdrawAmount, payoutMethod, accountTitle, accountNumber);
    if (ok) {
      setStatusMsg({
        type: 'success',
        text: `Withdrawal request for ${formatCurrency(
          withdrawAmount
        )} queued! Net payout ${formatCurrency(netPayout)} will be transferred to ${accountTitle}.`
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-left">
      <div className="bg-[#131926] rounded-2xl border border-white/10 p-6 sm:p-8 shadow-xl text-white space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <ArrowUpFromLine className="w-4 h-4" />
              </div>
              <h3 className="font-heading text-xl font-bold text-white">Withdraw Capital</h3>
            </div>
            <p className="text-xs text-slate-400">
              Disburse liquid earnings to your registered bank account or mobile wallet via Raast 1-Link
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] text-slate-400 block">Available Balance:</span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {formatCurrency(availableBalance)}
            </span>
          </div>
        </div>

        {/* Status Alert Banner */}
        {statusMsg && (
          <div
            className={`p-4 rounded-xl text-xs font-medium flex items-start gap-3 animate-in fade-in ${
              statusMsg.type === 'success'
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <span className="font-bold text-white block">
                {statusMsg.type === 'success' ? 'Withdrawal Queued' : 'Validation Notice'}
              </span>
              <p>{statusMsg.text}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleWithdrawSubmit} className="space-y-5">
          {/* Channel selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-2">
              1. Select Payout Channel
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'Bank Transfer', icon: Building2, label: 'Bank (IBAN)' },
                { id: 'JazzCash', icon: Smartphone, label: 'JazzCash' },
                { id: 'Easypaisa', icon: Smartphone, label: 'Easypaisa' }
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = payoutMethod === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPayoutMethod(item.id as any)}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-500/40'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <div className="font-bold text-xs">{item.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Account Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                2. Recipient Account Title
              </label>
              <input
                type="text"
                value={accountTitle}
                onChange={(e) => setAccountTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                3. Account / IBAN Number
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          {/* Amount */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-slate-200">
                4. Withdrawal Amount
              </label>
              <span className="text-[11px] font-mono text-slate-400">
                Max: {formatCurrency(availableBalance)}
              </span>
            </div>
            <input
              type="number"
              min={minWithdrawal}
              max={availableBalance}
              step={100}
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          {/* Fee Breakdown */}
          <div className="p-4 rounded-xl bg-[#0B0F17] border border-white/10 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Gross Withdrawal:</span>
              <span className="text-white font-bold">{formatCurrency(withdrawAmount)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Handling Fee (1%):</span>
              <span className="text-rose-400">-{formatCurrency(feeAmount)}</span>
            </div>
            <div className="flex justify-between text-emerald-400 pt-2 border-t border-white/10 font-bold text-sm">
              <span>Net Credited Amount:</span>
              <span>{formatCurrency(netPayout)}</span>
            </div>
          </div>

          {/* Security PIN */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                5. Security Authorization PIN
              </span>
              <span className="text-[10px] font-mono text-emerald-400">Pre-filled for Demo</span>
            </label>
            <input
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="6-digit PIN"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-white/15 text-white font-mono text-sm tracking-widest text-center focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
          >
            Confirm Withdrawal ({formatCurrency(withdrawAmount)})
          </button>
        </form>
      </div>
    </div>
  );
};
