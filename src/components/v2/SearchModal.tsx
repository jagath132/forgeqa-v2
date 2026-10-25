'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Bug, CheckSquare, Send, FileText, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useForgeStore } from '../../store/useForgeStore';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { bugs, testCases, apiCollections, requirements } = useForgeStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase();

  const matchingBugs = bugs.filter((b) => b.title.toLowerCase().includes(q) || b.id.toLowerCase().includes(q));
  const matchingTests = testCases.filter((t) => t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q));
  const matchingApis: { id: string; name: string; method: string; url: string }[] = [];
  apiCollections.forEach((c) => {
    c.requests.forEach((r) => {
      if (r.name.toLowerCase().includes(q) || r.url.toLowerCase().includes(q)) {
        matchingApis.push({ id: r.id, name: r.name, method: r.method, url: r.url });
      }
    });
  });
  const matchingReqs = requirements.filter((r) => r.title.toLowerCase().includes(q) || r.code.toLowerCase().includes(q));

  const handleSelect = (url: string) => {
    navigate(url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#11141B] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search Input Bar */}
        <div className="h-14 px-4 bg-[#171B24] border-b border-white/10 flex items-center gap-3">
          <Search className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search test cases, defects, APIs, requirements..."
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {matchingBugs.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                <Bug className="w-3 h-3 text-rose-400" />
                <span>Defects ({matchingBugs.length})</span>
              </div>
              <div className="space-y-1">
                {matchingBugs.slice(0, 4).map((b) => (
                  <button
                    key={b.id}
                    onClick={() => handleSelect('/bugs')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 text-left transition group border border-transparent hover:border-white/8"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono font-bold text-amber-400 text-[11px]">{b.id}</span>
                      <span className="text-gray-200 truncate">{b.title}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 flex-shrink-0">
                      {b.severity}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchingTests.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                <CheckSquare className="w-3 h-3 text-teal-400" />
                <span>Test Cases ({matchingTests.length})</span>
              </div>
              <div className="space-y-1">
                {matchingTests.slice(0, 4).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleSelect('/test-management')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 text-left transition group border border-transparent hover:border-white/8"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono font-bold text-amber-400 text-[11px]">{t.id}</span>
                      <span className="text-gray-200 truncate">{t.title}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-400 flex-shrink-0">
                      {t.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchingApis.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                <Send className="w-3 h-3 text-amber-400" />
                <span>API Endpoints ({matchingApis.length})</span>
              </div>
              <div className="space-y-1">
                {matchingApis.slice(0, 4).map((a) => (
                  <button
                    key={a.id}
                    onClick={() => handleSelect('/api-client')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 text-left transition group border border-transparent hover:border-white/8"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono font-bold text-teal-400 text-[10px]">{a.method}</span>
                      <span className="text-gray-200 truncate">{a.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-gray-500 truncate max-w-[200px]">{a.url}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchingReqs.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                <FileText className="w-3 h-3 text-purple-400" />
                <span>Requirements ({matchingReqs.length})</span>
              </div>
              <div className="space-y-1">
                {matchingReqs.slice(0, 4).map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleSelect('/docs')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 text-left transition group border border-transparent hover:border-white/8"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono font-bold text-amber-400 text-[11px]">{r.code}</span>
                      <span className="text-gray-200 truncate">{r.title}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 flex-shrink-0">
                      {r.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchingBugs.length === 0 && matchingTests.length === 0 && matchingApis.length === 0 && matchingReqs.length === 0 && (
            <div className="py-12 text-center text-gray-500 text-xs">
              No results found for "{query}". Try searching for "Stripe", "Auth", "TC-301", or "BUG-1042".
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="h-10 px-4 bg-[#171B24] border-t border-white/8 flex items-center justify-between text-[11px] text-gray-400 font-mono">
          <span>Use arrow keys to navigate</span>
          <div className="flex items-center gap-2">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px]">ESC</kbd>
            <span>to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};