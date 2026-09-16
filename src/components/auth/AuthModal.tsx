import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, Tag, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { authModalOpen, authModalTab, closeAuthModal, openAuthModal, login, register, loginAsDemo, isLoading } = useAuth();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('aisha.khan@example.com');
  const [loginPass, setLoginPass] = useState('capitalgrow2026');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regRef, setRegRef] = useState('CG-7XQ2');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!authModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!loginEmail || !loginPass) {
      setErrorMsg('Please enter both your email/phone and password.');
      return;
    }
    try {
      await login(loginEmail, loginPass);
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!regEmail || !regPass) {
      setErrorMsg('Please complete all required fields.');
      return;
    }
    try {
      await register(regName, regEmail, regPhone, regPass);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create account.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0F17]/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-[18px] p-5 sm:p-8 shadow-2xl border border-[#E2E8F0] text-left max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#475569] hover:text-[#131926] hover:bg-[#F8FAFC] transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab switchers */}
        <div className="flex border-b border-[#E2E8F0] mb-6">
          <button
            onClick={() => {
              setErrorMsg(null);
              openAuthModal('login');
            }}
            className={`flex-1 pb-3 text-sm font-semibold transition-colors relative ${
              authModalTab === 'login'
                ? 'text-[#10B981] border-b-2 border-[#10B981]'
                : 'text-[#475569] hover:text-[#131926]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setErrorMsg(null);
              openAuthModal('register');
            }}
            className={`flex-1 pb-3 text-sm font-semibold transition-colors relative ${
              authModalTab === 'register'
                ? 'text-[#10B981] border-b-2 border-[#10B981]'
                : 'text-[#475569] hover:text-[#131926]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Quick Demo Login Pill */}
        <div className="mb-5 p-3 rounded-xl bg-[#ECFDF5] border border-[#10B981]/25 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-[#10B981] font-medium">
            <Zap className="w-4 h-4 text-[#10B981]" />
            <span>Fast Reviewer Demo Mode:</span>
          </div>
          <button
            type="button"
            onClick={() => loginAsDemo('admin')}
            className="px-3 py-1 rounded-lg bg-[#10B981] text-white text-xs font-bold hover:bg-[#059669] transition-colors shadow-sm"
          >
            1-Click Demo Login
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-[#F8E4E2] border border-[#E5484D]/30 text-[#E5484D] rounded-lg text-xs">
            {errorMsg}
          </div>
        )}

        {authModalTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#131926] mb-1">
                Email Address or User ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#475569] absolute left-3 top-3" />
                <input
                  type="text"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="aisha.khan@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-[10px] border border-[#E2E8F0] text-sm text-[#131926] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-[#131926]">Password</label>
                <a href="#faq" className="text-xs font-semibold text-[#10B981] hover:underline">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#475569] absolute left-3 top-3" />
                <input
                  type="password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-[10px] border border-[#E2E8F0] text-sm text-[#131926] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded-[10px] bg-gradient-to-r from-[#131926] to-[#10B981] text-white font-semibold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#131926] mb-1">Full Legal Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#475569] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Tariq Mahmood"
                  className="w-full pl-9 pr-3 py-2 rounded-[10px] border border-[#E2E8F0] text-sm text-[#131926] focus:outline-none focus:border-[#10B981]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#131926] mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#475569] absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full pl-9 pr-3 py-2 rounded-[10px] border border-[#E2E8F0] text-sm text-[#131926] focus:outline-none focus:border-[#10B981]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#131926] mb-1">Mobile Phone (for OTP)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#475569] absolute left-3 top-2.5" />
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full pl-9 pr-3 py-2 rounded-[10px] border border-[#E2E8F0] text-sm text-[#131926] focus:outline-none focus:border-[#10B981]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#131926] mb-1">Create Secure Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#475569] absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={regPass}
                  onChange={(e) => setRegPass(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-9 pr-3 py-2 rounded-[10px] border border-[#E2E8F0] text-sm text-[#131926] focus:outline-none focus:border-[#10B981]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#131926] mb-1">
                Referral Code <span className="font-normal text-[#475569]">(Optional)</span>
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 text-[#475569] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={regRef}
                  onChange={(e) => setRegRef(e.target.value)}
                  placeholder="CG-7XQ2"
                  className="w-full pl-9 pr-3 py-2 rounded-[10px] border border-[#E2E8F0] text-sm text-[#131926] focus:outline-none focus:border-[#10B981]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-3 rounded-[10px] bg-gradient-to-r from-[#10B981] to-[#10B981] text-white font-semibold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? 'Creating Account...' : 'Open Investment Account'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Footer Security badge */}
        <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-center gap-1.5 text-xs text-[#475569]">
          <ShieldCheck className="w-4 h-4 text-[#10B981]" />
          <span>Protected with Firebase 256-bit Token Authentication</span>
        </div>
      </div>
    </div>
  );
};
