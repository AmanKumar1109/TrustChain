import React from 'react';
import { ArrowRight } from 'lucide-react';

const USE_CASES_VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260423_183428_ab5e672a-f608-4dcb-b319-f3e040f02e2d.mp4';

export const UseCasesSection: React.FC = () => {
  return (
    <section id="how-it-works" className="bg-[#F5F5F5] px-6 py-24">
      <div className="max-w-[88rem] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Column */}
        <div className="md:pr-12 md:pt-2">
          <div className="text-black/60 text-sm mb-2 font-normal">
            TrustChain in Practice
          </div>
          <h2
            className="text-5xl md:text-6xl font-medium leading-none mb-6"
            style={{ letterSpacing: '-0.04em' }}
          >
            Use modes
          </h2>
          <p className="text-black/60 text-base leading-relaxed max-w-sm">
            TrustChain powers dedicated dashboards for 5 core roles — guest, consumer, manufacturer,
            partner, and enterprise admin — across pharma, FMCG, electronics, and luxury.
          </p>
        </div>

        {/* Right Column: Card with background video */}
        <div className="relative rounded-3xl overflow-hidden min-h-[720px] shadow-sm">
          {/* Autoplay muted loop playsInline video */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="object-cover absolute inset-0 w-full h-full"
            src={USE_CASES_VIDEO_URL}
          />

          {/* Overlay Content */}
          <div className="relative z-10 p-10 md:p-12 flex flex-col justify-start h-full">
            <h3
              className="text-4xl md:text-5xl font-medium leading-tight mb-5 text-black"
              style={{ letterSpacing: '-0.03em' }}
            >
              Brand Protection
            </h3>
            <p className="text-black/70 text-base max-w-md mb-8 leading-relaxed">
              Eradicate counterfeits and grey-market leaks with crowdsourced scanning, real-time
              fraud hotspot intelligence, and seamless resale provenance transfer.
            </p>
            <div>
              <a
                href="#know-more"
                className="group inline-flex items-center gap-3 text-black text-base font-medium cursor-pointer"
              >
                <span className="w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center group-hover:bg-white transition-colors duration-200">
                  <ArrowRight className="w-4 h-4 text-black transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
                <span>Know more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
