import React, { useState, useEffect } from 'react';
import {
  Gift,
  Sparkles,
  Flame,
  Users,
  ShieldAlert,
  Smartphone,
  CheckCircle2,
  Save,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { api } from '../../../services/api';
import { toast } from '../../../services/toast';

export const RewardsCampaignScreen: React.FC = () => {
  const [pointsPerScan, setPointsPerScan] = useState(50);
  const [streakBonus, setStreakBonus] = useState(150);
  const [referralBonus, setReferralBonus] = useState(100);
  const [fakeReportBonus, setFakeReportBonus] = useState(500);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load existing campaign settings from backend
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);
        const res = await api.rewards.getCampaign();
        if (res.success && res.data?.campaign) {
          const c = res.data.campaign;
          if (c.pointsPerScan !== undefined) setPointsPerScan(c.pointsPerScan);
          if (c.streakBonus !== undefined) setStreakBonus(c.streakBonus);
          if (c.referralBonus !== undefined) setReferralBonus(c.referralBonus);
          if (c.fakeReportBonus !== undefined) setFakeReportBonus(c.fakeReportBonus);
        }
      } catch (err) {
        console.warn('Could not load campaign values:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.rewards.updateCampaign({
        pointsPerScan,
        streakBonus,
        referralBonus,
        fakeReportBonus,
      });

      if (res.success) {
        setIsSaved(true);
        toast.success('Reward campaign rules updated and active across consumer apps!');
        setTimeout(() => setIsSaved(false), 2500);
      } else {
        toast.error(res.error?.message || 'Failed to save campaign rules');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error updating campaign settings');
    } finally {
      setSaving(false);
    }
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
            Consumer Rewards Campaign
          </h2>
          <p className="text-black/60 text-sm mt-1">
            Configure consumer incentives for product scanning, loyalty streaks, and crowdsourced counterfeit detection.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving || loading}
          className="inline-flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-full text-xs font-medium hover:bg-gray-800 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{saving ? 'Saving...' : isSaved ? 'Campaign Updated ✓' : 'Save Campaign Settings'}</span>
        </button>
      </div>

      {/* 2-Column: Left Settings Form, Right Live Consumer Phone Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Campaign Configuration Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-black/5">
            <h3 className="text-base font-medium text-black">
              Loyalty Point Allocation Rules
            </h3>
            {loading && (
              <span className="text-xs text-black/40 flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Loading active campaign...</span>
              </span>
            )}
          </div>

          <div className="space-y-5">
            {/* Setting 1: Points Per Scan */}
            <div className="p-4 bg-[#F5F5F5] rounded-2xl border border-black/5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-black/5 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-black block">
                      Points per Verified Scan
                    </label>
                    <span className="text-[11px] text-black/50">
                      Awarded immediately upon scanning an authentic unit
                    </span>
                  </div>
                </div>
                <span className="text-sm font-bold text-black font-mono">+{pointsPerScan} Pts</span>
              </div>
              <input
                type="range"
                min={10}
                max={200}
                step={10}
                value={pointsPerScan}
                onChange={(e) => setPointsPerScan(Number(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
            </div>

            {/* Setting 2: Streak Bonus */}
            <div className="p-4 bg-[#F5F5F5] rounded-2xl border border-black/5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-black/5 flex items-center justify-center">
                    <Flame className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-black block">
                      Weekly Streak Bonus (3+ Scans)
                    </label>
                    <span className="text-[11px] text-black/50">
                      Bonus points for regular prescription refills or grocery repeat buys
                    </span>
                  </div>
                </div>
                <span className="text-sm font-bold text-black font-mono">+{streakBonus} Pts</span>
              </div>
              <input
                type="range"
                min={50}
                max={500}
                step={25}
                value={streakBonus}
                onChange={(e) => setStreakBonus(Number(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
            </div>

            {/* Setting 3: Referral Bonus */}
            <div className="p-4 bg-[#F5F5F5] rounded-2xl border border-black/5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-black/5 flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-black block">
                      Peer Referral Bounty
                    </label>
                    <span className="text-[11px] text-black/50">
                      When a friend scans their first authentic product via invite
                    </span>
                  </div>
                </div>
                <span className="text-sm font-bold text-black font-mono">+{referralBonus} Pts</span>
              </div>
              <input
                type="range"
                min={25}
                max={300}
                step={25}
                value={referralBonus}
                onChange={(e) => setReferralBonus(Number(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
            </div>

            {/* Setting 4: Fake Report Bonus */}
            <div className="p-4 bg-[#F5F5F5] rounded-2xl border border-black/5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-black/5 flex items-center justify-center">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-black block">
                      Fake Report Verified Bounty
                    </label>
                    <span className="text-[11px] text-black/50">
                      Awarded once an uploaded counterfeit report is validated
                    </span>
                  </div>
                </div>
                <span className="text-sm font-bold text-black font-mono">+{fakeReportBonus} Pts</span>
              </div>
              <input
                type="range"
                min={200}
                max={2000}
                step={100}
                value={fakeReportBonus}
                onChange={(e) => setFakeReportBonus(Number(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Live Consumer Phone Mockup Preview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-black/40 mb-3 flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Live Consumer Viewport</span>
          </div>

          <div className="w-[320px] rounded-[36px] bg-white border border-black/10 p-5 shadow-2xl transition-all">
            {/* Notch */}
            <div className="w-20 h-3 bg-black/10 rounded-full mx-auto mb-4" />

            <div className="text-center pb-3 border-b border-black/5 mb-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                100% Genuine Verified
              </span>
              <h4 className="text-base font-medium text-black mt-2">Authentic Registered Product</h4>
              <p className="text-[11px] text-black/50">Decentralized Cryptographic Proof</p>
            </div>

            {/* Live Reward Prompt inside Consumer Phone */}
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl mb-4 text-center">
              <Sparkles className="w-6 h-6 text-amber-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-amber-900">+{pointsPerScan} TrustPoints Earned!</div>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Saved to phone +91 98214... • Total Balance: 350 Pts
              </p>
            </div>

            <div className="space-y-2 text-[11px] bg-[#F5F5F5] p-3 rounded-xl border border-black/5 mb-4">
              <div className="flex justify-between">
                <span className="text-black/60">Weekly Streak Bonus:</span>
                <span className="font-semibold text-black">+{streakBonus} Pts (Active)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60">Refer a Friend:</span>
                <span className="font-semibold text-black">+{referralBonus} Pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-rose-700 font-medium">Bounty on Fakes:</span>
                <span className="font-semibold text-rose-700">+{fakeReportBonus} Pts</span>
              </div>
            </div>

            <div className="py-2.5 bg-black text-white text-xs font-medium rounded-xl text-center flex items-center justify-center gap-1.5 shadow-sm">
              <span>Redeem for Pharmacy Discount</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsCampaignScreen;
