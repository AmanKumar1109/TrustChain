import React, { useState } from 'react';
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
} from 'lucide-react';
import { ShipmentItem } from '../types';

export const IncomingShipmentsScreen: React.FC = () => {
  const [shipments, setShipments] = useState<ShipmentItem[]>([
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

  const [selectedShipment, setSelectedShipment] = useState<ShipmentItem | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('Packaging seal broken / Carton tampering suspected');

  const handleAccept = (ship: ShipmentItem) => {
    setShipments(
      shipments.map((s) => (s.id === ship.id ? { ...s, status: 'accepted' as const } : s))
    );
    setSelectedShipment(null);
  };

  const handleRejectConfirm = () => {
    if (!selectedShipment) return;
    setShipments(
      shipments.map((s) =>
        s.id === selectedShipment.id
          ? { ...s, status: 'rejected' as const, rejectionReason: rejectReason }
          : s
      )
    );
    setShowRejectModal(false);
    setSelectedShipment(null);
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
                  <span>Batch: <strong className="font-mono text-black">{ship.batchNumber}</strong></span>
                  <span>Quantity: <strong className="text-black">{ship.quantity.toLocaleString()} units</strong></span>
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
                      className="px-5 py-2.5 bg-black text-white text-xs font-medium rounded-full hover:bg-gray-800 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
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
                      className="px-4 py-2.5 bg-white text-rose-700 border border-rose-200 text-xs font-medium rounded-full hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSelectedShipment(ship)}
                    className="px-4 py-2 bg-[#F5F5F5] hover:bg-black/5 text-black text-xs font-medium rounded-full transition-colors"
                  >
                    View Record
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reject Modal Asking for Reason */}
      {showRejectModal && selectedShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-200 text-black">
            <button
              type="button"
              onClick={() => setShowRejectModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-black/50 hover:text-black hover:bg-black/5 transition-colors"
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
                This triggers an automated quality audit alert to the upstream manufacturer and marks
                the consignment as rejected on Polygon.
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 py-2.5 rounded-full text-xs font-medium bg-[#F5F5F5] hover:bg-black/5 text-black"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRejectConfirm}
                  className="flex-1 py-2.5 rounded-full text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shipment Detail Drawer */}
      {selectedShipment && !showRejectModal && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white h-full p-6 sm:p-8 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-black/5 mb-6">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-black/50">
                    Shipment Waybill
                  </span>
                  <h3 className="text-xl font-medium tracking-tight text-black">
                    {selectedShipment.shipmentId}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedShipment(null)}
                  className="p-2 rounded-full text-black/50 hover:text-black hover:bg-black/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 bg-[#F5F5F5] rounded-2xl border border-black/5 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-black/50">Product:</span>
                    <span className="font-semibold text-black">{selectedShipment.productName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/50">Batch ID:</span>
                    <span className="font-mono text-black">{selectedShipment.batchNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/50">Quantity:</span>
                    <span className="font-semibold text-black">{selectedShipment.quantity.toLocaleString()} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/50">Dispatch Date:</span>
                    <span className="text-black">{selectedShipment.dispatchDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/50">Origin:</span>
                    <span className="text-black">{selectedShipment.originLocation}</span>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-900">
                  <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                  <span>Polygon blockchain cryptographic seal intact.</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-black/5">
              <button
                type="button"
                onClick={() => setSelectedShipment(null)}
                className="w-full py-3 bg-black text-white text-xs font-medium rounded-full hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomingShipmentsScreen;
