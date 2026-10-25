'use client';

import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  ShieldCheck,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  Layers
} from 'lucide-react';
import { useForgeStore } from '../../store/useForgeStore';

export const QaAnalyticsPage: React.FC = () => {
  const { bugs, testCases, testRuns } = useForgeStore();

  const handleExport = (format: string) => {
    alert(`Exporting QA Executive Quality Report as .${format}...`);
  };

  const moduleDensity = [
    { module: 'Checkout & Payments', testCount: 48, openDefects: 4, passRate: 91.6, density: '0.08 def/tc', risk: 'HIGH' },
    { module: 'Authentication & Session', testCount: 32, openDefects: 3, passRate: 93.7, density: '0.09 def/tc', risk: 'HIGH' },
    { module: 'API Gateway & Ingestion', testCount: 64, openDefects: 1, passRate: 100, density: '0.01 def/tc', risk: 'LOW' },
    { module: 'User Profile & Settings', testCount: 22, openDefects: 2, passRate: 95.4, density: '0.09 def/tc', risk: 'MED' }
  ];

  const flakyTests = [
    { id: 'TC-302', name: 'Concurrent token refresh under 50 simultaneous requests', failCount: 6, passCount: 14, flakinessScore: 30, cause: 'Race condition on refresh token interceptor' },
    { id: 'TC-308', name: 'Live cart drawer recalculation animation', failCount: 3, passCount: 25, flakinessScore: 10.7, cause: 'Dynamic locator animation frame timing' },
    { id: 'TC-319', name: 'Third-party Stripe webhook acknowledgment', failCount: 4, passCount: 28, flakinessScore: 12.5, cause: 'Sandbox webhook dispatcher latency' }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#11141B] border border-white/8 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              QA Intelligence & Executive Analytics
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 font-mono font-bold">
                Sprint 42
              </span>
            </h1>
            <p className="text-xs text-gray-400">
              Cross-platform quality metrics, defect injection density, and flaky test diagnostics.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('PDF')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-200 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={() => handleExport('CSV')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-200 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Cards: Quality Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#11141B] border border-white/8 shadow-lg">
          <span className="text-xs text-gray-400 font-semibold block mb-1">Release Readiness Score</span>
          <div className="text-3xl font-extrabold font-mono text-teal-400 mb-1">87 / 100</div>
          <span className="text-[11px] text-teal-300 font-semibold">Grade A- (Meets Quality Gate)</span>
        </div>
        <div className="p-5 rounded-2xl bg-[#11141B] border border-white/8 shadow-lg">
          <span className="text-xs text-gray-400 font-semibold block mb-1">Defect Leakage to Staging</span>
          <div className="text-3xl font-extrabold font-mono text-amber-400 mb-1">2.4%</div>
          <span className="text-[11px] text-gray-400">-1.8% lower than industry benchmark</span>
        </div>
        <div className="p-5 rounded-2xl bg-[#11141B] border border-white/8 shadow-lg">
          <span className="text-xs text-gray-400 font-semibold block mb-1">Mean Time to Resolution (MTTR)</span>
          <div className="text-3xl font-extrabold font-mono text-white mb-1">4.2 hrs</div>
          <span className="text-[11px] text-gray-400">Critical bugs resolved within 6h SLA</span>
        </div>
        <div className="p-5 rounded-2xl bg-[#11141B] border border-white/8 shadow-lg">
          <span className="text-xs text-gray-400 font-semibold block mb-1">Flakiness Index</span>
          <div className="text-3xl font-extrabold font-mono text-purple-400 mb-1">3.1%</div>
          <span className="text-[11px] text-purple-300">3 flaky tests under AI monitoring</span>
        </div>
      </div>

      {/* Microservice Defect Density Table */}
      <div className="p-6 rounded-2xl bg-[#11141B] border border-white/8 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white">Module Defect Density & Test Coverage Heatmap</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/8 text-gray-400 text-[10px] uppercase font-mono">
                <th className="pb-3">Module Name</th>
                <th className="pb-3">Total Tests</th>
                <th className="pb-3">Open Defects</th>
                <th className="pb-3">Pass Rate</th>
                <th className="pb-3">Defect Density</th>
                <th className="pb-3 text-right">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/6 text-gray-200">
              {moduleDensity.map((m, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition">
                  <td className="py-3 font-semibold text-white">{m.module}</td>
                  <td className="py-3 font-mono">{m.testCount}</td>
                  <td className="py-3 font-mono text-rose-400 font-bold">{m.openDefects}</td>
                  <td className="py-3 font-mono text-teal-400 font-bold">{m.passRate}%</td>
                  <td className="py-3 font-mono text-gray-300">{m.density}</td>
                  <td className="py-3 text-right">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        m.risk === 'HIGH' ? 'bg-rose-500/20 text-rose-400' : 'bg-teal-500/20 text-teal-400'
                      }`}
                    >
                      {m.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Flaky Test Radar Table */}
      <div className="p-6 rounded-2xl bg-[#11141B] border border-white/8 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-bold text-white">AI Flaky Test Detective (High Retry Frequency)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/8 text-gray-400 text-[10px] uppercase font-mono">
                <th className="pb-3">Test ID</th>
                <th className="pb-3">Test Specification</th>
                <th className="pb-3">Fail/Pass Ratio</th>
                <th className="pb-3">Flakiness Score</th>
                <th className="pb-3">AI Diagnostic Finding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/6 text-gray-200">
              {flakyTests.map((ft) => (
                <tr key={ft.id} className="hover:bg-white/5 transition">
                  <td className="py-3 font-mono text-amber-400 font-bold">{ft.id}</td>
                  <td className="py-3 font-medium text-white max-w-sm truncate">{ft.name}</td>
                  <td className="py-3 font-mono text-gray-300">{ft.failCount}F / {ft.passCount}P</td>
                  <td className="py-3 font-mono text-purple-400 font-bold">{ft.flakinessScore}%</td>
                  <td className="py-3 text-gray-400 leading-relaxed text-[11px]">{ft.cause}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};