'use client';

import React, { useState } from 'react';
import {
  Send,
  Plus,
  Folder,
  Code,
  CheckCircle2,
  Clock,
  Sparkles,
  Copy,
  Layers,
  Database,
  Play,
  Trash2
} from 'lucide-react';
import { useForgeStore } from '../../store/useForgeStore';
import type { HttpMethod, ApiParam, ApiHeader, ApiAssertion } from '../../types/v2';
import { OpenApiGeneratorModal } from '../../components/v2/OpenApiGeneratorModal';

export const ApiClientPage: React.FC = () => {
  const {
    apiCollections,
    activeRequestId,
    activeResponse,
    isSendingRequest,
    setActiveRequestId,
    updateActiveRequest,
    sendActiveRequest,
    addApiRequest
  } = useForgeStore();

  const [activeTab, setActiveTab] = useState<'PARAMS' | 'HEADERS' | 'BODY' | 'ASSERTIONS' | 'MOCKS'>('PARAMS');
  const [showOpenApiModal, setShowOpenApiModal] = useState(false);

  // Find active collection and request
  let currentRequest = apiCollections[0]?.requests[0];
  for (const col of apiCollections) {
    const found = col.requests.find((r) => r.id === activeRequestId);
    if (found) {
      currentRequest = found;
      break;
    }
  }

  const methodColors: Record<HttpMethod, string> = {
    GET: 'text-teal-400 bg-teal-500/15 border-teal-500/30',
    POST: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
    PUT: 'text-blue-400 bg-blue-500/15 border-blue-500/30',
    PATCH: 'text-purple-400 bg-purple-500/15 border-purple-500/30',
    DELETE: 'text-rose-400 bg-rose-500/15 border-rose-500/30',
    OPTIONS: 'text-gray-400 bg-white/5 border-white/10',
    HEAD: 'text-gray-400 bg-white/5 border-white/10'
  };

  const handleAddParam = () => {
    if (!currentRequest) return;
    const newParams: ApiParam[] = [...currentRequest.params, { key: 'newParam', value: 'value', enabled: true }];
    updateActiveRequest({ params: newParams });
  };

  const handleAddHeader = () => {
    if (!currentRequest) return;
    const newHeaders: ApiHeader[] = [...currentRequest.headers, { key: 'X-Custom-Header', value: '123', enabled: true }];
    updateActiveRequest({ headers: newHeaders });
  };

  const handleAddAssertion = () => {
    if (!currentRequest) return;
    const newAssertions: ApiAssertion[] = [
      ...currentRequest.assertions,
      { id: `AS-${Date.now()}`, type: 'RESPONSE_TIME', target: 'responseTime', expected: '< 300ms', passed: true }
    ];
    updateActiveRequest({ assertions: newAssertions });
  };

  return (
    <div className="h-[calc(100vh-130px)] flex gap-4 max-w-7xl mx-auto pb-4">
      {/* Left Collections Tree Pane */}
      <div className="w-72 bg-[#11141B] border border-white/8 rounded-2xl flex flex-col p-4 shadow-xl flex-shrink-0">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/8">
          <div className="flex items-center gap-2">
            <Folder className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Collections</span>
          </div>
          <button
            onClick={() => addApiRequest(apiCollections[0]?.id || 'COL-01', {
              name: 'Custom Endpoint',
              method: 'GET',
              url: '{{baseUrl}}/api/v1/orders',
              params: [],
              headers: [],
              authType: 'NONE',
              authConfig: {},
              bodyType: 'NONE',
              body: '',
              assertions: []
            })}
            className="p-1 rounded hover:bg-white/10 text-gray-300"
            title="Add Request"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          {apiCollections.map((col) => (
            <div key={col.id} className="space-y-1">
              <div className="text-[11px] font-bold text-gray-400 px-2 py-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-gray-500" />
                <span>{col.name}</span>
              </div>
              <div className="space-y-1 pl-2">
                {col.requests.map((req) => (
                  <button
                    key={req.id}
                    onClick={() => setActiveRequestId(req.id)}
                    className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-left transition font-mono ${
                      activeRequestId === req.id
                        ? 'bg-amber-500/15 border border-amber-500/30 text-white font-semibold'
                        : 'text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    <span className={`text-[9px] font-bold px-1 rounded ${methodColors[req.method]}`}>
                      {req.method}
                    </span>
                    <span className="truncate flex-1 text-[11px] font-sans">{req.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Postman / OpenAPI Import CTA */}
        <div className="pt-3 border-t border-white/8">
          <button
            onClick={() => setShowOpenApiModal(true)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-amber-400 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI OpenAPI / cURL Importer</span>
          </button>
        </div>
      </div>

      {/* Center & Right Request / Response Workbench */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {/* Top Request Bar */}
        <div className="p-4 rounded-2xl bg-[#11141B] border border-white/8 shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <select
              value={currentRequest?.method || 'GET'}
              onChange={(e) => updateActiveRequest({ method: e.target.value as HttpMethod })}
              className={`px-3 py-2.5 rounded-xl font-mono font-bold text-xs border focus:outline-none ${
                methodColors[currentRequest?.method || 'GET']
              }`}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
              <option value="DELETE">DELETE</option>
            </select>

            <input
              type="text"
              value={currentRequest?.url || ''}
              onChange={(e) => updateActiveRequest({ url: e.target.value })}
              className="flex-1 bg-[#171B24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder-gray-500 focus:outline-none focus:border-amber-500"
              placeholder="https://api.example.com/v1/resource"
            />

            <button
              onClick={sendActiveRequest}
              disabled={isSendingRequest}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 transition"
            >
              <Send className="w-3.5 h-3.5 fill-black" />
              <span>{isSendingRequest ? 'Sending...' : 'Send'}</span>
            </button>
          </div>

          {/* Request Config Tabs */}
          <div className="flex items-center justify-between border-b border-white/8 pt-1 text-xs">
            <div className="flex items-center gap-1">
              {(['PARAMS', 'HEADERS', 'BODY', 'ASSERTIONS', 'MOCKS'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 font-medium border-b-2 transition -mb-px ${
                    activeTab === tab
                      ? 'border-amber-400 text-amber-400 font-bold'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  {tab}
                  {tab === 'ASSERTIONS' && currentRequest?.assertions && (
                    <span className="ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full bg-teal-500/20 text-teal-300 font-mono">
                      {currentRequest.assertions.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {activeTab === 'PARAMS' && (
              <button onClick={handleAddParam} className="text-amber-400 text-[11px] font-bold hover:underline">
                + Add Parameter
              </button>
            )}
            {activeTab === 'HEADERS' && (
              <button onClick={handleAddHeader} className="text-amber-400 text-[11px] font-bold hover:underline">
                + Add Header
              </button>
            )}
            {activeTab === 'ASSERTIONS' && (
              <button onClick={handleAddAssertion} className="text-amber-400 text-[11px] font-bold hover:underline">
                + Add Assertion
              </button>
            )}
          </div>

          {/* Tab Content Pane */}
          <div className="min-h-[110px] text-xs">
            {activeTab === 'PARAMS' && (
              <div className="space-y-2 pt-2">
                {currentRequest?.params.map((p, idx) => (
                  <div key={idx} className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={p.key}
                      onChange={(e) => {
                        const newP = [...currentRequest.params];
                        newP[idx].key = e.target.value;
                        updateActiveRequest({ params: newP });
                      }}
                      className="bg-[#171B24] border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono text-xs"
                    />
                    <input
                      type="text"
                      value={p.value}
                      onChange={(e) => {
                        const newP = [...currentRequest.params];
                        newP[idx].value = e.target.value;
                        updateActiveRequest({ params: newP });
                      }}
                      className="bg-[#171B24] border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono text-xs"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'HEADERS' && (
              <div className="space-y-2 pt-2">
                {currentRequest?.headers.map((h, idx) => (
                  <div key={idx} className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={h.key}
                      onChange={(e) => {
                        const newH = [...currentRequest.headers];
                        newH[idx].key = e.target.value;
                        updateActiveRequest({ headers: newH });
                      }}
                      className="bg-[#171B24] border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono text-xs"
                    />
                    <input
                      type="text"
                      value={h.value}
                      onChange={(e) => {
                        const newH = [...currentRequest.headers];
                        newH[idx].value = e.target.value;
                        updateActiveRequest({ headers: newH });
                      }}
                      className="bg-[#171B24] border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono text-xs"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'BODY' && (
              <div className="pt-2">
                <textarea
                  rows={4}
                  value={currentRequest?.body || '{\n  "test": true\n}'}
                  onChange={(e) => updateActiveRequest({ body: e.target.value })}
                  className="w-full bg-[#171B24] border border-white/10 rounded-xl p-3 text-xs font-mono text-teal-300 focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            {activeTab === 'ASSERTIONS' && (
              <div className="space-y-2 pt-2">
                {currentRequest?.assertions.map((as) => (
                  <div key={as.id} className="flex items-center justify-between p-2.5 rounded-lg bg-[#171B24] border border-white/6 text-xs font-mono">
                    <span className="text-teal-400 font-bold">{as.type}</span>
                    <span className="text-gray-300">Expected: {as.expected}</span>
                    <span className="text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">PASSED</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'MOCKS' && (
              <div className="pt-2 text-xs space-y-2">
                <p className="text-gray-400">Define mock response when backend is offline or in sandbox mode:</p>
                <div className="p-3 rounded-xl bg-[#171B24] border border-white/8 space-y-2 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-400">Mock Status: 200 OK</span>
                    <span className="text-teal-400">Simulated Delay: 120ms</span>
                  </div>
                  <pre className="text-teal-300 text-[11px]">{`{ "mock": true, "status": "active" }`}</pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Response Viewer */}
        <div className="flex-1 bg-[#11141B] border border-white/8 rounded-2xl flex flex-col p-4 shadow-xl overflow-hidden min-h-0">
          <div className="flex items-center justify-between pb-3 border-b border-white/8">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Response</span>
              {activeResponse && (
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-2 py-0.5 rounded font-bold bg-teal-500/20 text-teal-400 border border-teal-500/30">
                    {activeResponse.statusCode} {activeResponse.statusText}
                  </span>
                  <span className="text-gray-400">{activeResponse.responseTimeMs}ms</span>
                  <span className="text-gray-400">{activeResponse.responseSizeBytes} B</span>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                if (activeResponse) navigator.clipboard.writeText(activeResponse.body);
              }}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-white"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy JSON</span>
            </button>
          </div>

          <div className="flex-1 overflow-auto pt-3">
            <pre className="text-xs font-mono text-teal-300 leading-relaxed overflow-x-auto">
              {activeResponse?.body || 'No response captured yet. Click "Send" above.'}
            </pre>
          </div>
        </div>
      </div>

      {/* OpenAPI Modal */}
      <OpenApiGeneratorModal isOpen={showOpenApiModal} onClose={() => setShowOpenApiModal(false)} />
    </div>
  );
};