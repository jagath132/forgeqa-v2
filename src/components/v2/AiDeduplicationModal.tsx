'use client';

import React, { useState } from 'react';
import { Sparkles, X, Check, AlertTriangle, Bug, GitMerge, CheckCircle2 } from 'lucide-react';
import { useForgeStore } from '../../store/useForgeStore';

interface AiDeduplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiDeduplicationModal: React.FC<AiDeduplicationModalProps> = ({ isOpen, onClose }) => {
  const { bugs, deleteBug } = useForgeStore();
  const [merged, setMerged] = useState<string[]>([]);

  if (!isOpen) return null;

  const duplicatePairs = [
    {
      master: bugs[0] || { id: 'BUG-1042', title: 'Stripe webhook signature validation fails on raw payload buffer' },
      duplicate: bugs[3] || { id: 'BUG-1045', title: 'Password reset link exposes unescaped token in referrer header' },
      similarityScore: 92,
      reason: 'Both errors stem from middleware consuming raw HTTP request streams before header/buffer authorization checks.'
    },
    {
      master: bugs[1] || { id: 'BUG-1043', title: 'Concurrent 401 token refresh queue drops parallel requests' },
      duplicate: { id: 'BUG-994', title: 'Session refresh race condition on concurrent tab focus' },
      similarityScore: 88,
      reason: 'Identical root cause: isRefreshing boolean flag rejects parallel callers instead of sharing a singleton promise.'
    }
  ];

  const handleMerge = (dupId: string) => {
    deleteBug(dupId);
    setMerged((prev) => [...prev, dupId]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#11141B] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="h-14 px-6 bg-[#171B24] border-b border-white/8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                AI Duplicate Defect Detector
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                  2 Clusters Found
                </span>
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Clusters */}
        <div className="p-6 space-y-4 text-xs text-gray-200">
          <p className="text-gray-400 leading-relaxed text-[11px]">
            ForgeQA AI continuously vectorizes defect titles, stack traces, and reproduction steps to detect duplicates before engineers spend time triaging.
          </p>

          <div className="space-y-3">
            {duplicatePairs.map((pair, idx) => {
              const isMerged = merged.includes(pair.duplicate.id);
              return (
                <div key={idx} className="p-4 rounded-xl bg-[#171B24] border border-white/8 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-400 font-bold font-mono text-xs flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      <span>{pair.similarityScore}% Symptom Similarity</span>
                    </span>
                    {isMerged ? (
                      <span className="text-teal-400 font-mono font-bold text-[10px] flex items-center gap-1">
                        <Check className="w-3 h-3" /> Merged into Master
                      </span>
                    ) : (
                      <button
                        onClick={() => handleMerge(pair.duplicate.id)}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-[11px] transition shadow-md shadow-amber-500/20"
                      >
                        <GitMerge className="w-3.5 h-3.5" />
                        <span>Merge Duplicate</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
                    <div className="p-2.5 rounded bg-black/40 border border-white/6">
                      <span className="text-teal-400 font-bold block mb-0.5">Master: {pair.master.id}</span>
                      <span className="text-gray-300 font-sans">{pair.master.title}</span>
                    </div>
                    <div className="p-2.5 rounded bg-black/40 border border-white/6">
                      <span className="text-rose-400 font-bold block mb-0.5">Duplicate: {pair.duplicate.id}</span>
                      <span className="text-gray-300 font-sans">{pair.duplicate.title}</span>
                    </div>
                  </div>

                  <p className="text-gray-400 text-[11px] leading-relaxed">
                    <strong>AI Analysis:</strong> {pair.reason}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="h-14 px-6 bg-[#171B24] border-t border-white/8 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};