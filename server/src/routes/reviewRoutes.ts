import express from 'express';
import { addReview, getSellerReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/seller/:sellerId', getSellerReviews);
router.post('/', protect, addReview);

export default router;
