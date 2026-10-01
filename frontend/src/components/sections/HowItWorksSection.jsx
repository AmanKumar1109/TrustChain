import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    badge: 'Manufacturing',
    title: 'Brand Registers Batch',
    desc: 'The manufacturer mints a unique cryptographic token for every product batch on-chain, binding serial UID + batch code to an immutable smart contract.',
  },
  {
    step: '02',
    badge: 'Packaging',
    title: 'QR Chip Embedded',
    desc: 'A tamper-evident NFC+QR tag is physically fused to the packaging. Peeling or cloning the label invalidates the hash. Every tag is a one-time-use cryptographic proof.',
  },
  {
    step: '03',
    badge: 'Distribution',
    title: 'Supply Chain Logged',
    desc: 'Each hand-off — distributor, warehouse, retailer — appends a signed timestamp to the on-chain ledger, creating a permanent chain-of-custody record.',
  },
  {
    step: '04',
    badge: 'Consumer Scan',
    title: 'Instant Verification',
    desc: 'The consumer scans with any standard camera. The protocol resolves the UID to its on-chain record in under 400ms, returning a cryptographically verified Genuine or Fake result.',
  },
  {
    step: '05',
    badge: 'Rewards',
    title: 'Trust Points Minted',
    desc: 'A verified scan mints proof-of-purchase tokens directly to the consumer\'s mobile number, unlocking streaks, badges, and exclusive brand discounts.',
  },
];

export default function HowItWorksSection({ onOpenVerify }) {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="relative w-full py-28 px-6 md:px-12 lg:px-20 overflow-hidden bg-[#060709]">

      {/* Ambient glow */}
      <div
        className="absolute top-1/2 right-[-15%] w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.022) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Label */}
        <div className="flex items-center justify-center mb-5">
          <span className="section-tag">How It Works</span>
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-semibold tracking-tight text-white leading-[1.1] mb-5">
            Five Steps from Factory<br className="hidden sm:block" /> to Verified
          </h2>
          <p className="text-zinc-500 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            A transparent physical-to-digital handshake from the conveyor belt to the customer's hands. Cannot be forged, cloned, or tampered.
          </p>
        </div>

        {/* Step Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-4">
          {STEPS.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={step.step}
                onClick={() => setActiveStep(idx)}
                className={`text-left rounded-[24px] p-5 transition-all duration-300 border cursor-pointer ${
                  isActive
                    ? 'bg-white/[0.08] border-white/25 shadow-[0_0_30px_rgba(255,255,255,0.06)]'
                    : 'bg-[#0e1016]/80 border-white/[0.07] hover:border-white/[0.14] hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className={`font-mono text-2xl font-light ${isActive ? 'text-white' : 'text-zinc-600'}`}>
                    {step.step}
                  </span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                  )}
                </div>
                <span className="section-tag mb-2" style={{ justifyContent: 'flex-start' }}>{step.badge}</span>
                <h4 className={`text-sm font-semibold tracking-tight leading-tight ${isActive ? 'text-white' : 'text-zinc-400'}`}>
                  {step.title}
                </h4>
              </button>
            );
          })}
        </div>

        {/* Active Step Detail */}
        <div className="bento-card p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="section-tag mb-3">Stage {STEPS[activeStep].step} — {STEPS[activeStep].badge}</div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white tracking-tight mb-3">
              {STEPS[activeStep].title}
            </h3>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-2xl">
              {STEPS[activeStep].desc}
            </p>
          </div>

          <button
            onClick={onOpenVerify}
            className="px-6 py-2.5 rounded-full bg-white hover:bg-zinc-100 text-black font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer shrink-0 shadow-md hover:scale-105"
          >
            <span>Simulate Live Scan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
}
