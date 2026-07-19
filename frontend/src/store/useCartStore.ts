import { create } from 'zustand';
import type { CartItem } from '../types';

interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  isCartOpen: boolean;
  setCart: (items: CartItem[], totalAmount: number, totalItems: number) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  clearLocalCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  totalAmount: 0,
  totalItems: 0,
  isCartOpen: false,

  setCart: (items, totalAmount, totalItems) =>
    set({ items, totalAmount, totalItems }),

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  clearLocalCart: () => set({ items: [], totalAmount: 0, totalItems: 0 }),
}));
