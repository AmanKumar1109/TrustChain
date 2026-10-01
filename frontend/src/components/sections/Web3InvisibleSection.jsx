import React from 'react';
import { ShieldCheck } from 'lucide-react';

const POINTS = [
  {
    pill: 'No Wallet Required',
    title: 'Zero Crypto Complexity',
    desc: 'No seed phrases, no MetaMask, no exchange accounts. We use Account Abstraction (ERC-4337) under the hood — your mobile number is your wallet.',
  },
  {
    pill: 'No Gas Fees',
    title: 'Zero Cost to Consumers',
    desc: 'Every on-chain verification is sponsored by the brand. Consumers never pay a rupee in gas. The protocol is invisible — just a scan and an answer.',
  },
  {
    pill: 'OTP Based Claim',
    title: 'One-Time Password Ownership',
    desc: 'Claim your digital warranty and trust points with a single OTP to your registered mobile number. No app download, no sign-up form, no friction.',
  },
];

export default function Web3InvisibleSection() {
  return (
    <section className="relative w-full py-28 px-6 md:px-12 lg:px-20 overflow-hidden bg-[#060709]">

      {/* Ambient glow */}
      <div
        className="absolute top-1/2 right-[-15%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 65%)',
          filter: 'blur(90px)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Label */}
        <div className="flex items-center justify-center mb-5">
          <span className="section-tag">Web3 You Never See</span>
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-semibold tracking-tight text-white leading-[1.1] mb-5">
            Blockchain Behind<br className="hidden sm:block" /> the Curtain
          </h2>
          <p className="text-zinc-500 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Mathematical certainty without the jargon. Your customer doesn't need a degree in cryptography to verify an authentic product.
          </p>
        </div>

        {/* 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {POINTS.map((point, idx) => (
            <div
              key={point.pill}
              className="bento-card p-8 flex flex-col justify-between min-h-[260px] group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="badge-mono">{point.pill}</span>
                  <span className="font-mono text-[11px] text-zinc-700">0{idx + 1}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 tracking-tight leading-tight">
                  {point.title}
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  {point.desc}
                </p>
              </div>
              <div className="mt-8 pt-5 border-t border-white/[0.05] flex items-center justify-between text-[11px] font-mono text-zinc-600">
                <span>Protocol Feature</span>
                <span className="text-zinc-300">Active</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="bento-card p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-zinc-200" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-tight mb-0.5">
                No Seed Phrases. Zero Gas Surcharges. No Downloads.
              </h4>
              <p className="text-xs text-zinc-500">
                Native Account Abstraction (ERC-4337) sponsors all blockchain interactions invisibly.
              </p>
            </div>
          </div>
          <span className="badge-mono shrink-0">
            400ms Verification Latency
          </span>
        </div>

      </div>
    </section>
  );
}
