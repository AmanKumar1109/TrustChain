import React from 'react';
import { LogoIcon } from '../common/LogoIcon';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F5F5F5] border-t border-black/5 px-6 py-16">
      <div className="max-w-[88rem] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <LogoIcon className="w-6 h-6 text-black" />
            <span className="text-xl font-medium tracking-tight text-black">TrustChain</span>
          </div>
          <p className="text-black/50 text-sm">
            © {new Date().getFullYear()} TrustChain Protocol. Blockchain-Powered Authenticity.
          </p>
        </div>

        {/* Links: Contact, Privacy, Terms, Team */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-black/70 font-medium">
          <a href="#contact" className="hover:text-black transition-colors">
            Contact
          </a>
          <a href="#privacy" className="hover:text-black transition-colors">
            Privacy
          </a>
          <a href="#terms" className="hover:text-black transition-colors">
            Terms
          </a>
          <a href="#team" className="hover:text-black transition-colors">
            Team
          </a>
          <div className="flex items-center gap-2 pl-2 border-l border-black/10">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-black/50">Polygon Mainnet Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
