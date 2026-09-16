import React, { useState } from 'react';
import {
  ArrowUpFromLine,
  Building2,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  KeyRound
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const WithdrawView: React.FC = () => {
  const { user } = useAuth();
  const { requestWithdrawal, formatCurrency, transactions } = useApp();

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
        text: `Requested amount exceeds ready balance (${formatCurrency(availableBalance)}).`
      });
      return;
    }

    if (!otpCode || otpCode.length < 4) {
      setStatusMsg({
        type: 'error',
        text: 'Please enter the 6-digit one-time authorization PIN.'
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

  const recentWithdrawals = transactions.filter((t) => t.type === 'Withdrawal');

  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-left">
      {/* Balance & Fee Disclosure Notice */}
      <div className="p-4 rounded-[14px] bg-[#635BFF]/15 border border-[#635BFF]/30 text-white text-xs flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-1">
          <span className="font-bold block text-[#8FE3B0]">Available Liquid Balance:</span>
          <p className="text-[#89A0AF]">
            You have <strong className="text-white font-mono-num">{formatCurrency(availableBalance)}</strong> available for immediate withdrawal settlement.
          </p>
        </div>
        <div className="text-left sm:text-right shrink-0">
          <span className="text-[11px] font-mono text-[#89A0AF]">Standard Handling:</span>
          <span className="block font-mono text-[#8FE3B0] font-bold">1% Fee (Min {formatCurrency(minWithdrawal)})</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Withdrawal Request Form */}
        <div className="lg:col-span-7 p-6 rounded-[18px] bg-[#20204A] border border-white/10 text-white shadow-xl space-y-5">
          <div>
            <h3 className="font-heading text-xl font-bold">Request Capital Withdrawal</h3>
            <p className="text-xs text-[#89A0AF] mt-0.5">
              Funds are disbursed via real-time 1-Link Raast or mobile wallet infrastructure
            </p>
          </div>

          {statusMsg && (
            <div
              className={`p-3.5 rounded-xl text-xs font-medium flex items-start gap-2 ${
                statusMsg.type === 'success'
                  ? 'bg-[#18C8B5]/20 text-[#8FE3B0] border border-[#18C8B5]/30'
                  : 'bg-[#E5484D]/20 text-[#E5484D] border border-[#E5484D]/30'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleWithdrawSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white mb-2">
                1. Select Payout Channel
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'Bank Transfer', icon: Building2, label: 'Bank IBAN' },
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
                      className={`p-3 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'bg-[#635BFF]/25 border-[#635BFF] text-white shadow-md'
                          : 'bg-white/5 border-white/10 text-[#89A0AF] hover:bg-white/10'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-[#18C8B5]' : 'text-[#89A0AF]'}`} />
                      <div className="font-bold text-xs text-white">{item.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">
                  2. Recipient Account Title
                </label>
                <input
                  type="text"
                  value={accountTitle}
                  onChange={(e) => setAccountTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-[10px] bg-[#0B1026] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#635BFF]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">
                  3. Account / IBAN Number
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-[10px] bg-[#0B1026] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#635BFF]"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-white">
                  4. Withdrawal Amount
                </label>
                <span className="text-[11px] font-mono text-[#89A0AF]">
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
                className="w-full px-3 py-2.5 rounded-[10px] bg-[#0B1026] border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-[#635BFF]"
                required
              />
            </div>

            {/* Fee & Net Calculation Breakdown */}
            <div className="p-4 rounded-xl bg-[#0B1026] border border-white/5 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-[#89A0AF]">
                <span>Gross Principal:</span>
                <span className="text-white font-bold">{formatCurrency(withdrawAmount)}</span>
              </div>
              <div className="flex justify-between text-[#89A0AF]">
                <span>Regulatory Settlement Fee (1%):</span>
                <span className="text-[#E5484D]">-{formatCurrency(feeAmount)}</span>
              </div>
              <div className="flex justify-between text-[#8FE3B0] pt-2 border-t border-white/10 font-bold text-sm">
                <span>Net Credited Amount:</span>
                <span>{formatCurrency(netPayout)}</span>
              </div>
            </div>

            {/* Security OTP confirmation */}
            <div>
              <label className="block text-xs font-semibold text-white mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#18C8B5]" />
                  5. Two-Factor Security OTP
                </span>
                <span className="text-[10px] font-mono text-[#8FE3B0]">Sent to verified phone</span>
              </label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="6-digit authorization code"
                className="w-full px-3 py-2.5 rounded-[10px] bg-[#0B1026] border border-white/15 text-white font-mono text-sm tracking-widest text-center focus:outline-none focus:border-[#635BFF]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-[10px] bg-gradient-to-r from-[#635BFF] to-[#18C8B5] text-white font-semibold text-sm hover:shadow-lg transition-all"
            >
              Confirm Withdrawal ({formatCurrency(withdrawAmount)})
            </button>
          </form>
        </div>

        {/* Right: Withdrawal History */}
        <div className="lg:col-span-5 p-6 rounded-[18px] bg-[#20204A] border border-white/10 text-white shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-heading text-lg font-bold mb-1">Withdrawal Request History</h3>
            <p className="text-xs text-[#89A0AF] mb-4">
              Historical ledger of requested capital redemptions
            </p>

            <div className="space-y-3">
              {recentWithdrawals.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#89A0AF]">
                  No withdrawal requests recorded yet.
                </div>
              ) : (
                recentWithdrawals.map((w) => (
                  <div
                    key={w.id}
                    className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-xs text-left"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white font-mono-num text-sm">
                        {formatCurrency(w.amount)}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                          w.status === 'Approved'
                            ? 'bg-[#18C8B5]/20 text-[#8FE3B0]'
                            : w.status === 'Pending'
                            ? 'bg-[#F59E0B]/20 text-[#F59E0B]'
                            : 'bg-[#E5484D]/20 text-[#E5484D]'
                        }`}
                      >
                        {w.status}
                      </span>
                    </div>
                    <div className="text-[#89A0AF] text-[11px] font-mono">{w.method}</div>
                    <div className="flex items-center justify-between text-[10px] text-[#5C7280] font-mono mt-1.5 pt-1.5 border-t border-white/5">
                      <span>ID: {w.referenceId}</span>
                      <span>{w.date}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-white/10 text-[11px] text-[#89A0AF] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#18C8B5] shrink-0" />
            <span>Withdrawals are monitored by compliance algorithms under AML rules.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
