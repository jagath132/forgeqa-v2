'use client';

import React from 'react';
import { Sparkles, X, Database, Cpu, Activity, CheckCircle2, ArrowRight } from 'lucide-react';

interface BottleneckAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BottleneckAdvisorModal: React.FC<BottleneckAdvisorModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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
                AI Performance Bottleneck Diagnostic
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-gray-200">
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 space-y-1.5">
            <span className="font-bold text-rose-400 uppercase text-[10px] font-mono">PRIMARY BOTTLENECK DETECTED</span>
            <h3 className="text-sm font-bold text-white">PostgreSQL Connection Pool Saturation at 480 Concurrent VUs</h3>
            <p className="text-[11px] text-gray-300 leading-relaxed">
              When virtual user ramp-up exceeded 450 users, database connection pool hit 100% saturation (100 of 100 connections in active checkout transaction blocks). Average query queuing time increased by +1,240% from 14ms to 188ms.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[11px] font-mono">
            <div className="p-3 rounded-xl bg-[#171B24] border border-white/8">
              <span className="text-gray-400 block mb-1">IMPACTED ENDPOINT</span>
              <span className="text-teal-400 font-bold block">POST /api/v1/checkout</span>
              <span className="text-gray-500 text-[10px]">P99 Latency: 480ms (SLA Breach)</span>
            </div>
            <div className="p-3 rounded-xl bg-[#171B24] border border-white/8">
              <span className="text-gray-400 block mb-1">RECOMMENDED REMEDY</span>
              <span className="text-amber-400 font-bold block">PgBouncer Transaction Pool</span>
              <span className="text-gray-500 text-[10px]">Increases concurrency capacity 5x</span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">
              Recommended Postgres / PgBouncer Tuning Patch
            </span>
            <pre className="p-3.5 rounded-xl bg-black/60 border border-white/10 font-mono text-[11px] text-teal-300 leading-relaxed overflow-x-auto">
{`# /etc/pgbouncer/pgbouncer.ini
pool_mode = transaction
max_client_conn = 2000
default_pool_size = 50
reserve_pool_size = 15
reserve_pool_timeout = 2.0`}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="h-14 px-6 bg-[#171B24] border-t border-white/8 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition shadow-md shadow-amber-500/20"
          >
            Apply Optimization Insights
          </button>
        </div>
      </div>
    </div>
  );
};