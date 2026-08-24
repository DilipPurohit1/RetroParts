import { Request, Response } from 'express';
import { User } from '../models/User.js';
import { Listing } from '../models/Listing.js';
import { Order } from '../models/Order.js';
import { WantedPart } from '../models/WantedPart.js';
import { Report } from '../models/Report.js';
import { Notification } from '../models/Notification.js';
import { emitToUser } from '../services/socketService.js';

export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSellers = await User.countDocuments({ role: { $in: ['seller', 'both'] } });
    const verifiedSellers = await User.countDocuments({ isVerifiedSeller: true });
    const pendingVerifications = await User.countDocuments({ verificationStatus: 'pending' });

    const totalListings = await Listing.countDocuments();
    const activeListings = await Listing.countDocuments({ status: 'active' });
    const soldListings = await Listing.countDocuments({ status: 'sold' });

    const totalOrders = await Order.countDocuments();
    const totalWanted = await WantedPart.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'pending' });

    const salesStats = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
    ]);

    const totalRevenue = salesStats[0]?.totalRevenue || 0;

    res.json({
      success: true,
      data: {
        users: { total: totalUsers, sellers: totalSellers, verified: verifiedSellers, pendingVerification: pendingVerifications },
        listings: { total: totalListings, active: activeListings, sold: soldListings },
        orders: { total: totalOrders, totalRevenue },
        wanted: { total: totalWanted },
        reports: { pending: pendingReports },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role, verificationStatus } = req.query;
    const query: any = {};
    if (role && role !== 'all') query.role = role;
    if (verificationStatus && verificationStatus !== 'all') query.verificationStatus = verificationStatus;

    const users = await User.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserVerification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { status, isVerifiedSeller } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    if (status) user.verificationStatus = status;
    if (isVerifiedSeller !== undefined) {
      user.isVerifiedSeller = Boolean(isVerifiedSeller);
      if (user.isVerifiedSeller) {
        user.verificationStatus = 'verified';
      }
    }

    await user.save();

    // Create Notification
    const notification = await Notification.create({
      user: user._id,
      type: 'seller_verified',
      title: user.isVerifiedSeller ? 'Seller Verification Approved!' : 'Seller Verification Status Updated',
      message: user.isVerifiedSeller
        ? 'Congratulations! Your seller account has been verified. You now display the Verified Restorer Badge!'
        : `Your seller verification status is now: ${user.verificationStatus}`,
      link: `/seller`,
    });
    emitToUser(user._id.toString(), 'notification:new', notification);

    res.json({ success: true, message: 'Seller verification updated.', data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminListings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    const query: any = {};
    if (status && status !== 'all') query.status = status;

    const listings = await Listing.find(query)
      .populate('seller', 'name email isVerifiedSeller')
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: listings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateListingStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { listingId } = req.params;
    const { status, featured } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      res.status(404).json({ success: false, message: 'Listing not found.' });
      return;
    }

    if (status) listing.status = status;
    if (featured !== undefined) listing.featured = Boolean(featured);

    await listing.save();

    res.json({ success: true, message: 'Listing status updated.', data: listing });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminReports = async (req: Request, res: Response): Promise<void> => {
  try {
    const reports = await Report.find()
      .populate('listing', 'title price images vehicleBrand vehicleModel seller')
      .populate('reporter', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: reports });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resolveReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reportId } = req.params;
    const { status, takeDownListing } = req.body;

    const report = await Report.findById(reportId);
    if (!report) {
      res.status(404).json({ success: false, message: 'Report not found.' });
      return;
    }

    report.status = status || 'reviewed';
    await report.save();

    if (takeDownListing && report.listing) {
      await Listing.findByIdAndUpdate(report.listing, { status: 'rejected' });
    }

    res.json({ success: true, message: 'Report resolved.', data: report });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
