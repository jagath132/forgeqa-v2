'use client';

import React, { useState } from 'react';
import {
  Bug,
  Plus,
  Filter,
  Search,
  AlertTriangle,
  Clock,
  Sparkles,
  CheckCircle2,
  UserCheck,
  ChevronRight,
  ShieldAlert,
  ArrowUpDown,
  Send,
  ArrowLeft,
  ArrowRight as ArrowRightIcon
} from 'lucide-react';
import { useForgeStore } from '../../store/useForgeStore';
import type { BugStatus, BugSeverity } from '../../types/v2';
import { AiDeduplicationModal } from '../../components/v2/AiDeduplicationModal';

export const BugTrackerPage: React.FC = () => {
  const { bugs, updateBugStatus, updateBugSeverity, addBug, sendAiMessage } = useForgeStore();
  const [filterModule, setFilterModule] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBugId, setSelectedBugId] = useState<string | null>(null);
  const [showDedupModal, setShowDedupModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Record<string, { author: string; text: string; time: string }[]>>({
    'BUG-1042': [
      { author: 'Alex Rivera (Backend)', text: 'Reproduced locally with stripe cli. Body buffer is indeed pre-consumed by json parser.', time: '1 hour ago' }
    ]
  });

  const columns: { status: BugStatus; title: string; color: string }[] = [
    { status: 'NEW', title: 'New Submissions', color: 'border-blue-500/40 text-blue-400' },
    { status: 'OPEN', title: 'Triaged & Open', color: 'border-rose-500/40 text-rose-400' },
    { status: 'IN_PROGRESS', title: 'In Resolution', color: 'border-amber-500/40 text-amber-400' },
    { status: 'FIXED', title: 'Fix Ready / Retest', color: 'border-teal-500/40 text-teal-400' },
    { status: 'CLOSED', title: 'Closed & Verified', color: 'border-gray-500/40 text-gray-400' }
  ];

  const filteredBugs = bugs.filter((b) => {
    const matchesModule = filterModule === 'ALL' || b.module === filterModule;
    const matchesQuery = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesModule && matchesQuery;
  });

  const selectedBug = bugs.find((b) => b.id === selectedBugId) || bugs[0];

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedBug) return;
    const entry = {
      author: 'Jagath (QA Lead)',
      text: newComment.trim(),
      time: 'Just now'
    };
    setComments((prev) => ({
      ...prev,
      [selectedBug.id]: [...(prev[selectedBug.id] || []), entry]
    }));
    setNewComment('');
  };

  const statusOrder: BugStatus[] = ['NEW', 'OPEN', 'IN_PROGRESS', 'FIXED', 'CLOSED'];

  const moveStatus = (bugId: string, current: BugStatus, delta: number) => {
    const currentIdx = statusOrder.indexOf(current);
    const nextIdx = currentIdx + delta;
    if (nextIdx >= 0 && nextIdx < statusOrder.length) {
      updateBugStatus(bugId, statusOrder[nextIdx]);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#11141B] border border-white/8 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
            <Bug className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Bug Tracker & Defect Management
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 font-mono font-bold">
                {bugs.length} Total
              </span>
            </h1>
            <p className="text-xs text-gray-400">
              Kanban workflow with native AI Root Cause Analysis (RCA) and automated duplicate detection.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Module Filter */}
          <select
            value={filterModule}
            onChange={(e) => setFilterModule(e.target.value)}
            className="bg-[#171B24] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Modules</option>
            <option value="Billing & Payments">Billing & Payments</option>
            <option value="Auth & Session">Auth & Session</option>
            <option value="Checkout Flow">Checkout Flow</option>
            <option value="Security & Auth">Security & Auth</option>
          </select>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search bugs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#171B24] border border-white/10 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 w-48"
            />
          </div>

          <button
            onClick={() => setShowDedupModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-semibold text-amber-400 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Deduplication</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Grid (5 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto min-h-[580px]">
        {columns.map((col) => {
          const colBugs = filteredBugs.filter((b) => b.status === col.status);
          return (
            <div
              key={col.status}
              className="flex flex-col bg-[#11141B] rounded-2xl border border-white/8 p-3 shadow-lg min-w-[240px]"
            >
              {/* Column Header */}
              <div className={`flex items-center justify-between pb-3 mb-3 border-b border-white/8 ${col.color}`}>
                <span className="text-xs font-extrabold uppercase tracking-wider">{col.title}</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white">
                  {colBugs.length}
                </span>
              </div>

              {/* Bug Cards */}
              <div className="flex-1 space-y-3 overflow-y-auto">
                {colBugs.map((bug) => (
                  <div
                    key={bug.id}
                    onClick={() => setSelectedBugId(bug.id)}
                    className={`p-3.5 rounded-xl bg-[#171B24] border transition-all cursor-pointer group hover:scale-[1.01] ${
                      selectedBugId === bug.id
                        ? 'border-amber-500 shadow-lg shadow-amber-500/10'
                        : 'border-white/6 hover:border-white/15'
                    }`}
                  >
                    {/* Top Row: Bug ID & Severity Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[11px] font-bold text-amber-400">{bug.id}</span>
                      <span
                        className={`text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded ${
                          bug.severity === 'CRITICAL'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : bug.severity === 'HIGH'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-white/5 text-gray-300'
                        }`}
                      >
                        {bug.severity}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="text-xs font-bold text-white line-clamp-2 mb-2 group-hover:text-amber-300 transition">
                      {bug.title}
                    </h4>

                    {/* Module & SLA */}
                    <div className="flex items-center justify-between text-[10px] text-gray-400 mb-2">
                      <span className="truncate max-w-[120px]">{bug.module}</span>
                      <span className="font-mono text-rose-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {bug.slaBreachTime}
                      </span>
                    </div>

                    {/* Assignee & Move Action */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/6 text-[10px]">
                      <div className="flex items-center gap-1.5 text-gray-300">
                        <div className="w-4 h-4 rounded-full bg-amber-500/30 text-[9px] flex items-center justify-center font-bold text-amber-300">
                          {bug.assignee.name.charAt(0)}
                        </div>
                        <span className="truncate max-w-[80px]">{bug.assignee.name}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveStatus(bug.id, bug.status, -1);
                          }}
                          className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white"
                          title="Move to previous status"
                        >
                          <ArrowLeft className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveStatus(bug.id, bug.status, 1);
                          }}
                          className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white"
                          title="Move to next status"
                        >
                          <ArrowRightIcon className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Defect Detail & AI Root Cause Drawer */}
      {selectedBug && (
        <div className="p-6 rounded-2xl bg-[#11141B] border border-white/8 shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/8 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-amber-400">{selectedBug.id}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-mono font-bold">
                  {selectedBug.severity}
                </span>
                <span className="text-xs text-gray-400 font-mono">Reported by {selectedBug.reporter}</span>
              </div>
              <h2 className="text-base font-bold text-white">{selectedBug.title}</h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => sendAiMessage(`Analyze root cause for ${selectedBug.id}: ${selectedBug.title}. Description: ${selectedBug.description}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-black font-bold text-xs shadow-md shadow-amber-500/20 transition hover:bg-amber-400"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Run AI RCA</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="space-y-4 md:col-span-2">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1 font-mono">
                  Description & Context
                </span>
                <p className="text-gray-300 leading-relaxed bg-[#171B24] p-3 rounded-xl border border-white/6">
                  {selectedBug.description}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1 font-mono">
                  Steps to Reproduce
                </span>
                <ol className="list-decimal list-inside space-y-1 bg-[#171B24] p-3 rounded-xl border border-white/6 text-gray-300">
                  {selectedBug.stepsToReproduce.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>

              {selectedBug.rootCauseAnalysis && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Root Cause Analysis (RCA)</span>
                  </div>
                  <p className="text-gray-200 text-xs leading-relaxed">{selectedBug.rootCauseAnalysis}</p>
                </div>
              )}

              {/* Comments Timeline */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">
                  Activity & Engineering Comments
                </span>
                <div className="space-y-2">
                  {(comments[selectedBug.id] || []).map((c, i) => (
                    <div key={i} className="p-3 rounded-xl bg-[#171B24] border border-white/6 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-amber-400">
                        <span>{c.author}</span>
                        <span className="text-gray-500 text-[10px] font-mono">{c.time}</span>
                      </div>
                      <p className="text-gray-300 text-[11px] leading-relaxed">{c.text}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                    placeholder="Add engineering notes, reproduction updates..."
                    className="flex-1 bg-[#171B24] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={handleAddComment}
                    className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Meta Column */}
            <div className="space-y-3 bg-[#171B24] p-4 rounded-xl border border-white/6 text-xs h-fit">
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-mono">Assigned Engineer</span>
                <span className="font-semibold text-white">{selectedBug.assignee.name} ({selectedBug.assignee.role})</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-mono">Target SLA Countdown</span>
                <span className="font-mono text-rose-400 font-bold">{selectedBug.slaBreachTime}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-mono">Environment Specs</span>
                <span className="text-gray-300 font-mono text-[11px] block">{selectedBug.environment.browser} • {selectedBug.environment.os}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-mono">Linked Automated Test</span>
                <span className="font-mono text-teal-400 font-bold">{selectedBug.linkedTestCaseId || 'None'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deduplication Modal */}
      <AiDeduplicationModal isOpen={showDedupModal} onClose={() => setShowDedupModal(false)} />
    </div>
  );
};