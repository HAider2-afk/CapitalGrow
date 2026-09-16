import React from 'react';
import { LayoutDashboard, PieChart, ArrowDownToLine, ArrowUpFromLine, Menu } from 'lucide-react';
import { DashboardView } from '../../types';
import { useApp } from '../../context/AppContext';

interface MobileTabbarProps {
  onOpenMenu?: () => void;
}

export const MobileTabbar: React.FC<MobileTabbarProps> = ({ onOpenMenu }) => {
  const { currentView, setCurrentView, unreadNotificationCount, openTicketCount, pendingAdminTransactions } = useApp();

  const primaryTabs = [
    { id: 'overview' as DashboardView, label: 'Overview', icon: LayoutDashboard },
    { id: 'portfolio' as DashboardView, label: 'Portfolio', icon: PieChart },
    { id: 'deposit' as DashboardView, label: 'Deposit', icon: ArrowDownToLine },
    { id: 'withdraw' as DashboardView, label: 'Withdraw', icon: ArrowUpFromLine }
  ];

  const totalBadges = unreadNotificationCount + openTicketCount + (pendingAdminTransactions.length || 0);
  const isMoreActive = !primaryTabs.some((t) => t.id === currentView);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F17]/95 backdrop-blur-md border-t border-white/10 px-1 py-1.5 flex items-center justify-around text-[#94A3B8] safe-area-bottom">
      {primaryTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentView === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setCurrentView(tab.id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-1 px-1 rounded-lg text-[10px] font-medium transition-all ${
              isActive ? 'text-[#34D399]' : 'hover:text-white'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-[#34D399]' : 'text-[#94A3B8]'}`} />
            <span className="truncate">{tab.label}</span>
          </button>
        );
      })}

      {/* Menu / More Button */}
      <button
        onClick={onOpenMenu}
        className={`flex-1 flex flex-col items-center gap-0.5 py-1 px-1 rounded-lg text-[10px] font-medium transition-all ${
          isMoreActive ? 'text-[#34D399]' : 'hover:text-white'
        }`}
        aria-label="Open menu options"
      >
        <div className="relative">
          <Menu className={`w-5 h-5 ${isMoreActive ? 'text-[#34D399]' : 'text-[#94A3B8]'}`} />
          {totalBadges > 0 && (
            <span className="absolute -top-1 -right-1.5 min-w-3.5 h-3.5 px-0.5 rounded-full bg-[#E5484D] text-white text-[9px] font-mono font-bold flex items-center justify-center ring-2 ring-[#0B0F17]">
              {totalBadges > 9 ? '9+' : totalBadges}
            </span>
          )}
        </div>
        <span>Menu</span>
      </button>
    </nav>
  );
};
