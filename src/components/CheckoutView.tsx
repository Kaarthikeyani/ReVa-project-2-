import React, { useState } from 'react';
import { useReVa } from '../context/ReVaContext';
import { CreditCard, Truck, ShieldCheck, MapPin, Receipt, ArrowLeft, ArrowRight, CheckCircle2, Lock, Sparkles, Send } from 'lucide-react';
import { formatPrice } from '../utils';
import { ImageWithFallback } from './ImageWithFallback';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    placeOrder,
    userProfile,
    updateUserProfile,
    appliedCoupon,
    setActiveTab,
    addNotification
  } = useReVa();

  // Active step state (1 to 4)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Shipping states
  const [shippingDetails, setShippingDetails] = useState({
    name: userProfile.name,
    email: userProfile.email,
    phone: userProfile.phone,
    address: userProfile.address,
    city: userProfile.city,
    postalCode: userProfile.postalCode
  });

  // Step 2: Delivery method states
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express' | 'vault'>('standard');

  // Step 3: Payment details states
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'wallet' | 'cod'>('card');
  const [cardDetails, setCardDetails] = useState({
    number: '4111 2222 3333 4444',
    name: 'RESHMA G.',
    expiry: '12/29',
    cvv: '108'
  });
  const [upiAddress, setUpiAddress] = useState('reshma@okreva');

  // Pricing calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discountPercent) / 100 : 0;
  
  // Delivery charges depend on speed chosen
  const getDeliveryFee = () => {
    if (deliveryMethod === 'standard') {
      return subtotal > 10000 || subtotal === 0 ? 0 : 499;
    }
    if (deliveryMethod === 'express') return 1299;
    return 3499; // Premium Safe Vault delivery
  };

  const deliveryFee = getDeliveryFee();
  const luxuryTax = (subtotal - discountAmount) * 0.18; // 18% GST rate for premium goods
  const grandTotal = subtotal - discountAmount + deliveryFee + luxuryTax;

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!shippingDetails.name || !shippingDetails.address || !shippingDetails.city || !shippingDetails.postalCode) {
        addNotification('Please compile all required address fields before moving forward.', 'danger');
        return;
      }
      // Save profile updates to storage
      updateUserProfile(shippingDetails);
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handCheckoutSubmit = () => {
    const payoutLabel = paymentMethod === 'card' ? 'Credit Card' : paymentMethod === 'upi' ? `UPI (${upiAddress})` : paymentMethod === 'wallet' ? 'PayPal Wallet' : 'Cash on Delivery';
    
    // Dispatch to context state
    const placedOrderObj = placeOrder(shippingDetails, payoutLabel, deliveryFee, 0.18);
    
    // Send feedback notification
    addNotification(`Order ${placedOrderObj.id} processed! VIP tracking activated.`, 'success');
    
    // Redirect user directly to user dashboard and select order tracking tab
    setActiveTab('dashboard');
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10 py-6 font-sans text-left">
      
      {/* Title */}
      <div className="flex items-center gap-3">
        <button 
          onClick={handlePrevStep}
          disabled={currentStep === 1}
          className="rounded-full border border-slate-200 p-2 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 text-slate-505" />
        </button>
        <div>
          <h2 className="font-heading text-2.5xl font-black text-slate-900 dark:text-white tracking-tight">
            Premium Verification Core ({currentStep} of 4)
          </h2>
          <p className="text-xs text-slate-400">Step through our high-security compliance portal to commit transactions.</p>
        </div>
      </div>

      {/* Dynamic Multi-Step Progress Tracker Nodes */}
      <div className="relative flex items-center justify-between max-w-3xl mx-auto px-4 sm:px-12 py-3 bg-slate-50 rounded-2xl dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850">
        
        {/* Background connect lines */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0 mx-10 sm:mx-20" />
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-brand-primary -translate-y-1/2 z-0 mx-10 sm:mx-20 transition-all duration-300" 
          style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
        />

        {[
          { step: 1, label: 'Address', icon: <MapPin className="h-4 w-4" /> },
          { step: 2, label: 'Transit', icon: <Truck className="h-4 w-4" /> },
          { step: 3, label: 'Secured Pay', icon: <CreditCard className="h-4 w-4" /> },
          { step: 4, label: 'Receipt Vetting', icon: <Receipt className="h-4 w-4" /> }
        ].map((node) => (
          <div key={node.step} className="relative z-10 flex flex-col items-center gap-1">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-all border ${
              currentStep === node.step 
                ? 'bg-brand-primary text-white border-brand-primary scale-108 shadow-premium' 
                : currentStep > node.step 
                  ? 'bg-emerald-500 text-white border-emerald-500' 
                  : 'bg-white border-slate-200 text-slate-405 dark:bg-slate-900 dark:border-slate-800'
            }`}>
              {currentStep > node.step ? <CheckCircle2 className="h-4.5 w-4.5" /> : node.icon}
            </div>
            <span className={`text-[10px] sm:text-xs font-bold tracking-tight ${
              currentStep === node.step ? 'text-brand-primary' : 'text-slate-400'
            }`}>
              {node.label}
            </span>
          </div>
        ))}
      </div>

      {cart.length === 0 && currentStep < 4 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900/10 border border-dashed rounded-2xl">
          <p className="text-sm font-semibold text-slate-403">Basket holds zero items. Please return to the catalog.</p>
          <button onClick={() => setActiveTab('shop')} className="mt-4 rounded-full bg-brand-primary px-5 py-2 text-xs font-bold text-white uppercase cursor-pointer">
            Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          
          {/* Left Column: Configurable form depending on step (lg:col-span-8) */}
          <div className="lg:col-span-8 bg-white p-6 shadow-sm border border-slate-100 dark:border-slate-850 dark:bg-slate-900/60 rounded-2xl">
            
            {/* STEP 1: SHIPPING ADDRESS FORMS */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-205">
                <h3 className="font-heading text-sm font-extrabold text-slate-805 dark:text-white border-b pb-2">
                  1. Secure Shipping Coordinates
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      value={shippingDetails.name}
                      onChange={(e) => setShippingDetails({ ...shippingDetails, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Secure Contact Email</label>
                    <input
                      type="email"
                      value={shippingDetails.email}
                      onChange={(e) => setShippingDetails({ ...shippingDetails, email: e.target.value })}
                      placeholder="jane.doe@example.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Authorized Telephone</label>
                    <input
                      type="text"
                      value={shippingDetails.phone}
                      onChange={(e) => setShippingDetails({ ...shippingDetails, phone: e.target.value })}
                      placeholder="+1 (415) 384-9018"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Zip/Postal Code</label>
                    <input
                      type="text"
                      value={shippingDetails.postalCode}
                      onChange={(e) => setShippingDetails({ ...shippingDetails, postalCode: e.target.value })}
                      placeholder="94025"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Courier Delivery Address</label>
                  <input
                    type="text"
                    value={shippingDetails.address}
                    onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                    placeholder="742 Platinum Avenue"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Corporate City</label>
                  <input
                    type="text"
                    value={shippingDetails.city}
                    onChange={(e) => setShippingDetails({ ...shippingDetails, city: e.target.value })}
                    placeholder="Silicon Valley"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-primary"
                  />
                </div>

              </div>
            )}

            {/* STEP 2: TRANSIT SELECTIONS */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in duration-205">
                <h3 className="font-heading text-sm font-extrabold text-slate-805 dark:text-white border-b pb-2">
                  2. Priority Transit Tiers
                </h3>

                <div className="space-y-3">
                  
                  {[
                    {
                      id: 'standard',
                      title: 'Standard Courier Line',
                      desc: 'Monitored regular delivery dispatch via local high priority lines. Reaches your door in 2-3 business days.',
                      fee: subtotal > 10000 ? 'COMPLIMENTARY' : formatPrice(499)
                    },
                    {
                      id: 'express',
                      title: 'Overnight Air Priority',
                      desc: 'Instant specialized sorting. Placed directly on priority next-day cargo flights to secure zero delivery delay.',
                      fee: formatPrice(1299)
                    },
                    {
                      id: 'vault',
                      title: 'Secure Certified Vault Escort',
                      desc: 'Handover executed in custom locked aluminum cases via private security cars with mandatory biometric validation.',
                      fee: formatPrice(3499)
                    }
                  ].map((tier) => (
                    <label
                      key={tier.id}
                      className={`flex items-start gap-4 rounded-xl border p-4 transition-all cursor-pointer ${
                        deliveryMethod === tier.id
                          ? 'border-brand-primary bg-purple-50/20 shadow-sm'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="del"
                        checked={deliveryMethod === tier.id}
                        onChange={() => setDeliveryMethod(tier.id as any)}
                        className="mt-1 accent-brand-primary"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-baseline mb-1">
                          <p className="font-bold text-xs text-slate-850 dark:text-slate-100">{tier.title}</p>
                          <span className="text-xs font-bold text-brand-secondary font-mono">{tier.fee}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{tier.desc}</p>
                      </div>
                    </label>
                  ))}

                </div>
              </div>
            )}

            {/* STEP 3: SECURE PAYMENTS */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in duration-205">
                <h3 className="font-heading text-sm font-extrabold text-slate-805 dark:text-white border-b pb-2">
                  3. Encrypted Compliance Payments
                </h3>

                {/* Switch list */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'card', label: 'Credit Card' },
                    { id: 'upi', label: 'UPI Sync' },
                    { id: 'wallet', label: 'PayPal' },
                    { id: 'cod', label: 'Cash on Del.' }
                  ].map((pMode) => (
                    <button
                      key={pMode.id}
                      onClick={() => setPaymentMethod(pMode.id as any)}
                      className={`rounded-xl border p-3 font-semibold text-xs tracking-wide transition-all cursor-pointer ${
                        paymentMethod === pMode.id
                          ? 'bg-slate-900 border-slate-900 text-white shadow'
                          : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                      }`}
                    >
                      {pMode.label}
                    </button>
                  ))}
                </div>

                {/* Mode Form Renderings */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-950/20 dark:border-slate-850">
                  
                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b pb-2 mb-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">PCI DSS Compliance Layer</span>
                        <Lock className="h-4 w-4 text-emerald-500 hover:scale-105 animate-pulse" />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Cardholder Legal Name</label>
                        <input
                          type="text"
                          value={cardDetails.name}
                          onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                          className="w-full rounded-lg border bg-white px-3.5 py-2 text-xs text-slate-800 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Raw Card Number</label>
                        <input
                          type="text"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                          className="w-full rounded-lg border bg-white px-3.5 py-2 text-xs text-slate-820 outline-none font-mono tracking-wider"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Expiry Date</label>
                          <input
                            type="text"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                            className="w-full rounded-lg border bg-white px-3.5 py-2 text-xs text-slate-800 outline-none font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Security code CVV</label>
                          <input
                            type="password"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                            className="w-full rounded-lg border bg-white px-3.5 py-2 text-xs text-slate-800 outline-none font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'upi' && (
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-slate-700">Enter Unified Payments Interface ID (UPI ID)</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={upiAddress}
                          onChange={(e) => setUpiAddress(e.target.value)}
                          placeholder="reshma@okaxis"
                          className="flex-1 rounded-lg border bg-white px-4 py-2.5 text-xs text-slate-802 focus:outline-none"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400">
                        *An immediate transaction verification link will populate inside your authorized mobile app.
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'wallet' && (
                    <div className="space-y-2 py-4 flex flex-col items-center">
                      <p className="text-xs text-slate-500">Fast checkout sync via PayPal wallet credentials.</p>
                      <button className="rounded-lg bg-amber-400 px-6 py-2 text-xs font-black text-slate-900 cursor-pointer">
                        Sync PayPal Wallet
                      </button>
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <div className="space-y-1 text-left">
                      <p className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Secure Cash on Delivery Authorized
                      </p>
                      <p className="text-[11px] text-slate-400 pr-4 mt-1">
                        We accept physical cash notes at delivery. Please authenticate secure receipts upon parcel collection. Secure Vault Escorts do not qualify for cash on delivery.
                      </p>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* STEP 4: ORDER RECEIPTS REVIEW */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in duration-205">
                <div className="text-center py-4 space-y-1">
                  <Sparkles className="h-8 w-8 text-amber-500 mx-auto animate-bounce" />
                  <h3 className="font-heading text-lg font-black text-slate-905 dark:text-white">
                    Finalize Transaction Vetting
                  </h3>
                  <p className="text-xs text-slate-400">Review your compiled delivery schedules before routing to vault matching.</p>
                </div>

                <div className="border border-slate-100 rounded-2xl p-4 dark:border-slate-805 space-y-3 bg-slate-50/50 dark:bg-slate-950/20">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider font-mono">Recipient Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <p className="text-slate-400">Shipment Target: <strong className="text-slate-700 dark:text-slate-350">{shippingDetails.name}</strong></p>
                    <p className="text-slate-400">Contact Telephone: <strong className="text-slate-700 dark:text-slate-350">{shippingDetails.phone}</strong></p>
                    <p className="text-slate-400">Full Destination Address: <strong className="text-slate-700 dark:text-slate-350">{shippingDetails.address}, {shippingDetails.city}, {shippingDetails.postalCode}</strong></p>
                    <p className="text-slate-400">Payment Routing: <strong className="text-slate-700 dark:text-slate-350 capitalize">{paymentMethod}</strong></p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider font-mono">Assigned Specimens ({cart.length})</h4>
                  <div className="space-y-2">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex items-center gap-3 bg-white border border-slate-100 p-2 rounded-xl dark:border-slate-850">
                        <ImageWithFallback src={item.product.images[0]} alt="" category={item.product.category} className="h-10 w-10 rounded object-cover" />
                        <div className="min-w-0 flex-1 text-xs">
                          <p className="font-extrabold text-slate-800 truncate dark:text-slate-200">{item.product.name}</p>
                          <p className="text-[10px] text-slate-400">Qty: {item.quantity} &bull; Shade: {item.selectedColor}</p>
                        </div>
                        <span className="font-mono text-xs font-extrabold text-brand-secondary pr-1">{formatPrice(item.product.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Next / Previous controllers */}
            <div className="mt-8 flex justify-between border-t pt-4 border-slate-100 dark:border-slate-800">
              <button
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-650 disabled:opacity-30 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" /> Go back
              </button>

              {currentStep < 4 ? (
                <button
                  onClick={handleNextStep}
                  className="rounded-xl bg-slate-900 text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Continue Step</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handCheckoutSubmit}
                  className="rounded-xl bg-brand-primary text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-brand-secondary flex items-center gap-1.5 shadow-premium cursor-pointer"
                >
                  <ShieldCheck className="h-4 w-4 text-amber-300" />
                  <span>Commit Secure Transaction</span>
                </button>
              )}
            </div>

          </div>

          {/* Right Column: Mini Financial Receipt (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-850 dark:bg-slate-900/60">
              <h3 className="font-heading text-xs uppercase tracking-wider font-extrabold text-slate-800 mb-3 border-b pb-1">
                Security summary
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Cart Items</span>
                  <span className="font-mono">{formatPrice(subtotal)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-500 font-bold">
                    <span>Discount Code ({appliedCoupon.code})</span>
                    <span className="font-mono">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Priority Transit Fee</span>
                  <span className="font-mono">{deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>GST (18%)</span>
                  <span className="font-mono">{formatPrice(luxuryTax)}</span>
                </div>

                <div className="border-t pt-3 flex justify-between font-extrabold text-slate-800 dark:text-white text-sm">
                  <span>Secured Total</span>
                  <span className="font-mono text-brand-secondary">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Encryption indicators */}
              <div className="flex items-center gap-2 pt-4 justify-center text-[10px] text-emerald-600 font-bold font-mono">
                <ShieldCheck className="h-4 w-4" /> Secure SSL 256-Bit Verification
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
