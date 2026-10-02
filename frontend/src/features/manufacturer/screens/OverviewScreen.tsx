import React from 'react';
import {
  Package,
  Layers,
  QrCode,
  ShieldAlert,
  Gift,
  TrendingUp,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

export const OverviewScreen: React.FC = () => {
  const stats = [
    {
      title: 'Total Registered Products',
      value: '24',
      change: '+3 this month',
      icon: Package,
      isPositive: true,
    },
    {
      title: 'Active Polygon Batches',
      value: '142',
      change: '98.6% mint success',
      icon: Layers,
      isPositive: true,
    },
    {
      title: 'Total Consumer Scans',
      value: '1,284,910',
      change: '+18.4% vs last mo',
      icon: QrCode,
      isPositive: true,
    },
    {
      title: 'Reported Fakes & Clones',
      value: '38',
      change: '6 critical alerts',
      icon: ShieldAlert,
      isPositive: false,
    },
    {
      title: 'Rewards Distributed',
      value: '₹3,42,800',
      change: '68,560 TrustPoints',
      icon: Gift,
      isPositive: true,
    },
  ];

  const recentAlerts = [
    {
      id: 'alt-1',
      title: 'High Velocity Clone Detected',
      location: 'Bengaluru & Delhi (2 cities in 5 mins)',
      batch: 'Batch #BT-8820',
      time: '14 mins ago',
      type: 'critical',
    },
    {
      id: 'alt-2',
      title: 'Unregistered Code Scanned',
      location: 'Chandni Chowk, Delhi',
      batch: 'Invalid Serial Code',
      time: '1 hour ago',
      type: 'warning',
    },
    {
      id: 'alt-3',
      title: 'Custody Handoff Verified',
      location: 'Bhiwandi Hub -> Apollo Pharmacy',
      batch: 'Batch #DEL99',
      time: '3 hours ago',
      type: 'success',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Title & Intro */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2
            className="text-3xl font-medium tracking-tight text-black"
            style={{ letterSpacing: '-0.03em' }}
          >
            Brand Overview
          </h2>
          <p className="text-black/60 text-sm mt-1">
            Real-time supply chain provenance, anti-counterfeit analytics, and Polygon blockchain activity.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-black/5 text-xs text-black/70">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Real-time Polygon Sync</span>
        </div>
      </div>

      {/* 5 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-3xl p-5 border border-black/5 shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-black/50 font-medium leading-snug">
                  {stat.title}
                </span>
                <div className="w-8 h-8 rounded-xl bg-black/5 flex items-center justify-center text-black">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div
                  className="text-2xl font-medium text-black tracking-tight"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  {stat.value}
                </div>
                <div
                  className={`text-[11px] font-medium mt-1 ${
                    stat.isPositive ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {stat.change}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid: Scans Over Time & Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scans-over-time Line Chart simulation (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-black">Consumer Scans Over Time</h3>
              <p className="text-xs text-black/50 mt-0.5">Daily volume across 24 product lines (Last 30 Days)</p>
            </div>
            <span className="text-xs font-medium text-black bg-[#F5F5F5] px-3 py-1.5 rounded-full border border-black/5">
              Sept 2026
            </span>
          </div>

          {/* SVG Line Chart */}
          <div className="h-56 w-full pt-4">
            <svg viewBox="0 0 700 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="scanGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="40" x2="700" y2="40" stroke="#f0f0f0" strokeDasharray="4 4" />
              <line x1="0" y1="90" x2="700" y2="90" stroke="#f0f0f0" strokeDasharray="4 4" />
              <line x1="0" y1="140" x2="700" y2="140" stroke="#f0f0f0" strokeDasharray="4 4" />
              <line x1="0" y1="190" x2="700" y2="190" stroke="#e5e5e5" />

              {/* Area */}
              <path
                d="M 0 160 Q 70 140, 140 120 T 280 80 T 420 95 T 560 45 T 700 30 L 700 190 L 0 190 Z"
                fill="url(#scanGradient)"
              />

              {/* Line */}
              <path
                d="M 0 160 Q 70 140, 140 120 T 280 80 T 420 95 T 560 45 T 700 30"
                fill="none"
                stroke="#000000"
                strokeWidth="2.5"
              />

              {/* Data Points */}
              <circle cx="140" cy="120" r="4" fill="#000000" />
              <circle cx="280" cy="80" r="4" fill="#000000" />
              <circle cx="420" cy="95" r="4" fill="#000000" />
              <circle cx="560" cy="45" r="4" fill="#000000" />
              <circle cx="700" cy="30" r="4" fill="#10B981" />
            </svg>
          </div>

          <div className="flex justify-between text-[11px] text-black/40 mt-3 pt-3 border-t border-black/5">
            <span>Sep 01</span>
            <span>Sep 08</span>
            <span>Sep 15</span>
            <span>Sep 22</span>
            <span>Today (Peak 54,200 scans/day)</span>
          </div>
        </div>

        {/* Genuine vs Suspicious vs Fake Donut Chart (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-medium text-black">Scan Authenticity Ratio</h3>
            <p className="text-xs text-black/50 mt-0.5">Verification integrity score</p>
          </div>

          {/* Donut representation */}
          <div className="relative w-44 h-44 mx-auto my-4 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              {/* Background circle */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f5f5f5" strokeWidth="14" />
              {/* Genuine (95%) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#10B981"
                strokeWidth="14"
                strokeDasharray="251.2"
                strokeDashoffset="12.56"
              />
              {/* Suspicious (3.5%) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#F59E0B"
                strokeWidth="14"
                strokeDasharray="251.2"
                strokeDashoffset="242"
              />
              {/* Fake (1.5%) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#F43F5E"
                strokeWidth="14"
                strokeDasharray="251.2"
                strokeDashoffset="247"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-2xl font-medium text-black block leading-none">95%</span>
              <span className="text-[10px] text-black/50 font-semibold uppercase tracking-wider">
                Genuine
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-black/70">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Genuine Verified</span>
              </span>
              <span className="font-semibold text-black">95.0% (1,220,664)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-black/70">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Suspicious Clones</span>
              </span>
              <span className="font-semibold text-black">3.5% (44,971)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-black/70">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Fake / Not Found</span>
              </span>
              <span className="font-semibold text-black">1.5% (19,275)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Activity Feed & Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Alerts (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-black/5">
            <h3 className="text-base font-medium text-black">High Priority Alerts</h3>
            <span className="text-xs text-rose-600 font-medium">Requires Action</span>
          </div>

          <div className="space-y-3">
            {recentAlerts.map((alt) => (
              <div
                key={alt.id}
                className="p-3.5 rounded-2xl bg-[#F5F5F5] border border-black/5 flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-2.5">
                  <AlertTriangle
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      alt.type === 'critical'
                        ? 'text-rose-600'
                        : alt.type === 'warning'
                        ? 'text-amber-600'
                        : 'text-emerald-600'
                    }`}
                  />
                  <div>
                    <span className="font-semibold text-black block">{alt.title}</span>
                    <span className="text-black/60 block mt-0.5">{alt.location}</span>
                    <span className="font-mono text-[10px] text-black/50">{alt.batch}</span>
                  </div>
                </div>
                <span className="text-[10px] text-black/40 shrink-0">{alt.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Feed (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-black/5">
            <h3 className="text-base font-medium text-black">Recent Activity Feed</h3>
            <span className="text-xs text-black/50">Live Polygon Log</span>
          </div>

          <div className="space-y-3.5 text-xs text-black/70">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>5,000 QR codes minted on Polygon block #62,819,401</span>
              </span>
              <span className="text-black/40">18m ago</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>+50 TrustPoints claimed by consumer (+91 98214...)</span>
              </span>
              <span className="text-black/40">32m ago</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-black/60" />
                <span>New Batch #DEL-104 assigned to Bhiwandi Hub</span>
              </span>
              <span className="text-black/40">2h ago</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                <span>Hotspot geo-alert pinned in Jaipur retail quadrant</span>
              </span>
              <span className="text-black/40">4h ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewScreen;
