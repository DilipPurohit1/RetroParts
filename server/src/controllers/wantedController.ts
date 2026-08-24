import { Request, Response } from 'express';
import { WantedPart } from '../models/WantedPart.js';
import { Listing } from '../models/Listing.js';
import { Notification } from '../models/Notification.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { emitToUser } from '../services/socketService.js';

export const getWantedParts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { brand, model, status, urgency, search, page = 1, limit = 12 } = req.query;
    const query: any = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (urgency && urgency !== 'all') {
      query.urgency = urgency;
    }

    if (brand && typeof brand === 'string' && brand !== 'all') {
      query.vehicleBrand = { $regex: new RegExp(`^${brand}$`, 'i') };
    }

    if (model && typeof model === 'string' && model !== 'all') {
      query.vehicleModel = { $regex: new RegExp(`^${model}$`, 'i') };
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { vehicleBrand: { $regex: searchRegex } },
        { vehicleModel: { $regex: searchRegex } },
      ];
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const wantedParts = await WantedPart.find(query)
      .populate('requester', 'name avatar location isVerifiedSeller createdAt')
      .populate('matchingListings', 'title price images condition vehicleBrand vehicleModel')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await WantedPart.countDocuments(query);

    res.json({
      success: true,
      data: wantedParts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getWantedPartById = async (req: Request, res: Response): Promise<void> => {
  try {
    const wantedPart = await WantedPart.findById(req.params.id)
      .populate('requester', 'name email phone avatar location isVerifiedSeller createdAt')
      .populate('offers.seller', 'name avatar phone sellerRating isVerifiedSeller location')
      .populate('offers.listingId', 'title price images condition oemNumber')
      .populate('matchingListings', 'title price images condition vehicleBrand vehicleModel seller');

    if (!wantedPart) {
      res.status(404).json({ success: false, message: 'Wanted part request not found.' });
      return;
    }

    res.json({
      success: true,
      data: wantedPart,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createWantedPart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const {
      title,
      vehicleBrand,
      vehicleModel,
      vehicleYear,
      vehicleVariant,
      category,
      description,
      targetBudget,
      urgency,
      conditionRequired,
      location,
      referenceImages,
    } = req.body;

    const effectiveBudget = targetBudget || req.body.budget;
    const effectiveDescription = description || req.body.partDescription;

    if (!title || !vehicleBrand || !vehicleModel || !effectiveDescription || !effectiveBudget) {
      res.status(400).json({ success: false, message: 'Missing required request fields.' });
      return;
    }

    // Automatically check existing active listings for matches
    const searchRegex = new RegExp(vehicleModel, 'i');
    const existingMatches = await Listing.find({
      status: 'active',
      vehicleBrand: new RegExp(vehicleBrand, 'i'),
      vehicleModel: { $regex: searchRegex },
    }).limit(5);

    const initialStatus = existingMatches.length > 0 ? 'matches_found' : 'searching';

    const wantedPart = await WantedPart.create({
      title,
      vehicleBrand,
      vehicleModel,
      vehicleYear: vehicleYear || 'All Years',
      vehicleVariant: vehicleVariant || 'Standard',
      category: category || 'General',
      description: effectiveDescription,
      targetBudget: Number(effectiveBudget),
      urgency: urgency || 'moderate',
      conditionRequired: conditionRequired || 'Good Used',
      location: location || req.user.location || { city: '', state: '' },
      referenceImages: referenceImages || [],
      requester: req.user._id,
      status: initialStatus,
      matchingListings: existingMatches.map((m) => m._id),
    });

    res.status(201).json({
      success: true,
      message: 'Wanted part request posted to community board.',
      data: wantedPart,
      matchesCount: existingMatches.length,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const submitOffer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { offerPrice, message, listingId, contactNumber } = req.body;
    const wantedPartId = req.params.id;

    const wantedPart = await WantedPart.findById(wantedPartId);
    if (!wantedPart) {
      res.status(404).json({ success: false, message: 'Wanted request not found.' });
      return;
    }

    if (wantedPart.requester.toString() === req.user._id.toString()) {
      res.status(400).json({ success: false, message: 'You cannot submit an offer on your own wanted request.' });
      return;
    }

    const newOffer = {
      seller: req.user._id as any,
      listingId: listingId || undefined,
      offerPrice: Number(offerPrice),
      message,
      contactNumber: contactNumber || req.user.phone,
      createdAt: new Date(),
    };

    wantedPart.offers.push(newOffer as any);
    if (wantedPart.status === 'searching') {
      wantedPart.status = 'matches_found';
    }
    await wantedPart.save();

    // Create notification for the requester
    const notification = await Notification.create({
      user: wantedPart.requester,
      type: 'new_offer',
      title: 'New Part Offer Received!',
      message: `${req.user.name} offered a part for ₹${Number(offerPrice).toLocaleString('en-IN')} on your wanted request "${wantedPart.title}".`,
      link: `/wanted/${wantedPart._id}`,
      data: {
        wantedPartId: wantedPart._id,
        sellerId: req.user._id,
      },
    });

    emitToUser(wantedPart.requester.toString(), 'notification:new', notification);

    res.status(201).json({
      success: true,
      message: 'Offer sent to the buyer.',
      data: wantedPart,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateWantedStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { status } = req.body;
    const wantedPart = await WantedPart.findById(req.params.id);

    if (!wantedPart) {
      res.status(404).json({ success: false, message: 'Wanted request not found.' });
      return;
    }

    if (wantedPart.requester.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Unauthorized to update this request.' });
      return;
    }

    wantedPart.status = status;
    await wantedPart.save();

    res.json({
      success: true,
      message: `Request status updated to ${status}.`,
      data: wantedPart,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteWantedPart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const wantedPart = await WantedPart.findById(req.params.id);
    if (!wantedPart) {
      res.status(404).json({ success: false, message: 'Wanted request not found.' });
      return;
    }

    if (wantedPart.requester.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Unauthorized to delete this request.' });
      return;
    }

    await WantedPart.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Wanted request deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
