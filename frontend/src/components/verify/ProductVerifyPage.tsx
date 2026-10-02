import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  AlertOctagon,
  Clock,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  MapPin,
  Building2,
  Truck,
  Store,
  User,
  Sparkles,
  CheckCircle2,
  QrCode,
  ArrowLeft,
  Share2,
  Loader2,
} from 'lucide-react';
import { LogoIcon } from '../common/LogoIcon';
import { ReportFakeModal } from './ReportFakeModal';
import { api } from '../../services/api';

export type ResultState = 'genuine' | 'suspicious' | 'fake' | 'recalled' | 'sold_unclaimed';

interface ProductVerifyPageProps {
  code?: string;
  onBackToHome: () => void;
  onPromptLogin: () => void;
}

interface StateData {
  state: ResultState;
  bannerTitle: string;
  headline: string;
  explanation: string;
  badgeBg: string;
  badgeText: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
  icon: React.ComponentType<{ className?: string }>;
  productName: string;
  brand: string;
  batchNumber: string;
  mfgDate: string;
  expiryDate: string;
  scanCount: number;
  txHash: string;
  blockHeight: string;
  contractAddress: string;
  recallReason?: string;
  image: string;
  timeline: {
    role: string;
    entity: string;
    location: string;
    date: string;
    status: 'completed' | 'current' | 'pending' | 'flagged';
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

const STATE_CONFIGS: Record<ResultState, StateData> = {
  genuine: {
    state: 'genuine',
    bannerTitle: 'Authentic & Verified',
    headline: 'Genuine Product',
    explanation:
      'This product is authenticated and recorded on the Polygon blockchain. Single original scan detected with zero duplicate anomalies.',
    badgeBg: 'bg-emerald-500',
    badgeText: 'text-emerald-900',
    accentBg: 'bg-emerald-50',
    accentBorder: 'border-emerald-200',
    accentText: 'text-emerald-800',
    icon: CheckCircle2,
    productName: 'Cipla Asthalin Inhaler 100mcg',
    brand: 'Cipla Pharmaceuticals Ltd.',
    batchNumber: 'BATCH-2026-DEL99',
    mfgDate: '15 September 2026',
    expiryDate: '31 August 2029',
    scanCount: 1,
    txHash: '0x7f4a8e3189bcd0911293a9ff827102eac69f91a2',
    blockHeight: '62,819,401',
    contractAddress: '0x3a992F74Ce79e23F1b62fC43Ac5f37De4e0B108B',
    image:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260423_164207_f243351d-ed59-48ec-83a0-a5e996bdbe3c.png&w=1280&q=85',
    timeline: [
      {
        role: 'Manufacturer',
        entity: 'Cipla Manufacturing Plant 4',
        location: 'Verna Industrial Estate, Goa',
        date: '15 Sep 2026, 09:30 AM',
        status: 'completed',
        icon: Building2,
      },
      {
        role: 'Distributor',
        entity: 'National Pharma Logistics Hub',
        location: 'Bhiwandi Central Warehouse, Mumbai',
        date: '20 Sep 2026, 02:15 PM',
        status: 'completed',
        icon: Truck,
      },
      {
        role: 'Retailer',
        entity: 'Apollo Pharmacy Sector 18',
        location: 'Noida, Uttar Pradesh',
        date: '27 Sep 2026, 11:40 AM',
        status: 'completed',
        icon: Store,
      },
      {
        role: 'Consumer',
        entity: 'First Verified Scan',
        location: 'Noida, Uttar Pradesh (Current)',
        date: 'Just now',
        status: 'current',
        icon: User,
      },
    ],
  },
  suspicious: {
    state: 'suspicious',
    bannerTitle: 'Duplicate QR Anomaly Alert',
    headline: 'Suspicious Activity Detected',
    explanation:
      'This QR was scanned in 2 different cities within 5 minutes (Delhi and Bengaluru). High probability of a cloned or photocopied QR code.',
    badgeBg: 'bg-amber-500',
    badgeText: 'text-amber-900',
    accentBg: 'bg-amber-50',
    accentBorder: 'border-amber-300',
    accentText: 'text-amber-900',
    icon: AlertTriangle,
    productName: 'boAt Rockerz 450 Pro Headphones',
    brand: 'boAt Lifestyle India',
    batchNumber: 'BT-8820-AUDIO',
    mfgDate: '10 July 2026',
    expiryDate: 'N/A (Electronics Warranty 1 Yr)',
    scanCount: 14,
    txHash: '0x992b10ae45f9103cba71890123fe554329aa8701',
    blockHeight: '61,942,109',
    contractAddress: '0x3a992F74Ce79e23F1b62fC43Ac5f37De4e0B108B',
    image:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260423_164207_f243351d-ed59-48ec-83a0-a5e996bdbe3c.png&w=1280&q=85',
    timeline: [
      {
        role: 'Manufacturer',
        entity: 'boAt Electronics Unit 2',
        location: 'Noida Electronic Zone, UP',
        date: '10 Jul 2026, 11:00 AM',
        status: 'completed',
        icon: Building2,
      },
      {
        role: 'Distributor',
        entity: 'Apex Gadgets Distribution',
        location: 'Nehru Place, New Delhi',
        date: '18 Jul 2026, 04:20 PM',
        status: 'completed',
        icon: Truck,
      },
      {
        role: 'Anomaly Alert',
        entity: '14 Rapid Duplicate Scans',
        location: 'Delhi & Bengaluru Concurrent Scans',
        date: 'Flagged 5 mins ago',
        status: 'flagged',
        icon: AlertTriangle,
      },
      {
        role: 'Consumer',
        entity: 'Unverified Resale Channel',
        location: 'Unknown Retailer',
        date: 'Pending Investigation',
        status: 'pending',
        icon: User,
      },
    ],
  },
  fake: {
    state: 'fake',
    bannerTitle: 'Cryptographic Check Failed',
    headline: 'This product could not be verified',
    explanation:
      'This serial code does not exist in the Polygon blockchain registry or was never minted by an authorized manufacturer. Do not consume or use.',
    badgeBg: 'bg-rose-500',
    badgeText: 'text-rose-900',
    accentBg: 'bg-rose-50',
    accentBorder: 'border-rose-300',
    accentText: 'text-rose-900',
    icon: XCircle,
    productName: 'Unregistered / Counterfeit Unit',
    brand: 'Unauthorized Manufacturer',
    batchNumber: 'INVALID-OR-UNRECORDED',
    mfgDate: 'Unknown',
    expiryDate: 'Unknown',
    scanCount: 0,
    txHash: 'NOT_FOUND_ON_POLYGON',
    blockHeight: 'N/A',
    contractAddress: 'N/A',
    image:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260423_164207_f243351d-ed59-48ec-83a0-a5e996bdbe3c.png&w=1280&q=85',
    timeline: [
      {
        role: 'Manufacturer',
        entity: 'Origin Record Not Found',
        location: 'No Authorized Polygon Mint',
        date: 'Never Recorded',
        status: 'flagged',
        icon: AlertOctagon,
      },
      {
        role: 'Chain of Custody',
        entity: 'Untracked Grey Market Source',
        location: 'Unknown',
        date: 'N/A',
        status: 'flagged',
        icon: AlertOctagon,
      },
    ],
  },
  recalled: {
    state: 'recalled',
    bannerTitle: 'Manufacturer Recall Notice',
    headline: 'Batch Recall Notice',
    explanation:
      'Manufacturer voluntarily recalled this batch on 15 Sep 2026 due to packaging seal revision. Expiry date exceeded or recalled before safe consumption. Return for full refund.',
    badgeBg: 'bg-orange-500',
    badgeText: 'text-orange-900',
    accentBg: 'bg-orange-50',
    accentBorder: 'border-orange-300',
    accentText: 'text-orange-900',
    icon: AlertOctagon,
    recallReason: 'Voluntary Recall #REC-2026-991: Packaging Seal Integrity Revision',
    productName: 'Tata Consumer Daily Care Batch #TC-99',
    brand: 'Tata Consumer Products Ltd.',
    batchNumber: 'TATA-BATCH-0994-REC',
    mfgDate: '01 June 2026',
    expiryDate: '30 November 2026',
    scanCount: 3,
    txHash: '0x43ba10fe892301baee771029314488219001b92c',
    blockHeight: '62,104,800',
    contractAddress: '0x3a992F74Ce79e23F1b62fC43Ac5f37De4e0B108B',
    image:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260423_164207_f243351d-ed59-48ec-83a0-a5e996bdbe3c.png&w=1280&q=85',
    timeline: [
      {
        role: 'Manufacturer',
        entity: 'Tata Packaging Complex',
        location: 'Kolkata Industrial Area, WB',
        date: '01 Jun 2026, 08:00 AM',
        status: 'completed',
        icon: Building2,
      },
      {
        role: 'Recall Issued',
        entity: 'Safety Advisory #REC-2026-991',
        location: 'Nationwide Brand Bulletin',
        date: '15 Sep 2026, 03:00 PM',
        status: 'flagged',
        icon: AlertOctagon,
      },
      {
        role: 'Consumer Action',
        entity: 'Do Not Use / Return to Store',
        location: 'Full Refund Available',
        date: 'Active Recall',
        status: 'current',
        icon: User,
      },
    ],
  },
  sold_unclaimed: {
    state: 'sold_unclaimed',
    bannerTitle: 'Retail Sold • Awaiting Claim',
    headline: 'This product has been sold. Owner has not claimed it yet.',
    explanation:
      'Purchased at authorized retail store. Enter your mobile number to claim official ownership, bind your warranty, and collect your loyalty reward points.',
    badgeBg: 'bg-blue-600',
    badgeText: 'text-blue-900',
    accentBg: 'bg-blue-50',
    accentBorder: 'border-blue-300',
    accentText: 'text-blue-900',
    icon: Store,
    productName: 'Titan Edge Ceramic Slim Watch',
    brand: 'Titan Company Limited',
    batchNumber: 'TITAN-LUX-2026-88',
    mfgDate: '12 August 2026',
    expiryDate: 'Lifetime Provenance',
    scanCount: 2,
    txHash: '0x12bb90ee4510293acbf771029314488219001b92c',
    blockHeight: '62,541,200',
    contractAddress: '0x3a992F74Ce79e23F1b62fC43Ac5f37De4e0B108B',
    image:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260423_164207_f243351d-ed59-48ec-83a0-a5e996bdbe3c.png&w=1280&q=85',
    timeline: [
      {
        role: 'Manufacturer',
        entity: 'Titan Precision Atelier',
        location: 'Hosur Manufacturing Facility, TN',
        date: '12 Aug 2026, 10:15 AM',
        status: 'completed',
        icon: Building2,
      },
      {
        role: 'Distributor',
        entity: 'Titan Central Supply Hub',
        location: 'Bengaluru Logistics Park',
        date: '25 Aug 2026, 01:40 PM',
        status: 'completed',
        icon: Truck,
      },
      {
        role: 'Authorized Retailer',
        entity: 'World of Titan, Indiranagar',
        location: 'Bengaluru, Karnataka',
        date: '28 Sep 2026, 05:22 PM (POS Sale Logged)',
        status: 'completed',
        icon: Store,
      },
      {
        role: 'Consumer Claim',
        entity: 'Awaiting First Buyer Claim',
        location: 'Open for OTP Verification',
        date: 'Pending Mobile Claim',
        status: 'current',
        icon: User,
      },
    ],
  },
};

export const ProductVerifyPage: React.FC<ProductVerifyPageProps> = ({
  code = 'TC-8924-GENUINE',
  onBackToHome,
  onPromptLogin,
}) => {
  // Allow toggling between all 5 states dynamically to inspect full page variants
  const [activeState, setActiveState] = useState<ResultState>('genuine');
  const [techProofExpanded, setTechProofExpanded] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [rewardsClaimed, setRewardsClaimed] = useState(false);
  const [liveData, setLiveData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Live real-time cryptographic verification call to the backend
  useEffect(() => {
    let isMounted = true;
    async function verifyLive() {
      if (!code) return;
      setIsLoading(true);
      try {
        const res = await api.verify.verifyProduct(code);
        if (isMounted && res.success && res.data) {
          setLiveData(res.data);
          const stateMap: Record<string, ResultState> = {
            genuine: 'genuine',
            suspicious: 'suspicious',
            fake: 'fake',
            recalled: 'recalled',
            soldAwaitingClaim: 'sold_unclaimed',
            notFound: 'fake',
          };
          const mapped = stateMap[res.data.state];
          if (mapped) {
            setActiveState(mapped);
          }
        }
      } catch (err) {
        console.warn('Backend API offline or network error, continuing with fallback:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    verifyLive();
    return () => {
      isMounted = false;
    };
  }, [code]);

  const defaultData = STATE_CONFIGS[activeState];
  const data: StateData = {
    ...defaultData,
    productName: liveData?.product?.name || defaultData.productName,
    brand: liveData?.brand?.name || defaultData.brand,
    batchNumber: liveData?.batch?.batchNumber || defaultData.batchNumber,
    mfgDate: liveData?.batch?.mfgDate
      ? new Date(liveData.batch.mfgDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
      : defaultData.mfgDate,
    expiryDate: liveData?.batch?.expiryDate
      ? new Date(liveData.batch.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
      : defaultData.expiryDate,
    scanCount: liveData?.scanCount !== undefined ? liveData.scanCount : defaultData.scanCount,
    explanation: liveData?.reason || defaultData.explanation,
    recallReason: liveData?.reason || defaultData.recallReason,
    txHash: liveData?.technicalProof?.txHash || defaultData.txHash,
    contractAddress: liveData?.technicalProof?.contractAddress || defaultData.contractAddress,
  };
  const Icon = data.icon;

  const handleClaimRewards = () => {
    // If genuine or sold_unclaimed, prompts login or credits
    if (activeState === 'genuine' || activeState === 'sold_unclaimed') {
      onPromptLogin();
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-black flex flex-col font-sans selection:bg-black selection:text-white">
      {/* ---------------------------------------------------------------- */}
      {/* TOP BAR / DEMO STATE SWITCHER FOR JUDGES & USERS TO TEST ALL 5   */}
      {/* ---------------------------------------------------------------- */}
      <div className="bg-black text-white px-4 py-2.5 text-xs">
        <div className="max-w-[88rem] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold uppercase tracking-wider text-emerald-400">
              Demo State Switcher:
            </span>
            <span className="text-white/60 hidden md:inline">
              Test all 5 full-page verification variants:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveState('genuine')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeState === 'genuine'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              1. Genuine
            </button>

            <button
              type="button"
              onClick={() => setActiveState('suspicious')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeState === 'suspicious'
                  ? 'bg-amber-500 text-black font-semibold'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              2. Suspicious
            </button>

            <button
              type="button"
              onClick={() => setActiveState('fake')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeState === 'fake'
                  ? 'bg-rose-600 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              3. Fake
            </button>

            <button
              type="button"
              onClick={() => setActiveState('recalled')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeState === 'recalled'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              4. Recalled
            </button>

            <button
              type="button"
              onClick={() => setActiveState('sold_unclaimed')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeState === 'sold_unclaimed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              5. Sold (Unclaimed)
            </button>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* HEADER: Back to Home + TrustChain Brand Logo                     */}
      {/* ---------------------------------------------------------------- */}
      <header className="border-b border-black/5 bg-white/70 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-[88rem] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 text-xs font-medium text-black/60 hover:text-black bg-[#F5F5F5] hover:bg-black/5 px-3.5 py-2 rounded-full border border-black/5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>

            <div className="h-4 w-px bg-black/10 hidden sm:block" />

            <div className="flex items-center gap-2">
              <LogoIcon className="w-6 h-6 text-black" />
              <span className="text-xl font-medium tracking-tight text-black">TrustChain</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-medium text-black/60 bg-[#F5F5F5] px-3 py-1.5 rounded-full border border-black/5 hidden sm:inline-block">
              ID: {code}
            </span>

            <button
              type="button"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: 'Product Verification', url: window.location.href });
                }
              }}
              className="p-2 rounded-full text-black/60 hover:text-black hover:bg-black/5 transition-colors"
              aria-label="Share verification"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------------------- */}
      {/* 1. STATUS BANNER (TOP) - Highly visible at first glance           */}
      {/* ---------------------------------------------------------------- */}
      <div className={`w-full py-8 md:py-12 px-6 border-b transition-colors duration-300 ${data.accentBg} ${data.accentBorder}`}>
        <div className="max-w-[88rem] mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              {/* Dynamic Status Icon */}
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${data.badgeBg} text-white`}
              >
                <Icon className="w-9 h-9" />
              </div>

              <div>
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider px-3 py-0.5 rounded-full bg-black/5 text-black/70 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{data.bannerTitle}</span>
                </div>

                <h1
                  className="text-3xl md:text-5xl font-medium tracking-tight text-black leading-tight"
                  style={{ letterSpacing: '-0.03em' }}
                >
                  {data.headline}
                </h1>

                <p className="text-black/75 text-base md:text-lg max-w-3xl mt-2 leading-relaxed font-normal">
                  {data.explanation}
                </p>

                {data.recallReason && (
                  <div className="mt-3 p-3 bg-white/80 rounded-xl border border-orange-300 text-xs font-medium text-orange-950 flex items-center gap-2">
                    <AlertOctagon className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>{data.recallReason}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick action buttons on banner */}
            <div className="flex flex-wrap items-center gap-3 shrink-0 self-start md:self-center">
              <button
                type="button"
                onClick={() => setReportModalOpen(true)}
                className="px-5 py-2.5 rounded-full text-xs font-medium bg-white text-rose-700 border border-rose-200 hover:bg-rose-50 transition-colors shadow-sm"
              >
                Report Fake
              </button>

              {(activeState === 'genuine' || activeState === 'sold_unclaimed') && (
                <button
                  type="button"
                  onClick={handleClaimRewards}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-medium bg-black text-white hover:bg-gray-800 transition-colors shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Claim Rewards</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* MAIN CONTENT: Product Info, Badges, Timeline & Proof             */}
      {/* ---------------------------------------------------------------- */}
      <main className="flex-1 max-w-[88rem] mx-auto w-full px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (7 cols): Product Spec & Proof */}
          <div className="lg:col-span-7 space-y-6">
            {/* Product Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                {/* Product Image */}
                <div
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shrink-0 border border-black/5 bg-[#F5F5F5]"
                  style={{
                    backgroundImage: `url("${data.image}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />

                {/* Details */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {/* "Blockchain Verified" badge */}
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Blockchain Verified</span>
                    </span>

                    {/* Scan count badge */}
                    <span className="inline-flex items-center gap-1 text-xs font-medium bg-[#F5F5F5] text-black/70 px-3 py-1 rounded-full border border-black/5">
                      <Clock className="w-3.5 h-3.5 text-black/40" />
                      <span>Scan Count: {data.scanCount}</span>
                    </span>
                  </div>

                  <h2
                    className="text-2xl sm:text-3xl font-medium tracking-tight text-black mb-1"
                    style={{ letterSpacing: '-0.02em' }}
                  >
                    {data.productName}
                  </h2>
                  <div className="text-black/60 text-sm font-medium mb-4">{data.brand}</div>

                  {/* Metadata key-value grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs pt-4 border-t border-black/5">
                    <div>
                      <span className="text-black/50 block mb-0.5">Batch Number</span>
                      <span className="font-mono font-medium text-black">{data.batchNumber}</span>
                    </div>

                    <div>
                      <span className="text-black/50 block mb-0.5">Manufacturing Date</span>
                      <span className="font-medium text-black">{data.mfgDate}</span>
                    </div>

                    <div>
                      <span className="text-black/50 block mb-0.5">Expiry / Lifecycle</span>
                      <span className="font-medium text-black">{data.expiryDate}</span>
                    </div>

                    <div>
                      <span className="text-black/50 block mb-0.5">Minted Network</span>
                      <span className="font-medium text-emerald-800">Polygon POS (Gas-Free)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ---------------------------------------------------------- */}
            {/* Expandable "View technical proof" section                  */}
            {/* ---------------------------------------------------------- */}
            <div className="bg-white rounded-3xl border border-black/5 overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => setTechProofExpanded(!techProofExpanded)}
                className="w-full p-6 sm:p-8 flex items-center justify-between text-left hover:bg-black/[0.01] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-black">View Technical Cryptographic Proof</h3>
                    <p className="text-xs text-black/50 mt-0.5">
                      Polygon transaction hash, Merkle root, smart contract reference
                    </p>
                  </div>
                </div>

                {techProofExpanded ? (
                  <ChevronUp className="w-5 h-5 text-black/40" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-black/40" />
                )}
              </button>

              {techProofExpanded && (
                <div className="px-6 sm:px-8 pb-8 pt-2 border-t border-black/5 space-y-4 animate-in fade-in duration-200">
                  <div className="p-4 rounded-2xl bg-[#F5F5F5] border border-black/5 text-xs font-mono space-y-2.5">
                    <div>
                      <span className="text-black/40 uppercase block mb-1">
                        Polygon Transaction Hash (txHash)
                      </span>
                      <span className="text-black font-semibold break-all">{data.txHash}</span>
                    </div>

                    <div>
                      <span className="text-black/40 uppercase block mb-1">Block Height</span>
                      <span className="text-black font-semibold">{data.blockHeight}</span>
                    </div>

                    <div>
                      <span className="text-black/40 uppercase block mb-1">Smart Contract Address</span>
                      <span className="text-black font-semibold break-all">{data.contractAddress}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-black/50">
                      Consensus: Polygon POS · State Root Anchored on Ethereum
                    </span>

                    <a
                      href={`https://polygonscan.com/tx/${data.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-black hover:text-emerald-700 transition-colors"
                    >
                      <span>View on Polygonscan</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons in body */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => setReportModalOpen(true)}
                className="inline-flex items-center gap-2 bg-white text-rose-700 border border-rose-200 px-6 py-3 rounded-full text-sm font-medium hover:bg-rose-50 transition-colors shadow-sm"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Report Counterfeit (+500 Bounty)</span>
              </button>

              {(activeState === 'genuine' || activeState === 'sold_unclaimed') && (
                <button
                  type="button"
                  onClick={handleClaimRewards}
                  className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Claim Rewards & Warranty</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column (5 cols): Ownership Timeline Stepper */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/5">
                <div>
                  <h3 className="text-xl font-medium tracking-tight text-black">
                    Ownership Timeline
                  </h3>
                  <p className="text-xs text-black/50 mt-0.5">
                    End-to-end custody verification from factory to consumer
                  </p>
                </div>
                <span className="text-xs font-semibold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  Chain-of-Custody
                </span>
              </div>

              {/* Vertical Stepper */}
              <div className="space-y-6 relative before:absolute before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-black/10">
                {data.timeline.map((step, idx) => {
                  const StepIcon = step.icon;
                  const isCompleted = step.status === 'completed';
                  const isCurrent = step.status === 'current';
                  const isFlagged = step.status === 'flagged';

                  return (
                    <div key={`${step.role}-${idx}`} className="relative flex items-start gap-4">
                      {/* Step Circle Icon */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 shadow-sm ${
                          isFlagged
                            ? 'bg-rose-500 text-white'
                            : isCurrent
                            ? 'bg-black text-white ring-4 ring-black/10'
                            : isCompleted
                            ? 'bg-emerald-500 text-white'
                            : 'bg-[#F5F5F5] text-black/40'
                        }`}
                      >
                        <StepIcon className="w-5 h-5" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 pt-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold uppercase tracking-wider text-black/50">
                            {step.role}
                          </span>
                          <span className="text-[11px] text-black/40">{step.date}</span>
                        </div>

                        <div className="text-sm font-medium text-black mt-0.5">{step.entity}</div>

                        <div className="flex items-center gap-1 text-xs text-black/60 mt-1">
                          <MapPin className="w-3 h-3 text-black/40" />
                          <span>{step.location}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ---------------------------------------------------------------- */}
      {/* SMALL FOOTER CTA: "Are you a brand? Protect your products"      */}
      {/* ---------------------------------------------------------------- */}
      <div className="bg-white border-t border-black/5 py-8 px-6 mt-12">
        <div className="max-w-[88rem] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-medium text-black">
                Are you a brand? Protect your products with TrustChain.
              </div>
              <div className="text-xs text-black/60">
                Join India&apos;s leading manufacturers issuing blockchain-backed authentic digital identities.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onPromptLogin}
            className="inline-flex items-center gap-2 bg-black text-white text-xs font-medium px-6 py-3 rounded-full hover:bg-gray-800 transition-colors shrink-0 shadow-sm"
          >
            <span>Register Your Brand</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Report Fake Modal */}
      <ReportFakeModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        productCode={code}
        productName={data.productName}
      />
    </div>
  );
};

export default ProductVerifyPage;
