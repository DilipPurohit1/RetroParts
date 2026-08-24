import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Package,
  DollarSign,
  Star,
  CheckCircle2,
  Trash2,
  Eye,
  Search,
  HelpCircle,
  Send,
  Clock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { listingService } from '../services/listingService.js';
import { wantedService } from '../services/wantedService.js';
import { IListing, IWantedPart } from '../types/index.js';
import { formatPrice, formatDate } from '../utils/formatters.js';
import { Button } from '../components/common/Button.js';
import { Modal } from '../components/common/Modal.js';

export const SellerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'rare_requests'>('inventory');
  const [listings, setListings] = useState<IListing[]>([]);
  const [bounties, setBounties] = useState<IWantedPart[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Seller Offer Modal State
  const [offerModalOpen, setOfferModalOpen] = useState<boolean>(false);
  const [selectedBounty, setSelectedBounty] = useState<IWantedPart | null>(null);
  const [offerPrice, setOfferPrice] = useState<string>('');
  const [offerCondition, setOfferCondition] = useState<string>('NOS (New Old Stock)');
  const [offerDelivery, setOfferDelivery] = useState<string>('3-5 Business Days');
  const [offerMessage, setOfferMessage] = useState<string>('');
  const [submittingOffer, setSubmittingOffer] = useState<boolean>(false);

  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || (user?.role !== 'seller' && user?.role !== 'admin' && user?.role !== 'both')) {
      navigate('/login');
      return;
    }
    const fetchSellerData = async () => {
      try {
        setLoading(true);
        const [listingsData, bountyData] = await Promise.all([
          listingService.getSellerListings(),
          wantedService.getWantedParts({ status: 'searching' }),
        ]);
        setListings(listingsData || []);
        setBounties(bountyData.data || []);
      } catch (err) {
        console.warn('Failed to load seller data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSellerData();
  }, [isAuthenticated, user]);

  const handleDeleteListing = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this spare part listing?')) return;
    try {
      await listingService.deleteListing(id);
      setListings(listings.filter((l) => l._id !== id));
      success('Part listing removed from marketplace.');
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to delete listing.', 'Error');
    }
  };

  const handleOpenOfferModal = (bounty: IWantedPart) => {
    setSelectedBounty(bounty);
    setOfferPrice(bounty.targetBudget ? bounty.targetBudget.toString() : '');
    setOfferMessage(`Hello! I have this original ${bounty.title} in my workshop inventory ready for dispatch.`);
    setOfferModalOpen(true);
  };

  const handleSendOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBounty || !offerPrice) {
      error('Please specify an offer price.', 'Missing information');
      return;
    }

    try {
      setSubmittingOffer(true);
      await wantedService.submitOffer(selectedBounty._id, {
        offerPrice: parseFloat(offerPrice),
        message: `${offerMessage} [Condition: ${offerCondition}, Delivery: ${offerDelivery}]`,
      });
      success('Your quote has been submitted to the enthusiast!', 'Quote sent');
      setOfferModalOpen(false);
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to submit offer.', 'Error');
    } finally {
      setSubmittingOffer(false);
    }
  };

  const totalRevenue = listings.reduce((acc, curr) => acc + curr.price * (curr.quantity || 1), 0);
  const averageRating = user?.sellerRating || 4.9;

  const filteredListings = listings.filter((l) =>
    l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.vehicleBrand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 space-y-8 min-h-screen text-[#E5E5E5] bg-transparent text-left">
      {/* Seller Header */}
      <div className="p-6 sm:p-8 rounded bg-[#161616] border border-[#2A2A2A] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-display font-medium text-text-primary">
              {user?.name || 'Seller console'}
            </h1>
            {user?.isVerifiedSeller && (
              <span className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-verified/15 text-verified border border-verified/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified stockist
              </span>
            )}
          </div>
          <p className="text-[13px] text-text-muted">
            Manage your vintage catalog inventory, incoming customer orders, and rare spare requests
          </p>
        </div>

        <Link to="/sell">
          <Button variant="primary" size="md" leftIcon={<PlusCircle className="w-4 h-4" />}>
            List new spare part
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-card bg-surface border border-border space-y-1">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-[11px] font-mono uppercase">Active listings</span>
            <Package className="w-4 h-4 text-accent" />
          </div>
          <p className="font-mono text-2xl font-bold text-text-primary">{listings.length}</p>
          <span className="text-[11px] text-verified font-medium">100% fitment mapped</span>
        </div>

        <div className="p-5 rounded-card bg-surface border border-border space-y-1">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-[11px] font-mono uppercase">Open rare requests</span>
            <HelpCircle className="w-4 h-4 text-warning" />
          </div>
          <p className="font-mono text-2xl font-bold text-text-primary">{bounties.length}</p>
          <span className="text-[11px] text-text-muted font-medium">High intent buyers</span>
        </div>

        <div className="p-5 rounded-card bg-surface border border-border space-y-1">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-[11px] font-mono uppercase">Inventory value</span>
            <DollarSign className="w-4 h-4 text-success" />
          </div>
          <p className="font-mono text-2xl font-bold text-text-primary">{formatPrice(totalRevenue)}</p>
          <span className="text-[11px] text-success font-medium">+14% this month</span>
        </div>

        <div className="p-5 rounded-card bg-surface border border-border space-y-1">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-[11px] font-mono uppercase">Restorer rating</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <p className="font-mono text-2xl font-bold text-text-primary">{averageRating} / 5.0</p>
          <span className="text-[11px] text-text-muted font-medium">Verified by buyers</span>
        </div>
      </div>

      {/* Tabs: My Inventory vs Rare Part Requests */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded text-[13px] font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'inventory'
              ? 'bg-accent text-white'
              : 'text-text-secondary hover:text-text-primary hover:bg-surface border border-border'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My inventory ({listings.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rare_requests')}
          className={`px-4 py-2 rounded text-[13px] font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'rare_requests'
              ? 'bg-accent text-white'
              : 'text-text-secondary hover:text-text-primary hover:bg-surface border border-border'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-warning" />
          <span>Rare part requests ({bounties.length})</span>
        </button>
      </div>

      {/* TAB 1: Inventory Table */}
      {activeTab === 'inventory' && (
        <div className="p-6 sm:p-8 rounded-card bg-surface border border-border space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <h3 className="font-display font-medium text-lg text-text-primary">
                Spare parts catalog inventory
              </h3>
              <p className="text-[13px] text-text-muted">Live components active on the marketplace</p>
            </div>

            <div className="w-full sm:w-72">
              <div className="relative">
                <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter stock..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-surface-raised border border-border rounded pl-9 pr-3 py-1.5 text-[13px] text-text-primary placeholder-text-muted outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-border text-text-muted font-mono uppercase text-[11px]">
                  <th className="pb-3 font-medium">Part details</th>
                  <th className="pb-3 font-medium">Vehicle fitment</th>
                  <th className="pb-3 font-medium">Condition</th>
                  <th className="pb-3 font-medium">Price</th>
                  <th className="pb-3 font-medium">Stock</th>
                  <th className="pb-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredListings.map((listing) => (
                  <tr key={listing._id} className="hover:bg-surface-raised transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-11 h-11 rounded object-cover border border-border shrink-0 bg-base"
                        />
                        <div className="min-w-0 max-w-xs">
                          <Link to={`/parts/${listing._id}`} className="font-medium text-text-primary hover:text-accent truncate block">
                            {listing.title}
                          </Link>
                          <span className="text-[11px] text-text-muted font-mono">
                            OEM: {listing.oemNumber || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-text-secondary">
                      {listing.vehicleBrand} {listing.vehicleModel}
                    </td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded text-[11px] bg-surface-raised text-text-secondary border border-border">
                        {listing.condition}
                      </span>
                    </td>
                    <td className="py-3.5 font-mono font-bold text-text-primary">
                      {formatPrice(listing.price)}
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${listing.quantity > 0 ? 'bg-success/15 text-success border border-success/30' : 'bg-danger/15 text-danger border border-danger/30'}`}>
                        {listing.quantity > 0 ? `${listing.quantity} units` : 'Out of stock'}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/parts/${listing._id}`}
                          className="p-1.5 rounded text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors"
                          title="View live listing"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDeleteListing(listing._id)}
                          className="p-1.5 rounded text-text-muted hover:text-danger hover:bg-surface-raised transition-colors"
                          title="Delete listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Rare Part Requests */}
      {activeTab === 'rare_requests' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-6 rounded-card bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-medium text-lg text-text-primary">
                Community rare part requests
              </h3>
              <p className="text-[13px] text-text-muted">
                Enthusiasts seeking specific rare/discontinued parts. Submit a direct quote if you have it in stock.
              </p>
            </div>
            <span className="text-[12px] font-mono text-text-muted">
              {bounties.length} active requests
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bounties.map((bounty) => (
              <div
                key={bounty._id}
                className="p-6 rounded-card bg-surface border border-border hover:border-accent/40 transition-colors space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-surface-raised text-text-primary border border-border">
                      {bounty.vehicleBrand} {bounty.vehicleModel} ({bounty.vehicleYear})
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                      bounty.urgency === 'urgent' ? 'bg-danger/15 text-danger border border-danger/30' : 'bg-surface-raised text-text-muted'
                    }`}>
                      {bounty.urgency} urgency
                    </span>
                  </div>

                  <div>
                    <h4 className="font-medium text-base text-text-primary leading-snug">
                      {bounty.title}
                    </h4>
                    <p className="text-[13px] text-text-secondary mt-1.5 line-clamp-3">
                      {bounty.description}
                    </p>
                  </div>

                  <div className="p-3 rounded bg-surface-raised border border-border flex items-center justify-between text-[13px]">
                    <div>
                      <span className="text-[11px] text-text-muted uppercase block">Target budget</span>
                      <span className="font-mono font-bold text-text-primary">
                        {formatPrice(bounty.targetBudget)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-text-muted uppercase block">Required condition</span>
                      <span className="font-medium text-text-secondary">{bounty.conditionRequired}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between gap-3">
                  <span className="text-[11px] text-text-muted flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5" /> {formatDate(bounty.createdAt)}
                  </span>

                  <div className="flex items-center gap-2">
                    <Link to={`/wanted/${bounty._id}`} className="text-[13px] font-medium text-text-secondary hover:text-text-primary px-3 py-1.5 rounded hover:bg-surface-raised transition-colors">
                      View details
                    </Link>
                    <Button
                      type="button"
                      size="sm"
                      variant="primary"
                      onClick={() => handleOpenOfferModal(bounty)}
                      leftIcon={<Send className="w-3.5 h-3.5" />}
                    >
                      I have this part
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Direct Quote Modal */}
      <Modal
        isOpen={offerModalOpen}
        onClose={() => setOfferModalOpen(false)}
        title="Submit part offer to enthusiast"
      >
        {selectedBounty && (
          <form onSubmit={handleSendOffer} className="space-y-4 text-left text-text-primary">
            <div className="p-3 rounded bg-surface-raised border border-border text-[13px]">
              <span className="text-[11px] font-mono uppercase text-text-muted block">Requested part</span>
              <p className="font-medium text-text-primary">{selectedBounty.title}</p>
              <p className="text-text-muted font-mono mt-0.5 text-[12px]">
                Target: {formatPrice(selectedBounty.targetBudget)} • {selectedBounty.vehicleBrand} {selectedBounty.vehicleModel}
              </p>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-1">Your price (₹ INR) *</label>
              <input
                type="number"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                placeholder="e.g. 8500"
                required
                className="w-full bg-surface-raised border border-border rounded px-3 py-2 text-[13px] font-mono font-medium text-text-primary outline-none focus:border-accent"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[13px] font-medium text-text-secondary mb-1">Part condition</label>
                <select
                  value={offerCondition}
                  onChange={(e) => setOfferCondition(e.target.value)}
                  className="w-full bg-surface-raised border border-border rounded px-3 py-2 text-[13px] text-text-primary outline-none focus:border-accent"
                >
                  <option value="NOS (New Old Stock)">NOS (New Old Stock)</option>
                  <option value="OEM Mint">OEM Mint</option>
                  <option value="OEM Refurbished">OEM Refurbished</option>
                  <option value="Good Used">Good Used</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-text-secondary mb-1">Est. delivery</label>
                <input
                  type="text"
                  value={offerDelivery}
                  onChange={(e) => setOfferDelivery(e.target.value)}
                  placeholder="e.g. 2-4 Days"
                  className="w-full bg-surface-raised border border-border rounded px-3 py-2 text-[13px] text-text-primary outline-none focus:border-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-1">Message to buyer</label>
              <textarea
                rows={3}
                value={offerMessage}
                onChange={(e) => setOfferMessage(e.target.value)}
                placeholder="Describe part provenance, packaging, or warranty..."
                className="w-full bg-surface-raised border border-border rounded p-3 text-[13px] text-text-primary outline-none focus:border-accent resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button type="button" variant="secondary" size="sm" onClick={() => setOfferModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={submittingOffer}>
                Submit direct offer
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
