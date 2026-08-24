import API from './api.js';
import { IListing } from '../types/index.js';

export interface ListingFilterParams {
  search?: string;
  brand?: string;
  model?: string;
  year?: string | number;
  category?: string;
  condition?: string;
  partType?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  verifiedOnly?: boolean;
  rarity?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export const listingService = {
  getListings: async (params: ListingFilterParams = {}) => {
    const res = await API.get('/listings', { params });
    return res.data;
  },

  getFeaturedListings: async (): Promise<IListing[]> => {
    const res = await API.get('/listings/featured');
    return res.data.data;
  },

  getListingById: async (id: string): Promise<{ data: IListing; similar: IListing[] }> => {
    const res = await API.get(`/listings/${id}`);
    return res.data;
  },

  createListing: async (listingData: any): Promise<IListing> => {
    const res = await API.post('/listings', listingData);
    return res.data.data;
  },

  updateListing: async (id: string, listingData: any): Promise<IListing> => {
    const res = await API.put(`/listings/${id}`, listingData);
    return res.data.data;
  },

  deleteListing: async (id: string): Promise<void> => {
    await API.delete(`/listings/${id}`);
  },

  reportListing: async (id: string, reportData: { reason: string; details: string }) => {
    const res = await API.post(`/listings/${id}/report`, reportData);
    return res.data;
  },

  getSellerListings: async (sellerId?: string): Promise<IListing[]> => {
    const url = sellerId ? `/listings/seller/${sellerId}` : '/listings/my-listings';
    const res = await API.get(url);
    return res.data.data;
  },

  aiIdentify: async (payload: { imageUrl?: string; hintQuery?: string; name?: string }) => {
    const res = await API.post('/listings/ai-identify', payload);
    return res.data.data || res.data.identification;
  },

  calculateQuality: async (listingData: any) => {
    const res = await API.post('/listings/calculate-quality', listingData);
    return res.data;
  },
};

