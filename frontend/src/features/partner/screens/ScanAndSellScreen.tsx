import React, { useState } from 'react';
import {
  QrCode,
  Camera,
  Smartphone,
  CheckCircle2,
  ShieldCheck,
  Search,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const ScanAndSellScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [scannedCode, setScannedCode] = useState('TC-8924-GENUINE');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isScanningCamera, setIsScanningCamera] = useState(false);

  const simulateCameraScan = () => {
    setIsScanningCamera(true);
    setTimeout(() => {
      setIsScanningCamera(false);
      setScannedCode('TC-8924-GENUINE');
      setCurrentStep(2);
    }, 1500);
  };

  const handleManualCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannedCode.trim()) return;
    setCurrentStep(2);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setScannedCode('TC-8924-GENUINE');
    setCustomerPhone('');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div className="text-center">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-black/40">
          Retail Counter POS Workflow
        </span>
        <h2
          className="text-3xl font-medium tracking-tight text-black mt-1"
          style={{ letterSpacing: '-0.03em' }}
        >
          Scan & Sell Unit
        </h2>
        <p className="text-black/60 text-xs mt-1">
          Fast counter checkout. Automatically registers consumer ownership and dispatches digital warranty SMS.
        </p>
      </div>

      {/* Stepper Dots (1 to 5) */}
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-all ${
              currentStep === s
                ? 'w-8 bg-black'
                : currentStep > s
                ? 'w-4 bg-emerald-500'
                : 'w-4 bg-black/10'
            }`}
          />
        ))}
      </div>

      {/* ---------------------------------------------------- */}
      {/* STEP 1: Scan Product QR (Camera view + Manual input) */}
      {/* ---------------------------------------------------- */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm space-y-6 animate-in fade-in">
          <div className="text-center">
            <span className="text-xs font-semibold text-black/50 uppercase">Step 1 of 5</span>
            <h3 className="text-lg font-medium text-black mt-0.5">Scan Product QR Code</h3>
          </div>

          {/* Camera Viewport Mockup */}
          <div
            onClick={simulateCameraScan}
            className="relative w-full h-64 rounded-2xl bg-black flex flex-col items-center justify-center overflow-hidden cursor-pointer group shadow-inner"
          >
            {/* Viewfinder brackets */}
            <div className="absolute inset-8 border-2 border-white/40 rounded-2xl pointer-events-none group-hover:border-emerald-400 transition-colors" />

            {/* Scanning Laser Line */}
            <div className="absolute left-8 right-8 h-0.5 bg-emerald-400 shadow-[0_0_12px_#34D399] animate-bounce top-1/2 -translate-y-1/2" />

            <div className="relative z-10 text-center text-white space-y-2 p-4">
              <Camera className="w-8 h-8 mx-auto text-white/80 group-hover:text-emerald-400 transition-colors" />
              <div className="text-xs font-medium">
                {isScanningCamera ? 'Reading QR Token...' : 'Click to Simulate Camera QR Scan'}
              </div>
              <span className="text-[10px] text-white/50 block">Points camera at box QR label</span>
            </div>
          </div>

          {/* Manual Code Input Option */}
          <form onSubmit={handleManualCodeSubmit} className="space-y-3 pt-2">
            <div className="relative">
              <input
                type="text"
                value={scannedCode}
                onChange={(e) => setScannedCode(e.target.value)}
                placeholder="Or enter 12-digit code manually"
                className="w-full pl-4 pr-24 py-3 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black font-mono text-xs uppercase focus:outline-none focus:border-black"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-black text-white text-xs font-medium rounded-xl hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* STEP 2: Product Confirmation Card                    */}
      {/* ---------------------------------------------------- */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm space-y-6 animate-in fade-in">
          <div className="text-center">
            <span className="text-xs font-semibold text-black/50 uppercase">Step 2 of 5</span>
            <h3 className="text-lg font-medium text-black mt-0.5">Product Verification Verified</h3>
          </div>

          {/* Product Confirmation Card */}
          <div className="p-5 rounded-2xl bg-[#F5F5F5] border border-black/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Genuine Match</span>
              </span>
              <span className="font-mono text-xs text-black/50">{scannedCode}</span>
            </div>

            <div>
              <h4 className="text-lg font-medium text-black">Cipla Asthalin Inhaler 100mcg</h4>
              <p className="text-xs text-black/60">Cipla Pharmaceuticals Ltd. · Batch #DEL99</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-black/5 text-black/70">
              <div>
                <span className="text-black/40 block text-[10px]">Expiry Date</span>
                <span>August 2029</span>
              </div>
              <div>
                <span className="text-black/40 block text-[10px]">MRP</span>
                <span className="font-bold text-black">₹185.00</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="flex-1 py-3 bg-[#F5F5F5] text-black text-xs font-medium rounded-full hover:bg-black/5 transition-colors"
            >
              Re-Scan
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="flex-1 py-3 bg-black text-white text-xs font-medium rounded-full hover:bg-gray-800 transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <span>Confirm & Proceed</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* STEP 3: Enter Customer's Phone Number                */}
      {/* ---------------------------------------------------- */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm space-y-6 animate-in fade-in">
          <div className="text-center">
            <span className="text-xs font-semibold text-black/50 uppercase">Step 3 of 5</span>
            <h3 className="text-lg font-medium text-black mt-0.5">Enter Customer Mobile Number</h3>
            <p className="text-xs text-black/50 mt-1">
              Required to bind the Polygon warranty record to the buyer.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                Customer Phone
              </label>
              <div className="flex gap-2">
                <span className="inline-flex items-center px-4 py-3 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black font-medium text-sm">
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="9821456789"
                  className="flex-1 px-4 py-3 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black font-mono font-medium text-sm focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 leading-relaxed flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Customer instantly unlocks +50 TrustPoints and warranty certificate.</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="flex-1 py-3 bg-[#F5F5F5] text-black text-xs font-medium rounded-full hover:bg-black/5 transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              disabled={customerPhone.length < 10}
              onClick={() => setCurrentStep(4)}
              className="flex-1 py-3 bg-black text-white text-xs font-medium rounded-full hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* STEP 4: Confirm "Mark as Sold"                       */}
      {/* ---------------------------------------------------- */}
      {currentStep === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm space-y-6 animate-in fade-in">
          <div className="text-center">
            <span className="text-xs font-semibold text-black/50 uppercase">Step 4 of 5</span>
            <h3 className="text-lg font-medium text-black mt-0.5">Final Sale Confirmation</h3>
          </div>

          <div className="p-4 bg-[#F5F5F5] rounded-2xl border border-black/5 space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-black/50">Item:</span>
              <span className="font-semibold text-black">Cipla Asthalin Inhaler 100mcg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/50">Serial / QR:</span>
              <span className="font-mono text-black">{scannedCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/50">Buyer Phone:</span>
              <span className="font-mono font-bold text-black">+91 {customerPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/50">Store Node:</span>
              <span className="text-black">Apollo Pharmacy Sector 18 (Noida)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="flex-1 py-3.5 bg-[#F5F5F5] text-black text-xs font-medium rounded-full hover:bg-black/5 transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(5)}
              className="flex-1 py-3.5 bg-emerald-600 text-white text-xs font-medium rounded-full hover:bg-emerald-700 transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm &quot;Mark as Sold&quot;</span>
            </button>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* STEP 5: Success Screen                               */}
      {/* ---------------------------------------------------- */}
      {currentStep === 5 && (
        <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm text-center space-y-5 animate-in fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full mb-2">
              Ownership Record Dispatched
            </div>
            <h3 className="text-2xl font-medium tracking-tight text-black">
              Unit Marked as Sold
            </h3>
            <p className="text-sm text-black/75 mt-2 max-w-md mx-auto leading-relaxed">
              Customer will receive an SMS to claim their ownership record and warranty.
            </p>
          </div>

          <div className="p-4 bg-[#F5F5F5] rounded-2xl border border-black/5 text-xs text-black/70 max-w-sm mx-auto space-y-1.5 text-left">
            <div className="flex justify-between">
              <span className="text-black/50">SMS Sent to:</span>
              <span className="font-mono text-black font-semibold">+91 {customerPhone || '9821456789'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/50">Polygon Vault:</span>
              <span className="font-mono text-emerald-700">Anchored Live</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-8 py-3 bg-black text-white text-xs font-medium rounded-full hover:bg-gray-800 transition-colors shadow-sm"
            >
              Scan Next Unit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanAndSellScreen;
