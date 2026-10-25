'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  Copy,
  Check,
  Code2,
  Bug,
  Database,
  ShieldCheck,
  RefreshCw,
  Terminal,
  Zap,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { useForgeStore } from '../../store/useForgeStore';

export const AiAssistantPage: React.FC = () => {
  const { aiMessages, isAiGenerating, sendAiMessage, clearAiChat, addTestCase } = useForgeStore();
  const [prompt, setPrompt] = useState('');
  const [selectedPersona, setSelectedPersona] = useState<'TEST_GEN' | 'RCA' | 'SYNTHETIC' | 'FLAKY' | 'BRIEFING'>('TEST_GEN');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const personas = [
    { id: 'TEST_GEN', label: 'Test Case Generator', icon: Code2, desc: 'Generate edge-case test suites from requirements or user stories.' },
    { id: 'RCA', label: 'RCA & Diagnostic Engine', icon: Bug, desc: 'Analyze stack traces and log dumps to pinpoint exact root cause.' },
    { id: 'SYNTHETIC', label: 'Synthetic QA Data', icon: Database, desc: 'Create realistic boundary test data (emails, credit cards, payloads).' },
    { id: 'FLAKY', label: 'Flaky Test Detective', icon: Zap, desc: 'Diagnose race conditions and selector flakiness in automated runs.' },
    { id: 'BRIEFING', label: 'Daily Executive Briefing', icon: ShieldCheck, desc: 'Produce morning QA status report and release readiness summary.' }
  ];

  const handleSend = () => {
    if (!prompt.trim() || isAiGenerating) return;
    const msg = prompt.trim();
    setPrompt('');
    sendAiMessage(msg, personas.find((p) => p.id === selectedPersona)?.label);
  };

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleInjectSuite = () => {
    addTestCase({
      title: 'TC-501: Validate Idempotency on Duplicate Checkout Payment Submissions',
      suiteId: 'SUITE-02',
      suiteName: 'Stripe Checkout & Billing v2',
      description: 'Rapid double-click on payment submit does not charge twice when idempotency key is present.',
      priority: 'CRITICAL',
      type: 'AUTOMATED',
      status: 'UNTESTED',
      preconditions: ['User has active cart', 'Idempotency key header attached'],
      steps: [
        { stepNumber: 1, action: 'Submit payment twice within 200ms', expectedResult: 'Exactly 1 Stripe charge created' }
      ],
      author: 'Forge AI Copilot',
      tags: ['AI-Generated', 'Idempotency']
    });
    alert('Test Case successfully injected into Test Management suite!');
  };

  return (
    <div className="h-[calc(100vh-130px)] flex gap-6 max-w-7xl mx-auto pb-4">
      {/* Left Persona Modes Panel */}
      <div className="w-80 bg-[#11141B] border border-white/8 rounded-2xl flex flex-col p-4 shadow-xl flex-shrink-0">
        <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-white/8">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">AI Copilot Modes</h2>
            <p className="text-[10px] text-gray-400">Context-tuned for specialized QA workflows</p>
          </div>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto">
          {personas.map((p) => {
            const Icon = p.icon;
            const isSelected = selectedPersona === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPersona(p.id as any)}
                className={`w-full text-left p-3 rounded-xl border transition ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500/30 text-white shadow-md'
                    : 'bg-[#171B24] border-white/6 text-gray-300 hover:border-white/15'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-gray-400'}`} />
                  <span className="text-xs font-bold">{p.label}</span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">{p.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Plan Token Usage Pill */}
        <div className="pt-3 border-t border-white/8 space-y-2 text-xs">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-gray-400">Monthly AI Runs</span>
            <span className="font-mono text-teal-400 font-bold">142 / 1,000</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-black/40 overflow-hidden">
            <div className="w-[14.2%] h-full bg-teal-400 rounded-full" />
          </div>
          <button onClick={clearAiChat} className="text-[11px] text-gray-400 hover:text-white pt-1">
            Clear Chat History
          </button>
        </div>
      </div>

      {/* Main Conversation & Output Viewport */}
      <div className="flex-1 flex flex-col bg-[#11141B] border border-white/8 rounded-2xl shadow-xl overflow-hidden min-w-0">
        {/* Workspace Bar */}
        <div className="h-14 px-6 bg-[#171B24] border-b border-white/8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-xs font-bold text-white">
                Forge Assistant — {personas.find((p) => p.id === selectedPersona)?.label}
              </span>
              <span className="text-[10px] text-teal-400 font-mono block">Zero-Latency Cloud Inference</span>
            </div>
          </div>

          <button
            onClick={handleInjectSuite}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold hover:bg-teal-500/30 transition"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>1-Click Test Suite Injection</span>
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {aiMessages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-4 leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-amber-500 text-black font-semibold shadow-lg'
                    : 'bg-[#171B24] border border-white/8 text-gray-200 shadow-lg'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>

                {msg.codeBlocks?.map((cb, idx) => (
                  <div key={idx} className="mt-3 rounded-xl bg-[#090B0E] border border-white/10 overflow-hidden">
                    <div className="px-3 py-2 bg-white/5 border-b border-white/8 flex items-center justify-between text-[11px] text-gray-400 font-mono">
                      <span>{cb.title || cb.language}</span>
                      <button
                        onClick={() => handleCopy(cb.code, `${msg.id}-${idx}`)}
                        className="flex items-center gap-1 text-amber-400 hover:text-white"
                      >
                        {copiedId === `${msg.id}-${idx}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId === `${msg.id}-${idx}` ? 'Copied' : 'Copy Code'}</span>
                      </button>
                    </div>
                    <pre className="p-4 text-xs font-mono text-teal-300 overflow-x-auto whitespace-pre">
                      {cb.code}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {isAiGenerating && (
            <div className="flex items-center gap-3 text-xs text-amber-400 font-mono animate-pulse">
              <Bot className="w-4 h-4" />
              <span>Analyzing software requirements and reasoning test paths...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#171B24] border-t border-white/8 flex items-center gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe your user story, paste an error log, or ask for synthetic data..."
            className="flex-1 bg-[#0D0F14] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
          />
          <button
            onClick={handleSend}
            disabled={isAiGenerating || !prompt.trim()}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 transition flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5 fill-black" />
            <span>Generate</span>
          </button>
        </div>
      </div>
    </div>
  );
};