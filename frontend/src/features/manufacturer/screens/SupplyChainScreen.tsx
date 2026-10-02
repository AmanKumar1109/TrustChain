import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  Building2,
  Store,
  ArrowRight,
  X,
  ShieldCheck,
} from 'lucide-react';
import { SupplyChainTransfer } from '../types';

export const SupplyChainScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'accepted' | 'rejected'>('pending');

  const [transfers, setTransfers] = useState<SupplyChainTransfer[]>([
    {
      id: 'tx-101',
      transferId: 'TRF-2026-904',
      batchNumber: 'BATCH-2026-DEL99',
      productName: 'Cipla Asthalin Inhaler 100mcg',
      partnerName: 'National Pharma Logistics (Bhiwandi)',
      partnerRole: 'Distributor',
      quantity: 5000,
      status: 'pending',
      requestDate: '01 Oct 2026, 10:30 AM',
      sourceLocation: 'Verna Industrial Estate, Goa',
      destLocation: 'Bhiwandi Central Warehouse, Mumbai',
    },
    {
      id: 'tx-102',
      transferId: 'TRF-2026-881',
      batchNumber: 'BATCH-2026-MUM14',
      productName: 'Cipla Montair-LC Tablets',
      partnerName: 'Apex Health Distribution North',
      partnerRole: 'Distributor',
      quantity: 12000,
      status: 'accepted',
      requestDate: '28 Sep 2026, 02:00 PM',
      completionDate: '29 Sep 2026, 11:15 AM',
      sourceLocation: 'Verna Plant 4, Goa',
      destLocation: 'Okhla Phase 2, New Delhi',
    },
    {
      id: 'tx-103',
      transferId: 'TRF-2026-764',
      batchNumber: 'BATCH-2026-BLR02',
      productName: 'Cipla Foracort 400 Rotacaps',
      partnerName: 'QuickMeds South Wholesale',
      partnerRole: 'Wholesaler',
      quantity: 2000,
      status: 'rejected',
      requestDate: '22 Sep 2026, 09:45 AM',
      completionDate: '22 Sep 2026, 04:30 PM (Damaged Carton Seal)',
      sourceLocation: 'Bengaluru Hub',
      destLocation: 'Indiranagar Hub, Bengaluru',
    },
  ]);

  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedTransferDetail, setSelectedTransferDetail] = useState<SupplyChainTransfer | null>(null);

  // Form State
  const [partner, setPartner] = useState('National Pharma Logistics (Bhiwandi)');
  const [batch, setBatch] = useState('BATCH-2026-DEL99');
  const [quantity, setQuantity] = useState(2500);

  const filteredTransfers = transfers.filter((t) => t.status === activeTab);

  const handleCreateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const newTrf: SupplyChainTransfer = {
      id: `tx-${Date.now()}`,
      transferId: `TRF-2026-${Math.floor(100 + Math.random() * 900)}`,
      batchNumber: batch,
      productName: 'Cipla Asthalin Inhaler 100mcg',
      partnerName: partner,
      partnerRole: 'Distributor',
      quantity: Number(quantity),
      status: 'pending',
      requestDate: 'Just now',
      sourceLocation: 'Central Manufacturing Plant, Goa',
      destLocation: 'Partner Warehouse',
    };
    setTransfers([newTrf, ...transfers]);
    setShowTransferModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2
            className="text-3xl font-medium tracking-tight text-black"
            style={{ letterSpacing: '-0.03em' }}
          >
            Supply Chain Custody
          </h2>
          <p className="text-black/60 text-sm mt-1">
            Dispatch verified batches, record handoffs, and ensure chain-of-custody integrity before retail.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowTransferModal(true)}
          className="inline-flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-full text-xs font-medium hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Transfer Batch</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-black/10 pb-4">
        {(['pending', 'accepted', 'rejected'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full text-xs font-medium capitalize transition-all ${
              activeTab === tab
                ? 'bg-black text-white shadow-sm'
                : 'bg-white text-black/60 hover:text-black border border-black/5'
            }`}
          >
            {tab} (
            {transfers.filter((t) => t.status === tab).length}
            )
          </button>
        ))}
      </div>

      {/* Transfer List Table */}
      <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-black/5 bg-[#F5F5F5]/60 text-black/50 uppercase font-semibold">
                <th className="p-4 pl-6">Transfer ID</th>
                <th className="p-4">Batch Number</th>
                <th className="p-4">Destination Partner</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Route</th>
                <th className="p-4">Requested Date</th>
                <th className="p-4 pr-6 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredTransfers.map((t) => (
                <tr key={t.id} className="hover:bg-black/[0.01] transition-colors">
                  <td className="p-4 pl-6 font-mono font-medium text-black">{t.transferId}</td>
                  <td className="p-4 font-mono font-medium text-black">{t.batchNumber}</td>
                  <td className="p-4">
                    <span className="font-medium text-black block">{t.partnerName}</span>
                    <span className="text-[10px] text-black/50 uppercase">{t.partnerRole}</span>
                  </td>
                  <td className="p-4 font-medium text-black">{t.quantity.toLocaleString()} units</td>
                  <td className="p-4 text-black/60">
                    {t.sourceLocation} → {t.destLocation}
                  </td>
                  <td className="p-4 text-black/60">{t.requestDate}</td>
                  <td className="p-4 pr-6 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedTransferDetail(t)}
                      className="px-3 py-1.5 bg-[#F5F5F5] hover:bg-black/5 text-black rounded-xl font-medium transition-colors"
                    >
                      View Timeline
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transfer Batch Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-black/5 text-black">
            <button
              type="button"
              onClick={() => setShowTransferModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-black/50 hover:text-black hover:bg-black/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-medium tracking-tight text-black mb-1">
              Initiate Supply Chain Custody Transfer
            </h3>
            <p className="text-xs text-black/60 mb-6">
              Authorized partner must sign-off using OTP or partner token to accept custody on-chain.
            </p>

            <form onSubmit={handleCreateTransfer} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                  Select Partner
                </label>
                <select
                  value={partner}
                  onChange={(e) => setPartner(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-medium focus:outline-none focus:border-black"
                >
                  <option value="National Pharma Logistics (Bhiwandi)">
                    National Pharma Logistics (Bhiwandi Hub) - Score 98%
                  </option>
                  <option value="Apex Health Distribution North">
                    Apex Health Distribution North (Delhi) - Score 95%
                  </option>
                  <option value="QuickMeds South Wholesale">
                    QuickMeds South Wholesale (Bengaluru) - Score 92%
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                    Batch Number
                  </label>
                  <select
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-mono focus:outline-none focus:border-black"
                  >
                    <option value="BATCH-2026-DEL99">BATCH-2026-DEL99 (10,000 units)</option>
                    <option value="BATCH-2026-MUM14">BATCH-2026-MUM14 (25,000 units)</option>
                    <option value="BATCH-2026-BLR02">BATCH-2026-BLR02 (5,000 units)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                    Quantity to Transfer
                  </label>
                  <input
                    type="number"
                    min={100}
                    max={25000}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-medium focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 leading-relaxed">
                <ShieldCheck className="w-4 h-4 inline mr-1 text-emerald-700" />
                Handoff triggers a Polygon chain-of-custody transaction and updates GPS verification.
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors shadow-sm"
                >
                  Send Custody Transfer Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Detail View with Timeline */}
      {selectedTransferDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-black/5 text-black">
            <button
              type="button"
              onClick={() => setSelectedTransferDetail(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-black/50 hover:text-black hover:bg-black/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between pb-3 border-b border-black/5 mb-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-black/50">
                  Custody Proof
                </span>
                <h3 className="text-xl font-medium tracking-tight text-black">
                  {selectedTransferDetail.transferId}
                </h3>
              </div>
              <span
                className={`text-xs font-semibold uppercase px-3 py-1 rounded-full ${
                  selectedTransferDetail.status === 'accepted'
                    ? 'bg-emerald-50 text-emerald-700'
                    : selectedTransferDetail.status === 'pending'
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-rose-50 text-rose-700'
                }`}
              >
                {selectedTransferDetail.status}
              </span>
            </div>

            {/* Stepper */}
            <div className="space-y-4 mb-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-black/10 text-xs">
              <div className="relative flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 z-10">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-black block">Origin Dispatched</span>
                  <span className="text-black/60">{selectedTransferDetail.sourceLocation}</span>
                  <span className="text-black/40 block text-[11px]">{selectedTransferDetail.requestDate}</span>
                </div>
              </div>

              <div className="relative flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                    selectedTransferDetail.status === 'accepted'
                      ? 'bg-emerald-500 text-white'
                      : selectedTransferDetail.status === 'pending'
                      ? 'bg-amber-500 text-white'
                      : 'bg-rose-500 text-white'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-black block">Transit Handoff Status</span>
                  <span className="text-black/60">{selectedTransferDetail.destLocation}</span>
                  <span className="text-black/40 block text-[11px]">
                    {selectedTransferDetail.completionDate || 'Awaiting Partner QR Check-in'}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedTransferDetail(null)}
              className="w-full py-2.5 bg-black text-white text-xs font-medium rounded-full hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplyChainScreen;
