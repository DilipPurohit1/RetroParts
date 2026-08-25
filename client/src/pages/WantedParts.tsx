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
  const [requests, setRequests] = useState<IWantedPart[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('');

  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<IVehicle[]>([]);

  // Post Sourcing Request Modal State
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
        const [requestData, brandData] = await Promise.all([
          wantedService.getWantedParts({
            search: searchTerm || undefined,
            brand: selectedBrand || undefined,
            urgency: selectedUrgency || undefined,
          }),
          vehicleService.getBrands(),
        ]);
        setRequests(requestData.data || []);
        setBrands(brandData || []);
      } catch (err) {
        console.warn('Failed to load sourcing requests', err);
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
      info('Please sign in to submit a rare part sourcing request.', 'Authentication required');
      navigate('/login');
      return;
    }
    setModalOpen(true);
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !reqBrand || !reqModel || !reqBudget || !reqDesc) {
      error('Please fill in all required fields.', 'Validation error');
      return;
    }

    try {
      setSubmitting(true);
      const newRequest = await wantedService.createWantedPart({
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

      success('Part sourcing request submitted to community network!', 'Request Active');
      setRequests([newRequest, ...requests]);
      setModalOpen(false);
      setTitle('');
      setReqDesc('');
      setReqBudget('');
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to submit request.', 'Error');
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
            Rare Parts Sourcing Board
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
          <PlusCircle className="w-4 h-4" /> SUBMIT SOURCING REQUEST
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#161616] p-3.5 rounded border border-[#2A2A2A]">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sourcing requests e.g. Yamaha RX100 5-speed, Lancer calipers..."
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

      {/* Sourcing Requests List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-6 bg-[#161616] border border-[#2A2A2A] rounded animate-pulse h-32" />
          ))}
        </div>
      ) : requests.length > 0 ? (
        <div className="space-y-3.5 text-left">
          {requests.map((item) => (
            <div
              key={item._id}
              className="p-5 sm:p-6 rounded bg-[#161616] border border-[#2A2A2A] hover:border-[#E10600] transition-colors space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded bg-[#222222] text-white border border-[#2A2A2A] uppercase">
                      {item.vehicleBrand} {item.vehicleModel} ({item.vehicleYear})
                    </span>
                    <span className="text-[11px] text-[#888888] font-sans">
                      • {item.category}
                    </span>
                    {item.urgency === 'urgent' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#E10600]/15 text-[#E10600] border border-[#E10600]/30 font-mono">
                        Urgent
                      </span>
                    )}
                  </div>

                  <Link to={`/wanted/${item._id}`}>
                    <h3 className="font-display font-bold text-base sm:text-lg text-white hover:text-[#E10600] transition-colors">
                      {item.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-[#888888] leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Target Budget & Quotes Counter */}
                <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-start gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#2A2A2A]">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#888888] block text-right">Target Budget</span>
                    <span className="font-mono text-base sm:text-lg font-bold text-[#E10600]">
                      {formatPrice(item.targetBudget)}
                    </span>
                  </div>

                  <Link to={`/wanted/${item._id}`}>
                    <button
                      type="button"
                      className="bg-[#222222] hover:bg-[#E10600] hover:text-white text-[#BAC0CD] px-4 py-1.5 rounded text-[11px] font-bold uppercase border border-[#2A2A2A] transition-colors"
                    >
                      View & Quote ({item.offersCount || 0})
                    </button>
                  </Link>
                </div>
              </div>

              {/* Location & Requester Meta */}
              <div className="flex flex-wrap items-center justify-between text-[11px] text-[#888888] pt-2 border-t border-[#2A2A2A]/60">
                <div className="flex items-center gap-4">
                  {item.location?.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#888888]" />
                      {item.location.city}, {item.location.state}
                    </span>
                  )}
                  <span>Condition required: <strong className="text-[#E5E5E5]">{item.conditionRequired}</strong></span>
                </div>
                <span>Posted: {formatDate(item.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-[#161616] border border-[#2A2A2A] rounded space-y-4">
          <HelpCircle className="w-10 h-10 text-[#E10600] mx-auto" />
          <h3 className="text-lg font-bold text-white uppercase font-display">No Sourcing Requests Found</h3>
          <p className="text-xs text-[#888888]">Be the first to post a rare part sourcing request to our specialist restorer network.</p>
          <button
            type="button"
            onClick={handleOpenModal}
            className="bg-[#E10600] hover:bg-[#B20404] text-white px-6 py-2.5 text-xs font-bold uppercase rounded"
          >
            Submit Request Now
          </button>
        </div>
      )}

      {/* Post Sourcing Request Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="SUBMIT RARE PART SOURCING REQUEST"
      >
        <form onSubmit={handleCreateRequest} className="space-y-4 text-xs text-left">
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
                Vehicle Model *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. SS80 / Contessa"
                value={reqModel}
                onChange={(e) => setReqModel(e.target.value)}
                className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-white outline-none focus:border-[#E10600]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">
                Model Year
              </label>
              <input
                type="number"
                placeholder="e.g. 1985"
                value={reqYear}
                onChange={(e) => setReqYear(e.target.value)}
                className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-white outline-none focus:border-[#E10600]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">
                Category
              </label>
              <select
                value={reqCategory}
                onChange={(e) => setReqCategory(e.target.value)}
                className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-white outline-none focus:border-[#E10600] cursor-pointer"
              >
                <option value="Engine Parts">Engine Parts</option>
                <option value="Braking Systems">Braking Systems</option>
                <option value="Electrical & Ignition">Electrical & Ignition</option>
                <option value="Carburetors & Fuel">Carburetors & Fuel</option>
                <option value="Body & Trim">Body & Trim</option>
                <option value="Transmission & Drivetrain">Transmission & Drivetrain</option>
              </select>
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
                placeholder="e.g. 4500"
                value={reqBudget}
                onChange={(e) => setReqBudget(e.target.value)}
                className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-white outline-none focus:border-[#E10600]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">
                Sourcing Urgency
              </label>
              <select
                value={reqUrgency}
                onChange={(e: any) => setReqUrgency(e.target.value)}
                className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-white outline-none focus:border-[#E10600] cursor-pointer"
              >
                <option value="urgent">🔴 Urgent</option>
                <option value="moderate">🟡 Moderate</option>
                <option value="flexible">🟢 Flexible</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">
              Required Condition
            </label>
            <select
              value={reqCondition}
              onChange={(e: any) => setReqCondition(e.target.value)}
              className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-white outline-none focus:border-[#E10600] cursor-pointer"
            >
              <option value="NOS Only">NOS (New Old Stock) Only</option>
              <option value="Good Used">Good Used OEM</option>
              <option value="Restorable">Restorable Period Spec</option>
              <option value="Any Condition">Any Condition</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">
              Detailed Specifications & Fitment Notes *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Provide exact stamping details, casting numbers, or photos you're trying to match..."
              value={reqDesc}
              onChange={(e) => setReqDesc(e.target.value)}
              className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-white outline-none focus:border-[#E10600] resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#E10600] hover:bg-[#B20404] text-white py-2.5 text-xs font-bold uppercase rounded tracking-wider transition-colors disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Sourcing Request'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
