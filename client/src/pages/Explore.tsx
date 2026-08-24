import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  SlidersHorizontal,
  Car,
  CheckCircle2,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Cpu,
  Filter,
  RotateCcw,
  ChevronDown,
} from 'lucide-react';
import { listingService } from '../services/listingService.js';
import { vehicleService } from '../services/vehicleService.js';
import { IListing, ICategory, IVehicle } from '../types/index.js';
import { useVehicle } from '../context/VehicleContext.js';
import { ProductCard } from '../components/marketplace/ProductCard.js';
import { ProductCardSkeleton } from '../components/common/SkeletonLoader.js';
import { AIPartScannerModal } from '../components/marketplace/AIPartScannerModal.js';

export const Explore: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { activeVehicle, clearActiveVehicle, setActiveVehicle } = useVehicle();

  // URL state parameters
  const querySearch = searchParams.get('search') || '';
  const queryBrand = searchParams.get('brand') || activeVehicle?.brand || '';
  const queryModel = searchParams.get('model') || activeVehicle?.model || '';
  const queryCategory = searchParams.get('category') || '';
  const queryCondition = searchParams.get('condition') || '';
  const queryMinPrice = searchParams.get('minPrice') || '';
  const queryMaxPrice = searchParams.get('maxPrice') || '';
  const querySort = searchParams.get('sort') || 'popular';
  const queryPage = parseInt(searchParams.get('page') || '1', 10);

  // Data states
  const [listings, setListings] = useState<IListing[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Local filter states
  const [minPriceInput, setMinPriceInput] = useState<string>(queryMinPrice);
  const [maxPriceInput, setMaxPriceInput] = useState<string>(queryMaxPrice);
  const [showScannerModal, setShowScannerModal] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catsData, brandsData] = await Promise.all([
          vehicleService.getCategories(),
          vehicleService.getBrands(),
        ]);
        setCategories(catsData || []);
        setBrands(brandsData || ['Bosch', 'NGK', 'Denso', 'Mann', 'Delphi', 'Brembo', 'K&N', 'Monroe']);
      } catch (err) {
        console.warn('Failed to load explore reference metadata', err);
      }
    };
    fetchMetadata();
  }, []);

  // Main Listings Query Execution
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const params: any = {
          page: queryPage,
          limit: 12,
          sort: querySort,
        };

        if (querySearch) params.search = querySearch;
        if (queryBrand) params.brand = queryBrand;
        if (queryModel) params.model = queryModel;
        if (queryCategory) params.category = queryCategory;
        if (queryCondition) params.condition = queryCondition;
        if (queryMinPrice) params.minPrice = queryMinPrice;
        if (queryMaxPrice) params.maxPrice = queryMaxPrice;

        const result = await listingService.getListings(params);
        setListings(result.data || []);
        setTotalPages(result.pagination?.pages || 1);
        setTotalCount(result.pagination?.total || 0);
      } catch (err) {
        console.error('Failed to load listings', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [
    querySearch,
    queryBrand,
    queryModel,
    queryCategory,
    queryCondition,
    queryMinPrice,
    queryMaxPrice,
    querySort,
    queryPage,
  ]);

  const updateParam = (key: string, value: string | number | boolean | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === null || value === '' || value === false) {
      newParams.delete(key);
    } else {
      newParams.set(key, String(value));
    }
    if (key !== 'page') {
      newParams.set('page', '1');
    }
    setSearchParams(newParams);
  };

  const handleApplyPriceFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (minPriceInput) newParams.set('minPrice', minPriceInput);
    else newParams.delete('minPrice');
    if (maxPriceInput) newParams.set('maxPrice', maxPriceInput);
    else newParams.delete('maxPrice');
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    clearActiveVehicle();
    setMinPriceInput('');
    setMaxPriceInput('');
    setSearchParams(new URLSearchParams());
  };

  const activeCategories = [
    'Engine Parts',
    'Braking System',
    'Suspension',
    'Electrical',
    'Body Parts',
    'Exhaust System',
    'Transmission',
    'Fuel System',
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#E5E5E5] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1680px] mx-auto space-y-6">
        {/* Breadcrumb & Header Matching Reference */}
        <div className="space-y-1 text-left">
          <nav className="flex items-center gap-1.5 text-xs text-[#888888]">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#E10600] font-medium">Shop</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-white uppercase tracking-tight">
            SHOP
          </h1>
        </div>

        {/* Main Grid: Left Filters + Right Shop Catalog */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Filter Sidebar (Matches Reference Image Exactly) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 text-left">
            {/* 1. CATEGORIES LIST */}
            <div className="bg-[#161616] border border-[#2A2A2A] rounded p-5 space-y-3">
              <h3 className="text-xs font-bold font-display uppercase tracking-wider text-white border-b border-[#2A2A2A] pb-2">
                CATEGORIES
              </h3>
              <div className="space-y-1 text-xs">
                <button
                  type="button"
                  onClick={() => updateParam('category', null)}
                  className={`w-full text-left py-1.5 px-2 rounded flex items-center justify-between transition-colors ${
                    !queryCategory ? 'text-[#E10600] font-bold bg-[#222222]' : 'text-[#888888] hover:text-white'
                  }`}
                >
                  <span>All Categories</span>
                </button>
                {activeCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => updateParam('category', cat)}
                    className={`w-full text-left py-1.5 px-2 rounded flex items-center justify-between transition-colors ${
                      queryCategory === cat ? 'text-[#E10600] font-bold bg-[#222222]' : 'text-[#888888] hover:text-white'
                    }`}
                  >
                    <span>{cat}</span>
                    <ChevronRight className="w-3 h-3 text-[#555555]" />
                  </button>
                ))}
              </div>
            </div>

            {/* 2. FILTER BY */}
            <div className="bg-[#161616] border border-[#2A2A2A] rounded p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-2">
                <h3 className="text-xs font-bold font-display uppercase tracking-wider text-white">
                  FILTER BY
                </h3>
                {(queryBrand || queryCategory || queryMinPrice || queryMaxPrice) && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-[10px] text-[#E10600] hover:underline uppercase font-bold"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Brand Checkboxes */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold text-[#888888] uppercase block">
                  BRAND
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {brands.map((b) => (
                    <label
                      key={b}
                      className="flex items-center gap-2 text-xs text-[#E5E5E5] hover:text-white cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={queryBrand === b}
                        onChange={(e) => updateParam('brand', e.target.checked ? b : null)}
                        className="w-3.5 h-3.5 rounded bg-[#222222] border-[#2A2A2A] text-[#E10600] focus:ring-[#E10600] accent-[#E10600]"
                      />
                      <span>{b}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter Slider / Inputs with Solid Red Button */}
              <form onSubmit={handleApplyPriceFilter} className="space-y-3 pt-2 border-t border-[#2A2A2A]">
                <span className="text-[11px] font-mono font-bold text-[#888888] uppercase block">
                  PRICE (₹)
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <input
                    type="number"
                    placeholder="₹ Min"
                    value={minPriceInput}
                    onChange={(e) => setMinPriceInput(e.target.value)}
                    className="w-full bg-[#222222] border border-[#2A2A2A] text-[#E5E5E5] px-2.5 py-1.5 rounded outline-none focus:border-[#E10600]"
                  />
                  <input
                    type="number"
                    placeholder="₹ Max"
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                    className="w-full bg-[#222222] border border-[#2A2A2A] text-[#E5E5E5] px-2.5 py-1.5 rounded outline-none focus:border-[#E10600]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#E10600] hover:bg-[#B20404] text-white py-1.5 rounded text-[11px] font-bold uppercase tracking-wider transition-colors"
                >
                  APPLY FILTERS
                </button>
              </form>
            </div>
          </aside>

          {/* Right Main Catalog Grid */}
          <main className="lg:col-span-9 space-y-4">
            {/* Top Control Bar Matching Reference */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#161616] p-3.5 rounded border border-[#2A2A2A]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden px-3 py-1.5 rounded bg-[#222222] text-xs font-bold text-white border border-[#2A2A2A] flex items-center gap-1.5"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
                </button>
                <span className="text-xs text-[#888888] font-mono">
                  Showing {listings.length > 0 ? `1-${listings.length}` : '0'} of {totalCount} results
                </span>
              </div>

              {/* Sorting */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-xs text-[#888888] font-mono">Sort by:</span>
                <select
                  value={querySort}
                  onChange={(e) => updateParam('sort', e.target.value)}
                  className="bg-[#222222] border border-[#2A2A2A] rounded px-3 py-1 text-xs text-white outline-none focus:border-[#E10600] cursor-pointer font-medium"
                >
                  <option value="popular">Popularity</option>
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : listings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {listings.map((listing) => (
                  <ProductCard key={listing._id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-[#161616] border border-[#2A2A2A] rounded space-y-4">
                <HelpCircle className="w-10 h-10 text-[#E10600] mx-auto" />
                <h3 className="text-lg font-bold text-white uppercase font-display">
                  No parts found matching your criteria
                </h3>
                <p className="text-xs text-[#888888] max-w-md mx-auto">
                  Can't find what you are searching for? Post a Rare Part Bounty to alert our network of classic stockists.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="bg-[#222222] hover:bg-[#2A2A2A] text-white px-4 py-2 rounded text-xs font-bold uppercase border border-[#2A2A2A]"
                  >
                    Clear Filters
                  </button>
                  <Link to="/wanted?new=true">
                    <button
                      type="button"
                      className="bg-[#E10600] hover:bg-[#B20404] text-white px-5 py-2 rounded text-xs font-bold uppercase"
                    >
                      Post Wanted Bounty
                    </button>
                  </Link>
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  type="button"
                  disabled={queryPage <= 1}
                  onClick={() => updateParam('page', queryPage - 1)}
                  className="p-2 rounded bg-[#161616] border border-[#2A2A2A] text-white hover:bg-[#222222] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => updateParam('page', pageNum)}
                      className={`w-8 h-8 rounded text-xs font-mono font-bold transition-colors ${
                        pageNum === queryPage
                          ? 'bg-[#E10600] text-white'
                          : 'bg-[#161616] border border-[#2A2A2A] text-[#E5E5E5] hover:bg-[#222222]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  disabled={queryPage >= totalPages}
                  onClick={() => updateParam('page', queryPage + 1)}
                  className="p-2 rounded bg-[#161616] border border-[#2A2A2A] text-white hover:bg-[#222222] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </main>
        </div>

        {/* AI Scanner Modal */}
        <AIPartScannerModal
          isOpen={showScannerModal}
          onClose={() => setShowScannerModal(false)}
        />
      </div>
    </div>
  );
};
