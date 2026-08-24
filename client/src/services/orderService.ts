import API from './api.js';
import { IOrder, IReview, INotification } from '../types/index.js';

export const orderService = {
  createOrder: async (orderData: any): Promise<IOrder> => {
    const res = await API.post('/orders', orderData);
    return res.data.data;
  },

  getMyOrders: async (): Promise<IOrder[]> => {
    const res = await API.get('/orders/my-orders');
    return res.data.data;
  },

  getOrderById: async (id: string): Promise<IOrder> => {
    const res = await API.get(`/orders/${id}`);
    return res.data.data;
  },

  getSellerOrders: async (): Promise<IOrder[]> => {
    const res = await API.get('/orders/seller-orders');
    return res.data.data;
  },

  updateOrderStatus: async (id: string, updateData: any): Promise<IOrder> => {
    const res = await API.put(`/orders/${id}/status`, updateData);
    return res.data.data;
  },
};

export const chatService = {
  getConversations: async () => {
    const res = await API.get('/chat/conversations');
    return res.data.data;
  },

  getMessages: async (conversationId: string) => {
    const res = await API.get(`/chat/messages/${conversationId}`);
    return res.data.data;
  },

  sendMessage: async (data: { recipientId?: string; conversationId?: string; text: string; listingId?: string }) => {
    const res = await API.post('/chat/messages', data);
    return res.data;
  },

  markAsRead: async (conversationId: string) => {
    const res = await API.put(`/chat/conversations/${conversationId}/read`);
    return res.data;
  },
};

export const reviewService = {
  addReview: async (data: { sellerId: string; orderId?: string; listingId?: string; rating: number; comment: string }): Promise<IReview> => {
    const res = await API.post('/reviews', data);
    return res.data.data;
  },

  getSellerReviews: async (sellerId: string) => {
    const res = await API.get(`/reviews/seller/${sellerId}`);
    return res.data;
  },
};

export const notificationService = {
  getNotifications: async (): Promise<{ data: INotification[]; unreadCount: number }> => {
    const res = await API.get('/notifications');
    return res.data;
  },

  markAsRead: async (id: string) => {
    const res = await API.put(`/notifications/${id}/read`);
    return res.data;
  },

  markAllAsRead: async () => {
    const res = await API.put('/notifications/mark-all-read');
    return res.data;
  },
};

export const wishlistService = {
  getWishlist: async () => {
    const res = await API.get('/wishlist');
    return res.data.data;
  },

  addToWishlist: async (listingId: string) => {
    const res = await API.post('/wishlist', { listingId });
    return res.data;
  },

  removeFromWishlist: async (listingId: string) => {
    const res = await API.delete(`/wishlist/${listingId}`);
    return res.data;
  },
};
