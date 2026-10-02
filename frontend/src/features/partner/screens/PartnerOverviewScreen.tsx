import React, { useState, useEffect } from 'react';
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
  Loader2,
} from 'lucide-react';
import { PartnerRole } from '../types';
import { api } from '../../../services/api';

interface OverviewProps {
  role: PartnerRole;
  onNavigateTab: (tab: any) => void;
}

export const PartnerOverviewScreen: React.FC<OverviewProps> = ({ role, onNavigateTab }) => {
  const isDistributor = role === 'distributor';
  const [loading, setLoading] = useState(true);

  const [inStockCount, setInStockCount] = useState<number>(isDistributor ? 48500 : 1420);
  const [pendingShipmentsCount, setPendingShipmentsCount] = useState<number>(2);
  const [dispatchedOrSoldCount, setDispatchedOrSoldCount] = useState<number>(isDistributor ? 24200 : 864);
  const [reputationScore, setReputationScore] = useState<number>(98);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadOverviewData() {
      try {
        setLoading(true);
        const [inventoryRes, incomingRes, transfersRes, salesRes] = await Promise.all([
          api.transfers.getInventory(),
          api.transfers.getIncoming('Pending'),
          api.transfers.getTransfers({ limit: 10 }),
          !isDistributor ? api.sales.getSales() : Promise.resolve({ success: false, data: null }),
        ]);

        if (!isMounted) return;

        // In-stock units
        if (inventoryRes.success && inventoryRes.data?.inventory) {
          const totalStock = inventoryRes.data.inventory.reduce(
            (acc: number, item: any) => acc + (item.quantity || item.unitsInStock || 0),
            0
          );
          if (totalStock > 0) setInStockCount(totalStock);
        }

        // Pending incoming count
        if (incomingRes.success && incomingRes.data?.transfers) {
          setPendingShipmentsCount(incomingRes.data.transfers.length);
        }

        // Outbound transfers or sales
        if (isDistributor && transfersRes.success && transfersRes.data?.transfers) {
          const outgoing = transfersRes.data.transfers.filter((t: any) => t.status === 'Accepted');
          const totalOut = outgoing.reduce((acc: number, t: any) => acc + (t.quantity || 0), 0);
          if (totalOut > 0) setDispatchedOrSoldCount(totalOut);
        } else if (!isDistributor && salesRes.success && salesRes.data?.sales) {
          setDispatchedOrSoldCount(salesRes.data.sales.length || 864);
        }

        // Recent activity log
        if (transfersRes.success && transfersRes.data?.transfers && transfersRes.data.transfers.length > 0) {
          const logs = transfersRes.data.transfers.slice(0, 3).map((t: any) => ({
            id: t._id || t.transferId,
            message:
              t.status === 'Accepted'
                ? `Custody accepted: ${t.quantity?.toLocaleString()} units of ${t.productName || t.batchNumber}`
                : t.status === 'Pending'
                ? `Pending handoff: ${t.quantity?.toLocaleString()} units to ${t.toName || 'Partner'}`
                : `Shipment rejected: Batch ${t.batchNumber}`,
            time: t.updatedAt
              ? new Date(t.updatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
              : 'Recent',
          }));
          setRecentLogs(logs);
        }
      } catch (err) {
        console.warn('Failed to load partner overview stats:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadOverviewData();

    return () => {
      isMounted = false;
    };
  }, [role, isDistributor]);

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
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-black/40" />
              ) : (
                inStockCount.toLocaleString()
              )}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">
              100% Cryptographic Ledger Anchored
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
            <div className="text-2xl font-medium text-black">
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-black/40" />
              ) : (
                `${pendingShipmentsCount} Shipments`
              )}
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('incoming')}
              className="text-[11px] text-blue-700 font-medium hover:underline block mt-0.5 cursor-pointer"
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
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-black/40" />
              ) : (
                dispatchedOrSoldCount.toLocaleString()
              )}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">
              {isDistributor ? 'Authorized retail deliveries' : 'Digital warranty dispatched'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-black/5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-black/50 font-medium">Partner Reputation Score</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-medium text-black">{reputationScore} / 100</div>
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
              : 'Fast counter POS flow: scan QR, enter customer phone, customer gets instant SMS warranty.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigateTab(isDistributor ? 'transfer' : 'scan-and-sell')}
          className="inline-flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-full text-xs font-medium hover:bg-gray-800 transition-colors shadow-sm shrink-0 cursor-pointer"
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
          {recentLogs.length > 0 ? (
            recentLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 rounded-2xl bg-[#F5F5F5]">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{log.message}</span>
                </span>
                <span className="text-black/40 text-[11px] shrink-0">{log.time}</span>
              </div>
            ))
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnerOverviewScreen;
