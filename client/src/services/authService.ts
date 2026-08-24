import API from './api.js';
import { IUser } from '../types/index.js';

export const authService = {
  register: async (userData: any): Promise<{ token: string; user: IUser }> => {
    const res = await API.post('/auth/register', userData);
    return res.data;
  },

  login: async (credentials: { email: string; password: string }): Promise<{ token: string; user: IUser }> => {
    const res = await API.post('/auth/login', credentials);
    return res.data;
  },

  getMe: async (): Promise<{ user: IUser }> => {
    const res = await API.get('/auth/me');
    return res.data;
  },

  updateProfile: async (profileData: any): Promise<{ user: IUser }> => {
    const res = await API.put('/auth/profile', profileData);
    return res.data;
  },

  requestSellerVerification: async (): Promise<any> => {
    const res = await API.post('/auth/verify-seller');
    return res.data;
  },
};
