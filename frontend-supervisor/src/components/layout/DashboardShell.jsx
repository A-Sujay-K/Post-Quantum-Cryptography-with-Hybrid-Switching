import React from 'react';
import NavBar from './NavBar';
import BackgroundStack from '../../theme/BackgroundStack';
import { useDashboardState } from '../../hooks/useDashboardState';
import AnalyticsPanel from '../panels/AnalyticsPanel';
import InfrastructurePanel from '../panels/InfrastructurePanel';

const DashboardShell = ({ children }) => {
  const { activeLane, activeTab } = useDashboardState();

  return (
    <BackgroundStack variant="supervisor" activeLane={activeLane} className="h-screen flex flex-col overflow-hidden font-sans">
      <NavBar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 lg:p-6 relative z-10">
        <div className="max-w-[1920px] mx-auto h-full">
          {(!activeTab || activeTab === 'Dashboard') && children}
          {activeTab === 'Analytics' && <AnalyticsPanel />}
          {activeTab === 'Infrastructure' && <InfrastructurePanel />}
        </div>
      </main>
    </BackgroundStack>
  );
};

export default DashboardShell;
