import express from 'express';
import {
  getListings,
  getFeaturedListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  reportListing,
  getSellerListings,
  aiIdentifyListingPart,
  calculateQualityScore,
  getPriceEstimate,
} from '../controllers/listingController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getListings);
router.get('/featured', getFeaturedListings);
router.get('/price-estimate', getPriceEstimate);
router.get('/seller/:sellerId', optionalAuth, getSellerListings);
router.get('/my-listings', protect, getSellerListings);
router.post('/ai-identify', aiIdentifyListingPart);
router.post('/calculate-quality', calculateQualityScore);
router.get('/:id', getListingById);


router.post('/', protect, createListing);
router.put('/:id', protect, updateListing);
router.delete('/:id', protect, deleteListing);
router.post('/:id/report', protect, reportListing);

export default router;

