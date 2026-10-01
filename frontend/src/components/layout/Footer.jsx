import React from 'react';
import { ShieldCheck, MessageCircle, ArrowUp } from 'lucide-react';

export default function Footer({ onOpenAuth }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative w-full border-t border-white/[0.07] bg-[#040508] pt-16 pb-10 px-6 md:px-12 lg:px-20 overflow-hidden">

      {/* Ambient glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[250px] rounded-full opacity-[0.07] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.25) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-white">
                <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
                  <circle cx="16" cy="16" r="15" fill="white" />
                  <path
                    d="M16 5.5C21.799 5.5 26.5 10.201 26.5 16C26.5 20.8 22.8 25 17.5 25C12.5 25 9.2 21.2 9.2 16.8C9.2 13 12 10.2 15.3 10.2C18 10.2 19.8 11.8 19.8 14C19.8 15.6 18.6 16.8 17 16.8"
                    stroke="#07080a"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                PARADOX TRUST
              </span>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed max-w-sm mb-6">
              A Trust Protocol for Physical Goods. Eliminating counterfeit commerce through decentralized cryptographic hardware binding, zero gas fees, and instant consumer provenance.
            </p>

            {/* Hackathon Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-[11px] font-mono text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse" />
              <span>Built for Paradox Hackathon 2026</span>
            </div>
          </div>

          {/* Protocol Links */}
          <div>
            <h5 className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-semibold mb-5">
              Protocol
            </h5>
            <ul className="space-y-3 text-xs text-zinc-600">
              <li><a href="#how-it-works" className="hover:text-zinc-300 transition-colors">How it Works</a></li>
              <li><a href="#for-brands" className="hover:text-zinc-300 transition-colors">For Brands</a></li>
              <li><a href="#rewards" className="hover:text-zinc-300 transition-colors">Consumer Rewards</a></li>
              <li><a href="#fraud-map" className="hover:text-zinc-300 transition-colors">Fraud Intelligence</a></li>
              <li><a href="#pricing" className="hover:text-zinc-300 transition-colors">Enterprise Pricing</a></li>
            </ul>
          </div>

          {/* Governance Links */}
          <div>
            <h5 className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-semibold mb-5">
              Governance
            </h5>
            <ul className="space-y-3 text-xs text-zinc-600">
              <li><a href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-zinc-300 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-zinc-300 transition-colors">Section 65B Compliance</a></li>
              <li><a href="#" className="hover:text-zinc-300 transition-colors">Smart Contract Audits</a></li>
              <li><a href="#" className="hover:text-zinc-300 transition-colors">Bug Bounty</a></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h5 className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-semibold mb-5">
              Connect
            </h5>
            <ul className="space-y-3 text-xs text-zinc-600 mb-6">
              <li>team@paradoxtrust.org</li>
              <li>Bengaluru, Karnataka</li>
              <li>Paradox Dev Syndicate</li>
            </ul>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 text-zinc-600">
              <a href="#" aria-label="X Twitter" className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.08] hover:text-zinc-300 transition-colors">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" aria-label="GitHub" className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.08] hover:text-zinc-300 transition-colors">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.08] hover:text-zinc-300 transition-colors">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a href="#" aria-label="Community" className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.08] hover:text-zinc-300 transition-colors">
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-700 font-mono">
          <p>© 2026 Paradox Trust Protocol. Mathematical proof for physical commerce.</p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
