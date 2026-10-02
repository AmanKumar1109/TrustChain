import React, { useState, useEffect } from 'react';
import { PartnerRole, PartnerTab } from './types';
import { PartnerSidebar } from './components/PartnerSidebar';
import { PartnerTopBar } from './components/PartnerTopBar';

// Screens
import { PartnerOverviewScreen } from './screens/PartnerOverviewScreen';
import { IncomingShipmentsScreen } from './screens/IncomingShipmentsScreen';
import { InventoryScreen } from './screens/InventoryScreen';
import { TransferScreen } from './screens/TransferScreen';
import { ScanAndSellScreen } from './screens/ScanAndSellScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { ReputationScreen } from './screens/ReputationScreen';
import { PartnerSettingsScreen } from './screens/PartnerSettingsScreen';

interface PartnerDashboardProps {
  onExitDashboard: () => void;
  onNavigateToVerify: () => void;
  initialRole?: PartnerRole;
}

export const PartnerDashboard: React.FC<PartnerDashboardProps> = ({
  onExitDashboard,
  onNavigateToVerify,
  initialRole = 'distributor',
}) => {
  const [role, setRole] = useState<PartnerRole>(initialRole);
  const [currentTab, setCurrentTab] = useState<PartnerTab>('overview');

  const handleChangeRole = (newRole: PartnerRole) => {
    setRole(newRole);
    // If switching role, ensure tab is valid
    if (newRole === 'distributor' && currentTab === 'scan-and-sell') {
      setCurrentTab('overview');
    } else if (newRole === 'retailer' && currentTab === 'transfer') {
      setCurrentTab('overview');
    }
  };

  const renderScreen = () => {
    switch (currentTab) {
      case 'overview':
        return <PartnerOverviewScreen role={role} onNavigateTab={setCurrentTab} />;
      case 'incoming':
        return <IncomingShipmentsScreen />;
      case 'inventory':
        return <InventoryScreen />;
      case 'transfer':
        return <TransferScreen />;
      case 'scan-and-sell':
        return <ScanAndSellScreen />;
      case 'history':
        return <HistoryScreen role={role} />;
      case 'reputation':
        return <ReputationScreen role={role} />;
      case 'settings':
        return <PartnerSettingsScreen role={role} />;
      default:
        return <PartnerOverviewScreen role={role} onNavigateTab={setCurrentTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex text-black font-sans selection:bg-black selection:text-white">
      {/* 1. Left Sidebar (adapts to role) */}
      <PartnerSidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        role={role}
        onExitDashboard={onExitDashboard}
      />

      {/* 2. Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <PartnerTopBar
          role={role}
          onChangeRole={handleChangeRole}
          onExitDashboard={onExitDashboard}
          onNavigateToVerify={onNavigateToVerify}
        />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-[96rem] w-full">
          {renderScreen()}
        </main>
      </div>
    </div>
  );
};

export default PartnerDashboard;
