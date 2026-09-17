import React, { useState } from 'react';
import {
  Building2,
  Smartphone,
  CheckCircle2,
  Copy,
  UploadCloud,
  Zap,
  Coins,
  ShieldCheck,
  Check,
  ArrowDownToLine,
  Plus,
  Edit3
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { AdminPaymentAccount } from '../../types';
import { AccountFormModal } from '../admin/AccountFormModal';

interface DepositViewProps {
  onSuccess?: () => void;
}

export const DepositView: React.FC<DepositViewProps> = ({ onSuccess }) => {
  const { addDeposit, formatCurrency, paymentAccounts, addPaymentAccount, updatePaymentAccount } = useApp();
  const { user } = useAuth();
  const isAdmin =
    user?.role === 'admin' ||
    user?.email?.toLowerCase() === 'axe.de12@gmail.com' ||
    user?.email?.toLowerCase() === 'admin@capitalgrow.investments';

  const activeAccounts = paymentAccounts.filter((a) => a.isActive);
  const defaultAccount = activeAccounts.find((a) => a.isPrimary) || activeAccounts[0];

  const [depositAmount, setDepositAmount] = useState<number>(25000);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(defaultAccount?.id || 'acc-1');
  const [referenceId, setReferenceId] = useState<string>('');
  const [depositNote, setDepositNote] = useState<string>('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Live account management modal state
  const [isAccountModalOpen, setIsAccountModalOpen] = useState<boolean>(false);
  const [accountToEdit, setAccountToEdit] = useState<AdminPaymentAccount | null>(null);

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

    const ref = referenceId.trim() || `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
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
      `Deposit request for ${formatCurrency(depositAmount)} via ${accName} submitted! Reference ${ref} has been queued for settlement.`
    );
    setReferenceId('');
    setDepositNote('');
    setFileName(null);
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-left">
      <div className="bg-[#131926] rounded-2xl border border-white/10 p-6 sm:p-8 shadow-xl text-white space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ArrowDownToLine className="w-4 h-4" />
              </div>
              <h3 className="font-heading text-xl font-bold text-white">Deposit Capital</h3>
            </div>
            <p className="text-xs text-slate-400">
              Transfer funds to our verified bank account or digital wallet and submit proof for automated crediting
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" /> Escrow Protected
          </span>
        </div>

        {/* Success Alert Banner (Single-Screen Inline Feedback) */}
        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-start gap-3 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-white block">Deposit Successfully Recorded!</span>
              <p className="text-slate-300">{successMsg}</p>
              <p className="text-[11px] text-emerald-400">
                You can monitor verification status below in the transaction ledger.
              </p>
            </div>
          </div>
        )}

        {/* Step 1: Account / Method Selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-200">
              1. Select Official Depository Account
            </label>
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  setAccountToEdit(null);
                  setIsAccountModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 text-[11px] font-semibold transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Upload / Add Account Live
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {activeAccounts.map((account) => {
              const Icon = getAccountIcon(account.type);
              const isSelected = selectedAccount?.id === account.id;
              return (
                <button
                  key={account.id}
                  type="button"
                  onClick={() => setSelectedAccountId(account.id)}
                  className={`p-3 rounded-xl text-left border transition-all relative cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-500/40'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span className="font-bold text-xs truncate">{account.name}</span>
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400 truncate">
                    {account.type.toUpperCase()}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Coordinates details box */}
        {selectedAccount && (
          <div className="p-4 rounded-xl bg-[#0B0F17] border border-white/10 space-y-2.5 text-xs font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-emerald-400 font-semibold text-[11px]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Transfer Coordinates: {selectedAccount.name}
              </span>
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setAccountToEdit(selectedAccount);
                      setIsAccountModalOpen(true);
                    }}
                    className="text-[10px] text-slate-300 hover:text-emerald-300 flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/15 transition-colors cursor-pointer"
                    title="Edit account details live"
                  >
                    <Edit3 className="w-3 h-3 text-emerald-400" /> Edit Details Live
                  </button>
                )}
                {copiedField && (
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Copied {copiedField}!
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2 text-slate-300">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Account Title:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-white font-medium">{selectedAccount.accountTitle}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(selectedAccount.accountTitle, 'Title')}
                    className="p-1 hover:bg-white/10 rounded text-emerald-400 transition-colors"
                    title="Copy Account Title"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Account / Till Number:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-white font-bold tracking-wider">{selectedAccount.accountNumber}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(selectedAccount.accountNumber, 'Account Number')}
                    className="p-1 hover:bg-white/10 rounded text-emerald-400 transition-colors"
                    title="Copy Account Number"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {selectedAccount.iban && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">IBAN:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white font-mono text-[11px]">{selectedAccount.iban}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(selectedAccount.iban || '', 'IBAN')}
                      className="p-1 hover:bg-white/10 rounded text-emerald-400 transition-colors"
                      title="Copy IBAN"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              {selectedAccount.instructions && (
                <div className="pt-2 border-t border-white/5 text-[11px] text-amber-300/90">
                  Note: {selectedAccount.instructions}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Deposit Submission Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5">
              2. Deposit Amount (Rs.)
            </label>
            <input
              type="number"
              min={500}
              max={5000000}
              step={100}
              value={depositAmount}
              onChange={(e) => setDepositAmount(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
              required
            />
            {/* Quick Amount Chips */}
            <div className="flex flex-wrap gap-2 mt-2">
              {[5000, 10000, 25000, 50000, 100000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setDepositAmount(amt)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                    depositAmount === amt
                      ? 'bg-emerald-500 text-slate-900 font-bold'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                  }`}
                >
                  +{formatCurrency(amt)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                3. Bank TID / Reference Number
              </label>
              <input
                type="text"
                placeholder="e.g. MEEZ-984210 or 2409160012"
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                required
              />
              <p className="text-[10px] text-slate-400 mt-1">Found in your bank app confirmation or SMS</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                4. Transfer Remarks (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Aisha Khan Meezan Mobile"
                value={depositNote}
                onChange={(e) => setDepositNote(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">Sender name or originating bank</p>
            </div>
          </div>

          {/* Receipt Attachment Box */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5">
              5. Transfer Receipt / Screenshot
            </label>
            <div
              onClick={() => setFileName('slip_' + Math.floor(1000 + Math.random() * 9000) + '.png')}
              className="border border-dashed border-white/20 hover:border-emerald-500 rounded-xl p-3.5 text-center cursor-pointer transition-colors bg-white/5"
            >
              <UploadCloud className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <div className="text-xs text-slate-200 font-medium">
                {fileName ? (
                  <span className="text-emerald-400 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Attached: {fileName}
                  </span>
                ) : (
                  'Click to attach screenshot or transfer slip (PNG, JPG, PDF)'
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
          >
            Submit Deposit Request ({formatCurrency(depositAmount)})
          </button>
        </form>
      </div>

      {/* Live Account Upload / Edit Modal (Admin Only) */}
      {isAdmin && (
        <AccountFormModal
          isOpen={isAccountModalOpen}
          onClose={() => {
            setIsAccountModalOpen(false);
            setAccountToEdit(null);
          }}
          onSave={(data) => {
            addPaymentAccount(data);
            setIsAccountModalOpen(false);
            setSuccessMsg(`New depository channel "${data.name}" added and published live!`);
          }}
          onUpdate={(id, updates) => {
            updatePaymentAccount(id, updates);
            setIsAccountModalOpen(false);
            setAccountToEdit(null);
            setSuccessMsg(`Account coordinates updated and synced live!`);
          }}
          initialAccount={accountToEdit}
        />
      )}
    </div>
  );
};
