import React, { useState } from 'react';
import {
  History as HistoryIcon,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { ActivityHistoryItem, PartnerRole } from '../types';

export const HistoryScreen: React.FC<{ role: PartnerRole }> = ({ role }) => {
  const [filterType, setFilterType] = useState<'all' | 'sale' | 'transfer_in' | 'transfer_out'>('all');
  const [search, setSearch] = useState('');

  const [records] = useState<ActivityHistoryItem[]>([
    {
      id: 'act-1',
      type: 'sale',
      title: 'Retail Sale to Consumer',
      detail: 'Cipla Asthalin Inhaler #TC-8821 sold to +91 9821456789',
      units: 1,
      timestamp: 'Today, 02:40 PM',
      targetEntity: 'Consumer +91 98214...',
      status: 'completed',
    },
    {
      id: 'act-2',
      type: 'transfer_in',
      title: 'Inbound Consignment Receipt',
      detail: 'Received Batch #BATCH-2026-DEL99 from Bhiwandi Central Logistics',
      units: 500,
      timestamp: 'Yesterday, 04:15 PM',
      targetEntity: 'National Pharma Logistics',
      status: 'completed',
    },
    {
      id: 'act-3',
      type: 'transfer_out',
      title: 'Dispatched to Retail Pharmacy',
      detail: 'Transferred 200 units of Montair-LC to MedPlus Chemist',
      units: 200,
      timestamp: '29 Sep 2026, 11:30 AM',
      targetEntity: 'MedPlus Store #104',
      status: 'completed',
    },
    {
      id: 'act-4',
      type: 'sale',
      title: 'Retail Sale to Consumer',
      detail: 'boAt Rockerz 450 Pro sold to +91 97110...',
      units: 1,
      timestamp: '28 Sep 2026, 07:10 PM',
      targetEntity: 'Consumer +91 97110...',
      status: 'completed',
    },
  ]);

  const filtered = records.filter((r) => {
    const matchType = filterType === 'all' || r.type === filterType;
    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.detail.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h2
          className="text-3xl font-medium tracking-tight text-black"
          style={{ letterSpacing: '-0.03em' }}
        >
          Sales & Transfer Custody History
        </h2>
        <p className="text-black/60 text-sm mt-1">
          Complete ledger of all inbound arrivals, outbound distributor transfers, and counter retail sales.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-4 border border-black/5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-black/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#F5F5F5] border border-black/5 text-black placeholder:text-black/40 text-xs font-medium focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {(['all', 'sale', 'transfer_in', 'transfer_out'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilterType(t)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium capitalize transition-all whitespace-nowrap ${
                filterType === t
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-[#F5F5F5] text-black/60 hover:text-black'
              }`}
            >
              {t === 'all'
                ? 'All Events'
                : t === 'sale'
                ? 'Counter Sales'
                : t === 'transfer_in'
                ? 'Inbound Receipts'
                : 'Outbound Transfers'}
            </button>
          ))}
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-black/5 bg-[#F5F5F5]/60 text-black/50 uppercase font-semibold">
                <th className="p-4 pl-6">Event Type</th>
                <th className="p-4">Transaction Details</th>
                <th className="p-4">Entity Involved</th>
                <th className="p-4">Units</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4 pr-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-black/[0.01] transition-colors">
                  <td className="p-4 pl-6">
                    <span className="inline-flex items-center gap-1.5 font-medium text-black capitalize">
                      {r.type === 'sale' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      {r.type === 'transfer_in' && (
                        <ArrowDownLeft className="w-3.5 h-3.5 text-blue-600" />
                      )}
                      {r.type === 'transfer_out' && (
                        <ArrowUpRight className="w-3.5 h-3.5 text-black/60" />
                      )}
                      <span>{r.type.replace('_', ' ')}</span>
                    </span>
                  </td>
                  <td className="p-4 font-medium text-black max-w-sm">{r.detail}</td>
                  <td className="p-4 text-black/70">{r.targetEntity}</td>
                  <td className="p-4 font-bold text-black">{r.units}</td>
                  <td className="p-4 text-black/50">{r.timestamp}</td>
                  <td className="p-4 pr-6">
                    <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                      {r.status}
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

export default HistoryScreen;
