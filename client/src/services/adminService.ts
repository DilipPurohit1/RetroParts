import API from './api.js';

export const adminService = {
  getStats: async () => {
    const res = await API.get('/admin/stats');
    return res.data.data;
  },

  getUsers: async (params: any = {}) => {
    const res = await API.get('/admin/users', { params });
    return res.data.data;
  },

  updateUserVerification: async (userId: string, data: { status?: string; isVerifiedSeller?: boolean }) => {
    const res = await API.put(`/admin/users/${userId}/verify`, data);
    return res.data;
  },

  getListings: async (params: any = {}) => {
    const res = await API.get('/admin/listings', { params });
    return res.data.data;
  },

  updateListingStatus: async (listingId: string, data: { status?: string; featured?: boolean }) => {
    const res = await API.put(`/admin/listings/${listingId}/status`, data);
    return res.data;
  },

  getReports: async () => {
    const res = await API.get('/admin/reports');
    return res.data.data;
  },

  resolveReport: async (reportId: string, data: { status: string; takeDownListing?: boolean }) => {
    const res = await API.put(`/admin/reports/${reportId}`, data);
    return res.data;
  },
};
