import api from './client';
import type { Order, PageResponse } from '../types';

export const ordersApi = {
  createOrder: async (shippingAddress: string, phone?: string, notes?: string): Promise<Order> => {
    const { data } = await api.post('/orders', { shippingAddress, phone, notes });
    return data;
  },

  getUserOrders: async (page = 0, size = 10): Promise<PageResponse<Order>> => {
    const { data } = await api.get(`/orders?page=${page}&size=${size}`);
    return data;
  },

  getOrderById: async (orderId: string): Promise<Order> => {
    const { data } = await api.get(`/orders/${orderId}`);
    return data;
  },

  // Admin endpoints
  getAllOrders: async (page = 0, size = 20): Promise<PageResponse<Order>> => {
    const { data } = await api.get(`/admin/orders?page=${page}&size=${size}`);
    return data;
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<Order> => {
    const { data } = await api.patch(`/admin/orders/${orderId}/status`, { status });
    return data;
  },
};
