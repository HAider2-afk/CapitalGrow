import React from 'react';
import {
  LayoutDashboard,
  PieChart,
  Layers,
  ArrowLeftRight,
  ArrowDownToLine,
  ArrowUpFromLine,
  Gift,
  Bell,
  User,
  Shield,
  FileCheck2,
  Sliders,
  LogOut,
  TrendingUp,
  Globe,
  Headphones,
  X
} from 'lucide-react';
import { DashboardView } from '../../types';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  onExitToSite: () => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ onExitToSite, onClose, isMobile }) => {
  const { currentView, setCurrentView, unreadNotificationCount, pendingAdminTransactions, openTicketCount } = useApp();
  const { user, logout } = useAuth();

  const navItems = [
    {
      section: 'Main',
      items: [
        { id: 'overview' as DashboardView, label: 'Overview', icon: LayoutDashboard },
        { id: 'portfolio' as DashboardView, label: 'My Portfolio', icon: PieChart },
        { id: 'investments' as DashboardView, label: 'Investments', icon: Layers },
        { id: 'transactions' as DashboardView, label: 'Transactions', icon: ArrowLeftRight }
      ]
    },
    {
      section: 'Funds',
      items: [
        { id: 'deposit' as DashboardView, label: 'Deposit', icon: ArrowDownToLine },
        { id: 'withdraw' as DashboardView, label: 'Withdraw', icon: ArrowUpFromLine }
      ]
    },
    {
      section: 'Account & Security',
      items: [
        { id: 'referrals' as DashboardView, label: 'Referrals', icon: Gift },
        {
          id: 'notifications' as DashboardView,
          label: 'Notifications',
          icon: Bell,
          badge: unreadNotificationCount > 0 ? unreadNotificationCount : undefined
        },
        {
          id: 'support' as DashboardView,
          label: 'Customer Support',
          icon: Headphones,
          badge: openTicketCount > 0 ? openTicketCount : undefined
        },
        { id: 'profile' as DashboardView, label: 'Profile', icon: User },
        { id: 'security' as DashboardView, label: 'Security', icon: Shield },
        {
          id: 'kyc' as DashboardView,
          label: 'KYC Verification',
          icon: FileCheck2,
          status: user?.kycStatus
        }
      ]
    },
    {
      section: 'Management',
      items: [
        {
          id: 'admin' as DashboardView,
          label: 'Admin Panel',
          icon: Sliders,
          badge: pendingAdminTransactions.length > 0 ? pendingAdminTransactions.length : undefined
        }
      ]
    }
  ];

  return (
    <aside className="w-64 shrink-0 bg-[#0B0F17] border-r border-white/10 flex flex-col h-full md:h-screen sticky top-0 text-[#94A3B8] select-none">
      {/* Brand logo */}
      <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="font-heading text-xl font-bold tracking-tight text-white">
            Capital<span className="text-emerald-400">Grow</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/80">
            v2.4
          </span>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close sidebar menu"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation items scrollable list */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navItems.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <div className="px-3 text-[11px] font-mono uppercase tracking-wider text-[#64748B] font-semibold">
              {group.section}
            </div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    onClose?.();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[10px] text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#10B981] to-[#047857] text-white shadow-md shadow-[#10B981]/25 font-semibold'
                      : 'text-[#94A3B8] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#94A3B8]'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-full bg-[#E5484D] text-white">
                      {item.badge}
                    </span>
                  )}

                  {item.status && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-medium capitalize ${
                        item.status === 'verified'
                          ? 'bg-[#10B981]/20 text-[#34D399]'
                          : item.status === 'pending'
                          ? 'bg-[#F59E0B]/20 text-[#F59E0B]'
                          : 'bg-[#E5484D]/20 text-[#E5484D]'
                      }`}
                    >
                      {item.status}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* User profile snippet & Exit buttons */}
      <div className="p-3 border-t border-white/10 space-y-2 bg-[#0B0F17]">
        <button
          onClick={() => {
            onExitToSite();
            onClose?.();
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-[10px] text-xs text-[#94A3B8] hover:text-white hover:bg-white/5 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#10B981]" />
            <span>Public Website</span>
          </span>
          <span className="font-mono text-[11px] text-[#64748B]">← Back</span>
        </button>

        <button
          onClick={() => {
            logout();
            onClose?.();
          }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-[10px] text-xs text-[#E5484D] hover:bg-[#E5484D]/10 transition-colors font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
