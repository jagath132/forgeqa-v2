'use client';

import React, { useState } from 'react';
import {
  CheckSquare,
  Play,
  Plus,
  FolderTree,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Link2,
  GitBranch,
  Layers
} from 'lucide-react';
import { useForgeStore } from '../../store/useForgeStore';

export const TestManagementPage: React.FC = () => {
  const { testSuites, testCases, testRuns, updateTestCaseStatus, updateRunStep, sendAiMessage } = useForgeStore();
  const [activeTab, setActiveTab] = useState<'SUITES' | 'RUNS' | 'TRACEABILITY'>('SUITES');
  const [selectedSuiteId, setSelectedSuiteId] = useState<string>('ALL');
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<string | null>(null);

  const filteredCases = testCases.filter((tc) => selectedSuiteId === 'ALL' || tc.suiteId === selectedSuiteId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#11141B] border border-white/8 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Test Management & Live Execution
              <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30 font-mono font-bold">
                {testCases.length} Test Cases
              </span>
            </h1>
            <p className="text-xs text-gray-400">
              Requirements traceability, suite organization, and real-time step execution tracking.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#171B24] border border-white/8 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('SUITES')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'SUITES' ? 'bg-amber-500 text-black font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            Suites & Test Cases
          </button>
          <button
            onClick={() => setActiveTab('RUNS')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'RUNS' ? 'bg-amber-500 text-black font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            Live Test Runs
          </button>
          <button
            onClick={() => setActiveTab('TRACEABILITY')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'TRACEABILITY' ? 'bg-amber-500 text-black font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            Traceability Matrix
          </button>
        </div>
      </div>

      {activeTab === 'SUITES' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Suite Tree Sidebar */}
          <div className="p-4 rounded-2xl bg-[#11141B] border border-white/8 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/8">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Test Suites</span>
              <span className="text-[10px] font-mono text-gray-500">{testSuites.length} Suites</span>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => setSelectedSuiteId('ALL')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition ${
                  selectedSuiteId === 'ALL'
                    ? 'bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                All Test Suites ({testCases.length})
              </button>

              {testSuites.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSuiteId(s.id)}
                  className={`w-full text-left p-3 rounded-xl border transition ${
                    selectedSuiteId === s.id
                      ? 'bg-amber-500/15 border-amber-500/30 text-white'
                      : 'bg-[#171B24] border-white/6 text-gray-300 hover:border-white/15'
                  }`}
                >
                  <div className="text-xs font-bold text-white mb-1 truncate">{s.name}</div>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                    <span>{s.testCaseCount} tests</span>
                    <span className="text-teal-400 font-bold">{s.passRate}% pass</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Test Case Table */}
          <div className="lg:col-span-3 p-6 rounded-2xl bg-[#11141B] border border-white/8 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Test Cases in Suite</h3>
              <button
                onClick={() => sendAiMessage('Generate automated test cases with boundary scenarios for selected suite')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold hover:bg-amber-500/20 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Test Expander</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/8 text-gray-400 text-[10px] uppercase font-mono">
                    <th className="pb-3">ID</th>
                    <th className="pb-3">Title & Verification Scope</th>
                    <th className="pb-3">Suite</th>
                    <th className="pb-3">Priority</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/6">
                  {filteredCases.map((tc) => (
                    <tr
                      key={tc.id}
                      onClick={() => setSelectedTestCaseId(tc.id)}
                      className="hover:bg-white/5 transition cursor-pointer"
                    >
                      <td className="py-3 font-mono font-bold text-amber-400">{tc.id}</td>
                      <td className="py-3 font-medium text-white max-w-sm truncate">{tc.title}</td>
                      <td className="py-3 text-gray-400 text-[11px] truncate max-w-[140px]">{tc.suiteName}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-white/5 text-gray-300">
                          {tc.priority}
                        </span>
                      </td>
                      <td className="py-3 text-teal-400 font-mono text-[10px]">{tc.type}</td>
                      <td className="py-3 text-right">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                            tc.status === 'PASSED'
                              ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                              : tc.status === 'FAILED'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-white/5 text-gray-400'
                          }`}
                        >
                          {tc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'TRACEABILITY' && (
        <div className="p-6 rounded-2xl bg-[#11141B] border border-white/8 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/8">
            <div>
              <h3 className="text-sm font-bold text-white">Bi-Directional Traceability Matrix</h3>
              <p className="text-xs text-gray-400">Track Requirement → Acceptance Criteria → Test Cases → Logged Defect</p>
            </div>
            <span className="text-xs font-mono text-teal-400 font-bold px-2.5 py-1 rounded bg-teal-500/10 border border-teal-500/25">
              91.4% Coverage Complete
            </span>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#171B24] border border-white/6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-400">REQ-CHECKOUT-01: Support 3DS 2.0 Biometric Card Challenge</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-400 font-bold">COVERED</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-2 text-gray-300">
                <div className="p-2.5 rounded bg-black/30 border border-white/6">
                  <span className="text-[10px] text-gray-400 block font-mono">ACCEPTANCE CRITERIA</span>
                  <span>AC-1: Card mandates 3DS challenge frame</span>
                </div>
                <div className="p-2.5 rounded bg-black/30 border border-white/6">
                  <span className="text-[10px] text-gray-400 block font-mono">LINKED TEST CASE</span>
                  <span className="text-teal-400 font-mono font-bold">TC-301: European SCA 3DS validation</span>
                </div>
                <div className="p-2.5 rounded bg-black/30 border border-white/6">
                  <span className="text-[10px] text-gray-400 block font-mono">LINKED DEFECT</span>
                  <span className="text-rose-400 font-mono font-bold">BUG-1042: Signature buffer mismatch</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#171B24] border border-white/6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-400">REQ-AUTH-02: Seamless Token Refresh Concurrency</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold">GAP IDENTIFIED</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-2 text-gray-300">
                <div className="p-2.5 rounded bg-black/30 border border-white/6">
                  <span className="text-[10px] text-gray-400 block font-mono">ACCEPTANCE CRITERIA</span>
                  <span>AC-2: Single refresh for 50 concurrent 401s</span>
                </div>
                <div className="p-2.5 rounded bg-black/30 border border-white/6">
                  <span className="text-[10px] text-gray-400 block font-mono">LINKED TEST CASE</span>
                  <span className="text-rose-400 font-mono font-bold">TC-302: Concurrent token refresh</span>
                </div>
                <div className="p-2.5 rounded bg-black/30 border border-white/6">
                  <span className="text-[10px] text-gray-400 block font-mono">LINKED DEFECT</span>
                  <span className="text-rose-400 font-mono font-bold">BUG-1043: Queue drop on refresh</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'RUNS' && (
        <div className="p-6 rounded-2xl bg-[#11141B] border border-white/8 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white">Live Execution Runs Tracker</h3>
          <div className="space-y-4">
            {testRuns.map((run) => (
              <div key={run.id} className="p-4 rounded-xl bg-[#171B24] border border-white/6 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-amber-400 mr-2">{run.id}</span>
                    <span className="text-xs font-bold text-white">{run.name}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-teal-500/20 text-teal-400 border border-teal-500/30">
                    {run.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-gray-300">
                  <div>Passed: <strong className="text-teal-400">{run.passed}</strong></div>
                  <div>Failed: <strong className="text-rose-400">{run.failed}</strong></div>
                  <div>Skipped: <strong>{run.skipped}</strong></div>
                  <div>Runner: <span className="text-gray-400">{run.executedBy}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};