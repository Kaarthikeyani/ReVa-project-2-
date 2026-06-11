import React, { useState } from 'react';
import { useReVa } from '../context/ReVaContext';
import { 
  Mail, MapPin, Phone, Clock, Facebook, Instagram, Twitter, Youtube, 
  ShieldCheck, CreditCard, Lock, RefreshCw, Send, CheckCircle2 
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, setSelectedCategory, addNotification } = useReVa();
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setSubscribed(true);
    addNotification('Welcome to ReVa VIP! Direct 15% code sent of your provided email.', 'success');
    setEmailInput('');
  };

  const handleNavClick = (tab: string, cat?: string) => {
    setActiveTab(tab);
    if (cat) {
      setSelectedCategory(cat);
    }
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 font-sans transition-colors pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand Intro Column */}
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>ReVa</span>
              <span className="h-2 w-2 rounded-full bg-brand-accent" />
            </h3>
            <p className="text-xs leading-relaxed text-slate-400">
              The pinnacle of smart catalog curations. Delivering the finest Electronics, Fashion, luxury Accessories, and bespoke Lifestyle products with a relentless commitment to perfection and elegant UX.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {[
                { icon: <Facebook className="h-4 w-4" />, href: '#' },
                { icon: <Instagram className="h-4 w-4" />, href: '#' },
                { icon: <Twitter className="h-4 w-4" />, href: '#' },
                { icon: <Youtube className="h-4 w-4" />, href: '#' }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition-all hover:bg-brand-primary hover:text-white cursor-pointer"
                  aria-label="Social Link"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Core Categories Links Column */}
          <div className="space-y-4">
            <h4 className="font-heading text-xs uppercase tracking-wider font-semibold text-white">Categories</h4>
            <ul className="space-y-2.5 text-xs">
              {[
                { name: 'Elite Electronics', param: 'Electronics' },
                { name: 'High-Fashion Wear', param: 'Fashion' },
                { name: 'Luxury Accessories', param: 'Accessories' },
                { name: 'Bespoke Lifestyle decor', param: 'Lifestyle' }
              ].map((cat, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleNavClick('shop', cat.param)}
                    className="hover:text-amber-400 hover:underline transition-all text-left cursor-pointer"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Support Column */}
          <div className="space-y-4">
            <h4 className="font-heading text-xs uppercase tracking-wider font-semibold text-white">Customer Support</h4>
            <ul className="space-y-2.5 text-xs">
              {[
                { label: 'Track Order', tab: 'dashboard' },
                { label: 'Wishlist Catalog', tab: 'dashboard' },
                { label: 'My Profiles', tab: 'dashboard' },
                { label: 'Deals & Savings Portal', tab: 'offers' }
              ].map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleNavClick(item.tab)}
                    className="hover:text-amber-400 hover:underline transition-all text-left cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-4">
            <h4 className="font-heading text-xs uppercase tracking-wider font-semibold text-white">VIP Mailing List</h4>
            <p className="text-xs leading-relaxed text-slate-400">
              Subscribe to unlock flash sale early-access, customized drops, and instant discount vouchers.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2.5 rounded-lg bg-slate-800/60 p-3.5 border border-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 animate-bounce" />
                <span className="text-[11px] font-medium font-heading">Subscribed successfully! Code: VIPFIRST15</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute top-2.5 left-3 h-3.5 w-3.5 text-slate-500" />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter email address"
                    required
                    className="w-full rounded-lg bg-slate-800 border border-slate-705 px-3 py-2 pl-9 text-xs text-white placeholder-slate-500 focus:border-brand-primary focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-lg bg-brand-primary px-3 py-2 text-white transition-all hover:bg-brand-secondary cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Security & Badges trust indicators */}
        <div className="border-t border-slate-800 pt-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between text-xs">
          
          {/* Trust Value Badges with elegant gold accents */}
          <div className="flex flex-wrap items-center gap-6 text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand-accent" />
              <span>PCI-DSS Level 1 Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-amber-500" />
              <span>AES-256 Payment Tokenization</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-brand-primary" />
              <span>Complimentary 30-Day Returns</span>
            </div>
          </div>

          {/* Mock accepted cards graphics in custom grey cards */}
          <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800/40">
            <span className="text-[10px] uppercase font-bold text-slate-500 pr-1.5 font-mono">Accepting</span>
            {['Visa', 'Mastercard', 'Amex', 'ApplePay', 'GooglePay', 'UPI'].map((badge, idx) => (
              <span
                key={idx}
                className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-bold text-slate-300 font-mono"
              >
                {badge}
              </span>
            ))}
          </div>

        </div>

        {/* Copyright disclosures */}
        <div className="border-t border-slate-850 pt-6 flex flex-col gap-4 text-center md:flex-row md:justify-between md:text-left text-[10px] text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} ReVa Retail Platforms, Inc. All rights reserved. Designed for elite conversion efficiency.
          </p>
          <div className="flex justify-center gap-4">
            <a href="#" className="hover:text-white hover:underline">Sitemap directory</a>
            <a href="#" className="hover:text-white hover:underline">Privacy Charter</a>
            <a href="#" className="hover:text-white hover:underline">Vulnerability Disclosure</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
