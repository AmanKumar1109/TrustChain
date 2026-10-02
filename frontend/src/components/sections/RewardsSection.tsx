import React from 'react';
import { Sparkles, Flame, ShieldAlert, Tag, ArrowRight } from 'lucide-react';

export const RewardsSection: React.FC = () => {
  const rewardFeatures = [
    {
      title: 'Points on Every Scan',
      points: '+50 Pts',
      description:
        'Earn TrustPoints automatically each time you scan an authentic physical product. Track your balance with just your phone number.',
      icon: Sparkles,
      tag: 'Everyday Earnings',
    },
    {
      title: 'Weekly Streak Bonuses',
      points: 'Up to 3x Multiplier',
      description:
        'Keep up your scanning streak on regular groceries, medicines, and electronics to unlock milestone bonuses and higher tier perks.',
      icon: Flame,
      tag: 'Loyalty Streaks',
    },
    {
      title: 'Fake Report Bounties',
      points: '+500 to 2,000 Pts',
      description:
        'Spot a suspicious duplicate or fake item? Flag it in one click to alert the brand, protect fellow consumers, and claim crowdsourced bounties.',
      icon: ShieldAlert,
      tag: 'Community Bounty',
    },
    {
      title: 'Redeem Exclusive Offers',
      points: 'Direct Savings',
      description:
        'Convert earned TrustPoints into discount vouchers, free brand merchandise, extended warranties, and partner perks.',
      icon: Tag,
      tag: 'Instant Redemption',
    },
  ];

  return (
    <section id="rewards" className="bg-[#F5F5F5] px-6 py-24 border-b border-black/5">
      <div className="max-w-[88rem] mx-auto">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-start">
          <div>
            <div className="text-black/60 text-sm font-medium mb-2 tracking-wide uppercase">
              Consumer Incentives
            </div>
            <h2
              className="text-black text-4xl md:text-5xl font-medium leading-tight mb-4"
              style={{ letterSpacing: '-0.03em' }}
            >
              Earn While You Verify
            </h2>
            <p className="text-black/70 text-lg leading-relaxed">
              We reward consumers for upholding supply chain transparency. Turn every verified scan
              into real rewards and discounts.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-black/5 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-black/50">
                Live Community Impact
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div
              className="text-3xl md:text-4xl font-medium text-black mb-1"
              style={{ letterSpacing: '-0.03em' }}
            >
              4.8 Million+ Scans
            </div>
            <p className="text-black/60 text-sm">
              Over ₹12 Lakhs in reward vouchers redeemed across verified Indian retail brands.
            </p>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rewardFeatures.map((reward) => {
            const Icon = reward.icon;
            return (
              <div
                key={reward.title}
                className="bg-white rounded-2xl p-7 min-h-80 flex flex-col justify-between border border-black/5 shadow-sm transition-transform duration-300 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-semibold uppercase tracking-wider text-black/60 bg-[#F5F5F5] px-3 py-1 rounded-full border border-black/5">
                      {reward.tag}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-black" />
                    </div>
                  </div>

                  <div className="text-emerald-700 text-lg font-medium mb-1">{reward.points}</div>
                  <h3
                    className="text-black text-2xl font-medium leading-snug mb-3"
                    style={{ letterSpacing: '-0.02em' }}
                  >
                    {reward.title}
                  </h3>
                  <p className="text-black/70 text-sm leading-relaxed">{reward.description}</p>
                </div>

                <div className="pt-4 border-t border-black/5 flex items-center justify-between text-xs font-medium text-black/60">
                  <span>Available on mobile OTP</span>
                  <ArrowRight className="w-4 h-4 text-black/40" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RewardsSection;
