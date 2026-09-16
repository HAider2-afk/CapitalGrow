import React, { useState } from 'react';
import { User, Mail, Phone, Globe, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ProfileView: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || 'Aisha Khan');
  const [email, setEmail] = useState(user?.email || 'aisha.khan@example.com');
  const [phone, setPhone] = useState(user?.phone || '+92 300 1234567');
  const [country, setCountry] = useState(user?.country || 'Pakistan');
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ fullName, email, phone, country });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl text-left animate-in fade-in duration-300">
      <div className="p-6 rounded-[18px] bg-[#131926] border border-white/10 text-white shadow-xl">
        <h2 className="font-heading text-2xl font-bold">Investor Profile & Verification</h2>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
          Manage your legal account credentials and personal correspondence data
        </p>

        {savedMsg && (
          <div className="mt-4 p-3 rounded-xl bg-[#10B981]/20 border border-[#10B981]/40 text-[#34D399] text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile settings saved successfully.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white mb-1.5">Full Legal Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-[10px] bg-[#0B0F17] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#10B981]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-[10px] bg-[#0B0F17] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#10B981]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-[10px] bg-[#0B0F17] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#10B981]"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white mb-1.5">Country of Residence</label>
            <div className="relative">
              <Globe className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-[10px] bg-[#0B0F17] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#10B981]"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-[10px] bg-gradient-to-r from-[#10B981] to-[#10B981] text-white text-xs font-semibold hover:shadow-lg transition-all"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
