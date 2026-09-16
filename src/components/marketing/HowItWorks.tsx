import React from 'react';
import { UserPlus, FileCheck, Layers, LineChart } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      icon: UserPlus,
      title: 'Create Account',
      description: 'Register with your verified email and mobile number in under two minutes with automated 2FA.'
    },
    {
      step: '02',
      icon: FileCheck,
      title: 'Complete Verification',
      description: 'Upload your national ID and liveness selfie to meet SECP compliance and unlock banking limits.'
    },
    {
      step: '03',
      icon: Layers,
      title: 'Choose an Investment',
      description: 'Select from 4 risk-graded strategies (Starter, Growth, Premium, Elite) suited to your horizon.'
    },
    {
      step: '04',
      icon: LineChart,
      title: 'Monitor & Withdraw',
      description: 'Track daily yields in real-time on your dashboard and request seamless withdrawals to your bank.'
    }
  ];

  return (
    <section id="how" className="py-20 bg-white border-y border-[#E4E6F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#635BFF] bg-[#EEECFF] px-3 py-1 rounded-full">
            Institutional Simplicity
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#20204A]">
            How CapitalGrow works
          </h2>
          <p className="text-base text-[#667085]">
            Four streamlined steps from onboarding to an active, transparently tracked investment portfolio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative p-6 rounded-[18px] bg-[#F6F7FC] border border-[#E4E6F0] hover:shadow-md hover:border-[#635BFF]/30 transition-all group"
              >
                {/* Step badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#E4E6F0] flex items-center justify-center text-[#635BFF] group-hover:scale-110 group-hover:bg-[#635BFF] group-hover:text-white transition-all shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-xl font-bold text-[#635BFF]/60 group-hover:text-[#635BFF] transition-colors">
                    {item.step}
                  </span>
                </div>

                <h3 className="font-heading text-lg font-bold text-[#20204A] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
