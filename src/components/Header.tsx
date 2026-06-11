import React, { useState } from 'react';
import { useReVa } from '../context/ReVaContext';
import { PRODUCTS } from '../data';
import { 
  Search, Heart, ShoppingCart, User, Moon, Sun, 
  Scale, Menu, X, ArrowRight, Sparkles, TrendingUp, History,
  Info, Mail, Gift, Percent, ExternalLink, HelpCircle
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    theme,
    toggleTheme,
    cart,
    wishlist,
    compareProducts,
    toggleCompare,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    setSelectedProduct,
    addNotification
  } = useReVa();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showCompareDrawer, setShowCompareDrawer] = useState(false);

  // Computed state
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const compareCount = compareProducts.length;

  const mockRecentSearches = ['Titanium Phone', 'Mulberry Silk', 'ANC Headphones'];
  const mockTrendingSearches = ['ChronoSync Pro Watch', 'Anti-Gravity Lamp', 'Nero Leather Bomber'];

  // Suggest matches on keyboard typing
  const suggestionMatches = searchQuery 
    ? PRODUCTS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))).slice(0, 5)
    : [];

  const handleSearchItemClick = (p: any) => {
    setSelectedProduct(p);
    setSearchFocused(false);
    setSearchQuery('');
  };

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    // Reset page parameters if needed
    if (tab === 'shop') {
      setSelectedCategory('All');
    }
  };

  const executeCategoryFilter = (cat: string) => {
    handleNavClick('shop');
    setSelectedCategory(cat);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-100/80 bg-white/80 backdrop-blur-md dark:border-slate-800/40 dark:bg-slate-900/85">
        <div className="mx-auto flex max-w-7xl h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleNavClick('home')} 
              className="group text-left cursor-pointer"
            >
              <h1 className="font-heading text-2xl font-black tracking-tight text-brand-primary dark:text-white flex items-center gap-1.5">
                <span>ReVa</span>
                <span className="inline-block h-2 w-2 rounded-full bg-brand-accent animate-pulse" />
              </h1>
              <p className="text-[9px] font-medium uppercase tracking-widest text-slate-400 group-hover:text-brand-primary transition-colors">
                Shop Smart. Live Better.
              </p>
            </button>
          </div>

          {/* Desktop Core Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { id: 'home', label: 'Home' },
              { id: 'shop', label: 'Shop' },
              { id: 'offers', label: 'Offers' },
              { id: 'about', label: 'About' },
              { id: 'contact', label: 'Contact' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative py-2 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === item.id 
                    ? 'text-brand-primary dark:text-white' 
                    : 'text-slate-500 hover:text-brand-primary dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full bg-brand-primary dark:bg-brand-accent transition-all duration-300" />
                )}
              </button>
            ))}
          </nav>

          {/* Smart Search Bar Container */}
          <div className="relative hidden lg:block w-72 xl:w-96">
            <div className={`flex items-center gap-2 rounded-full border px-4 py-2 transition-all ${
              searchFocused 
                ? 'border-brand-primary bg-white shadow-sm ring-2 ring-brand-secondary/15 dark:bg-slate-950/60' 
                : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/30'
            }`}>
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Product, brand, or tag..."
                className="w-full bg-transparent text-xs outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Smart Search Drawer overlay */}
            {searchFocused && (
              <div className="absolute top-12 left-0 z-50 w-full rounded-2xl border border-slate-100 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* Real-time search matches */}
                {searchQuery ? (
                  <div>
                    <h5 className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                      <Sparkles className="h-3 w-3 text-amber-500" /> Matches in Catalog
                    </h5>
                    {suggestionMatches.length === 0 ? (
                      <p className="text-xs text-slate-500 py-2">No matching prime products found.</p>
                    ) : (
                      <div className="space-y-1">
                        {suggestionMatches.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => handleSearchItemClick(p)}
                            className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                          >
                            <img src={p.images[0]} alt={p.name} className="h-9 w-9 rounded-md object-cover" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{p.name}</p>
                              <p className="text-[10px] text-brand-secondary font-mono">${p.price}</p>
                            </div>
                            <ArrowRight className="h-3 w-3 text-slate-300" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Trending keywords */}
                    <div>
                      <h5 className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                        <TrendingUp className="h-3.5 w-3.5 text-red-500" /> Dynamic Trending
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                        {mockTrendingSearches.map((term) => (
                          <button
                            key={term}
                            onClick={() => { setSearchQuery(term); handleNavClick('shop'); }}
                            className="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-brand-primary/5 hover:text-brand-primary dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Recent search items */}
                    <div>
                      <h5 className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                        <History className="h-3.5 w-3.5 text-slate-400" /> Recent Inquiries
                      </h5>
                      <div className="space-y-1.5">
                        {mockRecentSearches.map((term) => (
                          <button
                            key={term}
                            onClick={() => { setSearchQuery(term); handleNavClick('shop'); }}
                            className="flex w-full items-center gap-2.5 text-left text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-brand-primary"
                          >
                            <History className="h-3 w-3 text-slate-300" />
                            <span>{term}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Icons Panel */}
          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* Dark Mode switcher */}
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-brand-primary dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white cursor-pointer"
              aria-label="Toggle Theme Mode"
            >
              {theme === 'dark' ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5 text-brand-primary" />}
            </button>

            {/* Compare items cabinet trigger */}
            <div className="relative">
              <button
                onClick={() => setShowCompareDrawer(!showCompareDrawer)}
                className={`rounded-full p-2 transition-colors cursor-pointer ${
                  compareCount > 0 
                    ? 'bg-amber-50/50 text-amber-500 dark:bg-amber-950/10' 
                    : 'text-slate-500 hover:bg-slate-100 hover:text-brand-primary dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
                aria-label="Comparison Shelf"
              >
                <Scale className="h-4.5 w-4.5" />
                {compareCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-accent text-[9px] font-bold text-white shadow-gold animate-bounce">
                    {compareCount}
                  </span>
                )}
              </button>
            </div>

            {/* Wishlist item portal */}
            <button
              onClick={() => handleNavClick('dashboard')} // Wishlist is placed elegantly under Dashboard tabs
              className={`relative rounded-full p-2 transition-colors cursor-pointer ${
                wishlist.length > 0 
                  ? 'bg-rose-50/50 text-rose-500 dark:bg-rose-950/10' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-brand-primary dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
              aria-label="Wishlist Portal"
            >
              <Heart className="h-4.5 w-4.5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart portal */}
            <button
              onClick={() => handleNavClick('cart')}
              className={`relative rounded-full p-2 transition-colors cursor-pointer ${
                totalCartCount > 0 
                  ? 'bg-purple-100/50 text-brand-primary dark:bg-purple-950/10 dark:text-purple-300' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-brand-primary dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-4.5 w-4.5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-primary text-[9px] font-bold text-white shadow-sm">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Profile controller */}
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`flex items-center gap-1.5 rounded-full p-1 border hover:border-brand-primary hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 cursor-pointer ${
                activeTab === 'dashboard' ? 'border-brand-primary scale-105' : 'border-slate-200'
              }`}
              aria-label="User Account"
            >
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=64"
                alt="Profile Avatar"
                className="h-6 w-6 rounded-full object-cover"
              />
              <span className="hidden leading-none font-semibold text-xs text-slate-700 dark:text-slate-300 xl:inline-block pr-1">
                Connoisseur
              </span>
            </button>

            {/* Mobile menu grid */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-brand-primary dark:text-slate-400 dark:hover:bg-slate-800 md:hidden cursor-pointer"
              aria-label="Open Mobile Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile slide-down navigation menu */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-100/80 bg-white/95 p-4 shadow-xl dark:border-slate-800/40 dark:bg-slate-900/95 md:hidden space-y-4 animate-in fade-in slide-in-from-top-3 duration-200">
            {/* Mobile Search input */}
            <div className="relative">
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-800 dark:bg-slate-950/30">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Query products, tags..."
                  className="w-full bg-transparent text-xs outline-none text-slate-700 dark:text-slate-200"
                />
              </div>
              {searchQuery && (
                <div className="absolute top-11 left-0 z-50 w-full rounded-xl border bg-white p-3 shadow-lg dark:bg-slate-900 max-h-56 overflow-y-auto">
                  {suggestionMatches.map(p => (
                    <button
                      key={p.id}
                      onClick={() => { handleSearchItemClick(p); setMobileMenuOpen(false); }}
                      className="flex w-full items-center gap-2.5 p-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 text-xs"
                    >
                      <img src={p.images[0]} alt="" className="h-7 w-7 rounded object-cover" />
                      <span className="truncate flex-1 font-semibold dark:text-slate-200">{p.name}</span>
                      <span className="font-mono text-brand-secondary">${p.price}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Nav lists */}
            <nav className="flex flex-col gap-2">
              {[
                { id: 'home', label: 'Home' },
                { id: 'shop', label: 'Shop Catalog' },
                { id: 'offers', label: 'Coupons & Offers' },
                { id: 'about', label: 'About Our Story' },
                { id: 'contact', label: 'Contact Help Desk' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`rounded-lg px-4 py-3 text-sm font-semibold tracking-wide text-left transition-all cursor-pointer ${
                    activeTab === item.id 
                      ? 'bg-purple-50 text-brand-primary dark:bg-slate-800 dark:text-white' 
                      : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-850'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Compare Draw Panel Slide-out */}
      {showCompareDrawer && (
        <div id="compare-panel-drawer" className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-100 bg-white/95 p-5 shadow-2xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 animate-in slide-in-from-bottom-5 duration-300">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <div>
                <h4 className="font-heading text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                  <Scale className="h-4 w-4 text-brand-accent animate-pulse" /> Comparison Shelf ({compareCount}/3)
                </h4>
                <p className="text-[10px] text-slate-500">Cross-examine premium specifications before purchasing.</p>
              </div>
              <div className="flex items-center gap-3">
                {compareCount > 0 && (
                  <button 
                    onClick={() => {
                      // Trigger state change so we go to comparison section on some tab or quick action
                      handleNavClick('shop');
                      addNotification('Scroll catalog to see your comparisons highlights', 'info');
                    }}
                    className="rounded-full bg-brand-primary px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-secondary cursor-pointer"
                  >
                    View detailed specs
                  </button>
                )}
                <button
                  onClick={() => setShowCompareDrawer(false)}
                  className="rounded-full bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {compareCount === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <p className="text-xs font-medium text-slate-500">No premium items loaded. Tap the Compare scale symbol on any product card in the Shop!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {compareProducts.map((p) => (
                  <div key={p.id} className="relative flex items-center gap-3.5 rounded-xl border border-slate-100 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                    <img src={p.images[0]} alt={p.name} className="h-12 w-12 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{p.name}</p>
                      <p className="text-[10px] text-slate-400">{p.category} &bull; {p.subCategory}</p>
                      <p className="text-[11px] font-mono font-bold text-brand-secondary mt-0.5">${p.price}</p>
                    </div>
                    <button
                      onClick={() => toggleCompare(p)}
                      className="rounded-full p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/20 cursor-pointer"
                      title="Remove comparison"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
