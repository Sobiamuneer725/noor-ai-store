import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInAnonymously, signOut as fbSignOut, updateProfile, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, collection, doc, getDocs, getDoc, setDoc, addDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Product, UserProfile, CartItem, ProductReview, AIConversationMessage } from '../types';
import { INITIAL_PRODUCTS } from '../data/mockProducts';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Auth & Firestore with specific Database ID
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

/**
 * Seeds initial products into Firestore if the collection is empty.
 */
export async function seedProductsIfEmpty(): Promise<Product[]> {
  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    
    if (snapshot.empty) {
      console.log('Seeding initial Noor AI Store products to Firestore...');
      for (const product of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', product.id), product);
      }
      return INITIAL_PRODUCTS;
    } else {
      const products: Product[] = [];
      snapshot.forEach((docSnap) => {
        products.push(docSnap.data() as Product);
      });
      return products;
    }
  } catch (error) {
    console.error('Error fetching/seeding products from Firestore:', error);
    return INITIAL_PRODUCTS; // Fallback to mock data if offline
  }
}

/**
 * Saves or updates a user profile and wishlist in Firestore
 */
export async function syncUserProfile(uid: string, data: Partial<UserProfile> & { wishlistIds?: string[] }): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      await setDoc(userRef, { ...docSnap.data(), ...data }, { merge: true });
    } else {
      await setDoc(userRef, {
        uid,
        email: data.email || 'anonymous@noorstore.ai',
        displayName: data.displayName || 'Noor Shopper',
        createdAt: new Date().toLocaleDateString(),
        wishlistIds: data.wishlistIds || ['noor-pod-pro'],
        ...data
      });
    }
  } catch (error) {
    console.error('Error syncing user profile to Firestore:', error);
  }
}

/**
 * Fetches user profile and wishlist from Firestore
 */
export async function getUserProfile(uid: string): Promise<{ profile: UserProfile; wishlistIds: string[] } | null> {
  try {
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        profile: {
          uid: data.uid,
          email: data.email,
          displayName: data.displayName,
          createdAt: data.createdAt
        },
        wishlistIds: data.wishlistIds || ['noor-pod-pro']
      };
    }
  } catch (error) {
    console.error('Error fetching user profile from Firestore:', error);
  }
  return null;
}

/**
 * Saves a checkout order to Firestore
 */
export async function createOrderInFirestore(
  user: UserProfile | null,
  items: CartItem[],
  total: number,
  shippingAddress: any
): Promise<string> {
  try {
    const orderId = 'NOOR-' + Math.floor(100000 + Math.random() * 900000);
    const orderData = {
      orderId,
      userId: user ? user.uid : 'guest-shopper',
      items: items.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image
      })),
      total,
      status: 'Processing',
      createdAt: new Date().toLocaleDateString(),
      timestamp: serverTimestamp(),
      shippingAddress
    };
    
    await setDoc(doc(db, 'orders', orderId), orderData);
    return orderId;
  } catch (error) {
    console.error('Error creating order in Firestore:', error);
    return 'NOOR-' + Math.floor(100000 + Math.random() * 900000);
  }
}

/**
 * Fetches user orders from Firestore
 */
export async function getUserOrders(uid: string): Promise<any[]> {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('userId', '==', uid));
    const snapshot = await getDocs(q);
    
    const orders: any[] = [];
    snapshot.forEach((docSnap) => {
      orders.push(docSnap.data());
    });
    
    // Sort in-memory by timestamp descending to avoid requiring composite indexes
    return orders.sort((a, b) => {
      const timeA = a.timestamp?.seconds || 0;
      const timeB = b.timestamp?.seconds || 0;
      return timeB - timeA;
    });
  } catch (error) {
    console.error('Error fetching orders from Firestore:', error);
    return [];
  }
}

/**
 * Fetches reviews for a specific product from Firestore
 */
export async function getProductReviews(productId: string): Promise<ProductReview[]> {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, where('productId', '==', productId));
    const snapshot = await getDocs(q);
    
    const reviews: ProductReview[] = [];
    snapshot.forEach((docSnap) => {
      reviews.push({ id: docSnap.id, ...docSnap.data() } as ProductReview);
    });
    
    return reviews.sort((a, b) => {
      const timeA = a.timestamp?.seconds || 0;
      const timeB = b.timestamp?.seconds || 0;
      return timeB - timeA;
    });
  } catch (error) {
    console.error('Error fetching product reviews from Firestore:', error);
    return [];
  }
}

/**
 * Submits a new product review to Firestore
 */
export async function addProductReview(review: Omit<ProductReview, 'id' | 'timestamp'>): Promise<string> {
  try {
    const reviewsRef = collection(db, 'reviews');
    const docRef = await addDoc(reviewsRef, {
      ...review,
      timestamp: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding product review to Firestore:', error);
    throw error;
  }
}

/**
 * Fetches saved AI Concierge chat history for a user from Firestore
 */
export async function getAIConciergeHistory(userId: string): Promise<AIConversationMessage[]> {
  try {
    const convRef = collection(db, `ai_conversations/${userId}/messages`);
    const snapshot = await getDocs(convRef);
    const msgs: AIConversationMessage[] = [];
    snapshot.forEach((docSnap) => {
      msgs.push({ id: docSnap.id, ...docSnap.data() } as AIConversationMessage);
    });
    return msgs.sort((a, b) => {
      const timeA = a.timestamp?.seconds || 0;
      const timeB = b.timestamp?.seconds || 0;
      return timeA - timeB;
    });
  } catch (error) {
    console.error('Error fetching AI concierge history:', error);
    return [];
  }
}

/**
 * Saves an AI Concierge chat message to Firestore
 */
export async function saveAIConciergeMessage(userId: string, message: Omit<AIConversationMessage, 'id' | 'timestamp'>): Promise<string> {
  try {
    const convRef = collection(db, `ai_conversations/${userId}/messages`);
    const docRef = await addDoc(convRef, {
      ...message,
      timestamp: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving AI concierge message:', error);
    throw error;
  }
}

