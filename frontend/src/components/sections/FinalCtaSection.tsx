import React from 'react';
import { ArrowRight, Building2, ShieldCheck } from 'lucide-react';
import { RoleType, AuthMode } from '../auth/AuthModal';

interface FinalCtaSectionProps {
  onOpenAuth?: (role?: RoleType, mode?: AuthMode) => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onOpenAuth }) => {
  return (
    <section className="bg-[#F5F5F5] px-6 py-24">
      <div className="max-w-[88rem] mx-auto">
        <div className="relative rounded-3xl bg-white border border-black/5 p-10 md:p-16 text-center overflow-hidden shadow-sm">
          {/* Subtle top badge */}
          <div className="inline-flex items-center gap-2 bg-[#F5F5F5] border border-black/5 text-black/70 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Protecting India&apos;s Supply Chain</span>
          </div>

          {/* Heading */}
          <h2
            className="text-black text-4xl md:text-6xl font-medium leading-tight max-w-3xl mx-auto mb-6"
            style={{ letterSpacing: '-0.04em' }}
          >
            Fight counterfeits, one scan at a time
          </h2>

          <p className="text-black/70 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            Whether you&apos;re a consumer checking daily medicines or a brand protecting ₹100 Cr+ in
            inventory, TrustChain gives you instant cryptographic confidence.
          </p>

          {/* Two Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#quick-verify"
              className="inline-flex items-center gap-3 bg-black text-white text-base md:text-lg font-medium pl-8 pr-2 py-2 rounded-full hover:bg-gray-800 transition-colors duration-200 group shadow-md"
            >
              <span>Verify a Product</span>
              <span className="bg-white rounded-full p-2 transition-transform duration-200 group-hover:translate-x-0.5">
                <ArrowRight className="w-5 h-5 text-black" />
              </span>
            </a>

            <button
              type="button"
              onClick={() => onOpenAuth?.('manufacturer', 'signup')}
              className="inline-flex items-center gap-2 bg-[#F5F5F5] text-black border border-black/10 text-base md:text-lg font-medium px-7 py-3 rounded-full hover:bg-black/5 transition-colors duration-200 shadow-sm cursor-pointer"
            >
              <Building2 className="w-5 h-5 text-black/70" />
              <span>Register Your Brand</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCtaSection;
