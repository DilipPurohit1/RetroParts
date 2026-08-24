import express from 'express';
import {
  getWantedParts,
  getWantedPartById,
  createWantedPart,
  submitOffer,
  updateWantedStatus,
  deleteWantedPart,
} from '../controllers/wantedController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getWantedParts);
router.get('/:id', getWantedPartById);
router.post('/', protect, createWantedPart);
router.post('/:id/offer', protect, submitOffer);
router.post('/:id/offers', protect, submitOffer);
router.put('/:id/status', protect, updateWantedStatus);
router.delete('/:id', protect, deleteWantedPart);

export default router;
