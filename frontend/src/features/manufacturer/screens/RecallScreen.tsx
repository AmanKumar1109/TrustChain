import React, { useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Clock,
  X,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { RecallRecord } from '../types';

export const RecallScreen: React.FC = () => {
  const [recalls, setRecalls] = useState<RecallRecord[]>([
    {
      id: 'rec-1',
      batchNumber: 'TATA-BATCH-0994-REC',
      productName: 'Tata Consumer Daily Care Batch #TC-99',
      unitsRecalled: 10000,
      recallDate: '15 Sep 2026',
      reason: 'Voluntary Recall #REC-2026-991: Packaging Seal Integrity Revision on Carton Lids.',
      status: 'active',
      returnedUnits: 6840,
    },
    {
      id: 'rec-2',
      batchNumber: 'BATCH-2025-Q4-012',
      productName: 'Cipla Asthalin Inhaler 100mcg',
      unitsRecalled: 5000,
      recallDate: '12 Nov 2025',
      reason: 'Nozzle calibration variance outside 2% tolerance limits.',
      status: 'completed',
      returnedUnits: 4980,
    },
  ]);

  const [selectedBatch, setSelectedBatch] = useState('BATCH-2026-DEL99');
  const [recallReason, setRecallReason] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleInitiateRecall = () => {
    if (!recallReason.trim()) return;
    setShowConfirmModal(true);
  };

  const handleConfirmRecall = () => {
    const newRecall: RecallRecord = {
      id: `rec-${Date.now()}`,
      batchNumber: selectedBatch,
      productName: 'Cipla Asthalin Inhaler 100mcg',
      unitsRecalled: 10000,
      recallDate: 'Just now',
      reason: recallReason,
      status: 'active',
      returnedUnits: 0,
    };
    setRecalls([newRecall, ...recalls]);
    setShowConfirmModal(false);
    setRecallReason('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2
          className="text-3xl font-medium tracking-tight text-black"
          style={{ letterSpacing: '-0.03em' }}
        >
          Emergency Batch Recall
        </h2>
        <p className="text-black/60 text-sm mt-1">
          Instantly flag defective or compromised batches. Any consumer scanning an affected QR will
          immediately receive a bold warning and return instructions.
        </p>
      </div>

      {/* Initiate Recall Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm">
        <div className="flex items-center gap-3 pb-4 border-b border-black/5 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-medium text-black">Broadcast Batch Recall Directive</h3>
            <p className="text-xs text-black/50">Changes propagate to the verification portal within milliseconds</p>
          </div>
        </div>

        <div className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
              Select Batch to Recall
            </label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-mono focus:outline-none focus:border-black"
            >
              <option value="BATCH-2026-DEL99">BATCH-2026-DEL99 (Cipla Asthalin Inhaler - 10,000 units)</option>
              <option value="BATCH-2026-MUM14">BATCH-2026-MUM14 (Cipla Montair-LC - 25,000 units)</option>
              <option value="BATCH-2026-BLR02">BATCH-2026-BLR02 (Cipla Foracort 400 - 5,000 units)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
              Official Recall Reason & Safety Advisory
            </label>
            <textarea
              rows={3}
              value={recallReason}
              onChange={(e) => setRecallReason(e.target.value)}
              placeholder="e.g. Voluntary recall due to packaging seal revision. Do not use, return to point of purchase for immediate full refund."
              className="w-full px-4 py-3 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-medium focus:outline-none focus:border-black resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleInitiateRecall}
              disabled={!recallReason.trim()}
              className="px-8 py-3 bg-orange-600 text-white text-xs font-medium rounded-full hover:bg-orange-700 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
            >
              Proceed to Recall Authorization
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal with Clear Warning */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-200 text-black">
            <button
              type="button"
              onClick={() => setShowConfirmModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-black/50 hover:text-black hover:bg-black/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center mx-auto mb-4 border border-orange-200">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="text-center mb-6">
              <h3 className="text-xl font-medium tracking-tight text-black mb-1">
                Confirm Emergency Batch Recall
              </h3>
              <p className="text-xs text-rose-700 font-medium">
                WARNING: This action cannot be silently undone.
              </p>
            </div>

            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 space-y-2 leading-relaxed mb-6">
              <p>
                <strong>Immediate Consequences:</strong>
              </p>
              <ul className="list-disc pl-4 space-y-1 text-[11px]">
                <li>All QR codes linked to {selectedBatch} will turn ORANGE on consumer scans.</li>
                <li>Distributor & Retail warehouse custody locks will be triggered automatically.</li>
                <li>An immutable recall transaction will be recorded on the Polygon blockchain.</li>
              </ul>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 rounded-full text-xs font-medium bg-[#F5F5F5] hover:bg-black/5 text-black transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRecall}
                className="flex-1 py-3 rounded-full text-xs font-medium bg-orange-600 hover:bg-orange-700 text-white transition-colors shadow-sm"
              >
                Authorize & Broadcast Recall
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List of Past Recalls Table */}
      <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-black/5 flex items-center justify-between">
          <h3 className="text-base font-medium text-black">Historical Recalls & Containment</h3>
          <span className="text-xs text-black/50">{recalls.length} Total Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-black/5 bg-[#F5F5F5]/60 text-black/50 uppercase font-semibold">
                <th className="p-4 pl-6">Batch Number</th>
                <th className="p-4">Product Line</th>
                <th className="p-4">Recall Reason</th>
                <th className="p-4">Recall Date</th>
                <th className="p-4">Units Returned</th>
                <th className="p-4 pr-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {recalls.map((r) => (
                <tr key={r.id} className="hover:bg-black/[0.01] transition-colors">
                  <td className="p-4 pl-6 font-mono font-medium text-black">{r.batchNumber}</td>
                  <td className="p-4 font-medium text-black">{r.productName}</td>
                  <td className="p-4 text-black/70 max-w-xs">{r.reason}</td>
                  <td className="p-4 text-black/60">{r.recallDate}</td>
                  <td className="p-4 font-medium text-black">
                    {r.returnedUnits.toLocaleString()} / {r.unitsRecalled.toLocaleString()}
                  </td>
                  <td className="p-4 pr-6">
                    <span
                      className={`text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full ${
                        r.status === 'active'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-emerald-50 text-emerald-800'
                      }`}
                    >
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

export default RecallScreen;
