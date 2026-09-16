import React, { useState } from 'react';
import {
  Bell,
  Moon,
  Sun,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  User,
  Sliders,
  LogOut,
  Headphones,
  Database,
  Menu,
  Server
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { RenderBackendModal } from '../admin/RenderBackendModal';

interface TopbarProps {
  onExitToSite: () => void;
  onOpenMobileMenu?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onExitToSite, onOpenMobileMenu }) => {
  const {
    currentView,
    setCurrentView,
    isDarkMode,
    setIsDarkMode,
    currency,
    setCurrency,
    unreadNotificationCount,
    notifications,
    firestoreSyncStatus,
    firestoreDatabaseId
  } = useApp();
  const { user, updateUser, logout } = useAuth();
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showRenderModal, setShowRenderModal] = useState(false);

  const getInitials = (name?: string) => {
    if (!name) return 'AK';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const toggleRole = () => {
    if (!user) return;
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    updateUser({ role: newRole });
  };

  return (
    <header className="h-16 px-3 sm:px-6 lg:px-8 border-b border-white/10 flex items-center justify-between bg-[#0B1026] text-white z-30 sticky top-0">
      {/* Title & View indicator */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 -ml-1 rounded-lg text-[#89A0AF] hover:text-white hover:bg-white/10 transition-colors shrink-0"
            aria-label="Open mobile navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h1 className="font-heading text-base sm:text-xl font-bold capitalize text-white tracking-tight truncate">
          {currentView === 'kyc' ? 'KYC Identity Verification' : currentView.replace('-', ' ')}
        </h1>
        {user?.role === 'admin' && (
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#635BFF]/20 text-[#635BFF] border border-[#635BFF]/30 shrink-0">
            <Sliders className="w-3 h-3" /> Admin Mode
          </span>
        )}
        <div
          className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono border transition-colors shrink-0"
          title={`Firestore Database: ${firestoreDatabaseId}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              firestoreSyncStatus === 'synced'
                ? 'bg-emerald-400 animate-pulse'
                : firestoreSyncStatus === 'connecting'
                ? 'bg-amber-400 animate-ping'
                : 'bg-[#89A0AF]'
            }`}
          />
          <Database className="w-3 h-3" />
          <span className="hidden lg:inline">
            {firestoreSyncStatus === 'synced' ? 'Firestore Live' : firestoreSyncStatus === 'connecting' ? 'Connecting DB...' : 'Firestore Ready'}
          </span>
        </div>

        {/* Render Backend Infrastructure status button */}
        <button
          onClick={() => setShowRenderModal(true)}
          className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors shrink-0"
          title="Render Backend Infrastructure & Blueprint"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <Server className="w-3 h-3" />
          <span>Render Backend</span>
        </button>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Currency Switcher */}
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="bg-white/5 border border-white/10 text-white rounded-lg px-2 py-1 text-xs font-mono font-medium focus:outline-none focus:border-[#635BFF]"
          title="Change display currency"
        >
          <option value="Rs." className="bg-[#0B1026]">PKR (Rs.)</option>
          <option value="$" className="bg-[#0B1026]">USD ($)</option>
          <option value="€" className="bg-[#0B1026]">EUR (€)</option>
          <option value="£" className="bg-[#0B1026]">GBP (£)</option>
        </select>

        {/* Dark Mode toggle button */}
        <button
          onClick={() => setIsDarkMode((prev) => !prev)}
          className="p-1.5 sm:p-2 rounded-lg bg-white/5 border border-white/10 text-[#89A0AF] hover:text-white hover:bg-white/10 transition-colors"
          title={isDarkMode ? 'Switch to Light dashboard' : 'Switch to Dark aesthetic'}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-[#F59E0B]" /> : <Moon className="w-4 h-4 text-[#635BFF]" />}
        </button>

        {/* Customer Support Desk quick button (hidden on extra small screens) */}
        <button
          onClick={() => setCurrentView('support')}
          className={`hidden sm:flex p-2 rounded-lg border transition-colors relative ${
            currentView === 'support'
              ? 'bg-[#635BFF] text-white border-[#635BFF]'
              : 'bg-white/5 border-white/10 text-[#89A0AF] hover:text-white hover:bg-white/10'
          }`}
          title="Customer Support & Help Desk"
        >
          <Headphones className="w-4 h-4" />
        </button>

        {/* Notifications Dropdown trigger */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="p-1.5 sm:p-2 rounded-lg bg-white/5 border border-white/10 text-[#89A0AF] hover:text-white hover:bg-white/10 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#E5484D] ring-2 ring-[#0B1026]" />
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-[#20204A] border border-white/15 rounded-xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
                <span className="font-semibold text-white font-heading">Recent Notifications</span>
                <button
                  onClick={() => {
                    setCurrentView('notifications');
                    setShowNotifMenu(false);
                  }}
                  className="text-[#635BFF] hover:underline"
                >
                  View all
                </button>
              </div>
              <div className="divide-y divide-white/5 max-h-64 overflow-y-auto py-1">
                {notifications.slice(0, 4).map((n) => (
                  <div key={n.id} className="py-2 text-xs space-y-0.5 text-left">
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          n.type === 'success'
                            ? 'bg-[#18C8B5]'
                            : n.type === 'warning'
                            ? 'bg-[#F59E0B]'
                            : n.type === 'danger'
                            ? 'bg-[#E5484D]'
                            : 'bg-[#635BFF]'
                        }`}
                      />
                      {n.title}
                    </div>
                    <div className="text-[11px] text-[#89A0AF] line-clamp-1">{n.description}</div>
                    <div className="text-[10px] font-mono text-[#5C7280]">{n.timestamp}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Role switch helper badge */}
        <button
          onClick={toggleRole}
          className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono bg-white/5 border border-white/10 text-[#89A0AF] hover:text-white transition-colors"
          title="Click to toggle between Admin and User preview mode"
        >
          <span>Role: <strong className="text-white capitalize">{user?.role || 'User'}</strong></span>
          <span className="text-[10px] text-[#635BFF]">↺</span>
        </button>

        {/* User Chip */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#635BFF] to-[#18C8B5] text-white flex items-center justify-center font-bold text-xs font-mono shadow-sm">
              {getInitials(user?.fullName)}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-white leading-tight">
                {user?.fullName || 'Aisha Khan'}
              </div>
              <div className="text-[10px] font-mono text-[#8FE3B0] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#18C8B5]" /> Verified
              </div>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-[#20204A] border border-white/15 rounded-xl shadow-2xl p-2 z-50 text-xs">
              <div className="px-3 py-2 border-b border-white/10">
                <div className="font-semibold text-white">{user?.fullName}</div>
                <div className="text-[11px] text-[#89A0AF] truncate">{user?.email}</div>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setCurrentView('profile');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-[#89A0AF] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  My Profile
                </button>
                <button
                  onClick={() => {
                    setCurrentView('security');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-[#89A0AF] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  Security Settings
                </button>
                <button
                  onClick={() => {
                    setCurrentView('admin');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-[#89A0AF] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  Admin Governance
                </button>
                <button
                  onClick={() => {
                    onExitToSite();
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-[#18C8B5] hover:bg-white/5 rounded-lg transition-colors"
                >
                  Return to Marketing Site
                </button>
              </div>
              <div className="pt-1 border-t border-white/10">
                <button
                  onClick={() => logout()}
                  className="w-full text-left px-3 py-1.5 text-[#E5484D] hover:bg-[#E5484D]/10 rounded-lg transition-colors font-medium flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Render Backend Infrastructure Modal */}
      <RenderBackendModal
        isOpen={showRenderModal}
        onClose={() => setShowRenderModal(false)}
      />
    </header>
  );
};
