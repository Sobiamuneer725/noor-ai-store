import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInAnonymously, updateProfile } from 'firebase/auth';
import { auth, syncUserProfile } from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (isSignUp && !name)) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        await syncUserProfile(userCredential.user.uid, {
          email: userCredential.user.email || email,
          displayName: name
        });
        
        onLoginSuccess({
          uid: userCredential.user.uid,
          email: userCredential.user.email || email,
          displayName: name,
          createdAt: new Date().toLocaleDateString()
        });
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const displayName = userCredential.user.displayName || email.split('@')[0];
        await syncUserProfile(userCredential.user.uid, {
          email: userCredential.user.email || email,
          displayName
        });
        
        onLoginSuccess({
          uid: userCredential.user.uid,
          email: userCredential.user.email || email,
          displayName,
          createdAt: new Date().toLocaleDateString()
        });
      }
      onClose();
    } catch (err: any) {
      console.error('Firebase auth error:', err);
      let msg = err.message || 'Authentication failed. Please try again.';
      if (err.code === 'auth/email-already-in-use') msg = 'This email is already registered. Please sign in instead.';
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') msg = 'Invalid email or password.';
      if (err.code === 'auth/weak-password') msg = 'Password should be at least 6 characters.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const userCredential = await signInAnonymously(auth);
      await updateProfile(userCredential.user, { displayName: 'Noor VIP Customer' });
      const demoProfile: UserProfile = {
        uid: userCredential.user.uid,
        email: 'vip.customer@noorstore.ai',
        displayName: 'Noor VIP Customer',
        createdAt: new Date().toLocaleDateString()
      };
      await syncUserProfile(userCredential.user.uid, demoProfile);
      onLoginSuccess(demoProfile);
      onClose();
    } catch (err: any) {
      console.error('Demo auth error:', err);
      setError('Failed to start anonymous session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-neutral-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 to-neutral-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase tracking-widest bg-emerald-500/30 text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-400/30 font-semibold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Firebase Auth Live</span>
            </span>
          </div>
          <h3 className="text-2xl font-bold mt-2">
            {isSignUp ? 'Create Noor Account' : 'Welcome Back'}
          </h3>
          <p className="text-neutral-300 text-sm mt-1">
            {isSignUp 
              ? 'Sign up to sync wishlists, orders, and AI preferences.' 
              : 'Sign in to access your saved items and AI Writer history.'}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-5 h-5 absolute left-3.5 top-2.5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="e.g. Sobia Muneer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-2.5 text-neutral-400" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-2.5 text-neutral-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-indigo-100 flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Authenticating with Firebase...' : (isSignUp ? 'Sign Up' : 'Sign In')}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Footer & Demo Button */}
        <div className="px-6 pb-6 pt-2 bg-neutral-50 border-t border-neutral-100 flex flex-col space-y-3">
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-2 bg-white hover:bg-neutral-100 text-neutral-800 text-sm font-medium rounded-xl border border-neutral-200 transition-colors flex items-center justify-center space-x-2 shadow-2xs"
          >
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Instant Demo VIP Login (Firebase Anonymous Auth)</span>
          </button>

          <div className="text-center text-sm text-neutral-600">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-indigo-600 font-semibold hover:underline"
            >
              {isSignUp ? 'Sign In' : 'Sign Up Now'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

