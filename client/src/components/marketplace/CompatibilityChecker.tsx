import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Wrench, Check } from 'lucide-react';
import { IListing, IVehicle, ICompatibility } from '../../types/index.js';
import { vehicleService } from '../../services/vehicleService.js';
import { useVehicle } from '../../context/VehicleContext.js';
import { Button } from '../common/Button.js';

export interface CompatibilityCheckerProps {
  listing: IListing;
}

export const CompatibilityChecker: React.FC<CompatibilityCheckerProps> = ({ listing }) => {
  const { activeVehicle } = useVehicle();
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<IVehicle[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>(activeVehicle?.brand || '');
  const [selectedModel, setSelectedModel] = useState<string>(activeVehicle?.model || '');
  const [selectedYear, setSelectedYear] = useState<string | number>(activeVehicle?.year || '');

  const [compatibilityStatus, setCompatibilityStatus] = useState<
    'idle' | 'exact' | 'partial' | 'incompatible'
  >('idle');

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await vehicleService.getBrands();
        setBrands(data || []);
      } catch (err) {
        console.warn('Failed to load brands in CompatibilityChecker', err);
      }
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    if (!selectedBrand) {
      setModels([]);
      setSelectedModel('');
      setSelectedYear('');
      setCompatibilityStatus('idle');
      return;
    }
    const fetchModels = async () => {
      try {
        const data = await vehicleService.getModelsByBrand(selectedBrand);
        setModels(data || []);
      } catch (err) {
        console.warn('Failed to load models in CompatibilityChecker', err);
      }
    };
    fetchModels();
  }, [selectedBrand]);

  // Auto-run if active vehicle is present
  useEffect(() => {
    if (selectedBrand && selectedModel) {
      handleCheck();
    }
  }, [selectedBrand, selectedModel, selectedYear]);

  const handleCheck = () => {
    if (!selectedBrand || !selectedModel) return;

    const targetBrand = selectedBrand.toLowerCase().trim();
    const targetModel = selectedModel.toLowerCase().trim();
    const targetYear = selectedYear ? parseInt(selectedYear.toString(), 10) : null;

    // Check direct primary match
    const isDirectBrandMatch = listing.vehicleBrand.toLowerCase().trim() === targetBrand;
    const isDirectModelMatch = listing.vehicleModel.toLowerCase().trim().includes(targetModel) ||
                               targetModel.includes(listing.vehicleModel.toLowerCase().trim());

    // Check compatibleVehicles array
    const matchedCompat = listing.compatibleVehicles?.find((comp: ICompatibility) => {
      const cBrand = comp.brand.toLowerCase().trim();
      const cModel = comp.model.toLowerCase().trim();
      const brandMatch = cBrand === targetBrand;
      const modelMatch = cModel.includes(targetModel) || targetModel.includes(cModel);

      let yearMatch = true;
      if (targetYear && comp.yearFrom && comp.yearTo) {
        yearMatch = targetYear >= comp.yearFrom && targetYear <= comp.yearTo;
      }
      return brandMatch && modelMatch && yearMatch;
    });

    if (matchedCompat || (isDirectBrandMatch && isDirectModelMatch)) {
      if (targetYear && listing.vehicleYear) {
        const listingYearNum = Number(listing.vehicleYear);
        if (!isNaN(listingYearNum) && listingYearNum === targetYear) {
          setCompatibilityStatus('exact');
          return;
        }
      }
      if (matchedCompat) {
        setCompatibilityStatus('exact');
        return;
      }
      setCompatibilityStatus('partial');
    } else if (isDirectBrandMatch) {
      setCompatibilityStatus('partial');
    } else {
      setCompatibilityStatus('incompatible');
    }
  };

  return (
    <div className="bg-surface border border-border rounded-card p-6 space-y-5 text-left text-text-primary">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Wrench className="w-4 h-4 text-accent" />
          <h3 className="font-display font-medium text-[14px] text-text-primary">
            Will this part work for my vehicle?
          </h3>
        </div>
        <span className="text-[11px] font-mono text-text-muted uppercase">
          Fitment engine
        </span>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-medium text-text-muted mb-1 font-mono uppercase">1. Make</label>
          <select
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setSelectedModel('');
              setSelectedYear('');
            }}
            className="w-full bg-surface-raised border border-border rounded px-3 py-2 text-[13px] text-text-primary outline-none focus:border-accent cursor-pointer"
          >
            <option value="">Select make</option>
            {brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-text-muted mb-1 font-mono uppercase">2. Model</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={!selectedBrand}
            className="w-full bg-surface-raised border border-border rounded px-3 py-2 text-[13px] text-text-primary outline-none focus:border-accent disabled:opacity-50 cursor-pointer"
          >
            <option value="">Select model</option>
            {models.map((m) => (
              <option key={m._id} value={m.model}>{m.model}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-text-muted mb-1 font-mono uppercase">3. Model year</label>
          <input
            type="number"
            placeholder="e.g. 1998"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full bg-surface-raised border border-border rounded px-3 py-2 text-[13px] text-text-primary outline-none focus:border-accent"
          />
        </div>
      </div>

      <Button
        type="button"
        size="sm"
        variant="primary"
        onClick={handleCheck}
        disabled={!selectedBrand || !selectedModel}
        className="w-full"
      >
        Check compatibility
      </Button>

      {/* Fitment Result Status Box */}
      {compatibilityStatus === 'exact' && (
        <div className="p-4 rounded bg-verified/15 border border-verified/30 text-text-primary flex items-start gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-verified shrink-0 mt-0.5" />
          <div className="text-[13px] space-y-0.5">
            <p className="font-medium text-verified">✓ Exact vehicle match</p>
            <p className="text-text-secondary">
              This part is confirmed to fit {selectedBrand} {selectedModel} {selectedYear ? `(${selectedYear})` : ''}. Direct bolt-on replacement.
            </p>
          </div>
        </div>
      )}

      {compatibilityStatus === 'partial' && (
        <div className="p-4 rounded bg-warning/15 border border-warning/30 text-text-primary flex items-start gap-3 animate-fade-in">
          <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <div className="text-[13px] space-y-0.5">
            <p className="font-medium text-warning">⚠ Partial fitment / requires confirmation</p>
            <p className="text-text-secondary">
              Matches make {selectedBrand}. Please check engine variant, chassis brackets, or message the seller before ordering.
            </p>
          </div>
        </div>
      )}

      {compatibilityStatus === 'incompatible' && (
        <div className="p-4 rounded bg-danger/15 border border-danger/30 text-text-primary flex items-start gap-3 animate-fade-in">
          <XCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
          <div className="text-[13px] space-y-0.5">
            <p className="font-medium text-danger">✕ Not compatible with selected vehicle</p>
            <p className="text-text-secondary">
              This part is engineered for {listing.vehicleBrand} {listing.vehicleModel} and will not fit your {selectedBrand} {selectedModel}.
            </p>
          </div>
        </div>
      )}

      {compatibilityStatus === 'idle' && (
        <p className="text-[12px] text-text-muted italic">
          Select your make and model above to see if this part fits your car or motorcycle.
        </p>
      )}

      {/* Confirmed Compatible Applications Table */}
      {listing.compatibleVehicles && listing.compatibleVehicles.length > 0 && (
        <div className="pt-3 border-t border-border space-y-2">
          <span className="text-[11px] font-mono text-text-muted uppercase tracking-wider block">
            Confirmed vehicle fitment database
          </span>
          <div className="space-y-1.5">
            {listing.compatibleVehicles.map((c, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-3 py-2 rounded bg-surface-raised border border-border text-[13px] text-text-primary font-medium"
              >
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-verified shrink-0" />
                  <span>{c.brand} {c.model}</span>
                </div>
                <span className="font-mono text-[11px] text-text-muted">
                  {c.yearFrom && c.yearTo ? `${c.yearFrom}–${c.yearTo}` : 'All Production Years'} {c.variant ? `(${c.variant})` : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
