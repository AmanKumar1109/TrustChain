import React from 'react';
import { ArrowRight, QrCode, ShieldCheck, Sparkles, Building2 } from 'lucide-react';
import PhoneMockup from './PhoneMockup';
import QuickVerifyBox from './QuickVerifyBox';
import BackgroundGlow from './BackgroundGlow';

export default function Hero({ onOpenVerify, onOpenAuth, onVerifyResult }) {
  return (
    <section className="relative w-full min-h-[90vh] pt-8 md:pt-14 pb-20 px-6 md:px-12 lg:px-16 flex flex-col justify-between overflow-hidden">
      
      {/* Dynamic Background Glows with Shining Corners */}
      <BackgroundGlow />

      {/* Main Hero Container */}
      <div className="relative z-20 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left Column: Heading, Subtitle, CTAs */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
          
          {/* Top Pill / Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 text-[12px] text-zinc-300 transition-all duration-300 backdrop-blur-md mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-white/60 animate-pulse" />
            <span className="font-medium tracking-tight">Decentralized Anti-Counterfeit Layer</span>
            <span className="text-zinc-500 font-mono">|</span>
            <span className="text-zinc-300 font-semibold">Web3 Made Invisible</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-bold tracking-tight text-white leading-[1.05] mb-5">
            Scan. Verify.{' '}
            <span className="bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent">
              Trust.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-zinc-300 text-lg sm:text-xl font-medium tracking-wide max-w-xl mb-3">
            A Trust Protocol for Physical Goods
          </p>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-lg mb-8">
            Binding physical items to immutable blockchain identities. Zero crypto friction, zero gas fees for buyers, and instant counterfeit detection in 400ms.
          </p>

          {/* 2 CTAs */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10 w-full sm:w-auto">
            {/* CTA 1: Verify a Product */}
            <button
              onClick={onOpenVerify}
              className="px-7 py-3.5 rounded-2xl bg-white hover:bg-zinc-100 text-black font-bold text-sm transition-all duration-200 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2.5 cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Verify a Product</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* CTA 2: Register Your Brand */}
            <button
              onClick={() => onOpenAuth('brand')}
              className="px-6 py-3.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] text-white font-semibold text-sm border border-white/15 hover:border-white/30 transition-all duration-200 backdrop-blur-md flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Building2 className="w-4 h-4 text-zinc-300" />
              <span>Register Your Brand</span>
            </button>
          </div>

          {/* Feature Highlights beneath CTAs */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 w-full max-w-lg text-left">
            <div>
              <p className="text-base font-bold text-white">400 ms</p>
              <p className="text-[11px] text-zinc-400">Scan Latency</p>
            </div>
            <div>
              <p className="text-base font-bold text-white">₹0 Gas</p>
              <p className="text-[11px] text-zinc-400">100% Free for Buyers</p>
            </div>
            <div>
              <p className="text-base font-bold text-white">100%</p>
              <p className="text-[11px] text-zinc-400">Tamper-Proof</p>
            </div>
          </div>

        </div>

        {/* Right Column: Phone Mockup with Green Genuine Screen */}
        <div className="lg:col-span-5 flex justify-center">
          <PhoneMockup onOpenVerifySample={onOpenVerify} />
        </div>

      </div>

      {/* Quick Verify Box at the bottom of Hero */}
      <div className="relative z-30 mt-12 md:mt-16 w-full">
        <QuickVerifyBox onScanClick={onOpenVerify} onVerifyResult={onVerifyResult} />
      </div>

    </section>
  );
}
