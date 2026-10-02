import React from 'react';
import { Building2, Smartphone, Gift, ArrowRight } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Brand registers product & gets QR',
      description:
        'At manufacturing time, each product or batch receives an immutable digital identity minted on Polygon. Secure QR codes with clone-protection are printed on the packaging.',
      icon: Building2,
      badge: 'Manufacturing Time',
    },
    {
      number: '02',
      title: 'You scan the QR code',
      description:
        'Consumers scan the code with any default smartphone camera. No app download required, no gas fees, and no crypto knowledge needed.',
      icon: Smartphone,
      badge: 'Instant Access',
    },
    {
      number: '03',
      title: 'Instant result & rewards unlocked',
      description:
        'See immediate verification: Genuine, Suspicious, Fake, or Recalled. Claim warranty ownership with your mobile number and earn redeemable loyalty points.',
      icon: Gift,
      badge: 'Zero Friction',
    },
  ];

  return (
    <section id="how-it-works" className="bg-[#F5F5F5] px-6 py-24 border-b border-black/5">
      <div className="max-w-[88rem] mx-auto">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <div className="text-black/60 text-sm font-medium mb-2 tracking-wide uppercase">
            Simple 3-Step Flow
          </div>
          <h2
            className="text-black text-4xl md:text-5xl font-medium leading-tight mb-4"
            style={{ letterSpacing: '-0.03em' }}
          >
            How it Works
          </h2>
          <p className="text-black/70 text-lg leading-relaxed">
            Eliminating counterfeits through seamless consumer verification and cryptographic proof.
          </p>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="bg-white rounded-3xl p-8 border border-black/5 flex flex-col justify-between shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span
                      className="text-4xl font-medium text-black/20"
                      style={{ letterSpacing: '-0.04em' }}
                    >
                      {step.number}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-black/60 bg-[#F5F5F5] px-3 py-1 rounded-full border border-black/5">
                      {step.badge}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <h3
                    className="text-black text-2xl font-medium leading-snug mb-3"
                    style={{ letterSpacing: '-0.02em' }}
                  >
                    {step.title}
                  </h3>

                  <p className="text-black/70 text-base leading-relaxed">{step.description}</p>
                </div>

                <div className="mt-8 pt-6 border-t border-black/5 flex items-center text-xs font-medium text-black/50">
                  <span>Step {step.number} of 03</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
