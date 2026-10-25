'use client';

import React from 'react';
import {
  Layers,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Plus
} from 'lucide-react';
import { useForgeStore } from '../../store/useForgeStore';

export const IntegrationsPage: React.FC = () => {
  const { integrations, toggleIntegration } = useForgeStore();

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#11141B] border border-white/8 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Integrations & Connectors Hub
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono font-bold">
                12 Connectors
              </span>
            </h1>
            <p className="text-xs text-gray-400">
              Bi-directional synchronization with Jira, GitHub, Slack, Postman, and CI/CD pipelines.
            </p>
          </div>
        </div>
      </div>

      {/* Connectors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl bg-[#11141B] border border-white/8 shadow-lg flex flex-col justify-between hover:border-white/15 transition space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-bold text-white">{item.name}</span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    item.status === 'CONNECTED'
                      ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                      : item.status === 'CONFIG_REQUIRED'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-white/5 text-gray-400'
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{item.description}</p>
            </div>

            <div className="pt-4 border-t border-white/8 flex items-center justify-between text-xs">
              <span className="text-[11px] text-gray-500 font-mono">{item.syncInterval}</span>
              <button
                onClick={() => toggleIntegration(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  item.status === 'CONNECTED'
                    ? 'bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 text-gray-300'
                    : 'bg-amber-500 hover:bg-amber-400 text-black font-bold'
                }`}
              >
                {item.status === 'CONNECTED' ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};