import React, { useState } from 'react';
import {
  Bell,
  Search,
  ShieldAlert,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  Activity,
  User,
  Shield,
  Clock,
} from 'lucide-react';

interface AdminTopBarProps {
  onExitDashboard: () => void;
  onNavigateToVerify: () => void;
}

export const AdminTopBar: React.FC<AdminTopBarProps> = ({
  onExitDashboard,
  onNavigateToVerify,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'New Brand Application',
      desc: 'Sun Pharma Ltd submitted GST and license documents.',
      time: '12m ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Urgent Fake Report',
      desc: 'Duplicate QR code detected simultaneously in 2 cities.',
      time: '45m ago',
      unread: true,
    },
    {
      id: 3,
      title: 'Relayer Gas Refill Success',
      desc: '₹50,000 auto-credited to Polygon sponsorship pool.',
      time: '2h ago',
      unread: false,
    },
  ];

  return (
    <header className="h-16 bg-white border-b border-black/10 px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Left: Quick Search */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-black/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search brands, GST, batch IDs, or reports..."
            className="w-full pl-9 pr-4 py-2 bg-[#F5F5F5] border border-black/5 rounded-full text-xs text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
          />
        </div>
      </div>

      {/* Right: Network Status, Notifications & Admin Menu */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Network Status Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Polygon PoS Mainnet • 18 Gwei</span>
        </div>

        {/* Public Verify Link */}
        <button
          type="button"
          onClick={onNavigateToVerify}
          className="hidden sm:flex items-center gap-1.5 text-xs text-black/60 hover:text-black font-medium transition-colors"
        >
          <span>Verify Page</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full hover:bg-black/5 text-black/70 hover:text-black transition-colors"
            aria-label="Admin Alerts"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-xl border border-black/10 p-4 space-y-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-black/5">
                <span className="text-xs font-semibold text-black">HQ Operations Alerts</span>
                <span className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                  2 Pending
                </span>
              </div>

              <div className="space-y-2.5">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-2xl text-xs transition-colors ${
                      n.unread ? 'bg-[#2B2644]/5 border border-[#2B2644]/10' : 'bg-[#F5F5F5]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold text-black">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-black/40 font-normal">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-black/60 mt-1 leading-snug">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-black/10">
          <div className="w-8 h-8 rounded-full bg-[#1E1A30] text-white flex items-center justify-center font-bold text-xs shadow-sm">
            HQ
          </div>
          <div className="hidden lg:block text-left">
            <span className="text-xs font-semibold text-black block leading-none">TrustChain SecOps</span>
            <span className="text-[10px] text-black/40 leading-none">Super Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopBar;
