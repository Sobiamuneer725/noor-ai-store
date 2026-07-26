export interface Product {
  id: string;
  name: string;
  tagline: string;
  price: number;
  category: 'Hardware' | 'Software' | 'Accessories' | 'AI Models';
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  features: string[];
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ProductReview {
  id?: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  timestamp?: any;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt?: string;
}

export interface AIConversationMessage {
  id?: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp?: any;
  createdAt?: string;
  recommendedProductIds?: string[];
}

export type ViewState = 
  | 'home' 
  | 'product-detail' 
  | 'cart' 
  | 'checkout' 
  | 'ai-writer' 
  | 'ai-concierge'
  | 'wishlist' 
  | 'profile';
