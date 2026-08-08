import React, { useState } from 'react';
import { Star, Heart, ShoppingBag, Sparkles, Filter, Check, Eye, Bot, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { COMBO_DEALS } from '../data/mockProducts';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, selectedColor?: string, selectedImage?: string) => void;
  onToggleWishlist: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
}) => {
  const [activeImage, setActiveImage] = useState(product.image);

  const activeColorName = (() => {
    if (!product.images || !product.colors) return undefined;
    const idx = product.images.indexOf(activeImage);
    return idx > -1 ? product.colors[idx] : product.colors[0];
  })();

  const discountPercent = product.cutPrice
    ? Math.round(((product.cutPrice - product.price) / product.cutPrice) * 100)
    : 0;

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="group bg-white rounded-2xl border border-[#E7DFCF] overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden">
        <img
          src={activeImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#171310] text-[#D4AF6A] text-[10px] font-bold uppercase tracking-wider shadow-md">
            -{discountPercent}% Off
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all ${
            isWishlisted
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-white/85 text-neutral-700 hover:bg-white hover:text-rose-500'
          }`}
          title="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Color Thumbnails */}
      {product.images && product.images.length > 1 && (
        <div onClick={(e) => e.stopPropagation()} className="px-4 pt-3 space-y-1.5">
          <div className="flex gap-1.5 overflow-x-auto">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`shrink-0 w-8 h-8 rounded-full overflow-hidden border-2 transition-colors ${
                  activeImage === img ? 'border-[#A6813C]' : 'border-[#E7DFCF]'
                }`}
              >
                <img
                  src={img}
                  alt={`${product.name} color ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
          {activeColorName && (
            <p className="text-[10px] text-neutral-400">Color: <span className="text-neutral-600 font-medium">{activeColorName}</span></p>
          )}
        </div>
      )}

      {/* Product Info */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#A6813C]">
              {product.category}
            </span>
            {product.sizeLabel && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
                {product.sizeLabel}
              </span>
            )}
          </div>

          <h3
            style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-lg font-semibold text-neutral-900 group-hover:text-[#A6813C] transition-colors line-clamp-1"
          >
            {product.name}
          </h3>

          <p className="text-xs text-neutral-500 line-clamp-2">
            {product.tagline}
          </p>

          <div className="flex items-center space-x-1 text-[#A6813C] text-xs font-semibold pt-0.5">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{product.rating}</span>
            <span className="text-neutral-400 font-normal">({product.reviewsCount} reviews)</span>
          </div>
        </div>

        <div className="pt-3 border-t border-[#E7DFCF] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-neutral-900">Rs {product.price.toLocaleString()}</span>
              {product.cutPrice && (
                <span className="text-xs text-neutral-400 line-through">Rs {product.cutPrice.toLocaleString()}</span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectProduct(product);
              }}
              className="p-2.5 border border-[#E7DFCF] hover:border-[#A6813C] text-neutral-700 hover:text-[#A6813C] rounded-full transition-colors"
              title="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product, activeColorName, activeImage);
              }}
              className="px-4 py-2.5 bg-[#171310] hover:bg-[#2A2319] text-[#D4AF6A] text-xs font-bold uppercase tracking-wider rounded-full transition-colors flex items-center space-x-1.5 shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface HomeViewProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, selectedColor?: string, selectedImage?: string) => void;
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

  const categories = ['All', 'Malaysian Hijab Set', 'Khimar', 'Instant Hijab', 'Casual', 'Niqab', 'Accessories'];

  // Product IDs / categories that each combo deal applies to
  const comboCategoryMap: Record<string, string[]> = {
    'combo-2-petite-hijabs': ['noor-luxury-chiffon-georgette-petite'],
    'combo-5-petite-hijabs': ['noor-luxury-chiffon-georgette-petite'],
    'combo-6-niqabs': ['Niqab'],
  };

  const [comboCategories, setComboCategories] = useState<string[] | null>(null);

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory !== 'All'
        ? p.category === selectedCategory
        : comboCategories
        ? comboCategories.includes(p.category) || comboCategories.includes(p.id)
        : true;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-14 sm:space-y-12 pb-16">

      {/* Announcement Bar */}
      <div className="-mt-8 -mx-4 sm:-mx-6 lg:-mx-8 bg-[#D4AF6A] py-2 text-center">
        <span className="text-xs font-semibold text-[#171310]">
          Free delivery on orders above Rs 2,500
        </span>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl text-white shadow-xl border border-[#2A2319] min-h-[420px] flex items-center">
        <div className="absolute inset-0">
          <img
            src="/assets/hero-banner.webp"
            alt="Noor ul Haya — Premium Modest Fashion"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#171310] via-[#171310]/85 to-[#171310]/30" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-6 p-8 md:p-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#D4AF6A]/10 border border-[#D4AF6A]/30 text-[#D4AF6A] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Elegance in Faith</span>
          </div>

          <h1
            style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight text-[#F5EFE3]"
          >
            Modesty in <span className="text-[#D4AF6A]">Style</span>
          </h1>

          <p className="text-[#9C9689] text-base md:text-lg leading-relaxed">
            Premium hijabs, khimars and niqabs crafted for comfort and grace. Discover a collection made for the modern modest woman.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            {onNavigateToAIConcierge && (
              <button
                onClick={onNavigateToAIConcierge}
                className="px-6 py-3 bg-[#D4AF6A] hover:bg-[#C29F5C] text-[#171310] font-bold rounded-xl shadow-lg transition-all flex items-center space-x-2 group cursor-pointer"
              >
                <Bot className="w-4 h-4" />
                <span>Style Assistant</span>
              </button>
            )}
            <a
              href="#catalog"
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl border border-white/20 transition-colors backdrop-blur-sm"
            >
              Browse Catalog
            </a>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="space-y-5">
        <h2
          style={{ fontFamily: "'Playfair Display', serif" }}
          className="text-2xl font-semibold text-neutral-900 text-center"
        >
          The Collections
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-x-4 gap-y-6">
          {[
            { name: 'Malaysian Hijab Set', image: '/assets/product-1/black.webp' },
            { name: 'Khimar', image: '/assets/product-4/black.webp' },
            { name: 'Instant Hijab', image: '/assets/product-2/black.webp' },
            { name: 'Casual', image: '/assets/product-8/black.webp' },
            { name: 'Niqab', image: '/assets/product-5/black.webp' },
            { name: 'Accessories', image: '/assets/product-10/mixed-metallic.webp' },
          ].map((cat) => (
            <button
              key={cat.name}
              onClick={() => {
                setSelectedCategory(cat.name);
                setComboCategories(null);
                document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group flex flex-col items-center space-y-2"
            >
              <div className="w-full aspect-square rounded-full overflow-hidden border-2 border-[#E7DFCF] group-hover:border-[#A6813C] transition-colors">
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[11px] font-semibold text-neutral-700 text-center leading-tight">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Combo Deals */}
      <section className="space-y-5">
        <h2
          style={{ fontFamily: "'Playfair Display', serif" }}
          className="text-2xl font-semibold text-neutral-900 text-center"
        >
          Combo Deals
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {COMBO_DEALS.map((deal) => (
            <div
              key={deal.id}
              onClick={() => {
                setSelectedCategory('All');
                setComboCategories(comboCategoryMap[deal.id] || null);
                document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group bg-[#171310] hover:bg-[#221C15] rounded-2xl px-6 py-6 cursor-pointer transition-colors space-y-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-[#F5EFE3] text-base font-semibold flex items-center gap-2">
                  <span>{deal.icon}</span>
                  <span>{deal.title}</span>
                </p>
                <ArrowRight className="w-5 h-5 text-[#D4AF6A] group-hover:translate-x-1 transition-transform shrink-0" />
              </div>

              <ul className="space-y-1.5">
                {deal.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-[#C9C4B8]">
                    <Check className="w-3.5 h-3.5 text-[#D4AF6A] shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
                {deal.gift && (
                  <li className="flex items-center gap-2 text-xs text-[#D4AF6A] font-semibold">
                    <span>🎁</span>
                    <span>{deal.gift}</span>
                  </li>
                )}
              </ul>

              <p className="text-[#D4AF6A] text-lg font-bold pt-1">Rs {deal.price.toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pt-2 text-xs text-neutral-600 font-medium">
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-[#A6813C]" />
            Premium Quality
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-[#A6813C]" />
            Soft &amp; Breathable Fabric
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-[#A6813C]" />
            Fast Delivery Across Pakistan
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-[#A6813C]" />
            Limited Time Offer
          </span>
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
              {comboCategories && (
                <button
                  onClick={() => setComboCategories(null)}
                  className="ml-2 text-[#A6813C] font-semibold hover:underline"
                >
                  (Clear combo filter)
                </button>
              )}
            </p>
          </div>

          {/* Search & Categories */}
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 bg-neutral-100 border border-neutral-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A6813C] min-w-[200px]"
            />

            <div className="flex flex-wrap items-center gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setComboCategories(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlistIds.includes(product.id)}
                onSelectProduct={onSelectProduct}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        )}
      </section>

    </div>
  );
};
