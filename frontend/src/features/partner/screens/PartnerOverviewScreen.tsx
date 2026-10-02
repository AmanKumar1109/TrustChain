import React from 'react';
import {
  PackageCheck,
  Inbox,
  Send,
  QrCode,
  ShieldCheck,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { PartnerRole } from '../types';

interface OverviewProps {
  role: PartnerRole;
  onNavigateTab: (tab: any) => void;
}

export const PartnerOverviewScreen: React.FC<OverviewProps> = ({ role, onNavigateTab }) => {
  const isDistributor = role === 'distributor';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h2
          className="text-3xl font-medium tracking-tight text-black"
          style={{ letterSpacing: '-0.03em' }}
        >
          {isDistributor ? 'Distributor Overview' : 'Retail Store Overview'}
        </h2>
        <p className="text-black/60 text-sm mt-1">
          {isDistributor
            ? 'Track wholesale inbound consignments, warehouse inventory, and retailer transfers.'
            : 'Scan units at counter, register customer warranty claims, and manage store stock.'}
        </p>
      </div>

      {/* Stock summary cards & pending shipments count */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-black/5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-black/50 font-medium">In-Stock Verified Units</span>
            <div className="w-8 h-8 rounded-xl bg-black/5 flex items-center justify-center text-black">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-medium text-black">
              {isDistributor ? '48,500' : '1,420'}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">
              100% Polygon Anchored
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-black/5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-black/50 font-medium">Pending Inbound Shipments</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-medium text-black">2 Shipments</div>
            <button
              type="button"
              onClick={() => onNavigateTab('incoming')}
              className="text-[11px] text-blue-700 font-medium hover:underline block mt-0.5"
            >
              Review & Accept Inbound →
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-black/5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-black/50 font-medium">
              {isDistributor ? 'Dispatched to Retailers' : 'Sold to Customers'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-black/5 flex items-center justify-center text-black">
              {isDistributor ? <Send className="w-4 h-4" /> : <QrCode className="w-4 h-4" />}
            </div>
          </div>
          <div>
            <div className="text-2xl font-medium text-black">
              {isDistributor ? '24,200' : '864'}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">
              {isDistributor ? '42 retail deliveries' : 'Warranty SMS dispatched'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-black/5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-black/50 font-medium">Store Reputation Score</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-medium text-black">98 / 100</div>
            <span className="text-[11px] text-emerald-700 font-medium">
              Zero counterfeit complaints
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Banner */}
      <div className="p-6 rounded-3xl bg-white border border-black/5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-medium text-black">
            {isDistributor
              ? 'Ready to transfer batches to authorized retailers?'
              : 'Selling a unit at the counter? Scan to register customer ownership.'}
          </h3>
          <p className="text-xs text-black/60 mt-0.5">
            {isDistributor
              ? 'Log warehouse dispatches to update the digital ownership stepper.'
              : 'Fast mobile POS flow: scan QR, enter customer phone, customer gets instant SMS warranty.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigateTab(isDistributor ? 'transfer' : 'scan-and-sell')}
          className="inline-flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-full text-xs font-medium hover:bg-gray-800 transition-colors shadow-sm shrink-0"
        >
          <span>{isDistributor ? 'Transfer Batch' : 'Scan & Sell (POS)'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-6">
        <h3 className="text-base font-medium text-black mb-4 pb-3 border-b border-black/5">
          Recent Custody Log
        </h3>

        <div className="space-y-3 text-xs text-black/70">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F5F5F5]">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                {isDistributor
                  ? 'Accepted shipment of 5,000 units from Cipla Manufacturing Plant 4'
                  : 'Customer sold: Asthalin Inhaler #TC-8821 (+91 98214...) claimed'}
              </span>
            </span>
            <span className="text-black/40 text-[11px]">25m ago</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F5F5F5]">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                {isDistributor
                  ? 'Dispatched 1,200 units of Batch #MUM14 to Apollo Pharmacy'
                  : 'Stock received: 250 units of Montair-LC Tablets logged'}
              </span>
            </span>
            <span className="text-black/40 text-[11px]">2h ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerOverviewScreen;
