'use client';

import React, { useState } from 'react';
import {
  Laptop2,
  Smartphone,
  Tablet,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Layers,
  Eye,
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';
import { useForgeStore } from '../../store/useForgeStore';

export const CrossBrowserPage: React.FC = () => {
  const { visualDiffs, activeDiffId, setActiveDiffId, acceptBaseline, sendAiMessage } = useForgeStore();

  const [activeDevice, setActiveDevice] = useState<'DESKTOP' | 'TABLET' | 'MOBILE'>('DESKTOP');
  const [sliderPos, setSliderPos] = useState(50);
  const [viewMode, setViewMode] = useState<'SPLIT' | 'DIFF_OVERLAY' | 'SIDE_BY_SIDE'>('SPLIT');

  const activeDiff = visualDiffs.find((d) => d.id === activeDiffId) || visualDiffs[0];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#11141B] border border-white/8 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <Laptop2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Cross-Browser & Visual Regression Diff
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono font-bold">
                Pixel-Perfect AI
              </span>
            </h1>
            <p className="text-xs text-gray-400">
              Detect layout shifts, font mismatches, and pixel variances across Chrome, Safari, Firefox, and mobile viewports.
            </p>
          </div>
        </div>

        {/* Viewport Device Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#171B24] border border-white/8 text-xs font-semibold">
          <button
            onClick={() => setActiveDevice('DESKTOP')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeDevice === 'DESKTOP' ? 'bg-amber-500 text-black font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Laptop2 className="w-3.5 h-3.5" />
            <span>Desktop 1920</span>
          </button>
          <button
            onClick={() => setActiveDevice('TABLET')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeDevice === 'TABLET' ? 'bg-amber-500 text-black font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>iPad 768</span>
          </button>
          <button
            onClick={() => setActiveDevice('MOBILE')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeDevice === 'MOBILE' ? 'bg-amber-500 text-black font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile 375</span>
          </button>
        </div>
      </div>

      {/* Main Diff Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Screen Scenarios */}
        <div className="p-4 rounded-2xl bg-[#11141B] border border-white/8 shadow-xl space-y-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block pb-2 border-b border-white/8">
            Visual Snapshots
          </span>
          <div className="space-y-2">
            {visualDiffs.map((diff) => (
              <button
                key={diff.id}
                onClick={() => setActiveDiffId(diff.id)}
                className={`w-full text-left p-3 rounded-xl border transition ${
                  activeDiffId === diff.id
                    ? 'bg-amber-500/15 border-amber-500/30 text-white'
                    : 'bg-[#171B24] border-white/6 text-gray-300 hover:border-white/12'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold">{diff.name}</span>
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                      diff.diffPercent > 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-teal-500/20 text-teal-400'
                    }`}
                  >
                    {diff.diffPercent}% Diff
                  </span>
                </div>
                <div className="text-[10px] text-gray-400 font-mono">{diff.browser} • {diff.os}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Visual Comparison Viewport */}
        <div className="lg:col-span-3 p-6 rounded-2xl bg-[#11141B] border border-white/8 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/8">
            <div>
              <h3 className="text-sm font-bold text-white">{activeDiff.name} ({activeDiff.route})</h3>
              <p className="text-xs text-gray-400 font-mono">
                Running on {activeDiff.browser} ({activeDiff.os}) • Status: {activeDiff.status}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => acceptBaseline(activeDiff.id)}
                className="px-3.5 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-black font-bold text-xs transition"
              >
                Accept New Baseline
              </button>
            </div>
          </div>

          {/* Interactive Split Slider Container */}
          <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black min-h-[420px] flex items-center justify-center">
            <img
              src={activeDiff.baselineUrl}
              alt="Baseline Screen"
              className="w-full h-auto object-cover max-h-[500px]"
            />
            {activeDiff.diffPercent > 0 && (
              <div className="absolute top-4 right-4 bg-rose-500/90 text-white text-xs font-bold font-mono px-3 py-1.5 rounded-full shadow-lg">
                ⚠ {activeDiff.diffPercent}% Pixel Shift Detected
              </div>
            )}
          </div>

          {/* Slider Control */}
          <div className="flex items-center gap-4 text-xs text-gray-300 font-mono">
            <span>Baseline (Previous)</span>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="flex-1 accent-amber-500"
            />
            <span>Current Run (Diff: {sliderPos}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};