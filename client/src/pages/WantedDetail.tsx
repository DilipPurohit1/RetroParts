import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  HelpCircle,
  MapPin,
  Send,
  AlertTriangle,
  CheckCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { wantedService } from '../services/wantedService.js';
import { IWantedPart } from '../types/index.js';
import { formatPrice, formatDate } from '../utils/formatters.js';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';

export const WantedDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [request, setRequest] = useState<IWantedPart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [offerPrice, setOfferPrice] = useState<string>('');
  const [offerMessage, setOfferMessage] = useState<string>('');
  const [contactNumber, setContactNumber] = useState<string>('');
  const [submittingOffer, setSubmittingOffer] = useState<boolean>(false);

  const { isAuthenticated } = useAuth();
  const { success, error, info } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequest = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await wantedService.getWantedPartById(id);
        setRequest(data);
      } catch (err: any) {
        error(err.response?.data?.message || 'Failed to load sourcing request.', 'Error');
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id]);

  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      info('Please sign in to submit a quote for this part request.', 'Sign In Required');
      navigate('/login');
      return;
    }

    if (!offerPrice || !offerMessage) {
      error('Please provide a quote price and condition message.', 'Validation Error');
      return;
    }

    try {
      setSubmittingOffer(true);
      const updatedRequest = await wantedService.submitOffer(id!, {
        offerPrice: parseFloat(offerPrice),
        message: offerMessage,
        contactNumber,
      });

      success('Your quote has been sent to the requester!', 'Quote Delivered');
      setRequest(updatedRequest);
      setOfferPrice('');
      setOfferMessage('');
      setContactNumber('');
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to submit quote.', 'Error');
    } finally {
      setSubmittingOffer(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1680px] mx-auto px-4 py-28 flex flex-col items-center justify-center min-h-[60vh] text-white bg-[#0D0D0D]">
        <div className="w-10 h-10 border-2 border-[#E10600] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-[#888888]">Loading sourcing specifications...</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="max-w-md mx-auto px-4 py-28 text-center space-y-4 text-white bg-[#0D0D0D]">
        <div className="w-12 h-12 rounded bg-[#161616] text-[#E10600] border border-[#2A2A2A] flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-display font-bold uppercase">Sourcing Request Not Found</h2>
        <p className="text-xs text-[#888888]">The requested part inquiry may have been fulfilled or closed.</p>
        <Link to="/wanted">
          <button className="bg-[#E10600] hover:bg-[#B20404] text-white px-5 py-2 text-xs font-bold uppercase rounded">
            Return to Sourcing Board
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 space-y-8 min-h-screen text-[#E5E5E5] bg-transparent text-left">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-[#888888]">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link to="/wanted" className="hover:text-white transition-colors">Sourcing Requests</Link>
        <span>/</span>
        <span className="text-[#E10600] font-medium truncate max-w-xs">{request.title}</span>
      </nav>

      {/* Main Grid: Details + Quote Submission */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Sourcing Details & Description */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 sm:p-8 rounded bg-[#161616] border border-[#2A2A2A] space-y-5">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded bg-[#222222] text-white border border-[#2A2A2A] uppercase">
                  {request.vehicleBrand} {request.vehicleModel} ({request.vehicleYear})
                </span>
                <span className="text-xs text-[#888888]">
                  • {request.category}
                </span>
                {request.urgency === 'urgent' && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#E10600]/15 text-[#E10600] border border-[#E10600]/30 font-mono">
                    Urgent Request
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-display font-black uppercase text-white leading-tight">
                {request.title}
              </h1>

              <div className="flex items-center gap-4 text-xs text-[#888888] pt-1">
                <span>Posted on {formatDate(request.createdAt)}</span>
                {request.location?.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#888888]" />
                    {request.location.city}, {request.location.state}
                  </span>
                )}
              </div>
            </div>

            {/* Target Budget Banner */}
            <div className="p-4 rounded bg-[#222222] border border-[#2A2A2A] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#888888] block">Target Budget</span>
                <span className="text-xl sm:text-2xl font-mono font-bold text-[#E10600]">
                  {formatPrice(request.targetBudget)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-[#888888] block">Required Condition</span>
                <span className="text-xs font-bold text-white uppercase">{request.conditionRequired}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 text-xs sm:text-sm text-[#BAC0CD] leading-relaxed font-sans border-t border-[#2A2A2A] pt-4">
              <h3 className="font-bold text-white uppercase text-xs font-display">Sourcing Specifications & Requirements</h3>
              <p className="whitespace-pre-line">{request.description}</p>
            </div>
          </div>

          {/* Received Seller Offers List */}
          <div className="p-6 sm:p-8 rounded bg-[#161616] border border-[#2A2A2A] space-y-4">
            <h3 className="text-base font-display font-bold uppercase text-white tracking-wider border-b border-[#2A2A2A] pb-3">
              Received Quotes ({request.offers?.length || 0})
            </h3>

            {request.offers && request.offers.length > 0 ? (
              <div className="space-y-3">
                {request.offers.map((offer: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded bg-[#222222] border border-[#2A2A2A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">
                          {typeof offer.seller === 'object' ? offer.seller?.name : 'Verified Stockist'}
                        </span>
                        <span className="text-[#888888] font-mono text-[10px]">
                          {formatDate(offer.createdAt)}
                        </span>
                      </div>
                      <p className="text-[#BAC0CD]">{offer.message}</p>
                    </div>
                    <span className="text-sm font-mono font-bold text-[#E10600] shrink-0">
                      {formatPrice(offer.offerPrice)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#888888] py-4 text-center">
                No quotes received yet. Verified stockists have been notified of this sourcing request.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Submit Quote Form */}
        <div className="lg:col-span-4 bg-[#161616] border border-[#2A2A2A] rounded p-6 space-y-5 sticky top-32">
          <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white border-b border-[#2A2A2A] pb-3">
            HAVE THIS SPARE? SUBMIT A QUOTE
          </h3>

          <form onSubmit={handleSubmitOffer} className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">
                Your Price Quote (₹) *
              </label>
              <input
                type="number"
                required
                placeholder="e.g. 3200"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-white outline-none focus:border-[#E10600]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">
                Condition & Provenance Message *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Disclose casting stamps, OEM packaging, refurbishment details, or delivery timeframe..."
                value={offerMessage}
                onChange={(e) => setOfferMessage(e.target.value)}
                className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-white outline-none focus:border-[#E10600]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#888888] font-mono uppercase mb-1">
                Contact Phone / WhatsApp (Optional)
              </label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full bg-[#222222] border border-[#2A2A2A] rounded px-3 py-2 text-white outline-none focus:border-[#E10600]"
              />
            </div>

            <button
              type="submit"
              disabled={submittingOffer}
              className="w-full bg-[#E10600] hover:bg-[#B20404] text-white py-3 rounded text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {submittingOffer ? 'Delivering Quote...' : 'Submit Direct Quote'}
            </button>
          </form>

          <div className="p-3 rounded bg-[#222222] border border-[#2A2A2A] flex items-start gap-2 text-[11px] text-[#888888]">
            <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
            <p>Direct quotes are protected by Vault Escrow upon acceptance.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
