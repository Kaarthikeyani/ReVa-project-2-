/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ReVaProvider, useReVa } from './context/ReVaContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { ShopView } from './components/ShopView';
import { CartView } from './components/CartView';
import { CheckoutView } from './components/CheckoutView';
import { DashboardView } from './components/DashboardView';
import { AboutView, ContactView, FAQView, OffersView } from './components/UtilityViews';
import { ProductDetailModal } from './components/ProductDetailModal';
import { LiveChatWidget } from './components/LiveChatWidget';
import { HelpCircle, Bell, X, Sparkles, CheckCircle2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, notifications, dismissNotification } = useReVa();

  // Route selector matching active tab state
  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'shop':
        return <ShopView />;
      case 'cart':
        return <CartView />;
      case 'checkout':
        return <CheckoutView />;
      case 'dashboard':
        return <DashboardView />;
      case 'offers':
        return <OffersView />;
      case 'about':
        return <AboutView />;
      case 'contact':
        return <ContactView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden transition-colors duration-300 dark:bg-slate-950">
      
      {/* 1. Header Sticky panel */}
      <Header />

      {/* 2. Main content viewport section */}
      <main className="flex-grow pt-4">
        {renderActiveView()}
      </main>

      {/* 3. Supplementary Quick Support navigation triggers floating panel (Desktop only) */}
      <div id="supplementary-utility-trigger" className="hidden lg:flex fixed left-6 bottom-6 z-40 flex-col gap-2">
        <button
          onClick={() => setActiveTab('about')}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 shadow-md hover:border-brand-primary hover:text-brand-primary dark:bg-slate-900 dark:border-slate-800 transition-all scale-95 hover:scale-105 cursor-pointer"
          title="About ReVa Platform"
        >
          <Sparkles className="h-4 w-4 text-brand-accent pr-0.5" />
        </button>
      </div>

      {/* 4. Footer component */}
      <Footer />

      {/* 5. Central specification modal overlay */}
      <ProductDetailModal />

      {/* 6. Concierge live chat widget */}
      <LiveChatWidget />

      {/* 7. Toast Notifications Overlay (Floating bottom left) */}
      <div 
        id="toast-notification-system" 
        className="fixed bottom-6 left-6 z-50 flex flex-col gap-3 max-w-sm pointer-events-none"
      >
        {notifications.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-2xl border bg-white p-4.5 shadow-xl min-w-80 dark:bg-slate-900 animate-in slide-in-from-left-6 fade-in duration-300 ${
              toast.type === 'danger'
                ? 'border-red-200 text-red-650 dark:border-red-950/20 dark:text-red-400'
                : toast.type === 'info'
                  ? 'border-purple-200 text-brand-primary dark:border-purple-950/20 dark:text-purple-300'
                  : 'border-emerald-200 text-emerald-650 dark:border-emerald-950/20 dark:text-emerald-400'
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === 'danger' ? (
                <X className="h-4.5 w-4.5 shrink-0 text-red-500 rounded-full bg-red-100 p-0.5" />
              ) : toast.type === 'info' ? (
                <Sparkles className="h-4.5 w-4.5 shrink-0 text-brand-primary rounded-full bg-purple-100/40 p-0.5 animate-pulse" />
              ) : (
                <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-500 rounded-full bg-emerald-100 p-0.5" />
              )}
              <span className="text-xs font-bold leading-normal tracking-wide">{toast.text}</span>
            </div>
            <button
              onClick={() => dismissNotification(toast.id)}
              className="rounded-full p-1 text-slate-350 hover:bg-slate-100 hover:text-slate-600 cursor-pointer shrink-0"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default function App() {
  return (
    <ReVaProvider>
      <AppContent />
    </ReVaProvider>
  );
}
