import React, { useState } from 'react';
import {
  Bell,
  Search,
  CheckCircle2,
  ChevronDown,
  Building2,
  LogOut,
  ExternalLink,
  Shield,
  Sparkles,
} from 'lucide-react';

interface TopBarProps {
  brandName?: string;
  onExitDashboard: () => void;
  onNavigateToVerify: () => void;
}

export const ManufacturerTopBar: React.FC<TopBarProps> = ({
  brandName = 'Cipla Healthcare India Ltd.',
  onExitDashboard,
  onNavigateToVerify,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    {
      id: '1',
      title: 'High Clone Anomaly Flagged',
      detail: '14 duplicate scans detected in Bengaluru on Batch #BT-8820.',
      time: '12m ago',
      urgent: true,
    },
    {
      id: '2',
      title: 'Partner Transfer Accepted',
      detail: 'Metro Distributors accepted 2,500 units of Batch #DEL99.',
      time: '1h ago',
      urgent: false,
    },
    {
      id: '3',
      title: 'Polygon Batch Minted',
      detail: 'Batch #B-90214 minted on Polygon block #62,819,401.',
      time: '4h ago',
      urgent: false,
    },
  ];

  return (
    <header className="h-16 bg-white border-b border-black/5 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Brand Identity / Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center text-xs font-semibold">
          CH
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-black">{brandName}</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Verified Brand</span>
            </span>
          </div>
          <span className="text-[11px] text-black/50 block">GSTIN: 27AABCU9603R1ZX · Polygon Node #401</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Available QR Credits pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F5F5F5] border border-black/5 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-black/60">Credits:</span>
          <span className="font-medium text-black">84,200 / 100,000 QRs</span>
        </div>

        {/* Quick test public verify button */}
        <button
          type="button"
          onClick={onNavigateToVerify}
          className="hidden lg:inline-flex items-center gap-1.5 text-xs font-medium text-black/70 hover:text-black bg-[#F5F5F5] hover:bg-black/5 px-3 py-1.5 rounded-full border border-black/5 transition-colors"
        >
          <span>Test Public Verify Page</span>
          <ExternalLink className="w-3 h-3 text-black/40" />
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 rounded-full text-black/60 hover:text-black hover:bg-black/5 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl p-4 shadow-xl border border-black/10 animate-in fade-in duration-150 z-30">
              <div className="flex items-center justify-between pb-3 border-b border-black/5 mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-black">
                  Security Alerts & Activity
                </span>
                <span className="text-[10px] text-black/50">3 New</span>
              </div>

              <div className="space-y-2.5">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl text-xs ${
                      n.urgent ? 'bg-rose-50 border border-rose-200' : 'bg-[#F5F5F5]'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span
                        className={`font-semibold ${
                          n.urgent ? 'text-rose-900' : 'text-black'
                        }`}
                      >
                        {n.title}
                      </span>
                      <span className="text-[10px] text-black/40">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-black/70 leading-snug">{n.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full bg-[#F5F5F5] hover:bg-black/5 border border-black/5 transition-colors"
          >
            <span className="text-xs font-medium text-black">Dr. Rajesh Varma</span>
            <div className="w-6 h-6 rounded-full bg-black text-white text-[10px] flex items-center justify-center font-bold">
              RV
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-black/40" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl p-3 shadow-xl border border-black/10 animate-in fade-in duration-150 z-30 text-xs">
              <div className="px-3 py-2 border-b border-black/5 mb-2">
                <span className="font-medium text-black block">rajesh.varma@cipla.com</span>
                <span className="text-black/50 text-[11px]">Compliance & Supply Admin</span>
              </div>

              <button
                type="button"
                onClick={onExitDashboard}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-black hover:bg-black/5 transition-colors text-left"
              >
                <LogOut className="w-3.5 h-3.5 text-black/50" />
                <span>Exit Dashboard</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default ManufacturerTopBar;
