import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { cartApi } from '../../api/cart';
import { slideInRight } from '../../lib/animations';

export default function CartDrawer() {
  const { isCartOpen, closeCart, items, totalAmount, totalItems, setCart } = useCartStore();
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

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-charcoal" />
                <h2 className="text-lg font-bold text-charcoal">Cart</h2>
                <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </span>
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                    <ShoppingBag size={28} className="text-gray-300" />
                  </div>
                  <p className="text-sm font-semibold text-charcoal mb-1">Your cart is empty</p>
                  <p className="text-xs text-gray-400 mb-6">Add some premium products to get started</p>
                  <button
                    onClick={closeCart}
                    className="btn-premium btn-primary text-sm"
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={`${item.productId}-${item.variantId || 'base'}`}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0 }}
                        className="flex gap-4 p-3 rounded-xl bg-gray-50/50"
                      >
                        {/* Product Image */}
                        <Link
                          to={`/products/${item.productSlug}`}
                          onClick={closeCart}
                          className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"
                        >
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        </Link>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/products/${item.productSlug}`}
                            onClick={closeCart}
                            className="text-sm font-semibold text-charcoal hover:text-accent transition-colors line-clamp-1"
                          >
                            {item.productName}
                          </Link>
                          {item.variantValue && (
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              {item.variantType}: {item.variantValue}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200">
                              <button 
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1 || updatingItemId === item.id}
                                className="p-1.5 hover:bg-gray-50 rounded-l-lg transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-default"
                              >
                                <Minus size={12} className="text-gray-500" />
                              </button>
                              <span className="text-xs font-semibold text-charcoal w-6 text-center">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                disabled={updatingItemId === item.id}
                                className="p-1.5 hover:bg-gray-50 rounded-r-lg transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-default"
                              >
                                <Plus size={12} className="text-gray-500" />
                              </button>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold text-charcoal">
                                ₹{item.subtotal.toFixed(2)}
                              </span>
                              <button 
                                onClick={() => handleRemove(item.id)}
                                disabled={updatingItemId === item.id}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:cursor-default"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 px-6 py-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Subtotal</span>
                  <span className="text-lg font-bold text-charcoal">₹{totalAmount.toFixed(2)}</span>
                </div>
                <p className="text-[11px] text-gray-400">Shipping calculated at checkout</p>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/cart"
                    onClick={closeCart}
                    className="btn-premium btn-secondary text-sm justify-center"
                  >
                    View Cart
                  </Link>
                  <Link
                    to="/checkout"
                    onClick={closeCart}
                    className="btn-premium btn-primary text-sm justify-center gap-2"
                  >
                    Checkout <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
