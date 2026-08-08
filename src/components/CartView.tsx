import React from 'react';
import { Trash2, ArrowRight, ShoppingBag, ArrowLeft, ShieldCheck } from 'lucide-react';
import { CartItem, ViewState } from '../types';

interface CartViewProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number, selectedColor?: string) => void;
  onRemoveItem: (productId: string, selectedColor?: string) => void;
  onNavigate: (view: ViewState) => void;
}

export const CartView: React.FC<CartViewProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onNavigate,
}) => {
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const FREE_DELIVERY_THRESHOLD = 2500;
  const DELIVERY_FEE = 250;
  const shipping = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 bg-white rounded-3xl border border-neutral-200 shadow-xs space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#F5EFE3] text-[#A6813C] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-neutral-900">Your Cart is Empty</h2>
          <p className="text-neutral-500 max-w-md mx-auto">
            Your Noor ul Haya shopping cart is waiting for items! Explore our collection of premium hijabs, khimars and niqabs.
          </p>
        </div>
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-[#171310] hover:bg-[#2A2319] text-[#D4AF6A] font-semibold rounded-xl transition-colors shadow-sm"
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
          <p className="text-sm text-neutral-500">Review your items before checkout</p>
        </div>
        <button
          onClick={() => onNavigate('home')}
          className="text-sm font-semibold text-[#A6813C] hover:underline flex items-center space-x-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity, selectedColor, selectedImage }) => (
            <div
              key={`${product.id}__${selectedColor || ''}`}
              className="bg-white p-4 sm:p-6 rounded-2xl border border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={selectedImage || product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 object-cover rounded-xl bg-neutral-100 shrink-0"
                />
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#A6813C] bg-[#F5EFE3] px-2 py-0.5 rounded-md">
                    {product.category}
                  </span>
                  <h3 className="font-bold text-base text-neutral-900">{product.name}</h3>
                  {selectedColor && (
                    <p className="text-xs text-neutral-500">Color: <span className="font-semibold text-neutral-700">{selectedColor}</span></p>
                  )}
                  <div className="text-sm font-semibold text-neutral-700">
                    Rs {product.price.toLocaleString()} each
                  </div>
                </div>
              </div>

              {/* Quantity & Remove Controls */}
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-100">
                <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50">
                  <button
                    onClick={() => onUpdateQuantity(product.id, quantity - 1, selectedColor)}
                    className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-200 font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 font-semibold text-sm text-neutral-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(product.id, quantity + 1, selectedColor)}
                    className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-200 font-bold transition-colors"
                  >
                    +
                  </button>
                </div>

                <div className="text-right font-extrabold text-neutral-900 w-24">
                  Rs {(product.price * quantity).toLocaleString()}
                </div>

                <button
                  onClick={() => onRemoveItem(product.id, selectedColor)}
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
        <div className="bg-[#171310] text-white p-6 sm:p-8 rounded-3xl space-y-6 h-fit sticky top-24 shadow-xl">
          <h3 className="text-xl font-bold tracking-tight">Order Summary</h3>

          <div className="space-y-3 text-sm border-b border-[#2A2319] pb-6">
            <div className="flex justify-between text-[#9C9689]">
              <span>Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
              <span className="font-semibold text-white">Rs {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#9C9689]">
              <span>Delivery</span>
              {shipping === 0 ? (
                <span className="font-semibold text-emerald-400">FREE</span>
              ) : (
                <span className="font-semibold text-white">Rs {shipping.toLocaleString()}</span>
              )}
            </div>
            {shipping > 0 && (
              <p className="text-[11px] text-[#D4AF6A]">
                Add Rs {(FREE_DELIVERY_THRESHOLD - subtotal).toLocaleString()} more for free delivery
              </p>
            )}
          </div>

          <div className="flex justify-between items-center text-lg font-extrabold">
            <span>Total Due</span>
            <span className="text-2xl text-[#D4AF6A]">Rs {total.toLocaleString()}</span>
          </div>

          <button
            onClick={() => onNavigate('checkout')}
            className="w-full py-4 bg-[#D4AF6A] hover:bg-[#C29F5C] text-[#171310] font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 group"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="flex items-center justify-center space-x-2 text-xs text-[#9C9689] pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Secure Checkout</span>
          </div>
        </div>

      </div>
    </div>
  );
};
