import React from 'react';
import { Pill, Cpu, Sparkles, Gem } from 'lucide-react';

const sectors = [
  {
    icon: Pill,
    title: 'Pharma & Medicine',
    value: '30%',
    sub: 'Spurious drugs circulating without verifiable origin',
    tag: 'Critical Health',
  },
  {
    icon: Cpu,
    title: 'Electronics & Hardware',
    value: '₹22K Cr',
    sub: 'Counterfeit lithium batteries and hazardous parts',
    tag: 'Safety Hazard',
  },
  {
    icon: Sparkles,
    title: 'Cosmetics & Skincare',
    value: '1 in 3',
    sub: 'Toxic heavy metals inside duplicate brand bottles',
    tag: 'Toxic',
  },
  {
    icon: Gem,
    title: 'Luxury & Apparel',
    value: '42%',
    sub: 'High-end goods losing brand equity to duplicates',
    tag: 'Brand Dilution',
  },
];

export default function ProblemSection() {
  return (
    <section className="relative w-full py-28 px-6 md:px-12 lg:px-20 overflow-hidden bg-[#060709]">

      {/* Ambient glow */}
      <div
        className="absolute top-0 left-[-15%] w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.025) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Section Label */}
        <div className="flex items-center justify-center mb-5">
          <span className="section-tag">The Problem</span>
        </div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-semibold tracking-tight text-white leading-[1.1] mb-5">
            A Multi-Billion Dollar<br className="hidden sm:block" /> Trust Deficit
          </h2>
          <p className="text-zinc-500 text-sm sm:text-base font-normal max-w-lg mx-auto leading-relaxed">
            Physical commerce relies on static barcodes invented in 1974. Anyone with a ₹5,000 thermal printer can clone them.
          </p>
        </div>

        {/* Top Row: Big Stat + Quote */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">

          {/* Main Stat Card */}
          <div className="lg:col-span-7 bento-card p-8 md:p-10 flex flex-col justify-between min-h-[260px] relative overflow-hidden">
            {/* Dot grid */}
            <div className="absolute inset-0 dot-grid opacity-50 rounded-[28px]" />
            <div className="relative z-10">
              <div className="section-tag mb-4">Annual Indian Market Impact</div>
              <div className="text-5xl sm:text-6xl lg:text-7xl font-light text-white tracking-tight leading-none mb-4">
                ₹1 Lakh Crore
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-lg">
                Lost every year to counterfeit goods in Indian markets alone — across medicine, electronics, luxury goods, and packaged food.
              </p>
            </div>
            <div className="relative z-10 mt-8 pt-5 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4">
              <span className="text-[11px] font-mono text-zinc-600">
                Source: ASSOCHAM & FICCI Anti-Smuggling Survey
              </span>
              <span className="badge-mono">
                98.4% Lack Cryptographic Proof
              </span>
            </div>
          </div>

          {/* Quote Card */}
          <div className="lg:col-span-5 bento-card p-8 md:p-10 flex flex-col justify-between min-h-[260px]">
            <div className="section-tag mb-4">The Core Anomaly</div>
            <blockquote className="text-2xl sm:text-3xl font-light text-white leading-snug tracking-tight flex-1 flex items-center">
              "Digital assets got ownership. Physical goods did not."
            </blockquote>
            <div className="mt-8 pt-5 border-t border-white/[0.06]">
              <p className="text-xs text-zinc-500 leading-relaxed">
                Paradox bridges this chasm by binding physical items to decentralized cryptographic identities.
              </p>
            </div>
          </div>

        </div>

        {/* 4 Sector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sectors.map((sec) => {
            const Icon = sec.icon;
            return (
              <div
                key={sec.title}
                className="bento-card p-6 flex flex-col gap-4 group hover:scale-[1.01] transition-transform duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                    <Icon className="w-4.5 h-4.5 text-zinc-300" size={18} />
                  </div>
                  <span className="badge-mono">{sec.tag}</span>
                </div>

                <div>
                  <div className="text-3xl font-light text-white tracking-tight leading-none mb-2">
                    {sec.value}
                  </div>
                  <h4 className="text-sm font-semibold text-white/90 tracking-tight mb-1.5">
                    {sec.title}
                  </h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    {sec.sub}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between text-[11px] font-mono text-zinc-600">
                  <span>Verification Gap</span>
                  <span className="text-zinc-400">Critical</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
