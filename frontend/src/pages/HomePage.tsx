import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import { ArrowRight, Headphones, Watch, Footprints, Briefcase, Monitor, Star, Users, Truck, ShieldCheck, Diamond, type LucideIcon } from 'lucide-react';
import ProductCard from '../features/products/ProductCard';
import { productsApi, categoriesApi } from '../api/products';


const ICON_MAP: Record<string, LucideIcon> = {
  'audio': Headphones,
  'wearables': Watch,
  'footwear': Footprints,
  'bags': Briefcase,
  'desk-accessories': Monitor,
};

const CATEGORY_IMAGES: Record<string, string> = {
  'audio': 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1000&auto=format&fit=crop',
  'wearables': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
  'footwear': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop',
  'bags': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop',
  'desk-accessories': 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=1000&auto=format&fit=crop',
};



export default function HomePage() {
  const mainRef = useRef(null);
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

  useGSAP(() => {
    // 1. Simple Reveals
    gsap.utils.toArray('.gsap-reveal').forEach((elem: any) => {
      gsap.fromTo(elem,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: elem,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // 2. Stagger Containers
    gsap.utils.toArray('.gsap-stagger-container').forEach((container: any) => {
      const items = Array.from(container.querySelectorAll('.gsap-stagger-item')) as HTMLElement[];
      if (items.length > 0) {
        gsap.fromTo(items,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    });

    // 3. Hero Parallax
    const parallaxImgs = gsap.utils.toArray('.hero-parallax-img') as HTMLElement[];
    if (parallaxImgs.length > 0) {
      gsap.to(parallaxImgs, {
        y: 60,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }
    
    // Refresh ScrollTrigger to recalculate heights after dynamic content loads
    ScrollTrigger.refresh();

  }, { scope: mainRef, dependencies: [dbCategories.length, featuredProducts.length] });

  return (
    <div ref={mainRef}>
      {/* ===== LUXURY EDITORIAL HERO SECTION ===== */}
      <section ref={heroRef} className="relative min-h-[calc(100vh-88px)] flex flex-col justify-center overflow-hidden bg-[#FFFFFF] px-[20px] md:px-[32px] pt-[56px] md:pt-[72px] pb-[48px] md:pb-[64px]">
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
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
              transition={{ delay: 0, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
                  visible: { opacity: 1, transition: { staggerChildren: 0.03, delayChildren: 0.1 } }
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
                  visible: { opacity: 1, transition: { staggerChildren: 0.03, delayChildren: 0.2 } }
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
              transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-[#667085] text-[16px] md:text-[19px] max-w-[540px] mb-[40px] leading-[1.6] will-change-transform"
            >
              Curated minimalist fashion, tech, and lifestyle essentials for a sharper everyday look.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
              transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
            <div className="w-full max-w-[480px] xl:max-w-[520px] aspect-[4/5] sm:aspect-square grid grid-cols-2 grid-rows-2 gap-3 sm:gap-4 relative will-change-transform gsap-reveal opacity-0 gpu-accelerate">
              {/* Left Tall Image - Fashion/Sneakers */}
              <div className="col-span-1 row-span-2 rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_16px_40px_rgb(0,0,0,0.06)] border border-gray-100/50 bg-[#F8FAFC] group relative">
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop" 
                  alt="Premium Sneakers" 
                  className="hero-parallax-img w-full h-[120%] object-cover -translate-y-[10%] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />
              </div>
              
              {/* Top Right Square - Tech/Headphones */}
              <div className="col-span-1 row-span-1 rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_16px_40px_rgb(0,0,0,0.06)] border border-gray-100/50 bg-[#F8FAFC] group relative">
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1000&auto=format&fit=crop" 
                  alt="Premium Headphones" 
                  className="hero-parallax-img w-full h-[130%] object-cover -translate-y-[15%] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />
              </div>

              {/* Bottom Right Square - Lifestyle/Watch */}
              <div className="col-span-1 row-span-1 rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_16px_40px_rgb(0,0,0,0.06)] border border-gray-100/50 bg-[#F8FAFC] group relative">
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop" 
                  alt="Premium Watch" 
                  className="hero-parallax-img w-full h-[130%] object-cover -translate-y-[15%] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES SECTION ===== */}
      <section className="py-[120px] bg-white">
        <div className="page-container">
          <div className="text-center mb-[72px] gsap-reveal opacity-0 gpu-accelerate">
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
          </div>

          {dbCategories.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4 md:gap-6 lg:h-[520px] gsap-stagger-container">
              {dbCategories.map((cat, index) => {
                const Icon = ICON_MAP[cat.slug] || Star;
                const isFeatured = index === 0;
                
                return (
                  <div 
                    key={cat.slug} 
                    className={`h-full gsap-stagger-item opacity-0 gpu-accelerate ${isFeatured ? 'md:col-span-2 lg:col-span-2 lg:row-span-2' : 'col-span-1 row-span-1'}`}
                  >
                    <Link
                      to={`/products?category=${cat.slug}`}
                      className={`group relative flex flex-col justify-between h-full bg-[#111111] overflow-hidden ${isFeatured ? 'rounded-[40px] p-10 md:p-12' : 'rounded-[32px] p-6 md:p-8'}`}
                    >
                      {/* Stunning Background Image */}
                      <div className="absolute inset-0 z-0">
                        <img 
                          src={CATEGORY_IMAGES[cat.slug] || CATEGORY_IMAGES['audio']} 
                          alt={cat.name}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-80"
                        />
                      </div>
                      
                      {/* Gradient Overlay for text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10 transition-opacity duration-700 group-hover:opacity-90" />
                      
                      {/* Top Small Icon */}
                      <div className="relative w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all duration-500 z-10">
                        <Icon size={20} strokeWidth={2} />
                      </div>
                      
                      <div className="relative z-20 mt-auto pt-16">
                        <h3 className={`font-[750] text-white tracking-tight mb-2 transition-transform duration-500 group-hover:-translate-y-1 leading-tight ${isFeatured ? 'text-[32px] md:text-[44px]' : 'text-[20px] md:text-[24px]'}`}>
                          {cat.name}
                        </h3>
                        <div className="overflow-hidden">
                          <p className="text-[12px] md:text-[13px] text-white/80 font-[600] uppercase tracking-[0.1em] transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 flex items-center gap-2">
                            Explore Collection <ArrowRight size={14} />
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS SECTION ===== */}
      <section className="py-24 bg-off-white">
        <div className="page-container">
          <div className="flex items-end justify-between mb-12 gsap-reveal opacity-0 gpu-accelerate">
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
          </div>

          {/* Horizontal Scrollable on Mobile, Grid on Desktop */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6 gsap-stagger-container">
            {diverseFeaturedProducts.slice(0, 8).map((product) => (
              <div key={product.id} className="gsap-stagger-item opacity-0 gpu-accelerate">
                <ProductCard product={product} />
              </div>
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
          <div className="bg-charcoal rounded-3xl p-12 md:p-20 text-center relative overflow-hidden contain-paint gsap-reveal opacity-0 gpu-accelerate">
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
          </div>
        </div>
      </section>

      {/* ===== WHY AURACART (LUXURY EDITION) ===== */}
      <section className="py-[120px] bg-[#0A0A0A] relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none" 
             style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(10,10,10,0) 70%)' }} />

        <div className="page-container relative z-10">
          <div className="text-center mb-20 gsap-reveal opacity-0 gpu-accelerate">
            <h2 className="text-[40px] md:text-[56px] font-[850] text-white tracking-tight mb-[16px] flex flex-wrap justify-center">
              <span className="flex">
                {"The AuraCart Standard".split("").map((char, index) => (
                  <span
                    key={index}
                    className={char === " " ? "w-[12px] md:w-[16px]" : "inline-block"}
                  >
                    {char}
                  </span>
                ))}
              </span>
            </h2>
            <p className="text-[#A7AFBA] text-[18px] md:text-[20px] max-w-2xl mx-auto font-[500]">
              We don't compromise on quality. Every product, every delivery, and every interaction is engineered for perfection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 gsap-stagger-container">
            {[
              { 
                title: 'Uncompromising Quality', 
                desc: 'Hand-selected materials. Rigorous testing. If it isn\'t the absolute best in its category, we don\'t sell it.',
                icon: Diamond,
              },
              { 
                title: 'Global Express', 
                desc: 'Complimentary lightning-fast shipping. Your premium goods, delivered safely with zero hidden fees.',
                icon: Truck,
              },
              { 
                title: 'Ironclad Guarantee', 
                desc: 'A full 30-day window to decide. If you aren\'t completely satisfied, return it. No friction, no questions.',
                icon: ShieldCheck,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group relative bg-[#111111] p-10 md:p-12 rounded-[32px] border border-white/5 hover:border-white/20 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden gsap-stagger-item opacity-0 gpu-accelerate"
              >
                {/* Hover Ambient Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                {/* Floating Icon Container */}
                <div className="relative w-16 h-16 mb-8 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] z-10">
                  <item.icon size={28} strokeWidth={1.5} className="transition-transform duration-700 group-hover:scale-110" />
                </div>
                
                <h3 className="relative font-[700] text-white text-[22px] tracking-tight mb-4 z-10">
                  {item.title}
                </h3>
                <p className="relative text-[15px] text-[#A7AFBA] font-[500] leading-relaxed z-10">
                  {item.desc}
                </p>

                {/* Massive subtle watermark icon */}
                <item.icon size={200} strokeWidth={0.5} className="absolute -right-10 -bottom-10 text-white/[0.02] group-hover:text-white/[0.05] transition-colors duration-700 z-0 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="py-24 bg-white">
        <div className="page-container">
          <div className="text-center max-w-lg mx-auto gsap-reveal opacity-0 gpu-accelerate">
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
          </div>
        </div>
      </section>
    </div>
  );
}
