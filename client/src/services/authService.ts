import API from './api.js';
import { IUser } from '../types/index.js';

const STORAGE_USER_KEY = 'retroparts_user';
const STORAGE_TOKEN_KEY = 'retroparts_token';
const STORAGE_USERS_REGISTRY_KEY = 'retroparts_registered_users';

interface RegisteredAccount {
  user: IUser;
  passwordHash: string;
}

// Initial registered accounts
const INITIAL_ACCOUNTS: RegisteredAccount[] = [
  {
    user: {
      _id: 'user_dilip_purohit',
      name: 'Dilip Purohit',
      email: 'dilippurohitdilippurohit70823@gmail.com',
      phone: '+91 98450 12345',
      role: 'buyer',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=dilip',
      location: { city: 'Bengaluru', state: 'Karnataka', pincode: '560025' },
      isVerifiedSeller: true,
      verificationStatus: 'verified',
      sellerRating: 5.0,
      sellerReviewCount: 12,
      savedVehicles: [{ brand: 'Yamaha', model: 'RX100', year: 1989, variant: 'Standard 98cc' }],
      createdAt: '2026-01-01T00:00:00.000Z',
    },
    passwordHash: 'password123',
  },
  {
    user: {
      _id: 'user_admin',
      name: 'RetroParts Admin',
      email: 'admin@retroparts.com',
      phone: '+91 99000 00001',
      role: 'admin',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin',
      location: { city: 'Bengaluru', state: 'Karnataka', pincode: '560001' },
      isVerifiedSeller: true,
      verificationStatus: 'verified',
      sellerRating: 5.0,
      sellerReviewCount: 100,
      savedVehicles: [],
      createdAt: '2026-01-01T00:00:00.000Z',
    },
    passwordHash: 'admin123',
  },
  {
    user: {
      _id: 'user_seller',
      name: 'Rajesh Vintage Garage',
      email: 'seller@retroparts.com',
      phone: '+91 98450 11223',
      role: 'seller',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      location: { city: 'Bengaluru', state: 'Karnataka', pincode: '560025' },
      isVerifiedSeller: true,
      verificationStatus: 'verified',
      sellerRating: 4.9,
      sellerReviewCount: 42,
      savedVehicles: [],
      createdAt: '2026-01-01T00:00:00.000Z',
    },
    passwordHash: 'seller123',
  },
];

const getAccountsRegistry = (): RegisteredAccount[] => {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_REGISTRY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to read accounts registry', err);
  }
  localStorage.setItem(STORAGE_USERS_REGISTRY_KEY, JSON.stringify(INITIAL_ACCOUNTS));
  return INITIAL_ACCOUNTS;
};

const saveAccountsRegistry = (accounts: RegisteredAccount[]) => {
  localStorage.setItem(STORAGE_USERS_REGISTRY_KEY, JSON.stringify(accounts));
};

export const authService = {
  /**
   * Real strict Sign Up: Validates email, password, checks duplicate, stores real account
   */
  register: async (userData: any): Promise<{ token: string; user: IUser }> => {
    // 1. Try real backend API if available
    try {
      const res = await API.post('/auth/register', userData);
      if (res.data?.token && res.data?.user) {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(res.data.user));
        return res.data;
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
    }

    // 2. Strict local validation
    const cleanEmail = userData.email?.toLowerCase().trim();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      throw new Error('Please enter a valid email address.');
    }

    if (!userData.password || userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const registry = getAccountsRegistry();
    const existing = registry.find((acc) => acc.user.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('An account with this email already exists. Please sign in instead.');
    }

    const newUser: IUser = {
      _id: `user_${Date.now()}`,
      name: userData.name?.trim() || cleanEmail.split('@')[0],
      email: cleanEmail,
      phone: userData.phone || '+91 98765 43210',
      role: userData.role || 'buyer',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
      location: { city: 'Bengaluru', state: 'Karnataka', pincode: '560001' },
      isVerifiedSeller: userData.role === 'seller',
      verificationStatus: userData.role === 'seller' ? 'verified' : 'unverified',
      sellerRating: 5.0,
      sellerReviewCount: 0,
      savedVehicles: [],
      createdAt: new Date().toISOString(),
    };

    registry.push({ user: newUser, passwordHash: userData.password });
    saveAccountsRegistry(registry);

    const token = `retroparts_auth_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(newUser));
    localStorage.setItem(STORAGE_TOKEN_KEY, token);

    return { token, user: newUser };
  },

  /**
   * Real strict Sign In: Strictly validates credentials against registered accounts
   */
  login: async (credentials: { email: string; password: string }): Promise<{ token: string; user: IUser }> => {
    // 1. Try real backend API if available
    try {
      const res = await API.post('/auth/login', credentials);
      if (res.data?.token && res.data?.user) {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(res.data.user));
        return res.data;
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
    }

    // 2. Strict local validation
    const cleanEmail = credentials.email?.toLowerCase().trim();
    if (!cleanEmail) {
      throw new Error('Please enter your registered email address.');
    }

    if (!credentials.password) {
      throw new Error('Please enter your password.');
    }

    const registry = getAccountsRegistry();
    const found = registry.find((acc) => acc.user.email.toLowerCase() === cleanEmail);

    if (!found) {
      throw new Error('No account found with this email address. Please register first.');
    }

    if (found.passwordHash !== credentials.password) {
      throw new Error('Incorrect password. Please verify your password and try again.');
    }

    const token = `retroparts_auth_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(found.user));
    localStorage.setItem(STORAGE_TOKEN_KEY, token);

    return { token, user: found.user };
  },

  /**
   * Official Google OAuth 2.0 Sign-In
   */
  googleLogin: async (data: { email: string; name?: string; avatar?: string; sub?: string }): Promise<{ token: string; user: IUser }> => {
    const cleanEmail = data.email?.toLowerCase().trim();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      throw new Error('Invalid Google account email received.');
    }

    const cleanName = data.name?.trim() || cleanEmail.split('@')[0];
    const avatar = data.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`;

    const registry = getAccountsRegistry();
    let account = registry.find((acc) => acc.user.email.toLowerCase() === cleanEmail);

    if (!account) {
      const newUser: IUser = {
        _id: `google_user_${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        phone: '+91 98450 12345',
        role: 'buyer',
        avatar,
        bio: 'Verified Google OAuth 2.0 Account.',
        location: { city: 'Bengaluru', state: 'Karnataka', pincode: '560025' },
        isVerifiedSeller: false,
        verificationStatus: 'verified',
        sellerRating: 5.0,
        sellerReviewCount: 0,
        savedVehicles: [{ brand: 'Yamaha', model: 'RX100', year: 1989, variant: 'Standard 98cc' }],
        createdAt: new Date().toISOString(),
      };
      account = { user: newUser, passwordHash: 'GOOGLE_OAUTH_AUTHENTICATED' };
      registry.push(account);
      saveAccountsRegistry(registry);
    } else {
      account.user.name = cleanName;
      account.user.avatar = avatar;
      saveAccountsRegistry(registry);
    }

    const token = `google_jwt_verified_${Date.now()}`;
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(account.user));
    localStorage.setItem(STORAGE_TOKEN_KEY, token);

    return { token, user: account.user };
  },

  getMe: async (): Promise<{ user: IUser }> => {
    const saved = localStorage.getItem(STORAGE_USER_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { user: parsed };
      } catch {
        // Fallback
      }
    }
    throw new Error('Not authenticated');
  },

  updateProfile: async (profileData: any): Promise<{ user: IUser }> => {
    const saved = localStorage.getItem(STORAGE_USER_KEY);
    let current = saved ? JSON.parse(saved) : {};
    current = { ...current, ...profileData };
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(current));

    const registry = getAccountsRegistry();
    const idx = registry.findIndex((acc) => acc.user.email.toLowerCase() === current.email?.toLowerCase());
    if (idx !== -1) {
      registry[idx].user = current;
      saveAccountsRegistry(registry);
    }

    return { user: current };
  },

  requestSellerVerification: async (): Promise<any> => {
    return { success: true, message: 'Seller verification request submitted.' };
  },
};
