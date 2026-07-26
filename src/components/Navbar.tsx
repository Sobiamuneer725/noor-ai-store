import React from 'react';
import { ShoppingBag, Heart, Sparkles, User, LogIn, Store, ShieldCheck, Bot } from 'lucide-react';
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
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-neutral-900 via-indigo-950 to-neutral-800 bg-clip-text text-transparent">
                Noor AI Store
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15 text-indigo-800 border border-indigo-400/30 flex-inline items-center gap-1 shadow-2xs">
                🏆 AI Neural Concierge & Catalog Live!
              </span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => onNavigate('home')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'home'
                  ? 'bg-neutral-100 text-neutral-900'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              Catalog
            </button>

            <button
              onClick={() => onNavigate('ai-concierge')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'ai-concierge'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-2xs font-semibold'
                  : 'text-neutral-600 hover:text-indigo-600 hover:bg-indigo-50/60'
              }`}
            >
              <Bot className={`w-4 h-4 ${currentView === 'ai-concierge' ? 'animate-bounce' : 'text-indigo-600'}`} />
              <span>AI Concierge</span>
            </button>

            <button
              onClick={() => onNavigate('ai-writer')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'ai-writer'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-neutral-600 hover:text-indigo-600 hover:bg-neutral-50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
              <span>AI Writer</span>
            </button>

            <button
              onClick={() => onNavigate('wishlist')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'wishlist'
                  ? 'bg-neutral-100 text-neutral-900'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Wishlist</span>
              {wishlistCount > 0 && (
                <span className="ml-1 text-xs font-bold px-1.5 py-0.2 rounded-full bg-rose-500 text-white">
                  {wishlistCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-3">
            
            {/* Cart Icon Button */}
            <button
              onClick={() => onNavigate('cart')}
              className={`relative p-2.5 rounded-xl transition-all ${
                currentView === 'cart'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center border-2 border-white shadow-xs">
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
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                    : 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-700'
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                  {user.displayName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium max-w-[100px] truncate">
                  {user.displayName}
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors shadow-xs"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

          </div>

        </div>
      </div>
      
      {/* Mobile bottom nav bar */}
      <div className="md:hidden flex border-t border-neutral-100 px-4 py-2 justify-around bg-white">
        <button
          onClick={() => onNavigate('home')}
          className={`text-xs font-medium py-1 px-3 rounded-lg ${currentView === 'home' ? 'text-indigo-600 bg-indigo-50' : 'text-neutral-600'}`}
        >
          Catalog
        </button>
        <button
          onClick={() => onNavigate('ai-writer')}
          className={`text-xs font-medium py-1 px-3 rounded-lg flex items-center space-x-1 ${currentView === 'ai-writer' ? 'text-indigo-600 bg-indigo-50' : 'text-neutral-600'}`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Writer</span>
        </button>
        <button
          onClick={() => onNavigate('wishlist')}
          className={`text-xs font-medium py-1 px-3 rounded-lg ${currentView === 'wishlist' ? 'text-indigo-600 bg-indigo-50' : 'text-neutral-600'}`}
        >
          Wishlist ({wishlistCount})
        </button>
      </div>
    </header>
  );
};
