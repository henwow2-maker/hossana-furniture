import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Sparkles, Send, User } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { toast } from 'sonner';

interface Review {
  id: string;
  productId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}

interface ProductReviewsProps {
  productId: string;
}

const DEFAULT_REVIEW_TEMPLATES = [
  {
    userName: "Aster Solomon",
    userEmail: "aster.s@luxury-design.com",
    comment: "The proportions of this piece are absolutely perfect. The grain of the material is gorgeous in natural morning light, and the joinery feels incredibly solid. A true heirloom furniture piece that has redefined our lounge space.",
    ratingOffset: 5
  },
  {
    userName: "Yoseph Kebede",
    userEmail: "yoseph.k@architectures.et",
    comment: "Hossana has outdone themselves with this design. The minimalist silhouette fits perfectly in our conservatory. Hand-delivered and unpacked by a wonderful white-glove team who took total care of the interior placement.",
    ratingOffset: 5
  },
  {
    userName: "Tsion Girma",
    userEmail: "tsion.girma@editorial.com.et",
    comment: "Exquisite quality and stunning texture. It took slightly longer than expected to ship, but once it arrived we were blown away by the heavy protective padding and structural craftsmanship. Extremely luxurious.",
    ratingOffset: 4
  },
  {
    userName: "Dr. Abraham Tekle",
    userEmail: "abraham@univ.edu.et",
    comment: "Exceptional comfort and design symmetry. The finish is smooth and flawless. Pairs beautifully with our mid-century collection. It serves as both a high-fidelity art piece and a highly functional element in our daily study.",
    ratingOffset: 5
  }
];

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { user } = useAuth();
  const { products, updateProduct } = useProducts();
  const product = products.find(p => p.id === productId);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingInput, setRatingInput] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [commentInput, setCommentInput] = useState<string>('');
  const [guestName, setGuestName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('recent');

  // Load reviews on mount and reset values
  useEffect(() => {
    if (!product) return;

    const storageKey = `hossana_reviews_${productId}`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      try {
        setReviews(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse reviews", e);
        initializeDefaultReviews();
      }
    } else {
      initializeDefaultReviews();
    }
  }, [productId, product?.rating]);

  // Recalculate average rating & update global context product whenever reviews state changes
  useEffect(() => {
    if (!product || reviews.length === 0) return;

    const totalStars = reviews.reduce((sum, r) => sum + r.rating, 0);
    const calculatedAvg = Math.round((totalStars / reviews.length) * 10) / 10;
    
    // Only update if it actually differs from current rating to avoid infinite renders
    if (Math.abs(product.rating - calculatedAvg) > 0.05) {
      updateProduct({
        ...product,
        rating: calculatedAvg
      });
    }
  }, [reviews]);

  const initializeDefaultReviews = () => {
    if (!product) return;
    
    // Generate static dates for past reviews depending on product ID
    const baseDate = new Date();
    const mockReviews: Review[] = DEFAULT_REVIEW_TEMPLATES.map((tpl, i) => {
      const reviewDate = new Date(baseDate);
      reviewDate.setDate(baseDate.getDate() - (i * 12 + 4));
      
      const seedNum = (productId.charCodeAt(0) + i) % 100;
      const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=user_hash_${seedNum + tpl.userName.length}`;

      const finalRating = Math.min(5, Math.max(1, Math.round(product.rating) + (tpl.ratingOffset - 5)));

      return {
        id: `rev-default-${productId}-${i}`,
        productId,
        userName: tpl.userName,
        userEmail: tpl.userEmail,
        userAvatar: avatar,
        rating: finalRating,
        comment: tpl.comment,
        date: reviewDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      };
    });

    setReviews(mockReviews);
    localStorage.setItem(`hossana_reviews_${productId}`, JSON.stringify(mockReviews));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();

    const nameToUse = user ? user.name : guestName.trim();
    const emailToUse = user ? user.email : guestEmail.trim();

    if (!nameToUse) {
      toast.error('Please enter your name to submit a review.');
      return;
    }

    if (!emailToUse || !emailToUse.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }

    if (commentInput.trim().length < 10) {
      toast.error('Your review is too short! Please write at least 10 characters.');
      return;
    }

    const nextId = `rev-user-${Math.random().toString(36).substr(2, 9)}`;
    const avatar = user ? user.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(emailToUse)}`;

    const newReview: Review = {
      id: nextId,
      productId,
      userName: nameToUse,
      userEmail: emailToUse,
      userAvatar: avatar,
      rating: ratingInput,
      comment: commentInput.trim(),
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(`hossana_reviews_${productId}`, JSON.stringify(updatedReviews));

    // Clear form inputs
    setCommentInput('');
    setGuestName('');
    setGuestEmail('');
    setRatingInput(5);

    toast.success('Your exquisite product review was submitted successfully!');
  };

  if (!product) return null;

  // Star Rating calculations
  const totalReviewsCount = reviews.length;
  const ratingSum = reviews.reduce((acc, r) => acc + r.rating, 0);
  const averageRating = totalReviewsCount > 0 ? (ratingSum / totalReviewsCount).toFixed(1) : product.rating.toFixed(1);

  const starPercentages = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(r => r.rating === stars).length;
    return {
      stars,
      count,
      percentage: totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : 0
    };
  });

  // Sorting
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'highest') return b.rating - a.rating;
    if (sortBy === 'lowest') return a.rating - b.rating;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div id="reviews-section" className="border-t border-slate-200 pt-16 mt-16 pb-24 text-black">
      <div className="flex flex-col gap-1 inline-flex items-center gap-2 text-gold font-bold uppercase tracking-[0.2em] text-[10px] mb-4">
        <Sparkles className="w-4 h-4 text-gold shrink-0" />
        Atelier Reviews
      </div>
      <h2 className="text-3xl md:text-5xl font-serif font-black text-black mb-12">Client Feedback</h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Rating Distributions Card */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-[32px] p-8 text-black">
          <h3 className="text-lg font-serif font-bold text-black mb-6 uppercase tracking-wider">Rating Summary</h3>
          
          <div className="flex items-baseline gap-4 mb-8">
            <span className="text-5xl md:text-6xl font-serif font-black text-black">{averageRating}</span>
            <div>
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`w-4 h-4 ${star <= Math.round(Number(averageRating)) ? 'text-gold fill-gold' : 'text-slate-200'}`} 
                  />
                ))}
              </div>
              <span className="text-xs text-black font-semibold">Based on {totalReviewsCount} verified testimonials</span>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="space-y-4">
            {starPercentages.map(({ stars, count, percentage }) => (
              <div key={stars} className="flex items-center gap-4 text-xs font-semibold text-black">
                <span className="w-12 text-black font-semibold font-mono text-left">{stars} Stars</span>
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gold rounded-full"
                  />
                </div>
                <span className="w-12 text-right text-black font-semibold">{percentage}% ({count})</span>
              </div>
            ))}
          </div>

          {/* Form Trigger or Prompt */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <p className="text-xs text-black leading-relaxed font-semibold">
              We value your design experience. Share your thoughts on the materials, comfort level, and visual integrity of this craft.
            </p>
          </div>
        </div>

        {/* Reviews List and Submission */}
        <div className="lg:col-span-7 flex flex-col gap-12 text-black">
          
          {/* Create Review Form */}
          <div className="bg-slate-50 border border-slate-200 rounded-[32px] p-8 sm:p-10">
            <h3 className="text-xl font-serif text-black font-bold tracking-tight mb-2">Write a Review</h3>
            <p className="text-xs text-black font-semibold mb-8">Let other patrons know your experience with the {product.name}.</p>

            <form onSubmit={handleSubmitReview} className="space-y-6">
              
              {/* Star Input */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-black mb-2.5">Your Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 5, 4].sort((a,b) => a - b).map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRatingInput(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1 -ml-1 transition-transform hover:scale-110 duration-200"
                    >
                      <Star 
                        className={`w-7 h-7 transition-colors ${
                          star <= (hoverRating ?? ratingInput) 
                            ? 'text-gold fill-gold drop-shadow-[0_0_8px_rgba(212,175,55,0.25)]' 
                            : 'text-slate-200 hover:text-gold/40'
                        }`} 
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono ml-3 text-gold self-center font-bold">
                    {ratingInput === 5 ? 'Magnificent • 5/5' : 
                     ratingInput === 4 ? 'Very Pleased • 4/5' : 
                     ratingInput === 3 ? 'Satisfactory • 3/5' : 
                     ratingInput === 2 ? 'Subpar • 2/5' : 'Extremely Disappointed • 1/5'}
                  </span>
                </div>
              </div>

              {/* Guest Inputs (if not authenticated) */}
              {!user ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="reviewer-name" className="block text-[10px] uppercase tracking-widest font-bold text-black mb-2">Name</label>
                    <input
                      id="reviewer-name"
                      type="text"
                      required
                      placeholder="e.g. Charlotte Temple"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full bg-white border border-slate-300 text-black rounded-xl focus:border-gold outline-none p-3.5 text-sm font-semibold placeholder:text-slate-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="reviewer-email" className="block text-[10px] uppercase tracking-widest font-bold text-black mb-2">Email Address</label>
                    <input
                      id="reviewer-email"
                      type="email"
                      required
                      placeholder="e.g. charlotte@design.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full bg-white border border-slate-300 text-black rounded-xl focus:border-gold outline-none p-3.5 text-sm font-semibold placeholder:text-slate-400 transition-colors"
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-8 h-8 rounded-full border border-slate-200 object-cover" 
                    />
                    <div>
                      <p className="text-xs text-black font-bold">Posting as <span className="text-gold font-bold">{user.name}</span></p>
                      <p className="text-[10px] text-black font-semibold">{user.email}</p>
                    </div>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider bg-gold/10 border border-gold/20 text-gold font-mono py-0.5 px-2 rounded-full">Authenticated Patron</span>
                </div>
              )}

              {/* Text Input */}
              <div>
                <label htmlFor="review-text" className="block text-[10px] uppercase tracking-widest font-bold text-black mb-2">Your Review & Notes</label>
                <textarea
                  id="review-text"
                  required
                  rows={4}
                  placeholder="Describe your design verdict, finish quality, texture and comfort..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-black rounded-2xl focus:border-gold outline-none p-4 text-sm font-semibold placeholder:text-slate-400 transition-colors resize-none leading-relaxed"
                />
                <div className="flex justify-between items-center mt-2.5 text-[10px] text-black font-semibold font-mono">
                  <span>Minimum 10 characters</span>
                  <span className={commentInput.length >= 10 ? 'text-emerald-600' : 'text-amber-600'}>
                    {commentInput.length} characters entered
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                id="submit-review"
                type="submit"
                className="w-full bg-gold hover:bg-gold/90 text-white font-bold uppercase tracking-widest text-[11px] h-12 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 hover:scale-[1.01]"
              >
                Send Feedback <Send className="w-3.5 h-3.5" />
              </Button>

            </form>
          </div>

          {/* List of Reviews Header & Sorting */}
          <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-200 pb-4 mb-6 gap-4 text-black">
              <h3 className="text-lg font-serif font-black text-black uppercase tracking-wider">Patron Reviews ({totalReviewsCount})</h3>
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-widest text-black font-semibold font-mono">Sort By</span>
                <select
                  id="review-sorting"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-slate-300 text-xs text-black outline-none rounded-xl py-2 px-3 font-bold focus:border-gold hover:border-gold/50 cursor-pointer transition-all"
                >
                  <option value="recent">Most Recent</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                </select>
              </div>
            </div>

            {/* List */}
            <div className="space-y-6">
              <AnimatePresence initial={false}>
                {sortedReviews.length === 0 ? (
                  <div className="text-center py-12 text-black">
                    <MessageSquare className="w-8 h-8 text-[#c71f2c] mx-auto mb-3" />
                    <p className="text-sm font-semibold">No custom reviews posted for this luxury artifact yet.</p>
                  </div>
                ) : (
                  sortedReviews.map((rev) => (
                    <motion.div
                      layout
                      key={rev.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.4 }}
                      className="p-6 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col gap-4"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-white border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                            {rev.userAvatar ? (
                              <img 
                                src={rev.userAvatar} 
                                alt={rev.userName} 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <User className="w-4 h-4 text-black" />
                            )}
                          </div>
                          <div>
                            <h4 className="text-sm font-sans font-bold text-black">{rev.userName}</h4>
                            <p className="text-[10px] text-black font-semibold font-mono mt-0.5">{rev.date}</p>
                          </div>
                        </div>

                        {/* Stars */}
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-3.5 h-3.5 ${star <= rev.rating ? 'text-gold fill-gold' : 'text-slate-200'}`} 
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-black font-semibold text-sm leading-relaxed whitespace-pre-wrap pl-1 sm:pl-[56px]">
                        "{rev.comment}"
                      </p>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
