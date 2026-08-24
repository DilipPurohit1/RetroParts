import express from 'express';
import {
  getPassportByListingId,
  savePassport,
  reviewPassport,
} from '../controllers/passportController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:listingId', getPassportByListingId);
router.post('/:listingId', protect, savePassport);
router.patch('/:listingId', protect, requireRole('admin'), reviewPassport);

export default router;
