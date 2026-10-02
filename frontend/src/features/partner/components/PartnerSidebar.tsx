import React from 'react';
import {
  LayoutDashboard,
  Inbox,
  PackageCheck,
  Send,
  QrCode,
  History,
  Star,
  Settings,
  ArrowLeft,
  Truck,
  Store,
} from 'lucide-react';
import { LogoIcon } from '../../../components/common/LogoIcon';
import { PartnerRole, PartnerTab } from '../types';

interface PartnerSidebarProps {
  currentTab: PartnerTab;
  onSelectTab: (tab: PartnerTab) => void;
  role: PartnerRole;
  onExitDashboard: () => void;
}

export const PartnerSidebar: React.FC<PartnerSidebarProps> = ({
  currentTab,
  onSelectTab,
  role,
  onExitDashboard,
}) => {
  const isDistributor = role === 'distributor';

  const navItems = [
    { id: 'overview' as PartnerTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'incoming' as PartnerTab, label: 'Incoming Shipments', icon: Inbox, badge: '2 Pending' },
    { id: 'inventory' as PartnerTab, label: 'Inventory', icon: PackageCheck },
    // Role-specific items:
    ...(isDistributor
      ? [{ id: 'transfer' as PartnerTab, label: 'Transfer (Retail)', icon: Send }]
      : [{ id: 'scan-and-sell' as PartnerTab, label: 'Scan & Sell (POS)', icon: QrCode, badge: 'POS' }]),
    { id: 'history' as PartnerTab, label: 'History', icon: History },
    { id: 'reputation' as PartnerTab, label: 'Reputation', icon: Star },
    { id: 'settings' as PartnerTab, label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-black/5 flex flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-black/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LogoIcon className="w-6 h-6 text-black" />
            <div>
              <span className="text-lg font-medium tracking-tight text-black block leading-none">
                TrustChain
              </span>
              <span className="text-[10px] text-black/50 font-medium tracking-wider uppercase">
                {isDistributor ? 'Distributor Portal' : 'Retailer Portal'}
              </span>
            </div>
          </div>
        </div>

        {/* Role Badge */}
        <div className="px-4 pt-4">
          <div className="flex items-center gap-2 p-2.5 bg-[#F5F5F5] rounded-2xl border border-black/5">
            {isDistributor ? (
              <Truck className="w-4 h-4 text-blue-700" />
            ) : (
              <Store className="w-4 h-4 text-emerald-700" />
            )}
            <div className="text-[11px]">
              <span className="font-semibold text-black block capitalize">
                {role} Mode
              </span>
              <span className="text-black/50 text-[10px]">
                {isDistributor ? 'Wholesale Logistics' : 'Point of Sale (POS)'}
              </span>
            </div>
          </div>
        </div>

        {/* Nav Items */}
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
                      isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
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

      {/* Footer */}
      <div className="p-4 border-t border-black/5">
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

export default PartnerSidebar;
