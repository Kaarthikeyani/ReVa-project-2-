import React, { useState } from 'react';
import { useReVa } from '../context/ReVaContext';
import { Trash2, Heart, ArrowRight, ShieldCheck, Tag, X, ShoppingBag, Percent } from 'lucide-react';
import { formatPrice } from '../utils';
import { ImageWithFallback } from './ImageWithFallback';

export const CartView: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    toggleWishlist,
    isWishlisted,
    setActiveTab,
    appliedCoupon,
    applyCouponCode,
    removeAppliedCoupon,
    addNotification
  } = useReVa();

  const [couponCode, setCouponCode] = useState('');

  // Cart financial calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discountPercent) / 100 : 0;
  
  // Free shipping on baskets higher than ₹10,000
  const deliveryFee = subtotal > 10000 || subtotal === 0 ? 0 : 499;
  const luxuryTax = (subtotal - discountAmount) * 0.18; // 18% GST rate for elite marketplace items
  const grandTotal = subtotal - discountAmount + deliveryFee + luxuryTax;

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const success = applyCouponCode(couponCode);
    if (success) setCouponCode('');
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      addNotification('Your cart is empty. Explore products to add items!', 'danger');
      return;
    }
    setActiveTab('checkout');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 py-6 font-sans text-left">
      
      {/* Title */}
      <div className="space-y-1">
        <h2 className="font-heading text-2.5xl font-black text-slate-900 dark:text-white tracking-tight">
          Your Premium Shopping Cart
        </h2>
        <p className="text-xs text-slate-400">Review items, activate promotional codes, and checkout securely.</p>
      </div>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900/10 border border-dashed rounded-3xl space-y-4">
          <ShoppingBag className="h-12 w-12 text-slate-350 animate-pulse" />
          <div className="space-y-1 text-center">
            <h4 className="font-heading font-bold text-slate-800 dark:text-white">Active basket Empty</h4>
            <p className="text-xs text-slate-400 max-w-sm">You have not committed any luxury elements to your bucket yet. Explore the catalog to discover high-end releases.</p>
          </div>
          <button
            onClick={() => setActiveTab('shop')}
            className="rounded-full bg-brand-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-brand-secondary transition-all cursor-pointer"
          >
            Browse Premium elements
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          
          {/* Left Column: Cart items lists (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item, idx) => {
              const p = item.product;
              const discPercent = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
              const totalItemPrice = p.price * item.quantity;

              return (
                <div
                  key={`${p.id}-${item.selectedColor}-${item.selectedSize}`}
                  className="flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-850 dark:bg-slate-900/60"
                >
                  {/* Photo cover */}
                  <ImageWithFallback src={p.images[0]} alt={p.name} category={p.category} className="h-24 w-24 rounded-xl object-cover shrink-0" />

                  {/* Descriptions block */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">{p.category}</span>
                      <span className="rounded bg-brand-primary/10 px-1.5 py-0.5 text-[8px] font-black text-brand-primary">SAVE {discPercent}%</span>
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-850 dark:text-white truncate pr-4">{p.name}</h4>
                    
                    {/* Chosen variant tags */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-bold text-slate-500">
                      <span>Shade: <strong className="text-slate-855 dark:text-slate-350">{item.selectedColor}</strong></span>
                      {item.selectedSize && (
                        <>
                          <span>&bull;</span>
                          <span>Size: <strong className="text-slate-855 dark:text-slate-350">{item.selectedSize}</strong></span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls & Prices */}
                  <div className="flex items-center gap-6 justify-between sm:justify-end w-full sm:w-auto mt-4 sm:mt-0">
                    
                    {/* Quantity selectors */}
                    <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-1">
                      <button
                        onClick={() => updateCartQuantity(p.id, item.selectedColor, item.quantity - 1)}
                        className="h-7 w-7 rounded font-bold text-slate-650 hover:bg-slate-200 hover:text-slate-900 flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold font-mono text-slate-800 dark:text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(p.id, item.selectedColor, item.quantity + 1)}
                        className="h-7 w-7 rounded font-bold text-slate-650 hover:bg-slate-200 hover:text-slate-900 flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    {/* Singular Price & Total */}
                    <div className="text-right">
                      <p className="text-sm font-black text-brand-primary dark:text-purple-400 font-mono">{formatPrice(totalItemPrice)}</p>
                      <p className="text-[10px] text-slate-400 font-mono">MRP: {formatPrice(p.originalPrice * item.quantity)}</p>
                    </div>

                    {/* Trash & Wishlist icons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleWishlist(p)}
                        className={`rounded-lg p-2 transition-colors cursor-pointer ${
                          isWishlisted(p.id) ? 'bg-rose-50 text-rose-500' : 'text-slate-400 hover:bg-slate-50'
                        }`}
                        title="Move to Wishlist"
                      >
                        <Heart className={`h-4 w-4 ${isWishlisted(p.id) ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => removeFromCart(p.id, item.selectedColor)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-red-500 transition-colors cursor-pointer"
                        title="Remove specimen"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}

            {/* VIP assurances layout */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-850 dark:bg-slate-950/20 flex flex-col sm:flex-row items-center gap-4 text-xs">
              <ShieldCheck className="h-8 w-8 text-brand-accent shrink-0 animate-pulse" />
              <div>
                <h5 className="font-bold text-slate-800 dark:text-white">ReVa Vault Secure Checkout Guarantee</h5>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Your purchase assets are compiled securely under high AES-256 standard layers. Fully protected delivery schedules and 100% complimentary return guarantees accompany this buy-basket.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Financial Summaries & Coupons (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Promo Codes Application slot */}
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-850 dark:bg-slate-900/60">
              <h4 className="font-heading text-xs uppercase tracking-wider font-extrabold text-slate-805 dark:text-white mb-3 flex items-center gap-1.5">
                <Tag className="h-4 w-4 text-brand-primary" /> Promotional Discount Codes
              </h4>

              {appliedCoupon ? (
                <div className="flex items-center justify-between rounded-xl bg-orange-10/10 bg-brand-primary/10 border border-brand-primary/20 p-3 text-brand-primary dark:text-purple-300">
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 shrink-0" />
                    <div>
                      <p className="text-xs font-black font-mono tracking-wider">CODE: {appliedCoupon.code}</p>
                      <p className="text-[10px] text-slate-550 dark:text-slate-400">{appliedCoupon.discountPercent}% Discount Applied</p>
                    </div>
                  </div>
                  <button onClick={removeAppliedCoupon} className="text-slate-455 hover:text-slate-855">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCouponSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter REVAGOLD, FLASH25..."
                    className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-950 focus:outline-none focus:border-brand-primary"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-slate-900 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-slate-800 cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}

              <p className="text-[10px] text-slate-400 mt-2.5">
                *Coupons can decrease total subtotal margins by up to 25%. Try codes printed under the Deals tab!
              </p>
            </div>

            {/* Order Price Summaries */}
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-850 dark:bg-slate-900/60 space-y-4">
              <h4 className="font-heading text-xs uppercase tracking-wider font-extrabold text-slate-805 dark:text-white mb-1">
                Receipt Outline
              </h4>              <div className="space-y-2.5 text-xs">
                
                <div className="flex justify-between text-slate-550 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-mono">{formatPrice(subtotal)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-500 font-bold">
                     <span>Discount Card ({appliedCoupon.discountPercent}%)</span>
                     <span className="font-mono">-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-550 dark:text-slate-400">
                  <span>Shipping Fee</span>
                  <span className="font-mono text-right">
                    {deliveryFee === 0 ? <strong className="text-emerald-500 font-bold">FREE PREMIUM</strong> : formatPrice(deliveryFee)}
                  </span>
                </div>

                <div className="flex justify-between text-slate-550 dark:text-slate-400">
                  <span>Estimated GST (18%)</span>
                  <span className="font-mono">{formatPrice(luxuryTax)}</span>
                </div>

                <div className="border-t pt-3 flex justify-between font-extrabold text-slate-805 dark:text-white text-sm">
                  <span>Order Total</span>
                  <span className="font-mono text-brand-primary dark:text-purple-400">{formatPrice(grandTotal)}</span>
                </div>

              </div>

              {/* Progress CTA button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full rounded-xl bg-brand-primary py-3.5 text-center text-xs font-bold uppercase tracking-wider text-white shadow-premium hover:bg-brand-secondary active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => setActiveTab('shop')}
                className="w-full text-center text-xs font-bold text-slate-400 hover:text-brand-primary pt-2 block cursor-pointer"
              >
                Continue Browsing Catalog
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
