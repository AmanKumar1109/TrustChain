import React from 'react';
import { ArrowRight, QrCode, Shield } from 'lucide-react';
import PhoneMockup from '../hero/PhoneMockup';

export default function PhoneShowcaseSection({ onOpenVerify }) {
  return (
    <section className="relative w-full py-28 px-6 md:px-12 lg:px-20 overflow-hidden bg-[#060709]">

      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-[-10%] w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.022) 0%, transparent 65%)',
          filter: 'blur(90px)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Label */}
        <div className="flex items-center justify-center mb-5">
          <span className="section-tag">Instant Verification</span>
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-semibold tracking-tight text-white leading-[1.1] mb-5">
            Certainty in<br className="hidden sm:block" /> Your Pocket
          </h2>
          <p className="text-zinc-500 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Point your standard smartphone camera at any Paradox-protected product. Zero app downloads, zero crypto jargon — pure mathematical certainty.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left: Feature Cards */}
          <div className="lg:col-span-6 space-y-4">

            <div className="bento-card p-7 relative overflow-hidden">
              <div className="absolute inset-0 dot-grid opacity-40 rounded-[28px]" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                    <Shield className="w-4 h-4 text-zinc-300" />
                  </div>
                  <span className="badge-mono">Mathematical Proof</span>
                </div>
                <h3 className="text-lg font-semibold text-white tracking-tight mb-2">
                  Cryptographic Authenticity Seal
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Serial UID, batch code, and blockchain transaction hash verified in 400ms. Mathematical certainty the product rolled off an authorized line.
                </p>
              </div>
            </div>

            <div className="bento-card p-7">
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                  <QrCode className="w-4 h-4 text-zinc-300" />
                </div>
                <span className="badge-mono">Permanent Protection</span>
              </div>
              <h3 className="text-lg font-semibold text-white tracking-tight mb-2">
                Tamper-Proof Digital Warranty
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                No lost paper receipts. Warranty registered to your mobile number via OTP — permanently on-chain and accessible forever.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenVerify}
                className="px-7 py-3 rounded-full bg-white hover:bg-zinc-100 text-black font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105"
              >
                <QrCode className="w-4 h-4" />
                <span>Simulate Camera Scan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Phone Mockup */}
          <div className="lg:col-span-6 flex justify-center items-center">
            <PhoneMockup onOpenVerifySample={onOpenVerify} />
          </div>

        </div>

      </div>
    </section>
  );
}
