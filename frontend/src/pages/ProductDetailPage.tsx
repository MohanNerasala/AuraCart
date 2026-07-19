import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Star, Minus, Plus, ChevronRight, Truck, RotateCcw, Shield } from 'lucide-react';
import ProductCard from '../features/products/ProductCard';
// import { fadeInUp } from '../lib/animations';

// Mock product data
const MOCK_PRODUCT = {
  id: '1', name: 'AuraSound Pro Max', slug: 'aurasound-pro-max',
  description: 'Premium over-ear headphones with active noise cancellation, spatial audio, and 40-hour battery life. Crafted with aerospace-grade aluminum and memory foam cushions for unparalleled comfort and sound quality. The adaptive noise cancellation intelligently adjusts to your environment while the custom-tuned 40mm drivers deliver studio-grade audio with deep bass and crystal-clear highs.',
  price: 549, discountPrice: 499, categoryId: '1', categoryName: 'Audio', categorySlug: 'audio',
  stock: 50, rating: 4.8, reviewCount: 234, featured: true,
  imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
  images: [
    { id: '1', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', altText: 'Front view', sortOrder: 0 },
    { id: '2', imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800', altText: 'Side view', sortOrder: 1 },
  ],
  variants: [
    { id: 'v1', variantType: 'COLOR' as const, variantValue: 'Midnight Black', priceModifier: 0, stock: 20 },
    { id: 'v2', variantType: 'COLOR' as const, variantValue: 'Arctic White', priceModifier: 0, stock: 15 },
    { id: 'v3', variantType: 'COLOR' as const, variantValue: 'Space Gray', priceModifier: 0, stock: 15 },
  ],
  createdAt: '', updatedAt: '',
};

const RELATED_PRODUCTS = [
  { id: '2', name: 'AuraBuds Elite', slug: 'aurabuds-elite', description: '', price: 299, discountPrice: null, categoryId: '1', categoryName: 'Audio', categorySlug: 'audio', stock: 120, rating: 4.6, reviewCount: 189, featured: true, imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=600', images: [], variants: [], createdAt: '', updatedAt: '' },
  { id: '3', name: 'AuraWave Speaker', slug: 'aurawave-speaker', description: '', price: 199, discountPrice: 179, categoryId: '1', categoryName: 'Audio', categorySlug: 'audio', stock: 75, rating: 4.5, reviewCount: 156, featured: false, imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600', images: [], variants: [], createdAt: '', updatedAt: '' },
  { id: '4', name: 'AuraStudio Monitor', slug: 'aurastudio-monitor', description: '', price: 899, discountPrice: null, categoryId: '1', categoryName: 'Audio', categorySlug: 'audio', stock: 25, rating: 4.9, reviewCount: 78, featured: false, imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600', images: [], variants: [], createdAt: '', updatedAt: '' },
  { id: '16', name: 'AuraKey Mechanical', slug: 'aurakey-mechanical', description: '', price: 199, discountPrice: 179, categoryId: '5', categoryName: 'Desk Accessories', categorySlug: 'desk-accessories', stock: 70, rating: 4.7, reviewCount: 289, featured: true, imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600', images: [], variants: [], createdAt: '', updatedAt: '' },
];

const COLOR_MAP: Record<string, string> = {
  'Midnight Black': '#1a1a1a',
  'Arctic White': '#f0f0f0',
  'Space Gray': '#6b7280',
};

export default function ProductDetailPage() {
  // const { slug } = useParams();
  const product = MOCK_PRODUCT; // In production, fetch by slug
  const [selectedColor, setSelectedColor] = useState(product.variants[0]?.variantValue || '');
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const effectivePrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="page-container py-4">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Link to="/" className="hover:text-charcoal transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link to="/products" className="hover:text-charcoal transition-colors">Products</Link>
          <ChevronRight size={12} />
          <span className="text-charcoal">{product.name}</span>
        </div>
      </div>

      {/* Product Section */}
      <div className="page-container pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left - 3D Viewer / Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Product Image */}
            <div className="bg-gray-50 rounded-2xl overflow-hidden mb-4 aspect-square">
              {product.images && product.images.length > 0 ? (
                <img 
                  src={product.images[activeImage]?.imageUrl || product.imageUrl} 
                  alt={product.images[activeImage]?.altText || product.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Image Thumbnails */}
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                    activeImage === i ? 'border-charcoal' : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <img src={img.imageUrl} alt={img.altText} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right - Product Info (Sticky) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent mb-3 block">
              {product.categoryName}
            </span>

            <h1 className="text-3xl md:text-4xl font-bold text-charcoal tracking-tight mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-charcoal">{product.rating}</span>
              <span className="text-sm text-gray-400">({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-8">
              <span className="text-3xl font-bold text-charcoal">₹{effectivePrice.toFixed(2)}</span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-gray-400 line-through">₹{product.price.toFixed(2)}</span>
                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">
                    Save ₹{(product.price - product.discountPrice!).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-500 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Color Variants */}
            {product.variants.filter(v => v.variantType === 'COLOR').length > 0 && (
              <div className="mb-8">
                <label className="text-sm font-semibold text-charcoal mb-3 block">
                  Color: <span className="font-normal text-gray-500">{selectedColor}</span>
                </label>
                <div className="flex gap-3">
                  {product.variants.filter(v => v.variantType === 'COLOR').map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedColor(v.variantValue)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === v.variantValue
                          ? 'border-charcoal scale-110'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: COLOR_MAP[v.variantValue] || '#999' }}
                      title={v.variantValue}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <label className="text-sm font-semibold text-charcoal mb-3 block">Quantity</label>
              <div className="flex items-center gap-1 w-fit border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-50 transition-colors"
                >
                  <Minus size={16} className="text-gray-500" />
                </button>
                <span className="w-12 text-center text-sm font-semibold text-charcoal">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-50 transition-colors"
                >
                  <Plus size={16} className="text-gray-500" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 btn-premium btn-primary text-sm py-4 justify-center gap-2"
              >
                <ShoppingBag size={18} /> Add to Cart
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLiked(!liked)}
                className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-colors ${
                  liked ? 'border-red-200 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Heart size={20} className={liked ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
              </motion.button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-100">
              {[
                { icon: Truck, label: 'Free Shipping' },
                { icon: RotateCcw, label: '30-Day Returns' },
                { icon: Shield, label: '2-Year Warranty' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <item.icon size={20} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-[11px] text-gray-500 font-medium">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        <div className="mt-24">
          <h2 className="text-2xl font-bold text-charcoal tracking-tight mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {RELATED_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
