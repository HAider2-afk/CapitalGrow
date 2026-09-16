import React, { useState } from 'react';
import {
  ArrowLeftRight,
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TransactionsView: React.FC = () => {
  const { transactions, formatCurrency } = useApp();
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = transactions.filter((t) => {
    if (typeFilter !== 'All' && t.type !== typeFilter) return false;
    if (statusFilter !== 'All' && t.status !== statusFilter) return false;
    if (
      searchQuery &&
      !t.referenceId?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !t.method?.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const exportCSV = () => {
    const headers = 'ID,Type,Amount,Status,Method,Reference,Date\n';
    const rows = filtered
      .map(
        (t) =>
          `"${t.id}","${t.type}",${t.amount},"${t.status}","${t.method}","${t.referenceId || ''}","${t.date}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `capitalgrow_transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-left">
      <div className="p-6 rounded-[18px] bg-[#20204A] border border-white/10 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold">Transaction History & Ledger</h2>
          <p className="text-xs sm:text-sm text-[#89A0AF] mt-0.5">
            Immutable audit record of deposits, profit payouts, and redemptions
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-4 h-4 text-[#18C8B5]" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#20204A] border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#89A0AF] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by Reference ID or payment method..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0B1026] border border-white/10 text-xs text-white placeholder-[#5C7280] focus:outline-none focus:border-[#635BFF]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Type dropdown */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="flex-1 md:flex-initial px-3 py-2 rounded-lg bg-[#0B1026] border border-white/10 text-xs text-white focus:outline-none"
          >
            <option value="All">All Types</option>
            <option value="Deposit">Deposit</option>
            <option value="Withdrawal">Withdrawal</option>
            <option value="Investment">Investment</option>
            <option value="Return">Return / Profit</option>
          </select>

          {/* Status dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 md:flex-initial px-3 py-2 rounded-lg bg-[#0B1026] border border-white/10 text-xs text-white focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="p-8 rounded-[18px] bg-[#20204A] border border-white/10 text-center text-[#89A0AF] space-y-2">
          <ArrowLeftRight className="w-8 h-8 mx-auto text-[#4E6371]" />
          <div className="text-sm font-semibold text-white">No transactions found</div>
          <p className="text-xs">Try adjusting your search query or filter settings</p>
        </div>
      ) : (
        <>
          {/* Mobile Card Layout (visible on phones, hidden on md+) */}
          <div className="block md:hidden space-y-3">
            {filtered.map((t) => {
              const isDeposit = t.type === 'Deposit';
              const isWithdrawal = t.type === 'Withdrawal';
              return (
                <div
                  key={t.id}
                  className="p-4 rounded-[16px] bg-[#20204A] border border-white/10 text-white space-y-2.5 shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          isDeposit
                            ? 'bg-[#18C8B5]/20 text-[#18C8B5]'
                            : isWithdrawal
                            ? 'bg-[#F59E0B]/20 text-[#F59E0B]'
                            : 'bg-[#635BFF]/20 text-[#635BFF]'
                        }`}
                      >
                        {isDeposit ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : isWithdrawal ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowLeftRight className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white">{t.type}</div>
                        <div className="text-[10px] font-mono text-[#89A0AF]">{t.id}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-sm font-mono-num text-white">
                        {isDeposit ? '+' : isWithdrawal ? '-' : ''}
                        {formatCurrency(t.amount)}
                      </div>
                      <span
                        className={`inline-block px-1.5 py-0.2 rounded-full text-[9px] font-semibold ${
                          t.status === 'Approved'
                            ? 'bg-[#18C8B5]/20 text-[#8FE3B0]'
                            : t.status === 'Pending'
                            ? 'bg-[#F59E0B]/20 text-[#F59E0B]'
                            : 'bg-[#E5484D]/20 text-[#E5484D]'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-[#89A0AF]">
                    <span className="truncate max-w-[150px]">{t.method}</span>
                    <span className="font-mono text-[10px]">{t.date}</span>
                  </div>
                  {t.referenceId && (
                    <div className="text-[10px] font-mono text-[#667085] truncate">
                      Ref: {t.referenceId}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Desktop Ledger Table (hidden on mobile, visible on md+) */}
          <div className="hidden md:block p-6 rounded-[18px] bg-[#20204A] border border-white/10 text-white shadow-xl overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/10 text-[#89A0AF] text-[11px] uppercase font-mono tracking-wider">
                  <th className="pb-3 font-semibold">Transaction ID</th>
                  <th className="pb-3 font-semibold">Type</th>
                  <th className="pb-3 font-semibold">Channel / Method</th>
                  <th className="pb-3 font-semibold">Reference</th>
                  <th className="pb-3 font-semibold">Date & Time</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {filtered.map((t) => {
                  const isDeposit = t.type === 'Deposit';
                  const isWithdrawal = t.type === 'Withdrawal';
                  return (
                    <tr key={t.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 text-white font-bold">{t.id}</td>
                      <td className="py-3.5">
                        <span className="inline-flex items-center gap-1 text-white font-sans font-medium">
                          {isDeposit ? (
                            <ArrowDownLeft className="w-3.5 h-3.5 text-[#18C8B5]" />
                          ) : isWithdrawal ? (
                            <ArrowUpRight className="w-3.5 h-3.5 text-[#F59E0B]" />
                          ) : null}
                          {t.type}
                        </span>
                      </td>
                      <td className="py-3.5 text-[#89A0AF] font-sans">{t.method}</td>
                      <td className="py-3.5 text-[#89A0AF]">{t.referenceId || 'N/A'}</td>
                      <td className="py-3.5 text-[#89A0AF] font-sans text-xs">{t.date}</td>
                      <td className="py-3.5 font-bold text-white font-mono-num">
                        {isDeposit ? '+' : isWithdrawal ? '-' : ''}
                        {formatCurrency(t.amount)}
                      </td>
                      <td className="py-3.5 text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            t.status === 'Approved'
                              ? 'bg-[#18C8B5]/20 text-[#8FE3B0]'
                              : t.status === 'Pending'
                              ? 'bg-[#F59E0B]/20 text-[#F59E0B]'
                              : 'bg-[#E5484D]/20 text-[#E5484D]'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
