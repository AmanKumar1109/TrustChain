import React, { useState } from 'react';
import {
  Layers,
  Plus,
  QrCode,
  ShieldCheck,
  Download,
  CheckCircle2,
  Clock,
  X,
  FileText,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { BatchItem } from '../types';

export const BatchesScreen: React.FC = () => {
  const [batches, setBatches] = useState<BatchItem[]>([
    {
      id: 'batch-1',
      batchNumber: 'BATCH-2026-DEL99',
      productId: 'prod-1',
      productName: 'Cipla Asthalin Inhaler 100mcg',
      quantity: 10000,
      mfgDate: '15 Sep 2026',
      expiryDate: '31 Aug 2029',
      protectionLevel: 'high-value',
      status: 'active',
      creditsCost: 10000,
      qrGenerated: true,
      txHash: '0x7f4a8e3189bcd0911293a9ff827102eac69f91a2',
    },
    {
      id: 'batch-2',
      batchNumber: 'BATCH-2026-MUM14',
      productId: 'prod-2',
      productName: 'Cipla Montair-LC Tablets',
      quantity: 25000,
      mfgDate: '01 Sep 2026',
      expiryDate: '31 Jul 2028',
      protectionLevel: 'standard',
      status: 'active',
      creditsCost: 2500,
      qrGenerated: true,
      txHash: '0x33b190fe45f9103cba71890123fe554329aa8701',
    },
    {
      id: 'batch-3',
      batchNumber: 'BATCH-2026-BLR02',
      productId: 'prod-3',
      productName: 'Cipla Foracort 400 Rotacaps',
      quantity: 5000,
      mfgDate: '20 Aug 2026',
      expiryDate: '30 Jun 2029',
      protectionLevel: 'high-value',
      status: 'in-transit',
      creditsCost: 5000,
      qrGenerated: true,
      txHash: '0x88ea9121890cd123490aa129031ef098192a0142',
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createdSuccessBatch, setCreatedSuccessBatch] = useState<BatchItem | null>(null);

  // Form inputs
  const [form, setForm] = useState({
    productName: 'Cipla Asthalin Inhaler 100mcg',
    batchNumber: '',
    quantity: 5000,
    mfgDate: '2026-10-01',
    expiryDate: '2029-09-30',
    protectionLevel: 'high-value' as 'high-value' | 'standard',
  });

  // Calculate estimated credits
  const estimatedCredits =
    form.protectionLevel === 'high-value' ? form.quantity * 1 : Math.round(form.quantity * 0.1);

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const newBatch: BatchItem = {
      id: `batch-${Date.now()}`,
      batchNumber: form.batchNumber || `BATCH-2026-AUTO${Math.floor(100 + Math.random() * 900)}`,
      productId: 'prod-1',
      productName: form.productName,
      quantity: Number(form.quantity),
      mfgDate: form.mfgDate,
      expiryDate: form.expiryDate,
      protectionLevel: form.protectionLevel,
      status: 'active',
      creditsCost: estimatedCredits,
      qrGenerated: true,
      txHash: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    };

    setBatches([newBatch, ...batches]);
    setCreatedSuccessBatch(newBatch);
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setCreatedSuccessBatch(null);
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
            Production Batches
          </h2>
          <p className="text-black/60 text-sm mt-1">
            Mint cryptographic batches on Polygon, choose protection tiers, and export verified QR labels.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setForm({
              productName: 'Cipla Asthalin Inhaler 100mcg',
              batchNumber: `BATCH-2026-IN${Math.floor(100 + Math.random() * 900)}`,
              quantity: 5000,
              mfgDate: '2026-10-01',
              expiryDate: '2029-09-30',
              protectionLevel: 'high-value',
            });
            setShowCreateModal(true);
          }}
          className="inline-flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-full text-xs font-medium hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Batch</span>
        </button>
      </div>

      {/* Batches Table Card */}
      <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-black/5 flex items-center justify-between">
          <div>
            <h3 className="text-base font-medium text-black">Active & Historic Batches</h3>
            <p className="text-xs text-black/50">Each batch corresponds to an on-chain Polygon transaction</p>
          </div>
          <span className="text-xs font-medium text-black/60">{batches.length} Total Batches</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-black/5 bg-[#F5F5F5]/60 text-black/50 uppercase font-semibold">
                <th className="p-4 pl-6">Batch ID</th>
                <th className="p-4">Product Name</th>
                <th className="p-4">Units</th>
                <th className="p-4">Protection Tier</th>
                <th className="p-4">Mfg / Expiry</th>
                <th className="p-4">Polygon TxHash</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {batches.map((batch) => (
                <tr key={batch.id} className="hover:bg-black/[0.01] transition-colors">
                  <td className="p-4 pl-6 font-mono font-medium text-black">
                    {batch.batchNumber}
                  </td>
                  <td className="p-4 font-medium text-black">{batch.productName}</td>
                  <td className="p-4 font-medium text-black">{batch.quantity.toLocaleString()}</td>
                  <td className="p-4">
                    {batch.protectionLevel === 'high-value' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>High-Value (Per-Unit)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full">
                        <span>Standard (Batch-Level)</span>
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-black/60">
                    {batch.mfgDate} · {batch.expiryDate}
                  </td>
                  <td className="p-4 font-mono text-[10px] text-black/60 truncate max-w-[140px]">
                    {batch.txHash}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full ${
                        batch.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : batch.status === 'in-transit'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {batch.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button
                      type="button"
                      onClick={() => setCreatedSuccessBatch(batch)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F5F5] hover:bg-black/5 rounded-xl text-black font-medium transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>QRs</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE BATCH MODAL FLOW */}
      {showCreateModal && !createdSuccessBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-black/5 text-black max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={closeModals}
              className="absolute top-6 right-6 p-2 rounded-full text-black/50 hover:text-black hover:bg-black/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-medium tracking-tight text-black mb-1">
              Create New Production Batch
            </h3>
            <p className="text-xs text-black/60 mb-6">
              Generate cryptographic QR identities anchored to Polygon Mainnet.
            </p>

            <form onSubmit={handleCreateBatch} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                  Select Product Line
                </label>
                <select
                  value={form.productName}
                  onChange={(e) => setForm({ ...form, productName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-medium focus:outline-none focus:border-black"
                >
                  <option value="Cipla Asthalin Inhaler 100mcg">Cipla Asthalin Inhaler 100mcg</option>
                  <option value="Cipla Montair-LC Tablets">Cipla Montair-LC Tablets</option>
                  <option value="Cipla Foracort 400 Rotacaps">Cipla Foracort 400 Rotacaps</option>
                  <option value="Cipla Omez 20mg Capsules">Cipla Omez 20mg Capsules</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                    Batch Number
                  </label>
                  <input
                    type="text"
                    required
                    value={form.batchNumber}
                    onChange={(e) => setForm({ ...form, batchNumber: e.target.value })}
                    placeholder="BATCH-2026-DEL102"
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-mono uppercase focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                    Quantity (Units)
                  </label>
                  <input
                    type="number"
                    min={100}
                    max={100000}
                    required
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-medium focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                    Manufacturing Date
                  </label>
                  <input
                    type="date"
                    required
                    value={form.mfgDate}
                    onChange={(e) => setForm({ ...form, mfgDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-medium focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    required
                    value={form.expiryDate}
                    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black text-sm font-medium focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Protection Level Selector (High-value vs Standard) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-2">
                  Protection Level
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setForm({ ...form, protectionLevel: 'high-value' })}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      form.protectionLevel === 'high-value'
                        ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                        : 'border-black/10 hover:border-black/30 bg-[#F5F5F5]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-black">High-Value (Per-Unit)</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-[11px] text-black/60 leading-tight">
                      Unique cryptographic QR on every pack. Full individual clone velocity detection.
                    </p>
                  </div>

                  <div
                    onClick={() => setForm({ ...form, protectionLevel: 'standard' })}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      form.protectionLevel === 'standard'
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                        : 'border-black/10 hover:border-black/30 bg-[#F5F5F5]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-black">Standard (Batch-Level)</span>
                      <Layers className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-[11px] text-black/60 leading-tight">
                      Master QR per shipper case / carton. Economical credit consumption for FMCG.
                    </p>
                  </div>
                </div>
              </div>

              {/* Estimated Credits Cost Summary */}
              <div className="p-4 bg-[#F5F5F5] rounded-2xl border border-black/5 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-black/60">Estimated Minting Cost:</span>
                  <span className="font-semibold text-black">{estimatedCredits.toLocaleString()} Credits</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-black/60">Current Credit Balance:</span>
                  <span className="text-emerald-700 font-medium">84,200 Available</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-black/5 text-[11px] text-black/50">
                  <span>Polygon Blockchain Gas Fee:</span>
                  <span className="font-medium text-black">Sponsored by TrustChain (₹0)</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors shadow-sm"
                >
                  Confirm & Mint Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUCCESS SCREEN: Download QR Codes (PDF / ZIP) */}
      {createdSuccessBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-black/5 text-black text-center space-y-4">
            <button
              type="button"
              onClick={closeModals}
              className="absolute top-6 right-6 p-2 rounded-full text-black/50 hover:text-black hover:bg-black/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-2xl font-medium tracking-tight text-black">
                Batch Successfully Minted
              </h3>
              <p className="text-xs text-black/60 mt-1 max-w-sm mx-auto">
                {createdSuccessBatch.quantity.toLocaleString()} verified digital identities anchored
                on Polygon Mainnet.
              </p>
            </div>

            <div className="p-4 bg-[#F5F5F5] rounded-2xl border border-black/5 text-xs text-black/70 space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-black/50">Batch ID:</span>
                <span className="font-mono font-medium text-black">{createdSuccessBatch.batchNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/50">Units Protected:</span>
                <span className="font-medium text-black">{createdSuccessBatch.quantity.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/50">Polygon Hash:</span>
                <span className="font-mono text-emerald-800 truncate max-w-[200px]">{createdSuccessBatch.txHash}</span>
              </div>
            </div>

            {/* Download QR buttons */}
            <div className="pt-2 space-y-2.5">
              <button
                type="button"
                onClick={() => alert(`Downloading Print-Ready PDF for ${createdSuccessBatch.batchNumber}`)}
                className="w-full py-3 bg-black text-white text-xs font-medium rounded-full hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download QR codes (Print-Ready PDF Labels)</span>
              </button>

              <button
                type="button"
                onClick={() => alert(`Downloading High-Res SVG/PNG ZIP for ${createdSuccessBatch.batchNumber}`)}
                className="w-full py-3 bg-[#F5F5F5] text-black text-xs font-medium rounded-full hover:bg-black/5 border border-black/10 transition-colors flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Download QR codes (Vector SVG / PNG ZIP)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchesScreen;
