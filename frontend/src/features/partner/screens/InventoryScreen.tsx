import React, { useState } from 'react';
import {
  PackageCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Clock,
} from 'lucide-react';
import { InventoryBatch } from '../types';

export const InventoryScreen: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'in-stock' | 'low-stock' | 'recalled'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [batches] = useState<InventoryBatch[]>([
    {
      id: 'inv-1',
      batchNumber: 'BATCH-2026-DEL99',
      productName: 'Cipla Asthalin Inhaler 100mcg',
      category: 'Pharmaceutical',
      unitsInStock: 4800,
      mfgDate: '15 Sep 2026',
      expiryDate: '31 Aug 2029',
      status: 'in-stock',
      lastScannedDate: 'Today, 11:20 AM',
    },
    {
      id: 'inv-2',
      batchNumber: 'BATCH-2026-MUM14',
      productName: 'Cipla Montair-LC Tablets',
      category: 'Pharmaceutical',
      unitsInStock: 240,
      mfgDate: '01 Sep 2026',
      expiryDate: '31 Jul 2028',
      status: 'low-stock',
      lastScannedDate: 'Yesterday',
    },
    {
      id: 'inv-3',
      batchNumber: 'BT-8820-AUDIO',
      productName: 'boAt Rockerz 450 Pro Headphones',
      category: 'Electronics',
      unitsInStock: 85,
      mfgDate: '10 Jul 2026',
      expiryDate: '1 Yr Warranty',
      status: 'in-stock',
      lastScannedDate: '28 Sep 2026',
    },
    {
      id: 'inv-4',
      batchNumber: 'TATA-BATCH-0994-REC',
      productName: 'Tata Consumer Daily Care Batch #TC-99',
      category: 'FMCG',
      unitsInStock: 120,
      mfgDate: '01 Jun 2026',
      expiryDate: '30 Nov 2026',
      status: 'recalled',
      lastScannedDate: '15 Sep 2026',
    },
  ]);

  const filtered = batches.filter((b) => {
    const matchStatus = filterStatus === 'all' || b.status === filterStatus;
    const matchSearch =
      b.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2
          className="text-3xl font-medium tracking-tight text-black"
          style={{ letterSpacing: '-0.03em' }}
        >
          Warehouse & Store Inventory
        </h2>
        <p className="text-black/60 text-sm mt-1">
          Cryptographically recorded stock batches ready for retail distribution or counter sale.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-4 border border-black/5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-black/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product name or batch..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#F5F5F5] border border-black/5 text-black placeholder:text-black/40 text-xs font-medium focus:outline-none"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {(['all', 'in-stock', 'low-stock', 'recalled'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium capitalize transition-all whitespace-nowrap ${
                filterStatus === st
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-[#F5F5F5] text-black/60 hover:text-black'
              }`}
            >
              {st.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-black/5 bg-[#F5F5F5]/60 text-black/50 uppercase font-semibold">
                <th className="p-4 pl-6">Batch ID</th>
                <th className="p-4">Product Line</th>
                <th className="p-4">Category</th>
                <th className="p-4">Units In Stock</th>
                <th className="p-4">Mfg / Expiry</th>
                <th className="p-4">Last Scanned</th>
                <th className="p-4 pr-6">Stock Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-black/[0.01] transition-colors">
                  <td className="p-4 pl-6 font-mono font-medium text-black">{b.batchNumber}</td>
                  <td className="p-4 font-medium text-black">{b.productName}</td>
                  <td className="p-4 text-black/60">{b.category}</td>
                  <td className="p-4 font-bold text-black">{b.unitsInStock.toLocaleString()}</td>
                  <td className="p-4 text-black/60">
                    {b.mfgDate} · {b.expiryDate}
                  </td>
                  <td className="p-4 text-black/50">{b.lastScannedDate}</td>
                  <td className="p-4 pr-6">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full ${
                        b.status === 'in-stock'
                          ? 'bg-emerald-50 text-emerald-800'
                          : b.status === 'low-stock'
                          ? 'bg-amber-50 text-amber-800'
                          : 'bg-rose-50 text-rose-800'
                      }`}
                    >
                      {b.status === 'in-stock' && <CheckCircle2 className="w-3 h-3" />}
                      {b.status === 'low-stock' && <AlertTriangle className="w-3 h-3" />}
                      {b.status === 'recalled' && <AlertOctagon className="w-3 h-3" />}
                      <span>{b.status.replace('-', ' ')}</span>
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

export default InventoryScreen;
