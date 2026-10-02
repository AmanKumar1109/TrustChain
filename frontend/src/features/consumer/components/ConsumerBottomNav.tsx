import React from 'react';
import {
  Home,
  Gift,
  Package,
  History,
  User,
  QrCode,
} from 'lucide-react';
import { ConsumerTab } from '../types';

interface BottomNavProps {
  currentTab: ConsumerTab;
  onSelectTab: (tab: ConsumerTab) => void;
  onOpenScanner: () => void;
}

export const ConsumerBottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenScanner,
}) => {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-black/10 px-2 py-2 flex items-center justify-around shadow-lg safe-bottom"
      aria-label="Mobile Navigation"
    >
      {/* Tab 1: Home */}
      <button
        type="button"
        onClick={() => onSelectTab('home')}
        className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
          currentTab === 'home' ? 'text-black font-semibold' : 'text-black/40 hover:text-black/70'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px]">Home</span>
      </button>

      {/* Tab 2: Rewards */}
      <button
        type="button"
        onClick={() => onSelectTab('rewards')}
        className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
          currentTab === 'rewards' ? 'text-black font-semibold' : 'text-black/40 hover:text-black/70'
        }`}
      >
        <Gift className="w-5 h-5" />
        <span className="text-[10px]">Rewards</span>
      </button>

      {/* Center Action: Scan Button */}
      <button
        type="button"
        onClick={onOpenScanner}
        className="-mt-5 w-12 h-12 rounded-full bg-black text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all focus:outline-none"
        aria-label="Scan Physical Product QR"
      >
        <QrCode className="w-6 h-6 text-white" />
      </button>

      {/* Tab 3: My Products */}
      <button
        type="button"
        onClick={() => onSelectTab('products')}
        className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
          currentTab === 'products' ? 'text-black font-semibold' : 'text-black/40 hover:text-black/70'
        }`}
      >
        <Package className="w-5 h-5" />
        <span className="text-[10px]">Products</span>
      </button>

      {/* Tab 4: History */}
      <button
        type="button"
        onClick={() => onSelectTab('history')}
        className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
          currentTab === 'history' ? 'text-black font-semibold' : 'text-black/40 hover:text-black/70'
        }`}
      >
        <History className="w-5 h-5" />
        <span className="text-[10px]">History</span>
      </button>

      {/* Tab 5: Profile */}
      <button
        type="button"
        onClick={() => onSelectTab('profile')}
        className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
          currentTab === 'profile' ? 'text-black font-semibold' : 'text-black/40 hover:text-black/70'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px]">Profile</span>
      </button>
    </nav>
  );
};

export default ConsumerBottomNav;
