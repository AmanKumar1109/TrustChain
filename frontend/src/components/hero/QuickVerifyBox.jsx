import React, { useState } from 'react';
import { QrCode, Search, ShieldCheck, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { MOCK_VERIFY_DATABASE } from '../../data/landingData';

export default function QuickVerifyBox({ onScanClick, onVerifyResult }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleManualVerify = (e) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();

    if (!cleanCode) {
      setError('Please enter a serial or UID code');
      return;
    }

    if (MOCK_VERIFY_DATABASE[cleanCode]) {
      setError('');
      onVerifyResult(MOCK_VERIFY_DATABASE[cleanCode]);
    } else {
      // Create instant simulated verified result for arbitrary codes
      setError('');
      onVerifyResult({
        status: 'GENUINE',
        productName: `Authorized Authenticated Good (${cleanCode})`,
        brand: 'Paradox Verified Merchant',
        batchNo: `BATCH-${cleanCode.slice(-4) || '9921'}`,
        mfgDate: '15 Feb 2026',
        factoryLocation: 'Direct Manufacturer Line',
        blockchainTx: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
        custodyChain: [
          { step: 'Factory Cryptographic Twin Minted', location: 'Industrial Node 1' },
          { step: 'Transit Checkpoint Passed', location: 'Logistics Hub' },
          { step: 'Retail Delivery Authenticated', location: 'Point of Sale' },
        ],
        warrantyStatus: 'Standard 1 Year Guarantee',
        rewardPoints: 100,
      });
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto z-30">
      
      {/* Outer ambient glow */}
      <div className="absolute -inset-1 rounded-3xl blur-xl opacity-30" style={{ background: 'radial-gradient(ellipse, rgba(255,255,255,0.12) 0%, transparent 70%)' }} />

      {/* Main Glass Card */}
      <div className="relative bg-[#0d0f14]/90 border border-white/15 rounded-3xl p-5 md:p-6 backdrop-blur-2xl shadow-[0_15px_50px_rgba(0,0,0,0.8)]">
        
        {/* Top Header Tag */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white/60 animate-pulse" />
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Instant Public Verification Box
            </h3>
          </div>
          <span className="text-[11px] font-mono text-zinc-400 bg-white/[0.05] border border-white/10 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Zap className="w-3 h-3" />
            <span>Bina Login Ke Direct Result (Instant)</span>
          </span>
        </div>

        {/* Input & Scan Form */}
        <form onSubmit={handleManualVerify} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            
            {/* Manual Code Input */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter 12-digit UID (e.g. PRD-9842-8821)"
                value={code}
                onChange={(e) => { setCode(e.target.value); setError(''); }}
                className="w-full bg-[#14161f] border border-white/10 hover:border-white/20 focus:border-white/35 rounded-2xl pl-11 pr-4 py-3 text-xs md:text-sm text-white placeholder-zinc-600 focus:outline-none transition-all shadow-inner font-mono uppercase"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs md:text-sm transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <span>Verify Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* QR Scan Button */}
            <button
              type="button"
              onClick={onScanClick}
              className="px-5 py-3 rounded-2xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/15 text-zinc-200 font-semibold text-xs md:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 group"
            >
              <QrCode className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Scan QR</span>
            </button>

          </div>

          {error && (
            <p className="text-red-400 text-xs pl-2 font-medium">{error}</p>
          )}

          {/* Quick Demo Tag Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-zinc-400">
            <span className="font-mono text-zinc-500">Quick test:</span>
            <button
              type="button"
              onClick={() => { setCode('PRD-9842-8821'); }}
              className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 font-mono transition-colors cursor-pointer border border-white/5"
            >
              PRD-9842-8821 (Headphones)
            </button>
            <button
              type="button"
              onClick={() => { setCode('MED-3310-9014'); }}
              className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 font-mono transition-colors cursor-pointer border border-white/5"
            >
              MED-3310-9014 (Pharma)
            </button>
            <button
              type="button"
              onClick={() => { setCode('FAKE-9999-0000'); }}
              className="px-2.5 py-1 rounded-lg bg-red-950/20 hover:bg-red-950/40 text-red-300 font-mono transition-colors cursor-pointer border border-red-500/20"
            >
              FAKE-9999-0000 (Counterfeit Alert)
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
