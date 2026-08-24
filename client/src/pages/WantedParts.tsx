import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  HelpCircle,
  PlusCircle,
  Search,
  Sparkles,
  MapPin,
  ChevronRight,
  Send,
} from 'lucide-react';
import { wantedService } from '../services/wantedService.js';
import { vehicleService } from '../services/vehicleService.js';
import { IWantedPart, IVehicle } from '../types/index.js';
import { formatPrice, formatDate } from '../utils/formatters.js';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { Modal } from '../components/common/Modal.js';

export const WantedParts: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [bounties, setBounties] = useState<IWantedPart[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('');

  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<IVehicle[]>([]);

  // Post Bounty Modal State
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(searchParams.get('title') || '');
  const [reqBrand, setReqBrand] = useState<string>(searchParams.get('brand') || '');
  const [reqModel, setReqModel] = useState<string>(searchParams.get('model') || '');
  const [reqYear, setReqYear] = useState<string>(searchParams.get('year') || '');
  const [reqCategory, setReqCategory] = useState<string>('Engine Parts');
  const [reqDesc, setReqDesc] = useState<string>('');
  const [reqBudget, setReqBudget] = useState<string>('');
  const [reqUrgency, setReqUrgency] = useState<'urgent' | 'moderate' | 'flexible'>('moderate');
  const [reqCondition, setReqCondition] = useState<'NOS Only' | 'Good Used' | 'Restorable' | 'Any Condition'>('Good Used');
  const [reqCity, setReqCity] = useState<string>('');
  const [reqState, setReqState] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { user, isAuthenticated } = useAuth();
  const { success, error, info } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      if (isAuthenticated) {
        setModalOpen(true);
      }
      if (searchParams.get('title')) setTitle(searchParams.get('title') || '');
      if (searchParams.get('brand')) setReqBrand(searchParams.get('brand') || '');
      if (searchParams.get('model')) setReqModel(searchParams.get('model') || '');
      if (searchParams.get('year')) setReqYear(searchParams.get('year') || '');
    }
  }, [searchParams, isAuthenticated]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [bountyData, brandData] = await Promise.all([
          wantedService.getWantedParts({
            search: searchTerm || undefined,
            brand: selectedBrand || undefined,
            urgency: selectedUrgency || undefined,
          }),
          vehicleService.getBrands(),
        ]);
        setBounties(bountyData.data || []);
        setBrands(brandData || []);
      } catch (err) {
        console.warn('Failed to load wanted parts', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [searchTerm, selectedBrand, selectedUrgency]);

  useEffect(() => {
    if (!reqBrand) {
      setModels([]);
      return;
    }
    const loadBrandModels = async () => {
      try {
        const data = await vehicleService.getModelsByBrand(reqBrand);
        setModels(data || []);
      } catch (err) {
        console.warn('Models load error', err);
      }
    };
    loadBrandModels();
  }, [reqBrand]);

  const handleOpenModal = () => {
    if (!isAuthenticated) {
      info('Please sign in to post a rare part request bounty.', 'Authentication required');
      navigate('/login');
      return;
    }
    setModalOpen(true);
  };

  const handleCreateBounty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !reqBrand || !reqModel || !reqBudget || !reqDesc) {
      error('Please fill in all required fields.', 'Validation error');
      return;
    }

    try {
      setSubmitting(true);
      const newBounty = await wantedService.createWantedPart({
        title,
        vehicleBrand: reqBrand,
        vehicleModel: reqModel,
        vehicleYear: reqYear ? parseInt(reqYear, 10) : 1985,
        vehicleVariant: 'Standard',
        category: reqCategory,
        description: reqDesc,
        targetBudget: parseFloat(reqBudget),
        urgency: reqUrgency,
        conditionRequired: reqCondition,
        location: {
          city: reqCity || user?.location?.city || 'Mumbai',
          state: reqState || user?.location?.state || 'Maharashtra',
        },
      });

      success('Wanted part bounty posted to community network!', 'Bounty active');
      setBounties([newBounty, ...bounties]);
      setModalOpen(false);
      setTitle('');
      setReqDesc('');
      setReqBudget('');
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to post bounty.', 'Error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 space-y-8 min-h-screen text-[#E5E5E5] bg-transparent">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded bg-[#161616] border border-[#2A2A2A] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-left">
        <div className="space-y-2 max-w-xl">
          <span className="text-[11px] font-mono font-bold text-[#E10600] uppercase tracking-wider block">
            COMMUNITY SOURCING BOARD
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-black uppercase text-white">
            Rare Parts Request Board
          </h1>
          <p className="text-xs sm:text-sm text-[#888888] leading-relaxed font-sans">
            Can't find a rare spare in our catalog? Post a request with your target budget and condition requirements. Our verified network of classic stockists and master restorers will send you direct quotes.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenModal}
          className="bg-[#E10600] hover:bg-[#B20404] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-2 shrink-0 shadow-sm"
        >
          <PlusCircle className="w-4 h-4" /> POST WANTED REQUEST
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#161616] p-3.5 rounded border border-[#2A2A2A]">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search wanted bounties e.g. Yamaha RX100 5-speed, Lancer calipers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#222222] border border-[#2A2A2A] rounded pl-10 pr-4 py-2 text-xs text-[#E5E5E5] placeholder-[#888888] outline-none focus:border-[#E10600]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-xs text-white outline-none focus:border-[#E10600] cursor-pointer w-full sm:w-auto font-medium"
          >
            <option value="">All Vehicle Makes</option>
            {brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-xs text-white outline-none focus:border-[#E10600] cursor-pointer w-full sm:w-auto font-medium"
          >
            <option value="">All Urgencies</option>
            <option value="urgent">🔴 Urgent</option>
            <option value="moderate">🟡 Moderate</option>
            <option value="flexible">🟢 Flexible</option>
          </select>
        </div>
      </div>

      {/* Bounties List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-6 bg-[#161616] border border-[#2A2A2A] rounded animate-pulse h-32" />
          ))}
        </div>
      ) : bounties.length > 0 ? (
        <div className="space-y-3.5 text-left">
          {bounties.map((bounty) => (
            <div
              key={bounty._id}
              className="p-5 sm:p-6 rounded bg-[#161616] border border-[#2A2A2A] hover:border-[#E10600] transition-colors space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded bg-[#222222] text-white border border-[#2A2A2A] uppercase">
                      {bounty.vehicleBrand} {bounty.vehicleModel} ({bounty.vehicleYear})
                    </span>
                    <span className="text-[11px] text-[#888888] font-sans">
                      • {bounty.category}
                    </span>
                    {bounty.urgency === 'urgent' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#E10600]/15 text-[#E10600] border border-[#E10600]/30 font-mono">
                        Urgent
                      </span>
                    )}
                  </div>

                  <Link to={`/wanted/${bounty._id}`}>
                    <h3 className="font-display font-bold text-base sm:text-lg text-white hover:text-[#E10600] transition-colors">
                      {bounty.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-[#888888] leading-relaxed line-clamp-2">
                    {bounty.description}
                  </p>
                </div>

                {/* Target Budget & Quotes Counter */}
                <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-start gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#2A2A2A]">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#888888] block text-right">Target Budget</span>
                    <span className="font-mono text-base sm:text-lg font-bold text-[#E10600]">
                      {formatPrice(bounty.targetBudget)}
                    </span>
                  </div>

                  <Link to={`/wanted/${bounty._id}`}>
                    <button
                      type="button"
                      className="bg-[#222222] hover:bg-[#E10600] hover:text-white text-[#BAC0CD] px-4 py-1.5 rounded text-[11px] font-bold uppercase border border-[#2A2A2A] transition-colors"
                    >
                      View & Quote ({bounty.offersCount || 0})
                    </button>
                  </Link>
                </div>
              </div>

              {/* Location & Requester Meta */}
              <div className="flex flex-wrap items-center justify-between text-[11px] text-[#888888] pt-2 border-t border-[#2A2A2A]/60">
                <div className="flex items-center gap-4">
                  {bounty.location?.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#888888]" />
                      {bounty.location.city}, {bounty.location.state}
                    </span>
                  )}
                  <span>Condition required: <strong className="text-[#E5E5E5]">{bounty.conditionRequired}</strong></span>
                </div>
                <span>Posted: {formatDate(bounty.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-[#161616] border border-[#2A2A2A] rounded space-y-4">
          <HelpCircle className="w-10 h-10 text-[#E10600] mx-auto" />
          <h3 className="text-lg font-bold text-white uppercase font-display">No Wanted Bounties Found</h3>
          <p className="text-xs text-[#888888]">Be the first to post a rare part request to our specialist restorer network.</p>
          <button
            type="button"
            onClick={handleOpenModal}
            className="bg-[#E10600] hover:bg-[#B20404] text-white px-6 py-2.5 text-xs font-bold uppercase rounded"
          >
            Post Bounty Now
          </button>
        </div>
      )}

      {/* Post Bounty Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="POST RARE PART REQUEST BOUNTY"
      >
        <form onSubmit={handleCreateBounty} className="space-y-4 text-xs text-left">
          <div>
            <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">
              Part Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Maruti 800 SS80 Original Amber Indicator Lens Pair"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-white outline-none focus:border-[#E10600]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">
                Vehicle Make *
              </label>
              <select
                required
                value={reqBrand}
                onChange={(e) => setReqBrand(e.target.value)}
                className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-white outline-none focus:border-[#E10600] cursor-pointer"
              >
                <option value="">Select Make</option>
                {brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">
                Model *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 800 (SS80) / RX100"
                value={reqModel}
                onChange={(e) => setReqModel(e.target.value)}
                className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-white outline-none focus:border-[#E10600]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">
                Target Budget (₹) *
              </label>
              <input
                type="number"
                required
                placeholder="e.g. 3500"
                value={reqBudget}
                onChange={(e) => setReqBudget(e.target.value)}
                className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-white outline-none focus:border-[#E10600]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">
                Urgency
              </label>
              <select
                value={reqUrgency}
                onChange={(e: any) => setReqUrgency(e.target.value)}
                className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-white outline-none focus:border-[#E10600] cursor-pointer"
              >
                <option value="urgent">🔴 Urgent (Need in 3 days)</option>
                <option value="moderate">🟡 Moderate (Within 2 weeks)</option>
                <option value="flexible">🟢 Flexible (Ongoing build)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">
              Part Description & Desired Condition *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Specify OEM markings, part numbers, casting stamp requirements, or acceptable wear..."
              value={reqDesc}
              onChange={(e) => setReqDesc(e.target.value)}
              className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-white outline-none focus:border-[#E10600]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="bg-[#222222] hover:bg-[#2A2A2A] text-white px-4 py-2 rounded text-xs font-bold uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#E10600] hover:bg-[#B20404] text-white px-6 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              {submitting ? 'Posting...' : 'Post Bounty'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
