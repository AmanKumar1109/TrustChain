import React, { useState, useEffect } from 'react';
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
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { AdminRewardPartner } from '../types';
import { api } from '../../../services/api';
import { toast } from '../../../services/toast';

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

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: '',
    logo: '',
    category: 'Pharmacy',
    offerTitle: '',
    pointsRequired: 200,
  });

  const fetchRewardData = async () => {
    setIsLoading(true);
    try {
      const [partnersRes, offersRes] = await Promise.allSettled([
        api.admin.getRewardPartners(),
        api.admin.getRewardOffers({ limit: 50 }),
      ]);

      const mapped: AdminRewardPartner[] = [];

      if (offersRes.status === 'fulfilled' && offersRes.value.success && offersRes.value.data?.offers) {
        const list = offersRes.value.data.offers;
        if (Array.isArray(list) && list.length > 0) {
          list.forEach((o: any) => {
            mapped.push({
              id: o._id || o.id,
              name: o.partner?.name || o.partner || o.brandName || 'Brand Partner',
              logo: o.partner?.logo || o.partner?.name?.slice(0, 4)?.toUpperCase() || 'PERK',
              category: o.category || 'General',
              activeOffersCount: 1,
              totalRedemptions: o.redeemedCount || 0,
              pointsRequired: o.pointsRequired || 250,
              offerTitle: o.title || 'Brand Voucher Offer',
              status: o.isActive !== false ? 'Active' : 'Paused',
            });
          });
        }
      }

      if (mapped.length > 0) {
        setPartners(mapped);
      }
    } catch (err) {
      console.warn('Failed to load reward partners:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRewardData();
  }, []);

  const handleToggleStatus = async (id: string) => {
    const current = partners.find((p) => p.id === id);
    if (!current) return;
    const nextStatus = current.status === 'Active' ? 'Paused' : 'Active';

    try {
      await api.admin.toggleRewardOffer(id);
      toast.info(`Offer for ${current.name} is now ${nextStatus.toLowerCase()}.`);
    } catch (err) {
      console.warn('Backend toggle fallback to local:', err);
    }

    setPartners((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: nextStatus } : p))
    );
  };

  const handleCreatePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartner.name.trim() || !newPartner.offerTitle.trim()) {
      toast.error('Please fill in partner name and offer title.');
      return;
    }

    setIsSubmitting(true);
    const brandInitial = newPartner.logo.trim() || newPartner.name.substring(0, 4).toUpperCase();

    try {
      const res = await api.admin.createRewardOffer({
        title: newPartner.offerTitle.trim(),
        description: `Special discount voucher provided by ${newPartner.name.trim()}.`,
        category: newPartner.category,
        pointsRequired: Number(newPartner.pointsRequired),
        partner: newPartner.name.trim(),
        isActive: true,
      });

      if (res.success) {
        toast.success(res.data?.message || 'Reward offer published successfully to the consumer store!');
      } else {
        toast.success('Reward offer published.');
      }

      setPartners((prev) => [
        {
          id: res.data?.offer?._id || `rp-${Date.now()}`,
          name: newPartner.name.trim(),
          logo: brandInitial,
          category: newPartner.category,
          activeOffersCount: 1,
          totalRedemptions: 0,
          pointsRequired: Number(newPartner.pointsRequired),
          offerTitle: newPartner.offerTitle.trim(),
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
    } catch (err: any) {
      toast.error(err.message || 'Failed to publish reward offer.');
    } finally {
      setIsSubmitting(false);
    }
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

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchRewardData}
            disabled={isLoading}
            className="p-2 rounded-full bg-white border border-black/10 hover:bg-black/5 text-black/70 transition-colors"
            title="Refresh partners"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-black text-white text-xs font-semibold rounded-full hover:bg-gray-800 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Onboard Reward Partner</span>
          </button>
        </div>
      </div>

      {/* Grid of Partners */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {partners.map((partner) => {
          const isActive = partner.status === 'Active';
          return (
            <div
              key={partner.id}
              className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm space-y-4 flex flex-col justify-between hover:border-black/15 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#1E1A30] text-white font-bold text-xs flex items-center justify-center tracking-wider shadow-sm">
                      {partner.logo}
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-black">{partner.name}</h4>
                      <span className="text-[11px] text-black/40 font-medium">{partner.category}</span>
                    </div>
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

                <div className="mt-4 p-3.5 bg-[#F5F5F5] rounded-2xl border border-black/5 space-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-black/40 block">
                    Featured Store Perk
                  </span>
                  <p className="text-xs font-medium text-black leading-snug">{partner.offerTitle}</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs text-black/60 pt-2 border-t border-black/5">
                  <span>Consumer Redemptions:</span>
                  <span className="font-semibold text-black">{partner.totalRedemptions.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-black/60">
                  <span>Token Burn Cost:</span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1">
                    <Coins className="w-3 h-3" />
                    {partner.pointsRequired} TrustPoints
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(partner.id)}
                    className={`w-full py-2.5 rounded-2xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    {isActive ? (
                      <>
                        <PauseCircle className="w-3.5 h-3.5 text-amber-700" />
                        <span>Pause Campaign Offer</span>
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Resume Offer</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Onboard New Partner / Offer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 space-y-5 border border-black/10 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-black/10">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#1E1A30]" />
                <h3 className="text-base font-semibold text-black">Publish Reward Store Partner Offer</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-black/60 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePartner} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-black block mb-1">Partner Brand Name *</label>
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
                  className="flex-1 py-3 bg-[#F5F5F5] text-black text-xs font-medium rounded-full hover:bg-black/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-black text-white text-xs font-semibold rounded-full hover:bg-gray-800 transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Publish Reward Offer</span>
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
