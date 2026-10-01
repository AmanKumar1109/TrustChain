import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'Can the QR codes be cloned or duplicated?',
    a: 'No. Each QR tag embeds a one-time cryptographic nonce bound to the product\'s on-chain certificate. Even a pixel-perfect visual copy of the QR code returns a \'Cryptographic Mismatch\' result when scanned. The mathematical uniqueness cannot be replicated with a printer.',
  },
  {
    q: 'Does the consumer need to download an app or create a crypto wallet?',
    a: 'Neither. The entire verification flow works through a standard smartphone camera. Account Abstraction (ERC-4337) transparently manages the blockchain interaction. Your mobile number becomes your wallet — no seed phrases, no MetaMask, no exchange.',
  },
  {
    q: 'Who pays the blockchain gas fees?',
    a: 'Brands pay a flat monthly subscription that covers all gas costs for both minting and consumer scans. Consumers never pay gas. Ever. This is enforced at the protocol level via sponsored transactions.',
  },
  {
    q: 'What happens when the blockchain network is congested?',
    a: 'Paradox uses a Layer-2 rollup with 2,000+ TPS capacity. Even at peak load, verification latency remains under 400ms. The public Ethereum mainnet serves only as the final settlement layer.',
  },
  {
    q: 'Is the verification data private? Who can see scan events?',
    a: 'Brand aggregate scan analytics are visible to brands in their dashboard. Individual consumer scan events are pseudonymous — only a cryptographic hash of the mobile number is stored, not the number itself.',
  },
  {
    q: 'How does this integrate with our existing ERP or WMS system?',
    a: 'We provide a REST API, a Webhooks system, and a bulk CSV upload tool. Enterprise clients get a dedicated integration engineer and SLA-backed uptime guarantees.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="relative w-full py-28 px-6 md:px-12 lg:px-20 overflow-hidden bg-[#060709]">

      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-[-15%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.018) 0%, transparent 65%)',
          filter: 'blur(90px)',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">

        {/* Label */}
        <div className="flex items-center justify-center mb-5">
          <span className="section-tag">FAQ</span>
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-semibold tracking-tight text-white leading-[1.1] mb-5">
            Everything You<br className="hidden sm:block" /> Need to Know
          </h2>
          <p className="text-zinc-500 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Clear answers on cryptographic binding, cloning security, gas subsidies, and enterprise integration.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-2.5">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`bento-card overflow-hidden transition-all duration-200 ${isOpen ? 'border-white/15' : ''}`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full p-6 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-medium text-white tracking-tight leading-snug">
                    {item.q}
                  </span>
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    isOpen
                      ? 'bg-white/10 border-white/20 text-white'
                      : 'bg-white/[0.04] border-white/[0.08] text-zinc-600'
                  }`}>
                    {isOpen ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                  </div>
                </button>

                <div
                  className={`px-6 pb-6 pt-0 text-sm text-zinc-500 leading-relaxed border-t border-white/[0.05] transition-all duration-200 ${
                    isOpen ? 'block' : 'hidden'
                  }`}
                >
                  <div className="pt-4">{item.a}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Support Note */}
        <div className="mt-10 text-center font-mono text-xs text-zinc-700">
          Enterprise integration inquiry?{' '}
          <a
            href="mailto:contact@paradoxtrust.org"
            className="text-zinc-400 hover:text-white transition-colors underline underline-offset-4"
          >
            Contact our engineering team →
          </a>
        </div>

      </div>
    </section>
  );
}
