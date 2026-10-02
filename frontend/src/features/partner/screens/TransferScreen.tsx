import React, { useState } from 'react';
import {
  Send,
  Store,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Package,
} from 'lucide-react';

export const TransferScreen: React.FC = () => {
  const [selectedRetailer, setSelectedRetailer] = useState('Apollo Pharmacy Sector 18 (Noida)');
  const [selectedBatch, setSelectedBatch] = useState('BATCH-2026-DEL99');
  const [transferQty, setTransferQty] = useState(500);
  const [sentTransfer, setSentTransfer] = useState<{
    id: string;
    retailer: string;
    batch: string;
    qty: number;
    time: string;
  } | null>(null);

  const handleConfirmTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setSentTransfer({
      id: `TRF-${Math.floor(1000 + Math.random() * 9000)}`,
      retailer: selectedRetailer,
      batch: selectedBatch,
      qty: transferQty,
      time: 'Just now',
    });
  };

  return (
    <div className="space-y-6 max-w-3xl animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h2
          className="text-3xl font-medium tracking-tight text-black"
          style={{ letterSpacing: '-0.03em' }}
        >
          Transfer to Authorized Retailer
        </h2>
        <p className="text-black/60 text-sm mt-1">
          Distribute warehouse stock to retail pharmacies and franchise stores. Creates a cryptographically signed custody dispatch.
        </p>
      </div>

      {!sentTransfer ? (
        /* Transfer Form */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm space-y-4">
          <form onSubmit={handleConfirmTransfer} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                Select Destination Retailer
              </label>
              <select
                value={selectedRetailer}
                onChange={(e) => setSelectedRetailer(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-medium focus:outline-none focus:border-black"
              >
                <option value="Apollo Pharmacy Sector 18 (Noida)">
                  Apollo Pharmacy Sector 18 (Noida) - Store #8821
                </option>
                <option value="MedPlus Chemist (Indiranagar, BLR)">
                  MedPlus Chemist (Indiranagar, BLR) - Store #1042
                </option>
                <option value="Wellness Forever (Bandra, Mumbai)">
                  Wellness Forever (Bandra, Mumbai) - Store #409
                </option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                  Select Stock Batch
                </label>
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-mono focus:outline-none focus:border-black"
                >
                  <option value="BATCH-2026-DEL99">
                    BATCH-2026-DEL99 (Asthalin - 4,800 available)
                  </option>
                  <option value="BATCH-2026-MUM14">
                    BATCH-2026-MUM14 (Montair-LC - 240 available)
                  </option>
                  <option value="BT-8820-AUDIO">
                    BT-8820-AUDIO (Rockerz 450 - 85 available)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                  Transfer Quantity (Units)
                </label>
                <input
                  type="number"
                  min={10}
                  max={4800}
                  required
                  value={transferQty}
                  onChange={(e) => setTransferQty(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-medium focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 leading-relaxed flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
              <span>
                Once confirmed, the consignment enters <strong>Pending Retailer Acceptance</strong>.
                The retail store must inspect and confirm receipt to complete ownership transfer.
              </span>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
              >
                Confirm & Dispatch to Retailer
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Pending State After Sending */
        <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm text-center space-y-4 animate-in fade-in duration-200">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center mx-auto shadow-md">
            <Clock className="w-8 h-8" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full mb-2">
              Status: Pending Acceptance
            </div>
            <h3 className="text-2xl font-medium tracking-tight text-black">
              Transfer Dispatch Sent
            </h3>
            <p className="text-xs text-black/60 mt-1 max-w-md mx-auto">
              Waybill <strong>{sentTransfer.id}</strong> has been transmitted. The retail destination
              node will see this in their incoming queue.
            </p>
          </div>

          <div className="p-4 bg-[#F5F5F5] rounded-2xl border border-black/5 text-xs text-black/70 max-w-md mx-auto space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-black/50">Destination Store:</span>
              <span className="font-medium text-black">{sentTransfer.retailer}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/50">Batch ID:</span>
              <span className="font-mono font-medium text-black">{sentTransfer.batch}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/50">Units in Transit:</span>
              <span className="font-bold text-black">{sentTransfer.qty.toLocaleString()} units</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setSentTransfer(null)}
              className="px-8 py-3 bg-black text-white text-xs font-medium rounded-full hover:bg-gray-800 transition-colors"
            >
              Transfer Another Batch
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransferScreen;
