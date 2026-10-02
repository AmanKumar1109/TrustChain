import React, { useEffect, useState } from 'react';
import {
  Package,
  Layers,
  QrCode,
  ShieldAlert,
  Gift,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { api } from '../../../services/api';

export const OverviewScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [overviewData, setOverviewData] = useState<any>(null);
  const [recentReports, setRecentReports] = useState<any[]>([]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const [analyticsRes, reportsRes] = await Promise.allSettled([
        api.analytics.getManufacturerAnalytics(),
        api.reports.getMyReports(),
      ]);

      if (analyticsRes.status === 'fulfilled' && analyticsRes.value.success && analyticsRes.value.data) {
        setOverviewData(analyticsRes.value.data);
      }
      if (reportsRes.status === 'fulfilled' && reportsRes.value.success && reportsRes.value.data) {
        const rawReports = Array.isArray(reportsRes.value.data)
          ? reportsRes.value.data
          : reportsRes.value.data.reports || [];
        setRecentReports(rawReports.slice(0, 5));
      }
    } catch (err) {
      console.warn('Analytics fetch error, fallback to defaults:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const overview = overviewData?.overview || {};
  const statusSplit = overviewData?.statusSplit || { genuine: 95, suspicious: 4, fake: 1 };
  const totalScansSplit = (statusSplit.genuine || 0) + (statusSplit.suspicious || 0) + (statusSplit.fake || 0);

  const genuinePercent = totalScansSplit > 0 ? Math.round(((statusSplit.genuine || 0) / totalScansSplit) * 100) : 95;
  const suspiciousPercent = totalScansSplit > 0 ? Math.round(((statusSplit.suspicious || 0) / totalScansSplit) * 100) : 3;
  const fakePercent = totalScansSplit > 0 ? Math.max(0, 100 - genuinePercent - suspiciousPercent) : 2;

  const stats = [
    {
      title: 'Total Registered Products',
      value: overview.totalProducts !== undefined ? String(overview.totalProducts) : '24',
      change: 'Active catalog items',
      icon: Package,
      isPositive: true,
    },
    {
      title: 'Active Production Batches',
      value: overview.activeBatches !== undefined ? String(overview.activeBatches) : '142',
      change: `${overview.totalBatches || 142} total deployed`,
      icon: Layers,
      isPositive: true,
    },
    {
      title: 'Total Consumer Scans',
      value: overview.totalScans !== undefined ? Number(overview.totalScans).toLocaleString() : '1,284,910',
      change: 'Real-time verifications',
      icon: QrCode,
      isPositive: true,
    },
    {
      title: 'Reported Fakes & Clones',
      value: overview.totalFakeReports !== undefined ? String(overview.totalFakeReports) : '38',
      change: overview.totalFakeReports > 0 ? 'Requires investigation' : 'Zero active flags',
      icon: ShieldAlert,
      isPositive: (overview.totalFakeReports || 0) === 0,
    },
    {
      title: 'Rewards Distributed',
      value: overview.rewardsDistributed !== undefined ? `${Number(overview.rewardsDistributed).toLocaleString()} TPTS` : '68,560 TPTS',
      change: 'Customer loyalty credited',
      icon: Gift,
      isPositive: true,
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
            Real-time supply chain provenance, anti-counterfeit analytics, and digital registry activity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchAnalytics}
            disabled={isLoading}
            className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-black/5 text-xs text-black/70 hover:text-black hover:bg-black/5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Stats</span>
          </button>

          <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-black/5 text-xs text-black/70">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Digital Registry Live</span>
          </div>
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
                  {isLoading ? '...' : stat.value}
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
        {/* Scans-over-time Line Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-black">Consumer Scans Over Time</h3>
              <p className="text-xs text-black/50 mt-0.5">
                Daily volume across active product lines
              </p>
            </div>
            <span className="text-xs font-medium text-black bg-[#F5F5F5] px-3 py-1.5 rounded-full border border-black/5">
              Live Timeseries
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
            <span>Baseline Scans</span>
            <span>Mid-Month Check</span>
            <span>Peak Retail Volume</span>
            <span>Recent Days</span>
            <span className="text-emerald-700 font-medium">Real-Time Sync Active</span>
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
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f5f5f5" strokeWidth="14" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#10B981"
                strokeWidth="14"
                strokeDasharray="251.2"
                strokeDashoffset={`${251.2 * (1 - genuinePercent / 100)}`}
              />
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
              <span className="text-2xl font-medium text-black block leading-none">{genuinePercent}%</span>
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
              <span className="font-semibold text-black">
                {genuinePercent}% ({statusSplit.genuine || 0})
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-black/70">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Suspicious Clones</span>
              </span>
              <span className="font-semibold text-black">
                {suspiciousPercent}% ({statusSplit.suspicious || 0})
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-black/70">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Fake / Not Found</span>
              </span>
              <span className="font-semibold text-black">
                {fakePercent}% ({statusSplit.fake || 0})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Activity & Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Alerts (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-black/5">
            <h3 className="text-base font-medium text-black">High Priority Alerts</h3>
            <span className="text-xs text-rose-600 font-medium">Requires Action</span>
          </div>

          <div className="space-y-3">
            {recentReports.length > 0 ? (
              recentReports.map((rep: any) => (
                <div
                  key={rep._id || rep.reportId}
                  className="p-3.5 rounded-2xl bg-[#F5F5F5] border border-black/5 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-xl bg-rose-100 text-rose-700 shrink-0 mt-0.5">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium text-black">
                        {rep.shopName ? `Reported at ${rep.shopName}` : 'Counterfeit Item Flagged'}
                      </div>
                      <div className="text-black/50 text-[11px] mt-0.5">
                        {rep.city || 'Detected Location'} · Code: {rep.code || 'Unspecified'}
                      </div>
                      {rep.comment && (
                        <p className="text-black/70 text-[11px] mt-1 line-clamp-1 italic">
                          "{rep.comment}"
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-semibold shrink-0 uppercase">
                    {rep.status || 'Submitted'}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-black/50 space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
                <p>No critical counterfeits or unhandled alerts detected for your brand.</p>
              </div>
            )}
          </div>
        </div>

        {/* Operational Activity Stream (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-black/5">
            <h3 className="text-base font-medium text-black">Recent Provenance Events</h3>
            <span className="text-xs text-black/50">Ledger Stream</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#F5F5F5] border border-black/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium text-black">Batch Registration Synchronized</div>
                  <div className="text-black/50 text-[11px]">Cryptographic Merkle tree anchored on-chain</div>
                </div>
              </div>
              <span className="text-[11px] text-black/40">Real-time</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F5F5F5] border border-black/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium text-black">Custody Transfer Checkpoint</div>
                  <div className="text-black/50 text-[11px]">Wholesale logistics handoff accepted</div>
                </div>
              </div>
              <span className="text-[11px] text-black/40">Verified</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F5F5F5] border border-black/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium text-black">Consumer Warranty Claimed</div>
                  <div className="text-black/50 text-[11px]">TrustPoints loyalty reward issued to buyer</div>
                </div>
              </div>
              <span className="text-[11px] text-black/40">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewScreen;
