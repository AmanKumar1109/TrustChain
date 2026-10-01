import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, ShieldCheck, X, ExternalLink, Sparkles } from 'lucide-react';

export default function VerificationResultModal({ result, onClose }) {
  const [claimed, setClaimed] = useState(false);
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  if (!result) return null;

  const isGenuine = result.status === 'GENUINE';

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length >= 10) {
      setOtpSent(true);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.length >= 4) {
      setClaimed(true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#0e1015] border border-white/15 rounded-3xl p-6 md:p-8 shadow-[0_20px_70px_rgba(0,0,0,0.9)] my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-500 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Status Banner */}
        <div className="flex flex-col items-center text-center mb-6">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
              isGenuine
                ? 'bg-white/10 text-white border border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.15)]'
                : 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.3)]'
            }`}
          >
            {isGenuine ? (
              <ShieldCheck className="w-9 h-9" />
            ) : (
              <AlertTriangle className="w-9 h-9" />
            )}
          </div>

          <span
            className={`text-xs font-mono tracking-widest uppercase px-3 py-1 rounded-full mb-1 ${
              isGenuine
                ? 'bg-white/[0.07] text-zinc-300 border border-white/15'
                : 'bg-red-500/10 text-red-400 border border-red-500/30'
            }`}
          >
            {isGenuine ? 'Decentralized Proof: Verified' : 'Critical Warning: Counterfeit'}
          </span>

          <h3 className="text-2xl font-bold text-white tracking-tight">
            {isGenuine ? '100% Authentic Product' : 'Suspected Fake / Cloned Copy'}
          </h3>
          <p className="text-zinc-500 text-xs mt-1">
            Verified in 380ms via Paradox Blockchain Trust Protocol (No Login Required)
          </p>
        </div>

        {/* Details Card */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 md:p-5 mb-5 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.05]">
            <span className="text-xs text-zinc-500">Product Name</span>
            <span className="text-xs font-semibold text-white">{result.productName}</span>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.05]">
            <span className="text-xs text-zinc-500">Authorized Brand</span>
            <span className="text-xs font-medium text-zinc-200">{result.brand}</span>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.05]">
            <span className="text-xs text-zinc-500">Batch Code</span>
            <span className="text-xs font-mono text-zinc-300">{result.batchNo}</span>
          </div>
          {result.mfgDate && (
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.05]">
              <span className="text-xs text-zinc-500">Manufacturing Date</span>
              <span className="text-xs text-zinc-300">{result.mfgDate}</span>
            </div>
          )}
          {result.factoryLocation && (
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.05]">
              <span className="text-xs text-zinc-500">Certified Facility</span>
              <span className="text-xs text-zinc-300">{result.factoryLocation}</span>
            </div>
          )}
          {result.warning && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs leading-relaxed">
              ⚠️ {result.warning}
            </div>
          )}
          <div className="pt-1">
            <div className="flex items-center justify-between text-[11px] text-zinc-600">
              <span>On-Chain Ledger Hash</span>
              <span className="font-mono text-zinc-500 flex items-center gap-1">
                {result.blockchainTx}
                <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>

        {/* Custody Chain */}
        {isGenuine && result.custodyChain && (
          <div className="mb-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-3">
              Immutable Chain of Custody
            </h4>
            <div className="space-y-2">
              {result.custodyChain.map((step, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs bg-white/[0.03] p-2.5 rounded-xl border border-white/[0.05]">
                  <div className="w-2 h-2 rounded-full bg-white/50" />
                  <span className="font-medium text-zinc-300 flex-1">{step.step}</span>
                  <span className="text-zinc-600 font-mono text-[11px]">{step.location}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Claim Rewards & Warranty */}
        {isGenuine && (
          <div className="bg-white/[0.04] border border-white/[0.1] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-zinc-300" />
              <h4 className="text-xs font-semibold text-white">
                Claim On-Chain Warranty & +{result.rewardPoints || 100} Trust Points
              </h4>
            </div>

            {claimed ? (
              <div className="flex items-center gap-3 bg-white/[0.06] border border-white/15 p-3 rounded-xl text-xs text-white">
                <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                <div>
                  <p className="font-semibold">Ownership & Warranty Activated!</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">+{result.rewardPoints || 100} points credited to your mobile number.</p>
                </div>
              </div>
            ) : !otpSent ? (
              <form onSubmit={handleSendOtp} className="flex gap-2">
                <input
                  type="tel"
                  placeholder="Enter 10-digit mobile for OTP"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 transition-colors"
                  maxLength={10}
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-white hover:bg-zinc-200 text-black font-semibold text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                >
                  Send OTP
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter 4-digit OTP (try 1234)"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 transition-colors"
                  maxLength={6}
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-white hover:bg-zinc-200 text-black font-semibold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Verify & Claim
                </button>
              </form>
            )}
          </div>
        )}

        <div className="mt-5 text-center">
          <button
            onClick={onClose}
            className="text-xs text-zinc-500 hover:text-white transition-colors cursor-pointer"
          >
            Done & Verify Another Product
          </button>
        </div>
      </div>
    </div>
  );
}
