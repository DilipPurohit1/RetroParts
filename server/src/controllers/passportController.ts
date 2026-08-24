import { Request, Response } from 'express';
import { PartPassport } from '../models/PartPassport.js';
import { Listing } from '../models/Listing.js';
import { Notification } from '../models/Notification.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

// GET /api/v1/passports/:listingId
export const getPassportByListingId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { listingId } = req.params;
    let passport = await PartPassport.findOne({ listingId }).populate('listingId', 'title vehicleBrand vehicleModel oemNumber price images seller');

    if (!passport) {
      // Find listing to return basic claim draft
      const listing = await Listing.findById(listingId);
      if (!listing) {
        res.status(404).json({ success: false, message: 'Listing not found.', errorCode: 'NOT_FOUND' });
        return;
      }

      // Return default placeholder
      res.json({
        success: true,
        passport: {
          listingId: listing._id,
          originalOrReproduction: listing.partType === 'OEM Original' ? 'oem_original' : 'period_aftermarket',
          status: 'claimed',
          sourceVehicle: {
            make: listing.vehicleBrand,
            model: listing.vehicleModel,
            year: listing.vehicleYear,
          },
          repairHistory: 'Preserved in original storage.',
          defects: 'None reported by seller.',
          documents: [],
          statusHistory: [
            {
              status: 'claimed',
              at: listing.createdAt,
              note: 'Initial provenance claimed by seller at listing creation.',
            },
          ],
        },
      });
      return;
    }

    res.json({ success: true, passport });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, errorCode: 'SERVER_ERROR' });
  }
};

// POST /api/v1/passports/:listingId (Seller claims / submits provenance)
export const savePassport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.', errorCode: 'UNAUTHORIZED' });
      return;
    }

    const { listingId } = req.params;
    const { originalOrReproduction, sourceVehicle, repairHistory, defects, documents } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      res.status(404).json({ success: false, message: 'Listing not found.', errorCode: 'NOT_FOUND' });
      return;
    }

    const sellerId = listing.seller?.toString() || (listing as any).sellerId?.toString();
    if (sellerId !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Only the listing seller can modify provenance records.', errorCode: 'FORBIDDEN' });
      return;
    }

    let passport = await PartPassport.findOne({ listingId });

    if (!passport) {
      passport = new PartPassport({
        listingId,
        originalOrReproduction: originalOrReproduction || 'oem_original',
        sourceVehicle: sourceVehicle || {},
        repairHistory: repairHistory || '',
        defects: defects || '',
        documents: documents || [],
        status: 'pending',
        statusHistory: [
          {
            status: 'claimed',
            by: req.user._id,
            at: new Date(),
            note: 'Seller claimed part provenance and submitted evidence.',
          },
          {
            status: 'pending',
            by: req.user._id,
            at: new Date(),
            note: 'Submitted to admin verification queue.',
          },
        ],
      });
    } else {
      if (originalOrReproduction) passport.originalOrReproduction = originalOrReproduction;
      if (sourceVehicle) passport.sourceVehicle = sourceVehicle;
      if (repairHistory !== undefined) passport.repairHistory = repairHistory;
      if (defects !== undefined) passport.defects = defects;
      if (documents) passport.documents = documents;
      passport.status = 'pending';
      passport.statusHistory.push({
        status: 'pending',
        by: req.user._id,
        at: new Date(),
        note: 'Updated evidence submitted for admin review.',
      });
    }

    await passport.save();

    // Update listing verification status
    listing.verificationStatus = 'pending';
    listing.passportId = passport._id as any;
    await listing.save();

    res.json({
      success: true,
      message: 'Part Passport provenance evidence submitted for admin review.',
      passport,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, errorCode: 'SERVER_ERROR' });
  }
};

// PATCH /api/v1/passports/:listingId (Admin verifies or rejects)
export const reviewPassport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Admin permissions required.', errorCode: 'FORBIDDEN' });
      return;
    }

    const { listingId } = req.params;
    const { status, note } = req.body;

    if (!['reviewed', 'verified', 'rejected'].includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid verification status.', errorCode: 'INVALID_INPUT' });
      return;
    }

    let passport = await PartPassport.findOne({ listingId });
    const listing = await Listing.findById(listingId);

    if (!listing) {
      res.status(404).json({ success: false, message: 'Listing not found.', errorCode: 'NOT_FOUND' });
      return;
    }

    if (!passport) {
      passport = new PartPassport({
        listingId,
        status,
        statusHistory: [
          {
            status,
            by: req.user._id,
            at: new Date(),
            note: note || 'Reviewed by admin against submitted evidence.',
          },
        ],
      });
    } else {
      passport.status = status;
      passport.statusHistory.push({
        status,
        by: req.user._id,
        at: new Date(),
        note: note || 'Reviewed by admin against submitted evidence.',
      });
    }

    await passport.save();

    listing.verificationStatus = status;
    listing.passportId = passport._id as any;
    await listing.save();

    // Notify seller of verification outcome
    const sellerId = listing.seller || (listing as any).sellerId;
    if (sellerId) {
      await Notification.create({
        user: sellerId,
        title: `Part Passport Verification: ${status.toUpperCase()}`,
        message: `Your listing "${listing.title}" Part Passport status was updated to "${status}" based on submitted evidence.`,
        type: 'verification-result',
        payload: { listingId: listing._id, status },
        read: false,
      });
    }

    res.json({
      success: true,
      message: `Part Passport successfully marked as ${status}.`,
      passport,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, errorCode: 'SERVER_ERROR' });
  }
};
