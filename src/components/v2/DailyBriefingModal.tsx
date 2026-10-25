'use client';

import React, { useState } from 'react';
import { Sparkles, X, ShieldCheck, CheckCircle2, AlertTriangle, Bug, Copy, Check } from 'lucide-react';
import { useForgeStore } from '../../store/useForgeStore';

interface DailyBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyBriefingModal: React.FC<DailyBriefingModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const { bugs, testCases, testRuns, activeWorkspace, activeEnvironment } = useForgeStore();

  if (!isOpen) return null;

  const criticalBugs = bugs.filter((b) => b.severity === 'CRITICAL' && b.status !== 'CLOSED');
  const openBugs = bugs.filter((b) => b.status !== 'CLOSED');

  const briefingText = `📋 *ForgeQA Daily Briefing — ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}*
🏢 Workspace: ${activeWorkspace} (${activeEnvironment})
🎯 Release Target: v2.4.0 (Sprint 42, 5 days remaining)

⭐ Executive Health Score: 87/100 (Grade A- Release Ready)
✓ Automated Test Coverage: 82.6% (1,420 test cases)
✓ Nightly Regression Pass Rate: 94.7% (Run #9021)

🚨 Blockers & High-Priority Defects:
${criticalBugs.map((b) => `• [${b.id}] ${b.title} (SLA: ${b.slaBreachTime})`).join('\n')}

🎯 Key QA Objectives for Today:
1. Verify patch for BUG-1042 (Stripe webhook signature raw buffer validation).
2. Retest TC-302 (concurrent 401 token refresh queue under 50 simultaneous requests).
3. Finalize OWASP ASVS remediation on Reflected XSS (SEC-801).`;

  const handleCopy = () => {
    navigator.clipboard.writeText(briefingText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#11141B] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="h-14 px-6 bg-[#171B24] border-b border-white/8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                Executive Daily QA Briefing
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold">
                  AI Generated
                </span>
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-gray-200">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-[#171B24] border border-white/8">
              <span className="text-[10px] text-gray-400 block font-mono">QUALITY SCORE</span>
              <span className="text-xl font-extrabold text-teal-400 font-mono">87 / 100</span>
            </div>
            <div className="p-3 rounded-xl bg-[#171B24] border border-white/8">
              <span className="text-[10px] text-gray-400 block font-mono">CRITICAL BLOCKERS</span>
              <span className="text-xl font-extrabold text-rose-400 font-mono">{criticalBugs.length} P0</span>
            </div>
            <div className="p-3 rounded-xl bg-[#171B24] border border-white/8">
              <span className="text-[10px] text-gray-400 block font-mono">PASS RATE</span>
              <span className="text-xl font-extrabold text-white font-mono">94.7%</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Critical SLA & Defect Blockers</span>
            </div>
            <div className="space-y-2">
              {criticalBugs.map((b) => (
                <div key={b.id} className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-amber-400 font-bold mr-2">{b.id}</span>
                    <span className="text-white font-medium">{b.title}</span>
                  </div>
                  <span className="font-mono text-[10px] text-rose-400 font-bold">{b.slaBreachTime}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
              <span>Priority QA Objectives Today</span>
            </div>
            <ul className="list-disc list-inside space-y-1.5 bg-[#171B24] p-4 rounded-xl border border-white/8 text-gray-300 text-[11px] leading-relaxed">
              <li>Validate fix for Stripe webhook raw buffer verification (Alex Rivera).</li>
              <li>Re-execute test run for concurrent 401 token refresh (TC-302).</li>
              <li>Review cross-browser visual diff on Checkout drawer mobile 375px viewport.</li>
              <li>Finalize OWASP ASVS remediation before release candidate freeze.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="h-14 px-6 bg-[#171B24] border-t border-white/8 flex items-center justify-between text-xs">
          <span className="text-gray-400">Targeting Release v2.4.0</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold transition shadow-md shadow-amber-500/20"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Briefing for Slack'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};