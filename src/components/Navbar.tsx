import React from 'react';
import { ShoppingCart, Heart, User, LogIn, Search } from 'lucide-react';
import { ViewState, UserProfile } from '../types';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  cartCount: number;
  wishlistCount: number;
  user: UserProfile | null;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  cartCount,
  wishlistCount,
  user,
  onOpenAuth,
}) => {
  const goToCatalogSearch = () => {
    onNavigate('home');
    setTimeout(() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E7DFCF] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo & Brand */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <img
              src="/assets/logo.webp"
              alt="Noor ul Haya"
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover group-hover:scale-105 transition-transform"
            />
            <span
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-xl font-semibold tracking-tight text-[#171310]"
            >
              Noor ul Haya
            </span>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => onNavigate('home')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'home'
                  ? 'bg-[#F5EFE3] text-[#171310]'
                  : 'text-neutral-600 hover:text-[#171310] hover:bg-neutral-50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => { onNavigate('home'); setTimeout(() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
              className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:text-[#171310] hover:bg-neutral-50 transition-colors"
            >
              Shop
            </button>
            <button
              onClick={() => onNavigate('wishlist')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'wishlist'
                  ? 'bg-[#F5EFE3] text-[#171310]'
                  : 'text-neutral-600 hover:text-[#171310] hover:bg-neutral-50'
              }`}
            >
              <span>Wishlist</span>
              {wishlistCount > 0 && (
                <span className="ml-1 text-xs font-bold px-1.5 py-0.2 rounded-full bg-rose-500 text-white">
                  {wishlistCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2">

            <button
              onClick={goToCatalogSearch}
              className="p-2.5 rounded-xl text-neutral-700 hover:bg-neutral-100 transition-colors"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Icon Button */}
            <button
              onClick={() => onNavigate('cart')}
              className={`relative p-2.5 rounded-xl transition-all ${
                currentView === 'cart'
                  ? 'bg-[#171310] text-[#D4AF6A]'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#D4AF6A] text-[#171310] text-xs font-bold flex items-center justify-center border-2 border-white shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile / Auth Button */}
            {user ? (
              <button
                onClick={() => onNavigate('profile')}
                className={`flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-full border transition-all ${
                  currentView === 'profile'
                    ? 'border-[#A6813C] bg-[#F5EFE3] text-[#171310]'
                    : 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-700'
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-[#171310] text-[#D4AF6A] font-bold flex items-center justify-center text-xs">
                  {user.displayName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium max-w-[100px] truncate">
                  {user.displayName}
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="p-2.5 rounded-xl bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
                title="Sign In"
              >
                <User className="w-5 h-5" />
              </button>
            )}

          </div>

        </div>
      </div>

      {/* Mobile bottom nav bar */}
      <div className="md:hidden flex border-t border-[#E7DFCF] px-4 py-2 justify-around bg-white">
        <button
          onClick={() => onNavigate('home')}
          className={`text-xs font-medium py-1 px-3 rounded-lg ${currentView === 'home' ? 'text-[#A6813C] bg-[#F5EFE3]' : 'text-neutral-600'}`}
        >
          Home
        </button>
        <button
          onClick={goToCatalogSearch}
          className="text-xs font-medium py-1 px-3 rounded-lg text-neutral-600"
        >
          Shop
        </button>
        <button
          onClick={() => onNavigate('wishlist')}
          className={`text-xs font-medium py-1 px-3 rounded-lg ${currentView === 'wishlist' ? 'text-[#A6813C] bg-[#F5EFE3]' : 'text-neutral-600'}`}
        >
          Wishlist ({wishlistCount})
        </button>
      </div>
    </header>
  );
};
