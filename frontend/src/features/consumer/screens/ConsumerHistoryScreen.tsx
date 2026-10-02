import React, { useState } from 'react';
import {
  History,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  AlertOctagon,
  ExternalLink,
  Search,
  Filter,
  ArrowUpRight,
} from 'lucide-react';
import { ScanHistoryRecord } from '../types';

interface ConsumerHistoryScreenProps {
  historyRecords: ScanHistoryRecord[];
  onInspectVerify: (code: string) => void;
}

export const ConsumerHistoryScreen: React.FC<ConsumerHistoryScreenProps> = ({
  historyRecords,
  onInspectVerify,
}) => {
  const [filterState, setFilterState] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = historyRecords.filter((record) => {
    const matchesFilter =
      filterState === 'All' || record.resultState.toLowerCase() === filterState.toLowerCase();
    const matchesSearch =
      record.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getResultBadge = (state: ScanHistoryRecord['resultState']) => {
    switch (state) {
      case 'Genuine':
        return (
          <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Genuine
          </span>
        );
      case 'Suspicious':
        return (
          <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-600" /> Suspicious
          </span>
        );
      case 'Fake':
        return (
          <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1">
            <XCircle className="w-3 h-3 text-rose-600" /> Counterfeit
          </span>
        );
      case 'Recalled':
        return (
          <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-800 border border-orange-200 flex items-center gap-1">
            <AlertOctagon className="w-3 h-3 text-orange-600" /> Recalled
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 pb-20 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-xl font-medium text-black tracking-tight">Scan History</h2>
        <p className="text-xs text-black/50">Chronological ledger of physical QR codes inspected by your device</p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-black/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by product, brand, or code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-black/10 rounded-2xl text-xs text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/10 shadow-sm"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['All', 'Genuine', 'Suspicious', 'Fake', 'Recalled'].map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilterState(status)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              filterState.toLowerCase() === status.toLowerCase()
                ? 'bg-black text-white shadow-sm'
                : 'bg-white text-black/70 border border-black/10 hover:bg-black/[0.03]'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* History Items */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => onInspectVerify(item.code)}
            className="p-4 bg-white rounded-3xl border border-black/5 shadow-sm hover:border-black/20 transition-all cursor-pointer group flex items-center justify-between"
          >
            <div className="space-y-1.5 flex-1 pr-3">
              <div className="flex items-center gap-2">
                {getResultBadge(item.resultState)}
                <span className="text-[11px] text-black/40">{item.timestamp}</span>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-black group-hover:text-black/80 transition-colors">
                  {item.productName}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-black/50 mt-0.5 font-mono">
                  <span>{item.brand}</span>
                  <span>•</span>
                  <span>ID: {item.code}</span>
                </div>
              </div>
            </div>

            <div className="text-right shrink-0 flex flex-col items-end gap-1">
              {item.pointsAwarded > 0 && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  +{item.pointsAwarded} Pts
                </span>
              )}
              <span className="text-xs font-medium text-black/40 group-hover:text-black flex items-center gap-1 transition-colors">
                View Certificate <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-8 text-center bg-white rounded-3xl border border-black/5">
            <History className="w-8 h-8 text-black/30 mx-auto mb-2" />
            <h4 className="text-sm font-medium text-black">No scans found</h4>
            <p className="text-xs text-black/50 mt-1">
              Your scanned medicine, apparel, and hardware checks will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsumerHistoryScreen;
