import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, useInView, useScroll } from 'framer-motion';
import { ArrowRight, Headphones, Watch, Footprints, Briefcase, Monitor, Star, Users, Truck, ShieldCheck, Diamond, type LucideIcon } from 'lucide-react';
import ProductCard from '../features/products/ProductCard';
import { staggerContainer, staggerItem } from '../lib/animations';
import { productsApi, categoriesApi } from '../api/products';


const ICON_MAP: Record<string, LucideIcon> = {
  'audio': Headphones,
  'wearables': Watch,
  'footwear': Footprints,
  'bags': Briefcase,
  'desk-accessories': Monitor,
};

function SectionHeader({ label, title, subtitle }: { label?: string; title: string; subtitle?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="text-center mb-12"
    >
      {label && (
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent mb-3 block">
          {label}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-charcoal tracking-tight mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-500 text-sm md:text-base max-w-md mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

export default function HomePage() {
  const heroRef = useRef(null);
  
  const { data: featuredProducts = [] } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: productsApi.getFeaturedProducts
  });

  const { data: dbCategories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getCategories
  });

  // Ensure diverse categories in featured products
  const diverseFeaturedProducts = React.useMemo(() => {
    if (!featuredProducts || featuredProducts.length === 0) return [];
    
    const distinct: typeof featuredProducts = [];
    const usedCategories = new Set<string>();
    
    // First pass: one from each category
    for (const p of featuredProducts) {
      if (!usedCategories.has(p.categoryId)) {
        distinct.push(p);
        usedCategories.add(p.categoryId);
      }
    }
    
    // Second pass: fill the rest up to 8
    for (const p of featuredProducts) {
      if (distinct.length >= 8) break;
      if (!distinct.find(d => d.id === p.id)) {
        distinct.push(p);
      }
    }
    
    return distinct;
  }, [featuredProducts]);

  useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  return (
    <>
      {/* ===== LUXURY EDITORIAL HERO SECTION ===== */}
      <section ref={heroRef} className="relative min-h-[calc(100vh-88px)] flex flex-col justify-center overflow-hidden bg-[#FFFFFF] px-[20px] md:px-[32px] pt-[56px] md:pt-[72px] pb-[48px] md:pb-[64px]">
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-10"
        >
          <motion.div 
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-[2px] h-[30px] bg-gray-200 rounded-full"
          />
        </motion.div>

        <div className="max-w-[1140px] w-full mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="flex flex-col items-start text-left w-full lg:pr-4">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 mb-[28px]"
            >
              <div className="w-8 h-[1px] bg-[#111111]" />
              <span className="inline-block text-[#111111] text-[11px] font-[600] uppercase tracking-[0.25em] leading-none mt-[1px]">
                NEW COLLECTION 2026
              </span>
            </motion.div>

            <h1 className="font-[850] tracking-tighter flex flex-col mb-[30px] items-start">
              <motion.span
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 1 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.3 } }
                }}
                className="text-[#111111] leading-[0.95] text-[48px] md:text-[64px] lg:text-[76px] xl:text-[84px] will-change-transform flex"
              >
                {"Premium".split("").map((char, index) => (
                  <motion.span
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
                    }}
                    className="inline-block"
                    style={{ willChange: "transform, opacity" }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.span>
              <motion.span
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 1 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.6 } }
                }}
                className="text-[#A7AFBA] leading-[0.95] text-[48px] md:text-[64px] lg:text-[76px] xl:text-[84px] will-change-transform flex"
              >
                {"Essentials".split("").map((char, index) => (
                  <motion.span
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
                    }}
                    className="inline-block"
                    style={{ willChange: "transform, opacity" }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-[#667085] text-[16px] md:text-[19px] max-w-[540px] mb-[40px] leading-[1.6] will-change-transform"
            >
              Curated minimalist fashion, tech, and lifestyle essentials for a sharper everyday look.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row items-center gap-[16px] mb-[48px] w-full sm:w-auto will-change-transform"
            >
              <Link
                to="/products"
                className="group flex items-center justify-center gap-3 bg-[#111111] text-white h-[54px] rounded-full px-[32px] text-[15px] font-[600] hover:-translate-y-[2px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all duration-300 w-full sm:w-auto whitespace-nowrap"
              >
                Shop Collection
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/products?featured=true"
                className="flex items-center justify-center bg-white text-[#111111] border border-[#E5E7EB] h-[54px] rounded-full px-[32px] text-[15px] font-[600] hover:bg-[#F8FAFC] hover:-translate-y-[2px] hover:shadow-sm transition-all duration-300 w-full sm:w-auto whitespace-nowrap"
              >
                Explore Looks
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex justify-start will-change-transform"
            >
              <div className="flex flex-wrap items-center gap-y-3 gap-x-[16px] sm:gap-x-[24px] text-gray-500">
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-[#111111] fill-[#111111]" />
                  <span className="text-[14px] font-[600] text-[#111111]">4.9 Rating</span>
                </div>
                <div className="w-[4px] h-[4px] rounded-full bg-gray-300 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-[#111111]" />
                  <span className="text-[14px] font-[600] text-[#111111]">12k+ Buyers</span>
                </div>
                <div className="w-[4px] h-[4px] rounded-full bg-gray-300 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-[#111111]" />
                  <span className="text-[14px] font-[600] text-[#111111]">Free Shipping</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Premium Hero Image Bento Grid */}
          <div className="w-full relative flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-[480px] xl:max-w-[520px] aspect-[4/5] sm:aspect-square grid grid-cols-2 grid-rows-2 gap-3 sm:gap-4 relative will-change-transform"
            >
              {/* Left Tall Image - Fashion/Sneakers */}
              <div className="col-span-1 row-span-2 rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_16px_40px_rgb(0,0,0,0.06)] border border-gray-100/50 bg-[#F8FAFC] group relative">
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop" 
                  alt="Premium Red Sneakers" 
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              
              {/* Top Right Square - Tech/Headphones */}
              <div className="col-span-1 row-span-1 rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_16px_40px_rgb(0,0,0,0.06)] border border-gray-100/50 bg-[#F8FAFC] group relative">
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop" 
                  alt="Premium Headphones" 
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Bottom Right Square - Lifestyle/Watch */}
              <div className="col-span-1 row-span-1 rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_16px_40px_rgb(0,0,0,0.06)] border border-gray-100/50 bg-[#F8FAFC] group relative">
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop" 
                  alt="Premium Smartwatch" 
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES SECTION ===== */}
      <section className="py-[120px] bg-white">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-[72px]"
          >
            <div className="flex items-center justify-center gap-3 mb-[20px]">
              <div className="w-8 h-[1px] bg-[#111111]" />
              <span className="inline-block text-[#111111] text-[11px] font-[600] uppercase tracking-[0.25em] leading-none mt-[1px]">
                CATEGORIES
              </span>
              <div className="w-8 h-[1px] bg-[#111111]" />
            </div>
            <h2 className="text-[36px] md:text-[48px] font-[850] text-[#111111] tracking-tight mb-[16px]">
              Shop by Category
            </h2>
            <p className="text-[#667085] text-[16px] md:text-[18px]">
              Explore our curated collections of premium essentials
            </p>
          </motion.div>

          {dbCategories.length > 0 && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: '0px' }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6"
            >
              {dbCategories.map((cat) => {
                const Icon = ICON_MAP[cat.slug] || Star;
                return (
                  <motion.div key={cat.slug} variants={staggerItem}>
                    <Link
                      to={`/products?category=${cat.slug}`}
                      className="group relative flex flex-col items-center p-8 rounded-[32px] bg-white border border-gray-100 hover:border-gray-200 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden"
                    >
                      {/* Animated Gradient Background on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC] to-white opacity-100 group-hover:opacity-0 transition-opacity duration-700 pointer-events-none z-0" />
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />
                      
                      {/* Floating Icon Container */}
                      <div className="relative w-20 h-20 mb-6 rounded-2xl bg-white border border-gray-100 shadow-[0_8px_16px_-6px_rgba(0,0,0,0.05)] flex items-center justify-center text-[#111111] group-hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.12)] group-hover:-translate-y-2 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] z-10">
                        <Icon size={32} strokeWidth={1.5} className="transition-transform duration-700 group-hover:scale-110" />
                      </div>
                      
                      <h3 className="relative font-bold text-[#111111] text-[18px] tracking-tight mb-1.5 transition-colors z-10">
                        {cat.name}
                      </h3>
                      <p className="relative text-[13px] text-[#A7AFBA] font-semibold uppercase tracking-[0.1em] z-10">
                        {cat.itemCount || 20} Products
                      </p>
                      
                      {/* Decorative abstract element for premium feel */}
                      <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-b from-[#F8FAFC] to-white rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-150 z-0 pointer-events-none" />
                      
                      {/* Elegant bottom highlight on hover */}
                      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS SECTION ===== */}
      <section className="py-24 bg-off-white">
        <div className="page-container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-40px' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent mb-3 block">
                Featured
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-charcoal tracking-tight">
                Top Picks
              </h2>
            </div>
            <Link to="/products?featured=true" className="btn-premium btn-ghost text-sm group">
              View All <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Horizontal Scrollable on Mobile, Grid on Desktop */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
            {diverseFeaturedProducts.slice(0, 8).map((product) => (
              <motion.div key={product.id} variants={staggerItem}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          {/* Mobile horizontal scroll */}
          <div className="md:hidden flex gap-4 overflow-x-auto hide-scrollbar pb-4 -mx-6 px-6">
            {diverseFeaturedProducts.slice(0, 8).map((product) => (
              <div key={product.id} className="min-w-[260px] flex-shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HERO BANNER ===== */}
      <section className="py-24 bg-white">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="bg-charcoal rounded-3xl p-12 md:p-20 text-center relative overflow-hidden contain-paint"
          >
            {/* Optimized static gradients instead of heavy blur */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[60px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-[40px] pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
                Elevate Your Everyday
              </h2>
              <p className="text-gray-400 text-sm md:text-base max-w-lg mx-auto mb-8">
                Premium products designed with obsessive attention to detail. Because you deserve the best.
              </p>
              <Link to="/products" className="btn-premium bg-white text-charcoal hover:bg-gray-100 text-sm px-8 py-3.5">
                Explore Collection <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== WHY AURACART ===== */}
      <section className="py-24 bg-off-white">
        <div className="page-container">
          <SectionHeader
            label="Why AuraCart"
            title="Crafted for Perfection"
            subtitle="Every product we carry meets our exacting standards"
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { 
                title: 'Premium Quality', 
                desc: 'Every product is hand-selected for exceptional build quality and premium materials.',
                icon: Diamond,
                color: 'from-blue-500/10 to-indigo-500/10',
                iconColor: 'text-indigo-600'
              },
              { 
                title: 'Free Shipping', 
                desc: 'Complimentary express shipping on all orders over ₹999. No hidden fees, ever.',
                icon: Truck,
                color: 'from-emerald-500/10 to-teal-500/10',
                iconColor: 'text-emerald-600'
              },
              { 
                title: '30-Day Returns', 
                desc: 'Not satisfied? Return any product within 30 days for a full refund. No questions asked.',
                icon: ShieldCheck,
                color: 'from-orange-500/10 to-rose-500/10',
                iconColor: 'text-rose-600'
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="group relative bg-white p-10 rounded-[32px] border border-[#EEF0F3] hover:border-transparent hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden"
              >
                {/* Hover Ambient Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] z-0 pointer-events-none blur-xl`} />
                
                {/* Icon Container */}
                <div className="relative z-10 w-16 h-16 bg-gray-50 group-hover:bg-white rounded-2xl flex items-center justify-center mb-8 border border-gray-100 group-hover:border-transparent group-hover:shadow-lg transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110">
                  <item.icon size={28} strokeWidth={1.5} className={`${item.iconColor} transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-rotate-12`} />
                </div>
                
                {/* Text Content */}
                <div className="relative z-10">
                  <h3 className="text-[20px] font-[700] text-[#111111] mb-3 transition-colors">{item.title}</h3>
                  <p className="text-[15px] font-[500] text-[#667085] leading-[1.6] transition-colors">{item.desc}</p>
                </div>
                
                {/* Background oversized icon for depth */}
                <div className="absolute -bottom-10 -right-10 text-gray-900/[0.02] opacity-0 group-hover:opacity-100 group-hover:-translate-y-4 group-hover:-translate-x-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none z-0">
                  <item.icon size={180} strokeWidth={1} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="py-24 bg-white">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-lg mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-charcoal tracking-tight mb-3">
              Stay in the Loop
            </h2>
            <p className="text-sm text-gray-500 mb-8">
              Subscribe for early access to new drops and exclusive offers.
            </p>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-charcoal transition-colors"
              />
              <button className="btn-premium btn-primary text-sm px-6 py-3 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
