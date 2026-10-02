import React, { useState } from 'react';
import {
  ConsumerTab,
  ClaimedProduct,
  RewardOffer,
  UserReport,
  ScanHistoryRecord,
} from './types';
import { ConsumerBottomNav } from './components/ConsumerBottomNav';
import { ScannerModal } from './components/ScannerModal';
import { ClaimProductModal } from './components/ClaimProductModal';
import { TransferUserModal } from './components/TransferUserModal';
import { ReportFakeFormModal } from './components/ReportFakeFormModal';
import { OfferDetailModal } from './components/OfferDetailModal';

// Screens
import { ConsumerHomeScreen } from './screens/ConsumerHomeScreen';
import { MyProductsScreen } from './screens/MyProductsScreen';
import { ConsumerRewardsScreen } from './screens/ConsumerRewardsScreen';
import { RewardsStoreScreen } from './screens/RewardsStoreScreen';
import { MyReportsScreen } from './screens/MyReportsScreen';
import { ConsumerHistoryScreen } from './screens/ConsumerHistoryScreen';
import { ConsumerProfileScreen } from './screens/ConsumerProfileScreen';

import {
  ShieldCheck,
  ArrowLeft,
  QrCode,
  Flame,
  Gift,
  Coins,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { LogoIcon } from '../../components/common/LogoIcon';

interface ConsumerAppProps {
  onNavigateHome?: () => void;
  onNavigateToVerify?: (code: string) => void;
}

export const ConsumerApp: React.FC<ConsumerAppProps> = ({
  onNavigateHome,
  onNavigateToVerify,
}) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<ConsumerTab>('home');
  const [activeSubView, setActiveSubView] = useState<'none' | 'rewards_store' | 'my_reports'>('none');

  // Modals
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferTargetProduct, setTransferTargetProduct] = useState<ClaimedProduct | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<RewardOffer | null>(null);

  // User State
  const [pointsBalance, setPointsBalance] = useState(1420);
  const [streakCount, setStreakCount] = useState(5);
  const userPhone = '+91 98765 43210';
  const referralCode = 'TRUST-VIP-994';

  // Mock Products Data
  const [products, setProducts] = useState<ClaimedProduct[]>([
    {
      id: 'prod-1',
      name: 'Cipla Asthalin Inhaler 100mcg',
      brand: 'Cipla Ltd',
      batchNumber: 'BATCH-2026-DEL99',
      serialNumber: 'CIP-AST-88219-IND',
      category: 'Pharmaceuticals',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
      status: 'Claimed',
      claimedDate: '28 Sep 2026',
      warrantyValidUntil: '28 Sep 2027',
      purchaseProof: {
        retailerName: 'Apollo Pharmacy, Indiranagar',
        invoiceNumber: 'INV-2026-AP-9921',
        purchaseDate: '28 Sep 2026',
        amountPaid: '₹185.00',
      },
      ownershipHistory: [
        { role: 'Manufacturer', name: 'Cipla Plant 4', location: 'Goa, India', date: '12 Jan 2026' },
        { role: 'Distributor', name: 'MedEx Logistics Hub', location: 'Mumbai Central', date: '04 Feb 2026' },
        { role: 'Retailer', name: 'Apollo Pharmacy Store #12', location: 'Bengaluru, KA', date: '18 Feb 2026' },
        { role: 'Owner', name: 'Consumer (+91 98765 43210)', location: 'Bengaluru, KA', date: '28 Sep 2026' },
      ],
    },
    {
      id: 'prod-2',
      name: 'Sony WH-1000XM5 Wireless Headphones',
      brand: 'Sony India',
      batchNumber: 'SNY-BATCH-9941',
      serialNumber: 'SNY-WH-4481029',
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
      status: 'Claimed',
      claimedDate: '15 Aug 2026',
      warrantyValidUntil: '15 Aug 2028',
      purchaseProof: {
        retailerName: 'Croma Electronics Mega Store',
        invoiceNumber: 'CRM-BLR-004928',
        purchaseDate: '15 Aug 2026',
        amountPaid: '₹29,990.00',
      },
      ownershipHistory: [
        { role: 'Manufacturer', name: 'Sony Electronics India', location: 'Sri City, AP', date: '01 Jun 2026' },
        { role: 'Distributor', name: 'Apex Tech Distro', location: 'Bengaluru Hub', date: '20 Jun 2026' },
        { role: 'Retailer', name: 'Croma Retail', location: 'Koramangala, BLR', date: '10 Jul 2026' },
        { role: 'Owner', name: 'Consumer (+91 98765 43210)', location: 'Bengaluru, KA', date: '15 Aug 2026' },
      ],
    },
    {
      id: 'prod-3',
      name: 'Himalaya Purifying Neem Face Wash 200ml',
      brand: 'The Himalaya Drug Company',
      batchNumber: 'HIM-NEEM-7721',
      serialNumber: 'HIM-7721-00918',
      category: 'Cosmetics',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80',
      status: 'Pending Claim',
      claimedDate: 'Awaiting Claim',
      warrantyValidUntil: '31 Dec 2027',
      purchaseProof: {
        retailerName: 'Wellness Forever Chemists',
        invoiceNumber: 'WF-MUM-88192',
        purchaseDate: 'Yesterday',
        amountPaid: '₹240.00',
      },
      ownershipHistory: [
        { role: 'Manufacturer', name: 'Himalaya Wellness Unit 2', location: 'Bengaluru, KA', date: '10 Mar 2026' },
        { role: 'Distributor', name: 'National Pharma Distro', location: 'Thane, MH', date: '02 Apr 2026' },
        { role: 'Retailer', name: 'Wellness Forever Chemist', location: 'Bandra, Mumbai', date: '20 Apr 2026' },
      ],
    },
  ]);

  // Mock Rewards Offers
  const [offers] = useState<RewardOffer[]>([
    {
      id: 'off-1',
      brandName: 'Tata 1mg',
      brandLogo: '1mg',
      title: 'Flat 25% Off Prescription Medicines',
      discountText: 'Save up to ₹500 on all genuine lab tests & meds',
      pointsCost: 250,
      expiryDate: '30 Nov 2026',
      category: 'Pharmacy',
      couponCode: 'TRUST-1MG-SAVE25',
      terms: 'Valid on orders above ₹800. Applicable on verified partner stores across India.',
    },
    {
      id: 'off-2',
      brandName: 'Sony India',
      brandLogo: 'SONY',
      title: '₹2,500 Off Audio & Premium Sound',
      discountText: 'Instant discount voucher on XM5 & LinkBuds series',
      pointsCost: 600,
      expiryDate: '31 Dec 2026',
      category: 'Electronics',
      couponCode: 'SONY-TRUST-AUDIO25',
      terms: 'Redeemable on Sony Center official online portal or flagship stores.',
    },
    {
      id: 'off-3',
      brandName: 'Cult.fit',
      brandLogo: 'CULT',
      title: '1 Month Free CultPass Elite Access',
      discountText: 'Unlimited gym & live group workouts',
      pointsCost: 450,
      expiryDate: '15 Nov 2026',
      category: 'Apparel',
      couponCode: 'CULT-ELITE-30DAYS',
      terms: 'Applicable for new and existing users. Non-transferable.',
    },
    {
      id: 'off-4',
      brandName: 'Apollo Pharmacy',
      brandLogo: 'APOLLO',
      title: 'Flat ₹150 Cashback on Vitamin Packs',
      discountText: 'Zero minimum spend on authenticated wellness items',
      pointsCost: 180,
      expiryDate: '31 Oct 2026',
      category: 'Pharmacy',
      couponCode: 'APOLLO-WELL-150',
      terms: 'Scan barcode in-store or apply code on Apollo 24/7 app.',
    },
  ]);

  // Mock Reports
  const [reports, setReports] = useState<UserReport[]>([
    {
      id: 'rep-1',
      reportId: 'REP-9021',
      productName: 'Suspected Fake Cough Syrup (Batch #CS-881)',
      shopName: 'Metro Life Chemist',
      location: 'Chandni Chowk, Delhi',
      reportedDate: '21 Sep 2026',
      status: 'Valid',
      comment: 'QR code had blurred printing, cap seal was previously broken.',
      bonusPointsEarned: 500,
    },
    {
      id: 'rep-2',
      reportId: 'REP-9044',
      productName: 'Counterfeit Wireless Earbuds (AirPods Pro clone)',
      shopName: 'Gaffar Market Stall 42',
      location: 'Karol Bagh, New Delhi',
      reportedDate: '26 Sep 2026',
      status: 'Under review',
      comment: 'Serial number scanned as duplicate in Mumbai simultaneously.',
    },
  ]);

  // Mock Scan History Records
  const [historyRecords, setHistoryRecords] = useState<ScanHistoryRecord[]>([
    {
      id: 'scan-1',
      code: 'GEN-CIP-9921',
      productName: 'Cipla Asthalin Inhaler 100mcg',
      brand: 'Cipla Ltd',
      timestamp: 'Today, 02:15 PM',
      resultState: 'Genuine',
      pointsAwarded: 50,
    },
    {
      id: 'scan-2',
      code: 'SUSP-AIR-4421',
      productName: 'AirPods Pro 2nd Gen Packaging',
      brand: 'Apple Authorized Vendor',
      timestamp: 'Yesterday, 04:30 PM',
      resultState: 'Suspicious',
      pointsAwarded: 10,
    },
    {
      id: 'scan-3',
      code: 'FAKE-MED-0091',
      productName: 'Paracetamol 650mg Blister Pack',
      brand: 'Unverified Laboratory',
      timestamp: '28 Sep 2026',
      resultState: 'Fake',
      pointsAwarded: 100,
    },
    {
      id: 'scan-4',
      code: 'REC-EXP-3329',
      productName: 'Baby Milk Formula Pro-Bio',
      brand: 'Nestle Nutrition',
      timestamp: '22 Sep 2026',
      resultState: 'Recalled',
      pointsAwarded: 25,
    },
  ]);

  // Handlers
  const handleScanSuccess = (code: string) => {
    setIsScannerOpen(false);
    if (onNavigateToVerify) {
      onNavigateToVerify(code);
    }
  };

  const handleClaimSuccess = () => {
    setIsClaimModalOpen(false);
    setProducts((prev) =>
      prev.map((p) =>
        p.id === 'prod-3'
          ? {
              ...p,
              status: 'Claimed',
              claimedDate: 'Just now',
              ownershipHistory: [
                ...p.ownershipHistory,
                {
                  role: 'Owner',
                  name: `Consumer (${userPhone})`,
                  location: 'Bengaluru, KA',
                  date: 'Today',
                },
              ],
            }
          : p
      )
    );
    setPointsBalance((prev) => prev + 100);
  };

  const handleTransferInitiate = (product: ClaimedProduct) => {
    setTransferTargetProduct(product);
    setIsTransferModalOpen(true);
  };

  const handleTransferComplete = () => {
    setIsTransferModalOpen(false);
    if (transferTargetProduct) {
      setProducts((prev) => prev.filter((p) => p.id !== transferTargetProduct.id));
    }
    setTransferTargetProduct(null);
  };

  const handleReportSubmit = (newReport: any) => {
    setIsReportModalOpen(false);
    setReports((prev) => [
      {
        id: `rep-${Date.now()}`,
        reportId: newReport.reportId,
        productName: newReport.shopName ? `Reported Item @ ${newReport.shopName}` : 'Reported Counterfeit Item',
        shopName: newReport.shopName || 'Physical Retailer',
        location: newReport.location || 'Detected Geo-location',
        reportedDate: 'Just now',
        status: 'Submitted',
        comment: newReport.comment,
      },
      ...prev,
    ]);
  };

  const handleRedeemPoints = (cost: number) => {
    setPointsBalance((prev) => Math.max(0, prev - cost));
  };

  const navItems: { key: ConsumerTab; label: string }[] = [
    { key: 'home', label: 'Home' },
    { key: 'rewards', label: 'Rewards' },
    { key: 'products', label: 'My Products' },
    { key: 'history', label: 'History' },
    { key: 'profile', label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col text-black selection:bg-black selection:text-white">
      {/* ======================================================== */}
      {/* TOP RESPONSIVE NAVBAR (Desktop + Mobile)                 */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-black/10 px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Brand & Title */}
          <div className="flex items-center gap-3">
            {activeSubView !== 'none' && (
              <button
                type="button"
                onClick={() => setActiveSubView('none')}
                className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-black mr-1"
                aria-label="Back to main tab"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setActiveSubView('none');
                setActiveTab('home');
              }}
              className="flex items-center gap-2 group text-left cursor-pointer"
            >
              <LogoIcon className="w-7 h-7 text-black transition-transform duration-300 group-hover:rotate-12" />
              <div>
                <span className="text-lg sm:text-xl font-medium tracking-tight text-black block leading-none">
                  TrustChain
                </span>
                <span className="text-[10px] text-black/50 uppercase tracking-wider font-semibold">
                  Consumer Portal
                </span>
              </div>
            </button>
          </div>

          {/* Center: Desktop Navigation Tabs (Visible on md+) */}
          <nav className="hidden md:flex items-center gap-1 bg-[#F5F5F5] p-1 rounded-full border border-black/5">
            {navItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setActiveSubView('none');
                  setActiveTab(item.key);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeTab === item.key && activeSubView === 'none'
                    ? 'bg-black text-white shadow-sm'
                    : 'text-black/60 hover:text-black hover:bg-black/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right: Actions, Balance & Scan Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Points pill on desktop */}
            <div className="hidden sm:flex items-center gap-1.5 bg-[#2B2644] text-white px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm">
              <Coins className="w-3.5 h-3.5 text-amber-300" />
              <span>{pointsBalance} Pts</span>
            </div>

            {/* Scan Streak badge on desktop */}
            <div className="hidden lg:flex items-center gap-1 bg-orange-50 text-orange-800 border border-orange-200 px-2.5 py-1.5 rounded-full text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
              <span>{streakCount}d Streak</span>
            </div>

            {/* Test SMS Claim simulator pill */}
            <button
              type="button"
              onClick={() => setIsClaimModalOpen(true)}
              className="text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors shadow-sm"
              title="Simulate SMS link received by consumer"
            >
              SMS Claim
            </button>

            {/* Scan QR Button */}
            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="bg-black text-white px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold hover:bg-gray-800 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <QrCode className="w-4 h-4" />
              <span className="hidden sm:inline">Scan QR</span>
            </button>

            {/* Back to main landing link on desktop */}
            {onNavigateHome && (
              <button
                type="button"
                onClick={onNavigateHome}
                className="hidden xl:flex items-center gap-1 text-xs text-black/50 hover:text-black transition-colors pl-2"
              >
                <span>Landing</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* MAIN RESPONSIVE CONTENT CONTAINER                       */}
      {/* ======================================================== */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 pb-24 md:pb-12">
        {/* Sub Views */}
        {activeSubView === 'rewards_store' ? (
          <RewardsStoreScreen
            userPoints={pointsBalance}
            offers={offers}
            onSelectOffer={(offer) => setSelectedOffer(offer)}
          />
        ) : activeSubView === 'my_reports' ? (
          <MyReportsScreen
            reports={reports}
            onOpenReportForm={() => setIsReportModalOpen(true)}
          />
        ) : (
          /* Bottom Tabs */
          <>
            {activeTab === 'home' && (
              <ConsumerHomeScreen
                pointsBalance={pointsBalance}
                streakCount={streakCount}
                onOpenScanner={() => setIsScannerOpen(true)}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onOpenReportFake={() => setIsReportModalOpen(true)}
                onOpenRewardsStore={() => setActiveSubView('rewards_store')}
                onOpenSmsClaim={() => setIsClaimModalOpen(true)}
              />
            )}

            {activeTab === 'rewards' && (
              <ConsumerRewardsScreen
                pointsBalance={pointsBalance}
                streakCount={streakCount}
                referralCode={referralCode}
                onOpenRewardsStore={() => setActiveSubView('rewards_store')}
              />
            )}

            {activeTab === 'products' && (
              <MyProductsScreen
                products={products}
                onInitiateTransfer={handleTransferInitiate}
                onOpenSmsClaim={() => setIsClaimModalOpen(true)}
              />
            )}

            {activeTab === 'history' && (
              <ConsumerHistoryScreen
                historyRecords={historyRecords}
                onInspectVerify={(code) => {
                  if (onNavigateToVerify) {
                    onNavigateToVerify(code);
                  }
                }}
              />
            )}

            {activeTab === 'profile' && (
              <ConsumerProfileScreen
                userPhone={userPhone}
                onOpenMyReports={() => setActiveSubView('my_reports')}
                onLogout={onNavigateHome}
              />
            )}
          </>
        )}
      </main>

      {/* ======================================================== */}
      {/* MOBILE-ONLY BOTTOM NAVIGATION BAR (md:hidden)            */}
      {/* ======================================================== */}
      <ConsumerBottomNav
        currentTab={activeTab}
        onSelectTab={(tab) => {
          setActiveSubView('none');
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenScanner={() => setIsScannerOpen(true)}
      />

      {/* ======================================================== */}
      {/* GLOBAL MODALS                                            */}
      {/* ======================================================== */}
      <ScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />

      <ClaimProductModal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        onClaimSuccess={handleClaimSuccess}
      />

      <TransferUserModal
        isOpen={isTransferModalOpen}
        onClose={() => {
          setIsTransferModalOpen(false);
          setTransferTargetProduct(null);
        }}
        product={transferTargetProduct}
        onTransferComplete={handleTransferComplete}
      />

      <ReportFakeFormModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitSuccess={handleReportSubmit}
      />

      <OfferDetailModal
        offer={selectedOffer}
        onClose={() => setSelectedOffer(null)}
        userPoints={pointsBalance}
        onRedeemConfirm={handleRedeemPoints}
      />
    </div>
  );
};

export default ConsumerApp;
