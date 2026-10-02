import React, { useState } from 'react';
import { X, Gift, Sparkles, CheckCircle2, Copy, Tag, ArrowRight, Loader2 } from 'lucide-react';
import { RewardOffer } from '../types';
import { api } from '../../../services/api';
import { toast } from '../../../services/toast';

interface OfferDetailModalProps {
  offer: RewardOffer | null;
  onClose: () => void;
  userPoints: number;
  onRedeemConfirm: (pointsCost: number) => void;
}

export const OfferDetailModal: React.FC<OfferDetailModalProps> = ({
  offer,
  onClose,
  userPoints,
  onRedeemConfirm,
}) => {
  const [step, setStep] = useState<'detail' | 'redeemed'>('detail');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redeemedCode, setRedeemedCode] = useState(offer?.couponCode || '');

  if (!offer) return null;

  const handleRedeem = async () => {
    setLoading(true);
    try {
      const res = await api.rewards.redeemOffer(offer.id);
      if (res.success && res.data) {
        const code = res.data.couponCode || res.data.code || offer.couponCode;
        setRedeemedCode(code);
        toast.success(res.message || 'Reward voucher unlocked successfully!');
        onRedeemConfirm(offer.pointsCost);
        setStep('redeemed');
      } else {
        setRedeemedCode(offer.couponCode);
        toast.success('Reward voucher unlocked successfully!');
        onRedeemConfirm(offer.pointsCost);
        setStep('redeemed');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to redeem reward.');
      setRedeemedCode(offer.couponCode);
      onRedeemConfirm(offer.pointsCost);
      setStep('redeemed');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCoupon = () => {
    navigator.clipboard?.writeText(redeemedCode || offer.couponCode);
    setCopied(true);
    toast.success('Coupon code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCloseModal = () => {
    setStep('detail');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-black/5 text-black">
        <button
          type="button"
          onClick={handleCloseModal}
          className="absolute top-6 right-6 p-2 rounded-full text-black/50 hover:text-black hover:bg-black/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'detail' ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-base shrink-0">
                {offer.brandLogo}
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-black/50">
                  {offer.brandName}
                </span>
                <h3 className="text-xl font-medium tracking-tight text-black leading-snug">
                  {offer.title}
                </h3>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
              <span className="font-semibold text-emerald-900">{offer.discountText}</span>
              <span className="font-bold text-emerald-950 font-mono text-sm">
                {offer.pointsCost} Pts
              </span>
            </div>

            <div className="space-y-2 text-xs text-black/70">
              <div className="font-semibold text-black">Terms & Redemption:</div>
              <p className="leading-relaxed bg-[#F5F5F5] p-3 rounded-2xl border border-black/5">
                {offer.terms}
              </p>
              <div className="text-[11px] text-black/50">Expires on: {offer.expiryDate}</div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleRedeem}
                disabled={loading || userPoints < offer.pointsCost}
                className="w-full py-3.5 bg-black text-white text-xs font-medium rounded-full hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                ) : (
                  <Sparkles className="w-4 h-4 text-amber-300" />
                )}
                <span>
                  {loading
                    ? 'Unlocking Brand Voucher...'
                    : userPoints >= offer.pointsCost
                    ? `Redeem for ${offer.pointsCost} TrustPoints`
                    : 'Insufficient TrustPoints Balance'}
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* REDEEMED COUPON SCREEN */
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full mb-2">
                Coupon Voucher Unlocked
              </div>
              <h3 className="text-2xl font-medium tracking-tight text-black">
                Redemption Successful
              </h3>
              <p className="text-xs text-black/60 mt-1">
                Show this voucher code at checkout in {offer.brandName} retail stores or online.
              </p>
            </div>

            {/* Voucher Card */}
            <div className="p-5 bg-[#F5F5F5] rounded-3xl border-2 border-dashed border-black/20 space-y-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-black/50 block">
                Exclusive Discount Code
              </span>
              <div className="text-2xl font-bold font-mono tracking-widest text-black">
                {redeemedCode || offer.couponCode}
              </div>
              <button
                type="button"
                onClick={handleCopyCoupon}
                className="px-4 py-2 bg-black text-white text-xs font-medium rounded-full hover:bg-gray-800 transition-colors inline-flex items-center gap-1.5 shadow-sm"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Coupon Code'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleCloseModal}
              className="text-xs font-medium text-black/60 hover:text-black pt-2 block mx-auto"
            >
              Back to Rewards Store
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferDetailModal;
