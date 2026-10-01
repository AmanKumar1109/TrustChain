import React from 'react';
import { ShieldCheck, CheckCircle2, QrCode, ExternalLink, Sparkles, Wifi, Battery, Signal } from 'lucide-react';

export default function PhoneMockup({ onOpenVerifySample }) {
  return (
    <div className="relative group max-w-sm mx-auto select-none">
      
      {/* White Ambient Backglow */}
      <div 
        className="absolute -inset-4 rounded-[50px] blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-700 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)' }}
      />

      {/* Titanium Frame */}
      <div className="relative rounded-[44px] p-3.5 bg-gradient-to-b from-[#262830] via-[#16181f] to-[#0c0d12] border border-white/20 shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(255,255,255,0.04)]">
        
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-end pr-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#181822] border border-white/10" />
        </div>

        {/* Screen Display */}
        <div className="relative w-full aspect-[9/18.5] rounded-[34px] bg-[#090b0e] overflow-hidden flex flex-col justify-between p-4 text-white border border-white/10">
          
          {/* Top Status Bar */}
          <div className="pt-2 px-3 flex items-center justify-between text-[11px] text-zinc-400 font-medium z-20">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Verification Screen Content */}
          <div className="flex-1 flex flex-col items-center justify-center text-center mt-3 z-10 px-2">
            
            {/* Pulsing Verified Seal — white glow */}
            <div className="relative mb-3">
              <div className="absolute inset-0 rounded-full bg-white/10 blur-xl animate-pulse" />
              <div className="relative w-20 h-20 rounded-full bg-white/[0.08] border-2 border-white/40 flex items-center justify-center shadow-[0_0_25px_rgba(255,255,255,0.2)]">
                <ShieldCheck className="w-10 h-10 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              </div>
            </div>

            {/* Status Pill — white */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/25 text-[11px] font-mono font-semibold text-white mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              GENUINE PRODUCT
            </span>

            <h4 className="text-sm font-bold text-white tracking-tight">
              Apex Pro Sound ANC
            </h4>
            <p className="text-[11px] text-zinc-400 mb-3">
              Certified by SonicAura Labs Pvt Ltd
            </p>

            {/* On-Chain Provenance Card */}
            <div className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-3 text-left space-y-2 mb-3">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-zinc-500">UID Serial:</span>
                <span className="font-mono text-zinc-200">PRD-9842-8821</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-zinc-500">Batch Code:</span>
                <span className="font-mono text-zinc-200">SAL-2024-B88</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-zinc-500">Blockchain Record:</span>
                <span className="font-mono text-zinc-300 flex items-center gap-0.5">
                  0x8f72...3e19
                  <ExternalLink className="w-2.5 h-2.5" />
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] pt-1 border-t border-white/5">
                <span className="text-zinc-500">Warranty:</span>
                <span className="text-white font-medium">2 Yrs Active</span>
              </div>
            </div>

            {/* Claim Reward Button */}
            <button
              onClick={onOpenVerifySample}
              className="w-full py-2.5 rounded-full bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:scale-[1.02]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Claim Warranty & +120 Pts</span>
            </button>

          </div>

          {/* Bottom Home Indicator */}
          <div className="w-24 h-1 bg-white/30 rounded-full mx-auto my-1" />
        </div>

      </div>

      {/* Floating Verification Tag — white */}
      <div className="absolute -bottom-4 -left-4 bg-[#141720]/90 border border-white/15 backdrop-blur-xl rounded-2xl px-4 py-2.5 shadow-xl flex items-center gap-3 animate-float-slow">
        <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center border border-white/20">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs font-semibold text-white">0 Duplicate Copies</p>
          <p className="text-[10px] text-zinc-500">Cryptographically Unique Tag</p>
        </div>
      </div>

    </div>
  );
}
