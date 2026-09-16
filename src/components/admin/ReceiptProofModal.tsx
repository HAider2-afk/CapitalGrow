import React from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ShieldAlert,
  Building2,
  Calendar,
  CreditCard,
  User,
  Sparkles,
  FileCheck2,
  ArrowDownLeft
} from 'lucide-react';
import { Transaction } from '../../types';

interface ReceiptProofModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onOpenReject: (id: string) => void;
  formatCurrency: (amount: number) => string;
}

export const ReceiptProofModal: React.FC<ReceiptProofModalProps> = ({
  transaction,
  isOpen,
  onClose,
  onApprove,
  onOpenReject,
  formatCurrency
}) => {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#131926] border border-white/15 rounded-[22px] max-w-3xl w-full p-6 text-white text-left relative shadow-2xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-heading text-xl font-bold text-white">
                Payment Verification Proof
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                #{transaction.id}
              </span>
              {transaction.isNewUser && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> New User (First Deposit)
                </span>
              )}
            </div>
            <p className="text-xs text-[#94A3B8]">
              Review attached bank transfer voucher against banking statement prior to crediting investor balance
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-4 overflow-y-auto flex-1 pr-1 space-y-5">
          {/* User & Transaction Detail Strip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Investor Card */}
            <div className="p-4 rounded-xl bg-[#0B0F17] border border-white/10 space-y-2">
              <div className="text-[11px] font-semibold text-[#34D399] uppercase font-mono tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#10B981]" /> Investor Profile
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#94A3B8]">Full Name:</span>
                <span className="font-bold text-white">{transaction.userName || 'Investor'}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#94A3B8]">Email:</span>
                <span className="font-mono text-white/90">{transaction.userEmail || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#94A3B8]">Investor Status:</span>
                <span
                  className={`font-semibold ${
                    transaction.isNewUser ? 'text-amber-300' : 'text-[#34D399]'
                  }`}
                >
                  {transaction.isNewUser ? '🌟 New User (Pending Activation)' : 'Active Investor'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#94A3B8]">KYC Status:</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    transaction.userKycStatus === 'verified'
                      ? 'bg-[#10B981]/20 text-[#34D399]'
                      : 'bg-[#F59E0B]/20 text-[#F59E0B]'
                  }`}
                >
                  {transaction.userKycStatus || 'Pending'}
                </span>
              </div>
            </div>

            {/* Deposit Coordinates Card */}
            <div className="p-4 rounded-xl bg-[#0B0F17] border border-white/10 space-y-2">
              <div className="text-[11px] font-semibold text-[#34D399] uppercase font-mono tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#10B981]" /> Claimed Settlement Details
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#94A3B8]">Amount Claimed:</span>
                <span className="font-mono font-bold text-base text-[#10B981]">
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#94A3B8]">Target Account:</span>
                <span className="font-medium text-white text-right truncate max-w-[180px]">
                  {transaction.depositAccount || transaction.method}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#94A3B8]">Reference / TID:</span>
                <span className="font-mono font-bold text-white bg-white/10 px-1.5 py-0.5 rounded">
                  {transaction.referenceId || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#94A3B8]">Submission Date:</span>
                <span className="text-[#94A3B8] font-mono">{transaction.date}</span>
              </div>
            </div>
          </div>

          {/* Depositor Remarks / Note */}
          {transaction.receiptNote && (
            <div className="p-3.5 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 text-xs">
              <span className="font-bold text-white block mb-1">💬 Investor Remarks / Transfer Note:</span>
              <p className="text-white/80 font-sans italic">"{transaction.receiptNote}"</p>
            </div>
          )}

          {/* Visual Receipt Slip Container */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-[#10B981]" /> Attached Payment Voucher / Bank Slip
              </span>
              {transaction.receiptUrl && (
                <a
                  href={transaction.receiptUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-[#10B981] hover:text-[#34D399] flex items-center gap-1 font-semibold"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open Full Image
                </a>
              )}
            </div>

            <div className="rounded-xl border border-white/15 overflow-hidden bg-[#0B0F17] relative flex flex-col items-center justify-center p-3 min-h-[260px]">
              {transaction.receiptUrl ? (
                <div className="space-y-3 w-full text-center">
                  <img
                    src={transaction.receiptUrl}
                    alt="Bank Deposit Proof"
                    className="max-h-72 w-auto mx-auto object-contain rounded-lg border border-white/10 shadow-lg"
                  />
                  <div className="text-[11px] text-[#94A3B8] font-mono">
                    Electronic Transfer Receipt — Reference: {transaction.referenceId}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-[#94A3B8] space-y-2">
                  <ShieldAlert className="w-8 h-8 mx-auto text-[#F59E0B]" />
                  <p className="text-xs">No screenshot attached by user.</p>
                  <p className="text-[11px]">Verify via bank portal using TID: {transaction.referenceId}</p>
                </div>
              )}
            </div>
          </div>

          {/* Compliance Checklist Box */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs space-y-2">
            <div className="font-bold text-white flex items-center gap-1.5 text-xs">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Admin Verification Checklist
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-[#94A3B8]">
              <div className="flex items-center gap-1.5">
                <span className="text-[#10B981]">✓</span> TID matches bank transaction
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#10B981]">✓</span> Amount credited in statement
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#10B981]">✓</span> Sender identity reconciled
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white text-xs font-semibold transition-colors"
          >
            Close
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenReject(transaction.id);
              }}
              className="px-4 py-2 rounded-xl bg-[#E5484D]/20 hover:bg-[#E5484D]/30 text-[#E5484D] border border-[#E5484D]/30 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <XCircle className="w-4 h-4" /> Reject Payment
            </button>
            <button
              onClick={() => {
                onApprove(transaction.id);
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#10B981] to-[#0E9F6E] text-[#0B0F17] hover:opacity-95 text-xs font-bold transition-all shadow-lg flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Confirm & Credit Payment ({formatCurrency(transaction.amount)})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
