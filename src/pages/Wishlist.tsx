import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingBag, Trash2, ArrowRight, ShoppingCart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../lib/utils';

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product: any) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
  };

  return (
    <div className="pt-32 min-h-screen bg-background pb-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white uppercase tracking-tighter">My Wishlist</h1>
            <p className="text-gray-500 mt-2 font-light">Saved masterworks for your future collection</p>
          </motion.div>
          <Link to="/shop">
            <Button variant="ghost" className="text-gold hover:text-white uppercase tracking-widest text-[10px] font-bold h-12">
              Continue Exploring <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        {wishlist.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-luxury-dark/40 backdrop-blur-md rounded-[40px] p-24 border border-white/5 text-center"
          >
            <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-gold/20">
               <Heart className="w-10 h-10 text-gold opacity-50" />
            </div>
            <h2 className="text-2xl font-serif text-white mb-4 italic">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-10 max-w-sm mx-auto font-light">As you explore our curated collection, save the pieces that speak to you most.</p>
            <Link to="/shop">
               <Button className="bg-white text-black hover:bg-gold hover:text-black px-10 h-14 rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-2xl transition-all">
                  Go to Gallery
               </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {wishlist.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative bg-luxury-dark/40 backdrop-blur-md rounded-[30px] overflow-hidden border border-white/5 hover:border-gold/30 transition-all duration-500"
                >
                  <div className="aspect-[4/5] overflow-hidden relative">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 z-20">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => removeFromWishlist(product.id)}
                        className="bg-black/60 backdrop-blur-md text-white hover:text-red-500 rounded-full w-10 h-10"
                      >
                         <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-serif text-white mb-1">{product.name}</h3>
                        <p className="text-[10px] uppercase tracking-widest text-gold font-bold">{product.category}</p>
                      </div>
                      <p className="text-lg font-mono text-white">{formatCurrency(product.price)}</p>
                    </div>
                    
                    <Button 
                      onClick={() => handleMoveToCart(product)}
                      className="w-full bg-white/5 hover:bg-white text-white hover:text-black border border-white/10 hover:border-white transition-all font-bold uppercase tracking-widest text-[10px] h-12 rounded-xl"
                    >
                      <ShoppingCart className="w-3 h-3 mr-2" /> Move to Cart
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
