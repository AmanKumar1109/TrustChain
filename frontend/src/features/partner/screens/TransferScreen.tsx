import React, { useState, useEffect } from 'react';
import {
  Send,
  Store,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Package,
  Loader2,
} from 'lucide-react';
import { api } from '../../../services/api';
import { toast } from '../../../services/toast';

export const TransferScreen: React.FC = () => {
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [retailers, setRetailers] = useState<any[]>([]);
  const [inventoryBatches, setInventoryBatches] = useState<any[]>([]);

  const [selectedRetailerId, setSelectedRetailerId] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [transferQty, setTransferQty] = useState(100);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [sentTransfer, setSentTransfer] = useState<{
    id: string;
    retailer: string;
    batch: string;
    qty: number;
    time: string;
  } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoadingOptions(true);
        const [retailersRes, invRes] = await Promise.all([
          api.partners.getPartners('retailer'),
          api.transfers.getInventory(),
        ]);

        if (retailersRes.success && retailersRes.data?.partners) {
          setRetailers(retailersRes.data.partners);
          if (retailersRes.data.partners.length > 0) {
            setSelectedRetailerId(retailersRes.data.partners[0]._id || retailersRes.data.partners[0].id);
          }
        }

        if (invRes.success && invRes.data?.inventory) {
          const available = invRes.data.inventory.filter((i: any) => !i.isRecalled && (i.quantity || i.unitsInStock) > 0);
          setInventoryBatches(available);
          if (available.length > 0) {
            setSelectedBatch(available[0].batchNumber || available[0].batchId);
            setTransferQty(Math.min(100, available[0].quantity || available[0].unitsInStock || 100));
          }
        }
      } catch (err) {
        console.warn('Failed to load transfer form options:', err);
      } finally {
        setLoadingOptions(false);
      }
    }
    loadData();
  }, []);

  const handleConfirmTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatch) {
      toast.error('Please select a stock batch.');
      return;
    }
    if (!transferQty || transferQty < 1) {
      toast.error('Quantity must be at least 1 unit.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.transfers.createTransfer({
        batchId: selectedBatch,
        toPartnerId: selectedRetailerId || undefined,
        quantity: Number(transferQty),
        notes: notes || undefined,
      });

      if (res.success && res.data) {
        const transferObj = res.data.transfer || res.data;
        const retailerName =
          retailers.find((r) => (r._id || r.id) === selectedRetailerId)?.businessName ||
          retailers.find((r) => (r._id || r.id) === selectedRetailerId)?.name ||
          'Authorized Retailer';

        setSentTransfer({
          id: transferObj.transferId || `TRF-${Math.floor(1000 + Math.random() * 9000)}`,
          retailer: retailerName,
          batch: selectedBatch,
          qty: transferQty,
          time: 'Just now',
        });
        toast.success(`Consignment dispatched! Retailer notified.`);
      } else {
        toast.error(res.error?.message || 'Failed to dispatch transfer');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error processing downstream transfer');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedBatchObj = inventoryBatches.find(
    (b) => (b.batchNumber || b.batchId) === selectedBatch
  );
  const maxAvailable = selectedBatchObj?.quantity || selectedBatchObj?.unitsInStock || 5000;

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
          {loadingOptions ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-black/40" />
              <p className="text-xs text-black/40">Loading depot inventory & downstream retailers...</p>
            </div>
          ) : (
            <form onSubmit={handleConfirmTransfer} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                  Select Destination Retailer
                </label>
                <select
                  value={selectedRetailerId}
                  onChange={(e) => setSelectedRetailerId(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-medium focus:outline-none focus:border-black"
                >
                  {retailers.length > 0 ? (
                    retailers.map((r) => (
                      <option key={r._id || r.id} value={r._id || r.id}>
                        {r.businessName || r.name} ({r.location?.city || 'Retail Store'}) - GST: {r.gst || 'Verified'}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="retailer-1">Apollo Pharmacy Sector 18 (Noida) - Store #8821</option>
                      <option value="retailer-2">MedPlus Chemist (Indiranagar, BLR) - Store #1042</option>
                      <option value="retailer-3">Wellness Forever (Bandra, Mumbai) - Store #409</option>
                    </>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                    Select Stock Batch
                  </label>
                  <select
                    value={selectedBatch}
                    onChange={(e) => {
                      setSelectedBatch(e.target.value);
                      const b = inventoryBatches.find(
                        (item) => (item.batchNumber || item.batchId) === e.target.value
                      );
                      if (b) {
                        const stock = b.quantity || b.unitsInStock || 100;
                        setTransferQty(Math.min(transferQty, stock));
                      }
                    }}
                    className="w-full px-4 py-3 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-mono focus:outline-none focus:border-black"
                  >
                    {inventoryBatches.length > 0 ? (
                      inventoryBatches.map((b) => (
                        <option key={b.batchNumber || b.batchId} value={b.batchNumber || b.batchId}>
                          {b.batchNumber} ({b.productName} — {(b.quantity || b.unitsInStock)?.toLocaleString()} in stock)
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="BATCH-2026-DEL99">BATCH-2026-DEL99 (Asthalin - 4,800 available)</option>
                        <option value="BATCH-2026-MUM14">BATCH-2026-MUM14 (Montair-LC - 240 available)</option>
                        <option value="BT-8820-AUDIO">BT-8820-AUDIO (Rockerz 450 - 85 available)</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                    Transfer Quantity (Units)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={maxAvailable}
                    required
                    value={transferQty}
                    onChange={(e) => setTransferQty(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-medium focus:outline-none focus:border-black"
                  />
                  <span className="text-[10px] text-black/40 block mt-1">
                    Max depot availability: {maxAvailable.toLocaleString()} units
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                  Shipment Notes / Waybill (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Delivery via Dispatch Van DL-10-8812"
                  className="w-full px-4 py-3 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-medium focus:outline-none focus:border-black"
                />
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
                  disabled={submitting}
                  className="w-full py-3.5 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{submitting ? 'Dispatching...' : 'Confirm & Dispatch to Retailer'}</span>
                </button>
              </div>
            </form>
          )}
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
            <h3 className="text-xl font-medium tracking-tight text-black">
              Consignment Dispatched
            </h3>
            <p className="text-xs text-black/60 mt-1 max-w-sm mx-auto leading-relaxed">
              Consignment {sentTransfer.id} of {sentTransfer.qty.toLocaleString()} units of{' '}
              {sentTransfer.batch} has been recorded in the custody ledger.
            </p>
          </div>

          <div className="p-4 bg-[#F5F5F5] rounded-2xl border border-black/5 text-xs text-black/70 max-w-sm mx-auto space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-black/50">Recipient Store:</span>
              <span className="font-semibold text-black">{sentTransfer.retailer}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/50">Dispatched:</span>
              <span>{sentTransfer.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/50">Custody Status:</span>
              <span className="font-medium text-amber-700">Awaiting Inbound Signature</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setSentTransfer(null)}
              className="px-6 py-2.5 bg-black text-white text-xs font-medium rounded-full hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
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
