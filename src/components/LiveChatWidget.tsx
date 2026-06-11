import React, { useState, useRef, useEffect } from 'react';
import { useReVa } from '../context/ReVaContext';
import { MessageSquare, X, Send, Bot, User, CheckCheck, Loader2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

export const LiveChatWidget: React.FC = () => {
  const { chatOpen, setChatOpen, addNotification } = useReVa();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: 'Welcome to ReVa Premium Assistance. How may I help you elevate your shopping experience today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const faqKeywords = [
    { keys: ['shipping', 'delivery', 'fast', 'track', 'courier'], ans: 'ReVa guarantees express premium delivery. Standard orders arrive in 2-3 business days. Express next-day shipping is fully complimentary on orders above $200.' },
    { keys: ['return', 'refund', 'policy', 'exchange'], ans: 'We provide a premium 30-day return policy. Simply select "Request Return" inside your active orders list under the Profile tab for complimentary home pick-up.' },
    { keys: ['payment', 'credit', 'card', 'upi', 'cod', 'secure'], ans: 'We accept Credit/Debit Cards, UPI, Net Banking, and secure Cash on Delivery (COD). All transactions are encrypted utilizing enterprise AES-256 standards.' },
    { keys: ['discount', 'coupon', 'promo', 'deal', 'offer'], ans: 'You can check our active savings cards under the "Offers" tab! Try coupon code "REVAGOLD" for an instant 15% discount on checkout.' },
    { keys: ['phone', 'horizon', 'headphones', 'watch', 'electronics'], ans: 'Our high-end Electronics include the Horizon Pro Foldable phone, SoundScape hybrid ANC audio, and sapphire-glass ChronoSync smartwatches.' },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot replying with delay
    setTimeout(() => {
      let replyText = "Thank you for reaching out. A ReVa luxury concierge representative is reviewing your request. For immediate guidelines, please see our dedicated FAQs or Offers page.";
      
      const lowerText = textToSend.toLowerCase();
      for (const item of faqKeywords) {
        if (item.keys.some(k => lowerText.includes(k))) {
          replyText = item.ans;
          break;
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 1200);
  };

  const presetSuggestions = [
    'Track my shipping status',
    'How do I process a return?',
    'What is coupon "REVAGOLD"?',
    'Are card transactions secure?'
  ];

  return (
    <>
      {/* Floating Action Button */}
      <button
        id="live-chat-fab"
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary text-white shadow-premium-xl transition-all duration-300 hover:scale-110 hover:bg-brand-secondary active:scale-95 cursor-pointer"
        aria-label="Contact Concierge Support"
      >
        {chatOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>

      {/* Chat window */}
      {chatOpen && (
        <div
          id="live-chat-window"
          className="fixed bottom-24 right-6 z-50 flex h-[500px] w-96 flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-900 md:w-[420px]"
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-brand-primary to-brand-secondary px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                  <Bot className="h-5 w-5 text-amber-400" />
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-brand-primary bg-emerald-400" />
              </div>
              <div>
                <h4 className="font-heading text-sm font-semibold tracking-wide">ReVa Luxury Concierge</h4>
                <p className="text-[11px] text-purple-200">Online &bull; Smart AI Agent</p>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="rounded-full p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto bg-slate-50 p-5 dark:bg-slate-950/40 space-y-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.sender === 'bot' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div className="max-w-[75%] items-end">
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${
                      m.sender === 'user'
                        ? 'bg-brand-primary text-white rounded-tr-none'
                        : 'bg-white text-slate-800 dark:bg-slate-800 dark:text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                  <div className={`mt-1 flex items-center gap-1 text-[9px] text-slate-400 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <span>{m.timestamp}</span>
                    {m.sender === 'user' && <CheckCheck className="h-3 w-3 text-emerald-500" />}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 justify-start">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-white px-4 py-3 dark:bg-slate-800 shadow-sm text-xs text-slate-400">
                  <Loader2 className="h-3 w-3 animate-spin text-brand-secondary" />
                  <span>Concierge is typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick choices items */}
          <div className="bg-slate-50 px-4 py-2 dark:bg-slate-950/60 flex gap-2 overflow-x-auto border-t border-slate-100 dark:border-slate-800/60 scrollbar-none">
            {presetSuggestions.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                className="shrink-0 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-medium text-slate-700 shadow-sm transition-all hover:border-brand-primary hover:text-brand-primary dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-brand-primary cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="flex items-center gap-2 border-t border-slate-100 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask ReVa concierge..."
              className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs outline-none focus:border-brand-primary focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:focus:border-brand-primary dark:focus:bg-slate-950 text-slate-800 dark:text-slate-200"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary text-white transition-all hover:bg-brand-secondary disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
