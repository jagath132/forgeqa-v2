'use client';

import React, { useState } from 'react';
import { X, Sparkles, Check } from 'lucide-react';
import { useForgeStore } from '../../store/useForgeStore';

interface QuickActionModalProps {
  actionType: string;
  onClose: () => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({ actionType, onClose }) => {
  const { addBug, addTestCase, addApiRequest, apiCollections } = useForgeStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [module, setModule] = useState('Checkout Flow');
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [url, setUrl] = useState('https://staging.forgeqa.in/api/v1/checkout');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (actionType === 'BUG') {
      addBug({
        title,
        description,
        stepsToReproduce: ['Navigate to checkout', 'Fill test form', 'Click submit'],
        expectedResult: 'Transaction resolves with 200 OK',
        actualResult: 'Transaction fails with unexpected error',
        status: 'NEW',
        severity,
        priority: 'P1',
        module,
        assignee: { name: 'Jagath (Triage)', avatar: '', role: 'QA Lead' },
        reporter: 'Jagath (Manual Report)',
        environment: { browser: 'Chrome 122', os: 'Windows 11', screenRes: '1920x1080', userAgent: 'Chrome/122' },
        tags: [module, severity]
      });
    } else if (actionType === 'TEST_CASE') {
      addTestCase({
        title,
        suiteId: 'SUITE-01',
        suiteName: 'Core Suite',
        description,
        priority: severity,
        type: 'AUTOMATED',
        status: 'UNTESTED',
        preconditions: ['User authenticated in test session'],
        steps: [
          { stepNumber: 1, action: 'Perform action', expectedResult: 'Expected outcome occurs' }
        ],
        author: 'Jagath',
        tags: [module]
      });
    } else if (actionType === 'API_REQUEST') {
      const colId = apiCollections[0]?.id || 'COL-01';
      addApiRequest(colId, {
        name: title || 'New Request',
        method,
        url,
        params: [],
        headers: [{ key: 'Accept', value: 'application/json', enabled: true }],
        authType: 'NONE',
        authConfig: {},
        bodyType: 'NONE',
        body: '',
        assertions: [{ id: 'AS-1', type: 'STATUS_CODE', target: 'status', expected: '200' }]
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-[#11141B] border border-white/12 rounded-2xl shadow-2xl overflow-hidden">
        <div className="h-14 px-6 bg-[#171B24] border-b border-white/8 flex items-center justify-between">
          <div className="text-sm font-bold text-white flex items-center gap-2">
            <span>
              {actionType === 'BUG' && '🐞 Report New Defect'}
              {actionType === 'TEST_CASE' && '📋 Create New Test Case'}
              {actionType === 'API_REQUEST' && '⚡ Add API Request'}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-gray-400 font-medium mb-1.5">Title / Summary</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Payment webhook timeout on 3DS verification"
              className="w-full bg-[#171B24] border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {actionType === 'API_REQUEST' ? (
            <div className="grid grid-cols-4 gap-3">
              <div className="col-span-1">
                <label className="block text-gray-400 font-medium mb-1.5">Method</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as any)}
                  className="w-full bg-[#171B24] border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-amber-500 font-mono"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>
              <div className="col-span-3">
                <label className="block text-gray-400 font-medium mb-1.5">Request URL</label>
                <input
                  type="text"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-[#171B24] border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-400 font-medium mb-1.5">Severity / Priority</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full bg-[#171B24] border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 font-medium mb-1.5">Module</label>
                <select
                  value={module}
                  onChange={(e) => setModule(e.target.value)}
                  className="w-full bg-[#171B24] border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Billing & Payments">Billing & Payments</option>
                  <option value="Auth & Session">Auth & Session</option>
                  <option value="Checkout Flow">Checkout Flow</option>
                  <option value="API Gateway">API Gateway</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-gray-400 font-medium mb-1.5">Details / Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add reproduction steps, expected behavior, or acceptance criteria..."
              className="w-full bg-[#171B24] border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold shadow-md shadow-amber-500/20 transition"
            >
              Save Asset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};