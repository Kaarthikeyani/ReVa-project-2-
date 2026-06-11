import React, { useState } from 'react';
import { useReVa } from '../context/ReVaContext';
import { PRODUCTS } from '../data';
import { 
  User, Package, Heart, Bell, ShoppingCart, CheckCircle2, 
  MapPin, Clock, Edit3, ArrowRight, ShieldCheck, RefreshCw, X, Eye 
} from 'lucide-react';
import { formatPrice } from '../utils';
import { ImageWithFallback } from './ImageWithFallback';

export const DashboardView: React.FC = () => {
  const {
    userProfile,
    updateUserProfile,
    orders,
    wishlist,
    toggleWishlist,
    addToCart,
    notifications,
    dismissNotification,
    setSelectedProduct,
    addNotification
  } = useReVa();

  // Active dashboard tabs: 'orders' | 'profile' | 'wishlist' | 'notifications' | 'returns'
  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'profile' | 'wishlist' | 'notifications' | 'returns'>('orders');

  // Edit fields states
  const [editing, setEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: userProfile.name,
    email: userProfile.email,
    phone: userProfile.phone,
    address: userProfile.address,
    city: userProfile.city,
    postalCode: userProfile.postalCode
  });

  // Track Expanded Order Details index
  const [expandedOrderID, setExpandedOrderID] = useState<string | null>(null);

  // Return Scheduler state
  const [retrunForm, setReturnForm] = useState({
    orderId: '',
    reason: 'Incorrect Specimen',
    extraNotes: ''
  });
  const [returnSubmitted, setReturnSubmitted] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(profileForm);
    setEditing(false);
  };

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!retrunForm.orderId.trim()) {
      addNotification('Please enter a valid active order ID.', 'danger');
      return;
    }
    setReturnSubmitted(true);
    addNotification('Refund process initiated. Free courier pickup scheduled.', 'success');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 py-6 font-sans text-left">
      
      {/* Title */}
      <div className="space-y-1">
        <h2 className="font-heading text-2.5xl font-black text-slate-900 dark:text-white tracking-tight">
          Your Premium Concierge Dashboard
        </h2>
        <p className="text-xs text-slate-400">Manage orders, update secure addresses, and check active transit metrics.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        
        {/* Left Column: Dashboard Menu Rails (lg:col-span-3) */}
        <aside className="lg:col-span-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-850 dark:bg-slate-900/60 space-y-1">
          <div className="flex items-center gap-3.5 border-b pb-4 mb-4">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"
              alt="Avatar"
              className="h-12 w-12 rounded-full object-cover border-2 border-brand-primary"
            />
            <div className="min-w-0">
              <h4 className="text-xs font-black text-slate-850 dark:text-white truncate">{userProfile.name}</h4>
              <p className="text-[10px] text-slate-400 font-mono">Premium VIP Member</p>
            </div>
          </div>

          {[
            { id: 'orders', label: 'Order Histories', count: orders.length, icon: <Package className="h-4 w-4" /> },
            { id: 'profile', label: 'Billing Coordinates', icon: <User className="h-4 w-4" /> },
            { id: 'wishlist', label: 'My Saved Items', count: wishlist.length, icon: <Heart className="h-4 w-4" /> },
            { id: 'notifications', label: 'Security Notices', count: notifications.length, icon: <Bell className="h-4 w-4" /> },
            { id: 'returns', label: 'Returns & Refunds', icon: <RefreshCw className="h-4 w-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id as any);
                setReturnSubmitted(false);
              }}
              className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === tab.id
                  ? 'bg-purple-50 text-brand-primary dark:bg-slate-800 dark:text-white'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {tab.icon}
                <span>{tab.label}</span>
              </div>
              {tab.count !== undefined && tab.count > 0 && (
                <span className="rounded-full bg-brand-primary px-2 py-0.5 text-[9px] font-bold text-white">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </aside>

        {/* Right Column: Workboards (lg:col-span-9) */}
        <main className="lg:col-span-9 bg-white p-6 shadow-sm border border-slate-100 dark:border-slate-850 dark:bg-slate-900/60 rounded-2xl min-h-96">
          
          {/* TAB 1: ORDER HISTORIES & PROGRESS TRACKER */}
          {activeSubTab === 'orders' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b pb-3 flex justify-between items-baseline mb-2">
                <h3 className="font-heading text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">
                  Active Sourcing & Ledger History
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">Real-time status synced</span>
              </div>

              {orders.length === 0 ? (
                <p className="text-xs text-slate-500 py-10 text-center">You have placed zero e-commerce orders. Fill your cart and checkout!</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((o) => {
                    const expanded = expandedOrderID === o.id;

                    return (
                      <div key={o.id} className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                        
                        {/* Summary Bar */}
                        <div 
                          onClick={() => setExpandedOrderID(expanded ? null : o.id)}
                          className="flex flex-wrap items-center justify-between bg-slate-50/50 dark:bg-slate-950/20 p-4 cursor-pointer hover:bg-slate-50/80 transition-all"
                        >
                          <div className="flex items-center gap-4 text-xs font-bold">
                            <span className="font-mono text-brand-secondary">{o.id}</span>
                            <span className="text-slate-400 font-normal">{o.date}</span>
                          </div>
                          
                          <div className="flex items-center gap-6">
                            <span className="font-mono text-xs font-black text-slate-800 dark:text-white">{formatPrice(o.total)}</span>
                            <span className={`rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-wider ${
                              o.status === 'Delivered' 
                                ? 'bg-emerald-50 text-emerald-500 border border-emerald-250 dark:bg-emerald-950/25' 
                                : 'bg-purple-50 text-brand-primary border border-purple-250 dark:bg-purple-950/25 dark:text-purple-300'
                            }`}>
                              {o.status}
                            </span>
                          </div>
                        </div>

                        {/* Expandable Shipment Details and Tracking Paths */}
                        {expanded && (
                          <div className="p-5 border-t border-slate-100 dark:border-slate-800 space-y-5 animate-in slide-in-from-top-2 duration-150">
                            
                            {/* Horizontal tracking stages */}
                            <div>
                              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-3">Live Sourcing Track Steps</p>
                              
                              <div className="relative flex items-center justify-between max-w-xl mx-auto px-4 py-2 bg-slate-50 rounded-xl dark:bg-slate-950/40">
                                
                                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0 mx-8" />
                                <div 
                                  className="absolute top-1/2 left-0 h-0.5 bg-brand-primary -translate-y-1/2 z-0 mx-8 transition-all" 
                                  style={{ width: `${((o.trackingStep - 1) / 3) * 100}%` }}
                                />

                                {[
                                  { s: 1, label: 'Secured' },
                                  { s: 2, label: 'Vetted' },
                                  { s: 3, label: 'In Transit' },
                                  { s: 4, label: 'Delivered' }
                                ].map((node) => (
                                  <div key={node.s} className="relative z-10 flex flex-col items-center">
                                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                                      o.trackingStep >= node.s 
                                        ? 'bg-brand-primary text-white border-brand-primary' 
                                        : 'bg-white border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700'
                                    }`}>
                                      {node.s}
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wide">{node.label}</span>
                                  </div>
                                ))}

                              </div>
                            </div>

                            {/* Expended Items display */}
                            <div className="space-y-2">
                              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Specimen Ledger</p>
                              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                {o.items.map((i, idx) => (
                                  <div key={idx} className="flex items-center gap-3 bg-white border border-slate-100 p-2 rounded-xl dark:border-slate-850">
                                    <ImageWithFallback src={i.image} alt="" className="h-9 w-9 rounded object-cover" />
                                    <div className="min-w-0 flex-1 text-xs text-left">
                                      <p className="font-extrabold text-slate-800 dark:text-slate-100 truncate">{i.productName}</p>
                                      <p className="text-[10px] text-slate-400">Quantity: {i.quantity} &bull; Price: {formatPrice(i.price)}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Additional metrics */}
                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div>
                                <p className="text-slate-400">Payout Method used:</p>
                                <p className="font-semibold text-slate-800 dark:text-slate-350">{o.payoutMethod}</p>
                              </div>
                              <div>
                                <p className="text-slate-400">Shipping Delivery Target:</p>
                                <p className="font-semibold text-slate-800 dark:text-slate-350">
                                  {o.address.street}, {o.address.city}, {o.address.postalCode}
                                </p>
                              </div>
                            </div>

                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BILLING COORDINATES */}
          {activeSubTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b pb-3 flex justify-between items-baseline mb-2">
                <h3 className="font-heading text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">
                  Billing Coordinates & Personal profile
                </h3>
                <button
                  onClick={() => setEditing(!editing)}
                  className="text-xs font-bold text-brand-primary flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Edit3 className="h-3.5 w-3.5" /> {editing ? 'Cancel edit' : 'Edit coordinates'}
                </button>
              </div>

              {editing ? (
                <form onSubmit={handleProfileSave} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Full Legal Name</label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Contact Email</label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Telephone Line</label>
                      <input
                        type="text"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 text-left"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Postal/Zip Code</label>
                      <input
                        type="text"
                        value={profileForm.postalCode}
                        onChange={(e) => setProfileForm({ ...profileForm, postalCode: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Courier Delivery Address</label>
                    <input
                      type="text"
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">City coordinates</label>
                    <input
                      type="text"
                      value={profileForm.city}
                      onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800"
                    />
                  </div>

                  <button
                    type="submit"
                    className="rounded-full bg-slate-900 border text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-slate-800 cursor-pointer"
                  >
                    Commit Address Update
                  </button>
                </form>
              ) : (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-xl dark:bg-slate-950/20">
                      <p className="text-slate-400 uppercase tracking-widest text-[9px] font-bold">VIP Account profile</p>
                      <p className="font-bold text-slate-800 dark:text-slate-200 mt-1">{userProfile.name}</p>
                      <p className="text-slate-500 font-mono text-[10px]">{userProfile.email}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl dark:bg-slate-950/20">
                      <p className="text-slate-400 uppercase tracking-widest text-[9px] font-bold">Assigned Telephone</p>
                      <p className="font-bold text-slate-800 dark:text-slate-200 mt-1">{userProfile.phone}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl dark:bg-slate-950/20">
                    <p className="text-slate-400 uppercase tracking-widest text-[9px] font-bold flex items-center gap-1 mb-1">
                      <MapPin className="h-3.5 w-3.5 text-brand-primary" /> Core Sourcing target Address
                    </p>
                    <p className="font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                      {userProfile.address}, {userProfile.city} - {userProfile.postalCode}
                    </p>
                  </div>

                  {/* Trust badge */}
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 justify-center">
                    <ShieldCheck className="h-4 w-4 text-brand-accent pr-0.5" /> End-to-end payment encryption parameters active.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WISHLIST GRIDS */}
          {activeSubTab === 'wishlist' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b pb-3 flex justify-between mb-2">
                <h3 className="font-heading text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">
                  Personally saved items Wishlist ({wishlist.length})
                </h3>
              </div>

              {wishlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-3">
                  <Heart className="h-10 w-10 text-slate-300" />
                  <p className="text-xs text-slate-500">Your wishlist drawer is empty. Browse the catalogs to save elements.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {wishlist.map((p) => (
                    <div key={p.id} className="relative group rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden text-xs">
                      
                      {/* Photo */}
                      <div className="relative h-40 overflow-hidden bg-slate-50">
                        <ImageWithFallback src={p.images[0]} alt="" category={p.category} className="h-full w-full object-cover transition-transform group-hover:scale-103" />
                        <button 
                          onClick={() => toggleWishlist(p)}
                          className="absolute top-2 right-2 rounded-full bg-white p-1 text-rose-500 shadow-sm cursor-pointer"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Info & Actions */}
                      <div className="p-3 bg-white text-left space-y-1">
                        <p className="font-bold text-slate-800 truncate">{p.name}</p>
                        <p className="font-mono text-xs font-black text-brand-secondary">{formatPrice(p.price)}</p>
                        
                        <div className="pt-2 flex gap-1">
                          <button
                            onClick={() => setSelectedProduct(p)}
                            className="flex-1 rounded bg-slate-100 p-1.5 flex justify-center hover:bg-slate-200 text-[10px] font-bold uppercase transition-colors cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => addToCart(p, 1, p.colors[0], p.sizes ? p.sizes[0] : undefined)}
                            className="flex-1 rounded bg-brand-primary p-1.5 text-white flex justify-center hover:bg-brand-secondary text-[10px] font-bold uppercase transition-colors cursor-pointer"
                          >
                            <ShoppingCart className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SYSTEM NOTICES CENTRE */}
          {activeSubTab === 'notifications' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b pb-3 flex justify-between mb-2">
                <h3 className="font-heading text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">
                  Security notifications log ({notifications.length})
                </h3>
              </div>

              {notifications.length === 0 ? (
                <p className="text-xs text-slate-400 py-10 text-center">Zero dynamic alert notices logged during this session.</p>
              ) : (
                <div className="space-y-3.5">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-xs leading-relaxed border ${
                        n.type === 'success'
                          ? 'bg-emerald-50/50 border-emerald-500/20 text-emerald-600'
                          : 'bg-purple-50/20 border-brand-primary/20 text-brand-primary'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>{n.text}</span>
                      </div>
                      <button onClick={() => dismissNotification(n.id)} className="text-slate-400 hover:text-slate-600">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: REFUND SCHEDULERS */}
          {activeSubTab === 'returns' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b pb-3 flex justify-between mb-2">
                <h3 className="font-heading text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">
                  Complimentary returns portal
                </h3>
              </div>

              {returnSubmitted ? (
                <div className="text-center py-10 space-y-4">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto animate-bounce" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800">Refund processing match started</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                      Your return application has been registered. An authorized ReVa concierge vehicle will collect the package from your target address in Silicon Valley within 24 business hours. No printed labels required.
                    </p>
                  </div>
                  <button
                    onClick={() => setReturnSubmitted(false)}
                    className="rounded-full bg-slate-900 border text-white px-5 py-2 text-xs font-bold uppercase transition-all"
                  >
                    Register another returns parcel
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReturnSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Order Tracking ID</label>
                    <input
                      type="text"
                      value={retrunForm.orderId}
                      onChange={(e) => setReturnForm({ ...retrunForm, orderId: e.target.value })}
                      placeholder="e.g. RV-9048-2026"
                      className="w-full rounded-xl border border-slate-204 bg-slate-50 px-4 py-2.5 outline-none focus:border-brand-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Return Reason</label>
                    <select
                      value={retrunForm.reason}
                      onChange={(e) => setReturnForm({ ...retrunForm, reason: e.target.value })}
                      className="w-full rounded-xl border border-slate-204 bg-slate-50 px-3 py-2.5 outline-none focus:border-brand-primary"
                    >
                      <option value="Incorrect Specimen">Incorrect Specimen color/size</option>
                      <option value="Change of Mind">Change of mental focus</option>
                      <option value="Material Inequity">Material finish differs from photo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Additional description</label>
                    <textarea
                      value={retrunForm.extraNotes}
                      onChange={(e) => setReturnForm({ ...retrunForm, extraNotes: e.target.value })}
                      placeholder="Please details physical feedback..."
                      className="w-full rounded-xl border border-slate-204 bg-slate-50 px-4 py-2.5 outline-none focus:border-brand-primary h-24"
                    />
                  </div>

                  <button
                    type="submit"
                    className="rounded-full bg-slate-900 border text-white px-6 py-2.5 text-xs font-bold uppercase hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Acquire Free Dispatch Label & Pickup
                  </button>
                </form>
              )}
            </div>
          )}

        </main>

      </div>

    </div>
  );
};
