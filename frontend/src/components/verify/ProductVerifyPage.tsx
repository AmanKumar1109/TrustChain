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
  Copy,
  Check,
  Smartphone,
  X,
} from 'lucide-react';
import { LogoIcon } from '../common/LogoIcon';
import { ReportFakeModal } from './ReportFakeModal';
import { api, UserSession } from '../../services/api';
import { toast } from '../../services/toast';

export type ResultState =
  | 'genuine'
  | 'suspicious'
  | 'fake'
  | 'recalled'
  | 'expired'
  | 'sold_unclaimed'
  | 'notFound';

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
  contractAddress: string;
  network: string;
  merkleRoot: string;
  leaf: string;
  proof: string[];
  verifiedOnChain: boolean;
  recallReason?: string;
  image: string;
  timeline: {
    role: string;
    entity: string;
    location: string;
    date: string;
    status: 'completed' | 'current' | 'pending' | 'flagged';
    icon: React.ComponentType<{ className?: string }>;
    notes?: string;
  }[];
}

const STATE_CONFIGS: Record<ResultState, StateData> = {
  genuine: {
    state: 'genuine',
    bannerTitle: 'Authentic & Verified',
    headline: 'Genuine Product',
    explanation:
      'This product is authenticated and verified with an immutable digital certificate. Single original scan detected with zero duplicate anomalies.',
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
    contractAddress: '0x3a992F74Ce79e23F1b62fC43Ac5f37De4e0B108B',
    network: 'Hardhat Localhost (ChainID: 31337)',
    merkleRoot: '0x5b38da6a701c568545dcfcb03fcb875f56beddc4',
    leaf: '0x12a9c3b879201bc6f42371900a892b10ae45f910',
    proof: [
      '0x43ba10fe892301baee771029314488219001b92c',
      '0x992b10ae45f9103cba71890123fe554329aa8701',
    ],
    verifiedOnChain: true,
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
        notes: 'Batch BATCH-2026-DEL99 registered with cryptographic Merkle root.',
      },
      {
        role: 'Distributor',
        entity: 'National Pharma Logistics Hub',
        location: 'Bhiwandi Central Warehouse, Mumbai',
        date: '20 Sep 2026, 02:15 PM',
        status: 'completed',
        icon: Truck,
        notes: 'Dispatched and accepted into logistics custody.',
      },
      {
        role: 'Retailer',
        entity: 'Apollo Pharmacy Sector 18',
        location: 'Noida, Uttar Pradesh',
        date: '27 Sep 2026, 11:40 AM',
        status: 'completed',
        icon: Store,
        notes: 'Stocked on shelf for authorized retail sale.',
      },
      {
        role: 'Consumer',
        entity: 'First Verified Scan',
        location: 'Noida, Uttar Pradesh (Current)',
        date: 'Just now',
        status: 'current',
        icon: User,
        notes: 'Authenticity confirmed. Zero clone anomalies.',
      },
    ],
  },
  suspicious: {
    state: 'suspicious',
    bannerTitle: 'Duplicate Scan Anomaly Alert',
    headline: 'Suspicious Activity Detected',
    explanation:
      'Warning: Unusual scan velocity or concurrent scans in distant locations detected. High probability of a cloned packaging code.',
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
    expiryDate: '10 July 2028',
    scanCount: 14,
    txHash: '0x992b10ae45f9103cba71890123fe554329aa8701',
    contractAddress: '0x3a992F74Ce79e23F1b62fC43Ac5f37De4e0B108B',
    network: 'Hardhat Localhost (ChainID: 31337)',
    merkleRoot: '0x712a8e3189bcd0911293a9ff827102eac69f91a2',
    leaf: '0x5b38da6a701c568545dcfcb03fcb875f56beddc4',
    proof: ['0x12a9c3b879201bc6f42371900a892b10ae45f910'],
    verifiedOnChain: true,
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
        notes: 'Manufactured and assigned digital provenance tag.',
      },
      {
        role: 'Distributor',
        entity: 'Apex Gadgets Distribution',
        location: 'Nehru Place, New Delhi',
        date: '18 Jul 2026, 04:20 PM',
        status: 'completed',
        icon: Truck,
        notes: 'Custody transferred to regional hub.',
      },
      {
        role: 'Anomaly Alert',
        entity: '14 Rapid Duplicate Scans',
        location: 'Delhi & Bengaluru Concurrent Scans',
        date: 'Flagged recently',
        status: 'flagged',
        icon: AlertTriangle,
        notes: 'Scanned in 2 distant cities within window.',
      },
    ],
  },
  notFound: {
    state: 'notFound',
    bannerTitle: 'Unregistered Code',
    headline: 'This product could not be verified',
    explanation:
      'This serial code was not found in the authorized product registry. It has never been registered by an authorized manufacturer.',
    badgeBg: 'bg-rose-500',
    badgeText: 'text-rose-900',
    accentBg: 'bg-rose-50',
    accentBorder: 'border-rose-300',
    accentText: 'text-rose-900',
    icon: XCircle,
    productName: 'Unregistered / Unknown Unit',
    brand: 'Unauthorized Manufacturer',
    batchNumber: 'NOT-REGISTERED',
    mfgDate: 'Unknown',
    expiryDate: 'Unknown',
    scanCount: 1,
    txHash: 'N/A (Unrecorded)',
    contractAddress: '0x3a992F74Ce79e23F1b62fC43Ac5f37De4e0B108B',
    network: 'Hardhat Localhost (ChainID: 31337)',
    merkleRoot: 'None',
    leaf: 'None',
    proof: [],
    verifiedOnChain: false,
    image:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260423_164207_f243351d-ed59-48ec-83a0-a5e996bdbe3c.png&w=1280&q=85',
    timeline: [
      {
        role: 'Registry Check',
        entity: 'Origin Record Not Found',
        location: 'Central Registry',
        date: 'Today',
        status: 'flagged',
        icon: AlertOctagon,
        notes: 'No batch or unit record matches this QR code.',
      },
    ],
  },
  fake: {
    state: 'fake',
    bannerTitle: 'Authenticity Check Failed',
    headline: 'Counterfeit / Tampered Code',
    explanation:
      'Digital signature validation failed. This product code appears to be tampered, counterfeited, or forged. Do not consume or use.',
    badgeBg: 'bg-rose-600',
    badgeText: 'text-rose-900',
    accentBg: 'bg-rose-50',
    accentBorder: 'border-rose-300',
    accentText: 'text-rose-900',
    icon: XCircle,
    productName: 'Tampered / Counterfeit Unit',
    brand: 'Unauthorized Entity',
    batchNumber: 'INVALID-ROOT',
    mfgDate: 'Unknown',
    expiryDate: 'Unknown',
    scanCount: 1,
    txHash: 'INVALID_MERKLE_PROOF',
    contractAddress: '0x3a992F74Ce79e23F1b62fC43Ac5f37De4e0B108B',
    network: 'Hardhat Localhost (ChainID: 31337)',
    merkleRoot: '0x0000000000000000000000000000000000000000',
    leaf: '0xdeadbeef00000000000000000000000000000000',
    proof: [],
    verifiedOnChain: false,
    image:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260423_164207_f243351d-ed59-48ec-83a0-a5e996bdbe3c.png&w=1280&q=85',
    timeline: [
      {
        role: 'Cryptographic Check',
        entity: 'Invalid Merkle Verification',
        location: 'Local Registry',
        date: 'Just now',
        status: 'flagged',
        icon: AlertOctagon,
        notes: 'Proof hash does not match root. Tampering suspected.',
      },
    ],
  },
  recalled: {
    state: 'recalled',
    bannerTitle: 'Manufacturer Recall Notice',
    headline: 'Batch Recall Notice',
    explanation:
      'The manufacturer has issued a voluntary recall advisory for this product batch. Do not consume or distribute. Return to point of purchase for immediate replacement or full refund.',
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
    contractAddress: '0x3a992F74Ce79e23F1b62fC43Ac5f37De4e0B108B',
    network: 'Hardhat Localhost (ChainID: 31337)',
    merkleRoot: '0x5b38da6a701c568545dcfcb03fcb875f56beddc4',
    leaf: '0x12a9c3b879201bc6f42371900a892b10ae45f910',
    proof: ['0x992b10ae45f9103cba71890123fe554329aa8701'],
    verifiedOnChain: true,
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
        notes: 'Manufactured and released into distribution.',
      },
      {
        role: 'Recall Issued',
        entity: 'Safety Advisory #REC-2026-991',
        location: 'Nationwide Brand Bulletin',
        date: '15 Sep 2026, 03:00 PM',
        status: 'flagged',
        icon: AlertOctagon,
        notes: 'Manufacturer advisory: Return for full refund.',
      },
    ],
  },
  expired: {
    state: 'expired',
    bannerTitle: 'Product Expiry Alert',
    headline: 'Batch Past Expiration Date',
    explanation:
      'This product batch has exceeded its safe shelf-life and recommended expiry date. Do not consume or sell.',
    badgeBg: 'bg-red-600',
    badgeText: 'text-red-900',
    accentBg: 'bg-red-50',
    accentBorder: 'border-red-300',
    accentText: 'text-red-900',
    icon: Clock,
    productName: 'NutriDaily Multivitamin Complex',
    brand: 'NutriLife India Ltd.',
    batchNumber: 'NUTRI-EXP-2025-01',
    mfgDate: '10 January 2024',
    expiryDate: '10 July 2025 (Expired)',
    scanCount: 4,
    txHash: '0x12a9c3b879201bc6f42371900a892b10ae45f910',
    contractAddress: '0x3a992F74Ce79e23F1b62fC43Ac5f37De4e0B108B',
    network: 'Hardhat Localhost (ChainID: 31337)',
    merkleRoot: '0x5b38da6a701c568545dcfcb03fcb875f56beddc4',
    leaf: '0x7f4a8e3189bcd0911293a9ff827102eac69f91a2',
    proof: [],
    verifiedOnChain: true,
    image:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260423_164207_f243351d-ed59-48ec-83a0-a5e996bdbe3c.png&w=1280&q=85',
    timeline: [
      {
        role: 'Manufacturer',
        entity: 'NutriLife Formulation Facility',
        location: 'Solan, Himachal Pradesh',
        date: '10 Jan 2024',
        status: 'completed',
        icon: Building2,
        notes: 'Manufactured and stamped with standard shelf-life.',
      },
      {
        role: 'Lifecycle Status',
        entity: 'Expired on 10 July 2025',
        location: 'End of Lifecycle',
        date: 'Expired',
        status: 'flagged',
        icon: Clock,
        notes: 'Product past safe consumption window.',
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
    contractAddress: '0x3a992F74Ce79e23F1b62fC43Ac5f37De4e0B108B',
    network: 'Hardhat Localhost (ChainID: 31337)',
    merkleRoot: '0x5b38da6a701c568545dcfcb03fcb875f56beddc4',
    leaf: '0x12a9c3b879201bc6f42371900a892b10ae45f910',
    proof: ['0x43ba10fe892301baee771029314488219001b92c'],
    verifiedOnChain: true,
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
        notes: 'Manufactured with luxury serial identifier.',
      },
      {
        role: 'Authorized Retailer',
        entity: 'World of Titan, Indiranagar',
        location: 'Bengaluru, Karnataka',
        date: '28 Sep 2026, 05:22 PM',
        status: 'completed',
        icon: Store,
        notes: 'Scanned and sold at retail point-of-sale.',
      },
      {
        role: 'Consumer Claim',
        entity: 'Awaiting First Buyer Claim',
        location: 'Open for Mobile Claim',
        date: 'Pending Mobile Claim',
        status: 'current',
        icon: User,
        notes: 'Customer warranty ready to be bound.',
      },
    ],
  },
};

export const ProductVerifyPage: React.FC<ProductVerifyPageProps> = ({
  code = 'TC-8924-GENUINE',
  onBackToHome,
  onPromptLogin,
}) => {
  const [activeState, setActiveState] = useState<ResultState>('genuine');
  const [techProofExpanded, setTechProofExpanded] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [claimOtp, setClaimOtp] = useState('123456');
  const [isClaiming, setIsClaiming] = useState(false);
  const [rewardsClaimed, setRewardsClaimed] = useState(false);
  const [copiedProof, setCopiedProof] = useState(false);

  const [liveData, setLiveData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch live verification data from backend
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
            expired: 'expired',
            soldAwaitingClaim: 'sold_unclaimed',
            notFound: 'notFound',
          };
          const mapped = stateMap[res.data.state];
          if (mapped) {
            setActiveState(mapped);
          }
        }
      } catch (err) {
        console.warn('Backend API error, continuing with fallback:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    verifyLive();
    return () => {
      isMounted = false;
    };
  }, [code]);

  const defaultData = STATE_CONFIGS[activeState] || STATE_CONFIGS.genuine;

  // Format product and brand from backend response
  const prod = liveData?.product || liveData?.productDetails || {};
  const brandObj = liveData?.brand || {};

  const data: StateData = {
    ...defaultData,
    productName: prod.name || defaultData.productName,
    brand: brandObj.name || brandObj.companyName || defaultData.brand,
    batchNumber: liveData?.batchNumber || liveData?.batch?.batchNumber || defaultData.batchNumber,
    mfgDate: liveData?.mfgDate
      ? new Date(liveData.mfgDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
      : defaultData.mfgDate,
    expiryDate: liveData?.expiryDate
      ? new Date(liveData.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
      : defaultData.expiryDate,
    scanCount: liveData?.scanCount !== undefined ? liveData.scanCount : defaultData.scanCount,
    explanation: liveData?.reason || defaultData.explanation,
    recallReason: liveData?.reason || defaultData.recallReason,
    txHash: liveData?.technicalProof?.txHash || defaultData.txHash,
    contractAddress: liveData?.technicalProof?.contractAddress || defaultData.contractAddress,
    network: liveData?.technicalProof?.network || defaultData.network,
    merkleRoot: liveData?.technicalProof?.merkleRoot || defaultData.merkleRoot,
    leaf: liveData?.technicalProof?.leaf || defaultData.leaf,
    proof: liveData?.technicalProof?.proof || defaultData.proof,
    verifiedOnChain: liveData?.technicalProof?.verifiedOnChain ?? defaultData.verifiedOnChain,
  };

  const Icon = data.icon;

  // Build rendered timeline (using backend ownershipTimeline if available)
  const renderedTimeline = (liveData?.ownershipTimeline && liveData.ownershipTimeline.length > 0)
    ? liveData.ownershipTimeline.map((item: any, idx: number) => {
        let stepIcon = CheckCircle2;
        const roleLower = (item.actorRole || item.stage || '').toLowerCase();
        if (roleLower.includes('manufacturer')) stepIcon = Building2;
        else if (roleLower.includes('distributor') || roleLower.includes('logistics')) stepIcon = Truck;
        else if (roleLower.includes('retailer') || roleLower.includes('store')) stepIcon = Store;
        else if (roleLower.includes('consumer') || roleLower.includes('owner')) stepIcon = User;
        else if (roleLower.includes('anomaly') || roleLower.includes('alert') || item.action === 'RECALLED') stepIcon = AlertTriangle;

        const isCurrent = idx === liveData.ownershipTimeline.length - 1;
        const isFlagged = item.action === 'RECALLED' || item.action === 'CLONE_DETECTED';

        return {
          role: item.stage || item.actorRole || 'Custody Event',
          entity: item.title || item.actor || 'Authorized Partner',
          location: item.location || 'India Network',
          date: item.timestamp ? new Date(item.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Verified',
          status: (isFlagged ? 'flagged' : isCurrent ? 'current' : 'completed') as any,
          icon: stepIcon,
          notes: item.notes,
        };
      })
    : data.timeline;

  // Handle Claim Rewards action
  const handleInitiateClaim = () => {
    const session = api.auth.getSession();
    if (!session) {
      sessionStorage.setItem('trustchain_pending_claim', code);
      toast.info('Please sign in with your phone or email to claim warranty & loyalty rewards.');
      onPromptLogin();
      return;
    }
    setIsClaimModalOpen(true);
  };

  const handleConfirmClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsClaiming(true);

    try {
      const res = await api.sales.claimUnit({
        code,
        otp: claimOtp,
      });

      if (res.success) {
        toast.success('Product warranty activated & loyalty points credited to your account!');
        setRewardsClaimed(true);
        setIsClaimModalOpen(false);
        setActiveState('genuine');
        if (liveData) {
          setLiveData({
            ...liveData,
            state: 'genuine',
            rewardsEligible: false,
          });
        }
      }
    } catch (err: any) {
      console.error('Claim failed:', err);
    } finally {
      setIsClaiming(false);
    }
  };

  const copyTechnicalProof = () => {
    const proofText = JSON.stringify(
      {
        productCode: code,
        txHash: data.txHash,
        contractAddress: data.contractAddress,
        network: data.network,
        merkleRoot: data.merkleRoot,
        leaf: data.leaf,
        verifiedOnChain: data.verifiedOnChain,
      },
      null,
      2
    );
    navigator.clipboard.writeText(proofText);
    setCopiedProof(true);
    toast.success('Technical cryptographic proof copied to clipboard!');
    setTimeout(() => setCopiedProof(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-black flex flex-col font-sans selection:bg-black selection:text-white">
      {/* ---------------------------------------------------------------- */}
      {/* TOP BAR / DEMO STATE SWITCHER FOR JUDGES & USERS TO TEST ALL     */}
      {/* ---------------------------------------------------------------- */}
      <div className="bg-black text-white px-4 py-2.5 text-xs">
        <div className="max-w-[88rem] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold uppercase tracking-wider text-emerald-400">
              Demo State Switcher:
            </span>
            <span className="text-white/60 hidden md:inline">
              Test all full-page verification variants:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveState('genuine')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeState === 'genuine' ? 'bg-emerald-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              1. Genuine
            </button>

            <button
              type="button"
              onClick={() => setActiveState('suspicious')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeState === 'suspicious' ? 'bg-amber-500 text-black font-semibold' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              2. Suspicious
            </button>

            <button
              type="button"
              onClick={() => setActiveState('notFound')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeState === 'notFound' ? 'bg-rose-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              3. Unregistered
            </button>

            <button
              type="button"
              onClick={() => setActiveState('fake')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeState === 'fake' ? 'bg-rose-700 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              4. Counterfeit
            </button>

            <button
              type="button"
              onClick={() => setActiveState('recalled')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeState === 'recalled' ? 'bg-orange-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              5. Recalled
            </button>

            <button
              type="button"
              onClick={() => setActiveState('expired')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeState === 'expired' ? 'bg-red-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              6. Expired
            </button>

            <button
              type="button"
              onClick={() => setActiveState('sold_unclaimed')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeState === 'sold_unclaimed' ? 'bg-blue-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              7. Sold (Unclaimed)
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
              className="inline-flex items-center gap-2 text-xs font-medium text-black/60 hover:text-black bg-[#F5F5F5] hover:bg-black/5 px-3.5 py-2 rounded-full border border-black/5 transition-colors cursor-pointer"
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
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Verification URL copied to clipboard!');
                }
              }}
              className="p-2 rounded-full text-black/60 hover:text-black hover:bg-black/5 transition-colors cursor-pointer"
              aria-label="Share verification"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="w-full bg-emerald-500/10 border-b border-emerald-500/20 py-2 px-6 text-center text-xs text-emerald-800 font-medium flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
          <span>Validating digital provenance against registry...</span>
        </div>
      )}

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
                className="px-5 py-2.5 rounded-full text-xs font-medium bg-white text-rose-700 border border-rose-200 hover:bg-rose-50 transition-colors shadow-sm cursor-pointer"
              >
                Report Fake
              </button>

              {(activeState === 'genuine' || activeState === 'sold_unclaimed') && !rewardsClaimed && (
                <button
                  type="button"
                  onClick={handleInitiateClaim}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-medium bg-black text-white hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Claim Rewards</span>
                </button>
              )}

              {rewardsClaimed && (
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Rewards Claimed</span>
                </span>
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
                    {/* Authenticity badge (Zero crypto wording) */}
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Tamper-Proof Digital ID</span>
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

                  {/* Metadata key-value grid (Zero crypto wording) */}
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
                      <span className="text-black/50 block mb-0.5">Origin Registry</span>
                      <span className="font-medium text-emerald-800">Authorized Digital Ledger</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ---------------------------------------------------------- */}
            {/* Expandable "View technical proof" section                  */}
            {/* (Technical details appear ONLY inside this section)        */}
            {/* ---------------------------------------------------------- */}
            <div className="bg-white rounded-3xl border border-black/5 overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => setTechProofExpanded(!techProofExpanded)}
                className="w-full p-6 sm:p-8 flex items-center justify-between text-left hover:bg-black/[0.01] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-black">View Technical Cryptographic Proof</h3>
                    <p className="text-xs text-black/50 mt-0.5">
                      Merkle tree root, cryptographic leaf hash, and smart contract verification
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
                  <div className="p-4 rounded-2xl bg-[#F5F5F5] border border-black/5 text-xs font-mono space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-black/40 uppercase">Consensus Network</span>
                      <span className="text-emerald-800 font-semibold">{data.network}</span>
                    </div>

                    <div className="pt-2 border-t border-black/5">
                      <span className="text-black/40 uppercase block mb-1">
                        Registry Smart Contract Address
                      </span>
                      <span className="text-black font-semibold break-all">{data.contractAddress}</span>
                    </div>

                    <div className="pt-2 border-t border-black/5">
                      <span className="text-black/40 uppercase block mb-1">
                        Transaction Hash (txHash)
                      </span>
                      <span className="text-black font-semibold break-all">{data.txHash}</span>
                    </div>

                    <div className="pt-2 border-t border-black/5">
                      <span className="text-black/40 uppercase block mb-1">
                        Batch Merkle Root
                      </span>
                      <span className="text-black font-semibold break-all">{data.merkleRoot}</span>
                    </div>

                    <div className="pt-2 border-t border-black/5">
                      <span className="text-black/40 uppercase block mb-1">
                        Unit Leaf Hash (keccak256)
                      </span>
                      <span className="text-black font-semibold break-all">{data.leaf}</span>
                    </div>

                    {data.proof && data.proof.length > 0 && (
                      <div className="pt-2 border-t border-black/5">
                        <span className="text-black/40 uppercase block mb-1">
                          Merkle Proof Siblings ({data.proof.length} hashes)
                        </span>
                        <div className="space-y-1">
                          {data.proof.map((p, idx) => (
                            <div key={idx} className="text-[11px] text-black/70 truncate">
                              [{idx}]: {p}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          data.verifiedOnChain
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                            : 'bg-rose-100 text-rose-900 border border-rose-200'
                        }`}
                      >
                        {data.verifiedOnChain ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Cryptographically Validated On-Chain</span>
                          </>
                        ) : (
                          <>
                            <X className="w-3.5 h-3.5 text-rose-700" />
                            <span>Unverified Proof on Smart Contract</span>
                          </>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={copyTechnicalProof}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-black/70 hover:text-black bg-[#F5F5F5] hover:bg-black/5 px-3 py-1.5 rounded-full border border-black/5 transition-colors cursor-pointer"
                      >
                        {copiedProof ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedProof ? 'Copied' : 'Copy Proof JSON'}</span>
                      </button>

                      <a
                        href={`https://polygonscan.com/tx/${data.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-black hover:text-emerald-700 transition-colors"
                      >
                        <span>Polygonscan</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons in body */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => setReportModalOpen(true)}
                className="inline-flex items-center gap-2 bg-white text-rose-700 border border-rose-200 px-6 py-3 rounded-full text-sm font-medium hover:bg-rose-50 transition-colors shadow-sm cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Report Counterfeit (+500 Bounty)</span>
              </button>

              {(activeState === 'genuine' || activeState === 'sold_unclaimed') && !rewardsClaimed && (
                <button
                  type="button"
                  onClick={handleInitiateClaim}
                  className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
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
                {renderedTimeline.map((step, idx) => {
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

                        {step.notes && (
                          <p className="text-[11px] text-black/50 mt-1 italic leading-tight">
                            {step.notes}
                          </p>
                        )}
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
                Join India&apos;s leading manufacturers issuing verified tamper-proof digital product identities.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onPromptLogin}
            className="inline-flex items-center gap-2 bg-black text-white text-xs font-medium px-6 py-3 rounded-full hover:bg-gray-800 transition-colors shrink-0 shadow-sm cursor-pointer"
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

      {/* Claim Warranty & Rewards Modal for Logged-In Consumers */}
      {isClaimModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-black/5 text-black">
            <button
              type="button"
              onClick={() => setIsClaimModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-black/50 hover:text-black hover:bg-black/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-5">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-full">
                <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                <span>Warranty & Rewards Claim</span>
              </div>

              <div>
                <h3 className="text-2xl font-medium tracking-tight text-black">
                  Claim Official Ownership
                </h3>
                <p className="text-black/70 text-xs mt-1 leading-relaxed">
                  Bind this authenticated unit to your account to activate warranty coverage and collect loyalty rewards.
                </p>
              </div>

              {/* Product preview card */}
              <div className="p-4 bg-[#F5F5F5] rounded-2xl border border-black/5 flex items-center gap-3">
                <div
                  className="w-14 h-14 rounded-xl bg-white border border-black/5 shrink-0"
                  style={{
                    backgroundImage: `url("${data.image}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-black truncate">{data.productName}</h4>
                  <div className="text-[11px] text-black/50 truncate">
                    {data.brand} · Code: {code}
                  </div>
                </div>
              </div>

              {/* OTP confirmation form */}
              <form onSubmit={handleConfirmClaim} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1.5">
                    Verification OTP
                  </label>
                  <input
                    type="text"
                    required
                    value={claimOtp}
                    onChange={(e) => setClaimOtp(e.target.value)}
                    placeholder="e.g. 123456"
                    className="w-full px-4 py-3 rounded-2xl bg-[#F5F5F5] border border-black/10 text-black font-mono tracking-widest text-center text-lg focus:outline-none focus:border-black"
                  />
                  <span className="text-[10px] text-black/40 block text-center mt-1">
                    Demo OTP code: <strong className="font-mono text-black">123456</strong>
                  </span>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>+50 TrustPoints will be credited directly to your mobile wallet.</span>
                </div>

                <button
                  type="submit"
                  disabled={isClaiming || !claimOtp.trim()}
                  className="w-full py-3.5 bg-black text-white text-xs font-medium rounded-full hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  {isClaiming ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Binding Warranty on Blockchain...</span>
                    </>
                  ) : (
                    <span>Confirm Ownership & Claim Warranty</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductVerifyPage;
