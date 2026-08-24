import { Request, Response } from 'express';
import { Wishlist } from '../models/Wishlist.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const getWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: 'listings',
      populate: {
        path: 'seller',
        select: 'name avatar sellerRating isVerifiedSeller location',
      },
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, listings: [] });
    }

    res.json({ success: true, data: wishlist.listings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addToWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { listingId } = req.body;
    if (!listingId) {
      res.status(400).json({ success: false, message: 'listingId is required.' });
      return;
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, listings: [listingId] });
    } else {
      if (!wishlist.listings.some((id) => id.toString() === listingId)) {
        wishlist.listings.push(listingId);
        await wishlist.save();
      }
    }

    res.json({ success: true, message: 'Saved to wishlist.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFromWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { listingId } = req.params;
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (wishlist) {
      wishlist.listings = wishlist.listings.filter((id) => id.toString() !== listingId) as any;
      await wishlist.save();
    }

    res.json({ success: true, message: 'Removed from wishlist.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
