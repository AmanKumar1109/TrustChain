import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

const HOTSPOTS = [
  {
    city: 'Mumbai',
    coordinates: '19.0760° N, 72.8777° E',
    incidentsBlocked: 8420,
    topSector: 'Cosmetics & Pharma',
    risk: 'High',
    mapX: '34%',
    mapY: '60%',
    size: 'md',
  },
  {
    city: 'Delhi',
    coordinates: '28.6139° N, 77.2090° E',
    incidentsBlocked: 14250,
    topSector: 'Electronics & Luxury',
    risk: 'Critical',
    mapX: '45%',
    mapY: '28%',
    size: 'lg',
    isActive: true,
  },
  {
    city: 'Bengaluru',
    coordinates: '12.9716° N, 77.5946° E',
    incidentsBlocked: 5180,
    topSector: 'Consumer Electronics',
    risk: 'Medium',
    mapX: '44%',
    mapY: '78%',
    size: 'sm',
  },
  {
    city: 'Kolkata',
    coordinates: '22.5726° N, 88.3639° E',
    incidentsBlocked: 6940,
    topSector: 'Apparel & FMCG',
    risk: 'High',
    mapX: '68%',
    mapY: '52%',
    size: 'sm',
  },
];

export default function FraudIntelligenceSection() {
  const [selected, setSelected] = useState(HOTSPOTS[1]);

  return (
    <section id="fraud-map" className="relative w-full py-28 px-6 md:px-12 lg:px-20 overflow-hidden bg-[#060709]">

      {/* Ambient glow */}
      <div
        className="absolute top-1/2 right-[-15%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.018) 0%, transparent 65%)',
          filter: 'blur(90px)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Label */}
        <div className="flex items-center justify-center mb-5">
          <span className="section-tag">Fraud Intelligence</span>
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-semibold tracking-tight text-white leading-[1.1] mb-5">
            Crowdsourced Counterfeit<br className="hidden sm:block" /> Intelligence
          </h2>
          <p className="text-zinc-500 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Every smartphone scan becomes a decentralized sensor. Duplicate cryptographic tags detected across locations pinpoint rogue syndicates in real time.
          </p>
        </div>

        {/* Main Dashboard */}
        <div className="bento-card p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* Left: Map Visualizer */}
          <div className="lg:col-span-7 relative rounded-2xl bg-[#0a0c12] border border-white/[0.07] overflow-hidden" style={{ minHeight: '380px' }}>

            {/* Dot Grid */}
            <div className="absolute inset-0 dot-grid opacity-60" />

            {/* Status Bar */}
            <div className="relative z-10 flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="font-mono text-[11px] text-zinc-400 uppercase tracking-wider">Telemetry Radar Active</span>
              </div>
              <span className="font-mono text-[11px] text-zinc-600">52 Cities Synchronized</span>
            </div>

            {/* Map Area */}
            <div className="relative w-full" style={{ height: '280px' }}>

              {/* India outline SVG (simplified) */}
              <svg
                className="absolute inset-0 w-full h-full opacity-[0.08] text-white"
                viewBox="0 0 500 380"
                fill="none"
                preserveAspectRatio="xMidYMid meet"
              >
                <path
                  d="M195,30 Q230,20 265,45 Q300,70 330,95 Q355,120 345,155 Q335,190 350,220 Q360,240 340,265 Q320,285 300,295 Q270,305 250,290 Q220,275 200,255 Q175,230 180,200 Q185,170 170,145 Q155,120 165,95 Q175,70 195,30 Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="5 5"
                />
              </svg>

              {/* Hotspot Markers */}
              {HOTSPOTS.map((h) => {
                const isSelected = selected.city === h.city;
                const dotSize = h.size === 'lg' ? 20 : h.size === 'md' ? 14 : 10;
                return (
                  <button
                    key={h.city}
                    onClick={() => setSelected(h)}
                    className="absolute flex flex-col items-center gap-1.5 cursor-pointer group"
                    style={{
                      left: h.mapX,
                      top: h.mapY,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <div className="relative">
                      {isSelected && (
                        <span
                          className="absolute inset-0 rounded-full bg-white/30 animate-ping"
                          style={{ inset: '-6px' }}
                        />
                      )}
                      <div
                        className={`rounded-full border-2 transition-all ${
                          isSelected
                            ? 'bg-white border-white shadow-[0_0_20px_rgba(255,255,255,0.6)]'
                            : 'bg-white/60 border-white/40 hover:bg-white/80 group-hover:scale-110'
                        }`}
                        style={{ width: dotSize, height: dotSize }}
                      />
                    </div>
                    <span className={`font-mono text-[10px] whitespace-nowrap px-2 py-0.5 rounded-full border ${
                      isSelected
                        ? 'text-white bg-[#151820] border-white/20'
                        : 'text-zinc-400 bg-[#0d0f14] border-white/[0.08]'
                    }`}>
                      {h.city}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Alert Bar */}
            <div className="relative z-10 mx-4 mb-4 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse shrink-0" />
              <span className="font-mono text-[11px] text-zinc-500 truncate">
                Duplicate tag cluster intercepted — 14 concurrent scans in Karol Bagh, Delhi
              </span>
            </div>
          </div>

          {/* Right: Dossier */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-5">

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="section-tag" style={{ marginBottom: 0 }}>Hotspot Dossier</div>
                <span className="badge-mono">{selected.risk}</span>
              </div>

              <h3 className="text-3xl font-light text-white tracking-tight mb-1">
                {selected.city}
              </h3>
              <p className="font-mono text-[11px] text-zinc-600 mb-6">
                {selected.coordinates}
              </p>

              <div className="space-y-2.5">
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Intercepted Cases</span>
                  <span className="font-mono text-lg font-semibold text-white">
                    {selected.incidentsBlocked.toLocaleString()}
                  </span>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex items-center justify-between">
                  <span className="text-xs text-zinc-500">High Risk Sector</span>
                  <span className="text-xs font-semibold text-white">{selected.topSector}</span>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Legal Evidence</span>
                  <span className="text-xs font-mono text-zinc-300 flex items-center gap-1">
                    Section 65B Ready
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs text-zinc-600 leading-relaxed">
              When a consumer scans an unverified copy, their device logs the GPS hotspot — empowering brand compliance raids with court-ready evidence.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
