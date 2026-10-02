import React from 'react';
import {
  QrCode,
  Sparkles,
  Flame,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Gift,
  ShieldAlert,
  ChevronRight,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';

interface ConsumerHomeProps {
  pointsBalance: number;
  streakCount: number;
  onOpenScanner: () => void;
  onNavigateTab: (tab: any) => void;
  onOpenReportFake: () => void;
  onOpenRewardsStore: () => void;
  onOpenSmsClaim: () => void;
}

export const ConsumerHomeScreen: React.FC<ConsumerHomeProps> = ({
  pointsBalance,
  streakCount,
  onOpenScanner,
  onNavigateTab,
  onOpenReportFake,
  onOpenRewardsStore,
  onOpenSmsClaim,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Responsive Grid for Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column (Desktop 7 cols, Mobile full) */}
        <div className="md:col-span-7 space-y-6">
          {/* Top Header Card: Points & Streak */}
          <div className="bg-[#2B2644] text-white rounded-3xl p-6 sm:p-7 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white/60 block mb-1">
                Total Points Balance
              </span>
              <div className="flex items-baseline gap-2">
                <span
                  className="text-4xl sm:text-5xl font-medium tracking-tight"
                  style={{ letterSpacing: '-0.03em' }}
                >
                  {pointsBalance}
                </span>
                <span className="text-emerald-400 text-xs sm:text-sm font-semibold">TrustPoints</span>
              </div>

              <button
                type="button"
                onClick={onOpenRewardsStore}
                className="text-xs text-white/70 hover:text-white underline underline-offset-4 mt-3 block"
              >
                Redeem at Partner Brands →
              </button>
            </div>

            {/* Streak Indicator */}
            <div className="flex flex-col items-center bg-white/10 px-4 py-3 sm:px-5 sm:py-4 rounded-2xl border border-white/10 shrink-0">
              <Flame className="w-7 h-7 text-orange-400 fill-orange-400 animate-pulse mb-1" />
              <span className="text-base sm:text-lg font-bold leading-none">{streakCount} Days</span>
              <span className="text-[10px] text-white/60 mt-0.5">Scan Streak</span>
            </div>
          </div>

          {/* Large Central Scan Button Hero */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-black/5 shadow-sm text-center space-y-4">
            <button
              type="button"
              onClick={onOpenScanner}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-black text-white mx-auto flex flex-col items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all group"
            >
              <QrCode className="w-10 h-10 sm:w-12 sm:h-12 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-semibold uppercase tracking-wider mt-1.5">Tap to Scan</span>
            </button>

            <div className="pt-2">
              <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-black">
                Scan Physical Product QR
              </h3>
              <p className="text-xs sm:text-sm text-black/60 max-w-sm mx-auto mt-1 leading-relaxed">
                Point camera at pharmaceutical packaging, cosmetics box, or luxury warranty card for instant cryptographic validation.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (Desktop 5 cols, Mobile full) */}
        <div className="md:col-span-5 space-y-5">
          {/* Latest Scan Result Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-black/5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-black/5">
              <span className="text-xs font-semibold uppercase tracking-wider text-black/50">
                Latest Scan Result
              </span>
              <span className="text-[11px] text-black/40">Today, 02:15 PM</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-black">Cipla Asthalin Inhaler</h4>
                  <span className="text-[11px] text-black/50 block">Batch #BATCH-2026-DEL99</span>
                </div>
              </div>

              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
                100% Genuine
              </span>
            </div>
          </div>

          {/* Quick Links: Rewards Store & Report Fake */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onOpenRewardsStore}
              className="p-4 sm:p-5 bg-white rounded-3xl border border-black/5 shadow-sm text-left hover:bg-black/[0.02] transition-colors flex flex-col justify-between h-32 group"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Gift className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-black block">Rewards Store</span>
                  <span className="text-[10px] text-black/50">Redeem Vouchers</span>
                </div>
                <ChevronRight className="w-4 h-4 text-black/30 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>

            <button
              type="button"
              onClick={onOpenReportFake}
              className="p-4 sm:p-5 bg-white rounded-3xl border border-black/5 shadow-sm text-left hover:bg-black/[0.02] transition-colors flex flex-col justify-between h-32 group"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-black block">Report Fake</span>
                  <span className="text-[10px] text-rose-600 font-semibold">+500 Pts Bounty</span>
                </div>
                <ChevronRight className="w-4 h-4 text-black/30 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          </div>

          {/* Test SMS Claim Link Simulation Banner */}
          <div className="p-5 rounded-3xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-blue-950">
            <div>
              <span className="font-semibold text-sm block">Received SMS Claim Link?</span>
              <span className="text-xs text-blue-800">
                Simulate receiving an SMS with OTP after purchasing medicine or hardware at a retailer.
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenSmsClaim}
              className="px-4 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors shrink-0 shadow-sm text-center"
            >
              Open Claim Flow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumerHomeScreen;
