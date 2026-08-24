import React, { useState } from 'react';
import { Sparkles, Check, Loader2, X, Cpu } from 'lucide-react';
import { listingService } from '../../services/listingService.js';
import { Button } from '../common/Button.js';
import { Badge } from '../common/Badge.js';

interface AIPartScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyData?: (detectedData: {
    title: string;
    categoryName: string;
    vehicleBrand: string;
    vehicleModel: string;
    oemNumber: string;
    condition: any;
  }) => void;
}

const PRESET_SCAN_SAMPLES = [
  {
    name: 'Yamaha RX100 Mikuni Slide Carburetor',
    url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80',
    query: 'carburetor mikuni rx100',
  },
  {
    name: 'Maruti 800 SS80 Honeycomb Chrome Grille',
    url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&auto=format&fit=crop&q=80',
    query: 'grille honeycomb ss80 chrome',
  },
  {
    name: 'Bullet 350 Heavy Crankshaft Assembly',
    url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop&q=80',
    query: 'crankshaft bullet 350 heavy cast iron',
  },
];

export const AIPartScannerModal: React.FC<AIPartScannerModalProps> = ({ isOpen, onClose, onApplyData }) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleScan = async (urlToScan: string, hint?: string) => {
    setIsScanning(true);
    setScanResult(null);
    try {
      const result = await listingService.aiIdentify({
        imageUrl: urlToScan,
        hintQuery: hint || urlToScan,
      });
      setScanResult(result);
    } catch (err) {
      console.error('AI Part identification failed', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleApply = () => {
    if (!scanResult || !onApplyData) return;
    onApplyData({
      title: scanResult.suggestedTitle,
      categoryName: scanResult.category,
      vehicleBrand: scanResult.vehicleBrand,
      vehicleModel: scanResult.vehicleModel,
      oemNumber: scanResult.estimatedOemNumber,
      condition: scanResult.detectedCondition,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in text-text-primary">
      <div className="relative w-full max-w-2xl bg-surface border border-border rounded-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-raised">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-surface border border-border text-accent">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-medium text-base text-text-primary flex items-center gap-2">
                AI visual part identifier <Badge variant="copper">Automotive vision</Badge>
              </h3>
              <p className="text-[12px] text-text-muted">
                Scan photos to automatically detect make, model, OEM part numbers, and condition.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary p-1.5 rounded hover:bg-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick presets or input */}
          <div className="space-y-3">
            <label className="text-[12px] font-medium text-text-muted uppercase">
              Quick test samples or image URL
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {PRESET_SCAN_SAMPLES.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setImageUrl(sample.url);
                    handleScan(sample.url, sample.query);
                  }}
                  className="p-2.5 text-left rounded border border-border bg-surface-raised hover:border-accent hover:bg-surface transition-colors group"
                >
                  <p className="text-[13px] font-medium text-text-primary truncate group-hover:text-accent">{sample.name}</p>
                  <span className="text-[11px] text-text-muted">Click to analyze</span>
                </button>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Paste direct part photo URL (or component name)..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded border border-border bg-surface-raised text-text-primary text-[13px] focus:border-accent focus:outline-none"
              />
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => handleScan(imageUrl)}
                disabled={!imageUrl || isScanning}
                isLoading={isScanning}
                className="shrink-0"
              >
                <Sparkles className="w-4 h-4 mr-1.5" /> Analyze part
              </Button>
            </div>
          </div>

          {/* Scanning Animation */}
          {isScanning && (
            <div className="p-8 rounded border border-dashed border-accent/40 bg-surface-raised text-center space-y-3 animate-pulse">
              <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto" />
              <p className="text-[14px] font-medium text-text-primary">Analyzing physical component geometry & period stamps...</p>
              <p className="text-[12px] text-text-muted">Matching against vintage OEM parts database & metallurgical markers</p>
            </div>
          )}

          {/* Detection Results */}
          {scanResult && !isScanning && (
            <div className="p-5 rounded border border-border bg-surface-raised space-y-4 animate-fade-in">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-mono font-medium text-accent uppercase">
                    High confidence detection ({(scanResult.confidenceScore * 100).toFixed(0)}%)
                  </span>
                  <h4 className="text-base font-medium text-text-primary mt-0.5">{scanResult.suggestedTitle}</h4>
                </div>
                <Badge variant="success">Verified match</Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[13px]">
                <div className="p-2.5 rounded bg-surface border border-border">
                  <span className="text-text-muted block text-[11px]">Make / model</span>
                  <span className="font-medium text-text-primary">{scanResult.vehicleBrand} {scanResult.vehicleModel}</span>
                </div>
                <div className="p-2.5 rounded bg-surface border border-border">
                  <span className="text-text-muted block text-[11px]">Category</span>
                  <span className="font-medium text-text-primary">{scanResult.category}</span>
                </div>
                <div className="p-2.5 rounded bg-surface border border-border">
                  <span className="text-text-muted block text-[11px]">Est. OEM number</span>
                  <span className="font-mono font-medium text-accent">{scanResult.estimatedOemNumber}</span>
                </div>
                <div className="p-2.5 rounded bg-surface border border-border">
                  <span className="text-text-muted block text-[11px]">Condition</span>
                  <span className="font-medium text-text-primary">{scanResult.detectedCondition}</span>
                </div>
              </div>

              {/* Visual Highlights */}
              {scanResult.visualHighlights && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-medium text-text-muted uppercase">Visual evidence detected:</span>
                  <ul className="text-[12px] text-text-secondary space-y-1">
                    {scanResult.visualHighlights.map((hl: string, i: number) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-success shrink-0" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action */}
              {onApplyData && (
                <div className="pt-2 flex justify-end">
                  <Button type="button" variant="primary" size="sm" onClick={handleApply}>
                    <Check className="w-4 h-4 mr-1.5" /> Auto-fill listing form
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
