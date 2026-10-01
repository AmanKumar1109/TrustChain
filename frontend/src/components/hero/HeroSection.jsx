import React, { useState } from 'react';
import BackgroundGlow from './BackgroundGlow';
import OrbitNodes from './OrbitNodes';
import HeroHeading from './HeroHeading';
import HeroControls from './HeroControls';
import VideoModal from '../modals/VideoModal';

export default function HeroSection({ onOpenVerify, onOpenAuth, onVerifyResult }) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section className="relative w-full flex-1 flex flex-col justify-between overflow-hidden min-h-[620px] lg:min-h-[720px] pt-4 pb-6">
      {/* Dynamic Background Glows & Particles with Shining Corners */}
      <BackgroundGlow />

      {/* Orbit Network Nodes & Connecting Circuit Lines */}
      <OrbitNodes />

      {/* Center Hero Content (Play, Spark, Heading, CTAs, Beams, Quick Verify) */}
      <div className="relative z-20 flex-1 flex items-center justify-center my-4">
        <HeroHeading
          onOpenVideo={() => setIsVideoOpen(true)}
          onOpenVerify={onOpenVerify}
          onOpenAuth={onOpenAuth}
          onVerifyResult={onVerifyResult}
        />
      </div>

      {/* Bottom Sub-Controls: Scroll Down & DeFi horizons indicator */}
      <div className="relative z-20 pt-8 pb-2">
        <HeroControls />
      </div>

      {/* Video Modal */}
      <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
    </section>
  );
}
