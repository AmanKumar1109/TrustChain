import React, { useState } from 'react';
import {
  ShieldCheck,
  Clock,
  ArrowRightLeft,
  ChevronRight,
  ExternalLink,
  Calendar,
  Store,
  Receipt,
  FileCheck2,
  X,
  History as HistoryIcon,
  Tag,
} from 'lucide-react';
import { ClaimedProduct } from '../types';

interface MyProductsScreenProps {
  products: ClaimedProduct[];
  onInitiateTransfer: (product: ClaimedProduct) => void;
  onOpenSmsClaim: () => void;
}

export const MyProductsScreen: React.FC<MyProductsScreenProps> = ({
  products,
  onInitiateTransfer,
  onOpenSmsClaim,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<ClaimedProduct | null>(null);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Claimed' | 'Pending Claim'>('All');

  const filteredProducts = products.filter((p) => {
    if (activeFilter === 'All') return true;
    return p.status === activeFilter;
  });

  return (
    <div className="space-y-5 pb-20 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium text-black tracking-tight">My Vault & Products</h2>
          <p className="text-xs text-black/50">Verified ownership, warranty certificates, and proof of purchase</p>
        </div>
        <button
          type="button"
          onClick={onOpenSmsClaim}
          className="text-xs font-medium text-[#2B2644] bg-[#2B2644]/5 hover:bg-[#2B2644]/10 px-3 py-1.5 rounded-full transition-colors"
        >
          + Claim New
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(['All', 'Claimed', 'Pending Claim'] as const).map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeFilter === filter
                ? 'bg-black text-white shadow-sm'
                : 'bg-white text-black/70 border border-black/10 hover:bg-black/[0.03]'
            }`}
          >
            {filter} {filter === 'All' ? `(${products.length})` : ''}
          </button>
        ))}
      </div>

      {/* Products List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => {
          const isPending = product.status === 'Pending Claim';
          return (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="p-4 bg-white rounded-3xl border border-black/5 shadow-sm hover:border-black/15 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-start gap-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-black/5 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${
                        isPending
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {product.status}
                    </span>
                    <span className="text-[11px] text-black/40 truncate">{product.brand}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-black truncate">{product.name}</h4>
                  <span className="text-[11px] text-black/50 block mt-1">
                    Warranty till: <span className="font-semibold text-black/70">{product.warrantyValidUntil}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-black/5 text-xs text-black/50">
                <span className="text-[11px] font-mono">{product.batchNumber}</span>
                <span className="font-medium text-black group-hover:text-black/70 flex items-center gap-0.5">
                  View Certificate <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          );
        })}

        {filteredProducts.length === 0 && (
          <div className="p-8 text-center bg-white rounded-3xl border border-black/5">
            <Tag className="w-8 h-8 text-black/30 mx-auto mb-2" />
            <h4 className="text-sm font-medium text-black">No products found</h4>
            <p className="text-xs text-black/50 mt-1">Claim a verified purchase to activate your proof of warranty.</p>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#F5F5F5] w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto border border-black/10 shadow-2xl p-6 space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-black/10">
              <span className="text-xs font-semibold text-black/50 uppercase tracking-wider">
                Product Certificate & Warranty
              </span>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-black/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Product Card Header */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-black/5 shadow-sm">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-20 h-20 rounded-2xl object-cover border border-black/5"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {selectedProduct.status}
                  </span>
                  <span className="text-xs text-black/40">{selectedProduct.brand}</span>
                </div>
                <h3 className="text-base font-semibold text-black mt-1 leading-snug">{selectedProduct.name}</h3>
                <span className="text-xs font-mono text-black/50 block mt-1">
                  SN: {selectedProduct.serialNumber}
                </span>
              </div>
            </div>

            {/* Warranty Info Card */}
            <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-emerald-700">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Active Digital Warranty</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-black/5">
                <div>
                  <span className="text-black/50 block">Coverage Duration</span>
                  <span className="font-semibold text-black">12 Months Manufacturer</span>
                </div>
                <div>
                  <span className="text-black/50 block">Valid Until</span>
                  <span className="font-semibold text-emerald-700">{selectedProduct.warrantyValidUntil}</span>
                </div>
              </div>
              <p className="text-[11px] text-black/60 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                Authorized replacement or repairs available at any certified {selectedProduct.brand} brand center with this digital token certificate.
              </p>
            </div>

            {/* Purchase Proof */}
            <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-black/70">
                <Receipt className="w-5 h-5 text-[#2B2644]" />
                <span className="text-xs font-bold uppercase tracking-wider text-black">Proof of Purchase</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-black/5">
                <div>
                  <span className="text-black/50 block">Retailer</span>
                  <span className="font-semibold text-black">{selectedProduct.purchaseProof.retailerName}</span>
                </div>
                <div>
                  <span className="text-black/50 block">Invoice Number</span>
                  <span className="font-mono text-black/80">{selectedProduct.purchaseProof.invoiceNumber}</span>
                </div>
                <div>
                  <span className="text-black/50 block">Purchase Date</span>
                  <span className="text-black">{selectedProduct.purchaseProof.purchaseDate}</span>
                </div>
                <div>
                  <span className="text-black/50 block">Amount Paid</span>
                  <span className="font-semibold text-black">{selectedProduct.purchaseProof.amountPaid}</span>
                </div>
              </div>
            </div>

            {/* Ownership Timeline */}
            <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-black/70">
                <HistoryIcon className="w-5 h-5 text-[#2B2644]" />
                <span className="text-xs font-bold uppercase tracking-wider text-black">Chain of Custody & Ownership</span>
              </div>
              <div className="relative pl-6 space-y-4 pt-2 border-t border-black/5">
                <div className="absolute left-2.5 top-5 bottom-3 w-0.5 bg-black/10" />
                {selectedProduct.ownershipHistory.map((step, idx) => (
                  <div key={idx} className="relative text-xs">
                    <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#2B2644] ring-4 ring-white" />
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-black">{step.role}: {step.name}</span>
                      <span className="text-[11px] text-black/40">{step.date}</span>
                    </div>
                    <span className="text-[11px] text-black/60">{step.location}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  const productToTransfer = selectedProduct;
                  setSelectedProduct(null);
                  onInitiateTransfer(productToTransfer);
                }}
                className="flex-1 py-3.5 bg-black text-white text-xs font-semibold rounded-full hover:bg-black/90 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <ArrowRightLeft className="w-4 h-4" />
                Transfer to Another User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProductsScreen;
