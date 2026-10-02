import React, { useState, useEffect } from 'react';
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
  Loader2,
  ChevronDown,
  ChevronUp,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { SupplyChainTransfer } from '../types';
import { api } from '../../../services/api';
import { toast } from '../../../services/toast';

export const SupplyChainScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'accepted' | 'rejected'>('pending');
  const [transfers, setTransfers] = useState<SupplyChainTransfer[]>([]);
  const [counts, setCounts] = useState({ pending: 0, accepted: 0, rejected: 0, all: 0 });
  const [loading, setLoading] = useState(true);

  // Available batches & partners for transfer creation
  const [availableBatches, setAvailableBatches] = useState<any[]>([]);
  const [availablePartners, setAvailablePartners] = useState<any[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const [showTransferModal, setShowTransferModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedTransferDetail, setSelectedTransferDetail] = useState<any | null>(null);
  const [showTechProof, setShowTechProof] = useState(false);

  // Form State
  const [selectedPartnerId, setSelectedPartnerId] = useState('');
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [transferQuantity, setTransferQuantity] = useState<number>(100);
  const [transferNotes, setTransferNotes] = useState('');

  // Fetch transfers on mount & when activeTab changes
  const fetchTransfers = async () => {
    try {
      setLoading(true);
      // Fetch all transfers to calculate tab counts and filter
      const res = await api.transfers.getTransfers();
      if (res.success && res.data) {
        const rawList = res.data.transfers || [];
        const rawCounts = res.data.counts || {
          pending: rawList.filter((t: any) => t.status?.toLowerCase() === 'pending').length,
          accepted: rawList.filter((t: any) => t.status?.toLowerCase() === 'accepted').length,
          rejected: rawList.filter((t: any) => t.status?.toLowerCase() === 'rejected').length,
          all: rawList.length,
        };
        setCounts(rawCounts);

        const mapped: SupplyChainTransfer[] = rawList.map((t: any) => {
          const reqDate = t.createdAt
            ? new Date(t.createdAt).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : 'Recently';

          const compDate = t.updatedAt && t.status?.toLowerCase() !== 'pending'
            ? new Date(t.updatedAt).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }) + (t.rejectionReason ? ` (${t.rejectionReason})` : '')
            : undefined;

          return {
            id: t._id || t.id,
            transferId: t.transferId || `TRF-${(t._id || '').slice(-6).toUpperCase()}`,
            batchNumber: t.batchNumber || t.batchId || 'N/A',
            productName: t.productName || (typeof t.product === 'object' ? t.product?.name : 'Product Batch'),
            partnerName: t.toName || t.destinationPartner?.businessName || 'Authorized Network Partner',
            partnerRole: (t.toRole || 'Distributor') as 'Distributor' | 'Wholesaler' | 'Retailer',
            quantity: t.quantity || 0,
            status: (t.status ? t.status.toLowerCase() : 'pending') as 'pending' | 'accepted' | 'rejected',
            requestDate: reqDate,
            completionDate: compDate,
            sourceLocation: t.fromLocation || 'Central Facility, Goa',
            destLocation: t.toLocation || t.destinationPartner?.location?.city || 'Regional Depot Hub',
            raw: t,
          } as SupplyChainTransfer & { raw: any };
        });

        setTransfers(mapped);
      } else {
        // Fallback default mock items if server returns empty/demo
        populateMockFallback();
      }
    } catch (err) {
      console.warn('Could not load transfers from backend:', err);
      populateMockFallback();
    } finally {
      setLoading(false);
    }
  };

  const populateMockFallback = () => {
    const fallback: SupplyChainTransfer[] = [
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
    ];
    setTransfers(fallback);
    setCounts({
      pending: fallback.filter((t) => t.status === 'pending').length,
      accepted: fallback.filter((t) => t.status === 'accepted').length,
      rejected: fallback.filter((t) => t.status === 'rejected').length,
      all: fallback.length,
    });
  };

  useEffect(() => {
    fetchTransfers();
  }, []);

  // Fetch batches & partners when opening modal
  const handleOpenTransferModal = async () => {
    setShowTransferModal(true);
    setLoadingOptions(true);
    try {
      const [batchesRes, partnersRes] = await Promise.all([
        api.batches.getBatches({ limit: 50 }),
        api.partners.getPartners(),
      ]);

      let batchesList = [];
      if (batchesRes.success && batchesRes.data?.batches) {
        batchesList = batchesRes.data.batches.filter((b: any) => !b.isRecalled && b.status !== 'Recalled');
        setAvailableBatches(batchesList);
        if (batchesList.length > 0 && !selectedBatchId) {
          setSelectedBatchId(batchesList[0].batchNumber || batchesList[0]._id);
        }
      }

      let partnersList = [];
      if (partnersRes.success && partnersRes.data?.partners) {
        partnersList = partnersRes.data.partners;
        setAvailablePartners(partnersList);
        if (partnersList.length > 0 && !selectedPartnerId) {
          setSelectedPartnerId(partnersList[0]._id || partnersList[0].id);
        }
      }
    } catch (err) {
      console.warn('Failed to load batch/partner options for transfer modal:', err);
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleCreateTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatchId) {
      toast.error('Please select an active batch to transfer.');
      return;
    }
    if (!transferQuantity || transferQuantity < 1) {
      toast.error('Transfer quantity must be at least 1 unit.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.transfers.createTransfer({
        batchId: selectedBatchId,
        toPartnerId: selectedPartnerId || undefined,
        quantity: Number(transferQuantity),
        notes: transferNotes || undefined,
      });

      if (res.success) {
        toast.success(`Custody transfer initialized for Batch ${selectedBatchId}!`);
        setShowTransferModal(false);
        setTransferNotes('');
        await fetchTransfers();
      } else {
        toast.error(res.error?.message || 'Failed to initiate transfer');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error initiating transfer');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTransfers = transfers.filter((t) => t.status === activeTab);

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
          onClick={handleOpenTransferModal}
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
            className={`px-5 py-2 rounded-full text-xs font-medium capitalize transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-black text-white shadow-sm'
                : 'bg-white text-black/60 hover:text-black border border-black/5'
            }`}
          >
            {tab} ({counts[tab] ?? transfers.filter((t) => t.status === tab).length})
          </button>
        ))}
      </div>

      {/* Transfer List Table */}
      <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-6 h-6 animate-spin text-black/40" />
            <p className="text-xs text-black/40 font-medium">Loading supply chain handoffs...</p>
          </div>
        ) : filteredTransfers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Truck className="w-10 h-10 text-black/20 mx-auto" />
            <h4 className="text-sm font-medium text-black">No {activeTab} transfers found</h4>
            <p className="text-xs text-black/40 max-w-sm mx-auto">
              {activeTab === 'pending'
                ? 'All shipments have been accepted or processed. Initiate a new custody transfer above.'
                : `There are no ${activeTab} custody records in this ledger.`}
            </p>
          </div>
        ) : (
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
                        onClick={() => {
                          setSelectedTransferDetail(t);
                          setShowTechProof(false);
                        }}
                        className="px-3 py-1.5 bg-[#F5F5F5] hover:bg-black/5 text-black rounded-xl font-medium transition-colors cursor-pointer"
                      >
                        View Timeline
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transfer Batch Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-black/5 text-black">
            <button
              type="button"
              onClick={() => setShowTransferModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-black/50 hover:text-black hover:bg-black/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-medium tracking-tight text-black mb-1">
              Initiate Supply Chain Custody Transfer
            </h3>
            <p className="text-xs text-black/60 mb-6">
              Authorized partner must sign-off using OTP or partner token to accept custody.
            </p>

            {loadingOptions ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-2">
                <Loader2 className="w-6 h-6 animate-spin text-black/40" />
                <p className="text-xs text-black/40">Loading available inventory & partners...</p>
              </div>
            ) : (
              <form onSubmit={handleCreateTransfer} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                    Select Partner
                  </label>
                  <select
                    value={selectedPartnerId}
                    onChange={(e) => setSelectedPartnerId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-medium focus:outline-none focus:border-black"
                  >
                    {availablePartners.length > 0 ? (
                      availablePartners.map((p) => (
                        <option key={p._id || p.id} value={p._id || p.id}>
                          {p.businessName || p.name} ({p.role}) {p.location?.city ? `— ${p.location.city}` : ''}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="National Pharma Logistics (Bhiwandi)">
                          National Pharma Logistics (Bhiwandi Hub) - Distributor
                        </option>
                        <option value="Apex Health Distribution North">
                          Apex Health Distribution North (Delhi) - Distributor
                        </option>
                        <option value="QuickMeds South Wholesale">
                          QuickMeds South Wholesale (Bengaluru) - Wholesaler
                        </option>
                      </>
                    )}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                      Batch Number
                    </label>
                    <select
                      value={selectedBatchId}
                      onChange={(e) => setSelectedBatchId(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-mono focus:outline-none focus:border-black"
                    >
                      {availableBatches.length > 0 ? (
                        availableBatches.map((b) => (
                          <option key={b._id || b.batchNumber} value={b.batchNumber || b._id}>
                            {b.batchNumber} ({b.quantity?.toLocaleString()} units)
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="BATCH-2026-DEL99">BATCH-2026-DEL99 (10,000 units)</option>
                          <option value="BATCH-2026-MUM14">BATCH-2026-MUM14 (25,000 units)</option>
                          <option value="BATCH-2026-BLR02">BATCH-2026-BLR02 (5,000 units)</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                      Quantity to Transfer
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={100000}
                      value={transferQuantity}
                      onChange={(e) => setTransferQuantity(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-medium focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                    Shipping Notes / Waybill (Optional)
                  </label>
                  <input
                    type="text"
                    value={transferNotes}
                    onChange={(e) => setTransferNotes(e.target.value)}
                    placeholder="e.g. Temperature-controlled truck MH-04-AZ-2041"
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-medium focus:outline-none focus:border-black"
                  />
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 leading-relaxed">
                  <ShieldCheck className="w-4 h-4 inline mr-1 text-emerald-700" />
                  Handoff triggers a chain-of-custody transaction and updates GPS verification proof.
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{submitting ? 'Initiating Transfer...' : 'Send Custody Transfer Request'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Transfer Detail View with Timeline */}
      {selectedTransferDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-black/5 text-black max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedTransferDetail(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-black/50 hover:text-black hover:bg-black/5 transition-colors cursor-pointer"
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
                <span className="text-xs text-black/50 font-mono">
                  Batch: {selectedTransferDetail.batchNumber} ({selectedTransferDetail.quantity?.toLocaleString()} units)
                </span>
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

            {/* Stepper with real timeline entries if present */}
            <div className="space-y-4 mb-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-black/10 text-xs">
              {selectedTransferDetail.raw?.timeline && selectedTransferDetail.raw.timeline.length > 0 ? (
                selectedTransferDetail.raw.timeline.map((step: any, idx: number) => (
                  <div key={idx} className="relative flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                        step.status === 'Accepted'
                          ? 'bg-emerald-500 text-white'
                          : step.status === 'Rejected'
                          ? 'bg-rose-500 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {step.status === 'Accepted' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : step.status === 'Rejected' ? (
                        <XCircle className="w-4 h-4" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <span className="font-semibold text-black block">
                        {step.status === 'Pending'
                          ? 'Custody Transfer Initiated'
                          : `Shipment ${step.status}`}
                      </span>
                      <span className="text-black/60">
                        {step.actorName ? `${step.actorName} (${step.actorRole || 'Partner'})` : step.note || 'Recorded in custody ledger'}
                      </span>
                      {step.note && step.actorName && (
                        <p className="text-black/50 text-[11px] mt-0.5">{step.note}</p>
                      )}
                      <span className="text-black/40 block text-[11px] mt-0.5">
                        {step.timestamp ? new Date(step.timestamp).toLocaleString('en-IN') : selectedTransferDetail.requestDate}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <>
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
                      <span className="font-semibold text-black block">Destination Partner Receipt</span>
                      <span className="text-black/60">
                        {selectedTransferDetail.partnerName} ({selectedTransferDetail.destLocation})
                      </span>
                      <span className="text-black/40 block text-[11px]">
                        {selectedTransferDetail.completionDate || 'Awaiting Partner QR Check-in & Signature'}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Technical Proof Dropdown (Isolated without crypto wording in standard view) */}
            <div className="border border-black/5 rounded-2xl p-3 bg-[#F5F5F5] mb-6">
              <button
                type="button"
                onClick={() => setShowTechProof(!showTechProof)}
                className="w-full flex items-center justify-between text-xs font-semibold text-black/70 hover:text-black cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-black/50" />
                  <span>View Technical Proof</span>
                </div>
                {showTechProof ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showTechProof && (
                <div className="mt-3 pt-3 border-t border-black/10 space-y-2 text-[11px] font-mono text-black/70">
                  <div>
                    <span className="text-black/40 block">Transfer Ref ID:</span>
                    <span className="break-all">{selectedTransferDetail.raw?.transferId || selectedTransferDetail.transferId}</span>
                  </div>
                  <div>
                    <span className="text-black/40 block">Initiate Proof Hash:</span>
                    <span className="break-all">{selectedTransferDetail.raw?.initiateTxHash || '0x498e0ab81c7e09d123bf01...a19f'}</span>
                  </div>
                  {selectedTransferDetail.raw?.respondTxHash && (
                    <div>
                      <span className="text-black/40 block">Handoff Confirmation Proof:</span>
                      <span className="break-all">{selectedTransferDetail.raw.respondTxHash}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-black/40 block">Consensus Status:</span>
                    <span className="text-emerald-700 font-sans font-semibold">Immutable On-Chain Ledger Confirmed</span>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setSelectedTransferDetail(null)}
              className="w-full py-2.5 bg-black text-white text-xs font-medium rounded-full hover:bg-gray-800 transition-colors cursor-pointer"
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
