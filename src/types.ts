export type CategoryType = 
  | 'Electronics' 
  | 'Fashion' 
  | 'Accessories' 
  | 'Home & Living' 
  | 'Beauty & Personal Care' 
  | 'Sports & Fitness' 
  | 'Books & Education' 
  | 'Toys & Kids' 
  | 'Automotive' 
  | 'Grocery & Essentials';

export interface Product {
  id: string;
  name: string;
  category: CategoryType;
  subCategory: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  description: string;
  tags: string[];
  colors: string[];
  sizes?: string[];
  specifications: Record<string, string>;
  inStock: boolean;
  stockCount: number;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isTrending?: boolean;
  flashSaleEnding?: number; // timestamp
}

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  helpfulCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize?: string;
}

export interface Order {
  id: string;
  date: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Returned';
  total: number;
  address: {
    name: string;
    street: string;
    city: string;
    postalCode: string;
  };
  trackingStep: number; // 1-4
  payoutMethod: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  minAmount: number;
  description: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'shipping' | 'returns' | 'payments' | 'orders' | 'account';
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  avatar: string;
}
