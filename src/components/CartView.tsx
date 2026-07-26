import React from 'react';
import { Trash2, ArrowRight, ShoppingBag, ArrowLeft, ShieldCheck } from 'lucide-react';
import { CartItem, ViewState } from '../types';

interface CartViewProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onNavigate: (view: ViewState) => void;
}

export const CartView: React.FC<CartViewProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onNavigate,
}) => {
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = items.length > 0 ? 0 : 0; // Free shipping
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 bg-white rounded-3xl border border-neutral-200 shadow-xs space-y-6">
        <div className="w-20 h-20 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-neutral-900">Your Cart is Empty</h2>
          <p className="text-neutral-500 max-w-md mx-auto">
            Your Noor AI Store shopping cart is waiting for items! Explore our catalog of cutting-edge hardware and generative tools.
          </p>
        </div>
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-xl transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Catalog</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Shopping Cart</h1>
          <p className="text-sm text-neutral-500">Review your AI store items before checkout</p>
        </div>
        <button
          onClick={() => onNavigate('home')}
          className="text-sm font-semibold text-indigo-600 hover:underline flex items-center space-x-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="bg-white p-4 sm:p-6 rounded-2xl border border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 object-cover rounded-xl bg-neutral-100 shrink-0"
                />
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    {product.category}
                  </span>
                  <h3 className="font-bold text-base text-neutral-900">{product.name}</h3>
                  <div className="text-sm font-semibold text-neutral-700">
                    ${product.price.toFixed(2)} each
                  </div>
                </div>
              </div>

              {/* Quantity & Remove Controls */}
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-100">
                <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50">
                  <button
                    onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                    className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-200 font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 font-semibold text-sm text-neutral-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                    className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-200 font-bold transition-colors"
                  >
                    +
                  </button>
                </div>

                <div className="text-right font-extrabold text-neutral-900 w-20">
                  ${(product.price * quantity).toFixed(2)}
                </div>

                <button
                  onClick={() => onRemoveItem(product.id)}
                  className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Remove Item"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Card */}
        <div className="bg-neutral-900 text-white p-6 sm:p-8 rounded-3xl space-y-6 h-fit sticky top-24 shadow-xl">
          <h3 className="text-xl font-bold tracking-tight">Order Summary</h3>

          <div className="space-y-3 text-sm border-b border-neutral-800 pb-6">
            <div className="flex justify-between text-neutral-400">
              <span>Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
              <span className="font-semibold text-white">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Express AI Shipping</span>
              <span className="font-semibold text-emerald-400">FREE</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Estimated Tax (8%)</span>
              <span className="font-semibold text-white">${tax.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-lg font-extrabold">
            <span>Total Due</span>
            <span className="text-2xl text-indigo-400">${total.toFixed(2)}</span>
          </div>

          <button
            onClick={() => onNavigate('checkout')}
            className="w-full py-4 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 group"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="flex items-center justify-center space-x-2 text-xs text-neutral-400 pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Secure Stitch & Firebase Sandbox Checkout</span>
          </div>
        </div>

      </div>
    </div>
  );
};
