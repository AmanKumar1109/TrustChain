import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

const TABS = {
  brands: {
    label: 'For Brands',
    headline: 'Cryptographic Anti-Counterfeit at Scale',
    description: 'Register your entire product catalogue with immutable batch certificates. Real-time fraud alerts, supply chain visibility, and legal-grade evidence for enforcement raids.',
    benefits: [
      { title: 'Batch Minting Dashboard', desc: 'Mint up to 10 million unique cryptographic certificates per batch with bulk CSV upload and API integration.' },
      { title: 'Real-Time Fraud Alerts', desc: 'Receive instant notifications when duplicate QR scans are detected across different geographic locations.' },
      { title: 'Grey Market Visibility', desc: 'Track unauthorized parallel imports with GPS-anchored scan telemetry. Know exactly where your product leaks are.' },
      { title: 'Legal Evidence Dossier', desc: 'Every fraud event auto-generates a Section 65B IT Act compliant dossier, ready for enforcement raids.' },
    ],
  },
  retailers: {
    label: 'For Retailers',
    headline: 'Zero-Risk Authentic Inventory Guarantee',
    description: 'Every product you stock is cryptographically verified before it reaches your shelf. Build consumer confidence and eliminate chargebacks from counterfeit complaints.',
    benefits: [
      { title: 'Retailer Verification Portal', desc: 'Scan incoming inventory batches before stocking. Instantly flag suspicious items before they reach customers.' },
      { title: 'Verified Retailer Badge', desc: 'Display a blockchain-verified \'Paradox Authorized\' badge that builds immediate consumer trust at point of sale.' },
      { title: 'Supply Chain Traceability', desc: 'Full chain-of-custody from factory to your shelf. Know every authorized hand-off your inventory passed through.' },
      { title: 'Consumer Return Prevention', desc: 'Cryptographic proof of authenticity eliminates counterfeit-based return fraud and chargeback disputes.' },
    ],
  },
  consumers: {
    label: 'For Consumers',
    headline: 'Scan Once. Know with Certainty.',
    description: 'Point your phone at any Paradox-protected product and receive mathematical proof in 400ms. Earn rewards, build streaks, and report fakes for bounties.',
    benefits: [
      { title: 'Camera-First Verification', desc: 'No app download required. Standard smartphone camera + one tap = cryptographic authenticity proof.' },
      { title: 'Proof-of-Purchase Tokens', desc: 'Every verified scan mints trust points to your mobile number. Redeem for brand discounts and exclusive cashback.' },
      { title: 'Digital Warranty Claim', desc: 'Claim manufacturer warranty via OTP. No paper receipt required — the blockchain is your permanent receipt.' },
      { title: 'Truth Bounty for Fakes', desc: 'Report counterfeit products in your locality. Verified reports earn 1,500 Truth Bounty points instantly.' },
    ],
  },
};

export default function RoleTabsSection({ onOpenAuth }) {
  const [activeTab, setActiveTab] = useState('brands');
  const current = TABS[activeTab];

  return (
    <section id="for-brands" className="relative w-full py-28 px-6 md:px-12 lg:px-20 overflow-hidden bg-[#060709]">

      {/* Ambient glow */}
      <div
        className="absolute top-1/2 right-[-15%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.018) 0%, transparent 65%)',
          filter: 'blur(90px)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Label */}
        <div className="flex items-center justify-center mb-5">
          <span className="section-tag">Built for Everyone</span>
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-semibold tracking-tight text-white leading-[1.1] mb-5">
            Designed for Every<br className="hidden sm:block" /> Stakeholder
          </h2>
          <p className="text-zinc-500 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Whether you're a manufacturer, distributor, or conscious consumer — Paradox aligns incentives with mathematical trust.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
          {Object.entries(TABS).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-6 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer border ${
                activeTab === key
                  ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                  : 'bg-white/[0.04] text-zinc-400 border-white/[0.08] hover:bg-white/[0.08] hover:text-zinc-200'
              }`}
            >
              {val.label}
            </button>
          ))}
        </div>

        {/* Content Box */}
        <div className="bento-card p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 dot-grid opacity-30 rounded-[28px]" />
          <div className="relative z-10">

            {/* Headline */}
            <div className="max-w-3xl mb-10">
              <div className="section-tag mb-3">{current.label} Architecture</div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white tracking-tight mb-3 leading-tight">
                {current.headline}
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {current.description}
              </p>
            </div>

            {/* 4 Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {current.benefits.map((b) => (
                <div
                  key={b.title}
                  className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.12] transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-white/10 border border-white/15 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white tracking-tight mb-1.5">
                        {b.title}
                      </h4>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        {b.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Action */}
            <div className="pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-xs text-zinc-600">
                Ready to deploy immutable brand protection or claim verified rewards?
              </p>
              <button
                onClick={() => onOpenAuth(activeTab === 'brands' ? 'brand' : 'consumer')}
                className="px-6 py-2.5 rounded-full bg-white hover:bg-zinc-100 text-black text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-md hover:scale-105 shrink-0"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
