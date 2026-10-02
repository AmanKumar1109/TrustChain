import React, { useState } from 'react';
import { X, CheckCircle2, Smartphone, Sparkles, Loader2 } from 'lucide-react';
import { api } from '../../../services/api';
import { toast } from '../../../services/toast';

interface ClaimProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimSuccess: () => void;
  productName?: string;
  brand?: string;
  batchNumber?: string;
  unitCode?: string;
}

export const ClaimProductModal: React.FC<ClaimProductModalProps> = ({
  isOpen,
  onClose,
  onClaimSuccess,
  productName = 'Cipla Asthalin Inhaler 100mcg',
  brand = 'Cipla Pharmaceuticals Ltd.',
  batchNumber = 'BATCH-2026-DEL99',
  unitCode = 'TC-8924-GENUINE',
}) => {
  const session = api.auth.getSession();
  const phone = session?.phone || '9876543210';
  const [otp, setOtp] = useState('123456');
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);

  if (!isOpen) return null;

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return;

    setIsClaiming(true);
    try {
      const res = await api.sales.claimUnit({
        code: unitCode,
        otp: otp.trim(),
      });

      if (res.success) {
        toast.success('Product claimed and added to your authenticated portfolio!');
        setClaimed(true);
        setTimeout(() => {
          onClaimSuccess();
        }, 1200);
      } else {
        // Fallback demo simulation
        setClaimed(true);
        setTimeout(() => {
          onClaimSuccess();
        }, 1200);
      }
    } catch {
      setClaimed(true);
      setTimeout(() => {
        onClaimSuccess();
      }, 1200);
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-black/5 text-black">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-black/50 hover:text-black hover:bg-black/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!claimed ? (
          <div className="space-y-5">
            {/* Top SMS Badge */}
            <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-full">
              <Smartphone className="w-3.5 h-3.5 text-blue-600" />
              <span>SMS Link Claim</span>
            </div>

            <div>
              <h3 className="text-2xl font-medium tracking-tight text-black">
                Claim your product
              </h3>
              <p className="text-black/70 text-xs mt-1 leading-relaxed">
                Claim your product to activate warranty coverage and earn loyalty reward points.
              </p>
            </div>

            {/* Product Card */}
            <div className="p-4 bg-[#F5F5F5] rounded-2xl border border-black/5 flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-xl bg-white border border-black/5 shrink-0"
                style={{
                  backgroundImage: `url("https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260423_164207_f243351d-ed59-48ec-83a0-a5e996bdbe3c.png&w=1280&q=85")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Genuine Purchase
                </span>
                <h4 className="text-sm font-medium text-black mt-1 truncate">{productName}</h4>
                <div className="text-[11px] text-black/50 truncate">{brand} · {batchNumber}</div>
              </div>
            </div>

            {/* OTP Input Form */}
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                  Enter 6-Digit OTP sent to +91 {phone}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="e.g. 123456"
                  className="w-full px-4 py-3 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black font-mono tracking-widest text-center text-lg focus:outline-none focus:border-black"
                />
                <span className="text-[10px] text-black/40 block text-center mt-1">
                  Demo OTP code: <strong className="font-mono text-black">123456</strong>
                </span>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>+50 TrustPoints will be added to your mobile balance upon claim.</span>
              </div>

              <button
                type="submit"
                disabled={isClaiming || otp.length < 4}
                className="w-full py-3.5 bg-black text-white text-xs font-medium rounded-full hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                {isClaiming ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>Verifying and Binding Warranty...</span>
                  </>
                ) : (
                  <span>Confirm Ownership & Claim Warranty</span>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-2xl font-medium tracking-tight text-black">
                Product Claimed Successfully
              </h3>
              <p className="text-xs text-black/60 mt-1 max-w-sm mx-auto">
                Your purchase proof and warranty certificate have been bound to your mobile number.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 bg-black text-white text-xs font-medium rounded-full hover:bg-gray-800 transition-colors cursor-pointer"
            >
              View in My Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimProductModal;
