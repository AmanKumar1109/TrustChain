import React from 'react';
import {
  Star,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { PartnerRole } from '../types';

export const ReputationScreen: React.FC<{ role: PartnerRole }> = () => {
  const scoreHistory = [
    {
      date: 'Today, 11:30 AM',
      delta: '+2.0%',
      reason: '100% verified POS checkouts without duplicate flags (24 consecutive sales)',
      positive: true,
    },
    {
      date: '28 Sep 2026',
      delta: '+1.5%',
      reason: 'Inbound shipment verified & signed within 2 hours of arrival',
      positive: true,
    },
    {
      date: '15 Sep 2026',
      delta: '-1.0%',
      reason: 'Carton seal discrepancy reported on Batch #BLR02',
      positive: false,
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h2
          className="text-3xl font-medium tracking-tight text-black"
          style={{ letterSpacing: '-0.03em' }}
        >
          Partner Trust & Reputation Score
        </h2>
        <p className="text-black/60 text-sm mt-1">
          Your reputation score determines brand credit terms, consignment priority, and consumer verification badges.
        </p>
      </div>

      {/* Trust Score Card */}
      <div className="bg-[#2B2644] text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full mb-3 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Tier 1 Authorized Node</span>
          </div>

          <div className="flex items-baseline gap-3 mb-2">
            <span
              className="text-5xl md:text-6xl font-medium tracking-tight"
              style={{ letterSpacing: '-0.04em' }}
            >
              98 / 100
            </span>
            <span className="text-emerald-400 font-semibold text-sm">+2.5% this month</span>
          </div>

          <p className="text-white/70 text-xs max-w-md leading-relaxed">
            Exemplary track record. 0 counterfeit complaints, 100% accurate barcode custody handoffs, and fast shipment sign-offs.
          </p>
        </div>

        <div className="w-24 h-24 rounded-full border-4 border-emerald-400 flex items-center justify-center shrink-0 shadow-lg">
          <Star className="w-12 h-12 text-emerald-400 fill-emerald-400" />
        </div>
      </div>

      {/* Breakdown: What affects the score */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm space-y-4">
        <h3 className="text-base font-medium text-black pb-3 border-b border-black/5">
          Score Weighting & Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#F5F5F5] border border-black/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-black/60 font-medium">Successful Transfers</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-bold text-black">99.4% Success</div>
            <p className="text-[11px] text-black/50 mt-1">
              +45 pts contribution (142 accepted handoffs)
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F5F5F5] border border-black/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-black/60 font-medium">Reports Against Store</span>
              <ShieldAlert className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-bold text-black">0 Counterfeits</div>
            <p className="text-[11px] text-black/50 mt-1">
              Zero customer or brand fraud complaints
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F5F5F5] border border-black/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-black/60 font-medium">Handoff Response Time</span>
              <Clock className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-bold text-black">1.8 Hours Avg</div>
            <p className="text-[11px] text-black/50 mt-1">
              Top 5% speed in northern regional network
            </p>
          </div>
        </div>
      </div>

      {/* Recent Score Changes Log */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm">
        <h3 className="text-base font-medium text-black pb-3 border-b border-black/5 mb-4">
          Recent Score Adjustments
        </h3>

        <div className="space-y-3">
          {scoreHistory.map((sh, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-[#F5F5F5] border border-black/5 flex items-start justify-between gap-4 text-xs"
            >
              <div>
                <span className="font-semibold text-black block mb-0.5">{sh.reason}</span>
                <span className="text-black/40 text-[11px]">{sh.date}</span>
              </div>
              <span
                className={`font-mono font-bold px-2.5 py-1 rounded-full shrink-0 ${
                  sh.positive
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {sh.delta}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReputationScreen;
