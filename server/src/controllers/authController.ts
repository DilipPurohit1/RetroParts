import { Request, Response } from 'express';
import { User, IUser } from '../models/User.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import {
  generateTokens,
  verifyRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from '../utils/tokenUtils.js';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone, role, city, state, pincode } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || '',
      role: role || 'buyer',
      authProvider: 'local',
      location: {
        city: city || '',
        state: state || '',
        pincode: pincode || '',
      },
    });

    const { accessToken, refreshToken } = generateTokens(user._id.toString(), user.role);
    setRefreshTokenCookie(res, refreshToken);

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token: accessToken,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        isVerifiedSeller: user.isVerifiedSeller,
        verificationStatus: user.verificationStatus,
        sellerRating: user.sellerRating,
        sellerReviewCount: user.sellerReviewCount,
        savedVehicles: user.savedVehicles || [],
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Registration failed.' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    // Check password if set
    if (!user.password && user.googleId) {
      res.status(400).json({
        success: false,
        message: 'This account is signed in with Google. Please use Google Sign-In.',
      });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const { accessToken, refreshToken } = generateTokens(user._id.toString(), user.role);
    setRefreshTokenCookie(res, refreshToken);

    res.json({
      success: true,
      message: 'Login successful.',
      token: accessToken,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        isVerifiedSeller: user.isVerifiedSeller,
        verificationStatus: user.verificationStatus,
        sellerRating: user.sellerRating,
        sellerReviewCount: user.sellerReviewCount,
        savedVehicles: user.savedVehicles || [],
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Login failed.' });
  }
};

export const handleGoogleCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    if (!user) {
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=google_auth_failed`);
      return;
    }

    const { accessToken, refreshToken } = generateTokens(user._id.toString(), user.role);
    setRefreshTokenCookie(res, refreshToken);

    // Redirect to client OAuth callback handler
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${clientUrl}/auth/google/callback?token=${accessToken}`);
  } catch (error) {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${clientUrl}/login?error=google_auth_failed`);
  }
};

export const refreshTokenHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies?.retroparts_refresh_token || req.body?.refreshToken;

    if (!token) {
      res.status(401).json({ success: false, message: 'No refresh token provided.' });
      return;
    }

    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch {
      clearRefreshTokenCookie(res);
      res.status(401).json({ success: false, message: 'Invalid or expired refresh token.' });
      return;
    }

    const user = await User.findById(payload.id);
    if (!user) {
      clearRefreshTokenCookie(res);
      res.status(401).json({ success: false, message: 'User belonging to token no longer exists.' });
      return;
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id.toString(), user.role);
    setRefreshTokenCookie(res, newRefreshToken);

    res.json({
      success: true,
      token: accessToken,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        isVerifiedSeller: user.isVerifiedSeller,
        verificationStatus: user.verificationStatus,
        sellerRating: user.sellerRating,
        sellerReviewCount: user.sellerReviewCount,
        savedVehicles: user.savedVehicles || [],
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  clearRefreshTokenCookie(res);
  res.json({ success: true, message: 'Logged out successfully.' });
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role,
        avatar: req.user.avatar,
        bio: req.user.bio,
        location: req.user.location,
        isVerifiedSeller: req.user.isVerifiedSeller,
        verificationStatus: req.user.verificationStatus,
        sellerRating: req.user.sellerRating,
        sellerReviewCount: req.user.sellerReviewCount,
        savedVehicles: req.user.savedVehicles || [],
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { name, phone, bio, avatar, location, savedVehicles } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;
    if (savedVehicles) user.savedVehicles = savedVehicles;
    if (location) {
      user.location = {
        city: location.city ?? user.location.city,
        state: location.state ?? user.location.state,
        pincode: location.pincode ?? user.location.pincode,
      };
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        isVerifiedSeller: user.isVerifiedSeller,
        verificationStatus: user.verificationStatus,
        sellerRating: user.sellerRating,
        sellerReviewCount: user.sellerReviewCount,
        savedVehicles: user.savedVehicles || [],
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const requestSellerVerification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    user.verificationStatus = 'pending';
    if (user.role === 'buyer') {
      user.role = 'seller';
    }
    await user.save();

    res.json({
      success: true,
      message: 'Verification request submitted for admin review.',
      verificationStatus: user.verificationStatus,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
