import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Wrench, ShieldCheck } from 'lucide-react';
import { IListing } from '../../types/index.js';
import { formatPrice } from '../../utils/formatters.js';
import { useWishlist } from '../../context/WishlistContext.js';
import { useCart } from '../../context/CartContext.js';
import { useVehicle } from '../../context/VehicleContext.js';
import { getAuthenticPartImage } from '../../utils/partImages.js';
import { PartPassportCertificate } from './PartPassportCertificate.js';

export interface ProductCardProps {
  listing: IListing;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ listing }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart, setIsCartDrawerOpen } = useCart();
  const { activeVehicle, checkFitment } = useVehicle();
  const [imageError, setImageError] = useState<boolean>(false);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  const isSaved = isInWishlist(listing._id);
  const fitment = activeVehicle ? checkFitment(listing) : null;

  const rawImage = listing.images && listing.images.length > 0 ? listing.images[0] : '';
  const imageUrl = getAuthenticPartImage(listing.title, listing.categoryName, rawImage);
  const reviewCount = (listing as any).reviewCount || 48;

  const discountPercent =
    listing.originalPrice && listing.originalPrice > listing.price
      ? Math.round(((listing.originalPrice - listing.price) / listing.originalPrice) * 100)
      : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(listing, 1);
    setIsCartDrawerOpen(true);
  };

  const handleOpenCertificate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowCertificate(true);
  };

  const productUrl = `/parts/${listing._id}`;

  const getRarityLabel = (rarity?: string) => {
    if (!rarity || rarity === 'Common Vintage') return null;
    if (rarity === 'Extremely Rare / Holy Grail' || rarity === 'Holy Grail') {
      return 'COLLECTOR GRADE';
    }
    return rarity.toUpperCase();
  };

  const rarityLabel = getRarityLabel(listing.rarity);

  return (
    <>
      <div className="group relative bg-[#161616] border border-[#2A2A2A] hover:border-[#E10600] rounded overflow-hidden transition-all duration-200 flex flex-col justify-between text-left">
        {/* Clickable Image Container */}
        <Link
          to={productUrl}
          className="block relative aspect-[4/3] w-full overflow-hidden bg-[#111111] flex items-center justify-center p-3 border-b border-[#2A2A2A]/50 cursor-pointer"
        >
          {!imageError && imageUrl ? (
            <img
              src={imageUrl}
              alt={listing.title}
              className="max-h-full max-w-full object-contain rounded transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 text-center text-[#888888] space-y-1">
              <Wrench className="w-8 h-8 -rotate-45 text-[#333333]" />
              <span className="text-[11px]">Photo unavailable</span>
            </div>
          )}

          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between gap-1.5 z-10 pointer-events-none">
            <div className="flex flex-col gap-1 pointer-events-auto">
              {rarityLabel && (
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[#200A0A] text-[#E10600] border border-[#E10600]/40 font-mono shadow-sm">
                  {rarityLabel}
                </span>
              )}
              {fitment && (
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase font-mono ${fitment.badgeClass}`}>
                  {fitment.badgeLabel}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 pointer-events-auto">
              {/* Quick Part Passport Badge Button */}
              <button
                type="button"
                onClick={handleOpenCertificate}
                className="p-1.5 rounded bg-[#161616]/90 border border-[#2A2A2A] hover:border-[#E10600] text-[#E10600] hover:text-white transition-colors"
                title="View Official Part Passport™ Certificate"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleWishlist(listing);
                }}
                className={`p-1.5 rounded bg-[#161616]/90 border transition-colors ${
                  isSaved
                    ? 'border-[#E10600] text-[#E10600]'
                    : 'border-[#2A2A2A] text-[#888888] hover:text-white hover:border-[#383838]'
                }`}
                title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#E10600] text-[#E10600]' : ''}`} />
              </button>
            </div>
          </div>
        </Link>

        {/* Card Body Container */}
        <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            {/* Title */}
            <Link
              to={productUrl}
              title={listing.title}
              className="block text-white hover:text-[#E10600] transition-colors cursor-pointer"
            >
              <h3 className="text-[13px] font-bold text-[#E5E5E5] line-clamp-1 leading-snug">
                {listing.title}
              </h3>
            </Link>

            {/* Price with Discount */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[14px] font-bold text-[#E10600]">
                {formatPrice(listing.price)}
              </span>
              {listing.originalPrice && listing.originalPrice > listing.price && (
                <>
                  <span className="text-[11px] text-[#888888] line-through font-mono">
                    {formatPrice(listing.originalPrice)}
                  </span>
                  {discountPercent && (
                    <span className="text-[10px] font-bold font-mono text-[#00E575] bg-[#00E575]/10 border border-[#00E575]/30 px-1.5 py-0.5 rounded">
                      {discountPercent}% OFF
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Star Ratings */}
            <div className="flex items-center gap-1 text-[#FFB800] text-[11px]">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-[#FFB800] text-[#FFB800]" />
                ))}
              </div>
              <span className="text-[#888888] text-[10px] font-mono ml-0.5">
                ({reviewCount})
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 bg-[#E10600] hover:bg-[#B20404] text-white py-2 text-[11px] font-bold uppercase tracking-wider rounded transition-colors text-center shadow-sm"
            >
              ADD TO CART
            </button>
            <button
              type="button"
              onClick={handleOpenCertificate}
              className="px-2.5 py-2 rounded bg-[#200A0A] hover:bg-[#2E0E0E] text-[#E10600] border border-[#E10600]/40 text-[10px] font-bold uppercase font-mono tracking-wider transition-colors shrink-0"
              title="View Certificate"
            >
              PASSPORT
            </button>
          </div>
        </div>
      </div>

      {/* Part Passport Modal for this Card */}
      {showCertificate && (
        <PartPassportCertificate
          listing={listing}
          isOpen={showCertificate}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </>
  );
};
