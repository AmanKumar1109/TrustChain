import React, { useState } from 'react';
import {
  Gift,
  Plus,
  Sparkles,
  Tag,
  Coins,
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  X,
  Store,
  Layers,
  Search,
} from 'lucide-react';
import { AdminRewardPartner } from '../types';

export const RewardPartnersScreen: React.FC = () => {
  const [partners, setPartners] = useState<AdminRewardPartner[]>([
    {
      id: 'rp-1',
      name: 'Tata 1mg',
      logo: '1mg',
      category: 'Pharmacy',
      activeOffersCount: 4,
      totalRedemptions: 18420,
      pointsRequired: 250,
      offerTitle: 'Flat 25% Off Prescription Medicines',
      status: 'Active',
    },
    {
      id: 'rp-2',
      name: 'Sony India',
      logo: 'SONY',
      category: 'Electronics',
      activeOffersCount: 2,
      totalRedemptions: 6190,
      pointsRequired: 600,
      offerTitle: '₹2,500 Off Audio & Premium Headphones',
      status: 'Active',
    },
    {
      id: 'rp-3',
      name: 'Cult.fit',
      logo: 'CULT',
      category: 'Fitness & Apparel',
      activeOffersCount: 3,
      totalRedemptions: 9810,
      pointsRequired: 450,
      offerTitle: '1 Month Free CultPass Elite Access',
      status: 'Active',
    },
    {
      id: 'rp-4',
      name: 'Apollo Pharmacy 24/7',
      logo: 'APOLLO',
      category: 'Pharmacy',
      activeOffersCount: 5,
      totalRedemptions: 24150,
      pointsRequired: 180,
      offerTitle: 'Flat ₹150 Cashback on Health Supplements',
      status: 'Active',
    },
    {
      id: 'rp-5',
      name: 'Nike India',
      logo: 'NIKE',
      category: 'Footwear & Apparel',
      activeOffersCount: 1,
      totalRedemptions: 4300,
      pointsRequired: 800,
      offerTitle: '20% Off Verified Footwear Drops',
      status: 'Paused',
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: '',
    logo: '',
    category: 'Pharmacy',
    offerTitle: '',
    pointsRequired: 200,
  });

  const handleToggleStatus = (id: string) => {
    setPartners((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === 'Active' ? 'Paused' : 'Active' } : p
      )
    );
  };

  const handleCreatePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartner.name || !newPartner.offerTitle) return;

    const brandInitial = newPartner.logo.trim() || newPartner.name.substring(0, 3).toUpperCase();

    setPartners((prev) => [
      {
        id: `rp-${Date.now()}`,
        name: newPartner.name,
        logo: brandInitial,
        category: newPartner.category,
        activeOffersCount: 1,
        totalRedemptions: 0,
        pointsRequired: Number(newPartner.pointsRequired),
        offerTitle: newPartner.offerTitle,
        status: 'Active',
      },
      ...prev,
    ]);

    setIsAddModalOpen(false);
    setNewPartner({
      name: '',
      logo: '',
      category: 'Pharmacy',
      offerTitle: '',
      pointsRequired: 200,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-black">Reward Network Brand Partners</h2>
          <p className="text-xs text-black/50 mt-1">
            Manage participating brands providing consumer loyalty vouchers in exchange for verified authentic scans
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-black text-white text-xs font-semibold rounded-full hover:bg-gray-800 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Partner Brand</span>
        </button>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {partners.map((partner) => {
          const isActive = partner.status === 'Active';
          return (
            <div
              key={partner.id}
              className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm flex flex-col justify-between space-y-4 group hover:border-black/15 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-sm">
                    {partner.logo}
                  </div>
                  <span
                    className={`text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full border ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {partner.status}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-black/40">
                    {partner.category}
                  </span>
                  <h3 className="text-lg font-semibold text-black">{partner.name}</h3>
                  <p className="text-xs text-black/70 font-medium mt-1 leading-snug">
                    {partner.offerTitle}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-black/5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-black/40 block text-[10px] uppercase">Cost</span>
                    <span className="font-bold text-black">{partner.pointsRequired} Pts</span>
                  </div>
                  <div>
                    <span className="text-black/40 block text-[10px] uppercase">Vouchers Claimed</span>
                    <span className="font-mono text-black/80 font-medium">
                      {partner.totalRedemptions.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-black/40 block text-[10px] uppercase">Active Drops</span>
                    <span className="font-semibold text-black">{partner.activeOffersCount} offers</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleStatus(partner.id)}
                  className={`w-full py-2 rounded-full text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-[#F5F5F5] hover:bg-rose-50 text-black hover:text-rose-700 border-black/5 hover:border-rose-200'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  {isActive ? (
                    <>
                      <PauseCircle className="w-3.5 h-3.5 text-black/40" />
                      <span>Pause Offers</span>
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Resume Partnership</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Partner Form Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-5 border border-black/10 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-black/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-black flex items-center gap-2">
                <Store className="w-4 h-4 text-[#1E1A30]" />
                Onboard New Rewards Partner
              </span>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-black/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePartner} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-black block mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Swiggy Instamart"
                    value={newPartner.name}
                    onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F5F5F5] border border-black/10 rounded-2xl text-xs text-black focus:outline-none focus:ring-2 focus:ring-black/10"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-black block mb-1">Logo Mark / Initials *</label>
                  <input
                    type="text"
                    placeholder="e.g. SWIGGY"
                    value={newPartner.logo}
                    onChange={(e) => setNewPartner({ ...newPartner, logo: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F5F5F5] border border-black/10 rounded-2xl text-xs text-black focus:outline-none focus:ring-2 focus:ring-black/10 uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-black block mb-1">Category</label>
                  <select
                    value={newPartner.category}
                    onChange={(e) => setNewPartner({ ...newPartner, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F5F5F5] border border-black/10 rounded-2xl text-xs text-black focus:outline-none focus:ring-2 focus:ring-black/10"
                  >
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fitness & Apparel">Fitness & Apparel</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Grocery & FMCG">Grocery & FMCG</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-black block mb-1">Points Required *</label>
                  <input
                    type="number"
                    min="50"
                    step="25"
                    required
                    value={newPartner.pointsRequired}
                    onChange={(e) => setNewPartner({ ...newPartner, pointsRequired: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#F5F5F5] border border-black/10 rounded-2xl text-xs text-black focus:outline-none focus:ring-2 focus:ring-black/10"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-black block mb-1">Offer Title & Discount *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat ₹200 Off on Organic Groceries orders above ₹799"
                  value={newPartner.offerTitle}
                  onChange={(e) => setNewPartner({ ...newPartner, offerTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F5F5F5] border border-black/10 rounded-2xl text-xs text-black focus:outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 bg-[#F5F5F5] text-black text-xs font-medium rounded-full hover:bg-black/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-black text-white text-xs font-semibold rounded-full hover:bg-gray-800 transition-colors shadow-sm"
                >
                  Publish Reward Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardPartnersScreen;
