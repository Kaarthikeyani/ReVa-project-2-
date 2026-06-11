import React, { useState, useEffect } from 'react';
import { useReVa } from '../context/ReVaContext';
import { PRODUCTS, BRAND_PARTNERS, TESTIMONIALS } from '../data';
import { Product } from '../types';
import { 
  ArrowRight, ShieldCheck, Clock, Zap, Award, Sparkles, Star, 
  ChevronLeft, ChevronRight, Eye, ShoppingCart, Heart, RefreshCw, Scale 
} from 'lucide-react';
import { formatPrice } from '../utils';
import { ImageWithFallback } from './ImageWithFallback';

export const HomeView: React.FC = () => {
  const { 
    setActiveTab, 
    setSelectedCategory, 
    setSelectedProduct, 
    addToCart, 
    toggleWishlist, 
    isWishlisted,
    toggleCompare,
    isCompared
  } = useReVa();

  // Hero carousel index
  const [activeSlide, setActiveSlide] = useState(0);

  // Active filter tab for Featured products
  const [activeFilterTab, setActiveFilterTab] = useState<'best' | 'new' | 'trending'>('best');

  // Interactive countdown state
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 40 });

  // Interactive AI Personal Advisor State
  const [aiState, setAiState] = useState<'idle' | 'loading' | 'suggested'>('idle');
  const [selectedVibe, setSelectedVibe] = useState<string>('sleek-tech');
  const [aiSuggestions, setAiSuggestions] = useState<Product[]>([]);
  const [aiFeedback, setAiFeedback] = useState<string>('');

  const runAiAdvisor = () => {
    setAiState('loading');
    setTimeout(() => {
      let filtered: Product[] = [];
      let comment = '';
      if (selectedVibe === 'sleek-tech') {
        filtered = PRODUCTS.filter(p => p.category === 'Electronics' || p.tags.includes('5G') || p.tags.includes('AMOLED'));
        comment = "Based on your preference for sleek, futuristic tech and constant connectivity, the ReVa Silicon matrix recommends anchoring your ecosystem around our dual-display foldable phone. Enjoy complimentary titanium matching accessories.";
      } else if (selectedVibe === 'high-fashion') {
        filtered = PRODUCTS.filter(p => p.category === 'Fashion' || p.category === 'Accessories');
        comment = "Our fashion curation algorithm suggests premium Italian handcrafts. Elevate evenings with authentic sateen silk wraps combined with deep vegetable-tanned duffles to finalize your iconic silhouette.";
      } else if (selectedVibe === 'nordic-decor') {
        filtered = PRODUCTS.filter(p => p.category === 'Home & Living');
        comment = "To design a serene residential retreat, integrate organic meditation-centric cork textures alongside electromagnetic floating warm light pieces. Natural, cozy, and anti-minimalist.";
      } else {
        filtered = PRODUCTS.filter(p => p.category === 'Sports & Fitness');
        comment = "Fuel high-output recovery and gym performance. The ReVa variable weights coupled with high-grip self-sanitizing cork mats ensure physical conditioning optimization with zero footprint clutter.";
      }
      setAiSuggestions(filtered.slice(0, 3));
      setAiFeedback(comment);
      setAiState('suggested');
    }, 1200);
  };

  // Hero sliders data
  const heroSlides = [
    {
      title: 'Discover the Future of Shopping',
      subtitle: 'Experience Electronics, Luxury Fashion, Accessories & Curated Home & Living details at unmatched pricing bounds.',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1200',
      tag: 'FUTURE TECH DROPS',
      ctaText: 'Shop Tech Elements',
      actionCategory: 'Electronics',
      badge: 'Bestselling Launch 2026'
    },
    {
      title: 'Draped in Absolute Sophistication',
      subtitle: 'Bespoke tailoring, Mulberry silks, and hand-finished calfskin leather items designed to turn glances.',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=1200',
      tag: 'ELITE COUTURE',
      ctaText: 'Explore Lookbook',
      actionCategory: 'Fashion',
      badge: 'Curated Italian Tailoring'
    },
    {
      title: 'Form Meets anti-gravity',
      subtitle: 'Elevate your physical habitat. Floating MagLev lamps, smart diffusers, and raw terracotta sculptures.',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=1200',
      tag: 'SCULPTURAL LIVING',
      ctaText: 'Acquire Ornaments',
      actionCategory: 'Home & Living',
      badge: 'Minimalist Nordic Decor'
    }
  ];

  // Auto rotate hero slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Flash Sale countdown ticks
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 14, minutes: 32, seconds: 40 }; // Reset
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const currentHero = heroSlides[activeSlide];

  // Filter products based on selected tab
  const getFeaturedProducts = (): Product[] => {
    switch (activeFilterTab) {
      case 'best':
        return PRODUCTS.filter((p) => p.isBestSeller).slice(0, 4);
      case 'new':
        return PRODUCTS.filter((p) => p.isNewArrival).slice(0, 4);
      case 'trending':
        return PRODUCTS.filter((p) => p.isTrending).slice(0, 4);
      default:
        return PRODUCTS.slice(0, 4);
    }
  };

  const handleCategoryCardClick = (cat: string) => {
    setSelectedCategory(cat);
    setActiveTab('shop');
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. HERO SECTION WITH SLIDER CAROUSEL */}
      <section id="hero-slider" className="relative group mx-auto max-w-7xl overflow-hidden rounded-3xl bg-slate-900 h-[620px] shadow-premium-xl">
        {/* Slide background */}
        <div className="absolute inset-0 transition-all duration-1000 ease-out">
          {/* Cover image overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent z-10" />
          <img
            src={currentHero.image}
            alt={currentHero.title}
            className="h-full w-full object-cover transition-transform duration-7000 scale-105"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Banner Details (z-10 overlay) */}
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 sm:px-12 md:px-20 max-w-2xl text-left">
          
          <span className="inline-flex max-w-fit items-center gap-1.5 rounded-full bg-amber-500/10 border border-brand-accent/20 px-3.5 py-1 text-[10px] font-black tracking-widest text-brand-accent uppercase mb-4">
            <Sparkles className="h-3 w-3 text-brand-accent pr-0.5 animate-pulse" /> {currentHero.tag}
          </span>

          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight transition-all">
            {currentHero.title}
          </h2>

          <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-300 md:text-base">
            {currentHero.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => {
                setSelectedCategory(currentHero.actionCategory);
                setActiveTab('shop');
              }}
              className="rounded-full bg-brand-primary px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-premium hover:bg-brand-secondary transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{currentHero.ctaText}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setActiveTab('shop');
              }}
              className="rounded-full bg-white/10 border border-white/20 backdrop-blur-sm px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white hover:text-slate-950 transition-all cursor-pointer"
            >
              Explore Deals
            </button>
          </div>
        </div>

        {/* Slide Controller indicator buttons floating right */}
        <div className="absolute top-6 right-6 z-30 hidden sm:flex items-center gap-2 bg-slate-950/40 backdrop-blur-sm rounded-full p-1.5 border border-white/5">
          <span className="text-[10px] font-bold text-slate-300 font-mono px-2">
            SLIDE {activeSlide + 1}/3
          </span>
        </div>

        {/* Slider Manual Arrows */}
        <button
          onClick={handlePrevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 h-11 w-11 rounded-full bg-slate-950/30 border border-white/5 text-white hover:bg-brand-primary hover:border-brand-primary flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
          aria-label="Previous banner slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={handleNextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 h-11 w-11 rounded-full bg-slate-950/30 border border-white/5 text-white hover:bg-brand-primary hover:border-brand-primary flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
          aria-label="Next banner slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Carousel indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                activeSlide === idx ? 'w-8 bg-brand-primary' : 'w-2 bg-white/40'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. PROMOTIONAL FEATURE BULLETS BOARD */}
      <section className="mx-auto max-w-7xl grid grid-cols-1 gap-6 sm:grid-cols-3">
        {[
          { 
            icon: <ShieldCheck className="h-6 w-6 text-brand-primary" />, 
            title: 'Fully Verified Authenticity', 
            desc: 'Every item is sourced directly from approved brand manufacturers with lifetime authentication certs.' 
          },
          { 
            icon: <Clock className="h-6 w-6 text-brand-secondary" />, 
            title: 'Express 48-Hour Matching', 
            desc: 'High priority courier dispatch ensures your item is packaged, vetted, and delivered in pristine intervals.' 
          },
          { 
            icon: <Zap className="h-6 w-6 text-brand-accent animate-pulse" />, 
            title: 'VIP Concierge Service', 
            desc: '24/7 dedicated support desk with interactive portal setups and seamless, hassle-free returns booking.' 
          }
        ].map((item, idx) => (
          <div key={idx} className="flex gap-4 rounded-2xl bg-white p-5 shadow-premium border border-slate-100 dark:bg-slate-900/60 dark:border-slate-850">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 dark:bg-slate-800">
              {item.icon}
            </div>
            <div>
              <h4 className="font-heading text-sm font-bold text-slate-850 dark:text-white">{item.title}</h4>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* 3. CATEGORIES SECTION */}
      <section className="mx-auto max-w-7xl space-y-6 text-left">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Curated Category Catalogs
            </h3>
            <p className="text-xs text-slate-400">Discover handpicked, luxury alignments suited for your premium taste.</p>
          </div>
        </div>

        {/* 4 Card responsive Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { 
              name: 'Electronics', 
              image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=400', 
              slug: 'Electronics', 
              accent: 'Futuristic Gears',
              stat: `${PRODUCTS.filter(p => p.category === 'Electronics').length} active listings`
            },
            { 
              name: 'Fashion Wear', 
              image: 'https://images.unsplash.com/photo-1539008835154-1558249626c5?auto=format&fit=crop&q=80&w=400', 
              slug: 'Fashion', 
              accent: 'Elite Draping', 
              stat: `${PRODUCTS.filter(p => p.category === 'Fashion').length} active listings`
            },
            { 
              name: 'Bespoke Accessories', 
              image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=400', 
              slug: 'Accessories', 
              accent: 'Luxury Jewelry',
              stat: `${PRODUCTS.filter(p => p.category === 'Accessories').length} active listings`
            },
            { 
              name: 'Home & Living', 
              image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&q=80&w=400', 
              slug: 'Home & Living', 
              accent: 'Nordic Habitation',
              stat: `${PRODUCTS.filter(p => p.category === 'Home & Living').length} active listings`
            }
          ].map((cat, idx) => (
            <button
              key={idx}
              onClick={() => handleCategoryCardClick(cat.slug)}
              className="group relative h-72 w-full overflow-hidden rounded-2xl bg-slate-900 text-left border border-slate-100 dark:border-slate-800 transition-all shadow-sm flex flex-col justify-end cursor-pointer"
            >
              {/* Photo background */}
              <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />
                <ImageWithFallback src={cat.image} alt={cat.name} category={cat.slug} className="h-full w-full object-cover" />
              </div>

              {/* Title blocks (z-20) */}
              <div className="relative z-20 p-5 space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-[9px] font-bold tracking-widest text-[#FBBF24] uppercase font-mono bg-[#FBBF24]/10 px-2 py-0.5 rounded">
                    {cat.accent}
                  </span>
                  <span className="text-[9px] font-mono font-medium text-slate-350">{cat.stat}</span>
                </div>
                <h4 className="font-heading text-lg font-bold text-white tracking-wide">{cat.name}</h4>
                <div className="flex items-center gap-1.5 text-slate-350 text-xs font-semibold pt-1 group-hover:text-[#C4B5FD] transition-colors">
                  <span>Shop Catalog</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 4. FLASH SALE SECTION WITH REAL-TIME TIMER */}
      <section className="mx-auto max-w-7xl rounded-3xl bg-slate-900 overflow-hidden relative border border-slate-800 p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-premium-xl">
        
        {/* Background cosmic graphics */}
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-brand-primary/10 blur-[120px] pointer-events-none" />
        
        {/* Copy blocks */}
        <div className="space-y-4 max-w-lg text-left">
          <span className="inline-flex items-center gap-1 rounded bg-amber-400 px-2 py-0.5 text-[9px] font-extrabold text-slate-950 tracking-widest uppercase">
            <Zap className="h-3.5 w-3.5 fill-current" /> LIMITED FLOC FLASH SALE
          </span>
          <h3 className="font-heading text-3xl font-black text-white leading-tight">
            Premium Drops. Heavy Discounts. Zero Delay.
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Acquire select premium models at heavily cut prices, backed by our absolute quality vetting. Once the clock strikes zero, normal retail grids re-engage.
          </p>

          {/* Real-time Countdown Graphics */}
          <div className="flex items-center gap-3 pt-2">
            {[
              { val: timeLeft.hours, label: 'HRS' },
              { val: timeLeft.minutes, label: 'MINS' },
              { val: timeLeft.seconds, label: 'SECS' }
            ].map((timer, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 border border-white/10 font-heading text-lg font-black text-white font-mono shadow-sm">
                  {timer.val.toString().padStart(2, '0')}
                </div>
                <span className="text-[9px] font-bold tracking-widest text-slate-500 mt-1 uppercase font-mono">{timer.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Featured item slider for sale */}
        <div className="w-full md:w-96 shrink-0 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 text-white text-left space-y-4">
          <div className="relative h-48 w-full rounded-xl overflow-hidden">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400" 
              alt="Flash Sale headphones" 
              category="Electronics"
              className="h-full w-full object-cover" 
            />
            <span className="absolute top-2 right-2 rounded-md bg-rose-500 px-2 py-0.5 text-[9px] font-bold uppercase text-white shadow-md">
              17% OFF
            </span>
          </div>
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <h4 className="font-bold text-sm tracking-wide">ReVa SoundScape ANC Air</h4>
              <span className="text-xs font-bold text-amber-400 font-mono">{formatPrice(24990)}</span>
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-2">Bespoke walnut wood high-fidelity headphones. Limited luxury stock.</p>
            <div className="pt-3 flex justify-between items-center gap-2">
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                <ShieldCheck className="h-3.5 w-3.5" /> High priority matching
              </span>
              <button 
                onClick={() => {
                  const pObj = PRODUCTS.find(p => p.id === 'p2');
                  if (pObj) setSelectedProduct(pObj);
                }}
                className="rounded-lg bg-white text-slate-900 px-3.5 py-1.5 text-xs font-bold hover:bg-amber-400 hover:text-slate-950 transition-colors cursor-pointer"
              >
                Quick Claim
              </button>
            </div>
          </div>
        </div>

      </section>

      {/* 5. FEATURED / GRID SHOWCASE TAB SECTION */}
      <section id="featured-products" className="mx-auto max-w-7xl space-y-8">
        
        {/* Topic and Selector Row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
          <div>
            <h3 className="font-heading text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Supreme Selections Catalog
            </h3>
            <p className="text-xs text-slate-400">Sort through award-winning items approved by design forward groups.</p>
          </div>

          {/* Rounded Tab buttons */}
          <div className="flex gap-2 rounded-full bg-slate-100 p-1 dark:bg-slate-950 border dark:border-slate-800">
            {[
              { id: 'best', label: 'Best Sellers' },
              { id: 'new', label: 'New Arrivals' },
              { id: 'trending', label: 'Trending' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilterTab(tab.id as any)}
                className={`rounded-full px-5 py-2 text-xs font-bold tracking-wide transition-all cursor-pointer ${
                  activeFilterTab === tab.id
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'text-slate-500 hover:text-brand-primary dark:text-slate-450'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Item Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {getFeaturedProducts().map((product) => {
            const isSaved = isWishlisted(product.id);
            const isComp = isCompared(product.id);
            const discPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

            return (
              <div
                key={product.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-premium-xl dark:border-slate-800/80 dark:bg-slate-900/40"
              >
                {/* Image portal overlay */}
                <div className="relative h-64 overflow-hidden bg-slate-50 dark:bg-slate-950">
                  <ImageWithFallback
                    src={product.images[0]}
                    alt={product.name}
                    category={product.category}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-104"
                  />

                  {/* Badges list */}
                  <span className="absolute top-2.5 left-2.5 rounded bg-brand-primary px-2 py-0.5 text-[9px] font-black uppercase text-white tracking-wider animate-pulse">
                    {discPercent}% OFF
                  </span>

                  {product.isBestSeller && (
                    <span className="absolute top-2.5 right-2 w-fit rounded bg-amber-500 px-2 py-0.5 text-[9px] font-bold uppercase text-white shadow-sm flex items-center gap-0.5">
                      <Award className="h-3 w-3" /> BEST
                    </span>
                  )}

                  {/* Float triggers on card hover */}
                  <div className="absolute inset-0 z-30 flex items-center justify-center gap-3 bg-black/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="rounded-full bg-white p-2.5 text-slate-800 shadow-xl hover:bg-brand-primary hover:text-white transition-colors cursor-pointer"
                      title="Quick View specification details"
                    >
                      <Eye className="h-4.5 w-4.5" />
                    </button>
                    <button
                      onClick={() => addToCart(product, 1, product.colors[0], product.sizes ? product.sizes[0] : undefined)}
                      className="rounded-full bg-white p-2.5 text-slate-800 shadow-xl hover:bg-brand-primary hover:text-white transition-colors cursor-pointer"
                      title="Add to Shopping Cart"
                    >
                      <ShoppingCart className="h-4.5 w-4.5" />
                    </button>
                    <button
                      onClick={() => toggleCompare(product)}
                      className={`rounded-full p-2.5 shadow-xl transition-colors cursor-pointer ${
                        isComp 
                           ? 'bg-amber-400 text-slate-900' 
                           : 'bg-white text-slate-800 hover:bg-brand-primary hover:text-white'
                      }`}
                      title="Toggle comparison"
                    >
                      <Scale className="h-4.5 w-4.5" />
                    </button>
                    <button
                      onClick={() => toggleWishlist(product)}
                      className={`rounded-full p-2.5 shadow-xl transition-all cursor-pointer ${
                        isSaved 
                          ? 'bg-rose-500 text-white' 
                          : 'bg-white text-slate-800 hover:bg-brand-primary hover:text-white'
                      }`}
                      title="Toggle Wishlist"
                    >
                      <Heart className={`h-4.5 w-4.5 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Info block */}
                <div className="flex flex-1 flex-col justify-between p-4 bg-white dark:bg-slate-900/60">
                  <div className="space-y-1 text-left">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{product.category}</span>
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="block text-xs font-bold text-slate-850 dark:text-slate-100 hover:text-brand-primary transition-colors truncate w-full text-left cursor-pointer"
                    >
                      {product.name}
                    </button>
                    
                    {/* Stars row */}
                    <div className="flex items-center gap-1 pt-0.5">
                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-2.5 w-2.5 fill-current ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-slate-200 dark:text-slate-700'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 font-mono">{product.rating}</span>
                      <span className="text-[10px] text-slate-400">({product.reviewsCount} reviews)</span>
                    </div>
                  </div>

                  {/* Pricing row with detailed savings block */}
                  <div className="flex flex-col text-left space-y-1 border-t border-slate-50 dark:border-slate-850 pt-3 mt-2.5">
                    <div className="flex items-center justify-between">
                      <div className="text-[11px] text-slate-450">
                        MRP: <span className="line-through font-mono text-slate-400">{formatPrice(product.originalPrice)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500 block leading-none font-medium">Offer Price</span>
                        <span className="text-sm font-black text-brand-primary dark:text-purple-400 font-mono">{formatPrice(product.price)}</span>
                      </div>
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="rounded-lg border border-slate-200 text-slate-800 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider hover:bg-brand-primary hover:text-white hover:border-brand-primary dark:border-slate-700 dark:text-slate-300 dark:hover:text-white transition-all cursor-pointer"
                      >
                        Inspect
                      </button>
                    </div>

                    <div className="text-[10px] text-emerald-600 dark:text-emerald-450 font-bold bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded max-w-max mt-1">
                      You Save: {formatPrice(product.originalPrice - product.price)} ({discPercent}% OFF)
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI-POWERED PERSONAL ADVISOR SECTION */}
      <section className="mx-auto max-w-7xl rounded-3xl bg-slate-950 p-8 relative overflow-hidden border border-slate-900 shadow-premium-xl text-left">
        {/* Background glow effects */}
        <div className="absolute -top-12 -left-12 h-64 w-64 rounded-full bg-[#7C3AED]/20 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-[#C4B5FD]/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          {/* Column 1: Controls and Selector */}
          <div className="space-y-5 lg:col-span-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-purple-300">
              <Sparkles className="h-3 w-3 animate-pulse text-purple-400" /> ReVa AI Engine v4.2
            </div>
            <h3 className="font-heading text-3xl font-black text-white leading-tight">
              AI-Powered Personal Advisor
            </h3>
            <p className="text-xs text-slate-450 leading-relaxed">
              Don't browse endlessly. Let our neural curation network map out your ideal lifestyle setup. Choose a style direction to begin instantly.
            </p>

            {/* Vibe Selection Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              {[
                { id: 'sleek-tech', label: 'Sleek & Techy', emoji: '⚡' },
                { id: 'high-fashion', label: 'High Elegance', emoji: '💎' },
                { id: 'nordic-decor', label: 'Nordic Calm', emoji: '🌿' },
                { id: 'active-fitness', label: 'Active Edge', emoji: '🏃' }
              ].map((v) => (
                <button
                  key={v.id}
                  onClick={() => { setSelectedVibe(v.id); setAiState('idle'); }}
                  className={`flex items-center gap-2 rounded-xl p-3 text-xs font-bold text-left border transition-all cursor-pointer ${
                    selectedVibe === v.id
                      ? 'bg-purple-900/50 border-[#8B5CF6]/50 text-white shadow-premium'
                      : 'border-slate-900 bg-slate-900/40 text-slate-400 hover:border-slate-800'
                  }`}
                >
                  <span>{v.emoji}</span>
                  <span>{v.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={runAiAdvisor}
              disabled={aiState === 'loading'}
              className="w-full rounded-full bg-gradient-to-r from-[#6D28D9] to-[#8B5CF6] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:from-[#7C3AED] hover:to-[#A855F7] transition-all flex items-center justify-center gap-2 shadow-premium cursor-pointer disabled:opacity-50"
            >
              <span>{aiState === 'loading' ? 'Analyzing Specifications...' : 'Run Neural Advisor'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Column 2 & 3: Results Display */}
          <div className="lg:col-span-2 min-h-72 flex flex-col justify-center rounded-2xl bg-slate-900/40 border border-slate-900 p-6 backdrop-blur-md">
            {aiState === 'idle' && (
              <div className="text-center space-y-3 py-12">
                <div className="mx-auto h-12 w-12 rounded-full bg-slate-900 flex items-center justify-center text-indigo-400">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-350">Neural Queue Ready</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">Select a stylistic vibe on the left panel & click run. ReVa AI will scan across 24 high-end models & produce instant matching recommendations.</p>
              </div>
            )}

            {aiState === 'loading' && (
              <div className="space-y-6 py-10">
                <div className="flex items-center justify-center gap-2 text-indigo-400 animate-pulse">
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span className="text-xs font-heading font-black uppercase tracking-widest text-[#C4B5FD]">Synthesizing recommendations...</span>
                </div>
                
                {/* Skeleton shimmer blocks */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="rounded-xl border border-slate-900 bg-slate-900/50 p-3 space-y-3">
                      <div className="h-28 w-full rounded-lg bg-slate-800 shimmer" />
                      <div className="h-3 w-16 bg-slate-800 rounded shimmer" />
                      <div className="h-4 w-full bg-slate-800 rounded shimmer" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {aiState === 'suggested' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* AI Commentary balloon */}
                <div className="rounded-xl bg-purple-950/40 border border-purple-900/20 p-4 relative">
                  <div className="absolute top-3 left-4 text-xs font-bold text-[#FBBF24] flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-[#FBBF24]" /> Neural Advisor Review:
                  </div>
                  <p className="text-xs text-indigo-100 leading-relaxed text-left pt-5">
                    "{aiFeedback}"
                  </p>
                </div>

                {/* Suggested cards strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {aiSuggestions.map((prod) => (
                    <div
                      key={prod.id}
                      className="group rounded-xl border border-slate-900 bg-slate-900 p-3 space-y-3 flex flex-col justify-between text-left hover:border-purple-900 transition-colors"
                    >
                      <div className="space-y-2">
                        <div className="relative h-28 w-full rounded-lg overflow-hidden bg-slate-950">
                          <ImageWithFallback src={prod.images[0]} alt={prod.name} category={prod.category} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                          <span className="absolute bottom-2 left-2 rounded bg-amber-400 text-slate-950 px-1.5 py-0.5 text-[8px] font-black font-mono">
                            {formatPrice(prod.price)}
                          </span>
                        </div>
                        <span className="text-[8px] font-extrabold uppercase tracking-widest text-[#C4B5FD]">{prod.category}</span>
                        <h4 className="text-[11px] font-bold text-white truncate w-full">{prod.name}</h4>
                      </div>

                      <button
                        onClick={() => setSelectedProduct(prod)}
                        className="w-full text-center py-1.5 rounded-lg bg-white/10 hover:bg-white hover:text-slate-950 text-white text-[9px] font-extrabold uppercase tracking-wide transition-colors cursor-pointer"
                      >
                        Claim Specimen
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* IMMERSIVE PRODUCT SHOWCASE VIDEO SHOPPING STYLE BANNER */}
      <section className="mx-auto max-w-7xl rounded-3xl overflow-hidden relative h-[380px] bg-slate-950 border border-slate-900 shadow-premium-xl text-left flex items-center justify-start px-8 sm:px-16">
        {/* Visual background placeholder mimicking a video presentation */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/70 to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1590608897129-79da98d15969?auto=format&fit=crop&q=80&w=1200" 
            alt="Cinematic production watch" 
            className="h-full w-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Text information overlays */}
        <div className="relative z-10 max-w-lg space-y-5">
          <span className="inline-flex items-center gap-1 rounded bg-rose-500/10 border border-rose-500/25 px-2.5 py-1 text-[9px] font-black tracking-widest text-rose-300 uppercase">
            ● REVA LIVE WATCH SHOWCASE
          </span>
          <h3 className="font-heading text-3xl sm:text-4xl font-black text-white leading-tight">
            Crafting Sapphire & Titanium Masterpieces
          </h3>
          <p className="text-xs text-slate-350 leading-relaxed">
            Witness our premium design processes. Individually carved titanium casings, diamond-milled sapphire crystals, and deep cellular ECG integration synchronized for elite modern standards.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const prod = PRODUCTS.find(p => p.id === 'p3');
                if (prod) setSelectedProduct(prod);
              }}
              className="rounded-full bg-white text-slate-950 hover:bg-[#FBBF24] text-xs font-bold uppercase tracking-wider px-6 py-3 shadow transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Inspect Watch</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. SPECIAL OFFERS MULTI-BANNER CARDS */}
      <section className="mx-auto max-w-7xl space-y-6">
        <h3 className="font-heading text-2xl font-black text-slate-900 dark:text-white tracking-tight text-left">
          Elite Voucher Cards
        </h3>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          
          {/* Card 1: Up to 70% voucher banner */}
          <div className="relative h-60 rounded-3xl bg-gradient-to-r from-purple-800 to-indigo-900 text-white overflow-hidden p-8 flex flex-col justify-between text-left shadow-lg">
            <div className="space-y-1">
              <span className="text-[9px] font-bold tracking-widest text-amber-400 uppercase bg-amber-400/10 px-2 py-0.5 rounded">
                EXCLUSIVE OFFER
              </span>
              <h4 className="font-heading text-2xl font-black">Up to 70% Mega Clearance</h4>
              <p className="text-[11px] text-slate-300">Apply coupon "FLASH25" on checkout to unlock complimentary cashcuts.</p>
            </div>
            <div className="flex justify-between items-baseline pt-4">
              <span className="text-3xl font-black tracking-tight text-white font-mono">CODE: FLASH25</span>
              <button 
                onClick={() => setActiveTab('shop')}
                className="rounded-full bg-white text-purple-900 px-5 py-2 text-xs font-bold hover:bg-amber-400 transition-colors uppercase cursor-pointer"
              >
                Claim Now
              </button>
            </div>
          </div>

          {/* Card 2: Buy 1 Get 1 promo card */}
          <div className="relative h-60 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 text-white overflow-hidden p-8 flex flex-col justify-between text-left shadow-lg border border-slate-800">
            <div className="space-y-1">
              <span className="text-[9px] font-bold tracking-widest text-emerald-400 uppercase bg-emerald-400/10 px-2 py-0.5 rounded">
                MEMBER PROTECTION SPECIAL
              </span>
              <h4 className="font-heading text-2xl font-black">Buy 1 Get 1 Membership Drops</h4>
              <p className="text-[11px] text-slate-350 font-sans">Vanguard lifestyle ornaments qualify for matching companion objects.</p>
            </div>
            <div className="flex justify-between items-baseline pt-4">
              <span className="text-3xl font-black tracking-tight text-white font-mono">B1G1 ACTIVE</span>
              <button 
                onClick={() => setActiveTab('shop')}
                className="rounded-full bg-brand-primary text-white px-5 py-2 text-xs font-bold hover:bg-brand-secondary transition-colors uppercase cursor-pointer"
              >
                Browse Specimen
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS SLIDER SECTION */}
      <section className="mx-auto max-w-7xl space-y-6">
        <h3 className="font-heading text-2xl font-black text-slate-900 dark:text-white tracking-tight text-left">
          Elite Owner Testimonies
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="relative rounded-2xl bg-white p-6 shadow-premium border border-slate-100 dark:bg-slate-900/40 dark:border-slate-850 text-left space-y-4">
              {/* Quote marks styling */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3 w-3 fill-current ${i < Math.floor(t.rating) ? '' : 'opacity-20'}`} />
                  ))}
                </div>
                <span className="text-sm font-black text-slate-200">“</span>
              </div>
              
              <p className="text-slate-550 dark:text-slate-400 text-xs italic leading-relaxed">
                "{t.comment}"
              </p>

              <div className="flex items-center gap-3 pt-2">
                <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover border" />
                <div>
                  <h5 className="text-xs font-bold text-slate-800 dark:text-white">{t.name}</h5>
                  <p className="text-[10px] text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. BRAND PARTNERS GRID */}
      <section className="mx-auto max-w-7xl space-y-6">
        <p className="text-center text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-2 font-mono">
          Authorized Delivery Channels & Sourcing Partners
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-50 grayscale hover:opacity-80 hover:grayscale-0 transition-all py-3">
          {BRAND_PARTNERS.map((brand, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <img src={brand.logo} alt={brand.name} className="h-6 w-6 rounded-md object-cover" />
              <span className="text-xs font-extrabold text-slate-400 dark:text-slate-500 font-heading tracking-wide uppercase">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
