import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Calendar,
  ShieldAlert,
  Building2,
  QrCode,
  Download,
  Filter,
} from 'lucide-react';

export const AdminAnalyticsScreen: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D' | '1Y'>('30D');

  const scanData = [
    { label: 'Week 1', scans: 1840000, fakes: 1420 },
    { label: 'Week 2', scans: 2150000, fakes: 1890 },
    { label: 'Week 3', scans: 2420000, fakes: 2100 },
    { label: 'Week 4', scans: 2790000, fakes: 1940 },
  ];

  const brandOnboardingData = [
    { month: 'May 2026', count: 18 },
    { month: 'Jun 2026', count: 32 },
    { month: 'Jul 2026', count: 48 },
    { month: 'Aug 2026', count: 64 },
    { month: 'Sep 2026', count: 86 },
  ];

  const fakeCategories = [
    { name: 'Pharmaceuticals & Inhalers', percentage: 44, color: 'bg-rose-500', count: '890 cases' },
    { name: 'Consumer Audio & Earphones', percentage: 28, color: 'bg-amber-500', count: '562 cases' },
    { name: 'Cosmetics & Skincare', percentage: 18, color: 'bg-purple-500', count: '364 cases' },
    { name: 'Automotive Spares', percentage: 10, color: 'bg-blue-500', count: '204 cases' },
  ];

  const geographyHotspots = [
    { city: 'Delhi NCR (Chandni Chowk / Gaffar)', share: '34%', count: '684 alerts' },
    { city: 'Mumbai MMR (Bandra / Crawford Mkt)', share: '24%', count: '482 alerts' },
    { city: 'Kolkata (Burrabazar Wholesale)', share: '18%', count: '362 alerts' },
    { city: 'Bengaluru (SP Road Tech Hub)', share: '14%', count: '280 alerts' },
    { city: 'Other Tier-2 Regions', share: '10%', count: '212 alerts' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-black">Network Macro Analytics</h2>
          <p className="text-xs text-black/50 mt-1">
            Aggregated intelligence on consumer verification velocity, clone vectors, and enterprise adoption
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(['7D', '30D', '90D', '1Y'] as const).map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setTimeRange(range)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                timeRange === range
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-white text-black/70 border border-black/10 hover:bg-black/5'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm space-y-2">
          <span className="text-[10px] font-semibold text-black/40 uppercase tracking-wider block">
            Scan Verification Growth
          </span>
          <div className="text-3xl font-medium tracking-tight text-black" style={{ letterSpacing: '-0.03em' }}>
            +28.4%
          </div>
          <span className="text-xs text-emerald-600 font-medium">9.2M total checks in {timeRange}</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm space-y-2">
          <span className="text-[10px] font-semibold text-black/40 uppercase tracking-wider block">
            Counterfeit Interception Rate
          </span>
          <div className="text-3xl font-medium tracking-tight text-rose-600" style={{ letterSpacing: '-0.03em' }}>
            0.082%
          </div>
          <span className="text-xs text-black/50">7,350 fakes stopped before consumption</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm space-y-2">
          <span className="text-[10px] font-semibold text-black/40 uppercase tracking-wider block">
            Brand Onboarding Velocity
          </span>
          <div className="text-3xl font-medium tracking-tight text-[#1E1A30]" style={{ letterSpacing: '-0.03em' }}>
            +22 Brands
          </div>
          <span className="text-xs text-emerald-600 font-medium">100% compliance SLA met</span>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Chart 1: Platform-wide Scans (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-black/5 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-black/5 pb-3">
            <div>
              <h3 className="text-base font-semibold text-black">Scan Traffic & Authenticity Verification</h3>
              <p className="text-xs text-black/50">Aggregated verification throughput by weekly cohort</p>
            </div>
            <span className="text-xs font-mono font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              99.92% Genuine Ratio
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {scanData.map((item, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-black/70 font-medium">
                  <span>{item.label}</span>
                  <span className="font-mono">{(item.scans / 1000000).toFixed(2)}M verifications</span>
                </div>
                <div className="h-4 bg-black/5 rounded-full overflow-hidden flex">
                  <div
                    className="bg-[#1E1A30] h-full rounded-full transition-all duration-500"
                    style={{ width: `${(item.scans / 3000000) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Brand Onboarding Velocity (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-black/5 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-black/5 pb-3">
            <h3 className="text-base font-semibold text-black">Brand Onboarding</h3>
            <span className="text-xs text-black/40">MoM Growth</span>
          </div>

          <div className="space-y-3 pt-1">
            {brandOnboardingData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-black/[0.03] last:border-0">
                <span className="text-black/60 font-medium">{item.month}</span>
                <span className="font-bold text-black font-mono">+{item.count} enterprise brands</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row: Fake Reports Categories & Geographic Dispersion */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Categories Breakdown (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-black/5 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-black/5 pb-3">
            <h3 className="text-base font-semibold text-black">Counterfeit Reports by Industry</h3>
            <span className="text-xs text-black/40">Risk Index</span>
          </div>

          <div className="space-y-3.5">
            {fakeCategories.map((cat, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-black">{cat.name}</span>
                  <span className="font-mono text-black/60">{cat.percentage}% ({cat.count})</span>
                </div>
                <div className="w-full bg-black/5 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`${cat.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Hotspots (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-black/5 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-black/5 pb-3">
            <h3 className="text-base font-semibold text-black">Geographical Incident Clusters</h3>
            <span className="text-xs text-black/40">Market Surveillance</span>
          </div>

          <div className="space-y-3">
            {geographyHotspots.map((geo, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-[#F5F5F5] rounded-2xl border border-black/5 text-xs"
              >
                <div className="font-medium text-black">{geo.city}</div>
                <div className="text-right">
                  <span className="font-bold text-rose-600 block">{geo.share}</span>
                  <span className="text-[10px] text-black/40">{geo.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsScreen;
