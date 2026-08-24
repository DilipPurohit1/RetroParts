import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Bike, ChevronDown, Check } from 'lucide-react';
import { vehicleService } from '../../services/vehicleService.js';
import { IVehicle } from '../../types/index.js';
import { useVehicle } from '../../context/VehicleContext.js';
import { Button } from '../common/Button.js';

export interface VehicleSelectorProps {
  onSelect?: (selection: { brand: string; model: string; year?: string | number; variant?: string }) => void;
  compact?: boolean;
  initialBrand?: string;
  initialModel?: string;
  initialYear?: string | number;
  initialVariant?: string;
  submitButtonText?: string;
}

// Reusable Custom Dropdown Component
interface CustomSelectProps {
  label: string;
  placeholder: string;
  value: string;
  options: Array<{ value: string; label: string; sub?: string }>;
  disabled?: boolean;
  onChange: (val: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  placeholder,
  value,
  options,
  disabled = false,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div className="space-y-1.5 text-left relative" ref={dropdownRef}>
      <label className="block text-[13px] font-medium text-text-secondary">{label}</label>
      
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded border text-[14px] font-normal transition-colors text-left ${
          disabled
            ? 'bg-surface/50 border-border/50 text-text-muted cursor-not-allowed'
            : isOpen
            ? 'bg-surface border-accent text-text-primary'
            : 'bg-surface hover:bg-surface-raised border-border text-text-primary'
        }`}
      >
        <span className={`truncate ${!selectedOption ? 'text-text-muted' : 'text-text-primary font-medium'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-text-muted shrink-0 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180 text-accent' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-surface-raised border border-border rounded-card z-50 max-h-56 overflow-y-auto p-1 animate-fade-in divide-y divide-border">
          {options.length > 0 ? (
            options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-[14px] text-left transition-colors ${
                  opt.value === value
                    ? 'bg-accent-muted text-accent font-medium'
                    : 'text-text-primary hover:bg-surface hover:text-white'
                }`}
              >
                <div className="truncate">
                  <span>{opt.label}</span>
                  {opt.sub && <span className="text-[12px] text-text-muted ml-1.5 font-normal">({opt.sub})</span>}
                </div>
                {opt.value === value && <Check className="w-3.5 h-3.5 text-accent shrink-0" />}
              </button>
            ))
          ) : (
            <div className="px-3 py-4 text-center text-[13px] text-text-muted">
              No options available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  onSelect,
  compact = false,
  initialBrand = '',
  initialModel = '',
  initialYear = '',
  initialVariant = '',
  submitButtonText = 'Find compatible parts',
}) => {
  const { activeVehicle, setActiveVehicle } = useVehicle();
  const [vehicleType, setVehicleType] = useState<'all' | 'car' | 'bike'>('all');
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<IVehicle[]>([]);

  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand || activeVehicle?.brand || '');
  const [selectedModel, setSelectedModel] = useState<string>(initialModel || activeVehicle?.model || '');
  const [selectedYear, setSelectedYear] = useState<string | number>(initialYear || activeVehicle?.year || '');
  const [selectedVariant, setSelectedVariant] = useState<string>(initialVariant || activeVehicle?.variant || '');

  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [availableVariants, setAvailableVariants] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const navigate = useNavigate();

  // Load Brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const data = await vehicleService.getBrands(vehicleType !== 'all' ? vehicleType : undefined);
        setBrands(data || []);
      } catch (err) {
        console.warn('Failed to load vehicle brands', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, [vehicleType]);

  // Load Models when brand changes
  useEffect(() => {
    if (!selectedBrand) {
      setModels([]);
      setSelectedModel('');
      setSelectedYear('');
      setSelectedVariant('');
      setAvailableYears([]);
      setAvailableVariants([]);
      return;
    }
    const fetchModels = async () => {
      try {
        const data = await vehicleService.getModelsByBrand(selectedBrand);
        setModels(data || []);
      } catch (err) {
        console.warn('Failed to load vehicle models', err);
      }
    };
    fetchModels();
  }, [selectedBrand]);

  // Calculate Available Years & Variants when model changes
  useEffect(() => {
    if (!selectedModel || !models.length) {
      setAvailableYears([]);
      setAvailableVariants([]);
      return;
    }

    const currentModelObj = models.find((m) => m.model === selectedModel);
    if (currentModelObj) {
      const startYear = currentModelObj.yearFrom || 1970;
      const endYear = currentModelObj.yearTo || new Date().getFullYear();
      const yrs: number[] = [];
      for (let y = endYear; y >= startYear; y--) {
        yrs.push(y);
      }
      setAvailableYears(yrs);

      if (currentModelObj.variants && currentModelObj.variants.length > 0) {
        const variantNames = currentModelObj.variants.map((v: any) =>
          typeof v === 'string' ? v : v.name ? `${v.name}${v.engine ? ` (${v.engine})` : ''}` : String(v)
        );
        setAvailableVariants(variantNames);
      } else {
        setAvailableVariants(['Standard', 'DX', 'VTEC', 'SFXi', 'HT', 'Carb']);
      }
    }
  }, [selectedModel, models]);

  const handleSubmit = () => {
    if (!selectedBrand || !selectedModel) return;

    setSubmitting(true);
    // Persist active vehicle context
    setActiveVehicle({
      brand: selectedBrand,
      model: selectedModel,
      year: selectedYear || undefined,
      variant: selectedVariant || undefined,
    });

    if (onSelect) {
      onSelect({
        brand: selectedBrand,
        model: selectedModel,
        year: selectedYear,
        variant: selectedVariant,
      });
      setSubmitting(false);
    } else {
      const params = new URLSearchParams();
      if (selectedBrand) params.append('brand', selectedBrand);
      if (selectedModel) params.append('model', selectedModel);
      if (selectedYear) params.append('year', selectedYear.toString());
      if (selectedVariant) params.append('variant', selectedVariant);
      navigate(`/explore?${params.toString()}`);
    }
  };

  const isFormValid = Boolean(selectedBrand && selectedModel);

  return (
    <div className={`w-full ${compact ? '' : 'p-6 bg-surface border border-border rounded-card'}`}>
      {/* Vehicle Type Filter */}
      {!compact && (
        <div className="flex items-center justify-between gap-3 mb-5 border-b border-border pb-4">
          <div className="flex items-center gap-1.5 p-1 bg-surface-raised border border-border rounded">
            <button
              type="button"
              onClick={() => {
                setVehicleType('all');
                setSelectedBrand('');
                setSelectedModel('');
              }}
              className={`px-3 py-1.5 rounded text-[13px] font-medium transition-colors ${
                vehicleType === 'all'
                  ? 'bg-surface text-text-primary border border-border'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              All vehicles
            </button>
            <button
              type="button"
              onClick={() => {
                setVehicleType('car');
                setSelectedBrand('');
                setSelectedModel('');
              }}
              className={`px-3 py-1.5 rounded text-[13px] font-medium transition-colors flex items-center gap-1 ${
                vehicleType === 'car'
                  ? 'bg-surface text-text-primary border border-border'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Cars</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setVehicleType('bike');
                setSelectedBrand('');
                setSelectedModel('');
              }}
              className={`px-3 py-1.5 rounded text-[13px] font-medium transition-colors flex items-center gap-1 ${
                vehicleType === 'bike'
                  ? 'bg-surface text-text-primary border border-border'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span>Motorcycles</span>
            </button>
          </div>

          <span className="text-[12px] font-medium text-text-muted hidden sm:block">
            Vehicle fitment engine
          </span>
        </div>
      )}

      {/* Cascading 4 Custom Dropdown Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* 1. Make / Brand */}
        <CustomSelect
          label="1. Make / brand *"
          placeholder="Select make"
          value={selectedBrand}
          options={brands.map((b) => ({ value: b, label: b }))}
          onChange={(val) => {
            setSelectedBrand(val);
            setSelectedModel('');
            setSelectedYear('');
            setSelectedVariant('');
          }}
        />

        {/* 2. Model */}
        <CustomSelect
          label="2. Model *"
          placeholder={selectedBrand ? 'Select model' : 'Select make first'}
          value={selectedModel}
          disabled={!selectedBrand || models.length === 0}
          options={models.map((m) => ({
            value: m.model,
            label: m.model,
            sub: `${m.yearFrom}-${m.yearTo || 'Present'}`,
          }))}
          onChange={(val) => {
            setSelectedModel(val);
            setSelectedYear('');
            setSelectedVariant('');
          }}
        />

        {/* 3. Year */}
        <CustomSelect
          label="3. Model year"
          placeholder={selectedModel ? 'All production years' : 'Select model first'}
          value={selectedYear ? selectedYear.toString() : ''}
          disabled={!selectedModel || availableYears.length === 0}
          options={availableYears.map((y) => ({ value: y.toString(), label: y.toString() }))}
          onChange={(val) => setSelectedYear(val)}
        />

        {/* 4. Variant / Engine */}
        <CustomSelect
          label="4. Engine / variant"
          placeholder={selectedModel ? 'All engine variants' : 'Select model first'}
          value={selectedVariant}
          disabled={!selectedModel}
          options={availableVariants.map((v) => ({ value: v, label: v }))}
          onChange={(val) => setSelectedVariant(val)}
        />
      </div>

      {/* Action Footer: Single Accent Button */}
      <div className={`mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 ${compact ? 'pt-2' : 'pt-4 border-t border-border'}`}>
        <div className="text-[13px] text-text-muted">
          {selectedBrand && selectedModel ? (
            <span className="text-verified font-medium flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Fitment active: {selectedBrand} {selectedModel} {selectedYear ? `(${selectedYear})` : ''} {selectedVariant ? `• ${selectedVariant}` : ''}
            </span>
          ) : (
            <span className="text-text-muted">
              Select vehicle make and model to filter compatible parts
            </span>
          )}
        </div>

        <Button
          type="button"
          onClick={handleSubmit}
          size="md"
          variant="primary"
          disabled={!isFormValid || submitting}
          isLoading={submitting}
          className="w-full sm:w-auto"
        >
          {submitting ? 'Finding compatible parts...' : submitButtonText}
        </Button>
      </div>
    </div>
  );
};
