import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Minus, Plus, X, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { cartApi } from '../api/cart';

export default function CartPage() {
  const { items, totalAmount, totalItems, setCart } = useCartStore();
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    // Optimistic Update
    
    const targetItem = items.find(i => i.id === itemId);
    if (!targetItem) return;
    
    const quantityDiff = newQuantity - targetItem.quantity;
    const newItems = items.map(item => 
      item.id === itemId 
        ? { ...item, quantity: newQuantity, subtotal: newQuantity * (item.productDiscountPrice || item.productPrice) }
        : item
    );
    
    setCart(newItems, totalAmount + (quantityDiff * (targetItem.productDiscountPrice || targetItem.productPrice)), totalItems + quantityDiff);
    setUpdatingItemId(itemId);
    
    try {
      const cart = await cartApi.updateItemQuantity(itemId, newQuantity);
      const currentItem = useCartStore.getState().items.find(i => i.id === itemId);
      if (!currentItem || currentItem.quantity === newQuantity) {
        setCart(cart.items, cart.totalAmount, cart.totalItems);
      }
    } catch (error) {
      console.error('Failed to update quantity', error);
      // Silently ignore network drops during rapid clicks
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemove = async (itemId: string) => {
    // Optimistic Update
    const previousItems = [...items];
    const previousAmount = totalAmount;
    const previousCount = totalItems;
    
    const targetItem = items.find(i => i.id === itemId);
    if (!targetItem) return;
    
    const newItems = items.filter(item => item.id !== itemId);
    setCart(newItems, totalAmount - targetItem.subtotal, totalItems - targetItem.quantity);
    setUpdatingItemId(itemId);
    
    try {
      const cart = await cartApi.removeItem(itemId);
      setCart(cart.items, cart.totalAmount, cart.totalItems);
    } catch (error) {
      console.error('Failed to remove item', error);
      setCart(previousItems, previousAmount, previousCount);
    } finally {
      setUpdatingItemId(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center page-container text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={36} className="text-gray-300" />
          </div>
          <h1 className="text-2xl font-bold text-charcoal mb-2">Your cart is empty</h1>
          <p className="text-sm text-gray-400 mb-8">Looks like you haven't added any products yet.</p>
          <Link to="/products" className="btn-premium btn-primary text-sm px-8 py-3.5">
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="page-container py-8 md:py-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-charcoal tracking-tight mb-8"
        >
          Shopping Cart <span className="text-gray-400 text-xl font-normal">({totalItems})</span>
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item, i) => (
                <motion.div
                  key={`${item.productId}-${item.variantId || 'base'}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100, height: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex gap-5 p-5 rounded-3xl border border-[#EEF0F3] bg-white transition-all duration-300 hover:shadow-lg hover:border-transparent ${
                    updatingItemId === item.id ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  <Link to={`/products/${item.productSlug}`} className="w-28 h-28 md:w-36 md:h-36 bg-[#F8FAFC] rounded-2xl overflow-hidden flex-shrink-0 relative group">
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                    <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                  </Link>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <Link to={`/products/${item.productSlug}`} className="text-[17px] font-[650] text-[#111111] hover:text-[#6366F1] transition-colors line-clamp-2">
                        {item.productName}
                      </Link>
                      {item.variantValue && (
                        <p className="text-[13px] font-medium text-[#667085] mt-1.5 uppercase tracking-wide">{item.variantType}: {item.variantValue}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-1 border border-[#EEF0F3] bg-gray-50/50 rounded-xl overflow-hidden shadow-sm">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-2.5 hover:bg-white hover:text-black text-gray-500 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-default"
                        >
                          <Minus size={14} strokeWidth={2.5} />
                        </button>
                        <span className="w-10 text-center text-[15px] font-[700] text-[#111111]">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-2.5 hover:bg-white hover:text-black text-gray-500 transition-colors cursor-pointer"
                        >
                          <Plus size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                      <div className="flex items-center gap-5">
                        <span className="text-[18px] font-[800] text-[#111111]">₹{item.subtotal.toFixed(2)}</span>
                        <button
                          onClick={() => handleRemove(item.id)}
                          disabled={updatingItemId === item.id}
                          className="p-2.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-colors group cursor-pointer disabled:cursor-default"
                        >
                          <X size={18} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-off-white rounded-2xl p-6 sticky top-24"
            >
              <h2 className="text-lg font-bold text-charcoal mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-semibold text-charcoal">₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax (est.)</span>
                  <span className="font-semibold text-charcoal">₹{(totalAmount * 0.08).toFixed(2)}</span>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-base font-bold text-charcoal">Total</span>
                    <span className="text-xl font-bold text-charcoal">₹{(totalAmount * 1.08).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Link to="/checkout" className="btn-premium btn-primary w-full text-sm py-4 justify-center gap-2">
                Proceed to Checkout <ArrowRight size={16} />
              </Link>
              <Link to="/products" className="btn-premium btn-ghost w-full text-sm mt-3 justify-center">
                Continue Shopping
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
