import React, { useState } from 'react';
import { CheckCircle, ShieldCheck, Lock, Truck, CreditCard, ArrowLeft, Sparkles, Database } from 'lucide-react';
import { CartItem, ViewState, UserProfile } from '../types';
import { createOrderInFirestore } from '../lib/firebase';

interface CheckoutViewProps {
  items: CartItem[];
  user: UserProfile | null;
  onNavigate: (view: ViewState) => void;
  onClearCart: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  items,
  user,
  onNavigate,
  onClearCart,
}) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  
  const [address, setAddress] = useState({
    fullName: user ? user.displayName : '',
    email: user ? user.email : '',
    street: '123 Neural Avenue',
    city: 'San Francisco',
    zip: '94105',
    country: 'United States'
  });

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const createdId = await createOrderInFirestore(user, items, total, address);
      setOrderId(createdId);
      setIsCompleted(true);
      onClearCart();
    } catch (err) {
      console.error('Failed to create order:', err);
    } finally {
      setProcessing(false);
    }
  };

  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle className="w-12 h-12" />
        </div>
        
        <div className="space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1.5 shadow-2xs">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cloud Firestore Transaction Confirmed • #{orderId || 'NOOR-SUCCESS'}</span>
          </span>
          <h1 className="text-3xl font-extrabold text-neutral-900 mt-2">
            Thank You for Shopping at Noor AI Store!
          </h1>
          <p className="text-neutral-600 max-w-md mx-auto">
            Your order has been permanently recorded in your <strong className="text-neutral-900 font-semibold">Cloud Firestore database</strong> under the <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-indigo-700 text-xs">orders</code> collection!
          </p>
        </div>

        <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200 text-left space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Shipping to:</span>
            <span className="font-semibold text-neutral-900">{address.fullName} ({address.city})</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Total Amount:</span>
            <span className="font-extrabold text-indigo-600">${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <button
            onClick={() => onNavigate('home')}
            className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-xl transition-colors shadow-sm"
          >
            Return to Catalog
          </button>
          <button
            onClick={() => onNavigate('profile')}
            className="px-6 py-3 bg-white hover:bg-neutral-50 text-neutral-800 font-semibold rounded-xl border border-neutral-200 transition-colors"
          >
            View Order History
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Express Checkout</h1>
          <p className="text-sm text-neutral-500">Complete your shipping & payment details</p>
        </div>
        <button
          onClick={() => onNavigate('cart')}
          className="text-sm font-semibold text-indigo-600 hover:underline flex items-center space-x-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </button>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Shipping & Payment Forms */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Shipping Address */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-2xs space-y-4">
            <h3 className="text-lg font-bold text-neutral-900 flex items-center space-x-2">
              <Truck className="w-5 h-5 text-indigo-600" />
              <span>Shipping Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={address.email}
                  onChange={(e) => setAddress({ ...address, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-neutral-600 uppercase mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 uppercase mb-1">City</label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 uppercase mb-1">Postal Code</label>
                <input
                  type="text"
                  required
                  value={address.zip}
                  onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-2xs space-y-4">
            <h3 className="text-lg font-bold text-neutral-900 flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              <span>Simulated Payment</span>
            </h3>

            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center space-x-3 text-indigo-900 text-sm font-medium">
              <Lock className="w-5 h-5 text-indigo-600 shrink-0" />
              <span>No real credit card required! This is a simulated checkout sandbox for your Noor AI Store prototype.</span>
            </div>
          </div>

        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6 h-fit sticky top-24">
          <h3 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-4">
            Order Review ({items.length} items)
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center justify-between text-sm">
                <span className="text-neutral-600 truncate max-w-[160px]">{quantity}x {product.name}</span>
                <span className="font-semibold text-neutral-900">${(product.price * quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t border-neutral-200 pt-4 text-sm">
            <div className="flex justify-between text-neutral-500">
              <span>Subtotal</span>
              <span className="font-semibold text-neutral-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-500">
              <span>Tax (8%)</span>
              <span className="font-semibold text-neutral-900">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-500">
              <span>Shipping</span>
              <span className="font-semibold text-emerald-600">FREE</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-lg font-extrabold border-t border-neutral-200 pt-4">
            <span>Total to Pay</span>
            <span className="text-2xl text-indigo-600">${total.toFixed(2)}</span>
          </div>

          <button
            type="submit"
            disabled={processing || items.length === 0}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center space-x-2"
          >
            {processing ? (
              <span>Saving Transaction to Cloud Firestore...</span>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>Confirm & Place Order</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
