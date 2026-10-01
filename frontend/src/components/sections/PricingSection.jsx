import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

const PLANS = [
  {
    name: 'Starter',
    badge: 'SME Ready',
    subtitle: 'For emerging D2C brands and small manufacturers entering the anti-counterfeit market.',
    priceMonthly: 2999,
    priceAnnual: 2399,
    period: '/ month',
    features: [
      'Up to 50,000 product certificates / month',
      'QR + NFC tag generation',
      'Basic fraud alert dashboard',
      'Consumer scan analytics',
      'Email support',
    ],
    cta: 'Start Free Trial',
    highlighted: false,
  },
  {
    name: 'Growth',
    badge: 'Most Popular',
    subtitle: 'For growing brands with regional supply chains who need real-time counterfeit intelligence.',
    priceMonthly: 8999,
    priceAnnual: 7199,
    period: '/ month',
    features: [
      'Up to 500,000 certificates / month',
      'Full supply chain traceability',
      'Real-time fraud intelligence alerts',
      'GPS hotspot map access',
      'Consumer rewards program',
      'API + Webhook integration',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    badge: 'Custom Scale',
    subtitle: 'For large FMCG and pharmaceutical corporations with complex global supply chains.',
    priceMonthly: 'Custom',
    priceAnnual: 'Custom',
    period: '',
    features: [
      'Unlimited certificate minting',
      'Dedicated blockchain node',
      'Legal evidence dossier generation',
      'White-label consumer app',
      'SLA-backed 99.95% uptime',
      'Dedicated customer success',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export default function PricingSection({ onOpenAuth }) {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="relative w-full py-28 px-6 md:px-12 lg:px-20 overflow-hidden bg-[#060709]">

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
          <span className="section-tag">Pricing</span>
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-semibold tracking-tight text-white leading-[1.1] mb-5">
            Transparent Plans.<br className="hidden sm:block" /> Zero Hidden Fees.
          </h2>
          <p className="text-zinc-500 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            No gas surcharges. No per-scan costs. Protect your brand reputation with mathematical certainty.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-xs font-semibold ${!isAnnual ? 'text-white' : 'text-zinc-600'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            aria-label="Toggle annual billing"
            className="relative w-12 h-6 rounded-full bg-white/10 border border-white/20 p-0.5 cursor-pointer transition-colors"
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                isAnnual ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold ${isAnnual ? 'text-white' : 'text-zinc-600'}`}>
              Annual
            </span>
            <span className="badge-mono">Save 20%</span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch mb-8">
          {PLANS.map((plan) => {
            const price = isAnnual ? plan.priceAnnual : plan.priceMonthly;
            return (
              <div
                key={plan.name}
                className={`relative rounded-[28px] p-8 md:p-9 flex flex-col justify-between transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-white/[0.07] border border-white/25 shadow-[0_0_60px_rgba(255,255,255,0.05)] lg:-translate-y-2'
                    : 'bento-card'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="px-4 py-1 rounded-full bg-white text-black text-[10px] font-bold tracking-wider uppercase">
                      Most Popular
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-white tracking-tight">{plan.name}</h3>
                    <span className="badge-mono">{plan.badge}</span>
                  </div>
                  <p className="text-xs text-zinc-600 mb-7 leading-relaxed">{plan.subtitle}</p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-8 pb-7 border-b border-white/[0.07] pt-4 border-t border-t-white/[0.05]">
                    {typeof price === 'number' ? (
                      <>
                        <span className="text-2xl font-light text-white">₹</span>
                        <span className="text-5xl font-light text-white tracking-tight">
                          {price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-zinc-600 ml-1">{plan.period}</span>
                      </>
                    ) : (
                      <span className="text-4xl font-light text-white tracking-tight">Custom</span>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-400">
                        <div className="w-4 h-4 rounded-full bg-white/10 border border-white/15 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => onOpenAuth('brand')}
                  className={`w-full py-3 rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    plan.highlighted
                      ? 'bg-white hover:bg-zinc-100 text-black shadow-lg hover:scale-[1.02]'
                      : 'bg-white/[0.07] hover:bg-white/[0.12] text-white border border-white/[0.1]'
                  }`}
                >
                  <span>{plan.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="text-center font-mono text-[11px] text-zinc-700">
          * All plans include zero-gas consumer verification guarantee. GST compliant. No lock-in contracts.
        </div>

      </div>
    </section>
  );
}
