'use client';

import React, { useState } from 'react';
import { Sparkles, X, Terminal, Code2 } from 'lucide-react';
import { useForgeStore } from '../../store/useForgeStore';

interface AiScriptGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiScriptGeneratorModal: React.FC<AiScriptGeneratorModalProps> = ({ isOpen, onClose }) => {
  const { scripts } = useForgeStore();
  const [prompt, setPrompt] = useState('Write an automated Playwright test in TypeScript for user registration with email verification and password strength check.');
  const [framework, setFramework] = useState<'PLAYWRIGHT' | 'CYPRESS' | 'SELENIUM'>('PLAYWRIGHT');

  if (!isOpen) return null;

  const handleGenerateScript = () => {
    alert(`Generated new ${framework} automation script and saved to workspace!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-[#11141B] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="h-14 px-6 bg-[#171B24] border-b border-white/8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                AI Automation Script Generator
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-gray-200">
          <div>
            <label className="block text-gray-400 font-medium mb-1.5 font-mono">TARGET FRAMEWORK</label>
            <div className="flex gap-2">
              {(['PLAYWRIGHT', 'CYPRESS', 'SELENIUM'] as const).map((fw) => (
                <button
                  key={fw}
                  onClick={() => setFramework(fw)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                    framework === fw
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                      : 'bg-[#171B24] border-white/8 text-gray-400 hover:text-white'
                  }`}
                >
                  {fw}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-400 font-medium mb-1.5 font-mono">NATURAL LANGUAGE TEST SCENARIO</label>
            <textarea
              rows={5}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-[#171B24] border border-white/10 rounded-xl p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="h-14 px-6 bg-[#171B24] border-t border-white/8 flex items-center justify-end gap-3 text-xs">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition">
            Cancel
          </button>
          <button
            onClick={handleGenerateScript}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold transition shadow-md shadow-amber-500/20"
          >
            Generate & Save Script
          </button>
        </div>
      </div>
    </div>
  );
};