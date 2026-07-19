import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import CartDrawer from '../../features/cart/CartDrawer';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { cartApi } from '../../api/cart';

export default function Layout() {
  const { isAuthenticated } = useAuthStore();
  const { setCart, clearLocalCart } = useCartStore();

  useEffect(() => {
    if (isAuthenticated) {
      cartApi.getCart()
        .then(cart => setCart(cart.items, cart.totalAmount, cart.totalItems))
        .catch(err => console.error('Failed to fetch cart', err));
    } else {
      clearLocalCart();
    }
  }, [isAuthenticated, setCart, clearLocalCart]);
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 pt-[72px]">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <CartDrawer />
    </div>
  );
}
