export interface Product {
  id: string;
  name: string;
  tagline: string;
  price: number;
  cutPrice?: number;
  category: 'Malaysian Hijab Set' | 'Khimar' | 'Instant Hijab' | 'Casual' | 'Niqab' | 'Accessories';
  rating: number;
  reviewsCount: number;
  image: string;
  images?: string[];
  colors?: string[];
  sizeLabel?: string;
  description: string;
  features: string[];
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedImage?: string;
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
