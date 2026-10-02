import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, QrCode, Sparkles, Building2 } from 'lucide-react';
import { HERO_BRANDS } from '../../constants/brands';
import { RoleType, AuthMode } from '../auth/AuthModal';

const HERO_VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260423_161253_c72b1869-400f-45ed-ac0c-52f68c2ed5bd.mp4';

interface HeroSectionProps {
  onOpenAuth?: (role?: RoleType, mode?: AuthMode) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenAuth }) => {
  return (
    <div className="flex-1 px-6 pt-20 pb-6 flex items-end w-full">
      <div className="relative w-full max-w-[88rem] mx-auto rounded-2xl overflow-hidden shadow-sm min-h-[660px] lg:h-[calc(100vh-96px)]">
        {/* Ambient Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="object-cover absolute inset-0 w-full h-full"
          src={HERO_VIDEO_URL}
        />

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-between h-full p-8 md:p-12 pt-24 md:pt-28">
          {/* Main 2-column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full my-auto">
            {/* Left Column: Heading, Subtitle, 2 Buttons */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <h1
                className="text-black text-5xl md:text-6xl lg:text-7xl font-medium leading-tight max-w-xl mb-4"
                style={{ letterSpacing: '-0.04em' }}
              >
                Scan. Verify.
                <br />
                Trust.
              </h1>

              <p
                className="text-black/75 text-lg md:text-xl max-w-lg mb-8 leading-relaxed font-normal"
                style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
              >
                Check if your product is genuine in seconds.
              </p>

              {/* Two CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                {/* Primary Button: Verify a Product */}
                <a
                  href="#quick-verify"
                  className="inline-flex items-center gap-3 bg-black text-white text-base md:text-lg font-medium pl-8 pr-2 py-2 rounded-full hover:bg-gray-800 transition-colors duration-200 group shadow-md"
                >
                  <span>Verify a Product</span>
                  <span className="bg-white rounded-full p-2 transition-transform duration-200 group-hover:translate-x-0.5">
                    <ArrowRight className="w-5 h-5 text-black" />
                  </span>
                </a>

                {/* Secondary Button: Register Your Brand */}
                <button
                  type="button"
                  onClick={() => onOpenAuth?.('manufacturer', 'signup')}
                  className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md text-black border border-black/10 text-base md:text-lg font-medium px-7 py-3 rounded-full hover:bg-white transition-colors duration-200 shadow-sm cursor-pointer"
                >
                  <Building2 className="w-5 h-5 text-black/70" />
                  <span>Register Your Brand</span>
                </button>
              </div>
            </div>

            {/* Right Column: Sleek Phone Mockup showing "Genuine" result */}
            <div className="hidden lg:flex lg:col-span-5 justify-end">
              <div className="w-[330px] rounded-[36px] bg-white/95 backdrop-blur-xl border border-black/10 p-5 shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                {/* Phone Speaker Notch */}
                <div className="w-24 h-3.5 bg-black/10 rounded-full mx-auto mb-4" />

                {/* Verification Card Header */}
                <div className="flex items-center justify-between border-b border-black/5 pb-2.5 mb-3.5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-black/60">
                      TrustChain Verify
                    </span>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-medium px-2 py-0.5 rounded-full border border-emerald-200">
                    Live Scan
                  </span>
                </div>

                {/* Big "GENUINE" Result Banner */}
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3.5 mb-3.5 text-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-1.5 shadow-sm">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div
                    className="text-emerald-900 font-medium text-xl tracking-tight"
                    style={{ letterSpacing: '-0.03em' }}
                  >
                    100% Genuine
                  </div>
                  <div className="text-emerald-700 text-[11px] mt-0.5 font-medium">
                    Polygon Authenticated ID #TC-8821-POLYGON
                  </div>
                </div>

                {/* Product Metadata */}
                <div className="space-y-2 text-xs text-black/70 mb-3.5 bg-black/[0.02] p-3 rounded-xl border border-black/5">
                  <div className="flex justify-between items-center">
                    <span className="text-black/50">Product:</span>
                    <span className="font-medium text-black">Cipla Asthalin Inhaler</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black/50">Batch ID:</span>
                    <span className="font-mono font-medium text-black">#IN-9942-B7</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black/50">Mfg / Expiry:</span>
                    <span className="font-medium text-black">09/2026 · 08/2029</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black/50">Scan Status:</span>
                    <span className="text-emerald-600 font-medium">1st Scan (Safe)</span>
                  </div>
                </div>

                {/* Reward points preview */}
                <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-xs font-medium text-amber-900">+50 TrustPoints</span>
                  </div>
                  <span className="text-[11px] text-amber-700 font-medium">Claimed</span>
                </div>

                {/* Action button inside phone */}
                <div className="mt-3">
                  <a
                    href="#quick-verify"
                    className="w-full py-2 bg-black text-white text-xs font-medium rounded-xl text-center flex items-center justify-center gap-1.5 cursor-pointer hover:bg-gray-800 transition-colors"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>View Provenance Journey</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Brand Marquee (inside hero, below content) */}
          <div className="pt-4 pb-1 w-full max-w-md overflow-hidden">
            <style>
              {`
                @keyframes marquee {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                .marquee-track {
                  display: flex;
                  width: max-content;
                  animation: marquee 22s linear infinite;
                }
                .marquee-track:hover {
                  animation-play-state: paused;
                }
              `}
            </style>
            <div className="marquee-track" aria-label="Ecosystem & Industry Partners">
              {HERO_BRANDS.map((brand, idx) => (
                <div
                  key={`hero-brand-1-${brand.id}-${idx}`}
                  className="mx-7 shrink-0 text-black/60 whitespace-nowrap select-none"
                  style={brand.style}
                >
                  {brand.name}
                </div>
              ))}
              {HERO_BRANDS.map((brand, idx) => (
                <div
                  key={`hero-brand-2-${brand.id}-${idx}`}
                  className="mx-7 shrink-0 text-black/60 whitespace-nowrap select-none"
                  style={brand.style}
                  aria-hidden="true"
                >
                  {brand.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
