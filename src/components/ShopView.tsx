import React, { useState, useMemo } from 'react';
import { useReVa } from '../context/ReVaContext';
import { PRODUCTS } from '../data';
import { Product, CategoryType } from '../types';
import { 
  SlidersHorizontal, Search, Star, Eye, ShoppingCart, Heart, 
  Scale, Grid, List, RotateCcw, ChevronDown, CheckCircle2, BadgePercent 
} from 'lucide-react';
import { formatPrice } from '../utils';
import { ImageWithFallback } from './ImageWithFallback';

export const ShopView: React.FC = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    setSelectedProduct,
    addToCart,
    toggleWishlist,
    isWishlisted,
    toggleCompare,
    isCompared
  } = useReVa();

  // Core filter parameters
  const [selectedSubCat, setSelectedSubCat] = useState<string>('All');
  const [priceThreshold, setPriceThreshold] = useState<number>(200000);
  const [chosenBrands, setChosenBrands] = useState<string[]>([]);
  const [chosenColors, setChosenColors] = useState<string[]>([]);
  const [chosenSizes, setChosenSizes] = useState<string[]>([]);
  const [ratingRange, setRatingRange] = useState<number>(0);
  const [discountThreshold, setDiscountThreshold] = useState<number>(0);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<string>('popularity');

  // Layout preference
  const [gridLayout, setGridLayout] = useState<boolean>(true);

  // Dynamic filter catalogs derived from mock data
  const subCategoriesByCategory: Record<string, string[]> = {
    'All': ['All'],
    'Electronics': ['All', 'Smartphones', 'Laptops', 'Tablets', 'Audio Devices', 'Gaming Tools', 'Smart Home'],
    'Fashion': ['All', 'Men\'s Clothing', 'Women\'s Clothing', 'Kids\' Apparel', 'Premium Footwear'],
    'Accessories': ['All', 'Watches', 'Wallets & Belts', 'Sunglasses', 'Bags & Handbags', 'Jewelry'],
    'Home & Living': ['All', 'Furniture', 'Home Decor', 'Kitchen & Dining', 'Bedding & Linens'],
    'Beauty & Personal Care': ['All', 'Skincare', 'Makeup', 'Haircare', 'Grooming Tools'],
    'Sports & Fitness': ['All', 'Fitness Equipment', 'Sports Gear', 'Yoga & Wellness'],
    'Books & Education': ['All', 'Fiction & Literature', 'Self Help & Business', 'Technology & Academy'],
    'Toys & Kids': ['All', 'Educational Toys', 'Board Games & Puzzles', 'RC Cars & Action Figures'],
    'Automotive': ['All', 'Helmets & Gear', 'Car Comfort & Tech', 'Cleaning & Accessories'],
    'Grocery & Essentials': ['All', 'Daily Foods', 'Snacks & Sweets', 'Beverages & Coffee']
  };

  const avSubCats = subCategoriesByCategory[selectedCategory] || ['All'];

  const allAvailableBrands = [
    'Apple', 'Samsung', 'Sony', 'OnePlus', 'Lenovo', 'HP', 'Dell', 'Asus', 'Google Pixel',
    'Nike', 'Adidas', 'Puma', 'Levi\'s', 'Zara', 'H&M',
    'Lakme', 'Maybelline New York', 'L\'Oreal Professional', 'Mamaearth',
    'IKEA', 'Prestige', 'Milton', 'Borosil', 'Hidesign'
  ];
  const allAvailableColors = ['Deep Purple', 'Imperial Titanium', 'Cosmic Black', 'Walnut Gold', 'Silver Birch', 'Carbon Charcoal', 'Sunset Rose', 'Classic Beige', 'Minimalist Black'];
  const allAvailableSizes = ['S', 'M', 'L', 'XL', '7', '8', '9', '10'];

  const handleBrandToggle = (brand: string) => {
    setChosenBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handleColorToggle = (color: string) => {
    setChosenColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const handleSizeToggle = (sz: string) => {
    setChosenSizes(prev => 
      prev.includes(sz) ? prev.filter(s => s !== sz) : [...prev, sz]
    );
  };

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setSelectedSubCat('All');
    setPriceThreshold(200000);
    setChosenBrands([]);
    setChosenColors([]);
    setChosenSizes([]);
    setRatingRange(0);
    setDiscountThreshold(0);
    setOnlyInStock(false);
    setSearchQuery('');
  };

  // Perform multi-layered query calculations using useMemo for top tier speed
  const processedProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // Search query match
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query)) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Category match
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Subcategory match
    if (selectedSubCat !== 'All') {
      result = result.filter((p) => p.subCategory === selectedSubCat);
    }

    // Price match
    result = result.filter((p) => p.price <= priceThreshold);

    // Brands query
    if (chosenBrands.length > 0) {
      result = result.filter((p) =>
        chosenBrands.some((chosen) => p.description.toLowerCase().includes(chosen.toLowerCase()) || p.tags.some(t => t.toLowerCase() === chosen.toLowerCase()))
      );
    }

    // Colors query
    if (chosenColors.length > 0) {
      result = result.filter((p) =>
        p.colors.some((col) => chosenColors.includes(col))
      );
    }

    // Sizes query
    if (chosenSizes.length > 0) {
      result = result.filter((p) =>
        p.sizes && p.sizes.some((sz) => chosenSizes.includes(sz))
      );
    }

    // Rating value
    if (ratingRange > 0) {
      result = result.filter((p) => p.rating >= ratingRange);
    }

    // Discount percentage
    if (discountThreshold > 0) {
      result = result.filter((p) => {
        const discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
        return discount >= discountThreshold;
      });
    }

    // In stock only
    if (onlyInStock) {
      result = result.filter((p) => p.inStock);
    }

    // Sorter logic
    if (sortOption === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'top-rated') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === 'newest') {
      result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    }

    return result;
  }, [
    searchQuery,
    selectedCategory,
    selectedSubCat,
    priceThreshold,
    chosenBrands,
    chosenColors,
    chosenSizes,
    ratingRange,
    discountThreshold,
    onlyInStock,
    sortOption
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 py-6 font-sans">
      
      {/* Title section */}
      <div className="text-left space-y-1">
        <h2 className="font-heading text-2.5xl font-black text-slate-900 dark:text-white tracking-tight">
          Explore Our Master Catalog
        </h2>
        <p className="text-xs text-slate-400">
          Tailor selections matching your specifications. Backed by ReVa premium delivery assurances.
        </p>
      </div>

      {/* Main Core Layout: Sidebar Filters + Product Grids */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        
        {/* Left Column: Sidebar Filters Panel */}
        <aside id="shop-filters-sidebar" className="space-y-6 lg:border-r lg:border-slate-100 lg:dark:border-slate-800 lg:pr-6 text-left">
          
          <div className="flex items-center justify-between border-b pb-4 border-slate-100 dark:border-slate-800">
            <h4 className="font-heading text-xs uppercase tracking-wider font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5">
              <SlidersHorizontal className="h-4 w-4 text-brand-primary" /> Filters Panel
            </h4>
            <button
              onClick={resetAllFilters}
              className="text-[10px] uppercase font-bold text-slate-400 hover:text-brand-primary flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" /> Reset All
            </button>
          </div>

          {/* Category Dropdowns / Lists */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">Core Dept.</label>
            <div className="flex flex-col gap-1.5 pt-1">
              {[
                'All', 'Electronics', 'Fashion', 'Accessories', 'Home & Living', 
                'Beauty & Personal Care', 'Sports & Fitness', 'Books & Education', 
                'Toys & Kids', 'Automotive', 'Grocery & Essentials'
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSelectedSubCat('All');
                  }}
                  className={`text-xs text-left px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-purple-50 text-brand-primary dark:bg-slate-800 dark:text-white'
                      : 'text-slate-650 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-850'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Subcategory selection (Loads conditionally based on category selected) */}
          {avSubCats.length > 1 && (
            <div className="space-y-2 border-t pt-4 border-slate-100 dark:border-slate-850">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">Section Type</label>
              <div className="flex flex-wrap gap-1.5 pt-1.5">
                {avSubCats.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubCat(sub)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold border transition-all cursor-pointer ${
                      selectedSubCat === sub
                        ? 'bg-brand-primary text-white border-brand-primary'
                        : 'bg-white border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-350'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price Range threshold */}
          <div className="space-y-2.5 border-t pt-4 border-slate-100 dark:border-slate-850">
            <div className="flex justify-between items-baseline">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">Budget limit</label>
              <span className="text-xs font-bold font-mono text-brand-secondary">{formatPrice(priceThreshold)}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="200000"
              step="1000"
              value={priceThreshold}
              onChange={(e) => setPriceThreshold(Number(e.target.value))}
              className="w-full accent-brand-primary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>{formatPrice(1000)}</span>
              <span>{formatPrice(200000)}</span>
            </div>
          </div>

          {/* Brands Selection Checkboxes */}
          <div className="space-y-2 border-t pt-4 border-slate-100 dark:border-slate-850">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">Vetting Source</label>
            <div className="space-y-1.5 pt-1.5">
              {allAvailableBrands.map((brand) => (
                <label key={brand} className="flex items-center gap-2.5 text-xs text-slate-650 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={chosenBrands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                    className="rounded border-slate-300 accent-brand-primary focus:ring-purple-400 h-3.5 w-3.5"
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Color Checklist buttons */}
          <div className="space-y-2 border-t pt-4 border-slate-100 dark:border-slate-850">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">Acoustic & Fabric Shade</label>
            <div className="grid grid-cols-2 gap-1.5 pt-1.5">
              {allAvailableColors.map((col) => (
                <button
                  key={col}
                  onClick={() => handleColorToggle(col)}
                  className={`rounded-lg border text-left px-2 py-1 text-[10px] font-medium transition-all truncate cursor-pointer ${
                    chosenColors.includes(col)
                      ? 'bg-purple-100/50 border-brand-primary text-brand-primary dark:text-purple-300'
                      : 'bg-transparent border-slate-200 text-slate-700 dark:border-slate-800 dark:text-slate-350'
                  }`}
                  title={col}
                >
                  {col}
                </button>
              ))}
            </div>
          </div>

          {/* Size panel checkboxes */}
          {selectedCategory === 'Fashion' && (
            <div className="space-y-2 border-t pt-4 border-slate-100 dark:border-slate-850 animate-in fade-in">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">Available size</label>
              <div className="flex flex-wrap gap-1.5 pt-1.5">
                {allAvailableSizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => handleSizeToggle(sz)}
                    className={`h-8 w-8 rounded-lg text-xs font-bold border flex items-center justify-center transition-all cursor-pointer ${
                      chosenSizes.includes(sz)
                        ? 'bg-brand-primary text-white border-brand-primary'
                        : 'bg-transparent border-slate-200 text-slate-700 dark:border-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Ratings filters */}
          <div className="space-y-2 border-t pt-4 border-slate-100 dark:border-slate-850">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">Ratings baseline</label>
            <div className="flex flex-col gap-1.5 pt-1.5">
              {[4.8, 4.5, 0].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setRatingRange(rate)}
                  className={`text-xs text-left px-2 py-1 rounded transition-all cursor-pointer ${
                    ratingRange === rate
                      ? 'bg-purple-50 text-brand-primary dark:bg-slate-800'
                      : 'text-slate-500 hover:text-brand-primary'
                  }`}
                >
                  {rate === 0 ? 'Show all scores' : `★ ${rate} & above`}
                </button>
              ))}
            </div>
          </div>

          {/* Discount levels */}
          <div className="space-y-2 border-t pt-4 border-slate-100 dark:border-slate-850">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">Discount Percentage</label>
            <div className="flex flex-wrap gap-1.5 pt-1.5">
              {[0, 10, 20, 30].map((disc) => (
                <button
                  key={disc}
                  onClick={() => setDiscountThreshold(disc)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold border transition-all cursor-pointer ${
                    discountThreshold === disc
                      ? 'bg-emerald-55 bg-brand-primary text-white border-brand-primary'
                      : 'bg-transparent border-slate-200 text-slate-650 dark:border-slate-800 dark:text-slate-350'
                  }`}
                >
                  {disc === 0 ? 'All Items' : `${disc}% Off+`}
                </button>
              ))}
            </div>
          </div>

          {/* Only in stock */}
          <div className="space-y-2 border-t pt-4 border-slate-100 dark:border-slate-850">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={() => setOnlyInStock(!onlyInStock)}
                className="rounded accent-brand-primary cursor-pointer"
              />
              <span>In Stock Only</span>
            </label>
          </div>

        </aside>

        {/* Right Column: Catalog Grid Showcase */}
        <section className="lg:col-span-3 space-y-6">
          
          {/* Controls Bar: Sorting option + Grid/lines layout selector */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl p-4 shadow-sm">
            
            {/* Search within results */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-3 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Fuzzy search inside catalog..."
                className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 pl-10 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 focus:outline-none focus:border-brand-primary"
              />
            </div>

            {/* Sort Dropdown & Layout Buttons */}
            <div className="flex items-center gap-3 justify-between sm:justify-end">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">Sort by</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
                >
                  <option value="popularity">ReVa Popularity</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="top-rated">Top Rated Specimens</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>

              {/* Layout styling preferences buttons */}
              <div className="flex items-center gap-1 border-l pl-3 border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setGridLayout(true)}
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${gridLayout ? 'bg-purple-50 text-brand-primary dark:bg-slate-800' : 'text-slate-400 hover:bg-slate-100'}`}
                  title="Grid Layout Grid"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setGridLayout(false)}
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${!gridLayout ? 'bg-purple-50 text-brand-primary dark:bg-slate-800' : 'text-slate-400 hover:bg-slate-100'}`}
                  title="List Layout rows"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Active Pills Display (Shows selected parameters for quick cancel) */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-mono text-[10px] uppercase">Active Targets:</span>
            <span className="rounded-full bg-slate-150 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {processedProducts.length} Specimens found
            </span>
            {selectedCategory !== 'All' && (
              <span className="rounded-full bg-purple-50 border border-brand-primary/20 px-2 py-0.5 text-[10px] font-semibold text-brand-primary flex items-center gap-1">
                Dept: {selectedCategory}
              </span>
            )}
            {selectedSubCat !== 'All' && (
              <span className="rounded-full bg-purple-50 border border-brand-primary/20 px-2 py-0.5 text-[10px] font-semibold text-brand-primary flex items-center gap-1">
                Type: {selectedSubCat}
              </span>
            )}
            {priceThreshold < 200000 && (
              <span className="rounded-full bg-amber-50 border border-brand-accent/20 px-2 py-0.5 text-[10px] font-semibold text-amber-600 flex items-center gap-1">
                Max Budget: {formatPrice(priceThreshold)}
              </span>
            )}
            {chosenBrands.length > 0 && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px]">Filter: Custom Brands</span>}
          </div>

          {/* Main Products catalog listing */}
          {processedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 rounded-3xl bg-white border border-dashed dark:bg-slate-900/10 dark:border-slate-800">
              <SlidersHorizontal className="h-10 w-10 text-slate-300 animate-pulse" />
              <div className="space-y-1">
                <h4 className="font-heading font-bold text-slate-800 dark:text-white">Hard Match Avoided</h4>
                <p className="text-xs text-slate-400 max-w-sm">No premium products in our active databases match your complex filters. Lower the threshold limits or reset keywords.</p>
              </div>
              <button
                onClick={resetAllFilters}
                className="rounded-full bg-brand-primary px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-brand-secondary transition-all cursor-pointer"
              >
                Reset All catalog parameters
              </button>
            </div>
          ) : gridLayout ? (
            /* 1. Grid layout */
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {processedProducts.map((product) => {
                const isSaved = isWishlisted(product.id);
                const isComp = isCompared(product.id);
                const discPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

                return (
                  <div
                    key={product.id}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-premium-xl dark:border-slate-800/80 dark:bg-slate-900/40 animate-in fade-in zoom-in-95 duration-200"
                  >
                    {/* Image Area */}
                    <div className="relative h-56 overflow-hidden bg-slate-50 dark:bg-slate-950">
                      <ImageWithFallback
                        src={product.images[0]}
                        alt={product.name}
                        category={product.category}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-104"
                      />

                      {/* Sale Badge */}
                      <span className="absolute top-2.5 left-2.5 rounded bg-brand-primary px-2 py-0.5 text-[9px] font-black uppercase text-white tracking-widest animate-pulse">
                        {discPercent}% OFF
                      </span>

                      {!product.inStock && (
                        <span className="absolute bottom-2.5 left-2.5 rounded bg-rose-500 px-2 py-0.5 text-[9px] font-bold uppercase text-white">
                          Sold Out
                        </span>
                      )}

                      {/* Float actions overlay */}
                      <div className="absolute inset-0 z-30 flex items-center justify-center gap-2 bg-black/10 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="rounded-full bg-white p-2 text-slate-800 shadow-lg hover:bg-brand-primary hover:text-white cursor-pointer"
                          title="Quick View specification details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => addToCart(product, 1, product.colors[0], product.sizes ? product.sizes[0] : undefined)}
                          className="rounded-full bg-white p-2 text-slate-800 shadow-lg hover:bg-brand-primary hover:text-white cursor-pointer"
                          title="Add to Shopping Cart"
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toggleCompare(product)}
                          className={`rounded-full p-2 shadow-lg transition-colors cursor-pointer ${isComp ? 'bg-amber-400 text-slate-950' : 'bg-white text-slate-800 hover:bg-brand-primary hover:text-white'}`}
                          title="Compare specifications"
                        >
                          <Scale className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toggleWishlist(product)}
                          className={`rounded-full p-2 shadow-all transition-colors cursor-pointer ${isSaved ? 'bg-rose-500 text-white' : 'bg-white text-slate-800 hover:bg-brand-primary hover:text-white'}`}
                        >
                          <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Information labels */}
                    <div className="flex flex-1 flex-col justify-between p-4 bg-white dark:bg-slate-900/60 text-left">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{product.category}</span>
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="block text-xs font-bold text-slate-850 dark:text-slate-100 hover:text-brand-primary transition-colors truncate w-full text-left cursor-pointer"
                        >
                          {product.name}
                        </button>
                        <div className="flex items-center gap-1">
                          <div className="flex text-amber-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`h-2.5 w-2.5 fill-current ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-slate-200 dark:text-slate-700'}`} />
                            ))}
                          </div>
                          <span className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 font-mono">{product.rating}</span>
                          <span className="text-[10px] text-slate-400">({product.reviewsCount} reviews)</span>
                        </div>
                      </div>

                      {/* Pricing block structured with Savings Indicator */}
                      <div className="flex flex-col text-left space-y-1 border-t border-slate-50 dark:border-slate-850 pt-3 mt-2.5">
                        <div className="text-[11px] text-slate-450 leading-none">
                          MRP: <span className="line-through font-mono text-slate-400">{formatPrice(product.originalPrice)}</span>
                        </div>
                        
                        <div className="flex items-baseline justify-between pt-0.5">
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

                        <div className="text-[9px] text-emerald-600 dark:text-emerald-450 font-bold bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded max-w-max mt-1">
                          Save: {formatPrice(product.originalPrice - product.price)}
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            /* 2. Structured list layout row by row */
            <div className="space-y-4">
              {processedProducts.map((product) => {
                const isSaved = isWishlisted(product.id);
                const isComp = isCompared(product.id);
                const discPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

                return (
                  <div
                    key={product.id}
                    className="flex flex-col sm:flex-row rounded-2xl border border-slate-100 bg-white p-4 shadow-sm hover:shadow-premium dark:border-slate-800 dark:bg-slate-900/60 animate-in fade-in transition-all text-left gap-4"
                  >
                    <ImageWithFallback src={product.images[0]} alt={product.name} category={product.category} className="h-32 w-32 shrink-0 rounded-xl object-cover" />
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{product.category}</span>
                          <span className="rounded bg-brand-primary/10 px-1.5 py-0.5 text-[8px] font-black text-brand-primary">SAVE {discPercent}%</span>
                        </div>
                        <button 
                          onClick={() => setSelectedProduct(product)}
                          className="block text-sm font-extrabold text-slate-850 hover:text-brand-primary transition-colors text-left"
                        >
                          {product.name}
                        </button>
                        <p className="text-xs text-slate-400 line-clamp-2 pr-4">{product.description}</p>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-medium text-slate-550 pt-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-current text-brand-accent" />
                          <span className="font-bold font-mono">{product.rating}</span>
                        </div>
                        <span>&bull;</span>
                        <span>{product.reviewsCount} owner testimonies</span>
                        <span>&bull;</span>
                        <span>Shades: {product.colors.join(', ')}</span>
                      </div>
                    </div>

                    {/* Right summary panel */}
                    <div className="w-full sm:w-44 shrink-0 flex flex-col justify-between border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 pt-3 sm:pt-0 sm:pl-4">
                      <div className="text-left space-y-1">
                        <p className="text-[10px] text-slate-400 block leading-none font-medium">Offer Price</p>
                        <p className="text-lg font-black text-brand-primary font-mono leading-tight">{formatPrice(product.price)}</p>
                        <p className="text-[10px] text-slate-400 line-through font-mono">MRP: {formatPrice(product.originalPrice)}</p>
                        <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">
                          Save {formatPrice(product.originalPrice - product.price)}
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4 sm:mt-0">
                        <button
                          onClick={() => addToCart(product, 1, product.colors[0], product.sizes ? product.sizes[0] : undefined)}
                          className="flex-1 rounded-lg bg-slate-900 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-white hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          Cart
                        </button>
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="flex-1 rounded-lg border border-slate-200 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-slate-805 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          Inspect
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </section>

      </div>

    </div>
  );
};
