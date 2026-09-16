import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileTabbar } from './MobileTabbar';
import { OverviewView } from './OverviewView';
import { PortfolioView } from './PortfolioView';
import { InvestmentsView } from './InvestmentsView';
import { TransactionsView } from './TransactionsView';
import { DepositView } from './DepositView';
import { WithdrawView } from './WithdrawView';
import { ReferralsView } from './ReferralsView';
import { NotificationsView } from './NotificationsView';
import { ProfileView } from './ProfileView';
import { SecurityView } from './SecurityView';
import { KycView } from './KycView';
import { AdminView } from './AdminView';
import { SupportView } from './SupportView';
import { useApp } from '../../context/AppContext';

interface DashboardLayoutProps {
  onExitToSite: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onExitToSite }) => {
  const { currentView, isDarkMode } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return <OverviewView />;
      case 'portfolio':
        return <PortfolioView />;
      case 'investments':
        return <InvestmentsView />;
      case 'transactions':
        return <TransactionsView />;
      case 'deposit':
        return <DepositView />;
      case 'withdraw':
        return <WithdrawView />;
      case 'referrals':
        return <ReferralsView />;
      case 'notifications':
        return <NotificationsView />;
      case 'profile':
        return <ProfileView />;
      case 'security':
        return <SecurityView />;
      case 'kyc':
        return <KycView />;
      case 'admin':
        return <AdminView />;
      case 'support':
        return <SupportView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div
      className={`min-h-screen flex ${
        isDarkMode ? 'bg-[#0B0F17] text-white' : 'bg-[#F8FAFC] text-[#0F172A]'
      }`}
    >
      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="hidden md:block">
        <Sidebar onExitToSite={onExitToSite} />
      </div>

      {/* Mobile Drawer (Backdrop + Slide-out Sidebar) */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in"
            onClick={() => setMobileSidebarOpen(false)}
          />
          {/* Sidebar Drawer */}
          <div className="relative w-72 max-w-[85vw] bg-[#0B0F17] h-full shadow-2xl z-10 flex flex-col animate-in slide-in-from-left duration-200">
            <Sidebar
              onExitToSite={onExitToSite}
              onClose={() => setMobileSidebarOpen(false)}
              isMobile={true}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <Topbar
          onExitToSite={onExitToSite}
          onOpenMobileMenu={() => setMobileSidebarOpen(true)}
        />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {renderView()}
        </main>

        {/* Mobile Tab Bar */}
        <MobileTabbar onOpenMenu={() => setMobileSidebarOpen(true)} />
      </div>
    </div>
  );
};
