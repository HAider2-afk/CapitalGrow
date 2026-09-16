import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Share2,
  Building2,
  Smartphone,
  Zap,
  Coins,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import { AdminPaymentAccount } from '../../types';

interface ShareAccountsModalProps {
  accounts: AdminPaymentAccount[];
  isOpen: boolean;
  onClose: () => void;
}

export const ShareAccountsModal: React.FC<ShareAccountsModalProps> = ({
  accounts,
  isOpen,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>(() =>
    accounts.filter((a) => a.isActive).map((a) => a.id)
  );

  if (!isOpen) return null;

  const activeAccounts = accounts.filter((a) =>
    selectedAccountIds.includes(a.id)
  );

  const generateShareText = () => {
    let text = `🏦 *CAPITALGROW OFFICIAL DEPOSIT COORDINATES* 🏦\n\n`;
    text += `Dear Investor, please use our verified official treasury accounts for depositing funds into your CapitalGrow investment account:\n\n`;

    activeAccounts.forEach((acc, index) => {
      text += `━━━━━━━━━━━━━━━━━━━━━\n`;
      text += `📍 *Option ${index + 1}: ${acc.name.toUpperCase()}*\n`;
      text += `• Account Title: *${acc.accountTitle}*\n`;
      text += `• Account Number: *${acc.accountNumber}*\n`;
      if (acc.iban) {
        text += `• IBAN: *${acc.iban}*\n`;
      }
      if (acc.branchOrTill) {
        text += `• Branch / Till: ${acc.branchOrTill}\n`;
      }
      if (acc.instructions) {
        text += `• Note: ${acc.instructions}\n`;
      }
      text += `\n`;
    });

    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `⚠️ *IMPORTANT DEPOSIT INSTRUCTIONS:*\n`;
    text += `1. After transferring, take a screenshot or download the official PDF receipt.\n`;
    text += `2. Login to your CapitalGrow portal > Deposit Funds > Enter Reference / TID and attach the slip.\n`;
    text += `3. Our automated compliance desk reconciles and credits funds within 15–30 minutes.\n`;
    text += `4. Never transfer funds to any personal account not listed here.\n\n`;
    text += `🌐 Portal: https://capitalgrow.investments\n`;
    text += `📞 Treasury Desk WhatsApp: +92 300 1234567`;

    return text;
  };

  const handleCopy = () => {
    const text = generateShareText();
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const toggleAccount = (id: string) => {
    setSelectedAccountIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#131926] border border-white/15 rounded-[20px] max-w-2xl w-full p-6 text-white text-left relative shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-white">
                Share Bank & Wallet Accounts
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Format and copy official bank coordinates for WhatsApp, SMS, or email to new investors
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

        {/* Content */}
        <div className="py-4 space-y-4 overflow-y-auto flex-1 pr-1 font-sans">
          {/* Select which accounts to include */}
          <div>
            <label className="block text-xs font-semibold text-white mb-2">
              Include Accounts in Share Message:
            </label>
            <div className="flex flex-wrap gap-2">
              {accounts.map((acc) => {
                const isChecked = selectedAccountIds.includes(acc.id);
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => toggleAccount(acc.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                      isChecked
                        ? 'bg-[#10B981]/25 border-[#10B981] text-white shadow-sm'
                        : 'bg-white/5 border-white/10 text-[#94A3B8] hover:bg-white/10'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isChecked ? 'bg-[#10B981]' : 'bg-white/20'
                      }`}
                    />
                    <span>{acc.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Formatted Message Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-[#34D399] flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" /> Formatted Message Preview
              </span>
              <span className="text-[10px] text-[#94A3B8]">
                Ready for WhatsApp / SMS pasting
              </span>
            </div>
            <div className="bg-[#0B0F17] border border-white/10 rounded-xl p-4 text-xs font-mono text-[#E2E8F0] whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto selection:bg-[#10B981] selection:text-white">
              {generateShareText()}
            </div>
          </div>

          {/* Security stamp */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-[#94A3B8] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
            <span>
              All accounts shared carry institutional escrow verification and are monitored by the CapitalGrow finance desk.
            </span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
          <div className="text-xs text-[#94A3B8]">
            {activeAccounts.length} accounts selected
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 ${
                copied
                  ? 'bg-[#10B981] text-[#0B0F17]'
                  : 'bg-gradient-to-r from-[#10B981] to-[#10B981] text-white hover:opacity-95'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" /> Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copy Shareable Text
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
