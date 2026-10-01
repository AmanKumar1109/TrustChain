import React, { useState } from 'react';
import { ArrowUpRight, Globe, Layers, ShieldCheck, TrendingUp, Sparkles, SlidersHorizontal, CheckCircle2 } from 'lucide-react';

export default function BentoInsightsSection({ onOpenVerify }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="relative w-full py-24 px-6 md:px-12 lg:px-16 overflow-hidden bg-[#07080a]">
      
      {/* Ambient Sage & Emerald Corner Aurora Glow matching the reference image */}
      <div 
        className="absolute top-[-10%] right-[-10%] w-[700px] h-[700px] rounded-full pointer-events-none opacity-40 animate-pulse-glow"
        style={{
          background: 'radial-gradient(circle at 75% 25%, rgba(195, 235, 215, 0.5) 0%, rgba(130, 195, 160, 0.3) 35%, rgba(60, 120, 90, 0.15) 60%, transparent 80%)',
          filter: 'blur(90px)',
        }}
      />
      <div 
        className="absolute bottom-[-10%] left-[-10%] w-[650px] h-[650px] rounded-full pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(120, 185, 195, 0.35) 0%, rgba(45, 95, 105, 0.15) 50%, transparent 80%)',
          filter: 'blur(100px)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Section Header matching "Meet Marvellous Insights" */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-white mb-4">
            Meet Marvellous Insights
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-normal max-w-xl mx-auto leading-relaxed">
            Save your team's precious time. Config replaces the lengthy process of manual verification with autonomous telemetry.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ========================================================= */}
          {/* CARD 1: 98.2% Spots Worldwide 3D Orbit (Top Left - 7 cols) */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 bg-[#101218]/90 border border-white/10 rounded-[32px] p-7 md:p-8 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl relative overflow-hidden">
            
            {/* Top Stat */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight font-sans">
                  98.2% <span className="text-zinc-500 font-mono">.</span>
                </h3>
                <p className="text-xs text-zinc-400 font-medium tracking-wide mt-0.5">
                  Spots . Worldwide
                </p>
              </div>

              <div className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-zinc-400">
                <Globe className="w-4 h-4" />
              </div>
            </div>

            {/* 3D Wireframe Orbit Globe Center Graphic */}
            <div className="relative w-full h-48 md:h-52 flex items-center justify-center my-2">
              <svg className="w-full h-full max-w-md opacity-40 text-emerald-300" viewBox="0 0 400 200" fill="none">
                {/* Globe Elliptical Latitude / Longitude lines */}
                <ellipse cx="200" cy="100" rx="140" ry="70" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                <ellipse cx="200" cy="100" rx="90" ry="68" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="60" y1="100" x2="340" y2="100" stroke="currentColor" strokeWidth="0.75" />
                <line x1="200" y1="30" x2="200" y2="170" stroke="currentColor" strokeWidth="0.75" />
                
                {/* Diagonal orbit rings */}
                <ellipse cx="200" cy="100" rx="160" ry="45" transform="rotate(-20 200 100)" stroke="currentColor" strokeWidth="1.2" />
              </svg>

              {/* Spot 1 Pin */}
              <div className="absolute top-[42%] left-[45%] flex items-center gap-1.5 bg-[#181a24]/90 border border-white/20 rounded-full px-2.5 py-0.5 shadow-lg backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] font-mono text-zinc-200">Spot 1</span>
              </div>

              {/* Spot 2 Pin */}
              <div className="absolute top-[20%] left-[62%] flex items-center gap-1.5 bg-[#181a24]/90 border border-white/20 rounded-full px-2.5 py-0.5 shadow-lg backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                <span className="text-[10px] font-mono text-zinc-200">Spot 2</span>
              </div>

              {/* Spot 3 Pin */}
              <div className="absolute top-[68%] left-[72%] flex items-center gap-1.5 bg-[#181a24]/90 border border-white/20 rounded-full px-2.5 py-0.5 shadow-lg backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span className="text-[10px] font-mono text-zinc-200">Spot 3</span>
              </div>
            </div>

            {/* Micro Action Pills matching image */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <button
                type="button"
                className="text-[11px] font-mono text-zinc-400 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-full px-3 py-1 transition-colors cursor-pointer"
              >
                ↗ Opens Spots api dev
              </button>
              <button
                type="button"
                className="text-[11px] font-mono text-zinc-400 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-full px-3 py-1 transition-colors cursor-pointer"
              >
                ! Assign issue to experts
              </button>
              <button
                type="button"
                className="text-[11px] font-mono text-zinc-400 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-full px-3 py-1 transition-colors cursor-pointer"
              >
                ▲ Assign now
              </button>
            </div>

            {/* Card Footer: Success Transactions */}
            <div className="pt-4 border-t border-white/5">
              <h4 className="text-sm font-semibold text-white tracking-tight mb-1">
                Success Transactions
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Innovative blockchain technology meets financial expertise to empower your investment journey and authentic supply telemetry.
              </p>
            </div>

          </div>

          {/* ========================================================= */}
          {/* CARD 2: Liquidity Labyrinth (Top Right - 5 cols)         */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 bg-[#101218]/90 border border-white/10 rounded-[32px] p-7 md:p-8 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl relative overflow-hidden">
            
            {/* 3D Glowing Cylinders Pillar Chart Graphic */}
            <div className="relative w-full h-44 flex items-end justify-center gap-3.5 pt-6 pb-2">
              
              {/* Bar 1 */}
              <div className="flex flex-col items-center gap-1 group">
                <div className="w-5 h-2.5 rounded-full bg-white shadow-[0_0_12px_#ffffff]" />
                <div 
                  className="w-4 rounded-full" 
                  style={{ 
                    height: '110px', 
                    background: 'linear-gradient(to bottom, rgba(160,225,190,0.9), rgba(50,110,80,0.3))' 
                  }} 
                />
              </div>

              {/* Bar 2 */}
              <div className="flex flex-col items-center gap-1 group">
                <div className="w-5 h-2.5 rounded-full bg-white shadow-[0_0_12px_#ffffff]" />
                <div 
                  className="w-4 rounded-full" 
                  style={{ 
                    height: '135px', 
                    background: 'linear-gradient(to bottom, rgba(175,235,205,0.95), rgba(70,140,105,0.35))' 
                  }} 
                />
              </div>

              {/* Bar 3 */}
              <div className="flex flex-col items-center gap-1 group">
                <div className="w-5 h-2.5 rounded-full bg-white shadow-[0_0_12px_#ffffff]" />
                <div 
                  className="w-4 rounded-full" 
                  style={{ 
                    height: '85px', 
                    background: 'linear-gradient(to bottom, rgba(150,215,185,0.85), rgba(45,95,70,0.25))' 
                  }} 
                />
              </div>

              {/* Bar 4 */}
              <div className="flex flex-col items-center gap-1 group">
                <div className="w-5 h-2.5 rounded-full bg-white shadow-[0_0_12px_#ffffff]" />
                <div 
                  className="w-4 rounded-full" 
                  style={{ 
                    height: '100px', 
                    background: 'linear-gradient(to bottom, rgba(165,225,195,0.9), rgba(55,115,85,0.3))' 
                  }} 
                />
              </div>

              {/* Bar 5 */}
              <div className="flex flex-col items-center gap-1 group">
                <div className="w-5 h-2.5 rounded-full bg-white shadow-[0_0_12px_#ffffff]" />
                <div 
                  className="w-4 rounded-full" 
                  style={{ 
                    height: '65px', 
                    background: 'linear-gradient(to bottom, rgba(140,205,175,0.75), rgba(35,80,60,0.2))' 
                  }} 
                />
              </div>

            </div>

            {/* Text Content */}
            <div className="mt-8 pt-4 border-t border-white/5">
              <h4 className="text-base font-semibold text-white tracking-tight mb-1">
                Liquidity Labyrinth
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Liquidity Labyrinth, where each turn reveals new opportunities and decentralized cryptographic verification.
              </p>
            </div>

          </div>

          {/* ========================================================= */}
          {/* CARD 3: Financial Growth Stat Boxes (Bottom Left - 5 cols)*/}
          {/* ========================================================= */}
          <div className="lg:col-span-5 bg-[#101218]/90 border border-white/10 rounded-[32px] p-7 md:p-8 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl relative overflow-hidden">
            
            {/* Top Stat Columns side by side */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              
              {/* Stat Column 1 */}
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
                <div className="flex items-center gap-1.5 text-xs text-[#d4b35e] font-medium mb-1">
                  <span className="w-1 h-3 rounded bg-[#d4b35e]" />
                  <span>Financial</span>
                </div>
                <p className="text-[11px] text-zinc-400 mb-1">Growth</p>
                <div className="text-3xl font-bold font-sans text-white tracking-tight">
                  19.2
                </div>
                <span className="text-xs font-mono text-zinc-400 mt-1 block">
                  $2.7m
                </span>
              </div>

              {/* Stat Column 2 */}
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
                <div className="flex items-center gap-1.5 text-xs text-[#d4b35e] font-medium mb-1">
                  <span className="w-1 h-3 rounded bg-[#d4b35e]" />
                  <span>Financial</span>
                </div>
                <p className="text-[11px] text-zinc-400 mb-1">Growth</p>
                <div className="text-3xl font-bold font-sans text-white tracking-tight">
                  24
                </div>
                <span className="text-xs font-mono text-zinc-400 mt-1 block">
                  $3.2m
                </span>
              </div>

            </div>

            {/* Description */}
            <div className="pt-2 border-t border-white/5">
              <h4 className="text-sm font-semibold text-white tracking-tight mb-1">
                Your Palette Financial Opportunities
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Watch your assets grow in a thriving ecosystem so easy. Direct verifiable ownership protects revenue at scale.
              </p>
            </div>

          </div>

          {/* ========================================================= */}
          {/* CARD 4: DeFi Space . Opportunities Graph (Bottom Right - 7 cols)*/}
          {/* ========================================================= */}
          <div className="lg:col-span-7 bg-[#101218]/90 border border-white/10 rounded-[32px] p-7 md:p-8 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl relative overflow-hidden">
            
            {/* Header */}
            <div>
              <h4 className="text-base font-semibold text-white tracking-tight mb-1">
                DeFi Space . Opportunities
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Where each stroke is a smart contract and every color is a chance to build a portfolio.
              </p>
            </div>

            {/* Multi-Bar Graph matching reference */}
            <div className="my-6 pt-4 pb-2 flex items-end justify-center gap-5 sm:gap-7">
              
              {/* Bar 1 - 19 */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-mono text-zinc-400">19</span>
                <div className="w-7 sm:w-8 h-16 rounded-xl bg-gradient-to-t from-emerald-950/60 to-emerald-500/30 border border-emerald-400/40" />
                <span className="text-[10px] font-mono text-zinc-500">Dec</span>
              </div>

              {/* Bar 2 - 32 */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-mono text-zinc-300 font-semibold">32</span>
                <div className="w-7 sm:w-8 h-24 rounded-xl bg-gradient-to-t from-teal-950/60 to-teal-400/40 border border-teal-400/50" />
                <span className="text-[10px] font-mono text-zinc-500">Jan</span>
              </div>

              {/* Bar 3 - 45 (Highest) */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-mono text-emerald-300 font-bold">45</span>
                <div className="w-7 sm:w-8 h-32 rounded-xl bg-gradient-to-t from-emerald-900/60 via-emerald-500/50 to-emerald-300/80 border border-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.3)]" />
                <span className="text-[10px] font-mono text-zinc-400">Feb</span>
              </div>

              {/* Bar 4 - 12 */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-mono text-zinc-400">12</span>
                <div className="w-7 sm:w-8 h-12 rounded-xl bg-gradient-to-t from-cyan-950/50 to-cyan-500/25 border border-cyan-400/30" />
                <span className="text-[10px] font-mono text-zinc-500">Mar</span>
              </div>

              {/* Bar 5 - 28 */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-mono text-zinc-300">28</span>
                <div className="w-7 sm:w-8 h-22 rounded-xl bg-gradient-to-t from-emerald-950/60 to-teal-500/35 border border-teal-400/40" />
                <span className="text-[10px] font-mono text-zinc-500">Apr</span>
              </div>

            </div>

            {/* Bottom Carousel Indicator Dashes */}
            <div className="pt-2 flex items-center justify-center gap-1.5">
              <div className="w-6 h-1 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
              <div className="w-6 h-1 rounded-full bg-white/20" />
              <div className="w-6 h-1 rounded-full bg-white/20" />
              <div className="w-6 h-1 rounded-full bg-white/20" />
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
