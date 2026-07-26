import React, { useState } from 'react';
import { Star, Heart, ShoppingBag, Sparkles, Filter, Check, Eye, Bot } from 'lucide-react';
import { Product } from '../types';

interface HomeViewProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: string[];
  onNavigateToAIWriter: () => void;
  onNavigateToAIConcierge?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onNavigateToAIWriter,
  onNavigateToAIConcierge,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Hardware', 'Software', 'Accessories'];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12 pb-16">
      
      {/* Stitch UI Welcome Banner / Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-indigo-950 to-neutral-900 text-white shadow-xl p-8 md:p-12 border border-neutral-800">
        <div className="absolute -right-10 -top-10 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 -bottom-10 w-72 h-72 rounded-full bg-violet-600/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Live AI Shopping Assistant</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Welcome to <span className="bg-gradient-to-r from-indigo-400 to-violet-300 bg-clip-text text-transparent">Noor AI Store</span>
          </h1>

          <p className="text-neutral-300 text-base md:text-lg leading-relaxed">
            Discover next-generation AI-powered shopping — get instant product recommendations, AI-written marketing content, and a live AI concierge to help you find exactly what you need.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            {onNavigateToAIConcierge && (
              <button
                onClick={onNavigateToAIConcierge}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2 group cursor-pointer"
              >
                <Bot className="w-4 h-4 animate-bounce" />
                <span>Talk to AI Concierge</span>
              </button>
            )}
            <button
              onClick={onNavigateToAIWriter}
              className="px-5 py-3 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl border border-white/10 transition-all flex items-center space-x-2 group cursor-pointer"
            >
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform text-indigo-300" />
              <span>Gemini AI Writer</span>
            </button>
            <a
              href="#catalog"
              className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl border border-white/10 transition-colors"
            >
              Browse Catalog
            </a>
          </div>
        </div>
      </section>

      {/* Catalog Section Header & Filter Controls */}
      <section id="catalog" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
              Featured Catalog
            </h2>
            <p className="text-sm text-neutral-500">
              Showing {filteredProducts.length} items available in Noor Store
            </p>
          </div>

          {/* Search & Categories */}
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Search Noor AI products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 bg-neutral-100 border border-neutral-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[200px]"
            />

            <div className="flex items-center space-x-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-neutral-50 rounded-3xl border border-neutral-200">
            <p className="text-neutral-600 font-medium">No products match your filter criteria.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="mt-4 text-sm font-semibold text-indigo-600 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => {
              const isWishlisted = wishlistIds.includes(product.id);
              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {/* Product Image Container */}
                  <div className="relative h-64 bg-neutral-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider text-neutral-800 shadow-xs">
                        {product.category}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product);
                      }}
                      className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all ${
                        isWishlisted
                          ? 'bg-rose-500 text-white shadow-md'
                          : 'bg-white/80 text-neutral-700 hover:bg-white hover:text-rose-500'
                      }`}
                      title="Save to Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-1 text-amber-500 text-xs font-semibold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{product.rating}</span>
                        <span className="text-neutral-400">({product.reviewsCount} reviews)</span>
                      </div>

                      <h3 
                        onClick={() => onSelectProduct(product)}
                        className="font-bold text-lg text-neutral-900 group-hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1"
                      >
                        {product.name}
                      </h3>

                      <p className="text-sm text-neutral-600 line-clamp-2">
                        {product.tagline}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-neutral-400 uppercase font-semibold block">Price</span>
                        <span className="text-xl font-bold text-neutral-900">${product.price.toFixed(2)}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onSelectProduct(product)}
                          className="p-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl transition-colors"
                          title="Quick View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onAddToCart(product)}
                          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors flex items-center space-x-1.5 shadow-xs"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
};
