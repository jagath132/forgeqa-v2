'use client';

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Bug,
  Send,
  CheckSquare,
  Sparkles,
  BarChart3,
  Terminal,
  Gauge,
  ShieldAlert,
  Laptop2,
  FileText,
  Layers,
  CreditCard,
  Settings,
  ChevronDown,
  Building2,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { useForgeStore } from '../../store/useForgeStore';

interface SidebarV2Props {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const SidebarV2: React.FC<SidebarV2Props> = ({ collapsed, onToggleCollapse }) => {
  const location = useLocation();
  const { activeWorkspace, setActiveWorkspace, bugs } = useForgeStore();

  const criticalBugs = bugs.filter((b) => b.severity === 'CRITICAL' && b.status !== 'CLOSED').length;

  const coreModules = [
    { to: '/dashboard', label: 'QA Command Center', num: '01', icon: LayoutDashboard, badge: '87%' },
    { to: '/bugs', label: 'Bug Tracker (Kanban)', num: '02', icon: Bug, badge: `${criticalBugs} crit`, badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30' },
    { to: '/api-client', label: 'API Testing Client', num: '03', icon: Send },
    { to: '/test-management', label: 'Test Management', num: '04', icon: CheckSquare, badge: '96' },
    { to: '/assistant', label: 'Forge AI Copilot', num: '05', icon: Sparkles, badge: 'AI', badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
    { to: '/analytics', label: 'QA Analytics', num: '06', icon: BarChart3 }
  ];

  const executionModules = [
    { to: '/automation', label: 'Automation IDE', num: '07', icon: Terminal, badge: 'Run' },
    { to: '/performance', label: 'Performance Testing', num: '08', icon: Gauge },
    { to: '/security', label: 'Security OWASP Scanner', num: '09', icon: ShieldAlert, badge: '78', badgeColor: 'bg-teal-500/20 text-teal-400 border border-teal-500/30' },
    { to: '/cross-browser', label: 'Cross-Browser & Diff', num: '10', icon: Laptop2 },
    { to: '/docs', label: 'PRD & Traceability', num: '11', icon: FileText }
  ];

  const platformModules = [
    { to: '/integrations', label: 'Integrations Hub', icon: Layers },
    { to: '/pricing', label: 'Plans & Pricing', icon: CreditCard },
    { to: '/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside
      className={`flex flex-col flex-shrink-0 bg-[#11141B] border-r border-white/8 transition-all duration-200 select-none ${
        collapsed ? 'w-20' : 'w-72'
      }`}
      style={{ background: '#11141B' }}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 border-b border-white/8 flex items-center justify-between">
        <NavLink to="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center font-bold text-black text-lg shadow-lg shadow-amber-500/20 flex-shrink-0">
            ⚡
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white font-mono">ForgeQA</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30">
                  v2.0
                </span>
              </div>
              <span className="text-[11px] text-gray-400 truncate">All-in-One Testing Suite</span>
            </div>
          )}
        </NavLink>
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* Workspace Switcher */}
      {!collapsed && (
        <div className="p-3 border-b border-white/8">
          <div className="flex items-center justify-between p-2 rounded-lg bg-[#171B24] border border-white/6 hover:border-white/12 transition cursor-pointer">
            <div className="flex items-center gap-2.5 min-w-0">
              <Building2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <div className="truncate">
                <div className="text-xs font-semibold text-white truncate">{activeWorkspace}</div>
                <div className="text-[10px] text-gray-400">Enterprise Workspace</div>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Core Modules */}
        <div>
          {!collapsed && (
            <div className="px-3 mb-2 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
              Core Modules
            </div>
          )}
          <nav className="space-y-1">
            {coreModules.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-amber-400' : 'text-gray-400 group-hover:text-white'}`} />
                  {!collapsed && (
                    <>
                      <span className="font-mono text-[10px] text-gray-500 mr-0.5">{item.num}</span>
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                            item.badgeColor || 'bg-white/10 text-gray-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Execution & Infra */}
        <div>
          {!collapsed && (
            <div className="px-3 mb-2 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
              Execution & Infra
            </div>
          )}
          <nav className="space-y-1">
            {executionModules.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-amber-400' : 'text-gray-400 group-hover:text-white'}`} />
                  {!collapsed && (
                    <>
                      <span className="font-mono text-[10px] text-gray-500 mr-0.5">{item.num}</span>
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                            item.badgeColor || 'bg-white/10 text-gray-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Platform Settings & Integrations */}
        <div>
          {!collapsed && (
            <div className="px-3 mb-2 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
              Platform
            </div>
          )}
          <nav className="space-y-1">
            {platformModules.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-amber-400' : 'text-gray-400 group-hover:text-white'}`} />
                  {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-white/8 bg-[#0D0F14]">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center font-bold text-xs text-white flex-shrink-0">
            JM
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">Jagath (QA Lead)</div>
              <div className="text-[10px] text-teal-400 font-mono truncate">Pro Tier • 5,000 AI Runs</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};