import React, { useState, useEffect } from 'react';
import { ManufacturerTab } from './types';
import { ManufacturerSidebar } from './components/ManufacturerSidebar';
import { ManufacturerTopBar } from './components/ManufacturerTopBar';

// 11 Screens
import { OverviewScreen } from './screens/OverviewScreen';
import { ProductsScreen } from './screens/ProductsScreen';
import { BatchesScreen } from './screens/BatchesScreen';
import { SupplyChainScreen } from './screens/SupplyChainScreen';
import { PartnersScreen } from './screens/PartnersScreen';
import { HotspotMapScreen } from './screens/HotspotMapScreen';
import { ScanAnalyticsScreen } from './screens/ScanAnalyticsScreen';
import { RecallScreen } from './screens/RecallScreen';
import { RewardsCampaignScreen } from './screens/RewardsCampaignScreen';
import { BillingScreen } from './screens/BillingScreen';
import { SettingsScreen } from './screens/SettingsScreen';

interface ManufacturerDashboardProps {
  onExitDashboard: () => void;
  onNavigateToVerify: () => void;
  initialTab?: ManufacturerTab;
}

export const ManufacturerDashboard: React.FC<ManufacturerDashboardProps> = ({
  onExitDashboard,
  onNavigateToVerify,
  initialTab = 'overview',
}) => {
  const [currentTab, setCurrentTab] = useState<ManufacturerTab>(initialTab);
  const [brandName, setBrandName] = useState<string>('Cipla Healthcare India Ltd.');

  useEffect(() => {
    const session = (window as any).api?.auth?.getSession?.() || null;
    if (session?.companyName) {
      setBrandName(session.companyName);
    }
  }, []);

  // Sync with URL query or hash if available
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as ManufacturerTab;
    if (tabParam) {
      setCurrentTab(tabParam);
    }
  }, []);

  const handleSelectTab = (tab: ManufacturerTab) => {
    setCurrentTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.pushState({}, '', url.toString());
  };

  const renderActiveScreen = () => {
    switch (currentTab) {
      case 'overview':
        return <OverviewScreen />;
      case 'products':
        return <ProductsScreen />;
      case 'batches':
        return <BatchesScreen />;
      case 'supply-chain':
        return <SupplyChainScreen />;
      case 'partners':
        return <PartnersScreen />;
      case 'hotspots':
        return <HotspotMapScreen />;
      case 'analytics':
        return <ScanAnalyticsScreen />;
      case 'recall':
        return <RecallScreen />;
      case 'rewards':
        return <RewardsCampaignScreen />;
      case 'billing':
        return <BillingScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <OverviewScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex text-black font-sans selection:bg-black selection:text-white">
      {/* 1. Left Sidebar */}
      <ManufacturerSidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onExitDashboard={onExitDashboard}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <ManufacturerTopBar
          brandName={brandName}
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

export default ManufacturerDashboard;
