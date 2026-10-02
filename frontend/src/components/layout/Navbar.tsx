import React, { useState } from 'react';
import { Menu, X, ShieldCheck } from 'lucide-react';
import { LogoIcon } from '../common/LogoIcon';
import { RoleType, AuthMode } from '../auth/AuthModal';

interface NavbarProps {
  onOpenAuth?: (role?: RoleType, mode?: AuthMode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'Problem', href: '#problem' },
    { label: 'Rewards', href: '#rewards' },
    { label: 'Pricing', href: '#pricing' },
  ];

  return (
    <nav className="absolute top-0 left-0 right-0 z-30 px-6 py-5">
      <div className="max-w-[88rem] mx-auto flex items-center justify-between">
        {/* Left: Brand Logo & Name */}
        <a href="#" className="flex items-center gap-2 group" aria-label="TrustChain Home">
          <LogoIcon className="w-7 h-7 text-black transition-transform duration-300 group-hover:rotate-12" />
          <span className="text-2xl font-medium tracking-tight text-black">TrustChain</span>
        </a>

        {/* Center: Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-base text-gray-700 hover:text-black font-medium transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-3 md:gap-4">
          <button
            type="button"
            onClick={() => onOpenAuth?.(undefined, 'login')}
            className="hidden sm:inline-block text-base text-gray-700 hover:text-black font-medium transition-colors duration-200 px-3 py-2 cursor-pointer"
          >
            Login / Sign Up
          </button>

          <a
            href="#quick-verify"
            className="inline-flex items-center gap-2 bg-black text-white text-base font-medium px-6 py-2.5 rounded-full hover:bg-gray-800 transition-colors duration-200 shadow-sm"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verify Product</span>
          </a>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-black hover:bg-black/5 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 p-6 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-black/5 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg text-gray-800 hover:text-black font-medium py-1 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <hr className="border-black/5 my-1" />
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAuth?.(undefined, 'login');
            }}
            className="text-lg text-left text-gray-800 hover:text-black font-medium py-1"
          >
            Login / Sign Up
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
