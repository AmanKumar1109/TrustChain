import React from 'react';

const POINTS = [
  {
    stat: 'Immutable',
    title: 'Tamper-Proof Record',
    desc: 'Every product certificate is sealed using SHA-256 hashing and distributed across thousands of blockchain nodes. No single server admin can alter, delete, or suppress the record.',
  },
  {
    stat: 'Decentralized',
    title: 'Brand Cannot Edit It',
    desc: 'Once minted, even the brand founder cannot rewrite a batch certificate. This mathematical constraint is the foundational guarantee that makes consumer trust possible.',
  },
  {
    stat: 'Open Audit',
    title: 'Open Verification',
    desc: 'Anyone — regulators, journalists, consumers, or competing brands — can independently verify any product\'s provenance on the public blockchain without our permission.',
  },
];

export default function WhyBlockchainSection() {
  return (
    <section className="relative w-full py-28 px-6 md:px-12 lg:px-20 overflow-hidden bg-[#060709]">

      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-[-15%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 65%)',
          filter: 'blur(90px)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Label */}
        <div className="flex items-center justify-center mb-5">
          <span className="section-tag">Why Blockchain?</span>
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-semibold tracking-tight text-white leading-[1.1] mb-5">
            Not a Database.<br className="hidden sm:block" /> Mathematical Truth.
          </h2>
          <p className="text-zinc-500 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            A centralized database has passwords, admins, and backdoors. Paradox eliminates the need to trust any single party or server.
          </p>
        </div>

        {/* 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {POINTS.map((point, idx) => (
            <div
              key={point.title}
              className="bento-card p-8 flex flex-col justify-between min-h-[260px]"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="badge-mono">{point.stat}</span>
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
                <span>Cryptographic Proof</span>
                <span className="text-zinc-300">Immutable</span>
              </div>
            </div>
          ))}
        </div>

        {/* Core Guarantee Banner */}
        <div className="bento-card p-10 md:p-12 text-center max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute inset-0 dot-grid opacity-40 rounded-[28px]" />
          <div className="relative z-10">
            <div className="section-tag mb-4 justify-center">The Fundamental Guarantee</div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white tracking-tight mb-4 leading-tight">
              "Brand bhi record nahi badal sakta"
            </h3>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xl mx-auto">
              Once a batch certificate or duplicate scan alert is broadcast, mathematical consensus seals the record forever. Even the brand founder cannot rewrite history.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
