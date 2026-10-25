'use client';

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarV2 } from './SidebarV2';
import { TopHeaderV2 } from './TopHeaderV2';
import { ForgeAiCopilot } from './ForgeAiCopilot';
import { QuickActionModal } from './QuickActionModal';
import { SearchModal } from './SearchModal';
import { TestRunnerModal } from './TestRunnerModal';

export const LayoutV2: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [quickActionType, setQuickActionType] = useState<string | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showTestRunner, setShowTestRunner] = useState(false);

  const handleQuickAction = (type: string) => {
    if (type === 'RUN_TESTS') {
      setShowTestRunner(true);
    } else {
      setQuickActionType(type);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#090B0E] text-gray-100 font-sans">
      {/* Left Sidebar */}
      <SidebarV2 collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Global Top Bar */}
        <TopHeaderV2
          onOpenQuickAction={handleQuickAction}
          onOpenSearch={() => setShowSearchModal(true)}
        />

        {/* Dynamic Route Viewport */}
        <main className="flex-1 overflow-y-auto bg-[#090B0E] p-6 lg:p-8" style={{ background: '#090B0E' }}>
          <Outlet />
        </main>
      </div>

      {/* Floating Forge AI Copilot */}
      <ForgeAiCopilot />

      {/* Global Cmd+K Search Modal */}
      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
      />

      {/* Interactive Test Runner Modal */}
      <TestRunnerModal
        isOpen={showTestRunner}
        onClose={() => setShowTestRunner(false)}
      />

      {/* Quick Action Asset Creation Modal */}
      {quickActionType && (
        <QuickActionModal
          actionType={quickActionType}
          onClose={() => setQuickActionType(null)}
        />
      )}
    </div>
  );
};