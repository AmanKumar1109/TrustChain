import React, { useState, useEffect } from 'react';
import { AdminTab } from './types';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminTopBar } from './components/AdminTopBar';

// 7 Admin Screens
import { AdminOverviewScreen } from './screens/AdminOverviewScreen';
import { BrandApprovalsScreen } from './screens/BrandApprovalsScreen';
import { FakeReportsScreen } from './screens/FakeReportsScreen';
import { UsersAndBrandsScreen } from './screens/UsersAndBrandsScreen';
import { RewardPartnersScreen } from './screens/RewardPartnersScreen';
import { AdminAnalyticsScreen } from './screens/AdminAnalyticsScreen';
import { SystemHealthScreen } from './screens/SystemHealthScreen';

interface AdminDashboardProps {
  onExitDashboard: () => void;
  onNavigateToVerify: () => void;
  initialTab?: AdminTab;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onExitDashboard,
  onNavigateToVerify,
  initialTab = 'overview',
}) => {
  const [currentTab, setCurrentTab] = useState<AdminTab>(initialTab);

  // Sync with URL query or hash if available
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as AdminTab;
    if (tabParam) {
      setCurrentTab(tabParam);
    }
  }, []);

  const handleSelectTab = (tab: AdminTab) => {
    setCurrentTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.pushState({}, '', url.toString());
  };

  const renderActiveScreen = () => {
    switch (currentTab) {
      case 'overview':
        return <AdminOverviewScreen onNavigateTab={handleSelectTab} />;
      case 'brand-approvals':
        return <BrandApprovalsScreen />;
      case 'fake-reports':
        return <FakeReportsScreen />;
      case 'users-brands':
        return <UsersAndBrandsScreen />;
      case 'reward-partners':
        return <RewardPartnersScreen />;
      case 'analytics':
        return <AdminAnalyticsScreen />;
      case 'system-health':
        return <SystemHealthScreen />;
      default:
        return <AdminOverviewScreen onNavigateTab={handleSelectTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex text-black font-sans selection:bg-black selection:text-white">
      {/* 1. Left Sidebar */}
      <AdminSidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onExitDashboard={onExitDashboard}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopBar
          onExitDashboard={onExitDashboard}
          onNavigateToVerify={onNavigateToVerify}
        />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-[96rem] w-full">
          {renderActiveScreen()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
