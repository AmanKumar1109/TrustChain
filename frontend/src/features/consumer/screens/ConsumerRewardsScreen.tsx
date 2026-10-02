import React, { useState, useEffect } from 'react';
import {
  Flame,
  Gift,
  Share2,
  Copy,
  Check,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Award,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { api } from '../../../services/api';
import { toast } from '../../../services/toast';

interface ConsumerRewardsScreenProps {
  pointsBalance: number;
  streakCount: number;
  referralCode: string;
  onOpenRewardsStore: () => void;
}

interface PointsHistoryItem {
  id: string;
  title: string;
  source: string;
  points: number;
  date: string;
  type: 'earn' | 'redeem';
}

const INITIAL_HISTORY: PointsHistoryItem[] = [
  {
    id: 'tx-1',
    title: 'Verified Genuine Scan',
    source: 'Cipla Asthalin Inhaler',
    points: 50,
    date: 'Today, 02:15 PM',
    type: 'earn',
  },
  {
    id: 'tx-2',
    title: 'Daily Streak Bonus (Day 5)',
    source: 'Loyalty Milestone',
    points: 100,
    date: 'Yesterday, 11:40 AM',
    type: 'earn',
  },
  {
    id: 'tx-3',
    title: 'Voucher Redemption',
    source: 'Tata 1mg 25% Off Coupon',
    points: -250,
    date: '28 Sep 2026',
    type: 'redeem',
  },
  {
    id: 'tx-4',
    title: 'Verified Genuine Scan',
    source: 'Sony WH-1000XM5 Headphones',
    points: 75,
    date: '25 Sep 2026',
    type: 'earn',
  },
  {
    id: 'tx-5',
    title: 'Fake Product Report Bounty',
    source: 'Report #REP-9021 Verified Valid',
    points: 500,
    date: '21 Sep 2026',
    type: 'earn',
  },
];

export const ConsumerRewardsScreen: React.FC<ConsumerRewardsScreenProps> = ({
  pointsBalance,
  streakCount,
  referralCode,
  onOpenRewardsStore,
}) => {
  const [copied, setCopied] = useState(false);
  const [historyList, setHistoryList] = useState<PointsHistoryItem[]>(INITIAL_HISTORY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadRewardsHistory() {
      try {
        const res = await api.rewards.getHistory(1, 20);
        if (res.success && res.data?.history && Array.isArray(res.data.history) && res.data.history.length > 0) {
          const items: PointsHistoryItem[] = res.data.history.map((h: any) => {
            const dateObj = new Date(h.createdAt || Date.now());
            const formattedDate =
              dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) +
              ', ' +
              dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

            const isPositive = (h.amount || 0) >= 0;
            return {
              id: h._id || `tx-${Math.random()}`,
              title:
                h.type === 'SCAN_REWARD'
                  ? 'Verified Genuine Scan'
                  : h.type === 'STREAK_BONUS'
                  ? 'Daily Streak Bonus'
                  : h.type === 'REDEMPTION'
                  ? 'Voucher Redemption'
                  : h.type === 'FAKE_REPORT_BOUNTY'
                  ? 'Fake Product Report Bounty'
                  : 'Loyalty Reward Points',
              source: h.description || 'Loyalty Activity',
              points: h.amount || 0,
              date: formattedDate,
              type: isPositive ? 'earn' : 'redeem',
            };
          });

          if (isMounted) setHistoryList(items);
        }
      } catch (err) {
        console.warn('Failed to fetch rewards history, using fallback:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadRewardsHistory();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'TrustChain - Protect Yourself Against Fakes',
        text: `Use my invite code ${referralCode} to verify genuine medicine and electronics, and earn 100 bonus TrustPoints!`,
        url: 'https://trustchain.network/app',
      }).catch(() => {});
    } else {
      handleCopyReferral();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column (Desktop 7 cols) */}
        <div className="md:col-span-7 space-y-6">
          {/* Top Banner: Points Summary */}
          <div className="bg-[#2B2644] text-white rounded-3xl p-6 sm:p-7 shadow-sm relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-white/60">
                  TrustPoints Balance
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 font-semibold border border-emerald-400/30">
                  Gold Tier Member
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span
                  className="text-4xl sm:text-5xl font-medium tracking-tight"
                  style={{ letterSpacing: '-0.03em' }}
                >
                  {pointsBalance}
                </span>
                <span className="text-white/60 text-sm font-semibold">Points</span>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenRewardsStore}
                  className="w-full py-3.5 bg-white text-[#2B2644] rounded-full text-xs font-semibold hover:bg-white/90 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Gift className="w-4 h-4 text-[#2B2644]" />
                  Browse & Redeem Brand Offers
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Streak Tracker Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-black/5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                <h3 className="text-sm font-semibold text-black">Scan Streak Tracker</h3>
              </div>
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                {streakCount} Days Active
              </span>
            </div>

            <p className="text-xs text-black/60">
              Scan at least 1 verified product each week to multiply your scan rewards by 2.5x.
            </p>

            {/* 7 Days tracker visual */}
            <div className="grid grid-cols-7 gap-2 pt-1">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => {
                const isCompleted = index < streakCount;
                return (
                  <div
                    key={index}
                    className={`flex flex-col items-center justify-center py-3 rounded-2xl border text-center transition-all ${
                      isCompleted
                        ? 'bg-orange-50 border-orange-300 text-orange-800 shadow-sm'
                        : 'bg-black/[0.02] border-black/5 text-black/30'
                    }`}
                  >
                    <span className="text-[10px] font-semibold">{day}</span>
                    <Flame
                      className={`w-4 h-4 mt-1 ${
                        isCompleted ? 'text-orange-500 fill-orange-500' : 'text-black/20'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Referral Code Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-black/5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-semibold text-black">Invite Friends, Earn 200 Pts</h3>
            </div>
            <p className="text-xs text-black/60">
              Share your unique referral code. When a friend scans their first physical item, you both get 200 TrustPoints.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <div className="flex-1 bg-black/[0.03] border border-black/10 rounded-2xl px-4 py-2.5 flex items-center justify-between font-mono text-sm font-semibold tracking-wider text-black">
                <span>{referralCode}</span>
                <button
                  type="button"
                  onClick={handleCopyReferral}
                  className="text-xs text-black/60 hover:text-black flex items-center gap-1 font-sans cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 text-xs">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={handleShare}
                className="p-3 bg-black text-white rounded-2xl hover:bg-black/90 active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (Desktop 5 cols): Points History List */}
        <div className="md:col-span-5">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-black/5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-black/5 pb-3">
              <h3 className="text-sm font-semibold text-black">Points Activity</h3>
              <span className="text-xs text-black/40">Recent 30 Days</span>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="p-8 text-center text-black/40 text-xs flex flex-col items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-black/30" />
                  <span>Loading activity ledger...</span>
                </div>
              ) : historyList.length === 0 ? (
                <div className="p-8 text-center text-black/40 text-xs">
                  No points activity recorded yet.
                </div>
              ) : (
                historyList.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2.5 border-b border-black/[0.04] last:border-0"
                  >
                    <div className="pr-2">
                      <h4 className="text-xs font-semibold text-black">{item.title}</h4>
                      <span className="text-[11px] text-black/50 block truncate max-w-[200px]">{item.source}</span>
                      <span className="text-[10px] text-black/40">{item.date}</span>
                    </div>

                    <span
                      className={`text-xs font-bold shrink-0 ${
                        item.type === 'earn' ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {item.type === 'earn' ? `+${item.points}` : item.points} Pts
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumerRewardsScreen;
