import React from 'react';
import { TrendingUp, ShieldAlert, Lock, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-[#0B0F17] text-[#94A3B8] pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Risk Disclosure Warning Banner */}
        <div className="mb-14 p-5 rounded-[14px] bg-[#E5484D]/10 border border-[#E5484D]/25 text-[#E0A8A3] text-xs leading-relaxed flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-[#E5484D] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-white uppercase tracking-wider block">
              Statutory High-Risk Investment Warning:
            </span>
            <p>
              All investment activities involve substantial risk of capital depreciation or complete loss. Historical yields and return projections are strictly illustrative. CapitalGrow does not operate as a guaranteed deposit institution. Investors are encouraged to seek independent licensed financial advice before allocating funds.
            </p>
          </div>
        </div>

        {/* 5-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10 text-left">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#10B981] to-[#10B981] flex items-center justify-center text-white">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="font-heading text-2xl font-bold text-white tracking-tight">
                Capital<span className="text-[#10B981]">Grow</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed max-w-sm">
              Smart Investing. Transparent Growth. CapitalGrow provides streamlined algorithmic investment allocation, verified banking settlement, and real-time portfolio management.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs text-white/70 font-mono flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-[#10B981]" /> ISO/IEC 27001 Certified
              </span>
              <span className="text-xs text-white/70 font-mono flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-[#10B981]" /> Multi-Currency Ready
              </span>
            </div>
          </div>

          {/* Column 2: Platform */}
          <div className="space-y-3 text-xs sm:text-sm">
            <h5 className="font-heading font-bold text-white uppercase tracking-wider text-xs">
              Investment Plans
            </h5>
            <ul className="space-y-2">
              <li><a href="#plans" className="hover:text-white transition-colors">Starter (Low Risk)</a></li>
              <li><a href="#plans" className="hover:text-white transition-colors">Growth (Moderate)</a></li>
              <li><a href="#plans" className="hover:text-white transition-colors">Premium (Mod-High)</a></li>
              <li><a href="#plans" className="hover:text-white transition-colors">Elite (High Alpha)</a></li>
              <li><a href="#plans" className="hover:text-white transition-colors">Yield Calculator</a></li>
            </ul>
          </div>

          {/* Column 3: Legal & Regulatory */}
          <div className="space-y-3 text-xs sm:text-sm">
            <h5 className="font-heading font-bold text-white uppercase tracking-wider text-xs">
              Legal & Compliance
            </h5>
            <ul className="space-y-2">
              <li><a href="#faq" className="hover:text-white transition-colors">Risk Disclosure Policy</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Anti-Money Laundering (AML)</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">KYC Verification Standards</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Privacy & Data Protection</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Investor Rights Charter</a></li>
            </ul>
          </div>

          {/* Column 4: Help & Support */}
          <div className="space-y-3 text-xs sm:text-sm">
            <h5 className="font-heading font-bold text-white uppercase tracking-wider text-xs">
              Direct Support
            </h5>
            <ul className="space-y-2">
              <li><a href="#faq" className="hover:text-white transition-colors">Help Center & FAQ</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Withdrawal Settlement Guide</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Bank Deposit Instructions</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Security Bug Bounty</a></li>
              <li><a href="mailto:support@capitalgrow.com" className="hover:text-white transition-colors">support@capitalgrow.com</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <div>
            © {new Date().getFullYear()} CapitalGrow Technologies Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <a href="#faq" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#faq" className="hover:text-white transition-colors">Privacy Notice</a>
            <a href="#faq" className="hover:text-white transition-colors">Security Overview</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
