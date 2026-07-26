import React, { useState, useEffect } from 'react';
import { User as UserIcon, LogOut, Package, Heart, Sparkles, ShieldCheck, Mail, Calendar, ExternalLink, Database, ShoppingBag, ArrowRight } from 'lucide-react';
import { UserProfile, ViewState } from '../types';
import { getUserOrders } from '../lib/firebase';

interface ProfileViewProps {
  user: UserProfile | null;
  onSignOut: () => void;
  onNavigate: (view: ViewState) => void;
  wishlistCount: number;
  ordersCount?: number;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onSignOut,
  onNavigate,
  wishlistCount,
  ordersCount = 1,
}) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(true);

  useEffect(() => {
    if (user?.uid) {
      setLoadingOrders(true);
      getUserOrders(user.uid).then((fetched) => {
        setOrders(fetched);
        setLoadingOrders(false);
      });
    } else {
      setOrders([]);
      setLoadingOrders(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center py-20 bg-white rounded-3xl border border-neutral-200 shadow-xs space-y-6">
        <div className="w-20 h-20 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
          <UserIcon className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-neutral-900">Please Sign In</h2>
          <p className="text-neutral-500 text-sm">
            Sign in to manage your Noor AI Store account, order history, and saved wishlists.
          </p>
        </div>
        <button
          onClick={() => onNavigate('home')}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 animate-in fade-in duration-200">
      
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-neutral-900 to-indigo-950 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-white text-3xl font-bold flex items-center justify-center shadow-lg border-2 border-white/20">
            {user.displayName.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified VIP Customer</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold">{user.displayName}</h1>
            <div className="flex items-center space-x-4 text-xs text-neutral-300 pt-1">
              <span className="flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5" />
                <span>{user.email}</span>
              </span>
              {user.createdAt && (
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Joined {user.createdAt}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={onSignOut}
          className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-rose-500/20 text-white hover:text-rose-200 text-sm font-medium transition-all border border-white/10 flex items-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Quick Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div 
          onClick={() => onNavigate('wishlist')}
          className="bg-white p-6 rounded-2xl border border-neutral-200 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-neutral-400 uppercase">Saved Items</span>
            <div className="text-2xl font-extrabold text-neutral-900 group-hover:text-indigo-600 transition-colors">
              {wishlistCount} Products
            </div>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 text-rose-500 group-hover:scale-110 transition-transform">
            <Heart className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-neutral-400 uppercase">Order History</span>
            <div className="text-2xl font-extrabold text-neutral-900">
              {loadingOrders ? '...' : `${orders.length} Order${orders.length === 1 ? '' : 's'}`}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('ai-writer')}
          className="bg-white p-6 rounded-2xl border border-neutral-200 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-neutral-400 uppercase">AI Writer Usage</span>
            <div className="text-2xl font-extrabold text-indigo-600">
              Unlimited
            </div>
          </div>
          <div className="p-3 rounded-xl bg-violet-50 text-violet-600 group-hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Cloud Firestore Order History Section */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <span>Cloud Firestore Transactions</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Database className="w-3 h-3" /> Live Sync
            </span>
          </h3>
          <span className="text-xs text-neutral-400 font-medium">Collection: /orders</span>
        </div>

        {loadingOrders ? (
          <div className="py-12 text-center text-sm text-neutral-500 flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <span>Fetching your transaction history from Cloud Firestore...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-neutral-900 text-base">No Firestore Transactions Yet</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                When you place an order in the checkout, it will be saved as a real document in Cloud Firestore and appear right here!
              </p>
            </div>
            <button
              onClick={() => onNavigate('home')}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all inline-flex items-center gap-2 shadow-sm"
            >
              <span>Explore AI Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.orderId} className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 hover:border-indigo-300 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start space-x-3.5">
                  <div className="p-3 bg-white rounded-xl border border-neutral-200 text-indigo-600 shrink-0 shadow-2xs">
                    <Package className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-neutral-900">Order #{order.orderId}</span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                        {order.status || 'Confirmed'}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono bg-white px-1.5 py-0.5 rounded border border-neutral-200">
                        Firestore Doc
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600">
                      {order.items && order.items.length > 0 
                        ? `${order.items.map((i: any) => `${i.quantity}x ${i.name}`).join(', ')}`
                        : 'Noor AI Hardware Package'} 
                      • <span className="text-neutral-400">{order.createdAt || 'Just now'}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right sm:self-center shrink-0">
                  <div className="font-extrabold text-base text-indigo-600">
                    ${typeof order.total === 'number' ? order.total.toFixed(2) : order.total}
                  </div>
                  {order.shippingAddress && (
                    <div className="text-[11px] text-neutral-400">
                      Shipped to {order.shippingAddress.city}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mentorship Status Guide */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-950 p-6 rounded-3xl border border-indigo-500/30 text-white shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-extrabold text-emerald-300 text-sm flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Mentorship Roadmap Status: All 6 Steps Mastered! 🏆🔥</span>
          </h4>
          <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/40">
            Full-Stack Architect 🎓
          </span>
        </div>
        <p className="text-xs text-indigo-100 leading-relaxed">
          Congratulations! You have mastered the entire full-stack Firebase & Gemini AI Studio roadmap: <strong className="text-white">Step 1</strong> (Stitch UI layout scaffold), <strong className="text-white">Step 2</strong> (Live Firebase Auth & Cloud Firestore catalog sync), <strong className="text-white">Step 3</strong> (Real-time Checkout Transactions), <strong className="text-white">Step 4</strong> (Gemini AI Marketing Writer), <strong className="text-white">Step 5</strong> (Live Community Reviews & AI Sentiment Verdict), and <strong className="text-white">Step 6</strong> (Live AI Neural Shopping Concierge & Recommender)!
        </p>
        <div className="pt-2 flex flex-wrap gap-2">
          <button
            onClick={() => onNavigate('ai-concierge')}
            className="text-[11px] bg-emerald-500/20 hover:bg-emerald-500/30 px-3 py-1.5 rounded-lg border border-emerald-400/30 text-emerald-200 font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>💬 Talk to Noor AI Concierge now</span>
          </button>
          <span className="text-[11px] bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 text-neutral-200">
            💡 Tip: All chats, orders, and reviews are saved cleanly in Cloud Firestore!
          </span>
        </div>
      </div>

    </div>
  );
};
