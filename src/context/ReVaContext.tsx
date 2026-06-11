import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, Coupon, CategoryType } from '../types';
import { COUPONS, PRODUCTS } from '../data';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

interface ReVaContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, color: string, size?: string) => void;
  updateCartQuantity: (productId: string, selectedColor: string, quantity: number) => void;
  removeFromCart: (productId: string, selectedColor: string) => void;
  clearCart: () => void;
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isWishlisted: (id: string) => boolean;
  orders: Order[];
  placeOrder: (shipping: UserProfile, paymentMethod: string, deliveryFee: number, taxRate: number) => Order;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  chatOpen: boolean;
  setChatOpen: (b: boolean) => void;
  notifications: { id: string; text: string; type: 'success' | 'info' | 'danger' }[];
  addNotification: (text: string, type?: 'success' | 'info' | 'danger') => void;
  dismissNotification: (id: string) => void;
  userProfile: UserProfile;
  updateUserProfile: (profile: UserProfile) => void;
  recentlyViewed: Product[];
  addToRecentlyViewed: (p: Product) => void;
  compareProducts: Product[];
  toggleCompare: (p: Product) => void;
  isCompared: (id: string) => boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  appliedCoupon: Coupon | null;
  applyCouponCode: (code: string) => boolean;
  removeAppliedCoupon: () => void;
}

const ReVaContext = createContext<ReVaContextType | undefined>(undefined);

export const ReVaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('reva-theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<string>('home');

  // Interactive cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('reva-cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Wishlist state
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('reva-wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Order history
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('reva-orders');
    if (saved) return JSON.parse(saved);
    // Initialize with a mock initial completed order to look authentic on first load
    const initialOrder: Order = {
      id: 'RV-9048-2026',
      date: '2026-06-05',
      items: [
        {
          productId: 'p3',
          productName: 'ReVa ChronoSync Pro Watch',
          price: 29900,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300'
        }
      ],
      status: 'Delivered',
      total: 29900,
      address: {
        name: 'Jane Doe',
        street: 'Flat 402, Sea Breeze Apartments, Bandra West',
        city: 'Mumbai',
        postalCode: '400050'
      },
      trackingStep: 4,
      payoutMethod: 'Credit Card'
    };
    return [initialOrder];
  });

  // Product Selection/QuickView modal target
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Live Chat drawer
  const [chatOpen, setChatOpen] = useState<boolean>(false);

  // Smart suggestions / query filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [sortBy, setSortBy] = useState<string>('popularity');

  // Coupon applied state
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Dynamic system notifications (toasts)
  const [notifications, setNotifications] = useState<{ id: string; text: string; type: 'success' | 'info' | 'danger' }[]>([]);

  // Recently viewed browser history
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  // Compara products (limit 3)
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);

  // User details
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('reva-profile');
    return saved ? JSON.parse(saved) : {
      name: 'Reshma G.',
      email: 'reshmagdg17@gmail.com',
      phone: '+91 98765 43210',
      address: 'Flat 402, Sea Breeze Apartments, Bandra West',
      city: 'Mumbai',
      postalCode: '400050'
    };
  });

  // Persists states in storage
  useEffect(() => {
    localStorage.setItem('reva-theme', theme);
    const bodyClass = document.body.classList;
    if (theme === 'dark') {
      bodyClass.add('dark');
    } else {
      bodyClass.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('reva-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('reva-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('reva-orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('reva-profile', JSON.stringify(userProfile));
  }, [userProfile]);

  // Notifications API functions
  const addNotification = (text: string, type: 'success' | 'info' | 'danger' = 'success') => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, text, type }]);
    // Auto timeout after 4 seconds
    setTimeout(() => {
      dismissNotification(id);
    }, 4000);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Toggle Theme mode
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    addNotification(`Switched to Premium ${theme === 'light' ? 'Dark' : 'Light'} theme`, 'info');
  };

  // Cart Management
  const addToCart = (product: Product, quantity: number, color: string, size?: string) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedColor === color && item.selectedSize === size
      );

      if (existingIdx > -1) {
        const nextCart = [...prev];
        nextCart[existingIdx] = {
          ...nextCart[existingIdx],
          quantity: nextCart[existingIdx].quantity + quantity
        };
        return nextCart;
      }

      return [...prev, { product, quantity, selectedColor: color, selectedSize: size }];
    });
    addNotification(`Added "${product.name}" (${color}${size ? `, Size ${size}` : ''}) to your Cart!`, 'success');
  };

  const updateCartQuantity = (productId: string, selectedColor: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedColor);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedColor === selectedColor
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: string, selectedColor: string) => {
    const record = cart.find(x => x.product.id === productId);
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.selectedColor === selectedColor)));
    if (record) {
      addNotification(`Removed "${record.product.name}" from your Cart.`, 'info');
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist Handling
  const toggleWishlist = (product: Product) => {
    const match = wishlist.some((item) => item.id === product.id);
    if (match) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      addNotification(`Removed "${product.name}" from your Wishlist.`, 'info');
    } else {
      setWishlist((prev) => [...prev, product]);
      addNotification(`Saved "${product.name}" to your Wishlist!`, 'success');
    }
  };

  const isWishlisted = (id: string) => wishlist.some((item) => item.id === id);

  // Apply discount voucher
  const applyCouponCode = (code: string): boolean => {
    const formattedCode = code.trim().toUpperCase();
    const couponObj = COUPONS.find((c) => c.code === formattedCode);
    if (couponObj) {
      setAppliedCoupon(couponObj);
      addNotification(`Coupon "${formattedCode}" applied successfully!`, 'success');
      return true;
    }
    addNotification('Invalid discount coupon code. Please try again.', 'danger');
    return false;
  };

  const removeAppliedCoupon = () => {
    setAppliedCoupon(null);
    addNotification('Discount coupon removed.', 'info');
  };

  // Place order
  const placeOrder = (
    shipping: UserProfile,
    paymentMethod: string,
    deliveryFee: number,
    taxRate: number
  ): Order => {
    const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const discount = appliedCoupon ? (cartSubtotal * appliedCoupon.discountPercent) / 100 : 0;
    const taxes = (cartSubtotal - discount) * taxRate;
    const finalTotal = Number((cartSubtotal - discount + deliveryFee + taxes).toFixed(2));

    const newOrder: Order = {
      id: `RV-${Math.floor(1000 + Math.random() * 9000)}-2026`,
      date: new Date().toISOString().split('T')[0],
      items: cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images[0]
      })),
      status: 'Processing',
      total: finalTotal,
      address: {
        name: shipping.name,
        street: shipping.address,
        city: shipping.city,
        postalCode: shipping.postalCode
      },
      trackingStep: 1,
      payoutMethod: paymentMethod
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setAppliedCoupon(null);
    addNotification('Order placed securely! Tracker activated in your profile.', 'success');
    return newOrder;
  };

  const updateUserProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    addNotification('Your shipping address and profile details have been securely updated.', 'success');
  };

  // Track browsing history
  const addToRecentlyViewed = (product: Product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      return [product, ...filtered].slice(0, 5); // Keep last 5 elements
    });
  };

  // Compare products (up to 3 products)
  const toggleCompare = (product: Product) => {
    setCompareProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        addNotification(`Removed "${product.name}" from comparison shelf.`, 'info');
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 3) {
        addNotification('Comparison shelf full. You can compare up to 3 products at a time.', 'danger');
        return prev;
      }
      addNotification(`Added "${product.name}" to comparison shelf.`, 'success');
      return [...prev, product];
    });
  };

  const isCompared = (id: string) => compareProducts.some((p) => p.id === id);

  return (
    <ReVaContext.Provider
      value={{
        activeTab,
        setActiveTab,
        theme,
        toggleTheme,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        wishlist,
        toggleWishlist,
        isWishlisted,
        orders,
        placeOrder,
        selectedProduct,
        setSelectedProduct,
        chatOpen,
        setChatOpen,
        notifications,
        addNotification,
        dismissNotification,
        userProfile,
        updateUserProfile,
        recentlyViewed,
        addToRecentlyViewed,
        compareProducts,
        toggleCompare,
        isCompared,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        priceRange,
        setPriceRange,
        sortBy,
        setSortBy,
        appliedCoupon,
        applyCouponCode,
        removeAppliedCoupon,
      }}
    >
      {children}
    </ReVaContext.Provider>
  );
};

export const useReVa = () => {
  const context = useContext(ReVaContext);
  if (!context) {
    throw new Error('useReVa must be used within a ReVaProvider');
  }
  return context;
};
