import React, { useState } from 'react';
import { X, Send, Smartphone, CheckCircle2, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

interface TransferUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  serialNumber: string;
}

export const TransferUserModal: React.FC<TransferUserModalProps> = ({
  isOpen,
  onClose,
  productName,
  serialNumber,
}) => {
  const [step, setStep] = useState<'input' | 'confirm' | 'pending' | 'accepted'>('input');
  const [buyerPhone, setBuyerPhone] = useState('');

  if (!isOpen) return null;

  const handleNextToConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (buyerPhone.length < 10) return;
    setStep('confirm');
  };

  const handleConfirmTransfer = () => {
    setStep('pending');
  };

  const handleSimulateBuyerAccept = () => {
    setStep('accepted');
  };

  const handleReset = () => {
    setStep('input');
    setBuyerPhone('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-black/5 text-black">
        <button
          type="button"
          onClick={handleReset}
          className="absolute top-6 right-6 p-2 rounded-full text-black/50 hover:text-black hover:bg-black/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: Enter Buyer's Phone Number */}
        {step === 'input' && (
          <form onSubmit={handleNextToConfirm} className="space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider bg-black/5 text-black/70 px-2.5 py-0.5 rounded-full mb-2">
                Resale Provenance
              </div>
              <h3 className="text-xl font-medium tracking-tight text-black">
                Transfer to Another User
              </h3>
              <p className="text-xs text-black/60 mt-1">
                Selling or gifting your product? Transfer the original warranty and digital authenticity record to the new owner.
              </p>
            </div>

            <div className="p-3.5 bg-[#F5F5F5] rounded-2xl border border-black/5 text-xs">
              <span className="text-black/50 block text-[10px]">Product to Transfer:</span>
              <span className="font-semibold text-black">{productName}</span>
              <span className="text-black/40 block font-mono text-[10px] mt-0.5">{serialNumber}</span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                Buyer&apos;s Mobile Number
              </label>
              <div className="flex gap-2">
                <span className="inline-flex items-center px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black font-medium text-xs">
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  placeholder="Enter 10-digit mobile"
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black font-mono font-medium text-sm focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={buyerPhone.length < 10}
              className="w-full py-3 bg-black text-white text-xs font-medium rounded-full hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-sm"
            >
              Review Transfer
            </button>
          </form>
        )}

        {/* STEP 2: Confirmation Screen */}
        {step === 'confirm' && (
          <div className="space-y-4">
            <h3 className="text-xl font-medium tracking-tight text-black">
              Confirm Ownership Transfer
            </h3>
            <p className="text-xs text-black/60">
              Please double check the buyer&apos;s mobile number before transmitting custody.
            </p>

            <div className="p-4 bg-[#F5F5F5] rounded-2xl border border-black/5 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-black/50">Item:</span>
                <span className="font-semibold text-black">{productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/50">Serial ID:</span>
                <span className="font-mono text-black">{serialNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/50">New Owner Mobile:</span>
                <span className="font-mono font-bold text-black">+91 {buyerPhone}</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-900 leading-snug">
              Once the buyer accepts on their phone, this product will be removed from your wallet
              and registered to the buyer.
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('input')}
                className="flex-1 py-3 bg-[#F5F5F5] text-black text-xs font-medium rounded-full hover:bg-black/5 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirmTransfer}
                className="flex-1 py-3 bg-black text-white text-xs font-medium rounded-full hover:bg-gray-800 transition-colors shadow-sm"
              >
                Send Transfer Request
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Pending State */}
        {step === 'pending' && (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center mx-auto shadow-md">
              <Clock className="w-8 h-8" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full mb-2">
                Status: Pending Buyer Acceptance
              </div>
              <h3 className="text-xl font-medium tracking-tight text-black">
                Transfer Link Dispatched
              </h3>
              <p className="text-xs text-black/60 mt-1 max-w-sm mx-auto">
                An SMS verification invite was sent to <strong>+91 {buyerPhone}</strong>. Waiting
                for buyer confirmation.
              </p>
            </div>

            {/* Test Simulation Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSimulateBuyerAccept}
                className="w-full py-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-medium hover:bg-emerald-100 transition-colors"
              >
                Simulate Buyer Acceptance (Demo)
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Accepted State */}
        {step === 'accepted' && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full mb-2">
                Ownership Successfully Transferred
              </div>
              <h3 className="text-xl font-medium tracking-tight text-black">
                Transfer Completed
              </h3>
              <p className="text-xs text-black/60 mt-1 max-w-sm mx-auto">
                Product warranty has been re-assigned to +91 {buyerPhone}. Second-hand authenticity
                preserved!
              </p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="px-8 py-3 bg-black text-white text-xs font-medium rounded-full hover:bg-gray-800 transition-colors shadow-sm"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransferUserModal;
