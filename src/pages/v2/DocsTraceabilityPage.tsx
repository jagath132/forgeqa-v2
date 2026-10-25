'use client';

import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Link2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Download,
  Plus
} from 'lucide-react';
import { useForgeStore } from '../../store/useForgeStore';

export const DocsTraceabilityPage: React.FC = () => {
  const { requirements, sendAiMessage } = useForgeStore();
  const [docContent, setDocContent] = useState(`# PRD: Checkout 3DS 2.0 Strong Customer Authentication (SCA)
## 1. Feature Objective
Enable zero-friction European PSD2 compliance by detecting 3DS card challenges automatically.

## 2. User Stories & Acceptance Criteria
- **US-01:** As a shopper with an EU bank card, I want to authenticate via biometric bank challenge so my purchase completes securely.
  - **AC-1:** Webhook signature verified before fulfillment.
  - **AC-2:** Cart items persist if user cancels the 3DS bank dialog.
`);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#11141B] border border-white/8 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              PRD & Requirements Traceability Matrix
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono font-bold">
                Live Linking
              </span>
            </h1>
            <p className="text-xs text-gray-400">
              Notion-style markdown editor with automatic acceptance criteria extraction and test case coverage mapping.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => sendAiMessage('Extract testable acceptance criteria and generate Gherkin test cases from current PRD document')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 transition"
          >
            <Sparkles className="w-3.5 h-3.5 fill-black" />
            <span>AI Extract AC to Tests</span>
          </button>
        </div>
      </div>

      {/* Editor & Traceability Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Notion-like Editor */}
        <div className="p-6 rounded-2xl bg-[#11141B] border border-white/8 shadow-xl flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/8 text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">
            <span>PRD Editor (Markdown)</span>
            <span className="text-teal-400 font-bold">Auto-Saved</span>
          </div>

          <textarea
            value={docContent}
            onChange={(e) => setDocContent(e.target.value)}
            rows={16}
            className="w-full flex-1 bg-[#171B24] border border-white/10 rounded-xl p-4 text-xs font-mono text-gray-200 leading-relaxed focus:outline-none focus:border-amber-500 resize-none"
          />
        </div>

        {/* Right: Live Traceability Coverage */}
        <div className="p-6 rounded-2xl bg-[#11141B] border border-white/8 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/8">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Live Requirement Coverage
            </span>
            <span className="text-xs font-mono text-teal-400 font-bold">3 of 3 Requirements Linked</span>
          </div>

          <div className="space-y-3">
            {requirements.map((req) => (
              <div key={req.id} className="p-4 rounded-xl bg-[#171B24] border border-white/6 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-amber-400">{req.code}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300">
                    {req.status}
                  </span>
                </div>
                <h4 className="font-bold text-white">{req.title}</h4>
                <div className="text-[11px] text-gray-400 leading-relaxed">{req.description}</div>

                <div className="pt-2 border-t border-white/6 flex items-center justify-between font-mono text-[10px]">
                  <span className="text-teal-400">{req.testCaseIds.length} Linked Tests</span>
                  <span className="text-rose-400">{req.bugIds.length} Linked Bugs</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};