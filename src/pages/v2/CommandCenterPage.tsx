'use client';

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Bug,
  CheckCircle2,
  AlertTriangle,
  Play,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  Zap,
  Activity,
  Layers,
  Clock,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { useForgeStore } from '../../store/useForgeStore';
import { DailyBriefingModal } from '../../components/v2/DailyBriefingModal';
import { TestRunnerModal } from '../../components/v2/TestRunnerModal';

export const CommandCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const { bugs, testCases, testRuns, activeWorkspace, activeEnvironment } = useForgeStore();
  const [showBriefing, setShowBriefing] = useState(false);
  const [showRunner, setShowRunner] = useState(false);

  const openBugs = bugs.filter((b) => b.status !== 'CLOSED');
  const criticalBugs = openBugs.filter((b) => b.severity === 'CRITICAL');
  const totalTests = testCases.length;
  const passedTests = testCases.filter((t) => t.status === 'PASSED').length;

  const kpis = [
    {
      label: 'Executive Quality Score',
      value: '87/100',
      change: '+4.2% this sprint',
      status: 'Release Ready',
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/10 border-teal-500/25',
      icon: ShieldCheck
    },
    {
      label: 'Test Case Automation',
      value: '82.6%',
      change: '1,420 total cases',
      status: 'Healthy Coverage',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/25',
      icon: CheckCircle2
    },
    {
      label: 'Open Defect Backlog',
      value: openBugs.length.toString(),
      change: `${criticalBugs.length} Critical P0`,
      status: 'Action Required',
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10 border-rose-500/25',
      icon: Bug
    },
    {
      label: 'Flaky Tests Identified',
      value: '3',
      change: 'Avg retry count: 2.1',
      status: 'AI Diagnostic Available',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/25',
      icon: Zap
    }
  ];

  const riskRadar = [
    { service: 'Checkout & Payments (Stripe 3DS)', module: 'Billing & Payments', risk: 89, level: 'CRITICAL', reason: 'Webhook buffer validation error BUG-1042' },
    { service: 'Authentication & Session Token', module: 'Auth & Session', risk: 68, level: 'HIGH', reason: 'Concurrent 401 refresh drop TC-302' },
    { service: 'Catalog Search & Query Filter', module: 'Security & Auth', risk: 42, level: 'MEDIUM', reason: 'Reflected XSS finding SEC-801' },
    { service: 'Order Invoicing & Export', module: 'Checkout Flow', risk: 14, level: 'LOW', reason: 'All regression tests passing' }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#171B24] via-[#11141B] to-[#171B24] border border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Sprint 42 Active
            </span>
            <span className="text-xs text-gray-400 font-mono">Target: Release v2.4.0 (5 days remaining)</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>QA Command Center</span>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/10">
              {activeEnvironment}
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl leading-relaxed">
            Real-time quality telemetry unifying test runs, defect backlog, automated scans, and release confidence scoring.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowBriefing(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-200 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Daily Briefing</span>
          </button>
          <button
            onClick={() => setShowRunner(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-lg shadow-amber-500/20 transition"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>Run Test Suite</span>
          </button>
        </div>
      </div>

      {/* KPI 4-Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#11141B] border border-white/8 hover:border-white/15 transition relative group overflow-hidden shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-400">{kpi.label}</span>
                <div className={`p-2 rounded-xl border ${kpi.bgColor}`}>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
              </div>
              <div className="text-3xl font-extrabold font-mono text-white mb-1 tracking-tight">
                {kpi.value}
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-400">{kpi.change}</span>
                <span className={`font-semibold ${kpi.color}`}>{kpi.status}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Grid: AI Risk Radar & Live Execution Ticker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Risk Radar (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#11141B] border border-white/8 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">AI Service Risk Radar</h3>
                <p className="text-[11px] text-gray-400">Predicted failure probability based on code churn & defect density</p>
              </div>
            </div>
            <span className="text-xs font-mono text-amber-400 font-bold px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25">
              4 Microservices Monitored
            </span>
          </div>

          <div className="space-y-4">
            {riskRadar.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#171B24] border border-white/6 hover:border-white/12 transition">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{item.service}</span>
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded font-mono ${
                        item.level === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : item.level === 'HIGH'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                      }`}
                    >
                      {item.level}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-white">{item.risk}% Risk</span>
                </div>

                <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.risk > 75 ? 'bg-rose-500' : item.risk > 50 ? 'bg-amber-500' : 'bg-teal-500'
                    }`}
                    style={{ width: `${item.risk}%` }}
                  />
                </div>
                <div className="text-[11px] text-gray-400 flex items-center justify-between">
                  <span>{item.reason}</span>
                  <button
                    onClick={() => navigate('/bugs')}
                    className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    Triage Defect <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Test Runs Stream (1 col) */}
        <div className="p-6 rounded-2xl bg-[#11141B] border border-white/8 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-teal-400 fill-teal-400" />
              <h3 className="text-sm font-bold text-white">Active Test Runs</h3>
            </div>
            <button onClick={() => setShowRunner(true)} className="text-xs text-amber-400 hover:underline font-semibold">
              + Launch Run
            </button>
          </div>

          <div className="space-y-3.5 flex-1">
            {testRuns.map((run) => (
              <div
                key={run.id}
                onClick={() => setShowRunner(true)}
                className="p-3.5 rounded-xl bg-[#171B24] border border-white/6 hover:border-white/15 cursor-pointer space-y-2 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate max-w-[180px]">{run.name}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      run.status === 'IN_PROGRESS'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                        : 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                    }`}
                  >
                    {run.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
                  <span>Passed: <strong className="text-teal-400">{run.passed}</strong></span>
                  <span>Failed: <strong className="text-rose-400">{run.failed}</strong></span>
                  <span>Total: <strong>{run.totalTests}</strong></span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-black/40 overflow-hidden flex">
                  <div
                    className="bg-teal-500 h-full"
                    style={{ width: `${(run.passed / run.totalTests) * 100}%` }}
                  />
                  <div
                    className="bg-rose-500 h-full"
                    style={{ width: `${(run.failed / run.totalTests) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-white/8 text-[11px] text-gray-400 flex items-center justify-between">
            <span>CI Runner: GitHub Actions</span>
            <span className="font-mono text-teal-400 font-bold">Uptime: 99.98%</span>
          </div>
        </div>
      </div>

      {/* Bottom Defect Triage Stream */}
      <div className="p-6 rounded-2xl bg-[#11141B] border border-white/8 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Bug className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold text-white">Active Defect Backlog (Requires Immediate Triage)</h3>
          </div>
          <NavLink to="/bugs" className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold">
            Open Kanban Board <ArrowRight className="w-3.5 h-3.5" />
          </NavLink>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/8 text-gray-400 text-[10px] uppercase tracking-wider font-mono">
                <th className="pb-3 font-semibold">Defect ID</th>
                <th className="pb-3 font-semibold">Severity</th>
                <th className="pb-3 font-semibold">Summary</th>
                <th className="pb-3 font-semibold">Module</th>
                <th className="pb-3 font-semibold">Assignee</th>
                <th className="pb-3 font-semibold">SLA Breach</th>
                <th className="pb-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/6 text-gray-200">
              {bugs.slice(0, 4).map((bug) => (
                <tr
                  key={bug.id}
                  onClick={() => navigate('/bugs')}
                  className="hover:bg-white/5 transition group cursor-pointer"
                >
                  <td className="py-3 font-mono font-bold text-amber-400">{bug.id}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        bug.severity === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : bug.severity === 'HIGH'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-white/10 text-gray-300'
                      }`}
                    >
                      {bug.severity}
                    </span>
                  </td>
                  <td className="py-3 font-medium max-w-xs truncate">{bug.title}</td>
                  <td className="py-3 text-gray-400">{bug.module}</td>
                  <td className="py-3 text-gray-300">{bug.assignee.name}</td>
                  <td className="py-3 font-mono text-rose-400">{bug.slaBreachTime}</td>
                  <td className="py-3 text-right">
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/8 text-[10px] font-mono">
                      {bug.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <DailyBriefingModal isOpen={showBriefing} onClose={() => setShowBriefing(false)} />
      <TestRunnerModal isOpen={showRunner} onClose={() => setShowRunner(false)} />
    </div>
  );
};