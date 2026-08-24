import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IListing } from '../types/index.js';
import { wishlistService } from '../services/orderService.js';
import { useAuth } from './AuthContext.js';
import { useToast } from './ToastContext.js';

interface WishlistContextType {
  wishlist: IListing[];
  addToWishlist: (listing: IListing) => Promise<void>;
  removeFromWishlist: (listingId: string) => Promise<void>;
  toggleWishlist: (listing: IListing) => Promise<void>;
  isInWishlist: (listingId: string) => boolean;
  clearWishlist: () => void;
  refreshWishlist: () => Promise<void>;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<IListing[]>([]);
  const { isAuthenticated } = useAuth();
  const { success, info } = useToast();

  const refreshWishlist = async () => {
    if (isAuthenticated) {
      try {
        const data = await wishlistService.getWishlist();
        setWishlist(data || []);
      } catch (err) {
        console.warn('Failed to load wishlist from server', err);
      }
    } else {
      try {
        const saved = localStorage.getItem('retroparts_wishlist');
        setWishlist(saved ? JSON.parse(saved) : []);
      } catch {
        setWishlist([]);
      }
    }
  };

  useEffect(() => {
    refreshWishlist();
  }, [isAuthenticated]);

  const isInWishlist = (listingId: string): boolean => {
    return wishlist.some((item) => item._id === listingId);
  };

  const addToWishlist = async (listing: IListing) => {
    if (isInWishlist(listing._id)) return;

    setWishlist((prev) => [...prev, listing]);
    success(`"${listing.title}" saved to your wishlist!`, 'Saved');

    if (isAuthenticated) {
      try {
        await wishlistService.addToWishlist(listing._id);
      } catch (err) {
        console.warn('Wishlist server sync error', err);
      }
    } else {
      localStorage.setItem('retroparts_wishlist', JSON.stringify([...wishlist, listing]));
    }
  };

  const removeFromWishlist = async (listingId: string) => {
    setWishlist((prev) => prev.filter((item) => item._id !== listingId));
    info('Item removed from wishlist.', 'Wishlist');

    if (isAuthenticated) {
      try {
        await wishlistService.removeFromWishlist(listingId);
      } catch (err) {
        console.warn('Wishlist remove server sync error', err);
      }
    } else {
      const updated = wishlist.filter((item) => item._id !== listingId);
      localStorage.setItem('retroparts_wishlist', JSON.stringify(updated));
    }
  };

  const toggleWishlist = async (listing: IListing) => {
    if (isInWishlist(listing._id)) {
      await removeFromWishlist(listing._id);
    } else {
      await addToWishlist(listing);
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem('retroparts_wishlist');
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        refreshWishlist,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
