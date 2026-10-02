import React from 'react';
import {
  Building2,
  Package,
  QrCode,
  ShieldAlert,
  Coins,
  Activity,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { AdminTab } from '../types';

interface AdminOverviewScreenProps {
  onNavigateTab: (tab: AdminTab) => void;
}

export const AdminOverviewScreen: React.FC<AdminOverviewScreenProps> = ({ onNavigateTab }) => {
  const stats = [
    {
      title: 'Active Brand Partners',
      value: '248',
      change: '+14 this month',
      trend: 'up',
      icon: Building2,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'Protected Units In Circulation',
      value: '42.8M',
      change: '+1.2M this week',
      trend: 'up',
      icon: Package,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      title: 'Total Scans Verified',
      value: '8,419,204',
      change: '+12.4% vs last week',
      trend: 'up',
      icon: QrCode,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      title: 'Active Fake Alerts',
      value: '14',
      change: '3 require law enforcement report',
      trend: 'down',
      icon: ShieldAlert,
      color: 'text-rose-600 bg-rose-50',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-black">Platform Mission Control</h2>
          <p className="text-xs text-black/50 mt-1">
            Real-time monitoring of decentralized brand verifications, clone threats, and gas relayers
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigateTab('brand-approvals')}
            className="px-4 py-2 bg-[#1E1A30] text-white text-xs font-semibold rounded-full hover:bg-black transition-all shadow-sm flex items-center gap-1.5"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>3 Pending Approvals</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('fake-reports')}
            className="px-4 py-2 bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold rounded-full hover:bg-rose-100 transition-all flex items-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>5 Unresolved Reports</span>
          </button>
        </div>
      </div>

      {/* High-Level Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl p-5 border border-black/5 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-black/50 uppercase tracking-wider">
                  {s.title}
                </span>
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${s.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <span className="text-3xl font-medium tracking-tight text-black" style={{ letterSpacing: '-0.03em' }}>
                  {s.value}
                </span>
                <div className="flex items-center gap-1 text-xs text-emerald-600 mt-1 font-medium">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{s.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Activity Chart & Real-Time Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Platform Activity Chart */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-black/5 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 pb-4">
            <div>
              <h3 className="text-base font-semibold text-black">Cryptographic Scan Volume vs Anomaly Detections</h3>
              <p className="text-xs text-black/50">Past 7 days across India & Southeast Asia retail hubs</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-black">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1E1A30]" /> Genuine Scans
              </span>
              <span className="flex items-center gap-1.5 text-rose-600">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Clones Blocked
              </span>
            </div>
          </div>

          {/* Simulated Visual Chart Bars */}
          <div className="space-y-4 pt-2">
            {[
              { day: 'Mon, 25 Sep', genuine: '1.14M', clones: '142', genPct: '88%', clonePct: '12%' },
              { day: 'Tue, 26 Sep', genuine: '1.28M', clones: '189', genPct: '94%', clonePct: '18%' },
              { day: 'Wed, 27 Sep', genuine: '1.09M', clones: '94', genPct: '82%', clonePct: '9%' },
              { day: 'Thu, 28 Sep', genuine: '1.35M', clones: '312', genPct: '98%', clonePct: '28%' },
              { day: 'Fri, 29 Sep', genuine: '1.42M', clones: '205', genPct: '100%', clonePct: '21%' },
              { day: 'Sat, 30 Sep', genuine: '1.18M', clones: '118', genPct: '86%', clonePct: '11%' },
              { day: 'Today, 01 Oct', genuine: '920K', clones: '64', genPct: '72%', clonePct: '7%' },
            ].map((row, i) => (
              <div key={i} className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-black/60">
                  <span className="font-medium text-black">{row.day}</span>
                  <div className="space-x-3 font-mono">
                    <span className="font-semibold text-black">{row.genuine} genuine</span>
                    <span className="text-rose-600 font-semibold">{row.clones} flagged</span>
                  </div>
                </div>
                <div className="h-3 w-full bg-black/5 rounded-full overflow-hidden flex gap-1 p-0.5">
                  <div
                    className="bg-[#1E1A30] h-full rounded-full transition-all duration-500"
                    style={{ width: row.genPct }}
                  />
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all duration-500"
                    style={{ width: row.clonePct }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (4 cols): Real-Time Operational Alerts */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-black/5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-black/5">
            <h3 className="text-base font-semibold text-black">Live Threat Feed</h3>
            <span className="text-[10px] uppercase font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
              Live Stream
            </span>
          </div>

          <div className="space-y-3.5">
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl space-y-1">
              <div className="flex items-center justify-between text-rose-950 font-semibold text-xs">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Dual-Scan Clone Flag
                </span>
                <span className="text-[10px] text-rose-700 font-mono">2m ago</span>
              </div>
              <p className="text-[11px] text-rose-900 leading-snug">
                QR #CIP-8821 scanned in Delhi & Chennai within 4 minutes. Batch quarantined automatically.
              </p>
            </div>

            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
              <div className="flex items-center justify-between text-amber-950 font-semibold text-xs">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  New Manufacturer Application
                </span>
                <span className="text-[10px] text-amber-800 font-mono">18m ago</span>
              </div>
              <p className="text-[11px] text-amber-900 leading-snug">
                Cadila Pharmaceuticals uploaded GSTIN & Trademark docs. Awaiting compliance check.
              </p>
            </div>

            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl space-y-1">
              <div className="flex items-center justify-between text-blue-950 font-semibold text-xs">
                <span className="flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-blue-600" />
                  Bounty Disbursement
                </span>
                <span className="text-[10px] text-blue-800 font-mono">1h ago</span>
              </div>
              <p className="text-[11px] text-blue-900 leading-snug">
                500 TrustPoints credited to user (+91 98765...) for valid counterfeit syrup report.
              </p>
            </div>

            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
              <div className="flex items-center justify-between text-emerald-950 font-semibold text-xs">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  Polygon Relayer Heartbeat
                </span>
                <span className="text-[10px] text-emerald-800 font-mono">2h ago</span>
              </div>
              <p className="text-[11px] text-emerald-900 leading-snug">
                All 14 RPC endpoints responding with under 42ms latency. Gas subsidy pool full.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('system-health')}
            className="w-full py-2.5 bg-[#F5F5F5] hover:bg-black/5 text-black text-xs font-semibold rounded-2xl transition-colors flex items-center justify-center gap-1.5"
          >
            <span>View Full Infrastructure Telemetry</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewScreen;
