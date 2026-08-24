import React, { useState, useEffect } from 'react';
import { Filter, RotateCcw, Check, ShieldCheck } from 'lucide-react';
import { vehicleService } from '../../services/vehicleService.js';
import { ICategory, IVehicle } from '../../types/index.js';

export interface FilterState {
  brand: string;
  model: string;
  year: string;
  category: string;
  condition: string;
  partType: string;
  rarity: string;
  minPrice: string;
  maxPrice: string;
  location: string;
  verifiedOnly: boolean;
}

export interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onReset: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onFilterChange, onReset }) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<IVehicle[]>([]);

  // Load Categories & Brands
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [cats, brs] = await Promise.all([
          vehicleService.getCategories(),
          vehicleService.getBrands(),
        ]);
        setCategories(cats);
        setBrands(brs);
      } catch (err) {
        console.warn('FilterSidebar data load error', err);
      }
    };
    loadInitialData();
  }, []);

  // Load Models when brand changes
  useEffect(() => {
    if (filters.brand) {
      vehicleService.getModelsByBrand(filters.brand).then(setModels).catch(console.warn);
    } else {
      setModels([]);
    }
  }, [filters.brand]);

  const updateField = (key: keyof FilterState, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value,
      ...(key === 'brand' ? { model: '' } : {}),
    });
  };

  const conditions = [
    { label: 'All conditions', value: '' },
    { label: 'NOS (New Old Stock)', value: 'NOS (New Old Stock)' },
    { label: 'OEM Mint', value: 'OEM Mint' },
    { label: 'OEM Refurbished', value: 'OEM Refurbished' },
    { label: 'Used - Grade A', value: 'Used - Grade A' },
  ];

  const rarities = [
    { label: 'All rarities', value: '' },
    { label: 'Collector Grade', value: 'Collector Grade' },
    { label: 'Rare Find', value: 'Rare Find' },
    { label: 'Discontinued OEM', value: 'Discontinued OEM' },
  ];

  return (
    <div className="w-full bg-surface border border-border rounded-card p-5 space-y-6 text-text-primary">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-accent" />
          <h3 className="text-[13px] font-medium uppercase tracking-wider text-text-primary">
            Filter spares
          </h3>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-[12px] text-text-muted hover:text-accent flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Verified Sellers Toggle */}
      <div className="p-3 rounded bg-surface-raised border border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-verified" />
          <label htmlFor="verified-toggle" className="text-[12px] font-medium text-text-secondary cursor-pointer">
            Verified sellers only
          </label>
        </div>
        <input
          id="verified-toggle"
          type="checkbox"
          checked={filters.verifiedOnly}
          onChange={(e) => updateField('verifiedOnly', e.target.checked)}
          className="w-4 h-4 rounded text-accent bg-surface border-border focus:ring-accent cursor-pointer accent-accent"
        />
      </div>

      {/* Vehicle Compatibility */}
      <div className="space-y-3">
        <h4 className="text-[12px] font-medium uppercase text-text-muted">
          Vehicle compatibility
        </h4>

        {/* Brand */}
        <div>
          <label className="block text-[11px] text-text-muted mb-1">Brand</label>
          <select
            value={filters.brand}
            onChange={(e) => updateField('brand', e.target.value)}
            className="w-full bg-surface-raised border border-border rounded px-3 py-2 text-[13px] text-text-primary focus:outline-none focus:border-accent"
          >
            <option value="">All brands</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Model */}
        <div>
          <label className="block text-[11px] text-text-muted mb-1">Model</label>
          <select
            value={filters.model}
            onChange={(e) => updateField('model', e.target.value)}
            disabled={!filters.brand}
            className="w-full bg-surface-raised border border-border rounded px-3 py-2 text-[13px] text-text-primary focus:outline-none focus:border-accent disabled:opacity-40"
          >
            <option value="">{filters.brand ? 'All models' : 'Choose brand first'}</option>
            {models.map((m) => (
              <option key={m.model} value={m.model}>
                {m.model}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <h4 className="text-[12px] font-medium uppercase text-text-muted">
          Category
        </h4>
        <select
          value={filters.category}
          onChange={(e) => updateField('category', e.target.value)}
          className="w-full bg-surface-raised border border-border rounded px-3 py-2 text-[13px] text-text-primary focus:outline-none focus:border-accent"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c.name}>
              {c.name} ({c.partCount || 0})
            </option>
          ))}
        </select>
      </div>

      {/* Condition */}
      <div className="space-y-2">
        <h4 className="text-[12px] font-medium uppercase text-text-muted">
          Condition
        </h4>
        <div className="space-y-1">
          {conditions.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => updateField('condition', c.value)}
              className={`w-full text-left px-3 py-1.5 rounded text-[12px] transition-colors flex items-center justify-between ${
                filters.condition === c.value
                  ? 'bg-accent text-white font-medium'
                  : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary'
              }`}
            >
              <span>{c.label}</span>
              {filters.condition === c.value && <Check className="w-3 h-3" />}
            </button>
          ))}
        </div>
      </div>

      {/* Rarity */}
      <div className="space-y-2">
        <h4 className="text-[12px] font-medium uppercase text-text-muted">
          Rarity level
        </h4>
        <div className="space-y-1">
          {rarities.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => updateField('rarity', r.value)}
              className={`w-full text-left px-3 py-1.5 rounded text-[12px] transition-colors flex items-center justify-between ${
                filters.rarity === r.value
                  ? 'bg-accent text-white font-medium'
                  : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary'
              }`}
            >
              <span>{r.label}</span>
              {filters.rarity === r.value && <Check className="w-3 h-3" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <h4 className="text-[12px] font-medium uppercase text-text-muted">
          Price range (₹)
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min ₹"
            value={filters.minPrice}
            onChange={(e) => updateField('minPrice', e.target.value)}
            className="w-full bg-surface-raised border border-border rounded px-3 py-1.5 text-[13px] text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
          />
          <input
            type="number"
            placeholder="Max ₹"
            value={filters.maxPrice}
            onChange={(e) => updateField('maxPrice', e.target.value)}
            className="w-full bg-surface-raised border border-border rounded px-3 py-1.5 text-[13px] text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <h4 className="text-[12px] font-medium uppercase text-text-muted">
          Seller city / state
        </h4>
        <input
          type="text"
          placeholder="e.g. Mumbai, Bangalore..."
          value={filters.location}
          onChange={(e) => updateField('location', e.target.value)}
          className="w-full bg-surface-raised border border-border rounded px-3 py-1.5 text-[13px] text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
        />
      </div>
    </div>
  );
};
