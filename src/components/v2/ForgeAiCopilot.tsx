'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Copy,
  Check,
  Code2,
  Bug,
  Database,
  ShieldCheck,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { useForgeStore } from '../../store/useForgeStore';

export const ForgeAiCopilot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { aiMessages, isAiGenerating, sendAiMessage, clearAiChat } = useForgeStore();

  const handleSend = () => {
    if (!input.trim() || isAiGenerating) return;
    const msg = input.trim();
    setInput('');
    sendAiMessage(msg, 'Active Screen Context');
  };

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    { label: 'Generate Test Cases', prompt: 'Generate comprehensive test cases for our Checkout Flow including edge cases.' },
    { label: 'Root Cause Analysis', prompt: 'Perform root cause analysis on the Stripe webhook signature verification error.' },
    { label: 'Synthetic QA Data', prompt: 'Generate realistic synthetic customer test data with valid & invalid card numbers.' },
    { label: 'Daily QA Briefing', prompt: 'Summarize today\'s QA priorities, defect backlog, and release readiness score.' }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-black font-bold text-xs shadow-2xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all"
        >
          <Sparkles className="w-4 h-4 animate-spin-slow" />
          <span>Forge Assistant</span>
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping absolute -top-1 -right-1" />
        </button>
      )}

      {/* Floating Drawer Modal */}
      {isOpen && (
        <div
          className={`bg-[#11141B] border border-white/15 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
            isExpanded ? 'w-[750px] h-[650px]' : 'w-[420px] h-[540px]'
          }`}
          style={{ background: '#11141B' }}
        >
          {/* Header */}
          <div className="h-14 px-4 bg-[#171B24] border-b border-white/8 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  Forge AI Copilot
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono">
                    PRO
                  </span>
                </div>
                <div className="text-[10px] text-gray-400">Specialized QA Model (Gemini 2.5 Flash)</div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-gray-400">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded hover:bg-white/5 hover:text-white transition"
                title={isExpanded ? 'Standard view' : 'Expand view'}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded hover:bg-white/5 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Action Chips */}
          <div className="p-2.5 bg-[#0D0F14] border-b border-white/6 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => sendAiMessage(qp.prompt, 'Dashboard')}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-amber-500/15 hover:text-amber-400 text-gray-300 whitespace-nowrap transition border border-white/8 text-[11px]"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {aiMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-xl p-3 leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-amber-500 text-black font-medium'
                      : 'bg-[#171B24] border border-white/8 text-gray-200'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>

                  {msg.codeBlocks?.map((cb, idx) => (
                    <div key={idx} className="mt-2.5 rounded-lg bg-[#090B0E] border border-white/10 overflow-hidden">
                      <div className="px-2.5 py-1.5 bg-white/5 border-b border-white/8 flex items-center justify-between text-[10px] text-gray-400 font-mono">
                        <span>{cb.title || cb.language}</span>
                        <button
                          onClick={() => handleCopy(cb.code, `${msg.id}-${idx}`)}
                          className="flex items-center gap-1 text-amber-400 hover:text-white"
                        >
                          {copiedId === `${msg.id}-${idx}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === `${msg.id}-${idx}` ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <pre className="p-3 text-[11px] font-mono text-teal-300 overflow-x-auto whitespace-pre">
                        {cb.code}
                      </pre>
                    </div>
                  ))}

                  <div className="mt-1 text-[9px] text-gray-400 text-right">{msg.timestamp}</div>
                </div>
              </div>
            ))}

            {isAiGenerating && (
              <div className="flex gap-3 items-center text-xs text-amber-400 animate-pulse">
                <Bot className="w-4 h-4" />
                <span>Forge AI is analyzing context and generating response...</span>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-[#171B24] border-t border-white/8 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything or generate tests, scripts, data..."
              className="flex-1 bg-[#0D0F14] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
            />
            <button
              onClick={handleSend}
              disabled={isAiGenerating || !input.trim()}
              className="p-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black transition"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};