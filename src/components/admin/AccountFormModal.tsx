import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  Smartphone,
  Zap,
  Coins,
  CheckCircle2,
  Save,
  Plus
} from 'lucide-react';
import { AdminPaymentAccount } from '../../types';

interface AccountFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (accountData: Omit<AdminPaymentAccount, 'id' | 'updatedAt'>) => void;
  onUpdate?: (id: string, updates: Partial<AdminPaymentAccount>) => void;
  initialAccount?: AdminPaymentAccount | null;
}

export const AccountFormModal: React.FC<AccountFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  initialAccount
}) => {
  const [type, setType] = useState<'bank' | 'wallet' | 'raast' | 'crypto'>('bank');
  const [name, setName] = useState('');
  const [accountTitle, setAccountTitle] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [iban, setIban] = useState('');
  const [branchOrTill, setBranchOrTill] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isPrimary, setIsPrimary] = useState(false);
  const [currency, setCurrency] = useState('PKR');

  useEffect(() => {
    if (initialAccount) {
      setType(initialAccount.type);
      setName(initialAccount.name);
      setAccountTitle(initialAccount.accountTitle);
      setAccountNumber(initialAccount.accountNumber);
      setIban(initialAccount.iban || '');
      setBranchOrTill(initialAccount.branchOrTill || '');
      setInstructions(initialAccount.instructions || '');
      setIsActive(initialAccount.isActive);
      setIsPrimary(initialAccount.isPrimary || false);
      setCurrency(initialAccount.currency || 'PKR');
    } else {
      setType('bank');
      setName('');
      setAccountTitle('CapitalGrow Treasury Operations Ltd');
      setAccountNumber('');
      setIban('');
      setBranchOrTill('');
      setInstructions('Send screenshot of transfer receipt along with reference TID');
      setIsActive(true);
      setIsPrimary(false);
      setCurrency('PKR');
    }
  }, [initialAccount, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !accountTitle || !accountNumber) return;

    if (initialAccount && onUpdate) {
      onUpdate(initialAccount.id, {
        type,
        name,
        accountTitle,
        accountNumber,
        iban: iban || undefined,
        branchOrTill: branchOrTill || undefined,
        instructions: instructions || undefined,
        isActive,
        isPrimary,
        currency
      });
    } else {
      onSave({
        type,
        name,
        accountTitle,
        accountNumber,
        iban: iban || undefined,
        branchOrTill: branchOrTill || undefined,
        instructions: instructions || undefined,
        isActive,
        isPrimary,
        currency
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#131926] border border-white/15 rounded-[22px] max-w-xl w-full p-6 text-white text-left relative shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
              {initialAccount ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-white">
                {initialAccount ? 'Edit Payment Account' : 'Add Official Payment Account'}
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Configure bank account or wallet details shared with investors for deposits
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="py-4 space-y-4 overflow-y-auto flex-1 pr-1 text-xs">
          {/* Channel Type */}
          <div>
            <label className="block font-semibold text-white mb-2">Account Channel Type</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'bank', label: 'Bank Transfer', icon: Building2 },
                { id: 'wallet', label: 'Mobile Wallet', icon: Smartphone },
                { id: 'raast', label: 'Raast P2M', icon: Zap },
                { id: 'crypto', label: 'Crypto USDT', icon: Coins }
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = type === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setType(item.id as any)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-[#10B981]/25 border-[#10B981] text-white'
                        : 'bg-white/5 border-white/10 text-[#94A3B8] hover:bg-white/10'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mx-auto mb-1 ${isSelected ? 'text-[#10B981]' : 'text-[#94A3B8]'}`} />
                    <div className="font-semibold text-[11px] truncate">{item.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Provider / Bank Name */}
          <div>
            <label className="block font-semibold text-white mb-1">
              Bank or Service Provider Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Meezan Bank Ltd, Habib Bank Limited, JazzCash Merchant"
              className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F17] border border-white/15 text-white text-xs focus:outline-none focus:border-[#10B981]"
            />
          </div>

          {/* Account Title */}
          <div>
            <label className="block font-semibold text-white mb-1">
              Account Title (Beneficiary Name) *
            </label>
            <input
              type="text"
              required
              value={accountTitle}
              onChange={(e) => setAccountTitle(e.target.value)}
              placeholder="e.g. CapitalGrow Treasury Operations Ltd"
              className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F17] border border-white/15 text-white text-xs focus:outline-none focus:border-[#10B981]"
            />
          </div>

          {/* Account Number / Till */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-white mb-1">
                Account Number / Mobile / Till ID *
              </label>
              <input
                type="text"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="e.g. 0281-0104921092 or Till 00918231"
                className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F17] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-[#10B981]"
              />
            </div>
            <div>
              <label className="block font-semibold text-white mb-1">
                IBAN (Optional for Banks)
              </label>
              <input
                type="text"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                placeholder="e.g. PK42MEZN0002810104921092"
                className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F17] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-[#10B981]"
              />
            </div>
          </div>

          {/* Branch / Details */}
          <div>
            <label className="block font-semibold text-white mb-1">
              Branch Code / Routing / Category (Optional)
            </label>
            <input
              type="text"
              value={branchOrTill}
              onChange={(e) => setBranchOrTill(e.target.value)}
              placeholder="e.g. 0281 (Blue Area Branch, Islamabad) or Merchant Till"
              className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F17] border border-white/15 text-white text-xs focus:outline-none focus:border-[#10B981]"
            />
          </div>

          {/* Investor Instructions */}
          <div>
            <label className="block font-semibold text-white mb-1">
              Deposit Instructions Shown to Investors
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Add your user email in transfer remarks; upload slip screenshot"
              className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F17] border border-white/15 text-white text-xs focus:outline-none focus:border-[#10B981]"
            />
          </div>

          {/* Toggles */}
          <div className="pt-2 flex flex-wrap gap-4 border-t border-white/10">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-white/20 text-[#10B981] focus:ring-0"
              />
              <span className="font-semibold text-white">Active (Visible to users on deposit screen)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
                className="rounded border-white/20 text-[#10B981] focus:ring-0"
              />
              <span className="font-semibold text-white">Set as Primary Recommended Account</span>
            </label>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#10B981] to-[#10B981] text-white font-bold transition-all shadow-md hover:opacity-95 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              {initialAccount ? 'Save Account Changes' : 'Create Payment Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
