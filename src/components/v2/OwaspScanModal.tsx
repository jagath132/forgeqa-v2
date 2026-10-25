'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, X, Check, ShieldCheck, Loader2 } from 'lucide-react';
import { useForgeStore } from '../../store/useForgeStore';

interface OwaspScanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OwaspScanModal: React.FC<OwaspScanModalProps> = ({ isOpen, onClose }) => {
  const { runSecurityScan } = useForgeStore();
  const [progress, setProgress] = useState(0);
  const [currentCheck, setCurrentCheck] = useState('Initializing passive security crawler...');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setIsDone(false);
      return;
    }

    const checks = [
      'Scanning OWASP A01: Broken Access Control...',
      'Scanning OWASP A02: Cryptographic Failures...',
      'Scanning OWASP A03: Injection (SQLi / XSS boundary fuzzing)...',
      'Scanning OWASP A04: Insecure Design & Rate Limiting...',
      'Scanning OWASP A05: Security Misconfigurations & Stack Leaks...',
      'Scanning OWASP A07: Identification and Authentication Failures...',
      'Synthesizing CVSS v3.1 finding scores and remediation diffs...'
    ];

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < checks.length) {
        setCurrentCheck(checks[step]);
        setProgress(Math.round((step / checks.length) * 100));
      } else {
        clearInterval(interval);
        setProgress(100);
        setCurrentCheck('OWASP Top 10 Scan complete! Security Posture updated to 84/100.');
        setIsDone(true);
        runSecurityScan();
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isOpen, runSecurityScan]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#11141B] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="h-14 px-6 bg-[#171B24] border-b border-white/8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                Active OWASP Top 10 Security Scan
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs text-gray-200">
          <div className="text-center space-y-2 py-4">
            {isDone ? (
              <div className="w-12 h-12 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/40 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30 flex items-center justify-center mx-auto animate-spin">
                <Loader2 className="w-6 h-6" />
              </div>
            )}
            <div className="text-base font-bold text-white font-mono">{progress}% Complete</div>
            <p className="text-xs text-teal-300 font-mono">{currentCheck}</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-black/50 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="h-14 px-6 bg-[#171B24] border-t border-white/8 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-extrabold text-xs transition shadow-md shadow-teal-500/20"
          >
            {isDone ? 'View Security Findings' : 'Run in Background'}
          </button>
        </div>
      </div>
    </div>
  );
};