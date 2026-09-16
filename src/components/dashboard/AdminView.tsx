import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  FileCheck,
  Building2,
  Smartphone,
  Zap,
  Coins,
  Copy,
  Check,
  Plus,
  Edit3,
  Trash2,
  Share2,
  Eye,
  Filter,
  Search,
  Sparkles,
  UserCheck,
  MessageSquare,
  FileSpreadsheet,
  Headphones,
  Send,
  ExternalLink,
  Server,
  RefreshCw,
  Terminal,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { AdminPaymentAccount, Transaction, SupportTicket } from '../../types';
import { ShareAccountsModal } from '../admin/ShareAccountsModal';
import { ReceiptProofModal } from '../admin/ReceiptProofModal';
import { AccountFormModal } from '../admin/AccountFormModal';
import { RenderBackendModal } from '../admin/RenderBackendModal';

export const AdminView: React.FC = () => {
  const {
    adminStats,
    pendingAdminTransactions,
    paymentAccounts,
    addPaymentAccount,
    updatePaymentAccount,
    deletePaymentAccount,
    togglePaymentAccountStatus,
    setPrimaryPaymentAccount,
    approveTransaction,
    rejectTransaction,
    confirmAllPendingDeposits,
    auditLogs,
    formatCurrency,
    supportTickets,
    openTicketCount,
    replyToSupportTicket,
    updateTicketStatus
  } = useApp();
  const { user } = useAuth();

  // Active Tab: 'confirm_payments' | 'bank_accounts' | 'support_tickets' | 'audit_logs' | 'render_backend'
  const [activeTab, setActiveTab] = useState<'confirm_payments' | 'bank_accounts' | 'support_tickets' | 'audit_logs' | 'render_backend'>('confirm_payments');
  const [renderHealth, setRenderHealth] = useState<any>(null);
  const [renderLoading, setRenderLoading] = useState(false);
  const [renderLatency, setRenderLatency] = useState<number | null>(null);
  const [testEndpointUrl, setTestEndpointUrl] = useState('/api/health');
  const [testEndpointOutput, setTestEndpointOutput] = useState('');
  const [testEndpointLoading, setTestEndpointLoading] = useState(false);
  const [yamlCopied, setYamlCopied] = useState(false);

  // Support tickets admin state
  const [selectedAdminTicketId, setSelectedAdminTicketId] = useState<string | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');
  const [adminTicketFilter, setAdminTicketFilter] = useState<'all' | 'open' | 'resolved'>('all');

  // Filter in Confirm Payments tab
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'new_users' | 'deposits' | 'withdrawals'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AdminPaymentAccount | null>(null);
  const [selectedReceiptTxn, setSelectedReceiptTxn] = useState<Transaction | null>(null);

  // Reject state
  const [rejectTxnId, setRejectTxnId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Banking receipt does not match statement reconciliation.');

  // Notification / Copied state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionSuccessToast, setActionSuccessToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setActionSuccessToast(msg);
    setTimeout(() => setActionSuccessToast(null), 3500);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleApprove = (id: string) => {
    const txn = pendingAdminTransactions.find((t) => t.id === id);
    approveTransaction(id);
    showToast(`Confirmed payment for #${id} (${txn?.userName || 'User'}) — funds settled.`);
  };

  const handleOpenReject = (id: string) => {
    setRejectTxnId(id);
    setRejectReason('Banking receipt does not match statement reconciliation.');
  };

  const handleConfirmReject = () => {
    if (rejectTxnId) {
      rejectTransaction(rejectTxnId, rejectReason);
      showToast(`Rejected transaction #${rejectTxnId}.`);
      setRejectTxnId(null);
    }
  };

  // Filtered transactions
  const filteredTransactions = pendingAdminTransactions.filter((t) => {
    // Filter by type or new users
    if (paymentFilter === 'new_users' && !t.isNewUser) return false;
    if (paymentFilter === 'deposits' && t.type !== 'Deposit') return false;
    if (paymentFilter === 'withdrawals' && t.type !== 'Withdrawal') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = t.id.toLowerCase().includes(q);
      const matchName = (t.userName || '').toLowerCase().includes(q);
      const matchEmail = (t.userEmail || '').toLowerCase().includes(q);
      const matchRef = (t.referenceId || '').toLowerCase().includes(q);
      const matchMethod = t.method.toLowerCase().includes(q);
      return matchId || matchName || matchEmail || matchRef || matchMethod;
    }
    return true;
  });

  const newUserPendingCount = pendingAdminTransactions.filter((t) => t.isNewUser && t.type === 'Deposit').length;
  const totalPendingDepositAmount = pendingAdminTransactions
    .filter((t) => t.type === 'Deposit')
    .reduce((sum, t) => sum + t.amount, 0);

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

  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-left">
      {/* Toast Alert */}
      {actionSuccessToast && (
        <div className="fixed top-4 right-4 z-50 p-4 rounded-xl bg-[#10B981] text-[#0B0F17] font-bold text-xs shadow-2xl flex items-center gap-2 border border-white/20 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-4 h-4 text-[#0B0F17]" />
          <span>{actionSuccessToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 rounded-[20px] bg-gradient-to-r from-[#131926] via-[#0B0F17] to-[#0B0F17] border border-white/10 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-heading text-2xl font-bold">Administrative Financial Operations</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#10B981]/25 text-[#10B981] border border-[#10B981]/40 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Superadmin Portal
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Share official bank coordinates, reconcile receipts, and confirm new user activation deposits
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#10B981] to-[#10B981] hover:opacity-95 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" /> Share Bank Accounts
          </button>
        </div>
      </div>

      {/* 4 Admin KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: New User First Deposits Pending */}
        <div
          onClick={() => {
            setActiveTab('confirm_payments');
            setPaymentFilter('new_users');
          }}
          className="p-5 rounded-[18px] bg-gradient-to-br from-[#F59E0B] to-[#B45309] text-white shadow-lg cursor-pointer hover:scale-[1.01] transition-transform relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <div className="text-xs font-semibold text-white/90 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" /> New User Payments Pending
            </div>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-white/20 text-white uppercase">
              Priority
            </span>
          </div>
          <div className="font-heading text-3xl font-bold my-1 font-mono-num">
            {newUserPendingCount}
          </div>
          <div className="text-[10px] text-white/80">
            Awaiting first-time payment verification
          </div>
        </div>

        {/* Card 2: Total Queued Approvals */}
        <div
          onClick={() => {
            setActiveTab('confirm_payments');
            setPaymentFilter('all');
          }}
          className="p-5 rounded-[18px] bg-gradient-to-br from-[#10B981] to-[#047857] text-white shadow-lg cursor-pointer hover:scale-[1.01] transition-transform"
        >
          <div className="text-xs font-semibold text-white/90">Queued Transactions</div>
          <div className="font-heading text-3xl font-bold my-1 font-mono-num">
            {pendingAdminTransactions.length}
          </div>
          <div className="text-[10px] text-white/80 font-mono">
            {formatCurrency(totalPendingDepositAmount)} in pending deposits
          </div>
        </div>

        {/* Card 3: Active Shared Bank Accounts */}
        <div
          onClick={() => setActiveTab('bank_accounts')}
          className="p-5 rounded-[18px] bg-gradient-to-br from-[#10B981] to-[#0E9F6E] text-white shadow-lg cursor-pointer hover:scale-[1.01] transition-transform"
        >
          <div className="text-xs font-semibold text-white/90 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" /> Shared Bank Accounts
          </div>
          <div className="font-heading text-3xl font-bold my-1 font-mono-num">
            {paymentAccounts.filter((a) => a.isActive).length}
          </div>
          <div className="text-[10px] text-white/80">
            Active channels visible to investors
          </div>
        </div>

        {/* Card 4: Total Volume Settled */}
        <div className="p-5 rounded-[18px] bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] text-white shadow-lg">
          <div className="text-xs font-semibold text-white/90">Total Settled Deposits</div>
          <div className="font-heading text-2xl sm:text-3xl font-bold my-1 font-mono-num">
            {formatCurrency(adminStats.totalDeposits)}
          </div>
          <div className="text-[10px] text-white/80">Treasury audited volume</div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-white/10 gap-2 sm:gap-6 text-xs sm:text-sm font-semibold overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('confirm_payments')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'confirm_payments'
              ? 'border-[#10B981] text-[#10B981]'
              : 'border-transparent text-[#94A3B8] hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Confirm User Payments</span>
          {pendingAdminTransactions.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#E5484D] text-white font-bold">
              {pendingAdminTransactions.length}
            </span>
          )}
          {newUserPendingCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              {newUserPendingCount} New
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('bank_accounts')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'bank_accounts'
              ? 'border-[#10B981] text-[#10B981]'
              : 'border-transparent text-[#94A3B8] hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Share & Manage Bank Accounts ({paymentAccounts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('support_tickets')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'support_tickets'
              ? 'border-[#10B981] text-[#10B981]'
              : 'border-transparent text-[#94A3B8] hover:text-white'
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>Support Desk ({supportTickets.length})</span>
          {openTicketCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#10B981] text-white font-bold">
              {openTicketCount} Open
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('audit_logs')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'audit_logs'
              ? 'border-[#10B981] text-[#10B981]'
              : 'border-transparent text-[#94A3B8] hover:text-white'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Audit & Ledger Logs ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('render_backend');
            // Auto fetch health when opening tab
            if (!renderHealth && !renderLoading) {
              setRenderLoading(true);
              const start = performance.now();
              fetch('/api/health')
                .then((r) => r.json())
                .then((data) => {
                  setRenderLatency(Math.round(performance.now() - start));
                  setRenderHealth(data);
                })
                .catch(() => setRenderHealth({ status: 'offline' }))
                .finally(() => setRenderLoading(false));
            }
          }}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'render_backend'
              ? 'border-[#10B981] text-[#10B981] font-semibold'
              : 'border-transparent text-[#94A3B8] hover:text-white'
          }`}
        >
          <Server className="w-4 h-4 text-[#10B981]" />
          <span>Render Backend</span>
          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
            Node / Express
          </span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: CONFIRM USER PAYMENTS & NEW USER VERIFICATION */}
      {/* ======================================================== */}
      {activeTab === 'confirm_payments' && (
        <div className="space-y-4">
          {/* Action Toolbar */}
          <div className="p-4 rounded-[18px] bg-[#131926] border border-white/10 text-white shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setPaymentFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  paymentFilter === 'all'
                    ? 'bg-[#10B981] text-white shadow'
                    : 'bg-white/5 text-[#94A3B8] hover:bg-white/10 hover:text-white'
                }`}
              >
                All Pending ({pendingAdminTransactions.length})
              </button>

              <button
                onClick={() => setPaymentFilter('new_users')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  paymentFilter === 'new_users'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow'
                    : 'bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>🌟 New Users Only ({newUserPendingCount})</span>
              </button>

              <button
                onClick={() => setPaymentFilter('deposits')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  paymentFilter === 'deposits'
                    ? 'bg-[#10B981] text-[#0B0F17] shadow'
                    : 'bg-white/5 text-[#94A3B8] hover:bg-white/10 hover:text-white'
                }`}
              >
                Deposits Only ({pendingAdminTransactions.filter((t) => t.type === 'Deposit').length})
              </button>

              <button
                onClick={() => setPaymentFilter('withdrawals')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  paymentFilter === 'withdrawals'
                    ? 'bg-[#8B5CF6] text-white shadow'
                    : 'bg-white/5 text-[#94A3B8] hover:bg-white/10 hover:text-white'
                }`}
              >
                Withdrawals Only ({pendingAdminTransactions.filter((t) => t.type === 'Withdrawal').length})
              </button>
            </div>

            {/* Search & Batch Confirm */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 md:w-56">
                <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search user, TID, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#0B0F17] border border-white/15 text-xs text-white focus:outline-none focus:border-[#10B981]"
                />
              </div>

              {pendingAdminTransactions.some((t) => t.type === 'Deposit') && (
                <button
                  onClick={() => {
                    confirmAllPendingDeposits();
                    showToast('Confirmed all pending deposits!');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#10B981]/20 hover:bg-[#10B981]/30 text-[#34D399] border border-[#10B981]/40 text-xs font-bold transition-all shrink-0 flex items-center gap-1.5"
                  title="Confirm all verified deposits"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Batch Confirm ({pendingAdminTransactions.filter((t) => t.type === 'Deposit').length})
                </button>
              )}
            </div>
          </div>

          {/* Queued Transaction Cards / Table */}
          <div className="p-6 rounded-[18px] bg-[#131926] border border-white/10 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading text-lg font-bold">Pending Payment Confirmation Queue</h3>
                <p className="text-xs text-[#94A3B8]">
                  Inspect submitted receipt vouchers, confirm payment receipts against banking portal, and credit balances
                </p>
              </div>
            </div>

            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12 space-y-2 bg-[#0B0F17] rounded-xl border border-white/5">
                <CheckCircle2 className="w-10 h-10 text-[#10B981] mx-auto" />
                <div className="font-bold text-white text-base">No Matching Transactions</div>
                <p className="text-xs text-[#94A3B8]">
                  {paymentFilter === 'new_users'
                    ? 'All new user deposit requests have been successfully confirmed!'
                    : 'All settlement transactions are reconciled.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTransactions.map((t) => {
                  const isDeposit = t.type === 'Deposit';
                  return (
                    <div
                      key={t.id}
                      className={`p-4 rounded-xl border transition-all ${
                        t.isNewUser
                          ? 'bg-[#1A1838] border-amber-500/40 shadow-md ring-1 ring-amber-500/20'
                          : 'bg-[#0B0F17] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Left: User info & New User badge */}
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                              isDeposit
                                ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
                                : 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30'
                            }`}
                          >
                            {isDeposit ? (
                              <ArrowDownLeft className="w-5 h-5" />
                            ) : (
                              <ArrowUpRight className="w-5 h-5" />
                            )}
                          </div>

                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-bold text-sm text-white">{t.userName || 'Investor'}</span>
                              <span className="text-xs text-[#94A3B8] font-mono">({t.userEmail || 'N/A'})</span>
                              {t.isNewUser && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-amber-400" /> New User (1st Deposit)
                                </span>
                              )}
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                                  t.userKycStatus === 'verified'
                                    ? 'bg-[#10B981]/20 text-[#34D399]'
                                    : 'bg-[#F59E0B]/20 text-[#F59E0B]'
                                }`}
                              >
                                KYC {t.userKycStatus || 'Pending'}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#94A3B8]">
                              <span>Txn ID: <strong className="text-white font-mono">{t.id}</strong></span>
                              <span>Target: <strong className="text-white">{t.depositAccount || t.method}</strong></span>
                              <span>Date: <strong className="font-mono text-white/80">{t.date}</strong></span>
                            </div>

                            {/* Reference and Note */}
                            <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                              <span className="font-mono text-white/90 bg-white/5 px-2 py-0.5 rounded border border-white/10 flex items-center gap-1">
                                TID: <strong className="text-[#34D399]">{t.referenceId || 'N/A'}</strong>
                                {t.referenceId && (
                                  <button
                                    onClick={() => copyToClipboard(t.referenceId || '', t.id + '-ref')}
                                    className="text-[#10B981] hover:text-white ml-1"
                                    title="Copy TID"
                                  >
                                    {copiedId === t.id + '-ref' ? (
                                      <Check className="w-3 h-3 text-[#10B981]" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                )}
                              </span>

                              {t.receiptNote && (
                                <span className="text-[#94A3B8] italic truncate max-w-xs">
                                  "{t.receiptNote}"
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Center: Amount */}
                        <div className="lg:text-right px-3 py-2 bg-white/5 lg:bg-transparent rounded-xl border border-white/5 lg:border-none">
                          <div className="text-[10px] font-mono text-[#94A3B8] uppercase">
                            Amount to Credit
                          </div>
                          <div className="text-xl font-bold font-mono text-[#10B981]">
                            {formatCurrency(t.amount)}
                          </div>
                          <div className="text-[10px] text-[#94A3B8]">{t.method}</div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          {t.receiptUrl && (
                            <button
                              onClick={() => setSelectedReceiptTxn(t)}
                              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all flex items-center gap-1.5 border border-white/10"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#10B981]" /> View Slip Proof
                            </button>
                          )}

                          <button
                            onClick={() => handleApprove(t.id)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#10B981] to-[#0E9F6E] hover:opacity-95 text-[#0B0F17] text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Confirm Payment
                          </button>

                          <button
                            onClick={() => handleOpenReject(t.id)}
                            className="px-3 py-2 rounded-xl bg-[#E5484D]/20 hover:bg-[#E5484D]/30 text-[#E5484D] border border-[#E5484D]/30 text-xs font-bold transition-all flex items-center gap-1.5"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: SHARE & MANAGE OFFICIAL BANK ACCOUNTS */}
      {/* ======================================================== */}
      {activeTab === 'bank_accounts' && (
        <div className="space-y-4">
          {/* Top Bar for Bank Accounts */}
          <div className="p-4 rounded-[18px] bg-[#131926] border border-white/10 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-heading text-lg font-bold">Official Depository Accounts</h3>
              <p className="text-xs text-[#94A3B8]">
                These verified accounts are displayed directly on investor deposit pages and shared via WhatsApp/SMS
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5 text-[#10B981]" /> Format & Share
              </button>

              <button
                onClick={() => {
                  setEditingAccount(null);
                  setIsAccountModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#10B981] to-[#10B981] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add New Account
              </button>
            </div>
          </div>

          {/* Accounts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paymentAccounts.map((account) => {
              const Icon = getAccountIcon(account.type);
              return (
                <div
                  key={account.id}
                  className={`p-5 rounded-[18px] border transition-all flex flex-col justify-between relative ${
                    account.isActive
                      ? 'bg-[#131926] border-white/10 shadow-lg'
                      : 'bg-[#15172E] border-white/5 opacity-70'
                  }`}
                >
                  <div>
                    {/* Top Row: Icon + Type + Badges */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-2.5 rounded-xl ${
                            account.isActive
                              ? 'bg-[#10B981]/25 text-[#10B981] border border-[#10B981]/40'
                              : 'bg-white/5 text-[#94A3B8]'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-white">{account.name}</div>
                          <div className="text-[10px] text-[#94A3B8] uppercase font-mono tracking-wider">
                            {account.type}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {account.isPrimary && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                            Primary
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                            account.isActive
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {account.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                    </div>

                    {/* Account Details Box */}
                    <div className="p-3.5 rounded-xl bg-[#0B0F17] border border-white/10 space-y-2 text-xs font-mono mb-3">
                      <div>
                        <div className="text-[10px] text-[#94A3B8] font-sans">Account Title:</div>
                        <div className="text-white font-sans font-semibold truncate">
                          {account.accountTitle}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-[#94A3B8] font-sans flex items-center justify-between">
                          <span>Account / Till No:</span>
                          <button
                            onClick={() => copyToClipboard(account.accountNumber, account.id + '-no')}
                            className="text-[#10B981] hover:text-white text-[10px] font-mono flex items-center gap-1"
                          >
                            {copiedId === account.id + '-no' ? (
                              <span className="text-[#10B981]">Copied!</span>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" /> Copy
                              </>
                            )}
                          </button>
                        </div>
                        <div className="text-[#34D399] font-bold text-sm tracking-wide">
                          {account.accountNumber}
                        </div>
                      </div>

                      {account.iban && (
                        <div>
                          <div className="text-[10px] text-[#94A3B8] font-sans flex items-center justify-between">
                            <span>IBAN:</span>
                            <button
                              onClick={() => copyToClipboard(account.iban || '', account.id + '-iban')}
                              className="text-[#10B981] hover:text-white text-[10px] font-mono flex items-center gap-1"
                            >
                              {copiedId === account.id + '-iban' ? (
                                <span className="text-[#10B981]">Copied!</span>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" /> Copy
                                </>
                              )}
                            </button>
                          </div>
                          <div className="text-white font-mono text-[11px] truncate">
                            {account.iban}
                          </div>
                        </div>
                      )}

                      {account.branchOrTill && (
                        <div>
                          <div className="text-[10px] text-[#94A3B8] font-sans">Branch / Routing:</div>
                          <div className="text-white/80 text-[11px] font-sans truncate">
                            {account.branchOrTill}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Instructions Note */}
                    {account.instructions && (
                      <p className="text-[11px] text-[#94A3B8] italic line-clamp-2 mb-3">
                        "{account.instructions}"
                      </p>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-1 text-xs">
                    {/* Toggle Active / Inactive */}
                    <button
                      onClick={() => togglePaymentAccountStatus(account.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-colors ${
                        account.isActive
                          ? 'bg-white/5 border-white/10 text-[#94A3B8] hover:text-rose-300'
                          : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25'
                      }`}
                    >
                      {account.isActive ? 'Deactivate' : 'Activate'}
                    </button>

                    <div className="flex items-center gap-1">
                      {!account.isPrimary && (
                        <button
                          onClick={() => setPrimaryPaymentAccount(account.id)}
                          className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] text-[#94A3B8] hover:text-white"
                          title="Set as primary account for deposits"
                        >
                          Make Primary
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setEditingAccount(account);
                          setIsAccountModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                        title="Edit Account Details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Remove account ${account.name} (${account.accountNumber})?`)) {
                            deletePaymentAccount(account.id);
                            showToast(`Deleted ${account.name}`);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-rose-400 transition-colors"
                        title="Delete Account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Institutional Note */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-[#94A3B8] flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#10B981] shrink-0" />
            <span>
              <strong>Real-Time Synchronization:</strong> When you add or toggle an account here, it updates instantly in the investor deposit interface. Investors are only shown accounts with the <strong className="text-white">Active</strong> status.
            </span>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: AUDIT & LEDGER LOGS */}
      {/* ======================================================== */}
      {activeTab === 'audit_logs' && (
        <div className="p-6 rounded-[18px] bg-[#131926] border border-white/10 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading text-lg font-bold">Administrative Audit Ledger</h3>
              <p className="text-xs text-[#94A3B8]">
                Tamper-evident log of payment approvals, account edits, and compliance rejections
              </p>
            </div>
            <span className="text-xs font-mono text-[#34D399]">
              {auditLogs.length} events logged
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-[#94A3B8] text-[11px] uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Timestamp</th>
                  <th className="pb-3 font-semibold">Type</th>
                  <th className="pb-3 font-semibold">Admin / Operator</th>
                  <th className="pb-3 font-semibold">Action & Target</th>
                  <th className="pb-3 font-semibold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 text-[#94A3B8]">{log.timestamp}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          log.type === 'approval'
                            ? 'bg-[#10B981]/20 text-[#34D399]'
                            : log.type === 'rejection'
                            ? 'bg-[#E5484D]/20 text-[#E5484D]'
                            : log.type === 'account_update'
                            ? 'bg-[#10B981]/20 text-[#10B981]'
                            : 'bg-white/10 text-white'
                        }`}
                      >
                        {log.type}
                      </span>
                    </td>
                    <td className="py-3 text-[#94A3B8] font-sans">{log.admin}</td>
                    <td className="py-3 text-white font-sans">{log.action}</td>
                    <td className="py-3 text-right text-[#94A3B8] font-sans">
                      {log.details || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: SUPPORT DESK & INQUIRY TICKETS MODERATION */}
      {/* ======================================================== */}
      {activeTab === 'support_tickets' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Tickets List */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#94A3B8]">Filter:</span>
                  {(['all', 'open', 'resolved'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setAdminTicketFilter(filter)}
                      className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors ${
                        adminTicketFilter === filter
                          ? 'bg-white/15 text-white'
                          : 'text-[#94A3B8] hover:text-white'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <span className="text-xs font-mono text-[#34D399]">
                  {supportTickets.filter((t) => t.status !== 'resolved').length} open inquiries
                </span>
              </div>

              <div className="space-y-3">
                {supportTickets
                  .filter((t) => {
                    if (adminTicketFilter === 'open') return t.status !== 'resolved';
                    if (adminTicketFilter === 'resolved') return t.status === 'resolved';
                    return true;
                  })
                  .map((ticket) => {
                    const isSelected = selectedAdminTicketId === ticket.id;
                    const lastMsg = ticket.messages[ticket.messages.length - 1];
                    return (
                      <div
                        key={ticket.id}
                        onClick={() => setSelectedAdminTicketId(ticket.id)}
                        className={`p-4 rounded-[16px] border transition-all cursor-pointer text-left space-y-2.5 ${
                          isSelected
                            ? 'bg-[#131926] border-[#10B981] shadow-lg shadow-[#10B981]/10'
                            : 'bg-[#131926]/60 border-white/10 hover:border-white/20 hover:bg-[#131926]/80'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-white">
                                #{ticket.id}
                              </span>
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-medium ${
                                  ticket.status === 'resolved'
                                    ? 'bg-[#10B981]/20 text-[#34D399]'
                                    : 'bg-[#F59E0B]/20 text-[#F59E0B]'
                                }`}
                              >
                                {ticket.status.replace('_', ' ')}
                              </span>
                              <span
                                className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase ${
                                  ticket.priority === 'urgent'
                                    ? 'bg-[#E5484D]/20 text-[#E5484D]'
                                    : ticket.priority === 'high'
                                    ? 'bg-[#F59E0B]/20 text-[#F59E0B]'
                                    : 'bg-[#10B981]/20 text-[#9C92FF]'
                                }`}
                              >
                                {ticket.priority}
                              </span>
                            </div>
                            <h4 className="text-sm font-semibold text-white mt-1 line-clamp-1">
                              {ticket.subject}
                            </h4>
                          </div>
                          <span className="text-[10px] font-mono text-[#94A3B8] shrink-0">
                            {ticket.updatedAt}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                          <span className="text-white font-medium">{ticket.userName}</span>
                          <span>•</span>
                          <span className="font-mono text-[11px] truncate max-w-[140px]">{ticket.userEmail}</span>
                        </div>

                        {ticket.transactionRef && (
                          <div className="text-[11px] font-mono text-[#34D399] bg-[#10B981]/10 px-2 py-0.5 rounded inline-block">
                            Txn: {ticket.transactionRef}
                          </div>
                        )}

                        <p className="text-xs text-[#94A3B8] line-clamp-2">
                          <strong className="text-white/80">{lastMsg?.senderName}:</strong> {lastMsg?.text}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Right: Selected Ticket Chat & Response Desk */}
            <div className="lg:col-span-7">
              {(() => {
                const active = supportTickets.find((t) => t.id === selectedAdminTicketId) || supportTickets[0];
                if (!active) {
                  return (
                    <div className="p-8 rounded-[18px] bg-[#131926]/60 border border-white/10 text-center text-[#94A3B8]">
                      No inquiries found.
                    </div>
                  );
                }

                return (
                  <div className="rounded-[18px] bg-[#131926] border border-white/10 flex flex-col h-[600px] text-white shadow-xl overflow-hidden">
                    {/* Top Bar */}
                    <div className="p-4 border-b border-white/10 flex items-center justify-between gap-3 bg-[#0F172A]/60">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-[#34D399]">
                            #{active.id}
                          </span>
                          <span className="text-xs text-[#94A3B8] capitalize">
                            • {active.category.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-[#94A3B8]">
                            • By <strong className="text-white">{active.userName}</strong> ({active.userEmail})
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1 mt-0.5">
                          {active.subject}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {active.status !== 'resolved' ? (
                          <button
                            onClick={() => {
                              updateTicketStatus(active.id, 'resolved');
                              showToast(`Ticket #${active.id} resolved.`);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#10B981]/20 hover:bg-[#10B981]/30 text-[#34D399] border border-[#10B981]/30 text-xs font-medium transition-colors flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Resolve</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              updateTicketStatus(active.id, 'open');
                              showToast(`Ticket #${active.id} reopened.`);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
                          >
                            Reopen
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Messages Scroll Area */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0B0F17]/40">
                      {active.messages.map((msg) => {
                        const isDesk = msg.sender === 'agent';
                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${isDesk ? 'items-end' : 'items-start'} space-y-1`}
                          >
                            <div className="flex items-center gap-2 px-1 text-[11px] text-[#94A3B8]">
                              <span className="font-semibold text-white/90">{msg.senderName}</span>
                              <span>•</span>
                              <span className="font-mono text-[10px]">{msg.timestamp}</span>
                            </div>
                            <div
                              className={`p-3 rounded-[14px] text-xs max-w-lg leading-relaxed shadow-md ${
                                isDesk
                                  ? 'bg-[#10B981] text-white rounded-tr-none'
                                  : 'bg-[#131926] border border-white/10 text-white/90 rounded-tl-none'
                              }`}
                            >
                              {msg.text}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Quick Admin Action Chips */}
                    <div className="px-4 py-2 bg-[#0F172A]/60 border-t border-white/10 flex items-center gap-2 overflow-x-auto text-[11px]">
                      <span className="text-[#94A3B8] shrink-0">Admin macros:</span>
                      <button
                        onClick={() =>
                          setAdminReplyText('Your bank deposit slip has been reconciled and approved into your portfolio.')
                        }
                        className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-[#34D399] shrink-0 border border-white/5 transition-colors"
                      >
                        Payment Approved
                      </button>
                      <button
                        onClick={() =>
                          setAdminReplyText('Please provide a clear transaction receipt or bank SMS showing the 6-digit reference number.')
                        }
                        className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-[#F59E0B] shrink-0 border border-white/5 transition-colors"
                      >
                        Request Slip
                      </button>
                      <button
                        onClick={() =>
                          setAdminReplyText('Your withdrawal request is currently with banking clearing and will disburse in 1-2 hours.')
                        }
                        className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-white/80 shrink-0 border border-white/5 transition-colors"
                      >
                        Withdrawal Clearing
                      </button>
                    </div>

                    {/* Admin Reply Form */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!adminReplyText.trim()) return;
                        replyToSupportTicket(
                          active.id,
                          adminReplyText.trim(),
                          'agent',
                          user?.fullName ? `${user.fullName} (Admin)` : 'Treasury Desk Officer'
                        );
                        setAdminReplyText('');
                        showToast(`Reply sent on Ticket #${active.id}`);
                      }}
                      className="p-3 bg-[#0F172A] border-t border-white/10 flex items-center gap-2"
                    >
                      <input
                        type="text"
                        value={adminReplyText}
                        onChange={(e) => setAdminReplyText(e.target.value)}
                        placeholder="Write official administrative response..."
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#10B981]"
                      />
                      <button
                        type="submit"
                        disabled={!adminReplyText.trim()}
                        className="px-4 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#15b2a1] text-[#0B0F17] text-xs sm:text-sm font-bold transition-colors disabled:opacity-40 flex items-center gap-1.5 shadow-md"
                      >
                        <span>Send Response</span>
                        <Send className="w-3.5 h-3.5 text-[#0B0F17]" />
                      </button>
                    </form>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: RENDER BACKEND INFRASTRUCTURE & BLUEPRINT */}
      {/* ======================================================== */}
      {activeTab === 'render_backend' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="p-6 rounded-[20px] bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0B0F17] border border-white/10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#10B981] via-[#8B5CF6] to-[#10B981] flex items-center justify-center text-white shadow-lg shadow-[#10B981]/30 shrink-0">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-lg font-bold text-white">
                    Render Web Service Backend
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Production Ready
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8] mt-0.5 max-w-xl">
                  Full-stack Express + Node runtime configured for zero-downtime deployment on Render.com with dynamic port resolution and health check probes.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch md:self-auto">
              <button
                onClick={() => {
                  setRenderLoading(true);
                  const start = performance.now();
                  fetch('/api/health')
                    .then((r) => r.json())
                    .then((data) => {
                      setRenderLatency(Math.round(performance.now() - start));
                      setRenderHealth(data);
                      showToast('Backend health probe succeeded');
                    })
                    .catch((err) => {
                      setRenderHealth({ status: 'offline', error: err?.message });
                      showToast('Backend connection check failed');
                    })
                    .finally(() => setRenderLoading(false));
                }}
                disabled={renderLoading}
                className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-white/10"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${renderLoading ? 'animate-spin' : ''}`} />
                <span>Test /api/health</span>
              </button>

              <a
                href="https://dashboard.render.com"
                target="_blank"
                rel="noreferrer"
                className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-lg"
              >
                <span>Render Console</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-[16px] bg-[#131926] border border-white/10 space-y-1">
              <div className="text-[10px] uppercase font-mono text-[#94A3B8]">Backend Provider</div>
              <div className="font-heading text-lg font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Render / Node</span>
              </div>
              <div className="text-[10px] text-emerald-400 font-mono">
                {renderLatency ? `Ping: ${renderLatency}ms` : 'Ready to probe'}
              </div>
            </div>

            <div className="p-4 rounded-[16px] bg-[#131926] border border-white/10 space-y-1">
              <div className="text-[10px] uppercase font-mono text-[#94A3B8]">Render Blueprint</div>
              <div className="font-heading text-lg font-bold text-white font-mono">
                render.yaml
              </div>
              <div className="text-[10px] text-[#94A3B8]">Infrastructure-as-code</div>
            </div>

            <div className="p-4 rounded-[16px] bg-[#131926] border border-white/10 space-y-1">
              <div className="text-[10px] uppercase font-mono text-[#94A3B8]">Health Endpoint</div>
              <div className="font-heading text-base font-bold text-emerald-400 font-mono truncate">
                /api/health
              </div>
              <div className="text-[10px] text-[#94A3B8]">Zero-downtime monitor</div>
            </div>

            <div className="p-4 rounded-[16px] bg-[#131926] border border-white/10 space-y-1">
              <div className="text-[10px] uppercase font-mono text-[#94A3B8]">Build Command</div>
              <div className="font-heading text-sm font-bold text-white font-mono truncate">
                npm run build
              </div>
              <div className="text-[10px] text-[#94A3B8]">esbuild to dist/server.cjs</div>
            </div>
          </div>

          {/* Interactive API Tester & Blueprint Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: API Tester */}
            <div className="lg:col-span-6 p-5 rounded-[18px] bg-[#131926] border border-white/10 text-white space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#10B981]" />
                  <span className="font-bold text-sm">Live Express API Probes</span>
                </div>
                <span className="text-[11px] font-mono text-[#94A3B8]">
                  Port: 0.0.0.0:3000 / 10000
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Health Check', path: '/api/health' },
                  { label: 'System Metrics', path: '/api/system-status' },
                  { label: 'Market Rates', path: '/api/market-rates' }
                ].map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      setTestEndpointUrl(item.path);
                      setTestEndpointLoading(true);
                      fetch(item.path)
                        .then((r) => r.text())
                        .then((t) => {
                          try {
                            setTestEndpointOutput(JSON.stringify(JSON.parse(t), null, 2));
                          } catch {
                            setTestEndpointOutput(t);
                          }
                        })
                        .catch((err) => setTestEndpointOutput(`Error: ${err?.message}`))
                        .finally(() => setTestEndpointLoading(false));
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      testEndpointUrl === item.path
                        ? 'bg-[#10B981] text-[#0B0F17] font-bold'
                        : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                    }`}
                  >
                    GET {item.path}
                  </button>
                ))}
              </div>

              <div className="relative">
                {testEndpointLoading ? (
                  <div className="p-8 rounded-xl bg-black/40 border border-white/10 text-center text-xs text-[#94A3B8] flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-[#10B981]" /> Executing API request...
                  </div>
                ) : testEndpointOutput ? (
                  <pre className="p-4 rounded-xl bg-black/60 border border-white/10 font-mono text-[11px] text-emerald-300 max-h-72 overflow-y-auto leading-relaxed">
                    {testEndpointOutput}
                  </pre>
                ) : (
                  <div className="p-6 rounded-xl bg-black/30 border border-white/10 text-center text-xs text-[#94A3B8]">
                    Click any endpoint button above to test the live server response.
                  </div>
                )}
              </div>
            </div>

            {/* Right: render.yaml Blueprint */}
            <div className="lg:col-span-6 p-5 rounded-[18px] bg-[#131926] border border-white/10 text-white space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#8B5CF6]" />
                  <span className="font-bold text-sm">render.yaml Blueprint</span>
                </div>
                <button
                  onClick={() => {
                    const yamlText = `# Render Blueprint Specification (render.yaml)
services:
  - type: web
    name: capitalgrow-backend
    runtime: node
    plan: starter
    region: oregon
    buildCommand: npm install && npm run build
    startCommand: npm run start
    healthCheckPath: /api/health
    autoDeploy: true
    envVars:
      - key: NODE_ENV
        value: production
      - key: GEMINI_API_KEY
        sync: false
      - key: APP_URL
        sync: false
      - key: PORT
        value: 10000`;
                    navigator.clipboard.writeText(yamlText);
                    setYamlCopied(true);
                    showToast('Copied render.yaml blueprint to clipboard!');
                    setTimeout(() => setYamlCopied(false), 2000);
                  }}
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 transition-colors text-white"
                >
                  {yamlCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Blueprint</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-black/60 border border-white/10 font-mono text-[11px] text-[#34D399] max-h-72 overflow-y-auto leading-relaxed">
{`services:
  - type: web
    name: capitalgrow-backend
    runtime: node
    plan: starter
    region: oregon
    buildCommand: npm install && npm run build
    startCommand: npm run start
    healthCheckPath: /api/health
    autoDeploy: true
    envVars:
      - key: NODE_ENV
        value: production
      - key: GEMINI_API_KEY
        sync: false
      - key: APP_URL
        sync: false
      - key: PORT
        value: 10000`}
              </pre>

              <div className="p-3 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-xs text-[#94A3B8]">
                <strong className="text-white block mb-1">To deploy this on Render:</strong>
                Push your Git repository to GitHub or GitLab, go to Render &gt; New &gt; Blueprint, select your repo, and Render will automatically provision the Node web service using this configuration.
              </div>
            </div>
          </div>
        </div>
      )}
      {rejectTxnId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#131926] border border-white/15 rounded-[20px] max-w-md w-full p-6 text-white text-left relative shadow-2xl space-y-4">
            <div>
              <h4 className="font-heading text-lg font-bold text-white mb-1">
                Decline Transaction #{rejectTxnId}
              </h4>
              <p className="text-xs text-[#94A3B8]">
                Select or provide the verification reason. The investor will receive an automated notification.
              </p>
            </div>

            {/* Quick Reason Presets */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-white/90">
                Common Rejection Reasons:
              </label>
              {[
                'Banking receipt does not match statement reconciliation.',
                'Invalid or duplicate Transaction Reference ID (TID).',
                'Transferred amount does not match the claimed deposit figure.',
                'Unverified third-party account; KYC mismatch.'
              ].map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setRejectReason(reason)}
                  className={`w-full text-left p-2 rounded-lg text-xs border transition-colors ${
                    rejectReason === reason
                      ? 'bg-[#E5484D]/25 border-[#E5484D] text-white'
                      : 'bg-white/5 border-white/10 text-[#94A3B8] hover:bg-white/10'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-white/90 mb-1">
                Custom Rejection Remarks:
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#0B0F17] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#E5484D]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => setRejectTxnId(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/20"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-[#E5484D] text-white text-xs font-bold hover:bg-[#D93D42] shadow-lg flex items-center gap-1"
              >
                <XCircle className="w-4 h-4" /> Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Bank Accounts Modal */}
      <ShareAccountsModal
        accounts={paymentAccounts}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Receipt Proof Modal */}
      <ReceiptProofModal
        transaction={selectedReceiptTxn}
        isOpen={!!selectedReceiptTxn}
        onClose={() => setSelectedReceiptTxn(null)}
        onApprove={handleApprove}
        onOpenReject={handleOpenReject}
        formatCurrency={formatCurrency}
      />

      {/* Account Add / Edit Modal */}
      <AccountFormModal
        isOpen={isAccountModalOpen}
        onClose={() => {
          setIsAccountModalOpen(false);
          setEditingAccount(null);
        }}
        onSave={(data) => {
          addPaymentAccount(data);
          showToast(`Added payment account: ${data.name}`);
        }}
        onUpdate={(id, updates) => {
          updatePaymentAccount(id, updates);
          showToast(`Updated payment account`);
        }}
        initialAccount={editingAccount}
      />
    </div>
  );
};
