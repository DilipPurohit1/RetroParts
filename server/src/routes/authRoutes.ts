import express from 'express';
import passport from 'passport';
import {
  register,
  login,
  handleGoogleCallback,
  googleDirectLogin,
  refreshTokenHandler,
  logout,
  getMe,
  updateProfile,
  requestSellerVerification,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google-direct', googleDirectLogin);
router.post('/refresh', refreshTokenHandler);
router.post('/logout', logout);

// Google OAuth 2.0 routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login?error=google_auth_failed' }),
  handleGoogleCallback
);

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/verify-seller', protect, requestSellerVerification);

export default router;
