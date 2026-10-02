import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Smartphone, Sparkles, ArrowRight } from 'lucide-react';

interface ClaimProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimSuccess: () => void;
  productName?: string;
  brand?: string;
  batchNumber?: string;
}

export const ClaimProductModal: React.FC<ClaimProductModalProps> = ({
  isOpen,
  onClose,
  onClaimSuccess,
  productName = 'Cipla Asthalin Inhaler 100mcg',
  brand = 'Cipla Pharmaceuticals Ltd.',
  batchNumber = 'BATCH-2026-DEL99',
}) => {
  const [phone, setPhone] = useState('9821456789');
  const [otpSent, setOtpSent] = useState(true);
  const [otp, setOtp] = useState('');
  const [claimed, setClaimed] = useState(false);

  if (!isOpen) return null;

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) return;
    setClaimed(true);
    setTimeout(() => {
      onClaimSuccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-black/5 text-black">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-black/50 hover:text-black hover:bg-black/5 transition-colors"
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
                Claim your product to get warranty and purchase proof.
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
              <div className="flex-1">
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Genuine Purchase
                </span>
                <h4 className="text-sm font-medium text-black mt-1">{productName}</h4>
                <div className="text-[11px] text-black/50">{brand} · {batchNumber}</div>
              </div>
            </div>

            {/* OTP Input Form */}
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                  Enter 4-Digit OTP sent to +91 {phone}
                </label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="e.g. 8421"
                  className="w-full px-4 py-3 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black font-mono tracking-widest text-center text-lg focus:outline-none focus:border-black"
                />
                <span className="text-[10px] text-black/40 block text-center mt-1">
                  Tip: Enter any 4 digits to simulate SMS verification
                </span>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>+50 TrustPoints will be added to your mobile balance upon claim.</span>
              </div>

              <button
                type="submit"
                disabled={otp.length < 4}
                className="w-full py-3.5 bg-black text-white text-xs font-medium rounded-full hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-sm"
              >
                Confirm Ownership & Claim Warranty
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
              className="px-8 py-3 bg-black text-white text-xs font-medium rounded-full hover:bg-gray-800 transition-colors"
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
