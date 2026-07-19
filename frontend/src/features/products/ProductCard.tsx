import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Plus, Minus, Star } from 'lucide-react';
import { cartApi } from '../../api/cart';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import type { Product, CartItem } from '../../types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const isAddingRef = useRef(false);
  const { items, totalAmount, totalItems, setCart, openCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  const cartItem = items.find(item => item.productId === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    setLiked(!liked);
  };

  const effectivePrice = product.discountPrice || product.price;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAddingRef.current) return;
    
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    
    // Optimistic Update
    const optimisticItem: CartItem = {
      id: 'temp-' + Date.now(),
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      productImage: product.imageUrl,
      productPrice: product.price,
      productDiscountPrice: product.discountPrice,
      variantId: null,
      variantType: null,
      variantValue: null,
      variantPriceModifier: 0,
      quantity: 1,
      subtotal: effectivePrice
    };
    
    setCart([...items, optimisticItem], totalAmount + effectivePrice, totalItems + 1);
    setIsAdding(true);
    isAddingRef.current = true;
    openCart();
    
    try {
      const cart = await cartApi.addItem(product.id, 1);
      // Only sync if the user hasn't clicked again (prevent race condition overwrite)
      const currentItem = useCartStore.getState().items.find(i => i.productId === product.id);
      if (!currentItem || currentItem.quantity === 1) {
        setCart(cart.items, cart.totalAmount, cart.totalItems);
      }
    } catch (error) {
      console.error('Failed to add to cart', error);
      // Silently fail the backend sync for intermediate rapid clicks; 
      // the final click will eventually sync it if successful.
    } finally {
      setIsAdding(false);
      isAddingRef.current = false;
    }
  };

  const handleUpdateQuantity = async (e: React.MouseEvent, newQuantity: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    if (!cartItem) return;
    
    // Optimistic Update
    const quantityDiff = newQuantity - cartItem.quantity;
    let newItems = items;
    
    if (newQuantity === 0) {
      newItems = items.filter(item => item.id !== cartItem.id);
    } else {
      newItems = items.map(item => 
        item.id === cartItem.id 
          ? { ...item, quantity: newQuantity, subtotal: newQuantity * effectivePrice }
          : item
      );
    }
    
    setCart(newItems, totalAmount + (quantityDiff * effectivePrice), totalItems + quantityDiff);
    setIsAdding(true);
    
    try {
      // If the ID is still temporary (initial add is in-flight), wait for it to be resolved
      let actualId = cartItem.id;
      let retries = 6;
      while (actualId.startsWith('temp-') && retries > 0) {
        await new Promise(r => setTimeout(r, 500));
        const updatedItem = useCartStore.getState().items.find(i => i.productId === product.id);
        if (updatedItem && !updatedItem.id.startsWith('temp-')) {
          actualId = updatedItem.id;
        }
        retries--;
      }

      if (actualId.startsWith('temp-')) throw new Error('Timeout waiting for real ID');

      let cart;
      if (newQuantity === 0) {
        cart = await cartApi.removeItem(actualId);
      } else {
        cart = await cartApi.updateItemQuantity(actualId, newQuantity);
      }
      
      // Only sync if the user hasn't clicked again (prevent race condition overwrite)
      const currentItem = useCartStore.getState().items.find(i => i.productId === product.id);
      if (!currentItem || currentItem.quantity === newQuantity) {
        setCart(cart.items, cart.totalAmount, cart.totalItems);
      }
    } catch (error) {
      console.error('Failed to update quantity', error);
      // Silently fail the backend sync for intermediate rapid clicks; 
      // the final click will eventually sync it if successful.
    } finally {
      setIsAdding(false);
    }
  };


  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => navigate(`/products/${product.slug}`)}
      className="group relative h-full flex flex-col cursor-pointer"
    >
      <div className="bg-white rounded-[20px] overflow-hidden border border-[#EEF0F3] transition-all duration-500 will-change-transform group-hover:-translate-y-1.5 group-hover:shadow-[0_24px_48px_rgba(0,0,0,0.06)] group-hover:border-transparent flex flex-col h-full">
        
        {/* Image Container */}
        <div className="relative block aspect-[4/5] bg-[#F8FAFC] overflow-hidden p-6 flex items-center justify-center">
          
          <div className="w-full h-full relative z-0 pointer-events-none">
            {/* Soft Shadow under product */}
            <div className="absolute inset-x-8 -bottom-4 h-8 bg-black/5 blur-xl rounded-full" />
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] relative z-10 text-transparent"
              loading="lazy"
            />
          </div>

          {/* Discount Badge */}
          {hasDiscount && (
            <span className="absolute top-4 left-4 bg-[#111111] text-white text-[11px] font-[700] px-3 py-1.5 rounded-full z-20 pointer-events-none">
              -{discountPercent}%
            </span>
          )}

          {/* Wishlist Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: isHovered || liked ? 1 : 0.9, scale: isHovered || liked ? 1 : 0.9 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => { e.stopPropagation(); handleLike(e); }}
            className={`absolute top-4 right-4 w-[36px] h-[36px] bg-white rounded-full flex items-center justify-center shadow-[0_8px_16px_rgba(0,0,0,0.08)] hover:scale-105 transition-transform z-50 pointer-events-auto cursor-pointer ${
              !(isHovered || liked) ? 'md:opacity-0 opacity-90' : ''
            }`}
          >
            <Heart
              size={16}
              strokeWidth={liked ? 0 : 2}
              className={`transition-colors duration-300 ${liked ? 'fill-red-500 text-red-500' : 'text-[#111111]'}`}
            />
          </motion.button>

          {/* Quick Add Button / Quantity Selector */}
          {quantityInCart > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className={`absolute bottom-4 right-4 bg-[#111111] text-white rounded-full h-[40px] px-3 flex items-center justify-between gap-3 shadow-[0_8px_16px_rgba(0,0,0,0.12)] z-50 pointer-events-auto ${isAdding ? 'opacity-80' : ''}`}
            >
              <button 
                onClick={(e) => handleUpdateQuantity(e, quantityInCart - 1)}
                disabled={quantityInCart <= 1 || isAdding}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                <Minus size={14} strokeWidth={2.5} />
              </button>
              <span className="text-[14px] font-[650] min-w-[12px] text-center select-none">
                {quantityInCart}
              </span>
              <button 
                onClick={(e) => handleUpdateQuantity(e, quantityInCart + 1)}
                disabled={isAdding}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                <Plus size={14} strokeWidth={2.5} />
              </button>
            </motion.div>
          ) : (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHovered ? 1 : 0.9, y: isHovered ? 0 : 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => { e.stopPropagation(); handleAddToCart(e); }}
              disabled={isAdding}
              className={`absolute bottom-4 right-4 bg-[#111111] hover:bg-[#222222] text-white rounded-full h-[40px] px-5 text-[13px] font-[650] flex items-center justify-center gap-2 transition-all shadow-[0_8px_16px_rgba(0,0,0,0.12)] z-50 pointer-events-auto cursor-pointer ${isAdding ? 'opacity-80 pointer-events-none' : ''} ${
                !isHovered ? 'md:opacity-0 md:translate-y-2 opacity-90' : ''
              }`}
            >
              {isAdding ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Adding</>
              ) : (
                <><Plus size={16} strokeWidth={2.5} /> Add</>
              )}
            </motion.button>
          )}
        </div>

        {/* Info Container */}
        <div className="p-[20px] flex flex-col flex-grow">
          <p className="text-[11px] font-[650] text-[#A7AFBA] uppercase tracking-[0.15em] mb-1.5">
            {product.categoryName}
          </p>
          <Link to={`/products/${product.slug}`} className="mb-3 block">
            <h3 className="text-[16px] font-[650] text-[#111111] leading-[1.4] group-hover:text-[#6366F1] transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex items-center gap-2.5">
              <span className="text-[17px] font-[750] text-[#111111]">
                ₹{effectivePrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-[13px] font-[500] text-[#A7AFBA] line-through">
                  ₹{product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1.5 bg-[#F8FAFC] px-2 py-1 rounded-md">
              <Star size={12} className="text-[#111111] fill-[#111111]" />
              <span className="text-[12px] text-[#111111] font-[650]">{product.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
