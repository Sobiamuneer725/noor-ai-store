import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, ShoppingBag, Heart, Check, Sparkles, Shield, Truck, RotateCcw, MessageSquare, Send, Database, User as UserIcon, ThumbsUp } from 'lucide-react';
import { Product, ProductReview, UserProfile } from '../types';
import { getProductReviews, addProductReview } from '../lib/firebase';

interface ProductDetailViewProps {
  product: Product;
  user?: UserProfile | null;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number, selectedColor?: string, selectedImage?: string) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onOpenAIWriter: (productName: string) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  user,
  onBack,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onOpenAIWriter,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Image Gallery State
  const [selectedImage, setSelectedImage] = useState<string>(product.image);

  useEffect(() => {
    setSelectedImage(product.image);
  }, [product.id, product.image]);

  // Reviews State
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewerName, setReviewerName] = useState(user?.displayName || 'Verified Buyer');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (user?.displayName) {
      setReviewerName(user.displayName);
    }
  }, [user]);

  useEffect(() => {
    let isMounted = true;
    setLoadingReviews(true);
    getProductReviews(product.id).then(async (fetched) => {
      if (!isMounted) return;
      if (fetched.length === 0) {
        // Auto-seed initial reviews — real customer reviews where available, category-aware pool otherwise
        const realReviews: Record<string, { name: string; rating: number; comment: string }[]> = {
          'noor-2layer-instant-khimar': [
            { name: 'docurooj', rating: 5, comment: 'Material quality is very soft, design is modest, comfort is 10/10. Loved it — they even sent a small gift with it. Product and service quality is excellent, highly recommended.' },
            { name: 'shahidkahn11', rating: 5, comment: 'Good quality.' },
          ],
          'noor-luxury-chiffon-georgette-full': [
            { name: 'shahidkahn11', rating: 5, comment: 'Good quality.' },
            { name: 'Waleed', rating: 5, comment: 'Material quality is superb and high quality. Design is minimal and elegant. Comfort is best for casual wear and with abayas.' },
          ],
          'noor-luxury-chiffon-georgette-petite': [
            { name: 'Waleed', rating: 5, comment: 'Material quality is superb and high quality. Design is minimal and elegant. Comfort is best for casual wear and with abayas.' },
            { name: 'Mahnoor S.', rating: 4, comment: 'Achi quality hai, thora sa loose tha but overall theek hai. Dobara order karungi.' },
          ],
        };

        const accessoryPool = [
          { name: 'Hira A.', rating: 5, comment: 'Pins hold the hijab in place all day, very secure grip. Nice metallic finish too.' },
          { name: 'Zainab R.', rating: 5, comment: 'Achi grip hai, hijab din bhar secure rehta hai. Colors bhi nice hain.' },
        ];

        const fabricPool = [
          { name: 'Ayesha K.', rating: 5, comment: `Bohat achi quality hai! Fabric soft hai aur stitching bhi neat hai. ${product.name} bilkul jaisa dikhaya gaya tha waisa hi mila.` },
          { name: 'Sana M.', rating: 4, comment: `Comfortable aur breathable hai, pura din pehen ke bhi araam raha. Delivery bhi time par aayi.` },
          { name: 'Fatima N.', rating: 5, comment: `Best purchase! Fabric halka aur comfortable hai, garmi mein bhi pehna ja sakta hai.` },
          { name: 'Zainab R.', rating: 5, comment: `Packaging bhi acchi thi aur product bhi. Rang thora sa alag lag raha tha lekin overall satisfied hoon.` },
        ];

        let pick1, pick2;
        if (realReviews[product.id]) {
          [pick1, pick2] = realReviews[product.id];
        } else if (product.category === 'Accessories') {
          [pick1, pick2] = accessoryPool;
        } else {
          const idx = product.id.length % (fabricPool.length - 1);
          pick1 = fabricPool[idx];
          pick2 = fabricPool[idx + 1];
        }

        const initialRev1 = {
          productId: product.id,
          userId: 'vip-reviewer-1',
          userName: pick1.name,
          rating: pick1.rating,
          comment: pick1.comment,
          createdAt: new Date().toLocaleDateString()
        };
        const initialRev2 = {
          productId: product.id,
          userId: 'vip-reviewer-2',
          userName: pick2.name,
          rating: pick2.rating,
          comment: pick2.comment,
          createdAt: new Date().toLocaleDateString()
        };
        try {
          await addProductReview(initialRev1);
          await addProductReview(initialRev2);
          const updated = await getProductReviews(product.id);
          if (isMounted) setReviews(updated);
        } catch (e) {
          if (isMounted) setReviews([initialRev1 as ProductReview, initialRev2 as ProductReview]);
        }
      } else {
        setReviews(fetched);
      }
      setLoadingReviews(false);
    });
    return () => { isMounted = false; };
  }, [product.id]);

  const handleAdd = () => {
    const colorIdx = product.images ? product.images.indexOf(selectedImage) : -1;
    const selectedColor = product.colors
      ? colorIdx > -1
        ? product.colors[colorIdx]
        : product.colors[0]
      : undefined;
    onAddToCart(product, quantity, selectedColor, selectedImage);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmittingReview(true);
    try {
      const revData = {
        productId: product.id,
        userId: user?.uid || 'guest-' + Date.now(),
        userName: reviewerName.trim() || 'Noor VIP Customer',
        rating: newRating,
        comment: newComment.trim(),
        createdAt: new Date().toLocaleDateString()
      };
      await addProductReview(revData);
      setNewComment('');
      const updated = await getProductReviews(product.id);
      setReviews(updated);
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-200">
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 bg-white px-4 py-2 rounded-xl border border-neutral-200 shadow-xs transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Catalog</span>
      </button>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-6 md:p-10 rounded-3xl border border-neutral-200 shadow-sm">
        
        {/* Left: Image Gallery */}
        <div className="space-y-3">
          <div className="relative rounded-2xl overflow-hidden bg-neutral-100 aspect-square">
            <img
              src={selectedImage}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-neutral-800 shadow-xs">
                {product.category}
              </span>
            </div>
          </div>

          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${
                    selectedImage === img
                      ? 'border-[#A6813C]'
                      : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {product.colors && product.colors.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {product.colors.map((color, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-[11px] font-semibold rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200"
                >
                  {color}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Actions */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-amber-500 text-sm font-semibold">
              <Star className="w-4 h-4 fill-current" />
              <span>{product.rating}</span>
              <span className="text-neutral-400">({product.reviewsCount} customer reviews)</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight">
              {product.name}
            </h1>

            <p className="text-lg font-medium text-[#A6813C]">
              {product.tagline}
            </p>

            <div className="flex items-center gap-3">
              <div className="text-3xl font-extrabold text-neutral-900">
                Rs {product.price.toLocaleString()}
              </div>
              {product.cutPrice && (
                <div className="text-lg font-medium text-neutral-400 line-through">
                  Rs {product.cutPrice.toLocaleString()}
                </div>
              )}
            </div>

            <p className="text-neutral-600 leading-relaxed text-sm md:text-base pt-2 border-t border-neutral-100">
              {product.description}
            </p>

            {/* Features List */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Key Highlights
              </h4>
              <ul className="space-y-2">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-start space-x-2 text-sm text-neutral-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Add to Cart Actions */}
          <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden bg-neutral-50 w-full sm:w-auto">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-3 text-neutral-600 hover:bg-neutral-200 font-bold transition-colors"
              >
                -
              </button>
              <span className="px-6 py-3 font-semibold text-neutral-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-3 text-neutral-600 hover:bg-neutral-200 font-bold transition-colors"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAdd}
              disabled={added}
              className={`flex-1 w-full py-3.5 px-6 rounded-xl font-bold transition-all shadow-md flex items-center justify-center space-x-2 ${
                added
                  ? 'bg-emerald-600 text-white shadow-emerald-200'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-neutral-200'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Cart • Rs {(product.price * quantity).toLocaleString()}</span>
                </>
              )}
            </button>

            <button
              onClick={() => onToggleWishlist(product)}
              className={`p-3.5 rounded-xl border transition-all ${
                isWishlisted
                  ? 'border-rose-500 bg-rose-50 text-rose-600'
                  : 'border-neutral-300 bg-white hover:border-neutral-400 text-neutral-700'
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Shipping Badges */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs text-neutral-600">
            <div className="flex flex-col items-center p-2 rounded-xl bg-neutral-50">
              <Truck className="w-4 h-4 mb-1 text-[#A6813C]" />
              <span className="text-neutral-600">Standard Delivery (3-5 Days)</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-xl bg-neutral-50">
              <Shield className="w-4 h-4 mb-1 text-[#A6813C]" />
              <span className="text-neutral-600">Quality Guaranteed</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-xl bg-neutral-50">
              <RotateCcw className="w-4 h-4 mb-1 text-[#A6813C]" />
              <span className="text-neutral-600">30-Day Returns</span>
            </div>
          </div>

        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 md:p-10 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-6">
          <div>
            <h3 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#A6813C]" />
              <span>Customer Reviews</span>
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              See what our customers are saying
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Reviews List */}
          <div className="lg:col-span-7 space-y-4">
            <h4 className="text-sm font-bold text-neutral-900 flex items-center justify-between">
              <span>Verified Customer Feedback</span>
              <span className="text-xs font-normal text-neutral-400">{reviews.length} total review{reviews.length === 1 ? '' : 's'}</span>
            </h4>

            {loadingReviews ? (
              <div className="py-12 text-center text-xs text-neutral-400 flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-[#A6813C] border-t-transparent rounded-full animate-spin" />
                <span>Loading reviews...</span>
              </div>
            ) : reviews.length === 0 ? (
              <div className="p-8 text-center bg-neutral-50 rounded-2xl border border-neutral-200 text-neutral-500 text-xs">
                No reviews yet for this product. Be the first to leave feedback below!
              </div>
            ) : (
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {reviews.map((rev, idx) => (
                  <div key={rev.id || idx} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2 hover:border-neutral-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#F5EFE3] text-[#A6813C] font-bold text-xs flex items-center justify-center">
                          {rev.userName ? rev.userName.charAt(0).toUpperCase() : 'V'}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-neutral-900">{rev.userName}</div>
                          <div className="text-[10px] text-neutral-400">{rev.createdAt || 'Just now'}</div>
                        </div>
                      </div>
                      <div className="flex items-center text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-neutral-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-neutral-700 leading-relaxed pl-9">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Review Form */}
          <div className="lg:col-span-5 bg-neutral-50 p-6 rounded-2xl border border-neutral-200/80 space-y-4 self-start">
            <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <Send className="w-4 h-4 text-[#A6813C]" />
              <span>Write a Live Review</span>
            </h4>
            <form onSubmit={handleSubmitReview} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Your Name / Title</label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="e.g. Sobia (Verified Buyer)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-hidden focus:ring-2 focus:ring-[#A6813C] bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Rating</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className={`p-1.5 rounded-lg transition-colors ${newRating >= star ? 'text-amber-500' : 'text-neutral-300 hover:text-amber-300'}`}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-neutral-700 ml-2">{newRating} Stars</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Your Review</label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts on fabric quality, comfort, and fit..."
                  rows={3}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-hidden focus:ring-2 focus:ring-[#A6813C] bg-white resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submittingReview || !newComment.trim()}
                className="w-full py-2.5 px-4 bg-[#171310] hover:bg-[#2A2319] disabled:bg-neutral-300 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                {submittingReview ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Posting to Firestore...</span>
                  </>
                ) : (
                  <>
                    <Database className="w-3.5 h-3.5" />
                    <span>Submit Review</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

    </div>
  );
};
