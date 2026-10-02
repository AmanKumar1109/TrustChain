import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  Clock,
  MapPin,
  TrendingUp,
  Download,
  Filter,
} from 'lucide-react';

export const ScanAnalyticsScreen: React.FC = () => {
  const [dateRange, setDateRange] = useState('Last 30 Days');

  const cityData = [
    { city: 'Delhi NCR', scans: 342100, genuineRate: '96.2%', color: 'bg-emerald-500' },
    { city: 'Mumbai', scans: 289400, genuineRate: '97.5%', color: 'bg-emerald-500' },
    { city: 'Bengaluru', scans: 241000, genuineRate: '92.8%', color: 'bg-amber-500' },
    { city: 'Hyderabad', scans: 198500, genuineRate: '98.1%', color: 'bg-emerald-500' },
    { city: 'Jaipur', scans: 112000, genuineRate: '91.4%', color: 'bg-amber-500' },
  ];

  const batchPerformance = [
    {
      batch: 'BATCH-2026-DEL99',
      product: 'Cipla Asthalin Inhaler',
      totalUnits: 10000,
      scannedCount: 8420,
      uniqueCities: 18,
      clonesDetected: 2,
      healthScore: '98%',
    },
    {
      batch: 'BATCH-2026-MUM14',
      product: 'Cipla Montair-LC Tablets',
      totalUnits: 25000,
      scannedCount: 19200,
      uniqueCities: 32,
      clonesDetected: 1,
      healthScore: '99%',
    },
    {
      batch: 'BT-8820-AUDIO',
      product: 'boAt Rockerz 450 Pro',
      totalUnits: 5000,
      scannedCount: 4890,
      uniqueCities: 14,
      clonesDetected: 14,
      healthScore: '82%',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header with Date Range Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2
            className="text-3xl font-medium tracking-tight text-black"
            style={{ letterSpacing: '-0.03em' }}
          >
            Scan Analytics & Velocity
          </h2>
          <p className="text-black/60 text-sm mt-1">
            Analyze time-wise consumer scanning patterns, regional distributions, and batch health metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-black/5 text-xs text-black font-medium shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-black/50" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last 90 Days">Last 90 Days</option>
              <option value="Year to Date">Year to Date (2026)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => alert('Exporting Analytics CSV...')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white text-xs font-medium rounded-full hover:bg-gray-800 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2-Column Charts: Hourly Time-wise Scans & City-wise Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Time-wise Hourly Scan Distribution (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-medium text-black">Scan Frequency by Hour of Day</h3>
              <p className="text-xs text-black/50">Consumer purchase & verification velocity</p>
            </div>
            <span className="text-xs font-medium text-black/50 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Peak: 6 PM - 9 PM
            </span>
          </div>

          {/* Bar Chart Representation */}
          <div className="h-48 flex items-end gap-2 pt-4 border-b border-black/5">
            {[
              { hr: '6 AM', val: 15 },
              { hr: '8 AM', val: 35 },
              { hr: '10 AM', val: 65 },
              { hr: '12 PM', val: 80 },
              { hr: '2 PM', val: 60 },
              { hr: '4 PM', val: 75 },
              { hr: '6 PM', val: 95 },
              { hr: '8 PM', val: 100 },
              { hr: '10 PM', val: 50 },
              { hr: '12 AM', val: 20 },
            ].map((bar) => (
              <div key={bar.hr} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                <div
                  style={{ height: `${bar.val}%` }}
                  className="w-full bg-black group-hover:bg-emerald-500 rounded-t-lg transition-all relative"
                >
                  <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] px-1.5 py-0.5 rounded pointer-events-none transition-opacity">
                    {bar.val * 540}
                  </span>
                </div>
                <span className="text-[9px] text-black/40 whitespace-nowrap mt-1">{bar.hr}</span>
              </div>
            ))}
          </div>
        </div>

        {/* City-wise Performance Progress Bars (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-medium text-black">Top Regional Scan Markets</h3>
            <p className="text-xs text-black/50 mb-6">Scan volume and authenticity integrity</p>

            <div className="space-y-4">
              {cityData.map((c) => (
                <div key={c.city} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-black">{c.city}</span>
                    <span className="text-black/60">
                      {c.scans.toLocaleString()} scans ·{' '}
                      <strong className="text-black">{c.genuineRate} Genuine</strong>
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#F5F5F5] overflow-hidden">
                    <div
                      style={{ width: `${(c.scans / 350000) * 100}%` }}
                      className={`h-full rounded-full ${c.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-black/5 flex items-center justify-between text-xs text-black/50">
            <span>Overall National Genuine Rate:</span>
            <span className="font-semibold text-emerald-800">95.4% Authenticated</span>
          </div>
        </div>
      </div>

      {/* Batch-wise Performance Table */}
      <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-black/5 flex items-center justify-between">
          <div>
            <h3 className="text-base font-medium text-black">Batch-Wise Integrity Scorecard</h3>
            <p className="text-xs text-black/50">Individual performance metrics per production batch</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-black/5 bg-[#F5F5F5]/60 text-black/50 uppercase font-semibold">
                <th className="p-4 pl-6">Batch ID</th>
                <th className="p-4">Product Line</th>
                <th className="p-4">Total Minted</th>
                <th className="p-4">Consumer Scans</th>
                <th className="p-4">Unique Cities</th>
                <th className="p-4">Clones Flagged</th>
                <th className="p-4 pr-6">Health Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {batchPerformance.map((b) => (
                <tr key={b.batch} className="hover:bg-black/[0.01] transition-colors">
                  <td className="p-4 pl-6 font-mono font-medium text-black">{b.batch}</td>
                  <td className="p-4 font-medium text-black">{b.product}</td>
                  <td className="p-4 text-black/70">{b.totalUnits.toLocaleString()}</td>
                  <td className="p-4 font-semibold text-black">{b.scannedCount.toLocaleString()}</td>
                  <td className="p-4 text-black/70">{b.uniqueCities} cities</td>
                  <td className="p-4">
                    <span
                      className={`font-semibold ${
                        b.clonesDetected > 5 ? 'text-rose-600' : 'text-emerald-700'
                      }`}
                    >
                      {b.clonesDetected} anomaly scans
                    </span>
                  </td>
                  <td className="p-4 pr-6">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {b.healthScore}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ScanAnalyticsScreen;
