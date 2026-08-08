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
  const handleAddToCart = (
    product: Product,
    quantity: number = 1,
    selectedColor?: string,
    selectedImage?: string
  ) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedColor === selectedColor
      );
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prevCart, { product, quantity, selectedColor, selectedImage }];
    });
  };

  const cartKey = (productId: string, selectedColor?: string) => `${productId}__${selectedColor || ''}`;

  const handleUpdateQuantity = (productId: string, quantity: number, selectedColor?: string) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId, selectedColor);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        cartKey(item.product.id, item.selectedColor) === cartKey(productId, selectedColor)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string, selectedColor?: string) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => cartKey(item.product.id, item.selectedColor) !== cartKey(productId, selectedColor)
      )
    );
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-5 sm:px-6 lg:px-8 py-8">
        {currentView === 'home' && (
          <HomeView
            products={products}
            onSelectProduct={handleSelectProduct}
            onAddToCart={(product, selectedColor, selectedImage) =>
              handleAddToCart(product, 1, selectedColor, selectedImage)
            }
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
            onAddToCart={(product, quantity, selectedColor, selectedImage) =>
              handleAddToCart(product, quantity, selectedColor, selectedImage)
            }
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={wishlistIds.includes(selectedProduct.id)}
            onOpenAIWriter={handleOpenAIWriter}
          />
        )}

        {currentView === 'cart' && (
          <CartView
            items={cart}
            onUpdateQuantity={(productId, quantity, selectedColor) =>
              handleUpdateQuantity(productId, quantity, selectedColor)
            }
            onRemoveItem={(productId, selectedColor) => handleRemoveFromCart(productId, selectedColor)}
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
      <footer className="bg-[#171310] text-[#C9C4B8] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="space-y-3">
            <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-lg text-[#D4AF6A]">
              Noor ul Haya
            </span>
            <p className="text-xs leading-relaxed">
              Premium modest fashion crafted for comfort, elegance and grace.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF6A]">Quick Links</h4>
            <ul className="text-xs space-y-2">
              <li><button onClick={() => handleNavigate('wishlist')} className="hover:text-[#D4AF6A] transition-colors">Wishlist</button></li>
              <li><button onClick={() => handleNavigate('cart')} className="hover:text-[#D4AF6A] transition-colors">Cart</button></li>
              <li>
                <a href="https://www.instagram.com/noor_ulhaya_pk?igsh=NTA1YTc4dXZmbDhu" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF6A] transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://chat.whatsapp.com/EuQ8gqUt6TwGyU3YS0XlVw?s=sh&p=a&ilr=1" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF6A] transition-colors">
                  WhatsApp Community
                </a>
              </li>
            </ul>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://www.instagram.com/noor_ulhaya_pk?igsh=NTA1YTc4dXZmbDhu"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#2A2319] hover:bg-[#A6813C] flex items-center justify-center transition-colors"
                title="Instagram"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#D4AF6A]"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.98-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              </a>
              <a
                href="https://chat.whatsapp.com/EuQ8gqUt6TwGyU3YS0XlVw?s=sh&p=a&ilr=1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#2A2319] hover:bg-[#A6813C] flex items-center justify-center transition-colors"
                title="WhatsApp Community"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#D4AF6A]"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12.05 0C5.495 0 .164 5.331.164 11.886c0 2.096.548 4.142 1.588 5.943L.057 24l6.317-1.657a11.86 11.86 0 0 0 5.676 1.446h.005c6.554 0 11.886-5.331 11.886-11.886C23.94 5.331 18.609 0 12.05 0zm6.988 18.824a9.825 9.825 0 0 1-6.988 2.895h-.004a9.847 9.847 0 0 1-5.023-1.376l-.36-.214-3.746.983.999-3.651-.235-.375a9.816 9.816 0 0 1-1.503-5.2c0-5.444 4.432-9.876 9.877-9.876 2.637 0 5.117 1.028 6.984 2.897a9.812 9.812 0 0 1 2.891 6.985c0 5.444-4.432 9.876-9.877 9.876z"/></svg>
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF6A]">Contact</h4>
            <ul className="text-xs space-y-2">
              <li>WhatsApp: 0325-3055645</li>
              <li>
                <a href="https://wa.me/923253055645" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF6A] transition-colors">
                  Chat with us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#2A2319] py-4 text-center text-[11px] text-[#8A8578]">
          Noor ul Haya © 2026. All rights reserved.
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/923253055645"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20BD5A] shadow-lg hover:shadow-xl transition-all hover:scale-105"
        title="Chat with us on WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12.05 0C5.495 0 .164 5.331.164 11.886c0 2.096.548 4.142 1.588 5.943L.057 24l6.317-1.657a11.86 11.86 0 0 0 5.676 1.446h.005c6.554 0 11.886-5.331 11.886-11.886C23.94 5.331 18.609 0 12.05 0zm6.988 18.824a9.825 9.825 0 0 1-6.988 2.895h-.004a9.847 9.847 0 0 1-5.023-1.376l-.36-.214-3.746.983.999-3.651-.235-.375a9.816 9.816 0 0 1-1.503-5.2c0-5.444 4.432-9.876 9.877-9.876 2.637 0 5.117 1.028 6.984 2.897a9.812 9.812 0 0 1 2.891 6.985c0 5.444-4.432 9.876-9.877 9.876z"/>
        </svg>
      </a>
    </div>
  );
}
