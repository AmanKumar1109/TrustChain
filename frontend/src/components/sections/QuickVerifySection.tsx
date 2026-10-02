import React, { useState } from 'react';
import {
  Camera,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  AlertOctagon,
  ArrowRight,
  ShieldCheck,
  Search,
  Sparkles,
  Clock,
  ExternalLink,
  Loader2,
  Store,
} from 'lucide-react';
import { CameraQrScanner } from '../common/CameraQrScanner';
import { api } from '../../services/api';

interface VerificationResult {
  code: string;
  status: 'genuine' | 'suspicious' | 'fake' | 'recalled' | 'expired' | 'soldAwaitingClaim' | 'notFound';
  productName: string;
  brand: string;
  batch: string;
  mfgDate: string;
  expiryDate: string;
  txHash: string;
  scanCount: number;
  locations: string[];
  pointsEarned: number;
  reason?: string;
}

const SAMPLE_DATABASE: Record<string, VerificationResult> = {
  'TC-8924-GENUINE': {
    code: 'TC-8924-GENUINE',
    status: 'genuine',
    productName: 'Cipla Asthalin Inhaler 100mcg',
    brand: 'Cipla Pharmaceuticals',
    batch: 'BATCH-2026-DEL99',
    mfgDate: 'September 2026',
    expiryDate: 'August 2029',
    txHash: '0x7f4a8e3189bcd0911293a9ff827102eac69f91a2',
    scanCount: 1,
    locations: ['Mumbai, Maharashtra (Original Scan)'],
    pointsEarned: 50,
  },
  'TC-3310-SUSPICIOUS': {
    code: 'TC-3310-SUSPICIOUS',
    status: 'suspicious',
    productName: 'boAt Rockerz 450 Pro Headphones',
    brand: 'boAt Lifestyle',
    batch: 'BT-8820-AUDIO',
    mfgDate: 'July 2026',
    expiryDate: 'N/A',
    txHash: '0x992b10ae45f9103cba71890123fe554329aa8701',
    scanCount: 14,
    locations: ['Bengaluru (10 mins ago)', 'Delhi (14 mins ago)', 'Jaipur (1 hour ago)'],
    pointsEarned: 0,
    reason: 'Scanned in 2 different cities within 5 minutes (Delhi and Bengaluru)',
  },
  'TC-0000-FAKE': {
    code: 'TC-0000-FAKE',
    status: 'notFound',
    productName: 'Unregistered / Unknown Item',
    brand: 'Unverified Entity',
    batch: 'INVALID-HASH',
    mfgDate: 'Unknown',
    expiryDate: 'Unknown',
    txHash: 'NOT_FOUND_IN_REGISTRY',
    scanCount: 0,
    locations: ['Unrecorded Location'],
    pointsEarned: 0,
    reason: 'This product code was not found in the TrustChain registry.',
  },
};

interface QuickVerifySectionProps {
  onNavigateToVerifyPage?: (code: string) => void;
}

export const QuickVerifySection: React.FC<QuickVerifySectionProps> = ({
  onNavigateToVerifyPage,
}) => {
  const [codeInput, setCodeInput] = useState('');
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleVerify = async (codeToTest?: string) => {
    const code = (codeToTest || codeInput).trim().toUpperCase();
    if (!code) return;

    setHasSearched(true);
    setIsVerifying(true);

    try {
      // Live call to backend /verify/:code
      const res = await api.verify.verifyProduct(code);
      if (res.success && res.data) {
        const d = res.data;
        const prod = d.product || d.productDetails || {};
        const brand = d.brand || {};

        setResult({
          code: d.code || code,
          status: d.state || 'genuine',
          productName: prod.name || 'Verified Product',
          brand: brand.name || brand.companyName || 'Authorized Manufacturer',
          batch: d.batchNumber || 'REG-BATCH-001',
          mfgDate: d.mfgDate ? new Date(d.mfgDate).toLocaleDateString('en-IN') : 'Recent',
          expiryDate: d.expiryDate ? new Date(d.expiryDate).toLocaleDateString('en-IN') : 'Safe Shelf Life',
          txHash: d.technicalProof?.txHash || 'Verified Digital Signature',
          scanCount: d.scanCount || 1,
          locations: d.ownershipTimeline?.map((t: any) => t.location || t.actor).filter(Boolean) || ['National Network'],
          pointsEarned: d.rewardsEligible ? 50 : 0,
          reason: d.reason,
        });
        return;
      }
    } catch {
      // Network fallback or mock match
    } finally {
      setIsVerifying(false);
    }

    // Fallback if backend offline or sample code
    if (SAMPLE_DATABASE[code]) {
      setResult(SAMPLE_DATABASE[code]);
    } else {
      setResult({
        code,
        status: 'notFound',
        productName: 'Unregistered Physical Good',
        brand: 'No Manufacturer Match',
        batch: 'NOT-REGISTERED',
        mfgDate: 'Unknown',
        expiryDate: 'Unknown',
        txHash: 'N/A',
        scanCount: 0,
        locations: ['Unknown'],
        pointsEarned: 0,
        reason: 'This product code was not found in the TrustChain registry.',
      });
    }
  };

  const handleScanDetected = (scannedCode: string) => {
    setIsCameraModalOpen(false);
    setCodeInput(scannedCode);
    handleVerify(scannedCode);
  };

  return (
    <section id="quick-verify" className="bg-[#F5F5F5] px-6 py-20 border-b border-black/5">
      <div className="max-w-[88rem] mx-auto">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="text-black/60 text-sm font-medium mb-2 tracking-wide uppercase">
            Instant Authenticity Check
          </div>
          <h2
            className="text-black text-4xl md:text-5xl font-medium leading-tight mb-4"
            style={{ letterSpacing: '-0.03em' }}
          >
            Quick Verify
          </h2>
          <p className="text-black/70 text-lg leading-relaxed">
            Check product authenticity immediately without downloading apps, creating accounts, or
            connecting crypto wallets.
          </p>
        </div>

        {/* Verification Widget Box */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-black/5 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Input Field (8 cols) */}
            <div className="lg:col-span-8 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-black/40 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  placeholder="Enter 12-digit code (e.g. TC-8924-GENUINE)"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black placeholder:text-black/40 text-base font-medium focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
                  onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                />
              </div>

              <button
                type="button"
                onClick={() => handleVerify()}
                disabled={isVerifying}
                className="bg-black text-white px-8 py-4 rounded-2xl font-medium text-base hover:bg-gray-800 disabled:opacity-60 transition-colors flex items-center justify-center gap-2 shrink-0 shadow-sm cursor-pointer"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* QR Scan Button (4 cols) */}
            <div className="lg:col-span-4 flex items-center justify-start lg:justify-end">
              <button
                type="button"
                onClick={() => setIsCameraModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-black/5 hover:bg-black/10 text-black px-6 py-4 rounded-2xl font-medium text-base transition-colors border border-black/5 cursor-pointer"
              >
                <Camera className="w-5 h-5 text-black" />
                <span>Scan with QR Camera</span>
              </button>
            </div>
          </div>

          {/* Quick Sample Presets */}
          <div className="mt-6 pt-6 border-t border-black/5 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-black/40 mr-2">
              Try Sample Codes:
            </span>
            <button
              type="button"
              onClick={() => {
                setCodeInput('TC-8924-GENUINE');
                handleVerify('TC-8924-GENUINE');
              }}
              className="text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors"
            >
              ✓ Sample Genuine (Cipla Pharma)
            </button>
            <button
              type="button"
              onClick={() => {
                setCodeInput('TC-3310-SUSPICIOUS');
                handleVerify('TC-3310-SUSPICIOUS');
              }}
              className="text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-full hover:bg-amber-100 transition-colors"
            >
              ⚠ Sample Anomaly (Clone Detected)
            </button>
            <button
              type="button"
              onClick={() => {
                setCodeInput('TC-0000-FAKE');
                handleVerify('TC-0000-FAKE');
              }}
              className="text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200 px-3 py-1.5 rounded-full hover:bg-rose-100 transition-colors"
            >
              ✕ Sample Fake (Unregistered)
            </button>
          </div>
        </div>

        {/* Dynamic Verification Output Result */}
        {hasSearched && result && (
          <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-black/5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Status Banner */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-black/5 pb-6 mb-8">
              <div className="flex items-center gap-4">
                {result.status === 'genuine' && (
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                )}
                {result.status === 'suspicious' && (
                  <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                )}
                {(result.status === 'fake' || result.status === 'notFound') && (
                  <div className="w-14 h-14 rounded-2xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <XCircle className="w-8 h-8" />
                  </div>
                )}
                {result.status === 'recalled' && (
                  <div className="w-14 h-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <AlertOctagon className="w-8 h-8" />
                  </div>
                )}
                {result.status === 'expired' && (
                  <div className="w-14 h-14 rounded-2xl bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Clock className="w-8 h-8" />
                  </div>
                )}
                {result.status === 'soldAwaitingClaim' && (
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Store className="w-8 h-8" />
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-2xl md:text-3xl font-medium tracking-tight ${
                        result.status === 'genuine'
                          ? 'text-emerald-700'
                          : result.status === 'suspicious'
                          ? 'text-amber-700'
                          : result.status === 'soldAwaitingClaim'
                          ? 'text-blue-700'
                          : result.status === 'recalled'
                          ? 'text-orange-700'
                          : 'text-rose-700'
                      }`}
                      style={{ letterSpacing: '-0.02em' }}
                    >
                      {result.status === 'genuine' && 'Authentic & Genuine Product'}
                      {result.status === 'suspicious' && 'Suspicious Clone Alert'}
                      {result.status === 'soldAwaitingClaim' && 'Sold at Retail • Awaiting Customer Claim'}
                      {result.status === 'recalled' && 'Manufacturer Recall Notice'}
                      {result.status === 'expired' && 'Product Batch Expired'}
                      {result.status === 'notFound' && 'Unregistered Physical Good'}
                      {result.status === 'fake' && 'Counterfeit / Tampered Code'}
                    </span>
                  </div>
                  <p className="text-black/60 text-sm mt-0.5">
                    {result.reason ||
                      (result.status === 'genuine' && 'Authenticity verified against digital registry. Single original scan detected.') ||
                      (result.status === 'suspicious' && 'Warning: Scan anomaly detected across distant geographic regions.') ||
                      (result.status === 'soldAwaitingClaim' && 'Purchased at authorized retail store. Owner warranty claim pending.') ||
                      (result.status === 'recalled' && 'This batch has been flagged for voluntary manufacturer recall.') ||
                      'Caution: This serial code was never recorded by an authorized manufacturer.'}
                  </p>
                </div>
              </div>

              {/* Points badge if genuine */}
              {result.pointsEarned > 0 && (
                <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 px-4 py-2 rounded-full text-sm font-medium">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>+{result.pointsEarned} TrustPoints Available</span>
                </div>
              )}
            </div>

            {/* Detailed Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="p-5 rounded-2xl bg-[#F5F5F5] border border-black/5">
                <div className="text-xs text-black/50 font-medium mb-1">Product & Brand</div>
                <div className="text-base font-medium text-black">{result.productName}</div>
                <div className="text-xs text-black/60 mt-1">{result.brand}</div>
              </div>

              <div className="p-5 rounded-2xl bg-[#F5F5F5] border border-black/5">
                <div className="text-xs text-black/50 font-medium mb-1">Batch & Dates</div>
                <div className="text-base font-medium text-black font-mono">{result.batch}</div>
                <div className="text-xs text-black/60 mt-1">
                  Mfg: {result.mfgDate} · Exp: {result.expiryDate}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#F5F5F5] border border-black/5">
                <div className="text-xs text-black/50 font-medium mb-1">Scan Velocity & Clones</div>
                <div className="text-base font-medium text-black">
                  {result.scanCount <= 1 ? '1st Scan (Safe)' : `${result.scanCount} Scans Detected`}
                </div>
                <div className="text-xs text-black/60 mt-1">
                  {result.scanCount <= 1 ? 'Zero duplicates' : 'Geo-anomaly analyzed'}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#F5F5F5] border border-black/5">
                <div className="text-xs text-black/50 font-medium mb-1">Digital Verification Proof</div>
                <div className="text-xs font-mono font-medium text-black truncate">
                  {result.txHash}
                </div>
                <div className="text-xs text-emerald-700 mt-1 flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Immutable Record</span>
                </div>
              </div>
            </div>

            {/* Action Callouts */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-black/5">
              <div className="flex items-center gap-2 text-xs text-black/60">
                <Clock className="w-4 h-4 text-black/40" />
                <span>Verified in real-time via cryptographic proof</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigateToVerifyPage?.(result.code)}
                  className="inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
                >
                  <span>Open Full Verification Page</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Live Camera QR Scanner Modal */}
        {isCameraModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md animate-in zoom-in-95 duration-200">
              <CameraQrScanner
                onScan={handleScanDetected}
                onClose={() => setIsCameraModalOpen(false)}
                title="Scan Packaging QR"
                subtitle="Position camera in front of product QR code"
                showManualFallback={true}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default QuickVerifySection;
