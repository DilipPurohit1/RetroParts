import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Star,
  Check,
  Heart,
  ShoppingBag,
  AlertTriangle,
} from 'lucide-react';
import { listingService } from '../services/listingService.js';
import { IListing } from '../types/index.js';
import { formatPrice } from '../utils/formatters.js';
import { useCart } from '../context/CartContext.js';
import { useWishlist } from '../context/WishlistContext.js';
import { useToast } from '../context/ToastContext.js';
import { CompatibilityChecker } from '../components/marketplace/CompatibilityChecker.js';
import { PartPassportCertificate } from '../components/marketplace/PartPassportCertificate.js';

import { getAuthenticPartImage } from '../utils/partImages.js';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<IListing | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews' | 'fitment'>('description');
  const [showPassportModal, setShowPassportModal] = useState<boolean>(false);

  const { addToCart, setIsCartDrawerOpen } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { success, error } = useToast();

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await listingService.getListingById(id);
        setListing((res as any).data || res);
      } catch (err: any) {
        error(err.response?.data?.message || 'Failed to load spare part listing.', 'Error');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-[1680px] mx-auto px-4 py-28 flex flex-col items-center justify-center min-h-[60vh] text-white bg-[#0D0D0D]">
        <div className="w-10 h-10 border-2 border-[#E10600] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-[#888888]">Loading spare part specifications...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-md mx-auto px-4 py-28 text-center space-y-4 text-white bg-[#0D0D0D]">
        <div className="w-12 h-12 rounded bg-[#161616] text-[#E10600] border border-[#2A2A2A] flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-display font-bold uppercase">Listing Not Found</h2>
        <p className="text-xs text-[#888888]">The part may have been sold or removed.</p>
        <Link to="/explore">
          <button className="bg-[#E10600] hover:bg-[#B20404] text-white px-5 py-2 text-xs font-bold uppercase rounded">
            Return to Catalog
          </button>
        </Link>
      </div>
    );
  }

  const isSaved = isInWishlist(listing._id);
  const rawImages = listing.images && listing.images.length > 0 ? listing.images : [];
  const primaryImg = getAuthenticPartImage(listing.title, listing.categoryName, rawImages[0]);
  const images = rawImages.length > 0
    ? rawImages.map((img) => getAuthenticPartImage(listing.title, listing.categoryName, img))
    : [primaryImg];

  const handleAddToCart = () => {
    addToCart(listing, quantity);
    setIsCartDrawerOpen(true);
    success(`Added ${quantity}x ${listing.title} to cart.`);
  };

  return (
    <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-10 min-h-screen text-[#E5E5E5] bg-[#0D0D0D]">
      {/* Breadcrumb Navigation (Matches Reference) */}
      <nav className="flex items-center gap-1.5 text-xs text-[#888888]">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link to={`/explore?category=${encodeURIComponent(listing.categoryName)}`} className="hover:text-white transition-colors">{listing.categoryName}</Link>
        <span>/</span>
        <span className="text-[#E10600] font-medium truncate max-w-xs">{listing.title}</span>
      </nav>

      {/* Main Two-Column Layout (Matches Reference Image Exactly) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Vertical Thumbnails + Large Main Image */}
        <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
          {/* Vertical Thumbnails */}
          {images.length > 1 && (
            <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto sm:max-h-[460px] shrink-0">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-16 rounded overflow-hidden border transition-all ${
                    selectedImage === idx ? 'border-[#E10600] ring-1 ring-[#E10600]' : 'border-[#2A2A2A] hover:border-[#383838] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain p-1 bg-[#111111]" />
                </button>
              ))}
            </div>
          )}

          {/* Large Main Product Photo */}
          <div className="flex-1 aspect-square bg-[#161616] border border-[#2A2A2A] rounded p-6 flex items-center justify-center relative overflow-hidden">
            <img
              src={images[selectedImage]}
              alt={listing.title}
              className="max-h-full max-w-full object-contain rounded"
            />
            {listing.rarity && listing.rarity !== 'Common Vintage' && (
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded text-[10px] font-bold font-mono uppercase tracking-wider bg-[#200A0A] text-[#E10600] border border-[#E10600]/40">
                {String(listing.rarity).includes('Holy Grail') || listing.rarity === 'Collector Grade'
                  ? 'COLLECTOR GRADE'
                  : String(listing.rarity).toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Title, Ratings, Price, Bullet Specs, Add to Cart & Wishlist */}
        <div className="lg:col-span-6 space-y-5 text-left">
          {/* Title & Brand */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight leading-tight">
              {listing.title}
            </h1>

            {/* Ratings & In Stock Badge (Matches Reference) */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 text-[#FFB800] text-xs">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
                  ))}
                </div>
                <span className="text-[#888888] font-mono text-[11px]">
                  ({(listing as any).reviewCount || 120} Reviews)
                </span>
              </div>

              <span className="text-xs font-bold text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded border border-[#10B981]/30 uppercase font-mono">
                {listing.quantity > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Price Callout with Discount Percentage */}
          <div className="p-3.5 rounded bg-[#161616] border border-[#2A2A2A] flex items-center gap-3 flex-wrap">
            <span className="font-mono text-3xl font-bold text-white">
              {formatPrice(listing.price)}
            </span>
            {listing.originalPrice && listing.originalPrice > listing.price && (
              <>
                <span className="text-base font-mono text-[#888888] line-through">
                  {formatPrice(listing.originalPrice)}
                </span>
                <span className="text-xs font-bold font-mono text-[#00E575] bg-[#00E575]/10 border border-[#00E575]/30 px-2 py-0.5 rounded">
                  {Math.round(((listing.originalPrice - listing.price) / listing.originalPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          {/* Description Summary */}
          <p className="text-xs sm:text-sm text-[#888888] leading-relaxed font-sans">
            {listing.description?.slice(0, 160)}...
          </p>

          {/* 4 Bullet Value Points with Green Checkmarks (Matches Reference) */}
          <div className="space-y-2 py-2 border-y border-[#2A2A2A] text-xs text-[#E5E5E5]">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#10B981] shrink-0" />
              <span>100% Original {listing.vehicleBrand} / OEM Authenticated Part</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#10B981] shrink-0" />
              <span>Condition: <strong>{listing.condition}</strong> (Preserved Storage)</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#10B981] shrink-0" />
              <span>Vault Escrow Protection with 48h Inspection Window</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#10B981] shrink-0" />
              <span>Direct Fitment for {listing.vehicleBrand} {listing.vehicleModel} ({listing.vehicleYear})</span>
            </div>
          </div>

          {/* Action Row: Quantity Stepper + Solid Red ADD TO CART + ADD TO WISHLIST */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity Stepper */}
              <div className="flex items-center bg-[#161616] border border-[#2A2A2A] rounded">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2.5 text-xs text-[#E5E5E5] hover:bg-[#222222] transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2.5 text-xs font-mono font-bold text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2.5 text-xs text-[#E5E5E5] hover:bg-[#222222] transition-colors"
                >
                  +
                </button>
              </div>

              {/* Solid Red ADD TO CART Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 bg-[#E10600] hover:bg-[#B20404] text-white py-3 text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" /> ADD TO CART
              </button>

              {/* ADD TO WISHLIST Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(listing)}
                className={`px-4 py-3 rounded border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                  isSaved
                    ? 'border-[#E10600] text-[#E10600] bg-[#200A0A]'
                    : 'border-[#2A2A2A] text-white hover:border-[#E10600] bg-[#161616]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-[#E10600] text-[#E10600]' : ''}`} />
                <span className="hidden sm:inline">WISHLIST</span>
              </button>
            </div>

            {/* Part Passport Provenance Certificate Trigger */}
            <button
              type="button"
              onClick={() => setShowPassportModal(true)}
              className="w-full py-2 px-4 rounded bg-[#161616] hover:bg-[#222222] border border-[#2A2A2A] hover:border-[#E10600]/40 text-xs text-[#E5E5E5] flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#E10600]" />
                <span className="font-mono text-[11px] uppercase">Part Passport™ Provenance Certificate</span>
              </div>
              <span className="text-[#E10600] text-xs font-bold">View Certificate →</span>
            </button>
          </div>

          {/* Meta Information */}
          <div className="pt-2 text-xs text-[#888888] font-mono space-y-1">
            <p>Category: <strong className="text-[#E5E5E5]">{listing.categoryName}</strong></p>
            <p>Vehicle Make: <strong className="text-[#E5E5E5]">{listing.vehicleBrand} {listing.vehicleModel}</strong></p>
            <p>OEM Part #: <strong className="text-[#E10600]">{listing.oemNumber || 'Preserved Period Spec'}</strong></p>
          </div>
        </div>
      </div>

      {/* Bottom Tabs: DESCRIPTION, SPECIFICATIONS, REVIEWS, FITMENT (Matches Reference) */}
      <div className="bg-[#161616] border border-[#2A2A2A] rounded p-6 sm:p-8 space-y-6 text-left">
        {/* Tab Headers */}
        <div className="flex items-center gap-6 border-b border-[#2A2A2A] pb-3 overflow-x-auto text-xs font-bold uppercase tracking-wider font-display">
          <button
            type="button"
            onClick={() => setActiveTab('description')}
            className={`pb-2 border-b-2 transition-colors ${
              activeTab === 'description'
                ? 'border-[#E10600] text-[#E10600]'
                : 'border-transparent text-[#888888] hover:text-white'
            }`}
          >
            DESCRIPTION
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('specifications')}
            className={`pb-2 border-b-2 transition-colors ${
              activeTab === 'specifications'
                ? 'border-[#E10600] text-[#E10600]'
                : 'border-transparent text-[#888888] hover:text-white'
            }`}
          >
            SPECIFICATIONS
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`pb-2 border-b-2 transition-colors ${
              activeTab === 'reviews'
                ? 'border-[#E10600] text-[#E10600]'
                : 'border-transparent text-[#888888] hover:text-white'
            }`}
          >
            REVIEWS (120)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('fitment')}
            className={`pb-2 border-b-2 transition-colors ${
              activeTab === 'fitment'
                ? 'border-[#E10600] text-[#E10600]'
                : 'border-transparent text-[#888888] hover:text-white'
            }`}
          >
            FITMENT ENGINE
          </button>
        </div>

        {/* Tab 1: Description */}
        {activeTab === 'description' && (
          <div className="space-y-4 text-xs sm:text-sm text-[#BAC0CD] leading-relaxed font-sans">
            <p>{listing.description}</p>
            <div className="p-4 rounded bg-[#222222] border border-[#2A2A2A] space-y-2">
              <h4 className="font-bold text-white text-xs font-display uppercase">Condition Assessment</h4>
              <p className="text-xs text-[#888888]">
                This component has been verified as <strong>{listing.condition}</strong>. Original period markings are intact with zero fatigue cracks.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Specifications */}
        {activeTab === 'specifications' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded bg-[#222222] border border-[#2A2A2A]">
              <span className="text-[#888888] block text-[10px] uppercase">Vehicle Make & Model</span>
              <p className="font-bold text-white mt-0.5">{listing.vehicleBrand} {listing.vehicleModel}</p>
            </div>
            <div className="p-3.5 rounded bg-[#222222] border border-[#2A2A2A]">
              <span className="text-[#888888] block text-[10px] uppercase">Production Model Year</span>
              <p className="font-bold text-white mt-0.5">{listing.vehicleYear || '1985–1996'}</p>
            </div>
            <div className="p-3.5 rounded bg-[#222222] border border-[#2A2A2A]">
              <span className="text-[#888888] block text-[10px] uppercase">Stamped OEM Number</span>
              <p className="font-bold text-[#E10600] mt-0.5">{listing.oemNumber || 'Preserved Spec'}</p>
            </div>
            <div className="p-3.5 rounded bg-[#222222] border border-[#2A2A2A]">
              <span className="text-[#888888] block text-[10px] uppercase">Part Category</span>
              <p className="font-bold text-white mt-0.5">{listing.categoryName}</p>
            </div>
            <div className="p-3.5 rounded bg-[#222222] border border-[#2A2A2A]">
              <span className="text-[#888888] block text-[10px] uppercase">Condition Grade</span>
              <p className="font-bold text-white mt-0.5">{listing.condition}</p>
            </div>
            <div className="p-3.5 rounded bg-[#222222] border border-[#2A2A2A]">
              <span className="text-[#888888] block text-[10px] uppercase">Rarity Classification</span>
              <p className="font-bold text-white mt-0.5">{listing.rarity || 'Discontinued OEM'}</p>
            </div>
          </div>
        )}

        {/* Tab 3: Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
              <div>
                <span className="font-bold text-white text-sm">Customer Reviews</span>
                <p className="text-[#888888]">120 verified enthusiast evaluations</p>
              </div>
              <div className="flex items-center gap-1 text-[#FFB800]">
                <Star className="w-4 h-4 fill-[#FFB800]" />
                <span className="font-bold font-mono text-white text-sm">4.9 / 5.0</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded bg-[#222222] border border-[#2A2A2A] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Aditya V. (Bengaluru)</span>
                  <span className="text-[#888888] font-mono text-[10px]">Verified Restorer</span>
                </div>
                <p className="text-[#BAC0CD]">"100% authentic NOS unit. Stamped Japanese factory markings were crisp and clean. Fitted to my build perfectly."</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Fitment Engine */}
        {activeTab === 'fitment' && (
          <div className="space-y-4">
            <CompatibilityChecker listing={listing} />
          </div>
        )}
      </div>

      {/* Part Passport Modal */}
      {showPassportModal && (
        <PartPassportCertificate
          listing={listing}
          isOpen={showPassportModal}
          onClose={() => setShowPassportModal(false)}
        />
      )}
    </div>
  );
};
