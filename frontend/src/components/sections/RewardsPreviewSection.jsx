import React from 'react';
import { ArrowRight } from 'lucide-react';

const STREAKS = [
  { title: '7-Day Streak', desc: 'Scan 7 products in 7 days', reward: '+840 Pts' },
  { title: 'First Fake Report', desc: 'Report a counterfeit product', reward: '+1,500 Pts' },
  { title: 'Category Explorer', desc: 'Verify 5 different categories', reward: '+500 Pts' },
];

const OFFERS = [
  { brand: 'Mamaearth', offer: '20% off next order', pts: '1,200 Pts' },
  { brand: 'boAt', offer: '₹300 cashback on earphones', pts: '2,000 Pts' },
  { brand: 'WOW Skin', offer: 'Free travel kit', pts: '1,800 Pts' },
  { brand: 'Himalaya', offer: '3-month supply gift', pts: '3,500 Pts' },
];

export default function RewardsPreviewSection({ onOpenAuth }) {
  return (
    <section id="rewards" className="relative w-full py-28 px-6 md:px-12 lg:px-20 overflow-hidden bg-[#060709]">

      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-[-15%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.018) 0%, transparent 65%)',
          filter: 'blur(90px)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Label */}
        <div className="flex items-center justify-center mb-5">
          <span className="section-tag">Consumer Rewards</span>
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-semibold tracking-tight text-white leading-[1.1] mb-5">
            Earn by Verifying.<br className="hidden sm:block" /> Own Your Trust Score.
          </h2>
          <p className="text-zinc-500 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Every genuine product scan mints proof-of-purchase tokens to your mobile number. Turn routine purchases into real brand discounts.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

          {/* Pillar 1: Scan Points */}
          <div className="bento-card p-8 flex flex-col justify-between min-h-[260px]">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="badge-mono">Core Earning</span>
                <span className="font-mono text-[11px] text-zinc-700">01</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 tracking-tight leading-tight">
                Scan Points on Every Item
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Scan packaged food, luxury goods, skincare, or electronics. Earn 50–250 trust points immediately upon authentic tag verification.
              </p>
            </div>
            <div className="pt-5 border-t border-white/[0.05] flex items-center justify-between text-xs font-mono text-zinc-600">
              <span>Standard Earning</span>
              <span className="text-zinc-200 font-semibold">120 Pts / Scan</span>
            </div>
          </div>

          {/* Pillar 2: Streaks */}
          <div className="bento-card p-8 flex flex-col justify-between min-h-[260px]">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="badge-mono">Gamified</span>
                <span className="font-mono text-[11px] text-zinc-700">02</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 tracking-tight leading-tight">
                Streaks & Badges
              </h3>
              <div className="space-y-2">
                {STREAKS.map((s) => (
                  <div key={s.title} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-white">{s.title}</p>
                      <p className="text-[10px] text-zinc-600 mt-0.5">{s.desc}</p>
                    </div>
                    <span className="font-mono text-[11px] text-zinc-200 font-semibold ml-2 shrink-0">{s.reward}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-5 border-t border-white/[0.05] flex items-center justify-between text-xs font-mono text-zinc-600">
              <span>Status</span>
              <span className="text-zinc-200">Active Challenges</span>
            </div>
          </div>

          {/* Pillar 3: Referral */}
          <div className="bento-card p-8 flex flex-col justify-between min-h-[260px]">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="badge-mono">Network Bounties</span>
                <span className="font-mono text-[11px] text-zinc-700">03</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 tracking-tight leading-tight">
                Refer Friends & Report Fakes
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Invite friends to verify. Discover and report a counterfeit product in your local market — earn a 1,500 Truth Bounty when verified by the network.
              </p>
            </div>
            <div className="pt-5 border-t border-white/[0.05] flex items-center justify-between text-xs font-mono text-zinc-600">
              <span>Truth Bounty</span>
              <span className="text-zinc-200 font-semibold">+1,500 Pts</span>
            </div>
          </div>

        </div>

        {/* Redemption Catalog */}
        <div className="bento-card p-8 md:p-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="section-tag mb-2">Redemption Catalog</div>
              <h4 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                Redeem for Exclusive Brand Perks
              </h4>
            </div>
            <button
              onClick={() => onOpenAuth('consumer')}
              className="px-5 py-2.5 rounded-full bg-white hover:bg-zinc-100 text-black text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-md hover:scale-105 shrink-0"
            >
              <span>View All Rewards</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {OFFERS.map((offer) => (
              <div
                key={offer.brand}
                className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex flex-col justify-between hover:border-white/[0.12] transition-all group"
              >
                <div>
                  <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider">
                    {offer.brand}
                  </span>
                  <h5 className="text-xs font-semibold text-white mt-1.5 mb-3 leading-snug">
                    {offer.offer}
                  </h5>
                </div>
                <div className="pt-2.5 border-t border-white/[0.05] flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-zinc-300">{offer.pts}</span>
                  <button
                    onClick={() => onOpenAuth('consumer')}
                    className="text-[11px] text-zinc-600 hover:text-white transition-colors cursor-pointer"
                  >
                    Redeem →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
