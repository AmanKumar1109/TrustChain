import React from 'react';
import { ArrowRight } from 'lucide-react';

const BLOOM_CARD_BG =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260423_164207_f243351d-ed59-48ec-83a0-a5e996bdbe3c.png&w=1280&q=85';

export const InfoSection: React.FC = () => {
  return (
    <section id="protocol" className="bg-[#F5F5F5] px-6 py-24">
      <div className="max-w-[88rem] mx-auto">
        {/* Row 1: Header + Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-start">
          {/* Left Column */}
          <div>
            <h2
              className="text-black text-4xl md:text-5xl font-medium leading-tight mb-8"
              style={{ letterSpacing: '-0.03em' }}
            >
              Meet TrustChain.
            </h2>
            <a
              href="#discover"
              className="inline-flex items-center gap-3 bg-black text-white text-base font-medium pl-7 pr-2 py-2 rounded-full hover:bg-gray-800 transition-colors duration-200 group"
            >
              <span>Discover it</span>
              <span className="bg-white rounded-full p-2 transition-transform duration-200 group-hover:translate-x-0.5">
                <ArrowRight className="w-4 h-4 text-black" />
              </span>
            </a>
          </div>

          {/* Right Column */}
          <div>
            <p className="text-black/70 text-2xl md:text-3xl leading-relaxed font-normal">
              TrustChain gives every physical product an immutable digital passport on Polygon,
              safeguarding India&apos;s ₹1 lakh crore+ market against counterfeits.
            </p>
          </div>
        </div>

        {/* Row 2: 4-Column Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 (spans 2 cols on lg) */}
          <div
            className="lg:col-span-2 rounded-2xl min-h-80 p-7 flex flex-col justify-between relative overflow-hidden transition-transform duration-300 hover:-translate-y-1"
            style={{
              backgroundImage: `url("${BLOOM_CARD_BG}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <h3
              className="text-black text-2xl font-medium leading-snug"
              style={{ letterSpacing: '-0.02em' }}
            >
              Authenticity that endures
            </h3>
            <p className="text-black/70 text-base max-w-xs leading-normal">
              Each unit receives an indelible Polygon ID with MongoDB speed. Consumers instantly see
              genuine, suspicious, or recall status in a single scan.
            </p>
          </div>

          {/* Card 2: Solid #2B2644 */}
          <div
            className="rounded-2xl p-7 min-h-80 flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1"
            style={{ backgroundColor: '#2B2644' }}
          >
            <h3 className="text-white text-2xl font-medium leading-snug whitespace-pre-line">
              {'Clone-proof,\nalways tracked.'}
            </h3>
            <p className="text-white/60 text-base leading-normal">
              Scan counters, geo/time velocity checks, and scratch codes actively prevent
              counterfeit duplicates from compromising your brand.
            </p>
          </div>

          {/* Card 3: Solid #2B2644 */}
          <div
            className="rounded-2xl p-7 min-h-80 flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1"
            style={{ backgroundColor: '#2B2644' }}
          >
            <h3 className="text-white text-2xl font-medium leading-snug whitespace-pre-line">
              {'Zero crypto\nfriction.'}
            </h3>
            <p className="text-white/60 text-base leading-normal">
              No wallets or gas fees. Manufacturers pay in INR, while buyers claim warranties and
              loyalty points with just a phone number and OTP.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
