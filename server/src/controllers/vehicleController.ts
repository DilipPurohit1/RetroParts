import { Request, Response } from 'express';
import { Vehicle } from '../models/Vehicle.js';
import { Listing } from '../models/Listing.js';

export const getVehicles = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, popular, search } = req.query;
    const query: any = {};

    if (type && (type === 'car' || type === 'bike')) {
      query.type = type;
    }
    if (popular === 'true') {
      query.popular = true;
    }
    if (search && typeof search === 'string') {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [{ brand: searchRegex }, { model: searchRegex }];
    }

    const vehicles = await Vehicle.find(query).sort({ brand: 1, model: 1 });
    res.json({ success: true, data: vehicles });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBrands = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type } = req.query;
    const query: any = {};
    if (type && (type === 'car' || type === 'bike')) {
      query.type = type;
    }

    const brands = await Vehicle.distinct('brand', query);
    res.json({ success: true, data: brands.sort() });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getModelsByBrand = async (req: Request, res: Response): Promise<void> => {
  try {
    const { brand } = req.params;
    const vehicles = await Vehicle.find({ brand: new RegExp(`^${brand}$`, 'i') });

    res.json({ success: true, data: vehicles });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVehicleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      res.status(404).json({ success: false, message: 'Vehicle not found.', errorCode: 'NOT_FOUND' });
      return;
    }
    res.json({ success: true, data: vehicle });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, errorCode: 'SERVER_ERROR' });
  }
};


export const checkCompatibility = async (req: Request, res: Response): Promise<void> => {
  try {
    const { listingId, brand, model, year, variant } = req.body;

    if (!listingId) {
      res.status(400).json({ success: false, message: 'listingId is required.' });
      return;
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      res.status(404).json({ success: false, message: 'Listing not found.' });
      return;
    }

    const targetYear = Number(year);
    let isCompatible = false;
    let matchType = 'No Match';
    let details = '';

    // Direct brand & model match
    const isBrandMatch = listing.vehicleBrand.toLowerCase() === brand.toLowerCase();
    const isModelMatch = listing.vehicleModel.toLowerCase() === model.toLowerCase();

    if (isBrandMatch && isModelMatch) {
      isCompatible = true;
      matchType = 'Direct OEM Match';
      details = `Exact match for ${listing.vehicleBrand} ${listing.vehicleModel}`;
    } else {
      // Check multi-vehicle compatibility array
      const compMatch = listing.compatibleVehicles?.find(
        (c) =>
          c.brand.toLowerCase() === brand.toLowerCase() &&
          c.model.toLowerCase() === model.toLowerCase() &&
          (!targetYear || (targetYear >= c.yearFrom && targetYear <= c.yearTo))
      );

      if (compMatch) {
        isCompatible = true;
        matchType = 'Cross-Compatible Fitment';
        details = `Fits ${compMatch.brand} ${compMatch.model} (${compMatch.yearFrom}-${compMatch.yearTo})`;
      }
    }

    res.json({
      success: true,
      compatible: isCompatible,
      matchType,
      details,
      listing: {
        id: listing._id,
        title: listing.title,
        brand: listing.vehicleBrand,
        model: listing.vehicleModel,
        oemNumber: listing.oemNumber,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
