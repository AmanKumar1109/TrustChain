import React, { useState } from 'react';
import { ArrowUpRight, ArrowRight, QrCode, Search, Sparkles } from 'lucide-react';
import CenterBeams from './CenterBeams';

export default function HeroHeading({ onOpenVideo, onOpenVerify, onOpenAuth, onVerifyResult }) {
  const [quickCode, setQuickCode] = useState('');

  const handleQuickVerify = (e) => {
    e.preventDefault();
    if (!quickCode.trim()) return;
    onVerifyResult({
      status: 'GENUINE',
      productName: 'Apex Pro Sound ANC Headphones',
      brand: 'SonicAura Labs',
      batchNo: quickCode.toUpperCase(),
      mfgDate: '12 Jan 2026',
      factoryLocation: 'Sriperumbudur Certified Facility',
      blockchainTx: '0x8f72...3e19',
      custodyChain: [
        { step: 'Minted at Factory', location: 'Plant #4' },
        { step: 'Dispatched to Central Hub', location: 'Bhiwandi Hub' },
        { step: 'Retail Delivery Handshake', location: 'Point of Sale' },
      ],
      warrantyStatus: 'Active - 2 Years Manufacturer Warranty',
      rewardPoints: 120,
    });
  };

  return (
    <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-4xl mx-auto mt-6 md:mt-8">
      
      {/* Upper Play Video Action Button */}
      <button
        onClick={onOpenVideo}
        aria-label="Play introduction video"
        className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.18] border border-white/20 backdrop-blur-md flex items-center justify-center text-white/90 shadow-[0_0_20px_rgba(255,255,255,0.08)] transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer mb-5"
      >
        <svg
          className="w-3.5 h-3.5 fill-white/90 translate-x-[1px]"
          viewBox="0 0 24 24"
        >
          <polygon points="6 3 20 12 6 21 6 3" />
        </svg>
      </button>

      {/* Spark Notification Pill */}
      <button
        type="button"
        onClick={onOpenVerify}
        className="group inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-white/25 text-[12px] text-zinc-300 transition-all duration-300 backdrop-blur-md mb-6 cursor-pointer shadow-sm"
      >
        <span className="w-3.5 h-3.5 rounded-full bg-white/20 flex items-center justify-center text-[10px] text-white">
          ✦
        </span>
        <span className="font-medium tracking-tight">Unlock Your Assets Spark!</span>
        <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 group-hover:text-white transition-all duration-200" />
      </button>

      {/* Primary Hero Headline */}
      <h1 className="text-4xl sm:text-5xl md:text-[64px] font-medium leading-[1.08] tracking-[-0.03em] max-w-4xl mb-4 select-none">
        <span className="text-white">Scan. Verify. </span>
        <span className="bg-gradient-to-r from-white via-white/85 to-white/40 bg-clip-text text-transparent">
          Trust.
        </span>
      </h1>

      {/* Subtitle / Description */}
      <p className="text-zinc-400 text-sm sm:text-[15px] font-normal tracking-wide max-w-xl mx-auto leading-relaxed mb-7">
        A Trust Protocol for Physical Goods, where innovative blockchain technology meets consumer defense
      </p>

      {/* Call to Action Buttons matching exact reference style */}
      <div className="flex items-center justify-center gap-3.5 z-20 mb-3">
        {/* Verify a Product (matches Open App ↗) */}
        <button
          type="button"
          onClick={onOpenVerify}
          className="px-6 py-2.5 rounded-full bg-[#191b22]/90 hover:bg-[#232630] text-white text-[13.5px] font-medium border border-white/15 hover:border-white/30 transition-all duration-200 flex items-center gap-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.4)] cursor-pointer hover:shadow-[0_0_15px_rgba(255,255,255,0.06)]"
        >
          <span>Verify a Product</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
        </button>

        {/* Register Your Brand (matches Discover More) */}
        <button
          type="button"
          onClick={() => onOpenAuth('brand')}
          className="px-6 py-2.5 rounded-full bg-white hover:bg-zinc-100 text-black text-[13.5px] font-semibold transition-all duration-200 shadow-[0_4px_25px_rgba(255,255,255,0.18)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          Register Your Brand
        </button>
      </div>

      {/* Vertical Light Beams directly under CTAs */}
      <div className="w-full mt-2 flex justify-center">
        <CenterBeams />
      </div>

      {/* Sleek Floating Quick Verify Bar (Item #3 - Instant result bina login) */}
      <div className="w-full max-w-md mx-auto -mt-6 z-20">
        <form
          onSubmit={handleQuickVerify}
          className="flex items-center gap-2 p-1.5 bg-[#14161e]/85 border border-white/15 rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.7)] backdrop-blur-xl"
        >
          <div className="relative flex-1 flex items-center pl-3">
            <Search className="w-3.5 h-3.5 text-zinc-500 mr-2" />
            <input
              type="text"
              placeholder="Quick Verify UID (e.g. PRD-9842)"
              value={quickCode}
              onChange={(e) => setQuickCode(e.target.value)}
              className="w-full bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none font-mono uppercase"
            />
          </div>

          <button
            type="button"
            onClick={onOpenVerify}
            className="p-2 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-zinc-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Scan QR Code"
          >
            <QrCode className="w-3.5 h-3.5" />
          </button>

          <button
            type="submit"
            className="px-4 py-1.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-colors cursor-pointer shrink-0"
          >
            Verify
          </button>
        </form>
        <span className="text-[10px] text-zinc-500 font-mono mt-1.5 block">
          ⚡ Instant on-chain check (Zero login required)
        </span>
      </div>

    </div>
  );
}
