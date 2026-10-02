import React from 'react';
import { Pill, Cpu, Sparkles, Watch, AlertOctagon } from 'lucide-react';

const PROBLEM_IMAGE_BG =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260423_164207_f243351d-ed59-48ec-83a0-a5e996bdbe3c.png&w=1280&q=85';

export const ProblemSection: React.FC = () => {
  return (
    <section id="problem" className="bg-[#F5F5F5] px-6 py-24 border-b border-black/5">
      <div className="max-w-[88rem] mx-auto">
        {/* Header with big stat */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-start">
          <div>
            <div className="text-black/60 text-sm font-medium mb-2 tracking-wide uppercase">
              The Counterfeit Crisis
            </div>
            <h2
              className="text-black text-5xl md:text-6xl font-medium leading-tight mb-4"
              style={{ letterSpacing: '-0.03em' }}
            >
              ₹1 Lakh Crore+
            </h2>
            <div className="text-xl md:text-2xl text-black/80 font-medium">
              Lost annually in India to illicit, dangerous, and copied goods.
            </div>
          </div>

          <div>
            <p className="text-black/70 text-xl md:text-2xl leading-relaxed font-normal">
              Counterfeits aren&apos;t just economic losses — they cause life-threatening medical
              emergencies, electrical fires, and complete erosion of consumer trust.
            </p>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Fake Medicine (Spans 2 cols on lg with background styling) */}
          <div
            className="lg:col-span-2 rounded-2xl min-h-80 p-7 flex flex-col justify-between relative overflow-hidden transition-transform duration-300 hover:-translate-y-1"
            style={{
              backgroundImage: `url("${PROBLEM_IMAGE_BG}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-black/60 bg-white/70 backdrop-blur-md px-3 py-1 rounded-full border border-black/5">
                Pharmaceuticals
              </span>
              <Pill className="w-6 h-6 text-black/80" />
            </div>

            <div>
              <h3
                className="text-black text-2xl font-medium leading-snug mb-2"
                style={{ letterSpacing: '-0.02em' }}
              >
                Fake Medicines
              </h3>
              <p className="text-black/75 text-base max-w-md leading-normal">
                Over 20% of domestic medicines are estimated to be substandard or adulterated,
                causing antibiotic resistance, organ failure, and untreated medical emergencies.
              </p>
            </div>
          </div>

          {/* Card 2: Electronics (Solid #2B2644) */}
          <div
            className="rounded-2xl p-7 min-h-80 flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1"
            style={{ backgroundColor: '#2B2644' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/70 bg-white/10 px-3 py-1 rounded-full">
                Electronics
              </span>
              <Cpu className="w-6 h-6 text-white/70" />
            </div>

            <div>
              <h3 className="text-white text-2xl font-medium leading-snug mb-2 whitespace-pre-line">
                {'Hazardous\nElectronics'}
              </h3>
              <p className="text-white/60 text-base leading-normal">
                Uncertified chargers, fake lithium batteries, and copied chips lead to short
                circuits and device explosions.
              </p>
            </div>
          </div>

          {/* Card 3: Cosmetics & FMCG (Solid #2B2644) */}
          <div
            className="rounded-2xl p-7 min-h-80 flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1"
            style={{ backgroundColor: '#2B2644' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/70 bg-white/10 px-3 py-1 rounded-full">
                Cosmetics & FMCG
              </span>
              <Sparkles className="w-6 h-6 text-white/70" />
            </div>

            <div>
              <h3 className="text-white text-2xl font-medium leading-snug mb-2 whitespace-pre-line">
                {'Toxic\nCosmetics'}
              </h3>
              <p className="text-white/60 text-base leading-normal">
                Duplicate personal care items filled with toxic industrial chemicals, lead, and
                untested compounds that harm skin.
              </p>
            </div>
          </div>
        </div>

        {/* Supplementary banner on Luxury Goods */}
        <div className="mt-4 p-6 rounded-2xl bg-white border border-black/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center shrink-0">
              <Watch className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="text-base font-medium text-black">
                Luxury & Fashion Goods Counterfeits
              </div>
              <div className="text-xs text-black/60">
                ₹30,000 Cr+ in counterfeit watches, handbags, and apparel flooding online & offline
                channels.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-black/60 bg-[#F5F5F5] px-3.5 py-1.5 rounded-full border border-black/5">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-500" />
            <span>28% of Indian consumers unknowingly bought fakes in 2025</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
