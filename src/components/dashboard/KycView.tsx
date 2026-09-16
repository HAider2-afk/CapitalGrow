import React, { useState } from 'react';
import {
  FileCheck2,
  UploadCloud,
  CheckCircle2,
  Camera,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const KycView: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [step, setStep] = useState<number>(1);
  const [docType, setDocType] = useState<'CNIC' | 'Passport' | 'Driver License'>('CNIC');
  const [docNumber, setDocNumber] = useState('61101-1928401-2');
  const [frontImage, setFrontImage] = useState<string | null>('cnic_front_scanned.jpg');
  const [backImage, setBackImage] = useState<string | null>('cnic_back_scanned.jpg');
  const [selfieTaken, setSelfieTaken] = useState(true);
  const [submitted, setSubmitted] = useState(user?.kycStatus === 'verified');

  const handleFinalSubmit = () => {
    updateUser({ kycStatus: 'verified' });
    setSubmitted(true);
  };

  const steps = [
    { num: 1, title: 'Personal Info' },
    { num: 2, title: 'ID Document' },
    { num: 3, title: 'Liveness Selfie' },
    { num: 4, title: 'Compliance Review' }
  ];

  return (
    <div className="space-y-6 max-w-3xl text-left animate-in fade-in duration-300">
      {/* Status Header Banner */}
      <div className="p-6 rounded-[18px] bg-[#131926] border border-white/10 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-heading text-2xl font-bold">KYC Identity Verification</h2>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold uppercase ${
                user?.kycStatus === 'verified'
                  ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40'
                  : 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40'
              }`}
            >
              {user?.kycStatus || 'Verified'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Mandatory compliance under SECP & FATF guidelines to unlock unrestricted banking limits
          </p>
        </div>

        <div className="p-3 rounded-xl bg-[#0B0F17] border border-white/10 text-center shrink-0">
          <div className="text-[10px] font-mono text-[#94A3B8]">Daily Withdrawal Limit</div>
          <div className="text-base font-bold text-[#34D399] font-mono-num">
            {user?.kycStatus === 'verified' ? 'Rs. 2,500,000' : 'Rs. 50,000'}
          </div>
        </div>
      </div>

      {/* 4-Step Stepper Header */}
      <div className="p-4 rounded-[18px] bg-[#131926] border border-white/10 flex items-center justify-between">
        {steps.map((s) => {
          const isDone = s.num < step || submitted;
          const isCurrent = s.num === step && !submitted;
          return (
            <div key={s.num} className="flex-1 flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs font-mono transition-all ${
                  isDone
                    ? 'bg-[#10B981] text-[#0B0F17]'
                    : isCurrent
                    ? 'bg-[#10B981] text-white ring-4 ring-[#10B981]/30'
                    : 'bg-white/10 text-[#94A3B8]'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : s.num}
              </div>
              <span className={`text-xs font-semibold ${isCurrent ? 'text-white' : 'text-[#94A3B8]'}`}>
                {s.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step Content Box */}
      <div className="p-6 rounded-[18px] bg-[#131926] border border-white/10 text-white shadow-xl">
        {submitted ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center mx-auto ring-8 ring-[#10B981]/10">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-white">
              Identity Verification Complete & Approved
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] max-w-md mx-auto leading-relaxed">
              Your biometric verification has passed algorithmic screening. Your account is fully compliant with Tier 2 banking quotas.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
            >
              Re-submit Documentation
            </button>
          </div>
        ) : (
          <div>
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="font-heading text-lg font-bold">Step 1: Confirm Legal Identity</h3>
                <p className="text-xs text-[#94A3B8]">
                  Ensure information matches your national registration document exactly
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      defaultValue={user?.fullName}
                      className="w-full px-3 py-2 rounded-lg bg-[#0B0F17] border border-white/15 text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Date of Birth</label>
                    <input
                      type="date"
                      defaultValue="1992-06-15"
                      className="w-full px-3 py-2 rounded-lg bg-[#0B0F17] border border-white/15 text-white text-xs font-mono"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#94A3B8] mb-1">Residential Address</label>
                    <input
                      type="text"
                      defaultValue="House 42, Street 18, Sector F-7/2, Islamabad"
                      className="w-full px-3 py-2 rounded-lg bg-[#0B0F17] border border-white/15 text-white text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    className="px-5 py-2.5 rounded-[10px] bg-[#10B981] text-white font-semibold text-xs flex items-center gap-1.5"
                  >
                    <span>Proceed to ID Upload</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="font-heading text-lg font-bold">Step 2: Upload Identification Document</h3>
                <p className="text-xs text-[#94A3B8]">
                  Provide high-resolution scans of your valid government-issued photo ID
                </p>

                <div className="flex gap-2 mb-4">
                  {['CNIC', 'Passport', 'Driver License'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setDocType(t as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        docType === t ? 'bg-[#10B981] text-white' : 'bg-white/5 text-[#94A3B8]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                    {docType} Number
                  </label>
                  <input
                    type="text"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0B0F17] border border-white/15 text-white text-xs font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div
                    onClick={() => setFrontImage('front_id_scanned.png')}
                    className="border-2 border-dashed border-white/20 hover:border-[#10B981] rounded-xl p-5 text-center cursor-pointer bg-white/5"
                  >
                    <UploadCloud className="w-6 h-6 text-[#10B981] mx-auto mb-1.5" />
                    <div className="text-xs font-medium text-white">
                      {frontImage ? `Uploaded: ${frontImage}` : 'Front Side of ID'}
                    </div>
                    <div className="text-[10px] text-[#94A3B8] mt-0.5">Click or drag file</div>
                  </div>

                  <div
                    onClick={() => setBackImage('back_id_scanned.png')}
                    className="border-2 border-dashed border-white/20 hover:border-[#10B981] rounded-xl p-5 text-center cursor-pointer bg-white/5"
                  >
                    <UploadCloud className="w-6 h-6 text-[#10B981] mx-auto mb-1.5" />
                    <div className="text-xs font-medium text-white">
                      {backImage ? `Uploaded: ${backImage}` : 'Back Side of ID'}
                    </div>
                    <div className="text-[10px] text-[#94A3B8] mt-0.5">Click or drag file</div>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 rounded-[10px] bg-white/10 text-white font-semibold text-xs"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-5 py-2.5 rounded-[10px] bg-[#10B981] text-white font-semibold text-xs flex items-center gap-1.5"
                  >
                    <span>Proceed to Liveness Selfie</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="font-heading text-lg font-bold">Step 3: Biometric Liveness Verification</h3>
                <p className="text-xs text-[#94A3B8]">
                  Position your face within the frame to verify identity against your national registry
                </p>

                <div className="p-8 rounded-2xl bg-[#0B0F17] border border-white/10 text-center space-y-3">
                  <div className="w-24 h-24 rounded-full border-4 border-[#10B981] mx-auto flex items-center justify-center text-[#10B981] bg-white/5 relative">
                    <Camera className="w-10 h-10" />
                    {selfieTaken && (
                      <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#10B981] text-[#0B0F17] flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-[#34D399]">Biometric Liveness Confirmed</div>
                  <p className="text-[11px] text-[#94A3B8] max-w-xs mx-auto">
                    Facial vectors matched with 99.8% confidence score.
                  </p>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="px-4 py-2 rounded-[10px] bg-white/10 text-white font-semibold text-xs"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    className="px-5 py-2.5 rounded-[10px] bg-[#10B981] text-white font-semibold text-xs flex items-center gap-1.5"
                  >
                    <span>Review & Finalize</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h3 className="font-heading text-lg font-bold">Step 4: Compliance Attestation & Submission</h3>
                <p className="text-xs text-[#94A3B8]">
                  Review your provided verification information before registering with the compliance bureau
                </p>

                <div className="p-4 rounded-xl bg-[#0B0F17] border border-white/10 space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Name:</span>
                    <span className="text-white font-semibold">{user?.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Document:</span>
                    <span className="text-white font-semibold">{docType} ({docNumber})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Liveness Check:</span>
                    <span className="text-[#34D399] font-semibold">Passed (Biometric Token Valid)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Tier Classification:</span>
                    <span className="text-[#34D399] font-semibold">Tier 2 Verified Investor</span>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    onClick={() => setStep(3)}
                    className="px-4 py-2 rounded-[10px] bg-white/10 text-white font-semibold text-xs"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleFinalSubmit}
                    className="px-6 py-2.5 rounded-[10px] bg-gradient-to-r from-[#10B981] to-[#0E9F6E] text-[#0B0F17] font-bold text-xs shadow-lg transition-all"
                  >
                    Complete & Certify Account
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
