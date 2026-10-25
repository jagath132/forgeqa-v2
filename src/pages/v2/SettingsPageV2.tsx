'use client';

import React, { useState } from 'react';
import {
  Settings,
  Key,
  Users,
  ShieldCheck,
  Bell,
  Cpu,
  Check,
  Sparkles,
  RefreshCw,
  Plus,
  Trash2
} from 'lucide-react';
import { useForgeStore } from '../../store/useForgeStore';

export const SettingsPageV2: React.FC = () => {
  const { activeWorkspace } = useForgeStore();
  const [activeTab, setActiveTab] = useState<'AI' | 'TEAM' | 'API_KEYS' | 'ALERTS'>('AI');

  const [geminiKey, setGeminiKey] = useState('AIzaSyD-mock-gemini-key-99887766');
  const [openAiKey, setOpenAiKey] = useState('sk-proj-mock-openai-key-55443322');
  const [claudeKey, setClaudeKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const teamMembers = [
    { name: 'Jagath M.', email: 'jagath@forgeqa.in', role: 'Owner / QA Lead', status: 'Active' },
    { name: 'Alex Rivera', email: 'alex@forgeqa.in', role: 'Backend Lead', status: 'Active' },
    { name: 'Priya Sharma', email: 'priya@forgeqa.in', role: 'Automation Engineer', status: 'Active' },
    { name: 'Ananya Roy', email: 'ananya@forgeqa.in', role: 'Manual Tester', status: 'Active' }
  ];

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#11141B] border border-white/8 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Platform & Workspace Settings
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono font-bold">
                {activeWorkspace}
              </span>
            </h1>
            <p className="text-xs text-gray-400">
              Manage AI models, organizational team members, CI/CD webhook tokens, and SLA breach thresholds.
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-bold font-mono">
            <Check className="w-4 h-4" />
            <span>Settings Saved</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/8 pb-2 text-xs font-semibold">
        {(['AI', 'TEAM', 'API_KEYS', 'ALERTS'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === tab
                ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                : 'text-gray-400 hover:text-white bg-[#11141B] border border-white/6'
            }`}
          >
            {tab === 'AI' && 'AI Model Providers'}
            {tab === 'TEAM' && 'Team & Roles'}
            {tab === 'API_KEYS' && 'CI/CD API Tokens'}
            {tab === 'ALERTS' && 'SLA Alert Rules'}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'AI' && (
        <div className="p-6 rounded-2xl bg-[#11141B] border border-white/8 shadow-xl space-y-6 text-xs">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/8">
              <div>
                <h3 className="text-sm font-bold text-white">Google Gemini API Key</h3>
                <p className="text-gray-400 text-[11px]">Primary provider for test case generation and PRD requirement analysis.</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-400 font-mono font-bold text-[10px]">ACTIVE</span>
            </div>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="w-full bg-[#171B24] border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/8">
              <div>
                <h3 className="text-sm font-bold text-white">OpenAI GPT-4o Key (Secondary Fallback)</h3>
                <p className="text-gray-400 text-[11px]">Used for complex root cause analysis (RCA) and multi-turn refactoring.</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-white/10 text-gray-400 font-mono text-[10px]">CONFIGURED</span>
            </div>
            <input
              type="password"
              value={openAiKey}
              onChange={(e) => setOpenAiKey(e.target.value)}
              className="w-full bg-[#171B24] border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="pt-4 border-t border-white/8 flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold shadow-md shadow-amber-500/20 transition"
            >
              Save AI Configuration
            </button>
          </div>
        </div>
      )}

      {activeTab === 'TEAM' && (
        <div className="p-6 rounded-2xl bg-[#11141B] border border-white/8 shadow-xl space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Workspace Members ({teamMembers.length})</h3>
            <button
              onClick={() => alert('Invite member modal')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Invite Member</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/8 text-gray-400 font-mono text-[10px] uppercase">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/6 text-gray-200">
                {teamMembers.map((m, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition">
                    <td className="py-3 font-semibold text-white">{m.name}</td>
                    <td className="py-3 font-mono text-gray-400">{m.email}</td>
                    <td className="py-3 font-mono text-amber-400">{m.role}</td>
                    <td className="py-3 text-right font-mono text-teal-400">{m.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'API_KEYS' && (
        <div className="p-6 rounded-2xl bg-[#11141B] border border-white/8 shadow-xl space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white">CI/CD Webhook & Runner Access Key</h3>
          <p className="text-gray-400 leading-relaxed text-[11px]">
            Use this token in GitHub Actions, GitLab CI, or Jenkins pipelines to trigger test suites and record quality gate results.
          </p>

          <div className="p-4 rounded-xl bg-[#171B24] border border-white/8 flex items-center justify-between font-mono">
            <span className="text-teal-300">fqa_live_99a8b776c544332211aa00ff</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText('fqa_live_99a8b776c544332211aa00ff');
                alert('Copied CI/CD Key to clipboard!');
              }}
              className="text-amber-400 hover:text-white text-xs font-bold"
            >
              Copy Key
            </button>
          </div>
        </div>
      )}

      {activeTab === 'ALERTS' && (
        <div className="p-6 rounded-2xl bg-[#11141B] border border-white/8 shadow-xl space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white">SLA Breach Notification Rules</h3>
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-[#171B24] border border-white/8 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Critical P0 Defect Breach Alert</span>
                <span className="text-gray-400 text-[11px]">Dispatch notification to Slack #qa-alerts when SLA countdown &lt; 2 hours</span>
              </div>
              <span className="text-teal-400 font-bold font-mono">ENABLED</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#171B24] border border-white/8 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Nightly Regression Quality Gate Failure</span>
                <span className="text-gray-400 text-[11px]">Fail deployment pipeline if test pass rate falls below 90%</span>
              </div>
              <span className="text-teal-400 font-bold font-mono">ENABLED</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};