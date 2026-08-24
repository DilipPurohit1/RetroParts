import React, { useState } from 'react';
import { BookOpen, Check, Copy } from 'lucide-react';
import { Badge } from '../components/common/Badge.js';
import { Button } from '../components/common/Button.js';

interface EndpointSpec {
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  path: string;
  auth: 'Public' | 'Bearer JWT' | 'Admin JWT';
  summary: string;
  description: string;
  parameters?: string[];
  requestBody?: string;
  responseExample: string;
}

const API_ENDPOINTS: Record<string, EndpointSpec[]> = {
  Authentication: [
    {
      method: 'POST',
      path: '/api/v1/auth/register',
      auth: 'Public',
      summary: 'Register new buyer or seller account',
      description: 'Creates user credentials with bcrypt hash, sets 7d httpOnly refresh cookie, and returns 15m access token.',
      requestBody: JSON.stringify({ name: 'Aditya Restorations', email: 'aditya@example.com', password: 'password123', role: 'seller', sellerType: 'garage' }, null, 2),
      responseExample: JSON.stringify({ success: true, token: 'eyJhbGciOi...', user: { id: '6a86...', name: 'Aditya Restorations', role: 'seller' } }, null, 2),
    },
    {
      method: 'POST',
      path: '/api/v1/auth/login',
      auth: 'Public',
      summary: 'Authenticate with email & password',
      description: 'Validates credentials, rotates refresh token, and returns 15m access token.',
      requestBody: JSON.stringify({ email: 'user@retroparts.com', password: 'password123' }, null, 2),
      responseExample: JSON.stringify({ success: true, token: 'eyJhbGciOi...', user: { id: '6a86...', name: 'Kavita Sharma', role: 'buyer' } }, null, 2),
    },
    {
      method: 'POST',
      path: '/api/v1/auth/refresh',
      auth: 'Public',
      summary: 'Rotate JWT access token via httpOnly cookie',
      description: 'Reads retroparts_refresh_token cookie or payload body and issues fresh 15-minute access token.',
      responseExample: JSON.stringify({ success: true, token: 'eyJhbGciOi...' }, null, 2),
    },
  ],
  Vehicles: [
    {
      method: 'GET',
      path: '/api/v1/vehicles/brands',
      auth: 'Public',
      summary: 'Get all vehicle makes',
      description: 'Retrieves distinct brands across cars and motorcycles (Yamaha, Royal Enfield, Maruti, Honda, Premier, etc.).',
      parameters: ['type=car | bike'],
      responseExample: JSON.stringify(['Bajaj', 'Hindustan Motors', 'Honda', 'Maruti Suzuki', 'Premier', 'Royal Enfield', 'Yamaha'], null, 2),
    },
    {
      method: 'GET',
      path: '/api/v1/vehicles/models/:brand',
      auth: 'Public',
      summary: 'Get all models for a make',
      description: 'Returns production year spans, variants, and specs for cascading fitment dropdowns.',
      responseExample: JSON.stringify([{ model: 'RX100', yearFrom: 1985, yearTo: 1996, variants: ['Standard Escorts', 'Japanese Spec'] }], null, 2),
    },
  ],
  Listings: [
    {
      method: 'GET',
      path: '/api/v1/listings',
      auth: 'Public',
      summary: 'Multi-token search & discovery catalog',
      description: 'Search by multi-token keywords, vehicle make/model/year, category, condition, and rarity.',
      parameters: ['search=string', 'brand=string', 'model=string', 'year=number', 'category=string', 'condition=string', 'rarity=string', 'sort=newest|price_asc|price_desc|popular', 'page=number', 'limit=number'],
      responseExample: JSON.stringify({ success: true, data: [{ _id: '6a86...', title: 'Yamaha RX100 Original Mikuni Slide Carburetor', price: 8200, condition: 'NOS (New Old Stock)' }], pagination: { page: 1, total: 19, pages: 2 } }, null, 2),
    },
    {
      method: 'POST',
      path: '/api/v1/listings/ai-identify',
      auth: 'Public',
      summary: 'AI visual part identifier',
      description: 'Analyzes part photo or query to predict make, model, stamped OEM part number estimate, and recommended condition.',
      requestBody: JSON.stringify({ imageUrl: 'https://...', hintQuery: 'carburetor mikuni rx100' }, null, 2),
      responseExample: JSON.stringify({ success: true, identification: { suggestedTitle: 'Yamaha RX100 Original Mikuni VM20 Slide Carburetor', vehicleBrand: 'Yamaha', vehicleModel: 'RX100', estimatedOemNumber: '17G-14101-00-JP', confidenceScore: 0.94 } }, null, 2),
    },
  ],
  'Part Passports': [
    {
      method: 'GET',
      path: '/api/v1/passports/:listingId',
      auth: 'Public',
      summary: 'Get Part Passport provenance record',
      description: 'Retrieves 1:1 trust record, donor vehicle specs, storage history, defects disclosure, and admin review status.',
      responseExample: JSON.stringify({ success: true, passport: { certificateId: 'RP-CERT-8840', metallurgicalGrade: 'Grade A Factory Casting', verifiedOrigin: 'Made in Japan (Hamamatsu)', conditionNotes: 'NOS factory sealed packaging' } }, null, 2),
    },
  ],
  Orders: [
    {
      method: 'POST',
      path: '/api/v1/orders',
      auth: 'Bearer JWT',
      summary: 'Create escrow-vaulted order',
      description: 'Places order, vaults payment in Escrow Protection, and generates unique tracking number.',
      requestBody: JSON.stringify({ items: [{ listingId: '6a86...', quantity: 1, price: 8200 }], shippingAddress: { fullName: 'Kavita Sharma', city: 'Mumbai', pincode: '400050' }, paymentMethod: 'mock_card' }, null, 2),
      responseExample: JSON.stringify({ success: true, order: { orderNumber: 'RP-8491-0012', escrowStatus: 'vaulted_inspection_hold', trackingNumber: 'TRK-RP-98214401', totalAmount: 8200 } }, null, 2),
    },
  ],
};

export const ApiDocs: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Authentication');
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const handleCopy = (text: string, path: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'GET':
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-verified/15 text-verified border border-verified/30">GET</span>;
      case 'POST':
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-success/15 text-success border border-success/30">POST</span>;
      case 'PATCH':
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-warning/15 text-warning border border-warning/30">PATCH</span>;
      case 'DELETE':
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-danger/15 text-danger border border-danger/30">DELETE</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-surface-raised text-text-secondary border border-border">{method}</span>;
    }
  };

  return (
    <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 space-y-12 min-h-screen text-[#E5E5E5] bg-transparent text-left">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-mono font-bold uppercase tracking-wider bg-[#161616] text-[#E10600] border border-[#2A2A2A]">
          <BookOpen className="w-3.5 h-3.5" />
          <span>DEVELOPER PLATFORM API</span>
        </span>
        <h1 className="text-3xl sm:text-5xl font-display font-black uppercase text-white tracking-tight">
          RetroParts API Reference
        </h1>
        <p className="text-sm sm:text-base text-text-muted leading-relaxed">
          Integrate the RetroParts multi-token vehicle fitment engine, Part Passport provenance blockchain, and wanted parts matching network into your workshop ERP or enthusiast application.
        </p>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Category Navigation */}
        <div className="lg:col-span-3 bg-surface border border-border rounded-card p-4 space-y-1 sticky top-24">
          <span className="text-[11px] font-mono uppercase text-text-muted px-3 pb-2 block">
            API resource groups
          </span>
          {Object.keys(API_ENDPOINTS).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`w-full text-left px-3 py-2 rounded text-[13px] font-medium transition-colors flex items-center justify-between ${
                activeCategory === cat
                  ? 'bg-accent text-white'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-raised'
              }`}
            >
              <span>{cat}</span>
              <span className="text-[11px] font-mono opacity-70">
                {API_ENDPOINTS[cat].length}
              </span>
            </button>
          ))}
        </div>

        {/* Right: Endpoints Documentation */}
        <div className="lg:col-span-9 space-y-6">
          <div className="border-b border-border pb-3 flex items-center justify-between">
            <h2 className="text-2xl font-display font-medium text-text-primary">
              {activeCategory} endpoints
            </h2>
            <span className="text-[12px] font-mono text-text-muted">
              Base URL: https://api.retroparts.com
            </span>
          </div>

          <div className="space-y-6">
            {API_ENDPOINTS[activeCategory]?.map((endpoint, idx) => (
              <div
                key={idx}
                className="p-6 rounded-card bg-surface border border-border space-y-4 shadow-sm"
              >
                {/* Method & Path */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                  <div className="flex items-center gap-3">
                    {getMethodBadge(endpoint.method)}
                    <code className="text-[14px] font-mono font-medium text-text-primary">
                      {endpoint.path}
                    </code>
                    <button
                      type="button"
                      onClick={() => handleCopy(endpoint.path, endpoint.path)}
                      className="p-1 rounded text-text-muted hover:text-text-primary transition-colors"
                      title="Copy path"
                    >
                      {copiedPath === endpoint.path ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <Badge variant={endpoint.auth === 'Public' ? 'default' : 'copper'}>
                    {endpoint.auth}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-medium text-[15px] text-text-primary">{endpoint.summary}</h4>
                  <p className="text-[13px] text-text-muted mt-1 leading-relaxed">{endpoint.description}</p>
                </div>

                {/* Parameters */}
                {endpoint.parameters && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] font-mono uppercase text-text-muted">Query parameters:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {endpoint.parameters.map((p, pIdx) => (
                        <code key={pIdx} className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-raised border border-border text-text-secondary">
                          {p}
                        </code>
                      ))}
                    </div>
                  </div>
                )}

                {/* Request Body */}
                {endpoint.requestBody && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] font-mono uppercase text-text-muted">Request payload example (JSON):</span>
                    <pre className="p-3.5 rounded bg-base border border-border text-text-primary text-[12px] font-mono overflow-x-auto">
                      {endpoint.requestBody}
                    </pre>
                  </div>
                )}

                {/* Response Example */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-mono uppercase text-text-muted">Response schema (200 OK):</span>
                  <pre className="p-3.5 rounded bg-base border border-border text-verified text-[12px] font-mono overflow-x-auto">
                    {endpoint.responseExample}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
