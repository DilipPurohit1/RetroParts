import API from './api.js';
import { IVehicle, ICategory } from '../types/index.js';

export const vehicleService = {
  getVehicles: async (params: { type?: string; popular?: boolean; search?: string } = {}): Promise<IVehicle[]> => {
    const res = await API.get('/vehicles', { params });
    return res.data.data;
  },

  getBrands: async (type?: string): Promise<string[]> => {
    const res = await API.get('/vehicles/brands', { params: { type } });
    return res.data.data;
  },

  getModelsByBrand: async (brand: string): Promise<IVehicle[]> => {
    const res = await API.get(`/vehicles/brand/${brand}/models`);
    return res.data.data;
  },

  checkCompatibility: async (data: {
    listingId: string;
    brand: string;
    model: string;
    year?: number | string;
    variant?: string;
  }) => {
    const res = await API.post('/vehicles/check-compatibility', data);
    return res.data;
  },

  getCategories: async (): Promise<ICategory[]> => {
    const res = await API.get('/categories');
    return res.data.data;
  },
};
