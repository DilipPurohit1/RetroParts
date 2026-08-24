import { Request, Response } from 'express';
import { Listing, IListing } from '../models/Listing.js';
import { Category } from '../models/Category.js';
import { Report } from '../models/Report.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { checkAndNotifyWantedMatches } from '../services/matchingService.js';

export const getListings = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search,
      brand,
      model,
      year,
      category,
      condition,
      partType,
      minPrice,
      maxPrice,
      location,
      verifiedOnly,
      rarity,
      sort = 'newest',
      page = 1,
      limit = 12,
    } = req.query;

    const andConditions: any[] = [{ status: 'active' }];

    // Multi-token intelligent search
    if (search && typeof search === 'string' && search.trim() !== '') {
      const words = search.trim().split(/\s+/).filter(Boolean);
      words.forEach((word) => {
        const escaped = word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        const regex = new RegExp(escaped, 'i');
        andConditions.push({
          $or: [
            { title: { $regex: regex } },
            { description: { $regex: regex } },
            { oemNumber: { $regex: regex } },
            { vehicleBrand: { $regex: regex } },
            { vehicleModel: { $regex: regex } },
            { vehicleVariant: { $regex: regex } },
            { categoryName: { $regex: regex } },
            { condition: { $regex: regex } },
            { rarity: { $regex: regex } },
            { partType: { $regex: regex } },
            { 'location.city': { $regex: regex } },
            { 'location.state': { $regex: regex } },
          ],
        });
      });
    }

    // Vehicle Brand
    if (brand && typeof brand === 'string' && brand !== 'all' && brand !== '') {
      const brandRegex = new RegExp(`^${brand}$`, 'i');
      andConditions.push({
        $or: [
          { vehicleBrand: { $regex: brandRegex } },
          { 'compatibleVehicles.brand': { $regex: brandRegex } },
        ],
      });
    }

    // Vehicle Model
    if (model && typeof model === 'string' && model !== 'all' && model !== '') {
      const modelRegex = new RegExp(model.trim(), 'i');
      andConditions.push({
        $or: [
          { vehicleModel: { $regex: modelRegex } },
          { 'compatibleVehicles.model': { $regex: modelRegex } },
        ],
      });
    }

    // Vehicle Year
    if (year && !isNaN(Number(year))) {
      const targetYear = Number(year);
      andConditions.push({
        $or: [
          { vehicleYear: targetYear },
          { 'compatibleVehicles.yearFrom': { $lte: targetYear }, 'compatibleVehicles.yearTo': { $gte: targetYear } },
        ],
      });
    }

    // Category
    if (category && typeof category === 'string' && category !== 'all' && category !== '') {
      andConditions.push({ categoryName: { $regex: new RegExp(category, 'i') } });
    }

    // Condition
    if (condition && typeof condition === 'string' && condition !== 'all' && condition !== '') {
      andConditions.push({ condition });
    }

    // Part Type
    if (partType && typeof partType === 'string' && partType !== 'all' && partType !== '') {
      andConditions.push({ partType });
    }

    // Rarity
    if (rarity && typeof rarity === 'string' && rarity !== 'all' && rarity !== '') {
      andConditions.push({ rarity });
    }

    // Price Range
    if (minPrice || maxPrice) {
      const priceFilter: any = {};
      if (minPrice) priceFilter.$gte = Number(minPrice);
      if (maxPrice) priceFilter.$lte = Number(maxPrice);
      andConditions.push({ price: priceFilter });
    }

    // Location
    if (location && typeof location === 'string' && location.trim() !== '') {
      const locRegex = new RegExp(location.trim(), 'i');
      andConditions.push({
        $or: [
          { 'location.city': { $regex: locRegex } },
          { 'location.state': { $regex: locRegex } },
        ],
      });
    }

    const query = andConditions.length > 1 ? { $and: andConditions } : andConditions[0];

    // Sort order
    let sortOptions: any = { createdAt: -1 };
    if (sort === 'price_asc') sortOptions = { price: 1 };
    else if (sort === 'price_desc') sortOptions = { price: -1 };
    else if (sort === 'popular') sortOptions = { views: -1 };
    else if (sort === 'newest') sortOptions = { createdAt: -1 };

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    let listingsQuery = Listing.find(query)
      .populate('seller', 'name avatar sellerRating sellerReviewCount isVerifiedSeller verificationStatus location phone')
      .populate('category', 'name slug icon')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const listings = await listingsQuery;
    const total = await Listing.countDocuments(query);

    // Filter verified seller if requested
    let filteredListings = listings;
    if (verifiedOnly === 'true') {
      filteredListings = listings.filter((l: any) => l.seller?.isVerifiedSeller === true);
    }

    res.json({
      success: true,
      data: filteredListings,
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

export const getFeaturedListings = async (req: Request, res: Response): Promise<void> => {
  try {
    const featured = await Listing.find({ status: 'active', featured: true })
      .populate('seller', 'name avatar sellerRating isVerifiedSeller location')
      .limit(8);

    res.json({
      success: true,
      data: featured,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getListingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('seller', 'name email phone avatar bio sellerRating sellerReviewCount isVerifiedSeller verificationStatus location createdAt')
      .populate('category', 'name slug icon');

    if (!listing) {
      res.status(404).json({ success: false, message: 'Listing not found.' });
      return;
    }

    // Increment view count asynchronously
    listing.views = (listing.views || 0) + 1;
    await listing.save();

    // Fetch similar parts
    const similarParts = await Listing.find({
      _id: { $ne: listing._id },
      status: 'active',
      $or: [
        { vehicleBrand: listing.vehicleBrand },
        { categoryName: listing.categoryName },
      ],
    })
      .populate('seller', 'name avatar sellerRating isVerifiedSeller')
      .limit(4);

    res.json({
      success: true,
      data: listing,
      similar: similarParts,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createListing = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const {
      title,
      description,
      categoryId,
      categoryName,
      vehicleBrand,
      vehicleModel,
      vehicleYear,
      vehicleVariant,
      compatibleVehicles,
      oemNumber,
      condition,
      partType,
      price,
      quantity,
      negotiable,
      location,
      images,
      rarity,
      shippingAvailable,
      shippingCost,
    } = req.body;

    if (!title || !description || !vehicleBrand || !vehicleModel || !price || !images || images.length === 0) {
      res.status(400).json({ success: false, message: 'Missing required listing information.' });
      return;
    }

    // Find or resolve category
    let resolvedCategory = categoryId;
    let resolvedCategoryName = categoryName;

    if (!resolvedCategory && categoryName) {
      const cat = await Category.findOne({
        $or: [
          { name: new RegExp(`^${categoryName}$`, 'i') },
          { name: new RegExp(categoryName, 'i') },
          { slug: new RegExp(categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-'), 'i') },
        ],
      });
      if (cat) {
        resolvedCategory = cat._id;
        resolvedCategoryName = cat.name;
      }
    } else if (resolvedCategory && !resolvedCategoryName) {
      const cat = await Category.findById(resolvedCategory);
      if (cat) resolvedCategoryName = cat.name;
    }

    if (!resolvedCategory) {
      const firstCat = await Category.findOne();
      if (firstCat) {
        resolvedCategory = firstCat._id;
        resolvedCategoryName = resolvedCategoryName || firstCat.name;
      }
    }

    const listing = await Listing.create({
      title,
      description,
      category: resolvedCategory,
      categoryName: resolvedCategoryName || categoryName || 'General Parts',
      vehicleBrand,
      vehicleModel,
      vehicleYear: vehicleYear || 'All Years',
      vehicleVariant: vehicleVariant || 'Standard',
      compatibleVehicles: compatibleVehicles || [
        {
          brand: vehicleBrand,
          model: vehicleModel,
          yearFrom: typeof vehicleYear === 'number' ? vehicleYear : 1980,
          yearTo: typeof vehicleYear === 'number' ? vehicleYear : 2010,
          variant: vehicleVariant || 'All Variants',
        },
      ],
      oemNumber: oemNumber || '',
      condition: condition || 'Used - Grade A',
      partType: partType || 'OEM Original',
      price: Number(price),
      quantity: Number(quantity) || 1,
      negotiable: Boolean(negotiable),
      location: location || req.user.location || { city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
      images: Array.isArray(images) ? images : [images],
      seller: req.user._id,
      rarity: rarity || 'Rare Find',
      shippingAvailable: shippingAvailable !== undefined ? Boolean(shippingAvailable) : true,
      shippingCost: Number(shippingCost) || 0,
      status: 'active',
    });

    // Increment category partCount
    if (resolvedCategory) {
      await Category.findByIdAndUpdate(resolvedCategory, { $inc: { partCount: 1 } });
    }

    // Trigger smart matching service for wanted requests
    checkAndNotifyWantedMatches(listing).catch((err) => console.error('Matching trigger failed:', err));

    res.status(201).json({
      success: true,
      message: 'Listing published successfully.',
      data: listing,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateListing = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      res.status(404).json({ success: false, message: 'Listing not found.' });
      return;
    }

    // Verify ownership or admin
    if (listing.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Unauthorized to update this listing.' });
      return;
    }

    Object.assign(listing, req.body);
    await listing.save();

    res.json({
      success: true,
      message: 'Listing updated successfully.',
      data: listing,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteListing = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      res.status(404).json({ success: false, message: 'Listing not found.' });
      return;
    }

    if (listing.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Unauthorized to delete this listing.' });
      return;
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Listing removed successfully.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const reportListing = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Must be logged in to report a listing.' });
      return;
    }

    const { reason, details } = req.body;
    const listingId = req.params.id;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      res.status(404).json({ success: false, message: 'Listing not found.' });
      return;
    }

    const report = await Report.create({
      listing: listingId,
      reporter: req.user._id,
      reason,
      details: details || '',
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Thank you. The listing report has been submitted to our moderation team.',
      reportId: report._id,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

import { identifyVintagePartFromImage } from '../services/aiPartIdentifier.js';

export const computeListingQualityScore = (listing: any): { score: number; tips: string[] } => {
  let score = 0;
  const tips: string[] = [];

  // 1. Title: specific, >= 15 chars (+15)
  if (listing.title && listing.title.length >= 15) {
    score += 15;
  } else {
    tips.push('Provide a descriptive title including brand, model, and part name (+15 pts)');
  }

  // 2. Description: detailed, >= 20 words (+15)
  const wordCount = listing.description ? listing.description.trim().split(/\s+/).length : 0;
  if (wordCount >= 20) {
    score += 15;
  } else {
    tips.push('Add detailed notes on component condition, wear, or storage history (+15 pts)');
  }

  // 3. Exact OEM number (+20)
  if (listing.oemNumber && listing.oemNumber.trim().length >= 3) {
    score += 20;
  } else {
    tips.push('Add the manufacturer OEM part number stamped on the component (+20 pts)');
  }

  // 4. Imagery (>= 2 images) (+20)
  if (listing.images && listing.images.length >= 2) {
    score += 20;
  } else {
    tips.push('Upload at least 2 clear photos of the physical part from multiple angles (+20 pts)');
  }

  // 5. Fitment compatibility matrix (+15)
  if (listing.compatibleVehicles && listing.compatibleVehicles.length > 0) {
    score += 15;
  } else {
    tips.push('Explicitly specify compatible vehicle makes, models, and year ranges (+15 pts)');
  }

  // 6. Provenance / Part Passport (+15)
  if (listing.verificationStatus && listing.verificationStatus !== 'unverified') {
    score += 15;
  } else {
    tips.push('Submit Part Passport provenance documentation to unlock maximum buyer trust (+15 pts)');
  }

  return { score: Math.min(100, Math.max(10, score)), tips };
};

// POST /api/v1/listings/ai-identify
export const aiIdentifyListingPart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { imageUrl, hintQuery, name } = req.body;
    const query = imageUrl || hintQuery || name || '';

    const result = await identifyVintagePartFromImage(query, hintQuery);

    res.json({
      success: true,
      data: result,
      identification: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/v1/listings/calculate-quality
export const calculateQualityScore = async (req: Request, res: Response): Promise<void> => {
  try {
    const quality = computeListingQualityScore(req.body);
    res.json({
      success: true,
      score: quality.score,
      tips: quality.tips,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/v1/listings/price-estimate
export const getPriceEstimate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { brand, model, category, condition, partType } = req.query;

    const query: any = {};
    if (brand) query.vehicleBrand = new RegExp(`^${brand}$`, 'i');
    if (model) query.vehicleModel = new RegExp(`^${model}$`, 'i');
    if (category) query.categoryName = new RegExp(`^${category}$`, 'i');
    if (condition) query.condition = condition;

    const matches = await Listing.find(query).select('price condition rarity status');

    if (matches.length > 0) {
      const prices = matches.map((m) => m.price).sort((a, b) => a - b);
      const sum = prices.reduce((acc, p) => acc + p, 0);
      const avg = Math.round(sum / prices.length);
      const min = prices[0];
      const max = prices[prices.length - 1];
      const median = prices[Math.floor(prices.length / 2)];

      res.json({
        success: true,
        data: {
          averagePrice: avg,
          medianPrice: median,
          fairRangeLow: Math.round(avg * 0.85),
          fairRangeHigh: Math.round(avg * 1.15),
          minRecordedPrice: min,
          maxRecordedPrice: max,
          sampleSize: matches.length,
          confidence: matches.length >= 5 ? 'high' : matches.length >= 2 ? 'moderate' : 'estimated',
          valuationTrend: 'appreciating',
          rarityDemand: 'high',
        },
      });
      return;
    }

    // Default fallback estimates for rare vintage items
    res.json({
      success: true,
      data: {
        averagePrice: 4800,
        medianPrice: 4500,
        fairRangeLow: 3800,
        fairRangeHigh: 5800,
        minRecordedPrice: 3200,
        maxRecordedPrice: 6500,
        sampleSize: 1,
        confidence: 'estimated',
        valuationTrend: 'appreciating',
        rarityDemand: 'high',
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/v1/listings/seller/:sellerId or /api/v1/listings/my-listings
export const getSellerListings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sellerId = req.params.sellerId || req.user?._id;
    if (!sellerId) {
      res.status(400).json({ success: false, message: 'Seller ID is required.' });
      return;
    }

    const listings = await Listing.find({ seller: sellerId })
      .populate('category', 'name slug icon')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: listings,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};






