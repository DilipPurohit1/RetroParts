import express from 'express';
import { User } from '../models/User.js';
import { Listing } from '../models/Listing.js';
import { Review } from '../models/Review.js';
import { protect, AuthRequest } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/v1/users/me (or /api/users/me)
router.get('/me', protect, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.', errorCode: 'UNAUTHENTICATED' });
      return;
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.', errorCode: 'NOT_FOUND' });
      return;
    }
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        sellerType: user.sellerType,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        isVerifiedSeller: user.isVerifiedSeller,
        verificationStatus: user.verificationStatus,
        sellerRating: user.sellerRating,
        sellerReviewCount: user.sellerReviewCount,
        savedVehicles: user.savedVehicles || [],
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, errorCode: 'SERVER_ERROR' });
  }
});

// PATCH /api/v1/users/me
router.patch('/me', protect, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.', errorCode: 'UNAUTHENTICATED' });
      return;
    }
    const { name, phone, bio, avatar, location, sellerType, savedVehicles } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.', errorCode: 'NOT_FOUND' });
      return;
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;
    if (sellerType && ['individual', 'collector', 'mechanic', 'garage', 'supplier'].includes(sellerType)) {
      user.sellerType = sellerType;
    }
    if (savedVehicles) user.savedVehicles = savedVehicles;
    if (location) {
      user.location = {
        city: location.city ?? user.location.city,
        state: location.state ?? user.location.state,
        pincode: location.pincode ?? user.location.pincode,
      };
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        sellerType: user.sellerType,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        isVerifiedSeller: user.isVerifiedSeller,
        verificationStatus: user.verificationStatus,
        sellerRating: user.sellerRating,
        sellerReviewCount: user.sellerReviewCount,
        savedVehicles: user.savedVehicles || [],
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, errorCode: 'SERVER_ERROR' });
  }
});

// PATCH /api/v1/users/me/vacation
router.patch('/me/vacation', protect, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.', errorCode: 'UNAUTHENTICATED' });
      return;
    }
    const { active, until, message } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.', errorCode: 'NOT_FOUND' });
      return;
    }

    user.vacationMode = {
      active: Boolean(active),
      until: until ? new Date(until) : undefined,
      message: message || 'Seller is currently away on a sourcing trip. Inquiries welcome; orders will be dispatched upon return.',
    };

    await user.save();

    res.json({
      success: true,
      message: `Vacation mode ${user.vacationMode.active ? 'activated' : 'deactivated'}.`,
      vacationMode: user.vacationMode,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, errorCode: 'SERVER_ERROR' });
  }
});

// GET /api/v1/users/:id (Public Profile)

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User profile not found.', errorCode: 'NOT_FOUND' });
      return;
    }

    // Active listings by this user
    const listings = await Listing.find({
      $or: [{ seller: user._id }, { sellerId: user._id }],
      status: { $in: ['active', 'published'] },
    }).limit(12);

    // Reviews for this seller
    const reviews = await Review.find({ seller: user._id })
      .populate('buyer', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        sellerType: user.sellerType || 'individual',
        avatar: user.avatar,
        bio: user.bio,
        location: {
          city: user.location?.city || 'Bengaluru',
          state: user.location?.state || 'Karnataka',
        },
        isVerifiedSeller: user.isVerifiedSeller,
        sellerRating: user.sellerRating,
        sellerReviewCount: user.sellerReviewCount,
        createdAt: user.createdAt,
      },
      listings,
      reviews,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, errorCode: 'SERVER_ERROR' });
  }
});

export default router;
