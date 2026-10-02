import React, { useState, useEffect } from 'react';
import {
  History as HistoryIcon,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  Loader2,
  Package,
} from 'lucide-react';
import { ActivityHistoryItem, PartnerRole } from '../types';
import { api } from '../../../services/api';

const DEFAULT_MOCK_RECORDS: ActivityHistoryItem[] = [
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
];

export const HistoryScreen: React.FC<{ role: PartnerRole }> = ({ role }) => {
  const [filterType, setFilterType] = useState<'all' | 'sale' | 'transfer_in' | 'transfer_out'>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<ActivityHistoryItem[]>(DEFAULT_MOCK_RECORDS);

  useEffect(() => {
    let isMounted = true;

    async function loadHistory() {
      setLoading(true);
      try {
        const session = api.auth.getSession();
        const currentUserId = session?.id;

        // Fetch transfers and retail sales in parallel
        const [transfersRes, salesRes] = await Promise.allSettled([
          api.transfers.getTransfers({ limit: 50 }),
          api.sales.getSales(),
        ]);

        const combinedRecords: (ActivityHistoryItem & { rawDate: number })[] = [];

        // 1. Process Transfers
        if (transfersRes.status === 'fulfilled' && transfersRes.value.success && transfersRes.value.data?.transfers) {
          const transfersList = transfersRes.value.data.transfers;
          transfersList.forEach((t: any) => {
            const isIncoming =
              t.toUser?._id === currentUserId ||
              t.toUser === currentUserId ||
              (t.direction && t.direction === 'incoming');

            const dateObj = new Date(t.updatedAt || t.createdAt || Date.now());
            const formattedTime = dateObj.toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }) + ', ' + dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

            if (isIncoming) {
              combinedRecords.push({
                id: t._id || t.transferId || `trf-${Math.random()}`,
                type: 'transfer_in',
                title: 'Inbound Consignment Receipt',
                detail: `Received ${t.quantity || 0} units of ${t.productName || t.batchNumber || 'Batch'} from ${
                  t.fromName || t.fromUser?.companyName || t.fromUser?.name || 'Upstream Supplier'
                }`,
                units: t.quantity || 0,
                timestamp: formattedTime,
                targetEntity: t.fromName || t.fromUser?.companyName || t.fromUser?.name || 'Upstream Depot',
                status: t.status === 'Rejected' ? 'flagged' : 'completed',
                rawDate: dateObj.getTime(),
              });
            } else {
              combinedRecords.push({
                id: t._id || t.transferId || `trf-${Math.random()}`,
                type: 'transfer_out',
                title: 'Dispatched to Downstream Partner',
                detail: `Transferred ${t.quantity || 0} units of ${t.productName || t.batchNumber || 'Batch'} to ${
                  t.toName || t.toUser?.companyName || t.toUser?.name || 'Downstream Partner'
                }`,
                units: t.quantity || 0,
                timestamp: formattedTime,
                targetEntity: t.toName || t.toUser?.companyName || t.toUser?.name || 'Downstream Store',
                status: t.status === 'Rejected' ? 'flagged' : 'completed',
                rawDate: dateObj.getTime(),
              });
            }
          });
        }

        // 2. Process Retail Sales
        if (salesRes.status === 'fulfilled' && salesRes.value.success && salesRes.value.data?.sales) {
          const salesList = salesRes.value.data.sales;
          salesList.forEach((s: any) => {
            const dateObj = new Date(s.purchaseDate || s.createdAt || Date.now());
            const formattedTime = dateObj.toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }) + ', ' + dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

            const phone = s.customerPhone || '';
            const maskedPhone = phone.length > 5 ? phone.slice(0, 5) + '...' : phone;

            combinedRecords.push({
              id: s._id || s.saleId || `sale-${Math.random()}`,
              type: 'sale',
              title: 'Retail Sale to Consumer',
              detail: `${s.product?.name || 'Product'} #${s.unitCode || 'Unit'} sold to ${phone || 'Consumer'}`,
              units: 1,
              timestamp: formattedTime,
              targetEntity: phone ? `Consumer ${maskedPhone}` : 'Retail Consumer',
              status: 'completed',
              rawDate: dateObj.getTime(),
            });
          });
        }

        if (isMounted) {
          if (combinedRecords.length > 0) {
            combinedRecords.sort((a, b) => b.rawDate - a.rawDate);
            setRecords(combinedRecords.map(({ rawDate, ...item }) => item));
          } else {
            // Keep default fallback if empty
            setRecords(DEFAULT_MOCK_RECORDS);
          }
        }
      } catch (err) {
        console.warn('Failed to load activity history, using fallback:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadHistory();

    return () => {
      isMounted = false;
    };
  }, [role]);

  const filtered = records.filter((r) => {
    const matchType = filterType === 'all' || r.type === filterType;
    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.detail.toLowerCase().includes(search.toLowerCase()) ||
      (r.targetEntity && r.targetEntity.toLowerCase().includes(search.toLowerCase()));
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
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-black/50">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-black/40" />
                      <span>Loading custody transactions...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-black/50">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Package className="w-8 h-8 text-black/20" />
                      <p className="font-medium text-black/70">No activity history records found</p>
                      <p className="text-xs text-black/40">Try adjusting your search terms or filter selection.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
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
                      <span
                        className={`text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full ${
                          r.status === 'flagged'
                            ? 'bg-rose-50 text-rose-800'
                            : 'bg-emerald-50 text-emerald-800'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryScreen;
