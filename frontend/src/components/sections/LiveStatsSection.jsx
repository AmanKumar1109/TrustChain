import React, { useState, useEffect, useRef } from 'react';

const STATS = [
  { id: 'verified', label: 'Products Verified', base: 2845920, suffix: '+', isLive: true },
  { id: 'fakes', label: 'Fakes Reported', base: 41280, suffix: '' },
  { id: 'brands', label: 'Brands Onboarded', base: 184, suffix: '' },
  { id: 'cities', label: 'Cities Active', base: 52, suffix: '' },
];

function useCountUp(target, duration = 1800) {
  const [count, setCount] = useState(0);
  const startRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const startVal = 0;

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(startVal + eased * (target - startVal)));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return count;
}

function StatCard({ stat, liveCount }) {
  const displayVal = stat.isLive ? liveCount : stat.base;
  const formattedVal = displayVal >= 1000000
    ? (displayVal / 1000000).toFixed(1) + 'M'
    : displayVal >= 1000
    ? (displayVal / 1000).toFixed(1) + 'K'
    : displayVal.toString();

  return (
    <div className="bento-card p-7 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="badge-mono">Verified Metric</span>
        {stat.isLive && (
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-500">
            <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
            Live
          </span>
        )}
      </div>
      <div className="text-4xl sm:text-5xl font-light text-white tracking-tight leading-none">
        {formattedVal}{stat.suffix}
      </div>
      <p className="text-xs text-zinc-500 leading-relaxed">{stat.label}</p>
    </div>
  );
}

export default function LiveStatsSection() {
  const [liveCount, setLiveCount] = useState(STATS[0].base);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount((prev) => prev + Math.floor(Math.random() * 4) + 1);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full py-20 px-6 md:px-12 lg:px-20 border-y border-white/[0.06] bg-[#060709]">
      <div className="max-w-7xl mx-auto">

        {/* Live Network Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-10 pb-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-white/70 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
              Live Mainnet Protocol Telemetry
            </span>
          </div>
          <span className="font-mono text-[11px] text-zinc-600">
            Block #19,820,441 · Consensus Healthy
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat) => (
            <StatCard key={stat.id} stat={stat} liveCount={liveCount} />
          ))}
        </div>

      </div>
    </section>
  );
}
