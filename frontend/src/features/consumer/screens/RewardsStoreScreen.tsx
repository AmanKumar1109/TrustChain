import React, { useState } from 'react';
import {
  Gift,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  Tag,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { RewardOffer } from '../types';

interface RewardsStoreScreenProps {
  userPoints: number;
  offers: RewardOffer[];
  onSelectOffer: (offer: RewardOffer) => void;
}

export const RewardsStoreScreen: React.FC<RewardsStoreScreenProps> = ({
  userPoints,
  offers,
  onSelectOffer,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Pharmacy', 'Electronics', 'Footwear', 'Apparel', 'FMCG'];

  const filteredOffers = offers.filter((offer) => {
    const matchesCategory =
      selectedCategory === 'All' || offer.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      offer.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.discountText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-5 pb-20 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium text-black tracking-tight">Rewards Store</h2>
          <p className="text-xs text-black/50">Exclusive brand perks for anti-counterfeit champions</p>
        </div>
        <div className="bg-[#2B2644] text-white px-3.5 py-1.5 rounded-full text-xs font-semibold">
          {userPoints} Pts
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-black/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search brands or vouchers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-black/10 rounded-2xl text-xs text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/10 shadow-sm"
        />
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-black text-white shadow-sm'
                : 'bg-white text-black/70 border border-black/10 hover:bg-black/[0.03]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filteredOffers.map((offer) => {
          const canAfford = userPoints >= offer.pointsCost;
          return (
            <div
              key={offer.id}
              onClick={() => onSelectOffer(offer)}
              className="p-5 bg-white rounded-3xl border border-black/5 shadow-sm hover:border-black/20 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-xs">
                    {offer.brandLogo}
                  </div>
                  <span className="text-[11px] font-bold text-[#2B2644] bg-[#2B2644]/10 px-2.5 py-0.5 rounded-full">
                    {offer.pointsCost} Pts
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-semibold text-black/40 uppercase tracking-wider block">
                    {offer.brandName} • {offer.category}
                  </span>
                  <h4 className="text-sm font-semibold text-black mt-0.5 group-hover:text-black/80 transition-colors line-clamp-1">
                    {offer.title}
                  </h4>
                  <p className="text-xs font-medium text-emerald-700 mt-1">
                    {offer.discountText}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-black/5 flex items-center justify-between text-xs">
                <span className="text-[10px] text-black/40">Expires {offer.expiryDate}</span>
                <span
                  className={`font-semibold inline-flex items-center gap-1 ${
                    canAfford ? 'text-black' : 'text-black/40'
                  }`}
                >
                  {canAfford ? 'Redeem Offer' : 'Need More Pts'}
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          );
        })}

        {filteredOffers.length === 0 && (
          <div className="col-span-full p-8 text-center bg-white rounded-3xl border border-black/5">
            <Gift className="w-8 h-8 text-black/30 mx-auto mb-2" />
            <h4 className="text-sm font-medium text-black">No offers match your search</h4>
            <p className="text-xs text-black/50 mt-1">Check back later for new brand partner drops.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardsStoreScreen;
