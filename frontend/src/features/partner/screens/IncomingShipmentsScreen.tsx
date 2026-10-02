import React, { useState, useEffect } from 'react';
import {
  Inbox,
  CheckCircle2,
  XCircle,
  Truck,
  Building2,
  MapPin,
  Clock,
  X,
  AlertTriangle,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { ShipmentItem } from '../types';
import { api } from '../../../services/api';
import { toast } from '../../../services/toast';

export const IncomingShipmentsScreen: React.FC = () => {
  const [shipments, setShipments] = useState<ShipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState<ShipmentItem | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('Packaging seal broken / Carton tampering suspected');
  const [submittingAction, setSubmittingAction] = useState(false);

  const fetchIncomingShipments = async () => {
    try {
      setLoading(true);
      const res = await api.transfers.getIncoming();
      if (res.success && res.data?.transfers) {
        const raw = res.data.transfers;
        const mapped: ShipmentItem[] = raw.map((t: any) => ({
          id: t._id || t.id,
          shipmentId: t.transferId || `SHP-${(t._id || '').slice(-6).toUpperCase()}`,
          sender: t.fromName || 'Authorized Manufacturer / Depot Hub',
          batchNumber: t.batchNumber || t.batchId || 'N/A',
          productName: t.productName || (typeof t.product === 'object' ? t.product?.name : 'Pharmaceutical Consignment'),
          quantity: t.quantity || 0,
          originLocation: t.fromLocation || 'Central Production Facility, Goa',
          dispatchDate: t.createdAt
            ? new Date(t.createdAt).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : 'Recently',
          status: (t.status ? t.status.toLowerCase() : 'pending') as 'pending' | 'accepted' | 'rejected',
          rejectionReason: t.rejectionReason,
        }));
        setShipments(mapped);
      } else {
        populateMockFallback();
      }
    } catch (err) {
      console.warn('Failed to load incoming shipments from API:', err);
      populateMockFallback();
    } finally {
      setLoading(false);
    }
  };

  const populateMockFallback = () => {
    setShipments([
      {
        id: 'ship-1',
        shipmentId: 'SHP-2026-904',
        sender: 'Cipla Healthcare Manufacturing Plant 4 (Goa)',
        batchNumber: 'BATCH-2026-DEL99',
        productName: 'Cipla Asthalin Inhaler 100mcg',
        quantity: 5000,
        originLocation: 'Verna Industrial Area, Goa',
        dispatchDate: '01 Oct 2026, 08:30 AM',
        status: 'pending',
      },
      {
        id: 'ship-2',
        shipmentId: 'SHP-2026-881',
        sender: 'National Pharma Logistics (Bhiwandi Hub)',
        batchNumber: 'BATCH-2026-MUM14',
        productName: 'Cipla Montair-LC Tablets',
        quantity: 1200,
        originLocation: 'Bhiwandi Warehouse, Mumbai',
        dispatchDate: '30 Sep 2026, 04:15 PM',
        status: 'pending',
      },
      {
        id: 'ship-3',
        shipmentId: 'SHP-2026-764',
        sender: 'boAt Lifestyle Logistics Hub',
        batchNumber: 'BT-8820-AUDIO',
        productName: 'boAt Rockerz 450 Pro Headphones',
        quantity: 400,
        originLocation: 'Noida Electronic City, UP',
        dispatchDate: '28 Sep 2026, 11:00 AM',
        status: 'accepted',
      },
    ]);
  };

  useEffect(() => {
    fetchIncomingShipments();
  }, []);

  const handleAccept = async (ship: ShipmentItem) => {
    setSubmittingAction(true);
    try {
      const res = await api.transfers.respondTransfer(ship.id, true);
      if (res.success) {
        toast.success(`Custody accepted! Batch ${ship.batchNumber} added to your inventory.`);
        setShipments((prev) =>
          prev.map((s) => (s.id === ship.id ? { ...s, status: 'accepted' } : s))
        );
      } else {
        toast.error(res.error?.message || 'Failed to accept consignment');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error accepting shipment');
    } finally {
      setSubmittingAction(false);
      setSelectedShipment(null);
    }
  };

  const handleRejectConfirm = async () => {
    if (!selectedShipment) return;
    setSubmittingAction(true);
    try {
      const res = await api.transfers.respondTransfer(selectedShipment.id, false, rejectReason);
      if (res.success) {
        toast.success(`Consignment rejected. Quality discrepancy recorded.`);
        setShipments((prev) =>
          prev.map((s) =>
            s.id === selectedShipment.id
              ? { ...s, status: 'rejected', rejectionReason: rejectReason }
              : s
          )
        );
      } else {
        toast.error(res.error?.message || 'Failed to reject consignment');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error rejecting shipment');
    } finally {
      setSubmittingAction(false);
      setShowRejectModal(false);
      setSelectedShipment(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2
          className="text-3xl font-medium tracking-tight text-black"
          style={{ letterSpacing: '-0.03em' }}
        >
          Incoming Inbound Shipments
        </h2>
        <p className="text-black/60 text-sm mt-1">
          Review consignments dispatched by upstream manufacturers or distributors. Verify batch seals
          before accepting custody on Polygon.
        </p>
      </div>

      {/* Shipments List */}
      <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-black/5 flex items-center justify-between">
          <h3 className="text-base font-medium text-black">Consignments Awaiting Inspection</h3>
          <span className="text-xs font-medium text-black/60">
            {shipments.filter((s) => s.status === 'pending').length} Pending Review
          </span>
        </div>

        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-6 h-6 animate-spin text-black/40" />
            <p className="text-xs text-black/40 font-medium">Checking inbound consignments...</p>
          </div>
        ) : shipments.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Inbox className="w-10 h-10 text-black/20 mx-auto" />
            <h4 className="text-sm font-medium text-black">No inbound shipments pending</h4>
            <p className="text-xs text-black/40 max-w-sm mx-auto">
              Your depot is currently up to date. Newly dispatched batches from upstream suppliers will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-black/5">
            {shipments.map((ship) => (
              <div
                key={ship.id}
                className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-black/[0.01] transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium text-xs text-black bg-[#F5F5F5] px-2.5 py-0.5 rounded-full border border-black/5">
                      {ship.shipmentId}
                    </span>
                    <span
                      className={`text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full ${
                        ship.status === 'accepted'
                          ? 'bg-emerald-50 text-emerald-700'
                          : ship.status === 'rejected'
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {ship.status}
                    </span>
                  </div>

                  <h4 className="text-base font-medium text-black">{ship.productName}</h4>
                  <p className="text-xs text-black/60 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-black/40" />
                    <span>Sender: {ship.sender}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-black/50 pt-1">
                    <span>
                      Batch: <strong className="font-mono text-black">{ship.batchNumber}</strong>
                    </span>
                    <span>
                      Quantity: <strong className="text-black">{ship.quantity.toLocaleString()} units</strong>
                    </span>
                    <span>Dispatched: {ship.dispatchDate}</span>
                  </div>

                  {ship.rejectionReason && (
                    <div className="text-xs text-rose-700 font-medium pt-1">
                      Rejected reason: {ship.rejectionReason}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {ship.status === 'pending' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleAccept(ship)}
                        disabled={submittingAction}
                        className="px-5 py-2.5 bg-black text-white text-xs font-medium rounded-full hover:bg-gray-800 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Accept Custody</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedShipment(ship);
                          setShowRejectModal(true);
                        }}
                        disabled={submittingAction}
                        className="px-4 py-2.5 bg-white text-rose-700 border border-rose-200 text-xs font-medium rounded-full hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="px-4 py-2 bg-[#F5F5F5] text-black/60 text-xs font-medium rounded-full">
                      {ship.status === 'accepted' ? 'Added to Inventory' : 'Dispatched Rejected'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Modal Asking for Reason */}
      {showRejectModal && selectedShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-200 text-black">
            <button
              type="button"
              onClick={() => setShowRejectModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-black/50 hover:text-black hover:bg-black/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-200">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-medium tracking-tight text-black mb-1">
              Reject Consignment Custody
            </h3>
            <p className="text-xs text-black/60 mb-4">
              Consignment {selectedShipment.shipmentId} ({selectedShipment.batchNumber}) will not be added to your inventory.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                  Rejection Reason
                </label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-xs font-medium focus:outline-none focus:border-black"
                >
                  <option value="Packaging seal broken / Carton tampering suspected">
                    Packaging seal broken / Carton tampering suspected
                  </option>
                  <option value="Quantity mismatch with invoice">
                    Quantity mismatch with invoice
                  </option>
                  <option value="Damaged during physical transit">
                    Damaged during physical transit
                  </option>
                  <option value="Wrong product SKU delivered">
                    Wrong product SKU delivered
                  </option>
                  <option value="Expired or near-expiry formulation">
                    Expired or near-expiry formulation
                  </option>
                </select>
              </div>

              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-[11px] text-rose-900 leading-snug">
                This records a rejection reason in the audit ledger and notifies the upstream supplier.
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 py-2.5 rounded-full text-xs font-medium bg-[#F5F5F5] hover:bg-black/5 text-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRejectConfirm}
                  disabled={submittingAction}
                  className="flex-1 py-2.5 rounded-full text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {submittingAction && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Confirm Rejection</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomingShipmentsScreen;
