import React, { useState } from 'react';
import {
  ArrowDownToLine,
  Building2,
  Smartphone,
  CheckCircle2,
  Copy,
  AlertTriangle,
  UploadCloud,
  FileText,
  Zap,
  Coins,
  Settings,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { AdminPaymentAccount } from '../../types';
import { Card3DTilt } from '../three3d/Card3DTilt';
import { ThreeCoinCelebration } from '../three3d/ThreeCoinCelebration';

export const DepositView: React.FC = () => {
  const { addDeposit, formatCurrency, transactions, paymentAccounts, setCurrentView } = useApp();
  const { user } = useAuth();

  const activeAccounts = paymentAccounts.filter((a) => a.isActive);
  const defaultAccount = activeAccounts.find((a) => a.isPrimary) || activeAccounts[0];

  const [depositAmount, setDepositAmount] = useState<number>(25000);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(defaultAccount?.id || 'acc-1');
  const [referenceId, setReferenceId] = useState<string>('');
  const [depositNote, setDepositNote] = useState<string>('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  const selectedAccount: AdminPaymentAccount | undefined =
    activeAccounts.find((a) => a.id === selectedAccountId) || defaultAccount;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'wallet':
        return Smartphone;
      case 'raast':
        return Zap;
      case 'crypto':
        return Coins;
      case 'bank':
      default:
        return Building2;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositAmount || depositAmount <= 0) return;

    const ref = referenceId || `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    const accName = selectedAccount ? selectedAccount.name : 'Domestic Bank';
    const sampleReceiptUrl = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80';

    addDeposit(
      depositAmount,
      accName,
      ref,
      depositNote || (fileName ? `Receipt: ${fileName}` : undefined),
      sampleReceiptUrl,
      accName
    );

    setSuccessMsg(
      `Deposit request for ${formatCurrency(depositAmount)} via ${accName} queued! Admin will verify the transaction slip and credit your balance shortly.`
    );
    setShowCelebration(true);
    setReferenceId('');
    setDepositNote('');
    setFileName(null);
  };

  const recentDeposits = transactions.filter((t) => t.type === 'Deposit');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Admin Quick Banner if user has admin privileges */}
      {user?.role === 'admin' && (
        <div className="p-3.5 rounded-[14px] bg-[#10B981]/15 border border-[#10B981]/30 text-white text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#34D399]" />
            <span>
              <strong>Admin Mode Active:</strong> You can edit bank details, add accounts, and confirm payments in the Admin Panel.
            </span>
          </div>
          <button
            onClick={() => setCurrentView('admin')}
            className="px-3 py-1 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white font-medium text-xs transition-colors shrink-0 shadow-sm"
          >
            Open Admin Payment Panel →
          </button>
        </div>
      )}

      {/* Security Warning Notice */}
      <div className="p-4 rounded-[14px] bg-[#F59E0B]/15 border border-[#F59E0B]/30 text-[#F59E0B] text-xs flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white block">Official Bank Verification Notice:</span>
          <p className="text-white/80">
            Only transfer funds to the verified CapitalGrow accounts listed below. All accounts are configured directly by our treasury operations team and audited under escrow protections.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Amount & Payment Instructions */}
        <div className="lg:col-span-7 p-6 rounded-[18px] bg-[#131926] border border-white/10 text-white shadow-xl space-y-6 text-left">
          <div>
            <h3 className="font-heading text-xl font-bold">Deposit Funds</h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Select an official CapitalGrow depository account, transfer the amount, and submit receipt
            </p>
          </div>

          {successMsg && (
            <div className="p-4 rounded-xl bg-[#10B981]/20 border border-[#10B981]/40 text-[#34D399] text-xs font-medium flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Payment Account Selector configured by Admin */}
          <div>
            <label className="block text-xs font-semibold text-white mb-2">
              1. Select Bank or Wallet Destination
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeAccounts.map((account) => {
                const Icon = getAccountIcon(account.type);
                const isSelected = selectedAccount?.id === account.id;
                return (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => setSelectedAccountId(account.id)}
                    className={`p-3.5 rounded-xl text-left border transition-all relative ${
                      isSelected
                        ? 'bg-[#10B981]/25 border-[#10B981] text-white shadow-md ring-1 ring-[#10B981]/50'
                        : 'bg-white/5 border-white/10 text-[#94A3B8] hover:bg-white/10'
                    }`}
                  >
                    {account.isPrimary && (
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                        Primary
                      </span>
                    )}
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-[#10B981] text-white' : 'bg-white/10 text-[#94A3B8]'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="font-bold text-xs text-white truncate max-w-[140px] sm:max-w-[170px]">
                        {account.name}
                      </div>
                    </div>
                    <div className="text-[11px] font-mono text-[#34D399] truncate">
                      {account.accountNumber}
                    </div>
                    <div className="text-[10px] text-[#94A3B8] mt-0.5 truncate">
                      {account.accountTitle}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Official Bank / Wallet Deposit Account Details Box with 3D Tilt */}
          {selectedAccount && (
            <Card3DTilt maxTilt={6} glare={true} className="rounded-xl">
              <div className="p-4 rounded-xl bg-[#0B0F17] border border-white/10 text-xs font-mono space-y-2.5">
                <div className="text-[11px] font-semibold text-[#34D399] flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" /> Verified Deposit Coordinates
                  </span>
                  {copiedField && (
                    <span className="text-[10px] text-[#10B981] animate-pulse flex items-center gap-1">
                      <Check className="w-3 h-3" /> Copied {copiedField}!
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-[#94A3B8]">
                  <div className="flex justify-between items-center">
                    <span>Provider / Bank:</span>
                    <span className="text-white font-sans font-medium">{selectedAccount.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Account Title:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-white font-sans font-medium">{selectedAccount.accountTitle}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(selectedAccount.accountTitle, 'Account Title')}
                        className="text-[#10B981] hover:text-white"
                        title="Copy title"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Account / Till No:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-white font-bold">{selectedAccount.accountNumber}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(selectedAccount.accountNumber, 'Account Number')}
                        className="text-[#10B981] hover:text-white"
                        title="Copy number"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  {selectedAccount.iban && (
                    <div className="flex justify-between items-center">
                      <span>IBAN:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-white text-[11px] font-bold">{selectedAccount.iban}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(selectedAccount.iban || '', 'IBAN')}
                          className="text-[#10B981] hover:text-white"
                          title="Copy IBAN"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                  {selectedAccount.branchOrTill && (
                    <div className="flex justify-between items-center">
                      <span>Branch / Details:</span>
                      <span className="text-white text-[11px]">{selectedAccount.branchOrTill}</span>
                    </div>
                  )}
                  {selectedAccount.instructions && (
                    <div className="pt-2 border-t border-white/5 text-[11px] font-sans text-amber-300/90 bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                      💡 <strong>Instructions:</strong> {selectedAccount.instructions}
                    </div>
                  )}
                </div>
              </div>
            </Card3DTilt>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                2. Enter Deposit Amount (Rs.)
              </label>
              <input
                type="number"
                min={350}
                max={5000000}
                step={100}
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-[10px] bg-[#0B0F17] border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-[#10B981]"
                required
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {[5000, 10000, 25000, 50000, 100000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setDepositAmount(amt)}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-white/5 hover:bg-white/10 text-[#94A3B8] border border-white/10"
                  >
                    +{formatCurrency(amt)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                3. Banking Transaction Reference / TID
              </label>
              <input
                type="text"
                placeholder="e.g. MEEZ-99410291 or Bank Auth Reference"
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-[10px] bg-[#0B0F17] border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-[#10B981]"
                required
              />
              <p className="text-[10px] text-[#94A3B8] mt-1">
                Enter the Reference number / Transaction ID from your banking app or SMS confirmation.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                4. Transfer Remarks / Depositor Note (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Transferred from Aisha Khan Meezan mobile app"
                value={depositNote}
                onChange={(e) => setDepositNote(e.target.value)}
                className="w-full px-3 py-2.5 rounded-[10px] bg-[#0B0F17] border border-white/15 text-white text-xs focus:outline-none focus:border-[#10B981]"
              />
            </div>

            {/* Receipt Upload Box */}
            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                5. Payment Proof / Screenshot Receipt
              </label>
              <div
                onClick={() => setFileName('deposit_slip_' + Math.floor(1000 + Math.random() * 9000) + '.png')}
                className="border-2 border-dashed border-white/20 hover:border-[#10B981] rounded-xl p-4 text-center cursor-pointer transition-colors bg-white/5"
              >
                <UploadCloud className="w-6 h-6 text-[#10B981] mx-auto mb-1.5" />
                <div className="text-xs text-white font-medium">
                  {fileName ? (
                    <span className="text-[#34D399] flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Receipt Attached: {fileName}
                    </span>
                  ) : (
                    'Click to attach deposit receipt screenshot / transfer slip'
                  )}
                </div>
                <div className="text-[10px] text-[#94A3B8] mt-0.5">PNG, JPG or PDF up to 10MB</div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-[10px] bg-gradient-to-r from-[#10B981] to-[#10B981] text-white font-semibold text-sm hover:shadow-lg transition-all"
            >
              Submit Deposit for Settlement ({formatCurrency(depositAmount)})
            </button>
          </form>
        </div>

        {/* Right: Recent Deposit Activity */}
        <div className="lg:col-span-5 p-6 rounded-[18px] bg-[#131926] border border-white/10 text-white shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-heading text-lg font-bold mb-1">Deposit Audit Status</h3>
            <p className="text-xs text-[#94A3B8] mb-4">
              Real-time ledger entries for incoming capital transfers
            </p>

            <div className="space-y-3">
              {recentDeposits.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#94A3B8]">
                  No deposit history found. Complete your first deposit above!
                </div>
              ) : (
                recentDeposits.map((dep) => (
                  <div
                    key={dep.id}
                    className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-left text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white font-mono-num text-sm">
                        {formatCurrency(dep.amount)}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                          dep.status === 'Approved'
                            ? 'bg-[#10B981]/20 text-[#34D399]'
                            : dep.status === 'Pending'
                            ? 'bg-[#F59E0B]/20 text-[#F59E0B]'
                            : 'bg-[#E5484D]/20 text-[#E5484D]'
                        }`}
                      >
                        {dep.status}
                      </span>
                    </div>
                    <div className="text-[#94A3B8] text-[11px] font-mono">{dep.method}</div>
                    <div className="flex items-center justify-between text-[10px] text-[#64748B] font-mono mt-1.5 pt-1.5 border-t border-white/5">
                      <span>Ref: {dep.referenceId}</span>
                      <span>{dep.date}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-white/10 text-xs text-[#94A3B8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span>
              Standard processing: Bank transfers are reviewed by compliance administrators against official bank statements and approved within 15–30 minutes.
            </span>
            <button
              onClick={() => setCurrentView('support')}
              className="text-[#34D399] hover:underline font-semibold flex items-center gap-1 shrink-0"
            >
              Need help? Open Support Desk →
            </button>
          </div>
        </div>
      </div>

      {/* 3D Deposit Celebration Modal */}
      {showCelebration && (
        <ThreeCoinCelebration
          title="Deposit Slip Submitted!"
          subtitle={`Your deposit of ${formatCurrency(depositAmount)} via ${
            selectedAccount ? selectedAccount.name : 'Domestic Bank'
          } is queued for automated compliance reconciliation.`}
          amount={formatCurrency(depositAmount)}
          onClose={() => setShowCelebration(false)}
        />
      )}
    </div>
  );
};
