import React from 'react';
import { X, Play } from 'lucide-react';

export default function VideoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl bg-[#12141a] border border-white/15 rounded-2xl p-6 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center border border-white/20">
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">One-click Asset Defense Overview</h3>
            <p className="text-zinc-400 text-xs">Learn how autonomous security secures cross-chain art assets</p>
          </div>
        </div>

        {/* Video placeholder display */}
        <div className="relative aspect-video w-full rounded-xl bg-[#08090d] border border-white/10 flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" />
          <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-3">
            <Play className="w-6 h-6 fill-white text-white ml-1" />
          </div>
          <span className="text-zinc-300 text-sm font-medium">Interactive Demo Simulation</span>
          <span className="text-zinc-500 text-xs mt-1">Ready for protocol integration</span>
        </div>
      </div>
    </div>
  );
}
