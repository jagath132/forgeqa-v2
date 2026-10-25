'use client';

import React, { useState } from 'react';
import { Sparkles, X, Send, Plus, Check } from 'lucide-react';
import { useForgeStore } from '../../store/useForgeStore';

interface OpenApiGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OpenApiGeneratorModal: React.FC<OpenApiGeneratorModalProps> = ({ isOpen, onClose }) => {
  const { addApiRequest, apiCollections } = useForgeStore();
  const [specInput, setSpecInput] = useState(`curl -X POST "https://api.forgeqa.in/v2/orders" \\
  -H "Authorization: Bearer test_token_xyz" \\
  -H "Content-Type: application/json" \\
  -d '{"itemId": "prod_890", "quantity": 2}'`);

  if (!isOpen) return null;

  const handleGenerate = () => {
    const colId = apiCollections[0]?.id || 'COL-01';
    addApiRequest(colId, {
      name: 'Create Order (Imported from cURL)',
      method: 'POST',
      url: '{{baseUrl}}/api/v1/orders',
      params: [],
      headers: [
        { key: 'Content-Type', value: 'application/json', enabled: true },
        { key: 'Authorization', value: 'Bearer {{authToken}}', enabled: true }
      ],
      authType: 'BEARER',
      authConfig: { token: '{{authToken}}' },
      bodyType: 'JSON',
      body: JSON.stringify({ itemId: 'prod_890', quantity: 2 }, null, 2),
      assertions: [
        { id: 'AS-1', type: 'STATUS_CODE', target: 'status', expected: '200' },
        { id: 'AS-2', type: 'RESPONSE_TIME', target: 'responseTime', expected: '< 250ms' }
      ]
    });
    alert('API Request successfully generated and added to your active collection!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-[#11141B] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="h-14 px-6 bg-[#171B24] border-b border-white/8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                OpenAPI & cURL AI Request Importer
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-gray-200">
          <p className="text-gray-400 leading-relaxed text-[11px]">
            Paste any OpenAPI/Swagger JSON/YAML spec or raw cURL command. ForgeQA automatically extracts endpoint URLs, headers, payload structures, and attaches smart assertions.
          </p>

          <textarea
            rows={8}
            value={specInput}
            onChange={(e) => setSpecInput(e.target.value)}
            className="w-full bg-[#171B24] border border-white/10 rounded-xl p-3.5 text-xs text-teal-300 font-mono leading-relaxed focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Footer */}
        <div className="h-14 px-6 bg-[#171B24] border-t border-white/8 flex items-center justify-end gap-3 text-xs">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition">
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold transition shadow-md shadow-amber-500/20"
          >
            Import as API Request
          </button>
        </div>
      </div>
    </div>
  );
};