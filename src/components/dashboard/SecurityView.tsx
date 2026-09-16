import React, { useState } from 'react';
import { Shield, Lock, Smartphone, CheckCircle2, Key, History } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SecurityView: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [twoFactor, setTwoFactor] = useState(user?.twoFactorEnabled ?? true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [passChanged, setPassChanged] = useState(false);

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');

  const handleToggle2FA = () => {
    const next = !twoFactor;
    setTwoFactor(next);
    updateUser({ twoFactorEnabled: next });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass || !newPass) return;
    setPassChanged(true);
    setCurrentPass('');
    setNewPass('');
    setTimeout(() => setPassChanged(false), 3000);
  };

  const sessions = [
    { device: 'MacBook Pro (Chrome 124)', ip: '111.119.183.21', location: 'Islamabad, PK', active: true },
    { device: 'iPhone 15 Pro (Safari)', ip: '111.119.183.45', location: 'Islamabad, PK', active: false },
    { device: 'Windows PC (Edge)', ip: '39.40.12.98', location: 'Lahore, PK', active: false }
  ];

  return (
    <div className="space-y-6 max-w-3xl text-left animate-in fade-in duration-300">
      <div className="p-6 rounded-[18px] bg-[#131926] border border-white/10 text-white shadow-xl space-y-6">
        <div>
          <h2 className="font-heading text-2xl font-bold">Account Security & Protection</h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
            Configure multi-factor authentication, cryptographic passwords, and monitoring alerts
          </p>
        </div>

        {/* 2FA Toggle Card */}
        <div className="p-4 rounded-xl bg-[#0B0F17] border border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#10B981]/20 flex items-center justify-center text-[#10B981]">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">Two-Factor Authentication (2FA)</div>
              <div className="text-xs text-[#94A3B8]">
                Require SMS or Authenticator TOTP token upon sign-in and withdrawals
              </div>
            </div>
          </div>
          <button
            onClick={handleToggle2FA}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              twoFactor ? 'bg-[#10B981]' : 'bg-white/20'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                twoFactor ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Change Password Form */}
        <div className="p-4 rounded-xl bg-[#0B0F17] border border-white/10">
          <h3 className="font-bold text-sm text-white mb-1 flex items-center gap-2">
            <Key className="w-4 h-4 text-[#10B981]" /> Change Master Password
          </h3>
          <p className="text-xs text-[#94A3B8] mb-4">
            Use at least 8 characters including symbols and digits
          </p>

          {passChanged && (
            <div className="mb-4 p-3 rounded-lg bg-[#10B981]/20 border border-[#10B981]/40 text-[#34D399] text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Password updated successfully.</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Current Password</label>
              <input
                type="password"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-[10px] bg-white/5 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#10B981]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">New Password</label>
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-[10px] bg-white/5 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#10B981]"
                required
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-[10px] bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold transition-colors"
            >
              Update Password
            </button>
          </form>
        </div>

        {/* Active Sessions */}
        <div>
          <h3 className="font-bold text-sm text-white mb-2 flex items-center gap-2">
            <History className="w-4 h-4 text-[#10B981]" /> Active Login Sessions
          </h3>
          <div className="space-y-2">
            {sessions.map((s, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#0B0F17] border border-white/5 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-medium text-white flex items-center gap-2">
                    {s.device}
                    {s.active && (
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono bg-[#10B981]/20 text-[#34D399]">
                        Current Session
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] font-mono text-[#94A3B8]">
                    IP: {s.ip} • {s.location}
                  </div>
                </div>
                {!s.active && (
                  <button className="text-xs text-[#E5484D] hover:underline font-medium">Revoke</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
