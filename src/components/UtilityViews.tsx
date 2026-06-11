import React, { useState, useEffect } from 'react';
import { useReVa } from '../context/ReVaContext';
import { FAQS, COUPONS, PRODUCTS } from '../data';
import { 
  Award, Shield, HelpCircle, Mail, Phone, MapPin, Clock, 
  Send, Percent, Gift, Copy, ChevronDown, CheckCircle2, Star, Sparkles, ArrowRight 
} from 'lucide-react';

/* ==========================================
   1. ABOUT US PAGE VIEW
   ========================================== */
export const AboutView: React.FC = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-12 text-left font-sans animate-in fade-in">
      <div className="text-center space-y-2">
        <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-brand-primary bg-purple-50 px-3 py-1 rounded-full">Our DNA</span>
        <h2 className="font-heading text-3xl sm:text-4.5xl font-black text-slate-900 dark:text-white tracking-tight">
          A Sovereign Focus on Quality
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          ReVa is not just a marketplace; it is an active filter sorting out the mundane to present you with pure design utility.
        </p>
      </div>

      {/* Grid Story */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-4">
        <img
          src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600"
          alt="Luxury Electronics showroom"
          className="rounded-3xl shadow-lg h-80 w-full object-cover"
        />
        <div className="space-y-4">
          <h3 className="font-heading text-xl font-bold text-slate-800 dark:text-white">Our Heritage</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Founded in early 2018 beneath the neon skylines of San Francisco, ReVa emerged from a simple desire: to unify the raw technical performance of high hardware labs with the timeless tailoring of high fashion.
          </p>
          <p className="text-xs text-slate-500 leading-relaxed">
            We operate in active partnerships with top-tier accredited manufacturers, skipping secondary broker levels to dispatch directly to your front desk. No compromise, no delays.
          </p>
          <div className="flex gap-4 pt-2">
            <div className="flex items-center gap-1">
              <Award className="h-5 w-5 text-brand-accent" />
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Design Award 2026</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="h-5 w-5 text-brand-primary" />
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">100% Sourcing Protection</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vision, Mission, Values */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 pt-6">
        {[
          { title: 'The Vision', text: 'To transform mundane online consumption into a luxurious gallery walk, where every element ordered adds genuine design gravity to your daily habits.' },
          { title: 'The Mission', text: 'To curate, vet, and deliver top-tier electronics, fashion apparel, accessories, and ornaments with zero friction and absolute premium integrity.' },
          { title: 'Customer Promise', text: 'If any delivered specification deviates even slightly from your high mental image, we book immediate returns with complimentary home collection.' }
        ].map((block, idx) => (
          <div key={idx} className="bg-white border rounded-2xl p-6 shadow-sm dark:bg-slate-900/60 dark:border-slate-850">
            <h4 className="font-heading font-extrabold text-sm text-brand-primary dark:text-purple-400 mb-2">{block.title}</h4>
            <p className="text-xs text-slate-500 leading-relaxed">{block.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ==========================================
   2. CONTACT US PAGE VIEW
   ========================================== */
export const ContactView: React.FC = () => {
  const { addNotification } = useReVa();
  const [form, setForm] = useState({ name: '', email: '', subject: '', msg: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.msg) return;

    setSubmitting(true);
    setTimeout(() => {
      addNotification(`Concierge message regarding "${form.subject || 'Support'}" logged successfully!`, 'success');
      setForm({ name: '', email: '', subject: '', msg: '' });
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-left font-sans animate-in fade-in">
      
      <div className="text-center space-y-1">
        <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-brand-primary bg-purple-50 px-3 py-1 rounded-full">HELP DESK</span>
        <h2 className="font-heading text-3xl font-black text-slate-900 dark:text-white tracking-tight">Connect with Concierge</h2>
        <p className="text-xs text-slate-400">Our VIP customer support team is on standby to assist your purchase inquiries.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 items-start">
        
        {/* Contact Form Column (md:col-span-7) */}
        <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-slate-105 shadow-sm dark:bg-slate-900/60 dark:border-slate-850">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Your Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Jane Doe"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="jane.doe@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Subject Matter</label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Product design customization, shipping tracking, etc."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Concierge Message details</label>
              <textarea
                value={form.msg}
                onChange={(e) => setForm({ ...form, msg: e.target.value })}
                placeholder="Please describe your premium request in full details..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 h-32"
                required
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-brand-primary text-white py-3 px-6 text-xs font-bold uppercase tracking-wider hover:bg-brand-secondary transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow"
            >
              {submitting ? 'Transmitting Inquiries...' : 'Transmit Inquiries'}
              <Send className="h-3.5 w-3.5" />
            </button>

          </form>
        </div>

        {/* Info & Mock Google Map Maps Column (md:col-span-5) */}
        <div className="md:col-span-5 space-y-6">
          
          <div className="bg-slate-50 p-5 rounded-2xl border text-xs space-y-3 dark:bg-slate-950/20 dark:border-slate-850">
            <h4 className="font-heading font-extrabold text-sm text-slate-855 dark:text-white">Corporate Headquarters</h4>
            
            <div className="flex items-start gap-2 text-slate-500">
              <MapPin className="h-4 w-4 text-brand-primary shrink-0" />
              <span>742 Platinum Avenue, Tech Heights Phase 4, Silicon Valley, CA 94025</span>
            </div>

            <div className="flex items-center gap-2 text-slate-500">
              <Phone className="h-4 w-4 text-brand-secondary shrink-0" />
              <span>+1 (415) ReVa-VIP (384-9018)</span>
            </div>

            <div className="flex items-center gap-2 text-slate-500">
              <Mail className="h-4 w-4 text-brand-accent shrink-0" />
              <span>concierge@reva-platforms.com</span>
            </div>

            <div className="flex items-center gap-2 text-slate-500">
              <Clock className="h-4 w-4 text-slate-400 shrink-0" />
              <span>Business Hours: Mon-Fri 08:00 AM - 08:00 PM PST</span>
            </div>
          </div>

          {/* Styled Mock Vector Google Maps component */}
          <div className="relative h-60 rounded-2xl border border-slate-105 bg-slate-100 overflow-hidden dark:bg-slate-950/40 dark:border-slate-850">
            {/* Custom stylized vector layout representing map */}
            <div className="absolute inset-0 bg-slate-100 dark:bg-slate-900 grid grid-cols-6 grid-rows-6 opacity-30 gap-0">
              {Array.from({ length: 36 }).map((_, i) => (
                <div key={i} className="border border-slate-200 dark:border-slate-800" />
              ))}
            </div>

            {/* Custom stylized map streets lines */}
            <div className="absolute h-0.5 bg-slate-300 dark:bg-slate-800 w-full top-1/3 left-0 -rotate-3" />
            <div className="absolute h-0.5 bg-slate-300 dark:bg-slate-800 w-full top-2/3 left-0 rotate-6" />
            <div className="absolute w-0.5 bg-slate-300 dark:bg-slate-800 h-full left-1/3 top-0 rotate-12" />
            <div className="absolute w-0.5 bg-slate-300 dark:bg-slate-800 h-full left-2/3 top-0 -rotate-12" />

            {/* Glowing Map Pin Locator Accent */}
            <div className="absolute left-[54%] top-[42%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <span className="absolute h-10 w-10 bg-brand-primary/25 rounded-full scale-110 animate-ping" />
              <div className="relative bg-brand-primary text-white p-2.5 rounded-full shadow-lg border border-white">
                <MapPin className="h-5 w-5 text-amber-400" />
              </div>
              <span className="mt-1 rounded bg-slate-900 text-white px-2 py-0.5 text-[9px] font-black tracking-wide uppercase font-mono shadow-md">
                REVA PLAZA
              </span>
            </div>

            {/* Custom map controllers watermark */}
            <span className="absolute bottom-2 right-2 text-[9px] font-bold text-slate-400 bg-white/60 dark:bg-slate-950/40 px-2 py-0.5 rounded">
              G-Map GPS Mockup V2
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};

/* ==========================================
   3. FAQ ACCORDION PAGE VIEW
   ========================================== */
export const FAQView: React.FC = () => {
  const [selectedFAQIndex, setSelectedFAQIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left font-sans animate-in fade-in">
      <div className="text-center space-y-1">
        <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-brand-primary bg-purple-50 px-3 py-1 rounded-full">KNOWLEDGE DESK</span>
        <h2 className="font-heading text-3xl font-black text-slate-900 dark:text-white tracking-tight">Frequently Answered Queries</h2>
        <p className="text-xs text-slate-400 font-sans">Common compliance, returns, payments, and tracking guidelines.</p>
      </div>

      <div className="space-y-3 pt-4">
        {FAQS.map((item, idx) => {
          const open = selectedFAQIndex === idx;

          return (
            <div
              key={idx}
              className="border border-slate-105 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-slate-900/60 dark:border-slate-850"
            >
              <button
                onClick={() => setSelectedFAQIndex(open ? null : idx)}
                className="w-full flex items-center justify-between p-4.5 text-left text-xs font-bold text-slate-855 dark:text-slate-100 transition-colors hover:bg-slate-50 cursor-pointer"
              >
                <span>{item.question}</span>
                <ChevronDown className={`h-4.5 w-4.5 text-slate-420 transition-transform ${open ? 'rotate-180 text-brand-primary' : ''}`} />
              </button>

              {open && (
                <div className="px-4.5 pb-4 text-xs leading-relaxed text-slate-420 dark:text-slate-400 border-t pt-3 border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-1">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ==========================================
   4. OFFERS & DEALS PAGE VIEW
   ========================================== */
export const OffersView: React.FC = () => {
  const { addNotification } = useReVa();
  
  // Flash Countdown Timer
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 40 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 14, minutes: 32, seconds: 40 }; // loop
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    addNotification(`Promo card code "${code}" copied to clipboard!`, 'success');
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-left font-sans animate-in fade-in">
      
      <div className="text-center space-y-1">
        <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-brand-primary bg-purple-50 px-3 py-1 rounded-full">SAVINGS BLOCK</span>
        <h2 className="font-heading text-3xl font-black text-slate-900 dark:text-white tracking-tight">Active Voucher Cards</h2>
        <p className="text-xs text-slate-400">Click printable promo elements to copy code and apply on checkout.</p>
      </div>

      {/* Promos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COUPONS.map((coupon) => (
          <div
            key={coupon.code}
            className="group relative rounded-2xl border-2 border-dashed border-slate-203 p-5 text-left bg-white text-slate-800 flex flex-col justify-between space-y-4 shadow-sm dark:bg-slate-950/20 dark:border-slate-800"
          >
            {/* Tag logo icon line */}
            <div className="flex items-center justify-between border-b pb-2">
              <span className="rounded bg-brand-primary/10 px-2 py-0.5 text-[9px] font-black text-brand-primary uppercase">
                {coupon.discountPercent}% OFF
              </span>
              <Gift className="h-4.5 w-4.5 text-brand-accent animate-pulse" />
            </div>

            <div className="space-y-1">
              <h4 className="font-heading text-base font-extrabold tracking-tight dark:text-white">CODE: {coupon.code}</h4>
              <p className="text-[11px] text-slate-405 leading-relaxed">{coupon.description}</p>
            </div>

            <button
              onClick={() => handleCopyCode(coupon.code)}
              className="w-full rounded-xl bg-slate-900 border text-white py-2.5 text-[10px] uppercase tracking-wider font-bold flex items-center justify-center gap-1.5 hover:bg-brand-primary hover:border-brand-primary transition-all cursor-pointer"
            >
              <Copy className="h-3.5 w-3.5" /> Copy Voucher Code
            </button>
          </div>
        ))}
      </div>

      {/* Hero deal elements slider */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 flex flex-col md:flex-row items-center justify-between relative overflow-hidden text-white shadow-xl">
        <div className="space-y-3 text-left max-w-md z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 border border-amber-300/30 px-3 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-400">
            <Sparkles className="h-3.5 w-3.5 fill-current text-amber-400" /> MEMBER SPECIAL PROMO
          </span>
          <h3 className="font-heading text-2.5xl font-black">Mega VIP Flash Discounts</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            These exclusive voucher codes hold active savings multipliers on high tier electronics. Copy Code "FLASH25" before shipping times expire.
          </p>

          <div className="flex gap-2 pt-2 items-center text-xs">
            <span className="text-slate-500 font-bold uppercase">Expires In:</span>
            <div className="flex gap-1.5 text-xs text-emerald-400 font-bold font-mono">
              <span>{timeLeft.hours.toString().padStart(2, '0')}h</span>
              <span>:</span>
              <span>{timeLeft.minutes.toString().padStart(2, '0')}m</span>
              <span>:</span>
              <span>{timeLeft.seconds.toString().padStart(2, '0')}s</span>
            </div>
          </div>
        </div>

        <div className="shrink-0 bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center gap-4 text-xs font-bold text-left z-10 w-full md:w-80 mt-6 md:mt-0">
          <div className="h-10 w-10 bg-brand-primary/20 text-brand-primary rounded-full flex items-center justify-center">
            <Percent className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <p className="text-[10px] text-slate-501 text-slate-400 uppercase font-mono">CODE TO ENTER</p>
            <p className="text-lg font-black font-heading text-white">FLASH25</p>
            <button 
              onClick={() => handleCopyCode('FLASH25')}
              className="text-xs font-bold text-amber-400 flex items-center gap-1 hover:underline pt-0.5 cursor-pointer"
            >
              Copy Code Code <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Ambient backdrop */}
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-brand-primary/10 blur-[100px] pointer-events-none" />
      </div>

    </div>
  );
};
