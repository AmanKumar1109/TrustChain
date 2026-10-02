import React from 'react';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import { RoleType, AuthMode } from '../auth/AuthModal';

interface PricingSectionProps {
  onOpenAuth?: (role?: RoleType, mode?: AuthMode) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onOpenAuth }) => {
  const plans = [
    {
      name: 'Starter',
      subtitle: 'For D2C brands & emerging makers',
      price: '₹4,999',
      period: '/ month',
      popular: false,
      features: [
        'Up to 10,000 QR digital IDs / month',
        'Polygon blockchain minting included',
        'Instant web verification with zero login',
        'Basic scan counter & clone alerts',
        'Exportable CSV scan analytics',
        'Email & community support',
      ],
      ctaText: 'Start Starter Plan',
      theme: 'light',
    },
    {
      name: 'Growth',
      subtitle: 'For mid-size FMCG, pharma & electronics',
      price: '₹19,999',
      period: '/ month',
      popular: true,
      features: [
        'Up to 100,000 QR digital IDs / month',
        'Advanced geo & time velocity clone detection',
        'OTP warranty registration & loyalty CRM',
        'Real-time counterfeit hotspot heatmap',
        'Distributor & retailer custody handoffs',
        'Priority 24/7 onboarding & support',
      ],
      ctaText: 'Choose Growth Plan',
      theme: 'dark',
    },
    {
      name: 'Enterprise',
      subtitle: 'For multi-national pharma & luxury groups',
      price: 'Custom',
      period: 'annual INR billing',
      popular: false,
      features: [
        'Unlimited QR & batch Polygon identities',
        'Dual-layer scratch codes for high-value items',
        'SAP / Oracle / ERP warehouse integration',
        'Dedicated legal anti-counterfeit dossiers',
        'Custom white-label verification portals',
        'Dedicated account manager & 99.99% SLA',
      ],
      ctaText: 'Contact Enterprise Sales',
      theme: 'light',
    },
  ];

  return (
    <section id="pricing" className="bg-[#F5F5F5] px-6 py-24 border-b border-black/5">
      <div className="max-w-[88rem] mx-auto">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <div className="text-black/60 text-sm font-medium mb-2 tracking-wide uppercase">
            Predictable Pricing
          </div>
          <h2
            className="text-black text-4xl md:text-5xl font-medium leading-tight mb-4"
            style={{ letterSpacing: '-0.03em' }}
          >
            Transparent Plans in INR
          </h2>
          <p className="text-black/70 text-lg leading-relaxed">
            Zero gas fee volatility. No wallets or cryptocurrency required. Simple monthly or annual
            invoicing in Indian Rupees.
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => {
            const isDark = plan.theme === 'dark';
            return (
              <div
                key={plan.name}
                className={`rounded-3xl p-8 md:p-10 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-sm ${
                  isDark
                    ? 'bg-[#2B2644] text-white'
                    : 'bg-white text-black border border-black/5'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-xl font-medium ${
                        isDark ? 'text-white' : 'text-black'
                      }`}
                    >
                      {plan.name}
                    </span>
                    {plan.popular && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-white/10 text-white px-3 py-1 rounded-full border border-white/20">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        Most Popular
                      </span>
                    )}
                  </div>

                  <p className={`text-sm mb-6 ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                    {plan.subtitle}
                  </p>

                  <div className="flex items-baseline gap-2 mb-8">
                    <span
                      className="text-4xl md:text-5xl font-medium tracking-tight"
                      style={{ letterSpacing: '-0.04em' }}
                    >
                      {plan.price}
                    </span>
                    <span className={`text-sm ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                      {plan.period}
                    </span>
                  </div>

                  <hr className={`my-6 ${isDark ? 'border-white/10' : 'border-black/5'}`} />

                  {/* Feature List */}
                  <ul className="space-y-3.5 mb-8">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-3 text-sm">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            isDark ? 'bg-white/15 text-white' : 'bg-black/5 text-black'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className={isDark ? 'text-white/80' : 'text-black/75'}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => onOpenAuth?.('manufacturer', 'signup')}
                    className={`w-full py-3.5 px-6 rounded-full font-medium text-base transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                      isDark
                        ? 'bg-white text-black hover:bg-gray-100'
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
