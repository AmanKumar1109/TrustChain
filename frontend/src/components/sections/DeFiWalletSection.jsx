import React, { useState } from 'react';
import { ArrowUpRight, Zap, Check, ChevronUp, ChevronDown, ShieldCheck, Sparkles } from 'lucide-react';

export default function DeFiWalletSection({ onOpenVerify }) {
  const [activeTag, setActiveTag] = useState('decentralized');

  const tags = [
    { id: 'assets', label: '2.7k Assets', spark: true },
    { id: 'success', label: 'Success', spark: true },
    { id: 'decentralized', label: 'Decentralized', active: true },
    { id: 'contracts', label: 'Smart Contracts', spark: true },
    { id: 'trust', label: 'Tokenized Trust', spark: true },
    { id: 'revolution', label: 'DeFi - Revolution', spark: true },
    { id: 'leaders', label: 'LiquidityLeaders', spark: true },
  ];

  return (
    <section className="relative w-full py-24 px-6 md:px-12 lg:px-16 overflow-hidden bg-[#07080a]">
      
      {/* Background Subtle Aurora Mist */}
      <div 
        className="absolute top-1/2 left-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.35) 0%, transparent 70%)',
          filter: 'blur(120px)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-white mb-4">
            DeFi Wallet
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-normal max-w-xl mx-auto leading-relaxed mb-6">
            Exploratory mission with DeFi Horizon & navigating through the vast possibilities
          </p>

          <button
            onClick={onOpenVerify}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-medium text-white transition-all backdrop-blur-md cursor-pointer shadow-sm hover:scale-105"
          >
            <span>How it works?</span>
          </button>
        </div>

        {/* Big Curved Dashboard Container matching reference image */}
        <div className="relative bg-[#0c0e14] border border-white/10 rounded-[36px] p-8 md:p-14 shadow-[0_25px_80px_rgba(0,0,0,0.8)] overflow-hidden">
          
          {/* Main Grid: Left balance & transaction orbits, Right circular Step 01 gauge */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column (7 cols): +A3.7 & Flowing Curved Transactions */}
            <div className="lg:col-span-7 relative">
              
              {/* Top balance header */}
              <div className="mb-10">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  DeFi Wallet System
                </span>
                <div className="text-5xl sm:text-6xl md:text-7xl font-light font-sans text-white tracking-tight mt-1">
                  +A3.7
                </div>
              </div>

              {/* Curved SVG Orbit Track */}
              <div className="relative w-full h-64 md:h-72">
                <svg className="w-full h-full absolute inset-0 pointer-events-none" viewBox="0 0 500 250" fill="none">
                  {/* Orbit arcs */}
                  <path
                    d="M 20 180 C 150 180, 220 50, 480 50"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M 50 240 C 200 240, 280 120, 460 120"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="1"
                  />
                </svg>

                {/* Floating Transaction Pill 1: Sent 0.0004968 */}
                <div className="absolute top-[8%] left-[28%] bg-[#151722]/90 border border-white/15 rounded-2xl px-3.5 py-2 shadow-xl backdrop-blur-md flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-zinc-300">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-zinc-400 font-medium">Sent</span>
                      <span className="text-xs font-mono text-white font-semibold">0.0004968</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                      <span>from 0x9338</span>
                      <span>VAREN-</span>
                    </div>
                  </div>
                </div>

                {/* Floating Transaction Pill 2: Received 1.038 */}
                <div className="absolute top-[45%] left-[16%] bg-[#151722]/90 border border-white/15 rounded-2xl px-3.5 py-2 shadow-xl backdrop-blur-md flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-zinc-400 font-medium">Received</span>
                      <span className="text-xs font-mono text-white font-semibold">1.038</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                      <span>from 0x847</span>
                      <span>BANCOR</span>
                    </div>
                  </div>
                </div>

                {/* Floating Transaction Pill 3: Sent 4.94863 */}
                <div className="absolute bottom-[2%] left-[2%] bg-[#151722]/90 border border-white/15 rounded-2xl px-3.5 py-2 shadow-xl backdrop-blur-md flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-zinc-300">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-zinc-400 font-medium">Sent</span>
                      <span className="text-xs font-mono text-white font-semibold">4.94863</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                      <span>from x7360</span>
                      <span>BNB</span>
                    </div>
                  </div>
                </div>

                {/* Done badge near orbit */}
                <span className="absolute top-[80%] right-[10%] text-[11px] font-mono text-zinc-400 bg-white/[0.04] px-3 py-1 rounded-full border border-white/5">
                  Done
                </span>

                {/* Pending badge */}
                <span className="absolute bottom-[2%] left-[30%] text-[11px] font-mono text-zinc-500 bg-white/[0.03] px-3 py-1 rounded-full border border-white/5">
                  Pending
                </span>

              </div>

            </div>

            {/* Right Column (5 cols): Step 01 Circular Dial Gauge */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              
              <div className="relative w-64 h-64 flex items-center justify-center">
                
                {/* Outer Target Ticks SVG */}
                <svg className="w-full h-full absolute inset-0 -rotate-90" viewBox="0 0 240 240">
                  {/* Background Track */}
                  <circle
                    cx="120"
                    cy="120"
                    r="90"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="10"
                    fill="none"
                  />
                  {/* Highlighted Progress Arc */}
                  <circle
                    cx="120"
                    cy="120"
                    r="90"
                    stroke="#ffffff"
                    strokeWidth="12"
                    strokeDasharray="565"
                    strokeDashoffset="380"
                    strokeLinecap="round"
                    fill="none"
                    className="drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                  />
                  {/* Secondary Inner Glow Ring */}
                  <circle
                    cx="120"
                    cy="120"
                    r="75"
                    stroke="rgba(52,211,153,0.3)"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    fill="none"
                  />
                </svg>

                {/* Small labels on the gauge ring */}
                <div className="absolute top-8 left-8 text-[9px] font-mono text-zinc-400">
                  Target<br />2024<br />DeFi . api
                </div>
                <div className="absolute top-6 right-10 text-[9px] font-mono text-zinc-500">
                  92.3%
                </div>

                {/* Center Core Button: Step 01 */}
                <div className="relative w-28 h-28 rounded-full bg-[#07080a] border border-white/20 shadow-[0_0_35px_rgba(0,0,0,0.9)] flex flex-col items-center justify-center text-center">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center mb-1 text-white">
                    <Zap className="w-3.5 h-3.5 fill-white text-white" />
                  </div>
                  <span className="text-xs font-semibold text-white tracking-tight">
                    Step 01
                  </span>
                </div>

              </div>

            </div>

          </div>

          {/* Bottom Interactive Tag Filter Bar matching reference */}
          <div className="mt-14 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {tags.map((tag) => {
              const isSelected = activeTag === tag.id || tag.active;
              return (
                <button
                  key={tag.id}
                  onClick={() => setActiveTag(tag.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105'
                      : 'bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 border border-white/10'
                  }`}
                >
                  {tag.spark && <span className="text-[10px] text-zinc-400">✦</span>}
                  <span>{tag.label}</span>
                </button>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
