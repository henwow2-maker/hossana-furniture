import React from 'react';
import { Product } from '../types';
import { Star, ShoppingCart, Heart, Sparkles, ArrowLeftRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { cn, formatCurrency } from '../lib/utils';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';

export interface ProductCardProps {
  product: Product;
  key?: React.Key;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  
  const isFavorite = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const toggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCompared) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const discountedPrice = product.discount 
    ? product.price * (1 - product.discount / 100) 
    : product.price;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10, y: 15, scale: 0.98 }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      whileHover={{ 
        y: -4,
        boxShadow: "0px 12px 24px -8px rgba(0, 0, 0, 0.08), 0px 4px 12px -4px rgba(0, 0, 0, 0.03)",
      }}
      transition={{ 
        type: "spring",
        stiffness: 150,
        damping: 20,
        opacity: { duration: 0.4 }
      }}
      viewport={{ once: true, margin: "-50px" }}
      className="group relative bg-[#ffffff] rounded-xl border border-slate-200/80 overflow-hidden transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-50 border-b border-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        
        {/* Soft shadow depth under images for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-30 pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.discount && (
            <Badge className="bg-[#c71f2c] text-white border-none px-2 py-0.5 font-bold text-[8px] uppercase tracking-wider rounded-md shadow-sm">
              {product.discount}% OFF
            </Badge>
          )}
          {product.isBestSeller && (
            <Badge className="bg-[#1e293b] text-white border-none px-2 py-0.5 font-bold text-[8px] uppercase tracking-wider rounded-md shadow-sm flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 fill-current text-yellow-400" /> Best
            </Badge>
          )}
        </div>

        {/* Compare Button */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={cn(
            "absolute top-2.5 right-12 z-20 transition-all duration-300 md:opacity-0 md:translate-x-2 md:group-hover:opacity-100 md:group-hover:translate-x-0",
            isCompared && "opacity-100 translate-x-0"
          )}
        >
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleCompare}
            className={cn(
              "bg-white/95 backdrop-blur-sm border border-slate-200 text-slate-700 hover:bg-[#1e293b] hover:text-white transition-all rounded-full w-8 h-8 shadow-sm",
              isCompared && "bg-[#1e293b] text-white border-[#1e293b] shadow-[0_0_10px_rgba(30,41,59,0.3)] hover:bg-[#0f172a] hover:border-[#0f172a]"
            )}
            title={isCompared ? "Remove from Compare" : "Add to Compare"}
          >
            <ArrowLeftRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </Button>
        </motion.div>

        {/* Favorite Button */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={cn(
            "absolute top-2.5 right-2.5 z-20 transition-all duration-300 md:opacity-0 md:translate-x-2 md:group-hover:opacity-100 md:group-hover:translate-x-0",
            isFavorite && "opacity-100 translate-x-0"
          )}
        >
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleWishlist}
            className={cn(
              "bg-white/95 backdrop-blur-sm border border-slate-200 text-slate-700 hover:bg-[#c71f2c] hover:text-white transition-all rounded-full w-8 h-8 shadow-sm",
              isFavorite && "bg-[#c71f2c] text-white border-[#c71f2c] shadow-[0_0_10px_rgba(199,31,44,0.3)] hover:bg-[#a51521] hover:border-[#a51521]"
            )}
          >
            <Heart className={cn("w-3.5 h-3.5 stroke-[2.5]", isFavorite && "fill-current")} />
          </Button>
        </motion.div>

        {/* Quick Add Overlay */}
        <div className="hidden md:block absolute inset-x-0 bottom-0 p-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20">
           <motion.div
             whileHover={{ scale: 1.01 }}
             whileTap={{ scale: 0.99 }}
           >
             <Button 
               onClick={(e) => {
                 e.preventDefault();
                 e.stopPropagation();
                 addToCart(product, 1);
               }}
               className="w-full bg-[#1e293b] text-white hover:bg-[#c71f2c] transition-all font-bold uppercase tracking-wider text-[9px] h-8 rounded-lg shadow-md flex items-center justify-center gap-1.5 border-none"
             >
                 <ShoppingCart className="w-3 h-3 stroke-[2.5]" /> Quick Add
              </Button>
           </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col gap-1.5 bg-white">
        <div className="flex justify-between items-start gap-2">
          <Link to={`/product/${product.id}`} className="flex-grow">
            <h3 className="text-xs font-sans font-bold text-black group-hover:text-[#c71f2c] transition-colors leading-tight tracking-tight line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-0.5 bg-slate-100 px-1.5 py-0.5 rounded shrink-0 border border-slate-200/50">
            <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
            <span className="text-[8px] font-bold text-black tracking-tight">{product.rating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-sans font-extrabold text-[#c71f2c] tracking-tight">
            {formatCurrency(discountedPrice)}
          </span>
          {product.discount && (
            <span className="text-slate-400 text-[10px] line-through">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>

        {/* Mobile-Only Direct Quick Add Button */}
        <div className="block md:hidden mt-1 pt-1 border-t border-slate-100">
          <Button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product, 1);
            }}
            className="w-full bg-[#1e293b] text-white hover:bg-[#c71f2c] transition-all font-bold uppercase tracking-wider text-[8.5px] h-8 rounded-lg flex items-center justify-center gap-1.5 border-none"
          >
            <ShoppingCart className="w-3 h-3 stroke-[2.5]" /> Quick Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
