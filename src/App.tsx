import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { ProductDetailView } from './components/ProductDetailView';
import { CartView } from './components/CartView';
import { CheckoutView } from './components/CheckoutView';
import { AIWriterView } from './components/AIWriterView';
import { AIConciergeView } from './components/AIConciergeView';
import { WishlistView } from './components/WishlistView';
import { ProfileView } from './components/ProfileView';
import { AuthModal } from './components/AuthModal';
import { INITIAL_PRODUCTS } from './data/mockProducts';
import { Product, CartItem, ViewState, UserProfile } from './types';
import { auth, seedProductsIfEmpty, getUserProfile, syncUserProfile } from './lib/firebase';
import { onAuthStateChanged, signOut as fbSignOut } from 'firebase/auth';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(INITIAL_PRODUCTS[0]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>(['noor-pod-pro']);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [aiWriterTargetName, setAiWriterTargetName] = useState<string | undefined>();

  // 1. Seed & load products from Cloud Firestore on mount
  useEffect(() => {
    seedProductsIfEmpty().then((loadedProducts) => {
      setProducts(loadedProducts);
      if (loadedProducts.length > 0 && !selectedProduct) {
        setSelectedProduct(loadedProducts[0]);
      }
    });
  }, []);

  // 2. Listen to live Firebase Auth state & load user profile + wishlist
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const data = await getUserProfile(fbUser.uid);
        if (data) {
          setUser(data.profile);
          if (data.wishlistIds && data.wishlistIds.length > 0) {
            setWishlistIds(data.wishlistIds);
          }
        } else {
          const newProf: UserProfile = {
            uid: fbUser.uid,
            email: fbUser.email || 'anonymous@noorstore.ai',
            displayName: fbUser.displayName || 'Noor VIP Customer',
            createdAt: new Date().toLocaleDateString()
          };
          setUser(newProf);
          await syncUserProfile(fbUser.uid, newProf);
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // 3. Sync wishlist to Cloud Firestore whenever wishlistIds change for logged in user
  useEffect(() => {
    if (user && user.uid) {
      syncUserProfile(user.uid, { wishlistIds });
    }
  }, [wishlistIds, user]);

  // Navigation handlers
  const handleNavigate = (view: ViewState) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    handleNavigate('product-detail');
  };

  const handleOpenAIWriter = (productName?: string) => {
    if (productName) {
      setAiWriterTargetName(productName);
    }
    handleNavigate('ai-writer');
  };

  // Cart actions
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prevCart, { product, quantity }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Wishlist actions
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      if (prev.includes(product.id)) {
        return prev.filter((id) => id !== product.id);
      }
      return [...prev, product.id];
    });
  };

  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSignOut = async () => {
    try {
      await fbSignOut(auth);
      setUser(null);
      handleNavigate('home');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans text-neutral-900 antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* Navigation Header */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        cartCount={cartTotalCount}
        wishlistCount={wishlistIds.length}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'home' && (
          <HomeView
            products={products}
            onSelectProduct={handleSelectProduct}
            onAddToCart={(product) => handleAddToCart(product, 1)}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
            onNavigateToAIWriter={() => handleOpenAIWriter()}
            onNavigateToAIConcierge={() => handleNavigate('ai-concierge')}
          />
        )}

        {currentView === 'product-detail' && selectedProduct && (
          <ProductDetailView
            product={selectedProduct}
            user={user}
            onBack={() => handleNavigate('home')}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={wishlistIds.includes(selectedProduct.id)}
            onOpenAIWriter={handleOpenAIWriter}
          />
        )}

        {currentView === 'cart' && (
          <CartView
            items={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveFromCart}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutView
            items={cart}
            user={user}
            onNavigate={handleNavigate}
            onClearCart={handleClearCart}
          />
        )}

        {currentView === 'ai-writer' && (
          <AIWriterView
            products={products}
            initialProductName={aiWriterTargetName}
          />
        )}

        {currentView === 'ai-concierge' && (
          <AIConciergeView
            user={user}
            products={products}
            onSelectProduct={handleSelectProduct}
            onAddToCart={(product, quantity) => handleAddToCart(product, quantity)}
          />
        )}

        {currentView === 'wishlist' && (
          <WishlistView
            products={products}
            wishlistIds={wishlistIds}
            onSelectProduct={handleSelectProduct}
            onAddToCart={(product) => handleAddToCart(product, 1)}
            onRemoveFromWishlist={handleToggleWishlist}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'profile' && (
          <ProfileView
            user={user}
            onSignOut={handleSignOut}
            onNavigate={handleNavigate}
            wishlistCount={wishlistIds.length}
          />
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(loggedInUser) => setUser(loggedInUser)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 mt-auto py-8 text-center text-xs text-neutral-500 space-y-2">
        <p className="font-semibold text-neutral-700">
          Noor AI Store • Built with Google Stitch UI & Firebase Studio
        </p>
        <p className="text-indigo-600 font-semibold">
          🎉 All 6 Mentorship Steps Complete: UI Scaffold, Firebase Auth, Firestore Database, Real-time Checkout, Gemini AI Writer, Community Reviews Engine, and Live Neural Concierge!
        </p>
      </footer>
    </div>
  );
}


