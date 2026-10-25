'use client';

import React, { useState } from 'react';
import {
  Search,
  Bell,
  Plus,
  Radio,
  CheckCircle2,
  AlertTriangle,
  X,
  ExternalLink
} from 'lucide-react';
import { useForgeStore } from '../../store/useForgeStore';

interface TopHeaderV2Props {
  onOpenQuickAction: (actionType: string) => void;
  onOpenSearch: () => void;
}

export const TopHeaderV2: React.FC<TopHeaderV2Props> = ({ onOpenQuickAction, onOpenSearch }) => {
  const { activeEnvironment, setActiveEnvironment, notifications, markNotificationRead, clearAllNotifications } = useForgeStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-16 px-6 bg-[#11141B] border-b border-white/8 flex items-center justify-between z-20" style={{ background: '#11141B' }}>
      {/* Search Input Trigger */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg bg-[#171B24] border border-white/8 text-gray-400 hover:border-white/15 text-xs transition"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="flex-1 text-left">Search test cases, defects, API endpoints, or docs...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-gray-400">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Environment Switcher */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#171B24] border border-white/8">
          <span className="text-[11px] text-gray-400 font-medium">Env:</span>
          {(['Production', 'Staging', 'Localhost'] as const).map((env) => (
            <button
              key={env}
              onClick={() => setActiveEnvironment(env)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                activeEnvironment === env
                  ? 'bg-amber-500 text-black font-bold shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {env}
            </button>
          ))}
        </div>

        {/* Live Runner Status Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/25 text-teal-400 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span>2 runs live</span>
          <span className="text-gray-500">•</span>
          <span className="text-teal-300 font-bold">94.7% pass</span>
        </div>

        {/* Quick Action Button (+ New) */}
        <div className="relative">
          <button
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs shadow-md shadow-amber-500/20 transition"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New</span>
          </button>

          {showQuickMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#171B24] border border-white/12 shadow-2xl p-1.5 z-50 text-xs text-gray-200">
              <div className="px-2.5 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Create Asset
              </div>
              <button
                onClick={() => {
                  onOpenQuickAction('BUG');
                  setShowQuickMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-white/5 hover:text-amber-400 text-left transition"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Report Defect (Bug)</span>
              </button>
              <button
                onClick={() => {
                  onOpenQuickAction('TEST_CASE');
                  setShowQuickMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-white/5 hover:text-amber-400 text-left transition"
              >
                <span className="w-2 h-2 rounded-full bg-teal-500" />
                <span>Create Test Case</span>
              </button>
              <button
                onClick={() => {
                  onOpenQuickAction('API_REQUEST');
                  setShowQuickMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-white/5 hover:text-amber-400 text-left transition"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>New API Request</span>
              </button>
              <button
                onClick={() => {
                  onOpenQuickAction('RUN_TESTS');
                  setShowQuickMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-white/5 hover:text-amber-400 text-left transition"
              >
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span>Launch Test Run</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#11141B]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[#171B24] border border-white/12 shadow-2xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/8">
                <span className="text-xs font-bold text-white">Notifications</span>
                <button
                  onClick={clearAllNotifications}
                  className="text-[10px] text-amber-400 hover:underline"
                >
                  Mark all read
                </button>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer transition ${
                      n.read
                        ? 'bg-transparent border-transparent text-gray-400'
                        : 'bg-white/5 border-white/8 text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold mb-1">
                      <span className="text-amber-400">{n.title}</span>
                      <span className="text-[10px] text-gray-500">{n.timestamp}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-gray-300">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};