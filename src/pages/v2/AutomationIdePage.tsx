'use client';

import React, { useState } from 'react';
import {
  Terminal,
  Play,
  Sparkles,
  Copy,
  Check,
  CheckCircle2,
  FolderCode,
  FileCode,
  Cpu,
  Layers,
  RotateCcw
} from 'lucide-react';
import { useForgeStore } from '../../store/useForgeStore';
import { AiScriptGeneratorModal } from '../../components/v2/AiScriptGeneratorModal';

export const AutomationIdePage: React.FC = () => {
  const {
    scripts,
    activeScriptId,
    setActiveScriptId,
    updateScriptCode,
    isRunningAutomation,
    terminalLogs,
    runAutomationScript
  } = useForgeStore();

  const [activeTab, setActiveTab] = useState<'EDITOR' | 'CICD'>('EDITOR');
  const [copied, setCopied] = useState(false);
  const [showGenModal, setShowGenModal] = useState(false);

  const activeScript = scripts.find((s) => s.id === activeScriptId) || scripts[0];

  const cicdYaml = `name: ForgeQA E2E Quality Gate
on:
  push:
    branches: [ main, staging ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies
        run: npm ci
      - name: Run ForgeQA Cloud Automation
        env:
          FORGEQA_API_KEY: '\${{ secrets.FORGEQA_API_KEY }}'
        run: npx forgeqa-runner run --suite SUITE-02 --ci`;

  return (
    <div className="h-[calc(100vh-130px)] flex flex-col gap-4 max-w-7xl mx-auto pb-4">
      {/* Top Bar */}
      <div className="h-14 px-6 rounded-2xl bg-[#11141B] border border-white/8 flex items-center justify-between shadow-xl flex-shrink-0">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-amber-400" />
          <div>
            <h1 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              Playwright & Cypress In-Browser Cloud IDE
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono">
                HEADLESS RUNNER
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGenModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-amber-400 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Script Generator</span>
          </button>

          <button
            onClick={() => runAutomationScript(activeScript.id)}
            disabled={isRunningAutomation}
            className="flex items-center gap-2 px-5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-extrabold text-xs shadow-md shadow-amber-500/20 transition"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>{isRunningAutomation ? 'Running Suite...' : 'Execute Suite'}</span>
          </button>
        </div>
      </div>

      {/* Split Pane: Left Scripts Tree + Middle Code Editor + Right / Bottom Terminal */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Scripts List Sidebar */}
        <div className="w-64 bg-[#11141B] border border-white/8 rounded-2xl flex flex-col p-4 shadow-xl flex-shrink-0">
          <div className="text-xs font-bold text-gray-400 pb-2 mb-3 border-b border-white/8 uppercase tracking-wider">
            Test Scripts
          </div>
          <div className="space-y-1.5 flex-1 overflow-y-auto">
            {scripts.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveScriptId(s.id)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs text-left transition font-mono ${
                  activeScriptId === s.id
                    ? 'bg-amber-500/15 border border-amber-500/30 text-white font-bold'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <FileCode className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="truncate flex-1">{s.name}</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-black/40 text-gray-400 font-sans">
                  {s.framework}
                </span>
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-white/8">
            <button
              onClick={() => setActiveTab(activeTab === 'EDITOR' ? 'CICD' : 'EDITOR')}
              className="w-full text-center py-2 rounded-xl bg-[#171B24] border border-white/8 text-xs font-semibold text-gray-300 hover:text-white transition"
            >
              {activeTab === 'EDITOR' ? 'View CI/CD Webhook YAML' : 'Return to Editor'}
            </button>
          </div>
        </div>

        {/* Center: In-browser Code Editor */}
        <div className="flex-1 bg-[#11141B] border border-white/8 rounded-2xl flex flex-col shadow-xl overflow-hidden min-w-0">
          <div className="h-10 px-4 bg-[#171B24] border-b border-white/8 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-gray-300">
              <span className="text-amber-400 font-bold">{activeScript.name}</span>
              <span className="text-gray-500">•</span>
              <span className="text-[11px] text-gray-400">{activeScript.framework} ({activeScript.language})</span>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(activeScript.code);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="text-gray-400 hover:text-white flex items-center gap-1 text-[11px]"
            >
              {copied ? <Check className="w-3 h-3 text-teal-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="flex-1 overflow-auto p-4 bg-[#090B0E]">
            {activeTab === 'EDITOR' ? (
              <textarea
                value={activeScript.code}
                onChange={(e) => updateScriptCode(activeScript.id, e.target.value)}
                className="w-full h-full bg-transparent text-xs font-mono text-teal-300 leading-relaxed resize-none focus:outline-none"
                spellCheck={false}
              />
            ) : (
              <pre className="text-xs font-mono text-amber-300 leading-relaxed">{cicdYaml}</pre>
            )}
          </div>
        </div>

        {/* Right / Terminal Live Execution Stream */}
        <div className="w-80 bg-[#11141B] border border-white/8 rounded-2xl flex flex-col p-4 shadow-xl flex-shrink-0">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/8">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Cloud Console</span>
            </div>
            {isRunningAutomation && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </div>

          <div className="flex-1 bg-[#090B0E] rounded-xl p-3 border border-white/6 font-mono text-[11px] text-gray-300 overflow-y-auto space-y-2">
            {terminalLogs.map((log, idx) => (
              <div
                key={idx}
                className={`${
                  log.includes('PASSED') || log.includes('passed')
                    ? 'text-teal-400 font-bold'
                    : log.includes('FAILED')
                    ? 'text-rose-400 font-bold'
                    : log.startsWith('->')
                    ? 'text-amber-300'
                    : 'text-gray-400'
                }`}
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Script Gen Modal */}
      <AiScriptGeneratorModal isOpen={showGenModal} onClose={() => setShowGenModal(false)} />
    </div>
  );
};