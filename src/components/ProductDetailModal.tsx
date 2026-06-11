import React, { useState, useEffect } from 'react';
import { useReVa } from '../context/ReVaContext';
import { Product } from '../types';
import { PRODUCTS, FAQS } from '../data';
import { 
  X, Star, Heart, ShoppingBag, Truck, ShieldAlert, BadgeCheck, 
  ChevronRight, RefreshCcw, HelpCircle, ArrowRight, CheckCircle2
} from 'lucide-react';
import { formatPrice } from '../utils';
import { ImageWithFallback } from './ImageWithFallback';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    addToCart, 
    toggleWishlist, 
    isWishlisted,
    setActiveTab,
    addNotification
  } = useReVa();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [activeTab, setActiveTabSection] = useState<'desc' | 'specs' | 'reviews' | 'faqs'>('desc');
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ backgroundPosition: 'center' });
  const [zoomActive, setZoomActive] = useState(false);

  // Monitor product changes to reset selectors
  useEffect(() => {
    if (selectedProduct) {
      setActiveImageIdx(0);
      setSelectedColor(selectedProduct.colors[0] || '');
      setSelectedSize(selectedProduct.sizes ? selectedProduct.sizes[0] : '');
      setActiveTabSection('desc');
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const discountPercent = Math.round(
    ((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100
  );

  // Filter recommendations (Related products in same category, excluding active one)
  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === selectedProduct.category && p.id !== selectedProduct.id
  ).slice(0, 3);

  // Calculate delivery date estimates dynamically (e.g., current time + 3 days)
  const getDeliveryEstimateDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const handleAddToCart = (type: 'add' | 'buynow') => {
    addToCart(selectedProduct, 1, selectedColor, selectedSize || undefined);
    if (type === 'buynow') {
      setSelectedProduct(null);
      setActiveTab('checkout');
    }
  };

  // Image zoom preview helper
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      backgroundImage: `url(${selectedProduct.images[activeImageIdx]})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: '240%'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-300">
      <div className="relative w-full max-w-5xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 my-8">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-5 right-5 z-10 rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 cursor-pointer"
          aria-label="Close Product Modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Core Detail Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* Left Column: Image Area (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Main Interactive Zoom Box */}
            <div 
              onMouseEnter={() => setZoomActive(true)}
              onMouseLeave={() => setZoomActive(false)}
              onMouseMove={handleMouseMove}
              className="relative h-96 w-full rounded-2xl bg-slate-50 dark:bg-slate-950 overflow-hidden border border-slate-100 dark:border-slate-800 cursor-zoom-in"
            >
              {zoomActive ? (
                <div 
                  className="absolute inset-0 bg-no-repeat transition-all duration-75"
                  style={zoomStyle}
                />
              ) : (
                <ImageWithFallback
                  src={selectedProduct.images[activeImageIdx]}
                  alt={selectedProduct.name}
                  category={selectedProduct.category}
                  className="h-full w-full object-cover transition-all"
                />
              )}

              {/* Discount Tag */}
              <span className="absolute top-3 left-3 rounded-full bg-brand-primary px-3 py-1 text-[10px] font-black uppercase text-white tracking-widest shadow-lg">
                SAVE {discountPercent}%
              </span>

              {selectedProduct.stockCount < 10 && (
                <span className="absolute bottom-3 left-3 rounded-md bg-amber-500 px-2.5 py-1 text-[9px] font-bold text-white tracking-wide flex items-center gap-1 animate-pulse">
                  <ShieldAlert className="h-3 w-3" /> Limited Elite Specimen ({selectedProduct.stockCount} left)
                </span>
              )}
            </div>

            {/* Thumbnails list carousel */}
            <div className="flex gap-2.5 overflow-x-auto py-1 scrollbar-none">
              {selectedProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`h-16 w-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImageIdx === idx ? 'border-brand-primary scale-105 shadow-sm' : 'border-slate-200 opacity-60'
                  }`}
                >
                  <ImageWithFallback src={img} alt="" category={selectedProduct.category} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Title & Actions (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Breadcrumb line */}
              <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 font-mono">
                <span>{selectedProduct.category}</span>
                <ChevronRight className="h-3 w-3" />
                <span>{selectedProduct.subCategory}</span>
              </div>

              {/* Title & Brand Tagline */}
              <h2 className="font-heading text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                {selectedProduct.name}
              </h2>

              {/* Ratings breakdown */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-brand-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 fill-current ${
                        i < Math.floor(selectedProduct.rating) ? 'text-brand-accent' : 'text-slate-200 dark:text-slate-800'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 pl-1.5">
                    {selectedProduct.rating}
                  </span>
                </div>
                <span className="text-xs text-slate-400">&bull;</span>
                <span className="text-xs font-medium text-slate-500 hover:underline cursor-pointer">
                  {selectedProduct.reviewsCount} customer testimonies
                </span>
                <span className="text-xs text-slate-400">&bull;</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded">
                  <BadgeCheck className="h-3 w-3" /> Quality Checked
                </span>
              </div>

              {/* Pricing Section */}
              <div className="flex items-baseline gap-3 mt-4 pb-4 border-b border-slate-100 dark:border-slate-800 animate-in fade-in">
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-slate-400 leading-none">MRP: <span className="line-through font-mono">{formatPrice(selectedProduct.originalPrice)}</span></span>
                  <span className="text-2xl md:text-3xl font-black text-brand-primary dark:text-purple-400 font-mono">
                    {formatPrice(selectedProduct.price)}
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/15 px-2.5 py-1.5 rounded-md self-end mb-1">
                  Save {formatPrice(selectedProduct.originalPrice - selectedProduct.price)} (17% OFF)
                </span>
              </div>

              {/* Selection Selectors (Colors & Sizes) */}
              <div className="mt-5 grid grid-cols-2 gap-4">
                
                {/* Color Selector */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Selected Shade</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-all cursor-pointer ${
                          selectedColor === color 
                            ? 'bg-brand-primary text-white border-brand-primary' 
                            : 'bg-slate-55 border-slate-200 text-slate-700 dark:bg-slate-850 dark:border-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selector */}
                {selectedProduct.sizes && (
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Selected Size</label>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProduct.sizes.map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`min-w-8 h-8 rounded-lg text-xs font-bold border flex items-center justify-center transition-all cursor-pointer ${
                            selectedSize === sz
                              ? 'bg-brand-primary text-white border-brand-primary'
                              : 'bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-850 dark:border-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Speed disclosures */}
              <div className="mt-5 flex items-center gap-3 bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100 dark:border-slate-850 text-xs">
                <Truck className="h-4 w-4 text-brand-accent shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    Complimentary Premium Courier Shipping
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Arrives by <strong className="text-slate-800 dark:text-slate-200">{getDeliveryEstimateDate()}</strong>. High priority dispatch.
                  </p>
                </div>
              </div>

              {/* Action Buttons Drawer */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleAddToCart('add')}
                  className="flex-1 rounded-xl bg-slate-900 border border-slate-800 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-white hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="h-4.5 w-4.5" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={() => handleAddToCart('buynow')}
                  className="flex-1 rounded-xl bg-brand-primary py-3.5 text-center text-xs font-bold uppercase tracking-wider text-white shadow-premium hover:bg-brand-secondary active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Buy Securely Now</span>
                  <ArrowRight className="h-4 w-4 text-white" />
                </button>
                <button
                  onClick={() => toggleWishlist(selectedProduct)}
                  className={`rounded-xl p-3.5 border transition-all cursor-pointer ${
                    isWishlisted(selectedProduct.id)
                      ? 'border-rose-200 bg-rose-50 text-rose-500'
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
                  }`}
                  aria-label="Toggle Wishlist"
                >
                  <Heart className={`h-4.5 w-4.5 ${isWishlisted(selectedProduct.id) ? 'fill-current' : ''}`} />
                </button>
              </div>

            </div>

            {/* Bottom Section: Tabs description specs reviews related */}
            <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-5">
              <div className="flex border-b border-slate-100 dark:border-slate-800 gap-4 mb-4">
                {[
                  { id: 'desc', label: 'About Item' },
                  { id: 'specs', label: 'Detailed Specifications' },
                  { id: 'reviews', label: 'Owner Testimonies' },
                  { id: 'faqs', label: 'Product Accordion' }
                ].map((tb) => (
                  <button
                    key={tb.id}
                    onClick={() => setActiveTabSection(tb.id as any)}
                    className={`pb-2 text-xs font-bold tracking-wide transition-all border-b-2 cursor-pointer ${
                      activeTab === tb.id
                        ? 'border-brand-primary text-brand-primary dark:text-white dark:border-brand-accent'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {tb.label}
                  </button>
                ))}
              </div>

              {/* Tab Contents */}
              <div className="min-h-36 max-h-48 overflow-y-auto text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                
                {activeTab === 'desc' && (
                  <div className="space-y-2.5 pr-2">
                    <p>{selectedProduct.description}</p>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {selectedProduct.tags.map(t => (
                        <span key={t} className="rounded bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500 uppercase dark:bg-slate-800">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'specs' && (
                  <div className="border border-slate-100 rounded-xl overflow-hidden dark:border-slate-800">
                    <table className="w-full text-left font-sans text-xs">
                      <tbody>
                        {Object.entries(selectedProduct.specifications).map(([key, value], idx) => (
                          <tr key={key} className={idx % 2 === 0 ? 'bg-slate-50/50 dark:bg-slate-950/20' : 'bg-transparent'}>
                            <td className="p-2.5 font-bold text-slate-800 dark:text-slate-200 capitalize w-1/3">{key}</td>
                            <td className="p-2.5 font-mono text-slate-500 truncate">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-4 pr-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-800 dark:text-white">Active Verified Inquiries</h4>
                      <span className="text-[10px] text-slate-400">Showing top 2 responses</span>
                    </div>
                    {[
                      { name: 'Dr. Evelyn Sterling', rate: 5, date: '2026-05-18', comment: 'Excellent weight distribution. The materials align with modern biological standards. Truly high tier.' },
                      { name: 'Alexandru P.', rate: 4.8, date: '2026-06-02', comment: 'Fast delivery! Packaging felt like opening a luxury high watch box.' }
                    ].map((rv, idx) => (
                      <div key={idx} className="border-b border-slate-100 dark:border-slate-850 pb-3 last:border-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">{rv.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{rv.date}</span>
                        </div>
                        <div className="flex items-center text-amber-500 mb-1">
                          {Array.from({ length: 5 }).map((_, s) => (
                            <Star key={s} className={`h-3 w-3 fill-current ${s < Math.floor(rv.rate) ? '' : 'opacity-20'}`} />
                          ))}
                        </div>
                        <p className="text-slate-500 mt-1 italic">"{rv.comment}"</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'faqs' && (
                  <div className="space-y-3 pr-2">
                    {FAQS.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="bg-slate-50 p-2.5 rounded-lg dark:bg-slate-950/30">
                        <h5 className="font-bold text-slate-850 dark:text-slate-200 flex items-center gap-1">
                          <HelpCircle className="h-3.5 w-3.5 text-brand-primary" /> {item.question}
                        </h5>
                        <p className="text-slate-400 mt-1 pl-4.5">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Related AI style suggestions */}
              <div className="mt-6">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 font-mono">
                  Recommended Companions (Related products)
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {relatedProducts.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProduct(p)}
                      className="group flex flex-col text-left items-start gap-1 rounded-xl p-1.5 hover:bg-slate-50 dark:hover:bg-slate-850/60 transition-colors cursor-pointer"
                    >
                      <ImageWithFallback src={p.images[0]} alt="" category={p.category} className="h-16 w-full object-cover rounded-lg group-hover:scale-102 transition-transform" />
                      <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate w-full mt-1">{p.name}</p>
                      <p className="text-[9px] font-mono font-bold text-brand-secondary">{formatPrice(p.price)}</p>
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
