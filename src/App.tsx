'use client';

import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LayoutV2 } from './components/v2/LayoutV2';
import { CommandCenterPage } from './pages/v2/CommandCenterPage';
import { BugTrackerPage } from './pages/v2/BugTrackerPage';
import { ApiClientPage } from './pages/v2/ApiClientPage';
import { TestManagementPage } from './pages/v2/TestManagementPage';
import { AiAssistantPage } from './pages/v2/AiAssistantPage';
import { QaAnalyticsPage } from './pages/v2/QaAnalyticsPage';
import { AutomationIdePage } from './pages/v2/AutomationIdePage';
import { PerformanceTestingPage } from './pages/v2/PerformanceTestingPage';
import { SecurityTestingPage } from './pages/v2/SecurityTestingPage';
import { CrossBrowserPage } from './pages/v2/CrossBrowserPage';
import { DocsTraceabilityPage } from './pages/v2/DocsTraceabilityPage';
import { IntegrationsPage } from './pages/v2/IntegrationsPage';
import { PricingPageV2 } from './pages/v2/PricingPageV2';
import { SettingsPageV2 } from './pages/v2/SettingsPageV2';
import { AuthPage } from './pages/AuthPage';
import { RegisterPage } from './pages/RegisterPage';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    const titles: Record<string, string> = {
      '/': 'QA Command Center — ForgeQA v2.0',
      '/dashboard': 'QA Command Center — ForgeQA v2.0',
      '/bugs': 'Bug Tracker & Defects — ForgeQA v2.0',
      '/api-client': 'API Testing Client — ForgeQA v2.0',
      '/test-management': 'Test Management & Runs — ForgeQA v2.0',
      '/assistant': 'Forge AI Copilot — ForgeQA v2.0',
      '/analytics': 'QA Intelligence & Analytics — ForgeQA v2.0',
      '/automation': 'Automation IDE & Cloud Runner — ForgeQA v2.0',
      '/performance': 'Performance & Load Testing — ForgeQA v2.0',
      '/security': 'Security OWASP Scanner — ForgeQA v2.0',
      '/cross-browser': 'Cross-Browser & Visual Diff — ForgeQA v2.0',
      '/docs': 'PRD & Traceability — ForgeQA v2.0',
      '/integrations': 'Integrations Hub — ForgeQA v2.0',
      '/pricing': 'Plans & Pricing — ForgeQA v2.0',
      '/settings': 'Platform Settings — ForgeQA v2.0',
      '/auth': 'Sign In — ForgeQA v2.0',
      '/register': 'Register — ForgeQA v2.0'
    };
    document.title = titles[pathname] || 'ForgeQA v2.0 — All-in-One AI Testing Platform';
  }, [pathname]);

  return (
    <ErrorBoundary>
      <Routes>
        {/* Auth standalone routes */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ForgeQA v2 Main App Shell */}
        <Route element={<LayoutV2 />}>
          <Route path="/" element={<CommandCenterPage />} />
          <Route path="/dashboard" element={<CommandCenterPage />} />
          <Route path="/bugs" element={<BugTrackerPage />} />
          <Route path="/defects" element={<Navigate to="/bugs" replace />} />
          <Route path="/api-client" element={<ApiClientPage />} />
          <Route path="/test-management" element={<TestManagementPage />} />
          <Route path="/test-runs" element={<Navigate to="/test-management" replace />} />
          <Route path="/test-cases" element={<Navigate to="/test-management" replace />} />
          <Route path="/generator" element={<Navigate to="/test-management" replace />} />
          <Route path="/assistant" element={<AiAssistantPage />} />
          <Route path="/analytics" element={<QaAnalyticsPage />} />
          <Route path="/automation" element={<AutomationIdePage />} />
          <Route path="/test-scripts" element={<Navigate to="/automation" replace />} />
          <Route path="/performance" element={<PerformanceTestingPage />} />
          <Route path="/security" element={<SecurityTestingPage />} />
          <Route path="/cross-browser" element={<CrossBrowserPage />} />
          <Route path="/docs" element={<DocsTraceabilityPage />} />
          <Route path="/knowledge" element={<Navigate to="/docs" replace />} />
          <Route path="/prd-generator" element={<Navigate to="/docs" replace />} />
          <Route path="/integrations" element={<IntegrationsPage />} />
          <Route path="/pricing" element={<PricingPageV2 />} />
          <Route path="/billing" element={<Navigate to="/pricing" replace />} />
          <Route path="/settings" element={<SettingsPageV2 />} />
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}