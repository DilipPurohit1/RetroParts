import express from 'express';
import {
  getStats,
  getAdminUsers,
  updateUserVerification,
  getAdminListings,
  updateListingStatus,
  getAdminReports,
  resolveReport,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin only middleware
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getAdminUsers);
router.get('/verifications', (req, res) => {
  req.query.verificationStatus = 'pending';
  return getAdminUsers(req, res);
});
router.put('/users/:userId/verify', updateUserVerification);
router.put('/verifications/:userId', updateUserVerification);
router.get('/listings', getAdminListings);
router.put('/listings/:listingId/status', updateListingStatus);
router.get('/reports', getAdminReports);
router.put('/reports/:reportId', resolveReport);
router.put('/reports/:reportId/resolve', resolveReport);

export default router;
