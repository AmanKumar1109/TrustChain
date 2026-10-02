import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  LogOut,
  ExternalLink,
  Truck,
  Store,
  Star,
} from 'lucide-react';
import { PartnerRole } from '../types';

interface PartnerTopBarProps {
  role: PartnerRole;
  onChangeRole: (newRole: PartnerRole) => void;
  onExitDashboard: () => void;
  onNavigateToVerify: () => void;
}

export const PartnerTopBar: React.FC<PartnerTopBarProps> = ({
  role,
  onChangeRole,
  onExitDashboard,
  onNavigateToVerify,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const partnerName =
    role === 'distributor'
      ? 'National Pharma Logistics (Bhiwandi Hub)'
      : 'Apollo Pharmacy Retail Store #18 (Noida)';

  return (
    <header className="h-16 bg-white border-b border-black/5 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Partner Identity */}
      <div className="flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-semibold text-white ${
            role === 'distributor' ? 'bg-blue-600' : 'bg-emerald-600'
          }`}
        >
          {role === 'distributor' ? <Truck className="w-4 h-4" /> : <Store className="w-4 h-4" />}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-black">{partnerName}</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
              <span>98% Trust Score</span>
            </span>
          </div>
          <span className="text-[11px] text-black/50 block">Authorized Partner Node · GSTIN: 27AABCN8891P1Z9</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Role Switcher (Distributor vs Retailer) */}
        <div className="flex items-center p-1 bg-[#F5F5F5] rounded-full border border-black/5 text-xs font-medium">
          <button
            type="button"
            onClick={() => onChangeRole('distributor')}
            className={`px-3 py-1 rounded-full transition-all ${
              role === 'distributor'
                ? 'bg-black text-white shadow-sm'
                : 'text-black/60 hover:text-black'
            }`}
          >
            Distributor View
          </button>
          <button
            type="button"
            onClick={() => onChangeRole('retailer')}
            className={`px-3 py-1 rounded-full transition-all ${
              role === 'retailer'
                ? 'bg-black text-white shadow-sm'
                : 'text-black/60 hover:text-black'
            }`}
          >
            Retailer View
          </button>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full text-black/60 hover:text-black hover:bg-black/5 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-1.5 right-1.5" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl p-4 shadow-xl border border-black/10 animate-in fade-in duration-150 z-30 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-black/5 mb-3 font-semibold text-black">
                <span>Shipment & Sale Alerts</span>
                <span className="text-[10px] text-black/40">2 New</span>
              </div>
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200">
                  <span className="font-semibold text-blue-900 block">New Batch Dispatched</span>
                  <span className="text-blue-800 text-[11px]">
                    Cipla dispatched 5,000 units of Batch #DEL99 to your hub.
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F5F5F5]">
                  <span className="font-semibold text-black block">Custody Confirmed</span>
                  <span className="text-black/60 text-[11px]">
                    Customer verified Asthalin Inhaler #TC-8821.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default PartnerTopBar;
