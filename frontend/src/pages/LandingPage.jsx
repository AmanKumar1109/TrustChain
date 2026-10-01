import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/hero/HeroSection';
import PartnersBar from '../components/layout/PartnersBar';

// Spotlight & Hackathon Sections
import PhoneShowcaseSection from '../components/sections/PhoneShowcaseSection';

// Supporting Hackathon Sections
import ProblemSection from '../components/sections/ProblemSection';
import HowItWorksSection from '../components/sections/HowItWorksSection';
import Web3InvisibleSection from '../components/sections/Web3InvisibleSection';
import WhyBlockchainSection from '../components/sections/WhyBlockchainSection';
import RoleTabsSection from '../components/sections/RoleTabsSection';
import FraudIntelligenceSection from '../components/sections/FraudIntelligenceSection';
import LiveStatsSection from '../components/sections/LiveStatsSection';
import RewardsPreviewSection from '../components/sections/RewardsPreviewSection';
import PricingSection from '../components/sections/PricingSection';
import FaqSection from '../components/sections/FaqSection';
import Footer from '../components/layout/Footer';

// Interactive Modals
import QrScannerModal from '../components/modals/QrScannerModal';
import VerificationResultModal from '../components/modals/VerificationResultModal';
import AuthModal from '../components/modals/AuthModal';

export default function LandingPage() {
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [authModalState, setAuthModalState] = useState({ isOpen: false, role: 'brand' });

  const handleOpenAuth = (role = 'brand') => {
    setAuthModalState({ isOpen: true, role });
  };

  const handleCloseAuth = () => {
    setAuthModalState({ isOpen: false, role: 'brand' });
  };

  return (
    <div className="min-h-screen w-full bg-[#07080a] text-zinc-100 flex flex-col font-sans selection:bg-white/20 selection:text-white relative overflow-x-hidden">
      
      {/* ======================================================== */}
      {/* 1. NAVBAR & HERO SECTION (Exact Reference Panel 1)       */}
      {/* ======================================================== */}
      <div className="relative w-full flex flex-col justify-between min-h-screen">
        {/* Top Navbar */}
        <Navbar
          onOpenVerify={() => setIsQrScannerOpen(true)}
          onOpenAuth={handleOpenAuth}
        />

        {/* Centered Hero: Orbit Nodes, Play button, Spark pill, Heading, CTAs, Laser Beams, Quick Verify, Bottom Controls */}
        <HeroSection
          onOpenVerify={() => setIsQrScannerOpen(true)}
          onOpenAuth={handleOpenAuth}
          onVerifyResult={(result) => setVerificationResult(result)}
        />

        {/* Partner Ecosystem Logos along the bottom */}
        <PartnersBar />
      </div>



      {/* ======================================================== */}
      {/* 4. PHONE MOCKUP SPOTLIGHT (Item #2 Requirement)          */}
      {/* ======================================================== */}
      <PhoneShowcaseSection
        onOpenVerify={() => setIsQrScannerOpen(true)}
      />

      {/* ======================================================== */}
      {/* 5. PROBLEM SECTION (Item #4: ₹1 Lakh Cr Stat, 4 Sectors)  */}
      {/* ======================================================== */}
      <ProblemSection />

      {/* ======================================================== */}
      {/* 6. HOW IT WORKS (Item #5: 5-Step Animated Flow)          */}
      {/* ======================================================== */}
      <HowItWorksSection
        onOpenVerify={() => setIsQrScannerOpen(true)}
      />

      {/* ======================================================== */}
      {/* 7. WEB3 YOU NEVER SEE (Item #6: No Wallet, Zero Gas, OTP)*/}
      {/* ======================================================== */}
      <Web3InvisibleSection />

      {/* ======================================================== */}
      {/* 8. WHY BLOCKCHAIN? (Item #7: Tamper-proof, Immutability) */}
      {/* ======================================================== */}
      <WhyBlockchainSection />

      {/* ======================================================== */}
      {/* 9. ROLE TABS (Item #8: Brands, Retailers, Consumers)     */}
      {/* ======================================================== */}
      <RoleTabsSection
        onOpenAuth={handleOpenAuth}
      />

      {/* ======================================================== */}
      {/* 10. FRAUD INTELLIGENCE (Item #9: Hotspot Radar Map)      */}
      {/* ======================================================== */}
      <FraudIntelligenceSection />

      {/* ======================================================== */}
      {/* 11. LIVE STATS (Item #10: Products Verified, Fakes)      */}
      {/* ======================================================== */}
      <LiveStatsSection />

      {/* ======================================================== */}
      {/* 12. REWARDS PREVIEW (Item #11: Points, Streaks, Redeem)  */}
      {/* ======================================================== */}
      <RewardsPreviewSection
        onOpenAuth={handleOpenAuth}
      />

      {/* ======================================================== */}
      {/* 13. PRICING IN INR (Item #12: Starter, Growth, Enterprise)*/}
      {/* ======================================================== */}
      <PricingSection
        onOpenAuth={handleOpenAuth}
      />

      {/* ======================================================== */}
      {/* 14. FAQ ACCORDION (Item #13: QR cloning, Gas fees, etc.) */}
      {/* ======================================================== */}
      <FaqSection />

      {/* ======================================================== */}
      {/* 15. FOOTER (Item #14: Legal, Social, Team, Hackathon)    */}
      {/* ======================================================== */}
      <Footer
        onOpenAuth={handleOpenAuth}
      />

      {/* Interactive Modals */}
      <QrScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        onSelectResult={(result) => setVerificationResult(result)}
      />

      <VerificationResultModal
        result={verificationResult}
        onClose={() => setVerificationResult(null)}
      />

      <AuthModal
        isOpen={authModalState.isOpen}
        role={authModalState.role}
        onClose={handleCloseAuth}
      />

    </div>
  );
}
