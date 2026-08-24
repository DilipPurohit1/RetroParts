import { Request, Response } from 'express';
import { GarageVehicle, RestorationEntry } from '../models/Garage.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

// GET /api/v1/garage
export const getMyGarageVehicles = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.', errorCode: 'UNAUTHORIZED' });
      return;
    }

    const vehicles = await GarageVehicle.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json({ success: true, data: vehicles, vehicles });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, errorCode: 'SERVER_ERROR' });
  }
};

// POST /api/v1/garage
export const addGarageVehicle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.', errorCode: 'UNAUTHORIZED' });
      return;
    }

    const { make, model, year, variant, nickname, registrationNumber, vin, currentOdometerKm, status, coverPhoto, photos } = req.body;

    if (!make || !model || !year) {
      res.status(400).json({ success: false, message: 'Make, model, and year are required.', errorCode: 'INVALID_INPUT' });
      return;
    }

    const vehicle = await GarageVehicle.create({
      userId: req.user._id,
      make,
      model,
      year: Number(year),
      variant: variant || 'Standard',
      nickname: nickname || `${year} ${make} ${model}`,
      registrationNumber: registrationNumber || '',
      vin: vin || '',
      currentOdometerKm: Number(currentOdometerKm) || 0,
      status: status || 'in_restoration',
      coverPhoto: coverPhoto || (photos?.[0] || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80'),
      photos: photos || [],
      totalRestorationSpend: 0,
    });

    res.status(201).json({ success: true, message: 'Vehicle added to My Garage.', vehicle, data: vehicle });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, errorCode: 'SERVER_ERROR' });
  }
};

// GET /api/v1/garage/:id
export const getGarageVehicleDetail = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.', errorCode: 'UNAUTHORIZED' });
      return;
    }

    const vehicle = await GarageVehicle.findOne({ _id: req.params.id, userId: req.user._id });
    if (!vehicle) {
      res.status(404).json({ success: false, message: 'Garage vehicle not found.', errorCode: 'NOT_FOUND' });
      return;
    }

    const entries = await RestorationEntry.find({ garageVehicleId: vehicle._id }).sort({ date: -1 });

    res.json({
      success: true,
      vehicle,
      entries,
      data: {
        vehicle,
        entries,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, errorCode: 'SERVER_ERROR' });
  }
};

// PATCH /api/v1/garage/:id
export const updateGarageVehicle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.', errorCode: 'UNAUTHORIZED' });
      return;
    }

    const vehicle = await GarageVehicle.findOne({ _id: req.params.id, userId: req.user._id });
    if (!vehicle) {
      res.status(404).json({ success: false, message: 'Garage vehicle not found.', errorCode: 'NOT_FOUND' });
      return;
    }

    const { make, model, year, variant, nickname, registrationNumber, vin, currentOdometerKm, status, coverPhoto, photos } = req.body;

    if (make) vehicle.make = make;
    if (model) vehicle.model = model;
    if (year) vehicle.year = Number(year);
    if (variant) vehicle.variant = variant;
    if (nickname) vehicle.nickname = nickname;
    if (registrationNumber !== undefined) vehicle.registrationNumber = registrationNumber;
    if (vin !== undefined) vehicle.vin = vin;
    if (currentOdometerKm !== undefined) vehicle.currentOdometerKm = Number(currentOdometerKm);
    if (status) vehicle.status = status;
    if (coverPhoto) vehicle.coverPhoto = coverPhoto;
    if (photos) vehicle.photos = photos;

    await vehicle.save();

    res.json({ success: true, message: 'Garage vehicle updated.', vehicle, data: vehicle });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, errorCode: 'SERVER_ERROR' });
  }
};

// DELETE /api/v1/garage/:id
export const deleteGarageVehicle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.', errorCode: 'UNAUTHORIZED' });
      return;
    }

    const vehicle = await GarageVehicle.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!vehicle) {
      res.status(404).json({ success: false, message: 'Garage vehicle not found.', errorCode: 'NOT_FOUND' });
      return;
    }

    await RestorationEntry.deleteMany({ garageVehicleId: req.params.id });

    res.json({ success: true, message: 'Garage vehicle removed.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, errorCode: 'SERVER_ERROR' });
  }
};

// POST /api/v1/garage/:id/entries (Log a restoration milestone / spend)
export const addRestorationEntry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.', errorCode: 'UNAUTHORIZED' });
      return;
    }

    const vehicle = await GarageVehicle.findOne({ _id: req.params.id, userId: req.user._id });
    if (!vehicle) {
      res.status(404).json({ success: false, message: 'Garage vehicle not found.', errorCode: 'NOT_FOUND' });
      return;
    }

    const { title, description, category, cost, date, odometerKm, partListingId, photos } = req.body;

    if (!title) {
      res.status(400).json({ success: false, message: 'Entry title is required.', errorCode: 'INVALID_INPUT' });
      return;
    }

    const entryCost = Number(cost) || 0;

    const entry = await RestorationEntry.create({
      garageVehicleId: vehicle._id,
      userId: req.user._id,
      title,
      description: description || '',
      category: category || 'general',
      cost: entryCost,
      date: date ? new Date(date) : new Date(),
      odometerKm: odometerKm ? Number(odometerKm) : undefined,
      partListingId: partListingId || undefined,
      photos: photos || [],
    });

    // Update vehicle total restoration spend
    vehicle.totalRestorationSpend = (vehicle.totalRestorationSpend || 0) + entryCost;
    if (odometerKm && Number(odometerKm) > (vehicle.currentOdometerKm || 0)) {
      vehicle.currentOdometerKm = Number(odometerKm);
    }
    await vehicle.save();


    res.status(201).json({ success: true, message: 'Restoration log entry added.', entry, data: entry });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, errorCode: 'SERVER_ERROR' });
  }
};
