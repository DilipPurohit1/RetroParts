import API from './api.js';
import { IWantedPart } from '../types/index.js';

export const wantedService = {
  getWantedParts: async (params: any = {}) => {
    const res = await API.get('/wanted', { params });
    return res.data;
  },

  getWantedPartById: async (id: string): Promise<IWantedPart> => {
    const res = await API.get(`/wanted/${id}`);
    return res.data.data;
  },

  createWantedPart: async (data: any): Promise<IWantedPart> => {
    const res = await API.post('/wanted', data);
    return res.data.data;
  },

  submitOffer: async (
    wantedPartId: string,
    offerData: { offerPrice: number; message: string; listingId?: string; contactNumber?: string }
  ) => {
    const res = await API.post(`/wanted/${wantedPartId}/offer`, offerData);
    return res.data.data;
  },

  updateStatus: async (wantedPartId: string, status: string) => {
    const res = await API.put(`/wanted/${wantedPartId}/status`, { status });
    return res.data.data;
  },

  deleteWantedPart: async (id: string) => {
    const res = await API.delete(`/wanted/${id}`);
    return res.data;
  },
};
