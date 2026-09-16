import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldAlert } from 'lucide-react';
import { FAQS } from '../../data/mockData';

export const FaqAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 bg-[#F6F7FC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E4E6F0] text-xs font-semibold text-[#635BFF]">
            <HelpCircle className="w-3.5 h-3.5" /> Investor Due Diligence
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#20204A]">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-[#667085] max-w-xl mx-auto">
            Clear answers regarding regulatory structure, capital liquidity, deposit mechanics, and risk guidelines.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-[14px] border border-[#E4E6F0] overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full text-left py-4 px-6 flex items-center justify-between gap-4 font-heading font-semibold text-base sm:text-lg text-[#20204A] hover:text-[#635BFF] transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#667085] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#635BFF]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm sm:text-base text-[#667085] leading-relaxed border-t border-[#F6F7FC]">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Dedicated Support Box */}
        <div className="mt-12 text-center p-6 rounded-[18px] bg-white border border-[#E4E6F0] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="font-heading text-lg font-bold text-[#20204A]">
              Still have questions about platform mechanics?
            </h4>
            <p className="text-xs sm:text-sm text-[#667085] mt-0.5">
              Our registered wealth advisory desk is available 24/7 for account queries.
            </p>
          </div>
          <a
            href="mailto:support@capitalgrow.com"
            className="px-5 py-2.5 rounded-[10px] bg-[#20204A] text-white text-xs sm:text-sm font-semibold hover:bg-[#0B1026] transition-colors shrink-0"
          >
            Contact Support Desk
          </a>
        </div>
      </div>
    </section>
  );
};
