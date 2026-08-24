import { Request, Response } from 'express';
import { Review } from '../models/Review.js';
import { User } from '../models/User.js';
import { Order } from '../models/Order.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const addReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { sellerId, orderId, listingId, rating, comment } = req.body;

    if (!sellerId || !rating || !comment) {
      res.status(400).json({ success: false, message: 'Seller, rating (1-5), and comment are required.' });
      return;
    }

    if (sellerId === req.user._id.toString()) {
      res.status(400).json({ success: false, message: 'You cannot review yourself.' });
      return;
    }

    // Check Order verification if orderId is supplied
    if (orderId) {
      const order = await Order.findById(orderId);
      if (!order) {
        res.status(404).json({ success: false, message: 'Order not found.' });
        return;
      }

      if (order.buyer.toString() !== req.user._id.toString()) {
        res.status(403).json({ success: false, message: 'You are not the buyer of this order.' });
        return;
      }

      const currentStatus = order.orderStatus as string;
      if (currentStatus !== 'completed' && currentStatus !== 'delivered') {
        res.status(400).json({
          success: false,
          message: `Reviews are only permitted after an order is delivered or completed. Current status: ${currentStatus}`,
        });
        return;
      }
    }

    const review = await Review.create({
      seller: sellerId,
      buyer: req.user._id,
      order: orderId || undefined,
      listing: listingId || undefined,
      rating: Math.min(5, Math.max(1, Number(rating))),
      comment,
      verifiedPurchase: true,
    });

    // Update seller aggregate rating
    const allReviews = await Review.find({ seller: sellerId });
    const avgRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;

    await User.findByIdAndUpdate(sellerId, {
      sellerRating: Number(avgRating.toFixed(1)),
      sellerReviewCount: allReviews.length,
    });

    const populatedReview = await Review.findById(review._id).populate('buyer', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully.',
      data: populatedReview,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSellerReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sellerId } = req.params;
    const reviews = await Review.find({ seller: sellerId })
      .populate('buyer', 'name avatar location')
      .populate('listing', 'title')
      .sort({ createdAt: -1 });

    const total = reviews.length;
    const avgRating = total > 0 ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / total).toFixed(1) : '5.0';

    res.json({
      success: true,
      data: reviews,
      stats: {
        total,
        averageRating: Number(avgRating),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
