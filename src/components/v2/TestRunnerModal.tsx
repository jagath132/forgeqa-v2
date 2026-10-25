'use client';

import React, { useState, useEffect } from 'react';
import {
  Play,
  X,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Bug,
  Check,
  ChevronRight,
  ShieldCheck,
  Camera
} from 'lucide-react';
import { useForgeStore } from '../../store/useForgeStore';
import type { TestCaseV2, TestExecutionStatus } from '../../types/v2';

interface TestRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  suiteName?: string;
}

export const TestRunnerModal: React.FC<TestRunnerModalProps> = ({ isOpen, onClose, suiteName = 'Stripe Checkout & Billing v2' }) => {
  const { testCases, updateTestCaseStatus, addBug } = useForgeStore();

  const suiteTests = testCases.filter((tc) => tc.suiteName.includes('Checkout') || tc.suiteName.includes('Core'));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [stepStatuses, setStepStatuses] = useState<Record<number, TestExecutionStatus>>({});
  const [evidenceLog, setEvidenceLog] = useState('');
  const [showBugLoggedToast, setShowBugLoggedToast] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentTest: TestCaseV2 = suiteTests[currentIdx] || testCases[0];

  const handleStepStatus = (stepNum: number, status: TestExecutionStatus) => {
    setStepStatuses((prev) => ({ ...prev, [stepNum]: status }));
  };

  const handlePassTest = () => {
    updateTestCaseStatus(currentTest.id, 'PASSED');
    if (currentIdx < suiteTests.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setStepStatuses({});
    } else {
      alert('Suite execution complete! All results recorded.');
      onClose();
    }
  };

  const handleFailTest = () => {
    updateTestCaseStatus(currentTest.id, 'FAILED');
    if (currentIdx < suiteTests.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setStepStatuses({});
    } else {
      alert('Suite execution complete with failures.');
      onClose();
    }
  };

  const handleLogBugFromFailure = () => {
    addBug({
      title: `Failure during ${currentTest.id}: ${currentTest.title}`,
      description: `Failed during test execution at step: ${currentTest.steps[0]?.action || 'Execution'}. Evidence log: ${evidenceLog || 'None attached'}`,
      stepsToReproduce: currentTest.steps.map((s) => s.action),
      expectedResult: currentTest.steps[0]?.expectedResult || 'Step succeeds without error',
      actualResult: 'Step failed during execution',
      status: 'NEW',
      severity: currentTest.priority,
      priority: 'P1',
      module: currentTest.suiteName,
      assignee: { name: 'Jagath (Triage)', avatar: '', role: 'QA Lead' },
      reporter: 'Interactive Test Runner',
      environment: { browser: 'Chrome 122', os: 'Windows 11', screenRes: '1920x1080', userAgent: 'Chrome/122' },
      linkedTestCaseId: currentTest.id,
      tags: ['Auto-Logged', currentTest.suiteName]
    });
    setShowBugLoggedToast(true);
    setTimeout(() => setShowBugLoggedToast(false), 3000);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-[#11141B] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Runner Header */}
        <div className="h-16 px-6 bg-[#171B24] border-b border-white/8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <Play className="w-4 h-4 fill-teal-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                Live Test Execution Runner
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold">
                  {suiteName}
                </span>
              </div>
              <div className="text-[11px] text-gray-400">
                Test {currentIdx + 1} of {suiteTests.length} • Case ID: <strong className="text-amber-400 font-mono">{currentTest.id}</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 font-mono text-xs text-teal-400 font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(seconds)}</span>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Runner Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-gray-200">
          {showBugLoggedToast && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold flex items-center justify-between animate-in fade-in">
              <span>🐞 Defect logged and linked to {currentTest.id} automatically!</span>
              <span className="text-[10px] font-mono">Saved to Bug Tracker</span>
            </div>
          )}

          {/* Test Case Overview */}
          <div className="p-4 rounded-xl bg-[#171B24] border border-white/8 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">{currentTest.title}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-gray-300 font-bold">
                {currentTest.priority}
              </span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">{currentTest.description}</p>
          </div>

          {/* Preconditions */}
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1 font-mono">
              Preconditions
            </span>
            <ul className="list-disc list-inside space-y-1 bg-[#171B24] p-3 rounded-xl border border-white/6 text-gray-300 text-[11px]">
              {currentTest.preconditions.map((p, idx) => (
                <li key={idx}>{p}</li>
              ))}
            </ul>
          </div>

          {/* Step-by-Step Interactive Execution */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">
              Step Verification Checkpoints
            </span>
            <div className="space-y-2">
              {currentTest.steps.map((st) => {
                const status = stepStatuses[st.stepNumber] || 'UNTESTED';
                return (
                  <div
                    key={st.stepNumber}
                    className="p-3.5 rounded-xl bg-[#171B24] border border-white/8 flex items-center justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white text-xs mb-0.5">
                        Step {st.stepNumber}: {st.action}
                      </div>
                      <div className="text-[11px] text-teal-400 font-mono">
                        Expected: {st.expectedResult}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => handleStepStatus(st.stepNumber, 'PASSED')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition ${
                          status === 'PASSED'
                            ? 'bg-teal-500 text-black shadow-md'
                            : 'bg-white/5 hover:bg-teal-500/20 text-teal-400'
                        }`}
                      >
                        Pass
                      </button>
                      <button
                        onClick={() => handleStepStatus(st.stepNumber, 'FAILED')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition ${
                          status === 'FAILED'
                            ? 'bg-rose-500 text-white shadow-md'
                            : 'bg-white/5 hover:bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        Fail
                      </button>
                      <button
                        onClick={() => handleStepStatus(st.stepNumber, 'SKIPPED')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition ${
                          status === 'SKIPPED'
                            ? 'bg-amber-500 text-black shadow-md'
                            : 'bg-white/5 hover:bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        Skip
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Evidence Capture & Log */}
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1 font-mono">
              Execution Evidence & Console Logs
            </span>
            <textarea
              rows={3}
              value={evidenceLog}
              onChange={(e) => setEvidenceLog(e.target.value)}
              placeholder="Paste terminal error logs, API response payloads, or reproduction notes..."
              className="w-full bg-[#171B24] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>
        </div>

        {/* Runner Bottom Controls */}
        <div className="h-16 px-6 bg-[#171B24] border-t border-white/8 flex items-center justify-between text-xs">
          <button
            onClick={handleLogBugFromFailure}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold hover:bg-rose-500/30 transition"
          >
            <Bug className="w-3.5 h-3.5" />
            <span>Log Bug from Failed Step</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleFailTest}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold transition shadow-lg shadow-rose-600/20"
            >
              Mark Test Failed
            </button>
            <button
              onClick={handlePassTest}
              className="px-6 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-extrabold transition shadow-lg shadow-teal-500/20"
            >
              Mark Test Passed →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};