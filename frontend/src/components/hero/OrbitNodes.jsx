import React, { useState } from 'react';
import { ORBIT_NODES } from '../../data/nodes';

export default function OrbitNodes() {
  const [hoveredNode, setHoveredNode] = useState(null);

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10 overflow-hidden">
      {/* Circuit lines SVG spanning 100% width edge-to-edge */}
      <svg
        className="w-full h-full absolute inset-0"
        viewBox="0 0 1440 900"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="lineGlowLeft" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.04)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.2)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.06)" />
          </linearGradient>
          <linearGradient id="lineGlowRight" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.04)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.2)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.06)" />
          </linearGradient>
        </defs>

        {/* Top-Left Cortex Line */}
        <path
          d="M 0 250 Q 80 250, 130 250 T 170 250 Q 200 250, 230 230 T 290 230"
          fill="none"
          stroke="url(#lineGlowLeft)"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
        />

        {/* Bottom-Left Aelf Line */}
        <path
          d="M 0 540 Q 60 540, 110 540 T 150 540 Q 185 540, 215 570 T 270 570"
          fill="none"
          stroke="url(#lineGlowLeft)"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
        />

        {/* Top-Right Quant Line */}
        <path
          d="M 1440 270 Q 1340 270, 1280 270 T 1230 250 Q 1180 250, 1140 250"
          fill="none"
          stroke="url(#lineGlowRight)"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
        />

        {/* Bottom-Right Meeton Line */}
        <path
          d="M 1440 560 Q 1350 560, 1290 560 T 1240 570 Q 1190 570, 1150 530"
          fill="none"
          stroke="url(#lineGlowRight)"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* --- Node 1: Cortex (Top-Left) --- */}
      <div
        className="absolute top-[26%] left-[8%] md:left-[11%] lg:left-[13%] pointer-events-auto flex flex-col items-start gap-1 group cursor-pointer transition-transform duration-300 hover:scale-105"
        onMouseEnter={() => setHoveredNode('cortex')}
        onMouseLeave={() => setHoveredNode(null)}
      >
        <div className="flex items-center gap-2.5">
          {/* Badge */}
          <div className="w-8 h-8 rounded-full bg-[#181920]/90 border border-white/20 flex items-center justify-center text-zinc-300 shadow-[0_0_15px_rgba(255,255,255,0.06)] group-hover:border-white/40 group-hover:text-white transition-all">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2.2" strokeLinejoin="round">
              <polygon points="12 4 21 20 3 20" />
            </svg>
          </div>
        </div>

        {/* Label & Value */}
        <div className="ml-2.5 mt-1">
          <div className="flex items-center gap-1.5 text-zinc-200 group-hover:text-white transition-colors">
            <span className="w-1 h-1 rounded-full bg-zinc-400 group-hover:bg-white" />
            <span className="text-[13px] font-medium tracking-tight">Cortex</span>
          </div>
          <span className="text-[11px] font-mono text-zinc-500 pl-2.5">20.945</span>
        </div>
      </div>

      {/* --- Node 2: Aelf (Bottom-Left) --- */}
      <div
        className="absolute top-[54%] left-[6%] md:left-[9%] lg:left-[11%] pointer-events-auto flex flex-col items-start gap-1 group cursor-pointer transition-transform duration-300 hover:scale-105"
        onMouseEnter={() => setHoveredNode('aelf')}
        onMouseLeave={() => setHoveredNode(null)}
      >
        {/* Label & Value above badge */}
        <div className="ml-4 mb-1">
          <div className="flex items-center gap-1.5 text-zinc-200 group-hover:text-white transition-colors">
            <span className="w-1 h-1 rounded-full bg-zinc-400 group-hover:bg-white" />
            <span className="text-[13px] font-medium tracking-tight">Aelf</span>
          </div>
          <span className="text-[11px] font-mono text-zinc-500 pl-2.5">19.346</span>
        </div>

        {/* Badge */}
        <div className="w-8 h-8 rounded-full bg-[#181920]/90 border border-white/20 flex items-center justify-center text-zinc-300 shadow-[0_0_15px_rgba(255,255,255,0.06)] group-hover:border-white/40 group-hover:text-white transition-all">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
            <circle cx="12" cy="5" r="2.2" />
            <circle cx="12" cy="19" r="2.2" />
            <circle cx="5" cy="12" r="2.2" />
            <circle cx="19" cy="12" r="2.2" />
            <circle cx="12" cy="12" r="1.5" />
          </svg>
        </div>
      </div>

      {/* --- Node 3: Quant (Top-Right) --- */}
      <div
        className="absolute top-[28%] right-[11%] md:right-[14%] lg:right-[15%] pointer-events-auto flex items-center gap-3 group cursor-pointer transition-transform duration-300 hover:scale-105"
        onMouseEnter={() => setHoveredNode('quant')}
        onMouseLeave={() => setHoveredNode(null)}
      >
        {/* Label & Value */}
        <div className="text-right">
          <div className="flex items-center justify-end gap-1.5 text-zinc-200 group-hover:text-white transition-colors">
            <span className="w-1 h-1 rounded-full bg-zinc-400 group-hover:bg-white" />
            <span className="text-[13px] font-medium tracking-tight">Quant</span>
          </div>
          <span className="text-[11px] font-mono text-zinc-500 pr-0.5">2.945</span>
        </div>

        {/* Badge */}
        <div className="w-8 h-8 rounded-full bg-[#181920]/90 border border-white/20 flex items-center justify-center text-zinc-300 shadow-[0_0_15px_rgba(255,255,255,0.06)] group-hover:border-white/40 group-hover:text-white transition-all">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round">
            <path d="M12 3v5m0 8v5M3 12h5m8 0h5M5.6 5.6l3.5 3.5m5.8 5.8l3.5 3.5M18.4 5.6l-3.5 3.5m-5.8 5.8l-3.5 3.5" />
          </svg>
        </div>
      </div>

      {/* --- Node 4: Meeton (Bottom-Right) --- */}
      <div
        className="absolute top-[54%] right-[8%] md:right-[11%] lg:right-[12%] pointer-events-auto flex items-center gap-3 group cursor-pointer transition-transform duration-300 hover:scale-105"
        onMouseEnter={() => setHoveredNode('meeton')}
        onMouseLeave={() => setHoveredNode(null)}
      >
        {/* Label & Value */}
        <div className="text-right">
          <div className="flex items-center justify-end gap-1.5 text-zinc-200 group-hover:text-white transition-colors">
            <span className="w-1 h-1 rounded-full bg-zinc-400 group-hover:bg-white" />
            <span className="text-[13px] font-medium tracking-tight">Meeton</span>
          </div>
          <span className="text-[11px] font-mono text-zinc-500 pr-0.5">440</span>
        </div>

        {/* Badge */}
        <div className="w-8 h-8 rounded-full bg-[#181920]/90 border border-white/20 flex items-center justify-center text-zinc-300 shadow-[0_0_15px_rgba(255,255,255,0.06)] group-hover:border-white/40 group-hover:text-white transition-all">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="1.8">
            <path d="M12 3L18 7.5V16.5L12 21L6 16.5V7.5L12 3Z" />
            <path d="M12 3V21" strokeWidth="1.2" />
          </svg>
        </div>
      </div>
    </div>
  );
}
