import React from 'react';
import { Heart, ShoppingBag, ArrowLeft, Eye, Trash2 } from 'lucide-react';
import { Product, ViewState } from '../types';

interface WishlistViewProps {
  products: Product[];
  wishlistIds: string[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onRemoveFromWishlist: (product: Product) => void;
  onNavigate: (view: ViewState) => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  products,
  wishlistIds,
  onSelectProduct,
  onAddToCart,
  onRemoveFromWishlist,
  onNavigate,
}) => {
  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  if (wishlistedProducts.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 bg-white rounded-3xl border border-neutral-200 shadow-xs space-y-6 animate-in fade-in duration-200">
        <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
          <Heart className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-neutral-900">Your Wishlist is Empty</h2>
          <p className="text-neutral-500 max-w-md mx-auto">
            Save your favorite Noor AI hardware and generative licenses to review or buy later.
          </p>
        </div>
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-xl transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explore Catalog</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-200">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">My Wishlist</h1>
          <p className="text-sm text-neutral-500">You have saved {wishlistedProducts.length} items for later</p>
        </div>
        <button
          onClick={() => onNavigate('home')}
          className="text-sm font-semibold text-indigo-600 hover:underline flex items-center space-x-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {wishlistedProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-56 bg-neutral-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => onRemoveFromWishlist(product)}
                  className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-rose-50 text-neutral-600 hover:text-rose-600 rounded-full shadow-xs transition-colors"
                  title="Remove from Wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  {product.category}
                </span>
                <h3
                  onClick={() => onSelectProduct(product)}
                  className="font-bold text-lg text-neutral-900 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  {product.name}
                </h3>
                <div className="text-xl font-extrabold text-neutral-900">
                  ${product.price.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 flex items-center gap-2">
              <button
                onClick={() => onSelectProduct(product)}
                className="flex-1 py-2.5 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5"
              >
                <Eye className="w-4 h-4" />
                <span>View Details</span>
              </button>
              <button
                onClick={() => onAddToCart(product)}
                className="flex-1 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Move to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
