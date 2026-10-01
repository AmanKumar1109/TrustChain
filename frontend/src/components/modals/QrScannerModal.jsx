import React, { useState, useEffect } from 'react';
import { X, Camera, QrCode } from 'lucide-react';
import { MOCK_VERIFY_DATABASE } from '../../data/landingData';

export default function QrScannerModal({ isOpen, onClose, onSelectResult }) {
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setScanning(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSimulateScan = (code) => {
    setScanning(true);
    setTimeout(() => {
      onSelectResult(MOCK_VERIFY_DATABASE[code]);
      onClose();
    }, 700);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#0e1015] border border-white/15 rounded-3xl p-6 shadow-2xl text-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close scanner modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-center gap-2 mb-4">
          <Camera className="w-5 h-5 text-zinc-300" />
          <h3 className="text-white font-semibold text-lg">Instant QR Camera Scanner</h3>
        </div>
        <p className="text-zinc-500 text-xs mb-5">
          Align any Paradox trust tag inside the viewfinder. No login or app installation required.
        </p>

        {/* Viewfinder simulation */}
        <div className="relative aspect-square w-64 max-w-full mx-auto rounded-2xl bg-black/60 border border-white/15 overflow-hidden flex items-center justify-center mb-6">
          {/* Corner frame brackets — white */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-white/60 rounded-tl-md" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-white/60 rounded-tr-md" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-white/60 rounded-bl-md" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-white/60 rounded-br-md" />

          {/* Animated Laser Scanning Line — white */}
          <div
            className="absolute inset-x-4 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_10px_rgba(255,255,255,0.6)] animate-scan-line"
          />

          <div className="flex flex-col items-center gap-2 opacity-40">
            <QrCode className="w-24 h-24 text-white" />
            <span className="text-[11px] font-mono text-zinc-400">READING_CRYPTOGRAPHIC_LAYER</span>
          </div>
        </div>

        {/* Demo sample tags */}
        <div className="space-y-2 text-left">
          <span className="text-[11px] font-mono text-zinc-600 uppercase tracking-wider block text-center mb-2">
            Tap a demo sample tag to test:
          </span>

          <button
            onClick={() => handleSimulateScan('PRD-9842-8821')}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 transition-all text-xs cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-white/60" />
              <div>
                <p className="font-semibold text-white">Apex Pro ANC Headphones</p>
                <p className="text-[11px] text-zinc-500">Tag: PRD-9842-8821 (Genuine)</p>
              </div>
            </div>
            <span className="text-zinc-400 font-mono text-[11px] group-hover:text-white transition-colors">Scan →</span>
          </button>

          <button
            onClick={() => handleSimulateScan('MED-3310-9014')}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 transition-all text-xs cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-white/60" />
              <div>
                <p className="font-semibold text-white">VitalGluc 500mg LifeSciences</p>
                <p className="text-[11px] text-zinc-500">Tag: MED-3310-9014 (Pharma)</p>
              </div>
            </div>
            <span className="text-zinc-400 font-mono text-[11px] group-hover:text-white transition-colors">Scan →</span>
          </button>

          <button
            onClick={() => handleSimulateScan('FAKE-9999-0000')}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 hover:border-red-500/40 transition-all text-xs cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <div>
                <p className="font-semibold text-red-300">Flagged Duplicate / Cloned Batch</p>
                <p className="text-[11px] text-zinc-500">Tag: FAKE-9999-0000 (Counterfeit Alert)</p>
              </div>
            </div>
            <span className="text-red-400 font-mono text-[11px]">Test Alert →</span>
          </button>
        </div>
      </div>
    </div>
  );
}
