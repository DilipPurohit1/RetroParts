import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Cpu,
  FileCheck,
  ShieldCheck,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { listingService } from '../services/listingService.js';
import { vehicleService } from '../services/vehicleService.js';
import { ICategory, IVehicle } from '../types/index.js';
import { AIPartScannerModal } from '../components/marketplace/AIPartScannerModal.js';
import { ListingQualityGauge } from '../components/marketplace/ListingQualityGauge.js';

export const SellPart: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<IVehicle[]>([]);

  // AI Scanner Modal State
  const [showScannerModal, setShowScannerModal] = useState<boolean>(false);

  // Form State
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [categoryName, setCategoryName] = useState<string>('');
  const [vehicleBrand, setVehicleBrand] = useState<string>('');
  const [vehicleModel, setVehicleModel] = useState<string>('');
  const [vehicleYear, setVehicleYear] = useState<string>('1989');
  const [vehicleVariant, setVehicleVariant] = useState<string>('Standard');
  const [oemNumber, setOemNumber] = useState<string>('');
  const [condition, setCondition] = useState<string>('NOS (New Old Stock)');
  const [partType, setPartType] = useState<string>('OEM Original');
  const [rarity, setRarity] = useState<string>('Rare Find');
  const [price, setPrice] = useState<string>('');
  const [originalPrice, setOriginalPrice] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('1');
  const [description, setDescription] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80');
  const [city] = useState<string>('Bengaluru');
  const [state] = useState<string>('Karnataka');

  // Part Passport Claims State
  const [repairHistory, setRepairHistory] = useState<string>('Original factory storage preservation.');
  const [defects, setDefects] = useState<string>('None reported.');

  // Live Quality Score State
  const [qualityScore, setQualityScore] = useState<number>(65);
  const [qualityTips, setQualityTips] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { user, isAuthenticated } = useAuth();
  const { success, error, info } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      info('Please sign in to list a vintage spare part.', 'Authentication required');
      navigate('/login');
      return;
    }
    const loadMetadata = async () => {
      try {
        const [cats, bnds] = await Promise.all([
          vehicleService.getCategories(),
          vehicleService.getBrands(),
        ]);
        setCategories(cats || []);
        setBrands(bnds || []);
        if (cats && cats.length > 0) {
          setCategory(cats[0]._id);
          setCategoryName(cats[0].name);
        }
      } catch (err) {
        console.warn('Failed to load categories/brands', err);
      }
    };
    loadMetadata();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!vehicleBrand) {
      setModels([]);
      return;
    }
    const loadModels = async () => {
      try {
        const data = await vehicleService.getModelsByBrand(vehicleBrand);
        setModels(data || []);
      } catch (err) {
        console.warn('Models load error', err);
      }
    };
    loadModels();
  }, [vehicleBrand]);

  // Calculate live quality score
  useEffect(() => {
    let score = 30;
    const tips: string[] = [];

    if (title.length > 15) score += 15;
    else tips.push('Add a descriptive title including brand and part name.');

    if (oemNumber.trim()) score += 15;
    else tips.push('Provide stamped OEM or casting numbers for +15 trust points.');

    if (description.length > 50) score += 20;
    else tips.push('Write a detailed provenance description for better buyer confidence.');

    if (imageUrl) score += 10;
    if (price && parseFloat(price) > 0) score += 10;

    setQualityScore(Math.min(100, score));
    setQualityTips(tips);
  }, [title, oemNumber, description, imageUrl, price]);

  const handleApplyAIData = (detectedData: any) => {
    if (detectedData.title) setTitle(detectedData.title);
    if (detectedData.vehicleBrand) setVehicleBrand(detectedData.vehicleBrand);
    if (detectedData.vehicleModel) setVehicleModel(detectedData.vehicleModel);
    if (detectedData.oemNumber) setOemNumber(detectedData.oemNumber);
    if (detectedData.suggestedPrice) setPrice(String(detectedData.suggestedPrice));
    if (detectedData.categoryName) setCategoryName(detectedData.categoryName);
    if (detectedData.condition) setCondition(detectedData.condition);
    if (detectedData.description) setDescription(detectedData.description);
    setShowScannerModal(false);
    success('AI Part Scanner filled listing parameters!', 'Scan Applied');
  };

  const handlePublishListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !category || !vehicleBrand || !vehicleModel) {
      error('Please complete all required fields.', 'Validation Error');
      return;
    }

    try {
      setSubmitting(true);
      const newListing = await listingService.createListing({
        title,
        category,
        categoryName,
        vehicleBrand,
        vehicleModel,
        vehicleYear: parseInt(vehicleYear, 10) || 1989,
        vehicleVariant,
        oemNumber,
        condition,
        partType,
        rarity,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
        quantity: parseInt(quantity, 10) || 1,
        description,
        images: [imageUrl],
        location: {
          city: user?.location?.city || city,
          state: user?.location?.state || state,
        },
        passport: {
          repairHistory,
          defects,
          authenticityGuaranteed: true,
        },
      });

      success('Your vintage spare part has been listed on RetroParts!', 'Listing Published');
      navigate(`/parts/${newListing._id}`);
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to publish listing.', 'Error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 space-y-8 min-h-screen text-[#E5E5E5] bg-transparent text-left">
      {/* Header Banner with AI Scanner Button */}
      <div className="p-6 sm:p-8 rounded bg-[#161616] border border-[#2A2A2A] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1 max-w-xl">
          <span className="text-[11px] font-mono font-bold text-[#E10600] uppercase tracking-wider block">
            SPECIALIST RESTORER CONSOLE
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-black uppercase text-white">
            List a Spare Part
          </h1>
          <p className="text-xs text-[#888888] font-sans">
            Connect directly with verified vintage vehicle restorers. Disclose OEM stamps and condition for vault escrow transactions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowScannerModal(true)}
          className="bg-[#222222] hover:bg-[#2A2A2A] text-white border border-[#2A2A2A] hover:border-[#E10600] px-4 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shrink-0"
        >
          <Cpu className="w-4 h-4 text-[#E10600]" /> AI Visual Scanner
        </button>
      </div>

      {/* 3-Step Progress Indicator */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono font-bold uppercase">
        <button
          type="button"
          onClick={() => setStep(1)}
          className={`py-2.5 rounded border transition-colors ${
            step === 1 ? 'bg-[#E10600] text-white border-[#E10600]' : 'bg-[#161616] border-[#2A2A2A] text-[#888888]'
          }`}
        >
          1. Vehicle Fitment
        </button>
        <button
          type="button"
          onClick={() => setStep(2)}
          className={`py-2.5 rounded border transition-colors ${
            step === 2 ? 'bg-[#E10600] text-white border-[#E10600]' : 'bg-[#161616] border-[#2A2A2A] text-[#888888]'
          }`}
        >
          2. Part Passport™
        </button>
        <button
          type="button"
          onClick={() => setStep(3)}
          className={`py-2.5 rounded border transition-colors ${
            step === 3 ? 'bg-[#E10600] text-white border-[#E10600]' : 'bg-[#161616] border-[#2A2A2A] text-[#888888]'
          }`}
        >
          3. Price & Launch
        </button>
      </div>

      {/* Form Steps */}
      <form onSubmit={handlePublishListing} className="space-y-6">
        {/* Step 1: Vehicle Fitment & Basic Information */}
        {step === 1 && (
          <div className="p-6 rounded bg-[#161616] border border-[#2A2A2A] space-y-4">
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white border-b border-[#2A2A2A] pb-3">
              VEHICLE FITMENT & PART IDENTIFICATION
            </h3>

            <div>
              <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">
                Listing Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Yamaha RX100 Original Mikuni VM20 Slide Carburetor"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-xs text-white outline-none focus:border-[#E10600]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">
                  Vehicle Make *
                </label>
                <select
                  required
                  value={vehicleBrand}
                  onChange={(e) => setVehicleBrand(e.target.value)}
                  className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-xs text-white outline-none focus:border-[#E10600] cursor-pointer font-medium"
                >
                  <option value="">Select Make</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">
                  Vehicle Model *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RX100 / Padmini / 800 SS80"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-xs text-white outline-none focus:border-[#E10600]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">
                  Model Year
                </label>
                <input
                  type="number"
                  value={vehicleYear}
                  onChange={(e) => setVehicleYear(e.target.value)}
                  className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-xs text-white outline-none focus:border-[#E10600]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    const match = categories.find((c) => c._id === e.target.value);
                    if (match) setCategoryName(match.name);
                  }}
                  className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-xs text-white outline-none focus:border-[#E10600] cursor-pointer font-medium"
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">
                  OEM Part Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. VM20-350 / 800-GR-01"
                  value={oemNumber}
                  onChange={(e) => setOemNumber(e.target.value)}
                  className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-xs text-white outline-none focus:border-[#E10600]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-[#E10600] hover:bg-[#B20404] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5"
              >
                Proceed to Part Passport™ <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Part Passport™ Provenance */}
        {step === 2 && (
          <div className="p-6 rounded bg-[#161616] border border-[#2A2A2A] space-y-4">
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white border-b border-[#2A2A2A] pb-3">
              PART PASSPORT™ PROVENANCE & CONDITION
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">
                  Condition *
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-xs text-white outline-none focus:border-[#E10600] cursor-pointer font-medium"
                >
                  <option value="NOS (New Old Stock)">NOS (New Old Stock)</option>
                  <option value="OEM Mint">OEM Mint</option>
                  <option value="OEM Refurbished">OEM Refurbished</option>
                  <option value="Used - Grade A">Used - Grade A</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">
                  Rarity Tier
                </label>
                <select
                  value={rarity}
                  onChange={(e) => setRarity(e.target.value)}
                  className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-xs text-white outline-none focus:border-[#E10600] cursor-pointer font-medium"
                >
                  <option value="Collector Grade">★ Collector Grade (Ultra Rare)</option>
                  <option value="Rare Find">◆ Rare Find</option>
                  <option value="Discontinued OEM">● Discontinued OEM</option>
                  <option value="Common Vintage">Vintage Standard</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">
                  Part Type
                </label>
                <select
                  value={partType}
                  onChange={(e) => setPartType(e.target.value)}
                  className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-xs text-white outline-none focus:border-[#E10600] cursor-pointer font-medium"
                >
                  <option value="OEM Original">OEM Factory Original</option>
                  <option value="Period Correct Aftermarket">Period Correct Spec</option>
                  <option value="NOS">New Old Stock (NOS)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">
                Detailed Description & Provenance *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe storage history, original packaging, manufacturing timestamps, or vehicle it was removed from..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-xs text-white outline-none focus:border-[#E10600]"
              />
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="bg-[#222222] hover:bg-[#2A2A2A] text-white px-5 py-2 text-xs font-bold uppercase rounded"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="bg-[#E10600] hover:bg-[#B20404] text-white px-6 py-2 text-xs font-bold uppercase rounded flex items-center gap-1.5"
              >
                Proceed to Pricing <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Pricing & Launch */}
        {step === 3 && (
          <div className="p-6 rounded bg-[#161616] border border-[#2A2A2A] space-y-5">
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white border-b border-[#2A2A2A] pb-3">
              PRICING, PHOTOS & LAUNCH
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">
                  Asking Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 4500"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-xs text-white outline-none focus:border-[#E10600]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">
                  Original Reference Price (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 6000"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-xs text-white outline-none focus:border-[#E10600]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">
                  Available Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-xs text-white outline-none focus:border-[#E10600]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">
                Product Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-xs text-white outline-none focus:border-[#E10600]"
              />
            </div>

            {/* Live Quality Score Gauge */}
            <ListingQualityGauge score={qualityScore} tips={qualityTips} />

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-[#222222] hover:bg-[#2A2A2A] text-white px-5 py-2 text-xs font-bold uppercase rounded"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-[#E10600] hover:bg-[#B20404] text-white px-8 py-3 text-xs font-bold uppercase tracking-wider rounded transition-colors disabled:opacity-50 shadow-sm"
              >
                {submitting ? 'Publishing Spare...' : 'Publish Listing Now'}
              </button>
            </div>
          </div>
        )}
      </form>

      {/* AI Scanner Modal */}
      <AIPartScannerModal
        isOpen={showScannerModal}
        onClose={() => setShowScannerModal(false)}
        onApplyData={handleApplyAIData}
      />
    </div>
  );
};
