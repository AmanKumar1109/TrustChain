import React, { useState } from 'react';
import { Shield, ArrowUpRight, User, Menu, X, QrCode } from 'lucide-react';
import { NAV_ITEMS } from '../../data/landingData';

export default function Navbar({ onOpenVerify, onOpenAuth }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative z-40 w-full pt-6 pb-2 px-6 md:px-12 lg:px-16 flex items-center justify-between">
      
      {/* Brand Logo (Left) matching reference vortex mark */}
      <a
        href="#"
        className="group flex items-center gap-3 transition-transform duration-200 hover:scale-105"
        aria-label="Paradox Trust Protocol Homepage"
      >
        <div className="relative w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-white transition-opacity group-hover:opacity-90"
          >
            <circle cx="16" cy="16" r="15" fill="white" />
            <path
              d="M16 5.5C21.799 5.5 26.5 10.201 26.5 16C26.5 20.8 22.8 25 17.5 25C12.5 25 9.2 21.2 9.2 16.8C9.2 13 12 10.2 15.3 10.2C18 10.2 19.8 11.8 19.8 14C19.8 15.6 18.6 16.8 17 16.8"
              stroke="#07080a"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </a>

      {/* Floating Center Navigation Capsule (Desktop) matching reference */}
      <nav
        aria-label="Main Navigation"
        className="hidden md:flex items-center gap-1.5 lg:gap-3 bg-[#13151b]/80 border border-white/10 rounded-full pl-6 pr-2 py-1.5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
      >
        <ul className="flex items-center gap-5 lg:gap-6 text-[13px] tracking-wide">
          <li>
            <a href="#" className="text-white font-medium">
              Home
            </a>
          </li>
          {NAV_ITEMS.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className="text-zinc-400 hover:text-white transition-colors duration-200"
              >
                {item.name}
              </a>
            </li>
          ))}
          <li>
            <a href="#faq" className="text-zinc-400 hover:text-white transition-colors duration-200">
              FAQ
            </a>
          </li>
        </ul>

        {/* Protection Action Pill & Shield Icon from reference */}
        <div className="flex items-center gap-1.5 ml-2">
          <button
            onClick={onOpenVerify}
            className="flex items-center gap-1 text-[12px] font-medium text-zinc-300 bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 hover:border-white/20 rounded-full px-3 py-1 transition-all duration-200 cursor-pointer"
          >
            <span>Protection</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          <button
            onClick={onOpenVerify}
            aria-label="Security Protection Check"
            className="w-7 h-7 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 flex items-center justify-center transition-colors text-zinc-300 hover:text-white cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Right User Action matching reference "Create Account" */}
      <div className="hidden sm:flex items-center gap-4">
        <button
          onClick={() => onOpenAuth('brand')}
          className="flex items-center gap-2 text-[13.5px] font-normal text-zinc-200 hover:text-white transition-colors duration-200 group cursor-pointer"
        >
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-zinc-300 group-hover:text-white">
            <User className="w-4 h-4" />
          </div>
          <span>Create Account</span>
        </button>
      </div>

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden p-2 text-zinc-300 hover:text-white bg-white/5 border border-white/10 rounded-xl cursor-pointer"
        aria-label="Toggle navigation menu"
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-6 right-6 z-50 bg-[#0e1017] border border-white/15 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl animate-fade-in flex flex-col gap-4">
          <ul className="flex flex-col gap-3 text-sm">
            <li>
              <a href="#" onClick={() => setMobileMenuOpen(false)} className="text-white font-medium py-1">
                Home
              </a>
            </li>
            {NAV_ITEMS.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-zinc-400 hover:text-white py-1 transition-colors"
                >
                  {item.name}
                </a>
              </li>
            ))}
            <li>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-zinc-300 hover:text-white py-1">
                FAQ
              </a>
            </li>
          </ul>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenVerify(); }}
              className="w-full py-2.5 rounded-xl bg-white text-black font-semibold text-xs flex items-center justify-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              <span>Verify Product</span>
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenAuth('brand'); }}
              className="w-full py-2.5 rounded-xl bg-white/10 text-white font-medium text-xs flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>Create Account</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
