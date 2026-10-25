'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Play,
  Sparkles,
  AlertTriangle,
  Lock,
  Code,
  Check,
  Copy,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useForgeStore } from '../../store/useForgeStore';
import { OwaspScanModal } from '../../components/v2/OwaspScanModal';

export const SecurityTestingPage: React.FC = () => {
  const {
    vulnerabilities,
    isSecurityScanRunning,
    securityScore,
    updateVulnerabilityStatus,
    sendAiMessage
  } = useForgeStore();

  const [selectedVulnId, setSelectedVulnId] = useState<string>(vulnerabilities[0]?.id || 'SEC-801');
  const [copied, setCopied] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);

  const selectedVuln = vulnerabilities.find((v) => v.id === selectedVulnId) || vulnerabilities[0];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMarkRemediated = (id: string) => {
    updateVulnerabilityStatus(id, 'REMEDIATED');
    alert(`Vulnerability ${id} marked as remediated! Security score adjusted.`);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#11141B] border border-white/8 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Security Testing & OWASP Top 10 Scanner
              <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30 font-mono font-bold">
                DAST + SAST Fuzzing
              </span>
            </h1>
            <p className="text-xs text-gray-400">
              Automated active vulnerability assessment with AI-assisted code remediation diffs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => sendAiMessage('Perform OWASP ASVS verification and suggest strict Content Security Policy headers')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-amber-400 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Compliance Audit</span>
          </button>

          <button
            onClick={() => setShowScanModal(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-extrabold text-xs shadow-lg shadow-teal-500/20 transition"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>Run OWASP Scan</span>
          </button>
        </div>
      </div>

      {/* Security Posture Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#11141B] border border-white/8 shadow-lg">
          <span className="text-xs text-gray-400 font-semibold block mb-1">Security Posture Score</span>
          <div className="text-3xl font-extrabold font-mono text-teal-400 mb-1">{securityScore} / 100</div>
          <span className="text-[11px] text-teal-300 font-semibold">Grade B+ (Target: 90+)</span>
        </div>
        <div className="p-5 rounded-2xl bg-[#11141B] border border-white/8 shadow-lg">
          <span className="text-xs text-gray-400 font-semibold block mb-1">Critical Findings</span>
          <div className="text-3xl font-extrabold font-mono text-teal-400 mb-1">0</div>
          <span className="text-[11px] text-gray-400">Zero active remote execution risks</span>
        </div>
        <div className="p-5 rounded-2xl bg-[#11141B] border border-white/8 shadow-lg">
          <span className="text-xs text-gray-400 font-semibold block mb-1">High Severity Alerts</span>
          <div className="text-3xl font-extrabold font-mono text-amber-400 mb-1">2</div>
          <span className="text-[11px] text-amber-300">XSS & Missing Auth Rate Limiter</span>
        </div>
        <div className="p-5 rounded-2xl bg-[#11141B] border border-white/8 shadow-lg">
          <span className="text-xs text-gray-400 font-semibold block mb-1">Compliance Target</span>
          <div className="text-3xl font-extrabold font-mono text-white mb-1">PCI-DSS 4.0</div>
          <span className="text-[11px] text-gray-400">8 of 10 checks verified</span>
        </div>
      </div>

      {/* Findings List & Interactive AI Remediation Diff */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Findings List */}
        <div className="p-4 rounded-2xl bg-[#11141B] border border-white/8 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/8">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Vulnerability Findings</span>
            <span className="text-[10px] font-mono text-gray-400">{vulnerabilities.length} Found</span>
          </div>

          <div className="space-y-2">
            {vulnerabilities.map((v) => (
              <div
                key={v.id}
                onClick={() => setSelectedVulnId(v.id)}
                className={`p-3.5 rounded-xl border transition cursor-pointer space-y-1.5 ${
                  selectedVulnId === v.id
                    ? 'bg-amber-500/15 border-amber-500/30 text-white'
                    : 'bg-[#171B24] border-white/6 text-gray-300 hover:border-white/12'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-amber-400">{v.id}</span>
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      v.status === 'REMEDIATED'
                        ? 'bg-teal-500/20 text-teal-400'
                        : v.severity === 'HIGH'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-white/10 text-gray-300'
                    }`}
                  >
                    {v.status === 'REMEDIATED' ? 'REMEDIATED' : `CVSS ${v.cvssScore}`}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white line-clamp-1">{v.title}</h4>
                <div className="text-[10px] text-gray-400 font-mono truncate">{v.method} {v.endpoint}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Remediation & Code Diff View */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#11141B] border border-white/8 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-white/8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-amber-400">{selectedVuln.id}</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400">
                  {selectedVuln.category}
                </span>
                <span className="text-xs font-mono text-gray-400">{selectedVuln.method} {selectedVuln.endpoint}</span>
              </div>
              <h2 className="text-base font-bold text-white">{selectedVuln.title}</h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleMarkRemediated(selectedVuln.id)}
                className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-black text-xs font-bold transition"
              >
                Mark as Remediated
              </button>
              <button
                onClick={() => handleCopy(selectedVuln.secureSnippet)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Patch'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">
              Vulnerability Description
            </span>
            <p className="text-gray-300 leading-relaxed bg-[#171B24] p-3 rounded-xl border border-white/6">
              {selectedVuln.description}
            </p>
          </div>

          {/* AI Remediation Diff */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>AI Code Remediation Patch (Side-by-Side Diff)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              {/* Vulnerable Code (Red) */}
              <div className="rounded-xl bg-rose-950/20 border border-rose-500/30 overflow-hidden">
                <div className="px-3 py-1.5 bg-rose-500/10 border-b border-rose-500/20 text-rose-400 font-bold text-[10px]">
                  - VULNERABLE CODE
                </div>
                <pre className="p-3 text-rose-300 text-[11px] overflow-x-auto whitespace-pre">
                  {selectedVuln.vulnerableSnippet}
                </pre>
              </div>

              {/* Secure Fixed Code (Teal) */}
              <div className="rounded-xl bg-teal-950/20 border border-teal-500/30 overflow-hidden">
                <div className="px-3 py-1.5 bg-teal-500/10 border-b border-teal-500/20 text-teal-400 font-bold text-[10px]">
                  + SECURE REMEDIATION
                </div>
                <pre className="p-3 text-teal-300 text-[11px] overflow-x-auto whitespace-pre">
                  {selectedVuln.secureSnippet}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scanner Modal */}
      <OwaspScanModal isOpen={showScanModal} onClose={() => setShowScanModal(false)} />
    </div>
  );
};