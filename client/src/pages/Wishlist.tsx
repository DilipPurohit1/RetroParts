import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext.js';
import { ProductCard } from '../components/marketplace/ProductCard.js';

export const Wishlist: React.FC = () => {
  const { wishlist, wishlistCount, clearWishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-28 text-center space-y-4 min-h-[75vh] flex flex-col justify-center text-[#E5E5E5] bg-transparent">
        <div className="w-14 h-14 rounded bg-[#161616] border border-[#2A2A2A] text-[#888888] flex items-center justify-center mx-auto">
          <Heart className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-display font-bold uppercase text-white">Your wishlist is empty</h2>
        <p className="text-xs text-[#888888] max-w-sm mx-auto">
          Save rare vehicle parts, NOS carburetors, body panels, and engine assemblies to review before purchasing.
        </p>
        <div className="pt-2">
          <Link to="/explore">
            <button className="bg-[#E10600] hover:bg-[#B20404] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded transition-colors inline-flex items-center gap-2">
              Explore Parts Catalog <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 space-y-8 min-h-screen text-[#E5E5E5] bg-transparent text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2A2A] pb-4">
        <div>
          <span className="text-[11px] font-mono font-bold text-[#E10600] uppercase tracking-wider block">
            SAVED SPARES
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-black uppercase text-white">
            My Wishlist ({wishlistCount} {wishlistCount === 1 ? 'part' : 'parts'})
          </h1>
        </div>

        <button
          type="button"
          onClick={clearWishlist}
          className="text-xs text-[#888888] hover:text-[#E10600] font-bold uppercase transition-colors"
        >
          Clear Wishlist
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {wishlist.map((item) => (
          <ProductCard key={item._id} listing={item} />
        ))}
      </div>
    </div>
  );
};
