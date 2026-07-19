import api from './client';
import type { Cart } from '../types';

export const cartApi = {
  getCart: async (): Promise<Cart> => {
    const { data } = await api.get('/cart');
    return data;
  },

  addItem: async (productId: string, quantity: number = 1, variantId?: string): Promise<Cart> => {
    const { data } = await api.post('/cart/items', { productId, quantity, variantId });
    return data;
  },

  updateItemQuantity: async (itemId: string, quantity: number): Promise<Cart> => {
    const { data } = await api.put(`/cart/items/${itemId}?quantity=${quantity}`);
    return data;
  },

  removeItem: async (itemId: string): Promise<Cart> => {
    const { data } = await api.delete(`/cart/items/${itemId}`);
    return data;
  },

  clearCart: async (): Promise<void> => {
    await api.delete('/cart');
  },
};
