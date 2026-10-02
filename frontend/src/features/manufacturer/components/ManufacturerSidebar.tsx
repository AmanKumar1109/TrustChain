import React from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  Truck,
  Users,
  MapPin,
  BarChart3,
  AlertOctagon,
  Gift,
  CreditCard,
  Settings,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { LogoIcon } from '../../../components/common/LogoIcon';
import { ManufacturerTab } from '../types';

interface SidebarProps {
  currentTab: ManufacturerTab;
  onSelectTab: (tab: ManufacturerTab) => void;
  onExitDashboard: () => void;
}

export const ManufacturerSidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onExitDashboard,
}) => {
  const navItems: { id: ManufacturerTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'batches', label: 'Batches', icon: Layers },
    { id: 'supply-chain', label: 'Supply Chain', icon: Truck },
    { id: 'partners', label: 'Partners', icon: Users },
    { id: 'hotspots', label: 'Hotspot Map', icon: MapPin, badge: 'Live' },
    { id: 'analytics', label: 'Scan Analytics', icon: BarChart3 },
    { id: 'recall', label: 'Recall', icon: AlertOctagon },
    { id: 'rewards', label: 'Rewards Campaign', icon: Gift },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-black/5 flex flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto">
      <div>
        {/* Brand Logo Header */}
        <div className="p-6 border-b border-black/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LogoIcon className="w-6 h-6 text-black" />
            <div>
              <span className="text-lg font-medium tracking-tight text-black block leading-none">
                TrustChain
              </span>
              <span className="text-[10px] text-black/50 font-medium tracking-wider uppercase">
                Manufacturer Hub
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-black text-white shadow-sm'
                    : 'text-black/70 hover:text-black hover:bg-black/[0.03]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-black/60'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer in Sidebar */}
      <div className="p-4 border-t border-black/5 space-y-3">
        <div className="p-3 bg-[#F5F5F5] rounded-2xl border border-black/5 flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <div className="text-[11px] leading-tight">
            <span className="font-medium text-black block">Polygon POS Live</span>
            <span className="text-black/50 text-[10px]">Zero Gas Overhead</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onExitDashboard}
          className="w-full flex items-center justify-center gap-2 text-xs font-medium text-black/60 hover:text-black hover:bg-black/5 py-2.5 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Public Portal</span>
        </button>
      </div>
    </aside>
  );
};

export default ManufacturerSidebar;
