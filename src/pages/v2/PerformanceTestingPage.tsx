'use client';

import React, { useState, useEffect } from 'react';
import {
  Gauge,
  Play,
  Square,
  Activity,
  Zap,
  TrendingUp,
  AlertTriangle,
  Globe,
  Sparkles,
  Clock
} from 'lucide-react';
import { useForgeStore } from '../../store/useForgeStore';
import { BottleneckAdvisorModal } from '../../components/v2/BottleneckAdvisorModal';

export const PerformanceTestingPage: React.FC = () => {
  const { loadTestConfig, loadMetrics, isLoadTestRunning, startLoadTest, stopLoadTest } = useForgeStore();
  const [showAdvisor, setShowAdvisor] = useState(false);
  const [liveRps, setLiveRps] = useState(520);
  const [liveP95, setLiveP95] = useState(240);

  useEffect(() => {
    if (!isLoadTestRunning) return;
    const interval = setInterval(() => {
      setLiveRps(Math.floor(490 + Math.random() * 60));
      setLiveP95(Math.floor(220 + Math.random() * 40));
    }, 1200);
    return () => clearInterval(interval);
  }, [isLoadTestRunning]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#11141B] border border-white/8 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Performance & Distributed Load Testing
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono font-bold">
                k6 Cloud Core
              </span>
            </h1>
            <p className="text-xs text-gray-400">
              Configure virtual user ramp-ups, measure P95/P99 latency spikes, and detect backend database bottlenecks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAdvisor(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-amber-400 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Bottleneck Advisor</span>
          </button>

          {isLoadTestRunning ? (
            <button
              onClick={stopLoadTest}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs shadow-lg shadow-rose-500/20 transition"
            >
              <Square className="w-3.5 h-3.5 fill-white" />
              <span>Stop Load Test</span>
            </button>
          ) : (
            <button
              onClick={startLoadTest}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 transition"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>Launch Stress Test</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Realtime Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#11141B] border border-white/8 shadow-lg">
          <span className="text-xs text-gray-400 font-semibold block mb-1">Throughput (RPS)</span>
          <div className="text-3xl font-extrabold font-mono text-teal-400 mb-1">{isLoadTestRunning ? liveRps : 520} req/s</div>
          <span className="text-[11px] text-gray-400">Total requests: 62,400</span>
        </div>
        <div className="p-5 rounded-2xl bg-[#11141B] border border-white/8 shadow-lg">
          <span className="text-xs text-gray-400 font-semibold block mb-1">P95 Latency</span>
          <div className="text-3xl font-extrabold font-mono text-amber-400 mb-1">{isLoadTestRunning ? liveP95 : 240} ms</div>
          <span className="text-[11px] text-teal-400 font-semibold">Under 350ms SLA Target</span>
        </div>
        <div className="p-5 rounded-2xl bg-[#11141B] border border-white/8 shadow-lg">
          <span className="text-xs text-gray-400 font-semibold block mb-1">P99 Latency</span>
          <div className="text-3xl font-extrabold font-mono text-rose-400 mb-1">480 ms</div>
          <span className="text-[11px] text-rose-300">Spike detected during peak ramp</span>
        </div>
        <div className="p-5 rounded-2xl bg-[#11141B] border border-white/8 shadow-lg">
          <span className="text-xs text-gray-400 font-semibold block mb-1">Error Rate</span>
          <div className="text-3xl font-extrabold font-mono text-white mb-1">0.02%</div>
          <span className="text-[11px] text-gray-400">12 total HTTP 504 gateway timeouts</span>
        </div>
      </div>

      {/* Real-time Dual Axis Graph Simulation */}
      <div className="p-6 rounded-2xl bg-[#11141B] border border-white/8 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Live Virtual Users (VUs) vs P95 Latency Response Curve</h3>
            <p className="text-xs text-gray-400">Dual-axis execution tracking over 120s duration</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Virtual Users (500 max)
            </span>
            <span className="flex items-center gap-1.5 text-teal-400">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400" /> P95 Latency (ms)
            </span>
          </div>
        </div>

        {/* Visual Graph Bars Representation */}
        <div className="h-64 bg-[#090B0E] rounded-xl p-4 border border-white/6 flex items-end justify-between gap-2">
          {loadMetrics.map((pt, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <div className="flex items-end gap-1.5 w-full justify-center h-48">
                {/* VU Bar (Amber) */}
                <div
                  className="w-1/3 bg-amber-500/80 rounded-t transition-all duration-300 group-hover:bg-amber-400"
                  style={{ height: `${(pt.virtualUsers / 500) * 100}%` }}
                  title={`${pt.virtualUsers} VUs`}
                />
                {/* Latency Bar (Teal) */}
                <div
                  className="w-1/3 bg-teal-500/80 rounded-t transition-all duration-300 group-hover:bg-teal-400"
                  style={{ height: `${(pt.p95LatencyMs / 300) * 100}%` }}
                  title={`P95: ${pt.p95LatencyMs}ms`}
                />
              </div>
              <span className="text-[10px] font-mono text-gray-500">{pt.timeSeconds}s</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Bottleneck Detective Card */}
      <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 shadow-xl space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>AI Bottleneck Diagnostic Finding</span>
          </div>
          <button onClick={() => setShowAdvisor(true)} className="text-xs text-amber-400 font-bold hover:underline">
            Inspect Full Diagnosis →
          </button>
        </div>
        <p className="text-gray-200 text-xs leading-relaxed">
          At 480 concurrent virtual users, PostgreSQL connection pool reached 98% utilization on endpoint <code className="text-teal-300">/api/v1/checkout</code>.
          Average query wait time increased from 14ms to 180ms.
          <strong className="block mt-1 text-white">Recommendation:</strong> Enable PgBouncer session pooling or scale read replica instances for checkout reads.
        </p>
      </div>

      {/* Bottleneck Modal */}
      <BottleneckAdvisorModal isOpen={showAdvisor} onClose={() => setShowAdvisor(false)} />
    </div>
  );
};