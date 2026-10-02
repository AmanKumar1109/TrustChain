import React from 'react';
import {
  LayoutDashboard,
  Building2,
  ShieldAlert,
  Users,
  Gift,
  BarChart3,
  Activity,
  ArrowLeft,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { AdminTab } from '../types';
import { LogoIcon } from '../../../components/common/LogoIcon';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onExitDashboard: () => void;
  pendingApprovalsCount?: number;
  unresolvedReportsCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  onExitDashboard,
  pendingApprovalsCount = 3,
  unresolvedReportsCount = 5,
}) => {
  const menuItems = [
    { id: 'overview' as AdminTab, label: 'Overview', icon: LayoutDashboard },
    {
      id: 'brand-approvals' as AdminTab,
      label: 'Brand Approvals',
      icon: Building2,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'fake-reports' as AdminTab,
      label: 'Fake Reports',
      icon: ShieldAlert,
      badge: unresolvedReportsCount > 0 ? unresolvedReportsCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    { id: 'users-brands' as AdminTab, label: 'Users and Brands', icon: Users },
    { id: 'reward-partners' as AdminTab, label: 'Reward Partners', icon: Gift },
    { id: 'analytics' as AdminTab, label: 'Analytics', icon: BarChart3 },
    { id: 'system-health' as AdminTab, label: 'System Health', icon: Activity },
  ];

  return (
    <aside className="w-64 bg-[#1E1A30] text-white flex flex-col shrink-0 min-h-screen border-r border-white/5 select-none">
      {/* Top Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white">
            <LogoIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-base leading-tight tracking-tight text-white flex items-center gap-1.5">
              TrustChain
              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                HQ
              </span>
            </h1>
            <span className="text-xs text-white/50">Admin Console</span>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-semibold text-white/40 uppercase tracking-wider">
          Platform Governance
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-white text-[#1E1A30] font-semibold shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#1E1A30]' : 'text-white/60'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-[#1E1A30] text-white' : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-white/10 space-y-3">
        <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-xs space-y-1">
          <div className="flex items-center justify-between text-white/60 text-[11px]">
            <span>Polygon Gas Relayer</span>
            <span className="text-emerald-400 font-medium">99.98%</span>
          </div>
          <div className="text-sm font-semibold text-white font-mono">₹1,42,850</div>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full w-[72%]" />
          </div>
        </div>

        <button
          type="button"
          onClick={onExitDashboard}
          className="w-full py-2.5 px-3 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Main Site</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
