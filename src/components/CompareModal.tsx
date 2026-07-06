import React from 'react';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingCart, Star, Heart, Check, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useWishlist } from '../context/WishlistContext';
import { cn } from '../lib/utils';

export default function CompareModal() {
  const { 
    compareList, 
    removeFromCompare, 
    clearCompareList, 
    isCompareModalOpen, 
    setCompareModalOpen 
  } = useCompare();

  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();

  if (!isCompareModalOpen) return null;

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
  };

  const handleWishlistToggle = (product: any) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-10 overflow-y-auto">
        {/* Backdrop overlay closer click */}
        <div className="absolute inset-0 cursor-default" onClick={() => setCompareModalOpen(false)} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-6xl bg-white text-black rounded-3xl shadow-2xl z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-slate-50 rounded-t-3xl">
            <div>
              <h2 className="text-2xl font-serif font-black uppercase tracking-tight text-slate-900">
                Product Comparison
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Comparing {compareList.length} luxury item{compareList.length !== 1 && 's'} side-by-side
              </p>
            </div>
            <div className="flex items-center gap-4">
              {compareList.length > 0 && (
                <Button
                  variant="ghost"
                  onClick={clearCompareList}
                  className="text-xs font-bold text-[#c71f2c] hover:bg-rose-50 hover:text-[#c71f2c] uppercase tracking-wider h-9 px-4 rounded-xl"
                >
                  Clear All
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCompareModalOpen(false)}
                className="text-slate-400 hover:text-black hover:bg-slate-100 transition-colors rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Modal body */}
          <div className="flex-grow overflow-auto p-6 md:p-8 custom-scrollbar">
            {compareList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <div className="w-16 h-16 rounded-3xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-6 font-semibold">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">No items to compare</h3>
                <p className="text-slate-500 text-sm max-w-sm mb-6">
                  Select products from our catalog or landing page to see them compared head-to-head here.
                </p>
                <Button
                  onClick={() => setCompareModalOpen(false)}
                  className="bg-[#1e293b] hover:bg-[#c71f2c] text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest transition-all shadow"
                >
                  Continue Browsing
                </Button>
              </div>
            ) : (
              <div className="min-w-[600px] lg:min-w-0">
                <div className="grid grid-cols-[180px_1fr] md:grid-cols-[220px_1fr] gap-6">
                  
                  {/* Left Specs Guide Labels */}
                  <div className="flex flex-col pt-[260px] gap-8 border-r border-slate-100 pr-4 sticky left-0 bg-white z-[5]">
                    <div className="h-12 flex items-center">
                      <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Price</span>
                    </div>
                    <div className="h-8 flex items-center">
                      <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Rating</span>
                    </div>
                    <div className="h-8 flex items-center">
                      <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Category</span>
                    </div>
                    <div className="h-8 flex items-center">
                      <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Collection / Material</span>
                    </div>
                    <div className="h-8 flex items-center">
                      <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Dimensions</span>
                    </div>
                    <div className="h-10 flex items-center">
                      <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Availability</span>
                    </div>
                    <div className="min-h-[60px] flex items-start pt-1">
                      <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Finishes/Colors</span>
                    </div>
                    <div className="min-h-[100px] flex items-start pt-1">
                      <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Key Features</span>
                    </div>
                    <div className="min-h-[80px] flex items-start pt-1">
                      <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Description</span>
                    </div>
                  </div>

                  {/* Compared products display */}
                  <div className={`grid gap-6`} style={{ gridTemplateColumns: `repeat(${compareList.length}, minmax(0, 1fr))` }}>
                    {compareList.map((product) => {
                      const isFavorited = isInWishlist(product.id);
                      const finalPrice = product.discount 
                        ? product.price * (1 - product.discount / 100) 
                        : product.price;

                      return (
                        <div key={product.id} className="flex flex-col border border-slate-100 rounded-2xl p-4 bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all duration-300">
                          {/* Top Product Hero info */}
                          <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 mb-4 group/img border border-slate-200/50">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                              referrerPolicy="no-referrer"
                            />
                            
                            {/* Actions on Image Corner */}
                            <button
                              onClick={() => removeFromCompare(product.id)}
                              className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm z-10"
                              title="Remove item"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="h-[75px] flex flex-col gap-1 mb-4">
                            <h4 className="text-xs font-black font-sans leading-tight line-clamp-2 text-slate-900 group-hover:text-[#c71f2c] transition-colors">
                              {product.name}
                            </h4>
                            <span className="text-[10px] uppercase font-bold text-slate-400">{product.category}</span>
                          </div>

                          {/* Data grids */}
                          <div className="flex flex-col gap-8 text-xs text-slate-700">
                            
                            {/* Price */}
                            <div className="h-12 flex flex-col justify-center">
                              <span className="text-base font-extrabold text-[#c71f2c]">{formatCurrency(finalPrice)}</span>
                              {product.discount && (
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-[10px] line-through text-slate-400">{formatCurrency(product.price)}</span>
                                  <span className="text-[9px] font-bold text-white bg-red-600 px-1 py-0.2 rounded font-sans scale-90">{product.discount}% OFF</span>
                                </div>
                              )}
                            </div>

                            {/* Rating */}
                            <div className="h-8 flex items-center gap-1">
                              <div className="flex items-center text-amber-500">
                                <Star className="w-4 h-4 fill-current mr-1" />
                                <span className="font-bold text-[#1e293b]">{product.rating.toFixed(1)}</span>
                              </div>
                            </div>

                            {/* Category */}
                            <div className="h-8 flex items-center text-slate-900 font-bold capitalize">
                              {product.category}
                            </div>

                            {/* Material */}
                            <div className="h-8 flex items-center text-slate-900 font-medium">
                              {product.material || 'Solid Hardwood & Textile'}
                            </div>

                            {/* Dimensions */}
                            <div className="h-8 flex items-center text-slate-500 font-mono text-[11px] leading-tight">
                              {product.dimensions || '75cm H x 120cm W x 80cm D'}
                            </div>

                            {/* Stock Status */}
                            <div className="h-10 flex items-center">
                              {product.inStock !== false ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                                  <Check className="w-3.5 h-3.5 stroke-[3]" /> In Stock / Ready to Ship
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                                  Sold Out
                                </span>
                              )}
                            </div>

                            {/* Colors */}
                            <div className="min-h-[60px] flex flex-wrap gap-1.5 items-start mt-1">
                              {product.colors && product.colors.length > 0 ? (
                                product.colors.map((color: string, i: number) => (
                                  <span key={i} className="text-[9px] bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-800 font-medium">
                                    {color}
                                  </span>
                                ))
                              ) : (
                                <span className="text-[9px] text-slate-400 italic">Warm Sand, Earth Grey</span>
                              )}
                            </div>

                            {/* Features */}
                            <div className="min-h-[100px] flex flex-col gap-1 items-start mt-1">
                              {product.features && product.features.length > 0 ? (
                                product.features.map((feature: string, i: number) => (
                                  <div key={i} className="flex items-start gap-1.5 text-[10px] text-slate-600 line-clamp-2">
                                    <span className="text-[#c71f2c] font-bold shrink-0">•</span>
                                    <span>{feature}</span>
                                  </div>
                                ))
                              ) : (
                                <div className="text-[10px] text-slate-500">
                                  • Traditional joinery details<br />
                                  • Heavy oil finish protection<br />
                                  • Signature modern outline
                                </div>
                              )}
                            </div>

                            {/* Description */}
                            <div className="min-h-[80px] text-[10px] text-slate-500 tracking-tight leading-relaxed italic line-clamp-4 mt-1">
                              {product.description}
                            </div>

                            {/* Column action buttons */}
                            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col xl:flex-row gap-2">
                              <Button
                                onClick={() => handleAddToCart(product)}
                                className="flex-1 bg-slate-900 text-white hover:bg-[#c71f2c] h-10 text-[10px] uppercase tracking-wider font-extrabold rounded-xl border-none"
                              >
                                <ShoppingCart className="w-3.5 h-3.5 mr-1.5" /> Add To Cart
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => handleWishlistToggle(product)}
                                className={cn(
                                  "border-slate-200 h-10 w-full xl:w-10 rounded-xl p-0 hover:bg-rose-50 hover:text-[#c71f2c] transition-colors",
                                  isFavorited && "bg-rose-50 border-rose-200 text-[#c71f2c]"
                                )}
                              >
                                <Heart className={cn("w-4 h-4", isFavorited && "fill-current")} />
                              </Button>
                            </div>

                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
